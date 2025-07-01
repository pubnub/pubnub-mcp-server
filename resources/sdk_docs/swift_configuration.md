# PubNub Swift SDK – Configuration (Condensed)

## PubNubConfiguration initializer

```
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
  cipherKey: Crypto? = nil,
  uuid: String? = nil
)
```
*(show all 20 lines)*

### Parameter summary (defaults shown above)

* **publishKey** `String?` – Key for publishing.
* **subscribeKey** `String` – Key for subscribing (required).
* **userId** `String` – Unique identifier (required; UTF-8 ≤ 92 chars).
* **cryptoModule** `CryptoModule?` – Pluggable encryption/decryption module.  
  `cipherKey` (deprecated) can still be supplied but prefer `cryptoModule`.
* **authKey / authToken** `String?` – Access Manager credentials.
* **useSecureConnections** `Bool` – HTTPS when `true`.
* **origin** `String` – REST domain.
* **useInstanceId / useRequestId** `Bool` – Include identifiers in requests.
* **automaticRetry** `AutomaticRetry?` – Custom reconnection rules (see below).
* **durationUntilTimeout / heartbeatInterval** – Presence timeout/heartbeat.  
  `durationUntilTimeout` minimum 20 s.  
  `heartbeatInterval` 0 = no explicit heartbeat.
* **supressLeaveEvents** `Bool` – Skip leave calls when `true`.
* **requestMessageCountThreshold** `UInt` – Payload size guard (default 100).
* **filterExpression** `String?` – PSV2 subscribe filter.
* **enableEventEngine / maintainPresenceState** `Bool` – Opt-in event engine and automatic state re-send.
* **cipherKey** `Crypto?` – Deprecated; pass via `cryptoModule`.
* **uuid** `String?` – Deprecated; use `userId`.

---

## cryptoModule

Encryption options (messages and files):

* Legacy 128-bit cipher (default if only `cipherKey` is set).
* Recommended 256-bit AES-CBC (set via `cryptoModule`).

Older SDKs (< 6.1.0) cannot decrypt 256-bit data.

```
  
```

```
  
```

---

## automaticRetry

```
struct AutomaticRetry {
  var retryLimit: UInt               // Max attempts
  var policy: ReconnectionPolicy     // .linear(delay) or .exponential(min,max)
  var retryableHTTPStatusCodes: Set<Int>
  var retryableURLErrorCode: Set<URLError.Code>
  var excluded: [AutomaticRetry.Endpoint]
}
```

Default: `.exponential` for subscribe.

---

## RequestConfiguration (per-request overrides)

* **customSession** `SessionReplaceable?`
* **customConfiguration** `RouterConfiguration?`
* **responseQueue** `DispatchQueue`

`SessionReplaceable` exposes `sessionID`, `session`, `sessionQueue`, `defaultRequestOperator`, `sessionStream`.

`RouterConfiguration` mirrors main configuration fields (publishKey, subscribeKey, userId, etc.).

---

## Basic initialization example

```
  
```

---

## Read-only client example

```
  
```

---

## Mutating configuration after creation

All `PubNubConfiguration` properties are mutable until attached to a `PubNub` instance.

```
  
```

### Updating filter expression without new instance

```
**
```

_Last updated: Jun 12 2025_