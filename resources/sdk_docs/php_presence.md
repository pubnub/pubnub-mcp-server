# Presence API for PHP SDK

Presence tracks who is online/offline and stores custom state information:
- Join/leave events per channel
- Channel occupancy (user count)
- Channels a user/UUID is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. For events, see Presence Events. Learn more in Presence overview.

## Here now

Returns current state of channels: subscribed UUIDs and occupancy count.

- Cache: 3 seconds

### Method(s)

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

Parameters:
- channels (String|Array, required): Channels to query.
- channelGroups (String|Array): Channel groups to query. Wildcards not supported.
- includeState (Boolean, default: false): Include presence states of users.
- includeUuids (Boolean, default: true): Include UUIDs of connected clients.
- limit (Integer, default: 1000): Max occupants per channel, 0–1000. Use 0 for occupancy-only.
- offset (Integer): Zero-based start index for pagination. Must be >= 0. Requires limit > 0.

### Sample code

#### Get a list of UUIDs subscribed to channel

Reference code:

```
1
  

```

### Response

hereNow() returns PNHereNowResult:
- getTotalChannels() (Integer): Total channels.
- getTotalOccupancy() (Integer): Total occupancy.
- getChannels() (Array): Array of PNHereNowChannelData per channel.

PNHereNowChannelData:
- getChannelName() (String): Channel name.
- getOccupancy() (Integer): Channel occupancy.
- getOccupants() (Array): Array of PNHereNowOccupantData.

PNHereNowOccupantData:
- getUuid() (String): User UUID.
- getState() (Array): User state.

### Other examples

#### Returning state

```
1
  

```

Example response

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

#### Return occupancy only

Return only occupancy for a channel by setting includeUuids to false.

```
1
  

```

Example response

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

#### Here now for channel groups

```
1
  

```

Example response

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

## Where now

Returns list of channels a UUID is subscribed to.

- Timeout events: If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1$pubnub->whereNow()  
2    ->uuid(string)  
3    ->sync();  
`
```

Parameters:
- uuid (String, required): UUID to inspect.

### Sample code

```
1
  

```

### Rest response from server

Returns channels array for the uuid:
- channels: ["String", ...] — List of channels the uuid is subscribed to.

Example response

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

### Other examples

```
1
  

```

## User state

Clients can set dynamic custom state (for example, score or location) per channel while subscribed. State is not persisted and is lost on disconnect. See Presence State.

### Method(s)

Set State:

```
`1$pubnub->setState()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->state(array)  
5    ->sync();  
`
```

Parameters:
- channels (String|Array): Channels to set state.
- channelGroups (String|Array): Channel groups to set state.
- state (Array): State map to set.

Get state:

```
`1$pubnub->getState()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->uuid(string)  
5    ->sync();  
`
```

Parameters:
- channels (String|Array): Channels to get state.
- channelGroups (String|Array): Channel groups to get state.
- uuid (String): UUID to fetch state for.

### Sample code

#### Set state

```
1
  

```

#### Get state

```
1
  

```

### Response

setState() returns PNSetStateResult:
- setState() (Array): UUIDs and user states.

getState() returns PNGetStateResult:
- getChannels() (Array): Channels and user states.

### Other examples

#### Set state for channels in a channel group

```
1
**
```