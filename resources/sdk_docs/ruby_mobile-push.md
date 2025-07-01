On this page
# Mobile Push Notifications API for Ruby SDK

Mobile Push Notifications feature enables developers to bridge native PubNub publishing with 3rd-party push notification services including Google Android FCM (Firebase Cloud Messaging) and Apple iOS APNs (Apple Push Notification service).

By using the Mobile Push Notifications feature, developers can eliminate the need for developing, configuring, and maintaining additional server-side components for third-party push notification providers.

To learn more, read about [Mobile Push Notifications](/docs/general/push/send).

## Add Device to Channel[​](#add-device-to-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Enable mobile push notifications on provided set of channels.

### Method(s)[​](#methods)

To run `Adding Device to Channel` you can use the following method(s) in the Ruby SDK:

```
`pubnub.add_channels_to_push(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    channel: channel,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`push_token` *Type: StringDevice ID.`push_gateway` *Type: StringBack end to use. Accepted values are: `gcm`, and `apns2`.`channel` *Type: StringComma-separated list of channels to add.`topic`Type: StringBundle ID of the mobile application.  
Required only if `push_gateway` is set to `apns2`.`environment`Type: StringEnvironment of the mobile application.  
Required only if `push_gateway` is set to `apns2`.  
Defaults to `development`. Set it to either `development` or `production`.`auth_key`Type: StringAccess Manager authorization key. Required only if Access Manager is enabled.`http_sync`Type: BooleanIf set to `false`, the method executes asynchronously and returns a `Future`. To get its value, use the `value` method. If set to `true`, the method returns an array of envelopes (even if there's only one).   
For synchronous methods, the `envelope` object is returned.   
Defaults to `false`.`callback`Type: Lambda accepting one parameterCallback called for each `envelope`.   
For asynchronous methods, a `Future` is returned. To get its value, use the `value` method. The thread will be locked until `value` is returned.

### Basic Usage[​](#basic-usage)

#### Add Device to Channel[​](#add-device-to-channel-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`require 'pubnub'  
  
def add_device_to_channel(pubnub)  
  # For FCM/GCM  
  pubnub.add_channels_to_push(  
    push_token: 'push_token',  
    push_gateway: 'gcm',  
    channel: 'channel1,channel2'  
  ) do |envelope|  
    if envelope.status[:error]  
      puts "FCM/GCM Error: #{envelope.status[:error]}"  
    else  
      puts "FCM/GCM Success: Device added to channels."  
    end  
  end  
`
```
show all 47 lines

### Response[​](#response)

```
`#  
    @result = {  
        :code => 200,  
        :operation => :add_channels_to_push,  
        :data => [1, "Modified Channels"]  
    },  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```

## List Channels For Device[​](#list-channels-for-device)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Request for all channels on which push notification has been enabled using specified pushToken.

### Method(s)[​](#methods-1)

To run `Listing Channels For Device` you can use the following method(s) in the Ruby SDK:

```
`pubnub.list_push_provisions(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`push_token` *Type: StringDevice ID.`push_gateway` *Type: StringBack end to use. Accepted values are: `gcm`, and `apns2`.`topic`Type: StringBundle ID of the mobile application.  
Required only if `push_gateway` is set to `apns2`.`environment`Type: StringEnvironment of the mobile application.  
Required only if `push_gateway` is set to `apns2`.  
Defaults to `development`. Set it to either `development` or `production`.`auth_key`Type: StringAccess Manager authorization key. Required only if Access Manager is enabled.`http_sync`Type: BooleanIf set to `false`, the method executes asynchronously and returns a `Future`. To get its value, use the `value` method. If set to `true`, the method returns an array of envelopes (even if there's only one).   
For synchronous methods, the `envelope` object is returned.   
Defaults to `false`.`callback`Type: Lambda accepting one parameterCallback called for each `envelope`.   
For asynchronous methods, a `Future` is returned. To get its value, use the `value` method. The thread will be locked until `value` is returned.

### Basic Usage[​](#basic-usage-1)

#### List Channels For Device[​](#list-channels-for-device-1)

```
`# for FCM/GCM  
pubnub.list_push_provisions(  
    push_token: 'push_token',  
    type: 'gcm'  
) do |envelope|  
    puts envelope  
end  
  
# for APNS2  
pubnub.list_push_provisions(  
    push_token: 'push_token',  
    type: 'apns2',  
    topic: 'myapptopic'  
    environment: 'development'  
) do |envelope|  
`
```
show all 17 lines

### Response[​](#response-1)

```
`#  
    @result = {  
        :code => 200,  
        :operation => :list_push_provisions,  
        :data => ["channel1", "channel2"]  
    },  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```

## Remove Device From Channel[​](#remove-device-from-channel)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications on provided set of channels. If `nil` will be passed as channels then client will remove mobile push notifications from all channels which associated with `pushToken`.

### Method(s)[​](#methods-2)

To run `Removing Device From Channel` you can use the following method(s) in the Ruby SDK:

```
`pubnub.remove_channels_from_push(push_token: push_token, push_gateway: push_gateway, channel: channel, topic: topic, environment: environment, auth_key: auth_key, http_sync: http_sync, callback: callback)  
`
```

*  requiredParameterDescription`push_token` *Type: StringDevice ID.`push_gateway` *Type: StringBack end to use. Accepted values are: `gcm`, and `apns2`.`channel` *Type: StringComma-separated list of channels to add.`topic`Type: StringBundle ID of the mobile application.  
Required only if `push_gateway` is set to `apns2`.`environment`Type: StringEnvironment of the mobile application.  
Required only if `push_gateway` is set to `apns2`.  
Defaults to `development`. Set it to either `development` or `production`.`auth_key`Type: StringAccess Manager authorization key. Required only if Access Manager is enabled.`http_sync`Type: BooleanIf set to `false`, the method executes asynchronously and returns a `Future`. To get its value, use the `value` method. If set to `true`, the method returns an array of envelopes (even if there's only one).   
For synchronous methods, the `envelope` object is returned.   
Defaults to `false`.`callback`Type: Lambda accepting one parameterCallback called for each `envelope`.   
For asynchronous methods, a `Future` is returned. To get its value, use the `value` method. The thread will be locked until `value` is returned.

### Basic Usage[​](#basic-usage-2)

#### Remove Device From Channel[​](#remove-device-from-channel-1)

```
`# for FCM/GCM  
pubnub.remove_channels_from_push(  
    push_token: 'push_token',  
    remove: 'channel1,channel2',  
    type: 'gcm'  
) do |envelope|  
    puts envelope  
end  
  
# for APNS2  
pubnub.remove_channels_from_push(  
    push_token: 'push_token',  
    remove: 'channel1,channel2',  
    type: 'apns2',  
    topic: 'myapptopic',  
`
```
show all 19 lines

### Response[​](#response-2)

```
`#  
    @result = {  
        :code => 200,  
        :operation => :remove_channels_from_push,  
        :data => [1, "Modified Channels"]  
    },  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```

## Remove all mobile push notifications[​](#remove-all-mobile-push-notifications)

##### note
Requires *Mobile Push Notifications* add-on
This method requires that the Mobile Push Notifications add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Disable mobile push notifications from all channels registered with the specified pushToken.

### Method(s)[​](#methods-3)

To run `Remove all mobile push notifications`, you can use the following method(s) in the Ruby SDK:

```
`pubnub.remove_device_from_push(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
`
```

*  requiredParameterDescription`push_token` *Type: StringDevice ID.`push_gateway` *Type: StringBack end to use. Accepted values are: `gcm`, and `apns2`.`topic`Type: StringBundle ID of the mobile application.  
Required only if `push_gateway` is set to `apns2`.`environment`Type: StringEnvironment of the mobile application.  
Required only if `push_gateway` is set to `apns2`.  
Defaults to `development`. Set it to either `development` or `production`.`auth_key`Type: StringAccess Manager authorization key. Required only if Access Manager is enabled.`http_sync`Type: BooleanIf set to `false`, the method executes asynchronously and returns a `Future`. To get its value, use the `value` method. If set to `true`, the method returns an array of envelopes (even if there's only one).   
For synchronous methods, the `envelope` object is returned.   
Defaults to `false`.`callback`Type: Lambda accepting one parameterCallback called for each `envelope`.   
For asynchronous methods, a `Future` is returned. To get its value, use the `value` method. The thread will be locked until `value` is returned.

### Basic Usage[​](#basic-usage-3)

#### Remove all mobile push notifications[​](#remove-all-mobile-push-notifications-1)

```
`# for FCM/GCM  
pubnub.remove_device_from_push(  
    push_token: 'push_token',  
    type: 'gcm'  
) do |envelope|  
    puts envelope  
end  
  
# for APNS2  
pubnub.remove_device_from_push(  
    push_token: 'push_token',  
    type: 'apns2',  
    topic: 'myapptopic'  
    environment: 'development'  
) do |envelope|  
`
```
show all 17 lines

### Response[​](#response-3)

```
`#**    @result = {  
        :code => 200,  
        :operation => :remove_device_from_push,  
        :data => [1, "Modified Channels"]  
    },  
    @status = {  
        :code => 200,  
        :category => :ack,  
        :error => false,  
    }  
>  
`
```
Last updated on Mar 31, 2025**