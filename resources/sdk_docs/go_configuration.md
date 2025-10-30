# Configuration API for Go SDK
Go complete API reference for building real-time applications on PubNub, including basic usage and sample code.
[View on GoDoc](https://godoc.org/github.com/pubnub/go)

## Configuration

pubnub.Config stores settings that control the PubNub client.

### Method(s)

Create a configuration instance with:

```
`1config := pubnub.NewConfigWithUserId(UserId)  
`
```

Properties and options:

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
  - Description: Secret key (required for modifying or revealing access permissions).
- SetUserId
  - Type: UserId
  - Default: n/a
  - Description: userId to use. The UserId object takes String as an argument. Set a unique identifier for the user or device. UTF-8 string up to 92 alphanumeric characters. Required to connect.
- AuthKey
  - Type: string
  - Default: None
  - Description: If Access Manager is used, client includes this AuthKey in restricted requests.
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
  - Description: Custom origin if needed. For custom domains, contact support and follow the request process.
- MaximumReconnectionRetries
  - Type: int
  - Default: 50
  - Description: Number of reconnection attempts before giving up.
- SetPresenceTimeout
  - Type: int
  - Default: 0
  - Description: How long the server considers the client alive for presence (seconds). Heartbeats keep the client active; if none received within timeout, client is marked inactive and a "timeout" event is emitted on the presence channel.
- SetPresenceTimeoutWithCustomInterval
  - Type: int
  - Default: 0
  - Description: Heartbeat interval (seconds). For shorter presence timeouts, set roughly to (SetPresenceTimeout / 2) - 1.
- SuppressLeaveEvents
  - Type: bool
  - Default: n/a
  - Description: When true the SDK doesn't send leave requests.
- MaxIdleConnsPerHost
  - Type: int
  - Default: 30
  - Description: Sets HTTP Transport's MaxIdleConnsPerHost.
- FileMessagePublishRetryLimit
  - Type: int
  - Default: 5
  - Description: Number of publish retries for file messages.
- CryptoModule
  - Type: crypto.NewAesCbcCryptor(CipherKey, UseRandomInitializationVector) or crypto.NewLegacyCryptor(CipherKey, UseRandomInitializationVector)
  - Default: None
  - Description: Cryptography module used for encryption and decryption of messages and files. Pass CipherKey and UseRandomInitializationVector as arguments. See CryptoModule section.
- CipherKey
  - Type: string
  - Default: None
  - Description: Deprecated way to set cipher key; pass it to CryptoModule instead. If set, messages/files are encrypted.
- UseRandomInitializationVector
  - Type: bool
  - Default: true
  - Description: Deprecated way to set IV; pass it to CryptoModule instead. When true, IV is random for all requests (not just file upload). When false, IV is hard-coded for all requests except file upload.
- UUID
  - Type: string
  - Default: n/a
  - Description: Deprecated; use userId instead. Required to connect if using UUID.

##### Disabling random initialization vector
Disable random IV only for backward compatibility (<5.0.0). Do not disable random IV for new applications.

#### CryptoModule

CryptoModule encrypts and decrypts messages and files. From 7.1.2, you can configure the algorithms it uses.

- Options:
  - Legacy 128-bit encryption
  - Recommended 256-bit AES-CBC
- If you don't set CryptoModule but set cipherKey and useRandomInitializationVector in config, the client uses legacy encryption.
- For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
You can continue using legacy encryption. To use recommended 256-bit AES-CBC encryption, explicitly set it in PubNub config.

### Sample code

##### Reference code
Use as a reference when working with other examples.

##### Required User ID
Always set the UserId to uniquely identify the user or device. Persist it for the lifetime of the user/device. Required to connect.

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

Configure a client to use a proxy for subscribe requests:

```
1
  

```

Configure a client to use a proxy for non-subscribe requests:

```
1
  

```