# Presence API – Python SDK (Condensed)

Presence add-on must be enabled for your keys. All SDK operations return an `Envelope` with  
• `Envelope.result` – operation-specific.  
• `Envelope.status` – `PNStatus`.

---

## Request execution

Synchronous  

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

Asynchronous  

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

---

## Here Now

Cache: 3 s

Method  

```
`pubnub.here_now() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .include_state(Boolean) \  
    .include_uuids(Boolean)  
`
```

Parameters  
• `channels` – target channels.  
• `channel_groups` – target groups.  
• `include_state` (bool, default False).  
• `include_uuids` (bool, default True).

Result (`PNHereNowResult`)  
• `total_channels` (int)  
• `total_occupancy` (int)  
• `channels` → [`PNHereNowChannelData`]

`PNHereNowChannelData` → `channel_name`, `occupancy`, `occupants` (list of [`PNHereNowOccupantData`])  
`PNHereNowOccupantData` → `uuid`, `state`

Reference snippet  

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def main():  
    pn_config = PNConfiguration()  
    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
  
    pubnub = PubNub(pn_config)  
  
    # Get here_now details  
`
```

Return state  

```
`envelope = pubnub.here_now() \  
    .channels("my_channel") \  
    .include_uuids(True) \  
    .include_state(True) \  
    .sync()  
`
```

Example response  

```
`{  
    total_channels: 1,  
    channels: [{  
        channel_name: "my_channel",  
        occupancy: 1,  
        occupants: [{  
            uuid: "myUuid1"  
            state: {  
                "abcd": {  
                    "age": 15  
                }  
            }  
        }]  
    }],  
    total_occupancy: 1  
`
```

Occupancy-only  

```
`envelope = pubnub.here_now() \  
    .channels("my_channel") \  
    .include_uuids(False) \  
    .include_state(False) \  
    .sync()  
`
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
}  
`
```

Channel groups  

```
`envelope = pubnub.here_now() \  
    .channel_groups(['cg1', 'cg2', 'cg3']) \  
    .include_uuids(True) \  
    .include_state(True) \  
    .sync()  
`
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
                uuid: "123123234t234f34fq3dq",  
`
```

---

## Where Now

Method  

```
`pubnub.where_now() \  
    .uuid(String)  
`
```

Parameter: `uuid` – target UUID.

Basic usage  

```
`envelope = pubnub.where_now().sync()  
`
```

Other examples  

```
`envelope = pubnub.where_now() \  
    .uuid('some-other-uuid') \  
    .sync()  
`
```

```
`envelope = pubnub.where_now(uuid='some-other-uuid').sync()  
`
```

Result (`PNWhereNowResult`) → `channels` (list)

---

## User State

Presence state must be a serializable `dict`.

### Set State

```
`pubnub.set_state() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .state(Dictionary)  
`
```

### Get State

```
`pubnub.get_state() \  
    .channels(String|List|Tuple) \  
    .channel_groups(String|List|Tuple) \  
    .uuid(String)  
`
```

Return types  
• `PNSetStateResult` → `state` (dict)  
• `PNGetStateResult` → `channels` (dict)

Examples – Set state  

```
`my_state = {  
    'age': 20  
}  
envelope = pubnub.set_state() \  
    .channels(['ch1', 'ch2', 'ch3']) \  
    .state(my_state) \  
    .sync()  
`
```

```
`envelope = pubnub.set_state(channels=['ch1', 'ch2', 'ch3'], state={'age': 20}).sync()  
`
```

Get state  

```
`envelope = pubnub.get_state() \  
    .channels(['ch1', 'ch2', 'ch3']) \  
    .uuid('such_uuid') \  
    .sync()  
`
```

```
`envelope = pubnub.get_state(channels=['ch1', 'ch2', 'ch3'], uuid='such_uuid').sync()  
`
```

Channel-group state  

```
`my_state = {  
    'age': 20  
}  
envelope = pubnub.set_state() \  
    .channel_groups(['gr1', 'gr2', 'gr3']) \  
    .state(my_state) \  
    .sync()  
`
```

```
`envelope = pubnub.set_state(channel_groups=['gr1', 'gr2', 'gr3'], state={'age': 20}).sync()  
`
```

Example response  

```
`{**    first  : "Robert",  
    last   : "Plant",  
    age    : 59,  
    region : "UK"  
}  
`
```

*Updated Jun 16 2025*