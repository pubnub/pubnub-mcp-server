# PubNub Python SDK – Configuration (Condensed)

## PNConfiguration

Instantiate once and pass to `PubNub`.

```
`pnconfig = PNConfiguration()  
`
```

Parameter (type, default) – description  
• subscribe_key (str, —) – REQUIRED.  
• publish_key (str, None) – Needed to publish.  
• secret_key (str, None) – For Access-Manager admin calls.  
• user_id (str, —) – REQUIRED unique ID (≤ 92 UTF-8 chars).  
• auth_key (str, None) – Access-Manager auth key.  
• ssl (bool, True) – Transport security.  
• connect_timeout (int, 5 s) – TCP connect.  
• subscribe_request_timeout (int, 310 s) – Subscribe loop.  
• non_subscribe_request_timeout (int, 10 s) – All other ops.  
• filter_expression (str, None) – Stream Controller filter.  
• heartbeat_notification_options (`PNHeartbeatNotificationOptions`, FAILURES)  
  - ALL | FAILURES | NONE.  
• reconnect_policy (`PNReconnectionPolicy`, EXPONENTIAL)  
  - NONE | LINEAR (`maximum_reconnection_retries`, `reconnection_interval`) | EXPONENTIAL  
• maximum_reconnection_retries (int, 10) – LINEAR only.  
• reconnection_interval (float, 2.0 s) – LINEAR only.  
• suppress_leave_events (bool, False) – Skip leave on unsubscribe.  
• enable_subscribe (bool, True) – Disable full subscribe loop if false.  
• daemon (bool, False) – Non-blocking threads.  
• disable_token_manager (bool, False) – Disable TMS.  
• cipher_mode (`AES.MODE_CBC`|`AES.MODE_GCM`, CBC) – Legacy crypto.  
• fallback_cipher_mode (same, None) – Secondary decrypt mode.  
• cipher_key (str, None) – Enables encryption.  
• use_random_initialization_vector (bool, True) – Random IV (leave True for new apps).  
• crypto_module (`PubNubCryptoModule`, None) – Pluggable crypto (see below).  
• uuid (str, DEPRECATED) – Use `user_id` instead.

### Disabling random IV  
Only for backward-compatibility (< 5.1.0). Keep enabled for new apps.

## Working with cipher_mode / crypto_module

```
`#  encrypts using 256-bit AES-CBC cipher (recommended)  
#  decrypts data encrypted with the legacy (AES and GCM) and the 256-bit AES-CBC ciphers  
config = PNConfiguration()  
...  
# all necessary config options  
config.cipher_key = "my_cipher_key"  
config.cipher_mode = AES.MODE_GCM # optional, used for the legacy module only  
config.fallback_cipher_mode = AES.MODE_CBC # optional, used for the legacy module only  
config.crypto_module = AesCbcCryptoModule(config)  
pubnub = PubNub(config)  
  
#  encrypts with 128-bit cipher key entropy (legacy) with GCM  
#  decrypts data encrypted with the legacy (AES and GCM) and the 256-bit AES-CBC ciphers  
config = PNConfiguration()  
...  
`
```

• SDK < 7.2.0 cannot decrypt 256-bit AES-CBC data—upgrade clients or stay on legacy crypto.

## Initialization

Create a client:

```
`pubnub = PubNub(pn_configuration, custom_request_handler)  
`
```

Parameter (type, default)  
• pn_configuration – `PNConfiguration` (required).  
• custom_request_handler (subclass of `BaseRequestHandler`, `HttpxRequestHandler`)  
  - Alternatives: `HttpxRequestHandler`, `RequestsRequestHandler`.

The returned `PubNub` instance exposes all APIs (`publish`, `subscribe`, `history`, …).

### Code samples

Reference configuration:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.enums import PNHeartbeatNotificationOptions  
from pubnub.pubnub import PubNub  
from pubnub.crypto import AesCbcCryptoModule  
  
  
# Configuration for PubNub instance  
pn_configuration = PNConfiguration()  
  
# Set configuration values  
pn_configuration.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  # required  
pn_configuration.publish_key = os.getenv('PUBLISH_KEY', 'demo')  # only required if publishing  
pn_configuration.secret_key = os.getenv('SECRET_KEY', 'my_secret_key')  # optional  
pn_configuration.cipher_key = os.getenv('CIPHER_KEY', 'my_cipher_key')  # for encryption/decryption  
`
```

Initialize basic client:

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = True  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

Custom request handler:

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.request_handlers.requests_handler import RequestsRequestHandler  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.user_id = "my_custom_user_id"  
  
pubnub = PubNub(pnconfig, custom_request_handler=RequestsRequestHandler)  
`
```

Non-secure client:

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = False  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

Read-only client (no `publish_key`):

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
  
pubnub = PubNub(pnconfig)  
`
```

Custom user ID:

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
  
pnconfig.subscribe_key = 'mySubscribeKey'  
pnconfig.publish_key = 'myPublishKey'  
pnconfig.user_id = "my_custom_user_id"  
  
pubnub = PubNub(pnconfig)  
`
```

SSL-enabled client:

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = True  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

Access-Manager (server side):

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.secret_key = "my_secretkey"  
pnconfig.user_id = "my_custom_user_id"  
pnconfig.ssl = True  
  
pubnub = PubNub(pnconfig)  
`
```

## Filter Expression

Set/get Stream Controller filter:

```
`Set Filter Expression  
`
```

```
`Get Filter Expression  
`
```

Example:

```
`from pubnub.pnconfiguration import PNConfiguration  
  
pnconfig = PNConfiguration()  
pnconfig.filter_expression = "such=wow"  
`
```

Retrieve:

```
`filter = pnconfig.filter_expression**`
```

(Last updated Jul 15 2025)