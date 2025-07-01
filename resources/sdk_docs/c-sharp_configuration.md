# Configuration API – PubNub C# SDK (condensed)

##### Request execution  
Use `try / catch`. SDK throws an exception for invalid parameters; network or server errors are returned in `status`.

```csharp
try  
{  
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
    Console.WriteLine("Server status code : " + status.StatusCode);  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
```

---

## `PNConfiguration`

Configuration object controlling PubNub client behavior.

### Create configuration  

```
`  
`
```

### Properties  

(omit deprecated unless noted)

* **SubscribeKey** `string` (required) – key from Admin Portal.  
* **PublishKey** `string` – required if publishing.  
* **SecretKey** `string` – for Access-Manager operations.  
* **UserId** `UserId` (required) – unique per user/device (UTF-8, ≤92 chars).  
* **LogLevel** `PubnubLogLevel` – `Trace | Debug | Info | Warn | Error | None (default)`.  
* **AuthKey** `string` – sent with all restricted requests.  
* **Secure** `bool` – enable TLS.  
* **SubscribeTimeout** `int sec` – max subscribe loop time.  
* **NonSubscribeRequestTimeout** `int sec` – timeout for non-subscribe calls.  
* **FilterExpression** `string` – server-side message filtering.  
* **HeartbeatNotificationOption** `PNHeartbeatNotificationOption` – `FAILURES (default) | ALL | NONE`.  
* **Origin** `string` – custom origin.  
* **ReconnectionPolicy** `PNReconnectionPolicy` – `NONE | LINEAR | EXPONENTIAL (default)`.  
* **ConnectionMaxRetries** `int` – max reconnect attempts (0 = none).  
* **PresenceTimeout** `int sec` – client considered alive for this period.  
* **SetPresenceTimeoutWithCustomInterval** `int sec` – heartbeat interval (`≈PresenceTimeout/2-1`).  
* **Proxy** `Proxy` – HTTP proxy settings.  
* **RequestMessageCountThreshold** `int` – exceed → `PNRequestMessageCountExceededCategory`.  
* **SuppressLeaveEvents** `bool` – true = don't send leave.  
* **DedupOnSubscribe** `bool` – remove duplicate messages across regions.  
* **MaximumMessagesCacheSize** `int` (default 100) – cache for deduplication.  
* **FileMessagePublishRetryLimit** `int` (default 5).  
* **CryptoModule** `AesCbcCryptor(cipherKey)` or `LegacyCryptor(cipherKey)` – controls encryption.  
* **EnableEventEngine** `bool` (default true).  
* **MaintainPresenceState** `bool` – requires `EnableEventEngine=true`.  
* **RetryConfiguration** `RetryConfiguration.Linear(delay, max)` or `RetryConfiguration.Exponential(minDelay, maxDelay, max)` – used when Event Engine enabled.  
* **LogVerbosity** `PNLogVerbosity` – DEPRECATED, use `LogLevel`.  
* **PubnubLog** `IPubnubLog` – DEPRECATED, use `SetLogger`.  
* **CipherKey**, **UseRandomInitializationVector**, **Uuid** – DEPRECATED; replace with `CryptoModule` and `UserId`.

---

### `CryptoModule`

Two algorithms available:

1. **LegacyCryptor** – 128-bit (default if `CipherKey`/`UseRandomInitializationVector` set and no explicit module).  
2. **AesCbcCryptor** – recommended 256-bit AES-CBC (requires SDK ≥ 6.18.0).

SDK can decrypt data from either module; older SDKs (< 6.18.0) cannot decrypt AES-CBC.

Configure:

```
`  
`
```

---

## Runtime setters/getters

### `UserId`

Set at startup; can also be changed:

```
`  
`
```

Get current ID:

```
`pubnub.GetCurrentUserId();  
`
```

### `AuthKey`

```
`pnConfiguration.AuthKey  
`
```

Set:

```
`  
`
```

Get:

```
`  
`
```

### `FilterExpression`

```
`pnConfiguration.FilterExpression;  
`
```

Set:

```
`  
`
```

Get:

```
`**`
```

_Last updated Jun 30 2025_