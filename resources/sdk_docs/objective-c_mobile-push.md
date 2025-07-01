On this page
# Mobile Push Notifications API for Objective-C SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

##### APNs version support

PubNub Objective-C SDK supports both the HTTP/2-based Apple Push Notification service (APNs) and the already deprecated legacy binary protocol for APNs Mobile Push Notifications. Depending on the APNs version you use in your SDK, set `pushType` in methods to either `PNAPNS2Push` or `PNAPNSPush`.

## Add Device to Channel[​](#add-device-to-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel`, you can use the following method(s) in the Objective-C SDK:

```
`- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
                   withDevicePushToken:(NSData *)pushToken   
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` names for which mobile push notifications should be `enabled`.`pushToken` *Type: NSDataDevice push token which should be used to enable mobile push notifications on specified set of `channels`.`block`Type: PNPushNotificationsStateModificationCompletionBlockPush notifications addition on `channels` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

```
`- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
                   withDevicePushToken:(id)pushToken   
                              pushType:(PNPushType)pushType   
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be enabled.`pushToken` *Type: idDevice token / identifier that you must set to `NSString`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)

`block`Type: PNPushNotificationsStateModificationCompletionBlock`Add notifications for channels` request completion block.

```
`- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
                   withDevicePushToken:(id)pushToken   
                              pushType:(PNPushType)pushType   
                           environment:(PNAPNSEnvironment)environment   
                                 topic:(NSString *)topic   
                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>`List of channel names for which mobile push notifications should be enabled.`pushToken` *Type: idDevice token / identifier that you must set to `NSData`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment` *Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Add notifications for channels` request completion block.

### Basic Usage[​](#basic-usage)

#### Add Device to Channel[​](#add-device-to-channel-1)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"pushUser"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Simulating a device token for example purposes  
// In a real app, you would get this from the system  
NSData *devicePushToken = [@"sample-device-token-12345" dataUsingEncoding:NSUTF8StringEncoding];  
  
`
```
show all 76 lines

### Response[​](#response)

Response objects returned by the client when the `APNS Add Device` API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Other Examples[​](#other-examples)

Example for method no. 2

```
`[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]  
                        withDevicePushToken:self.devicePushToken  
                                   pushType:PNFCMPush  
                              andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Push notifications successful enabled on passed channels.  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
    }  
`
```
show all 16 lines

Example for method no. 3

```
`[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]  
                        withDevicePushToken:self.devicePushToken  
                                   pushType:PNAPNS2Push  
                                environment:PNAPNSProduction  
                                      topic:@"com.my-application.bundle"  
                              andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Push notifications successful enabled on passed channels.  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
`
```
show all 18 lines

## Add Device to Channel (Builder Pattern)[​](#add-device-to-channel-builder-pattern)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on a provided set of channels.

### Method(s)[​](#methods-1)

To run `Adding Device to Channel`, you can use the following method(s) in the Objective-C SDK

#### APNS2 Token[​](#apns2-token)

```
`push()  
    .enable()  
    .token(id)  
    .channels(NSArrayNSString *> *)  
    .pushType(PNPushType)  
    .environment(PNAPNSEnvironment)  
    .topic(NSString *)  
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>`List of channel names for which mobile push notifications should be enabled.`token` *Type: idDevice token / identifier that you must set to `NSData`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment`Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic`Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Add notifications for channels` request completion block.

##### Note

This method uses the builder pattern, you can remove optional arguments.

#### FCM Token[​](#fcm-token)

