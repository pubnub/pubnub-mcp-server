# Mobile Push Notifications API for C# SDK

Connect PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

##### Request execution

Use `try`/`catch` with the C# SDK. Invalid parameters throw exceptions. Server/network failures return error details in `status`.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  
```

## Add a device to a push notifications channel

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Enable mobile push notifications on a set of channels.

### Method(s)

```
`1pubnub.AddPushNotificationsOnChannels()  
2        .PushType(PNPushType)  
3        .Channels(Array)  
4        .DeviceId(string)  
5        .Environment(PushEnvironment)  
6        .Topic(string)  
7        .QueryParam(Dictionarystring,object>)  
`
```

- PushType (required). Type: PNPushType. One of: `PNPushType.FCM`, `PNPushType.APNS2`.
- Channels (required). Type: Array. Channels to enable for push notifications.
- DeviceId (required). Type: string. Device ID (push token).
- Environment. Type: PushEnvironment. APNs environment (`Development`, `Production`).
- Topic. Type: string. APNs topic (bundle identifier).
- QueryParam. Type: Dictionary<string, object>. Name/value pairs to send as query parameters.
- Async. Type: PNCallback. Deprecated; prefer `ExecuteAsync`.
- Execute. Type: PNCallback. Callback of type `PNPushAddChannelResult`.
- ExecuteAsync. Type: None. Returns `PNResult<PNPushAddChannelResult>`.

### Sample code

#### Add device to channel

```
1
  
```

### Returns

No payload is returned. Check `status.isError()` on the status object.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Get all channels with push notifications for the specified push token.

### Method(s)

```
`1pubnub.AuditPushChannelProvisions()  
2        .DeviceId(string)  
3        .PushType(PNPushType)  
4        .Environment(PushEnvironment)  
5        .Topic(string)  
6        .QueryParam(Dictionarystring,object>)  
`
```

- DeviceId (required). Type: string. Device ID (push token).
- PushType (required). Type: PNPushType. One of: `PNPushType.FCM`, `PNPushType.APNS2`.
- Environment. Type: PushEnvironment. APNs environment (`Development`, `Production`).
- Topic. Type: string. APNs topic (bundle identifier).
- QueryParam. Type: Dictionary<string, object>. Name/value pairs to send as query parameters.
- Async. Type: PNCallback. Deprecated; prefer `ExecuteAsync`.
- Execute. Type: PNCallback. Callback of type `PNPushListProvisionsResult`.
- ExecuteAsync. Type: None. Returns `PNResult<PNPushListProvisionsResult>`.

### Sample code

#### List channels for device

```
1
  
```

### Returns

`PNPushListProvisionsResult` with:
- Channels. Type: List<string>. Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Disable push notifications on selected channels.

### Method(s)

```
`1pubnub.RemovePushNotificationsFromChannels()  
2        .DeviceId(string)  
3        .Channels(Array)  
4        .PushType(PNPushType)  
5        .Environment(PushEnvironment)  
6        .Topic(string)  
7        .QueryParam(Dictionarystring,object>)  
`
```

- DeviceId (required). Type: string. Device ID (push token).
- Channels (required). Type: Array. Channels to disable for push notifications.
- PushType (required). Type: PNPushType. One of: `PNPushType.FCM`, `PNPushType.APNS2`.
- Environment. Type: PushEnvironment. APNs environment (`Development`, `Production`).
- Topic. Type: string. APNs topic (bundle identifier).
- QueryParam. Type: Dictionary<string, object>. Name/value pairs to send as query parameters.
- Async. Type: PNCallback. Deprecated; prefer `ExecuteAsync`.
- Execute. Type: PNCallback. Callback of type `PNPushRemoveChannelResult`.
- ExecuteAsync. Type: None. Returns `PNResult<PNPushRemoveChannelResult>`.

### Sample code

#### Remove device from channel

```
1
  
```

### Returns

No payload is returned. Check `status.isError()` on the status object.

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on

Enable Mobile Push Notifications for your key in the [Admin Portal](https://admin.pubnub.com/).

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```
`1pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
2        .DeviceId(string)  
3        .PushType(PNPushType)  
4        .Environment(PushEnvironment)  
5        .Topic(string)  
6        .QueryParam(Dictionarystring,object>)  
`
```

- DeviceId (required). Type: string. Device ID (push token).
- PushType (required). Type: PNPushType. One of: `PNPushType.FCM`, `PNPushType.APNS2`.
- Environment. Type: PushEnvironment. APNs environment (`Development`, `Production`).
- Topic. Type: string. APNs topic (bundle identifier).
- QueryParam. Type: Dictionary<string, object>. Name/value pairs to send as query parameters.
- Async. Type: PNCallback. Deprecated; prefer `ExecuteAsync`.
- Execute. Type: PNCallback. Callback of type `PNPushRemoveAllChannelsResult`.
- ExecuteAsync. Type: None. Returns `PNResult<PNPushRemoveAllChannelsResult>`.

### Sample code

#### Remove all mobile push notifications

```
1
  
```

### Returns

Returns `PNPushRemoveAllChannelsResult` with:
- PNPushRemoveAllChannelsResult. Type: Object. Empty object on success.
- PNStatus. Type: Object. Request status (error or success).

Last updated on Oct 28, 2025