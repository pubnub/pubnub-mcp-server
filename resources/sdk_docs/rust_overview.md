# Rust API & SDK Docs 0.7.0

This guide shows how to:
- Set up a connection
- Send messages
- Receive messages in real-time

## Overview

Use PubNub from Rust in:
- Server-side applications (backend services)
- Embedded systems (resource-constrained devices, WebAssembly)

Feature selection: the SDK is modular; enable only what you need (especially for embedded/no_std).

## Prerequisites

- Basic Rust knowledge
- Rust and Cargo installed
- PubNub account and keyset

## Setup

### Get your PubNub keys

- Sign in or create an account in the Admin Portal
- Create an app (or use an existing one)
- Get publish and subscribe keys from the app’s dashboard
- Use separate keysets for dev/prod

### Install the SDK

- Server-side applications
- Embedded systems

Add pubnub to Cargo.toml:

```
`1[dependencies]  
2pubnub = "0.7.0"  
3serde = "1.0"  
4serde_json = "1.0"  
5tokio = { version = "1", features = ["full"] }  
`
```

Then in main.rs:

```
1use pubnub::dx::*;  
2use pubnub::core::*;  
3use serde_json::json;  
4
  
5#[tokio::main]  
6async fn main() -> Result(), Boxdyn std::error::Error>> {  
7    // Set up PubNub configuration  
8    let pubnub = PubNubClientBuilder::with_reqwest_transport()  
9        .with_keyset(Keyset {  
10            subscribe_key: "demo",      // Replace with your subscribe key  
11            publish_key: Some("demo"),  // Replace with your publish key  
12            secret_key: None,  
13        })  
14        .with_user_id("rust-server-user")  
15        .build()?;  
16      
17    println!("PubNub client initialized successfully!");  
18      
19    // We'll add more code here in the next steps  
20      
21    Ok(())  
22}  
```

For embedded systems or WebAssembly, optimize for size and disable unnecessary features:

```
`1[dependencies]  
2# Disable default features and only enable what you need  
3pubnub = { version = "0.7.0", default-features = false, features = ["publish"] }  
4serde = { version = "1.0", default-features = false }  
`
```

The pubnub crate is no_std compatible:

```
`1[dependencies]  
2# Minimal configuration for embedded systems  
3pubnub = { version = "0.7.0", default-features = false, features = ["serde", "publish"] }  
4serde = { version = "1.0", default-features = false }  
`
```

#### Source code

Clone the GitHub repository:

```
`1git clone https://github.com/pubnub/rust  
`
```

## Steps

### Initialize PubNub

- Server-side applications
- Embedded systems

Replace placeholder keys with your keyset:

```
1use pubnub::dx::*;  
2use pubnub::core::*;  
3use serde_json::json;  
4
  
5#[tokio::main]  
6async fn main() -> Result(), Boxdyn std::error::Error>> {  
7    // Set up PubNub configuration  
8    let pubnub = PubNubClientBuilder::with_reqwest_transport()  
9        .with_keyset(Keyset {  
10            subscribe_key: "demo",      // Replace with your subscribe key  
11            publish_key: Some("demo"),  // Replace with your publish key  
12            secret_key: None,  
13        })  
14        .with_user_id("rust-server-user")  
15        .build()?;  
16      
17    println!("PubNub client initialized successfully!");  
18      
19    // We'll add more code here in the next steps  
20      
21    Ok(())  
22}  
```

Embedded conceptual example (implement a Transport for your target):

