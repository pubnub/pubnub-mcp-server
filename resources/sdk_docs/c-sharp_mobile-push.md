# Mobile Push Notifications API – C# SDK (condensed)

Mobile Push Notifications let you publish through PubNub while delivering the same message through FCM (Android) or APNs/APNs2 (iOS) without extra servers.  
The add-on must be enabled for the key in the Admin Portal.

---

## Request execution pattern

```csharp
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    PNStatus status = publishResponse.Status;
    Console.WriteLine("Server status code : " + status.StatusCode);
}
catch (Exception ex)
{
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");
}
```
• SDK throws an exception for bad parameters.  
• Network / server errors are found in `status`.

---

## Add device to channel(s)

```csharp
pubnub.AddPushNotificationsOnChannels()
        .PushType(PNPushType)              // GCM | FCM | APNS2
        .Channels(Array)                   // channels to enable
        .DeviceId(string)                  // device push token
        .Environment(PushEnvironment)      // APNS2 only: Development|Production
        .Topic(string)                     // APNS2 only: bundle id
        .QueryParam(Dictionary<string,object>) // optional debug params
```

Returns: `PNResult<PNPushAddChannelResult>` (no payload; inspect `status`).

Sample:

```
`  
`
```

---

## List channels for a device

```csharp
pubnub.AuditPushChannelProvisions()
        .DeviceId(string)
        .PushType(PNPushType)              // GCM | FCM | APNS2
        .Environment(PushEnvironment)      // APNS2 only
        .Topic(string)                     // APNS2 only
        .QueryParam(Dictionary<string,object>)
```

Returns:  
`PNResult<PNPushListProvisionsResult>` → `Channels : List<string>`.

Sample:

```
`  
`
```

---

## Remove device from channel(s)

```csharp
pubnub.RemovePushNotificationsFromChannels()
        .DeviceId(string)
        .Channels(Array)                   // channels to disable
        .PushType(PNPushType)              // GCM | FCM | APNS2
        .Environment(PushEnvironment)      // APNS2 only
        .Topic(string)                     // APNS2 only
        .QueryParam(Dictionary<string,object>)
```

Returns: `PNResult<PNPushRemoveChannelResult>` (check `status`).

Sample:

```
`  
`
```

---

## Remove all push registrations for a device

```csharp
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()
        .DeviceId(string)
        .PushType(PNPushType)              // GCM | FCM | APNS2
        .Environment(PushEnvironment)      // APNS2 only
        .Topic(string)                     // APNS2 only
        .QueryParam(Dictionary<string,object>)
```

Returns:  
`PNResult<PNPushRemoveAllChannelsResult>` (empty payload + `status`).

Sample:

```
`  
`
```

---

Notes  
1. Callback (`Async` / `Execute`) variants are deprecated; use `ExecuteAsync`.  
2. Always verify `status.IsError` after every operation.