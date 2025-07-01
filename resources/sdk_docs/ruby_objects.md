# PubNub Ruby SDK – App Context (Objects)  
Concise reference with every method signature, parameters, usage sample, and response payload preserved. All code blocks are unchanged.

---

## Common notes  
* All `http_sync`, `callback` semantics are identical across methods (async by default, returns `Concurrent::IVar` future; set `http_sync: true` for blocking call).  
* Maximum page size: `limit 100`.  
* Sorting fields: `id`, `name`, `updated` – append `asc`/`desc`.  
* Filtering uses the App Context filtering language.  

---

## User (UUID) Metadata

### Get All Users
```ruby
get_all_uuid_metadata(
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
Parameters  
• `sort` Array – sort criteria.  
• `include` Hash (default `{ count: true }`) – `count | custom | type | status`.  
• `filter` String – filtering expression.  
• `start`, `end` String – pagination cursors.  
• `limit` Integer (default 100).  

Basic usage  
```ruby
require 'pubnub'

def get_all_uuid_metadata(pubnub)
  pubnub.get_all_uuid_metadata(
    limit: 5,
    include: { custom: true }
  ) do |envelope|
    if envelope.status[:error]
      puts "Error fetching UUID metadata: #{envelope.status[:error]}"
    else
      envelope.result[:data][:metadata].each do |uuid_data|
        puts "UUID: #{uuid_data[:id]}"
        puts "Name: #{uuid_data[:name]}"
        puts "Custom: #{uuid_data[:custom]}"
        puts "Updated: #{uuid_data[:updated]}"
      end
    end
  end
end
```

Response  
```ruby
#
@result = {
  :data => {
    :metadata => [
      {
        :id => "mg",
        :name => "magnum",
        :externalId => nil,
        :profileUrl => nil,
        :email => nil,
        :custom => { "XXX" => "YYYY" },
        :updated => Date>,
        :eTag => "Ad2eyIWXwJzBqAE"
      }
    ],
...
```

---

### Get User Metadata
```ruby
get_uuid_metadata(
    uuid: uuid,
    include: include,
    http_sync: http_sync,
    callback:  callback
)
```
• `uuid` String – target UUID (default client uuid).  
• `include` Hash `{ custom: true | type | status }`.

Basic usage  
```ruby
pubnub.get_uuid_metadata(include: { custom: true }) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :id => "mg",
    :name => "magnum",
    :externalId => nil,
    :profileUrl => nil,
    :email => nil,
    :custom => { "XXX" => "YYYY" },
    :updated => Date>,
    :eTag => "Ad2eyIWXwJzBqAE"
  }
},
@status = { :code => 200 }
...
```

---

### Set User Metadata
```ruby
set_uuid_metadata(
    uuid: uuid,
    metadata: metadata,
    include: include,
    http_sync: http_sync,
    callback:  callback
)
```
• `metadata` Hash – `name | externalId | profileUrl | email | custom | type | status`.  
Custom object overwrites previous value.

Basic usage  
```ruby
pubnub.set_uuid_metadata(
  uuid: 'mg',
  metadata: { name: 'magnum', custom: { XXX: 'YYYY' } },
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :id => "mg",
    :name => "magnum",
    :externalId => nil,
    :profileUrl => nil,
    :email => nil,
    :custom => { "XXX" => "YYYY" },
    :updated => Date>,
    :eTag => "Ad2eyIWXwJzBqAE"
  }
},
@status = { :code => 200 }
...
```

---

### Remove User Metadata
```ruby
remove_uuid_metadata(
    uuid: uuid,
    http_sync: http_sync,
    callback:  callback
)
```
Basic usage  
```ruby
pubnub.remove_uuid_metadata(uuid: 'mg') do |envelope|
  puts envelope
