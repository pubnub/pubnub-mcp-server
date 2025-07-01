# Kotlin API & SDK Docs 10.5.2 – Overview (Condensed)

## Breaking changes in v9.0.0
* Unified Kotlin/Java codebase.  
* New client instantiation, updated async callbacks, and status events.  
* See Java/Kotlin SDK migration guide for details.

## Prerequisites
* Kotlin knowledge and IDE (Android Studio or other).  
* PubNub account (publish & subscribe keys).

## Setup

### Get your PubNub keys
Sign in to the Admin Portal → create/select app → copy **Publish** and **Subscribe** keys.

### Install the SDK

#### Android (Gradle)
```gradle
implementation 'com.pubnub:pubnub-kotlin:10.5.2'
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4' // optional
```

Add Internet permission:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

#### Maven
```xml
<dependency>
  <groupId>com.pubnub</groupId>
  <artifactId>pubnub-kotlin</artifactId>
  <version>10.5.2</version>
</dependency>
```

#### Pure Gradle
```gradle
implementation 'com.pubnub:pubnub-kotlin:10.5.2'
```

Source code: https://github.com/pubnub/kotlin/

### ProGuard (snippet)
```proguard
# Project-specific rules.
# For WebView with JS uncomment and set correct interface:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}
# Preserve line numbers…
```

## Steps

### 1 – Initialize PubNub

#### Android
```kotlin
import com.google.gson.JsonObject
import com.pubnub.api.PubNub
import com.pubnub.api.UserId
import com.pubnub.api.v2.PNConfiguration
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import kotlinx.coroutines.*

class PubNubActivity : AppCompatActivity() {
    private lateinit var pubnub: PubNub

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // initialize PNConfiguration
        val config = PNConfiguration(
            publishKey = "YOUR_PUB_KEY",
            subscribeKey = "YOUR_SUB_KEY",
            userId = UserId("myUniqueUser")
        )
        pubnub = PubNub(config)
        setupPubNub()
    }
}
```

#### Non-mobile  
```kotlin
// Minimal configuration – replace with your keys
val pubnub = PubNub(
    PNConfiguration(
        publishKey = "YOUR_PUB_KEY",
        subscribeKey = "YOUR_SUB_KEY",
        userId = UserId("myUniqueUser")
    )
)
```

### 2 – Set up event listeners

```kotlin
import com.pubnub.api.enums.PNStatusCategory
import com.pubnub.api.models.consumer.PNStatus
import com.pubnub.api.models.consumer.pubsub.PNMessageResult
import com.pubnub.api.models.consumer.pubsub.PNPresenceEventResult
import com.pubnub.api.v2.callbacks.EventListener
import com.pubnub.api.v2.callbacks.StatusListener

private fun setupPubNub() {
    pubnub.addListener(object : StatusListener {
        override fun status(pubnub: PubNub, status: PNStatus) {
            when (status.category) {
                PNStatusCategory.PNConnectedCategory ->
                    runOnUiThread { /* Update UI */ }
                else -> { /* Handle other states */ }
            }
        }
    })

    pubnub.addListener(object : EventListener {
        override fun message(pubnub: PubNub, message: PNMessageResult) {
            runOnUiThread { /* Handle incoming message */ }
        }
        override fun presence(pubnub: PubNub, presence: PNPresenceEventResult) { }
    })
}
```

### 3 – Create a subscription
```kotlin
import com.pubnub.api.v2.subscriptions.SubscriptionOptions

val myChannel = "myChannel"
val channel = pubnub.channel(myChannel)

// enable presence if needed
val options = SubscriptionOptions.receivePresenceEvents()

val subscription = channel.subscription(options)
subscription.subscribe()   // start receiving
```

### 4 – Publish messages
```kotlin
private fun sendMessage(text: String) {
    val msg = JsonObject().apply { addProperty("msg", text) }

    CoroutineScope(Dispatchers.IO).launch {
        try {
            val result = pubnub.channel("myChannel").publish(msg).sync()
            runOnUiThread {
                // result.timetoken
            }
        } catch (e: Exception) {
            /* Handle error */
        }
    }
}
```

### 5 – Run the app
Expected console/logcat output:
```
Message to send: {"msg":"Hello, world"}
Connected/Reconnected
Received message {"msg":"Hello, world"}
Message sent, timetoken: 16967543908123456
```

## Troubleshooting (quick reference)

* No connection – verify keys, internet, firewall.  
* Message not received – confirm subscription & channel names.  
* Build errors – check dependency versions, imports, ProGuard.

## Next steps
* Kotlin Chat SDK, Presence, Message Persistence, Access Manager.  
* More samples: https://github.com/pubnub/kotlin/  
* Support: https://support.pubnub.com/ – join Discord for community help.

_Last updated: Jun 18 2025_