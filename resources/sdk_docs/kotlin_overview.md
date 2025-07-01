On this page
# Kotlin API & SDK Docs 10.5.2

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Kotlin application. Since Kotlin is commonly used across different platforms, we provide two implementation paths:

- **Android app development**: For developers building Android applications with Kotlin

- **Non-mobile platforms**: For developers using Kotlin in other environments (server-side, desktop, etc.)

The core PubNub concepts and API usage remain the same across both paths, but implementation details like lifecycle management and UI updates differ. Select the appropriate tab in each section to see platform-specific guidance.

##### Chat applications

If you want to create a mobile chat application on Android with PubNub, refer to [Kotlin Chat SDK](/docs/chat/kotlin-chat-sdk) for details on all available chat features.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Kotlin

- Android Studio or your preferred Kotlin IDE

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

- Android app development
- Non-mobile platforms

To integrate PubNub into your Android project, add this dependency to your app-level `build.gradle` file:

```
`implementation 'com.pubnub:pubnub-kotlin:10.5.2'  
  
// Optional: Add Kotlin coroutines for better async handling  
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4'  
`
```

Don't forget to add internet permission to your `AndroidManifest.xml`:

```
`uses-permission android:name="android.permission.INTERNET" />  
`
```

##### Pro tip

You can also add the dependency through the Android Studio UI:

- Right-click on your project.

- Select **Open Module Settings**.

- Go to the **Dependencies** tab.

- Click the **+** button.

- Search for `pubnub-kotlin`.

#### Configure ProGuard[​](#configure-proguard)

If you're using ProGuard, configure it as follows.

```
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
```

show all 65 linesChoose your preferred way to add the PubNub SDK to your project:

#### Maven[​](#maven)

To integrate PubNub into your project using Maven, add this dependency to you `pom.xml`:

```
`dependency>  
  groupId>com.pubnubgroupId>  
  artifactId>pubnub-kotlinartifactId>  
  version>10.5.2version>  
dependency>  
`
```

#### Gradle[​](#gradle)

To integrate PubNub into your project using Gradle, add this dependency to your `build.gradle` file:

```
`implementation 'com.pubnub:pubnub-kotlin:10.5.2'  
`
```

#### Source code[​](#source-code)

You can also download the source code directly from the [Kotlin SDK](https://github.com/pubnub/kotlin/) repository.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

- Android app development
- Non-mobile platforms

In Android Studio, create a new Android project with Kotlin support. Add PubNub initialization code to your main Activity or Fragment class. This is the minimum configuration you need to send and receive messages with PubNub in your Android application.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
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
```

show all 40 linesIn the IDE of your choice, create a new Kotlin project. In that project, create a new `App` class with the following content. This is the minimum configuration you need to send and receive messages with PubNub.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
`  
`
```

For more information, refer to the [Configuration](/docs/sdks/kotlin/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

There are two main types of listeners you'll need to set up:

- Status listener - for connection state changes and operational events

- Event listener - for messages and presence events

- Android app development
- Non-mobile platforms

In your Android application, add these methods to your Activity or Fragment.

```
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
```

show all 33 linesAdd the following code to set up these listeners:

```
`  
`
```

For more information, refer to the [Listeners](/docs/sdks/kotlin/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it. This is done in three steps:

1. $1

2. $1

3. $1

- Android app development
- Non-mobile platforms

Continue building on the `setupPubNub()` method in your Activity.

```
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
```

show all 54 linesLet's implement the subscription in your main function or class.

```
`  
`
```

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

- Android app development
- Non-mobile platforms

Add a method to publish messages to your Android Activity.

```
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
```

show all 47 linesLet's create a function to publish messages to a PubNub channel:

```
`  
`
```

### Run the app[​](#run-the-app)

- Android app development
- Non-mobile platforms

To test your Android application:

1. $1

2. $1

3. $1

4. $1

5. $1

To test the code from your `App.kt` file, run it with `gradle run` in the terminal. You can use the terminal that is built in your IDE or the one that your operating system provides.

When you run the application, you should see output similar to the following:

```
`Message to send: {"msg":"Hello, world"}  // First, we see the message we're about to send  
Connected/Reconnected                     // Then we get confirmation that we're connected to PubNub  
Received message {"msg":"Hello, world"}   // We receive the message we just sent (because we're subscribed to the same channel)  
Message sent, timetoken: 16967543908123456  // Finally, we see the timetoken confirming the message was sent successfully  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together.

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

Build errors
- Ensure you've added the PubNub dependency correctly.
- Check that you're using a compatible version of Kotlin.
- Make sure all imports are correct.

For Android-specific issues like ProGuard configuration problems or API compatibility errors, see our [Kotlin SDK Troubleshooting guide](/docs/sdks/kotlin/troubleshoot).

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Learn about the [Kotlin Chat SDK](/docs/chat/kotlin-chat-sdk) for ready-to-use chat features.

- Implement user [Presence](/docs/sdks/kotlin/api-reference/presence) to show who's online.

- Add typing indicators and read receipts.

- Try out [Presence](/docs/sdks/kotlin/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/kotlin/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/kotlin/api-reference/access-manager) to secure your channels.

- Look at the [Digital Health Reference Implementation](https://github.com/pubnub/kotlin-telemedicine-demo) for a real-world example.

- Explore our [GitHub repository](https://github.com/pubnub/kotlin/) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/kotlin/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Jun 18, 2025**