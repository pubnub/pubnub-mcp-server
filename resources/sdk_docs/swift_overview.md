# Swift API & SDK Docs 10.0.1

This guide shows how to set up PubNub in Swift with SwiftUI or UIKit and covers: connection, sending messages, and receiving messages in real time. The Swift SDK also supports Linux.

## Overview

Two paths are provided:
- SwiftUI (iOS apps using SwiftUI)
- UIKit (iOS apps using UIKit)

Core API usage is the same; lifecycle and UI patterns differ.

## Prerequisites

- Basic Swift knowledge
- Xcode 14.0+
- PubNub account

## Setup

### Get your PubNub keys

- Sign in or create an account in the PubNub Admin Portal.
- Create an app and get your publish and subscribe keys.
- Use separate keysets for dev/prod when possible.

### Install the SDK

Always use the latest SDK version.

#### CocoaPods

Install CocoaPods if needed: `gem install cocoapods`

Add PubNub to your Podfile:

```
`pod 'PubNubSwift', '~> 10.0.1'  
`
```

Run `pod install`, then open the `.xcworkspace`.

#### Carthage

Add to your Cartfile:

```
`github "pubnub/swift" ~> 10.0.1  
`
```

Run `carthage update --use-xcframeworks`, then add `PubNub.xcframework` to Frameworks, Libraries, and Embedded Content.

#### Swift Package Manager

Add PubNub as a dependency to Package.swift:

```
`dependencies: [  
  .package(url: "https://github.com/pubnub/swift.git", from: "10.0.1")  
]  
`
```

#### Source code

Clone the GitHub repository:

```
`git clone https://github.com/pubnub/swift.git  
`
```

Include the Swift package in your project.

## Steps

### Initialize PubNub

Replace demo keys with your own publish/subscribe keys.

- SwiftUI
- UIKit

Create a view model and hold a strong reference to PubNub:

```
1import SwiftUI  
2import PubNubSDK  
3
  
4class PubNubViewModel: ObservableObject {  
5  // Reference to the SDK instance  
6  private let pubnub: PubNub  
7
  
8  init() {  
9    // PubNub instance configured with publish/subscribe keys and unique user ID  
10    pubnub = PubNub(configuration: PubNubConfiguration(  
11      publishKey: "demo",  
12      subscribeKey: "demo",  
13      userId: "device-\(UUID().uuidString.prefix(8))"  
14    ))      
15  }  
16}  
```

Initialize the view model in your App entry point:

```
1import SwiftUI  
2import PubNubSDK  
3
  
4@main  
5struct MyApp: App {  
6  var body: some Scene {  
7    WindowGroup {  
8      ContentView()  
9        .environmentObject(PubNubViewModel())  
10    }  
11  }  
12}  
```

Access the view model in your view:

```
1import SwiftUI  
2import PubNubSDK  
3
  
4struct ContentView: View {  
5  @EnvironmentObject var pubNubViewModel: PubNubViewModel  
6    
7  var body: some View {  
8    Text("Hello, PubNub!")  
9  }  
10}  
```

UIKit: Create and store a PubNub instance:

```
1import UIKit  
2import PubNubSDK  
3
  
4// A view controller that demonstrates basic PubNub functionality  
5class ViewController: UIViewController {  
6  // PubNub instance configured with publish/subscribe keys and unique user ID  
7  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
8    publishKey: "demo",  
9    subscribeKey: "demo",  
10    userId: "device-\(UUID().uuidString.prefix(8))"  
11  ))  
12}  
```

For more information, refer to the Configuration section of the SDK documentation.

### Set up event listeners

Set up listeners for connection state and messages.

- SwiftUI
- UIKit

Add a messages store:

```
`1@Published var messages: [String] = []  
`
```

Create a Subscription and listeners:

```
1import SwiftUI  
2import PubNubSDK  
3
  
4class PubNubViewModel: ObservableObject {  
5  // Holds the streamed messages  
6  @Published var messages: [String] = []  
7  // Reference to the SDK instance  
8  private let pubnub: PubNub  
9
  
10  // A dedicated subscription object for the example chat channel  
11  lazy var subscription: Subscription? = pubnub  
12    .channel("hello_world")  
13    .subscription(options: ReceivePresenceEvents())  
14
  
15  init() {  
16    pubnub = PubNub(configuration: PubNubConfiguration(  
17      publishKey: "demo",  
18      subscribeKey: "demo",  
19      userId: "device-\(UUID().uuidString.prefix(8))"  
20    ))  
21
  
22    setupConnectionHandling()  
23    setupMessageHandling()  
24  }  
25    
26  private func setupConnectionHandling() {  
27    pubnub.onConnectionStateChange = { [weak self] newStatus in  
28      print("Connection status changed: \(newStatus)")  
29
  
30      // When connected, publish a welcome message  
31      if case .connected = newStatus {  
32        self?.sendWelcomeMessage()  
33      } else {  
34        // Handle other connection states according to your needs  
35      }  
36    }  
37  }  
38
  
39  private func setupMessageHandling() {  
40    subscription?.onMessage = { [weak self] message in  
41      print("Message received: \(message.payload.stringOptional ?? "N/A")")  
42      self?.messages.append(message.payload.stringOptional ?? "N/A")  
43    }  
44  }  
45    
46  private func sendWelcomeMessage() {  
47    // This function will be defined in the next section  
48  }  
49}  
```

UIKit: Subscription and listeners:

