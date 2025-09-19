# Utility Methods API – Objective-C SDK (misc)

Below is a concise reference that retains every code block, method signature, parameter description, and other critical technical details from the original document.

---

## Time

17-digit precision Unix epoch timetoken.

Algorithm:

```
timetoken = (Unix epoch time in seconds) * 10000000
```

Example:

```
08/19/2013 @ 9:20pm UTC = 1376961606
timetoken = 13769616060000000
```

Method:

```objective-c
- (void)timeWithCompletion:(PNTimeCompletionBlock)block;
```

* `block` PNTimeCompletionBlock — returns `PNTimeResult *result` (with `timetoken`) or `PNErrorStatus *status`.

Sample:

```objective-c
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"timeUser"];
PubNub *client = [PubNub clientWithConfiguration:config];

[client timeWithCompletion:^(PNTimeResult *result, PNErrorStatus *status) {
    if (!status) {
        NSNumber *timetoken = result.data.timetoken;
        NSLog(@"✅ Received PubNub server timetoken: %@", timetoken);
    }
}];
```

Result objects:

```objective-c
@interface PNTimeData : PNServiceData
@property (nonatomic, readonly, strong) NSNumber *timetoken;
@end

@interface PNTimeResult : PNResult
@property (nonatomic, readonly, strong) PNTimeData *data;
@end
```

---

## Get size of message

Calculate message size before publish.

Method variants:

```objective-c
- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
           compressed:(BOOL)compressMessage
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
       storeInHistory:(BOOL)shouldStore
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
           compressed:(BOOL)compressMessage
       storeInHistory:(BOOL)shouldStore
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
         withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
           completion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
           compressed:(BOOL)compressMessage
         withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
           completion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
       storeInHistory:(BOOL)shouldStore
         withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
           completion:(PNMessageSizeCalculationCompletionBlock)block;

- (void)sizeOfMessage:(id)message
            toChannel:(NSString *)channel
           compressed:(BOOL)compressMessage
       storeInHistory:(BOOL)shouldStore
         withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
           completion:(PNMessageSizeCalculationCompletionBlock)block;
```

Parameters:  
`message` id • `channel` NSString • `compressMessage` BOOL • `shouldStore` BOOL • `metadata` NSDictionary • `block` PNMessageSizeCalculationCompletionBlock (returns `NSInteger size`).

Samples:

```objective-c
[self.client sizeOfMessage:@{@"Hello":@"world"} toChannel:@"announcement"
             withCompletion:^(NSInteger size) {
    // use size
}];

[self.client sizeOfMessage:@{@"Hello":@"World"} toChannel:@"announcement"
              withMetadata:@{@"senderID":@"bob"} completion:^(NSInteger size) {
    // use size
}];
```

Returns: message size (`NSInteger`).

---

## Encrypt  (Deprecated: legacy 128-bit cipher)

Methods:

```objective-c
+ (nullable NSString *)encrypt:(NSData *)data
                       withKey:(NSString *)key;

+ (nullable NSString *)encrypt:(NSData *)data
                       withKey:(NSString *)key
                      andError:(NSError * _Nullable * )error;
```

Sample:

```objective-c
PNCryptoModule *aesCBCCrypto =
    [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"
                         randomInitializationVector:YES];

NSString *message = @"No one should see me as plain";
NSData *messageData = [message dataUsingEncoding:NSUTF8StringEncoding];
NSString *secretMessage = [aesCBCCrypto encrypt:messageData];
```

Return: Base64-encoded encrypted string or `nil` on failure.

---

## Decrypt  (Deprecated: legacy 128-bit cipher)

Methods:

```objective-c
+ (nullable NSData *)decrypt:(NSString *)object
                     withKey:(NSString *)key;

+ (nullable NSData *)decrypt:(NSString *)object
                     withKey:(NSString *)key
                    andError:(NSError * _Nullable * )error;
```

Sample:

