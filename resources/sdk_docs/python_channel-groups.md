# Channel Groups API – Python SDK

Channel Groups bundle up to thousands of channels under a single name that you can **subscribe** to (publishing is still per-channel).

### Sync vs. Async request execution

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

`sync()` → `Envelope` with `result` (API-specific) and `status` (`PnStatus`).  
`pn_async(cb)` → `None`; your `cb(result, status)` receives the same objects.

---

## Add Channels

*Requires the **Stream Controller** add-on.*

Maximum 200 channels per call.

#### Method

```
`pubnub.add_channel_to_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
```

Parameters  
• `channels` String | List | Tuple – channels to add  
• `channel_group` String – target group

#### Examples

Builder pattern
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def add_channels_to_group(pubnub: PubNub):  
    try:  
        pubnub.add_channel_to_channel_group() \  
            .channels(["ch1", "ch2"]) \  
            .channel_group("cg1") \  
            .sync()  
        print("Channels added to channel group successfully.")  
    except PubNubException as e:  
        print(f"Error: {e}")  
`
```

Named arguments
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.exceptions import PubNubException  
  
  
def add_channels_to_group(pubnub: PubNub):  
    try:  
        pubnub.add_channel_to_channel_group(  
            channels=["ch1", "ch2"],  
            channel_group="cg1"  
        ).sync()  
        print("Channels added to channel group successfully.")  
    except PubNubException as e:  
        print(f"Error: {e}")  
`
```

#### Returns

`Envelope.result` → `PNChannelGroupsAddChannelResult`

```
`Channel successfully added  
`
```

---

## List Channels

*Requires the **Stream Controller** add-on.*

#### Method

```
`pubnub.list_channels_in_channel_group() \  
    .channel_group(String)  
`
```

Parameter  
• `channel_group` String – group to query

#### Examples

Builder pattern
```
`result = pubnub.list_channels_in_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
```

Named arguments
```
`result = pubnub.list_channels_in_channel_group(channel_group="cg1").sync()  
`
```

#### Returns

`Envelope.result` → `PNChannelGroupsListResult`

Fields:  
• `channels` Dictionary – list of channels in the group

---

## Remove Channels

*Requires the **Stream Controller** add-on.*

#### Method

```
`pubnub.remove_channel_from_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
```

Parameters  
• `channels` String | List | Tuple – channels to remove  
• `channel_group` String – source group

#### Examples

Builder pattern
```
`pubnub.remove_channel_from_channel_group() \  
    .channels(["son", "daughter"]) \  
    .channel_group("channel_group") \  
    .sync()  
`
```

Named arguments
```
`pubnub.remove_channel_from_channel_group(channels=["ch1", "ch2"], channel_group="cg1").sync()  
`
```

#### Returns

`Envelope.result` → `PNChannelGroupsRemoveChannelResult`

```
`Channel successfully removed  
`
```

---

## Delete Channel Group

*Requires the **Stream Controller** add-on.*

#### Method

```
`pubnub.remove_channel_group(channel_group)  
`
```

Parameter  
• `channel_group` String – group to delete

#### Examples

Builder pattern
```
`pubnub.remove_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
```

Named arguments
```
`pubnub.remove_channel_group(channel_group="cg1").sync()  
`
```

#### Returns

`Envelope.result` → `PNChannelGroupsRemoveGroupResult`

```
`Group successfully removed**`
```

_Last updated: Apr 29 2025_