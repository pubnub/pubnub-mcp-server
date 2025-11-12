# Utility Methods API for Unity SDK

Utility methods for cleanup, connectivity, subscription inspection, and push payload creation.

## Cleanup

Frees threads and allows clean exit.

### Method(s)

```
`1Pubnub.CleanUp()  
`
```

### Sample code

##### Reference code
```
1
  
```

### Returns

None

## Disconnect

Forces the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method(s)

```
`1DisconnectT>()  
`
```

This method doesn't take any arguments.

### Sample code

```
1
  
```

## Get subscribed channel groups

Returns all subscribed channel groups as a List<string>.

### Method(s)

```
`1Liststring> GetSubscribedChannelGroups()  
`
```

### Sample code

#### Get subscribed channel groups
```
1
  
```

### Response

`List<String>`

```
`1["channelGroup1", "channelGroup2"]  
`
```

## Get subscribed channels

Returns all subscribed channels as a List<string>.

### Method(s)

```
`1Liststring> GetSubscribedChannels()  
`
```

### Sample code

#### Get subscribed channels
```
1
  
```

### Response

`List<String>`

```
`1["channel1", "channel2"]  
`
```

## Reconnect

Forces the SDK to try to reach PubNub again.

### Method(s)

```
`1ReconnectT>(bool resetSubscribeToken)  
`
```

- resetSubscribeToken: bool. Passing true sends a zero timetoken upon reconnect.

### Sample code

```
1
  
```

## Create push payload

Creates a push payload for use in publish or push-related endpoints.

### Method(s)

```
`1CreatePushPayloadHelper()  
2    .SetAPNSPayload(PNAPSData, ListPNAPNS2Data>)  
3    .SetFCMPayload(PNFCMData)  
4    .SetCommonPayload(Dictionarystring, object>)  
5    .BuildPayload()  
`
```

- SetAPNSPayload
  - PNAPSData: Set APNS payload; delivered under pn_apns.
  - List<PNAPNS2Data>: Set APNS2 payload; delivered under pn_push.
- SetFCMPayload
  - PNFCMData: Set FCM payload; delivered under pn_fcm.
- SetCommonPayload
  - Dictionary<string, object>: Common payload; native PubNub subscribers receive the entire object including pn_apns, pn_fcm, and common payload.
- BuildPayload
  - Builds and returns Dictionary<string, object>.

### Sample code

#### Create push payload
```
1
  
```

### Response

CreatePushPayloadHelper() returns a Dictionary<string, object> that can be passed directly to the Publish method's Message parameter.

Last updated on Nov 6, 2025