```
`push()  
    .enable()  
    .fcmToken(NSString *)  
    .channels(NSArrayNSString *> *)  
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of `channel` names for which mobile push notifications should be `enabled`.`fcmToken` *Type: NSString *FCM-provided device push token which should be used to enable mobile push notifications on a specified set of `channels`.`completion`Type: PNPushNotificationsStateModificationCompletionBlockPush notifications addition on `channels` processing `completion block` which pass only one argument - request processing status to report about how data pushing was successful or not.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Basic Usage[​](#basic-usage-1)

#### APNS2 Token[​](#apns2-token-1)

```
`self.client.push().enable()  
    .token(self.devicePushToken)  
    .channels(@[@"wwdc",@"google.io"])  
    .pushType(PNAPNS2Push)  
    .environment(PNAPNSProduction)  
    .topic(@"com.my-application.bundle")  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            // Push notifications successful enabled on passed channels.  
        } else {  
            /**  
             * Handle modification error. Check 'category' property to find out possible issue because  
             * of which request did fail.  
             *  
             * Request can be resent using: [status retry];  
`
```
show all 18 lines

#### FCM Token[​](#fcm-token-1)

```
`self.client.push().enable()  
    .token(self.devicePushToken)  
    .channels(@[@"wwdc",@"google.io"])  
    .pushType(PNFCMPush)  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            // Push notifications successful enabled on passed channels.  
        } else {  
            /**  
             * Handle modification error. Check 'category' property to find out possible issue because  
             * of which request did fail.  
             *  
             * Request can be resent using: [status retry];  
             */  
        }  
`
```
show all 16 lines

### Response[​](#response-1)

Response objects returned by the client when the `APNS Add Device` API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

## List Channels For Device[​](#list-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-2)

To run `Listing Channels For Device`, you can use the following method(s) in the Objective-C SDK:

```
`- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(NSData *)pushToken   
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

*  requiredParameterDescription`pushToken` *Type: NSDataDevice push token against which search on PubNub service should be performed.`block` *Type: PNPushNotificationsStateAuditCompletionBlockPush `notifications` status processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of push `notifications` audit operation; status - in case if an error occurred during request processing.

```
`- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken   
                                                     pushType:(PNPushType)pushType   
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

