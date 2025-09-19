# Channel Groups API – Go SDK (Condensed)

Channel Groups bundle up to thousands of channels under one name.  
Note: Groups are subscribe-only; publish directly to individual channels.  
All operations below require the **Stream Controller** add-on to be enabled for your keys.

---

## Add channels

Adds up to **200 channels** to a channel group.

### Method

```go
`pn.AddChannelToChannelGroup().  
    Channels([]string).  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```
* Channels `[]string` – channels to add.  
* ChannelGroup `string` – target group.  
* QueryParam `map[string]string` – optional URL parameters.

### Example

```go
`package main  
  
import (  
    "fmt"  
    "log"  
  
    pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
    // Configuration for PubNub with demo keys  
    config := pubnub.NewConfigWithUserId("myUniqueUserId")  
    config.SubscribeKey = "demo"  
    config.PublishKey = "demo"  
  
`
```  
(show all 37 lines)

### Response

```json
`{  
    "service" : "channel-registry",  
    "status"  : 200,  
    "error"   : false,  
    "message" : "OK"  
}  
`
```

---

## List channels

Returns all channel names in a channel group.

### Method

```go
`pn.ListChannelsInChannelGroup().  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```
* ChannelGroup `string` – group to query.  
* QueryParam `map[string]string` – optional.

### Example

```go
`pn.ListChannelsInChannelGroup().  
    ChannelGroup("cg").  
    Execute()  
`
```

### Response

Method | Description
-------|------------
Channels | `[]string`
Group    | `string`

---

## Remove channels

Removes specific channels from a channel group.

### Method

```go
`pn.RemoveChannelFromChannelGroup().  
    ChannelGroup(string).  
    Channels([]string).  
    QueryParam(queryParam).  
    Execute()  
`
```
* ChannelGroup `string` – group to update.  
* Channels `[]string` – channels to remove.  
* QueryParam `map[string]string` – optional.

### Example

```go
`pn.RemoveChannelFromChannelGroup().  
    ChannelGroup("cg").  
    Channels([]string{"ch1", "ch2"}).  
    Execute()  
`
```

### Response

```json
`{  
    Error:nil>  
    Category:Unknown  
    Operation:Remove Channel From Channel Group  
    StatusCode:200  
    TLSEnabled:true  
    UUID:d9713e5a-6bcb-439a-942e-5ba064f2e5dd  
    AuthKey:  
    Origin:ps.pndsn.com  
    OriginalResponse: {  
        "status": 200,  
        "message": "OK",  
        "service": "channel-registry",  
        "error": false  
    }  
`
```

---

## Delete channel group

Removes the entire channel group.

### Method

```go
`pn.DeleteChannelGroup().  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```
* ChannelGroup `string` – group to delete.  
* QueryParam `map[string]string` – optional.

### Example

```go
`pn.DeleteChannelGroup().  
    ChannelGroup("remove-cg").  
    Execute()  
`
```

### Response

```json
`{**    Error:nil>  
    Category:Unknown  
    Operation:Remove Channel Group  
    StatusCode:200  
    TLSEnabled:true  
    UUID:650089a0-922c-4de6-b422-7a38a964bf45  
    AuthKey:  
    Origin:ps.pndsn.com  
    OriginalResponse: {  
        "status": 200,  
        "message": "OK",  
        "service": "channel-registry",  
        "error": false  
    }  
`
```

_Last updated Jul 15 2025_