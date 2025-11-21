# Utility Methods API for C# SDK

The methods on this page are utility methods that don't fit into other categories.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions; server/network failures are returned in status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Destroy[​](#destroy)

Frees threads and allows a clean exit.

### Method(s)[​](#methods)

```
`1destroy()  
`
```

### Sample code[​](#sample-code)

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

Returns all subscribed channel groups as List<String>.

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

Returns all subscribed channels as List<String>.

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

- resetSubscribeToken (bool): Passing true sends a zero timetoken upon reconnect.

### Sample code[​](#sample-code-4)

```
1
**
```