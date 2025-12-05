# Publish/Subscribe API for Objective-C SDK

Low-latency real-time Publish/Subscribe messaging.

For conceptual guidance, see Connection Management and Publish Messages.

## Publish[​](#publish)

publish() sends a JSON-serializable message to all subscribers of one channel.

Key points:
- Initialize with publishKey.
- You don’t need to subscribe to publish; you can’t publish to multiple channels simultaneously.
- Enable SSL/TLS in configuration (ssl = true) and optionally enable encryption (cryptoModule).
- Message data must be JSON-serializable (NSString, NSNumber, NSArray, NSDictionary). Don’t include special classes or functions.
- Don’t JSON serialize message or meta parameters yourself; the SDK handles it.
- Max message size: 32 KiB (including escaped payload and channel name). Optimal < 1800 bytes. Over-limit returns Message Too Large. See Message Size Limit.
- Compression:
  - Objective-C and C-Core SDKs support compressed messages.
  - Not enabled by default; explicitly request compression.
  - PubNub auto-adapts payload for recipients that don’t support compression.
  - Benefits typically when payload > 1 KiB; very small payloads can expand.
  - Increased CPU usage for compression/decompression; consider device resources.
- Publish rate/queue:
  - Publish as fast as bandwidth allows; subscriber in-memory queue is ~100 messages.
  - Publishing 200 at once may drop the first ~100 if subscriber lags.
- customMessageType: Optional string to label/categorize messages (e.g., text, action, poll).
- Best practices:
  - Publish serially per channel; publish next only after success response.
  - On failure, retry.
  - Avoid queue overflow; throttle bursts (e.g., ≤ 5 msg/s) per app latency needs.

Refer to the code below for an example of sending a compressed message:

```
`1[self.client publish:@{@"message": @"This message will be compressed"}  
2           toChannel:@"channel_name" compressed:YES  
3      withCompletion:^(PNPublishStatus *status) {  
4    if (!status.isError) {  
5        // Message successfully published to specified channel.  
6    } else {  
7        // Handle error.  
8    }  
9}]  
`
```

### Method(s)[​](#methods)

To Publish a message you can use the following method(s) in the Objective-C SDK:

