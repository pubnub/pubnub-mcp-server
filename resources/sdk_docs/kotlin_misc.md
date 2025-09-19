# Utility Methods – PubNub Kotlin SDK

> SDK v 9 unifies Java/Kotlin codebases, changes client instantiation, async callbacks, and status events. See the Java/Kotlin migration guide before upgrading from \< 9.0.0.

## Request execution

Most SDK calls return an `Endpoint`. Invoke **either** `.sync()` or `.async()`—otherwise nothing is executed.

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

---

## Create push payload

Build a payload for `publish()`.

```
`val pushPayloadHelper = PushPayloadHelper()  
  
val fcmPayload = FCMPayload()  
val apnsPayload = APNSPayload()  
  
pushPayloadHelper.fcmPayload = fcmPayload  
pushPayloadHelper.apnsPayload = apnsPayload  
`
```

Parameters  

* `apnsPayload` `APNSPayload` – data placed under `pn_apns`.  
* `fcmPayload` `FCMPayload` – data placed under `pn_gcm`.  
* `commonPayload` `Map<String, Any>` – data delivered to native PubNub subscribers.  
* `build()` → `Map<String, Any>` – final payload (pass directly to `publish()`).

Sample:

```
`  
`
```

Return: `Map<String, Any>`.

---

## Encrypt

```
`pubnub.encrypt(  
    inputString: String,  
    cipherKey: String  
)  
`
```

* `inputString` `String` – data to encrypt.  
* `cipherKey` `String` **(deprecated)** – overrides `cryptoModule`, uses legacy 128-bit key.

Returns encrypted `String`.

Sample:

```
`  
`
```

---

## Encrypt file input stream

```
`pubnub.encryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

* `inputStream` `InputStream` – content to encrypt.  
* `cipherKey` `String` **(deprecated)** – see Encrypt section.

Returns encrypted `InputStream`.

Sample:

```
`  
`
```

---

## Decrypt

```
`pubnub.decrypt(  
    inputString: String,  
    cipherKey: String  
)  
`
```

* `inputString` `String` – data to decrypt.  
* `cipherKey` `String` **(deprecated)**.

Returns decrypted `String`.

Sample:

```
`  
`
```

---

## Decrypt file input stream

```
`pubnub.decryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

* `inputStream` `InputStream` – encrypted content.  
* `cipherKey` `String` **(deprecated)**.

Returns decrypted `InputStream`.

Sample:

```
`  
`
```

---

## Destroy

Stops SDK threads.

```
`destroy()  
`
```

Sample:

```
`  
`
```

---

## Get subscribed channel groups

```
`fun getSubscribedChannelGroups(): ListString>  
`
```

Returns `List<String>` of channel groups.

Sample:

```
`  
`
```

Example response:

```
`["channel1", "channel2"]  
`
```

---

## Get subscribed channels

```
`fun getSubscribedChannels(): ListString>  
`
```

Returns `List<String>` of channels.

Sample:

```
`  
`
```

Example response:

```
`["channel1", "channel2"]  
`
```

---

## Disconnect / Reconnect

```
`disconnect()  
`
```

```
`reconnect()  
`
```

Stop or resume all PubNub network activity.

Samples:

```
`  
`
```

```
`  
`
```

---

## Timetoken / date / Unix conversions (`TimetokenUtil`)

### Timetoken ➔ `Instant`

```
`TimetokenUtil.timetokenToInstant(timetoken: Long): Instant  
`
```

* `timetoken` `Long` → returns `Instant`.

Sample:

```
`  
`
```

### `Instant` ➔ Timetoken

```
`TimetokenUtil.instantToTimetoken(instant: Instant): Long  
`
```

* `instant` `Instant` → returns `Long`.

Sample:

```
`  
`
```

### Unix ➔ Timetoken

```
`TimetokenUtil.unixToTimetoken(unixTime: Long): Long   
`
```

* `unixTime` `Long` → returns `Long`.

Sample:

```
`  
`
```

### Timetoken ➔ Unix

```
`TimetokenUtil.timetokenToUnix(timetoken: Long): Long   
`
```

* `timetoken` `Long` → returns `Long`.

Sample:

```
`**`
```

---

_Last updated Jul 15 2025_