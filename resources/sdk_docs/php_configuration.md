# Configuration API for PHP SDK (Condensed)

Complete API reference for configuring, initializing, and handling events in the PubNub PHP SDK. This summary preserves method signatures, parameters, defaults, and code blocks.

## Configuration

PNConfiguration stores user-provided settings that control PubNub client behavior. Includes additional properties for precise client configuration.

- Immutable configuration: Once passed to the PubNub constructor, properties can’t be changed. To allow changes, call disableImmutableCheck() just before passing it to the constructor.

```
1
  
```

### Method(s)

Create a configuration instance:

```
`1new PNConfiguration();  
`
```

Properties:
- subscribeKey (String, Default: n/a): Required. From Admin Portal.
- publishKey (String, Default: null): From Admin Portal; required if publishing.
- secretKey (String, Default: null): Required for modifying/revealing access permissions (Access Manager).
- UserId (String, Default: n/a): Required. Unique UTF-8 string up to 92 alphanumeric chars. If not set, you can’t connect.
- authKey (String, Default: null): Used for restricted requests when Access Manager is enabled.
- ssl (Boolean, Default: true): Use SSL.
- connectTimeout (Integer, Default: 10): Seconds to wait before giving up connection.
- subscribeTimeout (Integer, Default: 310): Seconds to keep subscribe loop running before disconnect.
- nonSubscribeRequestTimeout (Integer, Default: 10): Timeout in seconds for non-subscribe operations.
- filterExpression (String, Default: null): Custom filter expression for subscribe.
- origin (String, Default: ps.pndsn.com): Custom origin if needed. To request a custom domain, contact support and follow the request process.
- cipherKey (String, Default: null): If set, communications are encrypted.
- useRandomIV (Boolean, Default: true): true = random IV for all requests (not just file upload); false = hard-coded IV (except file upload). Disable only for backward compatibility (<4.3.0).
- client (ClientInterface, Default: Guzzle HTTP client): Custom PSR-18 HTTP client; default is Guzzle. See PHP 8.0.0 migration guide for custom client details.
- crypto (PubNubCryptoCore, Default: n/a): Cryptography module for messages/files. Takes cipherKey and useRandomIV. See Encryption API for details.

crypto module:
- Encrypts/decrypts messages/files. From 6.1.0, algorithms are configurable (legacy 128-bit or recommended 256-bit AES-CBC). See Message Encryption and Encryption docs.

Legacy encryption with 128-bit cipher key entropy:
- No change required to continue legacy encryption.
- To use recommended 256-bit AES-CBC, explicitly configure it.

### Sample code

Required User ID:
- Always set a unique, persistent UserId for the device/user. If not set, you can’t connect.

Reference code:

```
1
  
```

### Rest response from server

Returns a client configuration that is ready to use.

## Initialization

Add PubNub per the Getting Started guide.

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

Set verify_peer to true to use the PEM files.

### Description

Initializes the PubNub Client API context. Establish account-level credentials (publishKey, subscribeKey) before using APIs.

### Method(s)

Initialize PubNub:

```
`1new PubNub($pnconf);  
`
```

- pnConfiguration (PNConfiguration): See Configuration.

### Sample code

#### Initialize the PubNub client API

Required User ID: Always set a persistent UserId.

```
1
  
```

### Returns

A PubNub instance for APIs like publish(), subscribe(), history(), and hereNow().

### Other examples

#### Initialize a non-secure client

Required User ID:

```
1
  
```

#### Initialization for a Read-Only client

Omit publishKey when the client only reads:

Required User ID:

```
1
  
```

#### Use a custom UUID

Set a custom UserId to identify users.

Required User ID:

```
1
  
```

#### Initializing with Access Manager

Requires Access Manager add-on.

Secure your secretKey: Keep it server-side only. Initializing with secretKey grants root permissions; the SDK will sign all Access Manager messages.

Required User ID:

```
1
  
```

Now the pubnub object can access Access Manager functions using secretKey.

## Event listeners

Listeners notify your app about connection status, messages, and presence events. Add listeners before calling methods.

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
- PNAccessDeniedCategory: Access error (Access Manager). status.errorData.channels/channelGroups list denied channels/groups.
- PNMalformedResponseCategory: Non-JSON response (e.g., hotspot auth/proxy message).
- PNBadRequestCategory: Missing/invalid parameters.
- PNDecryptionErrorCategory: Some messages couldn’t be decrypted. Unencrypted message in status.associatedObject (PNMessageData).
- PNTimeoutCategory: No server response in time.
- PNUnknownCategory: No specific category assigned / unknown error.
- PNUnexpectedDisconnectCategory: Can’t reach servers (offline/ISP/proxy).
- PNCancelledCategory: Request cancelled by user.

## UserId

Set/get a user ID on the fly.

### Property(s)

#### Set UserId

```
`1$pnconf->setUserId(string);  
`
```

- UserId (String, Default: n/a): Device/user identifier. Required to connect.

#### Get UserId

```
`1$pnconf->getUserId();  
`
```

No arguments.

### Sample code

#### Set UserId

Required User ID: Always set a persistent UserId.

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

- AuthKey (String): Used for restricted requests when Access Manager is enabled.

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

Requires Stream Controller add-on.

Server-side stream filtering sends only messages matching the filter. For details see Publish Messages.

### Method(s)

#### Set filter expression

```
`1setFilterExpression( string filterExpression )  
`
```

- filterExpression (string): Logical expression evaluated on PubNub servers.

#### Get filter expression

```
`1getFilterExpression  
`
```

No arguments.

### Sample code

#### Set filter expression

Required User ID: Always set a persistent UserId.

```
1
  
```

#### Get filter expression

```
1
**
```
Last updated on Nov 6, 2025**