#### Publish a message with block[​](#publish-a-message-with-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object ( `NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with compression and block[​](#publish-a-message-with-compression-and-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3        compressed:(BOOL)compressed   
4    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`compressed` *Type: BOOLWhether `message` should be `compressed` and sent with request body instead of URI part. Compression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with storage and block[​](#publish-a-message-with-storage-and-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3    storeInHistory:(BOOL)shouldStore   
4    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with storage, compression, and block[​](#publish-a-message-with-storage-compression-and-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3    storeInHistory:(BOOL)shouldStore   
4        compressed:(BOOL)compressed   
5    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload and block[​](#publish-a-message-with-payload-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `fcm`).`block`Type: PNPublishCompletionBlockPublish processing completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload, compression, and block[​](#publish-a-message-with-payload-compression-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4           compressed:(BOOL)compressed   
5       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `Array`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads` *Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `fcm`).`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload, storage, and block[​](#publish-a-message-with-payload-storage-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4       storeInHistory:(BOOL)shouldStore   
5       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `fcm`).`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payloads, storage, compression, and block[​](#publish-a-message-with-payloads-storage-compression-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4       storeInHistory:(BOOL)shouldStore   
5           compressed:(BOOL)compressed   
6       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which message should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with "apns" key and Google with "fcm").`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with metadata and block[​](#publish-a-message-with-metadata-and-block)

```
`1- (void)publish:(id)message   
2       toChannel:(NSString *)channel   
3    withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
4      completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with compression, metadata, and block[​](#publish-a-message-with-compression-metadata-and-block)

```
`1- (void)publish:(id)message   
2       toChannel:(NSString *)channel   
3      compressed:(BOOL)compressed   
4    withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5      completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`compressed` *Type: BOOLIf `true` the `message` will be `compressed` and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with storage, metadata, and block[​](#publish-a-message-with-storage-metadata-and-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3    storeInHistory:(BOOL)shouldStore   
4      withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5        completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with storage, compression, metadata, and block[​](#publish-a-message-with-storage-compression-metadata-and-block)

```
`1- (void)publish:(id)message   
2         toChannel:(NSString *)channel   
3    storeInHistory:(BOOL)shouldStore   
4        compressed:(BOOL)compressed   
5      withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6        completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`compressed` *Type: BOOLIf `true` the `message` will be `compressed` and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, metadata, and block[​](#publish-a-message-with-payload-metadata-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
5           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `fcm`). Either payloads or `message` should be provided..`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, compression, metadata, and block[​](#publish-a-message-with-payload-compression-metadata-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4           compressed:(BOOL)compressed   
5         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `fcm`). Either `payloads` or `message` should be provided.`compressed` *Type: BOOLIf `true` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, storage, metadata, and block[​](#publish-a-message-with-payload-storage-metadata-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4       storeInHistory:(BOOL)shouldStore   
5         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
6           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `a ps` key and Google with `fcm`). Either `payloads` or `message` should be provided.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, storage, compression, metadata, and block[​](#publish-a-message-with-payload-storage-compression-metadata-and-block)

```
`1- (void)publish:(nullable id)message   
2            toChannel:(NSString *)channel   
3    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
4       storeInHistory:(BOOL)shouldStore   
5           compressed:(BOOL)compressed   
6         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
7           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `fcm`). Either `payloads` or `message` should be provided.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`compressed` *Type: BOOLIf `true` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Sample code[​](#sample-code)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Basic configuration  
5PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
6                                                          subscribeKey:@"demo"  
7                                                                userID:@"publishUser"];  
8
  
9// Optional: Configure encryption for secure messages  
10config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
11                                           randomInitializationVector:YES];  
12
  
13// Create a PubNub client instance  
14PubNub *client = [PubNub clientWithConfiguration:config];  
15
  
16// Add listener for PubNub events  
17[client addListener:self];  
18
  
19// Subscribe to receive messages  
20PNSubscribeRequest *subscribeRequest = [PNSubscribeRequest requestWithChannels:@[@"demo-channel"]   
21                                                                 channelGroups:nil];  
22
  
23[client subscribeWithRequest:subscribeRequest];  
24
  
25// Example 1: Publish a basic message  
26PNPublishRequest *basicRequest = [PNPublishRequest requestWithChannel:@"demo-channel"];  
27basicRequest.message = @{@"text": @"Hello from Objective-C SDK!"};  
28
  
29[client publishWithRequest:basicRequest withCompletion:^(PNPublishStatus *status) {  
30    if (!status.isError) {  
31        NSLog(@"✅ Message successfully published!");  
32        NSLog(@"Timetoken: %@", status.data.timetoken);  
33    } else {  
34        NSLog(@"❌ Error publishing message: %@", status.errorData.information);  
35        NSLog(@"Error category: %@", @(status.category));  
36    }  
37}];  
38
  
39// Example 2: Publish with metadata  
40NSDictionary *metadata = @{  
41    @"sender": @"mobile-app",  
42    @"version": @"1.0.3",  
43    @"priority": @"high"  
44};  
45
  
46PNPublishRequest *metadataRequest = [PNPublishRequest requestWithChannel:@"demo-channel"];  
47metadataRequest.message = @{@"text": @"Message with metadata"};  
48metadataRequest.metadata = metadata;  
49
  
50[client publishWithRequest:metadataRequest withCompletion:^(PNPublishStatus *status) {  
51    if (!status.isError) {  
52        NSLog(@"✅ Message with metadata successfully published!");  
53        NSLog(@"Timetoken: %@", status.data.timetoken);  
54    } else {  
55        NSLog(@"❌ Error publishing message with metadata: %@", status.errorData.information);  
56    }  
57}];  
58
  
59// Example 3: Publish with storage option  
60PNPublishRequest *storageRequest = [PNPublishRequest requestWithChannel:@"demo-channel"];  
61storageRequest.message = @{@"text": @"This message won't be stored in history"};  
62storageRequest.store = NO;  
63
  
64[client publishWithRequest:storageRequest withCompletion:^(PNPublishStatus *status) {  
65    if (!status.isError) {  
66        NSLog(@"✅ Message published with storage option!");  
67        NSLog(@"Timetoken: %@", status.data.timetoken);  
68    } else {  
69        NSLog(@"❌ Error publishing message with storage option: %@", status.errorData.information);  
70    }  
71}];  
72
  
73// Example 4: Publish compressed message  
74NSMutableDictionary *largeMessage = [NSMutableDictionary dictionary];  
75NSString *repeatedText = [@"" stringByPaddingToLength:1000 withString:@"This is a long message that will benefit from compression. " startingAtIndex:0];  
76largeMessage[@"text"] = repeatedText;  
77largeMessage[@"timestamp"] = @([[NSDate date] timeIntervalSince1970]);  
78
  
79PNPublishRequest *compressedRequest = [PNPublishRequest requestWithChannel:@"demo-channel"];  
80compressedRequest.message = largeMessage;  
81compressedRequest.compress = YES;  
82
  
83[client publishWithRequest:compressedRequest withCompletion:^(PNPublishStatus *status) {  
84    if (!status.isError) {  
85        NSLog(@"✅ Compressed message successfully published!");  
86        NSLog(@"Timetoken: %@", status.data.timetoken);  
87    } else {  
88        NSLog(@"❌ Error publishing compressed message: %@", status.errorData.information);  
89    }  
90}];  
91
  
92// Example 5: Publish with mobile push payload  
93NSDictionary *apnsPayload = @{  
94    @"aps": @{  
95        @"alert": @{  
96            @"title": @"New Message",  
97            @"body": @"You have a new message!"  
98        },  
99        @"sound": @"default",  
100        @"badge": @1  
101    },  
102    @"custom_data": @"custom_value"  
103};  
104
  
105NSDictionary *fcmPayload = @{  
106    @"notification": @{  
107        @"title": @"New Message",  
108        @"body": @"You have a new message!"  
109    },  
110    @"data": @{  
111        @"custom_data": @"custom_value"  
112    }  
113};  
114
  
115NSDictionary *pushPayloads = @{  
116    @"apns": apnsPayload,  
117    @"fcm": fcmPayload  
118};  
119
  
120PNPublishRequest *pushRequest = [PNPublishRequest requestWithChannel:@"demo-channel"];  
121pushRequest.message = @{@"text": @"Message with push notification"};  
122pushRequest.mobilePushPayload = pushPayloads;  
123
  
124[client publishWithRequest:pushRequest withCompletion:^(PNPublishStatus *status) {  
125    if (!status.isError) {  
126        NSLog(@"✅ Message with push payload successfully published!");  
127        NSLog(@"Timetoken: %@", status.data.timetoken);  
128    } else {  
129        NSLog(@"❌ Error publishing message with push payload: %@", status.errorData.information);  
130    }  
131}];  
132
  
133// Required PNEventsListener methods  
134- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
135    // Checking connectivity only using subscribe operation.  
136    if (status.operation != PNSubscribeOperation) return;  
137      
138    if (status.category == PNConnectedCategory) {  
139        NSLog(@"✅ Successfully connected to PubNub!");  
140    } else if (status.isError) {  
141        NSLog(@"❌ PubNub connection error: %@", status);  
142    }  
143}  
144
  
145- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
146    NSLog(@"✅ Received message: %@ on channel: %@", message.data.message, message.data.channel);  
147}  

```
show all 147 lines

##### Subscribe to the channel

Before running the above publish example, either using the Debug Console or in a separate script, subscribe to the same channel.

### Response[​](#response)

Response objects returned by client when publish API is used:

```
1@interface PNPublishData : PNServiceData  
2
  
3@property (nonatomic, readonly, strong) NSNumber *timetoken;  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNPublishStatus : PNAcknowledgmentStatus  
9
  
10@property (nonatomic, readonly, strong) PNPublishData *data;  
11
  
12@end  

```

### Other examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
1[self publish: @"Hello from the PubNub Objective-C" toChannel:@"chat_channel"  
2    withMetadata: @{@"senderID" : @"bob"}  completion:^(PNPublishStatus *status) {  
3
  
4    if (!status.isError) {  
5
  
6        // Message successfully published to specified channel.  
7    }  
8    else {  
9
  
10        /**  
11            Handle message publish error. Check 'category' property to find  
12            out possible reason because of which request did fail.  
13            Review 'errorData' property (which has PNErrorData data type) of status  
14            object to get additional information about issue.  
15  
16            Request can be resent using: [status retry]  
17            */  
18    }  
19}];  

```
show all 19 lines

#### Push payload helper[​](#push-payload-helper)

Use helper to format payload for Push messages. See Create Push Payload Helper Section.

## Publish (builder pattern)[​](#publish-builder-pattern)

This function publishes a message on a channel using fluent setters.

##### Note

This method uses the builder pattern; optional args can be omitted.

### Method(s)[​](#methods-1)

To run Publish Builder you can use the following method(s) in the Objective-C SDK:

```
`1publish()  
2    .message(id)  
3    .channel(NSString *)  
4    .shouldStore(BOOL)  
5    .compress(BOOL)  
6    .ttl(NSUInteger)  
7    .payloads(NSDictionary *)  
8    .metadata(NSDictionary *)  
9    .customMessageType(NSString*)  
10    .performWithCompletion(PNPublishCompletionBlock);  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`).`channel` *Type: NSString*Specifies `channel` ID to `publish` messages to.`shouldStore`Type: BOOLIf `NO` the messages will not be stored in history.   
Default `YES`.`compress`Type: BOOLIf `YES` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`ttl`Type: NSUIntegerSpecify for how many hours published `message` should be stored.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `fcm`). Either `payloads` or `message` should be provided.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`customMessageType`Type: NSString*A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Sample code[​](#sample-code-1)

Publish message stored for 16 hours:

```
1self.client.publish()  
2    .channel(@"my_channel")  
3    .message(@"Hello from PubNub iOS!")  
4    .shouldStore(YES)  
5    .ttl(16)  
6    .customMessageType(@"text-message")  
7    .performWithCompletion(^(PNPublishStatus *status) {  
8
  
9    if (!status.isError) {  
10
  
11        // Message successfully published to specified channel.  
12    }  
13    else {  
14
  
15        /**  
16         Handle message publish error. Check 'category' property to find  
17         out possible reason because of which request did fail.  
18         Review 'errorData' property (which has PNErrorData data type) of status  
19         object to get additional information about issue.  
20  
21         Request can be resent using: [status retry];  
22         */  
23    }  
24});  

```
show all 24 lines

## Fire (builder pattern)[​](#fire-builder-pattern)

Send messages directly to BLOCKS Event Handlers; not replicated or stored.

##### Note

This method uses the builder pattern; optional args can be omitted.

### Method(s)[​](#methods-2)

To Fire a message you can use the following method(s) in the Objective-C SDK:

```
`1fire()  
2    .message(id)  
3    .channel(NSString *)  
4    .compress(BOOL)  
5    .payloads(NSDictionary *)  
6    .metadata(NSDictionary *)  
7    .performWithCompletion(PNPublishCompletionBlock);  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`compress`Type: BOOLIf `YES` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `fcm`). Either `payloads` or `message` should be provided.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Sample code[​](#sample-code-2)

```
1self.client.fire()  
2    .channel(@"my_channel")  
3    .message(@"Hello from PubNub iOS!")  
4    .shouldStore(YES)  
5    .performWithCompletion(^(PNPublishStatus *status) {  
6
  
7    if (!status.isError) {  
8
  
9        // Message successfully published to specified channel.  
10    }  
11    else {  
12
  
13        /**  
14         Handle message publish error. Check 'category' property to find  
15         out possible reason because of which request did fail.  
16         Review 'errorData' property (which has PNErrorData data type) of status  
17         object to get additional information about issue.  
18  
19         Request can be resent using: [status retry];  
20         */  
21    }  
22});  

```
show all 22 lines

## Signal[​](#signal)

signal() sends a signal to all subscribers of a channel.
- Payload limit: 64 bytes (payload only). Contact support for larger limits.

### Method(s)[​](#methods-3)

To Signal a message you can use the following method(s) in the Objective-C SDK:

```
`1- (void)signal:(id)message   
2           channel:(NSString *)channel   
3    withCompletion:(nullable PNSignalCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idObject (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be sent with signal.`channel` *Type: NSStringID of the `channel` to which `signal` should be sent.`block`Type: PNSignalCompletionBlockSignal processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

### Sample code[​](#sample-code-3)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
1[self.client signal:@{ @"Hello": @"world" } channel:@"announcement"  
2     withCompletion:^(PNSignalStatus *status) {  
3
  
4    if (!status.isError) {  
5        // Signal successfully sent to specified channel.  
6    } else {  
7        /**  
8         * Handle signal sending error. Check 'category' property to find out possible issue  
9         * because of which request did fail.  
10         *  
11         * Request can be resent using: [status retry];  
12         */  
13    }  
14}];  

```

### Response[​](#response-1)

Response objects returned by the client when Signal API is used:

```
1@interface PNSignalStatusData : PNServiceData  
2
  
3@property (nonatomic, readonly, strong) NSNumber *timetoken;  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNSignalStatus : PNAcknowledgmentStatus  
9
  
10@property (nonatomic, readonly, strong) PNSignalStatusData *data;  
11
  
12@end  

```

## Signal (builder pattern)[​](#signal-builder-pattern)

##### Note

This method uses the builder pattern; optional args can be omitted.

### Method(s)[​](#methods-4)

To run Signal Builder you can use the following method(s) in the Objective-C SDK:

```
`1signal()  
2    .message(id)  
3    .channel(NSString *)  
4    .customMessageType(NSString *)  
5    .performWithCompletion(PNSignalCompletionBlock);  
`
```

*  requiredParameterDescription`message` *Type: ArrayObject (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be sent with signal.`channel` *Type: StringID of the `channel` to which `signal` should be sent.`customMessageType`Type: NSString*A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`block`Type: PNSignalCompletionBlockSignal processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

### Sample code[​](#sample-code-4)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel-1)

```
1self.client.signal().message(@{ @"Hello": @"world" }).channel(@"announcement").customMessageType(@"text-message-signal").performWithCompletion(^(PNSignalStatus *status) {  
2
  
3    if (!status.isError) {  
4        // Signal successfully sent to specified channel.  
5    } else {  
6        /**  
7         * Handle signal sending error. Check 'category' property to find out possible issue  
8         * because of which request did fail.  
9         *  
10         * Request can be resent using: [status retry];  
11         */  
12    }  
13});  

```

##### Response[​](#response-2)

Response objects which is returned by client when Signal API is used::

```
1@interface PNSignalStatusData : PNServiceData  
2
  
3@property (nonatomic, readonly, strong) NSNumber *timetoken;  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNSignalStatus : PNAcknowledgmentStatus  
9
  
10@property (nonatomic, readonly, strong) PNSignalStatusData *data;  
11
  
12@end  

```

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Add a single event listener (PNObjectEventListener) to receive messages, signals, and events on subscribed channels.

### Description[​](#description)

Opens a TCP socket and listens on specified channels. Requires subscribeKey. By default, you receive messages published after subscribe completes.

Connectivity:
- Use the connect callback for publish-after-subscribe race avoidance.
- Set restore = YES for best-effort catch-up after disconnect (default reconnect after ~320s timeout).

Unsubscribing from all channels resets last timetoken and can cause message gaps.

### Method(s)[​](#methods-5)

To Subscribe to a channel you can use the following method(s) in the Objective-C SDK:

```
`1- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
2               withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.   
   
 For information on how to receive presence events and what those events are, refer to Presence Events.

```
`1- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
2               withPresence:(BOOL)shouldObservePresence   
3                clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` ID and value which should be assigned to it.

```
`1- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
2               withPresence:(BOOL)shouldObservePresence   
3             usingTimeToken:(nullable NSNumber *)timeToken;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`timeToken`Type: NSNumberSpecifies time from which to start returning any available cached messages. `Message` retrieval with `timetoken` is not guaranteed and should only be considered a best-effort service.

```
`1- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
2               withPresence:(BOOL)shouldObservePresence   
3             usingTimeToken:(nullable NSNumber *)timeToken   
4                clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`timeToken`Type: NSNumberSpecifies time from which to start returning any available cached messages. `Message` retrieval with `timetoken` is not guaranteed and should only be considered a best-effort service.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` ID and value which should be assigned to it.

### Sample code[​](#sample-code-5)

Subscribe to a channel:

```
1/**  
2 Subscription results arrive to a listener which should implement the  
3 PNObjectEventListener protocol and be registered as follows:  
4 */  
5[self.client addListener:self];  
6[self.client subscribeToChannels: @[@"my_channel1", @"my_channel2"] withPresence:NO];  
7
  
8// Handle a new message from a subscribed channel  
9- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
10    // Reference to the channel group containing the chat the message was sent to  
11    NSString *subscription = message.data.subscription;  
12    NSLog(@"%@ sent message to '%@' at %@: %@", message.data.publisher, message.data.channel,  
13            message.data.timetoken, message.data.message);  
14}  
15
  
16// Handle a subscription status change  
17- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
18
  
19    if (status.operation == PNSubscribeOperation) {  
20
  
21        // Check to see if the message is about a successful subscription or restore  
22        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
23
  
24            // Status object for those categories can be cast to `PNSubscribeStatus` for use below.  
25            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
26            if (subscribeStatus.category == PNConnectedCategory) {  
27
  
28                // For a subscribe, this is expected, and means there are no errors or issues  
29            }  
30            else {  
31  
32                // This usually occurs if there is a transient error. The subscribe fails but  
33                 // then reconnects, and there is no longer any issue.  
34            }  
35        }  
36        else if (status.category == PNUnexpectedDisconnectCategory) {  
37
  
38            // This is usually an issue with the internet connection.  
39            // This is an error: handle appropriately, and retry will be called automatically.  
40        }  
41        // An issue occurred while the client tried to subscribe,  
42        // or the client was disconnected from the network  
43        else {  
44
  
45            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
46            if (errorStatus.category == PNAccessDeniedCategory) {  
47  
48                // Access Manager prohibited this client from subscribing to this channel and channel group.  
49                // This is another explicit error.  
50            }  
51            else {  
52  
53                /**  
54                 You can directly specify more errors by creating explicit cases  
55                 for other categories of `PNStatusCategory` errors, such as:  
56                 - `PNDecryptionErrorCategory`  
57                 - `PNMalformedFilterExpressionCategory`  
58                 - `PNMalformedResponseCategory`  
59                 - `PNTimeoutCategory`  
60                 - `PNNetworkIssuesCategory`  
61                 */  
62            }  
63        }  
64    }  
65    else if (status.operation == PNUnsubscribeOperation) {  
66
  
67        if (status.category == PNDisconnectedCategory) {  
68
  
69            // This is the expected category for an unsubscribe.  
70            // There were no errors in unsubscribing from everything.  
71        }  
72    }  
73    else if (status.operation == PNHeartbeatOperation) {  
74
  
75        /**  
76         Heartbeat operations can have errors, so check first for an error.  
77         For more information on how to configure heartbeat notifications through the status  
78         PNObjectEventListener callback, refer to  
79         http://www.pubnub.com/docs/sdks/objective-c/api-reference/configuration#configuration_basic_usage  
80         */  
81  
82        if (!status.isError) { /* Heartbeat operation was successful */ }  
83        else { /* There was an error with the heartbeat operation: handle it here */ }  
84    }  
85}  
86
  
87// Handle a new signal from a subscribed channel  
88- (void)client:(PubNub *)client didReceiveSignal:(PNSignalResult *)signal {  
89    NSLog(@"%@ sent signal to '%@' at %@: %@", message.data.publisher, message.data.channel,  
90          message.data.timetoken, message.data.message);  
91}  
92
  
93// Handle new object event from one of channels on which client has been subscribed.  
94- (void)client:(PubNub *)client didReceiveObjectEvent:(PNObjectEventResult *)event {  
95    NSLog(@"'%@' has been %@'ed at %@", event.data.type, event.data.event,  
96        event.data.timestamp);  
97}  

```
show all 97 lines

### Response[​](#response-3)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel on which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5
  
6// Name of channel or channel group (if not equal to channel name).  
7@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
8  
9// Time at which the event arrived.  
10@property (nonatomic, readonly, strong) NSNumber *timetoken;  
11  
12// Stores a reference to the metadata information passed along with the received event.  
13@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
14  
15@end  
16  
17@interface PNSubscribeStatus : PNErrorStatus  
18  
19// Timetoken used to establish the current subscription cycle.  
20@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
21  
22// Stores a reference to the previous key used in the subscription cycle to receive  
23// currentTimetoken along with other events.  
24@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
25  
26// List of channels to which the client is currently subscribed.  
27@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
28  
29//  List of channel group names to which the client is currently subscribed.  
30@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
31  
32// Structured PNResult data field information.  
33@property (nonatomic, readonly, strong) PNSubscriberData *data;  
34  
35@end  
36  
37// Message arrives to event listeners as model described below  
38  
39@interface PNMessageData : PNSubscriberData  
40  
41// Message sender identifier.  
42@property (nonatomic, readonly, strong) NSString *publisher;  
43  
44// Message delivered through the data object live feed.  
45@property (nonatomic, nullable, readonly, strong) id message;  
46  
47@end  
48  
49@interface PNMessageResult : PNResult  
50  
51// Stores a reference to the message object from live feed.  
52@property (nonatomic, readonly, strong) PNMessageData *data;  
53  
54@end  
55  
56// Signal arrives to event listeners as model described below  
57@interface PNSignalData : PNMessageData  
58  
59// Signal sender identifier.  
60@property (nonatomic, readonly, strong) NSString *publisher;  
61  
62// Signal message delivered through the data object live feed.  
63@property (nonatomic, nullable, readonly, strong) id message;  
64  
65@end  
66  
67@interface PNSignalResult : PNResult  
68  
69// Stores reference to signal object from live feed.  
70@property (nonatomic, readonly, strong) PNSignalData *data;  
71  
72@end  
73  
74// Object events arrive to event listeners as model described below  
75@interface PNObjectEventData : PNSubscriberData  
76  
77// This property will be set only if event 'type' is 'channel' and represent channel metadata.  
78@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *channelMetadata;  
79  
80// This property will be set only if event 'type' is 'uuid' and represent uuid metadata.  
81@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *uuidMetadata;  
82  
83// This property will be set only if event `type` is 'membership' and represent uuid membership.  
84@property (nonatomic, nullable, readonly, strong) PNMembership *membership;  
85  
86// Time when object event has been triggered.  
87@property (nonatomic, readonly, strong) NSNumber *timestamp;  
88  
89// Name of action for which object event has been sent.  
90@property (nonatomic, readonly, strong) NSString *event;  
91  
92// Type of object which has been changed and triggered event.  
93@property (nonatomic, readonly, strong) NSString *type;  
94  
95@end  
96  
97@interface PNObjectEventResult : PNResult  
98  
99// Object event object from live feed.  
100@property (nonatomic, readonly, strong) PNObjectEventData *data;  
101  
102@end  
103  
104// Message action events arrive to event listeners as model described below  
105@interface PNMessageActionData : PNSubscriberData  
106  
107// Action for which event has been received.  
108@property (nonatomic, readonly, strong) PNMessageAction *action;  
109  
110// Name of action for which message action event has been sent ('added') or ('removed')  
111@property (nonatomic, readonly, copy) NSString *event;  
112  
113@end  
114  
115@interface PNMessageActionResult : PNResult  
116  
117// Message action object from live feed.  
118@property (nonatomic, readonly, strong) PNMessageActionData *data;  
119  
120@end  

```
show all 120 lines

### Other examples[​](#other-examples-1)

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

Requires Stream Controller add-on (Enable Wildcard Subscribe in Admin Portal).
- Only one wildcard level supported: a.*. Grants/revokes must match wildcard pattern used.

```
`1[self.client subscribeToChannels: @[@"my_channel.*"] withPresence:YES];  
`
```

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

Requires Presence add-on. Subscribe directly to my_channel-pnpres to receive presence events.

```
1/**  
2    Subscription process results arrive to listener which should adopt to  
3    PNObjectEventListener protocol and registered using:  
4    */  
5[self.client addListener:self];  
6[self.client subscribeToPresenceChannels:@[@"my_channel"]];  
7
  
8// New presence event handling.  
9- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
10
  
11    if (![event.data.channel isEqualToString:event.data.subscription]) {  
12
  
13        // Presence event has been received on channel group stored in event.data.subscription.  
14    }  
15    else {  
16  
17        // Presence event has been received on channel stored in event.data.channel.  
18    }  
19
  
20    if (![event.data.presenceEvent isEqualToString:@"state-change"]) {  
21
  
22        NSLog(@"%@ \"%@'ed\"\nat: %@ on %@ (Occupancy: %@)", event.data.presence.uuid,  
23                event.data.presenceEvent, event.data.presence.timetoken, event.data.channel,  
24                event.data.presence.occupancy);  
25    }  
26    else {  
27  
28        NSLog(@"%@ changed state at: %@ on %@ to: %@", event.data.presence.uuid,  
29                event.data.presence.timetoken, event.data.channel, event.data.presence.state);  
30    }  
31}  

```
show all 31 lines

#### Sample Responses[​](#sample-responses)

##### Join event[​](#join-event)

```
`1{  
2    "action": "join",  
3    "timestamp": 1345546797,  
4    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
5    "occupancy": 2  
6}  
`
```

##### Leave event[​](#leave-event)

```
`1{  
2    "action" : "leave",  
3    "timestamp" : 1345549797,  
4    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
5    "occupancy" : 1  
6}  
`
```

##### Timeout event[​](#timeout-event)

```
`1{  
2    "action": "timeout",  
3    "timestamp": 1345549797,  
4    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
5    "occupancy": 0  
6}  
`
```

##### State change event[​](#state-change-event)

```
`1{  
2    "action": "state-change",  
3    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
4    "timestamp": 1345549797,  
5    "data": {  
6        "isTyping": true  
7    }  
8}  
`
```

##### Interval event[​](#interval-event)

```
`1{  
2    "action":"interval",  
3    "timestamp":1474396578,  
4    "occupancy":2  
5}  
`
```

When presence_deltas is enabled, interval may also include joined, left, timedout arrays. If the interval message would exceed ~30 KB, the arrays are omitted and here_now_refresh: true is included; call hereNow to fetch the full list.

```
`1{  
2    "action" : "interval",  
3    "occupancy" : ,  
4    "timestamp" : ,  
5    "joined" : ["uuid2", "uuid3"],  
6    "timedout" : ["uuid1"]  
7}  
`
```

```
`1{  
2    "action" : "interval",  
3    "occupancy" : ,  
4    "timestamp" : ,  
5    "here_now_refresh" : true  
6}  
`
```

#### Subscribing with state[​](#subscribing-with-state)

Requires Presence add-on.

Required UUID: Always set configuration.uuid to a stable, unique value for the user/device.

```
1// Initialize and configure PubNub client instance  
2PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo" subscribeKey:@"demo"];  
3configuration.uuid = @"myUniqueUUID";  
4self.client = [PubNub clientWithConfiguration:configuration];  
5[self.client addListener:self];  
6
  
7// Subscribe to demo channel with presence observation  
8[self.client subscribeToChannels: @[@"my_channel"] withPresence:YES];  
9
  
10- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
11
  
12    if (status.category == PNConnectedCategory) {  
13        [self.client setState: @{@"new": @"state"} forUUID:self.client.uuid onChannel: @"my_channel"  
14                withCompletion:^(PNClientStateUpdateStatus *status) {  
15
  
16            if (!status.isError) {  
17                // Client state successfully modified on specified channel.  
18            } else {  
19                /**  
20                    Handle client state modification error. Check 'category' property  
21                    to find out possible reason because of which request did fail.  
22                    Review 'errorData' property (which has PNErrorData data type) of status  
23                    object to get additional information about issue.  
24  
25                    Request can be resent using: [status retry];  
26                    */  
27            }  
28        }];  
29    }  
30}  
31
  
32// Handle new message from one of channels on which client has been subscribed.  
33- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
34
  
35    // Handle new message stored in message.data.message  
36    if (![message.data.channel isEqualToString:message.data.subscription]) {  
37
  
38        // Message has been received on channel group stored in message.data.subscription.  
39    }  
40    else {  
41  
42        // Message has been received on channel stored in message.data.channel.  
43    }  
44  
45    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message,  
46            message.data.channel, message.data.timetoken);  
47}  

```
show all 47 lines

## Subscribe channel group[​](#subscribe-channel-group)

Requires Stream Controller add-on. Subscribe to a channel group.

### Method(s)[​](#methods-6)

To Subscribe to a Channel Group you can use:

```
`1- (void)subscribeToChannelGroups:(NSArrayNSString *> *)groups   
2                    withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `groups` or not.

```
`1- (void)subscribeToChannelGroups:(NSArrayNSString *> *)groups   
2                    withPresence:(BOOL)shouldObservePresence   
3                     clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `groups` or not.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` group name and value which should be assigned to it.

### Sample code[​](#sample-code-6)

Subscribe to a channel group

```
`1NSString *channelGroup = @"family";  
`
```

```
1/**  
2 Subscription process results arrive to listener which should adopt to  
3 PNObjectEventListener protocol and registered using:  
4 */  
5[self.client addListener:self];  
6[self.client subscribeToChannelGroups:@[channelGroup] withPresence:NO];  
7
  
8// Handle new message from one of channels on which client has been subscribed.  
9- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
10
  
11    // Handle new message stored in message.data.message  
12    if (![message.data.channel isEqualToString:message.data.subscription]) {  
13
  
14        // Message has been received on channel group stored in message.data.subscription.  
15    }  
16    else {  
17
  
18        // Message has been received on channel stored in message.data.channel.  
19    }  
20
  
21    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message,  
22          message.data.channel, message.data.timetoken);  
23}  
24
  
25// Handle subscription status change.  
26- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
27
  
28    if (status.operation == PNSubscribeOperation) {  
29
  
30        // Check whether received information about successful subscription or restore.  
31        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
32
  
33            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
34            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
35            if (subscribeStatus.category == PNConnectedCategory) {  
36  
37                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
38            }  
39            else {  
40  
41                /**  
42                 This usually occurs if subscribe temporarily fails but reconnects. This means there was  
43                 an error but there is no longer any issue.  
44                 */  
45            }  
46        }  
47        else if (status.category == PNUnexpectedDisconnectCategory) {  
48  
49            /**  
50             This is usually an issue with the internet connection, this is an error, handle  
51             appropriately retry will be called automatically.  
52             */  
53        }  
54        // Looks like some kind of issues happened while client tried to subscribe or disconnected from  
55        // network.  
56        else {  
57  
58            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
59            if (errorStatus.category == PNAccessDeniedCategory) {  
60  
61                /**  
62                 This means that Access Manager does allow this client to subscribe to this channel and channel group  
63                 configuration. This is another explicit error.  
64                 */  
65            }  
66            else {  
67  
68                /**  
69                 More errors can be directly specified by creating explicit cases for other error categories  
70                 of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
71                 `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
72                 or `PNNetworkIssuesCategory`  
73                 */  
74            }  
75        }  
76    }  
77}  

```
show all 77 lines

### Response[​](#response-4)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel for which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5// Name of channel or channel group (in case if not equal to channel).  
6@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
7// Time at which event arrived.  
8@property (nonatomic, readonly, strong) NSNumber *timetoken;  
9// Stores reference on metadata information which has been passed along with received event.  
10@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
11  
12@end  
13  
14@interface PNSubscribeStatus : PNErrorStatus  
15  
16// Timetoken which has been used to establish current subscription cycle.  
17@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
18// Stores reference on previous key which has been used in subscription cycle to receive  
19// currentTimetoken along with other events.  
20@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
21// List of channels on which client currently subscribed.  
22@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
23//  List of channel group names on which client currently subscribed.  
24@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
25// Structured PNResult data field information.  
26@property (nonatomic, readonly, strong) PNSubscriberData *data;  
27  
28@end  
29  
30// Message arrive to event listeners as model described below  
31  
32@interface PNMessageData : PNSubscriberData  
33  
34// Message sender identifier.  
35@property (nonatomic, readonly, strong) NSString *publisher;  
36// Message which has been delivered through data object live feed.  
37@property (nonatomic, nullable, readonly, strong) id message;  
38  
39@end  
40  
41@interface PNMessageResult : PNResult  
42  
43// Stores reference on message object from live feed.  
44@property (nonatomic, readonly, strong) PNMessageData *data;  
45  
46@end  

```
show all 46 lines

### Other examples[​](#other-examples-2)

#### Subscribe to the Presence channel of a channel group[​](#subscribe-to-the-presence-channel-of-a-channel-group)

Requires Stream Controller and Presence add-ons.

```
1/**  
2    Subscription process results arrive to listener which should adopt to  
3    PNObjectEventListener protocol and registered using:  
4    */  
5[self.client addListener:self];  
6[self.client subscribeToChannelGroups:@[channelGroup] withPresence:YES];  
7
  
8// Handle new message from one of channels on which client has been subscribed.  
9- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
10
  
11    // Handle new message stored in message.data.message  
12    if (![message.data.channel isEqualToString:message.data.subscription]) {  
13
  
14        // Message has been received on channel group stored in message.data.subscription.  
15    }  
16    else {  
17  
18        // Message has been received on channel stored in message.data.channel.  
19    }  
20
  
21    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message,  
22            message.data.channel, message.data.timetoken);  
23}  
24
  
25// New presence event handling.  
26- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
27
  
28    if (![event.data.channel isEqualToString:event.data.subscription]) {  
29  
30        // Presence event has been received on channel group stored in event.data.subscription.  
31    }  
32    else {  
33  
34        // Presence event has been received on channel stored in event.data.channel.  
35    }  
36
  
37    if (![event.data.presenceEvent isEqualToString:@"state-change"]) {  
38  
39        NSLog(@"%@ \"%@'ed\"\nat: %@ on %@ (Occupancy: %@)", event.data.presence.uuid,  
40                event.data.presenceEvent, event.data.presence.timetoken, event.data.channel,  
41                event.data.presence.occupancy);  
42    }  
43    else {  
44  
45        NSLog(@"%@ changed state at: %@ on %@ to: %@", event.data.presence.uuid,  
46                event.data.presence.timetoken, event.data.channel, event.data.presence.state);  
47    }  
48}  
49
  
50// Handle subscription status change.  
51- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
52
  
53    if (status.operation == PNSubscribeOperation) {  
54  
55        // Check whether received information about successful subscription or restore.  
56        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
57  
58            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
59            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
60            if (subscribeStatus.category == PNConnectedCategory) {  
61  
62                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
63            }  
64            else {  
65  
66                /**  
67                    This usually occurs if subscribe temporarily fails but reconnects. This means there was  
68                    an error but there is no longer any issue.  
69                    */  
70            }  
71        }  
72        else if (status.category == PNUnexpectedDisconnectCategory) {  
73  
74            /**  
75                This is usually an issue with the internet connection, this is an error, handle  
76                appropriately retry will be called automatically.  
77                */  
78        }  
79        // Looks like some kind of issues happened while client tried to subscribe or disconnected from  
80        // network.  
81        else {  
82  
83            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
84            if (errorStatus.category == PNAccessDeniedCategory) {  
85  
86                /**  
87                    This means that Access Manager does allow this client to subscribe to this channel and channel group  
88                    configuration. This is another explicit error.  
89                    */  
90            }  
91            else {  
92  
93                /**  
94                    More errors can be directly specified by creating explicit cases for other error categories  
95                    of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
96                    `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
97                    or `PNNetworkIssuesCategory`  
98                    */  
99            }  
100        }  
101    }  
102}  

