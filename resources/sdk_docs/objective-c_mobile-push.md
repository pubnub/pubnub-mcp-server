# Mobile Push Notifications API for Objective-C SDK (condensed)

Mobile Push connects PubNub publishing to third-party push services: **FCM** (Android) and **APNs** (iOS).

## APNs version support

Objective-C SDK supports:
- **APNs HTTP/2**: use `pushType = PNAPNS2Push`
- **Legacy APNs binary** (deprecated): use `pushType = PNAPNSPush`

---

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on
Enable **Mobile Push Notifications** for your key in the [Admin Portal](https://admin.pubnub.com/).

Enable mobile push notifications on a set of channels.

### Method(s)

```
`1- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
2                   withDevicePushToken:(NSData *)pushToken   
3                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray)*: Channels to enable for push notifications.  
- `pushToken` *(required, NSData)*: Device push token.  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*: Completion block with request status.

```
`1- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
2                   withDevicePushToken:(id)pushToken   
3                              pushType:(PNPushType)pushType   
4                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray<NSString *>)*: Channels to enable for push notifications.  
- `pushToken` *(required, id)*: Device token (`NSString`).  
- `pushType` *(required, PNPushType)*:  
  - `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*: Completion block.

```
`1- (void)addPushNotificationsOnChannels:(NSArrayNSString *> *)channels   
2                   withDevicePushToken:(id)pushToken   
3                              pushType:(PNPushType)pushType   
4                           environment:(PNAPNSEnvironment)environment   
5                                 topic:(NSString *)topic   
6                         andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray<NSString *>)*: Channels to enable for push notifications.  
- `pushToken` *(required, id)*: Device token (`NSData`).  
- `pushType` *(required, PNPushType)*:  
  - `PNAPNS2Push` - Apple Push Notification service over HTTP/2  
- `environment` *(required, PNAPNSEnvironment)*: APNs environment (APNS2 only).  
- `topic` *(required, NSString)*: APNs topic (bundle identifier).  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*: Completion block.

### Sample code

#### Add device to channel

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Basic configuration  
5PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
6                                                          subscribeKey:@"demo"  
7                                                                userID:@"pushUser"];  
8
  
9// Create a PubNub client instance  
10PubNub *client = [PubNub clientWithConfiguration:config];  
11
  
12// Simulating a device token for example purposes  
13// In a real app, you would get this from the system  
14NSData *devicePushToken = [@"sample-device-token-12345" dataUsingEncoding:NSUTF8StringEncoding];  
15
  
16// Example 1: Basic APNs integration - using legacy binary protocol  
17NSArray *channels = @[@"news", @"sports", @"finance"];  
18
  
19NSLog(@"Adding device to channels: %@ with legacy APNs", channels);  
20
  
21PNPushNotificationManageRequest *request = [PNPushNotificationManageRequest requestToAddChannels:channels  
22                                                                               toDeviceWithToken:devicePushToken  
23                                                                                        pushType:PNAPNSPush];  
24
  
25[client managePushNotificationWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
26    if (!status.isError) {  
27        NSLog(@"✅ Successfully enabled push notifications on channels!");  
28        NSLog(@"Device can now receive push notifications when messages are published to these channels");  
29    } else {  
30        NSLog(@"❌ Error enabling push notifications: %@", status.errorData.information);  
31        NSLog(@"Error category: %@", @(status.category));  
32    }  
33}];  
34
  
35// Example 2: Modern APNs integration using HTTP/2 protocol  
36NSArray *apns2Channels = @[@"news", @"sports", @"finance"];  
37
  
38NSLog(@"Adding device to channels: %@ with APNs2 (HTTP/2)", apns2Channels);  
39
  
40// Your app's bundle identifier  
41NSString *topicName = @"com.example.myapp";  
42
  
43PNPushNotificationManageRequest *apns2Request = [PNPushNotificationManageRequest requestToAddChannels:apns2Channels  
44                                                                                    toDeviceWithToken:devicePushToken  
45                                                                                             pushType:PNAPNS2Push];  
46apns2Request.environment = PNAPNSDevelopment;  
47apns2Request.topic = topicName;  
48
  
49[client managePushNotificationWithRequest:apns2Request completion:^(PNAcknowledgmentStatus *status) {  
50    if (!status.isError) {  
51        NSLog(@"✅ Successfully enabled APNS2 push notifications on channels!");  
52        NSLog(@"Device can now receive push notifications when messages are published to these channels");  
53    } else {  
54        NSLog(@"❌ Error enabling APNS2 push notifications: %@", status.errorData.information);  
55        NSLog(@"Error category: %@", @(status.category));  
56    }  
57}];  
58
  
59// Example 3: FCM integration  
60NSArray *fcmChannels = @[@"news", @"sports", @"finance"];  
61
  
62NSLog(@"Adding device to channels: %@ with FCM", fcmChannels);  
63
  
64PNPushNotificationManageRequest *fcmRequest = [PNPushNotificationManageRequest requestToAddChannels:fcmChannels  
65                                                                                  toDeviceWithToken:devicePushToken  
66                                                                                           pushType:PNFCMPush];  
67
  
68[client managePushNotificationWithRequest:fcmRequest completion:^(PNAcknowledgmentStatus *status) {  
69    if (!status.isError) {  
70        NSLog(@"✅ Successfully enabled FCM push notifications on channels!");  
71        NSLog(@"Device can now receive push notifications when messages are published to these channels");  
72    } else {  
73        NSLog(@"❌ Error enabling FCM push notifications: %@", status.errorData.information);  
74        NSLog(@"Error category: %@", @(status.category));  
75    }  
76}];  

```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

