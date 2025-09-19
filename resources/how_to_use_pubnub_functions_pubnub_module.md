# How to Use the PubNub Module in PubNub Functions 2.0

The `pubnub` module within PubNub Functions allows your serverless code to interact with the PubNub Realtime Network directly. This enables you to publish messages, fire signals, send lightweight signals, manage files, interact with App Context (Objects), and more, all from within your Function code.

## Requiring the PubNub Module

To use the `pubnub` module, you first need to require it in your Function:

```javascript
const pubnub = require('pubnub');
```

The instance of the `pubnub` module provided within Functions is pre-configured with the publish and subscribe keys of the keyset the Function belongs to. You do not need to initialize it manually with keys.

## Core Messaging Methods

All methods of the `pubnub` module that perform network operations return Promises. Therefore, you should always use `async/await` with `try/catch` for error handling.

### 1. `pubnub.publish(params)`

Sends a message to a specified channel. This behaves like a regular PubNub publish from a client – it will deliver to any subscribers on that channel and trigger any Functions listening on that channel.

*   `params` (Object):
    *   `channel` (String): The channel to publish the message to.
    *   `message` (Any): The payload to publish. **Must be a JSON-serializable object** to trigger other Functions.
    *   `storeInHistory` (Boolean, optional): Whether to store in Message Persistence (default: `true`).
    *   `meta` (Object, optional): Arbitrary metadata (not end-to-end encrypted).
    *   `ttl` (Number, optional): Time-to-live for mobile push notifications.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    // Basic publish
    const result = await pubnub.publish({
      channel: "alerts_channel",
      message: { 
        alert: "System critical", 
        details: "Database connection lost", 
        severity: "high",
        timestamp: Date.now()
      }
    });
    console.log('Publish successful, timetoken:', result.timetoken);

    // Publish with metadata
    await pubnub.publish({
      channel: "user_activity",
      message: { 
        userId: request.message.userId,
        action: "login",
        timestamp: Date.now()
      },
      meta: {
        source: "function_processor",
        region: "us-east-1"
      }
    });

    return request.ok();
  } catch (error) {
    console.error('Publish failed:', error);
    return request.abort();
  }
};
```

### 2. `pubnub.fire(params)`

Sends a message to a channel without storing it in history, regardless of Message Persistence settings. Fire events trigger Functions listening on the channel but are **not delivered to real-time subscribers**. This is perfect for server-side processing and analytics.

*   `params` (Object):
    *   `channel` (String): The channel to fire the message to.
    *   `message` (Any): The payload (must be JSON-serializable to trigger Functions).
    *   `meta` (Object, optional): Metadata.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  const db = require('kvstore');
  
  try {
    // Process user action and fire analytics event
    const userId = request.message.userId;
    const action = request.message.action;
    
    // Update user statistics
    await db.incrCounter(`user_actions:${userId}:${action}`);
    
    // Fire analytics event (won't go to subscribers, only to analytics Functions)
    await pubnub.fire({
      channel: "analytics_stream",
      message: {
        type: "user_action",
        userId: userId,
        action: action,
        timestamp: Date.now(),
        sessionId: request.message.sessionId
      }
    });

    return request.ok();
  } catch (error) {
    console.error('Fire failed:', error);
    return request.ok(); // Continue processing even if analytics fails
  }
};
```

### 3. `pubnub.signal(params)`

Sends a small, real-time signal to a channel. Signals are delivered to subscribers, are not stored in history, have a payload limit (typically < 64 bytes after encoding), and are optimized for very low latency.

