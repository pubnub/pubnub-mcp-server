# Configuration API for Rust SDK

Complete API reference for configuring, initializing, and handling events in the PubNub Rust SDK.

Add any of the following features to Cargo.toml:

```
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

### Available in features
default, full, access, publish, subscribe, presence

## Initialization

Use the PubNubClientBuilder to create and initialize clients. The client is transport-agnostic; any transport implementing the Transport trait can be used.

### Method(s)

```
let client = PubNubClientBuilder::with_transport(transport)
    .with_keyset(Keyset {
        publish_key: Some(String::from("...")),
        subscribe_key: String::from("..."),
        secret_key: String::from("..."),
    })
    .with_user_id(String::from("user-123"))
    .with_instance_id("instance-1".into())
    .with_config(PubNubConfig { /* ... */ })
    .with_retry_configuration(RequestRetryConfiguration::None)
    .with_cryptor(my_crypto_provider)
    .with_heartbeat_value(300)
    .with_heartbeat_interval(149)
    .with_suppress_leave_events(false)
    .with_filter_expression(String::from("..."))
    .build()?;
```

To create a PubNub instance, the builder supports:

- with_transport()
  - Type: Transport
  - Default: with_reqwest_transport() (requires the reqwest feature, enabled by default)
  - Transport layer to use.

- with_keyset()
  - Type: Keyset
  - Default: n/a
  - Provide Admin Portal keys. See Keyset.

- with_user_id()
  - Type: String
  - Default: n/a
  - Required unique user/device identifier. UTF-8, up to 92 alphanumeric characters. Without it, you cannot connect.

- with_instance_id()
  - Type: Into<String>
  - Default: n/a
  - Client instance ID.

- with_config()
  - Type: PubNubConfig
  - Default: Data provided in the builder
  - Overwrites Keyset and user_id. Useful when working with multiple builders.

- with_retry_configuration()
  - Type: RequestRetryConfiguration
  - Default: RequestRetryConfiguration::None
  - Custom reconnection policy. You can exclude endpoint groups from retry.
  - Values:
    - RequestRetryConfiguration::None
    - RequestRetryConfiguration::Linear { delay, max_retry, excluded_endpoints }
    - RequestRetryConfiguration::Exponential { min_delay, max_delay, max_retry, excluded_endpoints }
  - excluded_endpoints: Some(vec![Endpoint::Publish]) etc. See SDK connection lifecycle.

- with_cryptor()
  - Type: T: CryptoProvider
  - Default: n/a
  - Encryption/decryption module. See Encryption API.

- with_heartbeat_value()
  - Type: u64
  - Default: 300
  - Presence timeout (how long the server considers the client alive). Min 20 seconds. Triggers timeout on presence channel if no heartbeat within this period.

- with_heartbeat_interval()
  - Type: u64
  - Default: n/a
  - How often to send heartbeats. Typically (heartbeat_value / 2) - 1. Min 0 (no announcements).

- with_suppress_leave_events()
  - Type: bool
  - Default: false
  - Suppress presence leave events during unsubscribe.

- with_filter_expression()
  - Type: String
  - Default: n/a
  - Subscribe with a custom filter. See Message Filters.

- build()
  - Default: n/a
  - Creates and returns the PubNub instance.

#### CryptoModule

Implements CryptoProvider for encrypting/decrypting messages. From 0.3.0, algorithms are configurable. Options:
- Legacy 128-bit encryption (no change required to continue using it).
- Recommended 256-bit AES-CBC (must be explicitly set in config).
See Encryption for configuration details and examples.

#### Keyset

Provide account credentials via the Keyset struct:
- publish_key: Some(String) — publishKey from Admin Portal.
- subscribe_key: String — subscribeKey from Admin Portal.
- secret_key: String — secretKey from Admin Portal. Required for Access Manager operations.

### Sample code

##### Required User ID

Always set user_id to uniquely identify the user or device. Persist it for the lifetime of the user/device. Without it, you cannot connect.

```
1
  
```

### Returns

A result with a PubNub instance or an error if configuration is invalid.

### Other examples

#### Initialize with custom origin

You can initialize the PubNub API client with a custom domain.

```
1
  
```

## Event listeners

- The PubNub client can receive updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription receives updates only for the entity it targets.
- SubscriptionsSet receives updates for all entities represented by its subscriptions.
See Publish & Subscribe for details.

Last updated on Sep 3, 2025