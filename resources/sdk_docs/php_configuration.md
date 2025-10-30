# Configuration API for PHP SDK

Complete API reference for building real-time applications on PubNub with the PHP Software Development Kit (SDK). This page covers configuration, initialization, and event handling with concise, working examples.

## Configuration

PNConfiguration stores user-provided settings that control PubNub client behavior.

##### Immutable configuration

Configuration objects are immutable after being passed to the PubNub constructor. You can disable immutability just before constructing PubNub (not recommended).

```
use PubNub\PNConfiguration;  
use PubNub\PubNub;  

  
$config = new PNConfiguration();  
$config->setPublishKey('demo');  
$config->setSubscribeKey('demo');  
$config->setUserId('demo');  
// not recommended, disables config immutability  
$config->disableImmutableCheck();  

  
$pn = new PubNub($config);  

```

### Method(s)

Create a configuration instance:

```
`1new PNConfiguration();  
`
```

Essential properties:
- subscribeKey
  - Type: String
  - Default: n/a
  - From Admin Portal. Required to connect.
- publishKey
  - Type: String
  - Default: null
  - From Admin Portal. Required to publish.
- secretKey
  - Type: String
  - Default: null
  - Required to grant/revoke Access Manager permissions. Use server-side only.
- UserId
  - Type: String
  - Default: n/a
  - Required unique identifier (UTF-8, up to 92 alphanumeric chars). Must be set to connect.
- authKey
  - Type: String
  - Default: null
  - Used for Access Manager restricted requests.
- ssl
  - Type: Boolean
  - Default: true
  - Enable SSL.
- connectTimeout
  - Type: Integer (seconds)
  - Default: 10
- subscribeTimeout
  - Type: Integer (seconds)
  - Default: 310
- nonSubscribeRequestTimeout
  - Type: Integer (seconds)
  - Default: 10
- filterExpression
  - Type: String
  - Default: null
  - Server-side message filter expression.
- origin
  - Type: String
  - Default: ps.pndsn.com
  - Custom domain upon request (see request process).
- cipherKey
  - Type: String
  - Default: null
  - Enables end-to-end encryption for messages/files.
- useRandomIV
  - Type: Boolean
  - Default: true
  - Random IV for all requests (except file upload when false).
- client
  - Type: ClientInterface (PSR-18)
  - Default: Guzzle HTTP client
  - Custom HTTP client support (see PHP 8.0.0 migration guide).
- crypto
  - Type: PubNubCryptoCore
  - Default: n/a
  - Cryptography module for messages/files. Accepts cipherKey and useRandomIV. See Encryption API.

##### Disabling random initialization vector

Only disable random IV for backward compatibility (< 4.3.0). Do not disable for new applications.

#### crypto module

Encrypts and decrypts messages and files. From 6.1.0, algorithms are configurable. Options: legacy 128-bit and recommended 256-bit AES-CBC. Keep current config for legacy; explicitly set to use 256-bit AES-CBC. See Encryption for details.

### Sample code

##### Required User ID

Always set a persistent UserId. Without it, the client cannot connect.

```
1
  

```

### Rest response from server

Returns a client configuration that is ready to use.

## Initialization

Add PubNub to your project using the steps in the Getting Started guide.

#### Use PHP SDK in your code

```
`1use PubNub\PubNub;  
`
```

PEM files for pubsub.pubnub.com, pubsub.pubnub.net, and ps.pndsn.com:

```
`1echo Q | openssl s_client -connect pubsub.pubnub.com:443 -servername pubsub.pubnub.com -showcerts  
2echo Q | openssl s_client -connect pubsub.pubnub.net:443 -servername pubsub.pubnub.net -showcerts  
3echo Q | openssl s_client -connect ps.pndsn.com:443 -servername ps.pndsn.com -showcerts  
`
```

Set verify_peer to true to use PEM files.

### Description

Initialize the PubNub Client API context with account-level credentials (publishKey, subscribeKey) before using any APIs.