```
show all 102 lines

## Unsubscribe[​](#unsubscribe)

Unsubscribe from specific channels (socket remains open while others remain). Unsubscribing from all channels first resets timetoken and may cause message gaps.

### Method(s)[​](#methods-7)

To Unsubscribe from a channel you can use:

```
`1- (void)unsubscribeFromChannels:(NSArrayNSString *> *)channels   
2                   withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs from which client should try to `unsubscribe`.`shouldObservePresence` *Type: BOOLWhether client should disable presence observation on specified `channels` or keep listening for presence event on them.

### Sample code[​](#sample-code-7)

Unsubscribe from a channel:

```
1/**  
2 Unsubscription process results arrive to listener which should adopt to  
3 PNObjectEventListener protocol and registered using:  
4 */  
5[self.client addListener:self];  
6[self.client unsubscribeFromChannels: @[@"my_channel1", @"my_channel2"] withPresence:NO];  
7
  
8// Handle subscription status change.  
9- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
10
  
11    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
12
  
13        /**  
14         This is the expected category for an unsubscribe. This means there was no error in  
15         unsubscribing from everything.  
16         */  
17    }  
18}  

```
show all 18 lines

### Response[​](#response-5)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel for which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5// Name of channel or channel group (in case if not equal to channel).  
6@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
7// Time at which event arrived.  
8@property (nonatomic, readonly, strong) NSNumber *timetoken;  
9// Stores reference on metadata information which has been passed along with received event.  
10@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
11  
12@end  
13  
14@interface PNSubscribeStatus : PNErrorStatus  
15  
16// Timetoken which has been used to establish current subscription cycle.  
17@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
18// Stores reference on previous key which has been used in subscription cycle to receive  
19// currentTimetoken along with other events.  
20@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
21// List of channels on which client currently subscribed.  
22@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
23//  List of channel group names on which client currently subscribed.  
24@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
25// Structured PNResult data field information.  
26@property (nonatomic, readonly, strong) PNSubscriberData *data;  
27  
28@end  

```
show all 28 lines

