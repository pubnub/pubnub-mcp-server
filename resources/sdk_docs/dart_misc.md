# Utility Methods API – Dart SDK (Misc)

Concise reference to rarely-used helpers. All code, signatures, parameters, and return types are unchanged.

## Pause

Force the SDK to stop all PubNub requests while subscriptions are active.

### Method

```
`pause()  
`
```

No arguments.

### Example

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Subscribe to a channel  
  var channel = "getting_started";  
  var subscription = pubnub.subscribe(channels: {channel});  
`
```

---

## Resume

Resume all halted PubNub requests.

### Method

```
`resume()  
`
```

No arguments.

### Example

```
`subscribtion.resume()  
`
```

---

## Encrypt file

Encrypt file content provided as a list of bytes.

> Deprecated: `cipherKey` argument overrides the crypto module and falls back to legacy 128-bit encryption. Prefer configuring a separate crypto module instance.

### Method

```
`pubnub.files.encryptFile(  
  Listint> bytes,  
  {CipherKey? cipherKey,  
  Keyset? keyset,  
  String? using}  
)  
`
```

Parameter | Type | Description
--- | --- | ---
`bytes` | List`<int>` | File content in bytes (required).
`cipherKey` | cipherKey | Overrides `Keyset.cipherKey`.
`keyset` | Keyset | Alternate keyset.
`using` | String | Keyset name from `keysetStore`.

### Example

```
`// create cryptoModule  
var cryptoModule = CryptoModule.aesCbcCryptoModule(CipherKey.fromUtf8('abcd'));  
  
// encrypt file data   NOTE: same method because it works at byte level  
var encryptedFileData = cryptoModule.encrypt(fileData);  
`
```

### Returns

List`<int>` (encrypted bytes).

---

## Decrypt file

Decrypt file bytes.

> Deprecated: same `cipherKey` caveat as above.

### Method

```
`pubnub.files.decryptFile(  
  Listint> bytes,  
  {CipherKey? cipherKey,  
  Keyset? keyset,  
  String? using})  
`
```

Parameter | Type | Description
--- | --- | ---
`bytes` | List`<int>` | File content in bytes (required).
`cipherKey` | cipherKey | Overrides `Keyset.cipherKey`.
`keyset` | Keyset | Alternate keyset.
`using` | String | Keyset name from `keysetStore`.

### Example

```
`// create cryptoModule  
var cryptoModule = CryptoModule.aesCbcCryptoModule(CipherKey.fromUtf8('abcd'));  
  
// encrypt file data   NOTE: same method because it works at byte level  
var encryptedFileData = cryptoModule.encrypt(fileData);  
  
// decrypt file data   
var decryptedFileData = cryptoModule.decrypt(encryptedFileData);  
  
// create file again from decrypted file bytes  
File('decryptedFile.jpg').writeAsBytesSync(decryptedFileData);  
`
```

### Returns

List`<int>` (decrypted bytes).

---

## Time

Retrieve the current network timetoken.

Algorithm:  

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example:  

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method

```
`time()  
`
```

### Example

```
`var response = await pubnub.time();  
`
```

### Returns

`Timetoken`  
• `value` (int) – current timetoken.

_Last updated Jul 15 2025_