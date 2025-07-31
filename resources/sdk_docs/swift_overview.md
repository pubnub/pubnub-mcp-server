# Swift API & SDK Docs 9.2.1 – Overview

This condensed overview keeps all critical setup details, method signatures, parameters, and code examples for integrating PubNub into a Swift project (SwiftUI or UIKit).  

---

## Prerequisites
• Swift knowledge  
• Xcode 14+  
• PubNub publish & subscribe keys  

---

## Get Your Keys
Create/choose an app in the PubNub Admin Portal and copy the generated **publish** and **subscribe** keys (create separate keysets for prod/dev as needed).

---

## Install the SDK (always use the latest version)

### CocoaPods
```
`pod 'PubNubSwift', '~> 9.2.1'  
`
```

### Carthage
```
`github "pubnub/swift" ~> 9.2.1  
`
```

### Swift Package Manager
```
`dependencies: [  
  .package(url: "https://github.com/pubnub/swift.git", from: "9.2.1")  
]  
`
```

### Manual
```
`git clone https://github.com/pubnub/swift.git  
`
```

---

## Initialize PubNub

### SwiftUI (View-model keeps a strong reference)
```
`import SwiftUI  
import PubNubSDK  
  
class PubNubViewModel: ObservableObject {  
  private let pubnub: PubNub  
  
  init() {  
    pubnub = PubNub(configuration: PubNubConfiguration(  
      publishKey: "demo",  
      subscribeKey: "demo",  
      userId: "device-\(UUID().uuidString.prefix(8))"  
    ))      
  }  
`
```

App entry:
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

Basic view:
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

### UIKit
```
`import UIKit  
import PubNubSDK  
  
class ViewController: UIViewController {  
  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "device-\(UUID().uuidString.prefix(8))"  
  ))  
}  
`
```

---

## Set Up Event Listeners

Published store for incoming messages:
```
`@Published var messages: [String] = []  
`
```

SwiftUI example (subscription & listeners):
```
`import SwiftUI  
import PubNubSDK  
  
class PubNubViewModel: ObservableObject {  
  @Published var messages: [String] = []  
  private let pubnub: PubNub  
  
  lazy var subscription: Subscription? = pubnub  
    .channel("hello_world")  
    .subscription(options: ReceivePresenceEvents())  
  
  init() {  
`
```

UIKit equivalent:
```
`import UIKit  
import PubNubSDK  
  
class ViewController: UIViewController {  
  private let pubnub: PubNub = PubNub(configuration: PubNubConfiguration(  
    publishKey: "demo",  
    subscribeKey: "demo",  
    userId: "device-\(UUID().uuidString.prefix(8))"  
  ))  
  
  private lazy var subscription: Subscription? = pubnub  
    .channel("hello_world")  
`
```

---

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
    .onAppear { pubNubViewModel.subscription?.subscribe() }  
    .onDisappear { pubNubViewModel.subscription?.unsubscribe() }  
`
```

UIKit:
```
`override func viewWillAppear(_ animated: Bool) {  
  super.viewWillAppear(animated)  
  subscription?.subscribe()  
}  
    
override func viewWillDisappear(_ animated: Bool) {  
  super.viewWillDisappear(animated)      
  subscription?.unsubscribe()  
}  
`
```

---

## Publish Messages
(JSON-serializable, ≤ 32 KiB)
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

---

## Sample Console Output
```
`Connection status changed: connected  
Message published successfully at 2023-10-23 15:42:36 +0000  
Message received: Hello from iOS!  
`
```

For full API details see the Configuration, Listeners, Presence, Storage, and Access Manager sections of the PubNub Swift SDK reference.