# Dart API & SDK Docs 7.0.0

Core concepts shown: setting up a connection, sending messages, and receiving messages in real time with Flutter and non-Flutter Dart. Use separate keysets for dev/prod.

## Overview

The Dart SDK provides a simple interface for PubNub real-time messaging across:
- Flutter app development (mobile/web)
- Non-Flutter platforms (server-side, CLI)

Lifecycle and UI differ, but core API usage is the same.

## Prerequisites

- Basic Dart knowledge
- Flutter SDK or Dart SDK installed
- IDE (VS Code, Android Studio, etc.)
- PubNub account and keyset

## Setup

### Get your PubNub keys

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup).
- Create an app and retrieve publish/subscribe keys.
- Prefer separate keysets for dev/prod.

### Install the SDK

- Flutter app development
- Non-Flutter platforms

To integrate PubNub into your Flutter project, add this dependency to your `pubspec.yaml` file:

```
`1dependencies:  
2  pubnub: 7.0.0  
3  flutter:  
4    sdk: flutter  
`
```

Then run:

```
`1flutter pub get  
`
```

Don't forget to add internet permission:

For Android, add to your `AndroidManifest.xml`:

```
`1uses-permission android:name="android.permission.INTERNET" />  
`
```

For iOS, no additional steps are needed as internet access is permitted by default.

To integrate PubNub into your Dart project, add this dependency to your `pubspec.yaml` file:

```
`1dependencies:  
2  pubnub: 7.0.0  
`
```

Then run:

```
`1dart pub get  
`
```

#### Source code

