# PubNub Go SDK – Configuration (Condensed)

This is a stripped-down reference. All properties, signatures, defaults, and examples are intact; descriptive text is minimized.

---

## Create a `Config`

```
`config := pubnub.NewConfigWithUserId(UserId)  
`
```

`UserId` **must** be set or the client can’t connect.

---

## Config Fields

* **SubscribeKey** `string` – required for all clients.  
* **PublishKey** `string` – required only if publishing.  
* **SecretKey** `string` – required for PAM management.  
* **SetUserId(UserId)** – unique UTF-8 ID (≤ 92 chars).  
* **AuthKey** `string` – PAM token sent with every request.  
* **Secure** `bool` (default `true`) – TLS on/off.  
* **MessageQueueOverflowCount** `int` (default `100`) – fires `PNRequestMessageCountExceededCategory`.  
* **ConnectTimeout** `int` (sec, default `5`).  
* **SubscribeRequestTimeout** `int` (sec, default `310`).  
* **NonSubscribeRequestTimeout** `int` (sec, default `10`).  
* **FilterExpression** `string` – server-side stream filter.  
* **Origin** `string` (default `ps.pndsn.com`).  
* **MaximumReconnectionRetries** `int` (default `-1` = unlimited).  
* **SetPresenceTimeout(timeoutSec int)** – presence TTL.  
* **SetPresenceTimeoutWithCustomInterval(timeoutSec, intervalSec int)** – heartbeat control.  
* **SuppressLeaveEvents** `bool`.  
* **MaxIdleConnsPerHost** `int` (default `30`).  
* **FileMessagePublishRetryLimit** `int` (default `5`).  
* **CryptoModule** `crypto.*` – encryption engine (see below).  
* **CipherKey / UseRandomInitializationVector** – DEPRECATED (use `CryptoModule`).  
* **UUID** `string` – DEPRECATED (use `UserId`).  

Random IV should stay enabled for all new apps.

---

## CryptoModule

Two bundled options:

```
`// 256-bit AES-CBC (recommended)  
config.CryptoModule = crypto.NewAesCbcCryptoModule("cipherKey", true)  
  
// 128-bit legacy cipher  
config.CryptoModule = crypto.NewLegacyModule("cipherKey", true)  
`
```

Older SDKs (< 7.1.2) cannot decrypt AES-CBC data.

---

## Basic Usage Example

```
`package main  
  
import (  
	"fmt"  
	crypto "github.com/pubnub/go/v7/crypto"  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  // Use Demo keys for testing  
	config.PublishKey = "demo"  
	config.SecretKey = "mySecretKey"  
	config.Secure = true  
`
```
_show all 25 lines_

---

## Proxy Configuration

### Subscribe traffic

```
`var pn *pubnub.PubNub  
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId")  
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
`
```
_show all 24 lines_

### Non-subscribe traffic

```
`var pn *pubnub.PubNub  
config = pubnub.NewConfigWithUserId(UserId("myUniqueUserId")  
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
`
```
_show all 24 lines_

---

## Initialization

```
`pn := pubnub.NewPubNub(config)  
`
```

Example:

```
`package main  
  
import (  
	"fmt"  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
	// Initialize the PubNub instance  
`
```
_show all 19 lines_

Other variants (non-secure / read-only):

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfigWithUserId("userId")  
config.PublishKey = "my-pub-key"  
config.SubscribeKey = "my-sub-key"  
  
pn := pubnub.NewPubNub(config)  
`
```

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfigWithUserId("userId")  
config.SubscribeKey = "my-sub-key"  
  
pn := pubnub.NewPubNub(config)  
`
```

---

## Event Listeners (reference)

Add, remove, and monitor status:

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
listener := pubnub.NewListener()  
  
go func() {  
    for {  
        select {  
        case signal := listener.Signal:  
            //Channel  
            fmt.Println(signal.Channel)  
            //Subscription  
            fmt.Println(signal.Subscription)  
            //Payload  
`
```
_show 108 lines_

```
`listener := pubnub.NewListener()  
  
pn.AddListener(listener)  
  
// some time later  
pn.RemoveListener(listener)  
`
```

```
`import (  
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
`
```
_show 17 lines_

Key categories include `PNTimeoutCategory`, `PNDisconnectedCategory`, `PNConnectedCategory`, `PNAccessDeniedCategory`, `PNRequestMessageCountExceededCategory`, etc.

---

## UserId Helpers

```
`config.SetUserId(UserId(string))  
`
```

```
`config.GetUserId()  
`
```

Example:

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
config.SetUserId(UserId("myUniqueUserId"))  
  
// one-liner  
config := pubnub.NewConfigWithUserId("userId")  
`
```

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
  
fmt.Println(config.GetUserId)  
`
```

---

## AuthKey Helpers

Setter / getter:

```
`config.AuthKey = string  
`
```

```
`config.AuthKey  
`
```

Example:

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
config.AuthKey = "my_newauthkey"  
`
```

```
`fmt.Println(config.AuthKey)  
`
```

---

## Filter Expression

```
`config.FilterExpression = string  
`
```

```
`config.FilterExpression  
`
```

Example:

```
`import (  
    pubnub "github.com/pubnub/go"  
)  
  
config := pubnub.NewConfig()  
config.FilterExpression = "such=wow"  
`
```

```
`fmt.Println(config.FilterExpression)**`
```

_Last updated Apr 22 2025_