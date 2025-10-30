# Mobile Push Notifications API for Python SDK

Connect PubNub publishing with push services: Google FCM (Android) and Apple APNs (iOS). Requires enabling the Mobile Push Notifications add-on for your key in the Admin Portal.

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

`.pn_async(callback)` returns `None` and invokes your callback with `result` and `status`.

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  
```

## Add a device to a push notifications channel

Requires Mobile Push Notifications add-on. Enable in the Admin Portal. Enable push notifications on a set of channels for a device token.

### Method(s)

```
`1pubnub.add_channels_to_push() \  
2    .push_type(PNPushType) \  
3    .channels(List) \  
4    .device_id(String) \  
5    .topic(String) \  
6    .environment(PNPushEnvironment)  
`
```

Parameters:
- push_type (Type: PNPushType) Accepted: PNPushType.GCM, PNPushType.APNS2
- channels (Type: List) Channels to enable push for.
- device_id (Type: String) Device token.
- topic (Type: String) APNs topic (iOS bundle identifier). Required for PNPushType.APNS2.
- environment (Type: PNPushEnvironment, Default: PNPushEnvironment.DEVELOPMENT) APNs environment. Required for PNPushType.APNS2.

### Sample code

#### Add device to channel

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.enums import PNPushType, PNPushEnvironment  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def add_device_to_channel(pubnub: PubNub):  
9    try:  
10        # For FCM/GCM  
11        pubnub.add_channels_to_push() \  
12            .push_type(PNPushType.GCM) \  
13            .channels(["ch1", "ch2", "ch3"]) \  
14            .device_id("deviceId") \  
15            .sync()  
16        print("Device added to channels for FCM/GCM successfully.")  
17
  
18        # For APNS2 device token should be 32 or 100 byte hex  
19        pubnub.add_channels_to_push() \  
20            .push_type(PNPushType.APNS2) \  
21            .channels(["ch1", "ch2", "ch3"]) \  
22            .device_id("00000000000000000000000000000000") \  
23            .topic("myapptopic") \  
24            .environment(PNPushEnvironment.DEVELOPMENT) \  
25            .sync()  
26        print("Device added to channels for APNS2 successfully.")  
27
  
28    except PubNubException as e:  
29        print(f"Error: {e}")  
30
  
31
  
32def main():  
33    # Configuration for PubNub instance  
34    pn_config = PNConfiguration()  
35    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
36    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
37    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
38
  
39    # Initialize PubNub client  
40    pubnub = PubNub(pn_config)  
41
  
42    # Add device to channel  
43    add_device_to_channel(pubnub)  
44
  
45
  
46if __name__ == "__main__":  
47    main()  
48
```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.enums import PNPushType, PNPushEnvironment  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def add_device_to_channel(pubnub: PubNub):  
9    try:  
10        # For FCM/GCM  
11        pubnub.add_channels_to_push(  
12            push_type=PNPushType.GCM,  
13            channels=["ch1", "ch2", "ch3"],  
14            device_id="deviceId"  
15        ).sync()  
16        print("Device added to channels for FCM/GCM successfully.")  
17
  
18        # For APNS2  
19        pubnub.add_channels_to_push(  
20            push_type=PNPushType.APNS2,  
21            channels=["ch1", "ch2", "ch3"],  
22            device_id="00000000000000000000000000000000",  
23            topic="myapptopic",  
24            environment=PNPushEnvironment.DEVELOPMENT  
25        ).sync()  
26        print("Device added to channels for APNS2 successfully.")  
27
  
28    except PubNubException as e:  
29        print(f"Error: {e}")  
30
  
31
  
32def main():  
33    # Configuration for PubNub instance  
34    pn_config = PNConfiguration()  
35    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
36    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
37    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
38
  
39    # Initialize PubNub client  
40    pubnub = PubNub(pn_config)  
41
  
42    # Add device to channel  
43    add_device_to_channel(pubnub)  
44
  
45
  
46if __name__ == "__main__":  
47    main()  
48
```

### Returns

No actionable data. Inspect `status.is_error()` on the returned status.

## List channels for device

Requires Mobile Push Notifications add-on. Lists channels with push enabled for the given device token.

### Method(s)

```
`1pubnub.list_push_channels() \  
2    .push_type(PNPushType) \  
3    .device_id(String) \  
4    .topic(String) \  
5    .environment(PNPushEnvironment)  
`
```

Parameters:
- push_type (Type: PNPushType) Accepted: PNPushType.GCM, PNPushType.APNS2
- device_id (Type: String) Device token.
- topic (Type: String) APNs topic. Required for PNPushType.APNS2.
- environment (Type: PNPushEnvironment, Default: PNPushEnvironment.DEVELOPMENT) APNs environment. Required for PNPushType.APNS2.

### Sample code

- Builder Pattern
- Named Arguments

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.list_push_channels() \  
5    .push_type(PNPushType.GCM) \  
6    .device_id("deviceId") \  
7    .sync()  
8
  
9# for APNS2  
10envelope = pubnub.list_push_channels() \  
11    .push_type(PNPushType.APNS2) \  
12    .device_id("deviceId") \  
13    .topic("myapptopic") \  
14    .environment(PNPushEnvironment.DEVELOPMENT) \  
15    .sync()  
```

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.list_push_channels(push_type=PNPushType.GCM, device_id="deviceId").sync()  
5
  
