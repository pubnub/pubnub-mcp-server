# Mobile Push Notifications API for Unity SDK

Connect PubNub publishing to Google Android FCM and Apple iOS APNs. Learn more: Mobile Push Notifications.

Requires Mobile Push Notifications add-on: enable for your key in the Admin Portal.

## Add a device to a push notifications channel

Enable mobile push notifications on specific channels for a device token.

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
- PushType (PNPushType, required): PNPushType.FCM, PNPushType.APNS2.
- Channels (Array, required): Channels to enable for push notifications.
- DeviceId (string, required): Device token.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.
- Async: PNCallback of type PNPushAddChannelResult.
- Execute: System.Action of type PNPushAddChannelResult.
- ExecuteAsync: Returns Task<PNResult<PNPushAddChannelResult>>.

### Sample code

#### Add device to channel

```
1
  

```

### Returns

No actionable data. Check status.isError().

## List push notifications channels for a device

List channels with push enabled for the specified device token.

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
- DeviceId (string, required): Device token.
- PushType (PNPushType, required): PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.
- Async: PNCallback of type PNPushListProvisionsResult.
- Execute: System.Action of type PNPushListProvisionsResult.
- ExecuteAsync: Returns Task<PNResult<PNPushListProvisionsResult>>.

### Sample code

#### List channels for device

```
1
  

```

### Returns

PNPushListProvisionsResult:
- Channels (List<string>): Channels with push notifications enabled.

## Remove a device from push notifications channels

Disable mobile push notifications on specified channels.

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
- DeviceId (string, required): Device token.
- Channels (Array, required): Channels to disable for push notifications.
- PushType (PNPushType, required): PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns

No actionable data. Check status.isError().

## Remove a device from all push notifications channels

Disable mobile push notifications from all channels for a device token.

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
- DeviceId (string, required): Device token.
- PushType (PNPushType, required): PNPushType.FCM, PNPushType.APNS2.
- Environment (PushEnvironment): APNs environment (APNS2 only).
- Topic (string): APNs topic (bundle identifier) (APNS2 only).
- QueryParam (Dictionary<string, object>): Optional query parameters for debugging.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns

PNPushRemoveAllChannelsResult and PNStatus.

Last updated on Nov 6, 2025