# Configuration API – Swift SDK (condensed)

A `PubNubConfiguration` object controls every aspect of a `PubNub` client.  
Required:  

* `subscribeKey` – PubNub Subscribe Key  
* `userId` – unique UTF-8 ID (≤ 92 chars) for the user/device  

`publishKey` is optional (set `nil` for read-only clients).

---

## Initializer

```swift
PubNubConfiguration(
  publishKey: String?,
  subscribeKey: String,
  userId: String,
  cryptoModule: CryptoModule? = nil,
  authKey: String? = nil,
  authToken: String? = nil,
  useSecureConnections: Bool = true,
  origin: String = "ps.pndsn.com",
  useInstanceId: Bool = false,
  useRequestId: Bool = false,
  automaticRetry: AutomaticRetry? = .default,
  durationUntilTimeout: UInt = 300,
  heartbeatInterval: UInt = 0,
  supressLeaveEvents: Bool = false,
  requestMessageCountThreshold: UInt = 100,
  filterExpression: String? = nil,
  enableEventEngine: Bool = true,
  maintainPresenceState: Bool = true,
  cipherKey: Crypto? = nil,        // deprecated – use cryptoModule
  uuid: String? = nil              // deprecated – use userId
)
```

---

## Parameter summary

* `publishKey` (String?) – key used for publishing.  
* `subscribeKey` (String) – key used for subscribing.  
* `userId` (String) – REQUIRED unique identifier.  
* `cryptoModule` (CryptoModule?) – encryption/decryption provider (see below).  
* `authKey` / `authToken` (String?) – Access-Manager credentials.  
* `useSecureConnections` (Bool, default `true`) – HTTPS when `true`.  
* `origin` (String, default `"ps.pndsn.com"`) – custom domain if needed.  
* `useInstanceId` / `useRequestId` (Bool) – include IDs in requests.  
* `automaticRetry` (AutomaticRetry?) – reconnection settings.  
* `durationUntilTimeout` (UInt, default `300`) – presence timeout (min 20).  
* `heartbeatInterval` (UInt) – heartbeat frequency (`0` = disabled, min 3).  
* `supressLeaveEvents` (Bool) – skip leave requests when `true`.  
* `requestMessageCountThreshold` (UInt) – emit event after N messages.  
* `filterExpression` (String?) – PSV2 subscribe filter.  
* `enableEventEngine` / `maintainPresenceState` (Bool) – event-engine opts.  
* `cipherKey` (Crypto?) – DEPRECATED, use `cryptoModule`.  
* `uuid` (String) – DEPRECATED, use `userId`.

---

## cryptoModule

Provides message/file encryption.

* Legacy (128-bit) encryption is used automatically when only `cipherKey` is set.  
* To use the recommended 256-bit AES-CBC encryption explicitly pass a `cryptoModule`.  
* Clients prior to SDK 6.1.0 cannot decrypt AES-CBC data.

Configuration examples (place-holders preserved):

```
`  
`
```

```
`  
`
```

---

## automaticRetry

Automatic reconnection settings.

Parameter | Type | Notes
---|---|---
`retryLimit` | UInt | Max retry attempts
`policy` | ReconnectionPolicy | `.linear(delay)` or `.exponential(min,max)` (default for subscribe)
`retryableHTTPStatusCodes` | Set<Int> | HTTP codes that trigger retry
`retryableURLErrorCode` | Set<URLError.Code> | URL errors that trigger retry
`excluded` | [AutomaticRetry.Endpoint] | Endpoints that never retry

```
`  
`
```

---

## Per-request override – `PubNub.RequestConfiguration`

Field | Type | Purpose
---|---|---
`customSession` | SessionReplaceable? | Supply your own `URLSession`
`customConfiguration` | RouterConfiguration? | Endpoint-specific config
`responseQueue` | DispatchQueue | Queue for callbacks

`SessionReplaceable`, `RouterConfiguration`, and `DispatchQueue` follow the same signatures described in Apple/PubNub docs; only supply them when default behaviour is insufficient.

---

## Sample code

Full runnable example:

```
`  
`
```

### Read-only client

```
`  
`
```

---

## Mutating configuration

Once a `PubNubConfiguration` is assigned to a `PubNub` instance it becomes immutable; change values by creating a new client.

```
`  
`
```

### Updating the filter expression without a new client

```
`**`
```

_Last updated: Jul 16 2025_