# Mobile Push Notifications API for C# SDK

Connect PubNub publishing to third-party push services: Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service). Requires Mobile Push Notifications add-on (enable in the Admin Portal).

To learn more, read Mobile Push Notifications.

##### Request execution

Use try/catch. Invalid parameters throw exceptions; server/network errors are in the returned status.

```
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    PNStatus status = publishResponse.Status;
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());
}
catch (Exception ex)
{
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

### Method(s)

```
pubnub.AddPushNotificationsOnChannels()
    .PushType(PNPushType)
    .Channels(Array)
    .DeviceId(string)
    .Environment(PushEnvironment)
    .Topic(string)
    .QueryParam(Dictionary<string, object>)
```

- PushType (required) — Type: PNPushType. One of: PNPushType.FCM or PNPushType.APNS2
- Channels (required) — Type: Array. Channels to enable for push notifications.
- DeviceId (required) — Type: string. Device ID (push token).
- Environment — Type: PushEnvironment. APNs environment (Development, Production).
- Topic — Type: string. APNs topic (bundle identifier).
- QueryParam — Type: Dictionary<string, object>. Name/value pairs as query parameters.
- Execute — Type: PNCallback. Callback of type PNPushAddChannelResult. Deprecated; prefer ExecuteAsync.
- ExecuteAsync — Returns PNResult<PNPushAddChannelResult>.

### Sample code

##### Reference code

```

```

#### Add device to channel

```

```

### Returns

No payload is returned. Check status.isError() on the status object.

## List push notifications channels for a device

Get all channels with push notifications for the specified push token.

### Method(s)

```
pubnub.AuditPushChannelProvisions()
    .DeviceId(string)
    .PushType(PNPushType)
    .Environment(PushEnvironment)
    .Topic(string)
    .QueryParam(Dictionary<string, object>)
```

- DeviceId (required) — Type: string. Device ID (push token).
- PushType (required) — Type: PNPushType. One of: PNPushType.FCM or PNPushType.APNS2
- Environment — Type: PushEnvironment. APNs environment (Development, Production).
- Topic — Type: string. APNs topic (bundle identifier).
- QueryParam — Type: Dictionary<string, object>. Name/value pairs as query parameters.
- Execute — Type: PNCallback. Callback of type PNPushListProvisionsResult. Deprecated; prefer ExecuteAsync.
- ExecuteAsync — Returns PNResult<PNPushListProvisionsResult>.

### Sample code

#### List channels for device

```

```

### Returns

PNPushListProvisionsResult with:
- Channels — List<string>. Channels associated with push notifications.

## Remove a device from push notifications channels

Disable push notifications on selected channels.

### Method(s)

```
pubnub.RemovePushNotificationsFromChannels()
    .DeviceId(string)
    .Channels(Array)
    .PushType(PNPushType)
    .Environment(PushEnvironment)
    .Topic(string)
    .QueryParam(Dictionary<string, object>)
```

- DeviceId (required) — Type: string. Device ID (push token).
- Channels (required) — Type: Array. Channels to disable for push notifications.
- PushType (required) — Type: PNPushType. One of: PNPushType.FCM or PNPushType.APNS2
- Environment — Type: PushEnvironment. APNs environment (Development, Production).
- Topic — Type: string. APNs topic (bundle identifier).
- QueryParam — Type: Dictionary<string, object>. Name/value pairs as query parameters.
- Execute — Type: PNCallback. Callback of type PNPushRemoveChannelResult. Deprecated; prefer ExecuteAsync.
- ExecuteAsync — Returns PNResult<PNPushRemoveChannelResult>.

### Sample code

#### Remove device from channel

```

```

### Returns

No payload is returned. Check status.isError() on the status object.

## Remove a device from all push notifications channels

Disable push notifications from all channels registered for the specified push token.

### Method(s)

```
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()
    .DeviceId(string)
    .PushType(PNPushType)
    .Environment(PushEnvironment)
    .Topic(string)
    .QueryParam(Dictionary<string, object>)
```

- DeviceId (required) — Type: string. Device ID (push token).
- PushType (required) — Type: PNPushType. One of: PNPushType.FCM or PNPushType.APNS2
- Environment — Type: PushEnvironment. APNs environment (Development, Production).
- Topic — Type: string. APNs topic (bundle identifier).
- QueryParam — Type: Dictionary<string, object>. Name/value pairs as query parameters.
- Execute — Type: PNCallback. Callback of type PNPushRemoveAllChannelsResult. Deprecated; prefer ExecuteAsync.
- ExecuteAsync — Returns PNResult<PNPushRemoveAllChannelsResult>.

### Sample code

#### Remove all mobile push notifications

```

```

### Returns

PNPushRemoveAllChannelsResult with:
- PNPushRemoveAllChannelsResult — Object. Empty object on success.
- PNStatus — Object. Request status (error or success).

Last updated on Oct 28, 2025