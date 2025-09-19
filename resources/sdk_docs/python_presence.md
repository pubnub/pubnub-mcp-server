# Presence API – Python SDK (Condensed)

Presence lets you Query/Update online status and custom state in real time.

---

## Request execution

Sync (`.sync()`) → `Envelope`  
Async (`.pn_async(callback)`) → `None` (result/status passed to callback)

```
`pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .sync()`
```

```
`def my_callback_function(result, status):
    print(f'TT: {result.timetoken}, status: {status.category.name}')

pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .pn_async(my_callback_function)`
```

---

## Here Now  _(requires Presence add-on; 3-second cache)_

Method builder:

```
`pubnub.here_now() \
    .channels(String|List|Tuple) \
    .channel_groups(String|List|Tuple) \
    .include_state(Boolean) \
    .include_uuids(Boolean)`
```

Parameters  
• channels – channel(s) to query  
• channel_groups – group(s) to query  
• include_state (bool, default `False`) – include user state  
• include_uuids (bool, default `True`) – include UUID list  

Returns (`Envelope.result` = `PNHereNowResult`)  
• total_channels (int)  
• total_occupancy (int)  
• channels (dict[channel → PNHereNowChannelData])  

PNHereNowChannelData  
• channel_name (str)  
• occupancy (int)  
• occupants (list[PNHereNowOccupantData])  

PNHereNowOccupantData  
• uuid (str)  
• state (dict)

### Examples

Reference (initialization + call):

```
`import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

def main():
    pn_config = PNConfiguration()
    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')
    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')
    pubnub = PubNub(pn_config)
    # Get here_now details`
```

Get state + UUIDs:

```
`envelope = pubnub.here_now() \
    .channels("my_channel") \
    .include_uuids(True) \
    .include_state(True) \
    .sync()`
```

```
`{
    total_channels: 1,
    channels: [{
        channel_name: "my_channel",
        occupancy: 1,
        occupants: [{
            uuid: "myUuid1",
            state: {
                "abcd": { "age": 15 }
            }
        }]
    }],
    total_occupancy: 1`
```

Occupancy only:

```
`envelope = pubnub.here_now() \
    .channels("my_channel") \
    .include_uuids(False) \
    .include_state(False) \
    .sync()`
```

```
`{
    total_channels: 1,
    channels: [{
        channel_name: "my_channel",
        occupancy: 3,
        occupants: []
    }],
    total_occupancy: 3  
}`
```

Channel groups:

```
`envelope = pubnub.here_now() \
    .channel_groups(['cg1', 'cg2', 'cg3']) \
    .include_uuids(True) \
    .include_state(True) \
    .sync()`
```

```
`{
    total_channels: 1,
    channels: [
        {
            channel_name: "my_channel",
            occupancy: 1,
            occupants: [{
                uuid: "143r34f34t34fq34q34q3",
                state: None
            }]
        },
        {
            occupancy: 1,
            occupants: [{
                uuid: "123123234t234f34fq3dq",`
```

---

## Where Now  _(requires Presence add-on)_

Method builder:

```
`pubnub.where_now() \
    .uuid(String)`
```

Parameter  
• uuid (str) – UUID to inspect  

Returns (`Envelope.result` = `PNWhereNowResult`)  
• channels (list[str])

Examples:

```
`envelope = pubnub.where_now().sync()`
```

```
`envelope = pubnub.where_now() \
    .uuid('some-other-uuid') \
    .sync()`
```

```
`envelope = pubnub.where_now(uuid='some-other-uuid').sync()`
```

---

## User State  _(requires Presence add-on)_

State object must be a serializable `dict`.

### Set State

```
`pubnub.set_state() \
    .channels(String|List|Tuple) \
    .channel_groups(String|List|Tuple) \
    .state(Dictionary)`
```

Parameters  
• channels – channel(s) to set state on  
• channel_groups – group(s) to set state on  
• state (dict) – custom state  

Returns (`Envelope.result` = `PNSetStateResult`)  
• state (dict)

### Get State

```
`pubnub.get_state() \
    .channels(String|List|Tuple) \
    .channel_groups(String|List|Tuple) \
    .uuid(String)`
```

Parameters  
• channels – channel(s) to query  
• channel_groups – group(s) to query  
• uuid (str) – UUID whose state to fetch  

Returns (`Envelope.result` = `PNGetStateResult`)  
• channels (dict[channel → state])

### Examples

Set state (channels):

```
`my_state = {
    'age': 20
}
envelope = pubnub.set_state() \
    .channels(['ch1', 'ch2', 'ch3']) \
    .state(my_state) \
    .sync()`
```

```
`envelope = pubnub.set_state(channels=['ch1', 'ch2', 'ch3'], state={'age': 20}).sync()`
```

Get state (channels):

```
`envelope = pubnub.get_state() \
    .channels(['ch1', 'ch2', 'ch3']) \
    .uuid('such_uuid') \
    .sync()`
```

```
`envelope = pubnub.get_state(channels=['ch1', 'ch2', 'ch3'], uuid='such_uuid').sync()`
```

Set state (channel groups):

```
`my_state = {
    'age': 20
}
envelope = pubnub.set_state() \
    .channel_groups(['gr1', 'gr2', 'gr3']) \
    .state(my_state) \
    .sync()`
```

```
`envelope = pubnub.set_state(channel_groups=['gr1', 'gr2', 'gr3'], state={'age': 20}).sync()`
```

Sample response:

```
`{**    first  : "Robert",
    last   : "Plant",
    age    : 59,
    region : "UK"
}`
```

_Last updated Jul 15 2025_