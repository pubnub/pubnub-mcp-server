On this page
# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

The methods on this page are utility methods that don't fit into other categories.

## Create Push Payload[​](#create-push-payload)

This method creates the push payload for use in the appropriate endpoint calls.

### Method(s)[​](#methods)

```
`PushPayloadHelper helper = new PushPayloadHelper();  
    helper.setApnsPayload(PushPayloadHelper.APNSPayload());  
    helper.setFcmPayloadV2(PushPayloadHelper.FCMPayloadV2());  
    helper.setCommonPayload(HashMapString, Object>());  
  
MapString, Object> payload = helper.build();  
`
```

*  requiredParameterDescription`helper.setApnsPayload()`Type: `APNSPayload`Set APNs and APNs2 Payload. Associated devices will receive only the data supplied here within the `pn_apns` key.`helper.setFcmPayloadV2()`Type: `FCMPayloadV2`Set FCM Payload. Associated devices will receive only the data supplied here within the `pn_gcm` key.`helper.setCommonPayload()`Type: `Map<String, Object>`Set common Payload. Native PubNub subscribers will receive the data provided here, together with the `pn_apns`, and `pn_gcm` objects.`helper.build()` *Type: `Map<String, Object>`Builds the payload from the values set using the parameters.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Create Push Payload[​](#create-push-payload-1)

```
`  
`
```

### Response[​](#response)

The `PushPayloadHelper#build()` operation returns a `Map<String, Object>` which can be passed directly as the `message()` parameter to the `pubnub.publish()` method.

## Destroy[​](#destroy)

Destroy frees up the threads and allows for clean exit.

### Method(s)[​](#methods-1)

```
`destroy()  
`
```

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns)

None

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

To `encrypt` the data you can use the following method(s) in Java SDK.

```
`pubnub.encrypt(data, customCipherKey)  
`
```

*  requiredParameterDescription`data` *Type: StringThe `data` to `encrypt`.`customCipherKey`Type: StringCipher key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/java/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-2)

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`  
`
```

## Encrypt File Input Stream[​](#encrypt-file-input-stream)

Encrypts input stream with a cipher key.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

```
`pubnub.encryptInputStream(inputStream, cipherKey)  
`
```

*  requiredParameterDescription`inputStream` *Type: InputStreamDefault:  
n/aStream with content to encrypt.`cipherKey`Type: StringDefault:  
`PNConfiguration.getCipherKey()`If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/java/api-reference/configuration#cryptomodule)

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-1)

InputStream with encrypted data.

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

### Method(s)[​](#methods-4)

To `decrypt` the data you can use the following method(s) in Java SDK.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

```
`pubnub.decrypt(data, customCipherKey)  
`
```

*  requiredParameterDescription`data` *Type: StringThe `data` to `decrypt`.`customCipherKey`Type: StringCipher key to use for decryption.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

## Decrypt File Input Stream[​](#decrypt-file-input-stream)

Decrypts input stream with a cipher key.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-5)

```
`pubnub.decryptInputStream(inputStream, cipherKey)  
`
```

*  requiredParameterDescription`inputStream` *Type: InputStreamDefault:  
n/aStream with content encrypted data.`cipherKey`Type: StringDefault:  
`PNConfiguration.getCipherKey()`Cipher key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `cryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/java/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

### Returns[​](#returns-2)

InputStream with decrypted data.

## Get Subscribed Channel Groups[​](#get-subscribed-channel-groups)

Returns all the subscribed channel groups in a `List of type String`.

### Method(s)[​](#methods-6)

To `Get Subscribe Channel Groups` you can use the following method(s) in the Java SDK:

```
`public final ListString> getSubscribedChannelGroups()  
`
```

### Basic Usage[​](#basic-usage-6)

#### Get Subscribed Channel Groups[​](#get-subscribed-channel-groups-1)

```
`  
`
```

### Response[​](#response-1)

`List<String>`

```
`["channelGroup1", "channelGroup2"]  
`
```

## Get Subscribed Channels[​](#get-subscribed-channels)

Returns all the subscribed channels in a `List of type String`.

### Method(s)[​](#methods-7)

To `Get Subscribed Channels` you can use the following method(s) in the Java SDK:

```
`public final ListString> getSubscribedChannels()  
`
```

