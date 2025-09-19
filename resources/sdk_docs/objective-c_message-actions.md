# Message Actions API – Objective-C SDK (condensed)

Message Actions (aka Reactions) let you attach metadata (emoji, receipts, etc.) to any stored message. All Message-Action APIs require **Message Persistence** to be enabled for your keys.

---

## Add Message Reaction

### Method  
```objective-c
- (void)addMessageActionWithRequest:(PNAddMessageActionRequest *)request
                         completion:(nullable PNAddMessageActionCompletionBlock)block;
```

### PNAddMessageActionRequest  
* `type`   NSString – feature name, ≤15 chars.  
* `value`  NSString – data to store with the action.  
* `channel` NSString – channel that holds the target message.  
* `messageTimetoken` NSNumber – timetoken of the target message.

### Sample  
```objective-c
`// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"actionUser"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Add listener for PubNub events  
[client addListener:self];  
  
// Create a request object for adding a message action  
PNAddMessageActionRequest *request = [PNAddMessageActionRequest requestWithChannel:@"chat"  
                                                                  messageTimetoken:@(17457898826964534)];  
  
`
```
show all 55 lines

### Response  
```objective-c
@interface PNAddMessageActionData : PNServiceData
@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;
@end

@interface PNAddMessageActionStatus : PNAcknowledgmentStatus
@property (nonatomic, readonly, strong) PNAddMessageActionData *data;
@end
```

---

## Add Message Reaction (builder pattern)

### Builder  
```objective-c
addMessageAction()
    .channel(NSString *)
    .messageTimetoken(NSNumber *)
    .type(NSString *)
    .value(NSString *)
    .performWithCompletion(nullable PNAddMessageActionCompletionBlock);
```

### Sample  
```objective-c
`self.client.addMessageAction()  
    .channel(@"chat")  
    .messageTimetoken(@(1234567890))  
    .type(@"reaction")  
    .value(@"smile")  
    .performWithCompletion(^(PNAddMessageActionStatus *status) {  
        if (!status.isError) {  
            /**  
             * Message action successfully added.  
             * Created message action information available here: status.data.action  
             */  
        } else {  
            if (status.statusCode == 207) {  
                // Message action has been added, but event not published.  
            } else {  
`
```
show all 24 lines

### Response  
```objective-c
@interface PNAddMessageActionData : PNServiceData
@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;
@end

@interface PNAddMessageActionStatus : PNAcknowledgmentStatus
@property (nonatomic, readonly, strong) PNAddMessageActionData *data;
@end
```

---

## Remove Message Reaction

### Method  
```objective-c
- (void)removeMessageActionWithRequest:(PNRemoveMessageActionRequest *)request
                            completion:(nullable PNRemoveMessageActionCompletionBlock)block;
```

### PNRemoveMessageActionRequest  
* `actionTimetoken` NSNumber – timetoken of the action itself.  
* `channel` NSString – channel that stores the target message.  
* `messageTimetoken` NSNumber – timetoken of the target message.

### Sample  
```objective-c
`PNRemoveMessageActionRequest *request = [PNRemoveMessageActionRequest requestWithChannel:@"chat"  
                                                                        messageTimetoken:@(1234567890)];  
request.actionTimetoken = @(1234567891);  
  
[self.client removeMessageActionWithRequest:request  
                                 completion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
        // Message action successfully removed.  
    } else {  
        /**  
         * Handle remove message action error. Check 'category' property to find out possible  
         * issue because of which request did fail.  
         *  
         * Request can be resent using: [status retry]  
`
```
show all 18 lines

### Response  
```objective-c
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Remove Message Reaction (builder pattern)

### Builder  
```objective-c
removeMessageAction()
    .channel(NSString *)
    .messageTimetoken(NSNumber *)
    .actionTimetoken(NSNumber *)
    .performWithCompletion(nullable PNRemoveMessageActionCompletionBlock);
```

### Sample  
```objective-c
`self.client.removeMessageAction()  
    .channel("chat")  
    .messageTimetoken(@(1234567890))  
    .actionTimetoken(@(1234567891))  
    .performWithCompletion(^(PNCreateSpaceStatus *status) {  
        if (!status.isError) {  
            // Message action successfully removed.  
        } else {  
            /**  
             * Handle remove message action error. Check 'category' property to find out possible  
             * issue because of which request did fail.  
             *  
             * Request can be resent using: [status retry]  
             */  
        }  
`
```
show all 16 lines

### Response  
```objective-c
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Get Message Reactions

### Method  
```objective-c
- (void)fetchMessagesActionsWithRequest:(PNFetchMessagesActionsRequest *)request
                             completion:(PNFetchMessageActionsCompletionBlock)block;
```

### PNFetchMessageActionsRequest  
* `channel` NSString – source channel.  
* `start`  NSNumber – return actions < this timetoken.  
* `end`    NSNumber – return actions ≥ this timetoken.  
* `limit`  NSUInteger – max actions to return.

### Sample  
```objective-c
`PNFetchMessageActionsRequest *request = [PNFetchMessageActionsRequest requestWithChannel:@"chat"];  
request.start = @(1234567891);  
request.limit = 200;  
  
[self.client fetchMessageActionsWithRequest:request  
                                 completion:^(PNFetchMessageActionsResult *result,  
                                              PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * Message actions successfully fetched.  
         * Result object has following information:  
         *     result.data.actions - list of message action instances  
         *     result.data.start - fetched messages actions time range start (oldest message  
         *         action timetoken).  
`
```
show all 26 lines

### Response  
```objective-c
@interface PNFetchMessageActionsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNMessageAction *> *actions;
@property (nonatomic, readonly, strong) NSNumber *start;
@property (nonatomic, readonly, strong) NSNumber *end;
@end

@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

---

## Get Message Reactions (builder pattern)

### Builder  
```objective-c
fetchMessageActions()
    .channel(NSString *)
    .start(NSNumber *)
    .end(NSNumber *)
    .limit(NSUInteger)
    .performWithCompletion(PNFetchMessageActionsCompletionBlock);
```

### Sample  
```objective-c
`self.client.fetchMessageActions()  
    .channel(@"chat")  
    .start(@(1234567891))  
    .limit(200)  
    .performWithCompletion(^(PNFetchMessageActionsResult *result,  
                             NErrorStatus *status) {  
  
        if (!status.isError) {  
            /**  
             * Message action successfully added.  
             * Result object has following information:  
             *     result.data.actions - list of message action instances  
             *     result.data.start - fetched messages actions time range start (oldest message  
             *         action timetoken).  
             *     result.data.end - fetched messages actions time range end (newest action timetoken).  
`
```
show all 25 lines

### Response  
```objective-c
@interface PNFetchMessageActionsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNMessageAction *> *actions;
@property (nonatomic, readonly, strong) NSNumber *start;
@property (nonatomic, readonly, strong) NSNumber *end;
@end

@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end
```

_Last updated: Jul 15 2025_