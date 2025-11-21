# Utility Methods API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new PubNub client instantiation, and changes async callbacks and emitted status events. These changes affect apps built with versions < 9.0.0. See Java/Kotlin SDK migration guide for details.

The methods below are utility helpers.

## Create push payload
Create a push payload for use in endpoint calls.

### Method(s)
```
1PushPayloadHelper helper = new PushPayloadHelper();  
2    helper.setApnsPayload(PushPayloadHelper.APNSPayload());  
3    helper.setFcmPayloadV2(PushPayloadHelper.FCMPayloadV2());  
4    helper.setCommonPayload(HashMapString, Object>());  
5
  
6MapString, Object> payload = helper.build();  
```

Parameters:
- helper.setApnsPayload()
  - Type: APNSPayload
  - Sets APNs/APNs2 payload; delivered under pn_apns.
- helper.setFcmPayloadV2()
  - Type: FCMPayloadV2
  - Sets FCM V2 payload; delivered under pn_fcm.
- helper.setCommonPayload()
  - Type: Map<String, Object>
  - Sets common payload; delivered to native PubNub subscribers together with pn_apns and pn_fcm.
- helper.build()
  - Type: Map<String, Object>
  - Builds the payload from the values set.

### Sample code

##### Reference code
```
1
  
```

#### Create push payload
```
1
  
```

### Response
PushPayloadHelper#build() returns a Map<String, Object> that can be passed as the message() parameter to pubnub.publish().

## Destroy
Frees up threads and allows clean exit.

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
Stops all requests to PubNub when there are active subscribe channels.

### Method(s)
```
`1disconnect()  
`
```
No arguments.

### Sample code
```
1
  
```

## Reconnect
Forces the SDK to try to reach PubNub.

### Method(s)
```
`1reconnect(long timetoken)  
`
```

Parameters:
- timetoken
  - Type: long
  - Timetoken to reconnect from.

### Sample code
```
1
  
```

## Timetoken to date
Convert a PubNub timetoken (100-ns intervals since 1970-01-01) to Instant.

### Method signature
```
`1Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```

Input:
- timetoken
  - Type: long
  - PubNub timetoken to convert.

Output:
- Instant — human-readable date-time.

### Sample code
Convert 17276954606232118 to date/time.
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
Convert an Instant to a PubNub timetoken.

### Method signature
```
`1long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```

Input:
- instant
  - Type: Instant
  - Date/time to convert.

Output:
- long — converted timetoken.

### Sample code
Convert September 30, 2024 12:12:24 GMT to timetoken.
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
Convert a Unix timestamp (seconds since 1970-01-01) to a PubNub timetoken.

### Method signature
```
`1long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```

Input:
- unixTime
  - Type: long
  - Unix timestamp to convert.

Output:
- long — converted timetoken.

### Sample code
Convert Unix timestamp 1727866935316 (2024-10-02 11:02:15.316) to timetoken:
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
Convert a PubNub timetoken to a Unix timestamp (seconds since 1970-01-01).

### Method signature
```
`1long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```

Input:
- timetoken
  - Type: long
  - Timetoken to convert.

Output:
- long — converted Unix timestamp.

### Sample code
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