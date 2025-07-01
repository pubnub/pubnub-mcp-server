On this page
# Configuration API for Rust SDK

Rust complete API reference for building real-time applications on PubNub, including basic usage and sample code.

### Available in features
defaultfullaccesspublishsubscribepresence

## Initialization[​](#initialization)

You can use the `PubNubClientBuilder` struct to create and initialize PubNub API clients. The client is transport-layer-agnostic, so you can use any transport layer that implements the `Transport` trait.

### Method(s)[​](#methods)

```
`let client = PubNubClientBuilder::with_transport(Transport)  
    .with_keyset(Keyset {  
        publish_key: Some(String),  
        subscribe_key: String,  
        secret_key: String,  
    })  
    .with_user_id(String)  
    .with_instance_id(IntoString>)  
    .with_config(PubNubConfig)  
    .with_retry_configuration(RequestRetryConfiguration)  
    .with_cryptor(T: CryptoProvider)  
    .with_heartbeat_value(u64)  
    .with_heartbeat_interval(u64)  
    .with_suppress_leave_events(bool)  
    .with_filter_expression(String)  
`
```
show all 16 lines

To create a PubNub instance, you can use the following methods in the Rust SDK:

*  requiredMethodDescription`with_transport()` *Type: `Transport`Default:  
`with_reqwest_transport()`Transport layer to use. `with_reqwest_transport()` requires the `reqwest` feature, which is enabled by default.`with_keyset()` *Type: `Keyset`Default:  
n/aA method that takes the `Keyset` struct with [Admin Portal](https://admin.pubnub.com/) keys as the value. Refer to [Keyset](#keyset) for more information.`with_user_id()` *Type: StringDefault:  
n/aUser ID to use. You should set a unique identifier for the user or the device that connects to PubNub.   

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the User ID, you won't be able to connect to PubNub.`with_instance_id()`Type: `Into<String>`Default:  
n/aClient instance ID.`with_config()`Type: `PubNubConfig`Default:  
Data provided in the builder.Struct that allows to overwrite `Keyset` and `user_id` configuration. Useful for working with multiple client builders.`with_retry_configuration()`Type: `RequestRetryConfiguration`Default:  
`RequestRetryConfiguration::None`Custom reconnection configuration parameters. You can specify one or more [endpoint groups](https://github.com/pubnub/rust/blob/master/src/core/retry_policy.rs) for which the retry policy won't be applied.   
  
  `RequestRetryConfiguration` is the type of policy to be used.   
   
 Available values:   
 
- `RequestRetryConfiguration::None`
- `RequestRetryConfiguration::Linear {delay, max_retry, excluded_endpoints}`
- `RequestRetryConfiguration::Exponential {min_delay , max_delay, max_retry, excluded_endpoints}`

   
 `excluded_endpoints` takes a vector of [enums](https://github.com/pubnub/rust/blob/master/src/core/retry_policy.rs), for example, `excluded_endpoints: Some(vec![Endpoint::Publish])`. For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).`with_cryptor()`Type: `T: CryptoProvider`Default:  
n/aThe cryptography module used for encryption and decryption of messages. For more information, refer to the [CryptoModule](#cryptomodule) section.`with_heartbeat_value()`Type: `u64`Default:  
`300`Defines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server every `300` seconds by default. These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview). The minimum value is `20` seconds.`with_heartbeat_interval()`Type: `u64`Default:  
n/aSpecifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `with_heartbeat_value()`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(with_heartbeat_value() / 2) - 1`. The minimum value is `0` seconds, which means the client doesn't announce itself at all.`with_suppress_leave_events()`Type: `bool`Default:  
`false`Whether to stop sending presence leave events during the unsubscribe process.`with_filter_expression()`Type: StringDefault:  
n/aString used to subscribe with a custom filter. For more information, refer to [Message Filters](/docs/general/channels/subscribe#message-filters).`build()` *Type: Default:  
n/aCreates the PubNub instance based on the provided data and returns it.

#### Keyset[​](#keyset)

The `Keyset` struct is how you provide your account credentials to the Rust SDK.

*  requiredPropertyDescription`publishKey` *Type: `Some(String)``publishKey` from the [Admin Portal](https://admin.pubnub.com/).`subscribeKey` *Type: `String``subscribeKey` from the Admin Portal.`secretKey`Type: `String``secretKey` from the Admin Portal. Required for [Access Manager](/docs/sdks/rust/api-reference/access-manager) operations.

#### `CryptoModule`[​](#cryptomodule)

`CryptoModule` implements the `CryptoProvider` trait and provides encrypt/decrypt functionality for messages. From the 0.3.0 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to [Message Encryption](/docs/general/setup/data-security#message-encryption).

The default constructors for the bundled crypto modules take the `cipher_key` (string used to encrypt/decrypt) and `use_random_iv` (boolean, whether or not to use a random initialization vector) parameters as arguments.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `CryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `CryptoModule` to encrypt all messages/files, you can use the following methods in the Rust SDK:

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
let client = PubNubClientBuilder::with_transport(Transport)  
    ...  
    .with_cryptor(CryptoModule::new_aes_cbc_module("enigma", true)?)  
    .build()?;  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
let client = PubNubClientBuilder::with_transport(Transport)  
    ...  
    .with_cryptor(CryptoModule::new_legacy_module("enigma", true)?)  
    .build()?;  
  
  
`
```
show all 22 lines

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 0.3.0 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`  
`
```

### Returns[​](#returns)

A result with PubNub instance or error if the configuration is wrong.

### Other Examples[​](#other-examples)

#### Initialize with custom origin[​](#initialize-with-custom-origin)

You can initialize the PubNub API client and use a custom domain.

```
`  
`
```

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/rust/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/rust/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/rust/api-reference/publish-and-subscribe#event-listeners).
Last updated on **Apr 22, 2025**