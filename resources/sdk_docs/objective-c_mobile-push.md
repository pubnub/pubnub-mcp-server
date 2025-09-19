# Mobile Push Notifications – Objective-C SDK (condensed)

PubNub bridges your publish/subscribe channels with APNs (HTTP/2 or legacy) and FCM.  
Select the appropriate `PNPushType` (`PNAPNS2Push`, `PNAPNSPush`, `PNFCMPush`) in every call.

---

## 1. Add device to channel

### Method signatures

```
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(NSData *)pushToken
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(id)pushToken
                              pushType:(PNPushType)pushType
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)addPushNotificationsOnChannels:(NSArray<NSString *> *)channels
                   withDevicePushToken:(id)pushToken
                              pushType:(PNPushType)pushType
                           environment:(PNAPNSEnvironment)environment
                                 topic:(NSString *)topic
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

### Builder pattern

```
push()
    .enable()
    .token(id)                 // or .fcmToken(NSString *)
    .channels(NSArray<NSString *> *)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```

### Sample code

```
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// Basic configuration
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"pushUser"];

// Create a PubNub client instance
PubNub *client = [PubNub clientWithConfiguration:config];

// Simulated token
NSData *devicePushToken = [@"sample-device-token-12345" dataUsingEncoding:NSUTF8StringEncoding];
```
(show all 76 lines)

#### Other examples

```
[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]
                        withDevicePushToken:self.devicePushToken
                                   pushType:PNFCMPush
                              andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 16 lines)

```
[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]
                        withDevicePushToken:self.devicePushToken
                                   pushType:PNAPNS2Push
                                environment:PNAPNSProduction
                                      topic:@"com.my-application.bundle"
                              andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 18 lines)

### Response

```
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```
(show all 16 lines)

---

## 2. List channels for device

### Method signatures

```
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(NSData *)pushToken
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```

```
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken
                                                     pushType:(PNPushType)pushType
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```

```
- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken
                                                     pushType:(PNPushType)pushType
                                                  environment:(PNAPNSEnvironment)environment
                                                        topic:(NSString *)topic
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;
```

### Builder pattern

```
push()
    .audit()
    .token(id)                // or .fcmToken(NSString *)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(PNPushNotificationsStateAuditCompletionBlock);
```

### Sample code

```
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                                                      andCompletion:^(PNAPNSEnabledChannelsResult *result,
                                                                      PNErrorStatus *status) {
      if (!status) {
        // result.data.channels
      } else {
        // status.retry
      }
}];
```
(show all 19 lines)

#### Other examples

```
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                         pushType:PNFCMPush
                    andCompletion:^(PNFCMEnabledChannelsResult *result, PNErrorStatus *status) {
    if (!status.isError) {
        // result.data.channels
    } else {
        // status.retry
    }
}];
```

```
[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken
                         pushType:PNAPNS2Push
                      environment:PNAPNSDevelopment
                            topic:@"com.my-application.bundle"
                    andCompletion:^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {
    if (!status.isError) {
        // result.data.channels
    } else {
        // status.retry
    }
}];
```
(show all 17 lines)

### Response

```
@interface PNAPNSEnabledChannelsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<NSString *> *channels;
@end

@interface PNAPNSEnabledChannelsResult : PNResult
@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;
@end
```

Error status identical to section 1.

---

## 3. Remove device from channel

### Method signatures

```
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(NSData *)pushToken
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(id)pushToken
                                   pushType:(PNPushType)pushType
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)removePushNotificationsFromChannels:(NSArray<NSString *> *)channels
                        withDevicePushToken:(id)pushToken
                                   pushType:(PNPushType)pushType
                                environment:(PNAPNSEnvironment)environment
                                      topic:(NSString *)topic
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

### Builder pattern

```
push()
    .disable()
    .channels(NSArray<NSString *> *)
    .token(id)                // or .fcmToken(NSString *)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```

### Sample code

```
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                   andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 20 lines)

#### Other examples

```
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                        pushType:PNFCMPush
                                   andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 16 lines)

```
[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]
                             withDevicePushToken:self.devicePushToken
                                        pushType:PNAPNS2Push
                                     environment:PNAPNSProduction
                                           topic:@"com.my-application.bundle"
                                   andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 18 lines)

### Response

Same as section 1.

---

## 4. Remove all mobile push notifications

### Method signatures

```
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(NSData *)pushToken
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken
                                                 pushType:(PNPushType)pushType
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

```
- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken
                                                 pushType:(PNPushType)pushType
                                              environment:(PNAPNSEnvironment)environment
                                                    topic:(NSString *)topic
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;
```

### Builder pattern

```
push()
    .disableAll()
    .token(id)
    .pushType(PNPushType)
    .environment(PNAPNSEnvironment)
    .topic(NSString *)
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);
```

### Sample code

```
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 22 lines)

#### Other examples

```
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                      pushType:PNFCMPush
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 18 lines)

```
[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken
                                                      pushType:PNAPNS2Push
                                                   environment:PNAPNSProduction
                                                         topic:@"com.my-application.bundle"
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // status.retry
    }
}];
```
(show all 20 lines)

### Response

Same as section 1.

---

All response/error objects (`PNAcknowledgmentStatus`, `PNErrorStatus`, `PNErrorData`, `PNAPNSEnabledChannelsResult`, etc.) are included above; their interfaces are unchanged across operations.