# How to Use the UUID Module in PubNub Functions 2.0

The `uuid` module in PubNub Functions provides UUID (Universally Unique Identifier) generation and validation capabilities. This is essential for creating unique identifiers for users, sessions, messages, and other entities in your real-time applications.

## Requiring the UUID Module

To use the `uuid` module, you first need to require it in your Function. You can import specific functions or the entire module:

```javascript
// Import specific functions (recommended)
const { v4, v3, v5, validate, version } = require('uuid');

// Or import the entire module
const uuid = require('uuid');
```

## Available Functions

### 1. `v4()` - Random UUID Generation

Generates a random UUID (version 4). This is the most commonly used function for creating unique identifiers.

*   **Returns:** A random UUID string (e.g., `"123e4567-e89b-12d3-a456-426614174000"`)

```javascript
export default async (request) => {
  const { v4 } = require('uuid');
  const db = require('kvstore');
  
  try {
    // Generate unique session ID
    const sessionId = v4();
    
    // Store session data
    await db.set(`session:${sessionId}`, {
      userId: request.message.userId,
      createdAt: new Date().toISOString(),
      lastActivity: Date.now(),
      sessionId: sessionId
    }, 1440); // 24 hour TTL
    
    // Add session ID to message
    request.message.sessionId = sessionId;
    
    console.log(`Created new session: ${sessionId}`);
    return request.ok();
  } catch (error) {
    console.error('UUID generation error:', error);
    return request.abort();
  }
};
```

### 2. `v3(name, namespace)` - Name-based UUID (MD5)

Generates a deterministic UUID based on a name and namespace using MD5 hashing. The same inputs will always produce the same UUID.

*   `name` (String): The name to hash
*   `namespace` (String): A namespace UUID
*   **Returns:** A deterministic UUID string

```javascript
export default async (request) => {
  const { v3, v4 } = require('uuid');
  
  try {
    // Create namespace UUID for your application
    const APP_NAMESPACE = v4(); // In practice, use a fixed UUID for your app
    
    const userId = request.message.userId;
    const roomName = request.message.roomName;
    
    // Generate deterministic room ID based on name
    const roomId = v3(roomName, APP_NAMESPACE);
    
    // Generate deterministic user-room combination ID
    const userRoomId = v3(`${userId}:${roomName}`, APP_NAMESPACE);
    
    request.message.roomId = roomId;
    request.message.userRoomId = userRoomId;
    
    console.log(`Room ID for "${roomName}": ${roomId}`);
    return request.ok();
  } catch (error) {
    console.error('UUID v3 generation error:', error);
    return request.abort();
  }
};
```

### 3. `v5(name, namespace)` - Name-based UUID (SHA-1)

Similar to `v3()` but uses SHA-1 hashing instead of MD5. Provides better security than v3.

*   `name` (String): The name to hash
*   `namespace` (String): A namespace UUID
*   **Returns:** A deterministic UUID string

```javascript
export default async (request) => {
  const { v5 } = require('uuid');
  
  try {
    // Fixed namespace for your application (store this in vault for consistency)
    const APP_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
    
    const userEmail = request.message.userEmail;
    
    // Generate consistent user ID based on email
    const consistentUserId = v5(userEmail.toLowerCase(), APP_NAMESPACE);
    
    request.message.consistentUserId = consistentUserId;
    
    console.log(`Consistent ID for ${userEmail}: ${consistentUserId}`);
    return request.ok();
  } catch (error) {
    console.error('UUID v5 generation error:', error);
    return request.abort();
  }
};
```

### 4. `validate(uuid)` - UUID Validation

Validates whether a string is a properly formatted UUID.

*   `uuid` (String): The UUID string to validate
*   **Returns:** Boolean (true if valid, false otherwise)

