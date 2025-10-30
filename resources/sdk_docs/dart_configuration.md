# Configuration API for Dart SDK

Dart complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration

Create configurations for different subscribe keys using a Keyset object. Use KeysetStore to store your Keysets. Ensure names are unique; only one keyset can be the default.

### Method(s)

```
`1Keyset(  
2  {String subscribeKey,  
3  String publishKey,  
4  String secretKey,  
5  String authKey,  
6  UserId userId}  
7)   
`
```

Keyset properties:
- subscribeKey
  - Type: String; Default: n/a
  - subscribeKey from the Admin Portal.
- publishKey
  - Type: String; Default: n/a
  - publishKey from the Admin Portal (only required if publishing).
- secretKey
  - Type: String; Default: n/a
  - secretKey used for administrative tasks.
- authKey
  - Type: String; Default: n/a
  - If Access Manager is enabled, the client includes this key with restricted requests.
- userId
  - Type: String; Default: n/a
  - userId to use. Set a unique identifier for the user or device. UTF-8 string up to 92 alphanumeric characters. Required to connect.
- cipherKey
  - Type: String; Default: n/a
  - Deprecated on Keyset; pass to crypto instead. If passed, all communications to/from PubNub will be encrypted.
- UUID
  - Type: String; Default: n/a
  - Deprecated; use userId instead.

### Sample code

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it for the lifetime of the user or device.

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() {  
4  // Configure the Keyset with required parameters  
5  final myKeyset = Keyset(  
6    subscribeKey: 'demo',   
7    publishKey: 'demo',   
8    userId: UserId('myUniqueUserId')  
9  );  
10
  
11  print('Keyset configured with subscribeKey: ${myKeyset.subscribeKey}');  
12}  

```

## Initialization

Add the SDK to your project using one of the procedures in Getting Started.

### Description

Instantiate PubNub with a default Keyset. Keyset resolution:
- If provided, the keyset parameter is used.
- Otherwise, the method uses the using parameter.
- Otherwise, the method uses the default keyset.
- If no default keyset is defined, the method throws an error.

### Methods

```
`1PubNub(  
2  {Keyset defaultKeyset,   
3  INetworkingModule networking,  
4  IParserModule parser,   
5  ICryptoModule crypto}  
6)   
`
```

Constructor arguments:
- defaultKeyset
  - Type: Keyset; Default: n/a
  - The default keyset to use.
- networking
  - Type: INetworkingModule; Default: NetworkingModule
  - Configure custom origin, SSL, and retry policy for subscribe operations.
  - Default retry policy: RetryPolicy.exponential (subscribe only).
  - RetryPolicy options:
    - RetryPolicy.none()
    - RetryPolicy.linear({backoff, maxRetries, maximumDelay})
    - RetryPolicy.exponential({maxRetries, maximumDelay})
  - See SDK connection lifecycle.
- parser
  - Type: IParserModule; Default: ParserModule
- crypto
  - Type: ICryptoModule; Default: CryptoModule
  - Cryptography module used for encryption/decryption of messages and files. Takes the cipherKey parameter. See cryptoModule.

#### cryptoModule

Encrypts and decrypts messages and files. From 4.2.4 onward, algorithms are configurable.
- Options: legacy 128-bit encryption (default if cipherKey set on config and cryptoModule not provided) and recommended 256-bit AES-CBC.
- See Message Encryption, File Encryption, and the Encryption page for configuration and utilities.

##### Legacy encryption with 128-bit cipher key entropy

To keep legacy encryption, no change needed. To use 256-bit AES-CBC, explicitly set it in PubNub config.

### Sample code

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Initialize PubNub with the configured Keyset  
5  final myKeyset = Keyset(  
6    subscribeKey: 'demo',   
7    publishKey: 'demo',   
8    userId: UserId('myUniqueUserId')  
9  );  
10    
11  final pubnub = PubNub(defaultKeyset: myKeyset);  
12
  
13}  

```

### Returns

Initialization returns the PubNub instance for invoking PubNub APIs like publish(), subscribe(), etc.

