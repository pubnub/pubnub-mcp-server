# Configuration API for Objective-C SDK

Complete reference for configuring PubNub Objective-C SDK: creating PNConfiguration, core options, retries, encryption, logging, and heartbeat notifications. Includes required userID usage.

## Configuration

PNConfiguration holds credentials and options controlling client behavior (connectivity, retries, message processing).

##### Privacy
MAU billing tracks users (Device and MAU). PubNub does not track customers using random UUIDs/UserIDs.

### Method(s)

Create a configuration instance with:

```
`1+ (instancetype)configurationWithPublishKey:(NSString *)publishKey   
2                               subscribeKey:(NSString *)subscribeKey;  
3                                     userID:(NSString *)userID  
`
```

Parameters (Type — Description; defaults noted):
- publishKey (NSString) — Publish key. Example: "demo".
- subscribeKey (NSString) — Subscribe key. Example: "demo".
- userID (NSString) — Required. UTF-8 string up to 92 chars. Must be stable across sessions.
- heartbeatNotificationOptions (PNHeartbeatNotificationOptions) — Heartbeat notifications: Success, Failure (default), All, None.
- stripMobilePayload (BOOL) — If YES, removes APNs/FCM payload from received messages.
- subscribeMaximumIdleTime (NSTimeInterval) — Max seconds to wait for events; default 310.
- nonSubscribeRequestTimeout (NSTimeInterval) — Timeout for non‑subscribe ops (seconds); default 10.
- presenceHeartbeatValue (NSInteger) — Presence timeout (seconds); default 300.
- presenceHeartbeatInterval (NSInteger) — Heartbeat interval (seconds), typically (presenceHeartbeatValue / 2) − 1; min 3.
- keepTimeTokenOnListChange (BOOL) — Keep previous timetoken when subscribe list changes; default YES.
- catchUpOnSubscriptionRestore (BOOL) — Catch up on missed events after restore; default YES.
- applicationExtensionSharedGroupIdentifier (NSString) — App Group ID for extensions (iOS 8.0+, macOS 10.10+).
- requestMessageCountThreshold (NSUInteger) — Max messages per response before PNRequestMessageCountExceededCategory.
- maximumMessagesCacheSize (NSUInteger) — De-duplication cache size; default 100.
- completeRequestsBeforeSuspension (BOOL) — Finish in-flight API calls before suspension; default YES.
- suppressLeaveEvents (BOOL) — If YES, do not send presence leave events on unsubscribe.
- origin (NSString) — Custom origin (domain). Example: "ps.pndsn.com".
- requestRetry (PNRequestRetryConfiguration) — Retry policy; see requestRetry.
- cryptoModule (PNCryptoModule) — Message/file encryption module:
  [PNCryptoModule AESCBCCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];
  [PNCryptoModule legacyCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];
- logLevel (PNLogLevel) — Min log level: PNNoneLogLevel (default), PNTraceLogLevel, PNDebugLogLevel, PNInfoLogLevel, PNWarnLogLevel, PNErrorLogLevel.
- enableDefaultConsoleLogger (BOOL) — Enable built-in console logger; default YES.
- loggers (NSArray<id<PNLogger>> ) — Custom loggers conforming to PNLogger. Used in addition to console logger if enabled.
- cipherKey (NSString) — Deprecated. Set via cryptoModule instead. Key used for encrypt/decrypt.
- useRandomInitializationVector (BOOL) — Deprecated. Set via cryptoModule instead. Random IV for requests (recommended default is YES).

##### Disabling random initialization vector
Disable random IV only for backward compatibility (< 4.16.0). Do not disable random IV for new apps.

#### requestRetry

Use PNRequestRetryConfiguration to control retry behavior. For policy details, see Reconnection Policy.

##### Create a default linear retry policy

```
`1+ (instancetype)configurationWithLinearDelay;  
`
```

Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];  
`
```

##### Create a linear retry policy with excluded endpoints

```
`1+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

Parameters
- endpoints (PNEndpoint) — Endpoints to exclude. See NS_ENUM(NSUInteger, PNEndpoint) in PNStructures.h.

Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

##### Create a linear retry policy with excluded endpoints and custom parameters

```
`1+ (instancetype)configurationWithLinearDelay:(NSTimeInterval)delay  
2                                maximumRetry:(NSUInteger)maximumRetry  
3                           excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```

Parameters
- delay (NSTimeInterval) — Delay between failed requests (seconds).
- maximumRetry (NSUInteger) — Max retry attempts before error.
- excludedEndpoints (PNEndpoint) — Endpoints to exclude. See PNEndpoint in PNStructures.h.

Example

```
`1/// example  
2configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay:3.f  
3                                                                          maximumRetry:3  
4                                                                     excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

##### Create a default exponential retry policy

```
`1+ (instancetype)configurationWithExponentialDelay;  
`
```

Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];  
`
```

##### Create an exponential retry policy with excluded endpoints

```
`1+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

Parameters
- endpoints (PNEndpoint) — Endpoints to exclude. See PNEndpoint in PNStructures.h.

Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

##### Create an exponential retry policy with excluded endpoints and custom parameters

```
`1+ (instancetype)configurationWithExponentialDelay:(NSTimeInterval)minimumDelay  
2                                     maximumDelay:(NSTimeInterval)maximumDelay  
3                                     maximumRetry:(NSUInteger)maximumRetry  
4                                excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```

Parameters
- minimumDelay (NSTimeInterval) — Base delay for next delay calculation.
- maximumDelay (NSTimeInterval) — Max computed delay (seconds).
- maximumRetry (NSUInteger) — Max retry attempts before error.
- excludedEndpoints (PNEndpoint) — Endpoints to exclude. See PNEndpoint in PNStructures.h.

Example

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f  
                                                                               maximumDelay:120.f  
                                                                               maximumRetry:3  
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

#### cryptoModule

cryptoModule encrypts/decrypts messages and files. From 5.1.3, algorithms are configurable.

Options:
- Legacy 128‑bit encryption.
- Recommended 256‑bit AES‑CBC.

If cryptoModule is not set but cipherKey/useRandomInitializationVector are set, the client uses legacy encryption.

For configuration details and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy
You can keep legacy encryption. To use 256‑bit AES‑CBC, explicitly set it in configuration.

### Sample code

Required User ID: Always set userID to a stable unique value; otherwise, the client cannot connect.

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

Enable logging to monitor SDK activity.

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
`1// Adjust logging detail after initialization  
2[client setLogLevel:PNErrorLogLevel];  
`
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