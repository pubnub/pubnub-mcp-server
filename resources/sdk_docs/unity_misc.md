# Utility Methods API for Unity SDK

Utility methods for managing SDK state and payloads.

## Cleanup[​](#cleanup)

Frees threads and allows a clean exit.

### Method(s)[​](#methods)
```
`1Pubnub.CleanUp()  
`
```

### Sample code[​](#sample-code)
```
1
  

```

### Returns[​](#returns)
None

## Disconnect[​](#disconnect)

Forces the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method(s)[​](#methods-1)
```
`1DisconnectT>()  
`
```
This method doesn't take any arguments.

### Sample code[​](#sample-code-1)
```
1
  

```

## Get subscribed channel groups[​](#get-subscribed-channel-groups)

Returns all subscribed channel groups as a List<string>.

### Method(s)[​](#methods-2)
```
`1Liststring> GetSubscribedChannelGroups()  
`
```

### Sample code[​](#sample-code-2)
#### Get subscribed channel groups[​](#get-subscribed-channel-groups-1)
```
1
  

```

### Response[​](#response)
List<String>
```
`1["channelGroup1", "channelGroup2"]  
`
```

## Get subscribed channels[​](#get-subscribed-channels)

Returns all subscribed channels as a List<string>.

### Method(s)[​](#methods-3)
```
`1Liststring> GetSubscribedChannels()  
`
```

### Sample code[​](#sample-code-3)
#### Get subscribed channels[​](#get-subscribed-channels-1)
```
1
  

```

### Response[​](#response-1)
List<String>
```
`1["channel1", "channel2"]  
`
```

## Reconnect[​](#reconnect)

Forces the SDK to attempt reconnection.

### Method(s)[​](#methods-4)
```
`1ReconnectT>(bool resetSubscribeToken)  
`
```
- resetSubscribeToken (bool): Passing true sends zero timetoken upon reconnect.

### Sample code[​](#sample-code-4)
```
1
  

```

## Create push payload[​](#create-push-payload)

Creates a push payload for use with publish and push-related endpoints.

### Method(s)[​](#methods-5)
```
`1CreatePushPayloadHelper()  
2    .SetAPNSPayload(PNAPSData, ListPNAPNS2Data>)  
3    .SetFCMPayload(PNFCMData)  
4    .SetCommonPayload(Dictionarystring, object>)  
5    .BuildPayload()  
`
```

- SetAPNSPayload
  - Type: PNAPSData, List<PNAPNS2Data>
  - APNS payload: pn_apns key; APNS2 payload: pn_push key.
- SetFCMPayload
  - Type: PNFCMData
  - FCM payload under pn_fcm key.
- SetCommonPayload
  - Type: Dictionary<string, object>
  - Common payload; native PubNub subscribers receive full object, including pn_apns, pn_fcm, and common payload.
- BuildPayload
  - Builds and returns Dictionary<string, object>.

### Sample code[​](#sample-code-5)
#### Create push payload[​](#create-push-payload-1)
```
1
  

```

### Response[​](#response-2)
CreatePushPayloadHelper() returns Dictionary<string, object> for direct use as the Publish method's Message parameter.

Last updated on Nov 6, 2025