# Objective-C SDK 5.8.0 – Overview (Condensed)

## 1. PubNub Account  
Sign in or create an account at https://admin.pubnub.com to generate your app’s **publish** and **subscribe** keys (create separate keysets for prod/test).

## 2. Download the SDK  

### CocoaPods  
```bash
gem install cocoapods       # or: gem update cocoapods
pod init
```

```ruby
platform :ios, '14.0'

target 'application-target-name' do
  use_frameworks!
  pod "PubNub", "~> 5"
end
```

```objective-c
#import <PubNub/PubNub.h>
```

### Carthage  
```ruby
# Cartfile
github "pubnub/objective-c" ~> 4
```
```bash
carthage update --no-use-binaries
carthage update --platform ios --no-use-binaries   # mac / tvos / watchos also available
```
After building, add `PubNub.framework` to “Embedded Binaries” and:  
```objective-c
#import <PubNub/PubNub.h>
```

### Source  
GitHub: https://github.com/pubnub/objective-c  
Platform support: /docs/sdks/objective-c/platform-support

## 3. Configure PubNub  
```objective-c
@interface AppDelegate () <PNEventsListener>

// Keep a strong reference to the client
@property (nonatomic, strong) PubNub *client;

@end
```

```objective-c
// Minimum configuration
PNConfiguration *configuration =
  [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                   subscribeKey:@"mySubscribeKey"];
configuration.uuid = @"myUniqueUUID";

self.client = [PubNub clientWithConfiguration:configuration];
```

## 4. Add Event Listeners  
```objective-c
[self.client addListener:self];

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
  // message.data.message contains the payload
  if (![message.data.channel isEqualToString:message.data.subscription]) {
      // Received via channel group
  } else {
      // Received via channel
  }
  NSLog(@"Received message: %@ on channel %@ at %@",
        message.data.message[@"msg"],
        message.data.channel,
        message.data.timetoken);
}
```

## 5. Publish & Subscribe  
Subscribe:  
```objective-c
[self.client subscribeToChannels:@[@"hello-world-channel"] withPresence:YES];
```

Publish (typically after `PNConnectedCategory` status):  
```objective-c
[self.client publish:@{ @"msg": @"Hello" }
            toChannel:targetChannel
      withCompletion:^(PNPublishStatus *publishStatus) {
}];
```

## 6. Combined Example (macOS snippet)
```objective-c
// -- MACOS -->

@interface AppDelegate () <PNEventsListener>

@property (nonatomic, strong) PubNub *client;

@end

@implementation PNAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
  PNConfiguration *configuration =
    [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                     subscribeKey:@"mySubscribeKey"];
  ...
}
```

## 7. Console Output Example  
```text
Received message: Hello on channel hello-world-channel at 15844898827972406
```

---

You are now ready to send and receive real-time messages with the Objective-C SDK. For detailed API docs, see: /docs/sdks/objective-c/api-reference/configuration