```
1// Note: This is a conceptual example.   
2// You'll need to adapt this to your specific embedded target.  
3
  
4use pubnub::dx::*;  
5use pubnub::core::*;  
6use pubnub::transport::*;  
7
  
8// First, implement a transport that works with your environment  
9struct MinimalTransport;  
10
  
11impl Transport for MinimalTransport {  
12    // Implement the Transport trait methods here  
13    // This is a simplified example and not fully functional  
14    // See the PubNub Rust SDK documentation for complete implementation details  
15    // ...  
16}  
17
  
18fn init_pubnub() -> ResultPubNubClientMinimalTransport>, PubNubError> {  
19    // Create a transport instance  
20    let transport = MinimalTransport;  
21      
22    // Set up PubNub with minimal configuration  
23    let pubnub = PubNubClientBuilder::with_transport(transport)  
24        .with_keyset(Keyset {  
25            subscribe_key: "demo",      // Replace with your subscribe key  
26            publish_key: Some("demo"),  // Replace with your publish key  
27            secret_key: None,  
28        })  
29        .with_user_id("rust-embedded-device")  
30        .build()?;  
31      
32    Ok(pubnub)  
33}  
34
  
35// In your main function or initialization code  
36fn main() -> Result(), PubNubError> {  
37    let pubnub = init_pubnub()?;  
38      
39    // Your embedded application code  
40      
41    Ok(())  
42}  
```

### Set up event listeners

- Server-side applications
- Embedded systems

Async streams for status and events:

```
1// Import required event handling traits  
2use pubnub::dx::subscribe::Update;  
3use pubnub::subscribe::{Subscriber, EventSubscriber};  
4use futures::StreamExt;  
5
  
6// Listen for client status changes  
7tokio::spawn(pubnub.status_stream().for_each(|status| async move {  
8    println!("\nStatus: {:?}", status)  
9}));  
10
  
11// Listen for all subscription events  
12tokio::spawn(subscription.stream().for_each(|event| async move {  
13    match event {  
14        Update::Message(message) | Update::Signal(message) => {  
15            // Process incoming messages  
16            if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {  
17                if let Ok(cleaned) = serde_json::from_str::String>(&utf8_message) {  
18                    println!("Message received: {}", cleaned);  
19                }  
20            }  
21        }  
22        Update::Presence(presence) => {  
23            println!("Presence event: {:?}", presence)  
24        }  
25        Update::AppContext(object) => {  
26            println!("Object update: {:?}", object)  
27        }  
28        Update::MessageAction(action) => {  
29            println!("Message action: {:?}", action)  
30        }  
31        Update::File(file) => {  
32            println!("File received: {:?}", file)  
33        }  
34    }  
35}));  
```

Specific events only:

```
`1// Only listen for message events on a specific channel  
2tokio::spawn(  
3    channel_subscription  
4        .messages_stream()  
5        .for_each(|message| async move {  
6            if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {  
7                if let Ok(cleaned) = serde_json::from_str::String>(&utf8_message) {  
8                    println!("Message received: {}", cleaned);  
9                }  
10            }  
11        })  
12);  
`
```

Embedded compact handling:

```
`1// Use a more compact approach for resource-constrained environments  
2tokio::spawn(subscription.messages_stream().for_each(|message| async move {  
3    // Only process the specific fields needed rather than the entire message  
4    if let Ok(text) = String::from_utf8(message.data.clone()) {  
5        // Process the message with minimal allocations  
6        // ...  
7    }  
8}));  
`
```

### Create a subscription

- Server-side applications
- Embedded systems

```
1use pubnub::subscribe::SubscriptionParams;  
2
  
3// Subscribe to a single channel  
4let subscription = pubnub.subscription(SubscriptionParams {  
5    channels: Some(&["my_channel"]),  
6    channel_groups: None,  
7    options: None  
8});  
9
  
10// Or create a subscription from a channel entity  
11let channel = pubnub.channel("my_channel");  
12let channel_subscription = channel.subscription(None);  
13
  
14// Activate the subscriptions  
15subscription.subscribe();  
16channel_subscription.subscribe();  
17
  
18println!("Subscribed to channels");  
```

Embedded minimal usage:

```
1// Create a minimal subscription with only required features  
2let channel = pubnub.channel("my_channel");  
3let subscription = channel.subscription(None);  
4subscription.subscribe();  
5  
6// For very constrained systems, you might want to use specific options  
7// to limit resource usage  
```

### Publish messages

