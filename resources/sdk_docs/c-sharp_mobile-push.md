# Mobile Push Notifications API for C# SDK

Connect PubNub publishing to FCM (Android) and APNs (iOS). Learn more: Mobile Push Notifications.

##### Request execution

Use try/catch. Invalid parameters throw exceptions. Server/network failures return details in status.

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
Enable Mobile Push Notifications for your key in the Admin Portal.

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

Parameters:
- PushType (PNPushType) – Push type. One of: PNPushType.FCM or PNPushType.APNS2.
- Channels (Array) – Channels to enable for push notifications.
- DeviceId (string) – Device ID (push token).
- Environment (PushEnvironment) – APNs environment: Development or Production.
- Topic (string) – APNs topic (bundle identifier).
- QueryParam (Dictionary<string, object>) – Query string parameters.
- Async (PNCallback) – Deprecated; prefer ExecuteAsync.
- Execute (PNCallback) – Callback of type PNPushAddChannelResult.
- ExecuteAsync – Returns PNResult<PNPushAddChannelResult>.

### Sample code

##### Reference code
Use this pattern when adapting other examples in this document.

#### Add device to channel

```
1
  

```

### Returns

No payload. Check status.isError() on the status object.

## List push notifications channels for a device

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

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

Parameters:
- DeviceId (string) – Device ID (push token).
- PushType (PNPushType) – PNPushType.FCM or PNPushType.APNS2.
- Environment (PushEnvironment) – APNs environment: Development or Production.
- Topic (string) – APNs topic (bundle identifier).
- QueryParam (Dictionary<string, object>) – Query string parameters.
- Async (PNCallback) – Deprecated; prefer ExecuteAsync.
- Execute (PNCallback) – Callback of type PNPushListProvisionsResult.
- ExecuteAsync – Returns PNResult<PNPushListProvisionsResult>.

### Sample code

#### List channels for device

```
1
  

```

### Returns

PNPushListProvisionsResult with:
- Channels (List<string>) – Channels associated with push notifications.

## Remove a device from push notifications channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

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

Parameters:
- DeviceId (string) – Device ID (push token).
- Channels (Array) – Channels to disable for push notifications.
- PushType (PNPushType) – PNPushType.FCM or PNPushType.APNS2.
- Environment (PushEnvironment) – APNs environment: Development or Production.
- Topic (string) – APNs topic (bundle identifier).
- QueryParam (Dictionary<string, object>) – Query string parameters.
- Async (PNCallback) – Deprecated; prefer ExecuteAsync.
- Execute (PNCallback) – Callback of type PNPushRemoveChannelResult.
- ExecuteAsync – Returns PNResult<PNPushRemoveChannelResult>.

### Sample code

#### Remove device from channel

```
1
  

```

### Returns

No payload. Check status.isError() on the status object.

## Remove a device from all push notifications channels

##### Requires Mobile Push Notifications add-on
Enable Mobile Push Notifications for your key in the Admin Portal.

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

Parameters:
- DeviceId (string) – Device ID (push token).
- PushType (PNPushType) – PNPushType.FCM or PNPushType.APNS2.
- Environment (PushEnvironment) – APNs environment: Development or Production.
- Topic (string) – APNs topic (bundle identifier).
- QueryParam (Dictionary<string, object>) – Query string parameters.
- Async (PNCallback) – Deprecated; prefer ExecuteAsync.
- Execute (PNCallback) – Callback of type PNPushRemoveAllChannelsResult.
- ExecuteAsync – Returns PNResult<PNPushRemoveAllChannelsResult>.

### Sample code

#### Remove all mobile push notifications

```
1
  

```

### Returns

PNPushRemoveAllChannelsResult with:
- PNPushRemoveAllChannelsResult (object) – Empty object on success.
- PNStatus (object) – Request status (error or success).