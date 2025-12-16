# Message Actions API for Objective-C SDK

Use **Message Actions** to add/remove metadata on published messages (for example: receipts, reactions). Clients **subscribe** to receive message action events, and can **fetch** historical actions via **Message Persistence**.

##### Reactions
“Message Reactions” is a common use of Message Actions for emoji/social reactions (same underlying API).

---

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Add an action to a published message; response includes the added action.

##### Message Actions vs. Message Reactions
- **Message Actions**: generic metadata (receipts, confirmations, custom data).
- **Message Reactions**: Message Actions used specifically for emoji/social reactions (terminology varies across SDKs, functionality is the same).

### Method(s)

Use this Objective-C method:

```
`1- (void)addMessageActionWithRequest:(PNAddMessageActionRequest *)request   
2                         completion:(nullable PNAddMessageActionCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNAddMessageActionRequest](#pnaddmessageactionrequest)Request containing the message action details.`block`Type: PNAddMessageActionCompletionBlockCompletion block.

#### PNAddMessageActionRequest

*  requiredParameterDescription`type` *Type: NSStringMessage action type. Maximum `15` characters.`value` *Type: NSStringMessage action value.`channel` *Type: NSStringChannel name of the target message.`messageTimetoken` *Type: NSNumberTimetoken of the target message.

### Sample code

```
1// Basic configuration  
2PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
3                                                          subscribeKey:@"demo"  
4                                                                userID:@"actionUser"];  
5
  
6// Create a PubNub client instance  
7PubNub *client = [PubNub clientWithConfiguration:config];  
8
  
9// Add listener for PubNub events  
10[client addListener:self];  
11
  
12// Create a request object for adding a message action  
13PNAddMessageActionRequest *request = [PNAddMessageActionRequest requestWithChannel:@"chat"  
14                                                                  messageTimetoken:@(17457898826964534)];  
15
  
16// Set the required properties  
17request.type = @"reaction";  
18request.value = @"smile";  
19
  
20// Send the request  
21[client addMessageActionWithRequest:request completion:^(PNAddMessageActionStatus *status) {  
22    if (!status.isError) {  
23        NSLog(@"✅ Message action successfully added!");  
24        NSLog(@"Action type: %@", status.data.action.type);  
25        NSLog(@"Action value: %@", status.data.action.value);  
26        NSLog(@"Action timetoken: %@", status.data.action.actionTimetoken);  
27    } else {  
28        if (status.statusCode == 207) {  
29            NSLog(@"⚠️ Message action has been added, but event not published.");  
30        } else {  
31            NSLog(@"❌ Error adding message action: %@", status.errorData.information);  
32            NSLog(@"Error category: %@", @(status.category));  
33        }  
34    }  
35}];  
36
  
37// Subscribe to a chat channel  
38PNSubscribeRequest *request = [PNSubscribeRequest requestWithChannels:@[@"chat-channel"]  
39                                                        channelGroups:nil];  
40      
41[self.client subscribeWithRequest:request];  
42
  
43// Required PNEventsListener methods  
44- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
45    if (status.category == PNConnectedCategory) {  
46        NSLog(@"✅ Successfully connected to PubNub!");  
47    } else if (status.isError) {  
48        NSLog(@"❌ PubNub connection error: %@", status);  
49    }  
50}  
51
  
52- (void)client:(PubNub *)client didReceiveMessageAction:(PNMessageActionResult *)action {  
53    NSLog(@"📢 Received message action event!");  
54    NSLog(@"Action type: %@, value: %@", action.data.action.type, action.data.action.value);  
55}  

```
show all 55 lines

### Response

```
1@interface PNAddMessageActionData : PNServiceData  
2
  
3// Added message action.  
4@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;  
5
  
6@end  
7
  
8@interface PNAddMessageActionStatus : PNAcknowledgmentStatus  
9
  
10// Add message action request processed information.  
11@property (nonatomic, readonly, strong) PNAddMessageActionData *data;  
12
  
13@end  

```

---

## Add message action (builder pattern)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

### Method(s)

Use this Objective-C method:

```
`1addMessageAction()  
2    .channel(NSString *)  
3    .messageTimetoken(NSNumber *)  
4    .type(NSString *)  
5    .value(NSString *)  
6    .performWithCompletion(nullable PNAddMessageActionCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringChannel name of the target message.`messageTimetoken` *Type: NSNumberTimetoken of the target message.`type` *Type: NSStringMessage action type.`value` *Type: NSStringMessage action value.`block`Type: PNAddMessageActionCompletionBlockCompletion block.

### Sample code

```
`1self.client.addMessageAction()  
2    .channel(@"chat")  
3    .messageTimetoken(@(1234567890))  
4    .type(@"reaction")  
5    .value(@"smile")  
6    .performWithCompletion(^(PNAddMessageActionStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * Message action successfully added.  
10             * Created message action information available here: status.data.action  
11             */  
12        } else {  
13            if (status.statusCode == 207) {  
14                // Message action has been added, but event not published.  
15            } else {  
16                /**  
17                 * Handle add message action error. Check 'category' property to find out possible  
18                 * issue because of which request did fail.  
19                 *  
20                 * Request can be resent using: [status retry]  
21                 */  
22            }  
23        }  
24    });  
`
```
show all 24 lines

### Response

```
1@interface PNAddMessageActionData : PNServiceData  
2
  
3// Added message action.  
4@property (nonatomic, nullable, readonly, strong) PNMessageAction *action;  
5
  
6@end  
7
  
8@interface PNAddMessageActionStatus : PNAcknowledgmentStatus  
9
  
10// Add message action request processed information.  
11@property (nonatomic, readonly, strong) PNAddMessageActionData *data;  
12
  
13@end  

```

---

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Remove a previously added action from a published message. Response is empty.

### Method(s)

Use this Objective-C method:

```
`1- (void)removeMessageActionWithRequest:(PNRemoveMessageActionRequest *)request   
2                            completion:(nullable PNRemoveMessageActionCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveMessageActionRequest](#pnremovemessageactionrequest)Request containing the message action to remove.`block`Type: PNRemoveMessageActionCompletionBlockCompletion block.

#### PNRemoveMessageActionRequest

*  requiredParameterDescription`actionTimetoken` *Type: NSNumberTimetoken of the message action to remove.`channel` *Type: NSStringChannel name of the target message.`messageTimetoken` *Type: NSNumberTimetoken of the target message.

### Sample code

```
1PNRemoveMessageActionRequest *request = [PNRemoveMessageActionRequest requestWithChannel:@"chat"  
2                                                                        messageTimetoken:@(1234567890)];  
3request.actionTimetoken = @(1234567891);  
4
  
5[self.client removeMessageActionWithRequest:request  
6                                 completion:^(PNAcknowledgmentStatus *status) {  
7
  
8    if (!status.isError) {  
9        // Message action successfully removed.  
10    } else {  
11        /**  
12         * Handle remove message action error. Check 'category' property to find out possible  
13         * issue because of which request did fail.  
14         *  
15         * Request can be resent using: [status retry]  
16         */  
17    }  
18}];  

```
show all 18 lines

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
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

---

## Remove message action (builder pattern)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

### Method(s)

```
`1removeMessageAction()  
2    .channel(NSString *)  
3    .messageTimetoken(NSNumber *)  
4    .actionTimetoken(NSNumber *)  
5    .performWithCompletion(nullable PNRemoveMessageActionCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringChannel name of the target message.`messageTimetoken` *Type: NSNumberTimetoken of the target message.`actionTimetoken` *Type: NSNumberTimetoken of the message action to remove.`block`Type: PNRemoveMessageActionCompletionBlockCompletion block.

### Sample code

```
`1self.client.removeMessageAction()  
2    .channel("chat")  
3    .messageTimetoken(@(1234567890))  
4    .actionTimetoken(@(1234567891))  
5    .performWithCompletion(^(PNCreateSpaceStatus *status) {  
6        if (!status.isError) {  
7            // Message action successfully removed.  
8        } else {  
9            /**  
10             * Handle remove message action error. Check 'category' property to find out possible  
11             * issue because of which request did fail.  
12             *  
13             * Request can be resent using: [status retry]  
14             */  
15        }  
16    });  
`
```
show all 16 lines

### Response

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
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

---

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Fetch message actions for a channel; actions are sorted by **action timetoken ascending**.

### Method(s)

Use this Objective-C method:

```
`1- (void)fetchMessagesActionsWithRequest:(PNFetchMessagesActionsRequest *)request   
2                             completion:(PNFetchMessageActionsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchMessageActionsRequest](#pnfetchmessageactionsrequest)Request with parameters to fetch message actions.`block` *Type: PNFetchMessageActionsCompletionBlockCompletion block.

#### PNFetchMessageActionsRequest

*  requiredParameterDescription`start` *Type: NSNumberMessage action timetoken for the start of the range (exclusive).`end` *Type: NSNumberMessage action timetoken for the end of the range (inclusive).`limit` *Type: NSUIntegerNumber of message actions to return.`channel` *Type: NSStringChannel name to list message actions for.

### Sample code

```
1PNFetchMessageActionsRequest *request = [PNFetchMessageActionsRequest requestWithChannel:@"chat"];  
2request.start = @(1234567891);  
3request.limit = 200;  
4
  
5[self.client fetchMessageActionsWithRequest:request  
6                                 completion:^(PNFetchMessageActionsResult *result,  
7                                              PNErrorStatus *status) {  
8
  
9    if (!status.isError) {  
10        /**  
11         * Message actions successfully fetched.  
12         * Result object has following information:  
13         *     result.data.actions - list of message action instances  
14         *     result.data.start - fetched messages actions time range start (oldest message  
15         *         action timetoken).  
16         *     result.data.end - fetched messages actions time range end (newest action timetoken).  
17         */  
18    } else {  
19        /**  
20         * Handle fetch message actions error. Check 'category' property to find out possible  
21         * issue because of which request did fail.  
22         *  
23         * Request can be resent using: [status retry]  
24         */  
25    }  
26}];  

```
show all 26 lines

### Response

```
1@interface PNFetchMessageActionsData : PNServiceData  
2
  
3// List of fetched messages actions.  
4@property (nonatomic, readonly, strong) NSArrayPNMessageAction *> *actions;  
5
  
6/**  
7 * Fetched messages actions time range start (oldest message action timetoken).  
8 *  
9 * This timetoken can be used as 'start' value to fetch older messages actions.  
10 */  
11@property (nonatomic, readonly, strong) NSNumber *start;  
12
  
13// Fetched messages actions time range end (newest action timetoken).  
14@property (nonatomic, readonly, strong) NSNumber *end;  
15
  
16@end  
17
  
18@interface PNFetchMessageActionsResult : PNResult  
19
  
20// Fetch message actions request processed information.  
21@property (nonatomic, readonly, strong) PNFetchMessageActionsData *data;  
22
  
23@end  

```
show all 23 lines

Error response which is used in case of Message Action API call failure:

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

---

## Get Message Reactions (builder pattern)

##### Requires Message Persistence
Message Persistence must be [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) in the [Admin Portal](https://admin.pubnub.com/).

Fetch message actions for a `channel`; returns actions sorted by action timetoken ascending.

### Method(s)

To Get Message Actions you can use the following method(s) in the Objective-C SDK:

```
`1fetchMessageActions()  
2    .channel(NSString *)  
3    .start(NSNumber *)  
4    .end(NSNumber *)  
5    .limit(NSUInteger)  
6    .performWithCompletion(PNFetchMessageActionsCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which list of messages `actions` should be retrieved.`start`Type: NSNumberMessage action timetoken denoting the start of the range requested. Return values will be less than start.`end`Type: NSNumberMessage action timetoken denoting the end of the range requested. Return values will be greater than or equal to end.`limit`Type: NSUIntegerNumber of message actions to return in response.`block` *Type: PNFetchMessageActionsCompletionBlock`Fetch message actions` request completion `block`.

### Sample code

```
1self.client.fetchMessageActions()  
2    .channel(@"chat")  
3    .start(@(1234567891))  
4    .limit(200)  
5    .performWithCompletion(^(PNFetchMessageActionsResult *result,  
6                             NErrorStatus *status) {  
7
  
8        if (!status.isError) {  
9            /**  
10             * Message action successfully added.  
11             * Result object has following information:  
12             *     result.data.actions - list of message action instances  
13             *     result.data.start - fetched messages actions time range start (oldest message  
14             *         action timetoken).  
15             *     result.data.end - fetched messages actions time range end (newest action timetoken).  
16             */  
17        } else {  
18            /**  
19             * Handle fetch message actions error. Check 'category' property to find out possible  
20             * issue because of which request did fail.  
21             *  
22             * Request can be resent using: [status retry]  
23             */  
24        }  
25    });  

```
show all 25 lines

### Response

Response objects which is returned by client when `fetch message actions` Message Action API is used:

```
1@interface PNFetchMessageActionsData : PNServiceData  
2
  
3// List of fetched messages actions.  
4@property (nonatomic, readonly, strong) NSArrayPNMessageAction *> *actions;  
5
  
6/**  
7 * Fetched messages actions time range start (oldest message action timetoken).  
8 *  
9 * This timetoken can be used as 'start' value to fetch older messages actions.  
10 */  
11@property (nonatomic, readonly, strong) NSNumber *start;  
12
  
13// Fetched messages actions time range end (newest action timetoken).  
14@property (nonatomic, readonly, strong) NSNumber *end;  
15
  
16@end  
17
  
18@interface PNFetchMessageActionsResult : PNResult  
19
  
20// Fetch message actions request processed information.  
21@property (nonatomic, readonly, strong) PNFetchMessageActionsData *data;  
22
  
23@end  

```
show all 23 lines

Error response which is used in case of Message Action API call failure:

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
**16@end  

```
show all 16 lines

Last updated on Sep 3, 2025