### Other examples

Example for method no. 2

```
1[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]  
2                        withDevicePushToken:self.devicePushToken  
3                                   pushType:PNFCMPush  
4                              andCompletion:^(PNAcknowledgmentStatus *status) {  
5
  
6    if (!status.isError) {  
7        // Push notifications successful enabled on passed channels.  
8    } else {  
9        /**  
10         * Handle modification error. Check 'category' property to find out possible issue because  
11         * of which request did fail.  
12         *  
13         * Request can be resent using: [status retry];  
14         */  
15    }  
16}];  

```

Example for method no. 3

```
1[self.client addPushNotificationsOnChannels:@[@"wwdc",@"google.io"]  
2                        withDevicePushToken:self.devicePushToken  
3                                   pushType:PNAPNS2Push  
4                                environment:PNAPNSProduction  
5                                      topic:@"com.my-application.bundle"  
6                              andCompletion:^(PNAcknowledgmentStatus *status) {  
7
  
8    if (!status.isError) {  
9        // Push notifications successful enabled on passed channels.  
10    } else {  
11        /**  
12         * Handle modification error. Check 'category' property to find out possible issue because  
13         * of which request did fail.  
14         *  
15         * Request can be resent using: [status retry];  
16         */  
17    }  
18}];  

```

---

## Add a device to a push notifications channel (builder pattern)

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/).

### Method(s)

#### APNS2 token

```
`1push()  
2    .enable()  
3    .token(id)  
4    .channels(NSArrayNSString *> *)  
5    .pushType(PNPushType)  
6    .environment(PNAPNSEnvironment)  
7    .topic(NSString *)  
8    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

- `channels` *(required, NSArray<NSString *>)*  
- `token` *(required, id = NSData)*  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

##### Note
Builder pattern; optional args may be omitted.

#### FCM token

```
1push()  
2    .enable()  
3    .fcmToken(NSString *)  
4    .channels(NSArrayNSString *> *)  
5    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
6
  

```

- `channels` *(required, NSArray<NSString *>)*  
- `fcmToken` *(required, NSString)*  
- `completion` *(PNPushNotificationsStateModificationCompletionBlock)*

##### Note
Builder pattern; optional args may be omitted.

### Sample code

#### APNS2 token

```
`1self.client.push().enable()  
2    .token(self.devicePushToken)  
3    .channels(@[@"wwdc",@"google.io"])  
4    .pushType(PNAPNS2Push)  
5    .environment(PNAPNSProduction)  
6    .topic(@"com.my-application.bundle")  
7    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
8        if (!status.isError) {  
9            // Push notifications successful enabled on passed channels.  
10        } else {  
11            /**  
12             * Handle modification error. Check 'category' property to find out possible issue because  
13             * of which request did fail.  
14             *  
15             * Request can be resent using: [status retry];  
16             */  
17        }  
18    });  
`
```

