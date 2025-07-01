On this page
# Mobile Push Notifications API for Go SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to Channel[​](#add-device-to-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on a provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Go SDK:

```
`pn.AddPushNotificationsOnChannels().  
        Channels([]string).  
        DeviceIDForPush(string).  
        PushType(PNPushTypeGCM|PNPushTypeAPNS2).  
        Topic(string).  
        Environment(PNPushEnvironment).  
        QueryParam(map[string]string).  
        Execute()  
`
```

*  requiredParameterDescription`Channels` *Type: []stringDefault:  
n/a`channels` to add to the channel group`DeviceIDForPush` *Type: stringDefault:  
n/aDevice ID.`PushType` *Type: PNPushTypeGCM  
PNPushTypeAPNS2  
PNPushTypeFCMDefault:  
`Not set`Accepted values: `PNPushTypeGCM`, `PNPushTypeAPNS2`, `PNPushTypeFCM`.`Topic`Type: stringDefault:  
`Not set`Notifications topic name (usually it is application's bundle identifier).`Environment`Type: PNPushEnvironmentDefault:  
`PNPushEnvironmentDevelopment`Works only if `PNPushType` set to `PNPushTypeAPNS2`. Accepted values: `PNPushEnvironmentDevelopment`, `PNPushEnvironmentProduction`.`QueryParam`Type: map[string]stringDefault:  
n/aQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### Add Device to Channel[​](#add-device-to-channel-1)

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
`
```
show all 52 lines

### Returns[​](#returns)

The `AddPushNotificationsOnChannels()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the `status.Error`.

## List Channels For Device[​](#list-channels-for-device)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Go SDK:

```
`pn.ListPushProvisions().  
        DeviceIDForPush(string).  
        PushType(PNPushTypeGCM| PNPushTypeAPNS2).  
        Topic(string).  
        Environment(PNPushEnvironment).  
        QueryParam(map[string]string).  
        Execute()  
`
```

*  requiredParameterDescription`DeviceIDForPush` *Type: stringDefault:  
n/aDevice ID.`PushType` *Type: PNPushTypeGCM  
PNPushTypeAPNS2  
PNPushTypeFCMDefault:  
`Not set`Accepted values: `PNPushTypeGCM`, `PNPushTypeAPNS2`, `PNPushTypeFCM`.`Topic`Type: stringDefault:  
`Not set`Notifications topic name (usually it is application's bundle identifier).`Environment`Type: PNPushEnvironmentDefault:  
`PNPushEnvironmentDevelopment`Works only if `PNPushType` set to `PNPushTypeAPNS2`. Accepted values: `PNPushEnvironmentDevelopment`, `PNPushEnvironmentProduction`.`QueryParam`Type: map[string]stringDefault:  
n/aQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`// GCM/FCM  
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
`
```

### Returns[​](#returns-1)

The `ListPushProvisions()` operation returns a `ListPushProvisionsRequestResponse` which contains the following operations:

MethodDescription`Channels`Type: []stringList of `channels` associated for mobile push notifications.

## Remove Device From Channel[​](#remove-device-from-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on a provided set of channels.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel` you can use the following method(s) in the Go SDK:

```
`pn.RemovePushNotificationsFromChannels().  
        Channels([]string).  
        DeviceIDForPush(string).  
        PushType(PNPushTypeGCM|PNPushTypeAPNS2).  
        Topic(string).  
        Environment(PNPushEnvironment).  
        QueryParam(map[string]string).  
        Execute()  
`
```

*  requiredParameterDescription`Channels` *Type: []stringDefault:  
n/a`channels` to add to the channel group`DeviceIDForPush` *Type: stringDefault:  
n/aDevice ID.`PushType` *Type: PNPushTypeGCM  
PNPushTypeAPNS  
PNPushTypeAPNS2  
PNPushTypeFCMDefault:  
`Not set`Accepted values: `PNPushTypeGCM`, `PNPushTypeAPNS2`, `PNPushTypeFCM`.`Topic`Type: stringDefault:  
`Not set`Notifications topic name (usually it is application's bundle identifier).`Environment`Type: PNPushEnvironmentDefault:  
`PNPushEnvironmentDevelopment`Works only if `PNPushType` set to `PNPushTypeAPNS2`. Accepted values: `PNPushEnvironmentDevelopment`, `PNPushEnvironmentProduction`.`QueryParam`Type: map[string]stringDefault:  
n/aQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`// FCM/GCM  
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
`
```

### Returns[​](#returns-2)

The `RemovePushNotificationsFromChannels()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the `status.Error`.

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Go SDK:

```
`pn.RemoveAllPushNotifications().  
        DeviceIDForPush(string).  
        PushType(PNPushTypeGCM| PNPushTypeAPNS2).  
        Topic(string).  
        Environment(PNPushEnvironment).  
        QueryParam(map[string]string).  
        Execute()  
`
```

*  requiredParameterDescription`DeviceIDForPush` *Type: stringDefault:  
n/aDevice ID.`PushType` *Type: PNPushTypeGCM  
PNPushTypeAPNS  
PNPushTypeAPNS2  
PNPushTypeFCMDefault:  
`Not set`Accepted values: `PNPushTypeGCM`, `PNPushTypeAPNS2`, `PNPushTypeFCM`.`Topic`Type: stringDefault:  
`Not set`Notifications topic name (usually it is application's bundle identifier).`Environment`Type: PNPushEnvironmentDefault:  
`PNPushEnvironmentDevelopment`Works only if `PNPushType` set to `PNPushTypeAPNS2`. Accepted values: `PNPushEnvironmentDevelopment`, `PNPushEnvironmentProduction`.`QueryParam`Type: map[string]stringDefault:  
n/aQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`// FCM/GCM  
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
`
```

### Returns[​](#returns-3)

The `RemoveAllPushNotifications()` does not return actionable data, be sure to check the status object on the outcome of the operation by checking the `status.Error`.
Last updated on **Mar 31, 2025**