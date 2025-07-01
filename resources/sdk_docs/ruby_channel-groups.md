On this page
# Channel Groups API for Ruby SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Ruby SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`channel_registration(  
    action: :add,  
    channels: channels,  
    channel_groups: channel_groups,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`action` *Type: Symbol`Action` that you want to preform, to add, it's `:add`.`channels` *Type: String, SymbolThe `channels` to add to `channel groups`.`channel_groups` *Type: String, SymbolThe `channel_groups` to add `channels` to.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage)

#### Add Channels[​](#add-channels-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def add_channels_to_group(pubnub)  
  # Async without callback  
  pubnub.channel_registration(action: :add, channel: 'my_channel', channel_group: :somegroup) do |envelope|  
    if envelope.status[:error]  
      puts "Async Error: #{envelope.status[:error]}"  
    else  
      puts "Async Success: Channels added to channel group."  
    end  
  end  
  
  # Sync without callback  
  begin  
    envelopes = pubnub.channel_registration(action: :add, channel: 'my_channel', channel_group: :somegroup, http_sync: true)  
`
```
show all 35 lines

### Response[​](#response)

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

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Ruby SDK:

```
`channel_registration(  
    action: :get,  
    channel_group: group,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`action` *Type: SymbolTo get all channels from a `channel groups` you need to specify action as `:get`.`channel_groups` *Type: String, Symbol`Channel groups` to fetch the channels of.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`pubnub.channel_registration(action: :get, group: 'family') do |envelope|  
    pp envelope  
end  
`
```

### Response[​](#response-1)

```
`#  
    @result = {  
        :data => {  
            "channels" => ["ben"],  
            "group" => "family"  
        }  
    }  
    @status = {  
        :code => 200  
    }  
>  
`
```

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Ruby SDK:

```
`channel_registration(  
    action: :remove,  
    channels: channels,  
    channel_groups: group,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`action` *Type: SymbolUse `:remove` to remove `channels`.`channels` *Type: String, SymbolSpecify `channels` name to remove from `channel groups`.`channel_groups` *Type: String, SymbolSpecify `channel_groups` name to remove `channels` from.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`pubnub.channel_registration(action: :remove, channel: 'son', group: 'family') do |envelope|  
    pp envelope  
end  
`
```

### Response[​](#response-2)

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

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Ruby SDK:

```
`channel_registration(  
    action: :remove,  
    channel_groups: channel_groups,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`action` *Type: SymbolUse `:remove` to remove the channel groups.`channel_groups` *Type: String, SymbolSpecify channel groups name to remove.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`pubnub.channel_registration(action: :remove, channel_group: 'family') do |envelope|  
    pp envelope  
end  
`
```

### Response[​](#response-3)

```
`#**    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```
Last updated on Mar 31, 2025**