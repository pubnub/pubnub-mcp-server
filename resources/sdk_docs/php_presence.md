# Presence API for PHP SDK

Presence tracks online/offline users and custom state:
- Join/leave events per channel
- Occupancy (user counts) per channel
- Channels a user/device is subscribed to
- Presence state per user

Requires Presence: Enable the Presence add-on for your key in the Admin Portal. See Presence Events for how to receive presence events.

## Here now[​](#here-now)

Returns the current state of channels: unique UUIDs subscribed and total occupancy.

Cache: 3-second response cache time.

### Method(s)[​](#methods)

To call Here Now, use:

```
`1$pubnub->hereNow()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->includeState(boolean)  
5    ->includeUuids(boolean)  
6    ->limit(int)  
7    ->offset(int)  
8    ->sync();  
`
```

- channels  
  Type: String|Array  
  Default: n/a  
  The channels to get the here now details.

- channelGroups  
  Type: String|Array  
  Default: n/a  
  The channel groups to get the here now details. Wildcards are not supported.

- includeState  
  Type: Boolean  
  Default: false  
  If true, the response will include the presence states of the users for channels/channelGroups.

- includeUuids  
  Type: Boolean  
  Default: true  
  If true, the response will include the UUIDs of the connected clients.

- limit  
  Type: Integer  
  Default: 1000  
  Maximum number of occupants to return per channel. Valid range: 0-1000. Use 0 to get occupancy counts without user details.

- offset  
  Type: Integer  
  Default: n/a  
  Zero-based starting index for pagination. Returns occupants starting from this position in the list. Must be >= 0. Requires limit > 0. Use with limit to paginate through large occupant lists.

### Sample code[​](#sample-code)

#### Get a list of UUIDs subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

```
1
  

```

### Response[​](#response)

The hereNow() operation returns a PNHereNowResult with:

- getTotalChannels()  
  Type: Integer  
  Total Channels.

- getTotalOccupancy()  
  Type: Integer  
  Total Occupancy.

- getChannels()  
  Type: Array  
  An array with values of PNHereNowChannelData for each channel.

#### PNHereNowChannelData[​](#pnherenowchanneldata)

- getChannelName()  
  Type: String  
  Channel name.

- getOccupancy()  
  Type: Integer  
  Occupancy of the channel.

- getOccupants()  
  Type: Array  
  An array of PNHereNowOccupantData.

#### PNHereNowOccupantData[​](#pnherenowoccupantdata)

- getUuid()  
  Type: String  
  UUID of the user.

- getState()  
  Type: Array  
  State of the user.

### Other examples[​](#other-examples)

#### Returning state[​](#returning-state)

```
1
  

```

##### Example response[​](#example-response)

```
`1PubNub\Models\Consumer\Presence\PNHereNowResult Object(  
2    [totalChannels:protected] => 2  
3    [totalOccupancy:protected] => 3  
4    [channels:protected] => Array(  
5        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
6            [channelName:protected] => ch1  
7            [occupancy:protected] => 1  
8            [occupants:protected] => Array(  
9                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
10                    [uuid:protected] => user1  
11                    [state:protected] =>  
12                )  
13            )  
14        )  
15        [1] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
16            [channelName:protected] => ch2  
17            [occupancy:protected] => 2  
18            [occupants:protected] => Array(  
19                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
20                    [uuid:protected] => user1  
21                    [state:protected] =>  
22                )  
23                [1] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
24                    [uuid:protected] => user3  
25                    [state:protected] =>  
26                )  
27            )  
28        )  
29    )  
30    )  
`
```

#### Return occupancy only[​](#return-occupancy-only)

You can return only the occupancy information for a single channel by specifying the channel and setting UUIDs to false:

```
1
  

```

##### Example response[​](#example-response-1)

