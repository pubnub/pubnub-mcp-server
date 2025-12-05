# Configuration API for Python SDK

Essential configuration, initialization, and event handling details for the PubNub Python SDK. All code blocks and critical technical details are preserved.

## Configuration

`PNConfiguration` holds client settings.

### Method(s)

To create a `configuration` instance:

```
`1pnconfig = PNConfiguration()  
`
```

Required User ID
- Always set user_id (UTF-8, up to 92 alphanumeric chars). If not set, you can't connect.

PNConfiguration properties (type, default, description):
- subscribe_key (String, n/a): Required. Subscribe key from Admin Portal.
- publish_key (String, None): Required only if publishing.
- secret_key (String, None): Required only for modifying/revealing access permissions.
- user_id (String, n/a): Required unique user/device identifier.
- auth_key (String, None): If Access Manager is used, this auth key is sent with restricted requests.
- ssl (Boolean, True): Use SSL/TLS.
- connect_timeout (Int, 5): Connection timeout in seconds.
- subscribe_request_timeout (Int, 310): How long the subscribe loop stays connected before disconnect, in seconds.
- non_subscribe_request_timeout (Int, 10): Timeout for non-subscribe operations, in seconds.
- filter_expression (String, None): Stream Controller filter expression for subscribe.
- heartbeat_notification_options (PNHeartbeatNotificationOptions, PNHeartbeatNotificationOptions.FAILURES): Configure heartbeat notifications. Options: ALL, FAILURES, NONE.
- reconnect_policy (PNReconnectionPolicy, PNReconnectionPolicy.EXPONENTIAL): Reconnection strategy (subscribe only). Options: NONE, LINEAR (uses maximum_reconnection_retries and reconnection_interval), EXPONENTIAL. For more info, see SDK connection lifecycle.
- maximum_reconnection_retries (int, 10): Retry attempts for LINEAR policy.
- reconnection_interval (float, 2.0): Delay in seconds between retries for LINEAR policy.
- suppress_leave_events (Boolean, False): If True, do not send presence leave events on unsubscribe.
- enable_subscribe (Boolean, True): If False, disables subscribe loop. Call pubnub.stop() to stop loops when enabled.
- daemon (Boolean, False): If True, spawned threads won't keep app alive after SIGTERM.
- disable_token_manager (Boolean, False): If True, disables Token Manager; no requests will be authorized with tokens.
- cipher_mode (AES.MODE_CBC or AES.MODE_GCM, AES.MODE_CBC): Legacy crypto module cipher for message encryption. Warning: If using GCM, ensure all other clients can decode GCM.
- fallback_cipher_mode (AES.MODE_CBC or AES.MODE_GCM, None): Secondary cipher for decryption if primary cipher_mode fails.
- cipher_key (String, None): If set, encrypts messages/files.
- use_random_initialization_vector (Boolean, True): Random IV for all requests (not just file upload). Set False only for backward compatibility (<5.1.0).
- crypto_module (PubNubCryptoModule, None): Pluggable crypto module for messages/files. Takes PNConfiguration (with cipher_key and use_random_initialization_vector) as argument. See crypto_module section below.
- uuid (String, n/a): Deprecated. Use user_id instead.

Disabling random initialization vector
- Disable only for backward compatibility (<5.1.0). Do not disable for new apps.
- Default cipher is CBC. If using GCM in Python, only Python SDKs set to AES.MODE_GCM can decode those messages.
- To decode CBC messages while using GCM, set fallback_cipher_mode=AES.MODE_CBC.

The following example shows how to work with messages sent using different cipher modes:

```

  

```

### Working with cipher mode
example

#### crypto_module

crypto_module encrypts/decrypts messages and files. From 7.2.0, you can configure algorithms.

- Options included: legacy 128-bit encryption and recommended 256-bit AES-CBC.
- If crypto_module is not set but cipher_key and use_random_initialization_vector are set, the client uses legacy encryption.
- For configuration details and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
- No change required to keep legacy encryption.
- To use recommended 256-bit AES-CBC, explicitly set crypto_module in config.

### Sample code

##### Required User ID
Always set user_id to uniquely identify the user/device and keep it stable across sessions.

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

## Initialization

Add PubNub to your project as per the Getting Started guide.

### Description

Initialize the PubNub client with account credentials (publish_key, subscribe_key) before calling APIs.

### Method(s)

To Initialize PubNub:

```
`1pubnub = PubNub(pn_configuration, custom_request_handler)  
`
```

Parameters:
- pn_configuration (PNConfiguration, required): See Configuration.
- custom_request_handler (subclass of BaseRequestHandler, default HttpxRequestHandler): Optional custom HTTP request handler. If omitted, SDK checks PUBNUB_REQUEST_HANDLER env var; if invalid, defaults to HttpxRequestHandler.

Handlers:
- HttpxRequestHandler: Synchronous requests via httpx.
- RequestsRequestHandler: Synchronous requests via requests.

### Sample code

#### Initialize the PubNub client API

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

### Returns

Returns a PubNub instance for APIs like publish(), subscribe(), history(), and here_now().

### Other examples

#### Use a custom request handler

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

#### Initialize a non-secure client

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

#### Initialization for a Read-Only client

```
1from pubnub.pnconfiguration import PNConfiguration  
2from pubnub.pubnub import PubNub  
3
  
4pnconfig = PNConfiguration()  
5pnconfig.subscribe_key = "my_subkey"  
6
  
7pubnub = PubNub(pnconfig)  

```

#### Use a custom user ID

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

#### Initializing with SSL enabled

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

#### Initializing with Access Manager

Requires Access Manager add-on enabled in Admin Portal.

Secure your secret_key
- secret_key grants root permissions; keep it server-side and secure.

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

The client will sign Access Manager messages using secret_key.

## Event listeners

Sources for real-time updates:
- PubNub client: all subscriptions (channels, groups, metadata, users).
- Subscription: only for its specific entity (channel, group, metadata, or user).
- SubscriptionsSet: for all entities represented by its subscription list.

See Publish & Subscribe for subscribing and adding handlers per entity.

## Filter expression

Requires Stream Controller add-on.

Stream filtering lets subscribers receive only messages that match a filter.

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