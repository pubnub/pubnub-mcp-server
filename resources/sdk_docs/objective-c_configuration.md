# Configuration API for Objective-C SDK

Complete reference for configuring PubNub Objective-C SDK behavior, credentials, retries, encryption, logging, and heartbeat notifications. Includes essential method signatures and working examples.

## Configuration

`PNConfiguration` stores credentials and options that control connection, retries, logging, encryption, and message processing.

##### Privacy
- MAU billing tracks devices and MAUs. Random UUIDs/UserIDs are not tracked for billing.

### Method(s)

Create a configuration instance with:

```
+ (instancetype)configurationWithPublishKey:(NSString *)publishKey
                               subscribeKey:(NSString *)subscribeKey
                                     userID:(NSString *)userID;
```

#### PNConfiguration properties

- publishKey
  - Type: NSString
  - Publish key (example: "demo").
- subscribeKey
  - Type: NSString
  - Subscribe key (example: "demo").
- userID
  - Type: NSString
  - Required. UTF‑8 string, up to 92 characters.
- heartbeatNotificationOptions
  - Type: PNHeartbeatNotificationOptions
  - Heartbeat notifications: Success, Failure (default), All, or None.
- stripMobilePayload
  - Type: BOOL
  - If YES, removes APNs/FCM metadata from received messages.
- subscribeMaximumIdleTime
  - Type: NSTimeInterval
  - Max seconds to wait for events. Default: 310.
- nonSubscribeRequestTimeout
  - Type: NSTimeInterval
  - Timeout (seconds) for non‑subscribe operations. Default: 10.
- presenceHeartbeatValue
  - Type: NSInteger
  - Presence timeout (seconds). Default: 300.
- presenceHeartbeatInterval
  - Type: NSInteger
  - Heartbeat interval (seconds). Typical: (presenceHeartbeatValue / 2) - 1. Min: 3.
- keepTimeTokenOnListChange
  - Type: BOOL
  - Keep previous timetoken on subscribe list change. Default: YES.
- catchUpOnSubscriptionRestore
  - Type: BOOL
  - Catch up on missed events after restore. Default: YES.
- applicationExtensionSharedGroupIdentifier
  - Type: NSString
  - Shared App Group ID for extensions (iOS 8.0+, macOS 10.10+).
- requestMessageCountThreshold
  - Type: NSUInteger
  - Max messages per response before PNRequestMessageCountExceededCategory.
- maximumMessagesCacheSize
  - Type: NSUInteger
  - De‑duplication cache size. Default: 100.
- completeRequestsBeforeSuspension
  - Type: BOOL
  - Finish in‑flight API calls before suspension. Default: YES.
- suppressLeaveEvents
  - Type: BOOL
  - If YES, don’t send presence leave events on unsubscribe.
- origin
  - Type: NSString
  - Custom origin domain (example: "ps.pndsn.com").
- requestRetry
  - Type: PNRequestRetryConfiguration
  - Retry policy settings (see requestRetry below).
- cryptoModule
  - Type: PNCryptoModule
  - Encrypt/decrypt module configured via:
    - [PNCryptoModule AESCBCCryptoModuleWithCipherKey: (NSString *)cipherKey randomInitializationVector: (BOOL)useRandomInitializationVector]
    - [PNCryptoModule legacyCryptoModuleWithCipherKey: (NSString *)cipherKey randomInitializationVector: (BOOL)useRandomInitializationVector]
- logLevel
  - Type: PNLogLevel
  - Minimum log level: PNNoneLogLevel (default), PNTraceLogLevel, PNDebugLogLevel, PNInfoLogLevel, PNWarnLogLevel, PNErrorLogLevel.
- enableDefaultConsoleLogger
  - Type: BOOL
  - Enable built‑in console logger. Default: YES.
- loggers
  - Type: NSArray<id<PNLogger>>
  - Custom loggers conforming to PNLogger protocol.
