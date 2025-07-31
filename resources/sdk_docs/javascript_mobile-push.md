# Mobile Push Notifications API (JavaScript SDK)

Enables PubNub publishing through Apple APNs (APNS2) and Google FCM without extra server-side code.  
Use Callbacks, Promises, or **Async/Await** (recommended—wrap calls in `try…catch`).

---

## Requirements
• Enable the **Mobile Push Notifications** add-on for your key in the Admin Portal.  

---

## Add device to channel

````
`pubnub.push.addChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
````

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
channels* | Array\<string> | — | Channels to enable.
device* | string | — | Device push token.
pushGateway* | string | — | `apns2` or `gcm`.
environment | string | `development` | `development` or `production` (APNS2 only).
topic | string | — | Required for APNS2.

Sample code:

````
`  
`
````

Response:

````
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
````

---

## List channels for device

````
`pubnub.push.listChannels({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
````

Parameter | Type | Default | Notes
--------- | ---- | ------- | -----
device* | string | — | Device push token.
pushGateway* | string | — | `apns2` or `gcm`.
environment | string | `development` | APNS2 only.
topic | string | — | APNS2 only.
start | string | — | Pagination start channel.
count | number | 500 | ≤ 1000.

Sample code:

````
`  
`
````

Status / Response:

````
`// Example status  
{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
  
// Example response  
{  
    channels: [ 'a', 'b' ]  
}  
`
````

---

## Remove device from channel

````
`pubnub.push.removeChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
````

Parameters identical to *Add device to channel*.

Sample:

````
`  
`
````

Response:

````
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
````

---

## Remove all mobile push notifications for a device

````
`pubnub.push.deleteDevice({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
````

Parameters as shown.

Sample:

````
`  
`
````

Response:

````
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
````

---

## Push notification format configuration

### APNS2Configuration

````
`type APNS2Configuration = {  
    collapseId?: string,  
    expirationDate?: Date,  
    targets: ArrayAPNS2Target>  
}  
`
````

Field | Type | Notes
----- | ---- | -----
collapseId | string | `apns-collapse-id` header.
expirationDate | Date | `apns-expiration` header.
targets* | Array\<APNS2Target> | Delivery targets.

### APNS2Target

````
`type APNS2Target = {  
    topic: string,  
    environment?: 'development' | 'production',  
    excludedDevices?: Arraystring>  
}  
`
````

topic*, environment (`development`/`production`), excludedDevices.

### APNSNotificationPayload properties

• configurations: Array\<APNS2Configuration>  
• notification: Hash  
• payload: Hash  
• silent: Boolean

### FCMNotificationPayload properties

• notification: Hash  
• data: Hash (keys must be strings and avoid reserved words)  
• silent: Boolean (moves `notification` under `data`)  
• icon, tag, payload

### NotificationsPayload builder

````
`PubNub.notificationPayload(  
    title: string,  
    body: string  
)  
`
````

````
`buildPayload(  
    platforms: Arraystring>  
)  
`
````

Builder properties: subtitle, badge, sound, debugging, apns, fcm.

#### Sample

````
`  
`
````

````
`let builder = PubNub.notificationPayload('Chat invitation',  
                                            'You have been invited to \'quiz\' chat');  
`
````

### Other examples

Generate payloads:

````
`  
`
````

````
`  
`
````

````
`  
`
````

Output:

````
`{  
    "pn_apns": {  
        "aps": {  
            "alert": {  
                "body": "Chat invitation",  
                "title": "You have been invited to 'quiz' chat"  
            }  
        },  
        "pn_push": [  
            {  
                "collapse_id": "invitations",  
                "expiration": "2019-11-28T22:06:09.163Z",  
                "targets": [  
                    {  
                        "environment": "development",  
`
````

Example shows APNS redelivery for 10 s and grouping via `collapse_id`.

### Returns
Configured `NotificationsPayload` ready for `pubnub.publish`.

---

_Last updated: Jul 15 2025_