# Message Actions API — Ruby SDK (Condensed)

Add, remove, and fetch actions (reactions, receipts, custom metadata) on published messages.  
Message Persistence **must be enabled** on the key (Admin Portal ➜ Key ➜ Add-ons).

---

## Add Message Action

```
add_message_action(
  channel:             channel,            # String (required)
  type:                type,               # String, ≤15 chars (required)
  value:               value,              # String (required)
  message_timetoken:   message_timetoken,  # Integer (required)
  http_sync:           http_sync,          # Boolean (default: false)
  callback:            callback            # Proc/Lambda
)
```

Parameters  
• `channel` – Channel that stores the **message** to update.  
• `type` – Feature represented by this action (“emotion”, “read”, etc.).  
• `value` – Value associated with `type` (“smile”, “seen”, ...).  
• `message_timetoken` – Timetoken of the target message.  
• `http_sync` – `true` = synchronous, returns array of envelopes.  
• `callback` – Invoked per envelope (async returns `Future`).

### Example

```ruby
require 'pubnub'

def add_message_action(pubnub)
  pubnub.add_message_action(
    channel: 'chat',
    type: 'emotion',
    value: 'smile',
    message_timetoken: 16701562382648731
  ) do |env|
    puts env
  end
end
```

### Response

```
#
@result = {
  :data => {
    :type             => "emotion",
    :value            => "smile",
    :uuid             => "sender-uuid",
    :action_timetoken => 16701656660127890,
    :message_timetoken=> 16701562382648731
  }
},
@status = { :code => 200 }
>
```

---

## Remove Message Action

```
remove_message_action(
  channel:            channel,             # String (required)
  message_timetoken:  message_timetoken,   # Integer (required)
  action_timetoken:   action_timetoken,    # Integer (required)
  http_sync:          http_sync,           # Boolean (default: false)
  callback:           callback             # Proc/Lambda
)
```

Parameters  
• `channel` – Channel that stores the **message**.  
• `message_timetoken` – Timetoken of the message containing the action.  
• `action_timetoken` – Timetoken of the action to remove.  
• `http_sync`, `callback` – Same behavior as in Add.

### Example

```ruby
pubnub.remove_message_action(
  channel:           'chat',
  message_timetoken: 16701562382648731,
  action_timetoken:  16701656660127890
) { |env| puts env }
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

## Get Message Actions

```
get_message_actions(
  channel:   channel,   # String (required)
  start:     start,     # Integer (optional)  Returns <  start
  end:       end,       # Integer (optional)  Returns >= end
  limit:     limit,     # Integer (optional)
  http_sync: http_sync, # Boolean (default: false)
  callback:  callback   # Proc/Lambda
)
```

Parameters  
• `channel` – Channel to query.  
• `start` / `end` – Time range filters (see comments above).  
• `limit` – Max actions returned.  
• `http_sync`, `callback` – Same behavior as in Add.

### Example

```ruby
pubnub.get_message_actions(
  channel: 'chat',
  start:   16701562382648731,
  end:     16701562382348728
) { |env| puts env }
```

### Response

```
#
@result = {
  :data => {
    :message_actions => [
      {
        :type             => "emotion_type_2",
        :uuid             => "sender-uuid-1",
        :value            => "surprised",
        :message_timetoken=> 16703307481706612,
        :action_timetoken => 16703307649086202
      },
      {
        :type             => "emotion_type_3",
        :uuid             => "sender-uuid-2",
        :value            => "lol",
...
```

_Last updated: Jun 10 2025_