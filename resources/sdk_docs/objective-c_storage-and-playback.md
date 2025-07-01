On this page
# Message Persistence API for Objective-C SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/objective-c/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To fetch messages, use the following method(s) in the Objective-C SDK. This method uses the builder pattern; you can omit any optional arguments.

```
`history()  
    .channels(NSArray *)  
    .start(NSNumber *)  
    .end(NSNumber *)  
    .limit(NSUInteger)  
    .reverse(BOOL)  
    .includeMetadata(BOOL)  
    .includeMessageType(BOOL)  
    .includeCustomMessageType(BOOL)  
    .includeUUID(BOOL)  
    .includeMessageActions(BOOL)  
    .includeTimeToken(BOOL)  
    .performWithCompletion(PNHistoryCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSStringList of `channels` for which history should be returned. Maximum of 500 channels are allowed.`start`Type: NSNumberTimetoken for oldest event starting from which next should be returned events. Value will be converted to required precision internally.`end`Type: NSNumberTimetoken for latest event till which events should be pulled out. Value will be converted to required precision internally.`limit`Type: NSUIntegerSpecifies the number of historical messages to return per channel. Maximum value is 100 for a single channel, or 25 for multiple channels. If `includeMessageActions` is `true`, then `25` is the default (and maximum) value.`reverse`Type: BOOLSetting to `YES` traverses the time line in reverse, starting with the oldest message first.`includeMetadata`Type: BOOLWhether event metadata should be included in response or not.`includeMessageType`Type: BOOLIndicates whether to retrieve messages with PubNub message type. Default is `YES`.   
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeCustomMessageType`Type: BOOLIndicates whether to retrieve messages with the custom message type. Default is `YES`.   
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeUUID`Type: BOOLPass `YES` to receive the publisher uuid with each history message. Default is `YES`.`includeMessageActions`Type: BOOLWhether event actions should be included in response or not. When `YES`, throws an exception if you call the method with more than one `channel`.`includeTimeToken`Type: BOOLWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `limit`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"historyUser"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Add listener for PubNub events  
[client addListener:self];  
  
// Publish sample messages for history demo  
`
```
show all 156 lines

### Response[​](#response)

Response objects which is returned by client when `fetch messages` Message Persistence API is used:

```
`@interface PNHistoryData : PNServiceData  
  
/**  
 * Channel history messages.  
 *  
 * Set only for PNHistoryOperation operation and will be empty array for other operation types.  
 */  
@property (nonatomic, readonly, strong) NSArray *messages;  
  
/**  
 * Channels history.  
 *  
 * Each key represent name of channel for which messages has been received and values is list of  
 * messages from channel's storage.  
 *  
`
```
show all 41 lines

Error response which is used in case of Message Persistence API call failure:

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

### Other Examples[​](#other-examples)

#### Fetch messages with metadata[​](#fetch-messages-with-metadata)

```
`self.client.history()  
    .channel(@"storage")  
    .includeMetadata(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
            * Fetched data available here:  
            *   result.data.channels - dictionary with single key (name of requested channel) and  
            *       list of dictionaries as value. Each entry will include two keys: "message" - for  
            *       body and "metadata" for meta which has been added during message publish.  
            */  
        } else {  
            /**  
            * Handle message history download error. Check 'category' property to find out possible  
            * issue because of which request did fail.  
`
```
show all 20 lines

#### Fetch messages with actions[​](#fetch-messages-with-actions)

```
`self.client.history()  
    .channel(@"chat")  
    .includeMessageActions(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
            * Fetched data available here:  
            *   result.data.channels - dictionary with single key (name of requested channel) and  
            *       list of dictionaries. Each entry will include two keys: "message" - for body and  
            *       "actions" for list of added actions.  
            */  
        } else {  
            /**  
            * Handle message history download error. Check 'category' property to find out possible  
            * issue because of which request did fail.  
`
```
show all 20 lines

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions)

```
`self.client.history()  
    .channel(@"chat")  
    .includeMetadata(YES)  
    .includeMessageActions(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
            * Fetched data available here:  
            *   result.data.channels - dictionary with single key (name of requested channel) and  
            *       list of dictionaries. Each entry will include three keys: "message" - for body,  
            *       "metadata" for meta which has been added during message publish and "actions"  
            *       for list of added actions.  
            */  
        } else {  
            /**  
`
```
show all 22 lines

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Objective-C SDK.

```
`- (void)deleteMessagesFromChannel:(NSString *)channel   
                            start:(nullable NSNumber *)startDate   
                              end:(nullable NSNumber *)endDate   
                   withCompletion:(nullable PNMessageDeleteCompletionBlock)block;  
`
```

### Basic Usage[​](#basic-usage-1)

```
`[self.client deleteMessagesFromChannel:@"channel" start:@15101397027611671 end:@15101397427611671  
                        withCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Messages within specified time frame has been removed.  
    } else {  
       /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
        *  
        * Request can be resent using: [status retry];  
        */  
    }  
}];  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. e.g. if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`[self.client deleteMessagesFromChannel:@"channel" start:@15526611838554309 end:@15526611838554310  
                        withCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Messages within specified time frame has been removed.  
    } else {  
        /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
        *  
        * Request can be resent using: [status retry];  
        */  
    }  
}];  
`
```

## Delete Messages from History (Builder Pattern)[​](#delete-messages-from-history-builder-pattern)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-2)

To `Delete Messages from History` you can use the following method(s) in the Objective-C SDK.

```
`deleteMessage()  
    .channel(NSString *)  
    .start(NSNumber *)  
    .end(NSNumber *)  
    .performWithCompletion(PNAcknowledgmentStatus *);  
`
```

### Basic Usage[​](#basic-usage-2)

```
`self.client.deleteMessage()  
    .channel(@"channel")  
    .start(@15101397027611671)  
    .end(@15101397427611671)  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Messages within specified time frame has been removed.  
    } else {  
       /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
        *  
        * Request can be resent using: [status retry];  
        */  
`
```
show all 17 lines

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `timetokens`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-3)

You can use the following method(s) in the Objective-C SDK:

```
`messageCounts()  
    .channels(NSArrayNSString *> *)  
    .timetokens(NSArrayNSNumber *> *)  
    .performWithCompletion(PNMessageCountCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *Default:  
n/aThe `channels` to fetch the message count`timetokens` *Type: NSArray`<NSNumber *>` *Default:  
n/aList with single or multiple timetokens, where each timetoken position in correspond to target `channel` location in channel names list.`completion` *Type: PNMessageCountCompletionBlockDefault:  
n/aMessages count fetch completion closure which pass two arguments: `result` - in case of successful request processing data field will contain results of message count fetch operation; `status` - in case of error occurred during request processing.

### Basic Usage[​](#basic-usage-3)

```
`self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
    .timetokens(@[@(15501015683744028)])  
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) {  
  
        if (!status.isError) {  
            // Client state retrieved number of messages for channels.  
        } else {  
            /**  
             Handle client state modification error. Check 'category' property  
             to find out possible reason because of which request did fail.  
             Review 'errorData' property (which has PNErrorData data type) of status  
             object to get additional information about issue.  
  
             Request can be resent using: [status retry]  
            */  
`
```
show all 17 lines

### Returns[​](#returns)

##### Note

`Channels` without messages have a count of 0. `Channels` with 10,000 messages or more have a count of 10000.

```
`@interface PNMessageCountData : PNServiceData  
  
/**  
 * @brief Dictionary where each key is name of channel and value is number of messages in it.  
 */  
@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSNumber *> *channels;  
  
@end  
  
@interface PNMessageCountResult : PNResult  
  
/**  
 * @brief Message count request processing information.  
 */  
@property (nonatomic, readonly, strong) PNMessageCountData *data;  
`
```
show all 17 lines

### Other Examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
    .timetokens(@[@(15501015683744028), @(15501015683744130)])  
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) {  
  
        if (!status.isError) {  
            // Client state retrieved number of messages for channels.  
        } else {  
            /**  
                Handle client state modification error. Check 'category' property  
                to find out possible reason because of which request did fail.  
                Review 'errorData' property (which has PNErrorData data type) of status  
                object to get additional information about issue.  
  
                Request can be resent using: [status retry]  
            */  
`
```
show all 17 lines

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Alternative method

This method is deprecated. Use [fetch history](#fetch-history) instead.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `NO`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `YES`.

- Page through results by providing a `start` OR `end` timetoken.

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `limit` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older** than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-4)

To run `History` you can use the following method(s) in the Objective-C SDK:

```
`- (void)historyForChannel:(NSString *)channel   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`block` *Type: PNHistoryCompletionBlock`History` pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of `history` request operation; status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
             withMetadata:(BOOL)shouldIncludeMetadata   
               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`- (void)historyForChannel:(NSString *)channel   
       withMessageActions:(BOOL)shouldIncludeMessageActions   
               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`- (void)historyForChannel:(NSString *)channel   
             withMetadata:(BOOL)shouldIncludeMetadata   
           messageActions:(BOOL)shouldIncludeMessageActions   
               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
          includeMetadata:(BOOL)shouldIncludeMetadata   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberTimetoken for oldest event starting from which next should be returned events. Value will be converted to required precision internally.`endDate`Type: NSNumberTimetoken for latest event till which events should be pulled out. Value will be converted to required precision internally.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
    includeMessageActions:(BOOL)shouldIncludeMessageActions   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberTimetoken for oldest event starting from which next should be returned events. Value will be converted to required precision internally.`endDate`Type: NSNumberTimetoken for latest event till which events should be pulled out. Value will be converted to required precision internally.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
                    limit:(NSUInteger)limit   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
         includeTimeToken:(BOOL)shouldIncludeTimeToken   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`shouldIncludeTimeToken` *Type: BoolWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: 
- result - in case of successful request processing data field will contain results of history request operation;
- status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
                    limit:(NSUInteger)limit   
         includeTimeToken:(BOOL)shouldIncludeTimeToken   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldIncludeTimeToken` *Type: BoolWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
                    limit:(NSUInteger)limit   
                  reverse:(BOOL)shouldReverseOrder   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldReverseOrder` *Type: BoolWhether events order in response should be reversed or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: 
- result - in case of successful request processing data field will contain results of history request operation;
- status - in case if error occurred during request processing.

```
`- (void)historyForChannel:(NSString *)channel   
                    start:(nullable NSNumber *)startDate   
                      end:(nullable NSNumber *)endDate   
                    limit:(NSUInteger)limit   
                  reverse:(BOOL)shouldReverseOrder   
         includeTimeToken:(BOOL)shouldIncludeTimeToken   
           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldReverseOrder` *Type: BoolWhether events order in response should be reversed or not.`shouldIncludeTimeToken` *Type: BoolWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `limit`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-4)

