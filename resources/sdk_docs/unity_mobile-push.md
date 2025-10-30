# Mobile Push Notifications API for Unity SDK

Connect native PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). Learn more: Mobile Push Notifications (/docs/general/push/send).

Prerequisites
- Requires Mobile Push Notifications add-on. Enable for your key in the Admin Portal (https://admin.pubnub.com/). See enabling add-on features: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

## Add a device to a push notifications channel[​](#add-a-device-to-a-push-notifications-channel)

Enable mobile push notifications on a set of channels.

### Method(s)[​](#methods)

Use the following method(s) in the Unity SDK:

```
`1pubnub.AddPushNotificationsOnChannels()  
2    .PushType(PNPushType)  
3    .Channels(Array)  
4    .DeviceId(string)  
5    .Environment(PushEnvironment)  
6    .Topic(string)  
7    .QueryParam(Dictionarystring,object>)  
8    .Execute(System.ActionPNPushAddChannelResult, PNStatus>)  
`
```

Parameters and options
- PushType (PNPushType): Accepted values: PNPushType.GCM, PNPushType.FCM, PNPushType.APNS2.
- Channels (Array): Channels to enable for push notifications.
- DeviceId (string): Device token.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.
- Callback/Async:
  - Execute: System.Action<PNPushAddChannelResult, PNStatus>
  - ExecuteAsync: Task<PNResult<PNPushAddChannelResult>>

### Sample code[​](#sample-code)

#### Add device to channel[​](#add-device-to-channel)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns[​](#returns)

AddPushNotificationsOnChannels() does not return actionable data. Check status.isError() on the status object.

## List push notifications channels for a device[​](#list-push-notifications-channels-for-a-device)

List channels that have push notifications enabled for the specified device token.

### Method(s)[​](#methods-1)

Use the following method(s) in the Unity SDK:

```
`1pubnub.AuditPushChannelProvisions()  
2    .DeviceId(string)  
3    .PushType(PNPushType)  
4    .Environment(PushEnvironment)  
5    .Topic(string)  
6    .QueryParam(Dictionarystring,object>)  
7    .Execute(System.ActionPNPushListProvisionsResult, PNStatus>)  
`
```

Parameters and options
- DeviceId (string): Device token.
- PushType (PNPushType): Accepted values: PNPushType.GCM, PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.
- Callback/Async:
  - Execute: System.Action<PNPushListProvisionsResult, PNStatus>
  - ExecuteAsync: Task<PNResult<PNPushListProvisionsResult>>

### Sample code[​](#sample-code-1)

#### List channels for device[​](#list-channels-for-device)

```
1
  

```

### Returns[​](#returns-1)

AuditPushChannelProvisions() returns PNPushListProvisionsResult with:
- Channels (List<string>): Channels with push notifications enabled.

## Remove a device from push notifications channels[​](#remove-a-device-from-push-notifications-channels)

Disable mobile push notifications on a set of channels.

### Method(s)[​](#methods-2)

Use the following method(s) in the Unity SDK:

```
`1pubnub.RemovePushNotificationsFromChannels()  
2    .DeviceId(string)  
3    .Channels(Array)  
4    .PushType(PNPushType)  
5    .Environment(PushEnvironment)  
6    .Topic(string)  
7    .QueryParam(Dictionarystring,object>)  
`
```

Parameters and options
- DeviceId (string): Device token.
- Channels (Array): Channels to disable for push notifications.
- PushType (PNPushType): Accepted values: PNPushType.GCM, PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.

### Sample code[​](#sample-code-2)

#### Remove device from channel[​](#remove-device-from-channel)

```
1
  

```

### Returns[​](#returns-2)

RemovePushNotificationsFromChannels() does not return actionable data. Check status.isError() on the status object.

## Remove a device from all push notifications channels[​](#remove-a-device-from-all-push-notifications-channels)

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)[​](#methods-3)

Use the following method(s) in the Unity SDK:

```
`1pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
2    .DeviceId(string)  
3    .PushType(PNPushType)  
4    .Environment(PushEnvironment)  
5    .Topic(string)  
6    .QueryParam(Dictionarystring,object>)  
7    .Execute(System.ActionPNPushRemoveAllChannelsResult, PNStatus>)  
`
```

Parameters and options
- DeviceId (string): Device token.
- PushType (PNPushType): Accepted values: PNPushType.GCM, PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.
- Callback/Async:
  - Execute: System.Action<PNPushRemoveAllChannelsResult, PNStatus>

### Sample code[​](#sample-code-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

```
1
  

```

### Returns[​](#returns-3)

RemoveAllPushNotificationsFromDeviceWithPushToken() returns PNPushRemoveAllChannelsResult and PNStatus.

Last updated on Oct 29, 2025