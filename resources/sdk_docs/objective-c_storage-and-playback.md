# Message Persistence API for Objective-C SDK

Message Persistence provides access to stored message history (timestamped to 10ns). Storage duration is controlled by your account retention (1 day → Unlimited). Stored messages can be AES-256 encrypted (see Message Persistence docs).

Supports retrieving:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history[​](#fetch-history)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Fetch historical messages for one or more channels. Use `includeMessageActions` to include actions.

**Time range behavior**
- `start` only: messages older than `start` (start is **exclusive**).
- `end` only: messages at/after `end` (end is **inclusive**).
- `start` + `end`: messages between them (end **inclusive**).

**Limits**
- Single channel: up to 100 messages.
- Multi-channel (up to 500 channels): up to 25 messages/channel.
- With `includeMessageActions`: 25 max and **only one channel allowed**.
If more messages match, page by making iterative calls and adjusting `start` timetoken.

### Method(s)[​](#methods)

Use the following method(s) in the Objective-C SDK:

```
`1history()  
2    .channels(NSArray *)  
3    .start(NSNumber *)  
4    .end(NSNumber *)  
5    .limit(NSUInteger)  
6    .reverse(BOOL)  
7    .includeMetadata(BOOL)  
8    .includeMessageType(BOOL)  
9    .includeCustomMessageType(BOOL)  
10    .includeUUID(BOOL)  
11    .includeMessageActions(BOOL)  
12    .includeTimeToken(BOOL)  
13    .performWithCompletion(PNHistoryCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSStringList of channels to fetch history messages from (up to 500).`start`Type: NSNumberTimetoken delimiting the start (exclusive) of the time slice.`end`Type: NSNumberTimetoken delimiting the end (inclusive) of the time slice.`limit`Type: NSUIntegerNumber of historical messages to return per channel. Default and maximum are 100 (single), 25 (multi), and 25 with `includeMessageActions`.`reverse`Type: BOOLWhether to traverse from oldest to newest.`includeMetadata`Type: BOOLWhether to include metadata in the response.`includeMessageType`Type: BOOLWhether to include message type. Default is `YES`.`includeCustomMessageType`Type: BOOLWhether to include custom message type. Default is `YES`. See [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeUUID`Type: BOOLWhether to include the publisher uuid. Default is `YES`.`includeMessageActions`Type: BOOLWhether to include message actions in the response. If `YES`, only one channel is allowed.`includeTimeToken`Type: BOOLWhether to include event timetokens in the response.`block` *Type: PNHistoryCompletionBlockHistory completion block.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `limit`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Sample code[​](#sample-code)

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Basic configuration  
5PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
6                                                          subscribeKey:@"demo"  
7                                                                userID:@"historyUser"];  
8
  
9// Create a PubNub client instance  
10PubNub *client = [PubNub clientWithConfiguration:config];  
11
  
12// Add listener for PubNub events  
13[client addListener:self];  
14
  
15// Publish sample messages for history demo  
16NSLog(@"Publishing sample messages for history demo...");  
17
  
18// Publish several messages with different content and metadata  
19NSArray *messages = @[  
20    @{@"text": @"First message", @"id": @1},  
21    @{@"text": @"Second message", @"id": @2},  
22    @{@"text": @"Third message", @"id": @3},  
23    @{@"text": @"Fourth message", @"id": @4},  
24    @{@"text": @"Fifth message", @"id": @5}  
25];  
26
  
27// Define metadata for the messages  
28NSArray *metadata = @[  
29    @{@"type": @"text", @"importance": @"low"},  
30    @{@"type": @"text", @"importance": @"medium"},  
31    @{@"type": @"text", @"importance": @"high"},  
32    @{@"type": @"text", @"importance": @"medium"},  
33    @{@"type": @"text", @"importance": @"low"}  
34];  
35
  
36// Publish messages to a history demo channel  
37for (NSUInteger i = 0; i  messages.count; i++) {  
38    PNPublishRequest *request = [PNPublishRequest requestWithChannel:@"history-demo"];  
39    request.message = messages[i];  
40    request.metadata = metadata[i];  
41
  
42    [client publishWithRequest:request withCompletion:^(PNPublishStatus *status) {  
43        if (!status.isError) {  
44            NSLog(@"✅ Published message %lu for history demo", (unsigned long)(i + 1));  
45        } else {  
46            NSLog(@"❌ Failed to publish message %lu: %@", (unsigned long)(i + 1),   
47                 status.errorData.information);  
48        }  
49    }];  
50}  
51
  
52// Publish messages to a second channel for multi-channel history demo  
53for (NSUInteger i = 0; i  3; i++) {  
54    PNPublishRequest *request = [PNPublishRequest requestWithChannel:@"history-demo-2"];  
55    request.message = @{@"text": [NSString stringWithFormat:@"Channel 2 - Message %lu", (unsigned long)(i + 1)]};  
56
  
57    [client publishWithRequest:request withCompletion:^(PNPublishStatus *status) {  
58        if (!status.isError) {  
59            NSLog(@"✅ Published message to second channel for history demo");  
60        }  
61    }];  
62}  
63
  
64// Example 1: Basic history fetch with limit  
65NSLog(@"Fetching basic history...");  
66
  
67PNHistoryFetchRequest *basicRequest = [PNHistoryFetchRequest requestWithChannels:@[@"history-demo"]];  
68basicRequest.limit = 3;  
69
  
70[client fetchHistoryWithRequest:basicRequest completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
71    if (!status.isError) {  
72        NSLog(@"✅ Basic history fetch successful!");  
73        NSLog(@"Messages: %@", result.data.messages);  
74    } else {  
75        NSLog(@"❌ Error fetching basic history: %@", status.errorData.information);  
76    }  
77}];  
78
  
79// Example 2: History fetch with timeframe  
80NSLog(@"Fetching history with timeframe...");  
81
  
82PNHistoryFetchRequest *timeframeRequest = [PNHistoryFetchRequest requestWithChannels:@[@"history-demo"]];  
83timeframeRequest.start = @(17457898826964534);  // Example start time  
84timeframeRequest.end = @(17457898826964534);    // Example end time  
85
  
86[client fetchHistoryWithRequest:timeframeRequest completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
87    if (!status.isError) {  
88        NSLog(@"✅ History fetch with timeframe successful!");  
89        NSLog(@"Messages: %@", result.data.messages);  
90    } else {  
91        NSLog(@"❌ Error fetching history with timeframe: %@", status.errorData.information);  
92    }  
93}];  
94
  
95// Example 3: History fetch with metadata  
96NSLog(@"Fetching history with metadata...");  
97
  
98PNHistoryFetchRequest *metadataRequest = [PNHistoryFetchRequest requestWithChannels:@[@"history-demo"]];  
99metadataRequest.includeMetadata = YES;  
100
  
101[client fetchHistoryWithRequest:metadataRequest completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
102    if (!status.isError) {  
103        NSLog(@"✅ History fetch with metadata successful!");  
104        NSLog(@"Messages with metadata: %@", result.data.messages);  
105    } else {  
106        NSLog(@"❌ Error fetching history with metadata: %@", status.errorData.information);  
107    }  
108}];  
109
  
110// Example 4: History fetch with message actions  
111NSLog(@"Fetching history with message actions...");  
112
  
113PNHistoryFetchRequest *actionsRequest = [PNHistoryFetchRequest requestWithChannels:@[@"history-demo"]];  
114actionsRequest.includeMessageActions = YES;  
115
  
116[client fetchHistoryWithRequest:actionsRequest completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
117    if (!status.isError) {  
118        NSLog(@"✅ History fetch with message actions successful!");  
119        NSLog(@"Messages with actions: %@", result.data.messages);  
120    } else {  
121        NSLog(@"❌ Error fetching history with message actions: %@", status.errorData.information);  
122    }  
123}];  
124
  
125// Example 5: History fetch from multiple channels  
126NSLog(@"Fetching history from multiple channels...");  
127
  
128PNHistoryFetchRequest *multiChannelRequest = [PNHistoryFetchRequest requestWithChannels:@[@"history-demo", @"history-demo-2"]];  
129multiChannelRequest.limit = 2;  // Limit per channel  
130
  
131[client fetchHistoryWithRequest:multiChannelRequest completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
132    if (!status.isError) {  
133        NSLog(@"✅ Multi-channel history fetch successful!");  
134        [result.data.channels enumerateKeysAndObjectsUsingBlock:^(NSString *channel, NSDictionary *messages, BOOL *stop) {  
135            NSLog(@"Messages from %@: %@", channel , messages);  
136        }];  
137    } else {  
138        NSLog(@"❌ Error fetching multi-channel history: %@", status.errorData.information);  
139    }  
140}];  
141
  
142// Required PNEventsListener methods  
143- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
144    // Checking connectivity only using subscribe operation.  
145    if (status.operation != PNSubscribeOperation) return;  
146      
147    if (status.category == PNConnectedCategory) {  
148        NSLog(@"✅ Successfully connected to PubNub!");  
149    } else if (status.isError) {  
150        NSLog(@"❌ PubNub connection error: %@", status);  
151    }  
152}  
153
  
154- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
155    NSLog(@"Received message: %@ on channel: %@", message.data.message, message.data.channel);  
156}  

```
show all 156 lines

### Response[​](#response)

Response objects which is returned by client when `fetch messages` Message Persistence API is used:

```
1@interface PNHistoryData : PNServiceData  
2
  
3/**  
4 * Channel history messages.  
5 *  
6 * Set only for PNHistoryOperation operation and will be empty array for other operation types.  
7 */  
8@property (nonatomic, readonly, strong) NSArray *messages;  
9
  
10/**  
11 * Channels history.  
12 *  
13 * Each key represent name of channel for which messages has been received and values is list of  
14 * messages from channel's storage.  
15 *  
16 * For PNHistoryOperation operation this property always will be empty dictionary.  
17 */  
18@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSArray *> *channels;  
19
  
20/**  
21 * Fetched history time frame start time.  
22 *  
23 * Set only for PNHistoryOperation operation and will be 0 for other operation types.  
24 */  
25@property (nonatomic, readonly, strong) NSNumber *start;  
26
  
27/**  
28 * Fetched history time frame end time.  
29 *  
30 * Set only for PNHistoryOperation operation and will be 0 for other operation types.  
31 */  
32@property (nonatomic, readonly, strong) NSNumber *end;  
33
  
34@end  
35
  
36@interface PNHistoryResult : PNResult  
37
  
38// Fetch history request processed information.  
39@property (nonatomic, readonly, strong) PNHistoryData *data;  
40
  
41@end  

```
show all 41 lines

Error response which is used in case of Message Persistence API call failure:

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
show all 16 lines

### Other examples[​](#other-examples)

#### Fetch messages with metadata[​](#fetch-messages-with-metadata)

```
`1self.client.history()  
2    .channel(@"storage")  
3    .includeMetadata(YES)  
4    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
5        if (!status.isError) {  
6            /**  
7            * Fetched data available here:  
8            *   result.data.channels - dictionary with single key (name of requested channel) and  
9            *       list of dictionaries as value. Each entry will include two keys: "message" - for  
10            *       body and "metadata" for meta which has been added during message publish.  
11            */  
12        } else {  
13            /**  
14            * Handle message history download error. Check 'category' property to find out possible  
15            * issue because of which request did fail.  
16            *  
17            * Request can be resent using: [status retry];  
18            */  
19        }  
20    });  
`
```
show all 20 lines

#### Fetch messages with actions[​](#fetch-messages-with-actions)

```
`1self.client.history()  
2    .channel(@"chat")  
3    .includeMessageActions(YES)  
4    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
5        if (!status.isError) {  
6            /**  
7            * Fetched data available here:  
8            *   result.data.channels - dictionary with single key (name of requested channel) and  
9            *       list of dictionaries. Each entry will include two keys: "message" - for body and  
10            *       "actions" for list of added actions.  
11            */  
12        } else {  
13            /**  
14            * Handle message history download error. Check 'category' property to find out possible  
15            * issue because of which request did fail.  
16            *  
17            * Request can be resent using: [status retry];  
18            */  
19        }  
20    });  
`
```
show all 20 lines

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions)

