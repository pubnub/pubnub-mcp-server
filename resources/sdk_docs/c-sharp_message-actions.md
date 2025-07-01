# Message Actions API (C# SDK)

Attach, remove, or query metadata (reactions, receipts, custom data) on stored messages.  
All Message Action operations require **Message Persistence** to be enabled for the key.

---

##### Request execution pattern (recommended)

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
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
`
```

---

## Add Message Action

Add an action to an existing message. Returns `PNAddMessageActionResult`.

### Method

```
`pubnub.AddMessageAction()  
        .Channel(string)  
        .MessageTimetoken(long)  
        .Action(PNMessageAction)  
`
```

Parameter | Type | Description
--- | --- | ---
Channel | string | Target channel.
MessageTimetoken | long | Timetoken of the original message.
Action | PNMessageAction | Action payload.

#### PNMessageAction

Field | Type | Description
--- | --- | ---
Type | string | Action type (e.g., `reaction`).
Value | string | Action value (e.g., `smiley_face`).

#### Basic Usage
```
`  
`
```

#### Returns
```
`{  
    "MessageTimetoken":15610547826969050,  
    "ActionTimetoken":15610547826970050,  
    "Action":{  
        "type":"reaction",  
        "value":"smiley_face"  
    },  
    "Uuid":"user-456"  
}  
`
```

---

## Remove Message Action

Remove a previously added action. Returns an empty payload.

### Method
```
`pubnub.RemoveMessageAction()  
        .Channel(string)  
        .MessageTimetoken(long)  
        .ActionTimetoken(long)  
        .Uuid(string)  
`
```

Parameter | Type | Description
--- | --- | ---
Channel | string | Target channel.
MessageTimetoken | long | Timetoken of the original message.
ActionTimetoken | long | Timetoken of the action to remove.
Uuid | string | UUID that added the action (required when Access Manager is enabled).

#### Basic Usage
```
`  
`
```

---

## Get Message Actions

Fetch actions on a channel, sorted by `ActionTimetoken` ascending.  
If the result is truncated a `more` object is included for pagination.

### Method
```
`pubnub.GetMessageActions()  
        .Channel(string)  
        .Start(long)  
        .End(long)  
        .Limit(int)  
`
```

Parameter | Type | Default | Description
--- | --- | --- | ---
Channel | string | — | Channel to query.
Start | long | — | Return actions with timetoken &lt; `start`.
End | long | — | Return actions with timetoken ≥ `end`.
Limit | int | 100 | Max actions to return (1-100).

#### Basic Usage
```
`  
`
```

#### Returns
```
`{**"MessageActions":  
    [{  
    "MessageTimetoken":15610547826969050,  
    "Action":{  
        "type":"reaction",  
        "value":"smiley_face"  
    },  
    "Uuid":"pn-5903a053-592c-4a1e-8bfd-81d92c962968",  
    "ActionTimetoken":15717253483027900  
    }],  
"More": {  
        "Start": 15610547826970050,  
        "End": 15645905639093361,  
        "Limit": 2  
`
```

_Last updated: Jun 30 2025_