end
```
Response  
```ruby
#
@status = {
  :code => 200,
  :operation => :remove_uuid_metadata,
  :category  => :ack,
  :error     => false,
  # [...]
},
# [...]
```

---

## Channel Metadata

### Get All Channels
```ruby
get_all_channels_metadata(
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`include` defaults to `{ count: true }` and supports `count | custom | type | status`.

Basic usage  
```ruby
pubnub.get_all_channels_metadata(
  limit: 5,
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :metadata => [
      {
        :id => "rb_channel1",
        :name => "some_name",
        :description => nil,
        :custom => { "XXX" => "YYYY" },
        :updated => Date>,
        :eTag => "AZTUtcvx6NDGLQ"
      },
      # {...}
    ],
    :totalCount => 2,
...
```

---

### Get Channel Metadata
```ruby
get_channel_metadata(
    channel: channel,
    include: include,
    http_sync: http_sync,
    callback:  callback
)
```
`include` `{ custom: true | type | status }`.

Basic usage  
```ruby
pubnub.get_channel_metadata(
  channel: 'channel',
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :id => "channel",
    :name => "some_name",
    :description => nil,
    :custom => { "XXX" => "YYYY" },
    :updated => Date>,
    :eTag => "AZTUtcvx6NDGLQ"
  }
},
@status = { :code => 200 }
...
```

---

### Set Channel Metadata
```ruby
set_channel_metadata(
    channel: channel,
    metadata: metadata,
    include: include,
    http_sync: http_sync,
    callback:  callback
)
```
`metadata` keys: `name | information | custom | type | status`.  
Custom object overwrites previous value.

Basic usage  
```ruby
pubnub.set_channel_metadata(
  channel: 'channel',
  metadata: { name: 'some_name', custom: { XXX: 'YYYY' } }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :id => "channel",
    :name => "some_name",
    :description => nil,
    :custom => { "XXX" => "YYYY" },
    :updated => Date>,
    :eTag => "AZTUtcvx6NDGLQ"
  }
},
@status = { :code => 200 }
...
```

Iterative update example (unchanged):
```ruby
require 'pubnub'
require 'json'

pubnub = Pubnub.new(
  publish_key: 'demo',
  subscribe_key: 'demo',
  uuid: 'example'
)

channel = 'demo_example'
help_string = HELP
  To exit type '/exit'
  To show the current object type '/show'
  To show this help type '/help'
HELP
# ...
```

---

### Remove Channel Metadata
```ruby
remove_channel_metadata(
    channel: channel,
    http_sync: http_sync,
    callback:  callback
)
```
Basic usage  
```ruby
pubnub.remove_channel_metadata(channel: 'channel') do |envelope|
  puts envelope
end
```
Response  
```ruby
#
@status = {
  :code => 200,
  :operation => :remove_channel_metadata,
  :category  => :ack,
  :error     => false,
  # [...]
},
# [...]
```

---

## Channel Memberships (user → channels)

### Get Memberships
```ruby
get_memberships(
    uuid: uuid,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`include` default `{ count: true }` – `count | custom | channel_metadata | channel_custom | status | type | channel_type | channel_status`.

Basic usage  
```ruby
pubnub.get_memberships(
  uuid: 'mg',
  include: { count: true, custom: true, channel_metadata: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :memberships => [
      {
        :channel => {
          :id => "channel-identifier1",
          :name => "Channel1",
          :description => nil,
          # {...}
        },
        :custom => { "membership-custom" => "custom-data-1" },
        :updated => Date>,
        :eTag => "AYbepevg39XeDA"
      },
...
```

---

### Set Memberships
```ruby
set_memberships(
    uuid: uuid,
    channels: channels,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`channels` array items: `{ channel: 'ch', custom: {}, type: '', status: '' }`.

Basic usage  
```ruby
pubnub.set_memberships(
  uuid: 'mg',
  channels: [
    { channel: 'channel-1' }
  ],
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :memberships => [
      {
        :channel => { :id => "channel-1", # {...} },
        :custom  => nil,
        :updated => Date>,
        :eTag    => "AY39mJKK//C0VA"
      }
    ],
    :totalCount => 1,
...
```

---

### Remove Memberships
```ruby
remove_memberships(
    uuid: uuid,
    channels: channels,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`channels` – array of channel IDs.

Basic usage  
```ruby
pubnub.remove_memberships(
  uuid: 'mg',
  channels: [ 'channel-1' ],
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :memberships => [
      {
        :channel => { :id => "channel-2", # {...} },
        :custom  => nil,
        :updated => Date>,
        :eTag    => "AY39mJKK//C0VA"
      }
    ],
    :totalCount => 1,
...
```

---

## Channel Members (channel → users)

### Get Channel Members
```ruby
get_channel_members(
    channel: channel,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`include` default `{ count: true }` – `count | custom | uuid_metadata | uuid_custom | status | type | uuid_status | uuid_type`.

Basic usage  
```ruby
pubnub.get_channel_members(
  channel: 'channel-1',
  include: { count: true, custom: true, uuid_metadata: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :members => [
      {
        :uuid => {
          :id => "uuid-identifier1",
          :name => "uuid1",
          :externalId => nil,
          :profileUrl => nil,
          :email => nil,
          :updated => Date>,
          :eTag => "AYfwuq+u+4C01gE",
          # {...}
        },
...
```

---

### Set Channel Members
```ruby
set_channel_members(
    channel: channel,
    uuids: uuids,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
`uuids` items: `{ uuid: 'uid', custom: {}, type: '', status: '' }`.

Basic usage  
```ruby
pubnub.set_channel_members(
  channel: 'channel',
  uuids: [
    { uuid: 'uuid1' }
  ],
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :members=>[
      {
        :uuid => { :id => "mg2", # {...} },
        :custom => nil,
        :updated=>Date>,
        :eTag => "AY39mJKK//C0VA"
      }
    ],
    :totalCount => 1,
...
```

---

### Remove Channel Members
```ruby
remove_channel_members(
    channel: channel,
    uuids: uuids,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end:   end,
    limit: limit,
    http_sync: http_sync,
    callback:  callback
)
```
Basic usage  
```ruby
pubnub.remove_channel_members(
  channel: 'channel',
  uuids: [ 'mg1' ],
  include: { custom: true }
) do |envelope|
  puts envelope
end
```

Response  
```ruby
#
@result = {
  :data => {
    :members=>[
      {
        :uuid => { :id => "uuid-identifier", # {...} },
        :custom => nil,
        :updated => Date>,
        :eTag => "AY39mJKK//C0VA"
      }
    ],
    :totalCount => 1,
...
```

_Last updated Mar 31 2025_