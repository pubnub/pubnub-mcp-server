On this page
# Dart API & SDK Docs 5.2.1

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Dart application. Since Dart is commonly used across different platforms, we provide two implementation paths:

- **Flutter app development**: For developers building mobile or web applications with Flutter

- **Non-Flutter platforms**: For developers using Dart in other environments (server-side, CLI, etc.)

The core PubNub concepts and API usage remain the same across both paths, but implementation details like lifecycle management and UI updates differ. Select the appropriate tab in each section to see platform-specific guidance.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Dart

- Flutter SDK or Dart SDK installed

- Your preferred IDE (VS Code, Android Studio, etc.)

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

- Flutter app development
- Non-Flutter platforms

To integrate PubNub into your Flutter project, add this dependency to your `pubspec.yaml` file:

```
`dependencies:  
  pubnub: 5.2.1  
  flutter:  
    sdk: flutter  
`
```

Then run:

```
`flutter pub get  
`
```

Don't forget to add internet permission:

For Android, add to your `AndroidManifest.xml`:

```
`uses-permission android:name="android.permission.INTERNET" />  
`
```

For iOS, no additional steps are needed as internet access is permitted by default.

To integrate PubNub into your Dart project, add this dependency to your `pubspec.yaml` file:

```
`dependencies:  
  pubnub: 5.2.1  
`
```

Then run:

```
`dart pub get  
`
```

#### Source code[​](#source-code)