```javascript
export default async (request, response) => {
  const { validate } = require('uuid');
  
  try {
    const providedId = request.params.id;
    
    if (!validate(providedId)) {
      return response.send({ 
        error: "Invalid UUID format",
        provided: providedId 
      }, 400);
    }
    
    // Process valid UUID
    console.log(`Valid UUID provided: ${providedId}`);
    
    // Continue with business logic...
    return response.send({ 
      message: "UUID is valid",
      id: providedId 
    }, 200);
    
  } catch (error) {
    console.error('UUID validation error:', error);
    return response.send({ error: "Validation failed" }, 500);
  }
};
```

### 5. `version(uuid)` - UUID Version Detection

Determines the version (1-5) of a given UUID string.

*   `uuid` (String): The UUID string to analyze
*   **Returns:** Number (1-5) representing the UUID version

```javascript
export default async (request) => {
  const { validate, version } = require('uuid');
  const pubnub = require('pubnub');
  
  try {
    const messageId = request.message.messageId;
    
    if (validate(messageId)) {
      const uuidVersion = version(messageId);
      
      // Log UUID analytics
      await pubnub.fire({
        channel: 'uuid_analytics',
        message: {
          type: 'uuid_version_detected',
          version: uuidVersion,
          messageId: messageId,
          timestamp: Date.now()
        }
      });
      
      request.message.uuidVersion = uuidVersion;
      console.log(`Message ID ${messageId} is UUID version ${uuidVersion}`);
    } else {
      console.log(`Invalid UUID format: ${messageId}`);
      request.message.invalidUuid = true;
    }
    
    return request.ok();
  } catch (error) {
    console.error('UUID version detection error:', error);
    return request.ok(); // Don't block processing
  }
};
```

## Practical Examples

### Example 1: User Session Management

