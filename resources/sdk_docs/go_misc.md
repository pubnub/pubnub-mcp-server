On this page
# Utility Methods API for Go SDK

The methods on this page are utility methods that don't fit into other categories.

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

The `key` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods)

```
`utils.EncryptString(cipherKey, string, useRandomInitializationVector)  
`
```

*  requiredParameterDescription`cipherKey` *Type: stringCipher key to use for decryption. If no key is provided, Cipher key provided in `PNConfiguration` will be considered.`string` *Type: stringThe data to encrypt`useRandomInitializationVector` *Type: booleanWhen true the initialization vector (IV) is random for all requests (not just for file upload). When false the IV is hard-coded for all requests except for file upload.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

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

## Encrypt File[​](#encrypt-file)

This function allows to `encrypt` the file content/data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-1)

To `encrypt` the file you can use the following method(s) in Go SDK.

```
`utils.EncryptFile(cipherKey, iv, filePart, file)  
`
```

*  requiredParameterDescription`cipherKey` *Type: StringCipher key to use for encryption. If no key is provided, Cipher key provided in `PNConfiguration` will be considered.   
   
 This parameter is ignored.`iv`Type: stringInitalization Vector if using a hardcoded one (not recommended). Should be passed as `[]byte{}` when not used.`filePart` *Type: `io.Writer`Writer to write the encrypted contents.`file` *Type: os.FileReader to read the `file`.

### Basic Usage[​](#basic-usage-1)

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

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

```
`utils.DecryptString(cipherKey, encrypted, useRandomInitializationVector)  
`
```

*  requiredParameterDescription`cipherKey` *Type: stringCipher key to use for decryption. If no key is provided, Cipher key provided in `PNConfiguration` will be considered.`encrypted` *Type: stringThe data to decrypt`useRandomInitializationVector` *Type: booleanWhen set to `true`, the initialization vector (IV) is random for all requests, not just for file upload. When set to `false`, the IV is hard-coded for all requests except for file upload.

### Basic Usage[​](#basic-usage-2)

```
`config := pubnub.NewConfig("someUserId")  
config.CipherKey = "cipherKey"  
pn := pubnub.NewPubNub(config)  
r, _ := utils.DecryptString(pn.config.CipherKey, encrypted, true)  
  
module, err := crypto.NewAesCbcCryptoModule("enigma", false)  
    module.DecryptString("enigma", []byte{})  
`
```

## Decrypt File[​](#decrypt-file)

This function allows to `decrypt` the file content/data.

##### Deprecated

The `key` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

To `decrypt` the file you can use the following method(s) in Go SDK.

```
`utils.DecryptFile(cipherKey, contentLenEnc, reader, w)  
`
```

*  requiredParameterDescription`cipherKey` *Type: StringCipher key to use for decryption. If no key is provided, Cipher key provided in `PNConfiguration` will be considered.   
   
 This parameter is ignored.`contentLenEnc`Type: int64The total length of the `file`.`reader` *Type: `io.Reader`Reader to read the encrypted contents.`w` *Type: `io.WriteCloser`Writer to write the decrypted contents.

### Basic Usage[​](#basic-usage-3)

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

## Time[​](#time)

This function will return a 17 digit precision Unix epoch.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example of creating a timetoken for a specific time and date:

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method(s)[​](#methods-4)

To fetch `Time` you can use the following method(s) in Go SDK:

```
`pn.Time().  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-4)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

```
`res, status, err := pn.Time().Execute()  
  
fmt.Println(res, status, err)  
`
```

### Response[​](#response)

MethodDescription`Timetoken`Type: int64Returns a `date` representation of current timetoken.

## Create Push Payload[​](#create-push-payload)

This method creates the push payload for use in the appropriate endpoint calls.

### Method(s)[​](#methods-5)

```
`CreatePushPayload().  
    SetAPNSPayload(pubnub.PNAPNSData,[]pubnub.PNAPNS2Data).  
    SetCommonPayload(map[string]interface{}).  
    SetFCMPayload(pubnub.PNFCMData).  
    BuildPayload()  
`
```

*  requiredParameterDescription`SetAPNSPayload`Type: pubnub.PNAPNSDataSet APNS Payload. Associated APNS devices will receive only the data within the `pn_apns` key.`SetAPNSPayload`Type: []pubnub.PNAPNS2DataSet APNS2 Payload. Associated APNS devices will receive only the data within the `pn_push` key.`SetFCMPayload`Type: pubnub.PNFCMDataSet FCM Payload. Associated FCM devices will receive only the data within the `pn_gcm` key.`SetCommonPayload`Type: map[string]interfaceSet Common Payload. Native PubNub subscribers will receive the entire object literal, including the `pn_apns`, `pn_gcm`, and `common payload`.`BuildPayload` *Type: Builds the payload from the values set using the parameters. Returns a `map[string]interface{}`

### Basic Usage[​](#basic-usage-5)

#### Create Push Payload[​](#create-push-payload-1)

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

### Response[​](#response-1)

The `CreatePushPayload()` operation returns a `map[string]interface{}` which can be passed directly to the `Publish` Method's `Message` parameter.
Last updated on **Jun 30, 2025**