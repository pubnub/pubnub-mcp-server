# Objective-C API & SDK Docs 6.1.0

Build a simple “Hello, World” app that connects, publishes, and subscribes with PubNub.

## Setup

### Get your PubNub keys
- Sign in to the Admin Portal and create an app.
- Use the publish and subscribe keys from the app’s keyset.
- Use separate keysets for development and production.

### Install the SDK

##### SDK version
Use the latest SDK to get new features and security fixes.

### Use CocoaPods
- Install/update CocoaPods, create Podfile, install, then use the generated workspace.

```
pod init
```

```
platform :ios, '14.0'

target 'application-target-name' do
    use_frameworks!

    pod "PubNub", "~> 5"
end
```

```
#import <PubNub/PubNub.h>
```

### Use Carthage
- Add the dependency, update/build, embed the framework, and import headers.

```
github "pubnub/objective-c" ~> 4
```

```
carthage update --no-use-binaries
```

```
carthage update --platform ios --no-use-binaries
```

```
#import <PubNub/PubNub.h>
```

### Source code

```
git clone https://github.com/pubnub/objective-c
```

View supported platforms in the SDK docs.

## Steps

### Initialize PubNub
Add the client reference and listener conformance:

```
@interface AppDelegate () <PNEventsListener>

// Stores reference on PubNub client to make sure what it won't be released.
@property (nonatomic, strong) PubNub *client;

@end
```

Minimum configuration (replace myPublishKey/mySubscribeKey with your keys):

```
 // Initialize and configure PubNub client instance
 PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey: @"myPublishKey" subscribeKey:@"mySubscribeKey"];
 configuration.uuid = @"myUniqueUUID";

 self.client = [PubNub clientWithConfiguration:configuration];
```

### Set up event listeners
Add the listener and handle incoming messages and status (publishes on PNConnectedCategory):

```
[self.client addListener:self];

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
    // Handle new message stored in message.data.message

    if (![message.data.channel isEqualToString:message.data.subscription]) {
        // Message has been received on channel group stored in message.data.subscription.
    } else {
        // Message has been received on channel stored in message.data.channel.
    }

    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@"msg"],
          message.data.channel, message.data.timetoken);
}

- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
    if (status.operation == PNSubscribeOperation) {
        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {
            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.
            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;

            if (subscribeStatus.category == PNConnectedCategory) {
                // This is expected for a subscribe, this means there is no error or issue whatsoever.

                // Select last object from list of subscribed channels and send message to it.
                NSString *targetChannel = [client channels].lastObject;
                [self.client publish:@{ @"msg": @"hello" } toChannel:targetChannel
                      withCompletion:^(PNPublishStatus *publishStatus) {

                        if (!publishStatus.isError) {
                            // Message successfully published to specified channel.
                        } else {
                            /**
                             * Handle message publish error. Check 'category' property to find out
                             * possible reason because of which request did fail.
                             * Review 'errorData' property (which has PNErrorData data type) of status
                             * object to get additional information about issue.
                             *
                             * Request can be resent using: [publishStatus retry];
                             */
                        }
                }];
            } else {
                /**
                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was
                 * an error but there is no longer any issue.
                 */
            }
        } else if (status.category == PNUnexpectedDisconnectCategory) {
            /**
             * This is usually an issue with the internet connection, this is an error, handle
             * appropriately retry will be called automatically.
             */
        } else {
            PNErrorStatus *errorStatus = (PNErrorStatus *)status;

            if (errorStatus.category == PNAccessDeniedCategory) {
                /**
                 * This means that Access Manager does allow this client to subscribe to this channel and channel group
                 * configuration. This is another explicit error.
                 */
            } else {
                /**
                 * More errors can be directly specified by creating explicit cases for other error categories
                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,
                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`
                 * or `PNNetworkIssuesCategory`
                 */
            }
        }
    }
}
```

### Publish and subscribe
Subscribe to receive messages:

```
[self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];
```

## Complete example

```
!-- MACOS -->

