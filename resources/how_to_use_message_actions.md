# How to Use Message Actions with PubNub

> **🔑 Feature Enablement Required**
> 
> To use Message Actions, you must first enable Message Persistence in your PubNub Admin Portal:
> 1. Navigate to your keyset settings
> 2. Enable the **Message Persistence** add-on
> 3. Configure retention period as needed
> 
> Message Actions are automatically available once Message Persistence is enabled. Without Message Persistence, Message Actions cannot be used.

PubNub's Message Actions feature allows you to attach metadata to published messages without modifying the original message content. This is perfect for implementing features like reactions, read receipts, message status updates, or any scenario where you need to add contextual information to existing messages.

## Overview

*   **Non-destructive Metadata:** Message Actions add metadata to messages without altering the original message content stored in Message Persistence.
*   **Flexible Use Cases:** Common implementations include emoji reactions, delivery confirmations, read receipts, message flagging, or custom business logic markers.
*   **Requires Message Persistence:** Message Actions can only be added to messages that are stored in PubNub's Message Persistence (History). The target message must exist in storage.

## Enabling Message Actions

**Prerequisites:**
1.  **Message Persistence must be enabled** for your keyset in the PubNub Admin Portal (see Message Persistence documentation).
2.  Message Actions are automatically available once Message Persistence is enabled - no additional add-on configuration required.

**Important:** You cannot add Message Actions to messages that were published with `storeInHistory: false` or to channels without Message Persistence enabled.

## How Message Actions Work

*   **Action Structure:** Each Message Action consists of:
    *   `type` (String): Category or feature name (e.g., "reaction", "status", "deleted")
    *   `value` (String): Specific value within that type (e.g., "👍", "delivered", "true")
    *   `messageTimetoken` (String): The timetoken of the target message
    *   `actionTimetoken` (String): When the action was added (automatically generated)
    *   `uuid` (String): Who added the action (from your PubNub client configuration)

*   **Multiple Actions:** A single message can have multiple actions of different types or values.
*   **Action Events:** When actions are added or removed, PubNub can deliver real-time events to subscribers.

## Adding Message Actions

Use the `addMessageAction()` method to attach an action to an existing message:

**JavaScript SDK Example:**
```javascript
try {
    const result = await pubnub.addMessageAction({
        channel: 'chat-channel',
        messageTimetoken: '17496879621552092', // Timetoken of target message
        action: {
            type: 'reaction',
            value: '👍'
        }
    });
    console.log('Action added:', result);
} catch (error) {
    console.error('Failed to add action:', error);
}
```

**Common Action Types:**
*   **Reactions:** `{type: 'reaction', value: '👍'}` or `{type: 'reaction', value: '❤️'}`
*   **Status Updates:** `{type: 'status', value: 'delivered'}` or `{type: 'status', value: 'read'}`
*   **Soft Deletion:** `{type: 'deleted', value: 'true'}`
*   **Custom Metadata:** `{type: 'priority', value: 'high'}` or `{type: 'category', value: 'urgent'}`

## Removing Message Actions

Remove specific actions using the `removeMessageAction()` method:

```javascript
try {
    await pubnub.removeMessageAction({
        channel: 'chat-channel',
        messageTimetoken: '17496879621552092',
        actionTimetoken: '17496880053566820' // Timetoken when action was added
    });
    console.log('Action removed');
} catch (error) {
    console.error('Failed to remove action:', error);
}
```

**Important:** You need both the original message timetoken AND the action timetoken to remove an action.

## Retrieving Message Actions

Fetch all actions for a channel using `getMessageActions()`:

```javascript
try {
    const result = await pubnub.getMessageActions({
        channel: 'chat-channel',
        limit: 100,
        start: 'timetoken', // Optional: pagination
        end: 'timetoken'    // Optional: time range
    });
    
    console.log('Actions found:', result.data.length);
    result.data.forEach(action => {
        console.log(`Message ${action.messageTimetoken}: ${action.type}=${action.value}`);
    });
} catch (error) {
    console.error('Failed to get actions:', error);
}
```

**Pagination:**
*   Use `start` and `end` timetokens to paginate through large action datasets
*   Check `result.more` for additional pagination tokens
*   Actions are returned in chronological order by action timetoken

