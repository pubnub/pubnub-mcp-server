# Utility Methods – Go SDK (Misc)

The following utility functions are available in the PubNub Go SDK.  
All code blocks, method signatures, parameters, and essential details are preserved. Redundant prose has been removed.

---

## Encrypt

Encrypt arbitrary data.

> Deprecated: `cipherKey` is deprecated. Use a dedicated crypto module instance instead.  
> Passing `cipherKey` forces legacy 128-bit encryption and overrides module settings.

### Method

```go
utils.EncryptString(cipherKey, string, useRandomInitializationVector)
```

Parameter | Type | Description
-----------|------|------------
cipherKey | string | Cipher key. If empty, `PNConfiguration.CipherKey` is used.
string | string | Data to encrypt.
useRandomInitializationVector | bool | `true` = random IV (recommended); `false` = fixed IV (except for file upload).

### Sample

```go
package main

import (
	"fmt"
	"log"

	"github.com/pubnub/go/v7/crypto"
)

func main() {
	// Initialize the Crypto Module with a cipher key
	module, err := crypto.NewAesCbcCryptoModule("enigma", false)
	if err != nil {
		log.Fatalf("Error initializing crypto module: %v", err)
	}
	// ...
}
```
show all 28 lines

---

## Encrypt file

Encrypt file contents.

> Deprecated: `cipherKey` is deprecated. Use a crypto module.  
> If provided, it forces legacy 128-bit encryption.

### Method

```go
utils.EncryptFile(cipherKey, iv, filePart, file)
```

Parameter | Type | Description
-----------|------|------------
cipherKey | string | Cipher key (ignored when crypto module is used).
iv | []byte | Fixed IV (not recommended). Pass `[]byte{}` to disable.
filePart | io.Writer | Destination for encrypted data.
file | *os.File | Source file.

### Sample

```go
out, _ := os.Create("cat_picture.jpg")
file, err := os.Open(filepathInput)
if err != nil {
    panic(err)
}

module, err := crypto.NewAesCbcCryptoModule("enigma", false)
module.EncryptFile("enigma", []byte{}, out, file)
```

---

## Decrypt

Decrypt arbitrary data.

> Deprecated: `cipherKey` is deprecated. Use a crypto module.  
> Passing `cipherKey` forces legacy 128-bit decryption.

### Method

```go
utils.DecryptString(cipherKey, encrypted, useRandomInitializationVector)
```

Parameter | Type | Description
-----------|------|------------
cipherKey | string | Cipher key. Falls back to `PNConfiguration.CipherKey`.
encrypted | string | Data to decrypt.
useRandomInitializationVector | bool | `true` = random IV; `false` = fixed IV.

### Sample

```go
config := pubnub.NewConfig("someUserId")
config.CipherKey = "cipherKey"
pn := pubnub.NewPubNub(config)
r, _ := utils.DecryptString(pn.Config.CipherKey, encrypted, true)

module, err := crypto.NewAesCbcCryptoModule("enigma", false)
module.DecryptString("enigma", []byte{})
```

---

## Decrypt file

Decrypt file contents.

> Deprecated: `cipherKey` is deprecated. Use a crypto module.  
> If provided, it forces legacy 128-bit decryption.

### Method

```go
utils.DecryptFile(cipherKey, contentLenEnc, reader, w)
```

Parameter | Type | Description
-----------|------|------------
cipherKey | string | Cipher key (ignored when crypto module is used).
contentLenEnc | int64 | Encrypted file length.
reader | io.Reader | Source (encrypted content).
w | io.WriteCloser | Destination (decrypted data).

### Sample

```go
outDec, _ := os.Open("cat_picture.jpg")
fi, _ := outDec.Stat()
contentLenEnc := fi.Size()
defer outDec.Close()

fileDec, _ := os.Create(filepathOutputDec)
defer fileDec.Close()
r, w := io.Pipe()

module, err := crypto.NewAesCbcCryptoModule("enigma", false)
module.EncryptFile("enigma", []byte{}, out, file) // encryption example
```

---

## Time

Returns a 17-digit Unix epoch timetoken.

Algorithm:  
```text
timetoken = (Unix epoch seconds) * 10000000
```

Example:  
```text
08/19/2013 21:20 UTC = 1376961606
timetoken = 1376961606 * 10000000 = 13769616060000000
```

### Method

```go
pn.Time().
    QueryParam(queryParam).
    Execute()
```

Parameter | Type | Description
-----------|------|------------
QueryParam | map[string]string | Optional query-string parameters.

### Sample

```go
res, status, err := pn.Time().Execute()
fmt.Println(res, status, err)
```

Response field | Type | Description
---------------|------|------------
Timetoken | int64 | Current timetoken.

---

## Create push payload

Build a platform-specific push payload map usable with publish endpoints.

### Method chain

```go
CreatePushPayload().
    SetAPNSPayload(pubnub.PNAPNSData, []pubnub.PNAPNS2Data).
    SetCommonPayload(map[string]interface{}).
    SetFCMPayload(pubnub.PNFCMData).
    BuildPayload()
```

Call | Type | Purpose
-----|------|--------
SetAPNSPayload | pubnub.PNAPNSData | Data inside `pn_apns`.
SetAPNSPayload | []pubnub.PNAPNS2Data | Data inside `pn_push` (APNS2).
SetFCMPayload | pubnub.PNFCMData | Data inside `pn_gcm`.
SetCommonPayload | map[string]interface{} | Data delivered to all subscribers.
BuildPayload | returns `map[string]interface{}` | Final payload.

### Sample

```go
aps := pubnub.PNAPSData{
    Alert: "apns alert",
    Badge: 1,
    Sound: "ding",
    Custom: map[string]interface{}{
        "aps_key1": "aps_value1",
        "aps_key2": "aps_value2",
    },
}

apns := pubnub.PNAPNSData{
    APS: aps,
    Custom: map[string]interface{}{
        "apns_key1": "apns_value1",
        "apns_key2": "apns_value2",
```  
show all 82 lines

Response: `BuildPayload()` returns `map[string]interface{}` suitable for `Publish`’s `Message` parameter.

---

_Last updated: Jul 15 2025_