# Configuration API for Rust SDK

Complete API reference for configuring, initializing, and handling events with the PubNub Rust SDK.

Add any of the following features to Cargo.toml to use this API:
```toml
[dependencies]
# default
pubnub = "0.7.0"

# full
pubnub = { version = "0.7.0", features = ["full"] }

# Access Manager
pubnub = { version = "0.7.0", features = ["access"] }

# no default features, just Publish
pubnub = { version = "0.7.0", default-features = false, features = ["publish"] }

# Subscribe
pubnub = { version = "0.7.0", features = ["subscribe"] }

# Presence
pubnub = { version = "0.7.0", features = ["presence"] }
```
For a list of all features, refer to Available features.

Available in features: default, full, access, publish, subscribe, presence

## Initialization

Use PubNubClientBuilder to create and initialize clients. The client is transport-agnostic; any transport implementing the Transport trait can be used.

### Method(s)
```rust
let client = PubNubClientBuilder::with_transport(Transport)
    .with_keyset(Keyset {
        publish_key: Some(String),
        subscribe_key: String,
        secret_key: String,
    })
    .with_user_id(String)
    .with_instance_id(Into<String>)
    .with_config(PubNubConfig)
    .with_retry_configuration(RequestRetryConfiguration)
    .with_cryptor(T: CryptoProvider)
    .with_heartbeat_value(u64)
    .with_heartbeat_interval(u64)
    .with_suppress_leave_events(bool)
    .with_filter_expression(String)
    .build()?;
```

- with_transport()
  - Type: Transport
  - Default: with_reqwest_transport() (requires the reqwest feature; enabled by default)
  - Transport layer to use.
- with_keyset()
  - Type: Keyset
  - Default: n/a
  - Provide Admin Portal keys. See Keyset below.
- with_user_id()
  - Type: String
  - Default: n/a
  - Required. UTF-8 string up to 92 alphanumeric characters. Without it, the client can’t connect.
- with_instance_id()
  - Type: Into<String>
  - Default: n/a
  - Client instance ID.
- with_config()
  - Type: PubNubConfig
  - Default: Data provided in the builder
  - Overwrites Keyset and user_id; useful for multiple client builders.
- with_retry_configuration()
  - Type: RequestRetryConfiguration
  - Default: RequestRetryConfiguration::None
  - Configure reconnection policy; you may exclude endpoint groups from retry.
  - Variants:
    - RequestRetryConfiguration::None
    - RequestRetryConfiguration::Linear { delay, max_retry, excluded_endpoints }
    - RequestRetryConfiguration::Exponential { min_delay, max_delay, max_retry, excluded_endpoints }
  - excluded_endpoints: Some(vec![Endpoint::Publish]) (enums defined in core/retry_policy.rs).
- with_cryptor()
  - Type: T: CryptoProvider
  - Default: n/a
  - Configure encryption/decryption. See Encryption API.
- with_heartbeat_value()
  - Type: u64
  - Default: 300
  - Presence timeout (seconds). Min 20. If missed, triggers timeout on presence channel.
- with_heartbeat_interval()
  - Type: u64
  - Default: n/a
  - Heartbeat frequency (seconds). Recommended: (heartbeat_value / 2) - 1. Min 0 disables announcements.
- with_suppress_leave_events()
  - Type: bool
  - Default: false
  - Suppress presence leave events on unsubscribe.
- with_filter_expression()
  - Type: String
  - Default: n/a
  - Subscribe with a custom filter expression. See Message Filters.
- build()
  - Creates and returns the PubNub instance or an error.

#### CryptoModule
Implements CryptoProvider to encrypt/decrypt messages. From 0.3.0, algorithm selection is configurable. Options include legacy 128-bit and recommended 256-bit AES-CBC. See Encryption.

#### Keyset
Provide account credentials to the SDK:
- publishKey: Some(String) — publishKey from Admin Portal.
- subscribeKey: String — subscribeKey from Admin Portal.
- secretKey: String — secretKey from Admin Portal; required for Access Manager.

### Sample code

##### Required User ID
Always set a stable user_id for the life of the user/device. Without it, connection fails.
```
1
  
```

### Returns
A result with PubNub instance or error if the configuration is wrong.

### Other examples

#### Initialize with custom origin
You can initialize the client with a custom domain.
```
1
  
```

## Event listeners
- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for a single entity (channel, channel group, channel metadata, user).
- SubscriptionsSet: updates for all entities represented by its subscription list.

See Publish & Subscribe for adding handlers per entity.

Last updated on Sep 3, 2025