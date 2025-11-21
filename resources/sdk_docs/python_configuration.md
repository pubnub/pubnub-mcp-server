# Configuration API for Python SDK

Complete API reference for building real-time applications on PubNub with the Python Software Development Kit (SDK). This page covers configuration, initialization, and event handling with concise, working examples.

## Configuration[​](#configuration)

`PNConfiguration` stores user-provided settings that control PubNub client behavior.

### Method(s)[​](#methods)

To create `configuration` instance use:

```
`1pnconfig = PNConfiguration()  
`
```

Configuration properties:

- subscribe_key
  - Type: String
  - Default: n/a
  - Description: subscribe_key from Admin Portal. Required.
- publish_key
  - Type: String
  - Default: None
  - Description: publish_key from Admin Portal (required if publishing).
- secret_key
  - Type: String
  - Default: None
  - Description: secret_key (only required for modifying/revealing access permissions).
- user_id
  - Type: String
  - Default: n/a
  - Description: Unique user_id for the user/device (UTF-8, up to 92 alphanumeric chars). Required to connect.
- auth_key
  - Type: String
  - Default: None
  - Description: If Access Manager is utilized, client uses this authKey in all restricted requests.
- ssl
  - Type: Boolean
  - Default: True
  - Description: Use Secure Sockets Layer (SSL).
- connect_timeout
  - Type: Int
  - Default: 5
  - Description: Connection timeout in seconds.
- subscribe_request_timeout
  - Type: Int
  - Default: 310
  - Description: How long to keep the subscribe loop running before disconnect (seconds).
- non_subscribe_request_timeout
  - Type: Int
  - Default: 10
  - Description: Non-subscribe operation response timeout (seconds).
- filter_expression
  - Type: String
  - Default: None
  - Description: Subscribe with a custom filter expression.
- heartbeat_notification_options
  - Type: PNHeartbeatNotificationOptions
  - Default: PNHeartbeatNotificationOptions.FAILURES
  - Description: Heartbeat notifications. Options: ALL, FAILURES, NONE.
- reconnect_policy
  - Type: PNReconnectionPolicy
  - Default: PNReconnectionPolicy.EXPONENTIAL (subscribe only)
  - Description: Reconnection policy. Values: NONE, LINEAR (see maximum_reconnection_retries and reconnection_interval), EXPONENTIAL. For more information, refer to SDK connection lifecycle.
- maximum_reconnection_retries
  - Type: int
  - Default: 10
  - Description: Number of retries. Applicable to PNReconnectionPolicy.LINEAR only.
- reconnection_interval
  - Type: float
  - Default: 2.0
  - Description: Delay between failed retry attempts (seconds). Applicable to PNReconnectionPolicy.LINEAR only.
- suppress_leave_events
  - Type: Boolean
  - Default: False
  - Description: If True, client doesn't send presence leave events during unsubscribe.
- enable_subscribe
  - Type: Boolean
  - Default: True
  - Description: Disable the subscribe loop if you don't need subscribe operations. Extra threads/loops start by default; stop them explicitly with pubnub.stop().
- daemon
  - Type: Boolean
  - Default: False
  - Description: If True, spawned threads won't keep the app running after SIGTERM.
- disable_token_manager
  - Type: Boolean
  - Default: False
  - Description: If True, Token Manager System is disabled; no requests will be authorized via tokens.
- cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: AES.MODE_CBC
  - Description: Cipher method for message encryption for the legacy crypto module. Warning: If set to GCM, ensure all other clients can decode GCM.
- fallback_cipher_mode
  - Type: AES.MODE_CBC or AES.MODE_GCM
  - Default: None
  - Description: Secondary cipher method used for decryption if primary cipher_mode fails (legacy crypto module).
- cipher_key
  - Type: String
  - Default: None
  - Description: If set, encrypts communications to/from PubNub.
- use_random_initialization_vector
  - Type: Boolean
  - Default: True
  - Description: When True the IV is random for all requests (not just file upload). When False the IV is hard-coded for all requests except file upload.
- crypto_module
  - Type: PubNubCryptoModule
  - Default: None
  - Description: Cryptography module for encryption/decryption of messages and files. Takes config (PNConfiguration with cipher_key and use_random_initialization_vector). See crypto_module section below.
- uuid (deprecated)
  - Type: String
  - Default: n/a
  - Description: Deprecated; use user_id instead. Required to connect if used.

##### Disabling random initialization vector

- Disable random IV only for backward compatibility (< 5.1.0). Never disable random IV in new applications.
- By default SDKs use CBC. If you set Python SDK cipher_mode to GCM, only Python SDKs with AES.MODE_GCM can decode.
- If using GCM but need to decode CBC (other SDKs) or fetch persisted messages, set fallback_cipher_mode to AES.MODE_CBC.

The following example shows how to work with messages sent using different cipher modes:

```

  

```

### Working with cipher mode
example

#### `crypto_module`[​](#crypto_module)

