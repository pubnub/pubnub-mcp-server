# Configuration API for Go SDK
Go API reference for configuring PubNub clients.
[View on GoDoc](https://godoc.org/github.com/pubnub/go)

## Configuration

pubnub.Config stores settings that control the PubNub client.

### Method(s)

Create a configuration instance with:

```
`1config := pubnub.NewConfigWithUserId(UserId)  
`
```

Properties:
- SubscribeKey
  - Type: string
  - Default: n/a
  - Description: Subscribe key from the Admin Portal. Required.
- PublishKey
  - Type: string
  - Default: None
  - Description: Publish key from the Admin Portal. Required if publishing.
- SecretKey
  - Type: string
  - Default: None
  - Description: Secret key, required only for modifying or revealing access permissions.
- SetUserId
  - Type: UserId
  - Default: n/a
  - Description: userId to use. UserId takes String as an argument. Must be a unique, UTF-8 string up to 92 alphanumeric characters. Required to connect; without it the client won’t connect.
- AuthKey
  - Type: string
  - Default: None
  - Description: If Access Manager is used, this AuthKey is sent with restricted requests.
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
  - Description: Maximum time to establish a connection (seconds).
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
  - Description: Number of reconnection retries before giving up.
- SetPresenceTimeout
  - Type: int
  - Default: 0
  - Description: Presence timeout (seconds). Server considers the client alive for this duration; client sends periodic heartbeats. If no heartbeat arrives within the timeout, the client is marked inactive and a “timeout” event is emitted on the presence channel.
- SetPresenceTimeoutWithCustomInterval
  - Type: int
  - Default: 0
  - Description: How often the client sends heartbeats. For shorter presence timeouts, set roughly to (SetPresenceTimeout / 2) - 1.
- SuppressLeaveEvents
  - Type: bool
  - Default: n/a
  - Description: When true the SDK doesn't send leave requests.
- MaxIdleConnsPerHost
  - Type: int
  - Default: 30
  - Description: Sets HTTP Transport’s MaxIdleConnsPerHost.
- FileMessagePublishRetryLimit
  - Type: int
  - Default: 5
  - Description: Number of retries for Publish File Message failures.
- CryptoModule
  - Type: crypto.NewAesCbcCryptor(CipherKey, UseRandomInitializationVector) or crypto.NewLegacyCryptor(CipherKey, UseRandomInitializationVector)
  - Default: None
  - Description: Cryptography module used for encryption/decryption of messages and files. Takes CipherKey and UseRandomInitializationVector as arguments. See CryptoModule below.
- CipherKey
  - Type: string
  - Default: None
  - Description: Deprecated; pass to CryptoModule instead. If set, all communications to/from PubNub will be encrypted.
- UseRandomInitializationVector
  - Type: bool
  - Default: true
  - Description: Deprecated; pass to CryptoModule instead. When true, IV is random for all requests (not just file upload). When false, IV is hard-coded for all requests except file upload.
- UUID
  - Type: string
  - Default: n/a
  - Description: Deprecated; use userId instead. Required to connect if userId is not set.

##### Disabling random initialization vector
Disable random IV only for backward compatibility (<5.0.0). Do not disable random IV in new applications.

#### CryptoModule

CryptoModule encrypts and decrypts messages and files. From 7.1.2, you can configure the algorithms.

- Options: legacy 128‑bit encryption and recommended 256‑bit AES‑CBC.
- If you don’t set CryptoModule but set cipherKey and useRandomInitializationVector in config, the client uses legacy encryption.
- For details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
To keep using legacy encryption, no changes are required. To use the recommended 256‑bit AES‑CBC encryption, explicitly set it in config.

### Sample code

##### Reference code
Self-contained snippet ready to run. Includes necessary imports and method execution with console logging.

##### Required User ID
Always set UserId to uniquely identify the user or device. Persist it and keep it unchanged for the lifetime of the user or device. Without it, you won’t be able to connect.

```
1
  

```

### Server response

Configured and ready to use client configuration instance.

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

The following sample configures a client to use a proxy for subscribe requests:

```
1
  

```

The following sample configures a client to use a proxy for non-subscribe requests:

```
1
  

```