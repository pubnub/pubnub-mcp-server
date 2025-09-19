# JavaScript API & SDK Docs 9.9.0

##### Chat SDK
Use the Chat SDK (TypeScript, built on the JavaScript SDK) for chat-specific features: users, channels, messages, typing indicators, quotes, mentions, threads, and more. See the Chat SDK docs.

Core tasks:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview
The JavaScript SDK provides real-time messaging for:
- Web (browser)
- Node.js (server-side)
- React Native (mobile)

Use JavaScript or TypeScript:
- JavaScript (.js): `const PubNub = require('pubnub');`
- TypeScript (.ts): `import PubNub from 'pubnub';`

Supports browsers, Node.js, React Native, React, Angular, Vue, and other frameworks.

## Prerequisites
- JavaScript basics
- Web: modern browser
- Node.js: v10+
- React Native: RN dev environment
- PubNub account and keyset
- Optional TypeScript v4.0+

## Setup

### Get your PubNub keys
- Sign in or create an account in the Admin Portal
- Create an app (keyset generated automatically)
- Get publish and subscribe keys
- Use separate keysets for dev/production

### Install the SDK

Always use the latest SDK version.

- Web (CDN)

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.9.0.js">script>  
`
```

Minified:

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.9.0.min.js">script>  
`
```

- Node.js (npm)

```
`npm install pubnub  
`
```

Import:

```
`const PubNub = require('pubnub');  
`
```

- React Native (npm)

```
`npm install pubnub  
`
```

Import:

```
`import PubNub from 'pubnub';  
`
```

- Source code

```
`git clone https://github.com/pubnub/javascript  
`
```

## Steps

### Initialize PubNub

Create an instance with publishKey, subscribeKey, and a unique userId. Replace demo keys with your own.

- Web

```
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "web-user-" + Math.floor(Math.random() * 1000)  
});  
`
```

- Node.js

```
`  
`
```

- React Native

```
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "rn-user-" + Math.floor(Math.random() * 1000)  
});  
`
```

React Native lifecycle cleanup example:

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

See Configuration for details.

### Set up event listeners

Use addListener to handle messages, presence events, and connection status.

See Publish and Subscribe API Reference for full details.

- Web / Node.js

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
`  
`
```

- React Native (full app example scaffold)

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

To use this in RN:

Create a project:

```
`# Using Expo (easiest for beginners)  
npx create-expo-app PubNubChatApp  
cd PubNubChatApp  
  
# Or using React Native CLI  
npx react-native init PubNubChatApp  
cd PubNubChatApp  
`
```

Install:

```
`npm install pubnub  
`
```

Replace App.js/App.tsx with the code above.

Run:

```
`# For Expo  
npx expo start  
  
# For React Native CLI  
npx react-native run-ios  
# or  
npx react-native run-android  
`
```

Includes: initialization/cleanup, real-time send/receive, UI list, connection status, presence, auto-scroll, keyboard handling, error handling, loading state, styling.

### Create a subscription

Use entity-based subscriptions for control and flexibility.

- Web

```
`// Create a channel entity  
const channel = pubnub.channel('hello_world');  
  
// Create a subscription for this channel  
const subscription = channel.subscription();  
  
// Subscribe  
subscription.subscribe();  
`
```

- Node.js

```
`  
`
```

- React Native

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

See Subscribe docs for details.

### Publish messages

Messages must be JSON-serializable and under 32 KiB. Publishing delivers to all subscribers of the channel.

- Web / Node.js

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

- React Native

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

### Run the app

- Node.js
  - Save your JavaScript file (for example, index.js)
  - Run:

```
`node index.js  
`
```

  - Open another terminal to see real-time communication.

- React Native

```
`npm run android  
# or  
npm run ios  
# or  
npm run web  
`
```

## Complete example

- Web (HTML)

```
`DOCTYPE html>  
html>  
head>  
    meta charset="utf-8" />  
    title>PubNub Chat Exampletitle>  
    script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.9.0.js">script>  
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
```
`  
`
```

- React Native

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

Includes: initialization, listeners, channel subscription (entity-based), publish with error handling, UI, cleanup.

## Next steps
- JavaScript Chat SDK for chat features
- Presence for online/offline tracking
- Message Persistence to store/retrieve messages
- Access Manager to secure channels
- Channel Groups to organize channels
- GitHub repository for samples and tutorials:
  - IoT dashboard
  - Geolocation app
  - Delivery app
- SDK reference documentation and Support portal

Last updated on Sep 3, 2025