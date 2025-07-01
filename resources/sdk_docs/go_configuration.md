On this page
# Configuration API for Go SDK
Go complete API reference for building real-time applications on PubNub, including basic usage and sample code.
[View on GoDoc](https://godoc.org/github.com/pubnub/go)

## Configuration[​](#configuration)

`pubnub.Config` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contains additional set of properties which allow performing precise PubNub client configuration.

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the Go SDK:

```
`config := pubnub.NewConfigWithUserId(UserId)  
`
```

*  requiredParameterDescription`SubscribeKey` *Type: stringDefault:  
n/a`SubscribeKey` from Admin Portal.`PublishKey`Type: stringDefault:  
None`PublishKey` from Admin Portal (only required if publishing).`SecretKey`Type: stringDefault:  
None`SecretKey` (only required for modifying/revealing access permissions).`SetUserId` *Type: UserIdDefault:  
n/a`userId` to use. The `UserId` object takes `String` as an argument. You should set a unique identifier for the user or the device that connects to PubNub.  

It's a UTF-8 encoded string of up to 92 alphanumeric characters.
 If you don't set the `userId`, you won't be able to connect to PubNub.`AuthKey`Type: stringDefault:  
NoneIf Access Manager is utilized, client will use this `AuthKey` in all restricted requests.`Secure`Type: boolDefault:  
TrueUse `SSL`.`MessageQueueOverflowCount`Type: intDefault:  
100When the limit is exceeded by the number of messages received in a single subscribe request, a status event `PNRequestMessageCountExceededCategory` is fired.`ConnectTimeout`Type: intDefault:  
5How long to wait before giving up connection to client. The value is in seconds.`SubscribeRequestTimeout`Type: intDefault:  
310How long to keep the `Subscribe` loop running before disconnect.The value is in seconds.`NonSubscribeRequestTimeout`Type: intDefault:  
10On `Non subscribe` operations, how long to wait for server response.The value is in seconds.`FilterExpression`Type: stringDefault:  
NoneFeature to subscribe with a custom filter expression.`Origin`Type: stringDefault:  
`ps.pndsn.com`Custom `Origin` if needed.`MaximumReconnectionRetries`Type: intDefault:  
unlimited (-1)The config sets how many times to retry to reconnect before giving up.`SetPresenceTimeout`Type: intDefault:  
0Defines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server at a given interval (like every 300 seconds). These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).`SetPresenceTimeoutWithCustomInterval`Type: intDefault:  
0Specifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `SetPresenceTimeout`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(SetPresenceTimeout / 2) - 1`.`SuppressLeaveEvents`Type: boolDefault:  
n/aWhen `true` the SDK doesn't send out the `leave` requests.`MaxIdleConnsPerHost`Type: intDefault:  
30Used to set the value of HTTP Transport's MaxIdleConnsPerHost.`FileMessagePublishRetryLimit`Type: intDefault:  
5The number of tries made in case of Publish File Message failure.`CryptoModule`Type: `crypto.NewAesCbcCryptor(CipherKey, UseRandomInitializationVector)`   
   
 `crypto.NewLegacyCryptor(CipherKey, UseRandomInitializationVector)`Default:  
NoneThe cryptography module used for encryption and decryption of messages and files. Takes the `CipherKey` and `UseRandomInitializationVector` parameters as arguments.   
   
 For more information, refer to the [CryptoModule](#cryptomodule) section.`CipherKey`Type: stringDefault:  
NoneThis way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 If `CipherKey` is passed, all communications to/from PubNub will be encrypted.`UseRandomInitializationVector`Type: boolDefault:  
`true`This way of setting this parameter is deprecated, pass it to `CryptoModule` instead.   
   
 When `true` the initialization vector (IV) is random for all requests (not just for file upload). When `false` the IV is hard-coded for all requests except for file upload.`UUID` *Type: stringDefault:  
n/aThis parameter is deprecated, use `userId` instead.  
  
`UUID` to use. You should set a unique `UUID` to identify the user or the device that connects to PubNub.   
 If you don't set the `UUID`, you won't be able to connect to PubNub.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`5.0.0`) with existing applications. Never disable random IV on new applications.

#### `CryptoModule`[​](#cryptomodule)

`CryptoModule` provides encrypt/decrypt functionality for messages and files. From the 7.1.2 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256 bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `CryptoModule` in your app and have the `cipherKey` and `useRandomInitializationVector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256 bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `CryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `CryptoModule` to encrypt all messages/files, you can use the following methods in the Go SDK:

```
`// encrypts using 256 bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256 bit AES-CBC ciphers  
config.CryptoModule = crypto.NewAesCbcCryptoModule("cipherKey", true)  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256 bit AES-CBC ciphers  
config.CryptoModule = crypto.NewLegacyModule("cipherKey", true)  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256 bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 7.1.2 will **not** be able to decrypt data encrypted using the 256 bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`package main  
  
