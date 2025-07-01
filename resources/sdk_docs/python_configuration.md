# Configuration API – Python SDK (Condensed)

## PNConfiguration

Use `PNConfiguration` to set all client options.

```python
pnconfig = PNConfiguration()
```

### Parameters

| Name | Type | Default | Notes |
|------|------|---------|-------|
| subscribe_key | String | — | Required. From Admin Portal. |
| publish_key | String | None | Needed for publishing. |
| secret_key | String | None | Needed for Access-Manager grant/revoke. |
| user_id | String | — | Required. UTF-8, ≤ 92 chars. |
| auth_key | String | None | Sent with Access-Manager requests. |
| ssl | Boolean | True | Enable TLS. |
| connect_timeout | Int | 5 | Seconds to open TCP connection. |
| subscribe_request_timeout | Int | 310 | Seconds to keep long-poll subscribe. |
| non_subscribe_request_timeout | Int | 10 | Timeout for all other requests. |
| filter_expression | String | None | Stream-Controller filter. |
| heartbeat_notification_options | PNHeartbeatNotificationOptions | PNHeartbeatNotificationOptions.FAILURES | Other values: `ALL`, `NONE`. |
| reconnect_policy | PNReconnectionPolicy | PNReconnectionPolicy.EXPONENTIAL | Values: `NONE`, `LINEAR`, `EXPONENTIAL`. |
| maximum_reconnection_retries | int | 10 | Used only with `LINEAR`. |
| reconnection_interval | float | 2.0 | Seconds between retries (LINEAR). |
| suppress_leave_events | Boolean | False | Skip `leave` on unsubscribe. |
| enable_subscribe | Boolean | True | Disable to avoid subscribe loop. |
| daemon | Boolean | False | Spawned threads won’t block SIGTERM when `True`. |
| disable_token_manager | Boolean | False | Disable TMS authorization. |
| cipher_mode | AES.MODE_CBC / AES.MODE_GCM | AES.MODE_CBC | Legacy crypto only. |
| fallback_cipher_mode | AES.MODE_* | None | Secondary decrypt mode (legacy crypto). |
| cipher_key | String | None | Encrypts traffic when set. |
| use_random_initialization_vector | Boolean | True | Set `False` only for pre-5.1.0 compatibility. |
| crypto_module | PubNubCryptoModule | None | Override encryption engine (see below). |
| uuid | String | — | Deprecated – use `user_id`. |

### Disable random IV (legacy only)
Turn off `use_random_initialization_vector` **only** for backwards compatibility with SDK < 5.1.0.

---

## Working with cipher mode / crypto_module

```python
# Encrypt with 256-bit AES-CBC (recommended); auto-decrypt legacy data
config = PNConfiguration()
...
config.cipher_key = "my_cipher_key"
config.cipher_mode = AES.MODE_GCM            # optional (legacy)
config.fallback_cipher_mode = AES.MODE_CBC   # optional (legacy)
config.crypto_module = AesCbcCryptoModule(config)
pubnub = PubNub(config)

# Encrypt with 128-bit key entropy (legacy GCM)
config = PNConfiguration()
...
```
(show all 33 lines)

Older SDK (< 7.2.0) can’t decrypt 256-bit AES-CBC data.

---

## Reference configuration example

```python
import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.enums import PNHeartbeatNotificationOptions
from pubnub.pubnub import PubNub
from pubnub.crypto import AesCbcCryptoModule

pn_configuration = PNConfiguration()

pn_configuration.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')
pn_configuration.publish_key   = os.getenv('PUBLISH_KEY', 'demo')
pn_configuration.secret_key    = os.getenv('SECRET_KEY', 'my_secret_key')
pn_configuration.cipher_key    = os.getenv('CIPHER_KEY', 'my_cipher_key')
```
(show all 31 lines)

---

## Initialization

```python
pubnub = PubNub(pn_configuration, custom_request_handler)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| pn_configuration | PNConfiguration | — | Required configuration. |
| custom_request_handler | subclass of `BaseRequestHandler` | `HttpxRequestHandler` | Optional HTTP client. |

Available handlers:
* `HttpxRequestHandler` (httpx, default)  
* `RequestsRequestHandler` (requests)

---

### Basic initialization

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"
pnconfig.publish_key   = "my_pubkey"
pnconfig.ssl           = True
pnconfig.user_id       = "my_custom_user_id"

pubnub = PubNub(pnconfig)
```

### Custom request handler

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.request_handlers.requests_handler import RequestsRequestHandler

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"
pnconfig.publish_key   = "my_pubkey"
pnconfig.user_id       = "my_custom_user_id"

pubnub = PubNub(pnconfig, custom_request_handler=RequestsRequestHandler)
```

### Non-secure (no TLS)

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"
pnconfig.publish_key   = "my_pubkey"
pnconfig.ssl           = False
pnconfig.user_id       = "my_custom_user_id"

pubnub = PubNub(pnconfig)
```

### Read-only client (omit publish_key)

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"

pubnub = PubNub(pnconfig)
```

### Custom `user_id`

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = 'mySubscribeKey'
pnconfig.publish_key   = 'myPublishKey'
pnconfig.user_id       = "my_custom_user_id"

pubnub = PubNub(pnconfig)
```

### SSL enabled (duplicate for clarity)

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"
pnconfig.publish_key   = "my_pubkey"
pnconfig.ssl           = True
pnconfig.user_id       = "my_custom_user_id"

pubnub = PubNub(pnconfig)
```

### Access-Manager (server-side)

```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.subscribe_key = "my_subkey"
pnconfig.publish_key   = "my_pubkey"
pnconfig.secret_key    = "my_secretkey"   # keep secret!
pnconfig.user_id       = "my_custom_user_id"
pnconfig.ssl           = True

pubnub = PubNub(pnconfig)
```

---

## Filter Expression (Stream Controller)

Set / get on `PNConfiguration.filter_expression`.

```python
from pubnub.pnconfiguration import PNConfiguration

pnconfig = PNConfiguration()
pnconfig.filter_expression = "such=wow"
```

```python
filter = pnconfig.filter_expression**
```

_Last updated Apr 29 2025_