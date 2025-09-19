# PubNub Objective-C SDK – Configuration (Condensed)

## 1. Create a configuration object

```
`+ (instancetype)configurationWithPublishKey:(NSString *)publishKey   
                               subscribeKey:(NSString *)subscribeKey;  
                                     userID:(NSString *)userID  
`
```

• `publishKey` `NSString` – publish capability.  
• `subscribeKey` `NSString` – subscribe capability.  
• `userID` `NSString` – unique ID (92 UTF-8 chars max); **must be set**.

## 2. PNConfiguration properties

• `heartbeatNotificationOptions` `PNHeartbeatNotificationOptions` – bitmask:  
  • `PNHeartbeatNotifySuccess`, `PNHeartbeatNotifyFailure` (default), `PNHeartbeatNotifyAll`, `PNHeartbeatNotifyNone`.

• `stripMobilePayload` `BOOL` – remove mobile-push payload from received messages.

• `subscribeMaximumIdleTime` `NSTimeInterval` – max idle on subscribe (default 310 s).

• `nonSubscribeRequestTimeout` `NSTimeInterval` – timeout for non-subscribe calls (default 10 s).

• `presenceHeartbeatValue` `NSInteger` – presence timeout (default 300 s).  
• `presenceHeartbeatInterval` `NSInteger` – heartbeat interval (recommend `(value/2)-1`, min 3 s).

• `keepTimeTokenOnListChange` `BOOL` – keep previous timetoken on resubscribe (default YES).

• `catchUpOnSubscriptionRestore` `BOOL` – fetch missed events after reconnect (default YES).

• `applicationExtensionSharedGroupIdentifier` `NSString` – App Extension group for request cache.

• `requestMessageCountThreshold` `NSUInteger` – max messages allowed in one response.

• `maximumMessagesCacheSize` `NSUInteger` – de-dup cache size (default 100).

• `completeRequestsBeforeSuspension` `BOOL` – finish API calls before app suspension (default YES).

• `suppressLeaveEvents` `BOOL` – suppress presence leave on unsubscribe.

• `origin` `NSString` – custom PubNub domain.

• `requestRetry` `PNRequestRetryConfiguration` – custom reconnect policy (see below).

• `cryptoModule` `PNCryptoModule` – message/file encryption module (recommended AES-CBC).

Deprecated (use `cryptoModule` instead):  
• `cipherKey` `NSString`, `useRandomInitializationVector` `BOOL`.

## 3. Retry policies (`requestRetry`)

### Factory methods

```
`+ (instancetype)configurationWithLinearDelay;  
`
```
```
`+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```
```
`+ (instancetype)configurationWithLinearDelay:(NSTimeInterval)delay  
                                maximumRetry:(NSUInteger)maximumRetry  
                           excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```
```
`+ (instancetype)configurationWithExponentialDelay;  
`
```
```
`+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```
```
`+ (instancetype)configurationWithExponentialDelay:(NSTimeInterval)minimumDelay  
                                     maximumDelay:(NSTimeInterval)maximumDelay  
                                     maximumRetry:(NSUInteger)maximumRetry  
                                excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```

### Usage examples

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];  
`
```

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

```
`/// example  
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay:3.f  
                                                                          maximumRetry:3  
                                                                     excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];  
`
```

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f  
                                                                               maximumDelay:120.f  
                                                                               maximumRetry:3  
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

## 4. Encryption (`cryptoModule`)

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
                                           randomInitializationVector:YES];  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule legacyCryptoModuleWithCipherKey:@"enigma"   
                                           randomInitializationVector:YES];  
`
```

SDK ≤ 5.1.2 can’t decrypt 256-bit content.

## 5. Basic configuration example

```
`// Basic configuration  
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
`
```

## 6. Heartbeat notification example

### Configuration

```
`PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"" subscribeKey:@""];  
/**  
    This is where you need to adjust the PNConfiguration object for the types of heartbeat notifications you want.  
    This is a bitmask of options located at https://github.com/pubnub/objective-c/blob/1f1c7a41a3bd8c32b644a6ad98fe179d45397c2b/PubNub/Misc/PNStructures.h#L24  
    */  
config.heartbeatNotificationOptions = PNHeartbeatNotifyAll;  
  
self.client = [PubNub clientWithConfiguration:config];  
[self.client addListener:self];  
`
```

### Listener

```
`- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNHeartbeatOperation) {  
  
        /**  
            Heartbeat operations can in fact have errors, so it is important to check first for an error.  
            For more information on how to configure heartbeat notifications through the status  
            PNObjectEventListener callback, consult http://www.pubnub.com/docs/sdks/objective-c/api-reference/configuration#configuration_basic_usage  
            */  
  
        if (!status.isError) { /* Heartbeat operation was successful. */ }  
        else { /* There was an error with the heartbeat operation, handle here. */ }  
    }  
}  
`
```

---

Configured `PNConfiguration` instances are returned ready to use when creating a `PubNub` client.