# Configuration API for Unity SDK (condensed)

## Build platform configuration

### Mobile (Android/iOS)
Unity’s code stripping may remove PubNub assemblies; see Troubleshooting.

### WebGL
1. Create **PubNub Config Asset** → enable **Enable Web GL Build Mode**  
   (sets `UnityWebGLHttpClientService` automatically).  
2. Manual init (no `PnManagerBehaviour`):

```
`var pubnub = new Pubnub(pnConfig, httpTransportService: new UnityWebGLHttpClientService(),  
				ipnsdkSource: new UnityPNSDKSource());  
`
```

3. Use `UnityWebGLHttpClientService` only in WebGL builds; set **Managed Stripping Level** → `Minimal`.
4. If `Secure=false`, in **Player → WebGL Settings** set **Allow downloads over HTTP → Always allowed**.
5. Install WebGL Threading Patcher (Package Manager, Git URL).

---

## Configuration

`PNConfiguration` stores all client settings.

### Create in code

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
`
```

### Important fields
* SubscribeKey (string) – required for subscribe  
* PublishKey (string) – required for publish  
* SecretKey (string) – server-side access ops  
* UserId (UserId) – REQUIRED, UTF-8 ≤92 chars  
* LogLevel (PubnubLogLevel)  
* AuthKey (string)  
* Secure (bool) – SSL  
* SubscribeTimeout / NonSubscribeRequestTimeout (int sec)  
* FilterExpression (string)  
* HeartbeatNotificationOption (PNHeartbeatNotificationOption: FAILURES | ALL | NONE)  
* Origin (string)  
* ReconnectionPolicy (PNReconnectionPolicy: NONE | LINEAR | EXPONENTIAL), ConnectionMaxRetries (int)  
* PresenceTimeout / PresenceInterval (int sec)  
* Proxy (Proxy)  
* EnableTelemetry (bool, default true)  
* RequestMessageCountThreshold (number)  
* SuppressLeaveEvents (bool)  
* DedupOnSubscribe (bool) – uses MaximumMessagesCacheSize (int, default 100)  
* FileMessagePublishRetryLimit (int, default 5)  
* EnableEventEngine (bool, default true)  
* CryptoModule (see below)  
* Deprecated: PubnubLog, LogVerbosity, CipherKey, UseRandomInitializationVector, Uuid  
  – keep for backward compatibility.

### Disabling random IV  
Only for compatibility with SDK < 5.0.0.

---

### CryptoModule

```
`// 256-bit AES-CBC (recommended)  
pnConfiguration.CryptoModule = new CryptoModule(new AesCbcCryptor("enigma"),  
    new ListICryptor> { new LegacyCryptor("enigma") });  
  
// 128-bit legacy encryption  
pnConfiguration.CryptoModule = new CryptoModule(new LegacyCryptor("enigma"),  
    new ListICryptor> { new AesCbCCryptor("enigma") });  
`
```

SDK < 7.0.1 can’t decrypt AES-CBC.

---

## Initialization

Add namespaces

```
`using PubnubApi;  
using PubnubApi.Unity;  
`
```

Create client

```
`new PubNub(pnConfiguration);  
`
```

### Examples

Secure client

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.Secure = true;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

Non-secure client

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.Secure = false;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

Read-only client

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.SubscribeKey = "my_subkey";  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

With `SecretKey` (server-side)

```
`PNConfiguration pnConfiguration = new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.PublishKey = "my_pubkey";  
pnConfiguration.SubscribeKey = "my_subkey";  
pnConfiguration.SecretKey = "my_secretkey";  
pnConfiguration.Secure = true;  
Pubnub pubnub = new Pubnub(pnConfiguration);  
`
```

---

## Event Listeners
PubNub client, `Subscription`, and `SubscriptionsSet` provide real-time updates (see Publish & Subscribe doc).

---

## UserId

Set

```
`pubnub.ChangeUserId(UserId newUserid)  
`
```

Get

```
`var currentUserId = pubnub.GetCurrentUserId();  
`
```

---

## Filter Expression

Property

```
`FilterExpression  
`
```

Set

```
`PNConfiguration pnConfiguration = new PNConfiguration new PNConfiguration(new UserId("myUniqueUserId"));  
pnConfiguration.FilterExpression = "such=wow";  
`
```

Get

```
`var sampleFilterExp = pnConfiguration.FilterExpression;**`
```

---

## Reference snippet

```
`using PubnubApi;  
using UnityEngine;  
  
public class PubnubConfigurationExample : MonoBehaviour {  
    // Serialized fields to allow configuration within Unity Editor  
    //Note that you can always use the PnConfigAsset Scriptable Object for setting these values in editor  
    [SerializeField] private string userId = "myUniqueUserId";  
    [SerializeField] private string subscribeKey = "demo"; // Replace with your actual SubscribeKey  
    [SerializeField] private string publishKey = "demo"; // Replace with your actual PublishKey if publishing is needed  
    [SerializeField] private string secretKey = "yourSecretKey"; // Used if Access Manager operations are needed  
    [SerializeField] private string authKey = "authKey"; // Used if Access Manager is enabled  
    [SerializeField] private string filterExpression = "such=wow";  
    [SerializeField] private bool useSSL = true;  
    [SerializeField] private bool logToUnityConsole = true;  
  
`
```
show all 44 lines