### Other examples

#### Initialize a non-secure client

```
`1final pubnub =  
2  PubNub(  
3    defaultKeyset: myKeyset,   
4    networking: NetworkingModule(ssl: false));  
`
```

#### Initialization for a Read-Only client

```
`1final pubnub = PubNub(  
2  defaultKeyset:  
3    Keyset(subscribeKey: 'mysubscribeKey',  
4    userId: UserId('myUniqueUserId')));  
`
```

#### Initialization with custom origin

```
`1final pubnub = PubNub(  
2  defaultKeyset: myKeyset,  
3  networking: NetworkingModule(origin: 'example.com', ssl: true),  
4);  
`
```

#### Initializing with SSL enabled

```
`1final pubnub =  
2  PubNub(  
3    defaultKeyset: myKeyset,  
4    networking: NetworkingModule(ssl: true));  
`
```

#### Initializing with Access Manager

##### Requires Access Manager add-on

##### Secure your secretKey

Use secretKey only on secure server-side platforms. With secretKey, the client gets root Access Manager permissions (signs all Access Manager messages).

```
`1final pubnub = PubNub(  
2  defaultKeyset: Keyset(  
3    subscribeKey: 'mySubscribeKey',  
4    secretKey: 'my_secretkey',  
5    userId: UserId('myUniqueUserId')));  
`
```

## Event listeners

Receive connectivity status, message, presence, and other notifications via listeners. A Subscription is required.

### Listeners

- message
- signal
- objects
- messageAction
- file

```
1subscription.messages.listen((envelope) {  
2    switch (envelope.messageType) {  
3      case MessageType.normal:  
4          print('${envelope.publishedBy} sent a message: ${envelope.content}');  
5          print('${envelope.channel}'); //to display the channel that message was sent on  
6          print('${envelope.publishedAt}'); // to display timetoken of the message received  
7          print('${envelope.content}'); // to display content of the message  
8          print('${envelope.uuid}'); // to display the uuid of the sender  
9          break;  
10      case MessageType.signal:  
11          print('${envelope.publishedBy} sent a signal message: ${envelope.content}');  
12          print('${envelope.channel}'); //to display the channel that message was sent on  
13          print('${envelope.publishedAt}'); // to display timetoken of the message received  
14          print('${envelope.content}'); // to display content of the message  
15          print('${envelope.uuid}'); // to display the uuid of the sender  
16        break;  
17      case MessageType.objects:  
18          print('object event received from ${envelope.publishedBy} with data ${envelope.payload['data']}');  
19          print('${envelope.channel}'); //to display the channel that message was sent on  
20          print('${envelope.publishedAt}'); // to display timetoken of the message received  
21          print('${envelope.content}'); // to display content of the message  
22          print('${envelope.uuid}'); // to display the uuid of the sender  
23        break;  
24      case MessageType.messageAction:  
25          print('message action event ${envelope.payload['event']} received with data ${envelope.payload['data']}');  
26          print('${envelope.channel}'); //to display the channel that message was sent on  
27          print('${envelope.publishedAt}'); // to display timetoken of the message received  
28          print('${envelope.content}'); // to display content of the message  
29          print('${envelope.uuid}'); // to display the uuid of the sender  
30        break;  
31      case MessageType.file:  
32          var fileInfo = envelope.payload['file'];  
33          var id = fileInfo['id']; // unique file id  
34          var name = fileInfo['name']; // file name  
35          print('${envelope.publishedBy} sends file $name with message  ${envelope.payload['message']}');  
36          print('${envelope.channel}'); //to display the channel that message was sent on  
37          print('${envelope.publishedAt}'); // to display timetoken of the message received  
38          print('${envelope.content}'); // to display content of the message  
39          print('${envelope.uuid}'); // to display the uuid of the sender  
40        break;  
41      default:  
42        print('${envelope.publishedBy} sent a message: ${envelope.content}');  
43    }  
44  });  
45
  
46  subscription.presence.listen((event) {  
47      print('''Presence Event with action: ${event.action},  
48      received from uuid: ${event.uuid}  
49      with time token: ${event.timetoken},  
50      Total Occupancy now is: ${event.occupancy}  
51      ''');  
52  });  
53
  
54var envelope =  
55    await subscription.messages.firstWhere((envelope) => envelope.channel == 'my_channel');  

```

