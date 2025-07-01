On this page
# Configuration API for Python SDK

Python complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration[​](#configuration)

`PNConfiguration` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contain additional set of properties which allow to perform precise PubNub client configuration.

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the Python SDK:

```
`pnconfig = PNConfiguration()  
`
```

*  requiredParameterDescription`subscribe_key` *Type: StringDefault:  
n/a`subscribe_key` from Admin Portal.`publish_key`Type: StringDefault:  
`None``publish_key` from Admin Portal (only required if publishing).`secret_key`Type: StringDefault:  
`None``secret_key` (only required for modifying/revealing access permissions)`user_id` *Type: StringDefault:  
n/a`user_id` to use. You should set a unique `user_id` to identify the user or the device that connects to PubNub.   

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `user_id`, you won't be able to connect to PubNub.`auth_key`Type: StringDefault:  
`None`If Access Manager is utilized, client will use this `authKey` in all restricted requests.`ssl`Type: BooleanDefault:  
`True`Use `SSL`.`connect_timeout`Type: IntDefault:  
`5`How long to wait before giving up connection to client.The value is in seconds.`subscribe_request_timeout`Type: IntDefault:  
`310`How long to keep the `subscribe` loop running before disconnect. The value is in seconds.`non_subscribe_request_timeout`Type: IntDefault:  
`10`On `non subscribe` operations, how long to wait for server response. The value is in seconds.`filter_expression`Type: StringDefault:  
`None`Feature to subscribe with a custom filter expression.`heartbeat_notification_options`Type: PNHeartbeatNotificationOptionsDefault:  
`PNHeartbeatNotificationOptions.FAILURES``Heartbeat` notifications, by default, the SDK will alert on failed heartbeats (equivalent to: `PNHeartbeatNotificationOptions.FAILURES`).   
Other options such as all heartbeats (`PNHeartbeatNotificationOptions.ALL`) or no heartbeats (`PNHeartbeatNotificationOptions.NONE`) are supported.`reconnect_policy`Type: `PNReconnectionPolicy`Default:  
`PNReconnectionPolicy.EXPONENTIAL` (subscribe only)Custom reconnection configuration parameters. `PNReconnectionPolicy` is the type of policy to be used.   
   
 Available values:   
 
- `PNReconnectionPolicy.NONE`
- `PNReconnectionPolicy.LINEAR` (see `maximum_reconnection_retries` and `reconnection_interval` below) 
- `PNReconnectionPolicy.EXPONENTIAL`

   
   
 For more information, refer to [SDK connection lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).`maximum_reconnection_retries`Type: intDefault:  
`10`Number of times a request can be retried. Only applicable to `PNReconnectionPolicy.LINEAR`.`reconnection_interval`Type: floatDefault:  
`2.0`The delay in seconds between failed retry attempts. Only applicable to `PNReconnectionPolicy.LINEAR`.`suppress_leave_events`Type: BooleanDefault:  
`False`If `True`, the client doesn't send presence leave events during the unsubscribe process.`enable_subscribe`Type: BooleanDefault:  
`True`You can disable the `subscribe loop` if you don't need to perform subscribe operations. By default, `subscribe loop` is enabled and extra threads/loops are started. They should be explicitly stopped by `pubnub.stop()` method invocation.`daemon`Type: BooleanDefault:  
`False`When set to `True`, spawned thread won't keep the application running after SIGTERM. (ctrl-c from command line, for example)`disable_token_manager`Type: BooleanDefault:  
`False`When set to `True`, the Token Manager System (TMS) will be disabled. Even if there are applicable tokens, no requests will be authorized.`cipher_mode`Type: `AES.MODE_CBC` or `AES.MODE_GCM`Default:  
`AES.MODE_CBC`The cipher method to be used for message encryption for the legacy crypto module. By default, all PubNub SDKs use CBC.   
   
 ⚠️**Warning!**   
 If you set the Python SDK's `cipher_mode` to GCM, ensure that all other clients can decode the message.`fallback_cipher_mode`Type: `AES.MODE_CBC` or `AES.MODE_GCM`Default:  
`None`The secondary cipher method used for message decryption for the legacy crypto module. It is used if the method set in the `cipher_mode` parameter fails to decrypt the messages.`cipher_key`Type: StringDefault:  
`None`If `cipher_key` is passed, all communications to/from PubNub will be encrypted.`use_random_initialization_vector`Type: BooleanDefault:  
`True`When `True` the initialization vector (IV) is random for all requests (not just for file upload). When `False` the IV is hard-coded for all requests except for file upload.`crypto_module`Type: `PubNubCryptoModule`Default:  
`None`The cryptography module used for encryption and decryption of messages and files. Takes the `config` (`PNConfiguration` instance with `cipher_key` and `use_random_initialization_vector`) parameter as argument.   
   
 For more information, refer to the [crypto_module](#crypto_module) section.`uuid` *Type: StringDefault:  
n/aThis parameter is deprecated, use `user_id` instead. `UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
 If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`5.1.0`) with existing applications. Never disable random IV on new applications.

### Working with cipher mode
example

#### `crypto_module`[​](#crypto_module)

`crypto_module` provides encrypt/decrypt functionality for messages and files. From the 7.2.0 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `crypto_module` in your app and have the `cipher_key` and `use_random_initialization_vector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `crypto_module` configuration[​](#crypto_module-configuration)

To configure the `crypto_module` to encrypt all messages/files, you can use the following methods in the Python SDK:

```
`#  encrypts using 256-bit AES-CBC cipher (recommended)  
#  decrypts data encrypted with the legacy (AES and GCM) and the 256-bit AES-CBC ciphers  
config = PNConfiguration()  
...  
# all necessary config options  
config.cipher_key = "my_cipher_key"  
config.cipher_mode = AES.MODE_GCM # optional, used for the legacy module only  
config.fallback_cipher_mode = AES.MODE_CBC # optional, used for the legacy module only  
config.crypto_module = AesCbcCryptoModule(config)  
pubnub = PubNub(config)  
  
#  encrypts with 128-bit cipher key entropy (legacy) with GCM  
#  decrypts data encrypted with the legacy (AES and GCM) and the 256-bit AES-CBC ciphers  
config = PNConfiguration()  
...  
`
```
show all 33 lines

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 7.2.0 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.enums import PNHeartbeatNotificationOptions  
from pubnub.pubnub import PubNub  
from pubnub.crypto import AesCbcCryptoModule  
  
  
# Configuration for PubNub instance  
pn_configuration = PNConfiguration()  
  
# Set configuration values  
pn_configuration.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  # required  
pn_configuration.publish_key = os.getenv('PUBLISH_KEY', 'demo')  # only required if publishing  
pn_configuration.secret_key = os.getenv('SECRET_KEY', 'my_secret_key')  # optional  
pn_configuration.cipher_key = os.getenv('CIPHER_KEY', 'my_cipher_key')  # for encryption/decryption  
`
```
show all 31 lines

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined in the [Getting Started guide](/docs/sdks/python).

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `publish_key` and `subscribe_key`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the Python SDK:

```
`pubnub = PubNub(pn_configuration, custom_request_handler)  
`
```

*  requiredParameterDescription`pn_configuration` *Type: [`PNConfiguration`](#configuration)Default:  
n/aThe configuration object. For more details, refer to [Configuration](#configuration).`custom_request_handler`Type: subclass of `BaseRequestHandler`Default:  
`HttpxRequestHandler`The optional custom HTTP request handler. For more information, refer to [Custom request handler](#custom-request-handler).

#### Custom request handler[​](#custom-request-handler)

The `custom_request_handler` optional configuration option allows you to select the library for sending HTTP requests.

If you don't specify this parameter, the Python SDK first checks the value of the `PUBNUB_REQUEST_HANDLER` environment variable. If you don't set the variables or their value is not a subclass of `BaseRequestHandler`, the PubNub Python SDK defaults to `HttpxRequestHandler`.

ClassDescription`HttpxRequestHandler`Python SDK synchronous requests handler based on the [httpx](https://www.python-httpx.org/) HTTP library.`RequestsRequestHandler`Python SDK synchronous requests handler based on the [requests](https://requests.readthedocs.io/en/latest/) HTTP library.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = True  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `publish()`, `subscribe()`, `history()`, `here_now()`, etc.

### Other Examples[​](#other-examples)

#### Use a custom request handler[​](#use-a-custom-request-handler)

You can set a custom request handler by specifying one of the available request handlers during the initialization of the PubNub client.

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.request_handlers.requests_handler import RequestsRequestHandler  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.user_id = "my_custom_user_id"  
  
pubnub = PubNub(pnconfig, custom_request_handler=RequestsRequestHandler)  
`
```

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = False  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publish_key` when initializing the client:

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
  
pubnub = PubNub(pnconfig)  
`
```

#### Use a custom User ID[​](#use-a-custom-user-id)

Set a custom `user_id` to identify your users.

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
  
pnconfig.subscribe_key = 'mySubscribeKey'  
pnconfig.publish_key = 'myPublishKey'  
pnconfig.user_id = "my_custom_user_id"  
  
pubnub = PubNub(pnconfig)  
`
```

#### Initializing with SSL Enabled[​](#initializing-with-ssl-enabled)

This examples demonstrates how to enable PubNub Transport Layer Encryption with `SSL`. Just initialize the client with `ssl` set to `True`. The hard work is done, now the PubNub API takes care of the rest. Just subscribe and publish as usual and you are good to go.

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.ssl = True  
pnconfig.user_id = "my_custom_user_id"  
pubnub = PubNub(pnconfig)  
`
```

#### Initializing with Access Manager[​](#initializing-with-access-manager)

##### Requires Access Manager add-on

This method requires that the *Access Manager* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

##### Secure your secret_key

Anyone with the `secret_key` can grant and revoke permissions to your app. Never let your `secret_key` be discovered, and to only exchange it / deliver it securely. Only use the `secret_key` on secure server-side platforms.

When you init with `secret_key`, you get root permissions for the Access Manager. With this feature you don't have to grant access to your servers to access channel data. The servers get all access on all channels.

For applications that will administer Access Manager permissions, the API is initialized with the `secret_key` as in the following example:

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = "my_subkey"  
pnconfig.publish_key = "my_pubkey"  
pnconfig.secret_key = "my_secretkey"  
pnconfig.user_id = "my_custom_user_id"  
pnconfig.ssl = True  
  
pubnub = PubNub(pnconfig)  
`
```

Now that the pubnub object is instantiated the client will be able to access the Access Manager functions. The pubnub object will use the `secret_key` to sign all Access Manager messages to the PubNub Network.

## Event Listeners[​](#event-listeners)

PubNub SDKs provide several sources for real-time updates:

- The PubNub client can receive updates from all subscriptions: all channels, channel groups, channel metadata, and users.

- The [`Subscription`](/docs/sdks/python/api-reference/publish-and-subscribe#create-a-subscription) object can receive updates only for the particular object for which it was created: channel, channel group, channel metadata, or user.

- The [`SubscriptionsSet`](/docs/sdks/python/api-reference/publish-and-subscribe#create-a-subscription-set) object can receive updates for all objects for which a list of subscription objects was created.

To facilitate working with those real-time update sources, PubNub SDKs use local representations of server entities that allow you to subscribe and add handlers on a per-entity basis. For more information, refer to [Publish & Subscribe](/docs/sdks/python/api-reference/publish-and-subscribe#event-listeners).

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following methods. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-2)

```
`Set Filter Expression  
`
```

The property accepts a `string`.

```
`Get Filter Expression  
`
```

The property returns a `string`.

### Basic Usage[​](#basic-usage-2)

#### Set Filter Expression[​](#set-filter-expression)

##### Required User ID

Always set the `user_id` to uniquely identify the user or device that connects to PubNub. This `user_id` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `user_id`, you won't be able to connect to PubNub.

```
`from pubnub.pnconfiguration import PNConfiguration  
  
pnconfig = PNConfiguration()  
pnconfig.filter_expression = "such=wow"  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`filter = pnconfig.filter_expression**`
```
Last updated on Apr 29, 2025**