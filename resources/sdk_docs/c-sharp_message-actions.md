# Message Actions API (C# SDK)

Add, remove, and fetch actions (reactions, receipts, custom metadata) attached to published messages.

---

## Usage Notes
* Message Persistence **must be enabled** for all Message Action operations.  
* Always wrap SDK calls in `try / catch`. Build-time parameter errors throw exceptions; runtime/server/network errors are in `status`.

```csharp
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    PNStatus status = publishResponse.Status;
    Console.WriteLine("Server status code : " + status.StatusCode);
}
catch (Exception ex)
{
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```

---

## Add Message Reaction

```csharp
pubnub.AddMessageAction()
      .Channel(string)              // target channel
      .MessageTimetoken(long)       // timetoken of the original message
      .Action(PNMessageAction)      // action payload
```

### PNMessageAction
* `Type`  (string) – action type, e.g. `"reaction"`.
* `Value` (string) – action value, e.g. `"smiley_face"`.

### Return
```json
{
  "MessageTimetoken": 15610547826969050,
  "ActionTimetoken":  15610547826970050,
  "Action": { "type": "reaction", "value": "smiley_face" },
  "Uuid": "user-456"
}
```

---

## Remove Message Reaction

```csharp
pubnub.RemoveMessageAction()
      .Channel(string)             // channel of the original message
      .MessageTimetoken(long)      // timetoken of the original message
      .ActionTimetoken(long)       // timetoken of the action to remove
      .Uuid(string)                // UUID that added the action
```

Return: no content (empty response).

---

## Get Message Reactions

```csharp
pubnub.GetMessageActions()
      .Channel(string)             // channel to query
      .Start(long)                 // (optional) fetch actions < this timetoken
      .End(long)                   // (optional) fetch actions ≥ this timetoken
      .Limit(int)                  // default/max 100
```

Results are ordered by `ActionTimetoken` ascending.  
If paging is required, the response includes a `More` object—pass its values to subsequent calls.

### Return (truncated example)
```json
{
  "MessageActions": [
    {
      "MessageTimetoken": 15610547826969050,
      "Action": { "type": "reaction", "value": "smiley_face" },
      "Uuid": "pn-5903a053-592c-4a1e-8bfd-81d92c962968",
      "ActionTimetoken": 15717253483027900
    }
  ],
  "More": {
    "Start": 15610547826970050,
    "End":   15645905639093361,
    "Limit": 2
  }
}
```

_Last updated: Jul 15 2025_