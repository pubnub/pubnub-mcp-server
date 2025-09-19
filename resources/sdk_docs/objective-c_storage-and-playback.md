# Message Persistence API (Objective-C SDK)

PubNub Message Persistence stores every published message (10-ns resolution) in multiple zones.  
Retention options: 1 day · 7 days · 30 days · 3 mo · 6 mo · 1 yr · Unlimited.  
AES-256 end-to-end encryption is supported.

---

## Fetch history

Requires Message Persistence to be enabled.

* Fetch messages (and optionally metadata, message type, publisher UUID, and/or message actions) for ≤ 500 channels.  
* Pagination:  
  • `start` only → messages older than `start`  
  • `end` only → messages ≥ `end`  
  • both → between `start` and `end` (inclusive of `end`)  
* Max returned: 100 per single channel, 25 per multi-channel (up to 500).  
* Use iterative calls with updated `start` to page.  
* `reverse:YES` traverses from oldest first.

### Method (builder pattern)

```
history()
    .channels(NSArray *)              // REQUIRED – up to 500
    .start(NSNumber *)                // oldest timetoken (optional)
    .end(NSNumber *)                  // newest timetoken (optional)
    .limit(NSUInteger)                // 1-100 / 1-25 (multi-chan)
    .reverse(BOOL)                    // default NO
    .includeMetadata(BOOL)            // default NO
    .includeMessageType(BOOL)         // default YES
    .includeCustomMessageType(BOOL)   // default YES
    .includeUUID(BOOL)                // default YES
    .includeMessageActions(BOOL)      // single-channel only
    .includeTimeToken(BOOL)           // default NO
    .performWithCompletion(PNHistoryCompletionBlock);
```

Tip: `reverse` only affects the first page when more than `limit` messages match.

### Sample code

```
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// Basic configuration
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"historyUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
[client addListener:self];

// Publish sample messages for history demo
```
show all 156 lines

### Response

```
@interface PNHistoryData : PNServiceData
@property (nonatomic, readonly, strong) NSArray *messages;     // or channels history dictionary
@end
```
show all 41 lines

### Error

```
@interface PNErrorData   : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, getter=isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```
show all 16 lines

### Other examples

#### Fetch messages with metadata

```
self.client.history()
    .channel(@"storage")
    .includeMetadata(YES)
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) {
        if (!status.isError) {
            // result.data.channels -> {"storage": [ {message, metadata}, ... ]}
        }
    });
```
show all 20 lines

#### Fetch messages with actions

```
self.client.history()
    .channel(@"chat")
    .includeMessageActions(YES)
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) { ... });
```
show all 20 lines

#### Fetch messages with metadata and actions

```
self.client.history()
    .channel(@"chat")
    .includeMetadata(YES)
    .includeMessageActions(YES)
    .performWithCompletion(^(PNHistoryResult *result, PNErrorStatus *status) { ... });
```
show all 22 lines

---

## Delete messages from history

Requires Message Persistence, secret key, and “Enable Delete-From-History” (Admin Portal).

### Direct method

```
- (void)deleteMessagesFromChannel:(NSString *)channel
                            start:(nullable NSNumber *)startDate
                              end:(nullable NSNumber *)endDate
                   withCompletion:(nullable PNMessageDeleteCompletionBlock)block;
```

### Sample

```
[self.client deleteMessagesFromChannel:@"channel"
                                 start:@15101397027611671
                                   end:@15101397427611671
                        withCompletion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) { /* success */ }
}];
```

#### Delete a specific message

```
[self.client deleteMessagesFromChannel:@"channel"
                                 start:@15526611838554309   // timetoken-1
                                   end:@15526611838554310   // publish timetoken
                        withCompletion:^(PNAcknowledgmentStatus *status) { ... }];
```

### Builder pattern

```
deleteMessage()
    .channel(NSString *)      // REQUIRED
    .start(NSNumber *)        // optional
    .end(NSNumber *)          // optional
    .performWithCompletion(PNAcknowledgmentStatus *);
```

#### Sample

```
self.client.deleteMessage()
    .channel(@"channel")
    .start(@15101397027611671)
    .end(@15101397427611671)
    .performWithCompletion(^(PNAcknowledgmentStatus *status) { ... });
```
show all 17 lines

---

## Message counts

Returns # of messages on channels since given timetoken(s).  
Keys with unlimited retention consider only last 30 days.

### Method

