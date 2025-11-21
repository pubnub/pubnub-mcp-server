# Configuration API for PHP SDK

Complete API reference for building real-time applications on PubNub with the PHP Software Development Kit (SDK). This section covers configuration with essential details, method signatures, parameters, and examples.

## Configuration

`PNConfiguration` stores user-provided settings that control PubNub client behavior.

##### Immutable configuration

Once a configuration object has been passed to the PubNub constructor, you can't change its properties.

If needed, you can allow changes after use by calling `disableImmutableCheck()` just before passing the configuration to the PubNub constructor.

```
1
  

```

### Method(s)

Create a configuration instance with:

```
`1new PNConfiguration();  
`
```

#### Parameters

- subscribeKey
  - Type: String
  - Default: n/a
  - Description: subscribeKey from Admin Portal. Required.

- publishKey
  - Type: String
  - Default: null
  - Description: publishKey from Admin Portal. Required only if publishing.

- secretKey
  - Type: String
  - Default: null
  - Description: Only required for modifying/revealing access permissions. Keep secure; server-side use only.

- UserId
  - Type: String
  - Default: n/a
  - Description: UUID to use. Set a unique, persistent identifier for the user/device. UTF-8 string up to 92 alphanumeric characters. Required to connect.

- authKey
  - Type: String
  - Default: null
  - Description: Used in all restricted requests when Access Manager is enabled.

- ssl
  - Type: Boolean
  - Default: true
  - Description: Use Secure Sockets Layer (SSL).

- connectTimeout
  - Type: Integer
  - Default: 10
  - Description: Seconds to wait before giving up connection.

- subscribeTimeout
  - Type: Integer
  - Default: 310
  - Description: Seconds to keep the subscribe loop running before disconnect.

- nonSubscribeRequestTimeout
  - Type: Integer
  - Default: 10
  - Description: Seconds to wait for server response on non-subscribe operations.

- filterExpression
  - Type: String
  - Default: null
  - Description: Subscribe with a custom filter expression.

- origin
  - Type: String
  - Default: ps.pndsn.com
  - Description: Custom origin if needed. For custom domains, contact support and follow the request process.

- cipherKey
  - Type: String
  - Default: null
  - Description: If set, messages/files are encrypted.

- useRandomIV
  - Type: Boolean
  - Default: true
  - Description: When true, a random IV is used for all requests (not just file upload). When false, the IV is hard-coded for all requests except file upload.

- client
  - Type: ClientInterface
  - Default: Guzzle HTTP client
  - Description: Custom PSR-18 HTTP client. If not set, the default Guzzle client is used.

- crypto
  - Type: PubNubCryptoCore
  - Default: n/a
  - Description: Cryptography module used for encryption/decryption of messages and files. Accepts cipherKey and useRandomIV as arguments.

##### Disabling random initialization vector

Disable random IV only for backward compatibility (<4.3.0). Never disable random IV for new applications.

#### crypto module

`crypto` encrypts and decrypts messages and files. From 6.1.0, you can configure the algorithms it uses.

Supported options:
- Legacy 128-bit encryption
- Recommended 256-bit AES-CBC

Legacy encryption with 128-bit cipher key entropy: No change needed to continue using legacy mode. To use 256-bit AES-CBC, explicitly set it in the configuration.

### Sample code

##### Required User ID

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted and remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect.

##### Reference code

```
1
  

```

### Rest response from server

Returns a client configuration that is ready to use.