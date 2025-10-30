# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, async callbacks, and status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

The methods on this page are utility methods that don't fit into other categories.

## Create push payload

Creates a push payload for use in endpoint calls.

### Method(s)

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
  - Sets APNs/APNs2 payload placed under pn_apns key for associated devices.
- helper.setFcmPayloadV2()
  - Type: FCMPayloadV2
  - Sets FCM v2 payload placed under pn_fcm key for associated devices.
- helper.setCommonPayload()
  - Type: Map<String, Object>
  - Sets common payload. Native PubNub subscribers receive this along with pn_apns and pn_fcm.
- helper.build()
  - Type: Map<String, Object>
  - Builds the payload from the values set.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Create push payload

```
1
  
```

### Response
PushPayloadHelper#build() returns a Map<String, Object> which can be passed directly as the message() parameter to pubnub.publish().

## Destroy

Frees up threads and allows for clean exit.

### Method(s)

```
`1destroy()  
`
```

### Sample code

```
1
  
```

### Returns
None

## Get subscribed channel groups

Returns all subscribed channel groups as List<String>.

### Method(s)

```
`1public final ListString> getSubscribedChannelGroups()  
`
```

### Sample code

#### Get subscribed channel groups

```
1
  
```

### Response

List<String>

```
`1["channelGroup1", "channelGroup2"]  
`
```

## Get subscribed channels

Returns all subscribed channels as List<String>.

### Method(s)

```
`1public final ListString> getSubscribedChannels()  
`
```

### Sample code

#### Get subscribed channels

```
1
  
```

### Response

List<String>

```
`1["channel1", "channel2"]  
`
```

## Disconnect

Forces the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)

```
`1disconnect()  
`
```

This method doesn't take any arguments.

### Sample code

```
1
  
```

## Reconnect

Forces the SDK to try and reach out PubNub.

### Method(s)

```
`1reconnect(long timetoken)  
`
```

- timetoken
  - Type: long
  - Timetoken to reconnect from.

### Sample code

```
1
  
```

## Timetoken to date

Converts a PubNub timetoken (100-ns intervals since Jan 1, 1970) to an Instant.

### Method signature

```
`1Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```

#### Input
- timetoken
  - Type: long
  - PubNub timetoken to convert.

#### Output
- Instant — human-readable date representation of the timetoken.

### Sample code

Convert a timetoken value of 17276954606232118 to a human-readable date and time format.

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

## Date to timetoken

Converts an Instant to a PubNub timetoken (100-ns intervals since Jan 1, 1970).

### Method signature

```
`1long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```

#### Input
- instant
  - Type: Instant
  - Date/time to convert.

#### Output
- long — converted timetoken value.

### Sample code

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

## Unix timestamp to timetoken

Converts a Unix timestamp (seconds since Jan 1, 1970) to a PubNub timetoken.

### Method signature

This method takes the following parameters:

```
`1long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```

#### Input
- unixTime
  - Type: long
  - Unix timestamp to convert.

#### Output
- long — converted timetoken value.

### Sample code

Convert a Unix timestamp value of 1727866935316 representing 2024-10-02 11:02:15.316 to PubNub timetoken:

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

## Timetoken to Unix timestamp

Converts a PubNub timetoken to a Unix timestamp (seconds since Jan 1, 1970).

### Method signature

```
`1long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```

#### Input
- timetoken
  - Type: long
  - PubNub timetoken to convert.

#### Output
- long — converted Unix timestamp value.

### Sample code

Convert a PubNub timetoken 17276954606232118 representing 2024-09-30 11:24:20.623211800 to Unix time:

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