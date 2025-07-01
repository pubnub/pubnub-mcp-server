On this page
# Message Actions API for Objective-C SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Objective-C SDK:

```
`- (void)addMessageActionWithRequest:(PNAddMessageActionRequest *)request   
                         completion:(nullable PNAddMessageActionCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNAddMessageActionRequest](#pnaddmessageactionrequest)`Add message action` request with all information about new message action which will be passed to  **PubNub**  service.`block`Type: PNAddMessageActionCompletionBlock`Add message action` request completion `block`.

#### PNAddMessageActionRequest[​](#pnaddmessageactionrequest)

*  requiredParameterDescription`type` *Type: NSStringWhat feature this message action represents. Maximum `15` characters.`value` *Type: NSStringValue which should be added with message action type.`channel` *Type: NSStringName of channel which stores the message for which `action` should be added.`messageTimetoken` *Type: NSNumberTimetoken (PubNub's high precision timestamp) of message to which `action` should be added.

### Basic Usage[​](#basic-usage)

```
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

### Response[​](#response)

Response objects which is returned by client when `add message action` Message Action API is used:

```
`@interface PNAddMessageActionData : PNServiceData  
  
// Added message action.  
@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;  
  
@end  
  
@interface PNAddMessageActionStatus : PNAcknowledgmentStatus  
  
// Add message action request processed information.  
@property (nonatomic, readonly, strong) PNAddMessageActionData *data;  
  
@end  
`
```

## Add Message Action (Builder Pattern)[​](#add-message-action-builder-pattern)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods-1)

To Add a Message Action you can use the following method(s) in the Objective-C SDK:

```
`addMessageAction()  
    .channel(NSString *)  
    .messageTimetoken(NSNumber *)  
    .type(NSString *)  
    .value(NSString *)  
    .performWithCompletion(nullable PNAddMessageActionCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel which store message for which `action` should be added.`messageTimetoken` *Type: NSNumberTimetoken of message for which `action` should be added.`type` *Type: NSStringWhat feature this message action represents.`value` *Type: NSStringValue which should be stored along with message action.`block`Type: PNAddMessageActionCompletionBlock`Add message action` request completion `block`.

### Basic Usage[​](#basic-usage-1)

```
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

### Response[​](#response-1)

Response objects which is returned by client when `add message action` Message Action API is used:

```
`@interface PNAddMessageActionData : PNServiceData  
  
// Added message action.  
@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;  
  
@end  
  
@interface PNAddMessageActionStatus : PNAcknowledgmentStatus  
  
// Add message action request processed information.  
@property (nonatomic, readonly, strong) PNAddMessageActionData *data;  
  
@end  
`
```

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-2)

To Remove a Message Action you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeMessageActionWithRequest:(PNRemoveMessageActionRequest *)request   
                            completion:(nullable PNRemoveMessageActionCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveMessageActionRequest](#pnremovemessageactionrequest)`Remove message action` request with information about existing message action.`block`Type: PNRemoveMessageActionCompletionBlock`Remove message action` request completion `block`.

#### PNRemoveMessageActionRequest[​](#pnremovemessageactionrequest)

*  requiredParameterDescription`actionTimetoken` *Type: NSNumberMessage action addition timetoken.`channel` *Type: NSStringName of channel which store message for which action should be removed.`messageTimetoken` *Type: NSNumberTimetoken (PubNub's high precision timestamp) of message to which `action` should be removed.

### Basic Usage[​](#basic-usage-2)

```
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

### Response[​](#response-2)

Response objects which is returned by client when `remove message action` Message Action API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

## Remove Message Action (Builder Pattern)[​](#remove-message-action-builder-pattern)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-3)

```
`removeMessageAction()  
    .channel(NSString *)  
    .messageTimetoken(NSNumber *)  
    .actionTimetoken(NSNumber *)  
    .performWithCompletion(nullable PNRemoveMessageActionCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel which store message for which action should be removed.`messageTimetoken` *Type: NSNumberTimetoken of message for which `action` should be removed.`actionTimetoken` *Type: NSNumber`Action` addition timetoken.`block`Type: PNRemoveMessageActionCompletionBlock`Remove message action` request completion `block`.

### Basic Usage[​](#basic-usage-3)

```
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

### Response[​](#response-3)

Response objects which is returned by client when `remove message action` Message Action API is used:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-4)

To Get Message Actions you can use the following method(s) in the Objective-C SDK:

```
`- (void)fetchMessagesActionsWithRequest:(PNFetchMessagesActionsRequest *)request   
                             completion:(PNFetchMessageActionsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchMessageActionsRequest](#pnfetchmessageactionsrequest)`Fetch message actions` request with all information which should be used to fetch existing `messages actions`.`block` *Type: PNFetchMessageActionsCompletionBlock`Fetch message actions` request completion `block`.

#### PNFetchMessageActionsRequest[​](#pnfetchmessageactionsrequest)

*  requiredParameterDescription`start` *Type: NSNumberReturn values will be less than start.`end` *Type: NSNumberReturn values will be greater than or equal to end.`limit` *Type: NSUIntegerNumber of messages actions to return in response.`channel` *Type: NSStringName of channel from which list of message actions should be retrieved.

### Basic Usage[​](#basic-usage-4)

```
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

### Response[​](#response-4)

Response objects which is returned by client when `fetch message actions` Message Action API is used:

```
`@interface PNFetchMessageActionsData : PNServiceData  
  
// List of fetched messages actions.  
@property (nonatomic, readonly, strong) NSArrayPNMessageAction *> *actions;  
  
/**  
 * Fetched messages actions time range start (oldest message action timetoken).  
 *  
 * This timetoken can be used as 'start' value to fetch older messages actions.  
 */  
@property (nonatomic, readonly, strong) NSNumber *start;  
  
// Fetched messages actions time range end (newest action timetoken).  
@property (nonatomic, readonly, strong) NSNumber *end;  
  
`
```
show all 23 lines

Error response which is used in case of Message Action API call failure:

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

## Get Message Actions (Builder Pattern)[​](#get-message-actions-builder-pattern)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-5)

To Get Message Actions you can use the following method(s) in the Objective-C SDK:

```
`fetchMessageActions()  
    .channel(NSString *)  
    .start(NSNumber *)  
    .end(NSNumber *)  
    .limit(NSUInteger)  
    .performWithCompletion(PNFetchMessageActionsCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which list of messages `actions` should be retrieved.`start`Type: NSNumberMessage action timetoken denoting the start of the range requested. Return values will be less than start.`end`Type: NSNumberMessage action timetoken denoting the end of the range requested. Return values will be greater than or equal to end.`limit`Type: NSUIntegerNumber of message actions to return in response.`block` *Type: PNFetchMessageActionsCompletionBlock`Fetch message actions` request completion `block`.

### Basic Usage[​](#basic-usage-5)

```
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

### Response[​](#response-5)

Response objects which is returned by client when `fetch message actions` Message Action API is used:

```
`@interface PNFetchMessageActionsData : PNServiceData  
  
// List of fetched messages actions.  
@property (nonatomic, readonly, strong) NSArrayPNMessageAction *> *actions;  
  
/**  
 * Fetched messages actions time range start (oldest message action timetoken).  
 *  
 * This timetoken can be used as 'start' value to fetch older messages actions.  
 */  
@property (nonatomic, readonly, strong) NSNumber *start;  
  
// Fetched messages actions time range end (newest action timetoken).  
@property (nonatomic, readonly, strong) NSNumber *end;  
  
`
```
show all 23 lines

Error response which is used in case of Message Action API call failure:

```
`@interface PNErrorData : PNServiceData**  
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
show all 16 linesLast updated on Jun 10, 2025**