Retrieve the last 100 messages on a channel:

```
`[self.client historyForChannel: @"my_channel" start:nil end:nil limit:100  
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
         Handle downloaded history using:  
            result.data.start - oldest message time stamp in response  
            result.data.end - newest message time stamp in response  
            result.data.messages - list of messages  
         */  
    }  
    else {  
  
        /**  
`
```
show all 24 lines

### Response[​](#response-1)

The response object which is returned by the client when the history API is used:

```
`@interface PNHistoryData : PNServiceData  
  
// Channel history messages.  
@property (nonatomic, readonly, strong) NSArray *messages;  
// History time frame start time.  
@property (nonatomic, readonly, strong) NSNumber *start;  
// History time frame end time.  
@property (nonatomic, readonly, strong) NSNumber *end;  
  
@end  
  
@interface PNHistoryResult : PNResult  
  
// Stores reference on channel history request processing information.  
@property (nonatomic, readonly, strong) PNHistoryData *data;  
`
```
show all 17 lines

### Other Examples[​](#other-examples-3)

#### Use historyForChannel to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-historyforchannel-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`[self.client historyForChannel:@"my_channel" start:nil end:nil limit:3 reverse:YES  
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
            Handle downloaded history using:  
            result.data.start - oldest message time stamp in response  
            result.data.end - newest message time stamp in response  
            result.data.messages - list of messages  
            */  
    }  
    else {  
  
        /**  
`
```
show all 24 lines

##### Response[​](#response-2)

```
`[  
    ["Pub1","Pub2","Pub3"],  
    13406746729185766,  
    13406746780720711  
]  
`
```

#### Use historyForChannel to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-historyforchannel-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`[self.client historyForChannel:@"my_channel" start:@(13406746780720711) end:nil limit:100  
                        reverse:YES withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
            Handle downloaded history using:  
            result.data.start - oldest message time stamp in response  
            result.data.end - newest message time stamp in response  
            result.data.messages - list of messages  
            */  
    }  
    else {  
  
        /**  
`
```
show all 24 lines

##### Response[​](#response-3)

```
`[  
    ["Pub3","Pub4","Pub5"],  
    13406746780720711,  
    13406746845892666  
]  
`
```

#### Use historyForChannel to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-historyforchannel-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`[self.client historyForChannel:@"my_channel" start:nil end:@(13406746780720711) limit:100  
                includeTimeToken:NO withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
            Handle downloaded history using:  
            result.data.start - oldest message time stamp in response  
            result.data.end - newest message time stamp in response  
            result.data.messages - list of messages  
            */  
    }  
    else {  
  
        /**  
`
```
show all 24 lines

##### Response[​](#response-4)

```
`[  
    ["Pub3","Pub4","Pub5"],  
    13406746780720711,  
    13406746845892666  
]  
`
```

#### History Paging Example[​](#history-paging-example)

##### Usage

You can call the method by passing 0 or a valid **timetoken** as the argument.

```
`// Pull out all messages newer than message sent at 14395051270438477.  
[self historyFromStartDate:@(14395051270438477) onChannel:@"history_channel"  
        withCompletionBlock:^(NSArray *messages) {  
  
    NSLog(@"Messages from history: %@", messages);  
}];  
  
- (void)historyNewerThan:(NSNumber *)beginTime onChannel:(NSString *)channelName  
        withCompletionBlock:(void (^)(NSArray *messages))block {  
  
    NSMutableArray *msgs = [NSMutableArray new];  
    [self historyFromStartDate:beginTime onChannel:channelName  
                    withProgress:^(NSArray *objects) {  
  
        [msgs addObjectsFromArray:objects];  
`
```
show all 50 lines

#### Fetch messages with metadata[​](#fetch-messages-with-metadata-1)

```
`[self.client historyForChannel:@"storage" withMetadata:YES  
                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
        * Fetched data available here:  
        *   result.data.channels - dictionary with single key (name of requested channel) and  
        *       list of dictionaries as value. Each entry will include two keys: "message" - for  
        *       body and "metadata" for meta which has been added during message publish.  
        */  
    } else {  
        /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
        *  
`
```
show all 19 lines

#### Fetch messages with actions[​](#fetch-messages-with-actions-1)

```
`[self.client historyForChannel:@"chat" withMessageActions:YES  
                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
        * Fetched data available here:  
        *   result.data.channels - dictionary with single key (name of requested channel) and  
        *       list of dictionaries. Each entry will include two keys: "message" - for body and  
        *       "actions" for list of added actions.  
        */  
    } else {  
        /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
        *  
`
```
show all 19 lines

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions-1)

```
`[self.client historyForChannel:@"chat" withMetadata:YES messageActions:YES**                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
        * Fetched data available here:  
        *   result.data.channels - dictionary with single key (name of requested channel) and  
        *       list of dictionaries. Each entry will include three keys: "message" - for body,  
        *       "metadata" for meta which has been added during message publish and "actions"  
        *       for list of added actions.  
        */  
    } else {  
        /**  
        * Handle message history download error. Check 'category' property to find out possible  
        * issue because of which request did fail.  
`
```
show all 20 linesLast updated on Jun 10, 2025**