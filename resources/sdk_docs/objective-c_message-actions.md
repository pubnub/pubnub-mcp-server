# Message Actions API – Objective-C SDK

Add, remove, and fetch metadata (reactions, receipts, custom data) attached to published messages.  
Message Persistence **must be enabled** for the key used.

---

## Add Message Action

### Method (request object)

```
- (void)addMessageActionWithRequest:(PNAddMessageActionRequest *)request
                         completion:(nullable PNAddMessageActionCompletionBlock)block;
```

#### PNAddMessageActionRequest

* `type` `NSString*` – Action type (≤ 15 chars).  
* `value` `NSString*` – Action value.  
* `channel` `NSString*` – Channel that contains the target message.  
* `messageTimetoken` `NSNumber*` – Timetoken of the target message.

### Example

```
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"actionUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
[client addListener:self];

PNAddMessageActionRequest *request =
    [PNAddMessageActionRequest requestWithChannel:@"chat"
                                messageTimetoken:@(17457898826964534)];
request.type  = @"reaction";
request.value = @"smile";

[client addMessageActionWithRequest:request
                          completion:^(PNAddMessageActionStatus *status) {
    if (!status.isError) {
        PNMessageAction *action = status.data.action;
    }
}];
```

### Response objects

```
@interface PNAddMessageActionData : PNServiceData
@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;
@end

@interface PNAddMessageActionStatus : PNAcknowledgmentStatus
@property (nonatomic, readonly, strong) PNAddMessageActionData *data;
@end
```

---

## Add Message Action (Builder Pattern)

```
addMessageAction()
    .channel(NSString *)
    .messageTimetoken(NSNumber *)
    .type(NSString *)
    .value(NSString *)
    .performWithCompletion(nullable PNAddMessageActionCompletionBlock);
```

### Example

```
self.client.addMessageAction()
    .channel(@"chat")
    .messageTimetoken(@(1234567890))
    .type(@"reaction")
    .value(@"smile")
    .performWithCompletion(^(PNAddMessageActionStatus *status) {
        if (!status.isError) {
            PNMessageAction *action = status.data.action;
        }
    });
```

(Response classes are identical to those shown above.)

---

## Remove Message Action

### Method (request object)

```
- (void)removeMessageActionWithRequest:(PNRemoveMessageActionRequest *)request
                            completion:(nullable PNRemoveMessageActionCompletionBlock)block;
```

#### PNRemoveMessageActionRequest

* `actionTimetoken` `NSNumber*` – Timetoken of the action to remove.  
* `channel` `NSString*` – Channel that holds the message.  
* `messageTimetoken` `NSNumber*` – Timetoken of the target message.

### Example

```
PNRemoveMessageActionRequest *request =
    [PNRemoveMessageActionRequest requestWithChannel:@"chat"
                                    messageTimetoken:@(1234567890)];
request.actionTimetoken = @(1234567891);

[self.client removeMessageActionWithRequest:request
                                 completion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // Removed.
    }
}];
```

### Error/acknowledgment objects

```
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Remove Message Action (Builder Pattern)

```
removeMessageAction()
    .channel(NSString *)
    .messageTimetoken(NSNumber *)
    .actionTimetoken(NSNumber *)
    .performWithCompletion(nullable PNRemoveMessageActionCompletionBlock);
```

### Example

```
self.client.removeMessageAction()
    .channel(@"chat")
    .messageTimetoken(@(1234567890))
    .actionTimetoken(@(1234567891))
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {
        if (!status.isError) {
            // Removed.
        }
    });
```

(Error/acknowledgment objects are identical to those above.)

---

## Get Message Actions

### Method (request object)

```
- (void)fetchMessagesActionsWithRequest:(PNFetchMessageActionsRequest *)request
                             completion:(PNFetchMessageActionsCompletionBlock)block;
```

#### PNFetchMessageActionsRequest

* `channel` `NSString*` – Channel to query.  
* `start` `NSNumber*` – Return actions with timetoken < `start`.  
* `end` `NSNumber*` – Return actions with timetoken ≥ `end`.  
* `limit` `NSUInteger` – Max actions to return (default 100, max 500).

### Example

```
PNFetchMessageActionsRequest *request =
    [PNFetchMessageActionsRequest requestWithChannel:@"chat"];
request.start = @(1234567891);
request.limit = 200;

[self.client fetchMessageActionsWithRequest:request
                                 completion:^(PNFetchMessageActionsResult *result,
                                              PNErrorStatus *status) {
    if (!status.isError) {
        NSArray<PNMessageAction *> *actions = result.data.actions;
    }
}];
```

### Response objects

```
@interface PNFetchMessageActionsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNMessageAction *> *actions;
@property (nonatomic, readonly, strong) NSNumber *start;
@property (nonatomic, readonly, strong) NSNumber *end;
@end
```

Error object:

```
@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Get Message Actions (Builder Pattern)

```
fetchMessageActions()
    .channel(NSString *)
    .start(NSNumber *)
    .end(NSNumber *)
    .limit(NSUInteger)
    .performWithCompletion(PNFetchMessageActionsCompletionBlock);
```

### Example

```
self.client.fetchMessageActions()
    .channel(@"chat")
    .start(@(1234567891))
    .limit(200)
    .performWithCompletion(^(PNFetchMessageActionsResult *result,
                             PNErrorStatus *status) {
        if (!status.isError) {
            NSArray<PNMessageAction *> *actions = result.data.actions;
        }
    });
```

(Response and error classes are identical to those shown in the previous section.)

_Last updated: Jun 10 2025_