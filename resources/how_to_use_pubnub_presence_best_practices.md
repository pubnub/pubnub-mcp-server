
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
