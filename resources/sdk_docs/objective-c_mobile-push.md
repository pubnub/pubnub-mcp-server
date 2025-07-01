# Mobile Push Notifications - Objective-C SDK

Bridges PubNub publish/subscribe with APNs (legacy & HTTP/2) and FCM.  
Set `pushType`:
* `PNAPNSPush` – legacy APNs binary  
* `PNAPNS2Push` – APNs HTTP/2  
* `PNFCMPush` – FCM / GCM  

---

## Add Device to Channel

### Methods
```objective-c
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(NSData *)pushToken
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(id)pushToken
                              pushType:(PNPushType)pushType
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(id)pushToken
                              pushType:(PNPushType)pushType
                           environment:(PNAPNSEnvironment)environment
                                 topic:(NSString *)topic
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
* `channels` NSArray<NSString *> – target channels.  
* `pushToken` NSData / NSString (per service).  
* `pushType` PNAPNSPush | PNAPNS2Push | PNFCMPush.  
* `environment` PNAPNSEnvironment (APNS2 only).  
* `topic` NSString bundle id (APNS2 only).  

#### Basic Usage
```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"pushUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
NSData *devicePushToken = [@"sample-device-token-12345" dataUsingEncoding:NSUTF8StringEncoding];
```
<!-- show all 76 lines -->

#### Other Examples
```objective-c
[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]
                        withDevicePushToken:self.devicePushToken
                                   pushType:PNFCMPush
                              andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // enabled
    } else { /* retry: [status retry]; */ }
}];
```
<!-- show all 16 lines -->
```objective-c
[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]
                        withDevicePushToken:self.devicePushToken
                                   pushType:PNAPNS2Push
                                environment:PNAPNSProduction
                                      topic:@"com.my-application.bundle"
                              andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // enabled
    } else { /* retry */ }
}];
```
<!-- show all 18 lines -->

### Builder Pattern
```objective-c
push()
    .enable()
    .token(id)
    .channels(NSArray<NSString *> *)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```
```objective-c
push()
    .enable()
    .fcmToken(NSString *)
    .channels(NSArray<NSString *> *)
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);
```

#### Builder Examples
```objective-c
self.client.push().enable()
    .token(self.devicePushToken)
    .channels(@[@"wwdc",@"google.io"])
    .pushType(PNAPNS2Push)
    .environment(PNAPNSProduction)
    .topic(@"com.my-application.bundle")
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```
<!-- APNS2 example truncated -->
```objective-c
self.client.push().enable()
    .token(self.devicePushToken)
    .channels(@[@"wwdc",@"google.io"])
    .pushType(PNFCMPush)
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```
<!-- FCM example truncated -->

### Response
```objective-c
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```
<!-- identical response block reused below -->

---

## List Channels For Device

### Methods
```objective-c
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(NSData *)pushToken
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```
```objective-c
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken
                                                     pushType:(PNPushType)pushType
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```
```objective-c
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken
                                                     pushType:(PNPushType)pushType
                                                  environment:(PNAPNSEnvironment)environment
                                                        topic:(NSString *)topic
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```

#### Basic Usage
```objective-c
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                                                      andCompletion:^(PNAPNSEnabledChannelsResult *result,
                                                                      PNErrorStatus *status) {
    if (!status) {
        // result.data.channels
    } else { /* retry */ }
}];
```
<!-- show all 19 lines -->

#### Other Examples
```objective-c
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                         pushType:PNFCMPush
                    andCompletion:^(PNFCMEnabledChannelsResult *result, PNErrorStatus *status) { /* ... */ }];
```
```objective-c
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                         pushType:PNAPNS2Push
                      environment:PNAPNSDevelopment
                            topic:@"com.my-application.bundle"
                    andCompletion:^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) { /* ... */ }];
```

### Builder Pattern
```objective-c
push()
    .audit()
    .token(id)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(PNPushNotificationsStateAuditCompletionBlock);
```
```objective-c
push()
    .audit()
    .fcmToken(NSString *)
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);
```

#### Builder Examples
```objective-c
self.client.push().audit()
    .token(self.devicePushToken)
    .pushType(PNAPNS2Push)
    .environment(PNAPNSProduction)
    .topic(@"com.my-application.bundle")
    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) { /* ... */ });
```
```objective-c
self.client.push().audit()
    .fcmToken(self.pushToken)
    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) { /* ... */ });
```

### Response
```objective-c
@interface PNAPNSEnabledChannelsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<NSString *> *channels;
@end

@interface PNAPNSEnabledChannelsResult : PNResult
@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;
@end
```
```objective-c
@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Remove Device From Channel

### Methods
```objective-c
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(NSData *)pushToken
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(id)pushToken
                                   pushType:(PNPushType)pushType
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(id)pushToken
                                   pushType:(PNPushType)pushType
                                environment:(PNAPNSEnvironment)environment
                                      topic:(NSString *)topic
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

#### Basic Usage
```objective-c
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                   andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```
<!-- show all 20 lines -->

#### Other Examples
```objective-c
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                        pushType:PNFCMPush
                                   andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```
```objective-c
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                        pushType:PNAPNS2Push
                                     environment:PNAPNSProduction
                                           topic:@"com.my-application.bundle"
                                   andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```

### Builder Pattern
```objective-c
push()
    .disable()
    .channels(NSArray<NSString *> *)
    .token(id)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```
```objective-c
push()
    .disable()
    .fcmToken(NSString *)
    .channels(NSArray<NSString *> *)
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);
```

#### Builder Examples
```objective-c
self.client.push().disable()
    .token(self.devicePushToken)
    .channels(@[@"wwdc",@"google.io"])
    .pushType(PNAPNS2Push)
    .environment(PNAPNSProduction)
    .topic(@"com.my-application.bundle")
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```
```objective-c
self.client.push().disable()
    .channels(@[@"channel1", @"channel2"])
    .fcmToken(self.pushToken)
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```

### Response
```objective-c
@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Remove All Mobile Push Notifications

### Methods
```objective-c
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(NSData *)pushToken
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken
                                                 pushType:(PNPushType)pushType
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```
```objective-c
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken
                                                 pushType:(PNPushType)pushType
                                              environment:(PNAPNSEnvironment)environment
                                                    topic:(NSString *)topic
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

#### Basic Usage
```objective-c
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                 andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```
<!-- show all 22 lines -->

#### Other Examples
```objective-c
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                      pushType:PNFCMPush
                                                 andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```
```objective-c
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                      pushType:PNAPNS2Push
                                                   environment:PNAPNSProduction
                                                         topic:@"com.my-application.bundle"
                                                 andCompletion:^(PNAcknowledgmentStatus *status) { /* ... */ }];
```

### Builder Pattern
```objective-c
push()
    .disableAll()
    .token(id)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```

#### Builder Examples
```objective-c
self.client.push().disableAll()
    .token(self.devicePushToken)
    .pushType(PNAPNS2Push)
    .environment(PNAPNSProduction)
    .topic(@"com.my-application.bundle")
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```
```objective-c
self.client.push().disableAll()
    .token(self.devicePushToken)
    .pushType(PNFCMPush)
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { /* ... */ });
```

### Response
```objective-c
@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

_Last updated May 29 2025_