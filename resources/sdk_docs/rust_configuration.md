# Configuration API for Rust SDK

Concise reference for configuring and initializing PubNub with the Rust SDK. Includes features, builder methods, parameters, defaults, and essential examples.

Add any of the following features to `Cargo.toml`:

```
`[dependencies]  
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
`
```

For a list of all features, refer to Available features.

### Available in features
default, full, access, publish, subscribe, presence

## Initialization

Use `PubNubClientBuilder` to create and initialize PubNub API clients. The client is transport-agnostic (any transport implementing the `Transport` trait).

### Method(s)

```
`1let client = PubNubClientBuilder::with_transport(Transport)  
2    .with_keyset(Keyset {  
3        publish_key: Some(String),  
4        subscribe_key: String,  
5        secret_key: String,  
6    })  
7    .with_user_id(String)  
8    .with_instance_id(IntoString>)  
9    .with_config(PubNubConfig)  
10    .with_retry_configuration(RequestRetryConfiguration)  
11    .with_cryptor(T: CryptoProvider)  
12    .with_heartbeat_value(u64)  
13    .with_heartbeat_interval(u64)  
14    .with_suppress_leave_events(bool)  
15    .with_filter_expression(String)  
16    .build()?;  
`
```

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
  - Required. UTF-8 string up to 92 alphanumeric characters. If not set, the client cannot connect.

- with_instance_id()
  - Type: Into<String>
  - Default: n/a
  - Client instance ID.

- with_config()
  - Type: PubNubConfig
  - Default: data provided in the builder
  - Allows overwriting Keyset and user_id (useful for multiple builders).

- with_retry_configuration()
  - Type: RequestRetryConfiguration
  - Default: RequestRetryConfiguration::None
  - Custom reconnection parameters. You can exclude endpoint groups from retry policy.
  - Values:
    - RequestRetryConfiguration::None
    - RequestRetryConfiguration::Linear { delay, max_retry, excluded_endpoints }
    - RequestRetryConfiguration::Exponential { min_delay, max_delay, max_retry, excluded_endpoints }
  - excluded_endpoints: Some(Vec<Endpoint>), e.g., Some(vec![Endpoint::Publish]).

- with_cryptor()
  - Type: T: CryptoProvider
  - Default: n/a
  - Crypto module for message encryption/decryption. See Encryption API.

- with_heartbeat_value()
  - Type: u64
  - Default: 300
  - Presence timeout (seconds). Min 20. If no heartbeat within this period, client marked inactive and a timeout event is emitted on presence channels.

- with_heartbeat_interval()
  - Type: u64
  - Default: n/a
  - How often to send heartbeats. Recommended interval: (with_heartbeat_value() / 2) - 1. Min 0 (no announce).

- with_suppress_leave_events()
  - Type: bool
  - Default: false
  - Suppress presence leave events during unsubscribe.

- with_filter_expression()
  - Type: String
  - Default: n/a
  - Subscribe with a custom filter expression.

- build()
  - Creates and returns the PubNub instance.

#### CryptoModule

Implements CryptoProvider for message encryption/decryption. From 0.3.0, algorithms are configurable:
- Legacy 128-bit encryption (no change required to keep using).
- Recommended 256-bit AES-CBC (must be explicitly set in config).
See Encryption for configuration and partial encryption methods.

#### Keyset

Provide account credentials:

- publishKey
  - Type: Some(String)
  - Admin Portal publishKey.

- subscribeKey
  - Type: String
  - Admin Portal subscribeKey.

- secretKey
  - Type: String
  - Admin Portal secretKey. Required for Access Manager operations.

### Sample code

##### Required User ID

Always set and persist a unique user_id. If not set, connection will fail.

```
1
  

```

### Returns

Result with the PubNub instance or an error if configuration is invalid.

### Other examples

#### Initialize with custom origin

Use a custom domain for the PubNub client.

```
1
  

```

## Event listeners

Sources for real-time updates:
- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for its specific target (channel, channel group, channel metadata, or user).
- SubscriptionsSet: updates for all objects represented by its subscriptions.

See Publish & Subscribe for subscribing and adding handlers per entity.