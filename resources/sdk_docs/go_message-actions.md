# Message Actions API for Go SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Clients subscribe to a channel to receive message action events and can fetch past message actions from Message Persistence.

##### Reactions

"Message Reactions" is a specific application of the Message Actions API for emoji or social reactions.

##### Message Actions vs. Message Reactions

- Message Actions: low-level API for adding metadata to messages (read receipts, delivery confirmations, custom data).
- Message Reactions: using Message Actions specifically for emoji/social reactions.
- In PubNub Core and Chat SDKs, the same API is referred to as Message Reactions when used for emoji reactions.

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
- Action (pubnub.MessageAction): Message action payload with:
  - ActionType (type)
  - ActionValue (value)

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

The AddMessageAction() operation returns a PNAddMessageActionsResponse:
- Data (PNMessageActionsResponse): See PNMessageActionsResponse.

#### PNMessageActionsResponse[​](#pnmessageactionsresponse)

- ActionType (string): Message action type.
- ActionValue (string): Message action value.
- ActionTimetoken (string): Timetoken when the action was added.
- MessageTimetoken (string): Timetoken of the target message.

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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

The RemoveMessageAction() operation returns a PNRemoveMessageActionsResponse:
- Data (interface): Empty object.

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal: https://admin.pubnub.com/ (see support article: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get a list of message actions in a channel. The response sorts actions by the action timetoken in ascending order.

##### Truncated response

When internal limits are hit, the response may be truncated and include a more object with additional parameters. Make iterative calls, adjusting the provided parameters to fetch more actions.

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
- Start (string): Message action timetoken for the start of the range (exclusive).
- End (string): Message action timetoken for the end of the range (inclusive).
- Limit (int): Number of actions to return.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

The GetMessageActions() operation returns a PNGetMessageActionsResponse:
- Data ([]PNMessageActionsResponse): See PNMessageActionsResponse.
- More (PNGetMessageActionsMore): See PNGetMessageActionsMore.

#### PNGetMessageActionsMore[​](#pngetmessageactionsmore)

- URL (string): URL of the next set of results.
- Start (string): Start parameter for the next set of results.
- End (string): End parameter for the next set of results.
- Limit (int): Limit for the next set of results.

Last updated on Oct 29, 2025