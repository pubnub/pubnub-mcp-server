# Rust API & SDK Docs 0.6.0 – Overview (Condensed)

This section keeps every code block, method signature, parameter list, and essential configuration detail while removing redundant prose.

---

## Prerequisites
• Rust + Cargo installed  
• PubNub account and keyset

---

## Installation

### Server-side (full feature set)

```
`[dependencies]  
pubnub = "0.6.0"  
serde = "1.0"  
serde_json = "1.0"  
tokio = { version = "1", features = ["full"] }  
`
```

### Embedded / no_std (minimal footprint)

```
`[dependencies]  
# Disable default features and only enable what you need  
pubnub = { version = "0.6.0", default-features = false, features = ["publish"] }  
serde = { version = "1.0", default-features = false }  
`
```

```
`[dependencies]  
# Minimal configuration for embedded systems  
pubnub = { version = "0.6.0", default-features = false, features = ["serde", "publish"] }  
serde = { version = "1.0", default-features = false }  
`
```

---

## Initialize PubNub

### Server-side

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

### Embedded (conceptual custom transport)

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

---

## Event Listeners

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

Selective stream:

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

Compact embedded variant:

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

---

## Subscribing

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

Embedded minimal:

```
`// Create a minimal subscription with only required features  
let channel = pubnub.channel("my_channel");  
let subscription = channel.subscription(None);  
subscription.subscribe();  
  
// For very constrained systems, you might want to use specific options  
// to limit resource usage  
`
```

---

## Publishing

Server-side:

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

Embedded:

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

---

## Cleanup

Server-side:

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

Embedded:

```
`// Unsubscribe from channels to stop receiving messages  
subscription.unsubscribe();  
  
// Clean up resources  
pubnub.remove_all_listeners();  
pubnub.destroy();  
`
```

---

## Running

Standard target:

```
`[dependencies]  
pubnub = "0.6.0"  
serde = "1.0"  
serde_json = "1.0"  
tokio = { version = "1", features = ["full"] }  
`
```

```
`#[tokio::main]  
async fn main() -> Result(), Boxdyn std::error::Error>> {  
    // Your code here  
    Ok(())  
}  
`
```

Embedded target:

```
`[dependencies]  
pubnub = { version = "0.6.0", default-features = false, features = ["serde", "publish"] }  
# Add other dependencies specific to your embedded target  
`
```

---

### Sample Run Output

```
`PubNub client initialized successfully!  
Subscribed to channel: my_channel  
Connected to PubNub network  
Message published successfully! Timetoken: 16967543908123456  
Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
Global listener: Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
`
```

---

## Complete Example

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

(See full file in SDK repository.)

---

## Next Steps (quick links)
• Presence • Access Manager • CryptoModule  
• GitHub examples • SDK reference • Discord community • Support portal

_Last updated Jun 9 2025_