## Unsubscribe all[​](#unsubscribe-all)

Unsubscribe from all channels and all channel groups.

### Method(s)[​](#methods-8)

```
`1- (void)unsubscribeFromAll;  
`
```

### Sample code[​](#sample-code-8)

```
1/**  
2 Unsubscription process results arrive to listener which should adopt to  
3 PNObjectEventListener protocol and registered using:  
4 */  
5[self.client addListener:self];  
6[self.client unsubscribeFromAll];  
7
  
8// Handle subscription status change.  
9- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
10
  
11    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
12
  
13        /**  
14         This is the expected category for an unsubscribe. This means there was no error in unsubscribing  
15         from everything.  
16         */  
17    }  
18}  

```
show all 18 lines

### Returns[​](#returns)

None

## Unsubscribe from a channel group[​](#unsubscribe-from-a-channel-group)

Unsubscribe from channel groups.

### Method(s)[​](#methods-9)

To run Unsubscribe from a Channel Group you can use:

```
`1- (void)unsubscribeFromChannelGroups:(NSArrayNSString *> *)groups   
2                        withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names from which client should try to `unsubscribe`.`shouldObservePresence` *Type: BOOLWhether client should disable presence observation on specified `channel` groups or keep listening for presence event on them.

### Sample code[​](#sample-code-9)

