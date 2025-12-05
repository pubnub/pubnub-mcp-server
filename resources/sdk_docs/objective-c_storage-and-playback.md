# Message Persistence API for Objective-C SDK

Message Persistence provides real-time access to stored, timestamped messages (10 ns precision), reactions, and files. Storage is geo-redundant and supports AES-256 encryption. Configure retention (1 day to Unlimited) in the Admin Portal. Requires Message Persistence enabled for your key.

- Retrieve: Messages, message reactions, files (File Sharing API).
- Retention: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

## Fetch history

Requires Message Persistence. Enable in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions. Ordering and range:
- start only: messages older than start (exclusive).
- end only: messages from end (inclusive) and newer.
- start and end: messages between them (inclusive of end).
- Limits: up to 100 messages for a single channel; up to 500 channels, 25 messages per channel; 25 when includeMessageActions is YES. Page with iterative calls by adjusting start.

### Method(s)

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

Parameters:
- channels (NSArray<NSString *>): Up to 500 channels.
- start (NSNumber): Start timetoken (exclusive).
- end (NSNumber): End timetoken (inclusive).
- limit (NSUInteger): Per-channel message count. Default/max: 100 (single), 25 (multi), 25 with includeMessageActions.
- reverse (BOOL): Traversal start when paging beyond limit.
- includeMetadata (BOOL): Include metadata.
- includeMessageType (BOOL): Include message type. Default YES.
- includeCustomMessageType (BOOL): Include custom message type. Default YES.
- includeUUID (BOOL): Include publisher UUID. Default YES.
- includeMessageActions (BOOL): Include actions. Only one channel allowed.
- includeTimeToken (BOOL): Include event timetokens.
- block (PNHistoryCompletionBlock): Completion block.

Tip: Messages are returned in ascending time order. reverse determines which end to start from when more than limit messages match.

### Sample code

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

### Response

Response objects returned by fetch messages:

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

Error response used on failure:

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

### Other examples

#### Fetch messages with metadata

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

#### Fetch messages with actions

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

#### Fetch messages with metadata and actions

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

## Delete messages from history

Requires Message Persistence. Enable Delete-From-History in the Admin Portal and initialize the SDK with a secret key. Removes messages from a specific channel, optionally within a time range.

### Method(s)

```
`1- (void)deleteMessagesFromChannel:(NSString *)channel   
2                            start:(nullable NSNumber *)startDate   
3                              end:(nullable NSNumber *)endDate   
4                   withCompletion:(nullable PNMessageDeleteCompletionBlock)block;  
`
```

- channel (NSString): Channel to delete from.
- start (NSNumber, optional): Start timetoken (exclusive).
- end (NSNumber, optional): End timetoken (inclusive).
- block: Completion block.

### Sample code

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

### Other examples

#### Delete specific message from history

Delete a specific message by passing the publish timetoken as End and timetoken-1 as Start.

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

## Delete messages from history (builder pattern)

Requires Message Persistence. Enable Delete-From-History and use a secret key.

### Method(s)

```
`1deleteMessage()  
2    .channel(NSString *)  
3    .start(NSNumber *)  
4    .end(NSNumber *)  
5    .performWithCompletion(PNAcknowledgmentStatus *);  
`
```

### Sample code

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

## Message counts

Requires Message Persistence. Returns the number of messages published since the given timetoken(s). Only messages from the last 30 days are counted when retention is Unlimited.

### Method(s)

```
`1messageCounts()  
2    .channels(NSArrayNSString *> *)  
3    .timetokens(NSArrayNSNumber *> *)  
4    .performWithCompletion(PNMessageCountCompletionBlock);  
`
```

Parameters:
- channels (NSArray<NSString *>): Channel names.
- timetokens (NSArray<NSNumber *>): One or more timetokens; each position corresponds to the matching channel.
- completion (PNMessageCountCompletionBlock): Returns PNMessageCountResult or PNErrorStatus.

### Sample code

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

### Returns

Note: Channels without messages return 0. Channels with 10,000+ messages return 10000.

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

### Other examples

#### Retrieve count of messages using different timetokens for each channel

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

## History (deprecated)

Requires Message Persistence. Deprecated; use fetch history instead. Retrieves messages from a channel with options to page, limit, and include metadata/time tokens/actions.

Start & End usage:
- start only: older than start (exclusive) up to start.
- end only: end (inclusive) and newer.
- start and end: between them (inclusive of end).
- Max 100 per call; page with start.

### Method(s)

```
`1- (void)historyForChannel:(NSString *)channel   
2           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2             withMetadata:(BOOL)shouldIncludeMetadata   
3               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2       withMessageActions:(BOOL)shouldIncludeMessageActions   
3               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2             withMetadata:(BOOL)shouldIncludeMetadata   
3           messageActions:(BOOL)shouldIncludeMessageActions   
4               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4          includeMetadata:(BOOL)shouldIncludeMetadata   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4    includeMessageActions:(BOOL)shouldIncludeMessageActions   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4         includeTimeToken:(BOOL)shouldIncludeTimeToken   
5           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5         includeTimeToken:(BOOL)shouldIncludeTimeToken   
6           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`1- (void)historyForChannel:(NSString *)channel   
2                    start:(nullable NSNumber *)startDate   
3                      end:(nullable NSNumber *)endDate   
4                    limit:(NSUInteger)limit   
5                  reverse:(BOOL)shouldReverseOrder   
6           withCompletion:(PNHistoryCompletionBlock)block;  
`
```

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

Key parameters across methods:
- channel (NSString): Channel name.
- startDate (NSNumber): Oldest event timetoken (exclusive).
- endDate (NSNumber): Latest event timetoken (inclusive).
- limit (NSUInteger): Max 100.
- reverse (BOOL): Reverse traversal start when paging.
- shouldIncludeTimeToken (BOOL): Include timetokens in response.
- shouldIncludeMetadata (BOOL): Include event metadata.
- shouldIncludeMessageActions (BOOL): Include actions.
- block (PNHistoryCompletionBlock): Completion.

Tip: Messages are always returned ascending; reverse selects which end to start from when paging beyond limit.

### Sample code

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

### Response

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

### Other examples

#### Use historyForChannel to retrieve the three oldest messages by retrieving from the time line in reverse

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

##### Response

```
`1[  
2    ["Pub1","Pub2","Pub3"],  
3    13406746729185766,  
4    13406746780720711  
5]  
`
```

#### Use historyForChannel to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

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

##### Response

```
`1[  
2    ["Pub3","Pub4","Pub5"],  
3    13406746780720711,  
4    13406746845892666  
5]  
`
```

#### Use historyForChannel to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

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

##### Response

```
`1[  
2    ["Pub3","Pub4","Pub5"],  
3    13406746780720711,  
4    13406746845892666  
5]  
`
```

#### History paging example

Usage: Pass 0 or a valid timetoken.

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

#### Fetch messages with metadata

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

#### Fetch messages with actions

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

#### Fetch messages with metadata and actions

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