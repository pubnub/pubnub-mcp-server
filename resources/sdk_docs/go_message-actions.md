# Message Actions – Go SDK

Interact with metadata (reactions, receipts, custom data) attached to messages. All APIs below require **Message Persistence to be enabled for the key**.

## Terminology  
• Message Actions – low-level, generic metadata API  
• Message Reactions – same API when used specifically for emoji/social reactions  

---

## Add Message Action

Adds metadata to an existing message.

### Method

```
`pn.AddMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    Action(pubnub.MessageAction).  
    Execute()  
`
```

### Required parameters  
• Channel (string) – target channel  
• MessageTimetoken (string) – timetoken of the parent message  
• Action (pubnub.MessageAction) – struct with:  
  – ActionType (≤15 chars)  
  – ActionValue (≤40 chars)

### Example

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
`
```

### Returns – PNAddMessageActionsResponse  
• Data (PNMessageActionsResponse)

---

## Remove Message Action

Deletes a previously added action.

### Method

```
`pn.RemoveMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    ActionTimetoken(string).  
    Execute()  
`
```

### Required parameters  
• Channel (string) – target channel  
• MessageTimetoken (string) – parent message timetoken  
• ActionTimetoken (string) – timetoken of the action

### Example

```
`res, status, err := pn.RemoveMessageAction()  
    .Channel("my-channel")  
    .MessageTimetoken("15698453963258802")  
    .ActionTimetoken("15698453963258812")  
    .Execute()  
`
```

### Returns – PNRemoveMessageActionsResponse  
• Data (interface{}) – empty

---

## Get Message Actions

Lists actions on a channel, sorted by action timetoken (asc). Responses may be paginated via the `more` field.

### Method

```
`pn.GetMessageActions().  
    Channel(string).  
    Start(string).  
    End(string).  
    Limit(int).  
    Execute()  
`
```

### Parameters  
• Channel (string) – target channel (required)  
• Start (string) – return actions with timetoken < start  
• End (string) – return actions with timetoken ≥ end  
• Limit (int) – max actions to return

### Example

```
`res, status, err := pn.GetMessageActions()  
    .Channel("my-channel")  
    .Start("15698453963258812")  
    .End("15698453963258811")  
    .Execute()  
`
```

### Returns – PNGetMessageActionsResponse  
• Data ([]PNMessageActionsResponse)  
• More (PNGetMessageActionsMore)

---

## Data Structures

### PNMessageActionsResponse  
• ActionType (string) – feature identifier  
• ActionValue (string) – metadata value  
• ActionTimetoken (string) – when the action was added  
• MessageTimetoken (string) – parent message timetoken  

### PNGetMessageActionsMore  
• URL (string) – next page endpoint  
• Start (string) – `start` for next call  
• End (string) – `end` for next call  
• Limit (int) – limit for next call