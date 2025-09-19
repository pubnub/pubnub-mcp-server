# Java API & SDK Docs 10.5.3 – Overview (Condensed)

## Breaking changes in v9.0.0
* Unified Java/Kotlin codebases.  
* New client instantiation, new async callbacks, new [status events](/docs/sdks/java/status-events).  
* If upgrading from < 9.0.0, read the [Java/Kotlin migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

---

## Prerequisites
* Java 8+ and an IDE.  
* PubNub account with publish & subscribe keys.

---

## Setup

### Get your PubNub keys
1. Sign in to the [Admin Portal](https://admin.pubnub.com).  
2. Create (or select) an app → copy the publish & subscribe keys.

### Install the SDK  
Always use the latest version (10.5.3 here).

#### Maven  
```
`dependency>  
  groupId>com.pubnubgroupId>  
  artifactId>pubnub-gsonartifactId>  
  version>10.5.3version>  
dependency>  
`
```

#### Gradle  
```
`implementation group: 'com.pubnub', name: 'pubnub-gson', version: '10.5.3'  
`
```

#### Source  
Download from [GitHub](https://github.com/pubnub/kotlin).

---

## Steps

### 1. Initialize PubNub  
Replace demo keys with your own.
```
`  
`
```
PNConfiguration import (SDK ≥ 10.0.0):  
```java
import com.pubnub.api.java.v2.PNConfiguration;
```

### 2. Set up event & status listeners
```
`  
`
```

### 3. Subscribe  
Single channel:
```
`  
`
```
Multiple channels:
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

### 4. Publish
```
`  
`
```
With options:
```
`channel.publish(messageJsonObject)  
    .customMessageType("text-message")  
    .shouldStore(true)  
    .meta(metadataObject)  
    .async(result -> {  
        // Handle results  
    });  
`
```

### 5. Run
Expected console output:
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
Prevent immediate exit:
```
`  
`
```

---

## Complete example
```
`  
`
```

---

## Troubleshooting (quick list)
* No connection → check internet, keys, firewall.  
* Message not received → verify channel, listener, wait time.  
* Build errors → dependency, Java 8+, imports/v2 classes.  
* Gson errors → validate JSON structure, add try/catch.  
* Thread issues → avoid blocking main thread; handle InterruptedException.

More help: [Java troubleshooting](/docs/sdks/java/troubleshooting).

---

## Next steps
* Presence, Message Persistence, Access Manager, Channel Groups.  
* More samples: [GitHub](https://github.com/pubnub/kotlin) | API reference | [Discord](https://discord.gg/pubnub) | [Support](https://support.pubnub.com/)

_Last updated: Jun 2 2025_