# Mobile Push Notifications – PubNub Ruby SDK

Requires the **Mobile Push Notifications** add-on (enable in the Admin Portal).

---

## Add Device to Channel

Enable push notifications for the specified channels.

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

Parameters  
* `push_token` (String) – Device ID.  
* `push_gateway` (String) – `gcm` | `apns2`.  
* `channel` (String) – Comma-separated channel list.  
* `topic` (String) – Bundle ID; required for `apns2`.  
* `environment` (String) – `development` (default) | `production`; `apns2` only.  
* `auth_key` (String) – PAM key (if enabled).  
* `http_sync` (Boolean) – `false` (async, returns `Future`) | `true` (sync).  
* `callback` (Proc) – Invoked per envelope.

### Example

```ruby
require 'pubnub'

def add_device_to_channel(pubnub)
  # FCM/GCM
  pubnub.add_channels_to_push(
    push_token: 'push_token',
    push_gateway: 'gcm',
    channel: 'channel1,channel2'
  ) do |envelope|
    if envelope.status[:error]
      puts "FCM/GCM Error: #{envelope.status[:error]}"
    else
      puts 'FCM/GCM Success: Device added to channels.'
    end
  end
end
```

### Response

```ruby
@result = {
  code: 200,
  operation: :add_channels_to_push,
  data: [1, 'Modified Channels']
},
@status = {
  code: 200,
  category: :ack,
  error: false
}
```

---

## List Channels for Device

Returns channels enabled for the specified device.

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

Parameters  
* `push_token`, `push_gateway`, `topic`, `environment`, `auth_key`, `http_sync`, `callback` – Same semantics as above.

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
  code: 200,
  operation: :list_push_provisions,
  data: ['channel1', 'channel2']
},
@status = {
  code: 200,
  category: :ack,
  error: false
}
```

---

## Remove Device from Channel

Disable push notifications on the specified channels (all channels if `channel` is `nil`).

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

Parameters – Same as previous methods; `channel` indicates channels to remove.

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
  topic: 'myapptopic'
) { |envelope| puts envelope }
```

### Response

```ruby
@result = {
  code: 200,
  operation: :remove_channels_from_push,
  data: [1, 'Modified Channels']
},
@status = {
  code: 200,
  category: :ack,
  error: false
}
```

---

## Remove All Mobile Push Notifications

Disable push notifications for the device on all channels.

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

Parameters – Same as previous methods (no `channel` param).

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
  code: 200,
  operation: :remove_device_from_push,
  data: [1, 'Modified Channels']
},
@status = {
  code: 200,
  category: :ack,
  error: false
}
```

---

Last updated: Jul 15, 2025