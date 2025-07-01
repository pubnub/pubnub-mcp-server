On this page
# Utility Methods API for Objective-C SDK

The methods on this page are utility methods that don't fit into other categories.

## Time[​](#time)

This function will return a 17 digit precision Unix epoch.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example of creating a timetoken for a specific time and date:

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method(s)[​](#methods)

To fetch `Time` you can use the following method(s) in Objective-C SDK:

```
`­- (void)timeWithCompletion:(PNTimeCompletionBlock)block;  
`
```

*  requiredParameterDescription`block` *Type: PNClientTimeTokenReceivingCompleteBlock`Time` request process results handling `block` which pass two arguments: result - in case of successful request processing data field will contain server-provided timetoken; status - in case if `error` occurred during request processing

### Basic Usage[​](#basic-usage)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

```
`// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"timeUser"];  
  
// Initialize client  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Fetch PubNub server time  
[client timeWithCompletion:^(PNTimeResult *result, PNErrorStatus *status) {  
    if (!status) {  
        // Success - timetoken received  
        NSNumber *timetoken = result.data.timetoken;  
          
        NSLog(@"✅ Received PubNub server timetoken: %@", timetoken);  
`
```
show all 31 lines

### Response[​](#response)

Response objects which is returned by client when Time API is used:

```
`@interface PNTimeData : PNServiceData  
  
// Current time on PubNub network servers.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
  
@end  
  
@interface PNTimeResult : PNResult  
  
// Stores reference on time request processing information.  
@property (nonatomic, readonly, strong) PNTimeData *data;  
  
@end  
`
```

## Get size of message[​](#get-size-of-message)

This function provides a mechanism to calculate resulting message before it will be sent to the PubNub network.

### Method(s)[​](#methods-1)

To run `Get size of message` you can use the following method(s) in the Objective-C SDK:

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idMessage for which size should be calculated.`channel` *Type: NSStringName of the `channel` to which `message` should be sent (it is part of request URI).`block` *Type: PNMessageSizeCalculationCompletionBlockReferecnce on block which should be sent, when message size calculation will be completed.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idMessage for which size should be calculated.`channel` *Type: NSStringName of the `channel` to which `message` should be sent (it is part of request URI).`compressMessage` *Type: Bool`YES` in case if `message` should be compressed before sending to `PubNub` network.`block` *Type: PNMessageSizeCalculationCompletionBlockReferecnce on block which should be sent, when message size calculation will be completed.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       storeInHistory:(BOOL)shouldStore   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idMessage for which size should be calculated.`channel` *Type: NSStringName of the `channel` to which `message` should be sent (it is part of request URI).`shouldStore` *Type: Bool`YES` in case if `message` should be stored in Message Persistence.`block` *Type: PNMessageSizeCalculationCompletionBlockReferecnce on block which should be sent, when message size calculation will be completed.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       storeInHistory:(BOOL)shouldStore   
       withCompletion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idMessage for which size should be calculated.`channel` *Type: NSStringName of the `channel` to which `message` should be sent (it is part of request URI).`compressMessage` *Type: Bool`YES` in case if `message` should be compressed before sending to PubNub network.`shouldStore` *Type: Bool`NO` in case if `message` shouldn't be available after it has been sent via Message Persistence API methods `group`.`block` *Type: PNMessageSizeCalculationCompletionBlockReferecnce on block which should be sent, when message size calculation will be completed.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` for which the size needs be calculated.`channel` *Type: NSStringThe `channel` on which the `message` has to be sent (it is part of request URI).`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block` *Type: PNMessageSizeCalculationCompletionBlockCompletion `block` which will be called when the `message` size calculation is complete.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` for which the size needs be calculated.`channel` *Type: NSStringThe `channel` on which the `message` has to be sent (it is part of request URI).`compressMessage` *Type: BoolShould be `true` if the `message` is compressed before sending to `PubNub` network.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block` *Type: PNMessageSizeCalculationCompletionBlockCompletion `block` which will be called when the `message` size calculation is complete.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
       storeInHistory:(BOOL)shouldStore   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` for which the size needs be calculated.`channel` *Type: NSStringThe `channel` on which the `message` has to be sent (it is part of request URI).`shouldStore` *Type: BoolShould be `true` if the `message` is marked to be stored in history.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block` *Type: PNMessageSizeCalculationCompletionBlockCompletion `block` which will be called when the `message` size calculation is complete.

```
`- (void)sizeOfMessage:(id)message   
            toChannel:(NSString *)channel   
           compressed:(BOOL)compressMessage   
       storeInHistory:(BOOL)shouldStore   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(PNMessageSizeCalculationCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` for which the size needs be calculated.`channel` *Type: NSStringThe `channel` on which the `message` has to be sent (it is part of request URI).`shouldStore` *Type: BoolShould be `true` if the `message` is marked to be stored in history.`compressMessage` *Type: BoolShould be `true` if the `message` is compressed before sending to PubNub network.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block` *Type: PNMessageSizeCalculationCompletionBlockCompletion `block` which will be called when the `message` size calculation is complete.

### Basic Usage[​](#basic-usage-1)

#### Get message size[​](#get-message-size)

```
`[self.client sizeOfMessage: @{@"Hello": @"world"} toChannel: @"announcement"  
             withCompletion:^(NSInteger size) {  
  
    // Process calculated target message size.  
 }];  
`
```

### Returns[​](#returns)

The message size

### Other Examples[​](#other-examples)

#### Get Size of Message with metadata[​](#get-size-of-message-with-metadata)

```
`[self.client sizeOfMessage: @{@"Hello": @"World"} toChannel: @"announcement"  
              withMetadata: @{@"senderID": @"bob"} completion:^(NSInteger size) {  
  
    // Process calculated target message size.  
}];  
`
```

## Encrypt[​](#encrypt)

This function allows to `encrypt` the data.

##### Deprecated

This method uses the legacy encryption with 128-bit cipher key entropy. For more information, refer to [Crypto module configuration](/docs/sdks/objective-c/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-2)

To `encrypt` the data you can use the following method(s) in Objective-C SDK.

```
`+ (nullable NSString *)encrypt:(NSData *)data  
                       withKey:(NSString *)key;  
`
```

*  requiredParameterDescription`data` *Type: NSDataReference on `NSData` object which should be encrypted.`key` *Type: NSStringReference on `key` which should be used to `encrypt` data basing on it.

```
`+ (nullable NSString *)encrypt:(NSData *)data   
                       withKey:(NSString *)key   
                      andError:(NSError *__autoreleasing *)error;  
`
```

*  requiredParameterDescription`data` *Type: NSDataReference on `NSData` object which should be encrypted.`key` *Type: NSStringReference on `key` which should be used to `encrypt` data basing on it.`error`Type: NSErrorReference on pointer into which encryption `error` will be stored in case of encryption failure. Error can be related to JSON string serialization and encryption itself.

### Basic Usage[​](#basic-usage-2)

#### Encrypt part of message[​](#encrypt-part-of-message)

```
`PNCryptoModule *aesCBCCrypto = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma" randomInitializationVector:YES];  
  
NSString *message = @"No one should see me as plain";  
NSData *messageData = [message dataUsingEncoding:NSUTF8StringEncoding];  
NSString *secretMessage = [aesCBCCrypto encrypt:messageData];  
`
```

### Returns[​](#returns-1)

Encrypted `Base64-encoded` string received from Foundation object. `nil` will be returned in case of failure.

## Decrypt[​](#decrypt)

This function allows to `decrypt` the data.

##### Deprecated

This method uses the legacy encryption with 128-bit cipher key entropy. For more information, refer to [Crypto module configuration](/docs/sdks/objective-c/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-3)

To `decrypt` the data you can use the following method(s) in Objective-C SDK.

```
`+ (nullable NSData *)decrypt:(NSString *)object   
                     withKey:(NSString *)key;  
`
```

*  requiredParameterDescription`object` *Type: NSStringReference on previously encrypted `Base64-encoded` string which should be decrypted.`key` *Type: NSStringReference on `key` which should be used to `decrypt` data.

```
`+ (nullable NSData *)decrypt:(NSString *)object   
                     withKey:(NSString *)key   
                    andError:(NSError *__autoreleasing *)error;  
`
```

*  requiredParameterDescription`object` *Type: NSStringReference on previously encrypted `Base64-encoded` string which should be decrypted.`key` *Type: NSStringReference on `key` which should be used to `decrypt` data.`error`Type: NSErrorReference on pointer into which decryption `error` will be stored in case of decryption failure. Error can be related to JSON string deserialization and decryption itself.

### Basic Usage[​](#basic-usage-3)

#### Decrypt part of message[​](#decrypt-part-of-message)

```
`PNCryptoModule *aesCBCCrypto = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma" randomInitializationVector:YES];  
  
NSString *encryptedMessage = messagePayload[@"secret"];  
NSData *secureData = [[NSData alloc] initWithBase64EncodedString:encryptedMessage options:0];  
NSData *messageData = [aesCBCCrypto decrypt:secureData];  
NSString *decryptedMessage = [[NSString alloc] initWithData:messageData encoding:NSUTF8StringEncoding];  
`
```

### Returns[​](#returns-2)

Initial `NSData` which has been encrypted earlier. `nil` will be returned in case of decryption error.

## Push Notification Configuration[​](#push-notification-configuration)

### PNAPNSNotificationConfiguration[​](#pnapnsnotificationconfiguration)

`PNAPNSNotificationConfiguration` instance allow to configure how notification should be delivered using HTTP/2-based APNs.

#### Method(s)[​](#methods-4)

```
`+ (instancetype)defaultConfiguration  
`
```

Create default configuration with single target configured against `PNAPNSDevelopment` environment `NSBundle.mainBundle.bundleIdentifier` as topic name.

```
`+ (instancetype)configurationWithTargets:(NSArrayPNAPNSNotificationTarget *> *)targets  
`
```

*  requiredParameterDescription`targets` *Type: `NSArray< [PNAPNSNotificationTarget](#pnapnsnotificationtarget)*> *`List of topics which should receive this notification. Default target with `NSBundle.mainBundle.bundleIdentifier` topic and `PNAPNSDevelopment` environment will be used if list is empty.

```
`+ (instancetype)configurationWithCollapseID:(nullable NSString *)collapseId   
                             expirationDate:(nullable NSDate *)date   
                                    targets:(NSArrayPNAPNSNotificationTarget *> *)targets;  
`
```

*  requiredParameterDescription`collapseId`Type: NSStringNotification group / collapse identifier. Value will be used in APNs POST request as `apns-collapse-id` header value.`date`Type: NSDateDate till which APNS will try to deliver notification to target device. Value will be used in APNs POST request as `apns-expiration` header value.`targets` *Type: `NSArray< [PNAPNSNotificationTarget](#pnapnsnotificationtarget)*> *`List of topics which should receive this notification. Default target with `NSBundle.mainBundle.bundleIdentifier` topic and `PNAPNSDevelopment` environment will be used if list is empty.

#### Basic Usage[​](#basic-usage-4)

Create and configure configuration instance which will collapse invitation notifications and retry to deliver notification (APNS) for next 10 seconds if device off-line:

```
`PNAPNSNotificationConfiguration *configuration = nil;  
PNNotificationsPayload *builder = nil;  
  
PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
configuration = [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
                                                              expirationDate:expirationDate  
                                                                     targets:@[target]];  
`
```

#### Response[​](#response-1)

Configured and ready to use `PNAPNSNotificationConfiguration` instance.

### PNAPNSNotificationPayload[​](#pnapnsnotificationpayload)

`PNAPNSNotificationPayload` instance provides access to options specific only to mobile push notifications sent with APNs.

#### Properties[​](#properties)

ParameterDescription`configurations`Type: `NSArray< [PNAPNSNotificationConfiguration](#pnapnsnotificationconfiguration)*> *`List of HTTP/2-based APNs delivery configurations. If list is empty when payload for `PNAPNS2Push` has been requested, it will create default configuration for `PNAPNSDevelopment` environment and `NSBundle.mainBundle.bundleIdentifier` as topic name.`notification`Type: NSMutableDictionaryObject with parameters which specify user-visible key-value pairs.`payload`Type: NSMutableDictionaryPlatform specific notification payload. In addition to data required to make notification visual presentation it can be used to pass additional information which should be sent to remote device.`silent`Type: BOOLWhether operation system should handle notification layout by default or not. `alert`, `sound` and `badge` will be removed from resulting payload if set to `YES`.

### PNAPNSNotificationTarget[​](#pnapnsnotificationtarget)

`PNAPNSNotificationTarget` instance allow to configure APNS notification recipient.

#### Method(s)[​](#methods-5)

```
`+ (instancetype)defaultTarget  
`
```

Create default target configured against `PNAPNSDevelopment` environment `NSBundle.mainBundle.bundleIdentifier` as topic name.

```
`+ (instancetype)targetForTopic:(NSString *)topic  
`
```

*  requiredParameterDescription`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier). Value will be used in APNs POST request as `apns-topic` header value.

```
`+ (instancetype)targetForTopic:(NSString *)topic   
                 inEnvironment:(PNAPNSEnvironment)environment   
           withExcludedDevices:(nullable NSArrayNSData *> *)excludedDevices;  
`
```

*  requiredParameterDescription`topic` *Type: NSStringNotifications topic name (usually it is application's bundle identifier). Value will be used in APNs POST request as `apns-topic` header value.`environment` *Type: PNAPNSEnvironmentOne of `PNAPNSEnvironment` fields which specify environment within which registered devices to which notifications should be delivered. `PNAPNSEnvironment` fields: 
- `PNAPNSDevelopment`
- `PNAPNSProduction`

`excludedDevices` *Type: NSArray`<NSDate *>` *List of devices (their push tokens) to which this notification shouldn't be delivered.

#### Basic Usage[​](#basic-usage-5)

Create and configure APNS notification target, which excludes current device from recipients list:

```
`PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"  
                                                              inEnvironment:PNAPNSProduction  
                                                        withExcludedDevices:@[self.currentDevicePushToken]];  
`
```

#### Response[​](#response-2)

Configured and ready to use `PNAPNSNotificationTarget` instance.

### PNFCMNotificationPayload[​](#pnfcmnotificationpayload)

`PNFCMNotificationPayload` instance provides access to options specific only to mobile push notifications sent with **FCM**.

#### Properties[​](#properties-1)

ParameterDescription`notification`Type: NSMutableDictionaryObject with parameters which specify user-visible key-value pairs.`data`Type: NSMutableDictionaryCustom key-value object with additional information which will be passed to device along with displayable notification information. All object and scalar type value should be converted to strings before passing to this object. Keys shouldn't match: `from`, `message_type` or start with `google` or `gcm`. Also as key can't be used any word defined in [this table](https://firebase.google.com/docs/cloud-messaging/http-server-ref#notification-payload-support)`silent`Type: BOOLWhether operation system should handle notification layout by default or not. `notification` key with it's content will be moved from root level under `data` key.`icon`Type: NSStringIcon which should be shown on the left from notification title instead of application icon.`tag`Type: NSStringUnique notification identifier which can be used to publish update notifications (they will previous notification with same `tag`).`payload`Type: NSMutableDictionaryPlatform specific notification payload. In addition to data required to make notification visual presentation it can be used to pass additional information which should be sent to remote device.

### PNNotificationsPayload[​](#pnnotificationspayload)

`PNNotificationsPayload` instance provides convenient method and properties which allow to setup notification for multiple platforms without getting into details how they should be formatted.  

Builder instance contain additional set of properties which allow to fine tune payloads for particular platforms and even access to *RAW* payload dictionaries.

#### Method(s)[​](#methods-6)

```
`+ (instancetype)payloadsWithNotificationTitle:(nullable NSString *)title   
                                         body:(nullable NSString *)body;  
`
```

*  requiredParameterDescription`title`Type: NSStringShort text which should be shown at the top of notification instead of application name.`body`Type: NSStringMessage which should be shown in notification body (under title line).`subtitle`Type: NSStringAdditional information which may explain reason why this notification has been delivered.`badge`Type: NSNumberNumber which should be shown in space designated by platform (for example atop of application icon).`sound`Type: NSStringPath to file with sound or name of system sound which should be played upon notification receive.`apns` *Type: [PNAPNSNotificationPayload](#pnapnsnotificationpayload)Access to APNS specific notification builder.`fcm` *Type: [PNFCMNotificationPayload](#pnfcmnotificationpayload)Access to FCM specific notification builder.

#### Basic Usage[​](#basic-usage-6)

Create notification payload builder with pre-defined notification title and body:

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                           body:@"You have been invited to 'quiz' chat"];  
`
```

#### Response[​](#response-3)

Configured and ready to use `PNNotificationsPayload` instance.

#### Other Examples[​](#other-examples-1)

#### Generate simple notification payload for FCM and APNS[​](#generate-simple-notification-payload-for-fcm-and-apns)

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                            body:@"You have been invited to 'quiz' chat"];  
builder.sound = @"default";  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNSPush|PNFCMPush]);  
`
```

##### Output[​](#output)

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

#### Generate simple notification payload for FCM and HTTP/2-based APNs (default configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-default-configuration)

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                            body:@"You have been invited to 'quiz' chat"];  
builder.sound = @"default";  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  
`
```

##### Output[​](#output-1)

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

#### Generate simple notification payload for FCM and HTTP/2-based APNs (custom configuration)[​](#generate-simple-notification-payload-for-fcm-and-http2-based-apns-custom-configuration)

```
`PNAPNSNotificationConfiguration *configuration = nil;  
PNNotificationsPayload *builder = nil;  
  
PNAPNSNotificationTarget *target = [PNAPNSNotificationTarget targetForTopic:@"com.meetings.chat.app"];  
NSDate *expirationDate = [NSDate dateWithTimeIntervalSinceNow:10];  
configuration = [PNAPNSNotificationConfiguration configurationWithCollapseID:@"invitations"  
                                                                expirationDate:expirationDate  
                                                                        targets:@[target]];  
  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
                                                            body:@"You have been invited to 'quiz' chat"];  
builder.apns.configurations = @[configuration];  
  
NSLog(@"Notifications payload: %@", [builder dictionaryRepresentationFor:PNAPNS2Push|PNFCMPush]);  
`
```

##### Output[​](#output-2)

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

Example above show how to create notification payload which APNS will try to redeliver few times (if devices not active) and give up after **10** seconds since moment when it has been scheduled.

Additionally this invitation notification will be grouped along with other invitation notifications (using provided `collapse_id` as group identifier) and shown as one in notification center.

```
`- (NSDictionary *)dictionaryRepresentationFor:(PNPushType)pushTypes  
`
```

Build notifications platform for requested platforms (`pushTypes`).

*  requiredParameterDescription`pushTypes` *Type: PNPushTypeBitfield with fields from `PNPushType` which specify platforms for which payload should be added to final dictionary. `PNPushType` fields: 
- `PNAPNSPush`
- `PNAPNS2Push`
- `PNFCMPush`
- `PNMPNSPush`

#### Basic Usage[​](#basic-usage-7)

Publish message with notification payload:

```
`PNNotificationsPayload *builder = nil;  
builder = [PNNotificationsPayload payloadsWithNotificationTitle:@"Chat invitation"  
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

#### Response[​](#response-4)

Dictionary with data, which can be sent with publish method call and trigger remote notifications for specified platforms.
Last updated on **May 29, 2025**