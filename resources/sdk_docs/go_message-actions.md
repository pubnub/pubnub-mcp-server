# Message Actions API for Go SDK

Use message actions to add/remove metadata (receipts, reactions, custom data) on published messages. Subscribe to channels to receive message action events, and fetch past actions from Message Persistence.

##### Reactions
Message Reactions are a specific use of Message Actions for emoji/social reactions. In PubNub Core and Chat SDKs, "Message Reactions" refers to using the same Message Actions API for emoji reactions.

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Add an action to a published message. The response includes the added action.

### Method(s)

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
- Action (pubnub.MessageAction): Message action payload:
  - ActionType (type)
  - ActionValue (value)

### Sample code

##### Reference code
```
1
  
```

### Returns

`AddMessageAction()` returns `PNAddMessageActionsResponse`:
- Data (PNMessageActionsResponse): See PNMessageActionsResponse.

#### PNMessageActionsResponse
- ActionType (string): Message action type.
- ActionValue (string): Message action value.
- ActionTimetoken (string): Timetoken when the action was added.
- MessageTimetoken (string): Timetoken of the target message.

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Remove a previously added action from a published message. The response is empty.

### Method(s)

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

### Sample code
```
1
  
```

### Returns

`RemoveMessageAction()` returns `PNRemoveMessageActionsResponse`:
- Data (interface): Empty object.

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Get a list of message actions in a channel, sorted by action timetoken (ascending).

##### Truncated response
Responses may be truncated. If so, a `more` property is returned with parameters for fetching the next page.

### Method(s)

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
- Start (string): Action timetoken start of range (exclusive).
- End (string): Action timetoken end of range (inclusive).
- Limit (int): Number of actions to return.

### Sample code
```
1
  
```

### Returns

`GetMessageActions()` returns `PNGetMessageActionsResponse`:
- Data ([]PNMessageActionsResponse): See PNMessageActionsResponse.
- More (PNGetMessageActionsMore): See PNGetMessageActionsMore.

#### PNGetMessageActionsMore
- URL (string): URL of the next set of results.
- Start (string): Start parameter for the next set of results.
- End (string): End parameter for the next set of results.
- Limit (int): Limit for the next set of results.

Last updated on Oct 29, 2025