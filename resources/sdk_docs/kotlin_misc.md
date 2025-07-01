On this page
# Utility Methods API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

The methods on this page are utility methods that don't fit into other categories.

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Create Push Payload[​](#create-push-payload)

This method creates the push payload for use in the appropriate endpoint calls.

### Method(s)[​](#methods)

```
`val pushPayloadHelper = PushPayloadHelper()  
  
val fcmPayload = FCMPayload()  
val apnsPayload = APNSPayload()  
  
pushPayloadHelper.fcmPayload = fcmPayload  
pushPayloadHelper.apnsPayload = apnsPayload  
`
```

*  requiredParameterDescription`apnsPayload`Type: `APNSPayload`Set APNS and APNS2 Payload. Associated devices will receive only the data supplied here within the `pn_apns` key.`fcmPayload`Type: `FCMPayload`Set FCM Payload. Associated devices will receive only the data supplied here within the `pn_gcm` key.`commonPayload`Type: `Map<String, Any>`Set common Payload. Native PubNub subscribers will receive the data provided here, together with the `pn_apns` and `pn_gcm` objects.`build` *Type: `Map<String, Any>`Builds the payload from the values set using the parameters.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Create Push Payload[​](#create-push-payload-1)

```
`  
`
```

### Response[​](#response)

The `PushPayloadHelper#build()` operation returns a `Map<String, Any>` which can be passed directly as the `message` parameter to the `pubnub.publish()` method.

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-1)

To encrypt the data you can use the following method(s) in Kotlin SDK.

```
`pubnub.encrypt(  
    inputString: String,  
    cipherKey: String  
)  
`
```

*  requiredParameterDescription`inputString` *Type: `String`The data to encrypt.`cipherKey`Type: `String`Cipher key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/kotlin/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-1)

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`  
`
```

### Returns[​](#returns)

It returns the encrypted `inputString` as a `String`.

## Encrypt File Input Stream[​](#encrypt-file-input-stream)

Encrypts input stream with a cipher key.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

```
`pubnub.encryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

*  requiredParameterDescription`inputStream` *Type: InputStreamDefault:  
n/aStream with content to encrypt.`cipherKey`Type: StringDefault:  
`PNConfiguration.getCipherKey()`If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/kotlin/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-1)

InputStream with encrypted data.

## Decrypt[​](#decrypt)

This function allow to `decrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

```
`pubnub.decrypt(  
    inputString: String,  
    cipherKey: String  
)  
`
```

To decrypt the data you can use the following method(s) in Kotlin SDK.

*  requiredParameterDescription`inputString` *Type: `String`The data to decrypt.`cipherKey`Type: `String`Cipher key to use for decryption.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-2)

It returns the decrypted `inputString` as a `String`.

## Decrypt File Input Stream[​](#decrypt-file-input-stream)

### Method(s)[​](#methods-4)

Decrypts input stream with a cipher key.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

```
`pubnub.decryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

*  requiredParameterDescription`inputStream` *Type: InputStreamDefault:  
n/aStream with content encrypted data.`cipherKey`Type: StringDefault:  
`PNConfiguration.getCipherKey()`Cipher key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/kotlin/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

### Returns[​](#returns-3)

InputStream with decrypted data.

## Destroy[​](#destroy)

Destroy frees up the threads and allows for clean exit.

### Method(s)[​](#methods-5)

```
`destroy()  
`
```

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

### Returns[​](#returns-4)

None

## Get Subscribed Channels Groups[​](#get-subscribed-channels-groups)

Returns all the subscribed channel groups in a `List<String>`.

### Method(s)[​](#methods-6)

To Get Subscribe Channel Groups you can use the following method(s) in the Kotlin SDK:

```
`fun getSubscribedChannelGroups(): ListString>  
`
```

### Basic Usage[​](#basic-usage-6)

```
`  
`
```

### Response[​](#response-1)

```
`["channel1", "channel2"]  
`
```

## Get Subscribed Channels[​](#get-subscribed-channels)

Returns all the subscribed channels in a `List<String>`.

### Method(s)[​](#methods-7)

To Get Subscribe Channels you can use the following method(s) in the Kotlin SDK:

```
`fun getSubscribedChannels(): ListString>  
`
```