#### Unsubscribe from a channel group[​](#unsubscribe-from-a-channel-group-1)

```
1/**  
2 Unsubscription process results arrive to listener which should adopt to  
3 PNObjectEventListener protocol and registered using:  
4 */  
5[self.client addListener:self];  
6[self.client unsubscribeFromChannelGroups: @[@"developers"] withPresence:YES];  
7
  
8// Handle subscription status change.  
9- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
10
  
11    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
12
  
13        /**  
14         This is the expected category for an unsubscribe. This means there was no error in unsubscribing  
15         from everything.  
16         */  
17    }  
18}  

```
show all 18 lines

### Response[​](#response-6)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel for which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5// Name of channel or channel group (in case if not equal to channel).  
6@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
7// Time at which event arrived.  
8@property (nonatomic, readonly, strong) NSNumber *timetoken;  
9// Stores reference on metadata information which has been passed along with received event.  
10@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
11  
12@end  
13  
14@interface PNSubscribeStatus : PNErrorStatus  
15  
16// Timetoken which has been used to establish current subscription cycle.  
17@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
18// Stores reference on previous key which has been used in subscription cycle to receive  
19// currentTimetoken along with other events.  
20@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
21// List of channels on which client currently subscribed.  
22@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
23//  List of channel group names on which client currently subscribed.  
24@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
25// Structured PNResult data field information.  
26@property (nonatomic, readonly, strong) PNSubscriberData *data;  
27  
28@end  

