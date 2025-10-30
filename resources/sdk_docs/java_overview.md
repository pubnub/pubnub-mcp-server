# Java API & SDK Docs 11.0.0

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, async callbacks, and emitted status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

This quickstart covers:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Use the Java SDK to integrate PubNub real-time messaging: configure, add event listeners, subscribe to channels, and publish messages.

##### Chat applications

For mobile chat features, see Kotlin Chat SDK.

## Prerequisites

- Java knowledge
- IntelliJ IDEA or Eclipse
- Java 8+
- PubNub account

## Setup

### Get your PubNub keys

- Sign in or create an account on the Admin Portal.
- Create an app and keyset.
- Use publish and subscribe keys from the dashboard. Prefer separate dev/prod keysets.

### Install the SDK

##### SDK version

Use the latest SDK version.

#### Maven

```
`1dependency>  
2  groupId>com.pubnubgroupId>  
3  artifactId>pubnub-gsonartifactId>  
4  version>11.0.0version>  
5dependency>  
`
```

#### Gradle

```
`1implementation group: 'com.pubnub', name: 'pubnub-gson', version: '11.0.0'  
`
```

#### Source code

Clone the GitHub repository:

```
`1git clone https://github.com/pubnub/kotlin  
`
```

## Steps

### Initialize PubNub

Replace demo keys with your app's keys.

```
1
  

```

##### PNConfiguration class in Java

From 10.0.0+, import PNConfiguration as:
- com.pubnub.api.java.v2.PNConfiguration

See Configuration docs for details.

### Set up event listeners

Use listeners to handle:
- Status events (connection/operational)
- Event messages (messages and presence)

```
1
  

```

See Listeners docs for more.

### Create a subscription

Subscribe to receive real-time messages for a channel:

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

See Subscribe docs for details.

### Publish messages

Messages are JSON-serializable data up to 32 KiB. Use publish() on a channel:

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

See Publish and Subscribe docs for more.

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

Add a delay to prevent immediate exit:

```
1
  

```

## Complete example

```
1
  

```

### Troubleshooting

- No connection message
  - Check internet.
  - Verify publish/subscribe keys.
  - Check firewall rules.

- Message not received
  - Confirm subscribed channel name.
  - Check for publish errors.
  - Allow time for delivery.
  - Verify message listener setup.

- Build errors
  - Confirm PubNub dependency added.
  - Use Java 8+.
  - Fix imports.
  - Use correct v2 package names.

- Gson deserialization errors
  - Match message structure to parsing logic.
  - Use try/catch around JSON parsing.

- Thread exceptions
  - Avoid blocking main thread.
  - Handle InterruptedException with Thread.sleep().
  - Consider executor services for complex apps.

##### More troubleshooting tips

See Troubleshooting docs.

## Next steps

- Presence
- Message Persistence
- Access Manager
- Channel Groups
- GitHub samples
- SDK reference documentation
- Support portal
- Ask the AI assistant

Last updated on Sep 3, 2025