# Configuration API for Go SDK
Go API reference for configuring the PubNub client.
[View on GoDoc](https://godoc.org/github.com/pubnub/go)

## Configuration

pubnub.Config stores settings that control the PubNub client.

### Method(s)

Create a configuration instance with:

```
`1config := pubnub.NewConfigWithUserId(UserId)  
`
```

Required: Set a unique UserId (UTF-8 string up to 92 alphanumeric chars) per user/device. Without it, the client can’t connect.

### Parameters

- SubscribeKey
  - Type: string
  - Default: n/a
  - Subscribe key from the Admin Portal.
- PublishKey
  - Type: string
  - Default: None
  - Publish key from the Admin Portal (required if publishing).
- SecretKey
  - Type: string
  - Default: None
  - Secret key (required for modifying or revealing access permissions).
- SetUserId
  - Type: UserId
  - Default: n/a
  - UserId to use. Takes String as an argument. Must be unique per user/device; required to connect.
- AuthKey
  - Type: string
  - Default: None
  - Used on all restricted requests when Access Manager is enabled.
- Secure
  - Type: bool
  - Default: True
  - Use SSL.
- MessageQueueOverflowCount
  - Type: int
  - Default: 100
  - Fires PNRequestMessageCountExceededCategory when a single subscribe response exceeds this message count.
- ConnectTimeout
  - Type: int (seconds)
  - Default: 10
  - Max time to establish a connection.
- SubscribeRequestTimeout
  - Type: int (seconds)
  - Default: 310
- NonSubscribeRequestTimeout
  - Type: int (seconds)
  - Default: 10
- FilterExpression
  - Type: string
  - Default: None
  - Custom subscribe filter expression.
- Origin
  - Type: string
  - Default: ps.pndsn.com
  - Custom origin if needed. For a custom domain, contact support and follow the request process.
- MaximumReconnectionRetries
  - Type: int
  - Default: 50
  - Number of reconnection retry attempts before giving up.
- SetPresenceTimeout
  - Type: int
  - Default: 0
  - Presence timeout; server considers client alive if periodic heartbeats arrive within this time. Emits “timeout” on presence channel on inactivity.
- SetPresenceTimeoutWithCustomInterval
  - Type: int
  - Default: 0
  - Custom heartbeat interval. For shorter presence timeouts, set roughly to (SetPresenceTimeout / 2) - 1.
- SuppressLeaveEvents
  - Type: bool
  - Default: n/a
  - When true, the SDK does not send leave requests.
- MaxIdleConnsPerHost
  - Type: int
  - Default: 30
  - Sets HTTP Transport’s MaxIdleConnsPerHost.
- FileMessagePublishRetryLimit
  - Type: int
  - Default: 5
  - Publish File Message retry attempts.
- CryptoModule
  - Type:
    - crypto.NewAesCbcCryptor(CipherKey, UseRandomInitializationVector)
    - crypto.NewLegacyCryptor(CipherKey, UseRandomInitializationVector)
  - Default: None
  - Module used to encrypt/decrypt messages and files. Pass CipherKey and UseRandomInitializationVector as arguments. See CryptoModule section.
- CipherKey
  - Type: string
  - Default: None
  - Deprecated: pass via CryptoModule instead. If set, communication is encrypted.
- UseRandomInitializationVector
  - Type: bool
  - Default: true
  - Deprecated: pass via CryptoModule instead. When true, IV is random for all requests (not just file upload). When false, IV is hard-coded for all requests except file upload.
- UUID
  - Type: string
  - Default: n/a
  - Deprecated: use userId instead. Required to connect if used.

##### Disabling random initialization vector
Disable random IV only for backward compatibility (<5.0.0). Do not disable for new applications.

#### CryptoModule

CryptoModule encrypts and decrypts messages and files. From 7.1.2, you can choose algorithms.

- Options:
  - Legacy 128‑bit encryption.
  - Recommended 256‑bit AES‑CBC.
- If CryptoModule is not set but cipherKey and useRandomInitializationVector are set in config, the client uses legacy encryption.
- For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
You can keep legacy encryption. To use recommended 256-bit AES-CBC, explicitly set it in config.

### Sample code

##### Reference code
Self-contained snippet for reference and console logging.

##### Required User ID
Always set a persistent UserId for the user or device.

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

Subscribe requests via proxy:

```
1
  

```

Non-subscribe requests via proxy:

```
1
  

```

## User ID

Set or get a user ID at runtime. Required to connect.

### Method(s)

Set or get UserId with:

```
`1config.SetUserId(UserId(string))  
`
```

- UserId
  - Type: string
  - Default: n/a
  - Device/user identifier. Required to connect.

```
`1config.GetUserId()  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID
Always set a persistent UserId for the user or device.

```
1
  

```

#### Get user ID

```
1
  

```

## Authentication key

Set or get the user's authentication key (used with Access Manager).

### Method(s)

```
`1config.AuthKey = string  
`
```

- AuthKey
  - Type: string
  - Used on all restricted requests when Access Manager is enabled.

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

Requires Stream Controller add-on enabled for your key.

Filters let subscribers receive only messages matching a filter expression.

### Method(s)

```
`1config.FilterExpression = string  
`
```

- filterExpression
  - Type: string
  - Custom filter expression applied to Subscribe.

```
`1config.FilterExpression  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID
Always set a persistent UserId for the user or device.

```
1
  

```

#### Get filter expression

```
1
**
```