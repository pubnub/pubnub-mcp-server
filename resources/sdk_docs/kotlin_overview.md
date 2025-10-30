# Kotlin API & SDK Docs 11.0.0

##### Breaking changes in v9.0.0

PubNub Kotlin SDK 9.0.0 unified the Kotlin and Java SDKs, introduced a new client instantiation, and changed async callbacks and emitted status events. These changes affect apps using versions < 9.0.0. See the Java/Kotlin SDK migration guide for details.

This guide shows how to:
- Set up a connection
- Send messages
- Receive messages in real-time

## Overview

Two implementation paths:
- Android app development
- Non-mobile platforms (server-side, desktop, etc.)

For Android chat apps, see Kotlin Chat SDK.

## Prerequisites

- Kotlin knowledge
- Android Studio or another Kotlin IDE
- PubNub account and keyset

## Setup

### Get your PubNub keys

- Sign in or create an account in the Admin Portal.
- Create an app and keyset.
- Use your publish and subscribe keys. Prefer separate dev/prod keysets.

### Install the SDK

Always use the latest SDK.

- Android app development

```
1implementation 'com.pubnub:pubnub-kotlin:11.0.0'  
2
  
3// Optional: Add Kotlin coroutines for better async handling  
4implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'  

```

Add internet permission to AndroidManifest.xml:

```
`1uses-permission android:name="android.permission.INTERNET" />  
`
```

#### Configure ProGuard

If you use ProGuard:

```
1# Add project specific ProGuard rules here.  
2# You can control the set of applied configuration files using the  
3# proguardFiles setting in build.gradle.  
4#  
5# For more details, see  
6#   http://developer.android.com/guide/developing/tools/proguard.html  
7
  
8# If your project uses WebView with JS, uncomment the following  
9# and specify the fully qualified class name to the JavaScript interface  
10# class:  
11#-keepclassmembers class fqcn.of.javascript.interface.for.webview {  
12#   public *;  
13#}  
14
  
15# Uncomment this to preserve the line number information for  
16# debugging stack traces.  
17#-keepattributes SourceFile, LineNumberTable  
18
  
19# If you keep the line number information, uncomment this to  
20# hide the original source file name.  
21#-renamesourcefileattribute SourceFile  
22
  
23-keepattributes Exceptions, InnerClasses, Signature, Deprecated, SourceFile, LineNumberTable, *Annotation*, EnclosingMethod  
24
  
25-keep class com.google.android.gms.ads.identifier.** { *; }  
26
  
27# Joda-Time  
28-dontwarn org.joda.time.**  
29-keep class org.joda.time.** { *; }  
30
  
31# Gson  
32-dontwarn sun.misc.**  
33-keep class sun.misc.Unsafe { *; }  
34-keep class com.google.gson.examples.android.model.** { *; }  
35-keep class * implements com.google.gson.TypeAdapterFactory  
36-keep class * implements com.google.gson.JsonSerializer  
37-keep class * implements com.google.gson.JsonDeserializer  
38
  
39# OkHttp3  
40-dontwarn okhttp3.**  
41-dontwarn org.codehaus.mojo.animal_sniffer.*  
42-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase  
43
  
44# Okio  
45-dontwarn okio.**  
46
  
47# Retrofit 2.X  
48-dontwarn retrofit2.**  
49-dontwarn javax.annotation.**  
50-keepclassmembers,allowshrinking,allowobfuscation interface * {  
51    @retrofit2.http.* methods>;  
52}  
53-keepclasseswithmembers class * {  
54    @retrofit2.http.* methods>;  
55}  
56
  
57# Logback and slf4j-api  
58-dontwarn ch.qos.logback.core.net.*  
59-dontwarn org.slf4j.**  
60-keep class ch.qos.** { *; }  
61-keep class org.slf4j.** { *; }  
62
  
63# PubNub  
64-dontwarn com.pubnub.**  
65-keep class com.pubnub.** { *; }  

```

Choose your preferred way to add the PubNub SDK:

#### Maven