```
`1self.client.history()  
2    .channel(@"chat")  
3    .includeMetadata(YES)  
4    .includeMessageActions(YES)  
5    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
6        if (!status.isError) {  
7            /**  
8            * Fetched data available here:  
9            *   result.data.channels - dictionary with single key (name of requested channel) and  
10            *       list of dictionaries. Each entry will include three keys: "message" - for body,  
11            *       "metadata" for meta which has been added during message publish and "actions"  
12            *       for list of added actions.  
13            */  
14        } else {  
15            /**  
16            * Handle message history download error. Check 'category' property to find out possible  
17            * issue because of which request did fail.  
18            *  
19            * Request can be resent using: [status retry];  
20            */  
21        }  
22    });  
`
```
show all 22 lines

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove messages from a channel’s history.

##### Required setting
Enable **Delete-From-History** for your key in the Admin Portal and initialize the SDK with a **secret key**.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Objective-C SDK.

```
`1- (void)deleteMessagesFromChannel:(NSString *)channel   
2                            start:(nullable NSNumber *)startDate   
3                              end:(nullable NSNumber *)endDate   
4                   withCompletion:(nullable PNMessageDeleteCompletionBlock)block;  
`
```

### Sample code[​](#sample-code-1)

```
1[self.client deleteMessagesFromChannel:@"channel" start:@15101397027611671 end:@15101397427611671  
2                        withCompletion:^(PNAcknowledgmentStatus *status) {  
3
  
4    if (!status.isError) {  
5        // Messages within specified time frame has been removed.  
6    } else {  
7       /**  
8        * Handle message history download error. Check 'category' property to find out possible  
9        * issue because of which request did fail.  
10        *  
11        * Request can be resent using: [status retry];  
12        */  
13    }  
14}];  

```

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete one message: set `end` to the **publish timetoken**, and `start` to `timetoken - 1`.

