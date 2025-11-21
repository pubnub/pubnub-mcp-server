# Message Actions API for Unity SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Clients subscribe to a channel to receive message action events. Past message actions can be fetched from Message Persistence, either independently or alongside original messages.

- Reactions: "Message Reactions" is a specific use of Message Actions for emoji/social reactions.
- Message Actions vs. Reactions: Message Actions is the low-level, flexible API for arbitrary metadata; Message Reactions refers to using it for emoji reactions. In PubNub Core and Chat SDKs, this same API may be referred to as Message Reactions.

## Add message action

Requires Message Persistence enabled for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)

Use this Unity method:

```
`1pubnub.AddMessageAction()  
2    .Channel(string)  
3    .MessageTimetoken(long)  
4    .Action(PNMessageAction)  
5    .Execute(System.ActionPNAddMessageActionResult, PNStatus>)  
`
```

Parameters:
- Channel (string): Channel name to add the message action to.
- MessageTimetoken (long): Timetoken of the target message.
- Action (PNMessageAction): Message action payload (see PNMessageAction below).
- Execute (System.Action): System.Action of type PNAddMessageActionResult.
- ExecuteAsync: Returns Task<PNResult<PNAddMessageActionResult>>.

#### PNMessageAction

- Type (string): Message action type.
- Value (string): Message action value.

### Sample code

```
1
  

```

### Returns

AddMessageAction() returns PNAddMessageActionResult:
- MessageTimetoken (long): Timetoken of the message associated with the action.
- ActionTimetoken (long): Timetoken of the message action.
- Action (PNMessageAction):
  - Type (string)
  - Value (string)
- Uuid (string): UUID associated with the message action.

```
`1{  
2    "MessageTimetoken":15610547826969050,  
3    "ActionTimetoken":15610547826970050,  
4    "Action":{  
5        "type":"reaction",  
6        "value":"smiley_face"  
7    },  
8    "Uuid":"user-456"  
9}  
`
```

## Remove message action

Requires Message Persistence enabled for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)

Use this Unity method:

```
`1pubnub.RemoveMessageAction()  
2    .Channel(string)  
3    .MessageTimetoken(long)  
4    .ActionTimetoken(long)  
5    .Uuid(string)  
6    .Execute(System.ActionPNRemoveMessageActionResult, PNStatus>)  
`
```

Parameters:
- Channel (string): Channel name to remove the message action from.
- MessageTimetoken (long): Publish timetoken of the original message.
- ActionTimetoken (long): Publish timetoken of the message action to be removed.
- Uuid (string): UUID of the message.
- Execute (System.Action): System.Action of type PNRemoveMessageActionResult.
- ExecuteAsync: Returns Task<PNResult<PNRemoveMessageActionResult>>.

### Sample code

```
1
  

```

### Returns

RemoveMessageAction() returns no actionable data.

## Get message actions

Requires Message Persistence enabled for your key in the Admin Portal.

Get a list of message actions in a channel, sorted by the action’s timetoken in ascending order.

Truncated response: If internal limits are hit, the response may include a more property. Use the provided parameters to issue subsequent calls to page through results.

### Method(s)

Use this Unity method:

```
`1pubnub.GetMessageActions()  
2    .Channel(string)  
3    .Start(long)  
4    .End(long)  
5    .Limit(int)  
6    .Execute(System.ActionPNGetMessageActionsResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): The channel name.
- Start (long, optional, default: n/a): Message Action timetoken marking the start of the requested range (inclusive).
- End (long, optional, default: n/a): Message Action timetoken marking the end of the requested range (exclusive).
- Limit (int, optional, default/max: 100): Number of actions to return.
- Execute (System.Action): System.Action of type PNGetMessageActionsResult.
- ExecuteAsync: Returns Task<PNResult<PNGetMessageActionsResult>>.

### Sample code

```
1
  

```

### Returns

GetMessageActions() returns PNGetMessageActionsResult:
- MessageActions (List<PNMessageActionItem>): List of Message Actions.
- More (MoreInfo): Pagination info.

PNMessageActionItem:
- MessageTimetoken (long): Timetoken of the message.
- Action (PNMessageAction):
  - Type (string)
  - Value (string)
- Uuid (string): UUID associated with the action.
- ActionTimetoken (long): Timetoken of the action.

More:
- Start (long): Timetoken denoting the start of the requested range.
- End (long): Timetoken denoting the end of the requested range.
- Limit (int): Number of Message Actions returned.

```
`1{**2    "MessageActions":  
3    [{  
4        "MessageTimetoken":15610547826969050,  
5    "Action":{  
6        "type":"reaction",  
7        "value":"smiley_face"  
8    },  
9    "Uuid":"pn-5903a053-592c-4a1e-8bfd-81d92c962968",  
10    "ActionTimetoken":15717253483027900  
11    }],  
12    "More": {  
13        "Start": 15610547826970050,  
14        "End": 15645905639093361,  
15        "Limit": 2  
16    }  
17}  
`
```