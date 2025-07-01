On this page
# Publish/Subscribe API for Objective-C SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

##### ObjectNode

The new Jackson parser does not recognize JSONObject. Use ObjectNode instead.

- Prerequisites and limitations
- Security
- Message data
- Size and compression
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/python/api-reference/configuration#configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

You can secure the messages with SSL/TLS by setting `ssl` to `true` during [initialization](/docs/sdks/objective-c/api-reference/configuration). You can also [encrypt](/docs/sdks/objective-c/api-reference/configuration#cryptomodule) messages.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. `data` should not contain special Objective-C classes or functions as these will not serialize. String content can include any single-byte or multi-byte UTF-8 character.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

Message compression can be helpful if you want to send data exceeding the default 32 KiB message size limit, or use bandwidth more efficiently by sending the message payload as the compressed body of an HTTP POST call.

##### Compression and PubNub SDKs

The C-Core and Objective-C SDKs support compressed messages.

Compressing messages is useful for scenarios that include high channel occupancy and quick exchange of information like ride hailing apps or multiplayer games.
Compression Trade-offDetailsUsing CompressionCompression methods and support vary between SDKs. If the receiving SDK doesn't support the sender's compression method, or even if it doesn't support compression at all, the PubNub server automatically changes the compressed message's format so that it is understandable to the recipient. No action is necessary from you. Messages are not compressed by default; you must always explicitly specify that you want to use message compression.Small messages can expandCompressed messages generally have a smaller size, and can be delivered faster, but only if the original message is over 1 KiB. If you compress a signal (whose size is limited to 64 bytes), the compressed payload exceeds the signal's initial uncompressed size.CPU overhead can increaseWhile a smaller payload size is an advantage, working with compressed messages uses more CPU time than working with uncompressed messages. CPU time is required to compress the message on the sending client, and again to decompress the message on the receiving client. Efficient resource management is especially important on mobile devices, where increased usage affects battery life. Carefully consider the balance of lower bandwidth and higher speed versus any increased CPU usage.
Refer to the code below for an example of sending a compressed message:

```
`[self.client publish:@{@"message": @"This message will be compressed"}  
           toChannel:@"channel_name" compressed:YES  
      withCompletion:^(PNPublishStatus *status) {  
    if (!status.isError) {  
        // Message successfully published to specified channel.  
    } else {  
        // Handle error.  
    }  
}]  
`
```

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `customMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

To `Publish a message` you can use the following method(s) in the Objective-C SDK:

#### Publish a message with block[​](#publish-a-message-with-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object ( `NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with compression and block[​](#publish-a-message-with-compression-and-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
        compressed:(BOOL)compressed   
    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`compressed` *Type: BOOLWhether `message` should be `compressed` and sent with request body instead of URI part. Compression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with storage and block[​](#publish-a-message-with-storage-and-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
    storeInHistory:(BOOL)shouldStore   
    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with storage, compression, and block[​](#publish-a-message-with-storage-compression-and-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
    storeInHistory:(BOOL)shouldStore   
        compressed:(BOOL)compressed   
    withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idReference on Foundation object (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlock`Publish` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload and block[​](#publish-a-message-with-payload-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `gcm`).`block`Type: PNPublishCompletionBlockPublish processing completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload, compression, and block[​](#publish-a-message-with-payload-compression-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
           compressed:(BOOL)compressed   
       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads` *Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `gcm`).`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payload, storage, and block[​](#publish-a-message-with-payload-storage-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
       storeInHistory:(BOOL)shouldStore   
       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which `message` should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with `apns` key and Google with `gcm`).`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`block`Type: PNPublishCompletionBlockPublish processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with payloads, storage, compression, and block[​](#publish-a-message-with-payloads-storage-compression-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
       storeInHistory:(BOOL)shouldStore   
           compressed:(BOOL)compressed   
       withCompletion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idReference on Foundation `object` (`NSString`, `NSNumber`, `NSArray`,`NSDictionary`) which will be published.`channel` *Type: NSStringReference on ID of the `channel` to which message should be published.`payloads`Type: NSDictionaryDictionary with payloads for different vendors (Apple with "apns" key and Google with "gcm").`shouldStore` *Type: BOOLWith `NO` this `message` later won't be fetched using Message Persistence API.`compressed` *Type: BOOLCompression useful in case if large data should be published, in another case it will lead to packet size grow.`block`Type: PNPublishCompletionBlockPublish processing completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Publish a message with metadata and block[​](#publish-a-message-with-metadata-and-block)

```
`- (void)publish:(id)message   
       toChannel:(NSString *)channel   
    withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
      completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with compression, metadata, and block[​](#publish-a-message-with-compression-metadata-and-block)

```
`- (void)publish:(id)message   
       toChannel:(NSString *)channel   
      compressed:(BOOL)compressed   
    withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
      completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`compressed` *Type: BOOLIf `true` the `message` will be `compressed` and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with storage, metadata, and block[​](#publish-a-message-with-storage-metadata-and-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
    storeInHistory:(BOOL)shouldStore   
      withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
        completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with storage, compression, metadata, and block[​](#publish-a-message-with-storage-compression-metadata-and-block)

```
`- (void)publish:(id)message   
         toChannel:(NSString *)channel   
    storeInHistory:(BOOL)shouldStore   
        compressed:(BOOL)compressed   
      withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
        completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`compressed` *Type: BOOLIf `true` the `message` will be `compressed` and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, metadata, and block[​](#publish-a-message-with-payload-metadata-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `gcm`). Either payloads or `message` should be provided..`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, compression, metadata, and block[​](#publish-a-message-with-payload-compression-metadata-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
           compressed:(BOOL)compressed   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `gcm`). Either `payloads` or `message` should be provided.`compressed` *Type: BOOLIf `true` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, storage, metadata, and block[​](#publish-a-message-with-payload-storage-metadata-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
       storeInHistory:(BOOL)shouldStore   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation `object` (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to publish messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `a ps` key and Google with `gcm`). Either `payloads` or `message` should be provided.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

#### Publish a message with payload, storage, compression, metadata, and block[​](#publish-a-message-with-payload-storage-compression-metadata-and-block)

```
`- (void)publish:(nullable id)message   
            toChannel:(NSString *)channel   
    mobilePushPayload:(nullable NSDictionaryNSString *, id> *)payloads   
       storeInHistory:(BOOL)shouldStore   
           compressed:(BOOL)compressed   
         withMetadata:(nullable NSDictionaryNSString *, id> *)metadata   
           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`String`, `NSNumber`, `Array`, `Dictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `gcm`). Either `payloads` or `message` should be provided.`shouldStore` *Type: BOOLIf `false` the messages will not be stored in Message Persistence, default `true`.`compressed` *Type: BOOLIf `true` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"publishUser"];  
  
// Optional: Configure encryption for secure messages  
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
                                           randomInitializationVector:YES];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
`
```
show all 147 lines

##### Subscribe to the channel

Before running the above publish example, either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a separate terminal window, [subscribe to the same channel](#subscribe) that is being published to.

### Response[​](#response)

Response objects which is returned by client when publish API is used:

```
`@interface PNPublishData : PNServiceData  
  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNPublishStatus : PNAcknowledgmentStatus  
  
@property (nonatomic, readonly, strong) PNPublishData *data;  
  
@end  
`
```

### Other Examples[​](#other-examples)

#### Publish with metadata[​](#publish-with-metadata)

```
`[self publish: @"Hello from the PubNub Objective-C" toChannel:@"chat_channel"  
    withMetadata: @{@"senderID" : @"bob"}  completion:^(PNPublishStatus *status) {  
  
    if (!status.isError) {  
  
        // Message successfully published to specified channel.  
    }  
    else {  
  
        /**  
            Handle message publish error. Check 'category' property to find  
            out possible reason because of which request did fail.  
            Review 'errorData' property (which has PNErrorData data type) of status  
            object to get additional information about issue.  
  
`
```
show all 19 lines

#### Push Payload Helper[​](#push-payload-helper)

You can use the helper method as an input to the `Message` parameter, to format the payload for publishing [Push](/docs/general/push/send) messages. For more info on the helper method, check [Create Push Payload Helper Section](/docs/sdks/objective-c/api-reference/misc#pnapnsnotificationconfiguration)

## Publish (Builder Pattern)[​](#publish-builder-pattern)

This function publishes a message on a channel.

##### Note

This method uses the builder pattern, you can remove the args which are optional.

### Method(s)[​](#methods-1)

To run `Publish Builder` you can use the following method(s) in the Objective-C SDK:

```
`publish()  
    .message(id)  
    .channel(NSString *)  
    .shouldStore(BOOL)  
    .compress(BOOL)  
    .ttl(NSUInteger)  
    .payloads(NSDictionary *)  
    .metadata(NSDictionary *)  
    .customMessageType(NSString*)  
    .performWithCompletion(PNPublishCompletionBlock);  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`).`channel` *Type: NSString*Specifies `channel` ID to `publish` messages to.`shouldStore`Type: BOOLIf `NO` the messages will not be stored in history.   
Default `YES`.`compress`Type: BOOLIf `YES` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`ttl`Type: NSUIntegerSpecify for how many hours published `message` should be stored.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `gcm`). Either `payloads` or `message` should be provided.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`customMessageType`Type: NSString*A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Basic Usage[​](#basic-usage-1)

Publish message which will be stored in Message Persistence for next 16 hours.

```
`self.client.publish()  
    .channel(@"my_channel")  
    .message(@"Hello from PubNub iOS!")  
    .shouldStore(YES)  
    .ttl(16)  
    .customMessageType(@"text-message")  
    .performWithCompletion(^(PNPublishStatus *status) {  
  
    if (!status.isError) {  
  
        // Message successfully published to specified channel.  
    }  
    else {  
  
        /**  
`
```
show all 24 lines

## Fire (Builder Pattern)[​](#fire-builder-pattern)

The fire endpoint allows the client to send a message to BLOCKS Event Handlers. These messages will go directly to any Event Handlers registered on the channel that you fire to and will trigger their execution. The content of the fired request will be available for processing within the Event Handler. The message sent via `fire()` is not replicated, and so will not be received by any subscribers to the channel. The message is also not stored in history.

##### Note

This method uses the builder pattern, you can remove the args which are optional.

### Method(s)[​](#methods-2)

To `Fire a message` you can use the following method(s) in the Objective-C SDK:

```
`fire()  
    .message(id)  
    .channel(NSString *)  
    .compress(BOOL)  
    .payloads(NSDictionary *)  
    .metadata(NSDictionary *)  
    .performWithCompletion(PNPublishCompletionBlock);  
`
```

*  requiredParameterDescription`message`Type: idThe `message` may be any valid foundation object (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`).`channel` *Type: NSStringSpecifies `channel` ID to `publish` messages to.`compress`Type: BOOLIf `YES` the `message` will be compressed and sent with request body instead of the URI. Compression useful in case of large data, in another cases it will increase the packet size.`payloads`Type: NSDictionaryDictionary with `payloads` for different vendors (Apple with `aps` key and Google with `gcm`). Either `payloads` or `message` should be provided.`metadata`Type: NSDictionary`NSDictionary` with values which should be used by `PubNub` service to filter messages.`block`Type: PNPublishCompletionBlockThe completion `block` which will be called when the processing is complete, has one argument: - `request` status reports the publish was successful or not (`errorData` contains error information in case of failure).

### Basic Usage[​](#basic-usage-2)

```
`self.client.fire()  
    .channel(@"my_channel")  
    .message(@"Hello from PubNub iOS!")  
    .shouldStore(YES)  
    .performWithCompletion(^(PNPublishStatus *status) {  
  
    if (!status.isError) {  
  
        // Message successfully published to specified channel.  
    }  
    else {  
  
        /**  
         Handle message publish error. Check 'category' property to find  
         out possible reason because of which request did fail.  
`
```
show all 22 lines

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, please [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-3)

To `Signal a message` you can use the following method(s) in the Objective-C SDK:

```
`- (void)signal:(id)message   
           channel:(NSString *)channel   
    withCompletion:(nullable PNSignalCompletionBlock)block;  
`
```

*  requiredParameterDescription`message` *Type: idObject (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be sent with signal.`channel` *Type: NSStringID of the `channel` to which `signal` should be sent.`block`Type: PNSignalCompletionBlockSignal processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

### Basic Usage[​](#basic-usage-3)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`[self.client signal:@{ @"Hello": @"world" } channel:@"announcement"  
     withCompletion:^(PNSignalStatus *status) {  
  
    if (!status.isError) {  
        // Signal successfully sent to specified channel.  
    } else {  
        /**  
         * Handle signal sending error. Check 'category' property to find out possible issue  
         * because of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
    }  
}];  
`
```

### Response[​](#response-1)

Response objects returned by the client when Signal API is used:

```
`@interface PNSignalStatusData : PNServiceData  
  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNSignalStatus : PNAcknowledgmentStatus  
  
@property (nonatomic, readonly, strong) PNSignalStatusData *data;  
  
@end  
`
```

## Signal (Builder Pattern)[​](#signal-builder-pattern)

##### Note

This method uses the builder pattern, you can remove the args which are optional.

### Method(s)[​](#methods-4)

To run `Signal Builder` you can use the following method(s) in the Objective-C SDK:

```
`signal()  
    .message(id)  
    .channel(NSString *)  
    .customMessageType(NSString *)  
    .performWithCompletion(PNSignalCompletionBlock);  
`
```

*  requiredParameterDescription`message` *Type: ArrayObject (`NSString`, `NSNumber`, `NSArray`, `NSDictionary`) which will be sent with signal.`channel` *Type: StringID of the `channel` to which `signal` should be sent.`customMessageType`Type: NSString*A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`block`Type: PNSignalCompletionBlockSignal processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

### Basic Usage[​](#basic-usage-4)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel-1)

```
`self.client.signal().message(@{ @"Hello": @"world" }).channel(@"announcement").customMessageType(@"text-message-signal").performWithCompletion(^(PNSignalStatus *status) {  
  
    if (!status.isError) {  
        // Signal successfully sent to specified channel.  
    } else {  
        /**  
         * Handle signal sending error. Check 'category' property to find out possible issue  
         * because of which request did fail.  
         *  
         * Request can be resent using: [status retry];  
         */  
    }  
});  
`
```

##### Response[​](#response-2)

Response objects which is returned by client when Signal API is used::

```
`@interface PNSignalStatusData : PNServiceData  
  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNSignalStatus : PNAcknowledgmentStatus  
  
@property (nonatomic, readonly, strong) PNSignalStatusData *data;  
  
@end  
`
```

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Event Listeners](/docs/sdks/objective-c/api-reference/configuration#event-listeners) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID the client must send the appropriate `subscribeKey` at initialization. By default a newly subscribed client will only receive messages published to the channel after the `subscribeToChannels` call completes.

##### Connectivity notification

You can be notified of connectivity via the `connect` callback. By waiting for the connect callback to return before attempting to publish, you can avoid a potential race condition on clients that subscribe and immediately publish messages before the subscribe has completed.

Using Objective-C SDK, if a client becomes disconnected from a channel, it can automatically attempt to reconnect to that channel and retrieve any available messages that were missed during that period by setting `restore` to `YES`. By default a client will attempt to reconnect after exceeding a `320` second connection timeout.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-5)

To `Subscribe to a channel` you can use the following method(s) in the Objective-C SDK:

```
`- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
               withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.   
   
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
               withPresence:(BOOL)shouldObservePresence   
                clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` ID and value which should be assigned to it.

```
`- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
               withPresence:(BOOL)shouldObservePresence   
             usingTimeToken:(nullable NSNumber *)timeToken;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`timeToken`Type: NSNumberSpecifies time from which to start returning any available cached messages. `Message` retrieval with `timetoken` is not guaranteed and should only be considered a best-effort service.

```
`- (void)subscribeToChannels:(NSArrayNSString *> *)channels   
               withPresence:(BOOL)shouldObservePresence   
             usingTimeToken:(nullable NSNumber *)timeToken   
                clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `channels` or not.`timeToken`Type: NSNumberSpecifies time from which to start returning any available cached messages. `Message` retrieval with `timetoken` is not guaranteed and should only be considered a best-effort service.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` ID and value which should be assigned to it.

### Basic Usage[​](#basic-usage-5)

Subscribe to a channel:

```
`/**  
 Subscription results arrive to a listener which should implement the  
 PNObjectEventListener protocol and be registered as follows:  
 */  
[self.client addListener:self];  
[self.client subscribeToChannels: @[@"my_channel1", @"my_channel2"] withPresence:NO];  
  
// Handle a new message from a subscribed channel  
- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
    // Reference to the channel group containing the chat the message was sent to  
    NSString *subscription = message.data.subscription;  
    NSLog(@"%@ sent message to '%@' at %@: %@", message.data.publisher, message.data.channel,  
            message.data.timetoken, message.data.message);  
}  
  
`
```
show all 97 lines

### Response[​](#response-3)

```
`@interface PNSubscriberData : PNServiceData  
  
// Name of channel on which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
  
// Name of channel or channel group (if not equal to channel name).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
  
// Time at which the event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
  
// Stores a reference to the metadata information passed along with the received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
`
```
show all 120 lines

### Other Examples[​](#other-examples-1)

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/) (with Enable Wildcard Subscribe checked). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Wildcard subscribes allow the client to subscribe to multiple channels using wildcard. For example, if you subscribe to `a.*` you will get all messages for `a.b`, `a.c`, `a.x`. The wildcarded `*` portion refers to any portion of the channel string name after the `dot (.)`.

```
`[self.client subscribeToChannels: @[@"my_channel.*"] withPresence:YES];  
`
```

##### Wildcard grants and revokes

Only one level (`a.*`) of wildcarding is supported. If you grant on `*` or `a.b.*`, the grant will treat `*` or `a.b.*` as a single channel named either `*` or `a.b.*`. You can also revoke permissions from multiple channels using wildcards but only if you previously granted permissions using the same wildcards. Wildcard revokes, similarly to grants, only work one level deep, like `a.*`.

#### Subscribing to a Presence channel[​](#subscribing-to-a-presence-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`.

```
`/**  
    Subscription process results arrive to listener which should adopt to  
    PNObjectEventListener protocol and registered using:  
    */  
[self.client addListener:self];  
[self.client subscribeToPresenceChannels:@[@"my_channel"]];  
  
// New presence event handling.  
- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
  
    if (![event.data.channel isEqualToString:event.data.subscription]) {  
  
        // Presence event has been received on channel group stored in event.data.subscription.  
    }  
    else {  
`
```
show all 31 lines

#### Sample Responses[​](#sample-responses)

##### Join Event[​](#join-event)

```
`{  
    "action": "join",  
    "timestamp": 1345546797,  
    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy": 2  
}  
`
```

##### Leave Event[​](#leave-event)

```
`{  
    "action" : "leave",  
    "timestamp" : 1345549797,  
    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy" : 1  
}  
`
```

##### Timeout Event[​](#timeout-event)

```
`{  
    "action": "timeout",  
    "timestamp": 1345549797,  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "occupancy": 0  
}  
`
```

##### State Change Event[​](#state-change-event)

```
`{  
    "action": "state-change",  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "timestamp": 1345549797,  
    "data": {  
        "isTyping": true  
    }  
}  
`
```

##### Interval Event[​](#interval-event)

```
`{  
    "action":"interval",  
    "timestamp":1474396578,  
    "occupancy":2  
}  
`
```

When a channel is in interval mode with `presence_deltas` `pnconfig` flag enabled, the interval message may also include the following fields which contain an array of changed UUIDs since the last interval message.

- joined

- left

- timedout

For example, this interval message indicates there were 2 new UUIDs that joined and 1 timed out UUID since the last interval:

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "joined" : ["uuid2", "uuid3"],  
    "timedout" : ["uuid1"]  
}  
`
```

If the full interval message is greater than `30KB` (since the max publish payload is `∼32KB`), none of the extra fields will be present. Instead there will be a `here_now_refresh` boolean field set to `true`. This indicates to the user that they should do a `hereNow` request to get the complete list of users present in the channel.

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "here_now_refresh" : true  
}  
`
```

#### Subscribing with State[​](#subscribing-with-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

##### Required UUID

Always set the `UUID` to uniquely identify the user or device that connects to PubNub. This `UUID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `UUID`, you won't be able to connect to PubNub.

```
`// Initialize and configure PubNub client instance  
PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo" subscribeKey:@"demo"];  
configuration.uuid = @"myUniqueUUID";  
self.client = [PubNub clientWithConfiguration:configuration];  
[self.client addListener:self];  
  
// Subscribe to demo channel with presence observation  
[self.client subscribeToChannels: @[@"my_channel"] withPresence:YES];  
  
- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.category == PNConnectedCategory) {  
        [self.client setState: @{@"new": @"state"} forUUID:self.client.uuid onChannel: @"my_channel"  
                withCompletion:^(PNClientStateUpdateStatus *status) {  
  
`
```
show all 47 lines

## Subscribe Channel Group[​](#subscribe-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This functions subscribes to a channel group.

### Method(s)[​](#methods-6)

To `Subscribe to a Channel Group` you can use the following method(s) in the Objective-C SDK:

```
`- (void)subscribeToChannelGroups:(NSArrayNSString *> *)groups   
                    withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `groups` or not.

```
`- (void)subscribeToChannelGroups:(NSArrayNSString *> *)groups   
                    withPresence:(BOOL)shouldObservePresence   
                     clientState:(nullable NSDictionaryNSString *, id> *)state;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names on which client should try to `subscribe`.`shouldObservePresence` *Type: BOOLWhether presence observation should be enabled for `groups` or not.`state`Type: NSDictionaryReference on dictionary which stores key-value pairs based on `channel` group name and value which should be assigned to it.

### Basic Usage[​](#basic-usage-6)

Subscribe to a channel group

```
`NSString *channelGroup = @"family";  
`
```

```
`/**  
 Subscription process results arrive to listener which should adopt to  
 PNObjectEventListener protocol and registered using:  
 */  
[self.client addListener:self];  
[self.client subscribeToChannelGroups:@[channelGroup] withPresence:NO];  
  
// Handle new message from one of channels on which client has been subscribed.  
- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
  
    // Handle new message stored in message.data.message  
    if (![message.data.channel isEqualToString:message.data.subscription]) {  
  
        // Message has been received on channel group stored in message.data.subscription.  
    }  
`
```
show all 77 lines

### Response[​](#response-4)

```
`@interface PNSubscriberData : PNServiceData  
  
// Name of channel for which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
// Name of channel or channel group (in case if not equal to channel).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
// Time at which event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
// Stores reference on metadata information which has been passed along with received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
  
@interface PNSubscribeStatus : PNErrorStatus  
  
`
```
show all 46 lines

### Other Examples[​](#other-examples-2)

#### Subscribe to the presence channel of a channel group[​](#subscribe-to-the-presence-channel-of-a-channel-group)

##### Requires Stream Controller and Presence add-ons

This method requires both the *Stream Controller* and *Presence* add-ons are enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

```
`/**  
    Subscription process results arrive to listener which should adopt to  
    PNObjectEventListener protocol and registered using:  
    */  
[self.client addListener:self];  
[self.client subscribeToChannelGroups:@[channelGroup] withPresence:YES];  
  
// Handle new message from one of channels on which client has been subscribed.  
- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
  
    // Handle new message stored in message.data.message  
    if (![message.data.channel isEqualToString:message.data.subscription]) {  
  
        // Message has been received on channel group stored in message.data.subscription.  
    }  
`
```
show all 102 lines

## Unsubscribe[​](#unsubscribe)

When subscribed to a single channel, this function causes the client to issue a `leave` from the `channel` and close any open socket to the PubNub Network. For multiplexed channels, the specified `channel`(s) will be removed and the socket remains open until there are no more channels remaining in the list.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-7)

To `Unsubscribe from a channel` you can use the following method(s) in the Objective-C SDK:

```
`- (void)unsubscribeFromChannels:(NSArrayNSString *> *)channels   
                   withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs from which client should try to `unsubscribe`.`shouldObservePresence` *Type: BOOLWhether client should disable presence observation on specified `channels` or keep listening for presence event on them.

### Basic Usage[​](#basic-usage-7)

Unsubscribe from a channel:

```
`/**  
 Unsubscription process results arrive to listener which should adopt to  
 PNObjectEventListener protocol and registered using:  
 */  
[self.client addListener:self];  
[self.client unsubscribeFromChannels: @[@"my_channel1", @"my_channel2"] withPresence:NO];  
  
// Handle subscription status change.  
- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
  
        /**  
         This is the expected category for an unsubscribe. This means there was no error in  
         unsubscribing from everything.  
`
```
show all 18 lines

### Response[​](#response-5)

```
`@interface PNSubscriberData : PNServiceData  
  
// Name of channel for which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
// Name of channel or channel group (in case if not equal to channel).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
// Time at which event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
// Stores reference on metadata information which has been passed along with received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
  
@interface PNSubscribeStatus : PNErrorStatus  
  
`
```
show all 28 lines

## Unsubscribe All[​](#unsubscribe-all)

Unsubscribe from all channels and all channel groups

### Method(s)[​](#methods-8)

```
`- (void)unsubscribeFromAll;  
`
```

### Basic Usage[​](#basic-usage-8)

```
`/**  
 Unsubscription process results arrive to listener which should adopt to  
 PNObjectEventListener protocol and registered using:  
 */  
[self.client addListener:self];  
[self.client unsubscribeFromAll];  
  
// Handle subscription status change.  
- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
  
        /**  
         This is the expected category for an unsubscribe. This means there was no error in unsubscribing  
         from everything.  
`
```
show all 18 lines

### Returns[​](#returns)

None

## Unsubscribe from a Channel Group[​](#unsubscribe-from-a-channel-group)

This function lets you Unsubscribe from a Channel Group

### Method(s)[​](#methods-9)

To run `Unsubscribe from a Channel Group` you can use the following method(s) in the Objective-C SDK:

```
`- (void)unsubscribeFromChannelGroups:(NSArrayNSString *> *)groups   
                        withPresence:(BOOL)shouldObservePresence;  
`
```

*  requiredParameterDescription`groups` *Type: NSArrayList of `channel` group names from which client should try to `unsubscribe`.`shouldObservePresence` *Type: BOOLWhether client should disable presence observation on specified `channel` groups or keep listening for presence event on them.

### Basic Usage[​](#basic-usage-9)

#### Unsubscribe from a Channel Group[​](#unsubscribe-from-a-channel-group-1)

```
`/**  
 Unsubscription process results arrive to listener which should adopt to  
 PNObjectEventListener protocol and registered using:  
 */  
[self.client addListener:self];  
[self.client unsubscribeFromChannelGroups: @[@"developers"] withPresence:YES];  
  
// Handle subscription status change.  
- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNUnsubscribeOperation && status.category == PNDisconnectedCategory) {  
  
        /**  
         This is the expected category for an unsubscribe. This means there was no error in unsubscribing  
         from everything.  
`
```
show all 18 lines

### Response[​](#response-6)

```
`@interface PNSubscriberData : PNServiceData  
  
// Name of channel for which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
// Name of channel or channel group (in case if not equal to channel).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
// Time at which event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
// Stores reference on metadata information which has been passed along with received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
  
@interface PNSubscribeStatus : PNErrorStatus  
  
`
```
show all 28 lines

## Presence[​](#presence)

This function is used to subscribe to the presence channel. Using Objective-C SDK, if a client becomes disconnected from a channel, it can automatically attempt to reconnect to that channel and retrieve any available messages that were missed during that period by setting `restore` to `true`. By default a client will attempt to reconnect after exceeding a `320` second connection timeout.

### Method(s)[​](#methods-10)

To do `Presence` you can use the following method(s) in the Objective-C SDK:

```
`- (void)subscribeToPresenceChannels:(NSArrayNSString *> *)channels;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs for which client should try to `subscribe` on presence observing `channels`.

### Basic Usage[​](#basic-usage-10)

Subscribe to the presence channel: For any given channel there is an associated `Presence` channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name. For example the channel named `my_channel` would have the presence channel named `my_channel-pnpres`

```
`/**  
 Subscription process results arrive to listener which should adopt to  
 PNObjectEventListener protocol and registered using:  
 */  
[self.client addListener:self];  
[self.client subscribeToPresenceChannels:@[@"my_channel"]];  
  
// New presence event handling.  
- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
  
    if (![event.data.channel isEqualToString:event.data.subscription]) {  
  
        // Presence event has been received on channel group stored in event.data.subscription.  
    }  
    else {  
`
```
show all 31 lines

### Response[​](#response-7)

```
`@interface PNSubscriberData : PNServiceData  
  
// Name of channel for which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
// Name of channel or channel group (in case if not equal to channel).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
// Time at which event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
// Stores reference on metadata information which has been passed along with received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
  
@interface PNSubscribeStatus : PNErrorStatus  
  
`
```
show all 65 lines

## Presence Unsubscribe[​](#presence-unsubscribe)

This function lets you stop monitoring the presence of the `channel`(s). The channel(s) will be removed and the socket remains open until there are no more channels remaining in the list.

### Method(s)[​](#methods-11)

To `Unsubscribe from Presence of a channel` you can use the following method(s) in the Objective-C SDK:

```
`- (void)unsubscribeFromPresenceChannels:(NSArrayNSString *> *)channels;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of `channel` IDs for which client should try to `unsubscribe` from presence observing `channels`

### Basic Usage[​](#basic-usage-11)

Unsubscribe from the presence channel:

```
`[self.client unsubscribeFromChannelGroups:@[@"developers"] withPresence:YES];  
`
```

### Response[​](#response-8)

```
`@interface PNSubscriberData : PNServiceData**  
// Name of channel for which subscriber received data.  
@property (nonatomic, readonly, strong) NSString *channel;  
// Name of channel or channel group (in case if not equal to channel).  
@property (nonatomic, nullable, readonly, strong) NSString *subscription;  
// Time at which event arrived.  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
// Stores reference on metadata information which has been passed along with received event.  
@property (nonatomic, nullable, readonly, strong) NSDictionaryNSString *, id> *userMetadata;  
  
@end  
  
@interface PNSubscribeStatus : PNErrorStatus  
  
`
```
show all 28 linesLast updated on Jun 16, 2025**