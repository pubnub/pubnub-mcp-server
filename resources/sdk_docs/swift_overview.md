On this page
# Swift API & SDK Docs 9.2.1

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Swift application. Since Swift is commonly used across different platforms, we provide two implementation paths:

- **SwiftUI**: For developers building iOS apps using SwiftUI

- **UIKit**: For developers building iOS apps using UIKit

The core PubNub concepts and API usage remain the same across both paths, but implementation details like lifecycle management and UI updates differ. Select the appropriate tab in each section to see platform-specific guidance.

While this guide focuses on Swift for Apple platforms, the PubNub Swift SDK is also compatible with Linux environments.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Swift

- Xcode 14.0 or later

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

Choose one of these methods to add the Swift SDK to your iOS app:

#### Swift Package Manager[​](#swift-package-manager)

1. $1

2. $1

3. $1

4. $1

5. $1

#### CocoaPods[​](#cocoapods)

Install CocoaPods if you haven't already: `gem install cocoapods`

Add PubNub to your `Podfile`:

```
`pod 'PubNubSwift', '~> 9.2.1'  
`
```

Run `pod install` in your project directory

Open the generated `.xcworkspace` file

#### Carthage[​](#carthage)

Add PubNub to your `Cartfile`:

```
`github "pubnub/swift" ~> 9.2.1  
`
```

Run `carthage update --use-xcframeworks`.

Drag the built `PubNub.xcframework` into your Xcode project's **Frameworks, Libraries, and Embedded Content** section.

You can integrate the PubNub Swift SDK into any Swift application:

#### Swift Package Manager[​](#swift-package-manager-1)

Add PubNub as a dependency to your `Package.swift` file:

```
`dependencies: [  
  .package(url: "https://github.com/pubnub/swift.git", from: "9.2.1")  
]  
`
```

#### Manual integration[​](#manual-integration)

Clone the repository:

```
`git clone https://github.com/pubnub/swift.git  
`
```

Include the Swift package in your project as a dependency.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

In your Swift application, you'll need to initialize the PubNub client with your unique keys to establish a connection to the PubNub network. This is the minimum configuration required to send and receive messages with PubNub in your application.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

- SwiftUI
- UIKit

Create a view model class and keep a strong reference to your PubNub instance:

```
`import SwiftUI  
import PubNubSDK  
  
class PubNubViewModel: ObservableObject {  
  // Reference to the SDK instance  
  private let pubnub: PubNub  
  
  init() {  
    // PubNub instance configured with publish/subscribe keys and unique user ID  
    pubnub = PubNub(configuration: PubNubConfiguration(  
      publishKey: "demo",  
      subscribeKey: "demo",  
      userId: "device-\(UUID().uuidString.prefix(8))"  
    ))      
  }  
`
```
show all 16 lines

Initialize the view model in your `App` entry point:

```
`import SwiftUI  
import PubNubSDK  
  
@main  
struct MyApp: App {  
  var body: some Scene {  
    WindowGroup {  
      ContentView()  
        .environmentObject(PubNubViewModel())  
    }  
  }  
}  
`
```

Access the view model in your view using `@EnvironmentObject`:

```
`import SwiftUI  
import PubNubSDK  
  
struct ContentView: View {  
  @EnvironmentObject var pubNubViewModel: PubNubViewModel  
    
  var body: some View {  
    Text("Hello, PubNub!")  
  }  
}  
`
```

In your view controller, create a PubNub instance and store it as a strong reference:

```
`import UIKit  
import PubNubSDK  
  
// A view controller that demonstrates basic PubNub functionality  
class ViewController: UIViewController {  
  // PubNub instance configured with publish/subscribe keys and unique user ID  
  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "device-\(UUID().uuidString.prefix(8))"  
  ))  
}  
`
```

