# Utility Methods API for Unity SDK

Utility methods for lifecycle, connectivity, subscriptions, and push payloads.

## Cleanup

Frees up threads and allows a clean exit.

### Method(s)

```
Pubnub.CleanUp()
```

### Returns

None

## Disconnect

Forces the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method(s)

```
Disconnect<T>()
```

This method doesn't take any arguments.

## Get subscribed channel groups

Returns all subscribed channel groups as a List<string>.

### Method(s)

```
List<string> GetSubscribedChannelGroups()
```

### Response

List<string>

```
["channelGroup1", "channelGroup2"]
```

## Get subscribed channels

Returns all subscribed channels as a List<string>.

### Method(s)

```
List<string> GetSubscribedChannels()
```

### Response

List<string>

```
["channel1", "channel2"]
```

## Reconnect

Forces the SDK to attempt reconnection to PubNub.

### Method(s)

```
Reconnect<T>(bool resetSubscribeToken)
```

- resetSubscribeToken (bool): Passing true sends zero timetoken upon reconnect.

## Create push payload

Creates a push payload for use with publish/endpoints.

### Method(s)

```
CreatePushPayloadHelper()
    .SetAPNSPayload(PNAPSData, List<PNAPNS2Data>)
    .SetFCMPayload(PNFCMData)
    .SetCommonPayload(Dictionary<string, object>)
    .BuildPayload()
```

- SetAPNSPayload
  - PNAPSData: Set APNS payload. APNS devices receive data within the pn_apns key.
  - List<PNAPNS2Data>: Set APNS2 payload. APNS devices receive data within the pn_push key.
- SetFCMPayload
  - PNFCMData: Set FCM payload. FCM devices receive data within the pn_gcm key.
- SetCommonPayload
  - Dictionary<string, object>: Set common payload. Native PubNub subscribers receive the entire object including pn_apns, pn_gcm, and common payload.
- BuildPayload: Builds and returns Dictionary<string, object>.

### Response

CreatePushPayloadHelper() returns a Dictionary<string, object> suitable for the Publish method's Message parameter.

Last updated on Aug 6, 2025