*  requiredParameterDescription`pushToken` *Type: idDevice token / identifier that you must set to `NSString``pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)

`block` *Type: PNPushNotificationsStateAuditCompletionBlock`Audit notifications enabled channels` request completion block.

```
`- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken   
                                                     pushType:(PNPushType)pushType   
                                                  environment:(PNAPNSEnvironment)environment   
                                                        topic:(NSString *)topic   
                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

*  requiredParameterDescription`pushToken` *Type: idDevice token / identifier that you must set to either `NSData` (for `PNAPNS2Push` and `PNAPNSPush`) or `NSString` for other, depending on the `pushType` passed.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment` *Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block` *Type: PNPushNotificationsStateAuditCompletionBlock`Audit notifications enabled channels` request completion block.

### Basic Usage[​](#basic-usage-2)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
                                                      andCompletion:^(PNAPNSEnabledChannelsResult *result,  
                                                                      PNErrorStatus *status) {  
      if (!status) {  
  
        // Handle downloaded list of channels using: result.data.channels  
    }  
    else {  
  
        /**  
         Handle audition error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

### Response[​](#response-2)

Response objects returned by the client when the `APNS List Devices` API is used:

```
`@interface PNAPNSEnabledChannelsData : PNServiceData  
  
// Channels with active mobile push notifications.  
@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
  
@end  
  
@interface PNAPNSEnabledChannelsResult : PNResult  
  
// APNS enabled channels audit request processed information.  
@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;  
  
@end  
`
```

Error response which is used in case of `APNS List Devices` API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Other Examples[​](#other-examples-1)

Example for method no. 2

```
`[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
                         pushType:PNFCMPush  
                    andCompletion:^(PNFCMEnabledChannelsResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        // Handle downloaded list of channels using: result.data.channels  
    } else {  
        /**  
         * Handle audition error. Check 'category' property to find out possible issue because of  
         * which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
    }  
}];  
`
```

Example for method no. 3

```
`[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
                         pushType:PNAPNS2Push  
                      environment:PNAPNSDevelopment  
                            topic:@"com.my-application.bundle"  
                    andCompletion:^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        // Handle downloaded list of channels using: result.data.channels  
    } else {  
        /**  
         * Handle audition error. Check 'category' property to find out possible issue because of  
         * which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
`
```
show all 17 lines

## List Channels For Device (Builder Pattern)[​](#list-channels-for-device-builder-pattern)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-3)

To run `Listing Channels For Device`, you can use the following method(s) in the Objective-C SDK

#### APNS2 Token[​](#apns2-token-2)

```
`push()  
    .audit()  
    .token(id)  
    .pushType(PNPushType)  
    .environment(PNAPNSEnvironment)  
    .topic(NSString *)  
    .performWithCompletion(PNPushNotificationsStateAuditCompletionBlock);  
  
`
```

*  requiredParameterDescription`token` *Type: idDevice token / identifier that you must set to `NSData``pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment`Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic`Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block` *Type: PNPushNotificationsStateAuditCompletionBlock`Audit notifications enabled channels` request completion block.

##### Note

This method uses the builder pattern, you can remove optional arguments.

#### FCM Token[​](#fcm-token-2)

```
`push()  
    .audit()  
    .fcmToken(NSString *)  
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
`
```

*  requiredParameterDescription`fcmToken` *Type: NSString *FCM-provided device `push token` against which search on PubNub service should be performed.`completion` *Type: PNPushNotificationsStateAuditCompletionBlockPush `notifications` status processing completion `block` which pass two arguments: `result` - in case of successful request processing `data` field will contain results of push `notifications` audit operation; `status` - in case if error occurred during request processing.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Basic Usage[​](#basic-usage-3)

#### APNS2 Token[​](#apns2-token-3)

```
`self.client.push().audit()  
    .token(self.devicePushToken)  
    .pushType(PNAPNS2Push)  
    .environment(PNAPNSProduction)  
    .topic(@"com.my-application.bundle")  
    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            // Handle downloaded list of channels using: result.data.channels  
        } else {  
            /**  
             * Handle audition error. Check 'category' property to find out possible issue because of  
             * which request did fail.  
             *  
             * Request can be resent using: [status retry];  
             */  
`
```
show all 17 lines

#### FCM Token[​](#fcm-token-3)

```
`self.client.push().audit()  
    .fcmToken(self.pushToken)  
    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
        if (!status) {  
            // Handle downloaded list of channels using: result.data.channels  
        } else {  
            /**  
             Handle audition error. Check 'category' property  
             to find out possible reason because of which request did fail.  
             Review 'errorData' property (which has PNErrorData data type) of status  
             object to get additional information about issue.  
  
             Request can be resent using: [status retry];  
            */  
        }  
`
```
show all 16 lines

### Response[​](#response-3)

Response objects returned by the client when the `APNS List Devices` API is used:

```
`@interface PNAPNSEnabledChannelsData : PNServiceData  
  
// Channels with active mobile push notifications.  
@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
  
@end  
  
@interface PNAPNSEnabledChannelsResult : PNResult  
  
// APNS enabled channels audit request processed information.  
@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;  
  
@end  
`
```

Error response which is used in case of `APNS List Devices` API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

## Remove Device From Channel[​](#remove-device-from-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on a provided set of channels.

### Method(s)[​](#methods-4)

To run `Removing Device From Channel`, you can use the following method(s) in the Objective-C SDK:

```
`- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
                        withDevicePushToken:(NSData *)pushToken   
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of channel names for which mobile push notifications should be disabled. If the passed list is empty, all notifications will be disabled.`pushToken` *Type: NSDataDevice push token which should be used to disable push `notifications` on a specified set of `channels`.`block`Type: PNPushNotificationsStateModificationCompletionBlockPush `notifications` removal from `channels` processing completion `block` which pass only one argument - request processing `status` to report about how data pushing was successful or not.

```
`- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
                        withDevicePushToken:(id)pushToken   
                                   pushType:(PNPushType)pushType   
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be disabled.`pushToken` *Type: idDevice token / identifier that you must set to `NSString`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)

`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove notifications from channels` request completion block.

```
`- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
                        withDevicePushToken:(id)pushToken   
                                   pushType:(PNPushType)pushType   
                                environment:(PNAPNSEnvironment)environment   
                                      topic:(NSString *)topic   
                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be disabled.`pushToken` *Type: idDevice token / identifier that you must set to either `NSData`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment` *Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove notifications from channels` request completion block.

### Basic Usage[​](#basic-usage-4)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
                             withDevicePushToken:self.devicePushToken  
                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
  
        // Handle successful push notification disabling on passed channels.  
    }  
    else {  
  
        /**  
         Handle modification error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
`
```
show all 20 lines

### Response[​](#response-4)

Response objects returned by the client when the `APNS Remove Device` API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Other Examples[​](#other-examples-2)

Example for method no. 2

```
`[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
                             withDevicePushToken:self.devicePushToken  
                                        pushType:PNFCMPush  
                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Push notification successfully disabled on passed channels.  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
    }  
`
```
show all 16 lines

Example for method no. 3

```
`[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
                             withDevicePushToken:self.devicePushToken  
                                        pushType:PNAPNS2Push  
                                     environment:PNAPNSProduction  
                                           topic:@"com.my-application.bundle"  
                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Push notification successfully disabled on passed channels.  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
`
```
show all 18 lines

## Remove Device From Channel (Builder Pattern)[​](#remove-device-from-channel-builder-pattern)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on a provided set of channels.

### Method(s)[​](#methods-5)

To run `Removing Device From Channel`, you can use the following method(s) in the Objective-C SDK

#### APNS2 Token[​](#apns2-token-4)

```
`push()  
    .disable()  
    .channels(NSArrayNSString *> *)  
    .token(id)  
    .pushType(PNPushType)  
    .environment(PNAPNSEnvironment)  
    .topic(NSString *)  
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be disabled.`token` *Type: idDevice token / identifier that you must set to either `NSData`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment`Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic`Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove notifications from channels` request completion block.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### FCM Token[​](#fcm-token-4)