#### FCM token

```
`1self.client.push().enable()  
2    .token(self.devicePushToken)  
3    .channels(@[@"wwdc",@"google.io"])  
4    .pushType(PNFCMPush)  
5    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
6        if (!status.isError) {  
7            // Push notifications successful enabled on passed channels.  
8        } else {  
9            /**  
10             * Handle modification error. Check 'category' property to find out possible issue because  
11             * of which request did fail.  
12             *  
13             * Request can be resent using: [status retry];  
14             */  
15        }  
16    });  
`
```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

## List push notifications channels for a device (builder pattern)

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications in the [Admin Portal](https://admin.pubnub.com/).

List channels with push notifications enabled for the specified device token.

### Method(s)

```
`1- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(NSData *)pushToken   
2                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

- `pushToken` *(required, NSData)*: Device push token to audit.  
- `block` *(required, PNPushNotificationsStateAuditCompletionBlock)*: Returns `result` (success) and `status` (error).

```
`1- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken   
2                                                     pushType:(PNPushType)pushType   
3                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

- `pushToken` *(required, id = NSString)*  
- `pushType` *(required)*: `PNFCMPush`  
- `block` *(PNPushNotificationsStateAuditCompletionBlock)*

```
`1- (void)pushNotificationEnabledChannelsForDeviceWithPushToken:(id)pushToken   
2                                                     pushType:(PNPushType)pushType   
3                                                  environment:(PNAPNSEnvironment)environment   
4                                                        topic:(NSString *)topic   
5                                                andCompletion:(PNPushNotificationsStateAuditCompletionBlock)block;  
`
```

- `pushToken` *(required, id)*: `NSData` for `PNAPNS2Push`/`PNAPNSPush`, `NSString` otherwise (depends on `pushType`).  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateAuditCompletionBlock)*

### Sample code

#### List channels for device

```
1[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
2                                                      andCompletion:^(PNAPNSEnabledChannelsResult *result,  
3                                                                      PNErrorStatus *status) {  
4      if (!status) {  
5
  
6        // Handle downloaded list of channels using: result.data.channels  
7    }  
8    else {  
9
  
10        /**  
11         Handle audition error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15
  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19 }];  

```

### Response

```
1@interface PNAPNSEnabledChannelsData : PNServiceData  
2
  
3// Channels with active mobile push notifications.  
4@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
5
  
6@end  
7
  
8@interface PNAPNSEnabledChannelsResult : PNResult  
9
  
10// APNS enabled channels audit request processed information.  
11@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;  
12
  
13@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

### Other examples

Example for method no. 2

```
1[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
2                         pushType:PNFCMPush  
3                    andCompletion:^(PNFCMEnabledChannelsResult *result, PNErrorStatus *status) {  
4
  
5    if (!status.isError) {  
6        // Handle downloaded list of channels using: result.data.channels  
7    } else {  
8        /**  
9         * Handle audition error. Check 'category' property to find out possible issue because of  
10         * which request did fail.  
11         *  
12         * Request can be resent using: [status retry];  
13         */  
14    }  
15}];  

```

Example for method no. 3

```
1[self.client pushNotificationEnabledChannelsForDeviceWithPushToken:self.devicePushToken  
2                         pushType:PNAPNS2Push  
3                      environment:PNAPNSDevelopment  
4                            topic:@"com.my-application.bundle"  
5                    andCompletion:^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
6
  
7    if (!status.isError) {  
8        // Handle downloaded list of channels using: result.data.channels  
9    } else {  
10        /**  
11         * Handle audition error. Check 'category' property to find out possible issue because of  
12         * which request did fail.  
13         *  
14         * Request can be resent using: [status retry];  
15         */  
16    }  
17}];  

```

---

## List channels for device (builder pattern)

##### Requires Mobile Push Notifications add-on

Request all channels where push notification is enabled for a `pushToken`.

### Method(s)

#### APNS2 token

```
1push()  
2    .audit()  
3    .token(id)  
4    .pushType(PNPushType)  
5    .environment(PNAPNSEnvironment)  
6    .topic(NSString *)  
7    .performWithCompletion(PNPushNotificationsStateAuditCompletionBlock);  
8
  

