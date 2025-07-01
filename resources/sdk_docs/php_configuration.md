On this page
# Configuration API for PHP SDK

PHP complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration[​](#configuration)

`PNConfiguration` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contain additional set of properties which allow to perform precise PubNub client configuration.

##### Immutable configuration

Once a configuration object has been passed to the PubNub constructor, you can't change its properties.

Although we don't recommend it, you can enable changing the configuration object after using it to create a PubNub instance, by calling the `disableImmutableCheck()` method just before passing it to the PubNub constructor.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$config = new PNConfiguration();  
$config->setPublishKey('demo');  
$config->setSubscribeKey('demo');  
$config->setUserId('demo');  
// not recommended, disables config immutability  
$config->disableImmutableCheck();  
  
$pn = new PubNub($config);  
`
```

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the PHP SDK:

```
`new PNConfiguration();  
`
```

*  requiredParameterDescription`subscribeKey` *Type: StringDefault:  
n/a`subscribeKey` from Admin Portal`publishKey`Type: StringDefault:  
`null``publishKey` from Admin Portal (only required if publishing)`secretKey`Type: StringDefault:  
`null``secretKey` (only required for modifying/revealing access permissions)`UserId` *Type: StringDefault:  
n/a`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `UUID`, you won't be able to connect to PubNub.`authKey`Type: StringDefault:  
`null`If Access Manager is utilized, client will use this `authKey` in all restricted requests.`ssl`Type: BooleanDefault:  
`true`Use `ssl``connectTimeout`Type: IntegerDefault:  
`10`How long to wait before giving up connection to client.The value is in seconds.`subscribeTimeout`Type: IntegerDefault:  
`310`How long to keep the `subscribe` loop running before disconnect.The value is in seconds.`nonSubscribeRequestTimeout`Type: IntegerDefault:  
`10`On `non subscribe` operations, how long to wait for server response.The value is in seconds.`filterExpression`Type: StringDefault:  
`null`Feature to subscribe with a custom filter expression.`origin`Type: StringDefault:  
`ps.pndsn.com`Custom `origin` if needed.`cipherKey`Type: StringDefault:  
`null`If `cipherKey` is passed, all communications to/from PubNub will be encrypted.`useRandomIV`Type: BooleanDefault:  
`true`When `true` the initialization vector (IV) is random for all requests (not just for file upload). When `false` the IV is hard-coded for all requests except for file upload.`client`Type: `ClientInterface`Default:  
[Guzzle HTTP client](https://docs.guzzlephp.org/en/stable/)Custom HTTP client implementing PSR-18. If not set, the default Guzzle client is used.   
 For more information on implementing a custom HTTP client, refer to [PHP 8.0.0 migration guide](/docs/general/resources/migration-guides/php-8.0.0-migration-guide).`crypto`Type: `PubNubCryptoCore`Default:  
n/aThe cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` and `useRandomIV` parameters as arguments.   
   
 For more information, refer to the [crypto module](#crypto-module) section.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`4.3.0`) with existing applications. Never disable random IV on new applications.

#### `crypto` Module[​](#crypto-module)

`crypto` provides encrypt/decrypt functionality for messages. From the 8.0.2 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy 1encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to [Message Encryption](/docs/general/setup/data-security#message-encryption).

If you do not explicitly set the `crypto_module` in your app and have the `cipher_key` and `use_random_initialization_vector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `crypto` configuration[​](#crypto-configuration)

To configure `crypto`, you can use the following methods in the Python SDK:

```
`//  encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
$pnConfiguration = new PNConfiguration();  
...  
// all necessary config options  
$pnConfiguration->setCrypto(CryptoModule::aesCbcCryptor("enigma", true));  
  
$pubnub = new PubNub($pnconf);  
  
// encrypts with 128-bit cipher key entropy(legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
$pnConfiguration = new PNConfiguration();  
...  
// all necessary config options  
$pnConfiguration->setCrypto(CryptoModule::legacyCryptor("enigma", true));  
`
```
show all 28 lines

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 8.0.2 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Required UUID

Always set the `UUID` to uniquely identify the user or device that connects to PubNub. This `UUID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\CryptoModule;  
  
// Create a new configuration instance  
$pnConfiguration = new PNConfiguration();  
  
// Set subscribe key (required)  
$pnConfiguration->setSubscribeKey("demo");  
  
`
```
show all 68 lines

### Rest Response from Server[​](#rest-response-from-server)

Configured and ready to use client configuration instance.

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined in the [Getting Started guide](/docs/sdks/php).

#### Use PHP SDK in your code[​](#use-php-sdk-in-your-code)

```
`use PubNub\PubNub;  
`
```

PEM files can be downloaded for the domains `pubsub.pubnub.com`, `pubsub.pubnub.net` and `ps.pndsn.com` using the commands:

```
`echo Q | openssl s_client -connect pubsub.pubnub.com:443 -servername pubsub.pubnub.com -showcerts  
echo Q | openssl s_client -connect pubsub.pubnub.net:443 -servername pubsub.pubnub.net -showcerts  
echo Q | openssl s_client -connect ps.pndsn.com:443 -servername ps.pndsn.com -showcerts  
`
```

You need to set the `verify_peer` to `true` to use the PEM files.

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `publishKey` and `subscribeKey`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the PHP SDK:

```
`new PubNub($pnconf);  
`
```

*  requiredParameterDescription`pnConfiguration` *Type: PNConfigurationGoto [Configuration](#configuration)  for more details.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("my-key");  
$pnconf->setPublishKey("my-key");  
$pnconf->setSecure(false);  
$pnconf->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnconf);  
`
```

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `publish()`, `subscribe()`, `history()`, `hereNow()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
$pnConfiguration->setPublishKey("my_pub_key");  
$pnConfiguration->setSecure(false);  
$pnConfiguration->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnConfiguration);  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publishKey` when initializing the client:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
  
$pubnub = new PubNub($pnConfiguration);  
`
```

#### Use a custom UUID[​](#use-a-custom-uuid)

Set a custom `UserId` to identify your users.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("mySubscribeKey");  
$pnconf->setPublishKey("myPublishKey");  
$pnconf->setUserId("myUniqueUserId");  
  
$pubnub = new PubNub($pnconf);  
`
```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secretKey

Anyone with the `secretKey` can grant and revoke permissions to your app. Never let your secret key be discovered, and to only exchange it / deliver it securely. Only use the `secretKey` on secure server-side platforms.

When you init with `secretKey`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `secretKey` as in the following example:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
$pnConfiguration->setPublishKey("my_pub_key");  
$pnConfiguration->setSecretKey("my_secret_key");  
$pnConfiguration->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnConfiguration);  
`
```

Now that the pubnub object is instantiated the client will be able to access the Access Manager functions. The pubnub object will use the `secretKey` to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

You can be notified of connectivity status, message and presence notifications via the listeners.

Listeners should be added before calling the method.

#### Add Listeners[​](#add-listeners)

```
`use PubNub\PubNub;  
use PubNub\Enums\PNStatusCategory;  
use PubNub\Callbacks\SubscribeCallback;  
use PubNub\PNConfiguration;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {  
        // This event happens when radio / connectivity is lost  
        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory){  
        // Connect event. You can do stuff like publish, and know you'll get it // Or just use the connected event to confirm you are subscribed for // UI / internal notifications, etc  
        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory){  
        // Handle message decryption error. Probably client configured to // encrypt messages and on live data feed it received plain text.  
        }  
    }  
`
```
show all 47 lines

#### Remove Listeners[​](#remove-listeners)

```
`$subscribeCallback = new MySubscribeCallback();  
  
$pubnub->addListener($subscribeCallback);  
  
// some time later  
$pubnub->removeListener($subscribeCallback);  
`
```

#### Listener status events[​](#listener-status-events)

CategoryDescription`PNConnectedCategory`SDK subscribed with a new mix of channels (fired every time the `channel` / `channel group` mix changed).`PNAccessDeniedCategory`Request failed because of access error (active Access Manager). `status.errorData.channels` or `status.errorData.channelGroups` contain list of channels and/or groups to which user with specified `auth` key doesn't have access.`PNMalformedResponseCategory`Request received in response non-JSON data. It can be because of publish WiFi hotspot which require authorization or proxy server message.`PNBadRequestCategory`Request can't be completed because not all required values has been passed or passed values has unexpected data type.`PNDecryptionErrorCategory`Message Persistence API may return this status category in case if some messages can't be decrypted. Unencrypted message will be returned in `status.associatedObject` where `associatedObject` is `PNMessageData` which contain channel and message properties.`PNTimeoutCategory`Used API didn't received response from server in time.`PNUnknownCategory`No specific category was assigned to the request.`PNUnexpectedDisconnectCategory`The SDK is not able to reach PubNub servers because the machine or device are not connected to Internet or this has been lost, your ISP (Internet Service Provider) is having to troubles or perhaps or the SDK is behind of a proxy.`PNUnexpectedDisconnectCategory`The SDK is not able to reach PubNub servers because the machine or device are not connected to Internet or this has been lost, your ISP (Internet Service Provider) is having to troubles or perhaps or the SDK is behind of a proxy.`PNCancelledCategory`Request was cancelled by user.`PNUnknownCategory`Unknown error happened.

## UserId[​](#userid)

These functions are used to set/get a user ID on the fly.

### Property(s)[​](#propertys)

To set/get `UserId` you can use the following property(s) in PHP SDK:

#### Set UserId[​](#set-userid)

```
`$pnconf->setUuid(string);  
`
```

*  requiredParameterDescription`UserId` *Type: StringDefault:  
n/a`UserId` to be used as a device identifier. If you don't set the `UserId`, you won't be able to connect to PubNub.

#### Get UserId[​](#get-userid)

```
`$pnconf->getUserId();  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

#### Set UserId[​](#set-userid-1)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`$pnconf = new PNConfiguration();  
$pnconf->setUserId("myUniqueUserId");  
`
```

#### Get UserId[​](#get-userid-1)

```
`$pubnub->getConfiguration()  
    ->getUserId();  
`
```

## Authentication Key[​](#authentication-key)

Setter and getter for users auth key.

#### Set Auth Key[​](#set-auth-key)

```
`$pnconf->setAuthKey(string);  
`
```

*  requiredParameterDescription`AuthKey` *Type: StringIf Access Manager is utilized, client will use this `authkey` in all restricted requests.

#### Get Auth Key[​](#get-auth-key)

```
`$pnconf->getAuthKey();  
`
```

This method doesn't take any argument.

### Basic Usage[​](#basic-usage-3)

#### Set Auth Key[​](#set-auth-key-1)

```
`$pubnub->getConfiguration()  
    ->setAuthKey("my_newauthkey");  
`
```

#### Get Auth Key[​](#get-auth-key-1)

```
`$pubnub->getConfiguration()  
    ->getAuthKey();  
`
```

### Returns[​](#returns-1)

None.

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following methods. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-2)

#### Set Filter Expression[​](#set-filter-expression)

```
`setFilterExpression( string filterExpression )  
`
```

*  requiredParameterDescription`filterExpression` *Type: stringLogical expression to be evaluated on PubNub servers

#### Get Filter Expression[​](#get-filter-expression)

```
`getFilterExpression  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-4)

#### Set Filter Expression[​](#set-filter-expression-1)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("my_sub_key");  
$pnconf->setFilterExpression("userid == 'my_userid'");  
  
$pubnub = new PubNub($pnconf);  
`
```

#### Get Filter Expression[​](#get-filter-expression-1)

```
`$pubnub->getFilterConfiguration();**`
```
Last updated on Apr 2, 2025**