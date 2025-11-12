# Java API & SDK Docs 12.0.0

##### Breaking changes in v9.0.0

- Unified Java and [Kotlin](/docs/sdks/kotlin) SDKs, new client instantiation, updated async callbacks and [status events](/docs/sdks/java/status-events).
- Apps built with versions < 9.0.0 may be impacted.
- See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

This guide shows core PubNub usage in Java:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview[​](#overview)

Use the PubNub Java SDK to configure the client, add event listeners, subscribe to channels, and publish messages.

##### Chat applications

For mobile chat, see [Kotlin Chat SDK](/docs/chat/kotlin-chat-sdk).

## Prerequisites[​](#prerequisites)

- Java knowledge
- IntelliJ IDEA or Eclipse
- Java 8+
- PubNub account and keys

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup).
- Create an app or use an existing one.
- Get publish and subscribe keys from the app dashboard.
- Use separate keysets for dev/prod.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Use the latest SDK version.

#### Maven[​](#maven)

Add to `pom.xml`:

```
`1dependency>  
2  groupId>com.pubnubgroupId>  
3  artifactId>pubnub-gsonartifactId>  
4  version>12.0.0version>  
5dependency>  
`
```

#### Gradle[​](#gradle)

Add to `build.gradle`:

```
`1implementation group: 'com.pubnub', name: 'pubnub-gson', version: '12.0.0'  
`
```

#### Source code[​](#source-code)

Clone the [GitHub repository](https://github.com/pubnub/kotlin):

```
`1git clone https://github.com/pubnub/kotlin  
`
```

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

Replace demo keys with your app’s publish/subscribe keys.

```
1
  

```

##### PNConfiguration class in Java

From 10.0.0+, import `com.pubnub.api.java.v2.PNConfiguration`. See [Configuration](/docs/sdks/java/api-reference/configuration).

### Set up event listeners[​](#set-up-event-listeners)

Add listeners to handle:
- Status events (connection/operational changes)
- Messages and presence events

```
1
  

```

See [Listeners](/docs/sdks/java/api-reference/configuration#event-listeners).

### Create a subscription[​](#create-a-subscription)

Subscribe to a channel to receive messages in real time:

```
1
  

```

Subscribe to multiple channels with a subscription set:

```
1import java.util.Set;  
2import java.util.Collections;  
3import com.pubnub.api.java.v2.subscriptions.SubscriptionSet;  
4import com.pubnub.api.java.v2.subscriptions.EmptyOptions;  
5
  
6// Create a subscription set with multiple channels  
7SubscriptionSet subscriptionSet = pubnub.subscriptionSetOf(  
8    Set.of("channel1", "channel2", "channel3"),   
9    Collections.emptySet(),   
10    EmptyOptions.INSTANCE);  
11
  
12// Subscribe to all channels in the set  
13subscriptionSet.subscribe();  

```

See [Subscribe](/docs/sdks/java/api-reference/publish-and-subscribe#subscribe).

### Publish messages[​](#publish-messages)

Messages must be JSON-serializable and ≤ 32 KiB.

Publish to a channel:

```
1
  

```

With options:

```
`1channel.publish(messageJsonObject)  
2    .customMessageType("text-message") // Add a custom message type  
3    .shouldStore(true) // Store the message in history  
4    .meta(metadataObject) // Add metadata for filtering  
5    .async(result -> {  
6        // Handle results  
7    });  
`
```

See [Publish and Subscribe](/docs/sdks/java/api-reference/publish-and-subscribe).

### Run the app[​](#run-the-app)

You should see output similar to:

```
`1PubNub initialized successfully  
2Subscribed to channel: myChannel  
3Connected to PubNub  
4Message to send: {"msg":"Hello World"}  
5Message successfully published with timetoken: 16789012345678901  
6Received on channel: myChannel  
7Received message: {"msg":"Hello World"}  
8The content of the message is: Hello World  
`
```

Add a delay to prevent the application from exiting immediately:

```
1
  

```

## Complete example[​](#complete-example)

```
1
  

```

### Troubleshooting[​](#troubleshooting)

No connection message
- Check internet connection.
- Verify publish/subscribe keys.
- Ensure firewall isn’t blocking PubNub.

Message not received
- Confirm subscribed channel names.
- Check for publish errors.
- Wait for delivery.
- Verify message listener setup.

Build errors
- Confirm PubNub dependency is added.
- Use Java 8+.
- Check imports and package names (v2 classes).

Gson deserialization errors
- Ensure message structure matches expected.
- Use try/catch for JSON parsing.

Thread exceptions
- Don’t block the main thread.
- Handle InterruptedException with Thread.sleep().
- Consider an executor service for complex apps.

##### More troubleshooting tips

See [Troubleshooting](/docs/sdks/java/troubleshooting).

## Next steps[​](#next-steps)

- Try [Presence](/docs/sdks/java/api-reference/presence).
- Implement [Message Persistence](/docs/sdks/java/api-reference/storage-and-playback).
- Use [Access Manager](/docs/sdks/java/api-reference/access-manager).
- Explore [Channel Groups](/docs/sdks/java/api-reference/channel-groups).
- See more samples on [GitHub](https://github.com/pubnub/kotlin).
- Read the [SDK reference](/docs/sdks/java/api-reference/configuration).
- Visit the [support portal](https://support.pubnub.com/).
- Ask the AI assistant.

Last updated on Sep 3, 2025