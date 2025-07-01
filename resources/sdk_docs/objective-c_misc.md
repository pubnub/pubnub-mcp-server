# Utility Methods API – Objective-C SDK (Misc)

This condensed reference keeps every code example, method signature, parameter description, and other critical technical details. All code blocks from the original documentation are preserved verbatim.

---

## Time

Return a 17-digit timetoken (Unix epoch × 10 000 000).

##### Algorithm

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example:

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

#### Method

```
`­- (void)timeWithCompletion:(PNTimeCompletionBlock)block;  
`
```

* `block` — PNClientTimeTokenReceivingCompleteBlock. On success → `result.data.timetoken`; on error → `status`.

#### Usage

```
`// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"timeUser"];  
  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
[client timeWithCompletion:^(PNTimeResult *result, PNErrorStatus *status) {  
    if (!status) {  
        NSNumber *timetoken = result.data.timetoken;  
        NSLog(@"✅ Received PubNub server timetoken: %@", timetoken);  
`
```
show all 31 lines

#### Response objects

```
`@interface PNTimeData : PNServiceData  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
@end  
  
@interface PNTimeResult : PNResult  
@property (nonatomic, readonly, strong) PNTimeData *data;  
@end  
`
```

---

## Get size of message

Calculate publish size before sending.

#### Methods

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       storeInHistory:(BOOL)shouldStore   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       storeInHistory:(BOOL)shouldStore   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       storeInHistory:(BOOL)shouldStore   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       storeInHistory:(BOOL)shouldStore   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

Key parameters  
• `message` (id) • `channel` (NSString) • `compressMessage` (BOOL) • `shouldStore` (BOOL) • `metadata` (NSDictionary) • `block` (PNMessageSizeCalculationCompletionBlock)

#### Usage

```
`[self.client sizeOfMessage:@{@"Hello": @"world"} toChannel:@"announcement"  
             withCompletion:^(NSInteger size) {  
    // size contains calculated bytes  
}];  
`
```

#### Other example (with metadata)

```
`[self.client sizeOfMessage:@{@"Hello": @"World"} toChannel:@"announcement"  
              withMetadata:@{@"senderID": @"bob"} completion:^(NSInteger size) {  
    // handle size  
}];  
`
```

---

## Encrypt  *(Deprecated – legacy 128-bit)*

#### Methods

```
`+ (nullable NSString *)encrypt:(NSData *)data  
                       withKey:(NSString *)key;  
`
```

```
`+ (nullable NSString *)encrypt:(NSData *)data   
                       withKey:(NSString *)key   
                      andError:(NSError *__autoreleasing *)error;  
`
```

* `data` (NSData) * `key` (NSString) * `error` (NSError \*) optional

#### Usage

```
`PNCryptoModule *aesCBCCrypto = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma" randomInitializationVector:YES];  
  
NSString *message = @"No one should see me as plain";  
NSData *messageData = [message dataUsingEncoding:NSUTF8StringEncoding];  
NSString *secretMessage = [aesCBCCrypto encrypt:messageData];  
`
```

Returns Base64 string or `nil` on error.

---

## Decrypt  *(Deprecated – legacy 128-bit)*

#### Methods

```
`+ (nullable NSData *)decrypt:(NSString *)object   
                     withKey:(NSString *)key;  
`
```

```
`+ (nullable NSData *)decrypt:(NSString *)object   
                     withKey:(NSString *)key   
                    andError:(NSError *__autoreleasing *)error;  
`
```

* `object` (Base64 string) * `key` (NSString) * `error` (NSError \*) optional

#### Usage

```
`PNCryptoModule *aesCBCCrypto = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma" randomInitializationVector:YES];  
  
NSString *encryptedMessage = messagePayload[@"secret"];  
NSData *secureData = [[NSData alloc] initWithBase64EncodedString:encryptedMessage options:0];  
NSData *messageData = [aesCBCCrypto decrypt:secureData];  
NSString *decryptedMessage = [[NSString alloc] initWithData:messageData encoding:NSUTF8StringEncoding];  
`
```

Returns original `NSData` or `nil` on failure.

---

## Push Notification Configuration

### PNAPNSNotificationConfiguration

```
`+ (instancetype)defaultConfiguration  
`
```

```
`+ (instancetype)configurationWithTargets:(NSArrayPNAPNSNotificationTarget *> *)targets  
`
```

```
`+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId   
                             expirationDate:(nullable NSDate *)date   
                                    targets:(NSArrayPNAPNSNotificationTarget *> *)targets;  
`
```

Parameters: `collapseId` (NSString), `date` (NSDate), `targets` (NSArray<PNAPNSNotificationTarget *>).

#### Usage

```
`PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
  
PNAPNSNotificationConfiguration *configuration =  
    [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
                                                   expirationDate:expirationDate  
                                                          targets:@[target]];  
`
```

---

### PNAPNSNotificationPayload

Key properties  
• `configurations` (NSArray<PNAPNSNotificationConfiguration *> *)  
• `notification` (NSMutableDictionary)  
• `payload` (NSMutableDictionary)  
• `silent` (BOOL)

---

### PNAPNSNotificationTarget

```
`+ (instancetype)defaultTarget  
`
```

```
`+ (instancetype)targetForTopic:(NSString *)topic  
`
```

```
`+ (instancetype)targetForTopic:(NSString *)topic   
                 inEnvironment:(PNAPNSEnvironment)environment   
           withExcludedDevices:(nullable NSArrayNSData *> *)excludedDevices;  
`
```

`environment` values: `PNAPNSDevelopment`, `PNAPNSProduction`.

#### Usage

```
`PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"  
                                                              inEnvironment:PNAPNSProduction  
                                                        withExcludedDevices:@[self.currentDevicePushToken]];  
`
```

---

### PNFCMNotificationPayload

Properties  
• `notification` (NSMutableDictionary) • `data` (NSMutableDictionary) • `silent` (BOOL)  
• `icon` (NSString) • `tag` (NSString) • `payload` (NSMutableDictionary)

---

### PNNotificationsPayload

```
`+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title   
                                         body:(nullable NSString *)body;  
`
```

Key properties  
`title`, `body`, `subtitle`, `badge`, `sound`, `apns` (PNAPNSNotificationPayload), `fcm` (PNFCMNotificationPayload).

#### Usage

```
`PNNotificationsPayload *builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                                                   body:@"You have been invited to 'quiz' chat"];  
`
```

#### Examples

Generate simple payload for FCM & APNS:

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                            body:@"You have been invited to 'quiz' chat"];  
builder.sound = @"default";  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNSPush|PNFCMPush]);  
`
```

