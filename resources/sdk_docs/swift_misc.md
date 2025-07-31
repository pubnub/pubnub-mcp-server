# Utility Methods API — Swift SDK (Misc)

Essential signatures, parameters, return types, and sample snippets are retained below. All code blocks appear unmodified.

## Encrypt <a name="encrypt"></a>

For Crypto module setup see: `/configuration#cryptomodule`.

### Method(s)
```
`func encrypt(data: Data)  
`
```
* **data** (Data) – message to encrypt.

### Returns
* Success – encrypted `Data`.  
* Failure – `Error`.

### Sample
#### Encrypt part of message
```
`  
`
```

---

## Decrypt <a name="decrypt"></a>

Refer to Crypto module configuration as above.

### Method(s)
```
`func decrypt(data: Data) -> ResultData, Error>  
`
```
* **data** (Data) – data to decrypt.

### Returns
* Success – original `Data`.  
* Failure – `Error`.

### Sample
#### Decrypt part of message
```
`  
`
```

---

## Disconnect <a name="disconnect"></a>

Stops active subscriptions.

### Method(s)
```
`func disconnect( )  
`
```

### Sample
```
`  
`
```

---

## Reconnect <a name="reconnect"></a>

Forces the SDK to re-establish connection.

### Method(s)
```
`func reconnect(at timetoken: Timetoken? = nil)  
`
```
* **at** (Timetoken, optional) – timetoken at which to resume.

### Sample
```
`  
`
```

---

## Time <a name="time"></a>

Returns 17-digit Unix epoch timetoken.  
Formula:  
```
`timetoken = (Unix epoch time in seconds) * 1_000_000_000  
`
```
Example:  
```
`// 08/19/2013 @ 9:20 PM UTC = 1376961606  
timetoken = 1376961606 * 1_000_000_000  
timetoken = 1376961606000000000  
`
```

### Method(s)
```
`func time(  
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
  completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```
* **custom** (PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`) – per-request overrides.  
* **completion** (`((Result<Timetoken, Error>) -> Void)?`, default `nil`) – async result.

#### Completion Result
* Success – current `Timetoken`.  
* Failure – `Error`.

### Sample
#### Get PubNub timetoken
```
`**`
```

_Last updated: Jul 15, 2025_