```

- `token` *(required, id = NSData)*  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateAuditCompletionBlock)*

##### Note
Builder pattern; optional args may be omitted.

#### FCM token

```
`1push()  
2    .audit()  
3    .fcmToken(NSString *)  
4    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
`
```

- `fcmToken` *(required, NSString)*  
- `completion` *(PNPushNotificationsStateAuditCompletionBlock)*: returns `result` and `status`.

##### Note
Builder pattern; optional args may be omitted.

### Sample code

#### APNS2 token

```
`1self.client.push().audit()  
2    .token(self.devicePushToken)  
3    .pushType(PNAPNS2Push)  
4    .environment(PNAPNSProduction)  
5    .topic(@"com.my-application.bundle")  
6    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
7        if (!status.isError) {  
8            // Handle downloaded list of channels using: result.data.channels  
9        } else {  
10            /**  
11             * Handle audition error. Check 'category' property to find out possible issue because of  
12             * which request did fail.  
13             *  
14             * Request can be resent using: [status retry];  
15             */  
16        }  
17    });  
`
```

#### FCM token

```
1self.client.push().audit()  
2    .fcmToken(self.pushToken)  
3    .performWithCompletion(^(PNAPNSEnabledChannelsResult *result, PNErrorStatus *status) {  
4        if (!status) {  
5            // Handle downloaded list of channels using: result.data.channels  
6        } else {  
7           /**  
8            Handle audition error. Check 'category' property  
9            to find out possible reason because of which request did fail.  
10            Review 'errorData' property (which has PNErrorData data type) of status  
11            object to get additional information about issue.  
12
  
13            Request can be resent using: [status retry];  
14            */  
15        }  
16    });  

```

### Response

```
1@interface PNAPNSEnabledChannelsData : PNServiceData  
2
  
3// Channels with active mobile push notifications.  
4@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
5
  
6@end  
7
  
8@interface PNAPNSEnabledChannelsResult : PNResult  
9
  
10// APNS enabled channels audit request processed information.  
11@property (nonatomic, readonly, strong) PNAPNSEnabledChannelsData *data;  
12
  
13@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

## Remove device from channel

##### Requires Mobile Push Notifications add-on

Disable mobile push notifications on a provided set of channels.

### Method(s)

```
`1- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
2                        withDevicePushToken:(NSData *)pushToken   
3                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray)*: Channels to disable. If empty, disables all.  
- `pushToken` *(required, NSData)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

```
`1- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
2                        withDevicePushToken:(id)pushToken   
3                                   pushType:(PNPushType)pushType   
4                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray<NSString *>)*  
- `pushToken` *(required, id = NSString)*  
- `pushType` *(required)*: `PNFCMPush`  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

```
`1- (void)removePushNotificationsFromChannels:(NSArrayNSString *> *)channels   
2                        withDevicePushToken:(id)pushToken   
3                                   pushType:(PNPushType)pushType   
4                                environment:(PNAPNSEnvironment)environment   
5                                      topic:(NSString *)topic   
6                              andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(required, NSArray<NSString *>)*  
- `pushToken` *(required, id = NSData)*  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

### Sample code

#### Remove device from channel

```
1[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
2                             withDevicePushToken:self.devicePushToken  
3                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
4
  
5    if (!status.isError) {  
6
  
7        // Handle successful push notification disabling on passed channels.  
8    }  
9    else {  
10
  
11        /**  
12         Handle modification error. Check 'category' property  
13         to find out possible reason because of which request did fail.  
14         Review 'errorData' property (which has PNErrorData data type) of status  
15         object to get additional information about issue.  
16
  
17         Request can be resent using: [status retry];  
18         */  
19    }  
20}];  

```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

### Other examples

Example for method no. 2

```
1[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
2                             withDevicePushToken:self.devicePushToken  
3                                        pushType:PNFCMPush  
4                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
5
  
6    if (!status.isError) {  
7        // Push notification successfully disabled on passed channels.  
8    } else {  
9        /**  
10         * Handle modification error. Check 'category' property to find out possible issue because  
11         * of which request did fail.  
12         *  
13         * Request can be resent using: [status retry];  
14         */  
15    }  
16}];  

```

