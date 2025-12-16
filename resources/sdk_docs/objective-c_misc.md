# Utility Methods API for Objective-C SDK

Utility methods that don’t fit other categories.

## Get size of message

Calculates the resulting message size before it is sent to the PubNub network.

### Method(s)

Use any of the following Objective-C SDK methods:

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `message` (id, **required**): Message for which size should be calculated.  
- `channel` (NSString, **required**): Channel name (part of request URI).  
- `block` (PNMessageSizeCalculationCompletionBlock, **required**): Called when calculation completes.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `compressMessage` (BOOL, **required**): `YES` to compress message before sending.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `shouldStore` (BOOL, **required**): `YES` to store in Message Persistence.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `shouldStore` (BOOL, **required**): `NO` if the message shouldn’t be available via Message Persistence API methods.  

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
4           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `metadata` (nullable NSDictionary<NSString *, id>): Values used by PubNub to filter messages.  
- `block` (PNMessageSizeCalculationCompletionBlock): Called when calculation completes.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `compressMessage` (BOOL): `true` if message is compressed before sending.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `shouldStore` (BOOL): `true` if marked to be stored in history.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

- `shouldStore` (BOOL): `true` if stored in history.  
- `compressMessage` (BOOL): `true` if compressed before sending.

### Sample code

#### Get message size

```
1[self.client sizeOfMessage: @{@"Hello": @"world"} toChannel: @"announcement"  
2             withCompletion:^(NSInteger size) {  
3
  
4    // Process calculated target message size.  
5 }];  

```

### Returns

The message size.

### Other examples

#### Get size of message with metadata

```
1[self.client sizeOfMessage: @{@"Hello": @"World"} toChannel: @"announcement"  
2              withMetadata: @{@"senderID": @"bob"} completion:^(NSInteger size) {  
3
  
4    // Process calculated target message size.  
5}];  

```

---

## Push notification configuration

### PNAPNSNotificationConfiguration

Configures HTTP/2-based APNs delivery.

#### Method(s)

```
`1+ (instancetype)defaultConfiguration  
`
```

Creates a default configuration with a single target: `PNAPNSDevelopment` + `NSBundle.mainBundle.bundleIdentifier` as topic.

```
`1+ (instancetype)configurationWithTargets:(NSArrayPNAPNSNotificationTarget *> *)targets  
`
```

- `targets` (**required**): `NSArray<PNAPNSNotificationTarget *> *` list of topics to receive the notification. If empty, uses default target (`NSBundle.mainBundle.bundleIdentifier`, `PNAPNSDevelopment`).

```
`1+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId   
2                             expirationDate:(nullable NSDate *)date   
3                                    targets:(NSArrayPNAPNSNotificationTarget *> *)targets;  
`
```

- `collapseId` (nullable NSString): Used as `apns-collapse-id` header value.  
- `date` (nullable NSDate): Used as `apns-expiration` header value.  
- `targets` (**required**): `NSArray<PNAPNSNotificationTarget *> *`; if empty, uses default target.

#### Sample code

Create config to collapse invitation notifications and retry delivery for 10 seconds:

```
1PNAPNSNotificationConfiguration *configuration = nil;  
2PNNotificationsPayload *builder = nil;  
3
  
4PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
5NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
6configuration = [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
7                                                              expirationDate:expirationDate  
8                                                                     targets:@[target]];  

```

#### Response

Configured `PNAPNSNotificationConfiguration` instance.

---

### PNAPNSNotificationPayload

APNs-specific payload options.

#### Properties

- `configurations` (`NSArray<PNAPNSNotificationConfiguration *> *`): List of HTTP/2 APNs delivery configurations. If empty when requesting `PNAPNS2Push`, defaults to `PNAPNSDevelopment` + `NSBundle.mainBundle.bundleIdentifier` topic.
- `notification` (NSMutableDictionary): User-visible key-value pairs.
- `payload` (NSMutableDictionary): Platform-specific payload (may include extra data).
- `silent` (BOOL): If `YES`, removes `alert`, `sound`, `badge` from resulting payload.

---

### PNAPNSNotificationTarget

Configures APNs notification recipient.

#### Method(s)

```
`1+ (instancetype)defaultTarget  
`
```

Default target: `PNAPNSDevelopment` + `NSBundle.mainBundle.bundleIdentifier` as topic.

```
`1+ (instancetype)targetForTopic:(NSString *)topic  
`
```

- `topic` (**required**, NSString): Used as `apns-topic` header value.

```
`1+ (instancetype)targetForTopic:(NSString *)topic   
2                 inEnvironment:(PNAPNSEnvironment)environment   
3           withExcludedDevices:(nullable NSArrayNSData *> *)excludedDevices;  
`
```

- `topic` (**required**, NSString): `apns-topic` header value.  
- `environment` (**required**, PNAPNSEnvironment):  
  - `PNAPNSDevelopment`  
  - `PNAPNSProduction`  
- `excludedDevices` (nullable NSArray<NSData *>): Push tokens to exclude from delivery.

#### Sample code

Exclude current device from recipients:

```
`1PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"  
2                                                              inEnvironment:PNAPNSProduction  
3                                                        withExcludedDevices:@[self.currentDevicePushToken]];  
`
```

#### Response

Configured `PNAPNSNotificationTarget` instance.

---

### PNFCMNotificationPayload

FCM-specific payload options.

#### Properties

