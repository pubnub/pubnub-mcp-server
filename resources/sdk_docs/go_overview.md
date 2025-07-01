On this page
# Go API & SDK Docs v7.3.4

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Go application. The Go SDK provides a simple interface for integrating PubNub's real-time messaging capabilities into your Go applications.

Go's concurrency model with goroutines and channels makes it an excellent choice for building real-time applications that can handle many connections efficiently. Whether you're building a web service, CLI application, or backend system, this guide will show you how to get started with PubNub in Go.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Go programming

- Go installed on your machine (version 1.11 or later)

- Your preferred Go IDE or text editor

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard.

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

- go get
- go.mod
- Source code

To integrate PubNub into your Go project using the `go get` command:

```
`go get github.com/pubnub/go/v7  
`
```

If you encounter dependency issues, use the `go mod tidy` command to resolve them.

For projects using Go modules, add the dependency to your `go.mod` file:

```
`require github.com/pubnub/go/v7 v7.3.4  
`
```

Then run:

```
`go mod tidy  
`
```

You can also clone the repository directly:

```
`git clone https://github.com/pubnub/go.git  
`
```

Or visit the [Go SDK repository](https://github.com/pubnub/go) on GitHub to download the source code.

View the [supported platforms](/docs/sdks/go/platform-support) for more information about compatibility.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

In your Go project, create a new file named `pubnub_example.go` with the following content. This is the minimum configuration you need to send and receive messages with PubNub.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

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
show all 21 lines

For more information, refer to the [Configuration](/docs/sdks/go/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your application react to events and messages. You can implement custom logic to respond to each type of message or event.

In Go, we use channels to handle asynchronous events. Let's set up listeners for status updates and incoming messages:

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
show all 42 lines

For more information, refer to the [Listeners](/docs/sdks/go/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it. This allows you to receive messages published to that channel in real-time:

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

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

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
show all 24 lines

### Run the app[​](#run-the-app)

To test your Go application, save the file and run it using:

```
`go run pubnub_example.go  
`
```

When you run the application, you should see output similar to the following:

```
`PubNub instance initialized  
Connected to PubNub!  
Subscribed to channel: my-channel  
Publishing message: map[sender:go-sdk text:Hello, world!]  
Publish successful! Timetoken: 16967543908123456  
Received message: map[sender:go-sdk text:Hello, world!]  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together.

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
show all 91 lines

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct.
- Make sure you're not behind a firewall blocking PubNub's connections.

Message not received
- Double-check that you're subscribed to the correct channel.
- Verify that the message was actually sent (check for any error messages).
- Make sure you're waiting long enough for the message to be delivered.

Build errors
- Ensure your Go version is up to date.
- Run `go mod tidy` to fix dependency issues.
- Make sure all imports are correct.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with Go. Here are some exciting things you can explore next:

- Realtime features
- Advanced features
- Real examples
- More help

- Set up [Presence](/docs/sdks/go/api-reference/presence) to track who's online

- Implement [channel groups](/docs/sdks/go/api-reference/channel-groups) to organize your channels

- Use [Signals](/docs/sdks/go/api-reference/publish-and-subscribe#signal) for lightweight notifications

- Try out [Access Manager](/docs/sdks/go/api-reference/access-manager) to secure your channels

- Implement [Message Persistence](/docs/sdks/go/api-reference/storage-and-playback) to store and retrieve messages

- Use [Push Notifications](/docs/sdks/go/api-reference/mobile-push) for mobile devices

- [Build a chat app in Go](https://www.pubnub.com/blog/build-a-chat-app-in-go-using-pubnub/)

- Explore our [GitHub repository](https://github.com/pubnub/go) for more code samples

- Check out our [SDK reference documentation](/docs/sdks/go/api-reference/configuration) for detailed API information

- Visit our [support portal](https://support.pubnub.com/) for additional resources

- Ask our AI assistant (the looking glass icon at the top of the page) for help

Last updated on **Jun 16, 2025**