Example for method no. 3

```
1[self.client removePushNotificationsFromChannels:@[@"wwdc",@"google.io"]  
2                             withDevicePushToken:self.devicePushToken  
3                                        pushType:PNAPNS2Push  
4                                     environment:PNAPNSProduction  
5                                           topic:@"com.my-application.bundle"  
6                                   andCompletion:^(PNAcknowledgmentStatus *status) {  
7
  
8    if (!status.isError) {  
9        // Push notification successfully disabled on passed channels.  
10    } else {  
11        /**  
12         * Handle modification error. Check 'category' property to find out possible issue because  
13         * of which request did fail.  
14         *  
15         * Request can be resent using: [status retry];  
16         */  
17    }  
18}];  

```

---

## Remove a device from push notifications channels (builder pattern)

##### Requires Mobile Push Notifications add-on

Disable mobile push notifications on a set of channels.

### Method(s)

#### APNS2 token

```
`1push()  
2    .disable()  
3    .channels(NSArrayNSString *> *)  
4    .token(id)  
5    .pushType(PNPushType)  
6    .environment(PNAPNSEnvironment)  
7    .topic(NSString *)  
8    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

- `channels` *(required, NSArray<NSString *>)*  
- `token` *(required, id = NSData)*  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

##### Note
Builder pattern; optional args may be omitted.

#### FCM token

```
`1push()  
2    .disable()  
3    .fcmToken(NSString *)  
4    .channels(NSArrayNSString *> *)  
5    .performWithCompletion(PNPushNotificationsStateModificationCompletionBlock);  
`
```

- `channels` *(required, NSArray<NSString *>)*: If empty, disables all.  
- `fcmToken` *(required, NSString)*  
- `completion` *(PNPushNotificationsStateAuditCompletionBlock)*: Completion block with request status.

##### Note
Builder pattern; optional args may be omitted.

### Sample code

#### APNS2 token

```
`1self.client.push().disable()  
2    .token(self.devicePushToken)  
3    .channels(@[@"wwdc",@"google.io"])  
4    .pushType(PNAPNS2Push)  
5    .environment(PNAPNSProduction)  
6    .topic(@"com.my-application.bundle")  
7    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
8        if (!status.isError) {  
9            // Push notification successfully disabled on passed channels.  
10        } else {  
11            /**  
12             * Handle modification error. Check 'category' property to find out possible issue because  
13             * of which request did fail.  
14             *  
15             * Request can be resent using: [status retry];  
16             */  
17        }  
18    });  
`
```

#### FCM token

```
1self.client.push().disable()  
2    .channels(@[@"channel1", @"channel2"])  
3    .fcmToken(self.pushToken)  
4    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
5        if (!status.isError) {  
6           // Handle successful push notification enabling on passed channels.  
7        } else {  
8           /**  
9            Handle modification error. Check 'category' property  
10            to find out possible reason because of which request did fail.  
11            Review 'errorData' property (which has PNErrorData data type) of status  
12            object to get additional information about issue.  
13
  
14            Request can be resent using: [status retry];  
15            */  
16        }  
17    });  

```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

## Remove a device from all push notifications channels (builder pattern)

##### Requires Mobile Push Notifications add-on

Disable mobile push notifications from **all** channels registered with the specified `pushToken`.

### Method(s)

```
`1- (void)removeAllPushNotificationsFromDeviceWithPushToken:(NSData *)pushToken   
2                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block  
`
```

- `pushToken` *(required, NSData)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*: returns request `status`.

```
`1- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken   
2                                                 pushType:(PNPushType)pushType   
3                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `pushToken` *(required, id = NSString)*  
- `pushType` *(required)*: `PNFCMPush`  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

```
`1- (void)removeAllPushNotificationsFromDeviceWithPushToken:(id)pushToken   
2                                                 pushType:(PNPushType)pushType   
3                                              environment:(PNAPNSEnvironment)environment   
4                                                    topic:(NSString *)topic   
5                                            andCompletion:(nullable PNPushNotificationsStateModificationCompletionBlock)block;  
`
```

