# PubNub Python SDK – Mobile Push Notifications

Requires the **Mobile Push Notifications** add-on (enable in the Admin Portal).

---

## Synchronous vs. Asynchronous Execution
`.sync()` → returns an `Envelope` (`result`, `status`).  
`.pn_async(callback)` → returns `None`, delivers the same two objects to the callback.

```python
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

```python
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

---

## 1. Add Device to Channel

```python
`pubnub.add_channels_to_push() \  
    .push_type(PNPushType) \  
    .channels(List) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

Parameters  
• `push_type` (PNPushType) – `GCM`, `APNS2`  
• `channels` (List[str]) – channels to enable push on  
• `device_id` (str) – FCM/APNS token  
• `topic` (str) – iOS bundle ID, **required for APNS2**  
• `environment` (PNPushEnvironment) – `DEVELOPMENT` (default) or `PRODUCTION`, **APNS2 only**

Returns  
No payload; check `status.is_error()`.

Examples – Builder & Named Arguments

```python
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.enums import PNPushType, PNPushEnvironment  
from pubnub.exceptions import PubNubException  
  
def add_device_to_channel(pubnub: PubNub):  
    try:  
        # For FCM/GCM  
        pubnub.add_channels_to_push() \  
            .push_type(PNPushType.GCM) \  
            .channels(["ch1", "ch2", "ch3"]) \  
            .device_id("deviceId") \  
            .sync()  
`
```

```python
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.enums import PNPushType, PNPushEnvironment  
from pubnub.exceptions import PubNubException  
  
def add_device_to_channel(pubnub: PubNub):  
    try:  
        # For FCM/GCM  
        pubnub.add_channels_to_push(  
            push_type=PNPushType.GCM,  
            channels=["ch1", "ch2", "ch3"],  
            device_id="deviceId"  
        ).sync()  
`
```

---

## 2. List Channels for Device

```python
`pubnub.list_push_channels() \  
    .push_type(PNPushType) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

Parameters (same as above, without `channels`).  
Returns `Envelope.result` = `PNPushListProvisionsResult` → `channels` (List[str]).

Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.list_push_channels() \  
    .push_type(PNPushType.GCM) \  
    .device_id("deviceId") \  
    .sync()  
  
# for APNS2  
envelope = pubnub.list_push_channels() \  
    .push_type(PNPushType.APNS2) \  
    .device_id("deviceId") \  
    .topic("myapptopic") \  
    .environment(PNPushEnvironment.DEVELOPMENT) \  
    .sync()  
`
```

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.list_push_channels(push_type=PNPushType.GCM, device_id="deviceId").sync()  
  
# for APNS2  
envelope = pubnub.list_push_channels(push_type=PNPushType.APNS2,  
                                     device_id="deviceId",  
                                     topic="myapptopic",  
                                     environment=PNPushEnvironment.DEVELOPMENT) \  
    .sync()  
`
```

---

## 3. Remove Device from Specific Channels

```python
`pubnub.remove_channels_from_push() \  
    .push_type(PNPushType) \  
    .channels(List) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

Same parameters as “Add Device”, `channels` may be `None` to remove from *all* channels.  
Returns: check `status.is_error()`.

Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.remove_channels_from_push() \  
    .push_type(PNPushType.GCM) \  
    .channels("ch1", "ch2", "ch3") \  
    .device_id("deviceId") \  
    .sync()  
  
# for APNS2  
  
envelope = pubnub.remove_channels_from_push() \  
    .push_type(PNPushType.APNS2) \  
    .channels("ch1", "ch2", "ch3") \  
    .device_id("deviceId") \  
`
```

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],  
                                            push_type=PNPushType.GCM,  
                                            device_id="deviceId") \  
    .sync()  
  
# for APNS2  
envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],  
                                            push_type=PNPushType.APNS2,  
                                            device_id="deviceId",  
                                            topic="myapptopic",  
                                            environment=PNPushEnvironment.DEVELOPMENT) \  
    .sync()  
`
```

---

## 4. Remove Device from *All* Channels

```python
`pubnub.remove_device_from_push() \  
    .push_type(PNPushType) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

Parameters  
• `push_type` (PNPushType) – `GCM`, `MPNS`, `APNS2`  
• `device_id`, `topic`, `environment` (same behavior as above)

Returns: check `status.is_error()`.

Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.remove_device_from_push() \  
    .push_type(PNPushType.GCM) \  
    .device_id("deviceId") \  
    .sync()  
  
# for APNS2  
envelope = pubnub.remove_device_from_push() \  
    .push_type(PNPushType.APNS2) \  
    .device_id("deviceId") \  
    .topic("myapptopic") \  
    .environment(PNPushEnvironment.DEVELOPMENT) \  
    .sync()  
`
```

```python
`from pubnub.enums import PNPushType, PNPushEnvironment  
  
# for FCM/GCM  
envelope = pubnub.remove_device_from_push(device_id="deviceId", push_type=PNPushType.GCM).sync()  
# for APNS2  
envelope = pubnub.remove_device_from_push(device_id="deviceId",  
                                          push_type=PNPushType.APNS2,  
                                          topic="myapptopic",  
                                          environment=PNPushEnvironment.DEVELOPMENT) \  
    .sync()  
`
```

_Last updated: Apr 29 2025_