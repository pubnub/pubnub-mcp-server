# PubNub Ruby SDK – App Context (Objects)  
All methods are asynchronous by default (`http_sync: false`). Set `http_sync: true` to run synchronously. Pass a `callback:` lambda to receive the `Envelope`.  

---

## User (UUID)  

### Get metadata for all users
```
get_all_uuid_metadata(
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* sort (Array) – `id`, `name`, `updated` with optional `asc|desc`.  
* include (Hash, default `{ count: true }`) – `count`, `custom`, `type`, `status`.  
* filter (String) – expression; see filtering docs.  
* start/end (String) – pagination cursors; `start` = forward, `end` = backward.  
* limit (Integer, ≤ 100, default 100).  
* http_sync (Boolean) – sync/async.  
* callback (Lambda).  

Sample
```
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
```
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

### Get user metadata
```
get_uuid_metadata(
    uuid: uuid,
    include: include,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* include (Hash, default `{ custom: true }`) – `custom`, `type`, `status`.  
* http_sync, callback – see above.

```
pubnub.get_uuid_metadata(include: { custom: true }) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :id => "mg",
            :name => "magnum",
            ...
```

### Set user metadata
```
set_uuid_metadata(
    uuid: uuid,
    metadata: metadata,
    include: include,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* metadata (Hash) – `name`, `externalId`, `profileUrl`, `email`, `custom`, `type`, `status`.  
* include (Hash, default `{ custom: true }`).  
* http_sync, callback – see above.  

```
pubnub.set_uuid_metadata(
    uuid: 'mg',
    metadata: { name: 'magnum', custom: { XXX: 'YYYY' } },
    include: { custom: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :id => "mg",
            :name => "magnum",
            ...
```

### Remove user metadata
```
remove_uuid_metadata(
    uuid: uuid,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* http_sync, callback – see above.  

```
pubnub.remove_uuid_metadata(uuid: 'mg') do |envelope|
    puts envelope
end
```
Response
```
#
    @status = {
        :code => 200,
        :operation => :remove_uuid_metadata,
        :category => :ack,
        :error => false,
        # [...]
    },
...
```

---

## Channel  

### Get metadata for all channels
```
get_all_channels_metadata(
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* Parameters identical to “Get metadata for all users,” but relate to channels.

```
pubnub.get_all_channels_metadata(
    limit: 5,
    include: { custom: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :metadata => [
                {
                    :id => "rb_channel1",
                    :name => "some_name",
                    ...
```

### Get channel metadata
```
get_channel_metadata(
    channel: channel,
    include: include,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* include (Hash, default `{ custom: true }`) – `custom`, `type`, `status`.  
* http_sync, callback – see above.

```
pubnub.get_channel_metadata(
    channel: 'channel',
    include: { custom: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :id => "channel",
            :name => "some_name",
            ...
```

### Set channel metadata
```
set_channel_metadata(
    channel: channel,
    metadata: metadata,
    include: include,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* metadata (Hash) – `name`, `information`, `custom`, `type`, `status`.  
* include (Hash, default `{ custom: true }`).  

```
pubnub.set_channel_metadata(
    channel: 'channel',
    metadata: { name: 'some_name', custom: { XXX: 'YYYY' } }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :id => "channel",
            :name => "some_name",
            ...
```

Iterative example (full script):
```
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
...
```

### Remove channel metadata
```
remove_channel_metadata(
    channel: channel,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* http_sync, callback – see above.

```
pubnub.remove_channel_metadata(channel: 'channel') do |envelope|
    puts envelope
end
```
Response
```
#
    @status = {
        :code => 200,
        :operation => :remove_channel_metadata,
        :category => :ack,
        :error => false,
        # [...]
    },
...
```

---

## Channel memberships (per-UUID)

### Get channel memberships
```
get_memberships(
    uuid: uuid,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* channels-list options in `include` – `count`, `custom`, `channel_metadata`, `channel_custom`, `status`, `type`, `channel_type`, `channel_status`.  
* Remaining params match earlier list.

```
pubnub.get_memberships(
    uuid: 'mg',
    include: { count: true, custom: true, channel_metadata: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :memberships => [
                {
                    :channel => {
                        :id => "channel-identifier1",
                        :name => "Channel1",
                        ...
```

### Set channel memberships
```
set_memberships(
    uuid: uuid,
    channels: channels,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* channels (Array of Hashes) – each `{ channel: 'name', custom: {...}, type:, status: }`.  
* include options identical to “Get channel memberships”.

```
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
```
#
    @result = {
        :data => {
            :memberships => [
                {
                    :channel => { :id => "channel-1", ... },
                    :custom => nil,
...
```

### Remove channel memberships
```
remove_memberships(
    uuid: uuid,
    channels: channels,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* uuid (String, default client UUID).  
* channels (Array of channel names).  
* include – `count`, `custom`, `channel_metadata`, `channel_custom`.

```
pubnub.remove_memberships(
    uuid: 'mg',
    channels: [ 'channel-1' ],
    include: { custom: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :memberships => [
                {
                    :channel => { :id => "channel-2", ... },
...
```

---

## Channel members (per-Channel)

### Get channel members
```
get_channel_members(
    channel: channel,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* include – `count`, `custom`, `uuid_metadata`, `uuid_custom`, `status`, `type`, `uuid_status`, `uuid_type`.  

```
pubnub.get_channel_members(
    channel: 'channel-1',
    include: { count: true, custom: true, uuid_metadata: true }
) do |envelope|
    puts envelope
end
```
Response
```
#
    @result = {
        :data => {
            :members => [
                {
                    :uuid => {
                        :id => "uuid-identifier1",
                        :name => "uuid1",
                        ...
```

### Set channel members
```
set_channel_members(
    channel: channel,
    uuids: uuids,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* uuids (Array of Hashes) – each `{ uuid: 'id', custom: {...}, type:, status: }`.  
* include options identical to “Get channel members”.

```
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
```
#
    @result = {
        :data => {
            :members=>[
                {
                    :uuid => { :id => "mg2", ... },
...
```

### Remove channel members
```
remove_channel_members(
    channel: channel,
    uuids: uuids,
    sort: sort,
    include: include,
    filter: filter,
    start: start,
    end: end,
    limit: limit,
    http_sync: http_sync,
    callback: callback
)
```
* channel (String).  
* uuids (Array of UUID strings).  
* include – `count`, `custom`, `uuid_metadata`, `uuid_custom`.

```
pubnub.remove_channel_members(
    channel: 'channel',
    uuids: [ 'mg1' ],
    include: { custom: true }
) do |envelope|
    puts envelope
end
```
Response
```
#**
    @result = {
        :data => {
            :members=>[
                {
                    :uuid => { :id => "uuid-identifier", ... },
...
```

_Last updated Jul 15 2025_