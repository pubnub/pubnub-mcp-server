# PubNub Rust SDK – Configuration

Supported Cargo features: `default` `fullaccess` `publish` `subscribe` `presence`

---

## Initialization

Create a client with `PubNubClientBuilder`. All builder methods are chainable and transport-layer agnostic (any type that implements `Transport`).

### Builder usage

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

### Builder methods

• `with_transport(Transport)` – transport implementation (`with_reqwest_transport()` available; requires `reqwest` feature).  
• `with_keyset(Keyset)` – account keys (see *Keyset*).  
• `with_user_id(String)` – UTF-8 ID (≤92 chars); required.  
• `with_instance_id(Into<String>)` – client instance identifier.  
• `with_config(PubNubConfig)` – override `Keyset`/`user_id`; useful for multiple builders.  
• `with_retry_configuration(RequestRetryConfiguration)` – reconnect policy:  
  • `None` (default)  
  • `Linear { delay, max_retry, excluded_endpoints }`  
  • `Exponential { min_delay, max_delay, max_retry, excluded_endpoints }`  
  `excluded_endpoints: Vec<Endpoint>` (e.g., `vec![Endpoint::Publish]`).  
• `with_cryptor(T: CryptoProvider)` – encryption module (see *CryptoModule*).  
• `with_heartbeat_value(u64)` – presence timeout (default `300`, min `20`).  
• `with_heartbeat_interval(u64)` – heartbeat send interval; recommended `(heartbeat_value / 2) - 1`. `0` disables heartbeats.  
• `with_suppress_leave_events(bool)` – default `false`; suppress leave events on unsubscribe.  
• `with_filter_expression(String)` – subscribe filter expression.  
• `build()` – returns `PubNub` instance (`Result`).

---

### Keyset

| Field        | Type          | Description                               |
|--------------|---------------|-------------------------------------------|
| `publish_key`| `Some(String)`| Publish key (Admin Portal).               |
| `subscribe_key`| `String`    | Subscribe key (Admin Portal).             |
| `secret_key` | `String`      | Secret key; required for Access Manager.  |

---

## CryptoModule

Implements `CryptoProvider`.

Two built-in algorithms:  
• 128-bit legacy (default pre-0.3.0)  
• 256-bit AES-CBC (recommended; supported ≥0.3.0).  
Both decrypt data from either algorithm.

```rust
// 256-bit AES-CBC (recommended)
let client = PubNubClientBuilder::with_transport(Transport)
    ...
    .with_cryptor(CryptoModule::new_aes_cbc_module("enigma", true)?)
    .build()?;

// 128-bit legacy cipher
let client = PubNubClientBuilder::with_transport(Transport)
    ...
    .with_cryptor(CryptoModule::new_legacy_module("enigma", true)?)
    .build()?;
```

Older SDKs (<0.3.0) can’t decrypt 256-bit AES-CBC data.

---

### Return value

`Result<PubNub, PubNubError>` – error on invalid configuration.

_Last updated: Apr 22 2025_