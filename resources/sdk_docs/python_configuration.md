# Configuration API for Python SDK

Complete reference for configuring the PubNub Python SDK client with essential properties, method signatures, and examples.

## Configuration

`PNConfiguration` holds user-provided settings that control PubNub client behavior.

### Method(s)

To create a configuration instance:

```
`1pnconfig = PNConfiguration()  
`
```

### Properties

- subscribe_key
  - Type: String
  - Default: n/a
  - Required. Value from Admin Portal.

- publish_key
  - Type: String
  - Default: None
  - Required only if publishing. Value from Admin Portal.

- secret_key
  - Type: String
  - Default: None
  - Required only for modifying/revealing access permissions (Access Manager). Keep secret_key secure; server-side use only.

- user_id
  - Type: String
  - Default: n/a
  - Required. Unique identifier for the user/device. UTF-8 string up to 92 alphanumeric characters. If not set, you cannot connect.

- auth_key
  - Type: String
  - Default: None
  - Used with Access Manager for restricted requests.

- ssl
  - Type: Boolean
  - Default: True
  - Enables TLS.

- connect_timeout
  - Type: Int (seconds)
  - Default: 5
  - Timeout for initial connection.

- subscribe_request_timeout
  - Type: Int (seconds)
  - Default: 310
  - Duration to keep the subscribe loop before disconnecting.

- non_subscribe_request_timeout
  - Type: Int (seconds)
  - Default: 10
  - Timeout for non-subscribe operations.

- filter_expression
  - Type: String
  - Default: None
  - Subscribe with a custom filter expression (requires Stream Controller add-on).

- heartbeat_notification_options
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Options: ALL, FAILURES, NONE.

- reconnect_policy
  - Type: PNReconnectionPolicy
  - Default: PNReconnectionPolicy.EXPONENTIAL (subscribe only)
  - Values: NONE, LINEAR, EXPONENTIAL.
  - LINEAR uses maximum_reconnection_retries and reconnection_interval.

- maximum_reconnection_retries
  - Type: int
  - Default: 10
  - Only for PNReconnectionPolicy.LINEAR.

- reconnection_interval
  - Type: float (seconds)
  - Default: 2.0
  - Only for PNReconnectionPolicy.LINEAR.

- suppress_leave_events
  - Type: Boolean
  - Default: False
  - If True, no presence leave events on unsubscribe.

- enable_subscribe
  - Type: Boolean
  - Default: True
  - Disable if you don’t need subscription operations. Stop extra threads with pubnub.stop().

- daemon
  - Type: Boolean
  - Default: False
  - If True, spawned thread won’t keep the app alive after SIGTERM.

- disable_token_manager
  - Type: Boolean
  - Default: False
  - If True, disables Token Manager; no requests will be authorized via tokens.

- cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: AES.MODE_CBC
  - Cipher method for the legacy crypto module.
  - Warning: If set to GCM, ensure all clients can decode GCM.

- fallback_cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: None
  - Secondary cipher method for decryption if cipher_mode fails (legacy crypto).

- cipher_key
  - Type: String
  - Default: None
  - If set, encrypts communications to/from PubNub.

- use_random_initialization_vector
  - Type: Boolean
  - Default: True
  - If True, random IV for all requests (not just file upload). If False, IV is hard-coded except for file upload.

- crypto_module
  - Type: PubNubCryptoModule
  - Default: None
  - Crypto module for encrypting/decrypting messages and files. Accepts config (PNConfiguration with cipher_key and use_random_initialization_vector). See crypto_module section.

- uuid
  - Type: String
  - Default: n/a
  - Deprecated. Use user_id instead. If UUID not set, you won’t be able to connect.

#### Disabling random initialization vector

Disable random IV only for backward compatibility (<5.1.0). Do not disable for new apps.

- Default cipher mode across SDKs is CBC.
- If Python uses GCM, only other Python SDKs with AES.MODE_GCM can decode.
- To decode CBC messages (from other SDKs) or fetch persisted CBC messages while using GCM, set fallback_cipher_mode to AES.MODE_CBC.

The following example shows how to work with messages sent using different cipher modes:

```

  

```

### Working with cipher mode
example

#### crypto_module

`crypto_module` encrypts/decrypts messages and files. From 7.2.0, you can configure algorithms.

- Options included: legacy 128‑bit encryption and recommended 256‑bit AES‑CBC.
- If crypto_module is not set but cipher_key and use_random_initialization_vector are set, the client uses legacy encryption.
- For configuration details, utilities, and examples, see Encryption docs.

##### Legacy encryption with 128-bit cipher key entropy

No change required to keep legacy encryption. To use recommended 256-bit AES-CBC, explicitly set it in PubNub config.

### Sample code

##### Required User ID

Always set user_id to uniquely identify the user or device. Persist it for the lifetime of the user or device. If not set, you cannot connect.

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

Stream filtering lets a subscriber receive only messages that match a filter.

### Method(s)

```
`1Set Filter Expression  
`
```

Accepts a string.

```
`1Get Filter Expression  
`
```

Returns a string.

### Sample code

#### Set filter expression

##### Required User ID

Always set user_id to uniquely identify the user or device. If not set, you cannot connect.

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