*   `params` (Object):
    *   `channel` (String): The channel to send the signal to.
    *   `message` (Any): The signal payload (must be small, typically under 64 bytes).

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    // Send typing indicator
    if (request.message.type === 'typing') {
      await pubnub.signal({
        channel: `chat.${request.message.roomId}`,
        message: { 
          u: request.message.userId, // Short key names to save bytes
          t: true // typing: true
        }
      });
    }
    
    // Send lightweight presence update
    if (request.message.type === 'presence_update') {
      await pubnub.signal({
        channel: `presence.${request.message.roomId}`,
        message: {
          u: request.message.userId,
          s: request.message.status // s: status
        }
      });
    }

    return request.ok();
  } catch (error) {
    console.error('Signal failed:', error);
    return request.ok(); // Don't block main message flow
  }
};
```

## File Sharing Integration

### File Management Methods

#### `pubnub.listFiles(params)`

Lists files that have been uploaded to a channel.

*   `params` (Object):
    *   `channel` (String): Channel to list files from.
    *   `limit` (Number, optional): Max number of files to return (default: 100).
    *   `next` (String, optional): Pagination token for next page.

```javascript
export default async (request, response) => {
  const pubnub = require('pubnub');
  
  try {
    const channelId = request.params.channelId;
    
    // List recent files in channel
    const fileListResponse = await pubnub.listFiles({
      channel: `files.${channelId}`,
      limit: 20
    });
    
    const files = fileListResponse.data.map(file => ({
      id: file.id,
      name: file.name,
      size: file.size,
      created: file.created,
      downloadUrl: pubnub.getFileUrl({
        channel: `files.${channelId}`,
        id: file.id,
        name: file.name
      })
    }));
    
    return response.send({ files }, 200);
  } catch (error) {
    console.error('Failed to list files:', error);
    return response.send({ error: 'Failed to retrieve files' }, 500);
  }
};
```

#### `pubnub.getFileUrl(params)`

Constructs a direct download URL for a file. This does not perform an API call; it just generates the URL string.

*   `params` (Object):
    *   `channel` (String): Channel containing the file.
    *   `id` (String): File ID.
    *   `name` (String): File name.

```javascript
// Generate download URL for a file
const downloadUrl = pubnub.getFileUrl({
  channel: 'documents_channel',
  id: 'file-uuid-123',
  name: 'document.pdf'
});
console.log('Download URL:', downloadUrl);
```

#### `pubnub.deleteFile(params)`

Deletes a file from a channel's storage.

*   `params` (Object):
    *   `channel` (String): Channel containing the file.
    *   `id` (String): File ID.
    *   `name` (String): File name.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    // Auto-delete temporary files after processing
    if (request.message.type === 'temp_file_cleanup') {
      const { channel, fileId, fileName } = request.message;
      
      await pubnub.deleteFile({
        channel: channel,
        id: fileId,
        name: fileName
      });
      
      console.log(`Cleaned up temporary file: ${fileName}`);
    }
    
    return request.ok();
  } catch (error) {
    console.error('File cleanup failed:', error);
    return request.ok(); // Don't block other processing
  }
};
```

#### `pubnub.publishFile(params)`

Publishes a file message to notify subscribers about a file.

*   `params` (Object):
    *   `channel` (String): Channel to publish to.
    *   `fileId` (String): ID of the existing file.
    *   `fileName` (String): Name of the file.
    *   `message` (Object, optional): Additional metadata.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    // Notify about processed file
    if (request.message.type === 'file_processed') {
      await pubnub.publishFile({
        channel: `notifications.${request.message.userId}`,
        fileId: request.message.fileId,
        fileName: request.message.fileName,
        message: {
          status: 'processed',
          processingTime: request.message.processingDuration,
          timestamp: Date.now()
        }
      });
    }
    
    return request.ok();
  } catch (error) {
    console.error('File notification failed:', error);
    return request.ok();
  }
};
```

## App Context / Objects Integration

The PubNub module provides access to App Context features for managing user, channel, and membership metadata.

### User (UUID) Metadata

#### `pubnub.objects.setUUIDMetadata(params)`

Set or update metadata for a user UUID.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    if (request.message.type === 'user_profile_update') {
      const userId = request.message.userId;
      
      await pubnub.objects.setUUIDMetadata({
        uuid: userId,
        data: {
          name: request.message.name,
          email: request.message.email,
          profilePicture: request.message.profilePicture,
          lastActive: new Date().toISOString(),
          custom: {
            department: request.message.department,
            role: request.message.role,
            preferences: request.message.preferences
          }
        }
      });
      
      console.log(`Updated profile for user: ${userId}`);
    }
    
    return request.ok();
  } catch (error) {
    console.error('Profile update failed:', error);
    return request.abort();
  }
};
```

