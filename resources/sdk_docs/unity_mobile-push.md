# Mobile Push Notifications API for Unity SDK

Connects PubNub publishing to mobile push services: Google Android FCM and Apple iOS APNs (APNS2). Learn more: Mobile Push Notifications (/docs/general/push/send).

Prerequisite: Requires Mobile Push Notifications add-on enabled for your key in the Admin Portal (https://admin.pubnub.com/). How to enable: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-.

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

### Method(s)

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

Parameters:
- PushType (required): Type PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- Channels (required): Type Array. Channels to enable for push notifications.
- DeviceId (required): Type string. Device token.
- Environment: Type PushEnvironment. APNs environment (APNS2 only).
- Topic: Type string. APNs topic (bundle identifier) (APNS2 only).
- QueryParam: Type Dictionary<string, object>. Optional query parameters for debugging.
- Async: Type PNCallback of type PNPushAddChannelResult.
- Execute: Type System.Action of type PNPushAddChannelResult.
- ExecuteAsync: Returns Task<PNResult<PNPushAddChannelResult>>.

### Sample code

#### Add device to channel

##### Reference code

```
1
  

```

### Returns

AddPushNotificationsOnChannels() returns no actionable data. Check status.isError().

## List push notifications channels for a device

List channels that have push notifications enabled for the specified device token.

### Method(s)

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

Parameters:
- DeviceId (required): Type string. Device token.
- PushType (required): Type PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- Environment: Type PushEnvironment. APNs environment (APNS2 only).
- Topic: Type string. APNs topic (bundle identifier) (APNS2 only).
- QueryParam: Type Dictionary<string, object>. Optional query parameters for debugging.
- Async: Type PNCallback of type PNPushListProvisionsResult.
- Execute: Type System.Action of type PNPushListProvisionsResult.
- ExecuteAsync: Returns Task<PNResult<PNPushListProvisionsResult>>.

### Sample code

#### List channels for device

```
1
  

```

### Returns

AuditPushChannelProvisions() returns PNPushListProvisionsResult with:
- Channels: List<string> of channels with push notifications enabled.

## Remove a device from push notifications channels

Disable mobile push notifications on a set of channels.

### Method(s)

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

Parameters:
- DeviceId (required): Type string. Device token.
- Channels (required): Type Array. Channels to disable for push notifications.
- PushType (required): Type PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- Environment: Type PushEnvironment. APNs environment (APNS2 only).
- Topic: Type string. APNs topic (bundle identifier) (APNS2 only).
- QueryParam: Type Dictionary<string, object>. Optional query parameters for debugging.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns

RemovePushNotificationsFromChannels() returns no actionable data. Check status.isError().

## Remove a device from all push notifications channels

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)

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

Parameters:
- DeviceId (required): Type string. Device token.
- PushType (required): Type PNPushType. Accepted: PNPushType.FCM, PNPushType.APNS2.
- Environment: Type PushEnvironment. APNs environment (APNS2 only).
- Topic: Type string. APNs topic (bundle identifier) (APNS2 only).
- QueryParam: Type Dictionary<string, object>. Optional query parameters for debugging.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns

RemoveAllPushNotificationsFromDeviceWithPushToken() returns PNPushRemoveAllChannelsResult and PNStatus.

Last updated on Nov 6, 2025