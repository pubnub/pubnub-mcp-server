
# PubNub Presence Best Practices

This guide demonstrates best practices for implementing PubNub Presence functionality in JavaScript. The example shows how to build a real-time user counter that tracks how many users are currently connected to a channel.

## Configuration Prerequisites

### Enable Presence Management for Selected Channels

Before implementing presence functionality, you must configure Presence in your PubNub Admin Dashboard. When setting up your keyset, you'll see presence configuration options:

**Recommended Configuration:**
- Select "**Selected channels only (recommended)**" instead of "All channels"
- This prevents high costs and gives you control over which channels track presence
- You'll configure specific channel rules later in Presence Management. Ensure you do not skip the extra Presence Management step, or presence will not work.

**Why this matters:** Tracking presence on all channels can incur high costs and generate unnecessary events. Using "Selected channels only" allows you to:
- Control costs by only tracking presence where needed
- Reduce network overhead from unused presence events  
- Configure channel-specific presence rules in Presence Management

**Note:** No presence transactions will be captured until you complete the channel configuration in Presence Management, even after enabling presence in your code.

## Best Practices Overview

### 1. Unique User Identification
Always use a unique user ID for each user to ensure accurate presence tracking:

**Why this is important:** Each client needs a unique identifier to be properly tracked in presence events. Without unique IDs, the system cannot distinguish between different users.

### 2. Enable Event Engine for Better Connection Management
Use the Event Engine for improved connection reliability and automatic reconnection:

```javascript
const pubnub = new PubNub({
    publishKey: 'your-publish-key',
    subscribeKey: 'your-subscribe-key',
    userId: generateRandomUserId(),
    enableEventEngine: true  // Best practice for connection management
});
```

**Why this is important:** The Event Engine provides automatic reconnection, better error handling, and more predictable connection states, which are crucial for reliable presence tracking.

### 3. Use Channel-Based Subscriptions with Presence Events
Enable presence events specifically for channels that need user tracking:

```javascript
const channel = pubnub.channel(channelName);
const subscription = channel.subscription({
    receivePresenceEvents: true  // Enable presence event delivery
});
```

**Why this is important:** This approach gives you fine-grained control over which channels receive presence events, reducing unnecessary network traffic and processing.

### 4. Handle Presence Events Properly
Listen for presence events to get real-time updates about user join/leave activities:

```javascript
subscription.onPresence = (presenceEvent) => {
    console.log('Presence event:', presenceEvent);
    updateUserCount(presenceEvent.occupancy);  // Update UI with current count
};
```

**Why this is important:** Presence events provide real-time notifications when users join or leave, giving you immediate updates without polling.

### 5. Get Initial Occupancy on Connection
Always fetch the current occupancy when first connecting to avoid starting with stale data:

```javascript
pubnub.addListener({
    status: (statusEvent) => {
        if (statusEvent.category === 'PNConnectedCategory') {
            getInitialOccupancy();  // Get current count on connection
        }
    }
});

async function getInitialOccupancy() {
    try {
        const result = await pubnub.hereNow({
            channels: [channelName],
            includeUUIDs: false  // Optimize by not fetching UUIDs if not needed
        });
        
        const occupancy = result.channels[channelName] ? 
            result.channels[channelName].occupancy : 0;
        updateUserCount(occupancy);
    } catch (error) {
        console.error('Error getting initial occupancy:', error);
        updateUserCount(0);  // Fail gracefully with 0 count
    }
}
```

**Why this is important:** Without getting initial occupancy, your counter might show 0 users even when people are already connected. This ensures accurate state from the start.

### 6. Optimize hereNow Calls
Use `includeUUIDs: false` when you only need occupancy counts to reduce bandwidth:

```javascript
const result = await pubnub.hereNow({
    channels: [channelName],
    includeUUIDs: false  // More efficient when you only need counts
});
```

**Why this is important:** Including UUIDs increases payload size and processing time. Only request them when you actually need the user identifiers.

### 7. Proper Cleanup
Always unsubscribe when the user leaves to ensure accurate presence counts:

```javascript
window.addEventListener('beforeunload', () => {
    subscription.unsubscribe();  // Clean exit ensures accurate presence
});
```

**Why this is important:** Without proper cleanup, the system may not immediately recognize that a user has left, leading to inflated occupancy counts.

## Complete Working Example

```html
<div id="user-count">0</div>

<script>
    // Generate a random userId
    function generateRandomUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Initialize PubNub with random userId
    const pubnub = new PubNub({
        publishKey: 'pub-c-c4e46d96-bf76-423d-952a-b56e7b3f58c8',
        subscribeKey: 'sub-c-118cccb2-8546-11e8-9542-023dfa3e4dae',
        userId: generateRandomUserId(),
        enableEventEngine: true
    });
    
    const channelName = 'presence-counter-channel-test';
    const userCountElement = document.getElementById('user-count');
    
    // Function to update the display with animation
    function updateUserCount(count) {
        userCountElement.textContent = count;
        userCountElement.classList.add('pulse');
        setTimeout(() => {
            userCountElement.classList.remove('pulse');
        }, 500);
    }
    
    // Create subscription with presence enabled
    const channel = pubnub.channel(channelName);
    const subscription = channel.subscription({
        receivePresenceEvents: true
    });
    
    // Add presence event listener
    subscription.onPresence = (presenceEvent) => {
        console.log('Presence event:', presenceEvent);
        updateUserCount(presenceEvent.occupancy);
    };
    
    // Add general status listener
    pubnub.addListener({
        status: (statusEvent) => {
            console.log('Status:', statusEvent.category);
            if (statusEvent.category === 'PNConnectedCategory') {
                console.log('Connected to PubNub');
                // Get initial occupancy count
                getInitialOccupancy();
            }
        }
    });
    
    // Function to get initial occupancy
    async function getInitialOccupancy() {
        try {
            const result = await pubnub.hereNow({
                channels: [channelName],
                includeUUIDs: false
            });
            
            const occupancy = result.channels[channelName] ? 
                result.channels[channelName].occupancy : 0;
            updateUserCount(occupancy);
        } catch (error) {
            console.error('Error getting initial occupancy:', error);
            updateUserCount(0);
        }
    }
    
    // Subscribe to the channel
    subscription.subscribe();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        subscription.unsubscribe();
    });
</script>
```

## Key Takeaways

1. **Unique User IDs**: Always generate unique identifiers for accurate tracking
2. **Event Engine**: Enable for better connection management and reliability
3. **Targeted Subscriptions**: Only enable presence events where needed
4. **Initial State**: Always fetch current occupancy on connection
5. **Optimization**: Use `includeUUIDs: false` when only counting users
6. **Cleanup**: Properly unsubscribe to maintain accurate counts
7. **Error Handling**: Implement try-catch blocks and fallback values

Following these practices ensures reliable, efficient, and accurate presence tracking in your PubNub applications.