```
`1dependency>  
2  groupId>com.pubnubgroupId>  
3  artifactId>pubnub-kotlinartifactId>  
4  version>11.0.0version>  
5dependency>  
`
```

#### Gradle

```
`1implementation 'com.pubnub:pubnub-kotlin:11.0.0'  
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

- Android app development

```
1// Import required classes  
2import com.google.gson.JsonObject  
3import com.pubnub.api.PubNub  
4import com.pubnub.api.UserId  
5import com.pubnub.api.v2.PNConfiguration  
6import androidx.appcompat.app.AppCompatActivity  
7import android.os.Bundle  
8import kotlinx.coroutines.CoroutineScope  
9import kotlinx.coroutines.Dispatchers  
10import kotlinx.coroutines.launch  
11
  
12class PubNubActivity : AppCompatActivity() {  
13    private lateinit var pubnub: PubNub  
14      
15    override fun onCreate(savedInstanceState: Bundle?) {  
16        super.onCreate(savedInstanceState)  
17        setContentView(R.layout.activity_pubnub)  
18          
19        // Set up PubNub configuration  
20        val config = PNConfiguration.builder(UserId("androidUser"), "demo").apply {  
21            publishKey = "demo" // Replace with your publish key  
22        }.build()  
23          
24        // Create a PubNub instance  
25        pubnub = PubNub.create(config)  
26          
27        // Initialize your PubNub implementation here  
28        setupPubNub()  
29    }  
30      
31    private fun setupPubNub() {  
32        // We'll add listeners and subscription code here  
33    }  
34      
35    override fun onDestroy() {  
36        // Clean up PubNub resources when activity is destroyed  
37        pubnub.destroy()  
38        super.onDestroy()  
39    }  
40}  

```

- Non-mobile platforms

```
1
  

```

For more information, see Configuration.

### Set up event listeners

- Status listener: connection state and operational events
- Event listener: messages and presence events

- Android app development

```
1import com.pubnub.api.enums.PNStatusCategory  
2import com.pubnub.api.models.consumer.PNStatus  
3import com.pubnub.api.models.consumer.pubsub.PNMessageResult  
4import com.pubnub.api.models.consumer.pubsub.PNPresenceEventResult  
5import com.pubnub.api.v2.callbacks.EventListener  
6import com.pubnub.api.v2.callbacks.StatusListener  
7import android.widget.Toast  
8
  
9private fun setupPubNub() {  
10    // Add a status listener to track connection state  
11    pubnub.addListener(object : StatusListener {  
12        override fun status(pubnub: PubNub, status: PNStatus) {  
13            when (status.category) {  
14                PNStatusCategory.PNConnectedCategory -> {  
15                    // Update UI on the main thread  
16                    runOnUiThread {  
17                        Toast.makeText(this@PubNubActivity, "Connected to PubNub", Toast.LENGTH_SHORT).show()  
18                    }  
19                }  
20                PNStatusCategory.PNDisconnectedCategory,  
21                PNStatusCategory.PNUnexpectedDisconnectCategory -> {  
22                    // Update UI on the main thread  
23                    runOnUiThread {  
24                        Toast.makeText(this@PubNubActivity, "Disconnected from PubNub", Toast.LENGTH_SHORT).show()  
25                    }  
26                }  
27                else -> {}  
28            }  
29        }  
30    })  
31      
32    // Continue with channel subscription...  
33}  

```

- Non-mobile platforms

```
1
  

```

### Create a subscription

- Android app development

