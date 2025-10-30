# Utility Methods API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin SDK v9.0.0 unifies Java/Kotlin codebases, changes client instantiation, async callbacks, and emitted status events.
- May impact apps built with versions < 9.0.0.
- See Java/Kotlin SDK migration guide and status events docs.

##### Request execution
Most SDK methods return an Endpoint object. You must call .sync() or .async() to execute.

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

Build a push payload for use with publish.

### Method(s)

```
val pushPayloadHelper = PushPayloadHelper()

val fcmPayloadV2 = FCMPayloadV2()
val apnsPayload = APNSPayload()

pushPayloadHelper.fcmPayloadV2 = fcmPayloadV2
pushPayloadHelper.apnsPayload = apnsPayload
```

Parameters:
- apnsPayload (APNSPayload): Set APNS/APNS2 payload (under pn_apns).
- fcmPayloadV2 (FCMPayloadV2): Set FCM V2 payload (under pn_fcm).
- commonPayload (Map<String, Any>): Set fields delivered to native PubNub subscribers along with pn_apns and pn_fcm.
- build(): Map<String, Any> — builds payload from set values.

### Sample code

```

```

### Response
PushPayloadHelper.build() returns Map<String, Any> suitable for the message parameter of pubnub.publish().

## Destroy

Frees threads for a clean exit.

### Method(s)

```
fun destroy()
```

### Sample code

```

```

### Returns
None.

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
fun disconnect()
```

This method takes no arguments.

### Sample code

```

```

## Reconnect

Forces the SDK to try to reach PubNub.

### Method(s)

```
fun reconnect(timeout: Long)
```

Parameters:
- timeout (Long): Timetoken to reconnect from.

### Sample code

```

```

## Timetoken to date

Convert a PubNub timetoken (100-ns intervals since 1970-01-01) to Instant.

### Method signature

```
fun TimetokenUtil.timetokenToInstant(timetoken: Long): Instant
```

Input:
- timetoken (Long): PubNub timetoken.

Output:
- Instant: Date/time representation.

### Sample code

```

```

## Date to timetoken

Convert Instant to a PubNub timetoken.

### Method signature

```
fun TimetokenUtil.instantToTimetoken(instant: Instant): Long
```

Input:
- instant (Instant): Date/time to convert.

Output:
- Long: Timetoken.

### Sample code

```

```

## Unix timestamp to timetoken

Convert a Unix timestamp (seconds since 1970-01-01) to a PubNub timetoken.

### Method signature

```
fun TimetokenUtil.unixToTimetoken(unixTime: Long): Long
```

Input:
- unixTime (Long): Unix timestamp.

Output:
- Long: Timetoken.

### Sample code

```

```

## Timetoken to Unix timestamp

Convert a PubNub timetoken to a Unix timestamp (seconds since 1970-01-01).

### Method signature

```
fun TimetokenUtil.timetokenToUnix(timetoken: Long): Long
```

Input:
- timetoken (Long): PubNub timetoken.

Output:
- Long: Unix timestamp.

### Sample code

```

```