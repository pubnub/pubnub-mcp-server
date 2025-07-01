# Configuration API for Objective-C SDK (condensed)

Use `PNConfiguration` to control all PubNub client behavior.

## 1. Create a configuration

```objective-c
+ (instancetype)configurationWithPublishKey:(NSString *)publishKey   
                               subscribeKey:(NSString *)subscribeKey;  
                                     userID:(NSString *)userID  
```

• publishKey (NSString) – key for publish operations.  
• subscribeKey (NSString) – key for subscriptions.  
• userID (NSString, ≤92 UTF-8 chars) – unique user/device identifier (required).

### Core properties

| Property | Type / Default | Purpose |
|----------|----------------|---------|
| heartbeatNotificationOptions | PNHeartbeatNotificationOptions (`PNHeartbeatNotifyFailure` default) | Control success/failure callbacks for heartbeats. |
| stripMobilePayload | BOOL | Remove mobile-push payload before delivering messages. |
| subscribeMaximumIdleTime | NSTimeInterval, default `310` | Max seconds between server events before reconnect. |
| nonSubscribeRequestTimeout | NSTimeInterval, default `10` | Timeout for non-subscribe requests. |
| presenceHeartbeatValue | NSInteger, default `300` | How long server sees client as alive. |
| presenceHeartbeatInterval | NSInteger, default `(presenceHeartbeatValue/2)-1` | How often SDK sends heartbeats. |
| keepTimeTokenOnListChange | BOOL, default `YES` | Keep last timetoken when channel list changes. |
| catchUpOnSubscriptionRestore | BOOL, default `YES` | Fetch missed messages after reconnect. |
| applicationExtensionSharedGroupIdentifier | NSString | App extension shared cache identifier. |
| requestMessageCountThreshold | NSUInteger | Max messages allowed in single response. |
| maximumMessagesCacheSize | NSUInteger, default `100` | De-duplication cache size. |
| completeRequestsBeforeSuspension | BOOL, default `YES` | Finish in-flight calls before app suspension. |
| suppressLeaveEvents | BOOL | Skip presence leave events on unsubscribe. |
| origin | NSString | Custom PubNub domain if needed. |
| requestRetry | PNRequestRetryConfiguration | Custom endpoint retry logic (see §2). |
| cryptoModule | PNCryptoModule* | Message/file encryption module (see §3). |
| cipherKey / useRandomInitializationVector | Deprecated – set via `cryptoModule` instead. |

Disable random IV only when maintaining backward compatibility (< 4.16.0).

---

## 2. `requestRetry`

Factory methods (all in `PNRequestRetryConfiguration`) and examples are kept verbatim.

##### Default linear delay

```objective-c
+ (instancetype)configurationWithLinearDelay;  
```
```objective-c
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];  
```

##### Linear delay, exclude endpoints

```objective-c
+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
```
```objective-c
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
```

##### Linear delay with custom params

```objective-c
+ (instancetype)configurationWithLinearDelay:(NSTimeInterval)delay  
                                maximumRetry:(NSUInteger)maximumRetry  
                           excludedEndpoints:(PNEndpoint)endpoints, ...;  
```
```objective-c
/// example  
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay:3.f  
                                                                          maximumRetry:3  
                                                                     excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
```

##### Default exponential delay

```objective-c
+ (instancetype)configurationWithExponentialDelay;  
```
```objective-c
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];  
```

##### Exponential delay, exclude endpoints

```objective-c
+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
```
```objective-c
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
```

##### Exponential delay with custom params

```objective-c
+ (instancetype)configurationWithExponentialDelay:(NSTimeInterval)minimumDelay  
                                     maximumDelay:(NSTimeInterval)maximumDelay  
                                     maximumRetry:(NSUInteger)maximumRetry  
                                excludedEndpoints:(PNEndpoint)endpoints, ...;  
```
```objective-c
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f  
                                                                               maximumDelay:120.f  
                                                                               maximumRetry:3  
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
```

---

## 3. `cryptoModule`

```objective-c
// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
                                           randomInitializationVector:YES];  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule legacyCryptoModuleWithCipherKey:@"enigma"   
                                           randomInitializationVector:YES];  
```

• Older SDKs (< 5.1.3) can’t decrypt 256-bit AES-CBC data.

---

## 4. Basic configuration & client setup

```objective-c
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"myUniqueUserID"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Add listener for PubNub events  
[client addListener:self];  
  
// Subscribe to a test channel  
PNSubscribeRequest *subscribeRequest = [PNSubscribeRequest requestWithChannels:@[@"test-channel"]  
                                                                 channelGroups:nil];  
subscribeRequest.observePresence = YES;  
```

---

## 5. Heartbeat notification setup

```objective-c
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"" subscribeKey:@""];  
config.heartbeatNotificationOptions = PNHeartbeatNotifyAll;  
  
self.client = [PubNub clientWithConfiguration:config];  
[self.client addListener:self];  
```

Listener:

```objective-c
- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNHeartbeatOperation) {  
        if (!status.isError) { /* Heartbeat OK */ }  
        else { /* Handle error */ }  
    }  
}  
```

---

Configured `PNConfiguration` instances are returned ready for use with `PubNub clientWithConfiguration:`.