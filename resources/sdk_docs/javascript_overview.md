# JavaScript SDK 9.8.3 – Overview (Condensed)

Use the JavaScript SDK (browser, Node.js, React Native) or the higher-level [Chat SDK](/docs/chat/chat-sdk).

---

## Prerequisites
• JavaScript knowledge  
• Browser / Node 10+ / React Native set-up  
• PubNub account and keyset  
• (Optional) TypeScript ≥ 4.0  

---

## Installation

### Web (CDN)
````
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.8.3.js">script>  
`
````
Production:
````
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.8.3.min.js">script>  
`
````

### Node.js
````
`npm install pubnub  
`
````
````
`const PubNub = require('pubnub');  
`
````

### React Native
````
`npm install pubnub  
`
````
````
`import PubNub from 'pubnub';  
`
````

---

## Initialize PubNub

### Web
````
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "web-user-" + Math.floor(Math.random() * 1000)  
});  
`
````

### Node.js
````
`  
`
````

### React Native
````
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "rn-user-" + Math.floor(Math.random() * 1000)  
});  
`
````
Component-level cleanup:
````
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
````

---

## Event Listeners
````
`// Add listener to handle messages, presence events, and connection status  
pubnub.addListener({  
    message: function(event) {  
        // Handle message event  
        console.log("New message:", event.message);  
        displayMessage(event.message);  
    },  
    presence: function(event) {  
        console.log("Presence event:", event);  
        console.log("Action:", event.action);  
        console.log("Channel:", event.channel);  
        console.log("Occupancy:", event.occupancy);  
    },  
`
````
````
`  
`
````

React Native scaffold (imports shown):
````
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
````

---

## Subscribe

### Web
````
`// Create a channel entity  
const channel = pubnub.channel('hello_world');  
  
// Create a subscription for this channel  
const subscription = channel.subscription();  
  
// Subscribe  
subscription.subscribe();  
`
````
````
`  
`
````

### React Native (hook)
````
`useEffect(() => {  
    if (!pubnub) return;  
      
    const channel = pubnub.channel('hello_world');  
    const subscription = channel.subscription({  
        receivePresenceEvents: true  
    });  
      
    subscription.subscribe();  
      
    // Clean up on unmount  
`
````

---

## Publish

### Web
````
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
````
````
`  
`
````

### React Native
````
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
````

---

## Run

### Node.js
Save your file (e.g., `index.js`) then:
````
`node index.js  
`
````

### React Native
````
`npm run android  
# or  
npm run ios  
# or  
npm run web  
`
````

---

## Example Projects

React Native project creation:
````
`# Using Expo (easiest for beginners)  
npx create-expo-app PubNubChatApp  
cd PubNubChatApp  
  
# Or using React Native CLI  
npx react-native init PubNubChatApp  
cd PubNubChatApp  
`
````
Install SDK:
````
`npm install pubnub  
`
````
Run (Expo / CLI):
````
`# For Expo  
npx expo start  
  
# For React Native CLI  
npx react-native run-ios  
# or  
npx react-native run-android  
`
````

Complete Web demo (HTML skeleton):
```
<DOCTYPE html>  
<html>  
<head>  
    <meta charset="utf-8" />  
    <title>PubNub Chat Exampletitle>  
    <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.8.3.js">script>  
    <style>  
        #chat-container {  
            max-width: 600px;  
            margin: 0 auto;  
            padding: 20px;  
            font-family: Arial, sans-serif;  
        }  
        #messages {  
            height: 300px;  
```
Full React Native example (header only shown):
````
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
````

---

## Next Steps
• Presence, storage, Access Manager, channel groups, typing indicators, read receipts.  
• See full [API reference](/docs/sdks/javascript/api-reference/configuration) and GitHub samples.  
• Join our [Discord](https://discord.gg/pubnub) or visit the support portal for help.