#### `pubnub.objects.getUUIDMetadata(params)`

Retrieve metadata for a user UUID.

```javascript
export default async (request, response) => {
  const pubnub = require('pubnub');
  
  try {
    const userId = request.params.userId;
    
    const userMeta = await pubnub.objects.getUUIDMetadata({ 
      uuid: userId,
      include: {
        customFields: true
      }
    });
    
    if (userMeta.data) {
      return response.send({
        user: {
          id: userId,
          name: userMeta.data.name,
          email: userMeta.data.email,
          lastActive: userMeta.data.lastActive,
          ...userMeta.data.custom
        }
      }, 200);
    } else {
      return response.send({ error: 'User not found' }, 404);
    }
  } catch (error) {
    console.error('Failed to get user metadata:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Channel Metadata

#### `pubnub.objects.setChannelMetadata(params)`

Set or update metadata for a channel.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    if (request.message.type === 'channel_setup') {
      const channelId = request.message.channelId;
      
      await pubnub.objects.setChannelMetadata({
        channel: channelId,
        data: {
          name: request.message.channelName,
          description: request.message.description,
          type: request.message.channelType,
          custom: {
            createdBy: request.message.createdBy,
            maxMembers: request.message.maxMembers,
            isPrivate: request.message.isPrivate,
            tags: request.message.tags
          }
        }
      });
      
      console.log(`Channel metadata set for: ${channelId}`);
    }
    
    return request.ok();
  } catch (error) {
    console.error('Channel metadata update failed:', error);
    return request.abort();
  }
};
```

### Membership Management

#### `pubnub.objects.setMemberships(params)`

Manage user memberships in channels.

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    if (request.message.type === 'user_join_channel') {
      const userId = request.message.userId;
      const channelId = request.message.channelId;
      
      await pubnub.objects.setMemberships({
        uuid: userId,
        channels: [
          {
            id: channelId,
            custom: {
              joinedAt: new Date().toISOString(),
              role: request.message.role || 'member',
              notifications: true
            }
          }
        ]
      });
      
      console.log(`User ${userId} joined channel ${channelId}`);
    }
    
    return request.ok();
  } catch (error) {
    console.error('Membership update failed:', error);
    return request.abort();
  }
};
```

## Practical Integration Examples

### Example 1: Message Routing and Notifications

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  const db = require('kvstore');
  
  try {
    const message = request.message;
    const sourceChannel = request.channels[0];
    
    // Route message based on priority
    if (message.priority === 'high') {
      // Send to high-priority channel
      await pubnub.publish({
        channel: 'alerts.high_priority',
        message: {
          ...message,
          routedFrom: sourceChannel,
          routedAt: Date.now()
        }
      });
      
      // Send push notification signal
      await pubnub.signal({
        channel: `notifications.${message.userId}`,
        message: { alert: 1 }
      });
    }
    
    // Fire analytics event
    await pubnub.fire({
      channel: 'message_analytics',
      message: {
        sourceChannel,
        messageType: message.type,
        priority: message.priority,
        size: JSON.stringify(message).length,
        timestamp: Date.now()
      }
    });
    
    return request.ok();
  } catch (error) {
    console.error('Message routing failed:', error);
    return request.ok(); // Don't block original message
  }
};
```

### Example 2: Real-time Dashboard Updates

