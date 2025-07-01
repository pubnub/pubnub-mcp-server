On this page
# Configuration API for Ruby SDK

Ruby complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Initialization[​](#initialization)

### Installing[​](#installing)

To use `pubnub` ruby gem, you need to install it. You can do it via `rubygems` command:

```
`gem install pubnub  
`
```

Or add it to your Gemfile.

```
`gem 'pubnub', '~> 5.5.0'  
`
```

### Usage[​](#usage)

To use `pubnub`, you need to require it in your files.

```
`require 'pubnub'  
`
```

That's it, you can use PubNub ruby client right away.

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `publish_key` and `subscribe_key`.

### Method(s)[​](#methods)

To `Initialize` PubNub you can use the following method(s) in the Ruby SDK:

```
`Pubnub(  
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
`
```
show all 21 lines
*  requiredParameterDescription`subscribe_key` *Type: String, SymbolDefault:  
n/aYour `subscribe key`.`publish_key`Type: String, SymbolDefault:  
n/aYour `publish key`, required to publish messages.`secret_key`Type: String, SymbolDefault:  
n/aYour `secret key`, required for Access Manager.`auth_key`Type: String, SymbolDefault:  
n/aYour `auth key`.`ssl`Type: BooleanDefault:  
`false`If set to `true`, `ssl` connection will be used.`user_id` *Type: StringDefault:  
n/a[User ID](/docs/general/basics/identify-users-and-devices) to use. You should set a unique user ID to identify the user or the device that connects to PubNub.   

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the user ID, you won't be able to connect to PubNub.`heartbeat`Type: IntegerDefault:  
n/aThat single value serves a two-fold purpose. First of all, it specifies how often the client will send heartbeat signals to the server to confirm its activity on a channel. Secondly, the value defines a timeout period after which the server considers the client inactive, with inactivity beyond this period triggering a "timeout" on the [presence channel](/docs/general/presence/overview). Disabled by default.`callback`Type: LambdaDefault:  
n/aThat `callback` will be automatically passed to all method calls fired from this client (like `publish`, `history`, `subscribe`). Will be overwritten by the `callback` passed to called event.`ttl`Type: IntegerDefault:  
n/aDefault `ttl` for grant and revoke.`open_timeout`Type: IntegerDefault:  
`10`Timeout for opening connection for `non-subscribe` events.The value is in seconds.`read_timeout`Type: IntegerDefault:  
`10`Timeout for reading for `non-subscribe` events.The value is in seconds.`idle_timeout`Type: IntegerDefault:  
`10`Timeout for idle for `non-subscribe` events.The value is in seconds.`s_open_timeout`Type: IntegerDefault:  
`310`Timeout for opening connection for `subscribe`.The value is in seconds.`s_read_timeout`Type: IntegerDefault:  
`310`Timeout for read for `subscribe`.The value is in seconds.`s_idle_timeout`Type: IntegerDefault:  
`310`Timeout for idle for `subscribe`.The value is in seconds.`logger`Type: ObjectDefault:  
`Logger instance that outputs logs to 'pubnub.log'`Custom `logger` instance.   
  
 For detailed information about logging options and customization, refer to the [Logging](/docs/sdks/ruby/logging) document.`origin`Type: StringDefault:  
`ps.pndsn.com`Custom `origin`.   
Add method that allows changing the `origin`.`#origin=(origin)``http_sync`Type: BooleanDefault:  
`false`Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`crypto_module`Type: `Crypto::CryptoModule`Default:  
n/aThe cryptography module used for encryption and decryption of messages. Takes the `cipher_key` and `random_iv` parameters as arguments.   
   
 For more information, refer to the [crypto_module](#crypto_module) section.`cipher_key`Type: StringDefault:  
n/aThis way of setting this parameter is deprecated, pass it to `crypto_module` instead.   
   
 Your `cipher key`, it's used to encrypt and decrypt messages, if set.`random_iv`Type: BooleanDefault:  
`true`This way of setting this parameter is deprecated, pass it to `crypto_module` instead.   
   
 When `true` the initialization vector (IV) is random for all requests (not just for file upload). When `false` the IV is hard-coded for all requests except for file upload.`uuid` *Type: StringDefault:  
n/aThis parameter is deprecated, use `user_id` instead.  
  
`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
 If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (< `4.6.0`) with existing applications. Never disable random IV on new applications.

#### `crypto_module`[​](#crypto_module)

`crypto_module` provides encrypt/decrypt functionality for messages and files. From the 5.2.2 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to [Message Encryption](/docs/general/setup/data-security#message-encryption).

If you do not explicitly set the `crypto_module` in your app and have the `cipher_key` and `random_iv` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in the PubNub config.

##### `crypto_module` configuration[​](#crypto_module-configuration)

To configure the `crypto_module` to encrypt all messages/files, you can use the following methods in the Ruby SDK:

```
`# Encrypts using 256-bit AES-CBC cipher (recommended)  
# Decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pubnub = Pubnub.new(  
    # ...  
    crypto_module: Crypto::CryptoModule.new_aes_cbc("enigma", true)  
)  
  
# Encrypts with 128-bit cipher key entropy (legacy)  
# Decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
pubnub = Pubnub.new(  
    # ...  
    crypto_module: Crypto::CryptoModule.new_legacy("enigma", true)  
)  
`
```

##### Partial encryption[​](#partial-encryption)

Manual encryption allows users to decide what and when to encrypt.

##### Configuration settings

Do not configure crypto during PubNub client creation to use manual encryption.

For partial encryption, serialize complex objects (e.g., dictionaries) to JSON strings.

```
`data_to_encrypt = { key: "value to encrypt" }  
json_string = data_to_encrypt.to_json  
`
```

Encrypt the JSON string using the `crypto_module` instance.

```
`crypto_module = Crypto::CryptoModule.new_aes_cbc("enigma", true)  
encrypted_data = crypto_module.encrypt(json_string)  
`
```

To make encrypted data "transportable", encode it as a Base64 string.

```
`base64_encrypted_string = Base64.strict_encode64(encrypted_data)  
`
```

Use the Base64 string as an argument in the `publish()` function or as a value in a dictionary for partial encryption.

##### Decryption considerations[​](#decryption-considerations)

If the encrypted data is obtained as a Base64 encoded string (e.g., from subscribe response or history), decode it first.

```
`base64_encoded_data = "CxQ0dxjBqIHdfuvtTcKeaLlyeRY7ZuaKy27wwwWo1EE="  
decoded_data = Base64.decode64(base64_encoded_data)  
`
```

If dealing with a binary string output directly from `crypto_module.encrypt(data.to_json)`, you can use it directly for decryption.

```
`decrypted_string = crypto_module.decrypt(decoded_data)  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 5.2.2 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

#### Initialize the PubNub client API with encryption[​](#initialize-the-pubnub-client-api-with-encryption)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
  
def main  
  # Configuration for PubNub instance  
  pubnub = Pubnub.new(  
    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
    publish_key: ENV.fetch('PUBLISH_KEY', 'demo'),  
    ssl: true,  
    user_id: 'myUniqueUserId',  
    crypto_module: Pubnub::Crypto::CryptoModule.new_aes_cbc("enigma", true)  
  )  
  
  # Example to demonstrate successful configuration  
  puts "PubNub client initialized successfully with user_id: #{pubnub.user_id}"  
`
```
show all 22 lines

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `publish()`, `subscribe()`, `history()`, `here_now()`, etc.

### Other Examples[​](#other-examples)

#### Initialize the client[​](#initialize-the-client)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`pubnub = Pubnub.new(  
    publish_key: 'demo',  
    subscribe_key: 'demo',  
    user_id: 'myUniqueUserId'  
)  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publish_key` when initializing the client:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`# Initialize for Read Only Client  
pubnub = Pubnub.new(  
    subscribe_key : 'demo'  
)  
`
```

#### Use a custom user ID[​](#use-a-custom-user-id)

Set a custom `user_id` to identify your users.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`# initialize  
pubnub = Pubnub.new(  
    publish_key: 'myPublishKey',  
    subscribe_key: 'mySubscribeKey',  
    user_id: 'myUniqueUserId'  
)  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `ssl` set to `true`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key:   :demo,  
    ssl: true,  
    user_id: 'myUniqueUserId'  
)  
`
```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secret_key

Anyone with the `secret_key` can grant and revoke permissions to your app. Never let your secret key be discovered, and to only exchange it / deliver it securely. Only use the `secret_key` on secure server-side platforms.

When you init with `secret_key`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `secret_key` as in the following example:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`pubnub = Pubnub.new(subscribe_key: 'my_subkey', secret_key: 'my_secretkey', user_id: 'myUniqueUserId')  
`
```

Now that the pubnub object is instantiated the client will be able to access the Access Manager functions. The pubnub object will use the `secret_key` to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

You can be notified of connectivity status, message and presence notifications via the listeners.

Listeners should be added before calling the method.

#### Add Listeners[​](#add-listeners)

```
`callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_envelope) {}, # this will be fired only for non-presence messages  
    presence: ->(_envelope) {}, # this will be fired only for presence messages  
    signal: ->(_envelope) {}, # Handle signal message  
    status: ->(envelope)  do  # this will be fired for status messages and errors  
    if envelope.status[:error]  
        case envelope.status[:category]  
            when Pubnub::Constants::STATUS_ACCESS_DENIED # :access_denied  
                # Access denied. Double check Access Manager etc.  
            when Pubnub::Constants::STATUS_TIMEOUT # :timeout  
                # Timeout error  
            when Pubnub::Constants::STATUS_NON_JSON_RESPONSE # :non_json_response  
                # Non json response  
            when Pubnub::Constants::STATUS_API_KEY_ERROR # :api_key_error  
                # API key error  
`
```
show all 25 lines

#### Remove Listeners[​](#remove-listeners)

```
`pubnub.remove_listener(name: 'my_listener')  
# or  
pubnub.remove_listener(callbacks)  
`
```

#### Listeners Example[​](#listeners-example)

```
`# Init pubnub client  
pubnub_client = Pubnub.new(subscribe_key: 'demo', publish_key: 'demo')  
  
# First callbacks object  
callbacks0 = Pubnub::SubscribeCallback.new(  
  message:  ->(envelope) { puts "C0 MESSAGE: #{envelope.result[:data][:message]}" },  
  presence: ->(envelope) { puts "C0 PRESENCE: #{envelope.result[:data][:message]}" },  
  status:   ->(envelope) { puts "C0 STATUS: #{envelope.result[:data][:message]}" }  
)  
  
# Second callbacks object  
callbacks1 = Pubnub::SubscribeCallback.new(  
  message:  ->(envelope) { puts "C1 MESSAGE: #{envelope.result[:data][:message]}" },  
  presence: ->(envelope) { puts "C1 PRESENCE: #{envelope.result[:data][:message]}" },  
  status:   ->(envelope) { puts "C1 STATUS: #{envelope.result[:data][:message]}" }  
`
```
show all 48 lines

## Presence to a Channel Group[​](#presence-to-a-channel-group)

This functions subscribes to the presence channel of a channel group.

### Method(s)[​](#methods-1)

To do `Presence to a Channel Group` you can use the following method(s) in Ruby SDK:

- [Go to the `subscribe()` method](/docs/sdks/ruby/api-reference/publish-and-subscribe#subscribe).

### Basic Usage[​](#basic-usage-1)

Subscribe to the presence channel of a channel group

```
`pubnub = Pubnub.new(  
    subscribe_key: :demo,  
    publish_key: :demo  
)  
  
callback = Pubnub::SubscribeCallback.new(  
    message:  ->(_envelope) {  
    },  
    presence: ->(envelope) {  
        puts "PRESENCE: #{envelope.result[:data]}"  
    },  
    status:   ->(_envelope) {  
    }  
)  
  
`
```
show all 18 lines

## Authentication Key[​](#authentication-key)

This function provides the capability to get a user's `auth_key`.

### Method(s)[​](#methods-2)

```
`auth_key  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

```
`pubnub.auth_key  
`
```

### Returns[​](#returns-1)

The current authentication key.
Last updated on **May 7, 2025**