- `notification` (NSMutableDictionary): User-visible key-value pairs.
- `data` (NSMutableDictionary): Custom key-value data; values must be strings. Keys must not be `from`, `message_type`, start with `google`/`fcm`, or use reserved words per Firebase table: https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support
- `silent` (BOOL): If `YES`, moves `notification` content under `data`.
- `icon` (NSString): Icon shown instead of app icon.
- `tag` (NSString): Unique identifier to replace/update previous notification with same tag.
- `payload` (NSMutableDictionary): Platform-specific payload (may include extra data).

---

### PNNotificationsPayload

Cross-platform notification builder (APNs/APNs2/FCM) with access to platform-specific builders and raw dictionaries.

#### Method(s)

```
`1+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title   
2                                         body:(nullable NSString *)body;  
`
```

- `title` (nullable NSString): Shown at top instead of app name.
- `body` (nullable NSString): Notification body text.
- Builder properties (used in examples/docs): `subtitle` (NSString), `badge` (NSNumber), `sound` (NSString), `apns` (PNAPNSNotificationPayload), `fcm` (PNFCMNotificationPayload).

#### Sample code

Create builder with title and body:

```
`1PNNotificationsPayload *builder = nil;  
2builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
3                                                           body:@"You have been invited to 'quiz' chat"];  
`
```

#### Response

Configured `PNNotificationsPayload` instance.

#### Other examples

#### Generate simple notification payload for FCM and APNS

```
1PNNotificationsPayload *builder = nil;  
2builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
3                                                            body:@"You have been invited to 'quiz' chat"];  
4builder.sound = @"default";  
5
  
6NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNSPush|PNFCMPush]);  

```

##### Output

```
`1{  
2    "pn_apns": {  
3        "aps": {  
4            "alert": {  
5                "body": "You have been invited to 'quiz' chat",  
6                "title": "Chat invitation"  
7            },  
8            "sound": "default"  
9        }  
10    },  
11    "pn_fcm": {  
12        "notification": {  
13            "body": "You have been invited to 'quiz' chat",  
14            "title": "Chat invitation"  
15        },  
16        "android": {  
17            "notification": {  
18                "sound": "default"  
19            }  
20        }  
21    }  
22}  
`
```
show all 22 lines

#### Generate simple notification payload for FCM and HTTP/2-based APNs (default configuration)

```
1PNNotificationsPayload *builder = nil;  
2builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
3                                                            body:@"You have been invited to 'quiz' chat"];  
4builder.sound = @"default";  
5
  
6NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  

```

##### Output

```
`1{  
2    "pn_apns": {  
3        "aps": {  
4            "alert": {  
5                "body": "You have been invited to 'quiz' chat",  
6                "title": "Chat invitation"  
7            },  
8            "sound": "default"  
9        }  
10        "pn_push": [  
11            {  
12                "targets": [  
13                    {  
14                        "environment": "development",  
15                        "topic": "com.meetings.chat.app"  
16                    }  
17                ],  
18                "version": "v2"  
19            }  
20        ]  
21    }  
22    "pn_fcm": {  
23        "notification": {  
24            "body": "You have been invited to 'quiz' chat",  
25            "title": "Chat invitation"  
26        },  
27        "android": {  
28            "notification": {  
29                "sound": "default"  
30            }  
31        }  
32    }  
33}  
`
```
show all 33 lines

#### Generate simple notification payload for FCM and HTTP/2-based APNs (custom configuration)

```
1PNAPNSNotificationConfiguration *configuration = nil;  
2PNNotificationsPayload *builder = nil;  
3
  
4PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
5NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
6configuration = [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
7                                                                expirationDate:expirationDate  
8                                                                        targets:@[target]];  
9
  
10builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
11                                                            body:@"You have been invited to 'quiz' chat"];  
12builder.apns.configurations = @[configuration];  
13
  
14NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  

```

##### Output

```
`1{  
2    "pn_apns": {  
3        "aps": {  
4            "alert": {  
5                "body": "Chat invitation",  
6                "title": "You have been invited to 'quiz' chat"  
7            }  
8        }  
9        "pn_push": [  
10            {  
11                "collapse_id": "invitations",  
12                "expiration": "2019-11-28T22:06:09Z",  
13                "targets": [  
14                    {  
15                        "environment": "development",  
16                        "topic": "com.meetings.chat.app"  
17                    }  
18                ],  
19                "version": "v2"  
20            }  
21        ]  
22    }  
23    "pn_fcm": {  
24        "notification": {  
25            "body": "You have been invited to 'quiz' chat",  
26            "title": "Chat invitation"  
27        }  
28    }  
29}  
`
```
show all 29 lines

Notes from example: `expiration` limits redelivery attempts (here **10** seconds). `collapse_id` groups notifications.

```
`1- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes  
`
```

Builds the payload dictionary for requested platforms.

- `pushTypes` (**required**, PNPushType): bitfield:
  - `PNAPNSPush`
  - `PNAPNS2Push`
  - `PNFCMPush`

#### Sample code

Publish a message with push payload:

```
1PNNotificationsPayload *builder = nil;  
2builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
3                                                           body:@"You have been invited to 'quiz' chat"];  
4NSDictionary *payload = [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush];  
5NSDictionary *message = @{  
6    @"message": @"Max invited you to 'quiz' chat room",  
7    @"roomID": @"ewuiogw9vewg0"  
8};  
9
  
10[self.client publish:message toChannel:@"chat-bot" mobilePushPayload:payload  
11      withCompletion:^(PNPublishStatus *status) {  
12   // Handle publish results  
13}];  

```

#### Response

Dictionary suitable for `publish` to trigger remote notifications for specified platforms.

Last updated on **Dec 15, 2025**