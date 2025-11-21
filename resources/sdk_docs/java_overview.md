# Java API & SDK Docs 12.0.1

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies the Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new client instantiation approach, and changes asynchronous API callbacks and [status events](/docs/sdks/java/status-events). Apps built with versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

This guide shows how to:
- Set up a connection
- Send messages
- Receive messages in real time

## Overview

Use the Java SDK to integrate PubNub real-time messaging in your Java app: initialize the client, configure listeners, subscribe to channels, and publish messages.

##### Chat applications

For mobile chat, see [Kotlin Chat SDK](/docs/chat/kotlin-chat-sdk).

## Prerequisites

- Java 8+
- Java IDE (IntelliJ IDEA, Eclipse, etc.)
- PubNub account and keys

## Setup

### Get your PubNub keys

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup).
- Create an app and keyset.
- Get your publish and subscribe keys from the Admin Portal. Use separate keysets for dev/prod when possible.

### Install the SDK

##### SDK version

Use the latest SDK version.

#### Maven

Add to `pom.xml`:

```
`1dependency>  
2  groupId>com.pubnubgroupId>  
3  artifactId>pubnub-gsonartifactId>  
4  version>12.0.1version>  
5dependency>  
`
```

#### Gradle

Add to `build.gradle`:

```
`1implementation group: 'com.pubnub', name: 'pubnub-gson', version: '12.0.1'  
`
```

#### Source code

Clone the [GitHub repository](https://github.com/pubnub/kotlin):

```
`1git clone https://github.com/pubnub/kotlin  
`
```

## Steps

### Initialize PubNub

Create a class (for example, `App.java`) and initialize PubNub using your publish/subscribe keys.

```
1
  
```

##### PNConfiguration class in Java

From Java SDK v10.0.0+, import `com.pubnub.api.java.v2.PNConfiguration`. See [Configuration](/docs/sdks/java/api-reference/configuration).

### Set up event listeners

Configure listeners for status changes and incoming events/messages.

```
1
  
```

See [Listeners](/docs/sdks/java/api-reference/configuration#event-listeners).

### Create a subscription

Subscribe to a channel to receive messages in real time:

```
1
  
```

Subscribe to multiple channels using a subscription set:

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

### Publish messages

Messages are JSON-serializable data (objects, arrays, integers, strings) up to 32 KiB. Publish to a channel using `publish()`:

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

### Run the app

1. $1
2. $1
3. $1

Expected output:

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

Add a delay to keep the app running:

```
1
  
```

## Complete example

```
1
  
```

### Troubleshooting

- No connection message:
  - Check internet connectivity.
  - Verify publish/subscribe keys.
  - Ensure firewall allows PubNub connections.
- Message not received:
  - Confirm correct channel subscription.
  - Check for publish errors.
  - Wait for delivery; ensure listener is set.
- Build errors:
  - Confirm dependency added.
  - Use Java 8+.
  - Verify imports and v2 package names.
- Gson deserialization errors:
  - Ensure message structure matches parsing.
  - Use try/catch around JSON parsing.
- Thread exceptions:
  - Avoid blocking the main thread.
  - Handle InterruptedException.
  - Consider executor services.

##### More troubleshooting tips

See [Troubleshooting](/docs/sdks/java/troubleshooting).

## Next steps

- Try [Presence](/docs/sdks/java/api-reference/presence).
- Use [Message Persistence](/docs/sdks/java/api-reference/storage-and-playback).
- Secure with [Access Manager](/docs/sdks/java/api-reference/access-manager).
- Organize with [Channel Groups](/docs/sdks/java/api-reference/channel-groups).
- Explore code samples in the [GitHub repository](https://github.com/pubnub/kotlin).
- Read the [SDK reference](/docs/sdks/java/api-reference/configuration).
- Visit the [support portal](https://support.pubnub.com/).

Last updated on Sep 3, 2025