```
`push()  
    .disable()  
    .fcmToken(NSString *)  
    .channels(NSArrayNSString *> *)  
    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be disabled. If the passed list is empty, all notifications will be disabled.`fcmToken` *Type: NSString *FCM-provided device push token which should be used to disable push `notifications` on a specified set of `channels`.`completion`Type: PNPushNotificationsStateAuditCompletionBlockPush `notifications` removal from `channels` processing completion `block` which pass only one argument - request processing `status` to report about how data pushing was successful or not.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Basic Usage[​](#basic-usage-5)

#### APNS2 Token[​](#apns2-token-5)

```
`self.client.push().disable()  
    .token(self.devicePushToken)  
    .channels(@[@"wwdc",@"google.io"])  
    .pushType(PNAPNS2Push)  
    .environment(PNAPNSProduction)  
    .topic(@"com.my-application.bundle")  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            // Push notification successfully disabled on passed channels.  
        } else {  
            /**  
             * Handle modification error. Check 'category' property to find out possible issue because  
             * of which request did fail.  
             *  
             * Request can be resent using: [status retry];  
`
```
show all 18 lines

#### FCM Token[​](#fcm-token-5)

```
`self.client.push().disable()  
    .channels(@[@"channel1", @"channel2"])  
    .fcmToken(self.pushToken)  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
           // Handle successful push notification enabling on passed channels.  
        } else {  
           /**  
            Handle modification error. Check 'category' property  
            to find out possible reason because of which request did fail.  
            Review 'errorData' property (which has PNErrorData data type) of status  
            object to get additional information about issue.  
  
            Request can be resent using: [status retry];  
            */  
`
```
show all 17 lines

### Response[​](#response-5)

Response objects returned by the client when the `APNS Remove Device` API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-6)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeAllPushNotificationsFromDeviceWithPushToken:(NSData *)pushToken   
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block  
`
```

*  requiredParameterDescription`pushToken` *Type: NSDataDevice push token which should be used to disable push `notifications` on a specified set of `channels`.`block`Type: PNPushNotificationsStateModificationCompletionBlockPush `notifications` removal from device processing completion `block` which pass only one argument - request processing `status` to report about how data pushing was successful or not.

```
`- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken   
                                                 pushType:(PNPushType)pushType   
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`pushToken` *Type: idDevice token / identifier that you must set to `NSString`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)