Clone the [GitHub repository](https://github.com/pubnub/dart):

```
`1git clone https://github.com/pubnub/dart  
`
```

View the [supported platforms](/docs/sdks/dart/platform-support) for compatibility details.

## Steps

### Initialize PubNub

- Flutter app development
- Non-Flutter platforms

Flutter minimum configuration (replace demo keys with your own):

```
1// Import required packages  
2import 'package:flutter/material.dart';  
3import 'package:pubnub/pubnub.dart';  
4
  
5class PubNubApp extends StatefulWidget {  
6  @override  
7  _PubNubAppState createState() => _PubNubAppState();  
8}  
9
  
10class _PubNubAppState extends StatePubNubApp> {  
11  // PubNub instance  
12  late PubNub pubnub;  
13  // Subscription for messages  
14  late Subscription subscription;  
15  // Channel name  
16  final String channel = "my_channel";  
17  // Messages list  
18  ListString> messages = [];  
19
  
20  @override  
21  void initState() {  
22    super.initState();  
23      
24    // Initialize PubNub  
25    pubnub = PubNub(  
26      defaultKeyset: Keyset(  
27        subscribeKey: 'demo', // Replace with your subscribe key  
28        publishKey: 'demo',   // Replace with your publish key  
29        userId: UserId('flutter_user'),  
30      ),  
31    );  
32      
33    // Setup PubNub functionality  
34    setupPubNub();  
35  }  
36    
37  void setupPubNub() {  
38    // We'll add subscription code here  
39  }  
40    
41  @override  
42  void dispose() {  
43    // Clean up resources  
44    subscription.dispose();  
45    super.dispose();  
46  }  
47
  
48  @override  
49  Widget build(BuildContext context) {  
50    // UI implementation will go here  
51    return Scaffold(  
52      appBar: AppBar(  
53        title: Text('PubNub Flutter Example'),  
54      ),  
55      body: Center(  
56        child: Text('PubNub initialized'),  
57      ),  
58    );  
59  }  
60}  
```

Non-Flutter minimum configuration:

```
1// Import required packages  
2import 'package:pubnub/pubnub.dart';  
3
  
4// Create PubNub instance with default keyset  
5var pubnub = PubNub(  
6  defaultKeyset: Keyset(  
7    subscribeKey: 'demo', // Replace with your subscribe key  
8    publishKey: 'demo',   // Replace with your publish key  
9    userId: UserId('myUniqueUserId'),  
10  ),  
11);  
```

See [Configuration](/docs/sdks/dart/api-reference/configuration) for more.

### Set up event listeners

Listeners react to messages and presence.

- Flutter app development
- Non-Flutter platforms

Flutter:

```
`1void setupPubNub() {  
2  // Create a subscription to the channel  
3  subscription = pubnub.subscribe(channels: {channel});  
4    
5  // Set up message listener  
6  subscription.messages.listen((message) {  
7    // Update UI with the received message  
8    setState(() {  
9      messages.add(message.content.toString());  
10    });  
11      
12    print('Received message: ${message.content}');  
13  });  
14    
15  // You can also listen for presence events  
16  subscription.presence.listen((presence) {  
17    print('Presence event: ${presence.event}');  
18  });  
19}  
`
```

Update Flutter UI to display messages:

```
`1@override  
2Widget build(BuildContext context) {  
3  return Scaffold(  
4    appBar: AppBar(  
5      title: Text('PubNub Flutter Example'),  
6    ),  
7    body: Column(  
8      children: [  
9        Expanded(  
10          child: ListView.builder(  
11            itemCount: messages.length,  
12            itemBuilder: (context, index) {  
13              return ListTile(  
14                title: Text(messages[index]),  
15              );  
16            },  
17          ),  
18        ),  
19        Padding(  
20          padding: const EdgeInsets.all(8.0),  
21          child: Row(  
22            children: [  
23              Expanded(  
24                child: TextField(  
25                  controller: _messageController,  
26                  decoration: InputDecoration(  
27                    hintText: 'Type a message',  
28                  ),  
29                ),  
30              ),  
31              IconButton(  
32                icon: Icon(Icons.send),  
33                onPressed: () {  
34                  sendMessage(_messageController.text);  
35                  _messageController.clear();  
36                },  
37              ),  
38            ],  
39          ),  
40        ),  
41      ],  
42    ),  
43  );  
44}  
`
```

Add the controller:

```
`final TextEditingController _messageController = TextEditingController();  
`
```

Non-Flutter:

```
1// Define the channel  
2final channel = "my_channel";  
3
  
4// Create a subscription to the channel  
5final subscription = pubnub.subscribe(channels: {channel});  
6
  
7// Set up message listener  
8subscription.messages.listen((message) {  
9  print('Received message: ${message.content}');  
10});  
11
  
12// You can also listen for presence events  
13subscription.presence.listen((presence) {  
14  print('Presence event: ${presence.event}');  
15});  
```

See [Listeners](/docs/sdks/dart/api-reference/configuration#listeners) for details.

### Publish messages

Messages are JSON-serializable and must be smaller than 32 KiB.

- Flutter app development
- Non-Flutter platforms

Flutter:

```
`1Futurevoid> sendMessage(String text) async {  
2  if (text.isEmpty) return;  
3    
4  try {  
5    // Publish the message to the channel  
6    final result = await pubnub.publish(  
7      channel,  
8      {'text': text, 'sender': 'flutter_user'},  
9    );  
10      
11    print('Published message with timetoken: ${result.timetoken}');  
12  } catch (e) {  
13    print('Failed to publish message: $e');  
14      
15    // Show error to user  
16    ScaffoldMessenger.of(context).showSnackBar(  
17      SnackBar(content: Text('Failed to send message: $e')),  
18    );  
19  }  
20}  
`
```

Non-Flutter:

```
1Futurevoid> publishMessage() async {  
2  try {  
3    // Message to publish  
4    final message = {'text': 'Hello, world!', 'sender': 'dart_user'};  
5      
6    print('Message to send: $message');  
7      
8    // Publish the message to the channel  
9    final result = await pubnub.publish(channel, message);  
10    print('Message "${result.description}" with timetoken: ${result.timetoken}');  
11  } catch (e) {  
12    print('Error publishing message: $e');  
13  }  
14}  
15
  
16// Call the function  
17await publishMessage();  
```

### Run the app

- Flutter app development
- Non-Flutter platforms

Non-Flutter:

```
`dart pubnub_example.dart  
`
```

Expected output:

```
`1Message to send: {text: Hello, world!, sender: dart_user}  
2Received message: {text: Hello, world!, sender: dart_user}  
3Message "Sent" with timetoken: 16967543908123456  
`
```

## Complete example

- Flutter app development
- Non-Flutter platforms

Flutter:

```
1import 'package:flutter/material.dart';  
2import 'package:pubnub/pubnub.dart';  
3
  
4void main() {  
5  runApp(MaterialApp(home: PubNubApp()));  
6}  
7
  
8class PubNubApp extends StatefulWidget {  
9  @override  
10  _PubNubAppState createState() => _PubNubAppState();  
11}  
12
  
13class _PubNubAppState extends StatePubNubApp> {  
14  // PubNub instance  
15  late PubNub pubnub;  
16  // Subscription for messages  
17  late Subscription subscription;  
18  // Channel name  
19  final String channel = "my_channel";  
20  // Messages list  
21  ListString> messages = [];  
22  // Text controller  
23  final TextEditingController _messageController = TextEditingController();  
24
  
25  @override  
26  void initState() {  
27    super.initState();  
28      
29    // Step 1: Initialize PubNub  
30    pubnub = PubNub(  
31      defaultKeyset: Keyset(  
32        subscribeKey: 'demo', // Replace with your subscribe key  
33        publishKey: 'demo',   // Replace with your publish key  
34        userId: UserId('flutter_user'),  
35      ),  
36    );  
37      
38    // Step 2: Setup PubNub functionality  
39    setupPubNub();  
40  }  
41    
42  void setupPubNub() {  
43    // Step 3: Create a subscription to the channel  
44    subscription = pubnub.subscribe(channels: {channel});  
45      
46    // Step 4: Set up message listener  
47    subscription.messages.listen((message) {  
48      // Update UI with the received message  
49      setState(() {  
50        if (message.content is Map) {  
51          messages.add('${message.content['sender']}: ${message.content['text']}');  
52        } else {  
53          messages.add(message.content.toString());  
54        }  
55      });  
56        
57      print('Received message: ${message.content}');  
58    });  
59  }  
60    
61  Futurevoid> sendMessage(String text) async {  
62    if (text.isEmpty) return;  
63      
64    try {  
65      // Step 5: Publish the message to the channel  
66      final result = await pubnub.publish(  
67        channel,   
68        {'text': text, 'sender': 'flutter_user'},  
69      );  
70        
71      print('Published message with timetoken: ${result.timetoken}');  
72    } catch (e) {  
73      print('Failed to publish message: $e');  
74        
75      // Show error to user  
76      ScaffoldMessenger.of(context).showSnackBar(  
77        SnackBar(content: Text('Failed to send message: $e')),  
78      );  
79    }  
80  }  
81    
82  @override  
83  void dispose() {  
84    // Step 6: Clean up resources  
85    subscription.dispose();  
86    _messageController.dispose();  
87    super.dispose();  
88  }  
89
  
90  @override  
91  Widget build(BuildContext context) {  
92    return Scaffold(  
93      appBar: AppBar(  
94        title: Text('PubNub Flutter Example'),  
95      ),  
96      body: Column(  
97        children: [  
98          Expanded(  
99            child: messages.isEmpty   
100                ? Center(child: Text('No messages yet'))  
101                : ListView.builder(  
102                    itemCount: messages.length,  
103                    itemBuilder: (context, index) {  
104                      return ListTile(  
105                        title: Text(messages[index]),  
106                      );  
107                    },  
108                  ),  
109          ),  
110          Padding(  
111            padding: const EdgeInsets.all(8.0),  
112            child: Row(  
113              children: [  
114                Expanded(  
115                  child: TextField(  
116                    controller: _messageController,  
117                    decoration: InputDecoration(  
118                      hintText: 'Type a message',  
119                      border: OutlineInputBorder(),  
120                    ),  
121                  ),  
122                ),  
123                SizedBox(width: 8),  
124                ElevatedButton(  
125                  onPressed: () {  
126                    sendMessage(_messageController.text);  
127                    _messageController.clear();  
128                  },  
129                  child: Text('Send'),  
130                ),  
131              ],  
132            ),  
133          ),  
134        ],  
135      ),  
136    );  
137  }  
138}  
```

Non-Flutter:

```
1import 'package:pubnub/pubnub.dart';  
2
  
3Futurevoid> main() async {  
4  // Step 1: Initialize PubNub with configuration  
5  final pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo', // Replace with your subscribe key  
8      publishKey: 'demo',   // Replace with your publish key  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Step 2: Define the channel  
14  final channel = "my_channel";  
15    
16  // Step 3: Create a subscription for the channel  
17  final subscription = pubnub.subscribe(channels: {channel});  
18
  
19  // Step 4: Set up message listener  
20  subscription.messages.listen((message) {  
21    print('Received message: ${message.content}');  
22  });  
23
  
24  // Wait for connection to establish before publishing  
25  await Future.delayed(Duration(seconds: 1));  
26    
27  try {  
28    // Step 5: Create and publish a message  
29    final message = {'text': 'Hello, world!', 'sender': 'dart_user'};  
30    print('Message to send: $message');  
31      
32    // Publish the message to the channel  
33    final result = await pubnub.publish(channel, message);  
34    print('Message "${result.description}" with timetoken: ${result.timetoken}');  
35  } catch (e) {  
36    print('Error publishing message: $e');  
37  }  
38
  
39  // Keep the program running to receive the published message  
40  await Future.delayed(Duration(seconds: 2));  
41
  
42  // Step 6: Clean up before exiting  
43  await subscription.dispose();  
44  print('Cleanup complete.');  
45}  
```

### Run the app

- Flutter app development
- Non-Flutter platforms

To run your Dart application:

1. $1

2. $1

Expected output:

```
`1Message to send: {text: Hello, world!, sender: dart_user}  
2Received message: {text: Hello, world!, sender: dart_user}  
3Message "Sent" with timetoken: 16967543908123456  
4Cleanup complete.  
`
```

You've subscribed to a channel and published your first message.

### Troubleshooting

- No connection: check internet, keys, and firewall.
- Message not received: verify channel, check publish success, allow time for delivery.
- Build errors: confirm dependency in pubspec.yaml, run dart/flutter pub get, verify imports.

## Next steps

- Build chat with typing indicators and read receipts.
- Use [Presence](/docs/sdks/dart/api-reference/presence).
- Enable [Message Persistence](/docs/sdks/dart/api-reference/storage-and-playback).
- Secure with [Access Manager](/docs/sdks/dart/api-reference/access-manager).
- Explore the [GitHub repo](https://github.com/pubnub/dart) and [Flutter Simple Chat](https://github.com/pubnub/flutter-ref-app-simple-chat).
- Read the [SDK reference](/docs/sdks/dart/api-reference/configuration) or visit the [support portal](https://support.pubnub.com/).

Last updated on Sep 3, 2025.