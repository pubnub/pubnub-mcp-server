# Configuration API for Ruby SDK (condensed)

## Installation
### Install via RubyGems
```
`gem install pubnub  
`
```
### Bundler
```
`gem 'pubnub', '~> 5.5.0'  
`
```

## Usage
```ruby
require 'pubnub'
```

## Initialization

### Constructor
```
`Pubnub.new(  
    subscribe_key:,  
    publish_key:,  
    secret_key:,  
    auth_key:,  
    ssl:,  
    user_id:,  
    heartbeat:,  
    callback:,  
    ttl:,  
    open_timeout:,  
    read_timeout:,  
    idle_timeout:,  
    s_open_timeout:,  
    s_read_timeout:,  
    s_idle_timeout:,  
    logger:,  
    origin:,  
    http_sync:,  
    crypto_module:,  
    cipher_key:,      # deprecated – use crypto_module  
    random_iv:,       # deprecated – use crypto_module  
    uuid:             # deprecated – use user_id  
)  
`
```

### Parameters (essential only)
* **subscribe_key** (String, required) – PubNub subscribe key.  
* **publish_key**  (String) – omit for read-only clients.  
* **secret_key**   (String) – required for Access Manager.  
* **auth_key**     (String) – Auth token.  
* **ssl**          (Boolean, default `false`) – enable TLS.  
* **user_id**      (String, required, ≤92 UTF-8 chars) – unique per user/device.  
* **heartbeat**    (Integer) – heartbeat interval & timeout.  
* **callback**     (Lambda) – default callback for all calls.  
* **ttl**          (Integer) – default TTL for grant/revoke.  
* **open_timeout / read_timeout / idle_timeout** (Integer, default `10`) – non-subscribe timeouts (sec).  
* **s_open_timeout / s_read_timeout / s_idle_timeout** (Integer, default `310`) – subscribe timeouts (sec).  
* **logger**       (Logger, default to `pubnub.log`).  
* **origin**       (String, default `ps.pndsn.com`).  
* **http_sync**    (Boolean, default `false`) – `true` = synchronous.  
* **crypto_module** (`Crypto::CryptoModule`) – configure encryption (see below).  
* **cipher_key**, **random_iv**, **uuid** – deprecated; use `crypto_module` / `user_id`.

### Disabling random IV
Only for backward compatibility (<4.6.0). Never disable in new apps.

## Encryption (`crypto_module`)

Configure at construction time:

```
`# 256-bit AES-CBC (recommended)  
pubnub = Pubnub.new(  
    ...  
    crypto_module: Crypto::CryptoModule.new_aes_cbc("enigma", true)  
)  
  
# Legacy 128-bit encryption  
pubnub = Pubnub.new(  
    ...  
    crypto_module: Crypto::CryptoModule.new_legacy("enigma", true)  
)  
`
```

### Partial / manual encryption
```
`data_to_encrypt = { key: "value to encrypt" }  
json_string = data_to_encrypt.to_json  
  
crypto_module = Crypto::CryptoModule.new_aes_cbc("enigma", true)  
encrypted_data = crypto_module.encrypt(json_string)  
  
base64_encrypted_string = Base64.strict_encode64(encrypted_data)  
`
```

### Decryption
```
`base64_encoded_data = "CxQ0dxjBqIHdfuvtTcKeaLlyeRY7ZuaKy27wwwWo1EE="  
decoded_data = Base64.decode64(base64_encoded_data)  
decrypted_string = crypto_module.decrypt(decoded_data)  
`
```
Clients <5.2.2 cannot decrypt 256-bit AES-CBC data.

## Basic Initialization Examples

### Full example with encryption
```
`require 'pubnub'  
  
def main  
  pubnub = Pubnub.new(  
    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
    publish_key:   ENV.fetch('PUBLISH_KEY',  'demo'),  
    ssl: true,  
    user_id: 'myUniqueUserId',  
    crypto_module: Pubnub::Crypto::CryptoModule.new_aes_cbc("enigma", true)  
  )  
  
  puts "PubNub client initialized successfully with user_id: #{pubnub.user_id}"  
`
```
show all 22 lines

### Minimal
```
`pubnub = Pubnub.new(  
    publish_key: 'demo',  
    subscribe_key: 'demo',  
    user_id: 'myUniqueUserId'  
)  
`
```

### Read-only client
```
`# Initialize for Read Only Client  
pubnub = Pubnub.new(  
    subscribe_key : 'demo'  
)  
`
```

### SSL
```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key:   :demo,  
    ssl: true,  
    user_id: 'myUniqueUserId'  
)  
`
```

### Access Manager (server-side)
```
`pubnub = Pubnub.new(subscribe_key: 'my_subkey', secret_key: 'my_secretkey', user_id: 'myUniqueUserId')  
`
```

## Event Listeners (add/remove)

Add:
```
`callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_e) {},  
    presence: ->(_e) {},  
    signal:   ->(_e) {},  
    status:   ->(envelope)  do  
        if envelope.status[:error]  
            case envelope.status[:category]  
            when Pubnub::Constants::STATUS_ACCESS_DENIED  
                # Access denied  
            when Pubnub::Constants::STATUS_TIMEOUT  
                # Timeout  
            when Pubnub::Constants::STATUS_NON_JSON_RESPONSE  
                # Non-JSON response  
            when Pubnub::Constants::STATUS_API_KEY_ERROR  
                # API key error  
            end  
        end  
    end  
)  
pubnub.add_listener(callback)  
`
```

Remove:
```
`pubnub.remove_listener(name: 'my_listener')  
# or  
pubnub.remove_listener(callback)  
`
```

Listener example (multiple callbacks):
```
`# Init pubnub client  
pubnub_client = Pubnub.new(subscribe_key: 'demo', publish_key: 'demo')  
  
callbacks0 = Pubnub::SubscribeCallback.new(  
  message:  ->(e) { puts "C0 MESSAGE: #{e.result[:data][:message]}" },  
  presence: ->(e) { puts "C0 PRESENCE: #{e.result[:data][:message]}" },  
  status:   ->(e) { puts "C0 STATUS: #{e.result[:data][:message]}" }  
)  
  
callbacks1 = Pubnub::SubscribeCallback.new(  
  message:  ->(e) { puts "C1 MESSAGE: #{e.result[:data][:message]}" },  
  presence: ->(e) { puts "C1 PRESENCE: #{e.result[:data][:message]}" },  
  status:   ->(e) { puts "C1 STATUS: #{e.result[:data][:message]}" }  
)  
`
```
show all 48 lines

## Presence Channel-Group Subscribe
```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key: :demo  
)  
  
callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_e) {},  
    presence: ->(e) { puts "PRESENCE: #{e.result[:data]}" },  
    status:   ->(_e) {}  
)  
`
```
show all 18 lines

## Authentication Key
Getter:
```
`auth_key  
`
```
Usage:
```
`pubnub.auth_key  
`
```
Returns the current `auth_key`.

_Last updated: **May 7, 2025**_