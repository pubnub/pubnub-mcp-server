# PubNub Dart SDK – Configuration (Condensed)

## 1. `Keyset`

Use one `Keyset` per subscribe key. Store them in a `KeysetStore`; only one can be the default.

```dart
Keyset(
  {String subscribeKey,
  String publishKey,
  String secretKey,
  String authKey,
  UserId userId}
)
```

Property | Type | Default | Notes
---------|------|---------|------
subscribeKey | String | – | Required.
publishKey   | String | – | Needed for publishing.
secretKey    | String | – | Needed only for Access-Manager admin tasks.
authKey      | String | – | Used in all restricted requests when Access Manager is enabled.
userId       | String | – | REQUIRED. Persist a unique ID per user/device.
cipherKey    | String | – | Deprecated. Pass via `crypto` module instead.
UUID         | String | – | Deprecated. Use `userId`.

### Keyset example

```dart
import 'package:pubnub/pubnub.dart';

void main() {
  final myKeyset = Keyset(
    subscribeKey: 'demo',
    publishKey: 'demo',
    userId: UserId('myUniqueUserId'),
  );

  print('subscribeKey: ${myKeyset.subscribeKey}');
}
```

---

## 2. `PubNub` initialization

```dart
PubNub(
  {Keyset defaultKeyset,
  INetworkingModule networking,
  IParserModule parser,
  ICryptoModule crypto}
)
```

Arg | Type | Default | Purpose
----|------|---------|--------
defaultKeyset | Keyset | – | Used when no keyset is passed to a method.
networking | INetworkingModule | `NetworkingModule` | Configure `origin`, `ssl`, `retryPolicy`, etc.
parser | IParserModule | `ParserModule` | Override JSON parsing if needed.
crypto | ICryptoModule | `CryptoModule` | Encrypt/decrypt messages & files.

### Crypto module

* No explicit `crypto` ⇒ legacy 128-bit encryption if `cipherKey` supplied.  
* Recommended: 256-bit AES-CBC.

```dart
// 256-bit AES-CBC (recommended)
var cryptoModule = CryptoModule.aescbcCryptoModule(
    CipherKey.fromUtf8('enigma'));

// legacy 128-bit
var cryptoModule = CryptoModule.legacyCryptoModule(
    CipherKey.fromUtf8('enigma'));

// manual encryption
var cryptoModule = CryptoModule.aesCbcCryptoModule(
    CipherKey.fromUtf8('abcd'));
var encrypted = cryptoModule.encrypt('Hello'.codeUnits);
```

Older SDKs (< 4.2.4) cannot decrypt 256-bit AES-CBC data.

### Basic init

```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  final myKeyset = Keyset(
    subscribeKey: 'demo',
    publishKey: 'demo',
    userId: UserId('myUniqueUserId'),
  );

  final pubnub = PubNub(defaultKeyset: myKeyset);
}
```

Other init variants

```dart
// non-secure
final pubnub = PubNub(
  defaultKeyset: myKeyset,
  networking: NetworkingModule(ssl: false),
);

// read-only
final pubnub = PubNub(
  defaultKeyset: Keyset(
    subscribeKey: 'mysubscribeKey',
    userId: UserId('myUniqueUserId'),
  ),
);

// custom origin
final pubnub = PubNub(
  defaultKeyset: myKeyset,
  networking: NetworkingModule(origin: 'example.com', ssl: true),
);

// SSL enabled
final pubnub = PubNub(
  defaultKeyset: myKeyset,
  networking: NetworkingModule(ssl: true),
);

// Access-Manager admin (requires secretKey)
final pubnub = PubNub(
  defaultKeyset: Keyset(
    subscribeKey: 'mySubscribeKey',
    secretKey: 'my_secretkey',
    userId: UserId('myUniqueUserId'),
  ),
);
```

---

## 3. Event listeners (require a `Subscription`)

```dart
subscription.messages.listen((envelope) {
  switch (envelope.messageType) {
    case MessageType.normal:
      print('${envelope.publishedBy} sent: ${envelope.content}');
      break;
    case MessageType.signal:
      print('${envelope.publishedBy} signal: ${envelope.content}');
      break;
  }
});
```

Listener types: `message`, `signal`, `objects`, `messageAction`, `file`.

---

## 4. Runtime setters / getters

### userId

```dart
var myKeyset = Keyset(
  subscribeKey: 'subscribeKey',
  userId: UserId('myUniqueUserId'),
);

final pubnub = PubNub(defaultKeyset: myKeyset);
var currentUserId = pubnub.keysets.defaultKeyset.userId;
```

### authKey

```dart
var myKeyset = Keyset(
  subscribeKey: 'subscribeKey',
  authKey: 'myAuthkey',
  userId: UserId('myUniqueUserId'),
);

final pubnub = PubNub(defaultKeyset: myKeyset);
```

### Filter expression (requires Stream Controller add-on)

```dart
// set
var myKeyset = Keyset(
  subscribeKey: 'subscribeKey',
  userId: UserId('myUniqueUserId'),
)..filterExpression = 'such=wow';

final pubnub = PubNub(defaultKeyset: myKeyset);

// get
var filterExpression = pubnub.keysets.defaultKeyset.filterExpression;
```

---

## 5. Handling disconnects / retry policy

```dart
var pubnub = PubNub(
  networking: NetworkingModule(
    retryPolicy: RetryPolicy.exponential(maxRetries: 10),
  ),
);

// available
RetryPolicy.exponential({int? maxRetries, int? maximumDelay});
RetryPolicy.linear({int? backoff, int? maxRetries, int? maximumDelay});
```

---

Initialization returns a `PubNub` instance that you use to call API methods such as `publish()`, `subscribe()`, etc.