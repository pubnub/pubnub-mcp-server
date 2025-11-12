# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0

Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new PubNub client instantiation approach, and changes async callbacks and emitted status events. Review the Java/Kotlin SDK migration guide for details.

The methods on this page are utility methods that don't fit into other categories.

## Create push payload[​](#create-push-payload)

Creates the push payload for use in endpoint calls.

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
  Type: APNSPayload  
  Sets APNs/APNs2 payload. Associated devices receive this under pn_apns.

- helper.setFcmPayloadV2()  
  Type: FCMPayloadV2  
  Sets FCM Payload V2. Associated devices receive this under pn_fcm.

- helper.setCommonPayload()  
  Type: Map<String, Object>  
  Sets common payload. Native PubNub subscribers receive this together with pn_apns and pn_fcm objects.

- helper.build()  
  Type: Map<String, Object>  
  Builds the payload from the values set.

### Sample code[​](#sample-code)

##### Reference code

#### Create push payload[​](#create-push-payload-1)

```
1
  

```

### Response[​](#response)

PushPayloadHelper#build() returns a Map<String, Object> that can be passed as message() to pubnub.publish().

## Destroy[​](#destroy)

Frees up threads for a clean exit.

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

Stops all requests to PubNub when there are active subscribe channels.

### Method(s)[​](#methods-4)

```
`1disconnect()  
`
```

This method doesn't take any arguments.

### Sample code[​](#sample-code-4)

```
1
  

```

## Reconnect[​](#reconnect)

Forces the SDK to try and reach PubNub.

### Method(s)[​](#methods-5)

```
`1reconnect(long timetoken)  
`
```

- timetoken  
  Type: long  
  Timetoken to reconnect from.

### Sample code[​](#sample-code-5)

```
1
  

```

## Timetoken to date[​](#timetoken-to-date)

Converts a PubNub timetoken (100-ns intervals since Jan 1, 1970) to an Instant.

### Method signature[​](#method-signature)

```
`1Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```

#### Input[​](#input)

- timetoken  
  Type: long  
  PubNub timetoken to convert.

#### Output[​](#output)

- Instant — human-readable date/time representation.

### Sample code[​](#sample-code-6)

Convert a timetoken value of 17276954606232118:

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

Converts an Instant to a PubNub timetoken (100-ns intervals since Jan 1, 1970).

### Method signature[​](#method-signature-1)

```
`1long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```

#### Input[​](#input-1)

- instant  
  Type: Instant  
  Date/time to convert.

#### Output[​](#output-1)

- long — converted timetoken.

### Sample code[​](#sample-code-7)

Convert September 30, 2024 12:12:24 GMT:

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

Converts a Unix timestamp (seconds since Jan 1, 1970) to a PubNub timetoken.

### Method signature[​](#method-signature-2)

```
`1long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```

#### Input[​](#input-2)

- unixTime  
  Type: long  
  Unix timestamp to convert.

#### Output[​](#output-2)

- long — converted timetoken.

### Sample code[​](#sample-code-8)

Convert Unix timestamp 1727866935316 (2024-10-02 11:02:15.316):

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

Converts a PubNub timetoken to a Unix timestamp (seconds since Jan 1, 1970).

### Method signature[​](#method-signature-3)

```
`1long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```

#### Input[​](#input-3)

- timetoken  
  Type: long  
  PubNub timetoken to convert.

#### Output[​](#output-3)

- long — converted Unix timestamp.

### Sample code[​](#sample-code-9)

Convert PubNub timetoken 17276954606232118 (2024-09-30 11:24:20.623211800):

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