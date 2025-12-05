# Configuration API for Go SDK
Go complete API reference for building real-time applications on PubNub, including basic usage and sample code.
[View on GoDoc](https://godoc.org/github.com/pubnub/go)

## Configuration

pubnub.Config stores settings that control the PubNub client. Configure client behavior precisely via properties and helper methods.

### Method(s)

Create a configuration instance with:

```
`1config := pubnub.NewConfigWithUserId(UserId)  
`
```

Configuration fields:
- SubscribeKey
  - Type: string
  - Default: n/a
  - Description: Subscribe key from the Admin Portal.
- PublishKey
  - Type: string
  - Default: None
  - Description: Publish key from the Admin Portal (required if publishing).
- SecretKey
  - Type: string
  - Default: None
  - Description: Secret key (only required for modifying or revealing access permissions).
- SetUserId
  - Type: UserId
  - Default: n/a
  - Description: UserId to use. UserId takes String as an argument; set a unique UTF-8 identifier (up to 92 alphanumeric chars). Required to connect.
- AuthKey
  - Type: string
  - Default: None
  - Description: Used for Access Manager restricted requests.
- Secure
  - Type: bool
  - Default: True
  - Description: Use SSL.
- MessageQueueOverflowCount
  - Type: int
  - Default: 100
  - Description: Fires PNRequestMessageCountExceededCategory when a single subscribe response contains more than this many messages.
- ConnectTimeout
  - Type: int
  - Default: 10
  - Description: Max time to establish a connection (seconds).
- SubscribeRequestTimeout
  - Type: int
  - Default: 310
  - Description: Subscribe request timeout (seconds).
- NonSubscribeRequestTimeout
  - Type: int
  - Default: 10
  - Description: Non-subscribe request timeout (seconds).
- FilterExpression
  - Type: string
  - Default: None
  - Description: Subscribe with a custom filter expression.
- Origin
  - Type: string
  - Default: ps.pndsn.com
  - Description: Custom origin if needed. To request a custom domain, contact support and follow the request process.
- MaximumReconnectionRetries
  - Type: int
  - Default: 50
  - Description: How many times to retry to reconnect before giving up.
- SetPresenceTimeout
  - Type: int
  - Default: 0
  - Description: How long the server considers the client alive for presence; sends periodic heartbeats. If no heartbeat within timeout, client is marked inactive and a "timeout" event is emitted on the presence channel.
- SetPresenceTimeoutWithCustomInterval
  - Type: int
  - Default: 0
  - Description: How often the client sends heartbeats. For shorter presence timeouts, set roughly to (SetPresenceTimeout / 2) - 1.
- SuppressLeaveEvents
  - Type: bool
  - Default: n/a
  - Description: When true, the SDK doesn't send leave requests.
- MaxIdleConnsPerHost
  - Type: int
  - Default: 30
  - Description: Sets HTTP Transport's MaxIdleConnsPerHost.
- FileMessagePublishRetryLimit
  - Type: int
  - Default: 5
  - Description: Number of tries for Publish File Message failure.
- CryptoModule
  - Type: crypto.NewAesCbcCryptor(CipherKey, UseRandomInitializationVector) or crypto.NewLegacyCryptor(CipherKey, UseRandomInitializationVector)
  - Default: None
  - Description: Cryptography module for encryption/decryption of messages and files. Takes CipherKey and UseRandomInitializationVector. See CryptoModule for details.
- CipherKey
  - Type: string
  - Default: None
  - Deprecated: Pass via CryptoModule instead. If passed, all communications will be encrypted.
- UseRandomInitializationVector
  - Type: bool
  - Default: true
  - Deprecated: Pass via CryptoModule instead. When true, IV is random for all requests; when false, IV is hard-coded except for file upload.
- UUID
  - Type: string
  - Default: n/a
  - Deprecated: Use userId instead. Required to connect if using UUID.

##### Disabling random initialization vector
Disable random IV only for backward compatibility (<5.0.0). Do not disable for new applications.

#### CryptoModule

CryptoModule encrypts and decrypts messages and files. From 7.1.2, algorithms are configurable.

- Options: legacy 128‑bit encryption (legacy cryptor) and recommended 256‑bit AES‑CBC.
- If you don't set CryptoModule but set cipherKey and useRandomInitializationVector in config, the client uses legacy encryption.
- For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
You can keep legacy encryption. To use recommended 256-bit AES-CBC, explicitly set it in PubNub config.

### Sample code

##### Reference code
Self-contained snippet for reference.

##### Required User ID
Always set a persistent UserId to uniquely identify the user/device. Required to connect.

```
1
  

```

### Server response

Configured and ready-to-use client configuration instance.

### Other examples

#### Configure request timeouts

```
1
  

```

#### Configure presence timeout

```
1
  

```

#### Configure presence timeout with custom interval

```
1
  

```

#### Enable secure connection

```
1
  

```

#### Configure reconnection policy

```
1
  

```

#### Enable SDK logging

```
1
  

```

#### Set custom origin

```
1
  

```

#### Suppress leave events

```
1
  

```

#### Configure maximum concurrent workers

```
1
  

```

### Proxy configuration

Configure a proxy for subscribe requests:

```
1
  

```

Configure a proxy for non-subscribe requests:

```
1
  

```

## User ID

Set or get a user ID at runtime.

### Method(s)

Set or get UserId with:

```
`1config.SetUserId(UserId(string))  
`
```

- UserId
  - Type: string
  - Default: n/a
  - Description: Used as device identifier. Required to connect.

```
`1config.GetUserId()  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID
Always set a persistent UserId. Required to connect.

```
1
  

```

#### Get user ID

```
1
  

```

## Authentication key

Set or get the user's authentication key.

### Method(s)

```
`1config.AuthKey = string  
`
```

- AuthKey
  - Type: string
  - Description: Used for Access Manager restricted requests.

```
`1config.AuthKey  
`
```

This method doesn't take any arguments.

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

Requires Stream Controller add-on (enable in Admin Portal). Stream filtering lets a subscriber receive only messages that match a filter expression. To learn more, see Publish Messages.

### Method(s)

```
`1config.FilterExpression = string  
`
```

- filterExpression
  - Type: string
  - Description: PSV2 feature to Subscribe with a custom filter expression.

```
`1config.FilterExpression  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID
Always set a persistent UserId. Required to connect.

```
1
  

```

#### Get filter expression

```
1
**
```
Last updated on Oct 29, 2025**