```
1[self.client deleteMessagesFromChannel:@"channel" start:@15526611838554309 end:@15526611838554310  
2                        withCompletion:^(PNAcknowledgmentStatus *status) {  
3
  
4    if (!status.isError) {  
5        // Messages within specified time frame has been removed.  
6    } else {  
7        /**  
8        * Handle message history download error. Check 'category' property to find out possible  
9        * issue because of which request did fail.  
10        *  
11        * Request can be resent using: [status retry];  
12        */  
13    }  
14}];  

```

## Delete messages from history (builder pattern)[​](#delete-messages-from-history-builder-pattern)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove messages from a channel’s history.

##### Required setting
Enable **Delete-From-History** for your key in the Admin Portal and initialize the SDK with a **secret key**.

### Method(s)[​](#methods-2)

To `Delete Messages from History` you can use the following method(s) in the Objective-C SDK.

```
`1deleteMessage()  
2    .channel(NSString *)  
3    .start(NSNumber *)  
4    .end(NSNumber *)  
5    .performWithCompletion(PNAcknowledgmentStatus *);  
`
```

### Sample code[​](#sample-code-2)

```
1self.client.deleteMessage()  
2    .channel(@"channel")  
3    .start(@15101397027611671)  
4    .end(@15101397427611671)  
5    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
6
  
7    if (!status.isError) {  
8        // Messages within specified time frame has been removed.  
9    } else {  
10       /**  
11        * Handle message history download error. Check 'category' property to find out possible  
12        * issue because of which request did fail.  
13        *  
14        * Request can be resent using: [status retry];  
15        */  
16    }  
17});  

```
show all 17 lines

