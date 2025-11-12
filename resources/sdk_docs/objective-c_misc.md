# Utility Methods API for Objective-C SDK

Utility methods that don't fit other categories.

## Get size of message

Calculate a message's size before sending to PubNub.

### Method(s)

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
4           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3       storeInHistory:(BOOL)shouldStore   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`1- (void)sizeOfMessage:(id)message   
2            toChannel:(NSString *)channel   
3           compressed:(BOOL)compressMessage   
4       storeInHistory:(BOOL)shouldStore   
5         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

Parameters:
- message (id): Message to calculate.
- channel (NSString*): Target channel (used in request URI).
- compressed (BOOL): YES if message will be gzip-compressed before sending.
- storeInHistory (BOOL): YES to store in Message Persistence.
- metadata (NSDictionary<NSString*, id>*): Values for server-side message filtering.
- block (PNMessageSizeCalculationCompletionBlock): Called on calculation completion.

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

## Push notification configuration

### PNAPNSNotificationConfiguration

Configure HTTP/2-based APNs delivery.

#### Method(s)

```
`1+ (instancetype)defaultConfiguration  
`
```

Creates a default configuration using PNAPNSDevelopment and NSBundle.mainBundle.bundleIdentifier as topic.

```
`1+ (instancetype)configurationWithTargets:(NSArrayPNAPNSNotificationTarget *> *)targets  
`
```

- targets (NSArray<PNAPNSNotificationTarget*>*): List of APNs topics. Defaults to bundle identifier + PNAPNSDevelopment if empty.

```
`1+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId   
2                             expirationDate:(nullable NSDate *)date   
3                                    targets:(NSArrayPNAPNSNotificationTarget *> *)targets;  
`
```

- collapseId (NSString*): APNs collapse/group id (apns-collapse-id header).
- date (NSDate*): Expiration time for APNs delivery (apns-expiration header).
- targets (NSArray<PNAPNSNotificationTarget*>*): APNs topics list. Defaults if empty.

#### Sample code

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

APNs-specific push payload options.

#### Properties

- configurations (NSArray<PNAPNSNotificationConfiguration*>*): HTTP/2 APNs delivery configurations. Defaults to PNAPNSDevelopment + bundle identifier if empty when PNAPNS2Push is requested.
- notification (NSMutableDictionary*): User-visible key-value pairs.
- payload (NSMutableDictionary*): Platform-specific payload; can include extra data.
- silent (BOOL): If YES, removes alert/sound/badge from payload.

### PNAPNSNotificationTarget

Configure APNs notification recipient.

#### Method(s)

```
`1+ (instancetype)defaultTarget  
`
```

Creates default target using PNAPNSDevelopment and bundle identifier.

```
`1+ (instancetype)targetForTopic:(NSString *)topic  
`
```

- topic (NSString*): APNs topic (usually app bundle id). Used as apns-topic.

```
`1+ (instancetype)targetForTopic:(NSString *)topic   
2                 inEnvironment:(PNAPNSEnvironment)environment   
3           withExcludedDevices:(nullable NSArrayNSData *> *)excludedDevices;  
`
```

- topic (NSString*): APNs topic (apns-topic).
- environment (PNAPNSEnvironment): One of:
  - PNAPNSDevelopment
  - PNAPNSProduction
- excludedDevices (NSArray<NSData*>*): List of device push tokens to exclude.

#### Sample code

```
`1PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"  
2                                                              inEnvironment:PNAPNSProduction  
3                                                        withExcludedDevices:@[self.currentDevicePushToken]];  
`
```

#### Response

Configured PNAPNSNotificationTarget instance.

### PNFCMNotificationPayload

FCM-specific push payload options.

#### Properties

- notification (NSMutableDictionary*): User-visible key-value pairs.
- data (NSMutableDictionary*): Custom key-value pairs to deliver alongside notification. Convert values to strings; keys must not be from/ message_type/ start with google or fcm, and must not be any reserved word listed in Firebase docs.
- silent (BOOL): If YES, moves notification under data.
- icon (NSString*): Notification icon shown near title.
- tag (NSString*): Unique id for update/replacement notifications.
- payload (NSMutableDictionary*): Platform-specific payload; may include extra data.

### PNNotificationsPayload

Builder to set up multi-platform notification payloads, with platform-specific tuning and access to raw dictionaries.

#### Method(s)

```
`1+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title   
2                                         body:(nullable NSString *)body;  
`
```

- title (NSString*): Notification title.
- body (NSString*): Notification body.

Additional builder properties:
- subtitle (NSString*): Additional context line.
- badge (NSNumber*): Badge count.
- sound (NSString*): Sound name/path to play.
- apns (PNAPNSNotificationPayload*): APNs-specific builder.
- fcm (PNFCMNotificationPayload*): FCM-specific builder.

#### Sample code

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

Note: This configuration enables APNs redelivery for up to 10 seconds and groups related notifications via collapse_id.

```
`1- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes  
`
```

Build payload for specified platforms.

- pushTypes (PNPushType): Bitfield of:
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

Dictionary for publish that triggers remote notifications for specified platforms.

Last updated on Nov 6, 2025