# Configuration API for Objective-C SDK

Complete API reference for configuring PubNub Objective-C SDK. Includes credentials, connection behavior, retries, encryption, logging, and examples.

## Configuration

`PNConfiguration` stores client settings (credentials, connection options, retries, encryption, logging).

##### Privacy

MAU billing tracks users (Device and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

### Method(s)

Create a configuration instance with:

```
`1+ (instancetype)configurationWithPublishKey:(NSString *)publishKey   
2                               subscribeKey:(NSString *)subscribeKey;  
3                                     userID:(NSString *)userID  
`
```

- Required parameters:
  - publishKey (NSString) — Publish key. Example: "demo".
  - subscribeKey (NSString) — Subscribe key. Example: "demo".
  - userID (NSString) — UTF‑8 string up to 92 characters. Required.

- Core options:
  - heartbeatNotificationOptions (PNHeartbeatNotificationOptions) — PNHeartbeatNotifySuccess, PNHeartbeatNotifyFailure (default), PNHeartbeatNotifyAll, or PNHeartbeatNotifyNone.
  - stripMobilePayload (BOOL) — If YES, remove APNs/FCM push metadata from received messages.
  - subscribeMaximumIdleTime (NSTimeInterval) — Max seconds to wait for events. Default: 310.
  - nonSubscribeRequestTimeout (NSTimeInterval) — Timeout for non‑subscribe ops, seconds. Default: 10.
  - presenceHeartbeatValue (NSInteger) — Presence timeout (seconds). Default: 300.
  - presenceHeartbeatInterval (NSInteger) — Heartbeat interval (seconds). Typical: (presenceHeartbeatValue / 2) - 1. Min: 3.
  - keepTimeTokenOnListChange (BOOL) — Keep previous timetoken on subscribe list change. Default: YES.
  - catchUpOnSubscriptionRestore (BOOL) — Catch up on missed events after restore. Default: YES.
  - applicationExtensionSharedGroupIdentifier (NSString) — Shared App Group ID (iOS 8.0+, macOS 10.10+).
  - requestMessageCountThreshold (NSUInteger) — Max messages per response before PNRequestMessageCountExceededCategory.
  - maximumMessagesCacheSize (NSUInteger) — De‑duplication cache size. Default: 100.
  - completeRequestsBeforeSuspension (BOOL) — Finish in‑flight API calls before suspension. Default: YES.
  - suppressLeaveEvents (BOOL) — If YES, don’t send presence leave events on unsubscribe.
  - origin (NSString) — Custom origin (domain), e.g., "ps.pndsn.com".
  - requestRetry (PNRequestRetryConfiguration) — Retry policy. See requestRetry below.
  - cryptoModule — Encryption module:
    - [PNCryptoModule AESCBCCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];
    - [PNCryptoModule legacyCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];
    - Takes cipherKey and useRandomInitializationVector. See cryptoModule below.
  - logLevel (PNLogLevel) — PNNoneLogLevel (default/disabled), PNTraceLogLevel, PNDebugLogLevel, PNInfoLogLevel, PNWarnLogLevel, PNErrorLogLevel.
  - enableDefaultConsoleLogger (BOOL) — Enable built-in console logger. Default: YES.
  - loggers (NSArray<id<PNLogger>>) — Custom loggers conforming to PNLogger (used alongside console logger if enabled).
  - cipherKey (NSString) — Deprecated; pass to cryptoModule instead.
  - useRandomInitializationVector (BOOL) — Deprecated; pass to cryptoModule instead. When YES, the IV is random for all requests (recommended and default behavior).

##### Disabling random initialization vector

Disable random IV only for backward compatibility (<4.16.0). Never disable random IV for new applications.

#### requestRetry

Use `PNRequestRetryConfiguration` to control retry behavior. For reconnection policy details, see Reconnection Policy.

##### Create a default linear retry policy

```
`1+ (instancetype)configurationWithLinearDelay;  
`
```

###### Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];  
`
```

##### Create a linear retry policy with excluded endpoints

```
`1+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

- endpoints (PNEndpoint) — Endpoints to exclude. See NS_ENUM(NSUInteger, PNEndpoint) in PNStructures.h.

###### Example

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

- delay (NSTimeInterval) — Delay in seconds between failed requests.
- maximumRetry (NSUInteger) — Retries before error.
- excludedEndpoints (PNEndpoint) — Endpoints to exclude.

###### Example

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

###### Example

```
`1configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];  
`
```

##### Create an exponential retry policy with excluded endpoints

```
`1+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

- endpoints (PNEndpoint) — Endpoints to exclude.

###### Example

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

- minimumDelay (NSTimeInterval) — Base delay for next delay calculation.
- maximumDelay (NSTimeInterval) — Max allowed computed delay.
- maximumRetry (NSUInteger) — Retries before error.
- excludedEndpoints (PNEndpoint) — Endpoints to exclude.

###### Example

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f  
                                                                               maximumDelay:120.f  
                                                                               maximumRetry:3  
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

#### cryptoModule

`cryptoModule` encrypts/decrypts messages and files. From 5.1.3, you can choose algorithms:
- Legacy 128‑bit encryption (backward compatible).
- Recommended 256‑bit AES‑CBC.

If `cryptoModule` is not set but `cipherKey`/`useRandomInitializationVector` are set, legacy encryption is used.

For configuration and examples, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy

You may keep legacy encryption; to use 256‑bit AES‑CBC, set it explicitly in `cryptoModule`.

### Sample code

##### Required User ID

Always set a stable User ID (`userID`). If not set, the client cannot connect.

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

Enable logging to monitor SDK activity and troubleshoot.

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