## Message counts[​](#message-counts)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Returns the number of messages published since the given time (messages with timetoken **>=** the provided `timetokens` value).

##### Unlimited message retention
Only the last 30 days are counted.

### Method(s)[​](#methods-3)

You can use the following method(s) in the Objective-C SDK:

```
`1messageCounts()  
2    .channels(NSArrayNSString *> *)  
3    .timetokens(NSArrayNSNumber *> *)  
4    .performWithCompletion(PNMessageCountCompletionBlock);  
`
```

*  requiredParameterDescription`channels` *Type: NSArray`<NSString *>` *Default:  
n/aThe `channels` to fetch the message count`timetokens` *Type: NSArray`<NSNumber *>` *Default:  
n/aList with single or multiple timetokens, where each timetoken position in correspond to target `channel` location in channel names list.`completion` *Type: PNMessageCountCompletionBlockDefault:  
n/aMessages count fetch completion closure which pass two arguments: `result` - in case of successful request processing data field will contain results of message count fetch operation; `status` - in case of error occurred during request processing.

### Sample code[​](#sample-code-3)

```
1self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
2    .timetokens(@[@(15501015683744028)])  
3    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) {  
4
  
5        if (!status.isError) {  
6            // Client state retrieved number of messages for channels.  
7        } else {  
8            /**  
9             Handle client state modification error. Check 'category' property  
10             to find out possible reason because of which request did fail.  
11             Review 'errorData' property (which has PNErrorData data type) of status  
12             object to get additional information about issue.  
13
  
14             Request can be resent using: [status retry]  
15            */  
16        }  
17    });  

```
show all 17 lines