```
messageCounts()
    .channels(NSArray<NSString *> *)   // REQUIRED
    .timetokens(NSArray<NSNumber *> *) // REQUIRED (1 per channel or 1 total)
    .performWithCompletion(PNMessageCountCompletionBlock);
```

### Sample

```
self.client.messageCounts()
    .channels(@[@"unread-channel-1", @"unread-channel-2"])
    .timetokens(@[@(15501015683744028)])
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) {
        if (!status.isError) { /* counts in result.data.channels */ }
    });
```
show all 17 lines

### Return object

```
@interface PNMessageCountData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSNumber *> *channels;
@end
```
show all 17 lines

#### Different timetoken per channel

```
self.client.messageCounts()
    .channels(@[@"unread-channel-1", @"unread-channel-2"])
    .timetokens(@[@(15501015683744028), @(15501015683744130)])
    .performWithCompletion(^(PNMessageCountResult *result, PNErrorStatus *status) { ... });
```
show all 17 lines

---

## History (deprecated)

Use “Fetch history” instead. Methods retained for backward compatibility.

### Methods

```
- (void)historyForChannel:(NSString *)channel
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
             withMetadata:(BOOL)shouldIncludeMetadata
               completion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
       withMessageActions:(BOOL)shouldIncludeMessageActions
               completion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
             withMetadata:(BOOL)shouldIncludeMetadata
           messageActions:(BOOL)shouldIncludeMessageActions
               completion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
           withCompletion:(PNHistoryCompletionBlock)block;

// ... (complete overload list follows)
```
(Full list of overloads retained below.)
```
- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
          includeMetadata:(BOOL)shouldIncludeMetadata
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
    includeMessageActions:(BOOL)shouldIncludeMessageActions
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
                    limit:(NSUInteger)limit
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
         includeTimeToken:(BOOL)shouldIncludeTimeToken
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
                    limit:(NSUInteger)limit
         includeTimeToken:(BOOL)shouldIncludeTimeToken
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
                    limit:(NSUInteger)limit
                  reverse:(BOOL)shouldReverseOrder
           withCompletion:(PNHistoryCompletionBlock)block;

- (void)historyForChannel:(NSString *)channel
                    start:(nullable NSNumber *)startDate
                      end:(nullable NSNumber *)endDate
                    limit:(NSUInteger)limit
                  reverse:(BOOL)shouldReverseOrder
         includeTimeToken:(BOOL)shouldIncludeTimeToken
           withCompletion:(PNHistoryCompletionBlock)block;
```

Tip: `reverse` works the same as in the new API.

### Sample – last 100 messages

```
[self.client historyForChannel:@"my_channel" start:nil end:nil limit:100
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) {
    if (!status) {
        // result.data.messages, result.data.start, result.data.end
    }
}];
```
show all 24 lines

### Response

```
@interface PNHistoryData : PNServiceData
@property (nonatomic, readonly, strong) NSArray  *messages;
@property (nonatomic, readonly, strong) NSNumber *start;
@property (nonatomic, readonly, strong) NSNumber *end;
@end
```
show all 17 lines

### Other examples

#### Oldest 3 messages (reverse)

```
[self.client historyForChannel:@"my_channel" start:nil end:nil limit:3 reverse:YES
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 24 lines

```
[
    ["Pub1","Pub2","Pub3"],
    13406746729185766,
    13406746780720711
]
```

#### Messages newer than a timetoken

```
[self.client historyForChannel:@"my_channel" start:@(13406746780720711)
                          end:nil limit:100 reverse:YES
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 24 lines

```
[
    ["Pub3","Pub4","Pub5"],
    13406746780720711,
    13406746845892666
]
```

#### Messages until a timetoken

```
[self.client historyForChannel:@"my_channel" start:nil
                          end:@(13406746780720711) limit:100
                includeTimeToken:NO
                withCompletion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 24 lines

```
[
    ["Pub3","Pub4","Pub5"],
    13406746780720711,
    13406746845892666
]
```

#### Paging helper

```
[self historyFromStartDate:@(14395051270438477) onChannel:@"history_channel"
        withCompletionBlock:^(NSArray *messages) { ... }];
```
show all 50 lines

#### Metadata & actions (deprecated API)

```
[self.client historyForChannel:@"storage" withMetadata:YES completion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 19 lines

```
[self.client historyForChannel:@"chat" withMessageActions:YES completion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 19 lines

```
[self.client historyForChannel:@"chat" withMetadata:YES messageActions:YES
                    completion:^(PNHistoryResult *result, PNErrorStatus *status) { ... }];
```
show all 20 lines

---

Last updated Jul 15 2025