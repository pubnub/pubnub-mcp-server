# Channel Groups API for Ruby SDK

Channel groups allow you to bundle thousands of channels into a named group. You can subscribe to a channel group to receive messages from all channels it contains.

##### Channel group operations
- You can't publish to a channel group—only subscribe. Publish to individual channels instead.

All channel group methods require the Stream Controller add-on enabled for your key in the PubNub Admin Portal.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

Adds channels to a channel group.

##### Requires Stream Controller add-on

### Method(s)[​](#methods)

Use in the Ruby SDK:

```
`1channel_registration(  
2    action: :add,  
3    channels: channels,  
4    channel_groups: channel_groups,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

Parameters:
- action (Symbol): Use :add.
- channels (String, Symbol): Channels to add.
- channel_groups (String, Symbol): Channel groups to add to.
- http_sync (Boolean): Default false. Async returns a future; if true, returns envelope(s).
- callback (Lambda 1-arg): Called per envelope. For async, call value on the returned future to get the Envelope.

##### Maximum number of channels
- Up to 200 channels per API call.

### Sample code[​](#sample-code)

#### Add channels[​](#add-channels)

##### Reference code

```
1require 'pubnub'  
2
  
3def add_channels_to_group(pubnub)  
4  # Async without callback  
5  pubnub.channel_registration(action: :add, channel: 'my_channel', channel_group: :somegroup) do |envelope|  
6    if envelope.status[:error]  
7      puts "Async Error: #{envelope.status[:error]}"  
8    else  
9      puts "Async Success: Channels added to channel group."  
10    end  
11  end  
12
  
13  # Sync without callback  
14  begin  
15    envelopes = pubnub.channel_registration(action: :add, channel: 'my_channel', channel_group: :somegroup, http_sync: true)  
16    puts "Sync Success: Channels added to channel group."  
17  rescue StandardError => e  
18    puts "Sync Error: #{e.message}"  
19  end  
20end  
21
  
22def main  
23  # Configuration for PubNub instance  
24  pubnub = Pubnub.new(  
25    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
26    user_id: 'myUniqueUserId'  
27  )  
28
  
29  # Add channels to group  
30  add_channels_to_group(pubnub)  
31end  
32
  
33if __FILE__ == $0  
34  main  
35end  

```

### Response[​](#response)

```
`1#  
2    @status = {  
3        :code => 200,  
4        :category => :ack,  
5        :error => false,  
6    }  
7>  
`
```

## List channels in a channel group[​](#list-channels-in-a-channel-group)

Lists all channels in a channel group.

##### Requires Stream Controller add-on

### Method(s)[​](#methods-1)

Use in the Ruby SDK:

```
`1channel_registration(  
2    action: :get,  
3    channel_group: group,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- action (Symbol): Use :get.
- channel_groups (String, Symbol): Channel groups to list channels for.
- http_sync (Boolean): Default false. Async returns a future; if true, returns envelope(s).
- callback (Lambda 1-arg): Called per envelope. For async, call value on the returned future to get the Envelope.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
`1pubnub.channel_registration(action: :get, group: 'family') do |envelope|  
2    pp envelope  
3end  
`
```

### Response[​](#response-1)

```
`1#  
2    @result = {  
3        :data => {  
4            "channels" => ["ben"],  
5            "group" => "family"  
6        }  
7    }  
8    @status = {  
9        :code => 200  
10    }  
11>  
`
```

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

Removes channels from a channel group.

##### Requires Stream Controller add-on

### Method(s)[​](#methods-2)

Use in the Ruby SDK:

```
`1channel_registration(  
2    action: :remove,  
3    channels: channels,  
4    channel_groups: group,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

Parameters:
- action (Symbol): Use :remove.
- channels (String, Symbol): Channels to remove.
- channel_groups (String, Symbol): Channel groups to remove channels from.
- http_sync (Boolean): Default false. Async returns a future; if true, returns envelope(s).
- callback (Lambda 1-arg): Called per envelope. For async, call value on the returned future to get the Envelope.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
`1pubnub.channel_registration(action: :remove, channel: 'son', group: 'family') do |envelope|  
2    pp envelope  
3end  
`
```

### Response[​](#response-2)

```
`1#  
2    @status = {  
3        :code => 200,  
4        :category => :ack,  
5        :error => false,  
6    }  
7>  
`
```

## Delete a channel group[​](#delete-a-channel-group)

Deletes a channel group.

##### Requires Stream Controller add-on

### Method(s)[​](#methods-3)

Use in the Ruby SDK:

```
`1channel_registration(  
2    action: :remove,  
3    channel_groups: channel_groups,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters:
- action (Symbol): Use :remove.
- channel_groups (String, Symbol): Channel groups to remove.
- http_sync (Boolean): Default false. Async returns a future; if true, returns envelope(s).
- callback (Lambda 1-arg): Called per envelope. For async, call value on the returned future to get the Envelope.

### Sample code[​](#sample-code-3)

#### Delete channel group[​](#delete-channel-group)

```
`1pubnub.channel_registration(action: :remove, channel_group: 'family') do |envelope|  
2    pp envelope  
3end  
`
```

### Response[​](#response-3)

```
`1#**2    @status = {  
3        :code => 200,  
4        :category => :ack,  
5        :error => false,  
6    }  
7>  
`
```

Last updated on Sep 3, 2025**