import (  
	"fmt"  
	crypto "github.com/pubnub/go/v7/crypto"  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  // Use Demo keys for testing  
	config.PublishKey = "demo"  
	config.SecretKey = "mySecretKey"  
	config.Secure = true  
`
```
show all 25 lines

### Rest Response from Server[​](#rest-response-from-server)

Configured and ready to use client configuration instance.

### Proxy Configuration[​](#proxy-configuration)

The following sample configures a client to use a proxy for subscribe requests:

```
`var pn *pubnub.PubNub  
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId")  
config.UseHTTP2 = false  
  
pn = pubnub.NewPubNub(config)  
  
transport := &http.Transport{  
    MaxIdleConnsPerHost: pn.Config.MaxIdleConnsPerHost,  
    Dial: (&net.Dialer{  
        Timeout:   time.Duration(pn.Config.ConnectTimeout) * time.Second,  
        KeepAlive: 30 * time.Minute,  
    }).Dial,  
    ResponseHeaderTimeout: time.Duration(pn.Config.SubscribeRequestTimeout) * time.Second,  
}  
proxyURL, err := url.Parse(fmt.Sprintf("http://%s:%s@%s:%d", "proxyUser", "proxyPassword", "proxyServer", 8080))  
`
```
show all 24 lines

The following sample configures a client to use a proxy for *non-subscribe* requests:

```
`var pn *pubnub.PubNub  
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId")  
config.UseHTTP2 = false  
  
pn = pubnub.NewPubNub(config)  
  
transport := &http.Transport{  
    MaxIdleConnsPerHost: pn.Config.MaxIdleConnsPerHost,  
    Dial: (&net.Dialer{  
        Timeout:   time.Duration(pn.Config.ConnectTimeout) * time.Second,  
        KeepAlive: 30 * time.Minute,  
    }).Dial,  
    ResponseHeaderTimeout: time.Duration(pn.Config.NonSubscribeRequestTimeout) * time.Second,  
}  
proxyURL, err := url.Parse(fmt.Sprintf("http://%s:%s@%s:%d", "proxyUser", "proxyPassword", "proxyServer", 8080))  
`
```
show all 24 lines

## Initialization[​](#initialization)

Add PubNub to your project using one of the procedures defined in the [Getting Started guide](/docs/sdks/go).

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `PublishKey` and `SubscribeKey`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the Go SDK:

```
`pn := pubnub.NewPubNub(config)  
`
```

*  requiredParameterDescription`config` *Type: ConfigGoto [Configuration](#configuration)  for more details.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`package main  
  
import (  
	"fmt"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configuration  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
	// Initialize the PubNub instance  
`
```
show all 19 lines

### Returns[​](#returns)

It returns the PubNub instance for invoking PubNub APIs like `Publish()`, `Subscribe()`, `History()`, `HereNow()`, etc.

### Other Examples[​](#other-examples)

#### Initialize a non-secure client[​](#initialize-a-non-secure-client)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfigWithUserId("userId")  
config.PublishKey = "my-pub-key"  
config.SubscribeKey = "my-sub-key"  
  
pn := pubnub.NewPubNub(config)  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `PublishKey` when initializing the client:

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfigWithUserId("userId")  
config.SubscribeKey = "my-sub-key"  
  
pn := pubnub.NewPubNub(config)  
`
```

## Event Listeners[​](#event-listeners)

You can be notified of connectivity status, message and presence notifications via the listeners.

Listeners should be added before calling the method.

#### Add Listeners[​](#add-listeners)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
listener := pubnub.NewListener()  
  
go func() {  
    for {  
        select {  
        case signal := listener.Signal:  
            //Channel  
            fmt.Println(signal.Channel)  
            //Subscription  
            fmt.Println(signal.Subscription)  
            //Payload  
`
```
show all 108 lines

#### Remove Listeners[​](#remove-listeners)

```
`listener := pubnub.NewListener()  
  
pn.AddListener(listener)  
  
// some time later  
pn.RemoveListener(listener)  
`
```

#### Handling Disconnects[​](#handling-disconnects)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
 go func() {  
    for {  
        select {  
        case status := listener.Status:  
            switch status.Category {  
            case pubnub.PNDisconnectedCategory:  
                // handle disconnect here  
            }  
        case listener.Message:  
        case listener.Presence:  
        }  
`
```
show all 17 lines

#### Listener status events[​](#listener-status-events)

CategoryDescription`PNTimeoutCategory`Processing has failed because of request time out.`PNDisconnectedCategory`The SDK is not able to reach PubNub servers because the machine or device are not connected to Internet or this has been lost, your ISP (Internet Service Provider) is having to troubles or perhaps or the SDK is behind of a proxy.`PNConnectedCategory`SDK subscribed with a new mix of channels (fired every time the channel / channel group mix changed).`PNAccessDeniedCategory`The SDK will announce this error when the Access Manager does not allow the subscription to a channel or a channel group.`PNBadRequestCategory`PubNub API server was unable to parse SDK request correctly.`PNCancelledCategory`Request was cancelled by user.`PNLoopStopCategory`Subscription loop has been stopped due some reasons.`PNReconnectedCategory`Subscription loop has been reconnected due some reasons.`PNAcknowledgmentCategory`An API call was successful. This status has additional details based on the type of the successful operation.`PNReconnectionAttemptsExhausted`The SDK loop has been stopped due maximum reconnection exhausted.`PNNoStubMatchedCategory/PNUnknownCategory`PNNoStubMatchedCategory as the StatusCategory means an unknown status category event occurred.`PNRequestMessageCountExceededCategory``PNRequestMessageCountExceededCategory` is fired when the `MessageQueueOverflowCount` limit is exceeded by the number of messages received in a single subscribe request.

## UserId[​](#userid)

These functions are used to set/get a user ID on the fly.

### Method(s)[​](#methods-2)

To set/get `UserId` you can use the following method(s) in Go SDK:

```
`config.SetUserId(UserId(string))  
`
```

*  requiredParameterDescription`UserId` *Type: stringDefault:  
n/a`UserId` to be used as a device identifier. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`config.GetUserId()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-2)

#### Set User ID[​](#set-user-id)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
config.SetUserId(UserId("myUniqueUserId"))  
  
// set UserId in a single line  
config := pubnub.NewConfigWithUserId("userId")  
  
`
```

#### Get User ID[​](#get-user-id)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
  
fmt.Println(config.GetUserId)  
`
```

## Authentication Key[​](#authentication-key)

Setter and getter for users auth key.

### Method(s)[​](#methods-3)

```
`config.AuthKey = string  
`
```

*  requiredParameterDescription`AuthKey` *Type: stringIf Access Manager is utilized, client will use this `AuthKey` in all restricted requests.

```
`config.AuthKey  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-3)

#### Set Auth Key[​](#set-auth-key)

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
  
config.AuthKey = "my_newauthkey"  
`
```

#### Get Auth Key[​](#get-auth-key)

```
`fmt.Println(config.AuthKey)  
`
```

### Returns[​](#returns-1)

None.

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following methods. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-4)

```
`config.FilterExpression = string  
`
```

*  requiredParameterDescription`filterExpression` *Type: stringPSV2 feature to `Subscribe` with a custom filter expression.

```
`config.FilterExpression  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-4)

#### Set Filter Expression[​](#set-filter-expression)

##### Required UserId

Always set the `UserId` to uniquely identify the user or device that connects to PubNub. This `UserId` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
  
config.FilterExpression = "such=wow"  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`fmt.Println(config.FilterExpression)**`
```
Last updated on Apr 22, 2025**