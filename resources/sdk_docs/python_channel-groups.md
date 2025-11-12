# Channel Groups API for Python SDK

Channel groups let you bundle many channels under one name and subscribe to them. You can't publish to a channel group; publish to individual channels.

##### Request execution and return values

Operations can be run synchronously or asynchronously.

`.sync()` returns an `Envelope` with:
- `Envelope.result` (type varies by API)
- `Envelope.status` (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

`.pn_async(callback)` returns `None` and invokes your callback with `(result, status)`.

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  

```

## Add channels to a channel group

##### Requires Stream Controller add-on

Enable the Stream Controller add-on for your key in the Admin Portal.

Adds channels to a channel group.

### Method(s)

Maximum number of channels: 200 per API call.

```
`1pubnub.add_channel_to_channel_group() \  
2    .channels(String|List|Tuple) \  
3    .channel_group(String)  
`
```

Parameters:
- channels (String | List | Tuple): Channel(s) to add.
- channel_group (String): Target channel group.

### Sample code

#### Add channels

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def add_channels_to_group(pubnub: PubNub):  
8    try:  
9        pubnub.add_channel_to_channel_group() \  
10            .channels(["ch1", "ch2"]) \  
11            .channel_group("cg1") \  
12            .sync()  
13        print("Channels added to channel group successfully.")  
14    except PubNubException as e:  
15        print(f"Error: {e}")  
16
  
17
  
18def main():  
19    # Configuration for PubNub instance  
20    pn_config = PNConfiguration()  
21    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
22    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
23    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
24
  
25    # Initialize PubNub client  
26    pubnub = PubNub(pn_config)  
27
  
28    # Add channels to group  
29    add_channels_to_group(pubnub)  
30
  
31
  
32if __name__ == "__main__":  
33    main()  

```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def add_channels_to_group(pubnub: PubNub):  
8    try:  
9        pubnub.add_channel_to_channel_group(  
10            channels=["ch1", "ch2"],  
11            channel_group="cg1"  
12        ).sync()  
13        print("Channels added to channel group successfully.")  
14    except PubNubException as e:  
15        print(f"Error: {e}")  
16
  
17
  
18def main():  
19    # Configuration for PubNub instance  
20    pn_config = PNConfiguration()  
21    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
22    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
23    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
24
  
25    # Initialize PubNub client  
26    pubnub = PubNub(pn_config)  
27
  
28    # Add channels to group  
29    add_channels_to_group(pubnub)  
30
  
31
  
32if __name__ == "__main__":  
33    main()  
34
  

```

### Returns

`add_channel_to_channel_group()` returns an `Envelope` with:
- result: `PNChannelGroupsAddChannelResult`
- status: `PNStatus`

#### PNChannelGroupsAddChannelResult

```
`1Channel successfully added  
`
```

## List channels in a channel group

##### Requires Stream Controller add-on

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.list_channels_in_channel_group() \  
2    .channel_group(String)  
`
```

Parameters:
- channel_group (String): Group to list.

### Sample code

#### List channels

- Builder Pattern
- Named Arguments

```
`1result = pubnub.list_channels_in_channel_group() \  
2    .channel_group("cg1") \  
3    .sync()  
`
```

```
`1result = pubnub.list_channels_in_channel_group(channel_group="cg1").sync()  
`
```

### Returns

`list_channels_in_channel_group()` returns an `Envelope` with:
- result: `PNChannelGroupsListResult`
- status: `PNStatus`

#### PNChannelGroupsListResult

Field:
- channels (Dictionary): A list of channels in a channel group.

## Remove channels from a channel group

##### Requires Stream Controller add-on

Removes channels from a channel group.

### Method(s)

```
`1pubnub.remove_channel_from_channel_group() \  
2    .channels(String|List|Tuple) \  
3    .channel_group(String)  
`
```

Parameters:
- channels (String | List | Tuple): Channel(s) to remove.
- channel_group (String): Group to remove from.

### Sample code

#### Remove channels

- Builder Pattern
- Named Arguments

```
`1pubnub.remove_channel_from_channel_group() \  
2    .channels(["son", "daughter"]) \  
3    .channel_group("channel_group") \  
4    .sync()  
`
```

```
`1pubnub.remove_channel_from_channel_group(channels=["ch1", "ch2"], channel_group="cg1").sync()  
`
```

### Returns

`remove_channel_from_channel_group()` returns an `Envelope` with:
- result: `PNChannelGroupsRemoveChannelResult`
- status: `PNStatus`

#### PNChannelGroupsRemoveChannelResult

```
`1Channel successfully removed  
`
```

## Delete a channel group

##### Requires Stream Controller add-on

Deletes a channel group.

### Method(s)

```
`1pubnub.remove_channel_group(channel_group)  
`
```

Parameters:
- channel_group (String): Group to remove.

### Sample code

#### Delete channel group

- Builder Pattern
- Named Arguments

```
`1pubnub.remove_channel_group() \  
2    .channel_group("cg1") \  
3    .sync()  
`
```

```
`1pubnub.remove_channel_group(channel_group="cg1").sync()  
`
```

### Returns

`remove_channel_group()` returns an `Envelope` with:
- result: `PNChannelGroupsRemoveGroupResult`
- status: `PNStatus`

#### PNChannelGroupsRemoveGroupResult

```
`1Group successfully removed**`