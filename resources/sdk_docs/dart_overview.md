# Dart API & SDK Docs 5.2.1 (Overview)

Minimal reference to get PubNub working in any Dart or Flutter project.  
Two paths are shown below; replace `demo` keys with your own.

---

## Prerequisites
• Dart or Flutter SDK installed  
• PubNub account (publish & subscribe keys)

---

## Setup

### Get your PubNub keys
1. Log in to the PubNub Admin Portal.  
2. Create / select an app → copy publish & subscribe keys.

### Install the SDK  
<details><summary>Flutter</summary>

Add to `pubspec.yaml`:

```
`dependencies:  
  pubnub: 5.2.1  
  flutter:  
    sdk: flutter  
`
```

Fetch:

```
`flutter pub get  
`
```

Android internet permission:

```
`uses-permission android:name="android.permission.INTERNET" />  
`
```
</details>

<details><summary>Non-Flutter (pure Dart)</summary>

```
`dependencies:  
  pubnub: 5.2.1  
`
```

```
`dart pub get  
`
```
</details>

Source code: https://github.com/pubnub/dart

---

## Steps

### 1. Initialize PubNub  
<details><summary>Flutter</summary>

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
</details>

<details><summary>Non-Flutter</summary>

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
</details>

### 2. Set up event listeners  
<details><summary>Flutter</summary>

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

```
`final TextEditingController _messageController = TextEditingController();  
`
```
</details>

<details><summary>Non-Flutter</summary>

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
</details>

### 3. Publish messages  
<details><summary>Flutter</summary>

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
</details>

<details><summary>Non-Flutter</summary>

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
</details>

### 4. Run the app  
<details><summary>Non-Flutter</summary>

```
`dart pubnub_example.dart  
`
```

Expected output:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
`
```
</details>

---

## Complete examples  
<details><summary>Flutter (truncated)</summary>

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
</details>

<details><summary>Pure Dart (truncated)</summary>

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
</details>

Sample output:

```
`Message to send: {text: Hello, world!, sender: dart_user}  
Received message: {text: Hello, world!, sender: dart_user}  
Message "Sent" with timetoken: 16967543908123456  
Cleanup complete.  
`
```

---

## Troubleshooting (quick)

• No connection → check keys, internet, firewalls  
• Message not received → verify channel & publish success  
• Build errors → confirm dependency & imports, run `pub get`

---

## Next steps

1. Presence, typing indicators, storage & playback, Access Manager  
2. Example apps:  
   • GitHub Dart SDK  
   • Flutter Simple Chat  
3. Docs & community: Discord, support portal, AI assistant

_Last updated May 7 2025_