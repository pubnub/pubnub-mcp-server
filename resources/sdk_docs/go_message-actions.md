# Message Actions API – Go SDK (Condensed)

Message Actions let you attach, fetch, and remove metadata (reactions, receipts, etc.) on any published message.

**All methods below require Message Persistence to be enabled for your keys.**

---

## Add Message Reaction

Adds an action to an existing message and returns the added action.

### Method

```go
`pn.AddMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    Action(pubnub.MessageAction).  
    Execute()  
`
```

Parameters  
• Channel (string) – target channel  
• MessageTimetoken (string) – timetoken of the parent message  
• Action (pubnub.MessageAction)  
  • ActionType (max 15 chars)  
  • ActionValue (max 40 chars)

### Sample

```go
package main

import (
	"fmt"
	"log"

	pubnub "github.com/pubnub/go/v7"
)

func main() {
	// Configure the PubNub instance with demo keys
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey  = "demo"
	...
}
```
(show all 45 lines)

### Returns

`PNAddMessageActionsResponse`  
• Data – PNMessageActionsResponse  

`PNMessageActionsResponse`  
• ActionType (string)  
• ActionValue (string)  
• ActionTimetoken (string)  
• MessageTimetoken (string)

---

## Remove Message Reaction

Removes a previously added action and returns an empty response.

### Method

```go
`pn.RemoveMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    ActionTimetoken(string).  
    Execute()  
`
```

Parameters  
• Channel (string) – target channel  
• MessageTimetoken (string) – parent message timetoken  
• ActionTimetoken (string) – timetoken of the action to remove

### Sample

```go
`res, status, err := pn.RemoveMessageAction()  
    .Channel("my-channel")  
    .MessageTimetoken("15698453963258802")  
    .ActionTimetoken("15698453963258812")  
    .Execute()  
`
```

### Returns

`PNRemoveMessageActionsResponse`  
• Data – empty interface

---

## Get Message Reactions

Lists message actions on a channel, sorted by action timetoken (ascending).  
Responses can be truncated; use the More object to paginate.

### Method

```go
`pn.GetMessageActions().  
    Channel(string).  
    Start(string).  
    End(string).  
    Limit(int).  
    Execute()  
`
```

Parameters  
• Channel (string) – target channel  
• Start (string) – return actions with timetoken < start  
• End (string) – return actions with timetoken ≥ end  
• Limit (int) – max actions to return

### Sample

```go
`res, status, err := pn.GetMessageActions()  
    .Channel("my-channel")  
    .Start("15698453963258812")  
    .End("15698453963258811")  
    .Execute()  
`
```

### Returns

`PNGetMessageActionsResponse`  
• Data – []PNMessageActionsResponse  
• More – PNGetMessageActionsMore (pagination)

`PNGetMessageActionsMore`  
• URL (string) – next page endpoint  
• Start (string)  
• End (string)  
• Limit (int)

_Last updated: Jul 15 2025_