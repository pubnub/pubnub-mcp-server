# Go API & SDK (v7.3.4) – Condensed Overview  

## Prerequisites  
• Go ≥ 1.11 • PubNub account (publish & subscribe keys)  

## Installation  

```bash
go get github.com/pubnub/go/v7  
```

```go
require github.com/pubnub/go/v7 v7.3.4  
```

```bash
go mod tidy  
```

```bash
git clone https://github.com/pubnub/go.git  
```

## Minimal “Hello, World”  

Create `pubnub_example.go`, replace the **demo** keys with your own.

```go
// Import required packages  
package main  
  
import (  
	"fmt"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Set up PubNub configuration  
	config := pubnub.NewConfigWithUserId("go-user")  
	config.SubscribeKey = "demo" // Replace with your subscribe key  
	config.PublishKey  = "demo"  // Replace with your publish key  
```
*…rest of file continues…*  

### Event Listeners  

```go
// Create a listener  
listener := pubnub.NewListener()  
  
// Create channels to signal events  
doneConnect := make(chan bool)  
donePublish := make(chan bool)  
  
// Start a goroutine to process events  
go func() {  
	for {  
		select {  
		case status := listener.Status:  
			// Handle status events  
			switch status.Category {  
			case pubnub.PNConnectedCategory:  
```
*…rest of listener logic…*  

### Subscribe  

```go
// Define the channel you want to subscribe to  
channel := "my-channel"  
  
// Subscribe to the channel  
pn.Subscribe().  
	Channels([]string{channel}).  
	Execute()  
  
// Wait for the connection to establish  
<-doneConnect  
fmt.Println("Subscribed to channel:", channel)  
```

### Publish  

```go
// Create a message  
message := map[string]interface{}{  
	"text": "Hello, world!",  
	"sender": "go-sdk",  
}  
  
fmt.Println("Publishing message:", message)  
  
// Publish the message to the channel  
response, _, err := pn.Publish().  
	Channel(channel).  
	Message(message).  
	Execute()  
  
if err != nil {  
```
*…error handling & publish callback…*  

### Run  

```bash
go run pubnub_example.go  
```

Expected output:

```text
PubNub instance initialized  
Connected to PubNub!  
Subscribed to channel: my-channel  
Publishing message: map[sender:go-sdk text:Hello, world!]  
Publish successful! Timetoken: 16967543908123456  
Received message: map[sender:go-sdk text:Hello, world!]  
```

## Complete Example  

```go
package main  
  
import (  
	"fmt"  
	"time"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Step 1: Initialize PubNub with configuration  
	config := pubnub.NewConfigWithUserId("go-user")  
	config.SubscribeKey = "demo" // Replace with your subscribe key  
	config.PublishKey  = "demo"  // Replace with your publish key  
```
*…remaining ~90 lines: listener, subscribe, publish, run…*  

## Key Points  
1. Config fields: `PublishKey`, `SubscribeKey`, `UserId` (via `NewConfigWithUserId`).  
2. Messages: any JSON-serializable payload ≤ 32 KiB.  
3. Core API chain builders:  
   • `pn.Subscribe().Channels([]string).Execute()`  
   • `pn.Publish().Channel(channel).Message(msg).Execute()`  
4. Asynchronous events delivered via `pubnub.NewListener()` channels (`Status`, `Message`, `Presence`).  
5. Use Go routines/channels to keep the app non-blocking.  

For advanced features (Presence, Channel Groups, Push, Storage, Access Manager, etc.) consult the linked API reference.