# Channel Groups API – Ruby SDK (Condensed)

Channel Groups let you subscribe to, but not publish to, a named collection of channels.  
All operations below require the **Stream Controller add-on** to be enabled for your keys.

---

## Common Method

All channel-group operations are performed with `channel_registration`.

```ruby
channel_registration(
    action:  :add | :get | :remove,
    channels:         channels,        # String | Symbol
    channel_groups:   channel_groups,  # String | Symbol
    http_sync:        http_sync,       # Boolean (default false)
    callback:         callback         # Proc/Lambda (1 arg – envelope)
)
```

• `http_sync: true` – synchronous; returns Envelope(s).  
• `http_sync: false` – asynchronous; returns a future whose `.value` is the Envelope.  
• `callback` executes once per Envelope (async only).

Maximum channels per call: **200**.

---

## Add Channels to a Group

```ruby
# Signature
channel_registration(
    action: :add,
    channels: channels,
    channel_groups: channel_groups,
    http_sync: http_sync,
    callback: callback
)
```

### Example

```ruby
require 'pubnub'

# Async
pubnub.channel_registration(
  action: :add, channel: 'my_channel', channel_group: :somegroup
) do |envelope|
  puts envelope.status[:error] ? "Async Error" : "Async Success"
end

# Sync
envelopes = pubnub.channel_registration(
  action: :add, channel: 'my_channel', channel_group: :somegroup, http_sync: true
)
```

### Response

```
#
@status = {
    :code      => 200,
    :category  => :ack,
    :error     => false
}
>
```

---

## List Channels in a Group

```ruby
# Signature
channel_registration(
    action: :get,
    channel_group: group,
    http_sync: http_sync,
    callback: callback
)
```

### Example

```ruby
pubnub.channel_registration(action: :get, group: 'family') do |envelope|
  pp envelope
end
```

### Response

```
#
@result = {
    :data => {
        "channels" => ["ben"],
        "group"    => "family"
    }
}
@status = { :code => 200 }
>
```

---

## Remove Channels from a Group

```ruby
# Signature
channel_registration(
    action: :remove,
    channels: channels,
    channel_groups: group,
    http_sync: http_sync,
    callback: callback
)
```

### Example

```ruby
pubnub.channel_registration(
  action: :remove, channel: 'son', group: 'family'
) do |envelope|
  pp envelope
end
```

### Response

```
#
@status = {
    :code     => 200,
    :category => :ack,
    :error    => false
}
>
```

---

## Delete a Channel Group

```ruby
# Signature
channel_registration(
    action: :remove,
    channel_groups: channel_groups,
    http_sync: http_sync,
    callback: callback
)
```

### Example

```ruby
pubnub.channel_registration(
  action: :remove, channel_group: 'family'
) do |envelope|
  pp envelope
end
```

### Response

```
#
@status = {
    :code     => 200,
    :category => :ack,
    :error    => false
}
>
```

_Last updated: Mar 31 2025_