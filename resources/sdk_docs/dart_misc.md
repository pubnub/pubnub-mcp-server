On this page
# Utility Methods API for Dart SDK

The methods on this page are utility methods that don't fit into other categories.

## Pause[​](#pause)

Call the `pause()` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods)

To `pause()` the data transmission you can use the following method(s) in Dart SDK.

```
`pause()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

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
show all 24 lines

## Resume[​](#resume)

Call the `resume()` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-1)

To `resume()` the data transmission you can use the following method(s) in Dart SDK.

```
`resume()  
`
```

### Basic Usage[​](#basic-usage-1)

```
`subscribtion.resume()  
`
```

This method doesn't take any arguments.

## Encrypt File[​](#encrypt-file)

Encrypts file content in bytes format.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/dart/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

```
`pubnub.files.encryptFile(  
  Listint> bytes,  
  {CipherKey? cipherKey,  
  Keyset? keyset,  
  String? using}  
)  
`
```

*  requiredParameterDescription`bytes` *Type: List`<int>`File content in bytes.`cipherKey`Type: cipherKeyA `cipherKey` to override `Keyset.cipherKey`. For more information, refer to [Configuration](/docs/sdks/dart/api-reference/configuration).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-2)

```
`// create cryptoModule  
var cryptoModule = CryptoModule.aesCbcCryptoModule(CipherKey.fromUtf8('abcd'));  
  
// encrypt file data   NOTE: same method because it works at byte level  
var encryptedFileData = cryptoModule.encrypt(fileData);  
`
```

### Returns[​](#returns)

Byte List of encrypted data.

## Decrypt File[​](#decrypt-file)

Decrypts file content in bytes format.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/dart/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

```
`pubnub.files.decryptFile(  
  Listint> bytes,  
  {CipherKey? cipherKey,  
  Keyset? keyset,  
  String? using})  
`
```

*  requiredParameterDescription`bytes` *Type: List`<int>`File content in bytes.`cipherKey`Type: cipherKeyA `cipherKey` to override `Keyset.cipherKey`. For more information, refer to [Configuration](/docs/sdks/dart/api-reference/configuration).`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-3)

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

### Returns[​](#returns-1)

Byte list of decrypted data.

## Time[​](#time)

This function returns the current timetoken value from the PubNub network.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example of creating a timetoken for a specific time and date:

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method(s)[​](#methods-4)

To fetch Time you can use the following method(s) in Dart SDK:

```
`time()  
`
```

### Basic Usage[​](#basic-usage-4)

```
`var response = await pubnub.time();  
`
```

### Returns[​](#returns-2)

The `time()` operation returns a `Timetoken` which contains the following operations:

MethodDescription`value`Type: `int`Returns an `int` representation of current timetoken.Last updated on **Jun 30, 2025**