```
show all 28 lines

## Presence[​](#presence)

Subscribe to presence channels (channel-pnpres) to receive join/leave/timeout/state-change/interval events. With restore = true, the client attempts to reconnect and catch up after disconnects (best-effort); default reconnect after ~320s.

### Method(s)[​](#methods-10)

To do Presence you can use:

```
`1- (void)subscribeToPresenceChannels:(NSArrayNSString *> *)channels;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs for which client should try to `subscribe` on presence observing `channels`.

### Sample code[​](#sample-code-10)

Subscribe to the presence channel:

```
1/**  
2 Subscription process results arrive to listener which should adopt to  
3 PNObjectEventListener protocol and registered using:  
4 */  
5[self.client addListener:self];  
6[self.client subscribeToPresenceChannels:@[@"my_channel"]];  
7
  
8// New presence event handling.  
9- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
10
  
11    if (![event.data.channel isEqualToString:event.data.subscription]) {  
12
  
13        // Presence event has been received on channel group stored in event.data.subscription.  
14    }  
15    else {  
16  
17        // Presence event has been received on channel stored in event.data.channel.  
18    }  
19  
20    if (![event.data.presenceEvent isEqualToString:@"state-change"]) {  
21  
22        NSLog(@"%@ \"%@'ed\"\nat: %@ on %@ (Occupancy: %@)", event.data.presence.uuid,  
23              event.data.presenceEvent, event.data.presence.timetoken, event.data.channel,  
24              event.data.presence.occupancy);  
25    }  
26    else {  
27  
28        NSLog(@"%@ changed state at: %@ on %@ to: %@", event.data.presence.uuid,  
29              event.data.presence.timetoken, event.data.channel, event.data.presence.state);  
30    }  
31}  

