# PubNub Kotlin SDK 10.5.3 – Overview (condensed)

Use this guide to install, configure, and send/receive messages with PubNub in any Kotlin project (Android or non-mobile). All API usage is identical across platforms; only lifecycle/UI code differs.

---

## Breaking changes (≥ 9.0.0)
• Unified Java/Kotlin codebase  
• New client instantiation pattern  
• Updated async callbacks and status events  
See the Java/Kotlin SDK migration guide for full details.

---

## Prerequisites
• Kotlin knowledge & IDE (Android Studio or other)  
• PubNub account and keyset (publish/subscribe keys)

---

## 1 – Get your keys
Create/sign in at https://admin.pubnub.com → create an app/keyset → copy publish & subscribe keys.

---

## 2 – Install the SDK

### Android (Gradle)
````
`implementation 'com.pubnub:pubnub-kotlin:10.5.3'  
  
// Optional: Add Kotlin coroutines for better async handling  
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'  
`
````

Add Internet permission:
````
`uses-permission android:name="android.permission.INTERNET" />  
`
````

### Maven
````
`dependency>  
  groupId>com.pubnubgroupId>  
  artifactId>pubnub-kotlinartifactId>  
  version>10.5.3version>  
dependency>  
`
````

### Gradle (non-Android)
````
`implementation 'com.pubnub:pubnub-kotlin:10.5.3'  
`
````

### Source
https://github.com/pubnub/kotlin/

### ProGuard (only if used)
````
`# Add project specific ProGuard rules here.  
# You can control the set of applied configuration files using the  
# proguardFiles setting in build.gradle.  
#  
# For more details, see  
#   http://developer.android.com/guide/developing/tools/proguard.html  
  
# If your project uses WebView with JS, uncomment the following  
# and specify the fully qualified class name to the JavaScript interface  
# class:  
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {  
#   public *;  
#}  
  
# Uncomment this to preserve the line number information for  
`
````

---

## 3 – Initialize PubNub
Replace demo keys with your own.

````
`// Import required classes  
import com.google.gson.JsonObject  
import com.pubnub.api.PubNub  
import com.pubnub.api.UserId  
import com.pubnub.api.v2.PNConfiguration  
import androidx.appcompat.app.AppCompatActivity  
import android.os.Bundle  
import kotlinx.coroutines.CoroutineScope  
import kotlinx.coroutines.Dispatchers  
import kotlinx.coroutines.launch  
  
class PubNubActivity : AppCompatActivity() {  
    private lateinit var pubnub: PubNub  
      
    override fun onCreate(savedInstanceState: Bundle?) {  
`
````

For full configuration options see the Configuration section of the API reference.

---

## 4 – Event & Status listeners
````
`import com.pubnub.api.enums.PNStatusCategory  
import com.pubnub.api.models.consumer.PNStatus  
import com.pubnub.api.models.consumer.pubsub.PNMessageResult  
import com.pubnub.api.models.consumer.pubsub.PNPresenceEventResult  
import com.pubnub.api.v2.callbacks.EventListener  
import com.pubnub.api.v2.callbacks.StatusListener  
import android.widget.Toast  
  
private fun setupPubNub() {  
    // Add a status listener to track connection state  
    pubnub.addListener(object : StatusListener {  
        override fun status(pubnub: PubNub, status: PNStatus) {  
            when (status.category) {  
                PNStatusCategory.PNConnectedCategory -> {  
                    // Update UI on the main thread  
`
````

````
`  
`
````

---

## 5 – Subscribe to a channel
````
`import com.pubnub.api.v2.subscriptions.SubscriptionOptions  
  
private fun setupPubNub() {  
    // Status listener code from previous step...  
      
    // Define the channel you want to subscribe to  
    val myChannel = "myChannel"  
    val channel = pubnub.channel(myChannel)  
      
    // Set up subscription options (optional - here we're enabling presence events)  
    val options = SubscriptionOptions.receivePresenceEvents()  
      
    // Create a subscription for the channel  
    val subscription = channel.subscription(options)  
      
`
````

````
`  
`
````

---

## 6 – Publish a message
````
`private fun sendMessage(text: String) {  
    // Create a message  
    val myMessage = JsonObject().apply {  
        addProperty("msg", text)  
    }  
      
    // Using Kotlin coroutines for async operations  
    CoroutineScope(Dispatchers.IO).launch {  
        try {  
            // Publish the message to the channel  
            val channel = pubnub.channel(myChannel)  
            val result = channel.publish(myMessage).sync()  
              
            // Update UI on the main thread  
            runOnUiThread {  
`
````

````
`  
`
````

---

## 7 – Expected console output
````
`Message to send: {"msg":"Hello, world"}  // First, we see the message we're about to send  
Connected/Reconnected                     // Then we get confirmation that we're connected to PubNub  
Received message {"msg":"Hello, world"}   // We receive the message we just sent (because we're subscribed to the same channel)  
Message sent, timetoken: 16967543908123456  // Finally, we see the timetoken confirming the message was sent successfully  
`
````

---

## Complete example
````
`  
`
````

---

### Next steps
• Presence, Message persistence, Access Manager, Chat SDK, sample apps, GitHub examples, and support resources.