## userID

Set/get a user ID.

### Methods

```
`1var myKeyset =  
2  Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'));  
`
```

- userId
  - Type: String; Default: n/a
  - User ID to be used as a device identifier.

### Sample code

```
1final pubnub = PubNub(  
2    defaultKeyset: Keyset(  
3        subscribeKey: 'mySubscribeKey',  
4        userId: UserId('myUniqueUserId')));  
5
  
6// to know which userId is set  
7var userId = pubnub.keysets.defaultKeyset.userId;  

```

## Authentication key

Setter and getter for users' authentication key.

### Method(s)

```
`1var myKeyset = Keyset(  
2  subscribeKey: 'subscribeKey',  
3  authKey: 'myAuthkey',  
4  userId: UserId('myUniqueUserId'));  
`
```

- authKey
  - Type: String
  - If Access Manager is utilized, client will use this authKey in all restricted requests.

### Sample code

```
`1final pubnub = PubNub(  
2  defaultKeyset: Keyset(  
3    subscribeKey: 'mySubscribeKey',  
4    authKey: 'myAuthkey',  
5    userId: UserId('myUniqueUserId')));  
`
```

## Filter expression

##### Requires Stream Controller add-on

Stream filtering allows a subscriber to receive only messages that satisfy the filter.

### Method(s)

```
`1// to know which filter expression is set  
2var filterExpression = pubnub.keysets.defaultKeyset.filterExpression;  
`
```

- filterExpression
  - Type: String
  - PSV2 feature to subscribe with a custom filter expression.

### Sample code

```
1var myKeyset =  
2    Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'))  
3    ..filterExpression = 'such=wow';  
4
  
5final pubnub = PubNub(defaultKeyset: myKeyset);  

```

## Handling disconnects

The client may disconnect due to network conditions. By default, the client reconnects exponentially for subscribe connections only. See SDK connection lifecycle.

### Retry policy

Configure subscribe retry policy on NetworkingModule. Non-subscribe requests never retry. Set the policy during PubNub construction.

Default: exponential retry for subscribe operations. Retries are attempted on network issues (host down, host lookup failed, timeouts, unknown HTTP exceptions). maxRetries applies to all except timeouts. Use RetryPolicy.none() to disable all retries.

```
`1var pubnub = PubNub(  
2    networking:  
3        NetworkingModule(retryPolicy: RetryPolicy.exponential(maxRetries: 10)));  
`
```

Available policies:
- RetryPolicy.exponential({int? maxRetries, int? maximumDelay});
- RetryPolicy.linear({int? backoff, int? maxRetries, int? maximumDelay})

Arguments:
- maximumDelay (int): Max milliseconds to wait before retry.
- backoff (int): Backoff amount in milliseconds.
- maxRetries (int): Number of max retries.

#### Examples

Exponential with custom limits:

```
`1final pubnub = PubNub(  
2  defaultKeyset: myKeyset,  
3  networking: NetworkingModule(  
4    retryPolicy: RetryPolicy.exponential(  
5      maxRetries: 5,  
6      maximumDelay: 120000, // 120s cap  
7    ),  
8  ),  
9);  
`
```

Linear backoff with cap:

```
`1final pubnub = PubNub(  
2  defaultKeyset: myKeyset,  
3  networking: NetworkingModule(  
4    retryPolicy: RetryPolicy.linear(  
5      backoff: 200,          // ms per try (plus jitter)  
6      maxRetries: 8,  
7      maximumDelay: 5000,    // ms cap  
8    ),  
9  ),  
10);  
`
```

Disable retries entirely:

```
`1final pubnub = PubNub(**2  defaultKeyset: myKeyset,  
3  networking: NetworkingModule(  
4    retryPolicy: RetryPolicy.none(),  
5  ),  
6);  
`
```