- cipherKey
  - Type: NSString
  - Deprecated. Set via cryptoModule instead. Key for encrypting/decrypting messages.
- useRandomInitializationVector
  - Type: BOOL
  - Deprecated. Set via cryptoModule instead. When YES, IV is random for all requests (recommended).

##### Disabling random initialization vector
- Disable random IV only for backward compatibility (< 4.16.0). Do not disable for new apps.

#### requestRetry

Use `PNRequestRetryConfiguration` to control automatic retry behavior.

##### Create a default linear retry policy

```
+ (instancetype)configurationWithLinearDelay;
```

Example:
```
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];
```

##### Create a linear retry policy with excluded endpoints

```
+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;
```

- endpoints
  - Type: PNEndpoint
  - Endpoints to exclude. See NS_ENUM(NSUInteger, PNEndpoint) in PNStructures.h.

Example:
```
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelayExcludingEndpoints:PNMessageSendEndpoint, 0];
```

##### Create a linear retry policy with excluded endpoints and custom parameters

```
+ (instancetype)configurationWithLinearDelay:(NSTimeInterval)delay
                                maximumRetry:(NSUInteger)maximumRetry
                           excludedEndpoints:(PNEndpoint)endpoints, ...;
```

- delay
  - Type: NSTimeInterval
  - Delay (seconds) between failed requests.
- maximumRetry
  - Type: NSUInteger
  - Max retries before error.
- excludedEndpoints
  - Type: PNEndpoint
  - Endpoints to exclude (see PNStructures.h).

Example:
```
/// example
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay:3.f
                                                                          maximumRetry:3
                                                                     excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];
```

##### Create a default exponential retry policy

```
+ (instancetype)configurationWithExponentialDelay;
```

Example:
```
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];
```

##### Create an exponential retry policy with excluded endpoints

```
+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;
```

- endpoints
  - Type: PNEndpoint
  - Endpoints to exclude (see PNStructures.h).

Example:
```
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelayExcludingEndpoints:PNMessageSendEndpoint, 0];
```

##### Create an exponential retry policy with excluded endpoints and custom parameters

```
+ (instancetype)configurationWithExponentialDelay:(NSTimeInterval)minimumDelay
                                     maximumDelay:(NSTimeInterval)maximumDelay
                                     maximumRetry:(NSUInteger)maximumRetry
                                excludedEndpoints:(PNEndpoint)endpoints, ...;
```

- minimumDelay
  - Type: NSTimeInterval
  - Base delay used to compute next delay.
- maximumDelay
  - Type: NSTimeInterval
  - Max computed delay between retries.
- maximumRetry
  - Type: NSUInteger
  - Max retries before error.
- excludedEndpoints
  - Type: PNEndpoint
  - Endpoints to exclude (see PNStructures.h).

Example:
```
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f
                                                                               maximumDelay:120.f
                                                                               maximumRetry:3
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];
```

#### cryptoModule

- Handles message and file encryption/decryption.
- Two options:
  - Legacy 128‑bit encryption.
  - Recommended 256‑bit AES‑CBC.
- If `cryptoModule` is not set but `cipherKey`/`useRandomInitializationVector` are set in config, legacy encryption is used.
- For configuration details and examples, see Encryption docs.

##### Legacy encryption with 128-bit cipher key entropy
- Continue using legacy encryption if desired. To use 256‑bit AES‑CBC, explicitly configure `cryptoModule`.

### Sample code

##### Required User ID
- Always set `userID`. Persist and keep it stable for the user/device lifetime.

