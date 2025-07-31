# Mobile Push Notifications – Go SDK

Mobile Push API lets you manage FCM/GCM and APNS2 tokens directly from PubNub (requires the **Mobile Push Notifications** add-on enabled for your key).

---

## Add device to channel

Enable push on specific channels.

### Method

```go
pn.AddPushNotificationsOnChannels().
        Channels([]string).
        DeviceIDForPush(string).
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM).
        Topic(string).                // APNS2 only
        Environment(PNPushEnvironment) // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
Channels* | []string | — | Channels to enable.
DeviceIDForPush* | string | — | Mobile device token.
PushType | enum | — | PNPushTypeGCM, PNPushTypeAPNS2, PNPushTypeFCM.
Topic | string | — | APNS2 bundle identifier.
Environment | enum | PNPushEnvironmentDevelopment | APNS2: Development or Production.
QueryParam | map[string]string | — | Extra query parameters.

### Sample

```go
package main

import (
	"fmt"
	"log"

	pubnub "github.com/pubnub/go/v7"
)

func main() {
	// Configure the PubNub instance with demo keys
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey   = "demo"
	// ...
}
```

### Return

No data; check `status.Error`.

---

## List channels for device

List channels currently enabled for a token.

### Method

```go
pn.ListPushProvisions().
        DeviceIDForPush(string).
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM).
        Topic(string).                // APNS2 only
        Environment(PNPushEnvironment) // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

Same parameter rules as above (Topic / Environment for APNS2 only).

### Sample

```go
// GCM / FCM
pn.ListPushProvisions().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeGCM).
        Execute()

// APNS2
pn.ListPushProvisions().
        DeviceIDForPush("device_id").
        PushType(pubnub.PNPushTypeAPNS2).
        Topic("com.example.bundle_id").
        Environment(pubnub.PNPushEnvironmentProduction).
        Execute()
```

### Return

`ListPushProvisionsRequestResponse`  
• `Channels []string` – enabled channels.

---

## Remove device from channel

Disable push on specific channels.

### Method

```go
pn.RemovePushNotificationsFromChannels().
        Channels([]string).
        DeviceIDForPush(string).
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM).
        Topic(string).                // APNS2 only
        Environment(PNPushEnvironment) // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

### Sample

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

### Return

No data; check `status.Error`.

---

## Remove all mobile push notifications

Disable push on all channels for a token.

### Method

```go
pn.RemoveAllPushNotifications().
        DeviceIDForPush(string).
        PushType(PNPushTypeGCM | PNPushTypeAPNS2 | PNPushTypeFCM).
        Topic(string).                // APNS2 only
        Environment(PNPushEnvironment) // APNS2 only
        QueryParam(map[string]string).
        Execute()
```

### Sample

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

### Return

No data; check `status.Error`.

---

Last updated: **Jul 15 2025**