- Server-side applications
- Embedded systems

```
1// Wait a moment for the subscription to establish  
2tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;  
3  
4// Send a message to the channel  
5match pubnub  
6    .publish_message("hello world!")  
7    .channel("my_channel")  
8    .r#type("text-message")  // Optional: specify a message type  
9    .execute()  
10    .await {  
11        Ok(result) => {  
12            println!("Message published successfully! Timetoken: {}", result.timetoken);  
13        }  
14        Err(err) => {  
15            println!("Failed to publish message: {:?}", err);  
16        }  
17}  
```

Embedded minimized allocations:

```
1// Create a simple message with minimal allocations  
2let message = r#"{"text":"Hello from embedded device"}"#;  
3  
4// Publish the message with minimal overhead  
5let result = pubnub.publish_message(message)  
6    .channel("my_channel")  
7    .store(false) // Don't store the message to save bandwidth  
8    .execute()  
9    .await;  
10  
11// Process the result with minimal allocations  
12match result {  
13    Ok(publish_result) => {  
14        // Message was published successfully  
15        // Process the timetoken if needed  
16        let _timetoken = publish_result.timetoken;  
17    }  
18    Err(err) => {  
19        // Handle error  
20        // Log error or retry based on error type  
21        if let PubNubError::TransportError(_) = err {  
22            // Network error, might want to retry  
23        }  
24    }  
25}  
```

### Clean up resources

- Server-side applications
- Embedded systems

```
1// Unsubscribe from the channel  
2subscription.unsubscribe();  
3  
4// Remove listeners to avoid memory leaks  
5pubnub.remove_all_listeners();  
6  
7// For more thorough cleanup, you can also destroy the client  
8// which will unsubscribe from all channels and remove all listeners  
9pubnub.destroy();  
10  
11println!("Cleaned up PubNub resources");  
```

Embedded:

```
1// Unsubscribe from channels to stop receiving messages  
2subscription.unsubscribe();  
3  
4// Clean up resources  
5pubnub.remove_all_listeners();  
6pubnub.destroy();  
```

### Run the app

- Server-side applications
- Embedded systems

To run:
1. $1
2. $1

If using async code, include tokio in Cargo.toml:

```
`1[dependencies]  
2pubnub = "0.7.0"  
3serde = "1.0"  
4serde_json = "1.0"  
5tokio = { version = "1", features = ["full"] }  
`
```

Tokio runtime in main:

```
`1#[tokio::main]  
2async fn main() -> Result(), Boxdyn std::error::Error>> {  
3    // Your code here  
4    Ok(())  
5}  
`
```

Embedded targets:
- Configure build for your target architecture
- If using no_std, set Cargo.toml:

```
`1[dependencies]  
2pubnub = { version = "0.7.0", default-features = false, features = ["serde", "publish"] }  
3# Add other dependencies specific to your embedded target  
`
```

- Build with cargo build --target your-target-triple
- Flash to your device

Expected output:

```
`1PubNub client initialized successfully!  
2Subscribed to channel: my_channel  
3Connected to PubNub network  
4Message published successfully! Timetoken: 16967543908123456  
5Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
6Global listener: Received message on channel 'my_channel': {"text":"Hello, world!","sender":"Rust Server"}  
`
```

## Complete example

