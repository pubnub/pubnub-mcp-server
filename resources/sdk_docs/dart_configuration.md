On this page
# Configuration API for Dart SDK

Dart complete API reference for building Realtime Applications on PubNub, including basic usage and sample code.

## Configuration[​](#configuration)

Dart SDK allows you to create various configurations for different subscribe keys. Each configuration is stored in a `Keyset` object.

You can use a `KeysetStore` to store your `Keyset`s but make sure that individual `Keyset` names are unique and note that only one can be the default.

### Method(s)[​](#methods)

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

The `Keyset` object has the following properties:

*  requiredParameterDescription`subscribeKey` *Type: `String`Default:  
n/a`subscribeKey` from the Admin Portal.`publishKey`Type: `String`Default:  
n/a`publishKey` from the Admin Portal (only required if publishing).`secretKey`Type: `String`Default:  
n/a`secretKey` used for administrative tasks.`authKey`Type: `String`Default:  
n/aIf [Access Manager](/docs/sdks/dart/api-reference/access-manager) is enabled, all communications to and from PubNub are encrypted.`userId` *Type: `String`Default:  
n/a`userId` to use. You should set a unique identifier for the user or the device that connects to PubNub.  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `userId`, you won't be able to connect to PubNub.`cipherKey`Type: `String`Default:  
n/aThis way of setting this parameter is deprecated, pass it to `crypto` instead.   
   
 If passed, all communications to and from PubNub will be encrypted.`UUID` *Type: `String`Default:  
n/aThis parameter is deprecated, use `userId` instead.  
  
`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.  
 If you don't set the `UUID`, you won't be able to connect to PubNub.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`import 'package:pubnub/pubnub.dart';  
  
void main() {  
  // Configure the Keyset with required parameters  
  final myKeyset = Keyset(  
    subscribeKey: 'demo',   
    publishKey: 'demo',   
    userId: UserId('myUniqueUserId')  
  );  
  
  print('Keyset configured with subscribeKey: ${myKeyset.subscribeKey}');  
}  
`
```

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined in [Getting Started](/docs/sdks/dart).

### Description[​](#description)

To use the Dart SDK, instantiate the `PubNub` class with a default `Keyset`. The default `Keyset` is used any time a specific `Keyset` isn't explicitly passed into a method. All methods that you call try to obtain the keyset according to these rules:

- The `keyset` parameter has the highest priority.

- If `keyset` is null, the method tries to get a keyset from the `using` parameter.

- If `using` is null, the method tries to get the default keyset.

- If the default keyset isn't defined, the method throws an error.

### Methods[​](#methods-1)

To initialize PubNub, you can use the following constructor in the Dart SDK:

```
`PubNub(  
  {Keyset defaultKeyset,   
  INetworkingModule networking,  
  IParserModule parser,   
  ICryptoModule crypto}  
)   
`
```

The `PubNub` constructor takes the following arguments:

*  requiredParameterDescription`defaultKeyset` *Type: `Keyset`Default:  
n/aThe default keyset to use.`networking`Type: `INetworkingModule`Default:  
`NetworkingModule`The default networking module to use. Inside this module, you can configure a custom origin and whether to use SSL.`parser`Type: `IParserModule`Default:  
`ParserModule`The default parser module to use for parsing data.`crypto`Type: `ICryptoModule`Default:  
`CryptoModule`The cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` parameter as argument.   
   
 For more information, refer to the [cryptoModule](#cryptomodule) section.

#### `cryptoModule`[​](#cryptomodule)

`cryptoModule` provides encrypt/decrypt functionality for messages and files. From the 4.2.4 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `cryptoModule` in your app and have the `cipherKey` param set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `cryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `cryptoModule` to encrypt all messages/files, you can use the following methods in the Dart SDK:

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
var cryptoModule = CryptoModule.aescbcCryptoModule(CipherKey.fromUtf8('enigma'));  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
var cryptoModule = CryptoModule.legacyCryptoModule(CipherKey.fromUtf8('enigma'));  
  
// partial encryption  
// create cryptoModule  
var cryptoModule = CryptoModule.aesCbcCryptoModule(CipherKey.fromUtf8('abcd'));  
  
// encrypt normal message  
var encrypted = cryptoModule.encrypt('Hello'.codeUnits);  
  
`
```
show all 17 lines

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 4.2.4 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage-1)

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Initialize PubNub with the configured Keyset  
  final myKeyset = Keyset(  
    subscribeKey: 'demo',   
    publishKey: 'demo',   
    userId: UserId('myUniqueUserId')  
  );  
    
  final pubnub = PubNub(defaultKeyset: myKeyset);  
  
}  
`
```

### Returns[​](#returns)

