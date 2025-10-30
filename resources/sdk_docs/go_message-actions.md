# Message Actions API for Go SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Clients subscribe to a channel to receive message action events and can fetch past actions from Message Persistence.

##### Reactions
"Message Reactions" is a specific use of Message Actions for emoji/social reactions. In PubNub Core and Chat SDKs, the same underlying API may be referred to as Message Reactions when used for emojis.

## Add message action

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
- Action (pubnub.MessageAction): Message action payload containing:
  - ActionType (type)
  - ActionValue (value)

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.
```
1
  

```

### Returns

AddMessageAction() returns PNAddMessageActionsResponse:
- Data (PNMessageActionsResponse)

PNMessageActionsResponse:
- ActionType (string): Message action type.
- ActionValue (string): Message action value.
- ActionTimetoken (string): Timetoken when the action was added.
- MessageTimetoken (string): Timetoken of the target message.

## Remove message action

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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

RemoveMessageAction() returns PNRemoveMessageActionsResponse:
- Data (interface): Empty object.

## Get message actions

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get a list of message actions in a channel. Results are sorted by action timetoken (ascending).

Truncated response:
If internal limits are hit, the response may include a more property with additional parameters. Use these to paginate and fetch more actions.

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
- Start (string): Message action timetoken for the start of the range (exclusive).
- End (string): Message action timetoken for the end of the range (inclusive).
- Limit (int): Number of actions to return.

### Sample code
```
1
  

```

### Returns

GetMessageActions() returns PNGetMessageActionsResponse:
- Data ([]PNMessageActionsResponse)
- More (PNGetMessageActionsMore)

PNGetMessageActionsMore:
- URL (string): URL of the next set of results.
- Start (string): Start parameter for the next set of results.
- End (string): End parameter for the next set of results.
- Limit (int): Limit for the next set of results.

Last updated on Oct 29, 2025