`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove all notifications` request completion block.

```
`- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken   
                                                 pushType:(PNPushType)pushType   
                                              environment:(PNAPNSEnvironment)environment   
                                                    topic:(NSString *)topic   
                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *List of channel names for which mobile push notifications should be disabled.`pushToken` *Type: idDevice token / identifier that you must set to `NSData`.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2

`environment` *Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove all notifications` request completion block.

### Basic Usage[​](#basic-usage-6)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
  
        /**  
         Handle successful push notification disabling for all channels associated with  
         specified device push token.  
         */  
    }  
    else {  
  
        /**  
         Handle modification error. Check 'category' property  
         to find out possible reason because of which request did fail.  
`
```
show all 22 lines

### Response[​](#response-6)

Response objects returned by the client when the `APNS Remove All Devices` API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Other Examples[​](#other-examples-3)

Example for method no. 2.

```
`[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
                                                      pushType:PNFCMPush  
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * Push notification successfully disabled for all channels associated with specified  
         * device push token.  
         */  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
`
```
show all 18 lines

Example for method no. 3

```
`[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
                                                      pushType:PNAPNS2Push  
                                                   environment:PNAPNSProduction  
                                                         topic:@"com.my-application.bundle"  
                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * Push notification successfully disabled for all channels associated with specified  
         * device push token.  
         */  
    } else {  
        /**  
         * Handle modification error. Check 'category' property to find out possible issue because  
         * of which request did fail.  
`
```
show all 20 lines

## Remove all mobile push notifications (Builder Pattern)[​](#remove-all-mobile-push-notifications-builder-pattern)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

### Method(s)[​](#methods-7)

```
`push()  
    .disableAll()  
    .token(id)  
    .pushType(PNPushType)  
    .environment(PNAPNSEnvironment)  
    .topic(NSString *)  
    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

*  requiredParameterDescription`token` *Type: idDevice token / identifier that you must set to either `NSData` (for `PNAPNS2Push`) or `NSString` depending on the `pushType` passed.`pushType` *Type: PNPushTypeOne of `PNPushType` fields which specify service to manage notifications for device specified with `pushToken`.   
Available push types: 
- `PNAPNS2Push` - Apple Push Notification service over HTTP/2
- `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)

`environment`Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which device should manage list of channels with enabled notifications (works only if `pushType` set to `PNAPNS2Push`).`topic`Type: NSStringNotifications topic name (usually it is application's bundle identifier).`block`Type: PNPushNotificationsStateModificationCompletionBlock`Remove all notifications` request completion block.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Basic Usage[​](#basic-usage-7)

#### Remove all mobile push notifications, using Builder Pattern (APNS2)[​](#remove-all-mobile-push-notifications-using-builder-pattern-apns2)

```
`self.client.push().disableAll()  
    .token(self.devicePushToken)  
    .pushType(PNAPNS2Push)  
    .environment(PNAPNSProduction)  
    .topic(@"com.my-application.bundle")  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            /**  
             * Push notification successfully disabled for all channels associated with specified  
             * device push token.  
             */  
        } else {  
            /**  
             * Handle modification error. Check 'category' property to find out possible issue because  
             * of which request did fail.  
`
```
show all 20 lines

#### Remove all mobile push notifications, using Builder Pattern (FCM)[​](#remove-all-mobile-push-notifications-using-builder-pattern-fcm)

```
`self.client.push().disableAll()  
    .token(self.devicePushToken)  
    .pushType(PNFCMPush)  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            /**  
             * Push notification successfully disabled for all channels associated with specified  
             * device push token.  
             */  
        } else {  
            /**  
             * Handle modification error. Check 'category' property to find out possible issue because  
             * of which request did fail.  
             *  
             * Request can be resent using: [status retry];  
`
```
show all 18 lines

### Response[​](#response-7)

Response object returned by the client when the `APNS Remove All Devices` API is used:

```
`@interface PNErrorData : PNServiceData**  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 linesLast updated on May 29, 2025**