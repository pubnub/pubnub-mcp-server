# Mobile Push Notifications API for C# SDK

Mobile Push Notifications let you publish through PubNub and deliver through FCM/GCM or APNs (incl. APNS2) without extra server code.  
Feature must be enabled for your key in the Admin Portal.

---

## Request Execution

Use `try/catch`; SDK throws on bad client-side parameters, otherwise inspect `PNStatus` for network/server errors.

```csharp
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
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
`
```

---

## Add Device to Channel

Enables push on the specified channels for a device token.

### Method

```
`pubnub.AddPushNotificationsOnChannels()  
        .PushType(PNPushType)  
        .Channels(Array)  
        .DeviceId(string)  
        .Environment(PushEnvironment)  
        .Topic(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters (all required unless noted):

* PushType – `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.  
* Channels – array of channel names to enable.  
* DeviceId – push token / device ID.  
* Environment – `Development` or `Production` (APNS2 only).  
* Topic – bundle identifier / topic (APNS2 only).  
* QueryParam – optional `Dictionary<string,object>` for extra URL query params.  
* ExecuteAsync – returns `PNResult<PNPushAddChannelResult>` (preferred).  
  * Legacy `Async/Execute` callbacks still supported but deprecated.

#### Example

```
`  
`
```

Returns no payload; verify success via `status.IsError()`.

---

## List Channels For Device

Lists all channels on which the provided device token is enabled.

### Method

```
`pubnub.AuditPushChannelProvisions()  
        .DeviceId(string)  
        .PushType(PNPushType)  
        .Environment(PushEnvironment)  
        .Topic(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:

* DeviceId – push token / device ID.  
* PushType – `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.  
* Environment, Topic – as described above (APNS2 only).  
* QueryParam – optional.  
* ExecuteAsync – returns `PNResult<PNPushListProvisionsResult>`.

#### Example

```
`  
`
```

Return object:  
`PNPushListProvisionsResult.Channels` → `List<string>` of enabled channels.

---

## Remove Device From Channel

Disables push on the specified channels for a device token.

### Method

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

Parameters mirror *Add Device* with `Channels` indicating channels to remove.  
`ExecuteAsync` returns `PNResult<PNPushRemoveChannelResult>`.

#### Example

```
`  
`
```

No payload; check `status.IsError()`.

---

## Remove All Mobile Push Notifications

Unregisters the device token from **all** channels.

### Method

```
`pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
        .DeviceId(string)  
        .PushType(PNPushType)  
        .Environment(PushEnvironment)  
        .Topic(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters as above (no Channels list).  
`ExecuteAsync` returns `PNResult<PNPushRemoveAllChannelsResult>`.

#### Example

```
`  
`
```

Return object contains only `PNStatus` (empty data payload).

---

Last updated: **Jun 30, 2025**