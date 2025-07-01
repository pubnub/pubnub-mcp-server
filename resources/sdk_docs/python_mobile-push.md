On this page
# Mobile Push Notifications API for Python SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

## Add Device to Channel[​](#add-device-to-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Python SDK:

```
`pubnub.add_channels_to_push() \  
    .push_type(PNPushType) \  
    .channels(List) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

*  requiredParameterDescription`push_type` *Type: PNPushTypeDefault:  
n/aThe available push types. Accepted values: `PNPushType.GCM`, `PNPushType.APNS2``channels` *Type: ListDefault:  
n/aThe `channels` to add the mobile push notifications to.`device_id` *Type: StringDefault:  
n/aThe device ID (token) to associate with the mobile push notifications.`topic`Type: StringDefault:  
n/aThe topic name for the notification. For the Apple platform, this is the application's bundle identifier. Required only if `push_type` is set to `PNPushType.APNS2`.`environment`Type: StringDefault:  
`PNPushEnvironment.DEVELOPMENT`The environment where the device should manage the list of channels with enabled notifications. Required only if `push_type` is set to `PNPushType.APNS2`.

### Basic Usage[​](#basic-usage)

#### Add Device to Channel[​](#add-device-to-channel-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

- Builder Pattern
- Named Arguments

```
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
show all 48 lines
```
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
show all 48 lines

### Returns[​](#returns)

The `add_channels_to_push()` operation does not return actionable data. You can check the `status` object for the outcome by inspecting `status.is_error()`.

## List Channels For Device[​](#list-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Python SDK:

```
`pubnub.list_push_channels() \  
    .push_type(PNPushType) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

*  requiredParameterDescription`push_type` *Type: PNPushTypeDefault:  
n/aThe available push types. Accepted values: `PNPushType.GCM`, `PNPushType.APNS2``device_id` *Type: StringDefault:  
n/aThe device ID (token) to associate with the mobile push notifications.`topic`Type: StringDefault:  
n/aThe topic name for the notification. For the Apple platform, this is the application's bundle identifier. Required only if `push_type` is set to `PNPushType.APNS2`.`environment`Type: StringDefault:  
`PNPushEnvironment.DEVELOPMENT`The environment where the device should manage the list of channels with enabled notifications. Required only if `push_type` is set to `PNPushType.APNS2`.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

- Builder Pattern
- Named Arguments

```
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

```
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

### Returns[​](#returns-1)

The `list_push_channels()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNPushListProvisionsResult`](#pnpushlistprovisionsresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNPushListProvisionsResult[​](#pnpushlistprovisionsresult)

MethodDescription`Channels`Type: ListList of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels. If `nil` will be passed as channels then client will remove mobile push notifications from all channels which associated with `pushToken`.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel` you can use the following method(s) in the Python SDK:

```
`pubnub.remove_channels_from_push() \  
    .push_type(PNPushType) \  
    .channels(List) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

*  requiredParameterDescription`push_type` *Type: PNPushTypeDefault:  
n/aThe available push types. Accepted values: `PNPushType.GCM`, `PNPushType.APNS2``channels` *Type: ListDefault:  
n/aThe `channels` to add the mobile push notifications to.`device_id` *Type: StringDefault:  
n/aThe device ID (token) to associate with the mobile push notifications.`topic`Type: StringDefault:  
n/aThe topic name for the notification. For the Apple platform, this is the application's bundle identifier. Required only if `push_type` is set to `PNPushType.APNS2`.`environment`Type: StringDefault:  
`PNPushEnvironment.DEVELOPMENT`The environment where the device should manage the list of channels with enabled notifications. Required only if `push_type` is set to `PNPushType.APNS2`.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

- Builder Pattern
- Named Arguments

```
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
show all 18 lines
```
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

### Returns[​](#returns-2)

The `remove_channels_from_push()` operation does not return actionable data. You can check the `status` object for the outcome by inspecting `status.is_error()`.

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified `pushToken`.

### Method(s)[​](#methods-3)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Python SDK:

```
`pubnub.remove_device_from_push() \  
    .push_type(PNPushType) \  
    .device_id(String) \  
    .topic(String) \  
    .environment(PNPushEnvironment)  
`
```

*  requiredParameterDescription`push_type` *Type: PNPushTypeDefault:  
n/aThe available push types. Accepted values: `PNPushType.GCM`, `PNPushType.MPNS`, `PNPushType.APNS2``device_id` *Type: StringDefault:  
n/aThe device ID (token) to associate with the mobile push notifications.`topic`Type: StringDefault:  
n/aThe topic name for the notification. For the Apple platform, this is the application's bundle identifier. Required only if `push_type` is set to `PNPushType.APNS2`.`environment`Type: StringDefault:  
`PNPushEnvironment.DEVELOPMENT`The environment where the device should manage the list of channels with enabled notifications. Required only if `push_type` is set to `PNPushType.APNS2`.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

- Builder Pattern
- Named Arguments

```
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

```
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

### Returns[​](#returns-3)

The `remove_device_from_push()` operation does not return actionable data. You can check the `status` object for the outcome by inspecting `status.is_error()`.
Last updated on **Apr 29, 2025**