### Returns[​](#returns)

`Channels` with no messages return `0`. Channels with `>= 10,000` messages return `10000`.

```
1@interface PNMessageCountData : PNServiceData  
2
  
3/**  
4 * @brief Dictionary where each key is name of channel and value is number of messages in it.  
5 */  
6@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSNumber *> *channels;  
7
  
8@end  
9
  
10@interface PNMessageCountResult : PNResult  
11
  
12/**  
13 * @brief Message count request processing information.  
14 */  
15@property (nonatomic, readonly, strong) PNMessageCountData *data;  
16
  
17@end  

```
show all 17 lines

### Other examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
1self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
2    .timetokens(@[@(15501015683744028), @(15501015683744130)])  
3    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) {  
4
  
5        if (!status.isError) {  
6            // Client state retrieved number of messages for channels.  
7        } else {  
8            /**  
9                Handle client state modification error. Check 'category' property  
10                to find out possible reason because of which request did fail.  
11                Review 'errorData' property (which has PNErrorData data type) of status  
12                object to get additional information about issue.  
13
  
14                Request can be resent using: [status retry]  
15            */  
16        }  
17    });  

```
show all 17 lines

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

##### Alternative method
Deprecated; use [fetch history](#fetch-history).

Same start/end semantics and 100-message max; use paging with iterative calls adjusting `start`.

### Method(s)[​](#methods-4)

To run `History` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)historyForChannel:(NSString *)channel   
2           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`block` *Type: PNHistoryCompletionBlock`History` pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of `history` request operation; status - in case if error occurred during request processing.

```
`1- (void)historyForChannel:(NSString *)channel   
2             withMetadata:(BOOL)shouldIncludeMetadata   
3               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2       withMessageActions:(BOOL)shouldIncludeMessageActions   
3               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2             withMetadata:(BOOL)shouldIncludeMetadata   
3           messageActions:(BOOL)shouldIncludeMessageActions   
4               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for the oldest event (exclusive) to start pulling messages from.`endDate`Type: NSNumberReference on timetoken for the latest event (inclusive) to stop pulling messages at.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

```
`1- (void)historyForChannel:(NSString *)channel   
2             withMetadata:(BOOL)shouldIncludeMetadata   
3           messageActions:(BOOL)shouldIncludeMessageActions   
4               completion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4          includeMetadata:(BOOL)shouldIncludeMetadata   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberTimetoken for oldest event starting from which next should be returned events. Value will be converted to required precision internally.`endDate`Type: NSNumberTimetoken for latest event till which events should be pulled out. Value will be converted to required precision internally.`shouldIncludeMetadata` *Type: BOOLWhether event metadata should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4    includeMessageActions:(BOOL)shouldIncludeMessageActions   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberTimetoken for oldest event starting from which next should be returned events. Value will be converted to required precision internally.`endDate`Type: NSNumberTimetoken for latest event till which events should be pulled out. Value will be converted to required precision internally.`shouldIncludeMessageActions` *Type: BOOLWhether event actions should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull completion `block`.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for the oldest event (exclusive) to start pulling messages from.`endDate`Type: NSNumberReference on timetoken for the latest event (inclusive) to stop pulling messages at.`limit` *Type: NSUIntegerMaximum number of events to return (not more than 100).`shouldReverseOrder` *Type: BoolWhether to reverse the order (oldest to newest).`shouldIncludeTimeToken` *Type: BoolWhether to include timetokens in the response.`block` *Type: PNHistoryCompletionBlockHistory pull completion block.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4         includeTimeToken:(BOOL)shouldIncludeTimeToken   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for the oldest event (exclusive) to start pulling messages from.`endDate`Type: NSNumberReference on timetoken for the latest event (inclusive) to stop pulling messages at.`shouldIncludeTimeToken` *Type: BoolWhether to include timetokens in the response.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: 
- result - in case of successful request processing data field will contain results of history request operation;
- status - in case if error occurred during request processing.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5         includeTimeToken:(BOOL)shouldIncludeTimeToken   
6           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldIncludeTimeToken` *Type: BoolWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5                  reverse:(BOOL)shouldReverseOrder   
6           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldReverseOrder` *Type: BoolWhether events order in response should be reversed or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: 
- result - in case of successful request processing data field will contain results of history request operation;
- status - in case if error occurred during request processing.

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5                  reverse:(BOOL)shouldReverseOrder   
6         includeTimeToken:(BOOL)shouldIncludeTimeToken   
7           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSString`Channel` name to retrieve the History information.`startDate`Type: NSNumberReference on timetoken for oldest event starting from which next should be returned events.`endDate`Type: NSNumberReference on timetoken for latest event till which events should be pulled out.`limit` *Type: NSUIntegerMaximum number of events which should be returned in response (not more then 100).`shouldReverseOrder` *Type: BoolWhether events order in response should be reversed or not.`shouldIncludeTimeToken` *Type: BoolWhether event dates (timetokens) should be included in response or not.`block` *Type: PNHistoryCompletionBlockHistory pull processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of history request operation; status - in case if error occurred during request processing.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `limit`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Sample code[​](#sample-code-4)

Retrieve the last 100 messages on a channel:

```
1[self.client historyForChannel: @"my_channel" start:nil end:nil limit:100  
2                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        /**  
7         Handle downloaded history using:  
8            result.data.start - oldest message time stamp in response  
9            result.data.end - newest message time stamp in response  
10            result.data.messages - list of messages  
11         */  
12    }  
13    else {  
14
  
15        /**  
16         Handle message history download error. Check 'category' property  
17         to find out possible reason because of which request did fail.  
18         Review 'errorData' property (which has PNErrorData data type) of status  
19         object to get additional information about issue.  
20
  
21         Request can be resent using: [status retry];  
22         */  
23    }  
24}];  

