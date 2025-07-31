# Mobile Push Notifications API – Unity SDK (Condensed)

All operations require the **Mobile Push Notifications** add-on to be enabled for your PubNub key in the Admin Portal.

---

## Add device to one or more channels

### Method

```csharp
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

### Parameters

* PushType (PNPushType) – `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.
* Channels (Array\<string>) – Channels to enable for push.
* DeviceId (string) – Device push token.
* Environment (PushEnvironment) – **APNS2 only**. `Development` or `Production`.
* Topic (string) – **APNS2 only**. Bundle identifier.
* QueryParam (Dictionary\<string, object>) – Optional query‐string pairs.
* Execute / ExecuteAsync – Callback or `Task<PNResult<PNPushAddChannelResult>>`.

### Sample

```
`  
`
```

### Return

No payload. Check `PNStatus.IsError()`.

---

## List channels for a device

### Method

```csharp
`pubnub.AuditPushChannelProvisions()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPushListProvisionsResult, PNStatus>)  
`
```

### Parameters

* DeviceId (string)
* PushType (PNPushType) – `GCM`, `FCM`, `APNS2`.
* Environment (PushEnvironment) – **APNS2 only**.
* Topic (string) – **APNS2 only**.
* QueryParam (Dictionary\<string, object>)
* Execute / ExecuteAsync – `PNPushListProvisionsResult`.

### Sample

```
`  
`
```

### Return (`PNPushListProvisionsResult`)

* Channels (List\<string>) – Channels enabled for push.

---

## Remove device from specific channels

### Method

```csharp
`pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId(string)  
    .Channels(Array)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
`
```

### Parameters

* DeviceId (string)
* Channels (Array\<string>) – Channels to disable.
* PushType (PNPushType) – `GCM`, `FCM`, `APNS2`.
* Environment (PushEnvironment) – **APNS2 only**.
* Topic (string) – **APNS2 only**.
* QueryParam (Dictionary\<string, object>)
* Execute / ExecuteAsync – `PNPushRemoveChannelResult`.

### Sample

```
`  
`
```

### Return

No payload. Check `PNStatus.IsError()`.

---

## Remove device from all channels

### Method

```csharp
`pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNPushRemoveAllChannelsResult, PNStatus>)  
`
```

### Parameters

* DeviceId (string)
* PushType (PNPushType) – `GCM`, `FCM`, `APNS2`.
* Environment (PushEnvironment) – **APNS2 only**.
* Topic (string) – **APNS2 only**.
* QueryParam (Dictionary\<string, object>)
* Execute / ExecuteAsync – `PNPushRemoveAllChannelsResult`.

### Sample

```
`  
`
```

### Return (`PNPushRemoveAllChannelsResult`)

Empty result object; verify success via `PNStatus`.

_Last updated: Jul 15 2025_