# Utility Methods API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation model, and changes async callbacks and status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

##### Request execution
Most methods return an Endpoint. You must call `.sync()` or `.async()` to execute.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Create push payload
Create a push payload for use with publish endpoints.

### Method(s)
```
1val pushPayloadHelper = PushPayloadHelper()  
2
  
3val fcmPayloadV2 = FCMPayloadV2()  
4val apnsPayload = APNSPayload()  
5
  
6pushPayloadHelper.fcmPayloadV2 = fcmPayloadV2  
7pushPayloadHelper.apnsPayload = apnsPayload  
```

- apnsPayload — Type: APNSPayload. APNS/APNS2 payload set under pn_apns.
- fcmPayloadV2 — Type: FCMPayloadV2. FCM V2 payload set under pn_fcm.
- commonPayload — Type: Map<String, Any>. Common payload for native PubNub subscribers, merged with pn_apns and pn_fcm.
- build — Type: Map<String, Any>. Builds the payload from values set above.

### Sample code
##### Reference code
#### Create push payload
```
1
  
```

### Response
PushPayloadHelper#build() returns Map<String, Any>, which can be passed as the message argument to pubnub.publish().

## Destroy
Frees threads for a clean exit.

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

## Get subscribed channels groups
Returns all subscribed channel groups.

### Method(s)
```
`1fun getSubscribedChannelGroups(): ListString>  
`
```

### Sample code
```
1
  
```

### Response
```
`1["channel1", "channel2"]  
`
```

## Get subscribed channels
Returns all subscribed channels.

### Method(s)
```
`1fun getSubscribedChannels(): ListString>  
`
```

### Sample code
```
1
  
```

### Response
```
`1["channel1", "channel2"]  
`
```

## Disconnect
Stops all requests to PubNub when there are active subscriptions.

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
Forces the SDK to attempt reconnection.

### Method(s)
```
`1reconnect(timeout: Long)  
`
```
- timeout — Type: Long. Timetoken to reconnect from.

### Sample code
```
1
  
```

## Timetoken to date
Convert a PubNub timetoken (100-ns intervals since 1970-01-01) to Instant.

### Method signature
```
`1TimetokenUtil.timetokenToInstant(timetoken: Long): Instant  
`
```

#### Input
- timetoken — Type: Long.

#### Output
- Instant — Human-readable date representation.

### Sample code
Convert 17276954606232118 to Instant.
```
1
  
```

## Date to timetoken
Convert an Instant to a PubNub timetoken.

### Method signature
```
`1TimetokenUtil.instantToTimetoken(instant: Instant): Long  
`
```

#### Input
- instant — Type: Instant.

#### Output
- Long — Converted timetoken.

### Sample code
Convert September 30, 2024 12:12:24 GMT to a timetoken.
```
1
  
```

## Unix timestamp to timetoken
Convert a Unix timestamp (ms since 1970-01-01) to a PubNub timetoken.

### Method signature
```
`1TimetokenUtil.unixToTimetoken(unixTime: Long): Long   
`
```

#### Input
- unixTime — Type: Long.

#### Output
- Long — Converted timetoken.

### Sample code
Convert 1727866935316 (2024-10-02 11:02:15.316) to a timetoken:
```
1
  
```

## Timetoken to Unix timestamp
Convert a PubNub timetoken to a Unix timestamp.

### Method signature
```
`1TimetokenUtil.timetokenToUnix(timetoken: Long): Long   
`
```

#### Input
- timetoken — Type: Long.

#### Output
- Long — Converted Unix timestamp.

### Sample code
Convert 17276954606232118 (2024-09-30 11:24:20.623211800) to Unix time:
```
1
**
```

Last updated on Oct 15, 2025**