```
show all 24 lines

### Response[​](#response-1)

The response object which is returned by the client when the history API is used:

```
1@interface PNHistoryData : PNServiceData  
2
  
3// Channel history messages.  
4@property (nonatomic, readonly, strong) NSArray *messages;  
5// History time frame start time.  
6@property (nonatomic, readonly, strong) NSNumber *start;  
7// History time frame end time.  
8@property (nonatomic, readonly, strong) NSNumber *end;  
9
  
10@end  
11
  
12@interface PNHistoryResult : PNResult  
13
  
14// Stores reference on channel history request processing information.  
15@property (nonatomic, readonly, strong) PNHistoryData *data;  
16
  
17@end  

```
show all 17 lines

### Other examples[​](#other-examples-3)

#### Use historyForChannel to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-historyforchannel-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
1[self.client historyForChannel:@"my_channel" start:nil end:nil limit:3 reverse:YES  
2                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        /**  
7            Handle downloaded history using:  
8            result.data.start - oldest message time stamp in response  
9            result.data.end - newest message time stamp in response  
10            result.data.messages - list of messages  
11            */  
12    }  
13    else {  
14
  
15        /**  
16            Handle message history download error. Check 'category' property  
17            to find out possible reason because of which request did fail.  
18            Review 'errorData' property (which has PNErrorData data type) of status  
19            object to get additional information about issue.  
20
  
21            Request can be resent using: [status retry];  
22            */  
23    }  
24}];  

```
show all 24 lines

