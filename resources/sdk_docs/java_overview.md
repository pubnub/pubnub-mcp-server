# Java API & SDK Docs 12.0.1

##### Breaking changes in v9.0.0

- Unified Java and Kotlin SDK codebases, new client instantiation, changed async callbacks and emitted status events (may impact apps < 9.0.0).
- See the Java/Kotlin SDK migration guide.

This guide shows how to connect, publish, and subscribe in Java.

##### Chat applications

For mobile chat, use the Kotlin Chat SDK.

## Overview

Set up PubNub, add event listeners, subscribe to channels, and publish messages in a Java environment.

## Prerequisites

- Java basics, IDE (IntelliJ/Eclipse), Java 8+, PubNub account.

## Setup

### Get your PubNub keys

- Sign in or create an account on the Admin Portal.
- Create an app and keyset; get publish and subscribe keys.
- Use separate keysets for dev and prod.

### Install the SDK

##### SDK version

Use the latest SDK version.

#### Maven

Add to pom.xml:

```
`1dependency>  
2  groupId>com.pubnubgroupId>  
3  artifactId>pubnub-gsonartifactId>  
4  version>12.0.1version>  
5dependency>  
`
```

#### Gradle

Add to build.gradle:

```
`1implementation group: 'com.pubnub', name: 'pubnub-gson', version: '12.0.1'  
`
```

#### Source code

Clone:

```
`1git clone https://github.com/pubnub/kotlin  
`
```

## Steps

### Initialize PubNub

Create an App.java and initialize PubNub. Replace demo keys with your app keys.

```
1
  

```

##### PNConfiguration class in Java

From 10.0.0 onward, import PNConfiguration from com.pubnub.api.java.v2.PNConfiguration. See Configuration docs.

### Set up event listeners

Use:
- Status listener: connection state and operational events
- Event listener: messages and presence

```
1
  

```

See Event listeners docs.

### Create a subscription

Subscribe to a channel to receive real-time messages:

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

See Subscribe docs.

### Publish messages

Messages are JSON-serializable data under 32 KiB. Use publish() on your channel:

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

See Publish and Subscribe docs.

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

Add a delay to prevent exiting immediately:

```
1
  

```

## Complete example

```
1
  

```

### Troubleshooting

- No connection message:
  - Check internet, verify publish/subscribe keys, ensure no firewall blocking PubNub.
- Message not received:
  - Verify subscribed channel, confirm publish success, wait for delivery, ensure message listener set up.
- Build errors:
  - Check PubNub dependency added, Java 8+, imports and v2 package names correct.
- Gson deserialization errors:
  - Match message structure, use try/catch for JSON parsing.
- Thread exceptions:
  - Don’t block main thread, handle InterruptedException, consider executor services.

##### More troubleshooting tips

See Troubleshooting docs.

## Next steps

- Presence
- Message Persistence
- Access Manager
- Channel Groups
- Explore GitHub samples
- SDK reference docs
- Support portal
- Ask the AI assistant

Last updated on Sep 3, 2025