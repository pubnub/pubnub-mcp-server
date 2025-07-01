# PubNub Dart SDK – Configuration (concise)

## Keyset

```
`Keyset(  
  {String subscribeKey,  
  String publishKey,  
  String secretKey,  
  String authKey,  
  UserId userId}  
)   
`
```

Parameter | Type | Notes
----------|------|------
subscribeKey | String | Required.
publishKey | String | Needed for publish.
secretKey | String | Server-side (Access Manager, etc.).
authKey | String | Used when Access Manager is enabled.
userId | String | Required – unique per device/user (≤92 UTF-8 chars).  
cipherKey | String | **Deprecated** – pass via `crypto`.  
UUID | String | **Deprecated** – use `userId`.

Example

```
`import 'package:pubnub/pubnub.dart';  
  
void main() {  
  final myKeyset = Keyset(  
    subscribeKey: 'demo',   
    publishKey: 'demo',   
    userId: UserId('myUniqueUserId')  
  );  
  
  print('Keyset configured with subscribeKey: ${myKeyset.subscribeKey}');  
}  
`
```

---

## Initialization

```
`PubNub(  
  {Keyset defaultKeyset,   
  INetworkingModule networking,  
  IParserModule parser,   
  ICryptoModule crypto}  
)   
`
```

Arg | Type | Default
----|------|--------
defaultKeyset | Keyset | –
networking | INetworkingModule | `NetworkingModule`
parser | IParserModule | `ParserModule`
crypto | ICryptoModule | `CryptoModule`

Keyset selection order:  
1) `keyset`  2) `using`  3) defaultKeyset  → error if none.

### Crypto module

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
var cryptoModule = CryptoModule.aescbcCryptoModule(CipherKey.fromUtf8('enigma'));  
  
// encrypts with 128-bit cipher key entropy (legacy)  
var cryptoModule = CryptoModule.legacyCryptoModule(CipherKey.fromUtf8('enigma'));  
  
// partial encryption  
var cryptoModule = CryptoModule.aesCbcCryptoModule(CipherKey.fromUtf8('abcd'));  
var encrypted = cryptoModule.encrypt('Hello'.codeUnits);  
  
`
```

• 4.2.4+ defaults to legacy if only `cipherKey` supplied.  
• Older (<4.2.4) clients can’t decrypt AES-CBC 256.

### Usage

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  final myKeyset = Keyset(  
    subscribeKey: 'demo',   
    publishKey: 'demo',   
    userId: UserId('myUniqueUserId')  
  );  
    
  final pubnub = PubNub(defaultKeyset: myKeyset);  
}  
`
```

Returns a `PubNub` instance.

Other setups

```
`final pubnub =  
  PubNub(  
    defaultKeyset: myKeyset,   
    networking: NetworkingModule(ssl: false));                // non-secure  
  
final pubnub = PubNub(                                        // read-only
  defaultKeyset:  
    Keyset(subscribeKey: 'mysubscribeKey',  
    userId: UserId('myUniqueUserId')));  
  
final pubnub = PubNub(                                        // custom origin
  defaultKeyset: myKeyset,  
  networking: NetworkingModule(origin: 'example.com', ssl: true),  
);  
  
final pubnub =                                                // SSL on
  PubNub(  
    defaultKeyset: myKeyset,  
    networking: NetworkingModule(ssl: true));  
  
final pubnub = PubNub(                                        // Access Mgr
  defaultKeyset: Keyset(  
    subscribeKey: 'mySubscribeKey',  
    secretKey: 'my_secretkey',  
    userId: UserId('myUniqueUserId')));  
`
```

---

## Event listeners

```
`subscription.messages.listen((envelope) {  
    switch (envelope.messageType) {  
      case MessageType.normal:  
          print('${envelope.publishedBy} sent a message: ${envelope.content}');  
          print('${envelope.channel}');  
          print('${envelope.publishedAt}');  
          print('${envelope.content}');  
          print('${envelope.uuid}');  
          break;  
      case MessageType.signal:  
          print('${envelope.publishedBy} sent a signal message: ${envelope.content}');  
          print('${envelope.channel}');  
          print('${envelope.publishedAt}');  
          print('${envelope.content}');  
          print('${envelope.uuid}');  
`
```
(message, signal, objects, messageAction, file)

---

## userId helpers

```
`var myKeyset =  
  Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'));  
`
```

```
`final pubnub = PubNub(  
    defaultKeyset: Keyset(  
        subscribeKey: 'mySubscribeKey',  
        userId: UserId('myUniqueUserId')));  
  
var userId = pubnub.keysets.defaultKeyset.userId;  
`
```

---

## authKey

```
`var myKeyset = Keyset(  
  subscribeKey: 'subscribeKey',  
  authKey: 'myAuthkey',  
  userId: UserId('myUniqueUserId'));  
`
```

```
`final pubnub = PubNub(  
  defaultKeyset: Keyset(  
    subscribeKey: 'mySubscribeKey',  
    authKey: 'myAuthkey',  
    userId: UserId('myUniqueUserId')));  
`
```

---

## Filter expression (Stream Controller add-on)

```
`// to know which filter expression is set  
var filterExpression = pubnub.keysets.defaultKeyset.filterExpression;  
`
```

```
`var myKeyset =  
    Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'))  
    ..filterExpression = 'such=wow';  
  
final pubnub = PubNub(defaultKeyset: myKeyset);  
`
```

---

## Reconnect / Retry

```
`var pubnub = PubNub(  
    networking:  
        NetworkingModule(retryPolicy: RetryPolicy.exponential(maxRetries: 10)));  
`
```

Retry policies  
• `RetryPolicy.exponential({int? maxRetries, int? maximumDelay})`  
• `RetryPolicy.linear({int? backoff, int? maxRetries, int? maximumDelay})`

Argument | Type | Purpose
---------|------|--------
maximumDelay | int | Max ms before retry.
backoff | int | Linear backoff ms.
maxRetries | int | Retry count.

_Last updated: Jun 10 2025_