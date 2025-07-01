On this page
# Presence API for Go SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `HereNow()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the Go SDK:

```
`pn.HereNow().  
    Channels([]string).  
    ChannelGroups([]string).  
    IncludeState(bool).  
    IncludeUUIDs(bool).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels`Type: []stringDefault:  
n/aThe `Channels` to get the here now details.`ChannelGroups`Type: []stringDefault:  
n/aThe `Channel groups` to get the here now details.`IncludeState`Type: boolDefault:  
FalseIf `true`, the response will include the presence states of the users for `channels`/`channelGroups`.`IncludeUUIDs`Type: boolDefault:  
TrueIf `true`, the response will include the `UUIDs` of the connected clients`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

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
show all 44 lines

### Rest Response from Server[​](#rest-response-from-server)

The `HereNow()` operation returns a. `PNHereNowResult` which contains the following fields:

MethodDescription`TotalChannels`Type: intTotal `Channels``TotalOccupancy`Type: intTotal `Occupancy``Channels`Type: []HereNowChannelData

#### HereNowChannelData[​](#herenowchanneldata)

MethodDescription`ChannelName`Type: string`Channel` name`Occupancy`Type: int`Occupancy` of the `Channel``Occupants`Type: []HereNowOccupantsData

#### HereNowOccupantsData[​](#herenowoccupantsdata)

MethodDescription`UUID`Type: string`UUID` of the user`State`Type: map[string]interface`State` of the user.

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`res, status, err := pn.HereNow().  
    Channels([]string{"my-channel-1"}). // who is present on those channels?  
    IncludeUUIDs(true). // if false, only shows occupancy count  
    IncludeState(true). // include state with request (false by default)  
    Execute()  
`
```

##### Example Response[​](#example-response)

```
`for _, v := range res.Channels {  
    fmt.Println(v.ChannelName) // my_channel  
    fmt.Println(v.Occupancy) // 3  
    fmt.Println(v.Occupants) // members of a channel  
  
    for _, v := range v.Occupants {  
        fmt.Println(v.UUID) // some_uuid;  
        fmt.Println(v.State) // channel member state, if applicable  
    }  
}  
`
```

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`res, status, err := pn.HereNow().  
    Channels([]string{"my-channel-1"}). // who is present on those channels?  
    IncludeUUIDs(false). // if false, only shows occupancy count  
    IncludeState(false). // include state with request (false by default)  
    Execute()  
`
```

##### Example Response[​](#example-response-1)

```
`for _, v := range res.Channels {  
    fmt.Println(v.ChannelName) // my_channel  
    fmt.Println(v.Occupancy) // 3  
}  
`
```

#### Here Now for Channel Groups[​](#here-now-for-channel-groups)

```
`res, status, err := pn.HereNow().  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}). // who is present on channel groups?  
    IncludeUUIDs(true). // if false, only shows occupancy count  
    IncludeState(true). // include state with request (false by default)  
    Execute()  
`
```

##### Example Response[​](#example-response-2)

```
`res.TotalOccupancy // 12  
`
```

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `WhereNow()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `WhereNow()` you can use the following method(s) in the Go SDK:

```
`pn.WhereNow().  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`UUID`Type: stringDefault:  
n/a`UUID` to get info on.`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-1)

You simply need to define the `UUID` to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`res, status, err := pn.WhereNow().  
    UUID("username-uuid"). // uuid of the user we want to spy on  
    Execute()  
`
```

### Rest Response from Server[​](#rest-response-from-server-1)

MethodDescription`Channels`Type: []stringThe list of `channels` where the `UUID` is present.

### Other Examples[​](#other-examples-1)

In the case you omit `UUID` field in `WhereNow()` request, the `UUID` of a current PubNub instance will be used.

```
`res, status, err := pn.WhereNow().Execute()  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

```
`pn.SetState().  
    Channels([]string).  
    ChannelGroups([]string).  
    State(map[string]interface{}).  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels`Type: []string`channels` to set `state`.`ChannelGroups`Type: []string`channel groups` to set `state`.`State`Type: map[string]interface`state` to set.`UUID`Type: stringSet the Presence state info for a given `UUID`.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

#### Get State[​](#get-state)

```
`pn.GetState().  
    Channels([]string).  
    ChannelGroups([]string).  
    UUID(string).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels`Type: []string`channels` to get `state`.`ChannelGroups`Type: []string`channel groups` to get `state`.`UUID`Type: stringGet the Presence state info for a given `UUID`.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state-1)

```
`res, status, err := pn.SetState().  
    Channels([]string{"ch"}).  
    State(map[string]interface{}{  
        "is_typing": true,  
    }).  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

#### Get State[​](#get-state-1)

```
`res, status, err := pn.GetState().  
    Channels([]string{"ch1", "ch2", "ch3"}).  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).  
    UUID("suchUUID").  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

### Response[​](#response)

The `SetState()` operation returns a `PNSetStateResult` which contains the following fields:

MethodDescription`State`Type: interfacemap of `UUIDs` and the user states.

The `GetState()` operation returns a `PNGetStateResult` which contains the following fields:

MethodDescription`State`Type: map[string]interfacemap of `UUIDs` and the user states.

### Other Examples[​](#other-examples-2)

#### Set state for channels in a channel group[​](#set-state-for-channels-in-a-channel-group)

```
`myState := map[string]interface{}{  
    "age": 20,  
}  
  
pn.SetState().  
    ChannelGroups([]string{"cg1", "cg2", "cg3"}).  
    Channels([]string{"ch1", "ch2", "ch3"}).  
    State(myState).  
    Execute()  
`
```

```
`if presence.Event == "state-change" {  
    res, status, err := pn.GetState().  
        Channels([]string{"ch1"}).  
        UUID("is_typing").  
        Execute()  
    fmt.Println(res, status, err)  
}  
`
```

## Heartbeat without subscription[​](#heartbeat-without-subscription)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can send presence heartbeat notifications without subscribing to a channel. These notifications are sent periodically and indicate whether a client is connected or not. Make sure to correctly set the presence timeout and interval properties during [Configuration](/docs/sdks/go/api-reference/configuration)   This feature requires the Presence add-on.

### Method(s)[​](#methods-3)

To send heartbeat notifications without subscribing to a channel, you can use the following method(s) in the Go SDK:

```
`pn.Presence().  
    Connected(bool).  
    Channels([]‌string).  
    ChannelGroups([]string).  
    Execute()  
`
```

*  requiredParameterDescription`Connected` *Type: boolWhether client's presence should be changed to connected (`true` to join) or off-line (`false` to leave).`Channels`Type: []stringList of channel names for which client's presence state should be changed according to passed connected value.`ChannelGroups`Type: []stringList of channel groups names for which client's presence state should be changed according to passed connected value.

### Basic Usage[​](#basic-usage-3)

```
`pn.Presence().  
    Connected(true).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```

### Other Examples[​](#other-examples-3)

#### To start heartbeating without subscription to channel or channel group[​](#to-start-heartbeating-without-subscription-to-channel-or-channel-group)

```
`pn.Presence().  
    Connected(true).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```

#### To stop heartbeating without subscription to channel or channel group[​](#to-stop-heartbeating-without-subscription-to-channel-or-channel-group)

```
`pn.Presence().**    Connected(false).  
    Channels([]‌string{"my-channel"}).  
    ChannelGroups([]string{"my-channel-group"}).  
    Execute()  
`
```
Last updated on Jun 16, 2025**