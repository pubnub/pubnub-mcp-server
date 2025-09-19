# Configuration API – PubNub Ruby SDK

## 1. Install

```bash
gem install pubnub
```

or add to Gemfile:

```ruby
gem 'pubnub', '~> 5.5.0'
```

## 2. Basic usage

```ruby
require 'pubnub'
```

## 3. Initialize `Pubnub` client

```ruby
Pubnub(
  subscribe_key,
  publish_key,
  secret_key,
  auth_key,
  ssl,
  user_id,
  heartbeat,
  callback,
  ttl,
  open_timeout,
  read_timeout,
  idle_timeout,
  s_open_timeout,
  s_read_timeout,
  s_idle_timeout,
  logger,
  origin,
  http_sync,
  crypto_module,
  cipher_key,
  random_iv,
  uuid
)
```

### Parameter summary

* `subscribe_key` (String/Symbol, required) – subscribe key.  
* `publish_key`   (String/Symbol) – publish key, required to publish.  
* `secret_key`    (String/Symbol) – secret key for Access Manager.  
* `auth_key`      (String/Symbol) – per-user auth key.  
* `ssl`           (Boolean, default `false`) – enable TLS.  
* `user_id`       (String, required) – UTF-8 ID (≤ 92 chars).  
* `heartbeat`     (Integer) – presence heartbeat/timeout in seconds.  
* `callback`      (Lambda) – default callback for every request.  
* `ttl`           (Integer) – default TTL for grant/revoke.  
* `open_timeout`  (Integer, default `10`)  – connect timeout (non-subscribe).  
* `read_timeout`  (Integer, default `10`)  – read timeout (non-subscribe).  
* `idle_timeout`  (Integer, default `10`)  – idle timeout (non-subscribe).  
* `s_open_timeout`(Integer, default `310`) – connect timeout (subscribe).  
* `s_read_timeout`(Integer, default `310`) – read timeout (subscribe).  
* `s_idle_timeout`(Integer, default `310`) – idle timeout (subscribe).  
* `logger`        (Logger, default writes to `pubnub.log`).  
* `origin`        (String, default `ps.pndsn.com`) – custom domain.  
* `http_sync`     (Boolean, default `false`) – when `true`, methods run synchronously and return `Envelope`.  
* `crypto_module` (`Crypto::CryptoModule`) – preferred way to set encryption (see below).  
* `cipher_key`    (String, DEPRECATED) – legacy encryption key.  
* `random_iv`     (Boolean, default `true`, DEPRECATED) – legacy IV switch.  
* `uuid`          (String, DEPRECATED) – use `user_id` instead.

### Disabling random IV  
Only for backward compatibility (< 4.6.0). Never disable for new apps.

## 4. Encryption (`crypto_module`)

```ruby
# Recommended 256-bit AES-CBC (encrypt) + legacy & AES-CBC (decrypt)
pubnub = Pubnub.new(
  # ...
  crypto_module: Crypto::CryptoModule.new_aes_cbc("enigma", true)
)

# Legacy 128-bit encryption
pubnub = Pubnub.new(
  # ...
  crypto_module: Crypto::CryptoModule.new_legacy("enigma", true)
)
```

### Manual / partial encryption

```ruby
data_to_encrypt = { key: "value to encrypt" }
json_string     = data_to_encrypt.to_json

crypto_module   = Crypto::CryptoModule.new_aes_cbc("enigma", true)
encrypted_data  = crypto_module.encrypt(json_string)
base64_string   = Base64.strict_encode64(encrypted_data)
```

### Manual decryption

```ruby
base64_encoded  = "CxQ0dxjBqIHdfuvtTcKeaLlyeRY7ZuaKy27wwwWo1EE="
decoded_data    = Base64.decode64(base64_encoded)
decrypted_json  = crypto_module.decrypt(decoded_data)
```

Older SDKs (< 5.2.2) cannot decrypt 256-bit AES-CBC.

## 5. Initialization examples

### Full config with encryption

```ruby
require 'pubnub'

pubnub = Pubnub.new(
  subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),
  publish_key:   ENV.fetch('PUBLISH_KEY', 'demo'),
  ssl:           true,
  user_id:       'myUniqueUserId',
  crypto_module: Pubnub::Crypto::CryptoModule.new_aes_cbc("enigma", true)
)

puts "Initialized with user_id: #{pubnub.user_id}"
```

### Minimal client

```ruby
pubnub = Pubnub.new(
  publish_key:  'demo',
  subscribe_key:'demo',
  user_id:      'myUniqueUserId'
)
```

### Read-only client

```ruby
pubnub = Pubnub.new(
  subscribe_key: 'demo',
  user_id:       'myUniqueUserId'
)
```

### SSL enabled

```ruby
pubnub = Pubnub.new(
  subscribe_key: 'demo',
  publish_key:   'demo',
  ssl:           true,
  user_id:       'myUniqueUserId'
)
```

### Access Manager (server side)

```ruby
pubnub = Pubnub.new(
  subscribe_key: 'my_subkey',
  secret_key:    'my_secretkey',
  user_id:       'myUniqueUserId'
)
```

## 6. Event listeners

Add:

```ruby
callback = Pubnub::SubscribeCallback.new(
  message:  ->(_env) {},
  presence: ->(_env) {},
  signal:   ->(_env) {},
  status:   ->(env) {
    if env.status[:error]
      case env.status[:category]
      when Pubnub::Constants::STATUS_ACCESS_DENIED  then # ...
      when Pubnub::Constants::STATUS_TIMEOUT        then # ...
      when Pubnub::Constants::STATUS_NON_JSON_RESPONSE then # ...
      when Pubnub::Constants::STATUS_API_KEY_ERROR  then # ...
      end
    end
  }
)

pubnub.add_listener(callback)
```

Remove:

```ruby
pubnub.remove_listener(name: 'my_listener')
# or
pubnub.remove_listener(callback)
```

## 7. Presence for a channel group

Subscribe to presence:

```ruby
pubnub = Pubnub.new(
  subscribe_key: :demo,
  publish_key:   :demo
)

callback = Pubnub::SubscribeCallback.new(
  message:  ->(_env) {},
  presence: ->(env) { puts "PRESENCE: #{env.result[:data]}" },
  status:   ->(_env) {}
)

pubnub.add_listener(callback)
pubnub.subscribe(channel_group: 'my_group', with_presence: true)
```

## 8. Authentication key helper

```ruby
pubnub.auth_key
```

Returns current `auth_key`.

---

The configuration above returns a `Pubnub` instance ready for methods such as `publish`, `subscribe`, `history`, `here_now`, etc.