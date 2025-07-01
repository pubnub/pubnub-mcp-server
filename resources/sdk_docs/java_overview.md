On this page
# Java API & SDK Docs 10.5.2

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Java application. You'll learn how to set up PubNub, configure event listeners, subscribe to channels, and publish messages in a Java environment.

##### Chat applications

If you want to create a mobile chat application with PubNub, refer to [Kotlin Chat SDK](/docs/chat/kotlin-chat-sdk) for details on all available chat features.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Java

- An IDE like IntelliJ IDEA or Eclipse

- Java 8 or later installed

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard.

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

You can install the PubNub Java SDK in several ways:

#### Maven[​](#maven)

Add the following dependency to your `pom.xml`:

```
`dependency>  
  groupId>com.pubnubgroupId>  
  artifactId>pubnub-gsonartifactId>  
  version>10.5.2version>  
dependency>  
`
```

#### Gradle[​](#gradle)

Add the following to your `build.gradle` file:

```
`implementation group: 'com.pubnub', name: 'pubnub-gson', version: '10.5.2'  
`
```

#### Source code[​](#source-code)

You can also download the source code directly from [GitHub](https://github.com/pubnub/kotlin).

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

In your Java application, create a new class (e.g., `App.java`) and initialize PubNub.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
`  
`
```

##### PNConfiguration class in Java

From version 10.0.0 of the Java SDK onward, the correct import for the `PNConfiguration` class is `com.pubnub.api.java.v2.PNConfiguration`.

For more information, refer to the [Configuration](/docs/sdks/java/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

There are two main types of listeners you'll need to set up:

- Status listener - for connection state changes and operational events

- Event listener - for messages and presence events

Add listeners to handle connection status and incoming messages:

```
`  
`
```

For more information, refer to the [Listeners](/docs/sdks/java/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages, you need to subscribe to a channel:

```
`  
`
```

You can also subscribe to multiple channels at once using a subscription set:

```
`import java.util.Set;  
import java.util.Collections;  
import com.pubnub.api.java.v2.subscriptions.SubscriptionSet;  
import com.pubnub.api.java.v2.subscriptions.EmptyOptions;  
  
// Create a subscription set with multiple channels  
SubscriptionSet subscriptionSet = pubnub.subscriptionSetOf(  
    Set.of("channel1", "channel2", "channel3"),   
    Collections.emptySet(),   
    EmptyOptions.INSTANCE);  
  
// Subscribe to all channels in the set  
subscriptionSet.subscribe();  
`
```

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

To send a message to a channel, use the `publish()` method on your channel object:

```
`  
`
```

You can also publish messages with additional options:

```
`channel.publish(messageJsonObject)  
    .customMessageType("text-message") // Add a custom message type  
    .shouldStore(true) // Store the message in history  
    .meta(metadataObject) // Add metadata for filtering  
    .async(result -> {  
        // Handle results  
    });  
`
```

For more information, refer to the [Publish and Subscribe](/docs/sdks/java/api-reference/publish-and-subscribe) section of the SDK documentation, and to [Publishing a Message](/docs/general/messages/publish).

### Run the app[​](#run-the-app)

To run your Java application:

1. $1

2. $1

3. $1

You should see output similar to:

```
`PubNub initialized successfully  
Subscribed to channel: myChannel  
Connected to PubNub  
Message to send: {"msg":"Hello World"}  
Message successfully published with timetoken: 16789012345678901  
Received on channel: myChannel  
Received message: {"msg":"Hello World"}  
The content of the message is: Hello World  
`
```

Since you're both publishing and subscribing to the same channel in this example, you'll receive the messages you publish.

Add a delay to prevent the application from exiting immediately:

```
`  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together:

```
`  
`
```

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct.
- Make sure you're not behind a firewall blocking PubNub's connections.

Message not received
- Double-check that you're subscribed to the correct channel.
- Verify that the message was actually sent (check for any error messages).
- Make sure you're waiting long enough for the message to be delivered.
- Ensure your message listener is properly set up.

Build errors
- Ensure you've added the PubNub dependency correctly.
- Check that you're using a compatible version of Java (Java 8+).
- Make sure all imports are correct.
- Verify you're using the right package names (v2 classes).

Gson deserialization errors
- Check that your message structure matches what you're trying to extract.
- Use try/catch blocks when processing messages to handle potential JSON parsing exceptions.

Thread exceptions
- Avoid blocking the main thread with long-running operations.
- Handle InterruptedException properly when using Thread.sleep().
- Consider using an executor service for complex applications.

##### More troubleshooting tips

Refer to the [Troubleshooting](/docs/sdks/java/troubleshooting) section for more information.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub Java application. Here are some exciting things you can explore next:

- Advanced features
- Real examples
- More help

- Try out [Presence](/docs/sdks/java/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/java/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/java/api-reference/access-manager) to secure your channels.

- Explore [Channel Groups](/docs/sdks/java/api-reference/channel-groups) to organize your channels.

- Explore our [GitHub repository](https://github.com/pubnub/kotlin) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/java/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Jun 2, 2025**