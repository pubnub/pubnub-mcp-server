# Configuration API for Ruby SDK

Complete reference for configuring and initializing the PubNub Ruby SDK, including event handling and essential examples.

## Initialization

### Installing

```
`1gem install pubnub  
`
```

Or add to Gemfile:

```
`1gem 'pubnub', '~> 6.0.0'  
`
```

### Usage

```
`1require 'pubnub'  
`
```

### Description

Initialize the PubNub client before using any APIs to set credentials (`publish_key`, `subscribe_key`, etc.).

### Method(s)

```
`1Pubnub(  
2    subscribe_key,  
3    publish_key,  
4    secret_key,  
5    auth_key,  
6    ssl,  
7    user_id,  
8    heartbeat,  
9    callback,  
10    ttl,  
11    open_timeout,  
12    read_timeout,  
13    idle_timeout,  
14    s_open_timeout,  
15    s_read_timeout,  
16    s_idle_timeout,  
17    logger,  
18    origin,  
19    http_sync,  
20    crypto_module  
21)  
`
```

Parameters:
- subscribe_key (String, Symbol) – required. Your subscribe key.
- publish_key (String, Symbol) – required for publishing. Your publish key.
- secret_key (String, Symbol) – required for Access Manager on server-side.
- auth_key (String, Symbol) – authentication key.
- ssl (Boolean, default: false) – enable TLS.
- user_id (String) – required. UTF-8 up to 92 alphanumeric chars. Must be unique and persisted per user/device.
- heartbeat (Integer) – heartbeat interval and presence timeout. Disabled by default.
- callback (Lambda) – default callback for client method calls (overridden per call).
- ttl (Integer) – default TTL for grant/revoke.
- open_timeout (Integer, default: 10) – non-subscribe open timeout (s).
- read_timeout (Integer, default: 10) – non-subscribe read timeout (s).
- idle_timeout (Integer, default: 10) – non-subscribe idle timeout (s).
- s_open_timeout (Integer, default: 310) – subscribe open timeout (s).
- s_read_timeout (Integer, default: 310) – subscribe read timeout (s).
- s_idle_timeout (Integer, default: 310) – subscribe idle timeout (s).
- logger (Object, default: Logger instance to 'pubnub.log') – custom logger. See Logging docs.
- origin (String, default: ps.pndsn.com) – custom origin. Setter: #origin=(origin).
- http_sync (Boolean, default: false) – async by default (returns future). When true, returns envelope(s) synchronously.
- crypto_module (Crypto::CryptoModule) – encryption/decryption module taking cipher_key and random_iv.
- cipher_key (String) – deprecated; pass via crypto_module instead.
- random_iv (Boolean, default: true) – deprecated; pass via crypto_module. True: per-request random IV (recommended).
- uuid (String) – deprecated; use user_id instead.

Disabling random initialization vector
- Only for backward compatibility (< 4.6.0). Do not disable for new applications.

#### crypto_module

Configures encryption (from 5.2.2). Supports:
- Legacy 128-bit encryption (no change required to keep using it).
- Recommended 256-bit AES-CBC (must be explicitly configured).

See Encryption API for configuration details and examples.

### Sample code

#### Initialize the PubNub client API with encryption

Required User ID
- Always set a stable, unique user_id; otherwise the client cannot connect.

```
1require 'pubnub'  
2
  
3
  
4def main  
5  # Configuration for PubNub instance  
6  pubnub = Pubnub.new(  
7    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
8    publish_key: ENV.fetch('PUBLISH_KEY', 'demo'),  
9    ssl: true,  
10    user_id: 'myUniqueUserId',  
11    crypto_module: Pubnub::Crypto::CryptoModule.new_aes_cbc("enigma", true)  
12  )  
13
  
14  # Example to demonstrate successful configuration  
15  puts "PubNub client initialized successfully with user_id: #{pubnub.user_id}"  
16end  
17
  
18
  
19if __FILE__ == $0  
20  main  
21  puts 'finished'  
22end  
```

### Returns

PubNub instance for invoking APIs like publish(), subscribe(), history(), here_now(), etc.

### Other examples

#### Initialize the client

```
`1pubnub = Pubnub.new(  
2    publish_key: 'demo',  
3    subscribe_key: 'demo',  
4    user_id: 'myUniqueUserId'  
5)  
`
```

#### Initialization for a read-only client

```
`1# Initialize for read-only client  
2# Note: The following line uses a hash argument. Ensure the key and value  
3# are separated by a colon and a space (Ruby keyword argument style):  
4# subscribe_key: 'demo'  
5pubnub = Pubnub.new(  
6    subscribe_key : 'demo'  
7)  
`
```

#### Use a custom user ID

```
`1# initialize  
2pubnub = Pubnub.new(  
3    publish_key: 'myPublishKey',  
4    subscribe_key: 'mySubscribeKey',  
5    user_id: 'myUniqueUserId'  
6)  
`
```

#### Initializing with SSL enabled

```
`1pubnub = Pubnub.new(  
2    subscribe_key: :demo,  
3    publish_key:   :demo,  
4    ssl: true,  
5    user_id: 'myUniqueUserId'  
6)  
`
```

#### Initializing with Access Manager

Requires Access Manager add-on enabled in Admin Portal.

Secure your secret_key
- Keep secret_key server-side only; it grants root Access Manager permissions.

```
`1pubnub = Pubnub.new(subscribe_key: 'my_subkey', secret_key: 'my_secretkey', user_id: 'myUniqueUserId')  
`
```

## Event listeners

Add listeners before calling subscribe or other methods.