##### Response[​](#response-2)

```
`1[  
2    ["Pub1","Pub2","Pub3"],  
3    13406746729185766,  
4    13406746780720711  
5]  
`
```

#### Use historyForChannel to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-historyforchannel-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
1[self.client historyForChannel:@"my_channel" start:@(13406746780720711) end:nil limit:100  
2                        reverse:YES withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        /**  
7            Handle downloaded history using:  
8            result.data.start - oldest message time stamp in response  
9            result.data.end - newest message time stamp in response  
10            result.data.messages - list of messages  
11            */  
12    }  
13    else {  
14
  
15        /**  
16            Handle message history download error. Check 'category' property  
17            to find out possible reason because of which request did fail.  
18            Review 'errorData' property (which has PNErrorData data type) of status  
19            object to get additional information about issue.  
20
  
21            Request can be resent using: [status retry];  
22            */  
23    }  
24}];  

```
show all 24 lines

##### Response[​](#response-3)

```
`1[  
2    ["Pub3","Pub4","Pub5"],  
3    13406746780720711,  
4    13406746845892666  
5]  
`
```

#### Use historyForChannel to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-historyforchannel-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
1[self.client historyForChannel:@"my_channel" start:nil end:@(13406746780720711) limit:100  
2                includeTimeToken:NO withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        /**  
7            Handle downloaded history using:  
8            result.data.start - oldest message time stamp in response  
9            result.data.end - newest message time stamp in response  
10            result.data.messages - list of messages  
11            */  
12    }  
13    else {  
14
  
15        /**  
16            Handle message history download error. Check 'category' property  
17            to find out possible reason because of which request did fail.  
18            Review 'errorData' property (which has PNErrorData data type) of status  
19            object to get additional information about issue.  
20
  
21            Request can be resent using: [status retry];  
22            */  
23    }  
24}];  

```
show all 24 lines

##### Response[​](#response-4)

```
`1[  
2    ["Pub3","Pub4","Pub5"],  
3    13406746780720711,  
4    13406746845892666  
5]  
`
```

#### History paging example[​](#history-paging-example)

##### Usage

You can call the method by passing 0 or a valid **timetoken** as the argument.