6# for APNS2  
7envelope = pubnub.list_push_channels(push_type=PNPushType.APNS2,  
8                                     device_id="deviceId",  
9                                     topic="myapptopic",  
10                                     environment=PNPushEnvironment.DEVELOPMENT) \  
11    .sync()  
```

### Returns

`Envelope` with:
- result (PNPushListProvisionsResult) channels: List of channels associated for push.
- status (PNStatus)

## Remove device from channel

Requires Mobile Push Notifications add-on. Disable push notifications on a set of channels for a device token.

### Method(s)

```
`1pubnub.remove_channels_from_push() \  
2    .push_type(PNPushType) \  
3    .channels(List) \  
4    .device_id(String) \  
5    .topic(String) \  
6    .environment(PNPushEnvironment)  
`
```

Parameters:
- push_type (Type: PNPushType) Accepted: PNPushType.GCM, PNPushType.APNS2
- channels (Type: List) Channels to disable.
- device_id (Type: String) Device token.
- topic (Type: String) APNs topic. Required for PNPushType.APNS2.
- environment (Type: PNPushEnvironment, Default: PNPushEnvironment.DEVELOPMENT) APNs environment. Required for PNPushType.APNS2.

### Sample code

- Builder Pattern
- Named Arguments

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.remove_channels_from_push() \  
5    .push_type(PNPushType.GCM) \  
6    .channels("ch1", "ch2", "ch3") \  
7    .device_id("deviceId") \  
8    .sync()  
9
  
10# for APNS2  
11
  
12envelope = pubnub.remove_channels_from_push() \  
13    .push_type(PNPushType.APNS2) \  
14    .channels("ch1", "ch2", "ch3") \  
15    .device_id("deviceId") \  
16    .topic("myapptopic") \  
17    .environment(PNPushEnvironment.DEVELOPMENT) \  
18    .sync()  
```

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],  
5                                            push_type=PNPushType.GCM,  
6                                            device_id="deviceId") \  
7    .sync()  
8
  
9# for APNS2  
10envelope = pubnub.remove_channels_from_push(channels=["ch1", "ch2", "ch3"],  
11                                            push_type=PNPushType.APNS2,  
12                                            device_id="deviceId",  
13                                            topic="myapptopic",  
14                                            environment=PNPushEnvironment.DEVELOPMENT) \  
15    .sync()  
```

### Returns

No actionable data. Inspect `status.is_error()`.

## Remove all mobile push notifications

Requires Mobile Push Notifications add-on. Disable push notifications for all channels registered with the device token.

### Method(s)

```
`1pubnub.remove_device_from_push() \  
2    .push_type(PNPushType) \  
3    .device_id(String) \  
4    .topic(String) \  
5    .environment(PNPushEnvironment)  
`
```

Parameters:
- push_type (Type: PNPushType) Accepted: PNPushType.GCM, PNPushType.MPNS, PNPushType.APNS2
- device_id (Type: String) Device token.
- topic (Type: String) APNs topic. Required for PNPushType.APNS2.
- environment (Type: PNPushEnvironment, Default: PNPushEnvironment.DEVELOPMENT) APNs environment. Required for PNPushType.APNS2.

### Sample code

- Builder Pattern
- Named Arguments

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.remove_device_from_push() \  
5    .push_type(PNPushType.GCM) \  
6    .device_id("deviceId") \  
7    .sync()  
8
  
9# for APNS2  
10envelope = pubnub.remove_device_from_push() \  
11    .push_type(PNPushType.APNS2) \  
12    .device_id("deviceId") \  
13    .topic("myapptopic") \  
14    .environment(PNPushEnvironment.DEVELOPMENT) \  
15    .sync()  
```

```
1from pubnub.enums import PNPushType, PNPushEnvironment  
2
  
3# for FCM/GCM  
4envelope = pubnub.remove_device_from_push(device_id="deviceId", push_type=PNPushType.GCM).sync()  
5# for APNS2  
6envelope = pubnub.remove_device_from_push(device_id="deviceId",  
7                                          push_type=PNPushType.APNS2,  
8                                          topic="myapptopic",  
9                                          environment=PNPushEnvironment.DEVELOPMENT) \  
10    .sync()  
```

### Returns

No actionable data. Inspect `status.is_error()`.

Last updated on Oct 29, 2025