#### Add listeners

```
1callback = Pubnub::SubscribeCallback.new(  
2    message:  ->(_envelope) {}, # this will be fired only for non-presence messages  
3    presence: ->(_envelope) {}, # this will be fired only for presence messages  
4    signal: ->(_envelope) {}, # Handle signal message  
5    status: ->(envelope)  do  # this will be fired for status messages and errors  
6    if envelope.status[:error]  
7        case envelope.status[:category]  
8            when Pubnub::Constants::STATUS_ACCESS_DENIED # :access_denied  
9                # Access denied. Double check Access Manager etc.  
10            when Pubnub::Constants::STATUS_TIMEOUT # :timeout  
11                # Timeout error  
12            when Pubnub::Constants::STATUS_NON_JSON_RESPONSE # :non_json_response  
13                # Non json response  
14            when Pubnub::Constants::STATUS_API_KEY_ERROR # :api_key_error  
15                # API key error  
16            when Pubnub::Constants::STATUS_ERROR  
17                # Other error  
18            else  
19                # Shouldn't happen  
20            end  
21        end  
22    end  
23)  
24
  
25pubnub.add_listener(name: 'my_listener', callback: callback)  
```

#### Remove listeners

```
`1pubnub.remove_listener(name: 'my_listener')  
2# or  
3pubnub.remove_listener(callbacks)  
`
```

#### Listeners example

```
1# Init pubnub client  
2pubnub_client = Pubnub.new(subscribe_key: 'demo', publish_key: 'demo')  
3
  
4# First callbacks object  
5callbacks0 = Pubnub::SubscribeCallback.new(  
6  message:  ->(envelope) { puts "C0 MESSAGE: #{envelope.result[:data][:message]}" },  
7  presence: ->(envelope) { puts "C0 PRESENCE: #{envelope.result[:data][:message]}" },  
8  status:   ->(envelope) { puts "C0 STATUS: #{envelope.result[:data][:message]}" }  
9)  
10
  
11# Second callbacks object  
12callbacks1 = Pubnub::SubscribeCallback.new(  
13  message:  ->(envelope) { puts "C1 MESSAGE: #{envelope.result[:data][:message]}" },  
14  presence: ->(envelope) { puts "C1 PRESENCE: #{envelope.result[:data][:message]}" },  
15  status:   ->(envelope) { puts "C1 STATUS: #{envelope.result[:data][:message]}" }  
16)  
17
  
18# Add listener allows you to specify name, it's not required to specify a name  
19pubnub_client.add_listener(name: 'c0', callback: callbacks0)  
20
  
21# Let's subscribe somewhere  
22pubnub_client.subscribe(channel: :demo, presence: :demo)  
23
  
24# SOME OUTPUT:  
25# C0 PRESENCE: {"action"=>"join", "timestamp"=>1461683357, "user_id"=>"fc0c0460-44b4-4338-b7e9-1b534b85072e", "occupancy"=>2}  
26# C0 MESSAGE: {"text"=>"hey"}  
27# C0 PRESENCE: {"action"=>"join", "timestamp"=>1461683374, "user_id"=>"3efb92f6-bf02-4373-aafa-996527718ecc", "occupancy"=>3}  
28# C0 MESSAGE: {"text"=>"hey"}  
29
  
30# Add another subscriber  
31pubnub_client.add_listener(name: 'c1', callback: callbacks1)  
32
  
33# SOME OUTPUT WITH TWO LISTENERS ACTIVE:  
34# C0 MESSAGE: {"text"=>"hey"}  
35# C1 MESSAGE: {"text"=>"hey"}  
36# C0 PRESENCE: {"action"=>"leave", "timestamp"=>1461683435, "user_id"=>"3efb92f6-bf02-4373-aafa-996527718ecc", "occupancy"=>2}  
37# C1 PRESENCE: {"action"=>"leave", "timestamp"=>1461683435, "user_id"=>"3efb92f6-bf02-4373-aafa-996527718ecc", "occupancy"=>2}  
38
  
39# We're removing subscriber by giving it's name  
40pubnub_client.remove_listener(name: 'c1')  
41
  
42# SOME OUTPUT AFTER REMOVING C1 LISTENER  
43# C0 MESSAGE: {"text"=>"hey"}  
44# C0 MESSAGE: {"text"=>"hey"}  
45# C0 PRESENCE: {"action"=>"join", "timestamp"=>1461683698, "user_id"=>"3efb92f6-bf02-4373-aafa-996527718ecc", "occupancy"=>2}  
46
  
47# We're removing subsciber by giving it's object, now we don't have any listeners active  
48pubnub_client.remove_listener(callback: callbacks0)  
```

## Presence to a channel group

Subscribe to the presence channel of a channel group.

### Method(s)

- See subscribe() method.

### Sample code

```
1pubnub = Pubnub.new(  
2    subscribe_key: :demo,  
3    publish_key: :demo  
4)  
5
  
6callback = Pubnub::SubscribeCallback.new(  
7    message:  ->(_envelope) {  
8    },  
9    presence: ->(envelope) {  
10        puts "PRESENCE: #{envelope.result[:data]}"  
11    },  
12    status:   ->(_envelope) {  
13    }  
14)  
15
  
16pubnub.add_listener(callback: callback)  
17
  
18pubnub.presence(channel_groups: 'family')  
```

## Authentication key

Get the current auth_key.

### Method(s)

```
`1auth_key  
`
```

This method doesn't take any arguments.

### Sample code

```
`1pubnub.auth_key  
`
```

### Returns

The current authentication key.

Last updated on Sep 3, 2025