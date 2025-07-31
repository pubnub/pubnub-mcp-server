# Mobile Push Notifications API – Java SDK

Mobile Push adds FCM / GCM / APNS / APNS2 support to PubNub without extra servers.  
Requires the **Mobile Push Notifications** add-on (enable in the Admin Portal).

---

## Breaking changes in v9.0.0
• Unified Java + Kotlin codebase.  
• New client instantiation, new async callbacks, and status events.  
See the Java/Kotlin SDK migration guide for details.

---

## Add device to channel

Enable push notifications for the specified device on one or more channels.

### Method
```
`pubnub.addPushNotificationsOnChannels()  
    .pushType(PNPushType)  
    .channels(List<String>)  
    .deviceId(String)  
    .topic(String)  
    .environment(PNPushEnvironment)  
`
```

Parameter | Type | Notes
--------- | ---- | -----
pushType  | PNPushType | PNPushType.FCM, GCM, APNS, APNS2
channels  | List<String> | Channels to enable
deviceId  | String | Device token
topic     | String | APNS2 only – usually the bundle ID
environment | PNPushEnvironment | APNS2 only – development or production
async     | Consumer<Result<PNPushAddChannelResult>> | Async callback

### Sample code
```
`  
`
```

### Returns
No data. Check `result.isSuccess()` in the status callback.

---

## List channels for device

Retrieve all channels on which a device receives push notifications.

### Method
```
`pubnub.auditPushChannelProvisions()  
    .pushType(PNPushType)  
    .deviceId(String)  
    .topic(String)  
    .environment(PNPushEnvironment)  
`
```

Parameter | Type | Notes
--------- | ---- | -----
pushType  | PNPushType | FCM, GCM, APNS, APNS2
deviceId  | String | Device token
topic     | String | APNS2 only
environment | PNPushEnvironment | APNS2 only
async     | Consumer<Result<PNPushListProvisionsResult>> | Async callback

### Sample code
```
`  
`
```

### Returns
`PNPushListProvisionsResult`  
• `getChannels() : List<String>` – channels associated with the device.

---

## Remove device from channel

Disable push notifications for specific channels.

### Method
```
`pubnub.removePushNotificationsFromChannels()  
    .pushType(PNPushType)  
    .deviceId(String)  
    .topic(String)  
    .environment(PNPushEnvironment)  
`
```

Parameter | Type | Notes
--------- | ---- | -----
pushType  | PNPushType | FCM, GCM, APNS, APNS2
channels  | List<String> | Channels to disable
deviceId  | String | Device token
topic     | String | APNS2 only
environment | PNPushEnvironment | APNS2 only
async     | Consumer<Result<PNPushRemoveChannelResult>> | Async callback

### Sample code
```
`  
`
```

### Returns
No data. Check `result.isFailure()` or handle exceptions with `onFailure`.

---

## Remove all mobile push notifications

Disable push notifications from all channels for a device.

### Method
```
`pubnub.removeAllPushNotificationsFromDeviceWithPushToken()  
    .pushType(PNPushType)  
    .deviceId(String)  
    .topic(String)  
    .environment(PNPushEnvironment)  
`
```

Parameter | Type | Notes
--------- | ---- | -----
pushType  | PNPushType | FCM, GCM, APNS, APNS2
deviceId  | String | Device token
topic     | String | APNS2 only
environment | PNPushEnvironment | APNS2 only
async     | Consumer<Result<PNPushRemoveAllChannelsResult>> | Async callback

### Sample code
```
`  
`
```

### Returns
No data. Use `result.isFailure()` or `onFailure` to detect errors.

_Last updated: Jul 15 2025_