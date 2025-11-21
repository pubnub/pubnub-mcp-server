# Mobile Push Notifications API for Ruby SDK

Connect PubNub publishing to third-party push services: Google Android FCM and Apple iOS APNs. To learn more, read about Mobile Push Notifications.

Requires Mobile Push Notifications add-on: Enable for your key in the Admin Portal. See how to enable add-on features.

## Add a device to a push notifications channel

Enable mobile push notifications on a set of channels.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1pubnub.add_channels_to_push(  
2    push_token: push_token,  
3    push_gateway: push_gateway,  
4    channel: channel,  
5    topic: topic,  
6    environment: environment,  
7    auth_key: auth_key,  
8    http_sync: http_sync,  
9    callback: callback  
10)  
`
```

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: gcm, apns2.
- channel (String, required): Comma-separated channels to add.
- topic (String): APNs topic (bundle identifier). Required if push_gateway is apns2.
- environment (String): APNs environment. Required if push_gateway is apns2. Default: development. Accepted values: development, production.
- auth_key (String): Access Manager auth key (if enabled).
- http_sync (Boolean): If false, async and returns a Future. If true, returns an array of envelopes (even if one). Default: false.
- callback (Lambda): Receives each envelope. For async calls, use Future#value to get the result.

### Sample code

#### Add device to channel

```
1require 'pubnub'  
2
  
3def add_device_to_channel(pubnub)  
4  # For FCM/GCM  
5  pubnub.add_channels_to_push(  
6    push_token: 'push_token',  
7    push_gateway: 'gcm',  
8    channel: 'channel1,channel2'  
9  ) do |envelope|  
10    if envelope.status[:error]  
11      puts "FCM/GCM Error: #{envelope.status[:error]}"  
12    else  
13      puts "FCM/GCM Success: Device added to channels."  
14    end  
15  end  
16
  
17  # For APNS2 token has to be 32 or 100 characters hexadecimal string  
18  pubnub.add_channels_to_push(  
19    push_token: '00000000000000000000000000000000',  
20    push_gateway: 'apns2',  
21    channel: 'channel1,channel2',  
22    topic: 'myapptopic',  
23    environment: 'development'  
24  ) do |envelope|  
25    if envelope.status[:error]  
26      puts "APNS2 Error: #{envelope.status[:error]}"  
27    else  
28      puts "APNS2 Success: Device added to channels."  
29    end  
30  end  
31end  
32
  
33def main  
34  # Configuration for PubNub instance  
35  pubnub = Pubnub.new(  
36    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
37    user_id: 'myUniqueUserId'  
38  )  
39
  
40  # Add device to channel  
41  add_device_to_channel(pubnub)  
42  sleep 2 # Allow time for the async operation to complete  
43end  
44
  
45if __FILE__ == $0  
46  main  
47end  

```

### Response

```
`1#  
2    @result = {  
3        :code => 200,  
4        :operation => :add_channels_to_push,  
5        :data => [1, "Modified Channels"]  
6    },  
7    @status = {  
8        :code => 200,  
9        :category => :ack,  
10        :error => false,  
11    }  
12>  
`
```

## List push notifications channels for a device

List channels with push notifications enabled for the specified device token.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1pubnub.list_push_provisions(  
2    push_token: push_token,  
3    push_gateway: push_gateway,  
4    topic: topic,  
5    environment: environment,  
6    auth_key: auth_key,  
7    http_sync: http_sync,  
8    callback: callback  
9)  
`
```

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: gcm, apns2.
- topic (String): APNs topic. Required if push_gateway is apns2.
- environment (String): APNs environment. Required if push_gateway is apns2. Default: development. Accepted values: development, production.
- auth_key (String): Access Manager auth key (if enabled).
- http_sync (Boolean): If false, async and returns a Future. If true, returns an array of envelopes. Default: false.
- callback (Lambda): Receives each envelope. For async calls, use Future#value.

### Sample code

#### List channels for device

