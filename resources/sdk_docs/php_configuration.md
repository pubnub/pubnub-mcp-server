# Configuration API for PHP SDK

Concise configuration, initialization, and listener details for the PubNub PHP SDK. All critical settings, method signatures, parameters, and examples are retained.

## Configuration

`PNConfiguration` stores user-provided settings that control PubNub client behavior.

##### Immutable configuration

Once passed to the PubNub constructor, configuration properties are immutable. To allow changes after use, call `disableImmutableCheck()` just before passing it to the PubNub constructor.

```
1
  
```

### Methods

Create a configuration instance:

```
`1new PNConfiguration();  
`
```

### Properties

- subscribeKey
  - Type: String; Default: n/a
  - Required. Value from Admin Portal.
- publishKey
  - Type: String; Default: null
  - Required if publishing. Value from Admin Portal.
- secretKey
  - Type: String; Default: null
  - Required only for modifying/revealing access permissions. Keep server-side and secure.
- UserId
  - Type: String; Default: n/a
  - Required. UTF-8 string up to 92 alphanumeric chars; uniquely identifies the user/device. If not set, you can't connect to PubNub.
- authKey
  - Type: String; Default: null
  - Used for restricted requests if Access Manager is enabled.
- ssl
  - Type: Boolean; Default: true
  - Enable SSL.
- connectTimeout
  - Type: Integer; Default: 10 (seconds)
  - Connection timeout.
- subscribeTimeout
  - Type: Integer; Default: 310 (seconds)
  - How long to keep the subscribe loop running before disconnect.
- nonSubscribeRequestTimeout
  - Type: Integer; Default: 10 (seconds)
  - Timeout for non-subscribe operations.
- filterExpression
  - Type: String; Default: null
  - Custom filter expression for subscriptions.
- origin
  - Type: String; Default: ps.pndsn.com
  - Custom origin if needed. To request a custom domain, contact Support and follow the request process.
- cipherKey
  - Type: String; Default: null
  - If provided, messages/files are encrypted.
- useRandomIV
  - Type: Boolean; Default: true
  - When true, a random IV is used for all requests (not just file upload). When false, the IV is hard-coded for all requests except file upload.
- client
  - Type: ClientInterface; Default: Guzzle HTTP client
  - Custom PSR-18 HTTP client. If unset, default Guzzle is used. See the PHP 8.0.0 migration guide for custom client details.
- crypto
  - Type: PubNubCryptoCore; Default: n/a
  - Cryptography module for messages/files. Accepts `cipherKey` and `useRandomIV`. See Encryption API for detailed configuration and examples.

##### Disabling random initialization vector

Disable random IV only for backward compatibility (< 4.3.0). Never disable for new applications.

#### crypto module

Configurable since 6.1.0. Options:
- Legacy 128-bit encryption (default if already used)
- Recommended 256-bit AES-CBC

See Message Encryption and the Encryption API for configuration details and partial encryption methods.

##### Legacy encryption with 128-bit cipher key entropy

No change required to continue using legacy encryption. To use 256-bit AES-CBC, explicitly configure it in `PNConfiguration`.

### Sample code

##### Required User ID

Always set `UserId` to uniquely identify the user or device. Persist it and keep it stable for the user's/device's lifetime. If not set, you can't connect.

##### Reference code

```
1
  
```

### Rest response from server

Returns a client configuration that is ready to use.

## Initialization

Add PubNub to your project using the Getting Started guide.

#### Use PHP SDK in your code

```
`1use PubNub\PubNub;  
`
```

Download PEM files for domains:

```
`1echo Q | openssl s_client -connect pubsub.pubnub.com:443 -servername pubsub.pubnub.com -showcerts  
2echo Q | openssl s_client -connect pubsub.pubnub.net:443 -servername pubsub.pubnub.net -showcerts  
3echo Q | openssl s_client -connect ps.pndsn.com:443 -servername ps.pndsn.com -showcerts  
`
```

Set `verify_peer` to `true` to use PEM files.

### Description

Initializes the PubNub Client API context. Establishes credentials such as `publishKey` and `subscribeKey`.

### Methods

Initialize PubNub:

```
`1new PubNub($pnconf);  
`
```

- pnConfiguration
  - Type: PNConfiguration
  - See Configuration for details.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set `UserId`. If not set, you can't connect.

```
1
  
```

### Returns

A PubNub instance for APIs such as `publish()`, `subscribe()`, `history()`, `hereNow()`.

### Other examples

#### Initialize a non-secure client

##### Required User ID

Always set `UserId`.

```
1
  
```

#### Initialization for a Read-Only client

Omit `publishKey` to create a read-only client.

##### Required User ID

Always set `UserId`.

```
1
  
```

#### Use a custom UUID

Set a custom `UserId`.

##### Required User ID

Always set `UserId`.

```
1
  
```

#### Initializing with Access Manager

Requires Access Manager add-on enabled in the Admin Portal.

Secure your `secretKey`. Only use it on secure server-side platforms. When initialized with `secretKey`, servers have root permissions without additional grants.

##### Required User ID

Always set `UserId`.

```
1
  
```

The `pubnub` instance will use `secretKey` to sign all Access Manager messages.

## Event listeners

Listeners notify about connection status, messages, and presence events. Add listeners before invoking methods.

#### Add listeners

```
1
  
```

#### Remove listeners

```
1
  
```

#### Listener status events

- PNConnectedCategory: Subscribed with a new mix of channels/groups.
- PNAccessDeniedCategory: Access error (Access Manager). See `status.errorData.channels`/`channelGroups`.
- PNMalformedResponseCategory: Non-JSON response (e.g., captive portal/proxy).
- PNBadRequestCategory: Missing or invalid parameters.
- PNDecryptionErrorCategory: Some messages couldn't be decrypted. See `status.associatedObject` (PNMessageData) for channel/message.
- PNTimeoutCategory: No server response in time.
- PNUnknownCategory: No specific category or unknown error.
- PNUnexpectedDisconnectCategory: Connectivity issues.
- PNCancelledCategory: Request cancelled by user.

## UserId

Set/get a user ID at runtime.

### Properties

#### Set UserId

```
`1$pnconf->setUserId(string);  
`
```

- UserId
  - Type: String; Default: n/a
  - Required device/user identifier. If not set, you can't connect.

#### Get UserId

```
`1$pnconf->getUserId();  
`
```

No arguments.

### Sample code

#### Set UserId

##### Required User ID

Always set `UserId`.

```
1
  
```

#### Get UserId

```
1
  
```

## Authentication key

Setter and getter for user auth key.

#### Set auth key

```
`1$pnconf->setAuthKey(string);  
`
```

- AuthKey
  - Type: String
  - Used for restricted requests when Access Manager is enabled.

#### Get auth key

```
`1$pnconf->getAuthKey();  
`
```

No arguments.

### Sample code

#### Set auth key

```
1
  
```

#### Get auth key

```
1
  
```

### Returns

None.

## Filter expression

Requires Stream Controller add-on. Filters allow subscribers to only receive messages that match server-side-evaluated conditions. See Publish Messages for more info.

### Methods

#### Set filter expression

```
`1setFilterExpression( string filterExpression )  
`
```

- filterExpression
  - Type: string
  - Logical expression evaluated on PubNub servers.

#### Get filter expression

```
`1getFilterExpression  
`
```

No arguments.

### Sample code

#### Set filter expression

##### Required User ID

Always set `UserId`.

```
1
  
```

#### Get filter expression

```
1
**
```
Last updated on Nov 6, 2025**