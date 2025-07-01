# JavaScript SDK 9.7.0 – Overview (condensed)

## Chat SDK  
For chat-specific helpers (users, typing, threads, …) use the [Chat SDK](/docs/chat/chat-sdk) built on top of this JavaScript SDK.

## Prerequisites  
• JavaScript knowledge  
• Browser / Node 10+ / React Native env.  
• PubNub account and keyset  
• (optional) TypeScript 4+

## Get your PubNub keys  
1. Sign in to the Admin Portal.  
2. Create/choose an app → copy **publish** & **subscribe** keys.  
(Use separate dev/prod keysets for security.)

## Install the SDK

### Web (CDN)
``` 
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.js">script>  
`
```
``` 
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.min.js">script>  
`
```

### Node.js
``` 
`npm install pubnub  
`
```
``` 
`const PubNub = require('pubnub');  
`
```

### React Native
``` 
`npm install pubnub  
`
```
``` 
`import PubNub from 'pubnub';  
`
```

## Initialize PubNub

### Web
``` 
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "web-user-" + Math.floor(Math.random() * 1000)  
});  
`
```

### Node.js
``` 
`  
`
```

### React Native
``` 
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "rn-user-" + Math.floor(Math.random() * 1000)  
});  
`
```
``` 
`// Example of initialization in a React component (optional)  
useEffect(() => {  
    // Clean up on component unmount  
    return () => {  
        if (pubnub) {  
            pubnub.removeAllListeners();  
            pubnub.destroy();  
        }  
    };  
}, [pubnub]);  
`
```

## Event Listeners
``` 
`// Add listener to handle messages, presence events, and connection status  
pubnub.addListener({  
    message: function(event) {  
        // Handle message event  
        console.log("New message:", event.message);  
        // Display message in the UI  
        displayMessage(event.message);  
    },  
    presence: function(event) {  
        // Handle presence event  
        console.log("Presence event:", event);  
        console.log("Action:", event.action); // join, leave, timeout  
        console.log("Channel:", event.channel);  
        console.log("Occupancy:", event.occupancy);  
    },  
`
```
show all 44 lines

``` 
`// App.js or App.tsx for TypeScript projects  
  
// Imports  
import React, { useState, useEffect, useRef } from 'react';  
import {  
  SafeAreaView,  
  StyleSheet,  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  FlatList,  
  KeyboardAvoidingView,  
  Platform,  
  StatusBar,  
`
```
show all 369 lines

## Subscribe to a Channel
``` 
`// Create a channel entity  
const channel = pubnub.channel('hello_world');  
  
// Create a subscription for this channel  
const subscription = channel.subscription();  
  
// Subscribe  
subscription.subscribe();  
`
```
``` 
`  
`
```

``` 
`useEffect(() => {  
    if (!pubnub) return;  
      
    // Create a channel entity  
    const channel = pubnub.channel('hello_world');  
      
    // Create a subscription  
    const subscription = channel.subscription({  
        receivePresenceEvents: true  
    });  
      
    // Subscribe  
    subscription.subscribe();  
      
    // Clean up on unmount  
`
```
show all 28 lines

## Publish Messages
``` 
`// Function to publish a message  
async function publishMessage(text) {  
    if (!text.trim()) return;  
      
    try {  
        const result = await pubnub.publish({  
            message: {  
                text: text,  
                sender: pubnub.getUUID(),  
                time: new Date().toISOString()  
            },  
            channel: 'hello_world'  
        });  
        console.log("Message published with timetoken:", result.timetoken);  
    } catch (error) {  
`
```
show all 25 lines
``` 
`  
`
```
``` 
`// State for the input text  
const [inputText, setInputText] = useState('');  
  
// Function to publish a message  
const publishMessage = async () => {  
    if (!inputText.trim() || !pubnub) return;  
      
    try {  
        const result = await pubnub.publish({  
            message: {  
                text: inputText,  
                sender: pubnub.getUUID(),  
                time: new Date().toISOString()  
            },  
            channel: 'hello_world'  
`
```
show all 36 lines

## Run

### Node.js
Save `index.js` then:
``` 
`node index.js  
`
```

### React Native
``` 
`npm run android  
# or  
npm run ios  
# or  
npm run web  
`
```

### React Native (Expo/CLI project creation)
``` 
`# Using Expo (easiest for beginners)  
npx create-expo-app PubNubChatApp  
cd PubNubChatApp  
  
# Or using React Native CLI  
npx react-native init PubNubChatApp  
cd PubNubChatApp  
`
```
``` 
`npm install pubnub  
`
```
``` 
`# For Expo  
npx expo start  
  
# For React Native CLI  
npx react-native run-ios  
# or  
npx react-native run-android  
`
```

## Complete Examples

### Web
``` 
`DOCTYPE html>  
html>  
head>  
    meta charset="utf-8" />  
    title>PubNub Chat Exampletitle>  
    script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.js">script>  
    style>  
        #chat-container {  
            max-width: 600px;  
            margin: 0 auto;  
            padding: 20px;  
            font-family: Arial, sans-serif;  
        }  
        #messages {  
            height: 300px;  
`
```
show all 134 lines

### React Native
``` 
`// App.js or App.tsx for TypeScript projects  
  
// Imports  
import React, { useState, useEffect, useRef } from 'react';  
import {  
  SafeAreaView,  
  StyleSheet,  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  FlatList,  
  KeyboardAvoidingView,  
  Platform,  
  StatusBar,  
`
```
show all 369 lines

These examples combine:
• SDK configuration & cleanup  
• addListener handling (messages, presence, status)  
• Entity-based subscriptions  
• Message publish with error handling  
• Basic UI (where relevant)

## Next Steps  
• Use Presence, Storage & Playback, Access Manager, Channel Groups.  
• Check the [Chat SDK](/docs/chat/chat-sdk) for turnkey chat.  
• Explore code samples on GitHub, tutorials (IoT dashboard, geolocation, delivery), and join our Discord/support channels.