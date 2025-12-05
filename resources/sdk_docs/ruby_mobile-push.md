# Mobile Push Notifications API for Ruby SDK

Connect PubNub publishing to push services: Google FCM and Apple APNs (APNS2). Learn more: Mobile Push Notifications.

Requires Mobile Push Notifications add-on: enable for your key in the Admin Portal.

## Add a device to a push notifications channel

Enable push notifications on a set of channels.

### Method(s)

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

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: 'gcm', 'apns2'.
- channel (String, required): Comma-separated channel list to add.
- topic (String, required for apns2): APNs topic (bundle identifier).
- environment (String, required for apns2): APNs environment. Default: 'development'. Accepted values: 'development', 'production'.
- auth_key (String): Access Manager authorization key.
- http_sync (Boolean): If false, runs asynchronously and returns a Future; if true, returns an array of envelopes (even if one). Default: false.
- callback (Lambda(envelope)): Called for each returned envelope. For async calls, use Future#value to get the result.

### Sample code

#### Add device to channel

Reference code (runnable):

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

  # For APNS2 token has to be 32 or 100 characters hexadecimal string
  pubnub.add_channels_to_push(
    push_token: '00000000000000000000000000000000',
    push_gateway: 'apns2',
    channel: 'channel1,channel2',
    topic: 'myapptopic',
    environment: 'development'
  ) do |envelope|
    if envelope.status[:error]
      puts "APNS2 Error: #{envelope.status[:error]}"
    else
      puts "APNS2 Success: Device added to channels."
    end
  end
end

def main
  # Configuration for PubNub instance
  pubnub = Pubnub.new(
    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),
    user_id: 'myUniqueUserId'
  )

  # Add device to channel
  add_device_to_channel(pubnub)
  sleep 2 # Allow time for the async operation to complete
end

if __FILE__ == $0
  main
end
```

### Response

```ruby
# 
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
```

## List push notifications channels for a device

List channels with push enabled for a device token.

### Method(s)

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

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: 'gcm', 'apns2'.
- topic (String, required for apns2): APNs topic (bundle identifier).
- environment (String, required for apns2): APNs environment. Default: 'development'. Accepted values: 'development', 'production'.
- auth_key (String): Access Manager authorization key.
- http_sync (Boolean): If false, async Future; if true, array of envelopes. Default: false.
- callback (Lambda(envelope)): For async, use Future#value.

### Sample code

#### List channels for device

```ruby
# for FCM/GCM
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
  topic: 'myapptopic',
  environment: 'development'
) do |envelope|
  puts envelope
end
```

### Response

```ruby
# 
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
```

## Remove a device from push notifications channels

Disable push on a set of channels.

### Method(s)

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

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: 'gcm', 'apns2'.
- channel (String, required): Comma-separated channel list to remove.
- topic (String, required for apns2): APNs topic (bundle identifier).
- environment (String, required for apns2): APNs environment. Default: 'development'. Accepted values: 'development', 'production'.
- auth_key (String): Access Manager authorization key.
- http_sync (Boolean): If false, async Future; if true, array of envelopes. Default: false.
- callback (Lambda(envelope)): For async, use Future#value.

### Sample code

#### Remove device from channel

```ruby
# for FCM/GCM
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
  environment: 'development'
) do |envelope|
  puts envelope
end
```

### Response

```ruby
# 
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
```

## Remove a device from all push notifications channels

Disable push on all channels registered for the device token.

### Method(s)

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

Parameters:
- push_token (String, required): Device token.
- push_gateway (String, required): Backend. Accepted values: 'gcm', 'apns2'.
- topic (String, required for apns2): APNs topic (bundle identifier).
- environment (String, required for apns2): APNs environment. Default: 'development'. Accepted values: 'development', 'production'.
- auth_key (String): Access Manager authorization key.
- http_sync (Boolean): If false, async Future; if true, array of envelopes. Default: false.
- callback (Lambda(envelope)): For async, use Future#value.

### Sample code

#### Remove all mobile push notifications

```ruby
# for FCM/GCM
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
  topic: 'myapptopic',
  environment: 'development'
) do |envelope|
  puts envelope
end
```

### Response

```ruby
# 
@result = {
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
```

Last updated on Oct 29, 2025