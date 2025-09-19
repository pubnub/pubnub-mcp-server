# Configuration API – PubNub C# SDK  

This condensed version keeps every code block, method signature, parameter, and other critical technical details from the full documentation.

---

## Request execution

We recommend wrapping SDK calls in `try / catch`.  
```csharp
try  
{  
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}
```

---

## PNConfiguration

Holds all runtime options that affect PubNub client behavior.

### Creation  
```
`  
`
```

### Properties

* **SubscribeKey** *(string, required)* – Admin Portal value.  
* **PublishKey** *(string)* – required for publishing.  
* **SecretKey** *(string)* – required for PAM.  
* **UserId** *(UserId, required)* – unique UTF-8 id (≤92 chars).  
* **LogLevel** *(PubnubLogLevel)* – Trace | Debug | Info | Warn | Error | None (default).  
* **AuthKey** *(string)* – PAM auth token.  
* **Secure** *(bool)* – enable TLS.  
* **SubscribeTimeout** *(int sec)* – subscribe loop timeout.  
* **NonSubscribeRequestTimeout** *(int sec)* – all other requests timeout.  
* **FilterExpression** *(string)* – server-side stream filter.  
* **HeartbeatNotificationOption** *(PNHeartbeatNotificationOption)* – ALL | FAILURES | NONE.  
* **Origin** *(string)* – custom domain.  
* **ReconnectionPolicy** *(PNReconnectionPolicy)* – NONE | LINEAR | EXPONENTIAL (default).  
* **ConnectionMaxRetries** *(int)* – maximum reconnect attempts.  
* **PresenceTimeout** *(int sec)* – server presence TTL.  
* **SetPresenceTimeoutWithCustomInterval** *(int sec)* – heartbeat interval.  
* **Proxy** *(Proxy)* – HTTP proxy settings.  
* **RequestMessageCountThreshold** *(int)* – raises `PNRequestMessageCountExceededCategory`.  
* **SuppressLeaveEvents** *(bool)* – omit leave events.  
* **DedupOnSubscribe** *(bool)* – de-duplicate subscribe payloads.  
* **MaximumMessagesCacheSize** *(int)* – size for de-duplication cache (default 100).  
* **FileMessagePublishRetryLimit** *(int)* – publish-file retry attempts (default 5).  
* **CryptoModule** – see CryptoModule section.  
* **EnableEventEngine** *(bool, default true)* – use new subscribe/presence engine.  
* **MaintainPresenceState** *(bool)* – resend custom presence state (Event Engine only).  
* **RetryConfiguration** – `RetryConfiguration.Linear(...)` or `RetryConfiguration.Exponential(...)`.  
* **Deprecated**: `LogVerbosity`, `PubnubLog`, `CipherKey`, `UseRandomInitializationVector`, `Uuid`.

---

### CryptoModule

Two built-in options:  
* `LegacyCryptor(CipherKey)` – 128-bit legacy.  
* `AesCbcCryptor(CipherKey)` – 256-bit AES-CBC (recommended).

If **CryptoModule** isn’t explicitly set but `CipherKey`/`UseRandomInitializationVector` are, legacy encryption is used.

Configuration methods:  
```
`  
`
```

Older SDK (< 6.18.0) cannot decrypt AES-CBC traffic.

---

## Initialization

### Include  
```
`  
`
```

### Method  
```
`  
`
```
*Parameter*: **pnConfiguration** – see PNConfiguration above.  
Returns: `PubNub` client instance (used for `Publish()`, `Subscribe()`, etc.).

### Examples  
(Place-holder blocks preserved)  
```
`  
`
```
```
`  
`
```
```
`  
`
```
```
`  
`
```
```
`  
`
```

---

## UserId

Setter/getter:  
```
`  
`
```  
```
`pubnub.GetCurrentUserId();  
`
```

Examples:  
```
`  
`
```
```
`  
`
```

---

## Authentication key

Property:  
```
`pnConfiguration.AuthKey  
`
```  

Examples:  
```
`  
`
```
```
`  
`
```
Returns current AuthKey.

---

## Filter expression

Property:  
```
`FilterExpression  
`
```  
```
`pnConfiguration.FilterExpression;  
`
```

Examples:  
```
`  
`
```
```
`**`
```