# Configuration API for Rust SDK

Concise reference for configuring and initializing PubNub clients with the Rust SDK.

Add any of the following features to Cargo.toml:

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

For a full list, see Available features.

Available in features: default, full, access, publish, subscribe, presence

## Initialization

Use `PubNubClientBuilder` to create API clients. The client is transport-agnostic (any type implementing `Transport`).

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

- with_transport(transport)
  - Type: Transport
  - Default: with_reqwest_transport() (requires the reqwest feature; enabled by default)
  - Transport layer to use.
- with_keyset(keyset)
  - Type: Keyset
  - Default: n/a
  - Provide Admin Portal credentials. See Keyset.
- with_user_id(user_id)
  - Type: String
  - Default: n/a
  - Required. UTF-8 string up to 92 alphanumeric chars. Without it, you cannot connect.
- with_instance_id(instance_id)
  - Type: Into<String>
  - Default: n/a
  - Client instance ID.
- with_config(config)
  - Type: PubNubConfig
  - Default: data provided in the builder
  - Overwrite Keyset and user_id; useful for multiple builders.
- with_retry_configuration(policy)
  - Type: RequestRetryConfiguration
  - Default: RequestRetryConfiguration::None
  - Custom reconnection policy. You can exclude endpoint groups from retry policy.
  - Values:
    - RequestRetryConfiguration::None
    - RequestRetryConfiguration::Linear { delay, max_retry, excluded_endpoints }
    - RequestRetryConfiguration::Exponential { min_delay, max_delay, max_retry, excluded_endpoints }
  - excluded_endpoints: Some(vec![Endpoint::Publish]), etc.
- with_cryptor(cryptor)
  - Type: T: CryptoProvider
  - Default: n/a
  - Configure message encryption/decryption. See Encryption API.
- with_heartbeat_value(seconds)
  - Type: u64
  - Default: 300
  - Presence timeout window. Min: 20. If no heartbeat within timeout, client is marked inactive (timeout event on presence channel).
- with_heartbeat_interval(seconds)
  - Type: u64
  - Default: n/a
  - Heartbeat frequency. Recommended: (heartbeat_value / 2) - 1. Min: 0 (no announce).
- with_suppress_leave_events(flag)
  - Type: bool
  - Default: false
  - Suppress presence leave events during unsubscribe.
- with_filter_expression(expr)
  - Type: String
  - Default: n/a
  - Subscribe with a custom filter. See Message Filters.
- build()
  - Creates and returns the PubNub instance.

#### CryptoModule

Implements `CryptoProvider` to encrypt/decrypt messages. From 0.3.0, algorithms are configurable.

- Options included: legacy 128-bit encryption and recommended 256-bit AES-CBC.
- To use 256-bit AES-CBC, explicitly configure it in PubNub config.
- See Encryption for configuration and examples.

#### Keyset

Provide credentials via the `Keyset` struct:

- publishKey: Some(String) — Admin Portal publishKey.
- subscribeKey: String — Admin Portal subscribeKey.
- secretKey: String — Admin Portal secretKey. Required for Access Manager operations.

### Sample code

##### Required User ID

Persist a unique `user_id` for the user/device. Without it, you cannot connect.

```
1
  

```

### Returns

Result with the PubNub instance, or an error if configuration is invalid.

### Other examples

#### Initialize with custom origin

```
1
  

```

## Event listeners

Sources for real-time updates:
- The PubNub client receives updates from all subscriptions.
- Subscription receives updates for its specific channel/group/metadata/user.
- SubscriptionsSet receives updates for all included subscriptions.

Subscribe and add handlers per entity. See Publish & Subscribe for details.

Last updated on Sep 3, 2025