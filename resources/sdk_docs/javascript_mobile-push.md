# Mobile Push Notifications API – JavaScript SDK (mobile-push)

Mobile Push Notifications let you publish messages through PubNub that fan out to APNs (APNS2) and FCM without any extra servers.  
Add the *Mobile Push Notifications* add-on to your keys in the Admin Portal before using the APIs below.

---

## Add Device to Channel

Enable push notifications for a device on one or more channels.

### Method

```
`pubnub.push.addChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters  
• channels (Array<string>) – Channels to enable.  
• device (string) – Device push token.  
• pushGateway (string) – `"apns2"` or `"gcm"`.  
• environment (string, default `"development"`) – `"development"` or `"production"` (APNS2 only).  
• topic (string) – APNS2 topic (bundle ID); required when `pushGateway` is `"apns2"`.

### Basic Usage

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

---

## List Channels for Device

Returns all channels on which the specified device receives push notifications.

### Method

```
`pubnub.push.listChannels({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters  
• device (string) – Device push token.  
• pushGateway (string) – `"apns2"` or `"gcm"`.  
• environment (string, default `"development"`) – `"development"` or `"production"` (APNS2 only).  
• topic (string) – APNS2 topic; required when `pushGateway` is `"apns2"`.  
• start (string) – Pagination start (channel name).  
• count (number, default `500`, max `1000`) – Number of channels to return.

### Basic Usage

```
`  
`
```

### Response

```
`// status  
{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
  
// payload  
{  
    channels: [ 'a', 'b' ]  
}  
`
```

---

## Remove Device from Channel

Disable push notifications for a device on specific channels.

### Method

```
`pubnub.push.removeChannels({  
    channels: Arraystring>,  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters identical to *Add Device to Channel*.

### Basic Usage

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

---

## Remove Device from All Channels

Disable push notifications for a device on every channel.

### Method

```
`pubnub.push.deleteDevice({  
    device: string,  
    pushGateway: string,  
    environment: string,  
    topic: string  
})  
`
```

Parameters  
• device, pushGateway, environment, topic – same as above.

### Basic Usage

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: 'PNPushNotificationEnabledChannelsOperation',  
    statusCode: 200  
}  
`
```

---

## Push Notification Format Configuration

### APNS2Configuration

```
`type APNS2Configuration = {  
    collapseId?: string,  
    expirationDate?: Date,  
    targets: ArrayAPNS2Target>  
}  
`
```

• collapseId – `apns-collapse-id` header.  
• expirationDate – `apns-expiration` header.  
• targets – Array of APNS2Target objects.

### APNS2Target

```
`type APNS2Target = {  
    topic: string,  
    environment?: 'development' | 'production',  
    excludedDevices?: Arraystring>  
}  
`
```

• topic (string, required) – Bundle ID.  
• environment (`'development' | 'production'`, default `'development'`).  
• excludedDevices (Array<string>) – Tokens to omit.

### APNSNotificationPayload

APNs-specific builder.

Properties:  
• configurations (Array<APNS2Configuration>)  
• notification (Hash)  
• payload (Hash)  
• silent (Boolean)

### FCMNotificationPayload

FCM-specific builder.

Properties:  
• notification (Hash)  
• data (Hash)  
• silent (Boolean)  
• icon (String)  
• tag (String)  
• payload (Hash)

### NotificationsPayload Builder

Create multi-platform payloads.

```
`PubNub.notificationPayload(  
    title: string,  
    body: string  
)  
`
```

Properties  
• subtitle (string)  
• badge (number)  
• sound (string)  
• debugging (boolean)  
• apns (APNSNotificationPayload)  
• fcm (FCMNotificationPayload)

Build:

```
`buildPayload(  
    platforms: Arraystring>  
)  
`
```

`platforms`: `"apns"`, `"apns2"`, `"fcm"`.

#### Basic Example

```
`let builder = PubNub.notificationPayload('Chat invitation',  
                                            'You have been invited to \'quiz\' chat');  
`
```

---

### Additional Examples

#### Simple FCM + APNS payload

```
`  
`
```

#### Simple FCM + APNS2 payload (default configuration)

```
`  
`
```

#### Simple FCM + APNS2 payload (custom configuration)

```
`  
`
```

##### Output

```
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
```
show all 29 lines