### Basic Usage[​](#basic-usage-7)

#### Get Subscribed Channels[​](#get-subscribed-channels-1)

```
`  
`
```

### Response[​](#response-2)

`List<String>`

```
`["channel1", "channel2"]  
`
```

## Disconnect[​](#disconnect)

Call the `disconnect` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods-8)

To `disconnect` the data transmission you can use the following method(s) in Java SDK.

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

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-9)

To `reconnect` the data you can use the following method(s) in Java SDK.

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
`Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```

#### Input[​](#input)

*  requiredParameterDescription`timetoken` *Type: `long`Default:  
n/aRepresents the PubNub timetoken to convert into a human-readable date format.

#### Output[​](#output)

TypeDescription`Instant`The human-readable date representation of the timetoken.

### Basic usage[​](#basic-usage-10)

Convert a timetoken value of `17276954606232118` to a human-readable date and time format.

```
`  
`
```

The output of the method is as follows:

```
`PubNub timetoken: 17276954606232118  
Current date: 2024-09-30  
Current time: 11:24:20.623211800  
`
```

## Date to timetoken[​](#date-to-timetoken)

The `instantToTimetoken()` method of the `TimetokenUtil` class converts the `Instant` object representing the corresponding date and time into a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970).

Use this method to represent a specific date and time as a PubNub timetoken value, for example, to retrieve messages from a PubNub channel at a particular date and time.

### Method signature[​](#method-signature-1)

```
`long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```

#### Input[​](#input-1)

*  requiredParameterDescription`instant` *Type: `Instant`Default:  
n/aRepresents the date and time to convert into a PubNub timetoken.

#### Output[​](#output-1)

TypeDescription`long`Converted timetoken value.

### Basic usage[​](#basic-usage-11)

Convert a human-readable date and time, `September 30, 2024 12:12:24 GMT`, to a timetoken.

```
`  
`
```

```
`Current date: 2024-09-30  
Current time: 12:12:44.123456789  
PubNub timetoken: 17276983641234567  
`
```

## Unix timestamp to timetoken[​](#unix-timestamp-to-timetoken)

The `unixToTimetoken()` method of the `TimetokenUtil` class converts a Unix timestamp (a number of seconds since January 1, 1970) to a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970).

Use this method when you need a timetoken to [retrieve historical messages](/docs/sdks/java/api-reference/storage-and-playback) with a specific timestamp range from Message Persistence.

### Method signature[​](#method-signature-2)

This method takes the following parameters:

```
`long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```

#### Input[​](#input-2)

*  requiredParameterDescription`unixTime` *Type: `long`Default:  
n/aRepresents the Unix timestamp to convert into a PubNub timetoken.

#### Output[​](#output-2)

TypeDescription`long`Converted timetoken value.

### Basic usage[​](#basic-usage-12)

Convert a Unix timestamp value of `1727866935316` representing `2024-10-02 11:02:15.316` to PubNub timetoken:

```
`  
`
```

The output of the method is as follows:

```
`PubNub timetoken: 17278669353160000  
Current date: 2024-10-02  
Current time: 11:02:15.316  
`
```

## Timetoken to Unix timestamp[​](#timetoken-to-unix-timestamp)

The `timetokenToUnix()` method of the `TimetokenUtil` class converts a PubNub timetoken (a unique identifier for each message sent and received in a PubNub channel that is a number of 100-nanosecond intervals since January 1, 1970) to a Unix timestamp (a number of seconds since January 1, 1970).

Use this method to convert PubNub timetoken for use in another context or system that requires a Unix timestamp.

### Method signature[​](#method-signature-3)

```
`long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```

#### Input[​](#input-3)

*  requiredParameterDescription`timetoken` *Type: `long`Default:  
n/aRepresents the PubNub timetoken to convert into a Unix timestamp.

#### Output[​](#output-3)

TypeDescription`long`Converted Unix timestamp value.

### Basic usage[​](#basic-usage-13)

Convert a PubNub timetoken `17276954606232118` representing `2024-09-30 11:24:20.623211800` to Unix time:

```
`  
`
```

The output of the method is as follows:

```
`Current date: 2024-09-30**Current time: 11:24:20.623  
PubNub timetoken: 17276954606232118  
`
```
Last updated on Jun 30, 2025**