```
1import UIKit  
2import PubNubSDK  
3
  
4// A view controller that demonstrates basic PubNub chat functionality  
5class ViewController: UIViewController {  
6  // PubNub instance configured with publish/subscribe keys and unique user ID  
7  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
8    publishKey: "demo",  
9    subscribeKey: "demo",  
10    userId: "device-\(UUID().uuidString.prefix(8))"  
11  ))  
12
  
13  // A dedicated subscription object for the example chat channel  
14  private lazy var subscription: Subscription? = pubnub  
15    .channel("hello_world")  
16    .subscription(queue: .main, options: ReceivePresenceEvents()  
17  )  
18    
19  override func viewDidLoad() {  
20    super.viewDidLoad()  
21    setupConnectionHandling()  
22    setupMessageHandling()  
23  }  
24    
25  private func setupConnectionHandling() {  
26    pubnub.onConnectionStateChange = { [weak self] newStatus in  
27      print("Connection status changed: \(newStatus)")  
28
  
29      // Connection status changes are posted on the main thread.  
30      // No manual synchronization needed  
31      self?.updateConnectionStatus(newStatus)  
32  
33      // When connected, publish a welcome message  
34      if case .connected = newStatus {  
35        self?.sendWelcomeMessage()  
36      } else {  
37        // Handle other connection states according to your needs  
38      }  
39    }  
40  }  
41
  
42  private func setupMessageHandling() {  
43    subscription?.onMessage = { [weak self] message in  
44      print("Message received: \(message.payload.stringOptional ?? "")")  
45      self?.displayMessage(message)  
46    }  
47  }  
48
  
49  private func displayMessage(_ message: PubNubMessage) {  
50    // Update your UI to display the message  
51    // For example, add it to a UITableView or UILabel  
52  }  
53
  
54  private func updateConnectionStatus(_ status: ConnectionStatus) {  
55    // Update UI to reflect connection status  
56    // For example, change a status indicator color  
57  }  
58
  
59  private func sendWelcomeMessage() {  
60    // This function will be defined in the next section  
61  }  
62}  
```

For more information, refer to the Listeners section of the SDK documentation.

### Trigger a subscription

Subscribe to receive messages and unsubscribe when done.

- SwiftUI
- UIKit

SwiftUI example:

```
1import SwiftUI  
2import PubNubSDK  
3
  
4struct ContentView: View {  
5  @EnvironmentObject var pubNubViewModel: PubNubViewModel  
6    
7  var body: some View {  
8    List(pubNubViewModel.messages, id: \.self) { message in  
9      Text(message)  
10    }  
11    .onAppear {  
12      pubNubViewModel.subscription?.subscribe()  
13    }  
14    .onDisappear {  
15      pubNubViewModel.subscription?.unsubscribe()  
16    }  
17  }  
18}  
```

UIKit example:

```
`1override func viewWillAppear(_ animated: Bool) {  
2  super.viewWillAppear(animated)  
3  // Subscribe to the channel  
4  subscription?.subscribe()  
5}  
6    
7override func viewWillDisappear(_ animated: Bool) {  
8  super.viewWillDisappear(animated)      
9  // Unsubscribe when view disappears  
10  subscription?.unsubscribe()  
11}  
`
```

For more information, refer to the Subscribe section of the SDK documentation.

### Publish messages

Publish to a channel; subscribers receive the message in real time. Messages must be JSON-serializable and < 32 KiB.

- SwiftUI
- UIKit

SwiftUI:

```
`1// Called when the connection is established  
2func sendWelcomeMessage() {  
3  pubnub.publish(  
4    channel: "hello_world",  
5    message: "Hello from iOS!"  
6  ) { result in  
7    switch result {  
8    case .success(let response):  
9      print("Message published successfully at \(response.timetokenDate)")  
10    case .failure(let error):  
11       print("Failed to publish message: \(error.localizedDescription)")  
12    }  
13  }  
14}  
`
```

UIKit:

```
`1// Called when the connection is established  
2func sendWelcomeMessage() {  
3  pubnub.publish(  
4    channel: "hello_world",  
5    message: "Hello from iOS!"  
6  ) { result in  
7    switch result {  
8    case .success(let response):  
9      print("Message published successfully at \(response.timetokenDate)")  
10    case .failure(let error):  
11       print("Failed to publish message: \(error.localizedDescription)")  
12    }  
13  }  
14}  
`
```

For more information, refer to the Publish section of the SDK documentation.

### Run the app

Expected console output:

```
`Connection status changed: connected  
Message published successfully at 2023-10-23 15:42:36 +0000  
Message received: Hello from iOS!  
`
```

## Complete example

Download the complete example:

- SwiftUI: [Getting Started guide - SwiftUI](/assets/files/GettingStarted-SwiftUI-4f196125968319f1608bd23f5da28e8f.zip)
- UIKit: [Getting Started guide - UIKit](/assets/files/GettingStarted-UIKit-6183c005507ed2c3049122120f159a4a.zip)

### Troubleshooting

No connection message
- Check internet connectivity.
- Verify publish/subscribe keys.
- Ensure no firewall blocks PubNub.

Message not received
- Confirm subscription to the correct channel.
- Check publish result for errors.
- Allow time for delivery.

Build errors
- Verify dependency integration.
- Check Swift version compatibility.
- Ensure correct imports.

## Next steps

- Learn about the Swift Chat SDK for ready-to-use chat features.
- Add typing indicators and read receipts.
- Use Presence to track online/offline status.
- Implement Message Persistence to store/retrieve messages.
- Use Access Manager to secure channels.
- Explore the GitHub repository for more samples.
- See the SDK reference documentation for detailed APIs.
- Visit the support portal for help.