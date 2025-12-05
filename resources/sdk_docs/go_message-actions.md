# Message Actions API for Go SDK

Use message actions to add or remove metadata (receipts, reactions, custom data) on published messages. Subscribe to channels to receive message action events, and fetch past actions from Message Persistence.

Requires Message Persistence: Enable in the Admin Portal as described in the support article.

##### Reactions

“Message Reactions” is the use of Message Actions for emoji/social reactions. It’s the same underlying API in PubNub Core and Chat SDKs.

## Add message action[​](#add-message-action)

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

Use this Go method:

```
`1pn.AddMessageAction().  
2    Channel(string).  
3    MessageTimetoken(string).  
4    Action(pubnub.MessageAction).  
5    Execute()  
`
```

Parameters:
- Channel (string): Channel name to add the message action to.
- MessageTimetoken (string): Timetoken of the target message.
- Action (pubnub.MessageAction): Payload with ActionType (type) and ActionValue (value).

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns[​](#returns)

AddMessageAction() returns PNAddMessageActionsResponse:
- Data (PNMessageActionsResponse): See PNMessageActionsResponse.

#### PNMessageActionsResponse[​](#pnmessageactionsresponse)

- ActionType (string): Message action type.
- ActionValue (string): Message action value.
- ActionTimetoken (string): Timetoken when the action was added.
- MessageTimetoken (string): Timetoken of the target message.

## Remove message action[​](#remove-message-action)

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

Use this Go method:

```
`1pn.RemoveMessageAction().  
2    Channel(string).  
3    MessageTimetoken(string).  
4    ActionTimetoken(string).  
5    Execute()  
`
```

Parameters:
- Channel (string): Channel name to remove the message action from.
- MessageTimetoken (string): Timetoken of the target message.
- ActionTimetoken (string): Timetoken of the message action to remove.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

RemoveMessageAction() returns PNRemoveMessageActionsResponse:
- Data (interface): Empty object.

## Get message actions[​](#get-message-actions)

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

##### Truncated response

If results are truncated, the response includes a more property. Use it to page by adjusting parameters for subsequent requests.

### Method(s)[​](#methods-2)

Use this Go method:

```
`1pn.GetMessageActions().  
2    Channel(string).  
3    Start(string).  
4    End(string).  
5    Limit(int).  
6    Execute()  
`
```

Parameters:
- Channel (string): Channel name to list message actions for.
- Start (string): Action timetoken for start of range (exclusive).
- End (string): Action timetoken for end of range (inclusive).
- Limit (int): Number of actions to return.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

GetMessageActions() returns PNGetMessageActionsResponse:
- Data ([]PNMessageActionsResponse): See PNMessageActionsResponse.
- More (PNGetMessageActionsMore): See PNGetMessageActionsMore.

#### PNGetMessageActionsMore[​](#pngetmessageactionsmore)

- URL (string): URL of the next set of results.
- Start (string): Start parameter for the next set of results.
- End (string): End parameter for the next set of results.
- Limit (int): Limit for the next set of results.

Last updated on Oct 29, 2025