# Configuration API for Python SDK

Complete API reference for configuring PubNub with the Python SDK. Includes configuration object, parameters, and examples.

## Configuration

`PNConfiguration` stores user-provided settings that control PubNub client behavior.

### Method(s)

To create a `PNConfiguration` instance:

```
`1pnconfig = PNConfiguration()  
`
```

### Parameters

- subscribe_key
  - Type: String
  - Default: n/a
  - Description: subscribe_key from Admin Portal. Required.

- publish_key
  - Type: String
  - Default: None
  - Description: publish_key from Admin Portal. Only required if publishing.

- secret_key
  - Type: String
  - Default: None
  - Description: secret_key. Only required for modifying/revealing access permissions.

- user_id
  - Type: String
  - Default: n/a
  - Description: Unique user_id to identify the user or device. UTF-8 string up to 92 alphanumeric characters. Required to connect.

- auth_key
  - Type: String
  - Default: None
  - Description: If Access Manager is used, client includes this authKey in restricted requests.

- ssl
  - Type: Boolean
  - Default: True
  - Description: Use SSL.

- connect_timeout
  - Type: Int
  - Default: 5
  - Description: Seconds to wait before giving up connecting.

- subscribe_request_timeout
  - Type: Int
  - Default: 310
  - Description: How long to keep the subscribe loop running before disconnect (seconds).

- non_subscribe_request_timeout
  - Type: Int
  - Default: 10
  - Description: Timeout for non-subscribe operations (seconds).

- filter_expression
  - Type: String
  - Default: None
  - Description: Subscribe with a custom filter expression.

- heartbeat_notification_options
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notifications. Supported: PNHeartbeatNotificationOptions.ALL, PNHeartbeatNotificationOptions.NONE.

- reconnect_policy
  - Type: PNReconnectionPolicy
  - Default: PNReconnectionPolicy.EXPONENTIAL (subscribe only)
  - Description: Reconnection policy. Available values:
    - PNReconnectionPolicy.NONE
    - PNReconnectionPolicy.LINEAR (uses maximum_reconnection_retries and reconnection_interval)
    - PNReconnectionPolicy.EXPONENTIAL

- maximum_reconnection_retries
  - Type: int
  - Default: 10
  - Description: Number of retry attempts. Applicable to LINEAR only.

- reconnection_interval
  - Type: float
  - Default: 2.0
  - Description: Delay (seconds) between retries. Applicable to LINEAR only.

- suppress_leave_events
  - Type: Boolean
  - Default: False
  - Description: If True, client does not send presence leave events on unsubscribe.

- enable_subscribe
  - Type: Boolean
  - Default: True
  - Description: Disable if you won’t subscribe. When enabled, extra threads/loops start and must be stopped with pubnub.stop().

- daemon
  - Type: Boolean
  - Default: False
  - Description: If True, spawned thread won’t keep the app running after SIGTERM.

- disable_token_manager
  - Type: Boolean
  - Default: False
  - Description: If True, Token Manager System is disabled; no requests will be authorized via tokens.

- cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: AES.MODE_CBC
  - Description: Cipher for legacy crypto module. Warning: If set to GCM, ensure all other clients can decode GCM.

- fallback_cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: None
  - Description: Secondary cipher for decryption in legacy crypto module if cipher_mode fails.

- cipher_key
  - Type: String
  - Default: None
  - Description: If set, all communications to/from PubNub are encrypted.

- use_random_initialization_vector
  - Type: Boolean
  - Default: True
  - Description: Random IV for all requests (not just file upload). If False, IV is fixed except for file upload.

- crypto_module
  - Type: PubNubCryptoModule
  - Default: None
  - Description: Crypto module used for encrypting/decrypting messages and files. Accepts config (PNConfiguration with cipher_key and use_random_initialization_vector). See crypto_module section.

- uuid
  - Type: String
  - Default: n/a
  - Description: Deprecated; use user_id instead. Required to connect in older code paths.

#### Disabling random initialization vector

Disable random IV only for backward compatibility (< 5.1.0). Do not disable in new apps.

By default, all PubNub SDKs use CBC. If Python uses GCM, only another Python SDK set to AES.MODE_GCM can decode.

To decode messages sent with CBC (other SDKs) or fetch persisted messages while using GCM, set fallback_cipher_mode to AES.MODE_CBC.

The following example shows how to work with messages sent using different cipher modes:

```

  

```

### Working with cipher mode
example

#### crypto_module

crypto_module encrypts and decrypts messages and files. From 7.2.0, you can configure the algorithms it uses.

Each SDK includes two options: legacy 128‑bit encryption and recommended 256‑bit AES‑CBC. If you don't set crypto_module but set cipher_key and use_random_initialization_vector, the client uses legacy encryption.

For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy

No changes needed to keep using legacy encryption. To use recommended 256‑bit AES‑CBC, set crypto_module in PubNub config.

### Sample code

##### Required User ID

Always set a persistent user_id to uniquely identify the user or device.

##### Reference code

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.enums import PNHeartbeatNotificationOptions  
4from pubnub.pubnub import PubNub  
5from pubnub.crypto import AesCbcCryptoModule  
6
  
7
  
8# Configuration for PubNub instance  
9pn_configuration = PNConfiguration()  
10
  
11# Set configuration values  
12pn_configuration.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  # required  
13pn_configuration.publish_key = os.getenv('PUBLISH_KEY', 'demo')  # only required if publishing  
14pn_configuration.secret_key = os.getenv('SECRET_KEY', 'my_secret_key')  # optional  
15pn_configuration.cipher_key = os.getenv('CIPHER_KEY', 'my_cipher_key')  # for encryption/decryption  
16pn_configuration.crypto_module = AesCbcCryptoModule(pn_configuration)  # for encryption/decryption  
17pn_configuration.user_id = os.getenv('USER_ID', 'my_custom_user_id')  # must be set  
18pn_configuration.auth_key = os.getenv('AUTH_KEY', 'my_auth_key')  # optional  
19pn_configuration.ssl = True  
20pn_configuration.connect_timeout = 100  
21pn_configuration.subscribe_request_timeout = 310  
22pn_configuration.non_subscribe_request_timeout = 300  
23pn_configuration.filter_expression = "such=wow"  
24pn_configuration.heartbeat_notification_options = PNHeartbeatNotificationOptions.ALL  
25
  
26
  
27# Initialize the PubNub client  
28pubnub = PubNub(pn_configuration)  
29
  
30print("Configuration set up complete and PubNub client initialized.")  
31
  

```

## Filter expression

##### Requires Stream Controller add-on

Stream filtering lets a subscriber receive only messages that match a filter. The client sets the filter, and the server applies it.

### Method(s)

```
`1Set Filter Expression  
`
```

The property accepts a string.

```
`1Get Filter Expression  
`
```

The property returns a string.

### Sample code

#### Set filter expression

```
1from pubnub.pnconfiguration import PNConfiguration  
2
  
3pnconfig = PNConfiguration()  
4pnconfig.filter_expression = "such=wow"  

```

#### Get filter expression

```
`1filter = pnconfig.filter_expression**`
```