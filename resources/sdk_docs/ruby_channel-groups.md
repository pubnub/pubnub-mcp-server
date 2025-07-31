# Channel Groups – Ruby SDK

Prerequisite: Stream Controller add-on must be enabled for the key (Admin Portal).

---

## Add channels to a group

### Method

```ruby
`channel_registration(
    action: :add,
    channels: channels,
    channel_groups: channel_groups,
    http_sync: http_sync,
    callback: callback
)`
```

Parameters  
* `action` (Symbol) – **:add**.  
* `channels` (String/Symbol) – Channel(s) to add. Max 200 per call.  
* `channel_groups` (String/Symbol) – Target group(s).  
* `http_sync` (Boolean, default false) – If true returns envelope(s) synchronously; otherwise returns a future.  
* `callback` (Proc) – Executed per envelope in async mode; ignored when `http_sync: true`.

### Example

```ruby
`require 'pubnub'

def add_channels_to_group(pubnub)
  # async
  pubnub.channel_registration(action: :add, channel: 'my_channel', channel_group: :somegroup) do |envelope|
    puts(envelope.status[:error] ? "Async Error" : "Async Success")
  end

  # sync
  envelopes = pubnub.channel_registration(
               action: :add,
               channel: 'my_channel',
               channel_group: :somegroup,
               http_sync: true)
end`
```

### Response

```ruby
`#
  @status = {
      :code => 200,
      :category => :ack,
      :error => false,
  }
>`
```

---

## List channels in a group

### Method

```ruby
`channel_registration(
    action: :get,
    channel_group: group,
    http_sync: http_sync,
    callback: callback
)`
```

Parameters  
* `action` (Symbol) – **:get**.  
* `channel_group` (String/Symbol) – Group to inspect.  
* `http_sync`, `callback` – Same semantics as above.

### Example

```ruby
`pubnub.channel_registration(action: :get, group: 'family') do |envelope|
    pp envelope
end`
```

### Response

```ruby
`#
  @result = {
      :data => {
          "channels" => ["ben"],
          "group"    => "family"
      }
  }
  @status = { :code => 200 }
>`
```

---

## Remove channels from a group

### Method

```ruby
`channel_registration(
    action: :remove,
    channels: channels,
    channel_groups: group,
    http_sync: http_sync,
    callback: callback
)`
```

Parameters  
* `action` (Symbol) – **:remove**.  
* `channels` (String/Symbol) – Channel(s) to remove.  
* `channel_groups` (String/Symbol) – Group name.  
* `http_sync`, `callback` – Same semantics as above.

### Example

```ruby
`pubnub.channel_registration(action: :remove, channel: 'son', group: 'family') do |envelope|
    pp envelope
end`
```

### Response

```ruby
`#
  @status = {
      :code => 200,
      :category => :ack,
      :error => false,
  }
>`
```

---

## Delete a channel group

### Method

```ruby
`channel_registration(
    action: :remove,
    channel_groups: channel_groups,
    http_sync: http_sync,
    callback: callback
)`
```

Parameters  
* `action` (Symbol) – **:remove**.  
* `channel_groups` (String/Symbol) – Group(s) to delete.  
* `http_sync`, `callback` – Same semantics as above.

### Example

```ruby
`pubnub.channel_registration(action: :remove, channel_group: 'family') do |envelope|
    pp envelope
end`
```

### Response

```ruby
`#**
  @status = {
      :code => 200,
      :category => :ack,
      :error => false,
  }
>`
```

_Last updated: Jul 15 2025_