- `channels` *(requiredParameterDescription, NSArray<NSString *>)*: List of channel names for which mobile push notifications should be disabled.  
- `pushToken` *(required, id = NSData)*  
- `pushType` *(required)*: `PNAPNS2Push`  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

### Sample code

#### Remove all mobile push notifications

```
1[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
2                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
3
  
4    if (!status.isError) {  
5
  
6        /**  
7         Handle successful push notification disabling for all channels associated with  
8         specified device push token.  
9         */  
10    }  
11    else {  
12
  
13        /**  
14         Handle modification error. Check 'category' property  
15         to find out possible reason because of which request did fail.  
16         Review 'errorData' property (which has PNErrorData data type) of status  
17         object to get additional information about issue.  
18
  
19         Request can be resent using: [status retry];  
20         */  
21    }  
22}];  

```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

### Other examples

Example for method no. 2.

```
1[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
2                                                      pushType:PNFCMPush  
3                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
4
  
5    if (!status.isError) {  
6        /**  
7         * Push notification successfully disabled for all channels associated with specified  
8         * device push token.  
9         */  
10    } else {  
11        /**  
12         * Handle modification error. Check 'category' property to find out possible issue because  
13         * of which request did fail.  
14         *  
15         * Request can be resent using: [status retry];  
16         */  
17    }  
18}];  

```

Example for method no. 3

```
1[self.client removeAllPushNotificationsFromDeviceWithPushToken:self.devicePushToken  
2                                                      pushType:PNAPNS2Push  
3                                                   environment:PNAPNSProduction  
4                                                         topic:@"com.my-application.bundle"  
5                                                 andCompletion:^(PNAcknowledgmentStatus *status) {  
6
  
7    if (!status.isError) {  
8        /**  
9         * Push notification successfully disabled for all channels associated with specified  
10         * device push token.  
11         */  
12    } else {  
13        /**  
14         * Handle modification error. Check 'category' property to find out possible issue because  
15         * of which request did fail.  
16         *  
17         * Request can be resent using: [status retry];  
18         */  
19    }  
20}];  

```

---

## Remove all mobile push notifications (builder pattern)

##### Requires Mobile Push Notifications add-on

### Method(s)

```
`1push()  
2    .disableAll()  
3    .token(id)  
4    .pushType(PNPushType)  
5    .environment(PNAPNSEnvironment)  
6    .topic(NSString *)  
7    .performWithCompletion(nullable PNPushNotificationsStateModificationCompletionBlock);  
`
```

- `token` *(required, id)*: `NSData` for `PNAPNS2Push`, otherwise `NSString`  
- `pushType` *(required, PNPushType)*:
  - `PNAPNS2Push` - Apple Push Notification service over HTTP/2  
  - `PNFCMPush` - Firebase Cloud Messaging (Google Cloud Messaging)  
- `environment` *(PNAPNSEnvironment; APNS2 only)*  
- `topic` *(NSString; bundle id)*  
- `block` *(PNPushNotificationsStateModificationCompletionBlock)*

##### Note
Builder pattern; optional args may be omitted.

### Sample code

#### Remove all mobile push notifications, using builder pattern (APNS2)

```
`1self.client.push().disableAll()  
2    .token(self.devicePushToken)  
3    .pushType(PNAPNS2Push)  
4    .environment(PNAPNSProduction)  
5    .topic(@"com.my-application.bundle")  
6    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * Push notification successfully disabled for all channels associated with specified  
10             * device push token.  
11             */  
12        } else {  
13            /**  
14             * Handle modification error. Check 'category' property to find out possible issue because  
15             * of which request did fail.  
16             *  
17             * Request can be resent using: [status retry];  
18             */  
19        }  
20    });  
`
```

#### Remove all mobile push notifications, using builder pattern (FCM)

```
`1self.client.push().disableAll()  
2    .token(self.devicePushToken)  
3    .pushType(PNFCMPush)  
4    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
5        if (!status.isError) {  
6            /**  
7             * Push notification successfully disabled for all channels associated with specified  
8             * device push token.  
9             */  
10        } else {  
11            /**  
12             * Handle modification error. Check 'category' property to find out possible issue because  
13             * of which request did fail.  
14             *  
15             * Request can be resent using: [status retry];  
16             */  
17        }  
18    });  
`
```

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
**16@end  

```