You can also access the source code directly from the [Dart SDK](https://github.com/pubnub/dart) repository.

View the [supported platforms](/docs/sdks/dart/platform-support) for more information about compatibility.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

- Flutter app development
- Non-Flutter platforms

In your Flutter project, add the PubNub initialization code to your main application file. This is the minimum configuration you need to send and receive messages with PubNub in your Flutter application.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
`// Import required packages  
import 'package:flutter/material.dart';  
import 'package:pubnub/pubnub.dart';  
  
class PubNubApp extends StatefulWidget {  
  @override  
  _PubNubAppState createState() => _PubNubAppState();  
}  
  
class _PubNubAppState extends StatePubNubApp> {  
  // PubNub instance  
  late PubNub pubnub;  
  // Subscription for messages  
  late Subscription subscription;  
  // Channel name  
`
```

show all 60 linesIn the IDE of your choice, create a new Dart file with the following content. This is the minimum configuration you need to send and receive messages with PubNub.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
`// Import required packages  
import 'package:pubnub/pubnub.dart';  
  
// Create PubNub instance with default keyset  
var pubnub = PubNub(  
  defaultKeyset: Keyset(  
    subscribeKey: 'demo', // Replace with your subscribe key  
    publishKey: 'demo',   // Replace with your publish key  
    userId: UserId('myUniqueUserId'),  
  ),  
);  
`
```

For more information, refer to the [Configuration](/docs/sdks/dart/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

- Flutter app development
- Non-Flutter platforms

In your Flutter application, add this code to your `setupPubNub()` method:

```
`void setupPubNub() {  
  // Create a subscription to the channel  
  subscription = pubnub.subscribe(channels: {channel});  
    
  // Set up message listener  
  subscription.messages.listen((message) {  
    // Update UI with the received message  
    setState(() {  
      messages.add(message.content.toString());  
    });  
      
    print('Received message: ${message.content}');  
  });  
    
  // You can also listen for presence events  
`
```

show all 19 linesNow, let's update the `build` method to display messages:

```
`@override  
Widget build(BuildContext context) {  
  return Scaffold(  
    appBar: AppBar(  
      title: Text('PubNub Flutter Example'),  
    ),  
    body: Column(  
      children: [  
        Expanded(  
          child: ListView.builder(  
            itemCount: messages.length,  
            itemBuilder: (context, index) {  
              return ListTile(  
                title: Text(messages[index]),  
              );  
`
```

show all 44 linesDon't forget to add the controller:

```
`final TextEditingController _messageController = TextEditingController();  
`
```

Add the following code to set up listeners for messages:

```
`// Define the channel  
final channel = "my_channel";  
  
// Create a subscription to the channel  
final subscription = pubnub.subscribe(channels: {channel});  
  
// Set up message listener  
subscription.messages.listen((message) {  
  print('Received message: ${message.content}');  
});  
  
// You can also listen for presence events  
subscription.presence.listen((presence) {  
  print('Presence event: ${presence.event}');  
});  
`
```

For more information, refer to the [Publish and Subscribe](/docs/sdks/dart/api-reference/publish-and-subscribe) section of the SDK documentation.

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

- Flutter app development
- Non-Flutter platforms

Add a method to publish messages in your Flutter application:

```
`Futurevoid> sendMessage(String text) async {  
  if (text.isEmpty) return;  
    
  try {  
    // Publish the message to the channel  
    final result = await pubnub.publish(  
      channel,  
      {'text': text, 'sender': 'flutter_user'},  
    );  
      
    print('Published message with timetoken: ${result.timetoken}');  
  } catch (e) {  
    print('Failed to publish message: $e');  
      
    // Show error to user  
`
```

show all 20 linesHere's how to publish messages in a Dart application:

```
`Futurevoid> publishMessage() async {  
  try {  
    // Message to publish  
    final message = {'text': 'Hello, world!', 'sender': 'dart_user'};  
      
    print('Message to send: $message');  
      
    // Publish the message to the channel  
    final result = await pubnub.publish(channel, message);  
    print('Message "${result.description}" with timetoken: ${result.timetoken}');  
  } catch (e) {  
    print('Error publishing message: $e');  
  }  
}  
  
`
```
show all 17 lines

### Run the app[​](#run-the-app)

- Flutter app development
- Non-Flutter platforms

To test your Flutter application:

1. $1

2. $1

3. $1

4. $1

5. $1

To test your Dart application, save your code to a file (e.g., `pubnub_example.dart`) and run it with:

```
`dart pubnub_example.dart  
`
```

When you run the application, you should see output similar to the following:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together.

- Flutter app development
- Non-Flutter platforms

```
`import 'package:flutter/material.dart';  
import 'package:pubnub/pubnub.dart';  
  
void main() {  
  runApp(MaterialApp(home: PubNubApp()));  
}  
  
class PubNubApp extends StatefulWidget {  
  @override  
  _PubNubAppState createState() => _PubNubAppState();  
}  
  
class _PubNubAppState extends StatePubNubApp> {  
  // PubNub instance  
  late PubNub pubnub;  
`
```
show all 138 lines
```
`import 'package:pubnub/pubnub.dart';  
  
Futurevoid> main() async {  
  // Step 1: Initialize PubNub with configuration  
  final pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo', // Replace with your subscribe key  
      publishKey: 'demo',   // Replace with your publish key  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Step 2: Define the channel  
  final channel = "my_channel";  
    
`
```
show all 45 lines

### Run the app[​](#run-the-app-1)

- Flutter app development
- Non-Flutter platforms

To run your Flutter application:

1. $1

2. $1

3. $1

4. $1

To run your Dart application:

1. $1

2. $1

When you run the application, you should see output similar to the following:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
Cleanup complete.  
`
```

Congratulations! You've just subscribed to a channel and sent your first message with PubNub.

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
- Ensure you've added the PubNub dependency correctly in your pubspec.yaml.
- Run `dart pub get` or `flutter pub get` to update dependencies.
- Make sure all imports are correct.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with Dart. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Build a full-featured chat application with user presence and typing indicators.

- Implement user [Presence](/docs/sdks/dart/api-reference/presence) to show who's online.

- Add typing indicators and read receipts.

- Try out [Presence](/docs/sdks/dart/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/dart/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/dart/api-reference/access-manager) to secure your channels.

- Explore our [GitHub repository](https://github.com/pubnub/dart) for more code.

- Check out the [Flutter Simple Chat](https://github.com/pubnub/flutter-ref-app-simple-chat) sample app.

- Check out our [SDK reference documentation](/docs/sdks/dart/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **May 7, 2025**