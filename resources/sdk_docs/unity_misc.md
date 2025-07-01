On this page
# Utility Methods API for Unity SDK

The methods on this page are utility methods that don't fit into other categories.

## Cleanup[​](#cleanup)

Cleanup frees up the threads and allows for clean exit.

### Method(s)[​](#methods)

```
`Pubnub.CleanUp()  
`
```

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class PubnubCleanupExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
      
    private void OnApplicationQuit() {  
        // Getting a reference to the Pubnub instance  
        var pubnub = pubnubManager.pubnub;  
          
        // Performing cleanup operations  
        Debug.Log("Cleaning up PubNub resources...");  
`
```
show all 19 lines

### Returns[​](#returns)

None

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/unity/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-1)

To `encrypt` the data you can use the following method(s) in Unity SDK.

```
`pubnub.Encrypt(inputString, cipherKey)  
`
```

*  requiredParameterDescription`inputString` *Type: StringThe `data` to `encrypt`.`cipherKey`Type: StringCipher key to use for encryption.

### Basic Usage[​](#basic-usage-1)

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`string stringToEncrypt = "hello world";  
  
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");  
  
crypto.Encrypt(stringToEncrypt);  
`
```

## Encrypt File[​](#encrypt-file)

This function allow to `encrypt` the file content/data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/unity/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-2)

To `encrypt` the file you can use the following method(s) in Unity SDK.

```
`pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)  
`
```

*  requiredParameterDescription`sourceFile` *Type: StringFile to be encrypted.`destinationFile` *Type: StringPath of the encrypted file to be saved.`cipherKey`Type: StringCipher Key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/unity/api-reference/configuration#cryptomodule).

```
`byte[] outputBytes = pubnub.EncryptFile(sourceBytes) byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)  
`
```

*  requiredParameterDescription`sourceBytes` *Type: byte[]byte array of the file.`cipherKey`Type: StringCipher Key to use for encryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/unity/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-2)

```
`string source_file = "cat_picture.jpg"; // checks bin folder if no path is provided  
string destination_file = "destination_cat_pic.jpg"; // checks bin folder if no path is provided  
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");  
  
crypto.EncryptFile(source_file, destination_file);  
`
```

```
`byte[] sourceBytes = System.IO.File.ReadAllBytes("cat_picture.jpg"); // checks bin folder if no path is provided  
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");  
  
byte[] outputBytes = crypto.EncryptFile(sourceBytes);  
System.IO.File.WriteAllBytes("destination_cat_pic.jpg", outputBytes); // checks bin folder if no path is provided  
`
```

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-3)

To `decrypt` the data you can use the following method(s) in Unity SDK.

```
`pubnub.Decrypt(inputString, cipherKey)  
`
```

*  requiredParameterDescription`inputString` *Type: StringThe `data` to `decrypt`.`cipherKey`Type: StringCipher key used for decryption.

### Basic Usage[​](#basic-usage-3)

#### Decrypt part of message[​](#decrypt-part-of-message)

```
`string encryptedString = "9qR0Q4TuDUwiLTcxtIY3mA==";  
string cipherKey = "testCipher";  
  
string decryptedMessage = pubnub.Decrypt(encryptedString, cipherKey);  
`
```

## Decrypt File[​](#decrypt-file)

This function allow to `decrypt` the file content/data.

##### Deprecated

The `cipherKey` parameter in this method is deprecated. We recommend that you configure a separate instance of the [crypto module](/docs/sdks/unity/api-reference/configuration#cryptomodule) and use it for partial encryption.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Method(s)[​](#methods-4)

To `decrypt` the file you can use the following method(s) in Unity SDK.

```
`pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);  
`
```

*  requiredParameterDescription`sourceFile` *Type: StringFile to be decrypted.`destinationFile` *Type: StringPath of the decrypted file to be saved.`cipherKey`Type: StringCipher Key to use for decryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/unity/api-reference/configuration#cryptomodule).

```
`byte[] outputBytes = pubnub.DecryptFile(sourceBytes) byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)  
`
```

*  requiredParameterDescription`sourceBytes` *Type: byte[]byte array of the file.`cipherKey`Type: StringCipher Key to use for decryption. If provided, the legacy encryption with 128-bit cipher key entropy is used. If not provided, the `CryptoModule` from PubNub config will be used.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/unity/api-reference/configuration#cryptomodule).

### Basic Usage[​](#basic-usage-4)

```
`string source_file = "encrypted_cat_pic.jpg"; // checks bin folder if no path is provided  
string destination_file = "cat_pic_original.jpg"; // checks bin folder if no path is provided  
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");  
  
crypto.DecryptFile(source_file, destination_file);  
`
```

```
`byte[] sourceBytes = System.IO.File.ReadAllBytes("encrypted_cat_pic.jpg"); // checks bin folder if no path is provided  
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");  
  
byte[] outputBytes = crypto.DecryptFile(sourceBytes);  
System.IO.File.WriteAllBytes("cat_pic_original.jpg", outputBytes); // checks bin folder if no path is provided  
`
```

## Disconnect[​](#disconnect)

Call the `Disconnect` method to force the SDK to stop all requests to PubNub server when there are active subscribe channels.

### Method(s)[​](#methods-5)

To `disconnect` the data transmission you can use the following method(s) in Unity SDK.

```
`DisconnectT>()  
`
```

This method doesn't take any arguments.

### Basic Usage[​](#basic-usage-5)

```
`pubnub.Disconnectstring>();  
`
```

## Get Subscribed Channel Groups[ ​](#get-subscribed-channel-groups)

Returns all the subscribed channel groups in a `List of type String`.

### Method(s)[​](#methods-6)

To `Get Subscribe Channel Groups` you can use the following method(s) in the Unity SDK:

```
`Liststring> GetSubscribedChannelGroups()  
`
```

### Basic Usage[​](#basic-usage-6)

#### Get Subscribed Channel Groups[​](#get-subscribed-channel-groups-1)

```
`Liststring> groups = pubnub.GetSubscribedChannelGroups();  
`
```

### Response[​](#response)

`List<String>`

```
`["channelGroup1", "channelGroup2"]  
`
```

## Get Subscribed Channels[​](#get-subscribed-channels)

Returns all the subscribed channels in a `List of type String`.

### Method(s)[​](#methods-7)

To `Get Subscribed Channels` you can use the following method(s) in the Unity SDK:

```
`Liststring> GetSubscribedChannels()  
`
```

### Basic Usage[​](#basic-usage-7)

#### Get Subscribed Channels[​](#get-subscribed-channels-1)

```
`Liststring> channels = pubnub.GetSubscribedChannels();  
`
```

### Response[​](#response-1)

`List<String>`

```
`["channel1", "channel2"]  
`
```

## Reconnect[​](#reconnect)

Call the `reconnect` method to force the SDK to try and reach out PubNub.

### Method(s)[​](#methods-8)

To `reconnect` the data you can use the following method(s) in Unity SDK.

```
`ReconnectT>(bool resetSubscribeToken)  
`
```

*  requiredParameterDescription`resetSubscribeToken`Type: boolPassing `true` will send zero timetoken upon reconnect.

### Basic Usage[​](#basic-usage-8)

```
`pubnub.Reconnectstring>();  
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

### Method(s)[​](#methods-9)

To fetch `Time` you can use the following method(s) in Unity SDK:

```
`pubnub.QueryParam(Dictionarystring,object>).Time()  
`
```

*  requiredParameterDescription`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNTimeResult`.`Execute` *Type: `System.Action``System.Action` of type `PNTimeResult`.`ExecuteAsync`Type: None

### Basic Usage[​](#basic-usage-9)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

```
`pubnub.Time()  
    .Execute(new PNTimeResultExt(  
        (result, status) => {  
            // handle time result.  
        }  
    ));  
`
```

### Returns[​](#returns-1)

The `Time` operation returns a `PNTimeResult` which contains the following property:

Property NameTypeDescription`Timetoken`longReturns a `long` representation of current timetoken.

## Create Push Payload[​](#create-push-payload)

This method creates the push payload for use in the appropriate endpoint calls.

### Method(s)[​](#methods-10)

```
`CreatePushPayloadHelper()  
    .SetAPNSPayload(PNAPSData, ListPNAPNS2Data>)  
    .SetFCMPayload(PNFCMData)  
    .SetCommonPayload(Dictionarystring, object>)  
    .BuildPayload()  
`
```

*  requiredParameterDescription`SetAPNSPayload`Type: PNAPSDataSet APNS Payload. Associated APNS devices will receive only the data within the `pn_apns` key.Type: `List<PNAPNS2Data>`Set APNS2 Payload. Associated APNS devices will receive only the data within the `pn_push` key.`SetFCMPayload`Type: PNFCMDataSet FCM Payload. Associated FCM devices will receive only the data within the `pn_gcm` key.`SetCommonPayload`Type: `Dictionary<string, object>`Set Common Payload. Native PubNub subscribers will receive the entire object literal, including the `pn_apns`, `pn_gcm`, and `common payload`.`BuildPayload` *Type: Builds the payload from the values set using the parameters. Returns a `Dictionary<string, object>`

### Basic Usage[​](#basic-usage-10)

#### Create Push Payload[​](#create-push-payload-1)

```
`CreatePushPayloadHelper cpph = new CreatePushPayloadHelper();  
PNAPSData aps = new PNAPSData();  
aps.Alert = "alert";  
aps.Badge = 1;  
aps.Sound = "ding";  
aps.Custom = new Dictionarystring, object>(){  
    {"aps_key1", "aps_value1"},  
    {"aps_key2", "aps_value2"},  
};  
  
PNAPNSData apns = new PNAPNSData();  
apns.APS = aps;  
apns.Custom = new Dictionarystring, object>(){  
    {"apns_key1", "apns_value1"},  
    {"apns_key2", "apns_value2"},  
`
```
show all 84 lines

### Response[​](#response-2)

The `CreatePushPayloadHelper()` operation returns a `Dictionary<string, object>` which can be passed directly to the `Publish` Method's `Message` parameter.
Last updated on **Jun 30, 2025**