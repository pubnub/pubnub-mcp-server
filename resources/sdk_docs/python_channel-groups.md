# Channel Groups – Python SDK (Condensed)

Channel Groups let you treat a collection of channels as a single subscription target.  
• Publish **to individual channels only**, not to a group.  
• All Channel-Group APIs require the **Stream Controller** add-on.  

## Request Execution

Synchronous  
````
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
````  
• Returns `Envelope(result, status)` where `result` is API-specific and `status` is `PNStatus`.

Asynchronous  
````
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
````  
• Returns `None`; callback receives `result, status`.

---

## 1. Add Channels to a Group

Method  
````
`pubnub.add_channel_to_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
````  
Parameters  
• `channels` (str | list | tuple) – up to 200 per call  
• `channel_group` (str) – target group  

Sample – Builder pattern  
````
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
````

Sample – Named args  
````
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
````

Return  
`Envelope.result` → `PNChannelGroupsAddChannelResult`  
````
`Channel successfully added  
`
````

---

## 2. List Channels in a Group

Method  
````
`pubnub.list_channels_in_channel_group() \  
    .channel_group(String)  
`
````  
Parameter: `channel_group` (str)

Sample  
````
`result = pubnub.list_channels_in_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
````  

````
`result = pubnub.list_channels_in_channel_group(channel_group="cg1").sync()  
`
````  

Return  
`Envelope.result` → `PNChannelGroupsListResult`  
• `channels` – list of channels

---

## 3. Remove Channels from a Group

Method  
````
`pubnub.remove_channel_from_channel_group() \  
    .channels(String|List|Tuple) \  
    .channel_group(String)  
`
````  
Parameters  
• `channels` (str | list | tuple) – channels to remove  
• `channel_group` (str) – target group  

Sample  
````
`pubnub.remove_channel_from_channel_group() \  
    .channels(["son", "daughter"]) \  
    .channel_group("channel_group") \  
    .sync()  
`
````  

````
`pubnub.remove_channel_from_channel_group(channels=["ch1", "ch2"], channel_group="cg1").sync()  
`
````  

Return  
`Envelope.result` → `PNChannelGroupsRemoveChannelResult`  
````
`Channel successfully removed  
`
````

---

## 4. Delete a Channel Group

Method  
````
`pubnub.remove_channel_group(channel_group)  
`
````  
Parameter: `channel_group` (str)

Sample  
````
`pubnub.remove_channel_group() \  
    .channel_group("cg1") \  
    .sync()  
`
````  

````
`pubnub.remove_channel_group(channel_group="cg1").sync()  
`
````  

Return  
`Envelope.result` → `PNChannelGroupsRemoveGroupResult`  
````
`Group successfully removed**`
````

_Last updated Jul 15 2025_