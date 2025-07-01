On this page
# Mobile Push Notifications API for Unity SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to Channel[​](#add-device-to-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Unity SDK:

```
`pubnub.AddPushNotificationsOnChannels()  
    .PushType(PNPushType)  
    .Channels(Array)  
    .DeviceId(string)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPushAddChannelResult, PNStatus>)  
`
```

*  requiredParameterDescription`PushType` *Type: PNPushTypeAccepted values: `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.`Channels` *Type: ArrayAdd mobile push notifications on the specified `Channels`.`DeviceId` *Type: stringDevice ID.`Environment`Type: `PushEnvironment``PNPushType.APNS2` only. Apple APNs server (refer to [this Apple document](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns#2947606)) to contact. Valid values are Development and Production.`Topic`Type: string`PNPushType.APNS2` only. Notification topic name (usually the application's bundle identifier).`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNPushAddChannelResult`.`Execute` *Type: `System.Action``System.Action` of type `PNPushAddChannelResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPushAddChannelResult>>`.

### Basic Usage[​](#basic-usage)

#### Add Device to Channel[​](#add-device-to-channel-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class AddPushNotificationsExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized array for the channels to add notifications  
    [SerializeField] private string[] channels = { "ch1", "ch2", "ch3" };  
  
    // An editor-serialized string for the device IDs  
    [SerializeField] private string fcmDeviceId = "googleDevice";  
    [SerializeField] private string apnsDeviceId = "appleDevice";  
`
```
show all 52 lines

### Returns[​](#returns)

The `AddPushNotificationsOnChannels()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the `status.isError()`.

## List Channels For Device[​](#list-channels-for-device)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Unity SDK:

```
`pubnub.AuditPushChannelProvisions()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPushListProvisionsResult, PNStatus>)  
`
```

*  requiredParameterDescription`DeviceId` *Type: stringDevice ID.`PushType` *Type: PNPushTypeAccepted values: `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.`Environment`Type: `PushEnvironment``PNPushType.APNS2` only. Apple APNs server (refer to [this Apple document](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns#2947606)) to contact. Valid values are Development and Production.`Topic`Type: string`PNPushType.APNS2` only. Notification topic name (usually the application's bundle identifier).`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNPushListProvisionsResult`.`Execute` *Type: `System.Action``System.Action` of type `PNPushListProvisionsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPushListProvisionsResult>>`.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`// for FCM/GCM  
pubnub.AuditPushChannelProvisions()  
    .DeviceId("googleDevice")  
    .PushType(PnPushType.FCM)  
    .Execute((result, status) => {});  
  
// for APNS2  
pubnub.AuditPushChannelProvisions()  
    .DeviceId("appleDevice")  
    .PushType(PNPushType.APNS2)  
    .Topic("myapptopic")  
    .Environment(PushEnvironment.Development)  
    .Execute((result, status) => {});  
`
```

### Returns[​](#returns-1)

The `AuditPushChannelProvisions()` operation returns a `PNPushListProvisionsResult` which contains the following property:

Property NameTypeDescription`Channels`List`<string>`List of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel` you can use the following method(s) in the Unity SDK:

```
`pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId(string)  
    .Channels(Array)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`DeviceId` *Type: stringDevice ID.`Channels` *Type: ArrayRemove mobile push notifications on the specified `Channels`.`PushType` *Type: PNPushTypeAccepted values: `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.`Environment`Type: `PushEnvironment``PNPushType.APNS2` only. Apple APNs server (refer to [this Apple document](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns#2947606)) to contact. Valid values are Development and Production.`Topic`Type: string`PNPushType.APNS2` only. Notification topic name (usually the application's bundle identifier).`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNPushRemoveChannelResult`.`Execute` *Type: PNCallback`PNCallback` of type `PNPushRemoveChannelResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPushRemoveChannelResult>>`.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`// for FCM/GCM  
pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId("googleDevice")  
    .Channels(new string[] {  
        "ch1",  
        "ch2",  
        "ch3"  
    })  
    .PushType(PnPushType.FCM)  
    .Execute((result, status) => {});  
  
// for APNS2  
pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId("appleDevice")  
    .Channels(new string[] {  
`
```
show all 23 lines

### Returns[​](#returns-2)

The `RemovePushNotificationsFromChannels()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the `status.isError()`.

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### Requires Mobile Push Notifications add-on

This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPushRemoveAllChannelsResult, PNStatus>)  
`
```

*  requiredParameterDescription`DeviceId` *Type: stringDevice ID`PushType` *Type: PNPushTypeAccepted values: `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.`Environment`Type: `PushEnvironment``PNPushType.APNS2` only. Apple APNs server (refer to [this Apple document](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns#2947606)) to contact. Valid values are Development and Production.`Topic`Type: string`PNPushType.APNS2` only. Notification topic name (usually the application's bundle identifier).`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNPushRemoveAllChannelsResult`.`Execute` *Type: PNCallback`PNCallback` of type `PNPushRemoveAllChannelsResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNPushRemoveAllChannelsResult>>`.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`// for FCM/GCM  
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId("googleDevice")  
    .PushType(PnPushType.FCM)  
    .Execute(new PNPushRemoveAllChannelsResultExt((r, s) => {  
        Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(r));  
    }));  
  
// for APNS2  
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId("appleDevice")  
    .PushType(PNPushType.APNS2)  
    .Topic("myapptopic")  
    .Environment(PushEnvironment.Development)  
    .Execute(new PNPushRemoveAllChannelsResultExt((r, s) => {  
`
```
show all 17 lines

### Returns[​](#returns-3)

The `RemoveAllPushNotificationsFromDeviceWithPushToken()` operation returns a `PNPushRemoveAllChannelsResult` which contains the following property:

Property NameTypeDescription`PNPushRemoveAllChannelsResult`ObjectReturns empty object.`PNStatus`ObjectReturns `status` of request if error occurred or not.Last updated on **May 6, 2025**