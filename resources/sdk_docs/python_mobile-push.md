# Mobile Push Notifications API for Python SDK

Connect PubNub publishing with third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). See Mobile Push Notifications overview: /docs/general/push/send.

##### Request execution and return values

You can run Python SDK operations synchronously or asynchronously.

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

`.pn_async(callback)` returns `None` and invokes your callback with `Envelope.result` and `Envelope.status`.

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

##### Requires Mobile Push Notifications add-on
Enable for your key in the Admin Portal: https://admin.pubnub.com/. How to enable add-ons: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Enable mobile push notifications on a set of channels.

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
- push_type (PNPushType, required): Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.
- channels (List, required): Channels to enable for mobile push notifications.
- device_id (String, required): Device token/ID to associate.
- topic (String, APNS2 only): APNs topic (bundle identifier).
- environment (PNPushEnvironment, default `PNPushEnvironment.DEVELOPMENT`, APNS2 only): APNs environment to manage channels.

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

No actionable data. Inspect `status.is_error()` for outcome.

## List channels for device

##### Requires Mobile Push Notifications add-on
Enable in Admin Portal: https://admin.pubnub.com/. Add-on enablement info: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

List channels that have push enabled for the specified device token.

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
- push_type (PNPushType, required): Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.
- device_id (String, required): Device token.
- topic (String, APNS2 only): APNs topic (bundle identifier).
- environment (PNPushEnvironment, default `PNPushEnvironment.DEVELOPMENT`, APNS2 only): APNs environment.

### Sample code

#### List channels for device

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

`list_push_channels()` returns an `Envelope`:
- result: `PNPushListProvisionsResult`
- status: `PNStatus`

`PNPushListProvisionsResult`:
- Channels (List): Channels associated for mobile push notifications.

## Remove device from channel

##### Requires Mobile Push Notifications add-on
Enable in Admin Portal: https://admin.pubnub.com/. Add-on enablement info: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Disable mobile push notifications on a set of channels.

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
- push_type (PNPushType, required): Accepted values: `PNPushType.GCM`, `PNPushType.APNS2`.
- channels (List, required): Channels to disable for push notifications.
- device_id (String, required): Device token.
- topic (String, APNS2 only): APNs topic (bundle identifier).
- environment (PNPushEnvironment, default `PNPushEnvironment.DEVELOPMENT`, APNS2 only): APNs environment.

### Sample code

#### Remove device from channel

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

No actionable data. Inspect `status.is_error()` for outcome.

## Remove all mobile push notifications

##### Requires Mobile Push Notifications add-on
Enable in Admin Portal: https://admin.pubnub.com/. Add-on enablement info: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

Disable mobile push notifications from all channels for the specified device token.

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
- push_type (PNPushType, required): Accepted values: `PNPushType.GCM`, `PNPushType.MPNS`, `PNPushType.APNS2`.
- device_id (String, required): Device token.
- topic (String, APNS2 only): APNs topic (bundle identifier).
- environment (PNPushEnvironment, default `PNPushEnvironment.DEVELOPMENT`, APNS2 only): APNs environment.

### Sample code

#### Remove all mobile push notifications

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

No actionable data. Inspect `status.is_error()` for outcome.

Last updated on Oct 29, 2025