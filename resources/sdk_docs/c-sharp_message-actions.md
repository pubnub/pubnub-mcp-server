# Message Actions API for C# SDK

Use Message Actions to add or remove metadata on published messages (for example, receipts and reactions). Subscribe to channels to receive message action events. You can also fetch past actions from Message Persistence.

- Message Reactions: an application of Message Actions for emoji/social reactions; same underlying API.

## Request execution

Use try/catch with C# SDK. Invalid parameters throw an exception. Server/network errors are available in the returned status.

```
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    PNStatus status = publishResponse.Status;
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());
}
catch (Exception ex)
{
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```

## Add message action

Requires Message Persistence (enable in Admin Portal).

Add an action to a published message. The response includes the added action.

### Method(s)

```
pubnub.AddMessageAction()
    .Channel(string)
    .MessageTimetoken(long)
    .Action(PNMessageAction)
```

Parameters:
- Channel (string): Channel name to add the message action to.
- MessageTimetoken (long): Timetoken of the target message.
- Action (PNMessageAction): Message action payload.

#### PNMessageAction

- Type (string): Message action type.
- Value (string): Message action value.

### Returns

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

Requires Message Persistence (enable in Admin Portal).

Remove a previously added action from a published message. The response is empty.

### Method(s)

```
pubnub.RemoveMessageAction()
    .Channel(string)
    .MessageTimetoken(long)
    .ActionTimetoken(long)
    .Uuid(string)
```

Parameters:
- Channel (string): Channel name to remove the message action from.
- MessageTimetoken (long): Timetoken of the target message.
- ActionTimetoken (long): Timetoken of the message action to remove.
- Uuid (string): UUID of the message.

### Returns

The RemoveMessageAction() operation returns no actionable data.

## Get message actions

Requires Message Persistence (enable in Admin Portal).

Get a list of message actions in a channel. Results are sorted by action timetoken (ascending).

Truncated responses: If internal limits are hit, a More object is returned with parameters to paginate. Make iterative calls using those parameters to fetch more actions.

### Method(s)

```
pubnub.GetMessageActions()
    .Channel(string)
    .Start(long)
    .End(long)
    .Limit(int)
```

Parameters:
- Channel (string): Channel name to list message actions for.
- Start (long): Message action timetoken for the start of the range (exclusive).
- End (long): Message action timetoken for the end of the range (inclusive).
- Limit (int): Maximum number of actions to return. Default/Maximum is 100.

### Returns

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