### Method(s)

Initialize PubNub:

```
`1new PubNub($pnconf);  
`
```

- pnConfiguration
  - Type: PNConfiguration
  - See Configuration above.

### Sample code

#### Initialize the PubNub client API

```
1
  

```

### Returns

Returns a PubNub instance for APIs like publish(), subscribe(), history(), and hereNow().

### Other examples

#### Initialize a non-secure client

```
1use PubNub\PNConfiguration;  
2use PubNub\PubNub;  
3
  
4$pnConfiguration = new PNConfiguration();  
5
  
6$pnConfiguration->setSubscribeKey("my_sub_key");  
7$pnConfiguration->setPublishKey("my_pub_key");  
8$pnConfiguration->setSecure(false);  
9$pnConfiguration->setUserId("myUniqueUserId");  
10$pubnub = new PubNub($pnConfiguration);  

```

#### Initialization for a Read-Only client

Omit publishKey when only subscribing.

```
1use PubNub\PNConfiguration;  
2use PubNub\PubNub;  
3
  
4$pnConfiguration = new PNConfiguration();  
5
  
6$pnConfiguration->setSubscribeKey("my_sub_key");  
7
  
8$pubnub = new PubNub($pnConfiguration);  

```

#### Use a custom UUID

```
1use PubNub\PNConfiguration;  
2use PubNub\PubNub;  
3
  
4$pnconf = new PNConfiguration();  
5
  
6$pnconf->setSubscribeKey("mySubscribeKey");  
7$pnconf->setPublishKey("myPublishKey");  
8$pnconf->setUserId("myUniqueUserId");  
9
  
10$pubnub = new PubNub($pnconf);  

```

#### Initializing with Access Manager

Requires the Access Manager add-on enabled in the Admin Portal.

Keep secretKey secure; use server-side only. Initializing with secretKey grants root permissions for Access Manager and signs all Access Manager requests.

```
1
  

```

## Event listeners

Listeners notify your app about connection status, messages, and presence events. Add listeners before calling methods.

#### Add listeners

```
1
  

```

#### Remove listeners

```
1$subscribeCallback = new MySubscribeCallback();  
2
  
3$pubnub->addListener($subscribeCallback);  
4
  
5// some time later  
6$pubnub->removeListener($subscribeCallback);  

```

## UserId

Set/get a user ID.

### Property(s)

#### Set UserId

```
`1$pnconf->setUserId(string);  
`
```

- UserId
  - Type: String
  - Required; used as device/user identifier.

#### Get UserId

```
`1$pnconf->getUserId();  
`
```

No arguments.

### Sample code

#### Set UserId

```
`1$pnconf = new PNConfiguration();  
2$pnconf->setUserId("myUniqueUserId");  
`
```

#### Get UserId

```
`1$pubnub->getConfiguration()  
2    ->getUserId();  
`
```

## Authentication key

Setter and getter for auth key (used with Access Manager).

#### Set auth key

```
`1$pnconf->setAuthKey(string);  
`
```

- AuthKey
  - Type: String

#### Get auth key

```
`1$pnconf->getAuthKey();  
`
```

No arguments.

### Sample code

#### Set auth key

```
`1$pubnub->getConfiguration()  
2    ->setAuthKey("my_newauthkey");  
`
```

#### Get auth key

```
`1$pubnub->getConfiguration()  
2    ->getAuthKey();  
`
```

### Returns

None.

## Filter expression

Requires Stream Controller add-on. Filtering applies server-side to reduce unwanted messages. See Publish Messages docs.

### Method(s)

#### Set filter expression

```
`1setFilterExpression( string filterExpression )  
`
```

- filterExpression
  - Type: string

#### Get filter expression

```
`1getFilterExpression  
`
```

No arguments.

### Sample code

#### Set filter expression

```
1
  

```

#### Get filter expression

```
`1$pubnub->getFilterConfiguration();**`
```

Last updated on Oct 21, 2025**