```
1// Pull out all messages newer than message sent at 14395051270438477.  
2[self historyFromStartDate:@(14395051270438477) onChannel:@"history_channel"  
3        withCompletionBlock:^(NSArray *messages) {  
4
  
5    NSLog(@"Messages from history: %@", messages);  
6}];  
7
  
8- (void)historyNewerThan:(NSNumber *)beginTime onChannel:(NSString *)channelName  
9        withCompletionBlock:(void (^)(NSArray *messages))block {  
10
  
11    NSMutableArray *msgs = [NSMutableArray new];  
12    [self historyFromStartDate:beginTime onChannel:channelName  
13                    withProgress:^(NSArray *objects) {  
14
  
15        [msgs addObjectsFromArray:objects];  
16        if (objects.count  100) { block(msgs); }  
17    }];  
18}  
19
  
20- (void)historyFromStartDate:(NSNumber *)beginTime onChannel:(NSString *)channelName  
21                withProgress:(void (^)(NSArray *objects))block {  
22
  
23    __weak __typeof(self) weakSelf = self;  
24    [self.client historyForChannel:channelName start:beginTime end:nil limit:100  
25                            reverse:NO includeTimeToken:YES  
26                    withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
27
  
28        __strong __typeof__(weakSelf) strongSelf = weakSelf;  
29        if (!status) {  
30
  
31            block(result.data.messages);  
32            if ([result.data.messages count] == 100) {  
33
  
34                [strongSelf historyFromStartDate:result.data.start onChannel:channelName  
35                                    withProgress:block];  
36            }  
37        }  
38        else {  
39
  
40            /**  
41                Handle message history download error. Check the 'category' property  
42                to find out why the request failed.  
43                Review the 'errorData' property (of type PNErrorData) of the status  
44                object to get additional information about the issue.  
45
  
46                Request can be resent using: [status retry];  
47            */  
48        }  
49    }];  
50}  

```
show all 50 lines

#### Fetch messages with metadata[​](#fetch-messages-with-metadata-1)

```
1[self.client historyForChannel:@"storage" withMetadata:YES  
2                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status.isError) {  
5        /**  
6        * Fetched data available here:  
7        *   result.data.channels - dictionary with single key (name of requested channel) and  
8        *       list of dictionaries as value. Each entry will include two keys: "message" - for  
9        *       body and "metadata" for meta which has been added during message publish.  
10        */  
11    } else {  
12        /**  
13        * Handle message history download error. Check 'category' property to find out possible  
14        * issue because of which request did fail.  
15        *  
16        * Request can be resent using: [status retry];  
17        */  
18    }  
19}];  

```
show all 19 lines

#### Fetch messages with actions[​](#fetch-messages-with-actions-1)

```
1[self.client historyForChannel:@"chat" withMessageActions:YES  
2                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
  
4    if (!status.isError) {  
5        /**  
6        * Fetched data available here:  
7        *   result.data.channels - dictionary with single key (name of requested channel) and  
8        *       list of dictionaries. Each entry will include two keys: "message" - for body and  
9        *       "actions" for list of added actions.  
10        */  
11    } else {  
12        /**  
13        * Handle message history download error. Check 'category' property to find out possible  
14        * issue because of which request did fail.  
15        *  
16        * Request can be resent using: [status retry];  
17        */  
18    }  
19}];  

```
show all 19 lines

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions-1)

```
1[self.client historyForChannel:@"chat" withMetadata:YES messageActions:YES  
2                    completion:^(PNHistoryResult *result, PNErrorStatus *status) {  
3
**4    if (!status.isError) {  
5        /**  
6        * Fetched data available here:  
7        *   result.data.channels - dictionary with single key (name of requested channel) and  
8        *       list of dictionaries. Each entry will include three keys: "message" - for body,  
9        *       "metadata" for meta which has been added during message publish and "actions"  
10        *       for list of added actions.  
11        */  
12    } else {  
13        /**  
14        * Handle message history download error. Check 'category' property to find out possible  
15        * issue because of which request did fail.  
16        *  
17        * Request can be resent using: [status retry];  
18        */  
19    }  
20}];  

```
show all 20 linesLast updated on Sep 3, 2025**