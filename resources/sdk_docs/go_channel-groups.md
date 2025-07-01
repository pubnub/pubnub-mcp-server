# Channel Groups API – Go SDK (Concise Reference)

Channel Groups let you subscribe to sets of channels. Publishing must be done on individual channels.  
All operations below require the **Stream Controller** add-on to be enabled for your key.

---

## Add Channels

### Method
```go
pn.AddChannelToChannelGroup().
    Channels([]string).
    ChannelGroup(string).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* Channels ([]string, required) – channels to add.  
* ChannelGroup (string, required) – target channel group.  
* QueryParam (map[string]string) – custom query string values.

Maximum: 200 channels per call.

### Basic Usage (stand-alone)
```go
package main

import (
	"fmt"
	"log"

	pubnub "github.com/pubnub/go/v7"
)

func main() {
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey  = "demo"

	// initialise PubNub client
	// ...
}
```
(see full 37-line example in original docs)

### Response
```json
{
  "service": "channel-registry",
  "status": 200,
  "error": false,
  "message": "OK"
}
```

---

## List Channels

### Method
```go
pn.ListChannelsInChannelGroup().
    ChannelGroup(string).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* ChannelGroup (string, required) – channel group to query.  
* QueryParam (map[string]string) – custom query string values.

### Basic Usage
```go
pn.ListChannelsInChannelGroup().
    ChannelGroup("cg").
    Execute()
```

### Response
| Field    | Type     |
|----------|----------|
| Channels | []string |
| Group    | string   |

---

## Remove Channels

### Method
```go
pn.RemoveChannelFromChannelGroup().
    ChannelGroup(string).
    Channels([]string).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* ChannelGroup (string, required) – group to remove channels from.  
* Channels ([]string, required) – channels to remove.  
* QueryParam (map[string]string) – custom query string values.

### Basic Usage
```go
pn.RemoveChannelFromChannelGroup().
    ChannelGroup("cg").
    Channels([]string{"ch1", "ch2"}).
    Execute()
```

### Response
```text
{
    Error:nil>
    Category:Unknown
    Operation:Remove Channel From Channel Group
    StatusCode:200
    TLSEnabled:true
    UUID:d9713e5a-6bcb-439a-942e-5ba064f2e5dd
    AuthKey:
    Origin:ps.pndsn.com
    OriginalResponse:{
        "status":200,
        "message":"OK",
        "service":"channel-registry",
        "error":false
    }
}
```

---

## Delete Channel Group

### Method
```go
pn.DeleteChannelGroup().
    ChannelGroup(string).
    QueryParam(queryParam).
    Execute()
```

Parameters  
* ChannelGroup (string, required) – group to delete.  
* QueryParam (map[string]string) – custom query string values.

### Basic Usage
```go
pn.DeleteChannelGroup().
    ChannelGroup("remove-cg").
    Execute()
```

### Response
```text
{
    Error:nil>
    Category:Unknown
    Operation:Remove Channel Group
    StatusCode:200
    TLSEnabled:true
    UUID:650089a0-922c-4de6-b422-7a38a964bf45
    AuthKey:
    Origin:ps.pndsn.com
    OriginalResponse:{
        "status":200,
        "message":"OK",
        "service":"channel-registry",
        "error":false
    }
}
```

_Last updated: Mar 31 2025_