# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new client instantiation approach, and changes asynchronous API callbacks and emitted status events. These may impact apps built with versions < 9.0.0.

For details, see Java/Kotlin SDK migration guide.

The methods below are utility methods.

## Create push payload[​](#create-push-payload)

Create a push payload for use in endpoint calls.

### Method(s)[​](#methods)

```
1PushPayloadHelper helper = new PushPayloadHelper();  
2    helper.setApnsPayload(PushPayloadHelper.APNSPayload());  
3    helper.setFcmPayloadV2(PushPayloadHelper.FCMPayloadV2());  
4    helper.setCommonPayload(HashMapString, Object>());  
5
  
6MapString, Object> payload = helper.build();  

```

- helper.setApnsPayload()
  - Type: APNSPayload
  - Sets APNs/APNs2 payload placed under pn_apns.
- helper.setFcmPayloadV2()
  - Type: FCMPayloadV2
  - Sets FCM V2 payload placed under pn_fcm.
- helper.setCommonPayload()
  - Type: Map<String, Object>
  - Sets common payload delivered to native PubNub subscribers along with pn_apns and pn_fcm objects.
- helper.build()
  - Type: Map<String, Object>
  - Builds the payload from the set values.

### Sample code[​](#sample-code)

##### Reference code

#### Create push payload[​](#create-push-payload-1)

```
1
  

```

### Response[​](#response)

PushPayloadHelper#build() returns a Map<String, Object> suitable as the message() parameter to pubnub.publish().

## Destroy[​](#destroy)

Frees threads and allows a clean exit.

### Method(s)[​](#methods-1)

```
`1destroy()  
`
```

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns)

None

## Get subscribed channel groups[​](#get-subscribed-channel-groups)

Returns all subscribed channel groups.

### Method(s)[​](#methods-2)

```
`1public final ListString> getSubscribedChannelGroups()  
`
```

### Sample code[​](#sample-code-2)

#### Get subscribed channel groups[​](#get-subscribed-channel-groups-1)

```
1
  

```

### Response[​](#response-1)

List<String>

```
`1["channelGroup1", "channelGroup2"]  
`
```

## Get subscribed channels[​](#get-subscribed-channels)

Returns all subscribed channels.

### Method(s)[​](#methods-3)

```
`1public final ListString> getSubscribedChannels()  
`
```

### Sample code[​](#sample-code-3)

#### Get subscribed channels[​](#get-subscribed-channels-1)

```
1
  

```

### Response[​](#response-2)

List<String>

```
`1["channel1", "channel2"]  
`
```

## Disconnect[​](#disconnect)

Stops all requests to PubNub servers when there are active subscribe channels.

### Method(s)[​](#methods-4)

```
`1disconnect()  
`
```

This method takes no arguments.

### Sample code[​](#sample-code-4)

```
1
  

```

## Reconnect[​](#reconnect)

Forces the SDK to try to reach PubNub.

### Method(s)[​](#methods-5)

```
`1reconnect(long timetoken)  
`
```

- timetoken
  - Type: long
  - Timetoken to reconnect from.

### Sample code[​](#sample-code-5)

```
1
  

```

## Timetoken to date[​](#timetoken-to-date)

Converts a PubNub timetoken (100-nanosecond intervals since 1970-01-01) to a java.time.Instant.

### Method signature[​](#method-signature)

```
`1Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```

#### Input[​](#input)

- timetoken
  - Type: long
  - PubNub timetoken to convert.

#### Output[​](#output)

- Instant — date/time representation of the timetoken.

### Sample code[​](#sample-code-6)

Convert 17276954606232118 to a human-readable date/time.

```
1
  

```

Output:

```
`PubNub timetoken: 17276954606232118  
Current date: 2024-09-30  
Current time: 11:24:20.623211800  
`
```

## Date to timetoken[​](#date-to-timetoken)

Converts a java.time.Instant to a PubNub timetoken.

### Method signature[​](#method-signature-1)

```
`1long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```

#### Input[​](#input-1)

- instant
  - Type: Instant
  - Date/time to convert.

#### Output[​](#output-1)

- long — converted timetoken.

### Sample code[​](#sample-code-7)

Convert September 30, 2024 12:12:24 GMT to a timetoken.

```
1
  

```

```
`Current date: 2024-09-30  
Current time: 12:12:44.123456789  
PubNub timetoken: 17276983641234567  
`
```

## Unix timestamp to timetoken[​](#unix-timestamp-to-timetoken)

Converts a Unix timestamp (seconds since 1970-01-01) to a PubNub timetoken.

### Method signature[​](#method-signature-2)

```
`1long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```

#### Input[​](#input-2)

- unixTime
  - Type: long
  - Unix timestamp to convert.

#### Output[​](#output-2)

- long — converted timetoken.

### Sample code[​](#sample-code-8)

Convert Unix timestamp 1727866935316 (2024-10-02 11:02:15.316) to a PubNub timetoken:

```
1
  

```

Output:

```
`PubNub timetoken: 17278669353160000  
Current date: 2024-10-02  
Current time: 11:02:15.316  
`
```

## Timetoken to Unix timestamp[​](#timetoken-to-unix-timestamp)

Converts a PubNub timetoken to a Unix timestamp (seconds since 1970-01-01).

### Method signature[​](#method-signature-3)

```
`1long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```

#### Input[​](#input-3)

- timetoken
  - Type: long
  - PubNub timetoken to convert.

#### Output[​](#output-3)

- long — converted Unix timestamp.

### Sample code[​](#sample-code-9)

Convert PubNub timetoken 17276954606232118 (2024-09-30 11:24:20.623211800) to Unix time:

```
1
  

```

Output:

```
`Current date: 2024-09-30**Current time: 11:24:20.623  
PubNub timetoken: 17276954606232118  
`
```

Last updated on Oct 15, 2025**