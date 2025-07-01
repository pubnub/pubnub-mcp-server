# Go API & SDK Docs v7.3.4 (Overview)

Quick-start for adding PubNub real-time messaging to a Go application (Go ≥ 1.11).

---

## Prerequisites
• Go 1.11+ • PubNub account (publish & subscribe keys)  
• Basic Go knowledge & IDE

---

## Setup

### 1. Get Keys
Create/choose an app in the PubNub Admin Portal and copy its **Publish** and **Subscribe** keys (create separate keysets for dev/prod).

### 2. Install the SDK

```
`go get github.com/pubnub/go/v7  
`
```

Go modules:

```
`require github.com/pubnub/go/v7 v7.3.4  
`
```

```
`go mod tidy  
`
```

Source clone:

```
`git clone https://github.com/pubnub/go.git  
`
```

---

## Steps

### 1. Initialize PubNub

```
`// Import required packages  
package main  
  
import (  
	"fmt"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Set up PubNub configuration  
	config := pubnub.NewConfigWithUserId("go-user")  
	config.SubscribeKey = "demo" // Replace with your subscribe key  
	config.PublishKey = "demo"   // Replace with your publish key  
  
`
```

### 2. Set up Event Listeners

```
`// Create a listener  
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
`
```

### 3. Subscribe to a Channel

```
`// Define the channel you want to subscribe to  
channel := "my-channel"  
  
// Subscribe to the channel  
pn.Subscribe().  
	Channels([]string{channel}).  
	Execute()  
  
// Wait for the connection to establish  
doneConnect  
fmt.Println("Subscribed to channel:", channel)  
`
```

### 4. Publish a Message

```
`// Create a message  
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
`
```

### 5. Run

```
`go run pubnub_example.go  
`
```

Expected output:

```
`PubNub instance initialized  
Connected to PubNub!  
Subscribed to channel: my-channel  
Publishing message: map[sender:go-sdk text:Hello, world!]  
Publish successful! Timetoken: 16967543908123456  
Received message: map[sender:go-sdk text:Hello, world!]  
`
```

---

## Complete Example

```
`package main  
  
import (  
	"fmt"  
	"time"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Step 1: Initialize PubNub with configuration  
	config := pubnub.NewConfigWithUserId("go-user")  
	config.SubscribeKey = "demo" // Replace with your subscribe key  
	config.PublishKey = "demo"   // Replace with your publish key  
  
`
```

---

## Troubleshooting

No connection? → Check internet, keys, firewall  
Messages not received? → Confirm channel, publish success, wait for delivery  
Build errors? → Update Go, `go mod tidy`, verify imports

---

Next: explore Presence, Channel Groups, Signals, Access Manager, Storage, Push, sample chat app, and full API reference.