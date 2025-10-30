# Utility Methods API for Python SDK

Utility methods that don't fit other categories.

## Disconnect

Force the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method(s)

```
`1disconnect()  
`
```

No arguments.

### Sample code

##### Reference code

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4
  
5
  
6def disconnect_from_pubnub(pubnub: PubNub):  
7    pubnub._subscription_manager.disconnect()  
8    print("Disconnected from PubNub.")  
9
  
10
  
11def main():  
12    # Configuration for PubNub instance  
13    pn_config = PNConfiguration()  
14    pn_config.subscribe_key = os.getenv('PUBNUB_SUBSCRIBE_KEY', 'demo')  
15    pn_config.user_id = os.getenv('PUBNUB_USER_ID', 'my_custom_user_id')  
16
  
17    # Initialize PubNub client  
18    pubnub = PubNub(pn_config)  
19
  
20    # Disconnect from PubNub  
21    disconnect_from_pubnub(pubnub)  
22
  
23
  
24if __name__ == "__main__":  
25    main()  

```

## Reconnect

Force the SDK to attempt reconnection to PubNub.

### Method(s)

```
`1pubnub.reconnect()  
`
```

No arguments.

## Get subscribed channels

Return all subscribed channels as a list.

### Method(s)

`pubnub.get_subscribed_channels()`

### Sample code

#### Get subscribed channels

```
`1channels = pubnub.get_subscribed_channels()  
`
```

### Returns

`List`

```
`1["my_ch1", "my_ch2"]  
`
```

## Get subscribed channel groups

Return all subscribed channel groups as a list.

### Method(s)

`pubnub.get_subscribed_channel_groups()`

### Sample code

#### Get subscribed channel groups

```
`1channels = pubnub.get_subscribed_channel_groups()  
`
```

### Returns

`List`

```
`1["my_group1", "my_group2"]**`
```