## Practical Implementation Patterns

### 1. Soft Delete Pattern (Recommended for Content Management)

**Adding a deletion marker:**
```javascript
// Mark message as deleted without removing from history
await pubnub.addMessageAction({
    channel: 'content-channel',
    messageTimetoken: messageTimetoken,
    action: { type: 'deleted', value: 'true' }
});
```

**Filtering deleted content when loading:**
```javascript
// 1. Load all messages from history
const history = await pubnub.history({
    channel: 'content-channel',
    count: 100
});

// 2. Get all deletion actions
const actions = await pubnub.getMessageActions({
    channel: 'content-channel'
});

// 3. Build set of deleted message timetokens
const deletedMessages = new Set();
actions.data.forEach(action => {
    if (action.type === 'deleted' && action.value === 'true') {
        deletedMessages.add(action.messageTimetoken);
    }
});

// 4. Filter out deleted messages
const visibleMessages = history.messages.filter(msg => 
    !deletedMessages.has(msg.timetoken.toString()) // Note: ensure string comparison
);
```

### 2. Message Reactions Pattern

**Adding reactions:**
```javascript
// Add emoji reaction
await pubnub.addMessageAction({
    channel: 'chat-channel',
    messageTimetoken: messageTimetoken,
    action: { type: 'reaction', value: '👍' }
});
```

**Counting reactions:**
```javascript
const actions = await pubnub.getMessageActions({ channel: 'chat-channel' });
const reactionCounts = {};

actions.data.forEach(action => {
    if (action.type === 'reaction') {
        const key = `${action.messageTimetoken}:${action.value}`;
        reactionCounts[key] = (reactionCounts[key] || 0) + 1;
    }
});
```

### 3. Read Receipt Pattern

**Mark message as read:**
```javascript
await pubnub.addMessageAction({
    channel: 'chat-channel',
    messageTimetoken: messageTimetoken,
    action: { type: 'read', value: pubnub.getUUID() } // Who read it
});
```

## Real-time Action Events

Subscribe to action events to receive real-time notifications:

```javascript
pubnub.addListener({
    messageAction: function(actionEvent) {
        console.log('Action event:', actionEvent.event); // 'added' or 'removed'
        console.log('Action type:', actionEvent.data.type);
        console.log('Action value:', actionEvent.data.value);
        console.log('Message timetoken:', actionEvent.data.messageTimetoken);
        console.log('Action timetoken:', actionEvent.data.actionTimetoken);
        console.log('Who did it:', actionEvent.publisher);
    }
});
```

## Important Considerations

**Data Type Consistency:**
*   **Timetoken Comparison:** Message timetokens from history API may be numbers, while action timetokens are always strings. Always convert to strings for comparison:
    ```javascript
    // ✅ Correct
    deletedMessages.has(message.timetoken.toString())
    
    // ❌ Incorrect - may fail
    deletedMessages.has(message.timetoken)
    ```

**Performance:**
*   **Batch Loading:** When filtering large datasets, load all actions once and cache the results rather than checking per message.
*   **Action Limits:** Be mindful of action volume - excessive actions can impact performance.

**Error Handling:**
*   **Missing Messages:** Actions can only be added to messages that exist in Message Persistence.
*   **Invalid Timetokens:** Ensure target message timetokens are valid and exist.
*   **Permission Errors:** Verify your keyset has proper permissions for Message Actions.

**Best Practices:**
*   Use consistent `type` naming conventions across your application
*   Consider action cleanup strategies for old or irrelevant actions
*   Implement proper error handling for action operations
*   Cache action data when possible to reduce API calls

## Comparison with Alternative Approaches

**Message Actions vs. Publishing Delete Messages:**
*   ✅ **Message Actions:** Non-destructive, preserves audit trail, efficient filtering
*   ❌ **Delete Messages:** Creates additional messages, clutters history, harder to manage

**Message Actions vs. Message Editing:**
*   ✅ **Message Actions:** Preserves original content, maintains history integrity
*   ❌ **Message Editing:** PubNub doesn't support message modification, requires workarounds

Message Actions provide a clean, efficient way to add metadata to messages while preserving the integrity of your message history and enabling powerful filtering and management capabilities.