```
1import com.pubnub.api.v2.subscriptions.SubscriptionOptions  
2
  
3private fun setupPubNub() {  
4    // Status listener code from previous step...  
5      
6    // Define the channel you want to subscribe to  
7    val myChannel = "myChannel"  
8    val channel = pubnub.channel(myChannel)  
9      
10    // Set up subscription options (optional - here we're enabling presence events)  
11    val options = SubscriptionOptions.receivePresenceEvents()  
12      
13    // Create a subscription for the channel  
14    val subscription = channel.subscription(options)  
15      
16    // Add an event listener to the subscription  
17    subscription.addListener(object : EventListener {  
18        override fun message(pubnub: PubNub, result: PNMessageResult) {  
19            // Update UI on the main thread  
20            runOnUiThread {  
21                val message = result.message.asJsonObject  
22                // Display the message in your UI  
23                updateMessageUI(message.toString())  
24            }  
25        }  
26          
27        override fun presence(pubnub: PubNub, result: PNPresenceEventResult) {  
28            // Handle presence events if needed  
29        }  
30    })  
31      
32    // Activate the subscription to start receiving messages  
33    subscription.subscribe()  
34      
35    // Store subscription reference to manage lifecycle  
36    this.subscription = subscription  
37}  
38
  
39private fun updateMessageUI(message: String) {  
40    // Update your UI components with the message  
41    // For example:  
42    findViewByIdTextView>(R.id.messageTextView).text = message  
43}  
44
  
45// Don't forget to unsubscribe when appropriate  
46override fun onPause() {  
47    super.onPause()  
48    subscription?.unsubscribe()  
49}  
50
  
51override fun onResume() {  
52    super.onResume()  
53    subscription?.subscribe()  
54}  

```

- Non-mobile platforms

```
1
  

```

### Publish messages

- Android app development

```
1private fun sendMessage(text: String) {  
2    // Create a message  
3    val myMessage = JsonObject().apply {  
4        addProperty("msg", text)  
5    }  
6      
7    // Using Kotlin coroutines for async operations  
8    CoroutineScope(Dispatchers.IO).launch {  
9        try {  
10            // Publish the message to the channel  
11            val channel = pubnub.channel(myChannel)  
12            val result = channel.publish(myMessage).sync()  
13              
14            // Update UI on the main thread  
15            runOnUiThread {  
16                Toast.makeText(  
17                    this@PubNubActivity,   
18                    "Message sent successfully!",   
19                    Toast.LENGTH_SHORT  
20                ).show()  
21            }  
22        } catch (e: Exception) {  
23            // Handle error on the main thread  
24            runOnUiThread {  
25                Toast.makeText(  
26                    this@PubNubActivity,   
27                    "Failed to send message: ${e.message}",   
28                    Toast.LENGTH_SHORT  
29                ).show()  
30            }  
31        }  
32    }  
33}  
34
  
35// Add this to your Activity's UI setup  
36private fun setupUI() {  
37    // Set up a button click listener to send messages  
38    findViewByIdButton>(R.id.sendButton).setOnClickListener {  
39        val messageInput = findViewByIdEditText>(R.id.messageInput)  
40        val messageText = messageInput.text.toString()  
41          
42        if (messageText.isNotEmpty()) {  
43            sendMessage(messageText)  
44            messageInput.text.clear()  
45        }  
46    }  
47}  

```

- Non-mobile platforms

```
1
  

```

### Run the app

- Android app development: Build and run on a device or emulator.

- Non-mobile platforms: Run with gradle run.

Expected output:

```
`1Message to send: {"msg":"Hello, world"}  // First, we see the message we're about to send  
2Connected/Reconnected                     // Then we get confirmation that we're connected to PubNub  
3Received message {"msg":"Hello, world"}   // We receive the message we just sent (because we're subscribed to the same channel)  
4Message sent, timetoken: 16967543908123456  // Finally, we see the timetoken confirming the message was sent successfully  
`
```

## Complete example

```
1
  

```

### Troubleshooting

No connection:
- Check internet and firewall.
- Verify publish/subscribe keys.

Message not received:
- Confirm channel name.
- Check for publish errors.
- Allow time for delivery.

Build errors:
- Confirm dependency setup and Kotlin version.
- Verify imports.

For Android-specific issues (ProGuard, API compatibility), see Kotlin SDK Troubleshooting.

## Next steps

- Kotlin Chat SDK
- Presence
- Message Persistence
- Access Manager
- Digital Health Reference Implementation
- GitHub repository for samples
- SDK reference documentation
- Support portal

Last updated on Sep 3, 2025