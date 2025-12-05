# Message Actions API for Unity SDK

Use Message Actions to add/remove metadata on published messages (for reactions, receipts, confirmations, custom data). Subscribe to a channel to receive action events. Fetch past actions from Message Persistence alone or when fetching messages.

- Reactions: Using Message Actions for emoji/social reactions.
- Message Actions vs. Message Reactions: Same underlying API; “Message Reactions” refers to the emoji use case in Core/Chat SDKs.

## Add message action

Requires Message Persistence enabled for your key in the Admin Portal.

Add an action to a published message. Response includes the added action.

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
- Action (PNMessageAction): Message action payload.
- Execute (System.Action): System.Action of type PNAddMessageActionResult.
- ExecuteAsync: Returns Task<PNResult<PNAddMessageActionResult>>.

#### PNMessageAction

- Type (string): Message action type.
- Value (string): Message action value.

### Sample code

Reference code

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

Remove a previously added action from a published message. Response is empty.

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
- Channel (string): Channel name to remove the action from.
- MessageTimetoken (long): Publish timetoken of the original message.
- ActionTimetoken (long): Publish timetoken of the message action to remove.
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

Get a list of message actions in a channel. Sorted by action timetoken ascending.

Truncated response:
- If truncated, response includes a more object. Use its parameters to paginate subsequent requests.

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
- Channel (string): The channel name.
- Start (long): Message Action timetoken for start of range (inclusive).
- End (long): Message Action timetoken for end of range (exclusive).
- Limit (int): Number of actions to return. Default/Max 100.
- Execute (System.Action): System.Action of type PNGetMessageActionsResult.
- ExecuteAsync: Returns Task<PNResult<PNGetMessageActionsResult>>.

### Sample code

```
1
  

```

### Returns

GetMessageActions() returns PNGetMessageActionsResult:
- Message Actions (List<PNMessageActionItem>): List of message actions.
- More (MoreInfo): Pagination info.

PNMessageActionItem:
- MessageTimetoken (long): Timetoken associated with the message.
- Action (PNMessageAction):
  - Type (string)
  - Value (string)
- Uuid (string): UUID associated with the action.
- ActionTimetoken (long): Timetoken associated with the action.

More:
- Start (long): Start timetoken of the range.
- End (long): End timetoken of the range.
- Limit (int): Number of actions returned.

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

Last updated on Sep 3, 2025**