### Basic Usage[​](#basic-usage-7)

```
`  
`
```

### Response[​](#response-2)

```
`["channel1", "channel2"]  
`
```

## Disconnect[​](#disconnect)

Call the `disconnect()` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods-8)

To `disconnect()` the data transmission you can use the following method(s) in Kotlin SDK.

```
`disconnect()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-8)

```
`  
`
```

## Reconnect[​](#reconnect)

Call the `reconnect()` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-9)

To `reconnect()` the data you can use the following method(s) in Kotlin SDK.

```
`reconnect()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-9)

```
`  
`
```

## Timetoken to date[​](#timetoken-to-date)

The `timetokenToInstant()` method of the `TimetokenUtil` class converts a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970) to an `Instant` object representing the corresponding date and time.

Use this method when you want to display the timetoken of each message or event in the message history in a human-readable format.

### Method signature[​](#method-signature)

```
`TimetokenUtil.timetokenToInstant(timetoken: Long): Instant  
`
```

#### Input[​](#input)

*  requiredParameterDescription`timetoken` *Type: `Long`Default:  
n/aRepresents the PubNub timetoken to convert into a human-readable date format.

#### Output[​](#output)

TypeDescription`Instant`The human-readable date representation of the timetoken.

### Basic usage[​](#basic-usage-10)

Convert a timetoken value of `17276954606232118` to a human-readable date and time format.

```
`  
`
```

## Date to timetoken[​](#date-to-timetoken)

The `instantToTimetoken()` method of the `TimetokenUtil` class converts the `Instant` object representing the corresponding date and time into a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970).

Use this method to represent a specific date and time as a PubNub timetoken value, for example, to retrieve messages from a PubNub channel at a particular date and time.

### Method signature[​](#method-signature-1)

```
`TimetokenUtil.instantToTimetoken(instant: Instant): Long  
`
```

#### Input[​](#input-1)

*  requiredParameterDescription`instant` *Type: `Instant`Default:  
n/aRepresents the date and time to convert into a PubNub timetoken.

#### Output[​](#output-1)

TypeDescription`Long`Converted timetoken value.

### Basic usage[​](#basic-usage-11)

Convert a human-readable date and time, `September 30, 2024 12:12:24 GMT`, to a timetoken.

```
`  
`
```

## Unix timestamp to timetoken[​](#unix-timestamp-to-timetoken)

The `unixToTimetoken()` method of the `TimetokenUtil` class converts a Unix timestamp (a number of seconds since January 1, 1970) to a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970).

Use this method when you need a timetoken to [retrieve historical messages](/docs/sdks/kotlin/api-reference/storage-and-playback) with a specific timestamp range from Message Persistence.

### Method signature[​](#method-signature-2)

This method takes the following parameters:

```
`TimetokenUtil.unixToTimetoken(unixTime: Long): Long   
`
```

#### Input[​](#input-2)

*  requiredParameterDescription`unixTime` *Type: `Long`Default:  
n/aRepresents the Unix timestamp to convert into a PubNub timetoken.

#### Output[​](#output-2)

TypeDescription`Long`Converted timetoken value.

### Basic usage[​](#basic-usage-12)

Convert a Unix timestamp value of `1727866935316` representing `2024-10-02 11:02:15.316` to PubNub timetoken:

```
`  
`
```

## Timetoken to Unix timestamp[​](#timetoken-to-unix-timestamp)

The `timetokenToUnix()` method of the `TimetokenUtil` class converts a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970) to a Unix timestamp (a number of seconds since January 1, 1970).

Use this method to convert PubNub timetoken for use in another context or system that requires a Unix timestamp.

### Method signature[​](#method-signature-3)

```
`TimetokenUtil.timetokenToUnix(timetoken: Long): Long   
`
```

#### Input[​](#input-3)

*  requiredParameterDescription`timetoken` *Type: `Long`Default:  
n/aRepresents the PubNub timetoken to convert into a Unix timestamp.

#### Output[​](#output-3)

TypeDescription`Long`Converted Unix timestamp value.

### Basic usage[​](#basic-usage-13)

Convert a PubNub timetoken `17276954606232118` representing `2024-09-30 11:24:20.623211800` to Unix time:

```
`**`
```
Last updated on Jun 30, 2025**