```javascript
// On Interval Function - runs every 30 seconds
export default async (event) => {
  const pubnub = require('pubnub');
  const db = require('kvstore');
  
  try {
    // Collect system metrics
    const metrics = {
      timestamp: Date.now(),
      activeUsers: await db.getCounter('active_users') || 0,
      totalMessages: await db.getCounter('messages_processed_total') || 0,
      errorCount: await db.getCounter('error_count') || 0,
      systemHealth: 'healthy'
    };
    
    // Calculate rates
    const lastMetrics = await db.get('last_dashboard_metrics');
    if (lastMetrics) {
      const timeDiff = (metrics.timestamp - lastMetrics.timestamp) / 1000; // seconds
      metrics.messageRate = Math.round((metrics.totalMessages - lastMetrics.totalMessages) / timeDiff);
    }
    
    // Store current metrics for next calculation
    await db.set('last_dashboard_metrics', metrics, 5); // 5 minute TTL
    
    // Publish to dashboard channel
    await pubnub.publish({
      channel: 'dashboard.metrics',
      message: metrics
    });
    
    // Send alert if error rate is high
    if (lastMetrics && metrics.errorCount - lastMetrics.errorCount > 10) {
      await pubnub.publish({
        channel: 'dashboard.alerts',
        message: {
          type: 'high_error_rate',
          errorCount: metrics.errorCount,
          timestamp: metrics.timestamp
        }
      });
    }
    
    return event.ok();
  } catch (error) {
    console.error('Dashboard update failed:', error);
    return event.abort();
  }
};
```

### Example 3: Chat System with Presence

```javascript
export default async (request) => {
  const pubnub = require('pubnub');
  
  try {
    const message = request.message;
    const roomId = message.roomId;
    const userId = message.userId;
    
    // Update user presence in room
    if (message.type === 'chat_message') {
      // Update user metadata with last activity
      await pubnub.objects.setUUIDMetadata({
        uuid: userId,
        data: {
          lastActive: new Date().toISOString(),
          currentRoom: roomId,
          custom: {
            lastMessageAt: Date.now()
          }
        }
      });
      
      // Send typing stopped signal
      await pubnub.signal({
        channel: `typing.${roomId}`,
        message: { u: userId, t: false }
      });
      
      // Fire analytics for message
      await pubnub.fire({
        channel: 'chat_analytics',
        message: {
          type: 'message_sent',
          roomId,
          userId,
          messageLength: message.text ? message.text.length : 0,
          timestamp: Date.now()
        }
      });
    }
    
    return request.ok();
  } catch (error) {
    console.error('Chat processing failed:', error);
    return request.ok();
  }
};
```

## Important Considerations and Best Practices

*   **Message Format:** When using `publish()` or `fire()` to trigger other Functions, ensure your message is a JSON object, not a plain string.
*   **Function Chaining Limits:** Functions can only chain up to **3** levels deep to prevent infinite loops.
*   **Operation Limits:** PubNub module operations count toward the 3-operation limit per function execution.
*   **Error Handling:** Always use try/catch blocks and decide whether to `abort()` or `ok()` based on your use case.
*   **Efficiency:** Use `fire()` for server-side processing that doesn't need to reach subscribers.
*   **Signals for Real-time:** Use `signal()` for lightweight, real-time updates like typing indicators or presence.
*   **Security:** The `pubnub` module operates with the permissions of your keyset. Be mindful of what channels your Functions can access.
*   **Debugging:** Use `console.log()` to track PubNub operations, but avoid logging sensitive data.

## Access Manager Integration

When working with Access Manager (PAM), be cautious about using grant operations from Functions. The built-in `pubnub` object may not have secret key permissions for administrative operations. For PAM grants, consider:

1. Using a secure backend service that your Function calls via XHR
2. Storing a Secret Key securely in Vault (use with extreme caution)
3. Designing your permissions structure to minimize the need for dynamic grants

```javascript
// Example: Conditional access checking (conceptual)
export default async (request) => {
  const pubnub = require('pubnub');
  const vault = require('vault');
  
  try {
    // Note: This pattern should be used very carefully
    // Consider calling your own secure backend instead
    const userRole = request.message.userRole;
    
    if (userRole === 'admin') {
      // Only proceed with admin operations for verified admin users
      // Your verification logic here...
      
      // Publish admin notification
      await pubnub.publish({
        channel: `admin.notifications`,
        message: {
          type: 'admin_action',
          action: request.message.action,
          timestamp: Date.now()
        }
      });
    }
    
    return request.ok();
  } catch (error) {
    console.error('Admin operation failed:', error);
    return request.abort();
  }
};
```

The PubNub module within Functions is powerful for building real-time integrations, but always consider security, performance, and the specific use case when designing your Function architecture.