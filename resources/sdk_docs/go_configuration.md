# PubNub Go SDK – Configuration (condensed)

Complete API reference: https://godoc.org/github.com/pubnub/go

---

## 1. Creating a configuration object
```go
config := pubnub.NewConfigWithUserId(UserId)
```

## 2. Config fields

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| SubscribeKey* | string | — | Required. From Admin Portal. |
| PublishKey | string | — | Required only if publishing. |
| SecretKey | string | — | Required only for PAM grant/revoke. |
| SetUserId* | UserId | — | Required. UTF-8 string ≤92 chars. |
| AuthKey | string | — | Sent with PAM–protected requests. |
| Secure | bool | true | TLS on/off. |
| MessageQueueOverflowCount | int | 100 | Fires `PNRequestMessageCountExceededCategory`. |
| ConnectTimeout | int | 5 s | Dial timeout. |
| SubscribeRequestTimeout | int | 310 s | Long-poll duration. |
| NonSubscribeRequestTimeout | int | 10 s | REST call timeout. |
| FilterExpression | string | — | Stream Controller filter. |
| Origin | string | ps.pndsn.com | Custom domain if needed. |
| MaximumReconnectionRetries | int | −1 | −1 = unlimited. |
| SetPresenceTimeout | int | 0 | Presence TTL. |
| SetPresenceTimeoutWithCustomInterval | int | 0 | Heartbeat interval. Recommended `(timeout/2)-1`. |
| SuppressLeaveEvents | bool | false | Skip leave. |
| MaxIdleConnsPerHost | int | 30 | HTTP transport tuning. |
| FileMessagePublishRetryLimit | int | 5 | Retries on file-publish failure. |
| CryptoModule | crypto.Module | — | See section below. |
| CipherKey (deprecated) | string | — | Pass via CryptoModule instead. |
| UseRandomInitializationVector (deprecated) | bool | true | Pass via CryptoModule instead. |
| UUID (deprecated) | string | — | Use `UserId` instead. |

*required

### Disable random IV  
Only for pre-5.0.0 compatibility. Never disable for new apps.

---

## 3. CryptoModule

Two built-in modules:

```go
// 256-bit AES-CBC (recommended)
config.CryptoModule = crypto.NewAesCbcCryptoModule("cipherKey", true)

// 128-bit legacy cipher (backward-compatible)
config.CryptoModule = crypto.NewLegacyModule("cipherKey", true)
```
If `CryptoModule` is **not** set, the SDK falls back to legacy encryption when `CipherKey` is present.

Older SDKs (< 7.1.2) can’t decrypt 256-bit AES-CBC data.

---

## 4. Sample configuration snippet
```go
package main

import (
	"fmt"
	crypto "github.com/pubnub/go/v7/crypto"
	pubnub "github.com/pubnub/go/v7"
)

func main() {
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey  = "demo"
	config.SecretKey   = "mySecretKey"
	config.Secure      = true
	// …
}
```
(show all 25 lines)

---

## 5. Proxy configuration

Subscribe requests:
```go
var pn *pubnub.PubNub
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId"))
config.UseHTTP2 = false

pn = pubnub.NewPubNub(config)

transport := &http.Transport{
    MaxIdleConnsPerHost: pn.Config.MaxIdleConnsPerHost,
    Dial: (&net.Dialer{
        Timeout:   time.Duration(pn.Config.ConnectTimeout) * time.Second,
        KeepAlive: 30 * time.Minute,
    }).Dial,
    ResponseHeaderTimeout: time.Duration(pn.Config.SubscribeRequestTimeout) * time.Second,
}
proxyURL, err := url.Parse(fmt.Sprintf("http://%s:%s@%s:%d", "proxyUser", "proxyPassword", "proxyServer", 8080))
```
(show all 24 lines)

Non-subscribe requests:
```go
var pn *pubnub.PubNub
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId"))
config.UseHTTP2 = false

pn = pubnub.NewPubNub(config)

transport := &http.Transport{
    MaxIdleConnsPerHost: pn.Config.MaxIdleConnsPerHost,
    Dial: (&net.Dialer{
        Timeout:   time.Duration(pn.Config.ConnectTimeout) * time.Second,
        KeepAlive: 30 * time.Minute,
    }).Dial,
    ResponseHeaderTimeout: time.Duration(pn.Config.NonSubscribeRequestTimeout) * time.Second,
}
proxyURL, err := url.Parse(fmt.Sprintf("http://%s:%s@%s:%d", "proxyUser", "proxyPassword", "proxyServer", 8080))
```
(show all 24 lines)

---

## 6. Initializing the client
```go
pn := pubnub.NewPubNub(config)
```
Returns a ready-to-use `*pubnub.PubNub` instance (publish, subscribe, history, etc.).

Example:
```go
package main

import (
	"fmt"
	pubnub "github.com/pubnub/go/v7"
)

func main() {
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey  = "demo"

	pn := pubnub.NewPubNub(config)
	// …
}
```
(show all 19 lines)

Other variants:

Non-secure client:
```go
import (
    pubnub "github.com/pubnub/go"
)

config := pubnub.NewConfigWithUserId("userId")
config.PublishKey   = "my-pub-key"
config.SubscribeKey = "my-sub-key"

pn := pubnub.NewPubNub(config)
```

Read-only client (omit PublishKey):
```go
import (
    pubnub "github.com/pubnub/go"
)

config := pubnub.NewConfigWithUserId("userId")
config.SubscribeKey = "my-sub-key"

pn := pubnub.NewPubNub(config)
```

---

## 7. Event listeners (add/remove/handle status)

Add listener:
```go
import (
    pubnub "github.com/pubnub/go"
)

listener := pubnub.NewListener()

go func() {
    for {
        select {
        case signal := listener.Signal:
            fmt.Println(signal.Channel)
            fmt.Println(signal.Subscription)
            // …
```
(show all 108 lines)

Remove listener:
```go
listener := pubnub.NewListener()

pn.AddListener(listener)

// some time later
pn.RemoveListener(listener)
```

Handle disconnects:
```go
import (
    pubnub "github.com/pubnub/go"
)

go func() {
    for {
        select {
        case status := listener.Status:
            switch status.Category {
            case pubnub.PNDisconnectedCategory:
                // handle disconnect here
            }
        case listener.Message:
        case listener.Presence:
        }
```
(show all 17 lines)

Key status categories: `PNTimeout`, `PNDisconnected`, `PNConnected`, `PNAccessDenied`, `PNBadRequest`, `PNCancelled`, `PNLoopStop`, `PNReconnected`, `PNAcknowledgment`, `PNReconnectionAttemptsExhausted`, `PNNoStubMatched/PNUnknown`, `PNRequestMessageCountExceeded`.

---

## 8. UserId helpers
```go
config.SetUserId(UserId("myUniqueUserId"))
uid := config.GetUserId()
```
Alternative inline:
```go
config := pubnub.NewConfigWithUserId("userId")
```

---

## 9. AuthKey helpers
```go
config.AuthKey = "my_newauthkey"
fmt.Println(config.AuthKey)
```

---

## 10. FilterExpression helpers
```go
config.FilterExpression = "such=wow"
fmt.Println(config.FilterExpression)
```
(Stream Controller add-on required)

---

*(Last updated Jul 16 2025)*