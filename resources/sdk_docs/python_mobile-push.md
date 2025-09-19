# Mobile Push Notifications – PubNub Python SDK

Bridges PubNub with FCM (GCM) and APNs/APNS2.  
Requires the **Mobile Push Notifications** add-on to be enabled for your key.

---

## Request execution

`.sync()` – blocking, returns `Envelope` (`result`, `status`).  
`.pn_async(callback)` – non-blocking, returns `None`; supplies `result`, `status` to `callback`.

```python
`pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .sync()`
```

```python
`def my_callback(result, status):
    print(f'TT:{result.timetoken}, status:{status.category.name}')

pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .pn_async(my_callback)`
```

---

## Add device to channel

Enable push on one or more channels.

```python
`pubnub.add_channels_to_push() \
    .push_type(PNPushType) \
    .channels(List) \
    .device_id(String) \
    .topic(String) \
    .environment(PNPushEnvironment)`
```

Parameters  
* `push_type` (PNPushType, required) – PNPushType.GCM | PNPushType.APNS2  
* `channels` (List, required) – channel list to enable.  
* `device_id` (String, required) – device token.  
* `topic` (String, APNS2 only) – bundle identifier.  
* `environment` (PNPushEnvironment, APNS2 only, default PNPushEnvironment.DEVELOPMENT)

### Examples

Builder pattern
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
            .sync()`
```

Named arguments
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
        ).sync()`
```

Return: check `status.is_error()`.

---

## List channels for device

Fetch all channels with push enabled for a device.

```python
`pubnub.list_push_channels() \
    .push_type(PNPushType) \
    .device_id(String) \
    .topic(String) \
    .environment(PNPushEnvironment)`
```

Parameters identical to *Add device* (exclude `channels`).

### Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.list_push_channels() \
    .push_type(PNPushType.GCM) \
    .device_id("deviceId") \
    .sync()

# APNS2
envelope = pubnub.list_push_channels() \
    .push_type(PNPushType.APNS2) \
    .device_id("deviceId") \
    .topic("myapptopic") \
    .environment(PNPushEnvironment.DEVELOPMENT) \
    .sync()`
```

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.list_push_channels(push_type=PNPushType.GCM,
                                     device_id="deviceId").sync()

# APNS2
envelope = pubnub.list_push_channels(push_type=PNPushType.APNS2,
                                     device_id="deviceId",
                                     topic="myapptopic",
                                     environment=PNPushEnvironment.DEVELOPMENT).sync()`
```

Return (`Envelope.result`) – `PNPushListProvisionsResult`  
* `channels` (List) – associated channels.  

---

## Remove device from channel(s)

Disable push on the specified channels (empty `channels` removes from all).

```python
`pubnub.remove_channels_from_push() \
    .push_type(PNPushType) \
    .channels(List) \
    .device_id(String) \
    .topic(String) \
    .environment(PNPushEnvironment)`
```

Parameters same as *Add device*.

### Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.remove_channels_from_push() \
    .push_type(PNPushType.GCM) \
    .channels("ch1", "ch2", "ch3") \
    .device_id("deviceId") \
    .sync()

# APNS2
envelope = pubnub.remove_channels_from_push() \
    .push_type(PNPushType.APNS2) \
    .channels("ch1", "ch2", "ch3") \
    .device_id("deviceId")`
```
*(code block truncated in original)*

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],
                                            push_type=PNPushType.GCM,
                                            device_id="deviceId").sync()

# APNS2
envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],
                                            push_type=PNPushType.APNS2,
                                            device_id="deviceId",
                                            topic="myapptopic",
                                            environment=PNPushEnvironment.DEVELOPMENT).sync()`
```

Return: use `status.is_error()`.

---

## Remove all mobile push notifications

Remove device from all channels.

```python
`pubnub.remove_device_from_push() \
    .push_type(PNPushType) \
    .device_id(String) \
    .topic(String) \
    .environment(PNPushEnvironment)`
```

Parameters  
* `push_type` (PNPushType.GCM | PNPushType.MPNS | PNPushType.APNS2)  
* others identical to previous methods.

### Examples

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.remove_device_from_push() \
    .push_type(PNPushType.GCM) \
    .device_id("deviceId") \
    .sync()

# APNS2
envelope = pubnub.remove_device_from_push() \
    .push_type(PNPushType.APNS2) \
    .device_id("deviceId") \
    .topic("myapptopic") \
    .environment(PNPushEnvironment.DEVELOPMENT) \
    .sync()`
```

```python
`from pubnub.enums import PNPushType, PNPushEnvironment

# FCM/GCM
envelope = pubnub.remove_device_from_push(device_id="deviceId",
                                          push_type=PNPushType.GCM).sync()
# APNS2
envelope = pubnub.remove_device_from_push(device_id="deviceId",
                                          push_type=PNPushType.APNS2,
                                          topic="myapptopic",
                                          environment=PNPushEnvironment.DEVELOPMENT).sync()`
```

Return: check `status.is_error()`.

---

_Last updated Jul 15 2025_