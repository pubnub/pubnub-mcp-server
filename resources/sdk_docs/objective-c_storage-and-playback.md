# PubNub Objective-C SDK – Storage & Playback (condensed)

Message Persistence stores every published message (AES-256 optional) for 1 day – Unlimited, and lets you:

• Fetch messages / reactions / files  
• Delete stored messages  
• Count messages per channel  
• (Deprecated) use legacy `history` methods  

All code blocks below are unchanged from the original docs.

---

## Fetch History  *(preferred)*

### Builder method

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

Key options (500 channels max):  
• `start` / `end` – nanosecond timetokens (use one or both)  
• `limit` – max 100 (single channel) or 25 (multi-channel)  
• `reverse` – true = oldest→newest  
• `includeMetadata | includeMessageActions | includeUUID | includeTimeToken`  

### Basic usage

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

### Response objects

```
`@interface PNHistoryData : PNServiceData  
  
/** Channel history messages. */  
@property (nonatomic, readonly, strong) NSArray *messages;  
  
/** Channels history (dictionary<channel, messages>). */  
  
`
```

```
`@interface PNErrorData : PNServiceData  
@property (nonatomic, readonly, strong) NSString *information;  
@end  
  
@interface PNErrorStatus : PNStatus  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
`
```

### Extra examples

#### Fetch with metadata

```
`self.client.history()  
    .channel(@"storage")  
    .includeMetadata(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /** result.data.channels -> "message" + "metadata" */  
        }  
    });  
`
```

#### Fetch with actions

```
`self.client.history()  
    .channel(@"chat")  
    .includeMessageActions(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /** "message" + "actions" */  
        }  
    });  
`
```

#### Fetch with metadata + actions

```
`self.client.history()  
    .channel(@"chat")  
    .includeMetadata(YES)  
    .includeMessageActions(YES)  
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /** "message" + "metadata" + "actions" */  
        }  
    });  
`
```

---

## Delete Messages from History

(Message Persistence + “Enable Delete-From-History” + Secret Key)

### Direct method

```
`- (void)deleteMessagesFromChannel:(NSString *)channel   
                            start:(nullable NSNumber *)startDate   
                              end:(nullable NSNumber *)endDate   
                   withCompletion:(nullable PNMessageDeleteCompletionBlock)block;  
`
```

#### Example

```
`[self.client deleteMessagesFromChannel:@"channel" start:@15101397027611671 end:@15101397427611671  
                        withCompletion:^(PNAcknowledgmentStatus *status) {  
    if (!status.isError) { /* removed */ }  
}];  
`
```

#### Delete a single message

```
`[self.client deleteMessagesFromChannel:@"channel" start:@15526611838554309 end:@15526611838554310  
                        withCompletion:^(PNAcknowledgmentStatus *status) { }];  
`
```

### Builder alternative

```
`deleteMessage()  
    .channel(NSString *)  
    .start(NSNumber *)  
    .end(NSNumber *)  
    .performWithCompletion(PNAcknowledgmentStatus *);  
`
```

```
`self.client.deleteMessage()  
    .channel(@"channel")  
    .start(@15101397027611671)  
    .end(@15101397427611671)  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { });  
`
```

---

## Message Counts

### Builder method

```
`messageCounts()  
    .channels(NSArrayNSString *> *)  
    .timetokens(NSArrayNSNumber *> *)  
    .performWithCompletion(PNMessageCountCompletionBlock);  
`
```

### Example

```
`self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
    .timetokens(@[@(15501015683744028)])  
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) { });  
`
```

### Response

```
`@interface PNMessageCountData : PNServiceData  
@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSNumber *> *channels;  
@end  
  
@interface PNMessageCountResult : PNResult  
@property (nonatomic, readonly, strong) PNMessageCountData *data;  
`
```

### Multiple timetokens example

```
`self.client.messageCounts().channels(@[@"unread-channel-1", @"unread-channel-2"])  
    .timetokens(@[@(15501015683744028), @(15501015683744130)])  
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) { });  
`
```

---

## History (deprecated – use Fetch History)

### All supported signatures

```
`- (void)historyForChannel:(NSString *)channel withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel   
             withMetadata:(BOOL)shouldIncludeMetadata   
               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel   
       withMessageActions:(BOOL)shouldIncludeMessageActions   
               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel   
             withMetadata:(BOOL)shouldIncludeMetadata   
           messageActions:(BOOL)shouldIncludeMessageActions   
               completion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate includeMetadata:(BOOL)shouldIncludeMetadata withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate includeMessageActions:(BOOL)shouldIncludeMessageActions withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate limit:(NSUInteger)limit withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate includeTimeToken:(BOOL)shouldIncludeTimeToken withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate limit:(NSUInteger)limit includeTimeToken:(BOOL)shouldIncludeTimeToken withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate limit:(NSUInteger)limit reverse:(BOOL)shouldReverseOrder withCompletion:(PNHistoryCompletionBlock)block;  
`
```

```
`- (void)historyForChannel:(NSString *)channel start:(nullable NSNumber *)startDate end:(nullable NSNumber *)endDate limit:(NSUInteger)limit reverse:(BOOL)shouldReverseOrder includeTimeToken:(BOOL)shouldIncludeTimeToken withCompletion:(PNHistoryCompletionBlock)block;  
`
```

### Usage – last 100 messages

```
`[self.client historyForChannel: @"my_channel" start:nil end:nil limit:100  
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {  
    if (!status) {  
        /** result.data.messages */  
    }  
}];  
`
```

### Response object

```
`@interface PNHistoryData : PNServiceData  
@property (nonatomic, readonly, strong) NSArray *messages;  
@property (nonatomic, readonly, strong) NSNumber *start;  
@property (nonatomic, readonly, strong) NSNumber *end;  
@end  
  
@interface PNHistoryResult : PNResult  
@property (nonatomic, readonly, strong) PNHistoryData *data;  
`
```

### Other examples

Retrieve three oldest:

```
`[self.client historyForChannel:@"my_channel" start:nil end:nil limit:3 reverse:YES  
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

```
`[  
    ["Pub1","Pub2","Pub3"],  
    13406746729185766,  
    13406746780720711  
]  
`
```

Retrieve newer than timetoken:

```
`[self.client historyForChannel:@"my_channel" start:@(13406746780720711) end:nil limit:100  
                        reverse:YES withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

```
`[  
    ["Pub3","Pub4","Pub5"],  
    13406746780720711,  
    13406746845892666  
]  
`
```

Retrieve until timetoken:

```
`[self.client historyForChannel:@"my_channel" start:nil end:@(13406746780720711) limit:100  
                includeTimeToken:NO withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

```
`[  
    ["Pub3","Pub4","Pub5"],  
    13406746780720711,  
    13406746845892666  
]  
`
```

#### History paging helper

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

Fetch with metadata:

```
`[self.client historyForChannel:@"storage" withMetadata:YES  
                    completion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

Fetch with actions:

```
`[self.client historyForChannel:@"chat" withMessageActions:YES  
                    completion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

Fetch with metadata & actions:

```
`[self.client historyForChannel:@"chat" withMetadata:YES messageActions:YES**                    completion:^(PNHistoryResult *result, PNErrorStatus *status) { }];  
`
```

---

Last updated Jun 10 2025