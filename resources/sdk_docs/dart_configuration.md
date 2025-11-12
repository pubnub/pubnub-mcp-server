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
- subscribeKey (String, required): subscribeKey from the Admin Portal.
- publishKey (String): publishKey from the Admin Portal (required if publishing).
- secretKey (String): used for administrative tasks. Keep secure; server-side only.
- authKey (String): used with Access Manager for restricted requests.
- userId (String, required): unique UTF-8 identifier (up to 92 alphanumeric chars). Must be set to connect.
- cipherKey (String, deprecated): pass to crypto instead. If set, encrypts all communications.
- UUID (String, deprecated): use userId instead.

### Sample code

##### Required User ID

Always set the userId to uniquely identify the user or device that connects to PubNub. Persist it for the lifetime of the user/device.

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

Parameters:
- defaultKeyset (Keyset): default keyset to use.
- networking (INetworkingModule, default: NetworkingModule): configure custom origin, SSL, and subscribe retry policy.
  - Default subscribe retry policy: RetryPolicy.exponential.
  - Available:
    - RetryPolicy.none()
    - RetryPolicy.linear({backoff, maxRetries, maximumDelay})
    - RetryPolicy.exponential({maxRetries, maximumDelay})
- parser (IParserModule, default: ParserModule): parsing module.
- crypto (ICryptoModule, default: CryptoModule): encryption/decryption for messages/files. Takes cipherKey. See cryptoModule.

#### cryptoModule

Encrypts/decrypts messages and files. From 4.2.4 onward, you can configure algorithms. Two options:
- Legacy 128-bit encryption (default if cipherKey is set and cryptoModule not set).
- Recommended 256-bit AES-CBC.

For details and utilities, see Encryption docs.

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

PubNub instance for invoking APIs like publish(), subscribe(), etc.

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

Requires Access Manager add-on. Keep secretKey secure; use only on secure server-side platforms. Initializing with secretKey grants root Access Manager permissions.

```
`1final pubnub = PubNub(  
2  defaultKeyset: Keyset(  
3    subscribeKey: 'mySubscribeKey',  
4    secretKey: 'my_secretkey',  
5    userId: UserId('myUniqueUserId')));  
`
```

## Event listeners

Listeners notify connectivity status, message, and presence via a Subscription.

### Listeners

Available:
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

Set/get a user ID on the fly.

### Methods

```
`1var myKeyset =  
2  Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'));  
`
```

- userId (String): User ID to be used as a device identifier.

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

- authKey (String): If Access Manager is utilized, client uses this in all restricted requests.

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

Requires Stream Controller add-on. Apply a server-side filter to only receive messages that match the filter.

### Method(s)

```
`1// to know which filter expression is set  
2var filterExpression = pubnub.keysets.defaultKeyset.filterExpression;  
`
```

- filterExpression (String): PSV2 feature to subscribe with a custom filter expression.

### Sample code

```
1var myKeyset =  
2    Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'))  
3    ..filterExpression = 'such=wow';  
4
  
5final pubnub = PubNub(defaultKeyset: myKeyset);  

```

## Handling disconnects

The client may disconnect due to network conditions. By default, the client reconnects exponentially for subscribe connections only. Non-subscribe requests never retry.

### Retry policy

Configure subscribe retries via NetworkingModule. Set at PubNub construction time.

Default: exponential retry for subscribe operations. Retries occur on network-related diagnostics (host down, lookup failed, timeouts, unknown HTTP exceptions). maxRetries applies to all except timeouts. Use RetryPolicy.none() to disable all retries (including subscribe).

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
- maximumDelay (int): Max milliseconds to wait before a retry.
- backoff (int): Linear backoff in milliseconds.
- maxRetries (int): Max number of retries.

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