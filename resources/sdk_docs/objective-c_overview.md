# Objective-C API & SDK 5.8.0 – Overview (Condensed)

## 1. PubNub account
Sign in or create an account at https://admin.pubnub.com, then create an app/keyset and copy its _Publish_ and _Subscribe_ keys.

---

## 2. Download the SDK  

### CocoaPods
```bash
gem install cocoapods        # or: gem update cocoapods
pod init
```

```ruby
platform :ios, '14.0'

target 'application-target-name' do
  use_frameworks!
  pod 'PubNub', '~> 5'
end
```

```bash
pod install         # open the generated .xcworkspace
```

```objc
#import <PubNub/PubNub.h>
```

### Carthage
```ogdl
github "pubnub/objective-c" ~> 4
```

```bash
carthage update --no-use-binaries            # all platforms
carthage update --platform ios --no-use-binaries
```
Add `PubNub.framework` to Embedded Binaries, then:

```objc
#import <PubNub/PubNub.h>
```

### Source
https://github.com/pubnub/objective-c  
(See platform support page for details)

---

## 3. Configure PubNub
```objc
@interface AppDelegate () <PNEventsListener>

// Keep a strong reference to the client.
@property (nonatomic, strong) PubNub *client;

@end
```

```objc
// Minimum configuration
PNConfiguration *configuration =
  [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                   subscribeKey:@"mySubscribeKey"];
configuration.uuid = @"myUniqueUUID";

self.client = [PubNub clientWithConfiguration:configuration];
```

---

## 4. Add event listeners
```objc
[self.client addListener:self];

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
  if (![message.data.channel isEqualToString:message.data.subscription]) {
    // Message received on a channel group.
  } else {
    // Message received on a channel.
  }

  NSLog(@"Received message: %@ on channel %@ at %@",
        message.data.message[@"msg"],
        message.data.channel,
        message.data.timetoken);
}
```

---

## 5. Publish & Subscribe
Subscribe:
```objc
[self.client subscribeToChannels:@[@"hello-world-channel"] withPresence:YES];
```

Publish (e.g. after `PNConnectedCategory` status):
```objc
[self.client publish:@{ @"msg": @"Hello" } toChannel:targetChannel
      withCompletion:^(PNPublishStatus *publishStatus) {
}];
```

---

## 6. Full example (excerpt)
```objc
!-- MACOS -->

@interface AppDelegate () PNEventsListener>

// Stores reference on PubNub client to make sure what it won't be released.
@property (nonatomic, strong) PubNub *client;

@end

@implementation PNAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
  // Initialize and configure PubNub client instance
  PNConfiguration *configuration =
    [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                     subscribeKey:@"mySubscribeKey"];
```

---

Expected console output:
```text
Received message: Hello on channel hello-world-channel at 15844898827972406
```

For detailed API usage, see the SDK reference sections on Configuration, Event Listeners, and Publish/Subscribe.