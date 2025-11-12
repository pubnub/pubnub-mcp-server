# Rust API & SDK Docs 0.7.0

This quickstart shows how to connect, publish, and receive real-time messages with PubNub in Rust. Choose the path that fits your target:
- Server-side applications (backend services)
- Embedded systems (no_std, resource-constrained, or WebAssembly)

Feature selection
- The SDK is modular; enable only the features you need (important for embedded).
- The pubnub crate is no_std compatible.

## Prerequisites

- Rust and Cargo installed
- Basic Rust knowledge
- PubNub account and keyset (publish/subscribe keys)

## Setup

### Get your PubNub keys

- Sign in or create an account: https://admin.pubnub.com/#/login
- Create an app and get publish and subscribe keys (use separate keysets for dev/prod).

### Install the SDK

Server-side applications

```toml
[dependencies]
pubnub = "0.7.0"
serde = "1.0"
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
```

```rust
use pubnub::dx::*;
use pubnub::core::*;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Set up PubNub configuration
    let pubnub = PubNubClientBuilder::with_reqwest_transport()
        .with_keyset(Keyset {
            subscribe_key: "demo",      // Replace with your subscribe key
            publish_key: Some("demo"),  // Replace with your publish key
            secret_key: None,
        })
        .with_user_id("rust-server-user")
        .build()?;

    println!("PubNub client initialized successfully!");

    // We'll add more code here in the next steps

    Ok(())
}
```

Embedded systems

```toml
# Disable default features and only enable what you need
[dependencies]
pubnub = { version = "0.7.0", default-features = false, features = ["publish"] }
serde = { version = "1.0", default-features = false }
```

```toml
# Minimal configuration for embedded systems (no_std compatible)
[dependencies]
pubnub = { version = "0.7.0", default-features = false, features = ["serde", "publish"] }
serde = { version = "1.0", default-features = false }
```

#### Source code

```bash
git clone https://github.com/pubnub/rust
```

## Steps

### Initialize PubNub

Server-side applications

```rust
use pubnub::dx::*;
use pubnub::core::*;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Set up PubNub configuration
    let pubnub = PubNubClientBuilder::with_reqwest_transport()
        .with_keyset(Keyset {
            subscribe_key: "demo",      // Replace with your subscribe key
            publish_key: Some("demo"),  // Replace with your publish key
            secret_key: None,
        })
        .with_user_id("rust-server-user")
        .build()?;

    println!("PubNub client initialized successfully!");

    // We'll add more code here in the next steps

    Ok(())
}
```

Embedded systems (conceptual; implement a Transport for your target)

```rust
// Note: This is a conceptual example.
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
}

fn init_pubnub() -> Result<PubNubClient<MinimalTransport>, PubNubError> {
    // Create a transport instance
    let transport = MinimalTransport;

    // Set up PubNub with minimal configuration
    let pubnub = PubNubClientBuilder::with_transport(transport)
        .with_keyset(Keyset {
            subscribe_key: "demo",      // Replace with your subscribe key
            publish_key: Some("demo"),  // Replace with your publish key
            secret_key: None,
        })
        .with_user_id("rust-embedded-device")
        .build()?;

    Ok(pubnub)
}

// In your main function or initialization code
fn main() -> Result<(), PubNubError> {
    let pubnub = init_pubnub()?;

    // Your embedded application code

    Ok(())
}
```

Conceptual example
- Implement a custom Transport for your environment. See Configuration docs.

### Set up event listeners

Server-side applications

```rust
// Import required event handling traits
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
            if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                    println!("Message received: {}", cleaned);
                }
            }
        }
        Update::Presence(presence) => {
            println!("Presence event: {:?}", presence)
        }
        Update::AppContext(object) => {
            println!("Object update: {:?}", object)
        }
        Update::MessageAction(action) => {
            println!("Message action: {:?}", action)
        }
        Update::File(file) => {
            println!("File received: {:?}", file)
        }
    }
}));
```

```rust
// Only listen for message events on a specific channel
tokio::spawn(
    channel_subscription
        .messages_stream()
        .for_each(|message| async move {
            if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                    println!("Message received: {}", cleaned);
                }
            }
        })
);
```

Embedded systems

```rust
// Use a more compact approach for resource-constrained environments
tokio::spawn(subscription.messages_stream().for_each(|message| async move {
    // Only process the specific fields needed rather than the entire message
    if let Ok(text) = String::from_utf8(message.data.clone()) {
        // Process the message with minimal allocations
        // ...
    }
}));
```

### Create a subscription

Server-side applications

```rust
use pubnub::subscribe::SubscriptionParams;

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
channel_subscription.subscribe();

println!("Subscribed to channels");
```

Embedded systems

```rust
// Create a minimal subscription with only required features
let channel = pubnub.channel("my_channel");
let subscription = channel.subscription(None);
subscription.subscribe();

// For very constrained systems, you might want to use specific options
// to limit resource usage
```

### Publish messages

- Messages are JSON-serializable data up to 32 KiB.

Server-side applications

```rust
// Wait a moment for the subscription to establish
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
        }
}
```

Embedded systems

