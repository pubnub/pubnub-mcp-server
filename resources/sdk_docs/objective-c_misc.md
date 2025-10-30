# Utility Methods API for Objective-C SDK

Utility methods that don't fit other categories.

## Get size of message

Calculate the resulting message size before sending to PubNub.

### Method(s)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id): Message to measure.
- channel (NSString): Destination channel (part of request URI).
- block (PNMessageSizeCalculationCompletionBlock): Completion block with calculated size.

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- compressMessage (BOOL): YES to compress before sending.
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- shouldStore (BOOL): YES to store in Message Persistence.
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- compressMessage (BOOL): YES to compress.
- shouldStore (BOOL): NO to skip history.
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
4           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- metadata (NSDictionary<NSString *, id>): Values used by PubNub for message filtering.
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- compressMessage (BOOL): YES to compress.
- metadata (NSDictionary<NSString *, id>)
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- shouldStore (BOOL): YES to store in history.
- metadata (NSDictionary<NSString *, id>)
- block (PNMessageSizeCalculationCompletionBlock)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```
- message (id)
- channel (NSString)
- shouldStore (BOOL): YES to store in history.
- compressMessage (BOOL): YES to compress.
- metadata (NSDictionary<NSString *, id>)
- block (PNMessageSizeCalculationCompletionBlock)

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

The message size

### Other examples

#### Get size of message with metadata

```
1[self.client sizeOfMessage: @{@"Hello": @"World"} toChannel: @"announcement"  
2              withMetadata: @{@"senderID": @"bob"} completion:^(NSInteger size) {  
3
  
4    // Process calculated target message size.  
5}];  

```

## Push notification configuration

### PNAPNSNotificationConfiguration

Configure delivery for HTTP/2-based APNs.

#### Method(s)

```
`1+ (instancetype)defaultConfiguration  
`
```
- Default: single target using NSBundle.mainBundle.bundleIdentifier as topic in PNAPNSDevelopment.

```
`1+ (instancetype)configurationWithTargets:(NSArrayPNAPNSNotificationTarget *> *)targets  
`
```
- targets (NSArray<PNAPNSNotificationTarget *> *): Target topics list. If empty, defaults to bundle identifier topic in PNAPNSDevelopment.

```
`1+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId   
2                             expirationDate:(nullable NSDate *)date   
3                                    targets:(NSArrayPNAPNSNotificationTarget *> *)targets;  
`
```
- collapseId (NSString): APNs apns-collapse-id header.
- date (NSDate): APNs apns-expiration header (delivery retry until date).
- targets (NSArray<PNAPNSNotificationTarget *> *): Target topics list. Defaults if empty as above.

#### Sample code

Create configuration with collapse ID and 10s expiration:

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

Configured PNAPNSNotificationConfiguration instance.

### PNAPNSNotificationPayload

APNs-specific payload options.

#### Properties

- configurations (NSArray<PNAPNSNotificationConfiguration *> *): HTTP/2 APNs delivery configurations. If empty when PNAPNS2Push requested, a default configuration is created for PNAPNSDevelopment with NSBundle.mainBundle.bundleIdentifier as topic.
- notification (NSMutableDictionary): User-visible key-value pairs.
- payload (NSMutableDictionary): Platform-specific payload; can include additional data.
- silent (BOOL): If YES, removes alert, sound, badge from payload for OS-handled delivery.

### PNAPNSNotificationTarget

Configure APNs notification recipient.

#### Method(s)

```
`1+ (instancetype)defaultTarget  
`
```
- Default: PNAPNSDevelopment, topic = NSBundle.mainBundle.bundleIdentifier.

```
`1+ (instancetype)targetForTopic:(NSString *)topic  
`
```
- topic (NSString): APNs topic (usually bundle identifier). Used as apns-topic header.

```
`1+ (instancetype)targetForTopic:(NSString *)topic   
2                 inEnvironment:(PNAPNSEnvironment)environment   
3           withExcludedDevices:(nullable NSArrayNSData *> *)excludedDevices;  
`
```
- topic (NSString): APNs topic; apns-topic header.
- environment (PNAPNSEnvironment): PNAPNSDevelopment | PNAPNSProduction.
- excludedDevices (NSArray<NSData *> *): Device push tokens to exclude from delivery.

#### Sample code

Exclude current device from recipients:

```
`1PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"  
2                                                              inEnvironment:PNAPNSProduction  
3                                                        withExcludedDevices:@[self.currentDevicePushToken]];  
`
```

#### Response

Configured PNAPNSNotificationTarget instance.

### PNFCMNotificationPayload

FCM-specific payload options.

#### Properties

- notification (NSMutableDictionary): User-visible key-value pairs.
- data (NSMutableDictionary): Additional key-value data. Convert objects/scalars to strings. Keys must not be from: from, message_type, or start with google or gcm, and must not be any reserved words listed in Firebase docs.
- silent (BOOL): If YES, moves notification under data key for OS-handled delivery.
- icon (NSString): Icon to show in notification.
- tag (NSString): Unique identifier for notification updates.
- payload (NSMutableDictionary): Platform-specific payload, plus additional data.

### PNNotificationsPayload

Builder for multi-platform notification payloads. Provides per-platform fine-tuning and access to raw payload dictionaries.

#### Method(s)

```
`1+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title   
2                                         body:(nullable NSString *)body;  
`
```
- title (NSString): Notification title (displayed instead of app name).
- body (NSString): Notification body text.

Builder properties:
- subtitle (NSString): Additional context.
- badge (NSNumber): Badge count.
- sound (NSString): Sound file path or system sound name.
- apns (PNAPNSNotificationPayload): APNs-specific builder.
- fcm (PNFCMNotificationPayload): FCM-specific builder.

#### Sample code

Create notification payload builder:

```
`1PNNotificationsPayload *builder = nil;  
2builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
3                                                           body:@"You have been invited to 'quiz' chat"];  
`
```

#### Response

Configured PNNotificationsPayload instance.

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
9        },  
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
21    },  
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
8        },  
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
22    },  
23    "pn_fcm": {  
24        "notification": {  
25            "body": "You have been invited to 'quiz' chat",  
26            "title": "Chat invitation"  
27        }  
28    }  
29}  
`
```

APNs will retry delivery up to 10 seconds; notifications with the same collapse_id are grouped.

```
`1- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes  
`
```
- pushTypes (PNPushType): Bitfield for platforms to include:
  - PNAPNSPush
  - PNAPNS2Push
  - PNFCMPush
  - PNMPNSPush

#### Sample code

Publish message with notification payload:

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

Dictionary suitable for publish, triggering remote notifications for specified platforms.

Last updated on Sep 3, 2025