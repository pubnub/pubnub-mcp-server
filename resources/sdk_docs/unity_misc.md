# Utility Methods API for Unity SDK

Utility methods that don't fit other categories.

## Cleanup[​](#cleanup)

Frees threads for a clean exit.

### Method(s)[​](#methods)

```
`1Pubnub.CleanUp()  
`
```

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns[​](#returns)

None

## Disconnect[​](#disconnect)

Force the SDK to stop all requests to PubNub when there are active subscribe channels.

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

Returns all subscribed channel groups as `List<string>`.

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

`List<String>`

```
`1["channelGroup1", "channelGroup2"]  
`
```

## Get subscribed channels[​](#get-subscribed-channels)

Returns all subscribed channels as `List<string>`.

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

`List<String>`

```
`1["channel1", "channel2"]  
`
```

## Reconnect[​](#reconnect)

Force the SDK to attempt reconnecting to PubNub.

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

Build a push payload for use in publish/endpoints.

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
  - Type: PNAPSData — Set APNS payload; delivered within pn_apns.
  - Type: List<PNAPNS2Data> — Set APNS2 payload; delivered within pn_push.
- SetFCMPayload
  - Type: PNFCMData — Set FCM payload; delivered within pn_fcm.
- SetCommonPayload
  - Type: Dictionary<string, object> — Common payload; native PubNub subscribers receive full object including pn_apns, pn_fcm, and common payload.
- BuildPayload
  - Builds payload from the above and returns Dictionary<string, object>.

### Sample code[​](#sample-code-5)

#### Create push payload[​](#create-push-payload-1)

```
1
  

```

### Response[​](#response-2)

CreatePushPayloadHelper() returns a Dictionary<string, object> suitable for Publish Method's Message parameter.

Last updated on Nov 6, 2025