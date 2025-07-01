# Utility Methods API – Unity SDK (condensed)

The sections below list every utility method, its exact signature, parameters, and a minimal working example.  
All original code blocks are preserved.  
  
---

## Cleanup<a name="cleanup"></a>

Frees PubNub threads for a clean exit.

### Method

```csharp
Pubnub.CleanUp()
```

### Example

```csharp
using PubnubApi;
using PubnubApi.Unity;
using UnityEngine;

public class PubnubCleanupExample : MonoBehaviour {
    [SerializeField] private PNManagerBehaviour pubnubManager;

    private void OnApplicationQuit() {
        var pubnub = pubnubManager.pubnub;

        Debug.Log("Cleaning up PubNub resources...");
        pubnub.CleanUp();
    }
}
```

---

## Encrypt<a name="encrypt"></a>

Encrypt data.

**Deprecated**: Passing `cipherKey` triggers legacy 128-bit encryption; prefer a configured CryptoModule.

### Method

```csharp
pubnub.Encrypt(inputString, cipherKey)
```

* `inputString` (string) – data to encrypt  
* `cipherKey` (string) – optional; overrides CryptoModule

### Example

```csharp
string stringToEncrypt = "hello world";

var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");

crypto.Encrypt(stringToEncrypt);
```

---

## Encrypt File<a name="encrypt-file"></a>

Encrypt file contents.

**Deprecated**: Same cipherKey notice as above.

### Methods

```csharp
pubnub.EncryptFile(sourceFile, destinationFile, cipherKey)
byte[] outputBytes = pubnub.EncryptFile(sourceBytes)
byte[] outputBytes = pubnub.EncryptFile(sourceBytes, cipherKey)
```

* `sourceFile` (string) – file to encrypt  
* `destinationFile` (string) – output path  
* `sourceBytes` (byte[]) – file bytes  
* `cipherKey` (string) – optional; see note above

### Examples

```csharp
string source_file = "cat_picture.jpg";
string destination_file = "destination_cat_pic.jpg";
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");

crypto.EncryptFile(source_file, destination_file);
```

```csharp
byte[] sourceBytes = System.IO.File.ReadAllBytes("cat_picture.jpg");
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");

byte[] outputBytes = crypto.EncryptFile(sourceBytes);
System.IO.File.WriteAllBytes("destination_cat_pic.jpg", outputBytes);
```

---

## Decrypt<a name="decrypt"></a>

Decrypt data (same deprecation note).

### Method

```csharp
pubnub.Decrypt(inputString, cipherKey)
```

* `inputString` (string) – encrypted data  
* `cipherKey` (string) – key used to decrypt

### Example

```csharp
string encryptedString = "9qR0Q4TuDUwiLTcxtIY3mA==";
string cipherKey = "testCipher";

string decryptedMessage = pubnub.Decrypt(encryptedString, cipherKey);
```

---

## Decrypt File<a name="decrypt-file"></a>

Decrypt file contents (same deprecation note).

### Methods

```csharp
pubnub.DecryptFile(sourceFile, destinationFile, cipherKey);
byte[] outputBytes = pubnub.DecryptFile(sourceBytes)
byte[] outputBytes = pubnub.DecryptFile(sourceBytes, cipherKey)
```

* `sourceFile`/`sourceBytes` – encrypted file  
* `destinationFile` – output path  
* `cipherKey` – optional

### Examples

```csharp
string source_file = "encrypted_cat_pic.jpg";
string destination_file = "cat_pic_original.jpg";
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");

crypto.DecryptFile(source_file, destination_file);
```

```csharp
byte[] sourceBytes = System.IO.File.ReadAllBytes("encrypted_cat_pic.jpg");
var crypto = PubnubApi.Security.Crypto.CryptoModule.CreateAesCbcCryptor("test");

byte[] outputBytes = crypto.DecryptFile(sourceBytes);
System.IO.File.WriteAllBytes("cat_pic_original.jpg", outputBytes);
```

---

## Disconnect<a name="disconnect"></a>

Force-stop all requests to PubNub.

### Method

```csharp
Disconnect<T>()
```

### Example

```csharp
pubnub.Disconnect<string>();
```

---

## Get Subscribed Channel Groups<a name="get-subscribed-channel-groups"></a>

### Method

```csharp
List<string> GetSubscribedChannelGroups()
```

### Example & Response

```csharp
List<string> groups = pubnub.GetSubscribedChannelGroups();
```

```json
["channelGroup1", "channelGroup2"]
```

---

## Get Subscribed Channels<a name="get-subscribed-channels"></a>

### Method

```csharp
List<string> GetSubscribedChannels()
```

### Example & Response

```csharp
List<string> channels = pubnub.GetSubscribedChannels();
```

```json
["channel1", "channel2"]
```

---

## Reconnect<a name="reconnect"></a>

Retry communication with PubNub.

### Method

```csharp
Reconnect<T>(bool resetSubscribeToken)
```

* `resetSubscribeToken` (bool) – `true` sends 0 timetoken

### Example

```csharp
pubnub.Reconnect<string>(resetSubscribeToken: true);
```

---

## Time<a name="time"></a>

Returns a 17-digit Unix epoch timetoken.

Formula:  
```text
timetoken = (Unix epoch seconds) * 10000000
```

### Method

```csharp
pubnub.QueryParam(Dictionary<string,object>).Time()
```

### Example

```csharp
pubnub.Time()
    .Execute(new PNTimeResultExt(
        (result, status) => {
            // handle time result
        }
    ));
```

### Return

`PNTimeResult.Timetoken` (long)

---

## Create Push Payload<a name="create-push-payload"></a>

Build a push payload object for publish.

### Builder

```csharp
CreatePushPayloadHelper()
    .SetAPNSPayload(PNAPSData, List<PNAPNS2Data>)
    .SetFCMPayload(PNFCMData)
    .SetCommonPayload(Dictionary<string, object>)
    .BuildPayload()
```

* `SetAPNSPayload` – APNS / APNS2 sections  
* `SetFCMPayload` – FCM section  
* `SetCommonPayload` – data for native PubNub subscribers  
* `BuildPayload` – returns `Dictionary<string, object>`

### Example

```csharp
CreatePushPayloadHelper cpph = new CreatePushPayloadHelper();
PNAPSData aps = new PNAPSData();
aps.Alert = "alert";
aps.Badge = 1;
aps.Sound = "ding";
aps.Custom = new Dictionary<string, object>(){
    {"aps_key1", "aps_value1"},
    {"aps_key2", "aps_value2"},
};

PNAPNSData apns = new PNAPNSData();
apns.APS = aps;
apns.Custom = new Dictionary<string, object>(){
    {"apns_key1", "apns_value1"},
    {"apns_key2", "apns_value2"},
};
// ... (remaining 84 lines preserved in original documentation)
```

### Response

Returns `Dictionary<string, object>` usable as the `Message` parameter of `Publish()`.

---

_Last updated: Jun 30, 2025_