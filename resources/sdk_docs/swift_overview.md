# Swift API & SDK Docs 9.2.1 – Overview (condensed)

PubNub Swift SDK works on Apple (SwiftUI / UIKit) and Linux.  
Key tasks: initialize the client, add listeners, subscribe, publish.

## Prerequisites
• Swift basics   • Xcode 14+   • PubNub publish & subscribe keys

## Get your PubNub keys
1. Sign in / create account on PubNub Admin Portal.  
2. Create an app → copy its publish & subscribe keys (use separate keysets per environment).

## Install the SDK (always use latest)
### Swift Package Manager
Add in Xcode or edit *Package.swift*:

```
`dependencies: [  
  .package(url: "https://github.com/pubnub/swift.git", from: "9.2.1")  
]  
`
```

### CocoaPods

```
`pod 'PubNubSwift', '~> 9.2.1'  
`
```

Run `pod install`, then open the *.xcworkspace*.

### Carthage

```
`github "pubnub/swift" ~> 9.2.1  
`
```

Run `carthage update --use-xcframeworks` and add `PubNub.xcframework` to the target.

### Manual

```
`git clone https://github.com/pubnub/swift.git  
`
```

Add the package as a dependency.

---

## Initialize PubNub
SwiftUI – keep a strong reference in a view-model:

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

App entry point:

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

Simple view:

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

UIKit:

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

---

## Event listeners
Add storage for messages:

```
`@Published var messages: [String] = []  
`
```

SwiftUI listener setup (excerpt):

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

UIKit listener setup (excerpt):

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

## Subscribe / Unsubscribe
SwiftUI:

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

UIKit:

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

## Publish
Same implementation for both UI frameworks:

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

## Example console output

```
`Connection status changed: connected  
Message published successfully at 2023-10-23 15:42:36 +0000  
Message received: Hello from iOS!  
`
```

---

For detailed API reference, presence, storage, access manager, and full sample apps, visit the links in the original documentation.