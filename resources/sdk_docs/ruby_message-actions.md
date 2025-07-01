On this page
# Message Actions API for Ruby SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To add a message action, you can use the following method(s) in the Ruby SDK:

```
`add_message_action(  
    channel: channel,  
    type: type,  
    value: value,  
    message_timetoken: message_timetoken,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel which stores the message for which action should be added.`type` *Type: StringDefault:  
n/aWhat feature this message action represents. Maximum `15` characters.`value` *Type: StringDefault:  
n/aValue to be added with message action type.`message_timetoken` *Type: IntegerDefault:  
n/aTimetoken of message to which action should be added.`http_sync`Type: BooleanDefault:  
falseIf set to `true`, this method is executed synchronously and returns an array of envelopes (even if there's only one `envelope`).`callback`Type: Lambda accepting one parameterDefault:  
n/aThe callback that's called for each envelope. For `async` methods, a Future is returned. To retrieve the value of the envelope object, you have to call the `value` method (the thread is locked until the `value` is returned).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def add_message_action(pubnub)  
  puts "Adding message action..."  
  pubnub.add_message_action(  
    channel: 'chat',  
    type: 'emotion',  
    value: 'smile',  
    message_timetoken: 16701562382648731  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error adding message action: #{envelope.status[:data]}"  
    else  
      puts "Message action added successfully:"  
      puts "Type: #{envelope.result[:data][:type]}"  
`
```
show all 39 lines

### Response[​](#response)

```
`#  
    @result = {  
        :data => {  
            :type => "emotion",  
            :value => "smile",  
            :uuid => "sender-uuid",  
            :action_timetoken => 16701656660127890,  
            :message_timetoken => 16701562382648731  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To remove a message action, you can use the following method(s) in the Ruby SDK:

```
`remove_message_action(  
    channel: channel,  
    message_timetoken: message_timetoken,  
    action_timetoken: action_timetoken,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel which store message for which action should be removed.`message_timetoken` *Type: IntegerDefault:  
n/aTimetoken of message to which action should be removed.`action_timetoken` *Type: IntegerDefault:  
n/aMessage action addition timetoken.`http_sync`Type: BooleanDefault:  
falseIf set to `true`, this method is executed synchronously and returns an array of envelopes (even if there's only one `envelope`).`callback`Type: Lambda accepting one parameterDefault:  
n/aThe callback that's called for each envelope. For `async` methods, a Future is returned. To retrieve the value of the envelope object, you have to call the `value` method (the thread is locked until the `value` is returned).

### Basic Usage[​](#basic-usage-1)

```
`pubnub.add_message_action(  
    channel: 'chat',  
    message_timetoken: 16701562382648731,  
    action_timetoken: 16701656660127890  
) do |envelope|  
    puts envelope  
end  
`
```

### Response[​](#response-1)

```
`#  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a channel. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-2)

To get message actions, you can use the following method(s) in the Ruby SDK:

```
`get_message_actions(  
    channel: channel,  
    start: start,  
    end: end,  
    limit: limit,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of channel from which list of message actions should be retrieved.`start`Type: IntegerDefault:  
n/aReturn values will be less than start.`end`Type: IntegerDefault:  
n/aReturn values will be greater than or equal to end.`limit`Type: IntegerDefault:  
n/aNumber of messages actions to return in response.`http_sync`Type: BooleanDefault:  
falseIf set to `true`, this method is executed synchronously and returns an array of envelopes (even if there's only one `envelope`).`callback`Type: Lambda accepting one parameterDefault:  
n/aThe callback that's called for each envelope. For `async` methods, a Future is returned. To retrieve the value of the envelope object, you have to call the `value` method (the thread is locked until the `value` is returned).

### Basic Usage[​](#basic-usage-2)

```
`pubnub.get_message_actions(  
    channel: 'chat',  
    start: 16701562382648731,  
    end: 16701562382348728  
) do |envelope|  
    puts envelope  
end  
`
```

### Response[​](#response-2)

```
`#**    @result = {  
        :data => {  
            :message_actions => [  
                {  
                    :type => "emotion_type_2",  
                    :uuid => "sender-uuid-1",  
                    :value => "surprised",  
                    :message_timetoken => 16703307481706612,  
                    :action_timetoken => 16703307649086202,  
                },  
                {  
                    :type => "emotion_type_3",  
                    :uuid => "sender-uuid-2",  
                    :value => "lol",  
`
```
show all 37 linesLast updated on Jun 10, 2025**