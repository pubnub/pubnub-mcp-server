# Message Actions API for Ruby SDK

Use message actions to add/remove metadata on published messages (receipts, reactions, custom data). Clients subscribe to channels to receive message action events and can fetch past actions from Message Persistence.

##### Reactions
"Message Reactions" is a specific use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
Message Actions is the low-level API for metadata (read receipts, delivery confirmations, custom data). Message Reactions refers to using Message Actions for emoji reactions. Same underlying API across Core and Chat SDKs.

## Add message action[​](#add-message-action)

##### Requires Message Persistence
Requires Message Persistence enabled for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

Use this Ruby method:

```
`1add_message_action(  
2    channel: channel,  
3    type: type,  
4    value: value,  
5    message_timetoken: message_timetoken,  
6    http_sync: http_sync,  
7    callback: callback  
8)  
`
```

Parameters:
- channel (String, required, default: n/a): Channel name to add the message action to.
- type (String, required, default: n/a): Message action type (max 15 characters).
- value (String, required, default: n/a): Message action value.
- message_timetoken (Integer, required, default: n/a): Timetoken of the target message.
- http_sync (Boolean, optional, default: false): When true, executes synchronously and returns an array of envelopes.
- callback (Lambda with one parameter, optional, default: n/a): Invoked for each envelope (for async calls, use value to retrieve the envelope).

### Sample code[​](#sample-code)

##### Reference code

```
1require 'pubnub'  
2
  
3def add_message_action(pubnub)  
4  puts "Adding message action..."  
5  pubnub.add_message_action(  
6    channel: 'chat',  
7    type: 'emotion',  
8    value: 'smile',  
9    message_timetoken: 16701562382648731  
10  ) do |envelope|  
11    if envelope.status[:error]  
12      puts "Error adding message action: #{envelope.status[:data]}"  
13    else  
14      puts "Message action added successfully:"  
15      puts "Type: #{envelope.result[:data][:type]}"  
16      puts "Value: #{envelope.result[:data][:value]}"  
17      puts "UUID: #{envelope.result[:data][:uuid]}"  
18      puts "Action Timetoken: #{envelope.result[:data][:action_timetoken]}"  
19      puts "Message Timetoken: #{envelope.result[:data][:message_timetoken]}"  
20    end  
21  end  
22  sleep 1 # Allow time for the async operation to complete  
23end  
24
  
25def main  
26  # Configuration for PubNub instance  
27  pubnub = Pubnub.new(  
28    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
29    user_id: 'myUniqueUserId'  
30  )  
31
  
32  # Add message action  
33  add_message_action(pubnub)  
34end  
35
  
36if __FILE__ == $0  
37  main  
38  puts "Done."  
39end  

```

### Response[​](#response)

```
`1#  
2    @result = {  
3        :data => {  
4            :type => "emotion",  
5            :value => "smile",  
6            :uuid => "sender-uuid",  
7            :action_timetoken => 16701656660127890,  
8            :message_timetoken => 16701562382648731  
9        }  
10    },  
11    @status = {  
12        :code => 200  
13    }  
14>  
`
```

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence
Requires Message Persistence enabled for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

Use this Ruby method:

```
`1remove_message_action(  
2    channel: channel,  
3    message_timetoken: message_timetoken,  
4    action_timetoken: action_timetoken,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

Parameters:
- channel (String, required, default: n/a): Channel name to remove the message action from.
- message_timetoken (Integer, required, default: n/a): Timetoken of the target message.
- action_timetoken (Integer, required, default: n/a): Timetoken of the message action to remove.
- http_sync (Boolean, optional, default: false): When true, executes synchronously and returns an array of envelopes.
- callback (Lambda with one parameter, optional, default: n/a): Invoked for each envelope (for async calls, use value to retrieve the envelope).

### Sample code[​](#sample-code-1)

```
`1pubnub.add_message_action(  
2    channel: 'chat',  
3    message_timetoken: 16701562382648731,  
4    action_timetoken: 16701656660127890  
5) do |envelope|  
6    puts envelope  
7end  
`
```

### Response[​](#response-1)

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

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence
Requires Message Persistence enabled for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

### Method(s)[​](#methods-2)

Use this Ruby method:

```
`1get_message_actions(  
2    channel: channel,  
3    start: start,  
4    end: end,  
5    limit: limit,  
6    http_sync: http_sync,  
7    callback: callback  
8)  
`
```

Parameters:
- channel (String, required, default: n/a): Channel name to list message actions for.
- start (Integer, optional, default: n/a): Action timetoken for the start of the range (exclusive).
- end (Integer, optional, default: n/a): Action timetoken for the end of the range (inclusive).
- limit (Integer, optional, default: n/a): Number of message actions to return.
- http_sync (Boolean, optional, default: false): When true, executes synchronously and returns an array of envelopes.
- callback (Lambda with one parameter, optional, default: n/a): Invoked for each envelope (for async calls, use value to retrieve the envelope).

### Sample code[​](#sample-code-2)

```
`1pubnub.get_message_actions(  
2    channel: 'chat',  
3    start: 16701562382648731,  
4    end: 16701562382348728  
5) do |envelope|  
6    puts envelope  
7end  
`
```

### Response[​](#response-2)

```
`1#**2    @result = {  
3        :data => {  
4            :message_actions => [  
5                {  
6                    :type => "emotion_type_2",  
7                    :uuid => "sender-uuid-1",  
8                    :value => "surprised",  
9                    :message_timetoken => 16703307481706612,  
10                    :action_timetoken => 16703307649086202,  
11                },  
12                {  
13                    :type => "emotion_type_3",  
14                    :uuid => "sender-uuid-2",  
15                    :value => "lol",  
16                    :message_timetoken => 16703307492166434,  
17                    :action_timetoken => 16703307659619240,  
18                },  
19                {  
20                    :type => "emotion_type_1",  
21                    :uuid => "sender-uuid-1",  
22                    :value => "tada",  
23                    :message_timetoken => 16703307461212395,  
24                    :action_timetoken => 16703307702035502,  
25                }  
26            ],  
27            :more => {  
28                :start => 16703307481706612,  
29                :end => 16703307481706612,  
30                :limit => 3  
31            }  
32        }  
33    },  
34    @status = {  
35        :code => 200  
36    }  
37>  
`
```