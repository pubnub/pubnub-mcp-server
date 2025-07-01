On this page
# Rust API & SDK Docs 0.6.0

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Rust application. Since Rust is commonly used across different platforms, we provide two implementation paths:

- **Server-side applications**: For developers building backend services and applications with Rust

- **Embedded systems**: For developers using Rust in resource-constrained environments (embedded devices, WebAssembly)

The core PubNub concepts and API usage remain the same across both paths, but implementation details like feature selection and memory management differ. Select the appropriate tab in each section to see platform-specific guidance.

##### Feature selection

The Rust SDK is designed to be modular with support for different feature sets. You can enable or disable specific features based on your needs, which is especially useful for embedded systems with limited resources.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Rust

- Rust and Cargo installed on your system

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal

- Create a new app (or use an existing one)

- Find your publish and subscribe keys in the app's dashboard

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

- Server-side applications
- Embedded systems

Add `pubnub` to your Rust project in the [`Cargo.toml`](https://doc.rust-lang.org/cargo/getting-started/installation.html) file:

```
`[dependencies]  
pubnub = "0.6.0"  
serde = "1.0"  
serde_json = "1.0"  
tokio = { version = "1", features = ["full"] }  
`
```

Then in your `main.rs` file:

```
`use pubnub::dx::*;  
use pubnub::core::*;  
use serde_json::json;  
  
#[tokio::main]  
async fn main() -> Result(), Boxdyn std::error::Error>> {  
    // Set up PubNub configuration  
    let pubnub = PubNubClientBuilder::with_reqwest_transport()  
        .with_keyset(Keyset {  
            subscribe_key: "demo",      // Replace with your subscribe key  
            publish_key: Some("demo"),  // Replace with your publish key  
            secret_key: None,  
        })  
        .with_user_id("rust-server-user")  
        .build()?;  
`
```

show all 22 linesFor embedded systems or WebAssembly targets, you'll want to optimize for size and disable features you don't need:

```
`[dependencies]  
# Disable default features and only enable what you need  
pubnub = { version = "0.6.0", default-features = false, features = ["publish"] }  
serde = { version = "1.0", default-features = false }  
`
```

The `pubnub` crate is `no_std` compatible, making it suitable for embedded environments:

```
`[dependencies]  
# Minimal configuration for embedded systems  
pubnub = { version = "0.6.0", default-features = false, features = ["serde", "publish"] }  
serde = { version = "1.0", default-features = false }  
`
```

You can also download the source code directly from the [GitHub repository](https://github.com/pubnub/rust).

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

- Server-side applications
- Embedded systems

In your Rust project, create a new file (e.g., `main.rs`) with the following content. This is the minimum configuration you need to send messages with PubNub.

Make sure to replace the placeholder keys with your publish and subscribe keys from the Admin Portal.

```
`use pubnub::dx::*;  
use pubnub::core::*;  
use serde_json::json;  
  
#[tokio::main]  
async fn main() -> Result(), Boxdyn std::error::Error>> {  
    // Set up PubNub configuration  
    let pubnub = PubNubClientBuilder::with_reqwest_transport()  
        .with_keyset(Keyset {  
            subscribe_key: "demo",      // Replace with your subscribe key  
            publish_key: Some("demo"),  // Replace with your publish key  
            secret_key: None,  
        })  
        .with_user_id("rust-server-user")  
        .build()?;  
`
```

show all 22 linesFor embedded systems, you'll want to be more careful with memory usage. The following example shows how to structure your code, but you'll need to adapt it to your specific embedded environment:

```
`// Note: This is a conceptual example.   
// You'll need to adapt this to your specific embedded target.  
  
use pubnub::dx::*;  
use pubnub::core::*;  
use pubnub::transport::*;  
  
// First, implement a transport that works with your environment  
struct MinimalTransport;  
  
impl Transport for MinimalTransport {  
    // Implement the Transport trait methods here  
    // This is a simplified example and not fully functional  
    // See the PubNub Rust SDK documentation for complete implementation details  
    // ...  
`
```
show all 42 lines
##### note

The embedded example above is conceptual. For an actual implementation, you'll need to create a custom transport layer that implements the `Transport` trait for your specific environment.

For more information, refer to the [Configuration](/docs/sdks/rust/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

- Server-side applications
- Embedded systems

Using Rust's async streams makes it easy to process events as they arrive:

```
`// Import required event handling traits  
use pubnub::dx::subscribe::Update;  
use pubnub::subscribe::{Subscriber, EventSubscriber};  
use futures::StreamExt;  
  
// Listen for client status changes  
tokio::spawn(pubnub.status_stream().for_each(|status| async move {  
    println!("\nStatus: {:?}", status)  
}));  
  
// Listen for all subscription events  
tokio::spawn(subscription.stream().for_each(|event| async move {  
    match event {  
        Update::Message(message) | Update::Signal(message) => {  
            // Process incoming messages  
`
```

show all 35 linesIf you only want to listen for specific events, you can use specialized streams:

```
`// Only listen for message events on a specific channel  
tokio::spawn(  
    channel_subscription  
        .messages_stream()  
        .for_each(|message| async move {  
            if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {  
                if let Ok(cleaned) = serde_json::from_str::String>(&utf8_message) {  
                    println!("Message received: {}", cleaned);  
                }  
            }  
        })  
);  
`
```

For embedded systems, you might want to use a more compact approach to event handling:

```
`// Use a more compact approach for resource-constrained environments  
tokio::spawn(subscription.messages_stream().for_each(|message| async move {  
    // Only process the specific fields needed rather than the entire message  
    if let Ok(text) = String::from_utf8(message.data.clone()) {  
        // Process the message with minimal allocations  
        // ...  
    }  
}));  
`
```

For more information, refer to the [Event Listeners](/docs/sdks/rust/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it. This setup allows you to receive real-time updates whenever anyone publishes to that channel.

- Server-side applications
- Embedded systems

Create a subscription to one or more channels using the subscription parameters:

```
`use pubnub::subscribe::SubscriptionParams;  
  
// Subscribe to a single channel  
let subscription = pubnub.subscription(SubscriptionParams {  
    channels: Some(&["my_channel"]),  
    channel_groups: None,  
    options: None  
});  
  
// Or create a subscription from a channel entity  
let channel = pubnub.channel("my_channel");  
let channel_subscription = channel.subscription(None);  
  
// Activate the subscriptions  
subscription.subscribe();  
`
```

show all 18 linesFor embedded systems, you might want to be more careful with resource usage:

```
`// Create a minimal subscription with only required features  
let channel = pubnub.channel("my_channel");  
let subscription = channel.subscription(None);  
subscription.subscribe();  
  
// For very constrained systems, you might want to use specific options  
// to limit resource usage  
`
```

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel. A message can be any type of JSON-serializable data smaller than 32 KiB.

- Server-side applications
- Embedded systems

Let's publish a message to our channel:

```
`// Wait a moment for the subscription to establish  
tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;  
  
// Send a message to the channel  
match pubnub  
    .publish_message("hello world!")  
    .channel("my_channel")  
    .r#type("text-message")  // Optional: specify a message type  
    .execute()  
    .await {  
        Ok(result) => {  
            println!("Message published successfully! Timetoken: {}", result.timetoken);  
        }  
        Err(err) => {  
            println!("Failed to publish message: {:?}", err);  
`
```

show all 17 linesFor embedded systems, you might want to minimize memory usage during publishing:

```
`// Create a simple message with minimal allocations  
let message = r#"{"text":"Hello from embedded device"}"#;  
  
// Publish the message with minimal overhead  
let result = pubnub.publish_message(message)  
    .channel("my_channel")  
    .store(false) // Don't store the message to save bandwidth  
    .execute()  
    .await;  
  
// Process the result with minimal allocations  
match result {  
    Ok(publish_result) => {  
        // Message was published successfully  
        // Process the timetoken if needed  
`
```
show all 25 lines

### Clean up resources[​](#clean-up-resources)

When your application is shutting down or a component using PubNub is being removed, it's important to properly clean up resources to avoid memory leaks and ensure network connections are closed gracefully.

- Server-side applications
- Embedded systems

To properly clean up resources, unsubscribe from channels and remove listeners:

```
`// Unsubscribe from the channel  
subscription.unsubscribe();  
  
// Remove listeners to avoid memory leaks  
pubnub.remove_all_listeners();  
  
// For more thorough cleanup, you can also destroy the client  
// which will unsubscribe from all channels and remove all listeners  
pubnub.destroy();  
  
println!("Cleaned up PubNub resources");  
`
```

This is particularly important in long-running applications that may create and dispose of multiple PubNub clients or subscriptions.

For embedded systems, proper cleanup is even more critical due to limited resources:

```
`// Unsubscribe from channels to stop receiving messages  
subscription.unsubscribe();  
  
// Clean up resources  
pubnub.remove_all_listeners();  
pubnub.destroy();  
`
```

In memory-constrained environments, make sure to clean up as soon as you're done with a resource to free memory.

### Run the app[​](#run-the-app)

- Server-side applications
- Embedded systems

To run your application:

1. $1

2. $1

If you're using async code, make sure your `Cargo.toml` includes tokio:

```
`[dependencies]  
pubnub = "0.6.0"  
serde = "1.0"  
serde_json = "1.0"  
tokio = { version = "1", features = ["full"] }  
`
```

And your main function should have the tokio runtime attribute:

```
`#[tokio::main]  
async fn main() -> Result(), Boxdyn std::error::Error>> {  
    // Your code here  
    Ok(())  
}  
`
```

For embedded systems, the process will depend on your specific target:

Configure your build for your target architecture

If using `no_std`, ensure you've properly set up your Cargo.toml:

```
`[dependencies]  
pubnub = { version = "0.6.0", default-features = false, features = ["serde", "publish"] }  
# Add other dependencies specific to your embedded target  
`
```

Build with `cargo build --target your-target-triple`

Flash to your device using the appropriate tools for your platform

When you run the application, you should see output similar to the following:

```
`PubNub client initialized successfully!  
Subscribed to channel: my_channel  
Connected to PubNub network  
Message published successfully! Timetoken: 16967543908123456  
Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
Global listener: Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
`
```

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together:

```
`use pubnub::subscribe::Subscriber;  
use futures::StreamExt;  
use tokio::time::sleep;  
use std::time::Duration;  
use serde_json;  
use pubnub::{  
    dx::subscribe::Update,  
    subscribe::{EventSubscriber, EventEmitter, SubscriptionParams},  
    Keyset, PubNubClientBuilder,  
};  
  
#[tokio::main]  
async fn main() -> Result(), Boxdyn std::error::Error>> {  
    // Set up PubNub configuration  
    let publish_key = "demo";  // Replace with your publish key  
`
```
show all 117 lines

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
- Ensure you've added the PubNub dependency correctly.
- Check that you're using a compatible version of Rust (1.65.0+ is recommended).
- Make sure all imports are correct.

Runtime errors
- If using async code, ensure you've set up the tokio runtime correctly.
- Make sure you're handling errors properly with proper match statements or the `?` operator.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with Rust. Here are some exciting things you can explore next:

- Advanced features
- Real examples
- More help

- Try out [Presence](/docs/sdks/rust/api-reference/presence) to track online/offline status.

- Use [Access Manager](/docs/sdks/rust/api-reference/access-manager) to secure your channels.

- Explore message encryption with the built-in [CryptoModule](/docs/sdks/rust/api-reference/configuration#cryptomodule).

- Look at the [examples folder](https://github.com/pubnub/rust/tree/master/examples) in the repository.

- Explore our [GitHub repository](https://github.com/pubnub/rust/) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/rust/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Jun 9, 2025**