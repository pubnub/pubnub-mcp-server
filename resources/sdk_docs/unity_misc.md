# Utility Methods API (Unity SDK)

All methods are static or instance calls on `Pubnub` unless otherwise noted. Code blocks, signatures, and responses are unchanged from the source for accuracy.  

---

## Cleanup <a name="cleanup"></a>

Frees SDK threads for a clean exit.

### Method(s)
```
`Pubnub.CleanUp()  
`
```

### Sample code
```
`  
`
```

---

## Encrypt <a name="encrypt"></a>

Encrypt arbitrary data.  
**Deprecated:** Passing `cipherKey` overrides `CryptoModule` and uses legacy 128-bit encryption.

### Method(s)
```
`pubnub.Encrypt(inputString, cipherKey)  
`
```

* `inputString` (String) – Data to encrypt.  
* `cipherKey`  (String) – Cipher key (deprecated).

### Sample code
```
`  
`
```

---

## Encrypt file <a name="encrypt-file"></a>

Encrypt file content.  
**Deprecated:** Same `cipherKey` note as above.

### Method(s)
```
`pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)  
`
```
* `sourceFile` (String) – File to encrypt.  
* `destinationFile` (String) – Output path.  
* `cipherKey` (String) – Optional cipher key.

Byte-array overload:
```
`byte[] outputBytes = pubnub.EncryptFile(sourceBytes) byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)  
`
```
* `sourceBytes` (byte[]) – File bytes.  
* `cipherKey` (String) – Optional cipher key.

### Sample code
```
`  
`
```
```
`  
`
```

---

## Decrypt <a name="decrypt"></a>

Decrypt arbitrary data.  
**Deprecated:** Same `cipherKey` note as above.

### Method(s)
```
`pubnub.Decrypt(inputString, cipherKey)  
`
```
* `inputString` (String) – Data to decrypt.  
* `cipherKey`  (String) – Cipher key.

### Sample code
```
`  
`
```

---

## Decrypt file <a name="decrypt-file"></a>

Decrypt file content.  
**Deprecated:** Same `cipherKey` note as above.

### Method(s)
```
`pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);  
`
```
* `sourceFile` (String) – File to decrypt.  
* `destinationFile` (String) – Output path.  
* `cipherKey` (String) – Optional cipher key.

Byte-array overload:
```
`byte[] outputBytes = pubnub.DecryptFile(sourceBytes) byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)  
`
```
* `sourceBytes` (byte[]) – File bytes.  
* `cipherKey`  (String) – Optional cipher key.

### Sample code
```
`  
`
```
```
`  
`
```

---

## Disconnect <a name="disconnect"></a>

Force-stop all active subscribe requests.

### Method(s)
```
`DisconnectT>()  
`
```

### Sample code
```
`  
`
```

---

## Get subscribed channel groups <a name="get-subscribed-channel-groups"></a>

Returns a list of channel groups currently subscribed.

### Method(s)
```
`Liststring> GetSubscribedChannelGroups()  
`
```

### Sample code
```
`  
`
```

### Response
`List<String>`
```
`["channelGroup1", "channelGroup2"]  
`
```

---

## Get subscribed channels <a name="get-subscribed-channels"></a>

Returns a list of channels currently subscribed.

### Method(s)
```
`Liststring> GetSubscribedChannels()  
`
```

### Sample code
```
`  
`
```

### Response
`List<String>`
```
`["channel1", "channel2"]  
`
```

---

## Reconnect <a name="reconnect"></a>

Attempts to re-establish PubNub connectivity.

### Method(s)
```
`ReconnectT>(bool resetSubscribeToken)  
`
```
* `resetSubscribeToken` (bool) – `true` sends a zero timetoken on reconnect.

### Sample code
```
`  
`
```

---

## Create push payload <a name="create-push-payload"></a>

Builds a multi-platform push payload.

### Method(s)
```
`CreatePushPayloadHelper()  
    .SetAPNSPayload(PNAPSData, ListPNAPNS2Data>)  
    .SetFCMPayload(PNFCMData)  
    .SetCommonPayload(Dictionarystring, object>)  
    .BuildPayload()  
`
```
* `SetAPNSPayload` (PNAPSData / List<PNAPNS2Data>) – APNS / APNS2 data.  
* `SetFCMPayload` (PNFCMData) – FCM data.  
* `SetCommonPayload` (Dictionary<string, object>) – Common payload.  
* `BuildPayload` – Returns `Dictionary<string, object>`.

### Sample code
```
`  
`
```

### Response
Returns a `Dictionary<string, object>` suitable for the `Publish` method’s `Message` parameter.