@interface AppDelegate () <PNEventsListener>

// Stores reference on PubNub client to make sure what it won't be released.
@property (nonatomic, strong) PubNub *client;

@end

@implementation PNAppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Initialize and configure PubNub client instance
    PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                                                     subscribeKey:@"mySubscribeKey"];
    configuration.uuid = @"myUniqueUUID";

    self.client = [PubNub clientWithConfiguration:configuration];
    [self.client addListener:self];
    [self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];}

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
    // Handle new message stored in message.data.message

    if (![message.data.channel isEqualToString:message.data.subscription]) {
        // Message has been received on channel group stored in message.data.subscription.
    } else {
        // Message has been received on channel stored in message.data.channel.
    }

    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@ "msg"],
          message.data.channel, message.data.timetoken);
}

- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
    if (status.operation == PNSubscribeOperation) {
        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {
            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.
            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;

            if (subscribeStatus.category == PNConnectedCategory) {
                // This is expected for a subscribe, this means there is no error or issue whatsoever.

                // Select last object from list of subscribed channels and send message to it.
                NSString *targetChannel = [client channels].lastObject;
                [self.client publish: @{ @ "msg": @"hello" } toChannel:targetChannel
                      withCompletion:^(PNPublishStatus *publishStatus) {

                        if (!publishStatus.isError) {
                            // Message successfully published to specified channel.
                        } else {
                            /**
                             * Handle message publish error. Check 'category' property to find out
                             * possible reason because of which request did fail.
                             * Review 'errorData' property (which has PNErrorData data type) of status
                             * object to get additional information about issue.
                             *
                             * Request can be resent using: [publishStatus retry];
                             */
                        }
                }];
            } else {
                /**
                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was
                 * an error but there is no longer any issue.
                 */
            }
        } else if (status.category == PNUnexpectedDisconnectCategory) {
            /**
             * This is usually an issue with the internet connection, this is an error, handle
             * appropriately retry will be called automatically.
             */
        } else {
            PNErrorStatus *errorStatus = (PNErrorStatus *)status;

            if (errorStatus.category == PNAccessDeniedCategory) {
                /**
                 * This means that Access Manager does allow this client to subscribe to this channel and channel group
                 * configuration. This is another explicit error.
                 */
            } else {
                /**
                 * More errors can be directly specified by creating explicit cases for other error categories
                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,
                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`
                 * or `PNNetworkIssuesCategory`
                 */
            }
        }
    }
}
@end

!-- OTHER PLATFORMS -->

@interface AppDelegate () <PNEventsListener>

// Stores reference on PubNub client to make sure what it won't be released.
@property (nonatomic, strong) PubNub *client;

@end

@implementation PNAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Initialize and configure PubNub client instance
    PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"myPublishKey"
                                                                     subscribeKey:@"mySubscribeKey"];
    configuration.uuid = @"myUniqueUUID";

    self.client = [PubNub clientWithConfiguration:configuration];
    [self.client addListener:self];
    [self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];
}

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
    // Handle new message stored in message.data.message

    if (![message.data.channel isEqualToString:message.data.subscription]) {
        // Message has been received on channel group stored in message.data.subscription.
    } else {
        // Message has been received on channel stored in message.data.channel.
    }

    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@ "msg"],
          message.data.channel, message.data.timetoken);
}

- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
    if (status.operation == PNSubscribeOperation) {
        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {
            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.
            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;

            if (subscribeStatus.category == PNConnectedCategory) {
                // This is expected for a subscribe, this means there is no error or issue whatsoever.

                // Select last object from list of subscribed channels and send message to it.
                NSString *targetChannel = [client channels].lastObject;
                [self.client publish: @{ @ "msg": @"hello" } toChannel:targetChannel
                      withCompletion:^(PNPublishStatus *publishStatus) {

                        if (!publishStatus.isError) {
                            // Message successfully published to specified channel.
                        } else {
                            /**
                             * Handle message publish error. Check 'category' property to find out
                             * possible reason because of which request did fail.
                             * Review 'errorData' property (which has PNErrorData data type) of status
                             * object to get additional information about issue.
                             *
                             * Request can be resent using: [publishStatus retry];
                             */
                        }
                }];
            } else {
                /**
                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was
                 * an error but there is no longer any issue.
                 */
            }
        } else if (status.category == PNUnexpectedDisconnectCategory) {
            /**
             * This is usually an issue with the internet connection, this is an error, handle
             * appropriately retry will be called automatically.
             */
        } else {
            PNErrorStatus *errorStatus = (PNErrorStatus *)status;

            if (errorStatus.category == PNAccessDeniedCategory) {
                /**
                 * This means that Access Manager does allow this client to subscribe to this channel and channel group
                 * configuration. This is another explicit error.
                 */
            } else {
                /**
                 * More errors can be directly specified by creating explicit cases for other error categories
                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,
                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`
                 * or `PNNetworkIssuesCategory`
                 */
            }
        }
    }
}
@end
```

Run the app. Example console output:

```
Received message: Hello on channel hello-world-channel at 15844898827972406
```

### Walkthrough
Order of execution: configure PubNub, add listeners, subscribe, publish.

#### Configuring PubNub

```
 // Initialize and configure PubNub client instance
 PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey: @"myPublishKey" subscribeKey: @"mySubscribeKey"];
 configuration.uuid = @"myUniqueUUID";

 self.client = [PubNub clientWithConfiguration:configuration];
```

#### Add event listeners

```
[self.client addListener:self];

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
    // Handle new message stored in message.data.message

    if (![message.data.channel isEqualToString:message.data.subscription]) {
        // Message has been received on channel group stored in message.data.subscription.
    } else {
        // Message has been received on channel stored in message.data.channel.
    }

    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@"msg"],
          message.data.channel, message.data.timetoken);
 }

 - (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
    if (status.operation == PNSubscribeOperation) {
        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {
             // Status object for those categories can be casted to `PNSubscribeStatus` for use below.
             PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;

            if (subscribeStatus.category == PNConnectedCategory) {
                // This is expected for a subscribe, this means there is no error or issue whatsoever.

                // Select last object from list of subscribed channels and send message to it.
                NSString *targetChannel = [client channels].lastObject;
                [self.client publish:@{ @"msg": @"hello" } toChannel:targetChannel
                      withCompletion:^(PNPublishStatus *publishStatus) {

                        if (!publishStatus.isError) {
                            // Message successfully published to specified channel.
                        } else {
                            /**
                             * Handle message publish error. Check 'category' property to find out
                             * possible reason because of which request did fail.
                             * Review 'errorData' property (which has PNErrorData data type) of status
                             * object to get additional information about issue.
                             *
                             * Request can be resent using: [publishStatus retry];
                             */
                        }
                }];
            } else {
                /**
                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was
                 * an error but there is no longer any issue.
                 */
            }
        } else if (status.category == PNUnexpectedDisconnectCategory) {
            /**
             * This is usually an issue with the internet connection, this is an error, handle
             * appropriately retry will be called automatically.
             */
        } else {
            PNErrorStatus *errorStatus = (PNErrorStatus *)status;

            if (errorStatus.category == PNAccessDeniedCategory) {
                /**
                 * This means that Access Manager does allow this client to subscribe to this channel and channel group
                 * configuration. This is another explicit error.
                 */
            } else {
                /**
                 * More errors can be directly specified by creating explicit cases for other error categories
                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,
                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`
                 * or `PNNetworkIssuesCategory`
                 */
            }
        }
    }
}
```

#### Publishing and subscribing

```
[self.client publish: @{ @"msg": @"Hello" } toChannel:targetChannel
      withCompletion:^(PNPublishStatus *publishStatus) {
}];
```

```
[self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];
```

## Next steps
See the SDK reference documentation for details. Last updated on Sep 9, 2025.