```
1# for FCM/GCM  
2pubnub.list_push_provisions(  
3    push_token: 'push_token',  
4    type: 'gcm'  
5) do |envelope|  
6    puts envelope  
7end  
8
  
9# for APNS2  
10pubnub.list_push_provisions(  
11    push_token: 'push_token',  
12    type: 'apns2',  
13    topic: 'myapptopic'  
14    environment: 'development'  
15) do |envelope|  
16    puts envelope  
17end  

```

### Response

```
`1#  
2    @result = {  
3        :code => 200,  
4        :operation => :list_push_provisions,  
5        :data => ["channel1", "channel2"]  
6    },  
7    @status = {  
8        :code => 200,  
9        :category => :ack,  
10        :error => false,  
11    }  
12>  
`
```

## Remove a device from push notifications channels

Disable mobile push notifications on a set of channels.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1pubnub.remove_channels_from_push(push_token: push_token, push_gateway: push_gateway, channel: channel, topic: topic, environment: environment, auth_key: auth_key, http_sync: http_sync, callback: callback)  
`
```

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: gcm, apns2.
- channel (String, required): Comma-separated channels to remove.
- topic (String): APNs topic. Required if push_gateway is apns2.
- environment (String): APNs environment. Required if push_gateway is apns2. Default: development. Accepted values: development, production.
- auth_key (String): Access Manager auth key (if enabled).
- http_sync (Boolean): If false, async and returns a Future. If true, returns an array of envelopes. Default: false.
- callback (Lambda): Receives each envelope. For async calls, use Future#value.

### Sample code

#### Remove device from channel

```
1# for FCM/GCM  
2pubnub.remove_channels_from_push(  
3    push_token: 'push_token',  
4    remove: 'channel1,channel2',  
5    type: 'gcm'  
6) do |envelope|  
7    puts envelope  
8end  
9
  
10# for APNS2  
11pubnub.remove_channels_from_push(  
12    push_token: 'push_token',  
13    remove: 'channel1,channel2',  
14    type: 'apns2',  
15    topic: 'myapptopic',  
16    environment: 'development'  
17) do |envelope|  
18    puts envelope  
19end  

```

### Response

```
`1#  
2    @result = {  
3        :code => 200,  
4        :operation => :remove_channels_from_push,  
5        :data => [1, "Modified Channels"]  
6    },  
7    @status = {  
8        :code => 200,  
9        :category => :ack,  
10        :error => false,  
11    }  
12>  
`
```

## Remove a device from all push notifications channels

Disable mobile push notifications from all channels registered with the specified device token.

### Method(s)

Use the following method(s) in the Ruby SDK:

```
`1pubnub.remove_device_from_push(  
2    push_token: push_token,  
3    push_gateway: push_gateway,  
4    topic: topic,  
5    environment: environment,  
6    auth_key: auth_key,  
7    http_sync: http_sync,  
8    callback: callback  
9)  
`
```

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: gcm, apns2.
- topic (String): APNs topic. Required if push_gateway is apns2.
- environment (String): APNs environment. Required if push_gateway is apns2. Default: development. Accepted values: development, production.
- auth_key (String): Access Manager auth key (if enabled).
- http_sync (Boolean): If false, async and returns a Future. If true, returns an array of envelopes. Default: false.
- callback (Lambda): Receives each envelope. For async calls, use Future#value.

### Sample code

#### Remove all mobile push notifications

```
1# for FCM/GCM  
2pubnub.remove_device_from_push(  
3    push_token: 'push_token',  
4    type: 'gcm'  
5) do |envelope|  
6    puts envelope  
7end  
8
  
9# for APNS2  
10pubnub.remove_device_from_push(  
11    push_token: 'push_token',  
12    type: 'apns2',  
13    topic: 'myapptopic'  
14    environment: 'development'  
15) do |envelope|  
16    puts envelope  
17end  

```

### Response

```
`1#**2    @result = {  
3        :code => 200,  
4        :operation => :remove_device_from_push,  
5        :data => [1, "Modified Channels"]  
6    },  
7    @status = {  
8        :code => 200,  
9        :category => :ack,  
10        :error => false,  
11    }  
12>  
`
```

Last updated on Oct 29, 2025**