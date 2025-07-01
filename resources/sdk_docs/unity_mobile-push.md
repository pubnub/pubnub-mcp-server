# Mobile Push Notifications API – Unity SDK (Condensed)

Mobile Push Notifications bridge PubNub with FCM/GCM and APNs/APNS2.  
All methods below require the **Mobile Push Notifications add-on** to be enabled in the PubNub Admin Portal.

---

## Add Device to Channel

### Method
```csharp
pubnub.AddPushNotificationsOnChannels()  
    .PushType(PNPushType)  
    .Channels(Array)  
    .DeviceId(string)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNPushAddChannelResult, PNStatus>)  
```

### Parameters
* **PushType** (PNPushType) – `PNPushType.GCM`, `PNPushType.FCM`, `PNPushType.APNS2`.
* **Channels** (Array) – Channels to enable.
* **DeviceId** (string) – Device token/ID.
* **Environment** (PushEnvironment) – *APNS2 only.* `Development` or `Production`.
* **Topic** (string) – *APNS2 only.* App bundle identifier.
* **QueryParam** (Dictionary<string,object>) – Optional URL query parameters.

### Basic Usage
```csharp
using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class AddPushNotificationsExample : MonoBehaviour {  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
    [SerializeField] private string[] channels = { "ch1", "ch2", "ch3" };  
    [SerializeField] private string fcmDeviceId = "googleDevice";  
    [SerializeField] private string apnsDeviceId = "appleDevice";  
}
```
show all 52 lines

### Return
Check `PNStatus.IsError()`; no payload is returned.

---

## List Channels for Device

### Method
```csharp
pubnub.AuditPushChannelProvisions()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNPushListProvisionsResult, PNStatus>)  
```

### Parameters
* **DeviceId** (string)
* **PushType** (PNPushType)
* **Environment** (PushEnvironment) – *APNS2 only.*
* **Topic** (string) – *APNS2 only.*
* **QueryParam** (Dictionary<string,object>)

### Basic Usage
```csharp
// FCM/GCM  
pubnub.AuditPushChannelProvisions()  
    .DeviceId("googleDevice")  
    .PushType(PnPushType.FCM)  
    .Execute((result, status) => {});  
  
// APNS2  
pubnub.AuditPushChannelProvisions()  
    .DeviceId("appleDevice")  
    .PushType(PNPushType.APNS2)  
    .Topic("myapptopic")  
    .Environment(PushEnvironment.Development)  
    .Execute((result, status) => {});  
```

### Return
`PNPushListProvisionsResult.Channels` – `List<string>` of registered channels.

---

## Remove Device from Channel

### Method
```csharp
pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId(string)  
    .Channels(Array)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionary<string,object>)  
```

### Parameters
* **DeviceId** (string)
* **Channels** (Array)
* **PushType** (PNPushType)
* **Environment** (PushEnvironment) – *APNS2 only.*
* **Topic** (string) – *APNS2 only.*
* **QueryParam** (Dictionary<string,object>)

### Basic Usage
```csharp
// FCM/GCM  
pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId("googleDevice")  
    .Channels(new string[] { "ch1", "ch2", "ch3" })  
    .PushType(PnPushType.FCM)  
    .Execute((result, status) => {});  
  
// APNS2  
pubnub.RemovePushNotificationsFromChannels()  
    .DeviceId("appleDevice")  
    .Channels(new string[] {  
```
show all 23 lines

### Return
No payload; inspect `PNStatus`.

---

## Remove All Mobile Push Notifications

### Method
```csharp
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId(string)  
    .PushType(PNPushType)  
    .Environment(PushEnvironment)  
    .Topic(string)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNPushRemoveAllChannelsResult, PNStatus>)  
```

### Parameters
* **DeviceId** (string)
* **PushType** (PNPushType)
* **Environment** (PushEnvironment) – *APNS2 only.*
* **Topic** (string) – *APNS2 only.*
* **QueryParam** (Dictionary<string,object>)

### Basic Usage
```csharp
// FCM/GCM  
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId("googleDevice")  
    .PushType(PnPushType.FCM)  
    .Execute(new PNPushRemoveAllChannelsResultExt((r, s) => {  
        Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(r));  
    }));  
  
// APNS2  
pubnub.RemoveAllPushNotificationsFromDeviceWithPushToken()  
    .DeviceId("appleDevice")  
    .PushType(PNPushType.APNS2)  
    .Topic("myapptopic")  
    .Environment(PushEnvironment.Development)  
    .Execute(new PNPushRemoveAllChannelsResultExt((r, s) => {  
```
show all 17 lines

### Return
`PNPushRemoveAllChannelsResult` (empty) and `PNStatus`.

_Last updated: May 6, 2025_