```objective-c
PNCryptoModule *aesCBCCrypto =
    [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"
                         randomInitializationVector:YES];

NSString *encryptedMessage = messagePayload[@"secret"];
NSData *secureData =
    [[NSData alloc] initWithBase64EncodedString:encryptedMessage options:0];
NSData *messageData = [aesCBCCrypto decrypt:secureData];
NSString *decryptedMessage =
    [[NSString alloc] initWithData:messageData encoding:NSUTF8StringEncoding];
```

Return: original `NSData` or `nil`.

---

## Push notification configuration

### PNAPNSNotificationConfiguration

```objective-c
+ (instancetype)defaultConfiguration;

+ (instancetype)configurationWithTargets:
        (NSArray<PNAPNSNotificationTarget *> *)targets;

+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId
                             expirationDate:(nullable NSDate *)date
                                    targets:(NSArray<PNAPNSNotificationTarget *> *)targets;
```

Sample:

```objective-c
PNAPNSNotificationTarget *target =
    [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];
NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];

PNAPNSNotificationConfiguration *configuration =
    [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"
                                                  expirationDate:expirationDate
                                                         targets:@[target]];
```

### PNAPNSNotificationTarget

```objective-c
+ (instancetype)defaultTarget;

+ (instancetype)targetForTopic:(NSString *)topic;

+ (instancetype)targetForTopic:(NSString *)topic
                 inEnvironment:(PNAPNSEnvironment)environment
           withExcludedDevices:(nullable NSArray<NSData *> *)excludedDevices;
```

Sample:

```objective-c
PNAPNSNotificationTarget *target =
    [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"
                               inEnvironment:PNAPNSProduction
                         withExcludedDevices:@[self.currentDevicePushToken]];
```

### PNAPNSNotificationPayload  (APNs)

Key properties:

* `configurations` NSArray<PNAPNSNotificationConfiguration *>  
* `notification` NSMutableDictionary (user-visible keys)  
* `payload` NSMutableDictionary (platform specific)  
* `silent` BOOL  

### PNFCMNotificationPayload  (FCM)

Key properties:

* `notification` NSMutableDictionary  
* `data` NSMutableDictionary  
* `silent` BOOL  
* `icon` NSString  
* `tag` NSString  
* `payload` NSMutableDictionary  

### PNNotificationsPayload

Create builder:

```objective-c
+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title
                                         body:(nullable NSString *)body;
```

Builder properties:

* `subtitle` NSString  
* `badge` NSNumber  
* `sound` NSString  
* `apns` PNAPNSNotificationPayload  
* `fcm`  PNFCMNotificationPayload  

Generate dictionary:

```objective-c
- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes;
```

`PNPushType` bit-fields: `PNAPNSPush | PNAPNS2Push | PNFCMPush | PNMPNSPush`.

Sample – create payload, publish with APNs2 + FCM:

```objective-c
PNNotificationsPayload *builder =
    [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"
                                                     body:@"You have been invited to 'quiz' chat"];
builder.sound = @"default";
NSDictionary *payload = [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush];

NSDictionary *message = @{
    @"message": @"Max invited you to 'quiz' chat room",
    @"roomID": @"ewuiogw9vewg0"
};

[self.client publish:message toChannel:@"chat-bot" mobilePushPayload:payload
      withCompletion:^(PNPublishStatus *status) {
    // Handle publish results
}];
```

Output examples (abbreviated):

```json
{
    "pn_apns": {
        "aps": {
            "alert": { "body": "...", "title": "..." },
            "sound": "default"
        }
    },
    "pn_fcm": {
        "notification": { "body": "...", "title": "..." }
    }
}
```

HTTP/2-based APNs payload with custom configuration:

```json
{
    "pn_apns": {
        "aps": { "alert": { "body": "Chat invitation", "title": "You have been invited to 'quiz' chat" } },
        "pn_push": [{
            "collapse_id": "invitations",
            "expiration": "2019-11-28T22:06:09Z",
            "targets": [{
                "environment": "development",
                "topic": "com.meetings.chat.app"
            }]
        }]
    }
}
```

---

_Last updated: Jul 15 2025_