# Configuration API for Rust SDK

Build PubNub clients with `PubNubClientBuilder`. The client is transport-agnostic; any transport implementing `Transport` can be used.

### Features
`default`&nbsp;`fullaccess`&nbsp;`publish`&nbsp;`subscribe`&nbsp;`presence`

## Initialization

### Builder chain

```
`let client = PubNubClientBuilder::with_transport(Transport)  
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
`
```
(show all 16 lines)

### Builder methods (essentials)

* `with_transport(Transport)`  
  Default: `with_reqwest_transport()` (requires `reqwest` feature).

* `with_keyset(Keyset)`  
  Admin-portal keys.

* `with_user_id(String)`  
  UTF-8, ≤ 92 chars. Mandatory for connection.

* `with_instance_id(Into<String>)`  
  Client instance ID.

* `with_config(PubNubConfig)`  
  Override `Keyset` and `user_id`.

* `with_retry_configuration(RequestRetryConfiguration)`  
  • `None` (default)  
  • `Linear { delay, max_retry, excluded_endpoints }`  
  • `Exponential { min_delay, max_delay, max_retry, excluded_endpoints }`

* `with_cryptor(T: CryptoProvider)`  
  Select encryption module.

* `with_heartbeat_value(u64)`  
  Presence timeout (default 300 s, min 20).

* `with_heartbeat_interval(u64)`  
  Heartbeat period (typ. `(heartbeat_value / 2) - 1`, min 0).

* `with_suppress_leave_events(bool)`  
  Suppress leave events (default false).

* `with_filter_expression(String)`  
  Subscribe filter.

* `build()` → `Result<PubNub, Error>`

## Keyset

* `publish_key: Some(String)` – Publish key.  
* `subscribe_key: String` – Subscribe key.  
* `secret_key: String` – Secret key (needed for Access Manager).

## CryptoModule

Two built-in encryption options:

1. 256-bit AES-CBC (recommended)  
2. Legacy 128-bit entropy (back-compat)

```
`// 256-bit AES-CBC (recommended)  
let client = PubNubClientBuilder::with_transport(Transport)  
    ...  
    .with_cryptor(CryptoModule::new_aes_cbc_module("enigma", true)?)  
    .build()?;  
  
// Legacy 128-bit  
let client = PubNubClientBuilder::with_transport(Transport)  
    ...  
    .with_cryptor(CryptoModule::new_legacy_module("enigma", true)?)  
    .build()?;  
`
```
Older (<0.3.0) SDKs cannot decrypt 256-bit data.

## Sample code

Required `user_id`:

```
`  
`
```

## Other examples

Initialize with custom origin:

```
`  
`
```

## Event listeners

Use `Client`, `Subscription`, or `SubscriptionsSet` for real-time updates. See Publish & Subscribe docs for handlers.

_Last updated: Jul 15 2025_