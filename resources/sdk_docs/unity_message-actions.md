# Message Actions API – Unity SDK (Condensed)

Message Actions let you attach metadata (reactions, read receipts, etc.) to any published message and subscribe or fetch them later.  
⚠️ Requires **Message Persistence** enabled for your key.

---

## Add Message Action

Adds an action to an existing message. Returns `PNAddMessageActionResult`.

```csharp
pubnub.AddMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .Action(PNMessageAction)  
    .Execute(System.Action<PNAddMessageActionResult, PNStatus>)  
```
• Channel (string) – Target channel.  
• MessageTimetoken (long) – Timetoken of the original message.  
• Action (PNMessageAction) – Payload (see below).  
• Execute/ExecuteAsync – Callback / `Task<PNResult<PNAddMessageActionResult>>`.

### PNMessageAction

| Field | Type | Description |
|-------|------|-------------|
| Type  | string | Action type. |
| Value | string | Action value. |

### Example

```csharp
using PubnubApi;
using PubnubApi.Unity;
using UnityEngine;

public class AddMessageActionExample : MonoBehaviour {
    [SerializeField] private PNManagerBehaviour pubnubManager;
    [SerializeField] private string channelId = "my_channel";
    [SerializeField] private long messageTimetoken = 5610547826969050;
}
```

### Returns (`PNAddMessageActionResult`)

| Property | Type | Description |
|----------|------|-------------|
| MessageTimetoken | long | Timetoken of the message. |
| ActionTimetoken  | long | Timetoken of this action. |
| Action → Type    | string | Action type. |
| Action → Value   | string | Action value. |
| Uuid             | string | UUID that added the action. |

```json
{
  "MessageTimetoken": 15610547826969050,
  "ActionTimetoken": 15610547826970050,
  "Action": { "type": "reaction", "value": "smiley_face" },
  "Uuid": "user-456"
}
```

---

## Remove Message Action

Deletes a previously added action. Returns an empty result.

```csharp
pubnub.RemoveMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .ActionTimetoken(long)  
    .Uuid(string)  
    .Execute(System.Action<PNRemoveMessageActionResult, PNStatus>)  
```
• Channel (string) – Channel.  
• MessageTimetoken (long) – Original message timetoken.  
• ActionTimetoken (long) – Timetoken of the action to remove.  
• Uuid (string) – UUID of the actor.  
• Execute/ExecuteAsync – Callback / `Task<PNResult<PNRemoveMessageActionResult>>`.

### Example

```csharp
pubnub.RemoveMessageAction()
    .Channel("my_channel")
    .MessageTimetoken(15701761818730000)
    .ActionTimetoken(15701775691010000)
    .Uuid("mytestuuid")
    .Execute(new PNRemoveMessageActionResult((result, status) => {
        // empty result
    }));
```

---

## Get Message Actions

Fetches actions for a channel, sorted by `ActionTimetoken` ascending. May be paginated via `More`.

```csharp
pubnub.GetMessageActions()  
    .Channel(string)  
    .Start(long)      // optional
    .End(long)        // optional
    .Limit(int)       // default/max 100
    .Execute(System.Action<PNGetMessageActionsResult, PNStatus>)  
```
• Execute/ExecuteAsync – Callback / `Task<PNResult<PNGetMessageActionsResult>>`.

### Example

```csharp
pubnub.GetMessageActions()
    .Channel("my_channel")
    .Execute(new PNGetMessageActionsResult((result, status) => {
        // handle result
    }));
```

### Returns (`PNGetMessageActionsResult`)

| Property | Type | Description |
|----------|------|-------------|
| MessageActions | List<PNMessageActionItem> | Action list. |
| More           | MoreInfo                 | Pagination details. |

`PNMessageActionItem`  

| Field | Type | Description |
|-------|------|-------------|
| MessageTimetoken | long   | Timetoken of parent message. |
| Action → Type    | string | Action type. |
| Action → Value   | string | Action value. |
| Uuid             | string | UUID that added the action. |
| ActionTimetoken  | long   | Timetoken of the action. |

`MoreInfo`  

| Field | Type | Description |
|-------|------|-------------|
| Start | long | Start of range. |
| End   | long | End of range. |
| Limit | int  | Returned count. |

```json
{
  "MessageActions": [{
    "MessageTimetoken": 15610547826969050,
    "Action": { "type": "reaction", "value": "smiley_face" },
    "Uuid": "pn-5903a053-592c-4a1e-8bfd-81d92c962968",
    "ActionTimetoken": 15717253483027900
  }],
  "More": {
    "Start": 15610547826970050,
    "End": 15645905639093361,
    "Limit": 2
  }
}
```

_Last updated: Jun 10 2025_