```
1use pubnub::subscribe::Subscriber;  
2use futures::StreamExt;  
3use tokio::time::sleep;  
4use std::time::Duration;  
5use serde_json;  
6use pubnub::{  
7    dx::subscribe::Update,  
8    subscribe::{EventSubscriber, EventEmitter, SubscriptionParams},  
9    Keyset, PubNubClientBuilder,  
10};  
11
  
12#[tokio::main]  
13async fn main() -> Result(), Boxdyn std::error::Error>> {  
14    // Set up PubNub configuration  
15    let publish_key = "demo";  // Replace with your publish key  
16    let subscribe_key = "demo"; // Replace with your subscribe key  
17      
18    let pubnub = PubNubClientBuilder::with_reqwest_transport()  
19        .with_keyset(Keyset {  
20            subscribe_key,  
21            publish_key: Some(publish_key),  
22            secret_key: None,  
23        })  
24        .with_user_id("rust-server-user")  
25        .build()?;  
26  
27    println!("PubNub client initialized successfully!");  
28  
29    // Create a subscription to a channel  
30    let subscription = pubnub.subscription(SubscriptionParams {  
31        channels: Some(&["my_channel"]),  
32        channel_groups: None,  
33        options: None  
34    });  
35  
36    // Create another subscription using a channel entity  
37    let channel_entity = pubnub.channel("my_channel_2");  
38    let channel_entity_subscription = channel_entity.subscription(None);  
39  
40    // Activate the subscriptions  
41    subscription.subscribe();  
42    channel_entity_subscription.subscribe();  
43  
44    println!("Subscribed to channels");  
45  
46    // Listen for client status changes  
47    tokio::spawn(pubnub.status_stream().for_each(|status| async move {  
48        println!("\nStatus: {:?}", status)  
49    }));  
50      
51    // Listen for all types of events  
52    tokio::spawn(subscription.stream().for_each(|event| async move {  
53        match event {  
54            Update::Message(message) | Update::Signal(message) => {  
55                // Process incoming messages  
56                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {  
57                    if let Ok(cleaned) = serde_json::from_str::String>(&utf8_message) {  
58                        println!("Message received: {}", cleaned);  
59                    }  
60                }  
61            }  
62            Update::Presence(presence) => {  
63                println!("Presence event: {:?}", presence)  
64            }  
65            Update::AppContext(object) => {  
66                println!("Object update: {:?}", object)  
67            }  
68            Update::MessageAction(action) => {  
69                println!("Message action: {:?}", action)  
70            }  
71            Update::File(file) => {  
72                println!("File received: {:?}", file)  
73            }  
74        }  
75    }));  
76  
77    // Only listen for message events on the second channel  
78    tokio::spawn(  
79        channel_entity_subscription  
80            .messages_stream()  
81            .for_each(|message| async move {  
82                if let Ok(utf8_message) = String::from_utf8(message.data.clone()) {  
83                    if let Ok(cleaned) = serde_json::from_str::String>(&utf8_message) {  
84                        println!("Message received on channel 2: {}", cleaned);  
85                    }  
86                }  
87            }),  
88    );  
89  
90    // Wait a moment for the subscriptions to establish  
91    sleep(Duration::from_secs(2)).await;  
92  
93    // Send a message to the first channel  
94    pubnub  
95        .publish_message("hello world!")  
96        .channel("my_channel")  
97        .r#type("text-message")  
98        .execute()  
99        .await?;  
100  
101    // Send a message to the second channel  
102    pubnub  
103        .publish_message("hello world on the other channel!")  
104        .channel("my_channel_2")  
105        .r#type("text-message")  
106        .execute()  
107        .await?;  
108  
109    // Keep the program running to receive the published messages  
110    sleep(Duration::from_secs(15)).await;  
111  
112    // Clean up resources (uncomment if needed for your use case)  
113    // subscription.unsubscribe();  
114    // channel_entity_subscription.unsubscribe();  
115  
116    Ok(())  
117}  
```

### Troubleshooting

- No connection message:
  - Check internet connection
  - Verify publish/subscribe keys
  - Ensure firewall doesn’t block PubNub
- Message not received:
  - Verify channel names and that you are subscribed
  - Check publish result/errors
  - Allow time for delivery
- Build errors:
  - Verify PubNub dependency
  - Use a compatible Rust version (1.65.0+ recommended)
  - Check imports
- Runtime errors:
  - Ensure tokio runtime is set up
  - Handle errors via match or ? operator

## Next steps

- Try Presence, Access Manager, and CryptoModule
- See examples folder and GitHub repository
- Read SDK reference docs
- Join Discord community or visit support portal
- Use the AI assistant for help