# Mobile Push Notifications – Go SDK

Mobile Push Notifications bridge PubNub with APNs (Apple) and FCM/GCM (Google).  
All methods below require the *Mobile Push Notifications* add-on to be enabled for your key.

---

## Add Device to Channel

Enable push notifications on one or more channels.

```go
pn.AddPushNotificationsOnChannels().
        Channels([]string).              // required
        DeviceIDForPush(string).          // required
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM). // required
        Topic(string).                   // APNS2 only
        Environment(PNPushEnvironment).  // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

Parameter | Type | Note
----------|------|-----
Channels | []string | Channels to add
DeviceIDForPush | string | Device token / registration ID
PushType | enum | PNPushTypeGCM, PNPushTypeFCM, PNPushTypeAPNS2
Topic | string | APNS2 bundle ID
Environment | PNPushEnvironment | PNPushEnvironmentDevelopment (default) or PNPushEnvironmentProduction
QueryParam | map[string]string | Extra query parameters

### Example

```go
// FCM / GCM
pn.AddPushNotificationsOnChannels().
        Channels([]string{"ch1", "ch2"}).
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeGCM).
        Execute()

// APNS2
pn.AddPushNotificationsOnChannels().
        Channels([]string{"ch1"}).
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeAPNS2).
        Topic("com.example.bundle_id").
        Environment(pubnub.PNPushEnvironmentProduction).
        Execute()
```

Return: No data; inspect `status.Error`.

---

## List Channels for Device

List all channels on which push is enabled for the given device.

```go
pn.ListPushProvisions().
        DeviceIDForPush(string).          // required
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM). // required
        Topic(string).                   // APNS2 only
        Environment(PNPushEnvironment).  // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

Returns `ListPushProvisionsRequestResponse`:

```go
type ListPushProvisionsRequestResponse struct {
    Channels []string
}
```

### Example

```go
// GCM / FCM
resp, status, err := pn.ListPushProvisions().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeGCM).
        Execute()

// APNS2
resp, status, err := pn.ListPushProvisions().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeAPNS2).
        Topic("com.example.bundle_id").
        Environment(pubnub.PNPushEnvironmentProduction).
        Execute()
```

---

## Remove Device from Channel

Disable push notifications on the specified channels.

```go
pn.RemovePushNotificationsFromChannels().
        Channels([]string).              // required
        DeviceIDForPush(string).          // required
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM). // required
        Topic(string).                   // APNS2 only
        Environment(PNPushEnvironment).  // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

### Example

```go
// FCM / GCM
pn.RemovePushNotificationsFromChannels().
        Channels([]string{"ch"}).
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeGCM).
        Execute()

// APNS2
pn.RemovePushNotificationsFromChannels().
        Channels([]string{"ch"}).
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeAPNS2).
        Topic("com.example.bundle_id").
        Environment(pubnub.PNPushEnvironmentProduction).
        Execute()
```

Return: No data; inspect `status.Error`.

---

## Remove All Mobile Push Notifications

Disable push notifications on **all** channels for the device.

```go
pn.RemoveAllPushNotifications().
        DeviceIDForPush(string).          // required
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM). // required
        Topic(string).                   // APNS2 only
        Environment(PNPushEnvironment).  // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

### Example

```go
// FCM / GCM
pn.RemoveAllPushNotifications().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeGCM).
        Execute()

// APNS2
pn.RemoveAllPushNotifications().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeAPNS2).
        Topic("com.example.bundle_id").
        Environment(pubnub.PNPushEnvironmentProduction).
        Execute()
```

Return: No data; inspect `status.Error`.

_Last updated: Mar 31 2025_