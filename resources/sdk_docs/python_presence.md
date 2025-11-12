# Presence API for Python SDK

Presence lets you track who is online/offline, occupancy, subscriptions, and user presence state.

Requires Presence add-on enabled for your key in the Admin Portal.

##### Request execution and return values

Operations can be synchronous or asynchronous.

`.sync()` returns an `Envelope` with:
- `Envelope.result` (type differs per API)
- `Envelope.status` (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes `result` and `status` to your callback:

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  
```

## Here now

Returns current channel state, including UUIDs subscribed and total occupancy. Response cache: 3 seconds.

For presence events, see Presence Events.

### Method(s)

```
`1pubnub.here_now() \  
2    .channels(String|List|Tuple) \  
3    .channel_groups(String|List|Tuple) \  
4    .include_state(Boolean) \  
5    .include_uuids(Boolean)  
`
```

Parameters:
- channels (String | List | Tuple): Channels to get here-now details.
- channel_groups (String | List | Tuple): Channel groups to get here-now details. Wildcards not supported.
- include_state (Boolean, default False): Include presence state in response.
- include_uuids (Boolean, default True): Include UUIDs of connected clients.

### Sample code

#### Get a list of UUIDs subscribed to channel

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4
  
5
  
6def main():  
7    # Configuration for PubNub instance  
8    pn_config = PNConfiguration()  
9    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
10    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
11
  
12    # Initialize PubNub client  
13    pubnub = PubNub(pn_config)  
14
  
15    # Get here_now details  
16    here_now = pubnub.here_now() \  
17        .channels(["my_channel", "demo"]) \  
18        .include_uuids(True) \  
19        .sync()  
20
  
21    if here_now.status.is_error():  
22        print(f"Error: {here_now.status.error}")  
23        return  
24
  
25    for channel_data in here_now.result.channels:  
26        print("---")  
27        print(f"Channel: {channel_data.channel_name}")  
28        print(f"Occupancy: {channel_data.occupancy}")  
29        print(f"Occupants: {channel_data.channel_name}")  
30  
31        for occupant in channel_data.occupants:  
32            print(f"UUID: {occupant.uuid}, State: {occupant.state}")  
33
  
34  
35if __name__ == "__main__":  
36    main()  
37
```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4
  
5
  
6def main():  
7    # Configuration for PubNub instance  
8    pn_config = PNConfiguration()  
9    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
10    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
11
  
12    # Initialize PubNub client  
13    pubnub = PubNub(pn_config)  
14
  
15    # Get here_now details  
16    here_now = pubnub.here_now(  
17        channels=["my_channel", "demo"],  
18        include_uuids=True  
19    ).sync()  
20
  
21    if here_now.status.is_error():  
22        print(f"Error: {here_now.status.error}")  
23        return  
24
  
25    for channel_data in here_now.result.channels:  
26        print("---")  
27        print(f"Channel: {channel_data.channel_name}")  
28        print(f"Occupancy: {channel_data.occupancy}")  
29        print(f"Occupants: {channel_data.channel_name}")  
30  
31        for occupant in channel_data.occupants:  
32            print(f"UUID: {occupant.uuid}, State: {occupant.state}")  
33
  
34  
35if __name__ == "__main__":  
36    main()  
37
```

### Returns

`here_now()` returns an `Envelope`:
- result: PNHereNowResult
- status: PNStatus

PNHereNowResult:
- total_channels (Int)
- total_occupancy (Int)
- channels (Dictionary of PNHereNowChannelData by channel)

PNHereNowChannelData:
- channel_name (String)
- occupancy (Int)
- occupants (List of PNHereNowOccupantData)

PNHereNowOccupantData:
- uuid (String)
- state (Dictionary)

### Other examples

#### Returning state

```
`1envelope = pubnub.here_now() \  
2    .channels("my_channel") \  
3    .include_uuids(True) \  
4    .include_state(True) \  
5    .sync()  
`
```

Example response:

```
`1{  
2    total_channels: 1,  
3    channels: [{  
4        channel_name: "my_channel",  
5        occupancy: 1,  
6        occupants: [{  
7            uuid: "myUuid1"  
8            state: {  
9                "abcd": {  
10                    "age": 15  
11                }  
12            }  
13        }]  
14    }],  
15    total_occupancy: 1  
16}  
`
```

#### Return occupancy only

Return only occupancy by disabling UUIDs and state:

```
`1envelope = pubnub.here_now() \  
2    .channels("my_channel") \  
3    .include_uuids(False) \  
4    .include_state(False) \  
5    .sync()  
`
```

Example response:

```
`1{  
2    total_channels: 1,  
3    channels: [{  
4        channel_name: "my_channel",  
5        occupancy: 3,  
6        occupants: []  
7    }],  
8    total_occupancy: 3  
9}  
`
```

#### Here now for channel groups

```
`1envelope = pubnub.here_now() \  
2    .channel_groups(['cg1', 'cg2', 'cg3']) \  
3    .include_uuids(True) \  
4    .include_state(True) \  
5    .sync()  
`
```

Example response:

```
`1{  
2    total_channels: 1,  
3    channels: [  
4        {  
5            channel_name: "my_channel",  
6            occupancy: 1,  
7            occupants: [{  
8                uuid: "143r34f34t34fq34q34q3",  
9                state: None  
10            }]  
11        },  
12        {  
13            occupancy: 1,  
14            occupants: [{  
15                uuid: "123123234t234f34fq3dq",  
16                state: None  
17            }]  
18        },  
19        {  
20            occupancy: 1,  
21            occupants: [{  
22                uuid: "23f34d3f4rq34r34rq23q",  
23                state: None  
24            }]  
25        },  
26        {  
27            occupancy: 1,  
28            occupants: [{  
29                uuid: "w34tcw45t45tcw435tww3",  
30                state: None  
31            }]  
32        }  
33    ],  
34    total_occupancy: 4  
35}  
`
```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pubnub.where_now() \  
2    .uuid(String)  
`
```

Parameters:
- uuid (String): UUID to query.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
`1envelope = pubnub.where_now().sync()  
`
```

### Returns

`where_now()` returns an `Envelope`:
- result: PNWhereNowResult
- status: PNStatus

PNWhereNowResult:
- channels (List): Channels where the UUID is present.

### Other examples

#### Obtain information about the current list of channels of some other UUID

- Builder Pattern
- Named Arguments

```
`1envelope = pubnub.where_now() \  
2    .uuid('some-other-uuid') \  
3    .sync()  
`
```

```
`1envelope = pubnub.where_now(uuid='some-other-uuid').sync()  
`
```

## User state

Clients can set dynamic custom state (for example, score, location) per channel while subscribed. State is not persisted and is lost on disconnect. Presence state must be a serializable `dict`.

### Method(s)

#### Set state

```
`1pubnub.set_state() \  
2    .channels(String|List|Tuple) \  
3    .channel_groups(String|List|Tuple) \  
4    .state(Dictionary)  
`
```

Parameters:
- channels (String | List | Tuple): Channels to set state.
- channel_groups (String | List | Tuple): Channel groups to set state.
- state (Dictionary): State to set.

#### Get state

```
`1pubnub.get_state() \  
2    .channels(String|List|Tuple) \  
3    .channel_groups(String|List|Tuple) \  
4    .uuid(String)  
`
```

Parameters:
- channels (String | List | Tuple): Channels to get state.
- channel_groups (String | List | Tuple): Channel groups to get state.
- uuid (String): UUID to get state for.

### Sample code

#### Set state

- Builder Pattern
- Named Arguments

```
`1my_state = {  
2    'age': 20  
3}  
4envelope = pubnub.set_state() \  
5    .channels(['ch1', 'ch2', 'ch3']) \  
6    .state(my_state) \  
7    .sync()  
`
```

```
`1envelope = pubnub.set_state(channels=['ch1', 'ch2', 'ch3'], state={'age': 20}).sync()  
`
```

#### Get state

- Builder Pattern
- Named Arguments

```
`1envelope = pubnub.get_state() \  
2    .channels(['ch1', 'ch2', 'ch3']) \  
3    .uuid('such_uuid') \  
4    .sync()  
`
```

```
`1envelope = pubnub.get_state(channels=['ch1', 'ch2', 'ch3'], uuid='such_uuid').sync()  
`
```

### Returns

`set_state()` returns an `Envelope`:
- result: PNSetStateResult
- status: PNStatus

PNSetStateResult:
- state (Dictionary): Dictionary of UUIDs and user states.

`get_state()` returns an `Envelope`:
- result: PNGetStateResult
- status: PNStatus

PNGetStateResult:
- channels (Dictionary): Dictionary of channels and user states.

### Other examples

#### Set state for channels in channel group

- Builder Pattern
- Named Arguments

```
`1my_state = {  
2    'age': 20  
3}  
4envelope = pubnub.set_state() \  
5    .channel_groups(['gr1', 'gr2', 'gr3']) \  
6    .state(my_state) \  
7    .sync()  
`
```

```
`1envelope = pubnub.set_state(channel_groups=['gr1', 'gr2', 'gr3'], state={'age': 20}).sync()  
`
```

Response:

```
`1{**2    first  : "Robert",  
3    last   : "Plant",  
4    age    : 59,  
5    region : "UK"  
6}  
`
```