```
`1PubNub\Models\Consumer\Presence\PNHereNowResult Object(  
2    [totalChannels:protected] => 2  
3    [totalOccupancy:protected] => 3  
4    [channels:protected] => Array(  
5        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
6            [channelName:protected] => ch1  
7            [occupancy:protected] => 1  
8            [occupants:protected] => Array(  
9                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
10                    [uuid:protected] => user1  
11                    [state:protected] =>  
12                )  
13            )  
14        )  
15        [1] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
16            [channelName:protected] => ch2  
17            [occupancy:protected] => 2  
18            [occupants:protected] => Array(  
19                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
20                    [uuid:protected] => user1  
21                    [state:protected] =>  
22                )  
23                [1] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
24                    [uuid:protected] => user3  
25                    [state:protected] =>  
26                )  
27            )  
28        )  
29    )  
30)  
`
```

#### Here now for channel groups[​](#here-now-for-channel-groups)

```
1
  

```

##### Example response[​](#example-response-2)

```
`1(  
2    [totalChannels:protected] => 1  
3    [totalOccupancy:protected] => 4  
4    [channels:protected] => Array(  
5        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
6            [channelName:protected] => ch1  
7            [occupancy:protected] => 1  
8            [occupants:protected] => Array(  
9                [0] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
10                    [uuid:protected] => 123123234t234f34fq3dq  
11                    [state:protected] =>  
12                )  
13                [1] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
14                    [uuid:protected] => 143r34f34t34fq34q34q3  
15                    [state:protected] =>  
16                )  
17                [2] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
18                    [uuid:protected] => 23f34d3f4rq34r34rq23q  
19                    [state:protected] =>  
20                )  
21                [3] => PubNub\Models\Consumer\Presence\PNHereNowOccupantsData Object(  
22                    [uuid:protected] => w34tcw45t45tcw435tww3  
23                    [state:protected] =>  
24                )  
25            )  
26        )  
27    )  
28    )  
`
```

## Where now[​](#where-now)

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)[​](#methods-1)

```
`1$pubnub->whereNow()  
2    ->uuid(string)  
3    ->sync();  
`
```

- uuid  
  Type: String  
  Default: n/a  
  Uuid of the user we want to spy on.

### Sample code[​](#sample-code-1)

```
1
  

```

### Rest response from server[​](#rest-response-from-server)

The whereNow() function returns a list of channels a uuid is subscribed to.
- channels:["String","String", ... ,"String"] - List of channels a uuid is subscribed to.

#### Example response[​](#example-response-3)

```
`1{  
2    "channels": [  
3        "lobby",  
4        "game01",  
5        "chat"  
6    ]  
7}  
`
```

### Other examples[​](#other-examples-1)

```
1
  

```

## User state[​](#user-state)

Clients can set a dynamic custom state (score, game state, location) for users on one or more channels; state persists only while subscribed and is lost on disconnect. See Presence State.

### Method(s)[​](#methods-2)

Set State:

```
`1$pubnub->setState()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->state(array)  
5    ->sync();  
`
```

- channels  
  Type: String|Array  
  channels to set state.

- channelGroups  
  Type: String|Array  
  channel groups to set state.

- state  
  Type: Array  
  State to set.

Get state:

```
`1$pubnub->getState()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->uuid(string)  
5    ->sync();  
`
```

- channels  
  Type: String|Array  
  channels to get state.

- channelGroups  
  Type: String|Array  
  channel groups to get state.

- uuid  
  Type: String  
  uuid

### Sample code[​](#sample-code-2)

#### Set state[​](#set-state)

```
1
  

```

#### Get state[​](#get-state)

```
1
  

```

### Response[​](#response-1)

setState() returns PNSetStateResult with:
- setState()  
  Type: Array  
  Array of UUIDs and the user states.

getState() returns PNGetStateResult with:
- getChannels()  
  Type: Array  
  Array of channels and the user states.

### Other examples[​](#other-examples-2)

#### Set state for channels in a channel group[​](#set-state-for-channels-in-a-channel-group)

```
1
**
```

Last updated on Nov 10, 2025**