On this page
# Channel Groups API for Go SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Go SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pn.AddChannelToChannelGroup().  
    Channels([]string).  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels` *Type: []string`channels` to add to the channel group`ChannelGroup` *Type: stringThe `channel group` to add the channels to.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Channels[​](#add-channels-1)

```
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
show all 37 lines

### Response[​](#response)

```
`{  
    "service" : "channel-registry",  
    "status"  : 200,  
    "error"   : false,  
    "message" : "OK"  
}  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Go SDK:

```
`pn.ListChannelsInChannelGroup().  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringThe `channel group` to fetch channels.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`pn.ListChannelsInChannelGroup().  
    ChannelGroup("cg").  
    Execute()  
`
```

### Response[​](#response-1)

MethodDescription`Channels`Type: []stringYes`Group`Type: stringYes

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Go SDK:

```
`pn.RemoveChannelFromChannelGroup().  
    ChannelGroup(string).  
    Channels([]string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringThe `channel group` to remove the channels from.`Channels` *Type: []string`channels` remove from the channel group.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`pn.RemoveChannelFromChannelGroup().  
    ChannelGroup("cg").  
    Channels([]string{"ch1", "ch2"}).  
    Execute()  
`
```

### Response[​](#response-2)

```
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
show all 18 lines

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Go SDK:

```
`pn.DeleteChannelGroup().  
    ChannelGroup(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`ChannelGroup` *Type: stringThe `channel group` to remove`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`pn.DeleteChannelGroup().  
    ChannelGroup("remove-cg").  
    Execute()  
`
```

### Response[​](#response-3)

```
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
show all 18 linesLast updated on Mar 31, 2025**