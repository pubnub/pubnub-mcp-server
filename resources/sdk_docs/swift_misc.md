# Utility Methods API – Swift Native SDK (Misc)

Below are concise references for utility calls. All code blocks, signatures, parameters, and essential details from the source are retained.

---

## Encrypt <a id="encrypt"></a>

Availability: See [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method
```swift
`func encrypt(data: Data)  
`
```
• **data** (Data, required) – Message to encrypt.

### Returns
• **Success:** Encrypted `Data`.  
• **Failure:** `Error`.

### Example
```swift
`  
`
```

---

## Decrypt <a id="decrypt"></a>

Availability: See [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method
```swift
`func decrypt(data: Data) -> ResultData, Error>  
`
```
• **data** (Data, required) – Data to decrypt.

### Returns
• **Success:** Original `Data`.  
• **Failure:** `Error`.

### Example
```swift
`  
`
```

---

## Disconnect <a id="disconnect"></a>

Stops all active subscriptions.

### Method
```swift
`func disconnect( )  
`
```

### Example
```swift
`  
`
```

---

## Reconnect <a id="reconnect"></a>

Forces the SDK to reach PubNub again.

### Method
```swift
`func reconnect(at timetoken: Timetoken? = nil)  
`
```
• **at** (Timetoken, optional) – Timetoken at which to resume subscription.

### Example
```swift
`  
`
```

---

## Time <a id="time"></a>

Returns a 17-digit precision Unix epoch timetoken.

### Timetoken Algorithm
```swift
`timetoken = (Unix epoch time in seconds) * 1_000_000_000  
`
```

Example:
```swift
`// 08/19/2013 @ 9:20 PM UTC = 1376961606  
timetoken = 1376961606 * 1_000_000_000  
timetoken = 1376961606000000000  
`
```

### Method
```swift
`func time(  
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
  completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```
• **custom** (PubNub.RequestConfiguration, optional) – Per-request config (default `PubNub.RequestConfiguration()`).  
• **completion** (`((Result<Timetoken, Error>) -> Void)?`, optional) – Result callback.

#### Completion Result
• **Success:** Current `Timetoken`.  
• **Failure:** `Error`.

### Example
```swift
`**`
```

---

_Last updated: Jun 12, 2025_