# Java SDK 10.5.2 – Overview (Condensed)

## Breaking changes (≥ 9.0.0)
• Unified Java/Kotlin codebase  
• New `PubNub` instantiation API  
• Updated async callbacks & status events  
See the Java/Kotlin migration guide for full details.

## Prerequisites
• Java 8+ • IntelliJ/Eclipse • PubNub account and keyset

## Obtain Keys
Create/locate a keyset in the Admin Portal. Note the **Publish** and **Subscribe** keys.

## Installation

### Maven
```
`dependency>  
  groupId>com.pubnubgroupId>  
  artifactId>pubnub-gsonartifactId>  
  version>10.5.2version>  
dependency>  
`
```

### Gradle
```
`implementation group: 'com.pubnub', name: 'pubnub-gson', version: '10.5.2'  
`
```

### Source
Download from GitHub: https://github.com/pubnub/kotlin

## Initialize PubNub
Import `com.pubnub.api.java.v2.PNConfiguration` (SDK ≥ 10.0.0) and create the client:

```
`  
`
```

## Event Listeners
Add both **status** and **event** listeners to handle connection changes and incoming data:

```
`  
`
```

## Subscribe

Single channel:
```
`  
`
```

Multiple channels with `SubscriptionSet`:
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

## Publish

Basic publish:
```
`  
`
```

Publish with options:
```
`channel.publish(messageJsonObject)  
    .customMessageType("text-message") // Add a custom message type  
    .shouldStore(true)                 // Store in History  
    .meta(metadataObject)              // Metadata for filtering  
    .async(result -> {                 // Result callback  
        // Handle results  
    });  
`
```

## Expected Console Output
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

Add a delay if needed to keep the app running:
```
`  
`
```

## Complete Example
```
`  
`
```

## Troubleshooting (common highlights)
• Verify keys, network connectivity, and channel names  
• Confirm SDK dependency and Java version  
• Use correct `v2` package imports  
• Handle JSON parsing and threading appropriately  

For additional help, see the SDK reference, troubleshooting guide, or PubNub Discord/support channels.