Output:

```
`{  
    "pn_apns": {  
        "aps": {  
            "alert": {  
                "body": "You have been invited to 'quiz' chat",  
                "title": "Chat invitation"  
            },  
            "sound": "default"  
        }  
    },  
    "pn_fcm": {  
        "notification": {  
            "body": "You have been invited to 'quiz' chat",  
            "title": "Chat invitation"  
        },  
`
```
show all 22 lines

HTTP/2-based APNs (default):

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                            body:@"You have been invited to 'quiz' chat"];  
builder.sound = @"default";  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  
`
```

Output:

```
`{  
    "pn_apns": {  
        "aps": {  
            "alert": {  
                "body": "You have been invited to 'quiz' chat",  
                "title": "Chat invitation"  
            },  
            "sound": "default"  
        },  
        "pn_push": [  
            {  
                "targets": [  
                    {  
                        "environment": "development",  
                        "topic": "com.meetings.chat.app"  
`
```
show all 33 lines

Custom configuration:

```
`PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
PNAPNSNotificationConfiguration *configuration =  
    [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
                                                   expirationDate:expirationDate  
                                                          targets:@[target]];  
  
PNNotificationsPayload *builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                                                   body:@"You have been invited to 'quiz' chat"];  
builder.apns.configurations = @[configuration];  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  
`
```

Output:

```
`{  
    "pn_apns": {  
        "aps": {  
            "alert": {  
                "body": "Chat invitation",  
                "title": "You have been invited to 'quiz' chat"  
            }  
        },  
        "pn_push": [  
            {  
                "collapse_id": "invitations",  
                "expiration": "2019-11-28T22:06:09Z",  
                "targets": [  
                    {  
                        "environment": "development",  
`
```
show all 29 lines

Build final payload:

```
`- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes  
`
```

`pushTypes` bitfield: `PNAPNSPush`, `PNAPNS2Push`, `PNFCMPush`, `PNMPNSPush`.

#### Publish with notification

```
`PNNotificationsPayload *builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                                                   body:@"You have been invited to 'quiz' chat"];  
NSDictionary *payload = [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush];  
  
NSDictionary *message = @{  
    @"message": @"Max invited you to 'quiz' chat room",  
    @"roomID": @"ewuiogw9vewg0"  
};  
  
[self.client publish:message toChannel:@"chat-bot" mobilePushPayload:payload  
      withCompletion:^(PNPublishStatus *status) {  
   // Handle publish results  
}];  
`
```

---

_Last updated **May 29 2025**_