# Utility Methods API (Go SDK – Misc)

## Encrypt

Deprecated: `cipherKey` is deprecated. Prefer a dedicated crypto module (overrides revert to legacy 128-bit encryption).

### Method
```
`utils.EncryptString(cipherKey, string, useRandomInitializationVector)  
`
```
Parameters  
• cipherKey (string) – encryption key or PNConfiguration’s `CipherKey` if empty  
• string (string) – data to encrypt  
• useRandomInitializationVector (bool) – true = random IV, false = hard-coded (except file upload)

### Example
```
`package main  
  
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
`
```
show all 28 lines  

---

## Encrypt File

Deprecated: same as above.

### Method
```
`utils.EncryptFile(cipherKey, iv, filePart, file)  
`
```
Parameters  
• cipherKey (string) – ignored when crypto module configured  
• iv ([]byte) – custom IV (pass `[]byte{}` when unused)  
• filePart (io.Writer) – destination for encrypted data  
• file (os.File) – source file reader

### Example
```
`out, _ := os.Create("cat_picture.jpg")  
file, err := os.Open(filepathInput)  
if err != nil {  
    panic(err)  
}  
  
module, err := crypto.NewAesCbcCryptoModule("enigma", false)  
    module.EncryptFile("enigma", []byte{}, out, file)  
`
```

---

## Decrypt

Deprecated: `cipherKey` is deprecated; use crypto module.

### Method
```
`utils.DecryptString(cipherKey, encrypted, useRandomInitializationVector)  
`
```
Parameters  
• cipherKey (string) – decryption key  
• encrypted (string) – data to decrypt  
• useRandomInitializationVector (bool) – matches Encrypt

### Example
```
`config := pubnub.NewConfig("someUserId")  
config.CipherKey = "cipherKey"  
pn := pubnub.NewPubNub(config)  
r, _ := utils.DecryptString(pn.config.CipherKey, encrypted, true)  
  
module, err := crypto.NewAesCbcCryptoModule("enigma", false)  
    module.DecryptString("enigma", []byte{})  
`
```

---

## Decrypt File

Deprecated: `cipherKey` is deprecated; use crypto module.

### Method
```
`utils.DecryptFile(cipherKey, contentLenEnc, reader, w)  
`
```
Parameters  
• cipherKey (string) – ignored when crypto module configured  
• contentLenEnc (int64) – total encrypted length  
• reader (io.Reader) – source encrypted data  
• w (io.WriteCloser) – destination for decrypted data

### Example
```
`outDec, _ := os.Open("cat_picture.jpg")  
fi, _ := outDec.Stat()  
contentLenEnc := fi.Size()  
defer outDec.Close()  
  
fileDec, _ := os.Create(filepathOutputDec)  
defer fileDec.Close()  
r, w := io.Pipe()  
  
module, err := crypto.NewAesCbcCryptoModule("enigma", false)  
    module.EncryptFile("enigma", []byte{}, out, file)  
`
```

---

## Time

Returns a 17-digit Unix epoch “timetoken”.

Algorithm
```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```
Example
```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method
```
`pn.Time().  
    QueryParam(queryParam).  
    Execute()  
`
```
Parameter: `QueryParam` (map[string]string) – URL query parameters.

### Example
```
`res, status, err := pn.Time().Execute()  
  
fmt.Println(res, status, err)  
`
```
Response: `Timetoken` (int64)

---

## Create Push Payload

Builds payloads for APNS, APNS2, FCM, and PubNub native subscribers.

### Builder
```
`CreatePushPayload().  
    SetAPNSPayload(pubnub.PNAPNSData,[]pubnub.PNAPNS2Data).  
    SetCommonPayload(map[string]interface{}).  
    SetFCMPayload(pubnub.PNFCMData).  
    BuildPayload()  
`
```
• SetAPNSPayload(pubnub.PNAPNSData) – APNS payload  
• SetAPNSPayload([]pubnub.PNAPNS2Data) – APNS2 payload  
• SetFCMPayload(pubnub.PNFCMData) – FCM payload  
• SetCommonPayload(map[string]interface{}) – common/native  
• BuildPayload() – returns `map[string]interface{}`

### Example
```
`aps := pubnub.PNAPSData{  
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
`
```
show all 82 lines  

Response: `map[string]interface{}` (pass directly to `Publish`’s `Message` parameter)

---

_Last updated: **Jun 30, 2025**_