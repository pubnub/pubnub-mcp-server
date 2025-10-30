# Presence API for PHP SDK

Presence tracks online/offline users, occupancy, subscriptions, and presence state.

Requires Presence: Enable the Presence add-on for your key in the Admin Portal. See Presence Events to receive events.

## Here now

Returns current channel state: UUIDs subscribed and total occupancy.

##### Requires Presence

Requires Presence add-on enabled. See Presence Events.

##### Cache

Response cache time: 3 seconds.

### Method(s)

To call Here Now:

```
`1$pubnub->hereNow()  
2    ->channels(string|array)  
3    ->channelGroups(string|array)  
4    ->includeState(boolean)  
5    ->includeUuids(boolean)  
6    ->sync();  
`
```

Parameters:
- channels (String|Array): Channels to query.
- channelGroups (String|Array): Channel groups to query. Wildcards not supported.
- includeState (Boolean, default: false): Include user presence state.
- includeUuids (Boolean, default: true): Include UUIDs of connected clients.

### Sample code

#### Get a list of UUIDs subscribed to channel

##### Reference code

```
1
  

```

### Response

hereNow() returns PNHereNowResult:
- getTotalChannels() (Integer): Total channels.
- getTotalOccupancy() (Integer): Total occupancy.
- getChannels() (Array): Array of PNHereNowChannelData.

#### PNHereNowChannelData

- getChannelName() (String): Channel name.
- getOccupancy() (Integer): Channel occupancy.
- getOccupants() (Array): Array of PNHereNowOccupantData.

#### PNHereNowOccupantData

- getUuid() (String): User UUID.
- getState() (Array): User state.

### Other examples

#### Returning state

##### Requires Presence

Requires Presence add-on enabled. See Presence Events.

```
`1$result = $pubnub->hereNow()  
2                ->channels("my_channel")  
3                ->includeUuids(true)  
4                ->includeState(true)  
5                ->sync();  
`
```

##### Example response

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

##### Requires Presence

Requires Presence add-on enabled. See Presence Events.

Return only occupancy by disabling UUIDs and state:

```
`1$result = $pubnub->hereNow()  
2                ->channels("my_channel")  
3                ->includeUuids(false)  
4                ->includeState(false)  
5                ->sync();  
`
```

##### Example response

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
`1$pubnub->hereNow()  
2    ->channelGroups(["cg1", "cg2", "cg3"])  
3    ->includeUuids(true)  
4    ->includeState(true)  
5    ->sync();  
`
```

##### Example response

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

Returns the list of channels a UUID is subscribed to.

##### Requires Presence

Requires Presence add-on enabled. See Presence Events.

##### Timeout events

If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1$pubnub->whereNow()  
2    ->uuid(string)  
3    ->sync();  
`
```

Parameters:
- uuid (String): UUID to query.

### Sample code

```
`1$result = $pubnub->whereNow()  
2              ->sync();  
`
```

### Rest response from server

Returns list of channels for the UUID:
- channels: ["String", ...]

#### Example response

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
`1$result = $pubnub->whereNow()  
2                ->uuid("his-uuid")  
3                ->sync();  
`
```

## User state

Clients can set dynamic custom state (for example, score, game state, location) on channels while subscribed. State isn’t persisted; it’s lost on disconnect. See Presence State.

##### Requires Presence

Requires Presence add-on enabled. See Presence Events.

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
- state (Array): State to set.

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
- uuid (String): UUID to get state for.

### Sample code

#### Set state

```
`1$pubnub->setState()  
2    ->channels(["ch1", "ch2", "ch3"])  
3    ->state(["age" => 30])  
4    ->sync();  
`
```

#### Get state

```
`1$pubnub->getState()  
2    ->channels(["ch1", "ch2", "ch3"])  
3    ->sync();  
`
```

### Response

setState() returns PNSetStateResult:
- setState() (Array): UUIDs and user states.

getState() returns PNGetStateResult:
- getChannels() (Array): Channels and user states.

### Other examples

#### Set state for channels in a channel group

```
`1$pubnub->setState()**2    ->channelGroups(["gr1", "gr2", "gr3"])  
3    ->state(["age" => 30])  
4    ->sync();  
`
```

Last updated on Sep 3, 2025**