```
show all 31 lines

### Response[​](#response-7)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel for which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5// Name of channel or channel group (in case if not equal to channel).  
6@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
7// Time at which event arrived.  
8@property (nonatomic, readonly, strong) NSNumber *timetoken;  
9// Stores reference on metadata information which has been passed along with received event.  
10@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
11  
12@end  
13  
14@interface PNSubscribeStatus : PNErrorStatus  
15  
16// Timetoken which has been used to establish current subscription cycle.  
17@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
18// Stores reference on previous key which has been used in subscription cycle to receive  
19// currentTimetoken along with other events.  
20@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
21// List of channels on which client currently subscribed.  
22@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
23//  List of channel group names on which client currently subscribed.  
24@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
25// Structured PNResult data field information.  
26@property (nonatomic, readonly, strong) PNSubscriberData *data;  
27  
28@end  
29  
30// Presence events arrive to event listeners as model described below  
31  
32@interface PNPresenceDetailsData : PNSubscriberData  
33  
34// Time when presence event has been triggered.  
35@property (nonatomic, readonly, strong) NSNumber *timetoken;  
36// Reference on unique user identifier for which event has been triggered.  
37@property (nonatomic, nullable, readonly, strong) NSString *uuid;  
38// List of newly joined subscribers' UUID.  
39@property (nonatomic, nullable, readonly, strong) NSArrayNSString *> *join;  
40// List of recently leaved subscribers' UUID.  
41@property (nonatomic, nullable, readonly, strong) NSArrayNSString *> *leave;  
42// List of recently UUID of subscribers which leaved by timeout.  
43@property (nonatomic, nullable, readonly, strong) NSArrayNSString *> *timeout;  
44// Channel presence information.  
45@property (nonatomic, readonly, strong) NSNumber *occupancy;  
46// User changed client state.  
47@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *state;  
48  
49@end  
50  
51@interface PNPresenceEventData : PNSubscriberData  
52  
53// Type of presence event.  
54@property (nonatomic, readonly, strong) NSString *presenceEvent;  
55// Additional presence information.  
56@property (nonatomic, readonly, strong) PNPresenceDetailsData *presence;  
57  
58@end  
59  
60@interface PNPresenceEventResult : PNResult  
61  
62// Stores reference on presence event object from live feed.  
63@property (nonatomic, readonly, strong) PNPresenceEventData *data;  
64  
65@end  

```
show all 65 lines

