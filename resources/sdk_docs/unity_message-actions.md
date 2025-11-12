# Message Actions API for Unity SDK

Use Message Actions to add/remove metadata on published messages (receipts, delivery confirmations, reactions). Subscribe to channels to receive action events. Fetch past message actions via Message Persistence, independently or with original messages.

- Reactions: A common use of Message Actions for emoji/social reactions.
- Message Actions vs. Message Reactions: Same underlying API; “Message Reactions” refers to using it for emoji reactions in Core/Chat SDKs.

## Add message action

Requires Message Persistence enabled for your key in the Admin Portal.

Add an action to a published message. Response includes the added action.

### Method(s)

Use this Unity method:

```
pubnub.AddMessageAction()
    .Channel(string)
    .MessageTimetoken(long)
    .Action(PNMessageAction)
    .Execute(System.Action<PNAddMessageActionResult, PNStatus>);
```

- Channel (string): Channel name to add the message action to.
- MessageTimetoken (long): Timetoken of the target message.
- Action (PNMessageAction): Message action payload.
- Execute (System.Action<PNAddMessageActionResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNAddMessageActionResult>>.

#### PNMessageAction

- Type (string): Message action type.
- Value (string): Message action value.

### Returns

PNAddMessageActionResult:
- MessageTimetoken (long): Timetoken of the message associated with the action.
- ActionTimetoken (long): Timetoken of the message action.
- Action (PNMessageAction):
  - Type (string)
  - Value (string)
- Uuid (string): UUID associated with the message action.

```
{
  "MessageTimetoken": 15610547826969050,
  "ActionTimetoken": 15610547826970050,
  "Action": {
    "type": "reaction",
    "value": "smiley_face"
  },
  "Uuid": "user-456"
}
```

## Remove message action

Requires Message Persistence enabled for your key in the Admin Portal.

Remove a previously added action from a published message. Response is empty.

### Method(s)

Use this Unity method:

```
pubnub.RemoveMessageAction()
    .Channel(string)
    .MessageTimetoken(long)
    .ActionTimetoken(long)
    .Uuid(string)
    .Execute(System.Action<PNRemoveMessageActionResult, PNStatus>);
```

- Channel (string): Channel name to remove the message action from.
- MessageTimetoken (long): Publish timetoken of the original message.
- ActionTimetoken (long): Publish timetoken of the message action to remove.
- Uuid (string): UUID of the message.
- Execute (System.Action<PNRemoveMessageActionResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNRemoveMessageActionResult>>.

### Returns

No actionable data.

## Get message actions

Requires Message Persistence enabled for your key in the Admin Portal.

Get a list of message actions in a channel, sorted by action timetoken ascending.

- Truncated response: When limits are hit, a more object is returned. Use its values to paginate.

### Method(s)

Use this Unity method:

```
pubnub.GetMessageActions()
    .Channel(string)
    .Start(long)
    .End(long)
    .Limit(int)
    .Execute(System.Action<PNGetMessageActionsResult, PNStatus>);
```

- Channel (string): Channel name.
- Start (long): Action timetoken start (inclusive).
- End (long): Action timetoken end (exclusive).
- Limit (int): Number of actions to return. Default/Max: 100.
- Execute (System.Action<PNGetMessageActionsResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNGetMessageActionsResult>>.

### Returns

PNGetMessageActionsResult:
- MessageActions (List<PNMessageActionItem>): List of actions.
- More (MoreInfo): Pagination info.

PNMessageActionItem:
- MessageTimetoken (long): Timetoken of the message.
- Action (PNMessageAction):
  - Type (string)
  - Value (string)
- Uuid (string): UUID associated with the action.
- ActionTimetoken (long): Timetoken of the action.

More:
- Start (long): Start timetoken of requested range.
- End (long): End timetoken of requested range.
- Limit (int): Number of actions returned.

```
{
  "MessageActions": [
    {
      "MessageTimetoken": 15610547826969050,
      "Action": {
        "type": "reaction",
        "value": "smiley_face"
      },
      "Uuid": "pn-5903a053-592c-4a1e-8bfd-81d92c962968",
      "ActionTimetoken": 15717253483027900
    }
  ],
  "More": {
    "Start": 15610547826970050,
    "End": 15645905639093361,
    "Limit": 2
  }
}
```