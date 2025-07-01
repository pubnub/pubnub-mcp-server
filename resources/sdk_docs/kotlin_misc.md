# Utility Methods – Kotlin SDK (Misc)

> PubNub Kotlin SDK 9.x shares code with the Java SDK. Instantiation, async APIs, and status events changed in 9.0.0. See the Java/Kotlin migration guide for details.

Most SDK calls return an `Endpoint`; execute them with `.sync()` or `.async()` or they will **not** run.

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

## Create Push Payload

```
`val pushPayloadHelper = PushPayloadHelper()  
  
val fcmPayload = FCMPayload()  
val apnsPayload = APNSPayload()  
  
pushPayloadHelper.fcmPayload = fcmPayload  
pushPayloadHelper.apnsPayload = apnsPayload  
`
```

Parameters  
• **apnsPayload** `APNSPayload` – content placed under `pn_apns`.  
• **fcmPayload** `FCMPayload` – content placed under `pn_gcm`.  
• **commonPayload** `Map<String, Any>` – data delivered to PubNub subscribers along with the platform-specific payloads.

Return  
• **build()** → `Map<String, Any>` – pass directly to `pubnub.publish()`.

Example

```
`  
`
```

---

## Encrypt

```
`pubnub.encrypt(  
    inputString: String,  
    cipherKey: String  
)  
`
```

Parameters  
• **inputString** `String` – data to encrypt.  
• **cipherKey** `String` (deprecated) – overrides `cryptoModule` and forces legacy 128-bit encryption.

Return → encrypted `String`.

Example

```
`  
`
```

---

## Encrypt File Input Stream

```
`pubnub.encryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

Parameters  
• **inputStream** `InputStream` – content to encrypt.  
• **cipherKey** `String` (deprecated) – same behavior as above.

Return → encrypted `InputStream`.

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

Parameters  
• **inputString** `String` – data to decrypt.  
• **cipherKey** `String` (deprecated).

Return → decrypted `String`.

```
`  
`
```

---

## Decrypt File Input Stream

```
`pubnub.decryptInputStream(inputStream: InputStream, cipherKey: String)  
`
```

Parameters  
• **inputStream** `InputStream` – encrypted content.  
• **cipherKey** `String` (deprecated).

Return → decrypted `InputStream`.

```
`  
`
```

---

## Destroy

```
`destroy()  
`
```

Releases SDK resources.

```
`  
`
```

---

## Get Subscribed Channel Groups

```
`fun getSubscribedChannelGroups(): ListString>  
`
```

Returns `List<String>` of channel groups.

```
`  
`
```

Response

```
`["channel1", "channel2"]  
`
```

---

## Get Subscribed Channels

```
`fun getSubscribedChannels(): ListString>  
`
```

Returns `List<String>` of channels.

```
`  
`
```

Response

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

Forcefully stop or restart all network activity.

```
`  
`
```

---

## Timetoken ↔ Date / Unix Helpers

### Timetoken → `Instant`

```
`TimetokenUtil.timetokenToInstant(timetoken: Long): Instant  
`
```

### `Instant` → Timetoken

```
`TimetokenUtil.instantToTimetoken(instant: Instant): Long  
`
```

### Unix Time → Timetoken

```
`TimetokenUtil.unixToTimetoken(unixTime: Long): Long   
`
```

### Timetoken → Unix Time

```
`TimetokenUtil.timetokenToUnix(timetoken: Long): Long   
`
```

Examples

```
`  
`
```

---

*Last updated: Jun 30 2025*