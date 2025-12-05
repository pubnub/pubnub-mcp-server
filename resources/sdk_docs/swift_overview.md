# Swift API & SDK Docs 10.1.0

Core concepts:
- Setting up a connection
- Sending messages
- Receiving messages in real time

## Overview

SwiftUI and UIKit examples; API usage is the same, with platform-specific lifecycle/UI handling. Swift SDK also supports Linux.

## Prerequisites

- Swift basics
- Xcode 14.0+
- PubNub account and keyset

## Setup

### Get your PubNub keys

- Sign in or create an account in the Admin Portal.
- Create an app or use an existing one.
- Get your publish and subscribe keys from the app’s keyset. Use separate keysets for dev/prod.

### Install the SDK

Always use the latest SDK version.

#### CocoaPods

Install CocoaPods if needed: `gem install cocoapods`

Add PubNub to your Podfile:

```
`pod 'PubNubSwift', '~> 10.1.0'  
`
```

Run `pod install` and open the generated `.xcworkspace`.

#### Carthage

Add PubNub to your Cartfile:

```
`github "pubnub/swift" ~> 10.1.0  
`
```

Run `carthage update --use-xcframeworks` and add `PubNub.xcframework` to Frameworks, Libraries, and Embedded Content.

You can integrate the PubNub Swift SDK into any Swift application:

#### Swift Package Manager

Add PubNub as a dependency to your Package.swift:

```
`dependencies: [  
  .package(url: "https://github.com/pubnub/swift.git", from: "10.1.0")  
]  
`
```

#### Source code

Clone the GitHub repository:

```
`git clone https://github.com/pubnub/swift.git  
`
```

Include the Swift package in your project as a dependency.

## Steps

### Initialize PubNub

Replace demo keys with your publish/subscribe keys.

- SwiftUI

Create a view model class and keep a strong reference to your PubNub instance:

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

- UIKit

Create a PubNub instance and store it as a strong reference:

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

See Configuration for more details: /docs/sdks/swift/api-reference/configuration

### Set up event listeners

Implement listeners for connection and message events.

- SwiftUI

Add a property for incoming messages:

```
`1@Published var messages: [String] = []  
`
```

Create a Subscription and set up event listeners:

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

- UIKit

Create a Subscription and set up event listeners:

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

More details: /docs/sdks/swift/api-reference/configuration#event-listeners

### Trigger a subscription

Subscribe to receive messages on a channel; unsubscribe as needed.

- SwiftUI

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

- UIKit

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

More details: /docs/sdks/swift/api-reference/publish-and-subscribe#subscribe

### Publish messages

Publish JSON-serializable payloads (< 32 KiB). In examples below, publish on successful connection.

- SwiftUI

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

- UIKit

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

More details: /docs/sdks/swift/api-reference/publish-and-subscribe#publish

### Run the app

Build and run the app. Expected output:

```
`Connection status changed: connected  
Message published successfully at 2023-10-23 15:42:36 +0000  
Message received: Hello from iOS!  
`
```

## Complete example

- SwiftUI
- UIKit

[Getting Started guide - SwiftUI](/assets/files/GettingStarted-SwiftUI-4f196125968319f1608bd23f5da28e8f.zip)

[Getting Started guide - UIKit](/assets/files/GettingStarted-UIKit-6183c005507ed2c3049122120f159a4a.zip)

### Troubleshooting

No connection message
- Check internet connection.
- Verify keys.
- Ensure no firewall is blocking PubNub.

Message not received
- Verify subscribed channel.
- Confirm publish succeeded (check errors).
- Allow time for delivery.

Build errors
- Confirm dependency integration.
- Check Swift version compatibility.
- Verify imports.

## Next steps

- Learn about the Swift Chat SDK: /docs/chat/swift-chat-sdk
- Presence: /docs/sdks/swift/api-reference/presence
- Message Persistence: /docs/sdks/swift/api-reference/storage-and-playback
- Access Manager: /docs/sdks/swift/api-reference/access-manager
- SDK reference: /docs/sdks/swift/api-reference/configuration
- GitHub examples: https://github.com/pubnub/swift/
- Support: https://support.pubnub.com/

Last updated on Sep 3, 2025