```
1// Basic configuration
2PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
3                                                          subscribeKey:@"demo"
4                                                                userID:@"myUniqueUserID"];
5
6// Create a PubNub client instance
7PubNub *client = [PubNub clientWithConfiguration:config];
8
9// Add listener for PubNub events
10[client addListener:self];
11
12// Subscribe to a test channel
13PNSubscribeRequest *subscribeRequest = [PNSubscribeRequest requestWithChannels:@[@"test-channel"]
14                                                                 channelGroups:nil];
15subscribeRequest.observePresence = YES;
16
17[client subscribeWithRequest:subscribeRequest];
18
19// Publish a test message
20PNPublishRequest *publishRequest = [PNPublishRequest requestWithChannel:@"test-channel"];
21publishRequest.message = @{@"message": @"Hello PubNub!"};
22
23[client publishWithRequest:publishRequest withCompletion:^(PNPublishStatus *status) {
24    if (!status.isError) {
25        NSLog(@"✅ Successfully published message! Connection is working.");
26    } else {
27        NSLog(@"❌ Failed to publish message. Error: %@", status.errorData.information);
28    }
29}];
30
31// Required PNEventsListener methods
32- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
33    // Checking connectivity only using subscribe operation.
34    if (status.operation != PNSubscribeOperation) return;
35
36    if (status.category == PNConnectedCategory) {
37        NSLog(@"✅ Successfully connected to PubNub!");
38    } else if (status.isError) {
39        NSLog(@"❌ PubNub connection error: %@", status);
40    } else {
41        NSLog(@"Received status: %@", status);
42    }
43}
44
45- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
46    NSLog(@"✅ Received message: %@ on channel: %@", message.data.message, message.data.channel);
47}
48
49- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {
50    NSLog(@"Presence event: %@", event);
51}
```

### Returns

Returns a configured client configuration instance.

### Other examples

#### Configure logging

Enable and control logging.

##### Basic logging configuration

```
1PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo" 
2                                                          subscribeKey:@"demo"
3                                                                userID:@"myUniqueUserID"];
4
5// Set minimum log level
6config.logLevel = PNDebugLogLevel;
7
8PubNub *client = [PubNub clientWithConfiguration:config];
```

##### Change log level at runtime

```
1// Adjust logging detail after initialization
2[client setLogLevel:PNErrorLogLevel];
```

##### Disable console logger

```
1PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo" 
2                                                          subscribeKey:@"demo"
3                                                                userID:@"myUniqueUserID"];
4config.logLevel = PNDebugLogLevel;
5config.enableDefaultConsoleLogger = NO;  // Disable default logger output to the Xcode console
6
7PubNub *client = [PubNub clientWithConfiguration:config];
```

##### Add custom loggers

```
1PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo" 
2                                                          subscribeKey:@"demo"
3                                                                userID:@"myUniqueUserID"];
4config.logLevel = PNDebugLogLevel;
5config.loggers = @[myCustomLogger];  // Add your PNLogger implementation
6
7PubNub *client = [PubNub clientWithConfiguration:config];
```

#### Configure heartbeat notifications

##### PNConfiguration

```
1PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"" subscribeKey:@""];
2/**
3    This is where you need to adjust the PNConfiguration object for the types of heartbeat notifications you want.
4    This is a bitmask of options located at https://github.com/pubnub/objective-c/blob/1f1c7a41a3bd8c32b644a6ad98fe179d45397c2b/PubNub/Misc/PNStructures.h#L24
5    */
6config.heartbeatNotificationOptions = PNHeartbeatNotifyAll;
7
8self.client = [PubNub clientWithConfiguration:config];
9[self.client addListener:self];
```

##### Listener

```
1- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {
2
3    if (status.operation == PNHeartbeatOperation) {
4
5        /**
6            Heartbeat operations can in fact have errors, so it is important to check first for an error.
7            For more information on how to configure heartbeat notifications through the status
8            PNObjectEventListener callback, consult http://www.pubnub.com/docs/sdks/objective-c/api-reference/configuration#configuration_basic_usage
9            */
10
11        if (!status.isError) { /* Heartbeat operation was successful. */ }
12        else { /* There was an error with the heartbeat operation, handle here. */ }
13    }
14}
```