```javascript
export default async (request, response) => {
  const { v4, validate } = require('uuid');
  const db = require('kvstore');
  
  try {
    const action = request.query.action;
    const sessionToken = request.headers.authorization?.replace('Bearer ', '');
    
    switch (action) {
      case 'create':
        // Create new session
        const newSessionId = v4();
        const sessionData = {
          userId: request.body.userId,
          deviceId: request.body.deviceId || v4(),
          createdAt: new Date().toISOString(),
          lastActivity: Date.now(),
          userAgent: request.headers['user-agent'],
          ipAddress: request.headers['x-forwarded-for'] || 'unknown'
        };
        
        // Store session with 7-day TTL
        await db.set(`session:${newSessionId}`, sessionData, 10080);
        
        // Track active sessions
        await db.incrCounter('total_sessions_created');
        await db.incrCounter(`sessions_today:${new Date().toISOString().split('T')[0]}`);
        
        return response.send({
          sessionId: newSessionId,
          deviceId: sessionData.deviceId,
          expiresIn: '7 days'
        }, 201);
        
      case 'validate':
        if (!sessionToken || !validate(sessionToken)) {
          return response.send({ error: 'Invalid session token format' }, 400);
        }
        
        const session = await db.get(`session:${sessionToken}`);
        if (!session) {
          return response.send({ error: 'Session not found or expired' }, 404);
        }
        
        // Update last activity
        session.lastActivity = Date.now();
        await db.set(`session:${sessionToken}`, session, 10080);
        
        return response.send({
          valid: true,
          userId: session.userId,
          deviceId: session.deviceId,
          lastActivity: session.lastActivity
        }, 200);
        
      case 'revoke':
        if (sessionToken && validate(sessionToken)) {
          await db.removeItem(`session:${sessionToken}`);
          await db.incrCounter('sessions_revoked');
        }
        
        return response.send({ message: 'Session revoked' }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
    
  } catch (error) {
    console.error('Session management error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 2: Message Tracking and Deduplication

```javascript
export default async (request) => {
  const { v4, validate } = require('uuid');
  const db = require('kvstore');
  
  try {
    // Ensure message has a unique ID
    if (!request.message.messageId) {
      request.message.messageId = v4();
      request.message.generatedId = true;
    } else if (!validate(request.message.messageId)) {
      console.log('Invalid message ID format, generating new one');
      request.message.messageId = v4();
      request.message.regeneratedId = true;
    }
    
    const messageId = request.message.messageId;
    
    // Check for duplicate messages (last 10 minutes)
    const duplicateCheck = await db.get(`processed_message:${messageId}`);
    if (duplicateCheck) {
      console.log(`Duplicate message detected: ${messageId}`);
      
      // Update duplicate counter
      await db.incrCounter(`duplicate_message_count`);
      
      request.message.isDuplicate = true;
      request.message.originalTimestamp = duplicateCheck.timestamp;
      return request.ok();
    }
    
    // Mark message as processed
    await db.set(`processed_message:${messageId}`, {
      timestamp: Date.now(),
      channel: request.channels[0],
      userId: request.message.userId
    }, 10); // 10 minute TTL
    
    // Generate correlation ID for message tracing
    request.message.correlationId = v4();
    
    // Add processing metadata
    request.message.processedAt = new Date().toISOString();
    request.message.processingId = v4();
    
    console.log(`Processing message ${messageId} with correlation ${request.message.correlationId}`);
    return request.ok();
    
  } catch (error) {
    console.error('Message tracking error:', error);
    return request.ok(); // Don't block message processing
  }
};
```

### Example 3: Distributed Task Management

```javascript
export default async (request, response) => {
  const { v4, validate } = require('uuid');
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    const action = request.query.action;
    
    switch (action) {
      case 'create_task':
        // Create a new distributed task
        const taskId = v4();
        const workerId = v4();
        
        const task = {
          id: taskId,
          type: request.body.taskType,
          data: request.body.taskData,
          priority: request.body.priority || 'normal',
          createdAt: Date.now(),
          status: 'pending',
          workerId: null,
          attempts: 0,
          maxAttempts: 3
        };
        
        // Store task
        await db.set(`task:${taskId}`, task, 1440); // 24 hour TTL
        
        // Add to task queue
        await db.incrCounter('total_tasks_created');
        
        // Notify workers
        await pubnub.fire({
          channel: 'task_queue',
          message: {
            type: 'new_task',
            taskId: taskId,
            priority: task.priority,
            timestamp: Date.now()
          }
        });
        
        return response.send({
          taskId: taskId,
          status: 'created',
          workerId: workerId
        }, 201);
        
      case 'claim_task':
        const claimTaskId = request.body.taskId;
        const claimWorkerId = request.body.workerId;
        
        if (!validate(claimTaskId) || !validate(claimWorkerId)) {
          return response.send({ error: 'Invalid UUID format' }, 400);
        }
        
        const claimTask = await db.get(`task:${claimTaskId}`);
        if (!claimTask) {
          return response.send({ error: 'Task not found' }, 404);
        }
        
        if (claimTask.status !== 'pending') {
          return response.send({ error: 'Task already claimed or completed' }, 409);
        }
        
        // Claim the task
        claimTask.status = 'in_progress';
        claimTask.workerId = claimWorkerId;
        claimTask.claimedAt = Date.now();
        claimTask.attempts += 1;
        
        await db.set(`task:${claimTaskId}`, claimTask, 1440);
        
        return response.send({
          taskId: claimTaskId,
          workerId: claimWorkerId,
          status: 'claimed',
          taskData: claimTask.data
        }, 200);
        
      case 'complete_task':
        const completeTaskId = request.body.taskId;
        const completeWorkerId = request.body.workerId;
        const result = request.body.result;
        
        if (!validate(completeTaskId) || !validate(completeWorkerId)) {
          return response.send({ error: 'Invalid UUID format' }, 400);
        }
        
        const completeTask = await db.get(`task:${completeTaskId}`);
        if (!completeTask) {
          return response.send({ error: 'Task not found' }, 404);
        }
        
        if (completeTask.workerId !== completeWorkerId) {
          return response.send({ error: 'Unauthorized: task claimed by different worker' }, 403);
        }
        
        // Complete the task
        completeTask.status = 'completed';
        completeTask.completedAt = Date.now();
        completeTask.result = result;
        completeTask.duration = completeTask.completedAt - completeTask.claimedAt;
        
        await db.set(`task:${completeTaskId}`, completeTask, 1440);
        await db.incrCounter('total_tasks_completed');
        
        // Notify task completion
        await pubnub.publish({
          channel: `task_results:${completeTaskId}`,
          message: {
            taskId: completeTaskId,
            status: 'completed',
            result: result,
            duration: completeTask.duration
          }
        });
        
        return response.send({
          taskId: completeTaskId,
          status: 'completed',
          duration: completeTask.duration
        }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
    
  } catch (error) {
    console.error('Task management error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 4: Namespace-based Resource Management

```javascript
export default async (request) => {
  const { v5, validate } = require('uuid');
  const vault = require('vault');
  
  try {
    // Get application namespace from vault
    const appNamespace = await vault.get("app_namespace_uuid");
    if (!appNamespace || !validate(appNamespace)) {
      console.error("Invalid or missing application namespace UUID");
      return request.abort();
    }
    
    const organizationId = request.message.organizationId;
    const projectName = request.message.projectName;
    const resourceType = request.message.resourceType;
    
    // Generate consistent resource IDs based on hierarchy
    const orgResourceId = v5(`org:${organizationId}`, appNamespace);
    const projectResourceId = v5(`project:${organizationId}:${projectName}`, appNamespace);
    const resourceId = v5(`${resourceType}:${organizationId}:${projectName}:${request.message.resourceName}`, appNamespace);
    
    // Add resource hierarchy to message
    request.message.resourceHierarchy = {
      organization: {
        id: organizationId,
        resourceId: orgResourceId
      },
      project: {
        name: projectName,
        resourceId: projectResourceId
      },
      resource: {
        type: resourceType,
        name: request.message.resourceName,
        resourceId: resourceId
      }
    };
    
    console.log(`Generated resource hierarchy for ${resourceType}:${request.message.resourceName}`);
    console.log(`Resource ID: ${resourceId}`);
    
    return request.ok();
  } catch (error) {
    console.error('Resource ID generation error:', error);
    return request.abort();
  }
};
```

## Best Practices

### 1. **Use v4() for Random IDs**
```javascript
// For session IDs, message IDs, transaction IDs
const sessionId = v4();
const messageId = v4();
const transactionId = v4();
```

### 2. **Use v5() for Deterministic IDs**
```javascript
// For consistent resource identification
const userId = v5(userEmail.toLowerCase(), APP_NAMESPACE);
const roomId = v5(roomName, APP_NAMESPACE);
```

### 3. **Always Validate Input UUIDs**
```javascript
if (!validate(providedUuid)) {
  return response.send({ error: 'Invalid UUID format' }, 400);
}
```

### 4. **Store Namespace UUIDs Securely**
```javascript
// Store in vault for consistency across functions
const appNamespace = await vault.get("app_namespace_uuid");
```

### 5. **Use Meaningful Naming**
```javascript
// Good - descriptive variable names
const sessionId = v4();
const userDeviceId = v4();
const messageTrackingId = v4();

// Avoid - generic names
const id1 = v4();
const uuid = v4();
```

## Important Considerations

*   **Performance:** UUID generation is fast, but avoid generating large numbers in tight loops
*   **Uniqueness:** v4() UUIDs have extremely low collision probability but are not guaranteed unique
*   **Determinism:** v3() and v5() always produce the same output for the same inputs
*   **Storage:** UUIDs are 36-character strings; consider storage implications for large datasets
*   **Security:** Don't use UUIDs as security tokens; they're identifiers, not secrets
*   **Validation:** Always validate UUIDs received from external sources

The UUID module is essential for creating unique identifiers in distributed real-time applications, enabling proper tracking, deduplication, and resource management across your PubNub Functions.