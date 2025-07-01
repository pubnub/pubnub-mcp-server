On this page
# JavaScript API & SDK Docs 9.7.0

##### Chat SDK

If you want to create a chat app, you can use our [Chat SDK](/docs/chat/chat-sdk), which relies on the JavaScript SDK, is written in TypeScript, and offers a set of chat-specific methods to manage users, channels, messages, typing indicators, quotes, mentions, threads, and many more.

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your JavaScript application. Since JavaScript is commonly used across different platforms, we provide platform-specific guidance for:

- **Web**: For developers building browser-based applications

- **Node.js**: For server-side applications

- **React Native**: For mobile app development

The core PubNub concepts and API usage remain the same across all platforms, but implementation details like lifecycle management and UI updates differ. Select the appropriate tab in each section to see platform-specific guidance.

You can use either JavaScript or TypeScript with any of these platforms. The only difference is in how you import PubNub:

- For JavaScript files (`.js` extension): `const PubNub = require('pubnub');`

- For TypeScript files (`.ts` extension): `import PubNub from 'pubnub';`

JavaScript SDK supports a wide variety of environments including browsers, Node.js, React Native, React, Angular, Vue, and other JavaScript frameworks.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of JavaScript

- For browser applications: A modern web browser

- For Node.js: Node.js installed (version 10 or later)

- For React Native: React Native development environment set up

- A PubNub account (we'll help you set this up!)

- (Optional) If you want to use TypeScript: TypeScript installed (version 4.0 or later)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal

- Create a new app (or use an existing one)

- Find your publish and subscribe keys in the app's dashboard

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

- Web
- Node.js
- React Native

To integrate PubNub into your web project, add the JavaScript SDK to your HTML page using the CDN:

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.js">script>  
`
```

You can also use the minified version for production:

```
`script src="https://cdn.pubnub.com/sdk/javascript/pubnub.9.7.0.min.js">script>  
`
```

To integrate PubNub into your Node.js project, install the SDK using npm:

```
`npm install pubnub  
`
```

Then import it in your project:

```
`const PubNub = require('pubnub');  
`
```

For React Native projects, install the PubNub SDK:

```
`npm install pubnub  
`
```

Then import it in your project:

```
`import PubNub from 'pubnub';  
`
```

You can also [download the source code](https://github.com/pubnub/javascript) from GitHub and build it yourself.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

- Web
- Node.js
- React Native

Create an instance of the PubNub class with your keys and a unique user ID:

```
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "web-user-" + Math.floor(Math.random() * 1000)  
});  
`
```

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

Create an instance of the PubNub class with your keys and a unique user ID:

```
`  
`
```

Create an instance of the PubNub class with your keys and a unique user ID:

```
`const pubnub = new PubNub({  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "rn-user-" + Math.floor(Math.random() * 1000)  
});  
`
```

In a real React Native application, you would typically initialize PubNub inside a component using hooks for proper lifecycle management:

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

For more information, refer to the [Configuration](/docs/sdks/javascript/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

For complete details on subscribing and handling events, refer to the [Publish and Subscribe API Reference](/docs/sdks/javascript/api-reference/publish-and-subscribe#subscribe).

- Web
- Node.js
- React Native

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

show all 369 linesTo use this example in your React Native project:

Create a new React Native project:

```
`# Using Expo (easiest for beginners)  
npx create-expo-app PubNubChatApp  
cd PubNubChatApp  
  
# Or using React Native CLI  
npx react-native init PubNubChatApp  
cd PubNubChatApp  
`
```

Install the PubNub SDK:

```
`npm install pubnub  
`
```

Replace the content of App.js (or App.tsx for TypeScript) with the code above.

Run your app:

```
`# For Expo  
npx expo start  
  
# For React Native CLI  
npx react-native run-ios  
# or  
npx react-native run-android  
`
```

The example includes:

- PubNub initialization with proper cleanup

- Real-time message sending and receiving

- Messages display in a scrollable chat UI

- Connection status indicator

- Presence notifications (when users join/leave)

- Auto-scrolling message list

- Proper keyboard handling

- Error handling for failed messages

- Loading state while connecting

- Full styling for a production-ready appearance

### Create a subscription[​](#create-a-subscription)

To receive messages on a channel, you need to subscribe to it. PubNub offers an entity-based subscription approach which provides more control and flexibility:

- Web
- Node.js
- React Native

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

In React Native, we typically subscribe within a useEffect hook:

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

### Publish messages[​](#publish-messages)

Once you've set up your subscription, you can start publishing messages to channels.

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

- Web
- Node.js
- React Native

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

### Run the app[​](#run-the-app)

Once you've implemented all the previous steps (initialization, listeners, subscription, and publishing), you're ready to run your application:

- Web
- Node.js
- React Native

1. $1

2. $1

3. $1

4. $1

5. $1

Save your JavaScript file (e.g., `index.js`).

Run the file using Node.js:

```
`node index.js  
`
```

Type messages in the console and press **Enter** to send.

To see real-time communication, open another terminal window and run another instance of your app.

Start your React Native app:

```
`npm run android  
# or  
npm run ios  
# or  
npm run web  
`
```

The app should launch on the selected platform.

Type a message in the input field and tap **Send**.

You should see your message appear in the messages list.

To see real-time communication, run the app on another device or simulator.

## Complete example[​](#complete-example)

Below are complete working examples for each platform that combine all the previous steps into a single, functional application:

- Web
- Node.js
- React Native

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
```
`  
`
```

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

The examples above showcase complete working code that integrates all the concepts covered in this guide:

- PubNub initialization with proper configuration

- Event listener setup for messages and connection status

- Channel subscription using the entity-based approach

- Message publishing with error handling

- User interface components (where applicable)

- Cleanup and resource management

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub JavaScript application. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Learn about the [JavaScript Chat SDK](/docs/chat/chat-sdk) for ready-to-use chat features.

- Implement user [Presence](/docs/sdks/javascript/api-reference/presence) to show who's online.

- Add typing indicators and read receipts.

- Try out [Presence](/docs/sdks/javascript/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/javascript/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/javascript/api-reference/access-manager) to secure your channels.

- Explore [Channel Groups](/docs/sdks/javascript/api-reference/channel-groups) to organize your channels.

Explore our [GitHub repository](https://github.com/pubnub/javascript) for more code samples.

Follow these tutorials:

- [IoT dashboard](https://www.pubnub.com/tutorials/iot-dashboard-tutorial-javascript/)

- [Geolocation app](https://www.pubnub.com/tutorials/geolocation-tracking-tutorial-javascript/)

- [Delivery app](https://www.pubnub.com/tutorials/delivery-application/)

- Check out our [SDK reference documentation](/docs/sdks/javascript/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Jun 30, 2025**