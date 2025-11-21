# Utility Methods API for Kotlin SDK

##### Breaking changes in v9.0.0

- Kotlin and Java SDKs unified, new PubNub client instantiation, updated async callbacks and status events.
- May impact apps built with versions < 9.0.0.
- See Java/Kotlin SDK migration guide for details.

##### Request execution

Most SDK methods return an Endpoint. You must call `.sync()` or `.async()` to execute.

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

Create a push payload for use in publish.

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

Parameters:
- apnsPayload: APNSPayload — Set APNS/APNS2 payload; delivered under pn_apns.
- fcmPayloadV2: FCMPayloadV2 — Set FCM V2 payload; delivered under pn_fcm.
- commonPayload: Map<String, Any> — Common payload for native subscribers; combined with pn_apns and pn_fcm.
- build(): Map<String, Any> — Build the final payload.

### Sample code

##### Reference code

#### Create push payload

```
1
  

```

### Response

PushPayloadHelper#build() returns Map<String, Any>, passable as the message to pubnub.publish().

## Destroy

Frees threads for a clean shutdown.

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

Stop all requests to PubNub when there are active subscribe channels.

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

Force the SDK to try to reach PubNub.

### Method(s)

```
`1reconnect(timeout: Long)  
`
```

Parameters:
- timeout: Long — Timetoken to reconnect from.

### Sample code

```
1
  

```

## Timetoken to date

Convert a PubNub timetoken (100-ns intervals since Jan 1, 1970) to Instant.

### Method signature

```
`1TimetokenUtil.timetokenToInstant(timetoken: Long): Instant  
`
```

Input:
- timetoken: Long — PubNub timetoken.

Output:
- Instant — Human-readable date.

### Sample code

Convert 17276954606232118 to a human-readable date/time.

```
1
  

```

## Date to timetoken

Convert Instant to PubNub timetoken.

### Method signature

```
`1TimetokenUtil.instantToTimetoken(instant: Instant): Long  
`
```

Input:
- instant: Instant — Date/time to convert.

Output:
- Long — Timetoken.

### Sample code

Convert September 30, 2024 12:12:24 GMT to a timetoken.

```
1
  

```

## Unix timestamp to timetoken

Convert Unix timestamp (seconds since Jan 1, 1970) to PubNub timetoken.

### Method signature

```
`1TimetokenUtil.unixToTimetoken(unixTime: Long): Long   
`
```

Input:
- unixTime: Long — Unix timestamp.

Output:
- Long — Timetoken.

### Sample code

Convert Unix timestamp 1727866935316 (2024-10-02 11:02:15.316) to PubNub timetoken:

```
1
  

```

## Timetoken to Unix timestamp

Convert PubNub timetoken to Unix timestamp.

### Method signature

```
`1TimetokenUtil.timetokenToUnix(timetoken: Long): Long   
`
```

Input:
- timetoken: Long — PubNub timetoken.

Output:
- Long — Unix timestamp.

### Sample code

Convert timetoken 17276954606232118 (2024-09-30 11:24:20.623211800) to Unix time:

```
1
**
```
Last updated on Oct 15, 2025**