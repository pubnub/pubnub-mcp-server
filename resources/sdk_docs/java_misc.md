# Utility Methods – PubNub Java SDK (v9+)

#### Breaking changes since v9.0  
Version 9 merges Java & Kotlin codebases, reworks client instantiation, callbacks, and status events. See the Java/Kotlin migration guide for details.

---

## Create Push Payload
Build a single payload map for `publish()`.

### Method
```
`PushPayloadHelper helper = new PushPayloadHelper();  
    helper.setApnsPayload(PushPayloadHelper.APNSPayload());  
    helper.setFcmPayloadV2(PushPayloadHelper.FCMPayloadV2());  
    helper.setCommonPayload(HashMapString, Object>());  
  
MapString, Object> payload = helper.build();  
`
```

Parameters  
* `setApnsPayload(APNSPayload)` – adds `pn_apns`.  
* `setFcmPayloadV2(FCMPayloadV2)` – adds `pn_gcm`.  
* `setCommonPayload(Map<String,Object>)` – data for PubNub subscribers.  
* `build()` → `Map<String,Object>`.

#### Example
```
`  
`
```

`helper.build()` produces the map passed to `pubnub.publish()`.

---

## destroy()
Free SDK threads for a clean exit.

```
`destroy()  
`
```

```
`  
`
```

---

## Encryption / Decryption  
Prefer the configurable [crypto module]. Passing `cipherKey` falls back to legacy 128-bit crypto (deprecated).

### Encrypt
```
`pubnub.encrypt(data, customCipherKey)  
`
```
* `data : String` – plain text.  
* `customCipherKey : String (optional)` – overrides crypto module.

```
`  
`
```

### Encrypt InputStream
```
`pubnub.encryptInputStream(inputStream, cipherKey)  
`
```
* `inputStream : InputStream` – data to encrypt.  
* `cipherKey : String (optional)`.

```
`  
`
```
Returns encrypted `InputStream`.

### Decrypt
```
`pubnub.decrypt(data, customCipherKey)  
`
```
* `data : String` – cipher text.  
* `customCipherKey : String (optional)`.

```
`  
`
```

### Decrypt InputStream
```
`pubnub.decryptInputStream(inputStream, cipherKey)  
`
```
* `inputStream : InputStream` – encrypted data stream.  
* `cipherKey : String (optional)`.

```
`  
`
```
Returns decrypted `InputStream`.

---

## Subscribed Resources

### Channel Groups
```
`public final ListString> getSubscribedChannelGroups()  
`
```
```
`  
`
```
Response
```
`["channelGroup1", "channelGroup2"]  
`
```

### Channels
```
`public final ListString> getSubscribedChannels()  
`
```
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

## Connection Control
Stop all traffic:
```
`disconnect()  
`
```
```
`  
`
```
Resume traffic:
```
`reconnect()  
`
```
```
`  
`
```

---

## Timetoken ↔ Time Conversion (`TimetokenUtil`)

### Timetoken → `Instant`
```
`Instant TimetokenUtil.timetokenToInstant(long timetoken)  
`
```
```
`  
`
```
```
`PubNub timetoken: 17276954606232118  
Current date: 2024-09-30  
Current time: 11:24:20.623211800  
`
```

### `Instant` → Timetoken
```
`long TimetokenUtil.instantToTimetoken(Instant instant)  
`
```
```
`  
`
```
```
`Current date: 2024-09-30  
Current time: 12:12:44.123456789  
PubNub timetoken: 17276983641234567  
`
```

### Unix timestamp → Timetoken
```
`long TimetokenUtil.unixToTimetoken(long unixTime)  
`
```
```
`  
`
```
```
`PubNub timetoken: 17278669353160000  
Current date: 2024-10-02  
Current time: 11:02:15.316  
`
```

### Timetoken → Unix timestamp
```
`long TimetokenUtil.timetokenToUnix(long timetoken)  
`
```
```
`  
`
```
```
`Current date: 2024-09-30**Current time: 11:24:20.623  
PubNub timetoken: 17276954606232118  
`
```

_Last updated: Jun 30, 2025_