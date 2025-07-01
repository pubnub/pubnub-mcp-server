# Utility Methods API (Dart SDK)

## pause()
Force the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method
```dart
pause()
```
(No parameters)

### Example
```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
    ),
  );

  var channel = "getting_started";
  var subscription = pubnub.subscribe(channels: {channel});

  // Temporarily stop network traffic
  subscription.pause();
}
```

---

## resume()
Resume network communication after `pause()`.

### Method
```dart
resume()
```
(No parameters)

### Example
```dart
subscription.resume();
```

---

## Encrypt File
Encrypt byte data.

**Deprecated:** `cipherKey` overrides the crypto-module configuration and uses legacy 128-bit encryption. Prefer configuring a dedicated crypto module.

### Method
```dart
pubnub.files.encryptFile(
  List<int> bytes, {
  CipherKey? cipherKey,
  Keyset? keyset,
  String? using,
})
```

Parameter | Type | Description
--------- | ---- | -----------
`bytes` | `List<int>` | File bytes (required).
`cipherKey` | `CipherKey?` | Overrides `Keyset.cipherKey` (deprecated).
`keyset` | `Keyset?` | Override default keyset.
`using` | `String?` | Named keyset from `keysetStore`.

### Example
```dart
// Configure crypto module
var cryptoModule = CryptoModule.aesCbcCryptoModule(
  CipherKey.fromUtf8('abcd'),
);

// Encrypt file data
var encryptedFileData = cryptoModule.encrypt(fileData);
```

### Returns
`List<int>` — encrypted bytes.

---

## Decrypt File
Decrypt byte data.

**Deprecated:** Same `cipherKey` note as in Encrypt File.

### Method
```dart
pubnub.files.decryptFile(
  List<int> bytes, {
  CipherKey? cipherKey,
  Keyset? keyset,
  String? using,
})
```

Parameter | Type | Description
--------- | ---- | -----------
`bytes` | `List<int>` | File bytes (required).
`cipherKey` | `CipherKey?` | Overrides `Keyset.cipherKey` (deprecated).
`keyset` | `Keyset?` | Override default keyset.
`using` | `String?` | Named keyset from `keysetStore`.

### Example
```dart
var cryptoModule = CryptoModule.aesCbcCryptoModule(
  CipherKey.fromUtf8('abcd'),
);

var encryptedFileData = cryptoModule.encrypt(fileData);

// Decrypt
var decryptedFileData = cryptoModule.decrypt(encryptedFileData);

// Save decrypted file
File('decryptedFile.jpg').writeAsBytesSync(decryptedFileData);
```

### Returns
`List<int>` — decrypted bytes.

---

## time()
Retrieve the current PubNub timetoken.

### Timetoken algorithm
```text
timetoken = (Unix epoch time in seconds) * 10000000
```

Example:
```text
08/19/2013 @ 9:20pm UTC = 1376961606
timetoken = 1376961606 * 10000000
timetoken = 13769616060000000
```

### Method
```dart
time()
```

### Example
```dart
var response = await pubnub.time();
```

### Returns
`Timetoken`  
• `value` → `int` — current timetoken.