## Presence unsubscribe[​](#presence-unsubscribe)

Stop monitoring presence for channels (socket remains open while others remain).

### Method(s)[​](#methods-11)

To Unsubscribe from Presence of a channel you can use:

```
`1- (void)unsubscribeFromPresenceChannels:(NSArrayNSString *> *)channels;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs for which client should try to `unsubscribe` from presence observing `channels`

### Sample code[​](#sample-code-11)

Unsubscribe from the presence channel:

```
`1[self.client unsubscribeFromChannelGroups:@[@"developers"] withPresence:YES];  
`
```

### Response[​](#response-8)

```
1@interface PNSubscriberData : PNServiceData  
2
  
3// Name of channel for which subscriber received data.  
4@property (nonatomic, readonly, strong) NSString *channel;  
5// Name of channel or channel group (in case if not equal to channel).  
6@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
7// Time at which event arrived.  
8@property (nonatomic, readonly, strong) NSNumber *timetoken;  
9// Stores reference on metadata information which has been passed along with received event.  
10@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
11  
12@end  
13  
14@interface PNSubscribeStatus : PNErrorStatus  
15  
16// Timetoken which has been used to establish current subscription cycle.  
17@property (nonatomic, readonly, strong) NSNumber *currentTimetoken;  
18// Stores reference on previous key which has been used in subscription cycle to receive  
19// currentTimetoken along with other events.  
20@property (nonatomic, readonly, strong) NSNumber *lastTimeToken;  
21// List of channels on which client currently subscribed.  
22@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannels;  
23//  List of channel group names on which client currently subscribed.  
24@property (nonatomic, readonly, copy) NSArrayNSString *> *subscribedChannelGroups;  
25// Structured PNResult data field information.  
26@property (nonatomic, readonly, strong) PNSubscriberData *data;  
27
**28@end  

```
show all 28 linesLast updated on Nov 6, 2025**