Initialization returns the PubNub instance for invoking PubNub APIs like `publish()`, `subscribe()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

```
`final pubnub =  
  PubNub(  
    defaultKeyset: myKeyset,   
    networking: NetworkingModule(ssl: false));  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

```
`final pubnub = PubNub(  
  defaultKeyset:  
    Keyset(subscribeKey: 'mysubscribeKey',  
    userId: UserId('myUniqueUserId')));  
`
```

#### Initialization with custom origin[​](#initialization-with-custom-origin)

If your use-case requires to route traffic through custom domain instead of the default one, you can set up your SDK such that all your traffic is routed through `example.com`:

```
`final pubnub = PubNub(  
  defaultKeyset: myKeyset,  
  networking: NetworkingModule(origin: 'example.com', ssl: true),  
);  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This example demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `ssl` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

```
`final pubnub =  
  PubNub(  
    defaultKeyset: myKeyset,  
    networking: NetworkingModule(ssl: true));  
`
```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secretKey

Anyone with the `secretKey` can grant and revoke permissions to your app. Never let your `secretKey` be discovered, and to only exchange it / deliver it securely. Only use the `secretKey` on secure server-side platforms.

When you init with `secretKey`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `secretKey` as in the following example:

```
`final pubnub = PubNub(  
  defaultKeyset: Keyset(  
    subscribeKey: 'mySubscribeKey',  
    secretKey: 'my_secretkey',  
    userId: UserId('myUniqueUserId')));  
`
```

Now that the `pubnub` object is instantiated the client will be able to access the Access Manager functions. The `pubnub` object will use the secretKey to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

You can be notified of connectivity status, message, and presence notifications via the listeners. For the listeners to work, you must have a `Subscription`. For more information, refer to the [Subscription](/docs/sdks/dart/api-reference/publish-and-subscribe#subscription) section.

### Listeners[​](#listeners)

The following listeners are available:

- `message`

- `signal`

- `objects`

- `messageAction`

- `file`

```
`subscription.messages.listen((envelope) {  
    switch (envelope.messageType) {  
      case MessageType.normal:  
          print('${envelope.publishedBy} sent a message: ${envelope.content}');  
          print('${envelope.channel}'); //to display the channel that message was sent on  
          print('${envelope.publishedAt}'); // to display timetoken of the message received  
          print('${envelope.content}'); // to display content of the message  
          print('${envelope.uuid}'); // to display the uuid of the sender  
          break;  
      case MessageType.signal:  
          print('${envelope.publishedBy} sent a signal message: ${envelope.content}');  
          print('${envelope.channel}'); //to display the channel that message was sent on  
          print('${envelope.publishedAt}'); // to display timetoken of the message received  
          print('${envelope.content}'); // to display content of the message  
          print('${envelope.uuid}'); // to display the uuid of the sender  
`
```
show all 55 lines

## userID[​](#userid)

These functions are used to set/get a user ID on the fly.

### Methods[​](#methods-2)

To set/get `userId` you can use the following method(s) in the Dart SDK:

```
`var myKeyset =  
  Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'));  
`
```

*  requiredParameterDescription`userId` *Type: `String`Default:  
n/aUser ID to be used as a device identifier.

### Basic Usage[​](#basic-usage-2)

##### Required UserId

Always set the `userId` to uniquely identify the user or device that connects to PubNub. This `userId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userId`, you won't be able to connect to PubNub.

```
`final pubnub = PubNub(  
    defaultKeyset: Keyset(  
        subscribeKey: 'mySubscribeKey',  
        userId: UserId('myUniqueUserId')));  
  
// to know which userId is set  
var userId = pubnub.keysets.defaultKeyset.userId;  
`
```

## Authentication Key[​](#authentication-key)

Setter and getter for users' authentication key.

### Method(s)[​](#methods-3)

```
`var myKeyset = Keyset(  
  subscribeKey: 'subscribeKey',  
  authKey: 'myAuthkey',  
  userId: UserId('myUniqueUserId'));  
`
```

*  requiredParameterDescription`authKey` *Type: `String`If Access Manager is utilized, client will use this `authKey` in all restricted requests.

### Basic Usage[​](#basic-usage-3)

```
`final pubnub = PubNub(  
  defaultKeyset: Keyset(  
    subscribeKey: 'mySubscribeKey',  
    authKey: 'myAuthkey',  
    userId: UserId('myUniqueUserId')));  
`
```

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it's applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following method. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-4)

```
`// to know which filter expression is set  
var filterExpression = pubnub.keysets.defaultKeyset.filterExpression;  
`
```

*  requiredParameterDescription`filterExpression` *Type: `String`PSV2 feature to `subscribe` with a custom filter expression.

### Basic Usage[​](#basic-usage-4)

```
`var myKeyset =  
    Keyset(subscribeKey: 'subscribeKey', userId: UserId('myUniqueUserId'))  
    ..filterExpression = 'such=wow';  
  
final pubnub = PubNub(defaultKeyset: myKeyset);  
`
```

## Handling Disconnects[​](#handling-disconnects)

The client may disconnect due to unpredictable network conditions. By default, the client reconnects exponentially for subscribe connections only.

For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

You can configure automatic reconnection as follows:

```
`var pubnub = PubNub(  
    networking:  
        NetworkingModule(retryPolicy: RetryPolicy.exponential(maxRetries: 10)));  
`
```

Available retry policies include:

- `RetryPolicy.exponential({int? maxRetries, int? maximumDelay});`

- `RetryPolicy.linear({int? backoff, int? maxRetries, int? maximumDelay})`

ArgumentTypeDescription`maximumDelay``int`Maximum amount of milliseconds to wait until retry is executed.`backoff``int`Backoff amount in milliseconds.`maxRetries``int`Number of max retries.Last updated on **Jun 10, 2025**