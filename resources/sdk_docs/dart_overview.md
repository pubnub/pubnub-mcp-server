# PubNub Dart SDK 5.2.1 – Quick Start

This condensed guide shows the minimum you need to:

1. Obtain keys  
2. Install the SDK  
3. Initialize PubNub  
4. Subscribe / listen  
5. Publish  
6. Run & test

All code blocks are unchanged from the original documentation.

---

## Prerequisites
• Dart or Flutter SDK installed  
• PubNub account with publish & subscribe keys  

---

## 1  Get PubNub keys
Create an app in the Admin Portal and copy the generated **publish** and **subscribe** keys.

---

## 2  Install the SDK

### Flutter
Add to `pubspec.yaml`:

```
`dependencies:  
  pubnub: 5.2.1  
  flutter:  
    sdk: flutter  
`
```

Then:

```
`flutter pub get  
`
```

Android requires:

```
`uses-permission android:name="android.permission.INTERNET" />  
`
```

### Non-Flutter (pure Dart)
Add to `pubspec.yaml`:

```
`dependencies:  
  pubnub: 5.2.1  
`
```

Then:

```
`dart pub get  
`
```

Source: <https://github.com/pubnub/dart>

---

## 3  Initialize PubNub

### Flutter (excerpt)

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

### Non-Flutter

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

---

## 4  Subscribe & listen

### Flutter

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

UI snippet:

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

Controller:

```
`final TextEditingController _messageController = TextEditingController();  
`
```

### Non-Flutter

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

---

## 5  Publish messages (≤ 32 KiB JSON)

### Flutter

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

### Non-Flutter

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

---

## 6  Run

Pure Dart:

```
`dart pubnub_example.dart  
`
```

Sample output:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
`
```

---

## Complete examples

### Flutter (truncated for brevity)

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

### Non-Flutter (truncated for brevity)

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

Output:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
Cleanup complete.  
`
```

---

## Troubleshooting (quick list)

• No connection → check keys, network, firewall  
• No message → verify channel name & publish result  
• Build errors → run `dart pub get` / `flutter pub get`, confirm imports  

---

## Next steps

• Presence, Storage, Access Manager  
• Sample apps: <https://github.com/pubnub/flutter-ref-app-simple-chat>  
• API reference: links throughout this doc  
• Community & support: Discord, support portal, AI assistant  

_Last updated: May 7 2025_