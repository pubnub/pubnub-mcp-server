# Mobile Push Notifications – Ruby SDK

Enables PubNub publishing to FCM/GCM and APNS2 without additional servers.  
Requires the **Mobile Push Notifications** add-on (enable in the Admin Portal).

---

## Add Device to Channel

### Method

```ruby
pubnub.add_channels_to_push(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    channel: channel,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
```

Parameters (all optional unless noted):

* push_token (String, **required**) – Device ID  
* push_gateway (String, **required**) – `gcm` or `apns2`  
* channel (String) – Comma-separated channels  
* topic (String) – iOS bundle ID (APNS2 only)  
* environment (String) – `development` (default) or `production` (APNS2 only)  
* auth_key (String) – Access Manager key when enabled  
* http_sync (Boolean, default `false`) – `true` = sync; `false` = async (`Future`)  
* callback (Proc) – Executed per envelope

### Example

```ruby
require 'pubnub'  
  
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
end
```

### Response

```ruby
@result = {  
    :code => 200,  
    :operation => :add_channels_to_push,  
    :data => [1, "Modified Channels"]  
},  
@status = {  
    :code => 200,  
    :category => :ack,  
    :error => false  
}
```

---

## List Channels for Device

### Method

```ruby
pubnub.list_push_provisions(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
```

Parameters identical to *Add Device* (except `channel`).

### Example

```ruby
# FCM/GCM
pubnub.list_push_provisions(
  push_token: 'push_token',
  type: 'gcm'
) { |envelope| puts envelope }

# APNS2
pubnub.list_push_provisions(
  push_token: 'push_token',
  type: 'apns2',
  topic: 'myapptopic',
  environment: 'development'
) { |envelope| puts envelope }
```

### Response

```ruby
@result = {  
    :code => 200,  
    :operation => :list_push_provisions,  
    :data => ["channel1", "channel2"]  
},  
@status = {  
    :code => 200,  
    :category => :ack,  
    :error => false  
}
```

---

## Remove Device from Channel(s)

### Method

```ruby
pubnub.remove_channels_from_push(
    push_token: push_token,
    push_gateway: push_gateway,
    channel: channel,
    topic: topic,
    environment: environment,
    auth_key: auth_key,
    http_sync: http_sync,
    callback: callback
)
```

Same parameters as *Add Device*; `channel` can be `nil` to remove from all channels.

### Example

```ruby
# FCM/GCM
pubnub.remove_channels_from_push(
  push_token: 'push_token',
  remove: 'channel1,channel2',
  type: 'gcm'
) { |envelope| puts envelope }

# APNS2
pubnub.remove_channels_from_push(
  push_token: 'push_token',
  remove: 'channel1,channel2',
  type: 'apns2',
  topic: 'myapptopic',
  environment: 'development'
) { |envelope| puts envelope }
```

### Response

```ruby
@result = {  
    :code => 200,  
    :operation => :remove_channels_from_push,  
    :data => [1, "Modified Channels"]  
},  
@status = {  
    :code => 200,  
    :category => :ack,  
    :error => false  
}
```

---

## Remove Device from ALL Channels

### Method

```ruby
pubnub.remove_device_from_push(  
    push_token: push_token,  
    push_gateway: push_gateway,  
    topic: topic,  
    environment: environment,  
    auth_key: auth_key,  
    http_sync: http_sync,  
    callback: callback  
)  
```

Parameters as in previous calls (no `channel`).

### Example

```ruby
# FCM/GCM
pubnub.remove_device_from_push(
  push_token: 'push_token',
  type: 'gcm'
) { |envelope| puts envelope }

# APNS2
pubnub.remove_device_from_push(
  push_token: 'push_token',
  type: 'apns2',
  topic: 'myapptopic',
  environment: 'development'
) { |envelope| puts envelope }
```

### Response

```ruby
@result = {  
    :code => 200,  
    :operation => :remove_device_from_push,  
    :data => [1, "Modified Channels"]  
},  
@status = {  
    :code => 200,  
    :category => :ack,  
    :error => false  
}
```

_Last updated: Mar 31 2025_