For more information, refer to the [Configuration](/docs/sdks/swift/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event received. This is essential for building interactive real-time applications with PubNub.

- SwiftUI
- UIKit

Add a `@Published` property to `PubNubViewModel` to store incoming messages:

```
`@Published var messages: [String] = []  
`
```

In the same class, create a `Subscription` object for your channel and set up event listeners in the `setupMessageHandling()` method to handle PubNub events:

```
`import SwiftUI  
import PubNubSDK  
  
class PubNubViewModel: ObservableObject {  
  // Holds the streamed messages  
  @Published var messages: [String] = []  
  // Reference to the SDK instance  
  private let pubnub: PubNub  
  
  // A dedicated subscription object for the example chat channel  
  lazy var subscription: Subscription? = pubnub  
    .channel("hello_world")  
    .subscription(options: ReceivePresenceEvents())  
  
  init() {  
`
```
show all 49 lines

Create a `Subscription` object for your channel and set up event listeners in the `setupMessageHandling()` method to handle PubNub events:

```
`import UIKit  
import PubNubSDK  
  
// A view controller that demonstrates basic PubNub chat functionality  
class ViewController: UIViewController {  
  // PubNub instance configured with publish/subscribe keys and unique user ID  
  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "device-\(UUID().uuidString.prefix(8))"  
  ))  
  
  // A dedicated subscription object for the example chat channel  
  private lazy var subscription: Subscription? = pubnub  
    .channel("hello_world")  
`
```
show all 62 lines

For more information, refer to the [Listeners](/docs/sdks/swift/api-reference/configuration#event-listeners) section of the SDK documentation.

### Trigger a subscription[​](#trigger-a-subscription)

To receive messages sent to a particular channel, you *subscribe* to it. When you subscribe to a channel, you'll receive all messages published to that channel in real-time.

It is best to define the subscription before you introduce the listeners and then send the `subscribe()` call, so place the relevant code in the appropriate places within your app.

- SwiftUI
- UIKit

The following example demonstrates how to subscribe to a channel when a view appears and unsubscribe when it disappears:

```
`import SwiftUI  
import PubNubSDK  
  
struct ContentView: View {  
  @EnvironmentObject var pubNubViewModel: PubNubViewModel  
    
  var body: some View {  
    List(pubNubViewModel.messages, id: \.self) { message in  
      Text(message)  
    }  
    .onAppear {  
      pubNubViewModel.subscription?.subscribe()  
    }  
    .onDisappear {  
      pubNubViewModel.subscription?.unsubscribe()  
`
```

show all 18 linesThe following example shows how to subscribe to a channel when the view appears and unsubscribe when it disappears by overriding `viewWillAppear(_:)` and `viewWillDisappear(_:)` in your view controller:

```
`override func viewWillAppear(_ animated: Bool) {  
  super.viewWillAppear(animated)  
  // Subscribe to the channel  
  subscription?.subscribe()  
}  
    
override func viewWillDisappear(_ animated: Bool) {  
  super.viewWillDisappear(animated)      
  // Unsubscribe when view disappears  
  subscription?.unsubscribe()  
}  
`
```

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who subscribes to that channel. In this app, publishing a message is triggered when the status listener detects a successful connection to a channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

- SwiftUI
- UIKit

Implement the `sendWelcomeMessage()` method defined earlier:

```
`// Called when the connection is established  
func sendWelcomeMessage() {  
  pubnub.publish(  
    channel: "hello_world",  
    message: "Hello from iOS!"  
  ) { result in  
    switch result {  
    case .success(let response):  
      print("Message published successfully at \(response.timetokenDate)")  
    case .failure(let error):  
       print("Failed to publish message: \(error.localizedDescription)")  
    }  
  }  
}  
`
```

Implement the `sendWelcomeMessage()` method defined earlier:

```
`// Called when the connection is established  
func sendWelcomeMessage() {  
  pubnub.publish(  
    channel: "hello_world",  
    message: "Hello from iOS!"  
  ) { result in  
    switch result {  
    case .success(let response):  
      print("Message published successfully at \(response.timetokenDate)")  
    case .failure(let error):  
       print("Failed to publish message: \(error.localizedDescription)")  
    }  
  }  
}  
`
```

### Run the app[​](#run-the-app)

Once you've implemented the initialization, event listeners, subscription, and publishing functionality, you're ready to run your application and test the real-time messaging capabilities.

Follow these steps:

1. $1

2. $1

3. $1

4. $1

When you run the application, you should see output similar to the following:

```
`Connection status changed: connected  
Message published successfully at 2023-10-23 15:42:36 +0000  
Message received: Hello from iOS!  
`
```

## Complete example[​](#complete-example)

Download the complete working example that puts everything together.

- SwiftUI
- UIKit

[Getting Started guide - SwiftUI](/assets/files/GettingStarted-SwiftUI-4f196125968319f1608bd23f5da28e8f.zip)

[Getting Started guide - UIKit](/assets/files/GettingStarted-UIKit-6183c005507ed2c3049122120f159a4a.zip)

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
- Check that you're using a compatible version of Swift.
- Make sure all imports are correct.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Learn about the [Swift Chat SDK](/docs/chat/swift-chat-sdk) for ready-to-use chat features.

- Implement user [presence](/docs/sdks/swift/api-reference/presence) to show who's online.

- Add typing indicators and read receipts.

- Try out [Presence](/docs/sdks/swift/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/swift/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/swift/api-reference/access-manager) to secure your channels.

- Explore our [GitHub repository](https://github.com/pubnub/swift/) for more code samples.

- Check out our [SDK reference documentation](/docs/sdks/swift/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **May 22, 2025**