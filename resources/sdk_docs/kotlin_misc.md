# Utility Methods API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new PubNub client instantiation model, and changes asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

##### Request execution
Most method invocations return an Endpoint. You must call .sync() or .async() to execute the request.

```
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}
```

## Create push payload

Create a push payload for use in publish or push-related endpoints.

### Method(s)

```
val pushPayloadHelper = PushPayloadHelper()

val fcmPayloadV2 = FCMPayloadV2()
val apnsPayload = APNSPayload()

pushPayloadHelper.fcmPayloadV2 = fcmPayloadV2
pushPayloadHelper.apnsPayload = apnsPayload
```

- apnsPayload
  - Type: APNSPayload
  - Sets APNS/APNS2 payload (available under pn_apns).
- fcmPayloadV2
  - Type: FCMPayloadV2
  - Sets FCM V2 payload (available under pn_fcm).
- commonPayload
  - Type: Map<String, Any>
  - Sets common payload delivered to native PubNub subscribers along with pn_apns and pn_fcm.
- build()
  - Returns: Map<String, Any>
  - Builds the combined payload.

### Sample code

```

```

### Response
PushPayloadHelper.build() returns a Map<String, Any> that can be passed as the message to pubnub.publish().

## Destroy

Frees resources/threads for a clean exit.

### Method(s)

```
destroy()
```

### Sample code

```

```

### Returns
None

## Get subscribed channels groups

Returns all subscribed channel groups.

### Method(s)

```
fun getSubscribedChannelGroups(): List<String>
```

### Sample code

```

```

### Response

```
["channel1", "channel2"]
```

## Get subscribed channels

Returns all subscribed channels.

### Method(s)

```
fun getSubscribedChannels(): List<String>
```

### Sample code

```

```

### Response

```
["channel1", "channel2"]
```

## Disconnect

Stops all requests to PubNub when there are active subscribe channels.

### Method(s)

```
disconnect()
```

This method takes no arguments.

### Sample code

```

```

## Reconnect

Forces the SDK to attempt reconnection.

### Method(s)

```
reconnect(timeout: Long)
```

- timeout
  - Type: Long
  - Timetoken to reconnect from.

### Sample code

```

```

## Timetoken to date

Convert a PubNub timetoken (100-ns intervals since Jan 1, 1970) to a human-readable Instant.

### Method signature

```
TimetokenUtil.timetokenToInstant(timetoken: Long): Instant
```

- Input
  - timetoken: Long — PubNub timetoken to convert.
- Output
  - Instant — date/time representation.

### Sample code
Convert 17276954606232118 to a date/time:

```

```

## Date to timetoken

Convert an Instant into a PubNub timetoken.

### Method signature

```
TimetokenUtil.instantToTimetoken(instant: Instant): Long
```

- Input
  - instant: Instant — date/time to convert.
- Output
  - Long — timetoken.

### Sample code
Convert September 30, 2024 12:12:24 GMT to a timetoken:

```

```

## Unix timestamp to timetoken

Convert a Unix timestamp (milliseconds since Jan 1, 1970) to a PubNub timetoken.

### Method signature

```
TimetokenUtil.unixToTimetoken(unixTime: Long): Long
```

- Input
  - unixTime: Long — Unix timestamp to convert.
- Output
  - Long — timetoken.

### Sample code
Convert 1727866935316 (2024-10-02 11:02:15.316) to a timetoken:

```

```

## Timetoken to Unix timestamp

Convert a PubNub timetoken to a Unix timestamp (milliseconds since Jan 1, 1970).

### Method signature

```
TimetokenUtil.timetokenToUnix(timetoken: Long): Long
```

- Input
  - timetoken: Long — PubNub timetoken to convert.
- Output
  - Long — Unix timestamp.

### Sample code
Convert timetoken 17276954606232118 (2024-09-30 11:24:20.623211800) to Unix time:

```

```

Last updated on Oct 15, 2025