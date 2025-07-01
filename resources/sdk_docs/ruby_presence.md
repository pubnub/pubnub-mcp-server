On this page
# Presence API for Ruby SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `here_now()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the Ruby SDK:

```
`here_now(  
    channels: channels,  
    channel_groups: channel_groups,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels`Type: String, SymbolSpecify the `channels` name to return occupancy results. If `channels` is not provided, `here_now` will return data for all channels (global `here_now`).`channel_groups`Type: String, SymbolSpecify the `channel_groups` name to return occupancy results.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage)

#### Get a list of uuids subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def fetch_uuids(pubnub)  
  pubnub.here_now(  
    channel: 'my_channel'  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "Error fetching UUIDs: #{envelope.status[:error]}"  
    else  
      puts "UUIDs subscribed to my_channel: #{envelope.result[:data][:uuids]}"  
      puts "Occupancy: #{envelope.result[:data][:occupancy]}"  
    end  
  end  
end  
  
`
```
show all 30 lines

### Response[​](#response)

```
`#  
    @result = {  
        :data => {  
            :uuids => ["2d588b75-0451-4bde-8952-13128c10e952"],  
            :occupancy => 1  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `where_now()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `where_now()` you can use the following method(s) in the Ruby SDK:

```
`where_now(  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`uuid` *Type: String`UUID` we are looking for.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-1)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`pubnub.where_now(  
    uuid: "my_uuid"  
) do |envelope|  
    puts envelope.result[:data]  
end  
`
```

### Response[​](#response-1)

```
`#  
    @result = {  
        :data => {  
        "channels" => ["whatever"]  
        }  
    },  
    @status = {  
        :code =>200  
    }  
>  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-2)

```
`set_state(  
    channels: channels,  
    state: state,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels` *Type: String, SymbolSpecify `channels` name to set `state` for.`state` *Type: HashThe `state` to set.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

```
`get_state(  
    channels: channels,  
    uuid: uuid,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`channels` *Type: String, SymbolSpecify `channels` name to get `state` from.`uuid`Type: StringSpecifies `UUID`.`http_sync`Type: BooleanDefault `false`. Method will be executed `asynchronously` and will return future, to get it's `value` you can use `value` method. If set to `true`, method will return array of envelopes (even if there's only one `envelope`).   
For `sync` methods `Envelope` object will be returned.`callback`Type: Lambda accepting one parameter`Callback` that will be called for each `envelope`.   
For `async` methods future will be returned, to retrieve `value` `Envelope` object you have to call `value` method (thread will be locked until the `value` is returned).

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state)

```
`pubnub.set_state(channel: 'my_channel', state: { key: 'value' }) do |envelope|  
    puts envelope.status  
end  
`
```

#### Get State[​](#get-state)

```
`pubnub.state(channel: :my_channel, uuid: 'some-uuid') do |envelope|  
    puts envelope.result[:data][:state]  
end  
`
```

### Response[​](#response-2)

```
`#**    @result = {  
        :data => {  
            :state => {  
                "age"=>59,  
                "first" => "Robert",  
                "last" => "Plant"  
            },  
            :channel=>"whatever"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```
Last updated on Jun 16, 2025**