```rust
// Create a simple message with minimal allocations
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
        let _timetoken = publish_result.timetoken;
    }
    Err(err) => {
        // Handle error
        // Log error or retry based on error type
        if let PubNubError::TransportError(_) = err {
            // Network error, might want to retry
        }
    }
}
```

### Clean up resources

Server-side applications

```rust
// Unsubscribe from the channel
subscription.unsubscribe();

// Remove listeners to avoid memory leaks
pubnub.remove_all_listeners();

// For more thorough cleanup, you can also destroy the client
// which will unsubscribe from all channels and remove all listeners
pubnub.destroy();

println!("Cleaned up PubNub resources");
```

Embedded systems

```rust
// Unsubscribe from channels to stop receiving messages
subscription.unsubscribe();

// Clean up resources
pubnub.remove_all_listeners();
pubnub.destroy();
```

### Run the app

- Ensure Tokio is included for async usage.

```toml
[dependencies]
pubnub = "0.7.0"
serde = "1.0"
serde_json = "1.0"
tokio = { version = "1", features = ["full"] }
```

```rust
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Your code here
    Ok(())
}
```

Embedded systems (no_std)

```toml
[dependencies]
pubnub = { version = "0.7.0", default-features = false, features = ["serde", "publish"] }
# Add other dependencies specific to your embedded target
```

- Build for your target triple and flash per your platform.

Expected output

```text
PubNub client initialized successfully!
Subscribed to channel: my_channel
Connected to PubNub network
Message published successfully! Timetoken: 16967543908123456
Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}
Global listener: Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}
```

## Complete example

```rust
use pubnub::subscribe::Subscriber;
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
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Set up PubNub configuration
    let publish_key = "demo";  // Replace with your publish key
    let subscribe_key = "demo"; // Replace with your subscribe key

    let pubnub = PubNubClientBuilder::with_reqwest_transport()
        .with_keyset(Keyset {
            subscribe_key,
            publish_key: Some(publish_key),
            secret_key: None,
        })
        .with_user_id("rust-server-user")
        .build()?;

    println!("PubNub client initialized successfully!");

    // Create a subscription to a channel
    let subscription = pubnub.subscription(SubscriptionParams {
        channels: Some(&["my_channel"]),
        channel_groups: None,
        options: None
    });

    // Create another subscription using a channel entity
    let channel_entity = pubnub.channel("my_channel_2");
    let channel_entity_subscription = channel_entity.subscription(None);

    // Activate the subscriptions
    subscription.subscribe();
    channel_entity_subscription.subscribe();

    println!("Subscribed to channels");

    // Listen for client status changes
    tokio::spawn(pubnub.status_stream().for_each(|status| async move {
        println!("\nStatus: {:?}", status)
    }));

    // Listen for all types of events
    tokio::spawn(subscription.stream().for_each(|event| async move {
        match event {
            Update::Message(message) | Update::Signal(message) => {
                // Process incoming messages
                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                    if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                        println!("Message received: {}", cleaned);
                    }
                }
            }
            Update::Presence(presence) => {
                println!("Presence event: {:?}", presence)
            }
            Update::AppContext(object) => {
                println!("Object update: {:?}", object)
            }
            Update::MessageAction(action) => {
                println!("Message action: {:?}", action)
            }
            Update::File(file) => {
                println!("File received: {:?}", file)
            }
        }
    }));

    // Only listen for message events on the second channel
    tokio::spawn(
        channel_entity_subscription
            .messages_stream()
            .for_each(|message| async move {
                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {
                    if let Ok(cleaned) = serde_json::from_str::<String>(&utf8_message) {
                        println!("Message received on channel 2: {}", cleaned);
                    }
                }
            }),
    );

    // Wait a moment for the subscriptions to establish
    sleep(Duration::from_secs(2)).await;

    // Send a message to the first channel
    pubnub
        .publish_message("hello world!")
        .channel("my_channel")
        .r#type("text-message")
        .execute()
        .await?;

    // Send a message to the second channel
    pubnub
        .publish_message("hello world on the other channel!")
        .channel("my_channel_2")
        .r#type("text-message")
        .execute()
        .await?;

    // Keep the program running to receive the published messages
    sleep(Duration::from_secs(15)).await;

    // Clean up resources (uncomment if needed for your use case)
    // subscription.unsubscribe();
    // channel_entity_subscription.unsubscribe();

    Ok(())
}
```

## Troubleshooting

- No connection message:
  - Verify internet, keys, and firewall rules.
- Message not received:
  - Confirm correct channel subscription and successful publish; allow time for delivery.
- Build errors:
  - Confirm dependencies; use Rust 1.65.0+; check imports.
- Runtime errors:
  - Ensure Tokio runtime is set up; handle errors via match or ? operator.

## Next steps

- Presence: /docs/sdks/rust/api-reference/presence
- Access Manager: /docs/sdks/rust/api-reference/access-manager
- CryptoModule: /docs/sdks/rust/api-reference/configuration#cryptomodule
- Examples: https://github.com/pubnub/rust/tree/master/examples
- GitHub: https://github.com/pubnub/rust/
- SDK reference: /docs/sdks/rust/api-reference/configuration
- Discord: https://discord.gg/pubnub
- Support: https://support.pubnub.com/