- crypto_module encrypts/decrypts messages and files. From 7.2.0, you can configure algorithms.
- Two options included: legacy 128‑bit encryption and recommended 256‑bit AES‑CBC. See Message Encryption and File Encryption.
- If crypto_module is not set but cipher_key and use_random_initialization_vector are set, the client uses legacy encryption.
- For configuration details, utilities, and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy

- No changes required to keep legacy encryption.
- To use recommended 256-bit AES-CBC, explicitly set it in PubNub config.

### Sample code[​](#sample-code)

##### Required User ID

Always set the user_id to uniquely identify the user or device that connects to PubNub. Persist it for the lifetime of the user/device. If not set, you won't be able to connect.

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

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined in the Getting Started guide.

### Description[​](#description)

Initialize the PubNub Client API context before calling any APIs. Establishes credentials such as publish_key and subscribe_key.

### Method(s)[​](#methods-1)

```
`1pubnub = PubNub(pn_configuration, custom_request_handler)  
`
```

Parameters:

- pn_configuration
  - Type: PNConfiguration
  - Default: n/a
  - Description: The configuration object. See Configuration.
- custom_request_handler
  - Type: subclass of BaseRequestHandler
  - Default: HttpxRequestHandler
  - Description: Optional custom HTTP request handler. See Custom request handler.

#### Custom request handler[​](#custom-request-handler)

- Optional custom_request_handler lets you select the HTTP library.
- If omitted, SDK checks PUBNUB_REQUEST_HANDLER env var. If it's not a subclass of BaseRequestHandler, defaults to HttpxRequestHandler.
- Available handlers:
  - HttpxRequestHandler: synchronous handler based on httpx.
  - RequestsRequestHandler: synchronous handler based on requests.

### Sample code[​](#sample-code-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required User ID

Always set the user_id to uniquely identify the user or device that connects to PubNub.

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6pnconfig.publish_key = "my_pubkey"  
7pnconfig.ssl = True  
8pnconfig.user_id = "my_custom_user_id"  
9pubnub = PubNub(pnconfig)  

```

### Returns[​](#returns)

Returns a PubNub instance for APIs like publish(), subscribe(), history(), and here_now().

### Other examples[​](#other-examples)

#### Use a custom request handler[​](#use-a-custom-request-handler)

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3from pubnub.request_handlers.requests_handler import RequestsRequestHandler  
4
  
5pnconfig = PNConfiguration()  
6pnconfig.subscribe_key = "my_subkey"  
7pnconfig.publish_key = "my_pubkey"  
8pnconfig.user_id = "my_custom_user_id"  
9
  
10pubnub = PubNub(pnconfig, custom_request_handler=RequestsRequestHandler)  

```

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6pnconfig.publish_key = "my_pubkey"  
7pnconfig.ssl = False  
8pnconfig.user_id = "my_custom_user_id"  
9pubnub = PubNub(pnconfig)  

```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

Omit publish_key if the client only reads.

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6
  
7pubnub = PubNub(pnconfig)  

```

#### Use a custom user ID[​](#use-a-custom-user-id)

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5
  
6pnconfig.subscribe_key = 'mySubscribeKey'  
7pnconfig.publish_key = 'myPublishKey'  
8pnconfig.user_id = "my_custom_user_id"  
9
  
10pubnub = PubNub(pnconfig)  

```

#### Initializing with SSL enabled[​](#initializing-with-ssl-enabled)

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6pnconfig.publish_key = "my_pubkey"  
7pnconfig.ssl = True  
8pnconfig.user_id = "my_custom_user_id"  
9pubnub = PubNub(pnconfig)  

```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

Requires Access Manager add-on enabled for your key.

Secure your secret_key: Anyone with the secret_key can grant/revoke permissions. Never expose it; use only on secure server-side platforms. When you init with secret_key, you get root permissions; servers get all access on all channels.

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6pnconfig.publish_key = "my_pubkey"  
7pnconfig.secret_key = "my_secretkey"  
8pnconfig.user_id = "my_custom_user_id"  
9pnconfig.ssl = True  
10
  
11pubnub = PubNub(pnconfig)  

```

Now the pubnub object can access Access Manager functions and will sign messages with secret_key.

## Event listeners[​](#event-listeners)

PubNub SDKs provide real-time updates from:
- The PubNub client: all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for its specific object.
- SubscriptionsSet: updates for a list of subscriptions.

See Publish & Subscribe for details on listeners.

## Filter expression[​](#filter-expression)

Requires Stream Controller add-on.

Stream filtering lets a subscriber receive only messages that match a filter.

### Method(s)[​](#methods-2)

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

### Sample code[​](#sample-code-2)

#### Set filter expression[​](#set-filter-expression)

```
1from pubnub.pnconfiguration import PNConfiguration  
2
  
3pnconfig = PNConfiguration()  
4pnconfig.filter_expression = "such=wow"  

```

#### Get filter expression[​](#get-filter-expression)

```
`1filter = pnconfig.filter_expression**`
```