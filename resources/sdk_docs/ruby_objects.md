# App Context API for Ruby SDK

Serverless storage for user, channel, and membership metadata. PubNub emits real-time events when object data is set, updated, or removed. Setting identical data does not trigger events.

## User

Manage UUID metadata: list, fetch, set, and remove.

### Get metadata for all users

Get a paginated list of UUID metadata with optional filters and sorting.

Methods

```
`1get_all_uuid_metadata(  
2    sort: sort,  
3    include: include,  
4    filter: filter,  
5    start: start,  
6    end: end,  
7    limit: limit,  
8    http_sync: http_sync,  
9    callback: callback  
10)  
`
```

Parameters
- sort (Type: Array, Default: n/a): Sort by id, name, updated. Use asc or desc to specify direction.
- include (Type: Object, Default: { count: true }): Include extra fields:
  - count: number of UUIDs with metadata.
  - custom: include custom fields set on UUID metadata.
  - type: include metadata type.
  - status: include metadata status.
- filter (Type: String, Default: n/a): Filter expression. See /docs/general/metadata/filtering.
- start (Type: String, Default: n/a): Forward pagination cursor.
- end (Type: String, Default: n/a): Backward pagination cursor. Ignored if start is provided.
- limit (Type: Integer, Default: 100, Max: 100): Number of objects to return.
- http_sync (Type: Boolean, Default: false): Async by default (returns future). When true, returns array of envelopes (sync returns Envelope).
- callback (Type: Lambda, Default: n/a): Called for each envelope. For async, call value on future to retrieve Envelope.

Sample code

##### Reference code

```
1require 'pubnub'  
2
  
3def get_all_uuid_metadata(pubnub)  
4  pubnub.get_all_uuid_metadata(  
5    limit: 5,  
6    include: { custom: true }  
7  ) do |envelope|  
8    if envelope.status[:error]  
9      puts "Error fetching UUID metadata: #{envelope.status[:error]}"  
10    else  
11      envelope.result[:data][:metadata].each do |uuid_data|  
12        puts "UUID: #{uuid_data[:id]}"  
13        puts "Name: #{uuid_data[:name]}"  
14        puts "Custom: #{uuid_data[:custom]}"  
15        puts "Updated: #{uuid_data[:updated]}"  
16      end  
17    end  
18  end  
19end  
20
  
21def main  
22  # Configuration for PubNub instance  
23  pubnub = Pubnub.new(  
24    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
25    user_id: 'myUniqueUserId'  
26  )  
27
  
28  # Get all UUID metadata  
29  get_all_uuid_metadata(pubnub)  
30  sleep 1 # Allow time for the async operation to complete  
31end  
32
  
33if __FILE__ == $0  
34  main  
35end  

```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :metadata => [  
5                {  
6                    :id => "mg",  
7                    :name => "magnum",  
8                    :externalId => nil,  
9                    :profileUrl => nil,  
10                    :email => nil,  
11                    :custom => { "XXX" => "YYYY" },  
12                    :updated => Date>,  
13                    :eTag => "Ad2eyIWXwJzBqAE"  
14                }  
15            ],  
16            :totalCount => 1,  
17            :next => "MQ",  
18            :prev => nil  
19        }  
20    },  
21    @status = {  
22        :code => 200  
23    }  
24>  
`
```

### Get user metadata

Fetch metadata for a single UUID.

Methods

```
`1get_uuid_metadata(  
2    uuid: uuid,  
3    include: include,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): UUID to fetch (defaults to configured client uuid).
- include (Type: Object, Default: { custom: true }): Include fields:
  - custom, type, status.
- http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.get_uuid_metadata(include: { custom: true }) do |envelope|  
2    puts envelope  
3end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :id => "mg",  
5            :name => "magnum",  
6            :externalId => nil,  
7            :profileUrl => nil,  
8            :email => nil,  
9            :custom => { "XXX" => "YYYY" },  
10            :updated => Date>,  
11            :eTag => "Ad2eyIWXwJzBqAE"  
12        }  
13    },  
14    @status = {  
15        :code => 200  
16    }  
17>  
`
```

### Set user metadata

Create or update metadata for a UUID. Custom is fully overwritten (no partial merge).

Methods

```
`1set_uuid_metadata(  
2    uuid: uuid,  
3    metadata: metadata,  
4    include: include,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): Target UUID.
- metadata (Type: Object, Required): Fields to set:
  - name, externalId, profileUrl, email, custom, type, status. Note: filtering doesn't support custom properties.
- include (Type: Object, Default: { custom: true }): Include fields:
  - custom.
- http_sync, callback: Same semantics as above.

API limits
- See /docs/sdks/rest-api/set-user-metadata.

Sample code

```
`1pubnub.set_uuid_metadata(  
2    uuid: 'mg',  
3    metadata: { name: 'magnum', custom: { XXX: 'YYYY' } },  
4    include: { custom: true }  
5) do |envelope|  
6    puts envelope  
7end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :id => "mg",  
5            :name => "magnum",  
6            :externalId => nil,  
7            :profileUrl => nil,  
8            :email => nil,  
9            :custom => { "XXX" => "YYYY" },  
10            :updated => Date>,  
11            :eTag => "Ad2eyIWXwJzBqAE"  
12        }  
13    },  
14    @status = {  
15        :code => 200  
16    }  
17>  
`
```

### Remove user metadata

Delete metadata for a UUID.

Methods

```
`1remove_uuid_metadata(  
2    uuid: uuid,  
3    http_sync: http_sync,  
4    callback: callback  
5)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): UUID to remove metadata for.
- http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.remove_uuid_metadata(uuid: 'mg') do |envelope|  
2    puts envelope  
3end  
`
```

Response

```
`1#  
2    @status = {  
3        :code => 200,  
4        :operation => :remove_uuid_metadata,  
5        :category => :ack,  
6        :error => false,  
7        # [...]  
8    },  
9    # [...]  
10>  
`
```

## Channel

Manage channel metadata: list, fetch, set, and remove.

### Get metadata for all channels

Get a paginated list of channel metadata with optional filters and sorting.

Methods

```
`1get_all_channels_metadata(  
2    sort: sort,  
3    include: include,  
4    filter: filter,  
5    start: start,  
6    end: end,  
7    limit: limit,  
8    http_sync: http_sync,  
9    callback: callback  
10)  
`
```

Parameters
- sort (Type: Array, Default: n/a): Sort by id, name, updated. Use asc or desc.
- include (Type: Object, Default: { count: true }): Include fields:
  - count, custom, type, status.
- filter (Type: String, Default: n/a): Filter expression. See /docs/general/metadata/filtering.
- start, end, limit, http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.get_all_channels_metadata(  
2    limit: 5,  
3    include: { custom: true }  
4) do |envelope|  
5    puts envelope  
6end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :metadata => [  
5                {  
6                    :id => "rb_channel1",  
7                    :name => "some_name",  
8                    :description => nil,  
9                    :custom => { "XXX" => "YYYY" },  
10                    :updated => Date>,  
11                    :eTag => "AZTUtcvx6NDGLQ"  
12                },  
13                # {...}  
14            ],  
15            :totalCount => 2,  
16            :next => "MQ",  
17            :prev => nil  
18        }  
19    },  
20    @status = {  
21        :code => 200  
22    }  
23>  
`
```

### Get channel metadata

Fetch metadata for a single channel.

Methods

```
`1get_channel_metadata(  
2    channel: channel,  
3    include: include,  
4    http_sync: http_sync,  
5    callback: callback  
6)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- include (Type: Object, Default: { custom: true }): Include fields:
  - custom, type, status.
- http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.get_channel_metadata(  
2    channel: 'channel',  
3    include: { custom: true }  
4) do |envelope|  
5    puts envelope  
6end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :id => "channel",  
5            :name => "some_name",  
6            :description => nil,  
7            :custom => { "XXX" => "YYYY" },  
8            :updated => Date>,  
9            :eTag => "AZTUtcvx6NDGLQ"  
10        }  
11    },  
12    @status = {  
13        :code => 200  
14    }  
15>  
`
```

### Set channel metadata

Create or update metadata for a channel. Custom is fully overwritten (no partial merge).

Methods

```
`1set_channel_metadata(  
2    channel: channel,  
3    metadata: metadata,  
4    include: include,  
5    http_sync: http_sync,  
6    callback: callback  
7)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- metadata (Type: Object, Required): Fields to set:
  - name, information (description), custom, type, status. Note: filtering doesn't support custom properties.
- include (Type: Object, Default: { custom: true }): Include fields:
  - custom.
- http_sync, callback: Same semantics as above.

API limits
- See /docs/sdks/rest-api/set-channel-metadata.

Sample code

```
`1pubnub.set_channel_metadata(  
2    channel: 'channel',  
3    metadata: { name: 'some_name', custom: { XXX: 'YYYY' } }  
4) do |envelope|  
5    puts envelope  
6end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :id => "channel",  
5            :name => "some_name",  
6            :description => nil,  
7            :custom => { "XXX" => "YYYY" },  
8            :updated => Date>,  
9            :eTag => "AZTUtcvx6NDGLQ"  
10        }  
11    },  
12    @status = {  
13        :code => 200  
14    }  
15>  
`
```

Other examples

##### Iteratively update existing metadata

```
1require 'pubnub'  
2require 'json'  
3
  
4pubnub = Pubnub.new(  
5  publish_key: 'demo',  
6  subscribe_key: 'demo',  
7  uuid: 'example'  
8)  
9
  
10channel = 'demo_example'  
11help_string = HELP  
12  To exit type '/exit'  
13  To show the current object type '/show'  
14  To show this help type '/help'  
15HELP  
16
  
17puts "We're setting the channel's #{channel} additional info. \n#{help_string}\n"  
18
  
19puts 'Enter the channel name:'  
20name = gets.chomp  
21puts 'Enter the channel description:'  
22description = gets.chomp  
23
  
24# Setting the basic channel info  
25pubnub.set_channel_metadata(  
26  channel: channel,  
27  metadata: { name: name, information: description }  
28) do |envelope|  
29  puts "The channel has been created with name and description.\n" if envelope.status[:code] == 200  
30end  
31
  
32# We start to iterate over the custom fields  
33loop do  
34  # First we have to get the current object to know what fields are already set  
35  current_object = nil  
36  pubnub.get_channel_metadata(  
37    channel: channel,  
38    include: { custom: true }  
39  ) do |envelope|  
40    current_object = envelope.result[:data] if envelope.status[:code] == 200  
41  end  
42
  
43  # Ask for new data  
44  puts 'Enter the field name:'  
45  field_name = gets.chomp  
46  break if field_name == '/exit'  
47
  
48  if field_name == '/show'  
49    puts JSON.pretty_generate(current_object)  
50    puts "\n"  
51    next  
52  end  
53
  
54  if field_name == '/help'  
55    puts help_string  
56    next  
57  end  
58
  
59  puts 'Enter the field value:'  
60  field_value = gets.chomp  
61
  
62  custom = current_object[:custom] || {}  
63
  
64  if custom.key?(field_name)  
65    puts "Field #{field_name} already has a value. Overwrite? (y/n):"  
66    confirm = gets.chomp.downcase  
67    until %w[y n].include?(confirm)  
68      puts "Please enter 'y' or 'n':"  
69      confirm = gets.chomp.downcase  
70    end  
71
  
72    if confirm == 'n'  
73      puts "Object will not be updated.\n"  
74      next  
75    else  
76      custom[field_name] = field_value  
77    end  
78  else  
79    custom[field_name] = field_value  
80  end  
81
  
82  # Writing the updated object back to the server  
83  pubnub.set_channel_metadata(  
84    channel: channel,  
85    metadata: { custom: custom, name: current_object[:name], information: current_object[:description] }  
86  ) do |envelope|  
87    puts "Object has been updated.\n" if envelope.status[:code] == 200  
88  end  
89end  

```

### Remove channel metadata

Delete metadata for a channel.

Methods

```
`1remove_channel_metadata(  
2    channel: channel,  
3    http_sync: http_sync,  
4    callback: callback  
5)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.remove_channel_metadata(channel: 'channel') do |envelope|  
2    puts envelope  
3end  
`
```

Response

```
`1#  
2    @status = {  
3        :code => 200,  
4        :operation => :remove_channel_metadata,  
5        :category => :ack,  
6        :error => false,  
7        # [...]  
8    },  
9    # [...]  
10>  
`
```

## Channel memberships

Manage channel memberships for a UUID.

### Get channel memberships

List channel memberships for a UUID.

Methods

```
`1get_memberships(  
2    uuid: uuid,  
3    sort: sort,  
4    include: include,  
5    filter: filter,  
6    start: start,  
7    end: end,  
8    limit: limit,  
9    http_sync: http_sync,  
10    callback: callback  
11)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): Target UUID.
- sort (Type: Array, Default: n/a): Sort by id, name, updated. Use asc or desc.
- include (Type: Object, Default: { count: true }): Include fields:
  - count, custom, channel_metadata, channel_custom, status, type, channel_type, channel_status.
- filter (Type: String, Default: n/a): Filter expression. See /docs/general/metadata/filtering.
- start, end, limit, http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.get_memberships(  
2    uuid: 'mg',  
3    include: { count: true, custom: true, channel_metadata: true }  
4) do |envelope|  
5    puts envelope  
6end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :memberships => [  
5                {  
6                    :channel => {  
7                        :id => "channel-identifier1",  
8                        :name => "Channel1",  
9                        :description => nil,  
10                        # {...}  
11                    },  
12                    :custom => { "membership-custom" => "custom-data-1" },  
13                    :updated => Date>,  
14                    :eTag => "AYbepevg39XeDA"  
15                },  
16                # {...}  
17            ],  
18            :totalCount => 2,  
19            :next => "MQ",  
20            :prev => nil  
21        }  
22    },  
23    @status = {  
24        :code => 200  
25    }  
26>  
`
```

### Set channel memberships

Replace or add memberships for a UUID.

Methods

```
`1set_memberships(  
2    uuid: uuid,  
3    channels: channels,  
4    sort: sort,  
5    include: include,  
6    filter: filter,  
7    start: start,  
8    end: end,  
9    limit: limit,  
10    http_sync: http_sync,  
11    callback: callback  
12)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): Target UUID.
- channels (Type: Array, Required): List of channels to set. Each entry can include:
  - channel, custom, type, status. custom supports simple types (String, Integer).
- sort, include (Default: { count: true }), filter, start, end, limit, http_sync, callback: Same semantics and include options as in Get channel memberships.

API limits
- See /docs/sdks/rest-api/set-membership-metadata.

Sample code

```
`1pubnub.set_memberships(  
2    uuid: 'mg',  
3    channels: [  
4        { channel: 'channel-1' }  
5    ],  
6    include: { custom: true }  
7) do |envelope|  
8    puts envelope  
9end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :memberships => [  
5                {  
6                    :channel => {  
7                        :id => "channel-1",  
8                        # {...}  
9                    },  
10                    :custom => nil,  
11                    :updated => Date>,  
12                    :eTag => "AY39mJKK//C0VA"  
13                }  
14            ],  
15            :totalCount => 1,  
16            :next => "MQ",  
17            :prev => nil  
18        }  
19    },  
20    @status = {  
21        :code => 200  
22    }  
23>  
`
```

### Remove channel memberships

Remove memberships for a UUID.

Methods

```
`1remove_memberships(  
2    uuid: uuid,  
3    channels: channels,  
4    sort: sort,  
5    include: include,  
6    filter: filter,  
7    start: start,  
8    end: end,  
9    limit: limit,  
10    http_sync: http_sync,  
11    callback: callback  
12)  
`
```

Parameters
- uuid (Type: String, Default: client UUID): Target UUID.
- channels (Type: Array, Required): Channel IDs to remove.
- sort, include (Default: { count: true }), filter, start, end, limit, http_sync, callback: Same semantics and include options as in Get channel memberships.

Sample code

```
`1pubnub.remove_memberships(  
2    uuid: 'mg',  
3    channels: [ 'channel-1' ],  
4    include: { custom: true }  
5) do |envelope|  
6    puts envelope  
7end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :memberships => [  
5                {  
6                    :channel => {  
7                        :id => "channel-2",  
8                        # {...}  
9                    },  
10                    :custom => nil,  
11                    :updated => Date>,  
12                    :eTag => "AY39mJKK//C0VA"  
13                }  
14            ],  
15            :totalCount => 1,  
16            :next => "MQ",  
17            :prev => nil  
18        }  
19    },  
20    @status = {  
21        :code => 200  
22    }  
23>  
`
```

## Channel members

Manage the users in a channel.

### Get channel members

List users in a channel. Optionally include UUID metadata.

Methods

```
`1get_channel_members(  
2    channel: channel,  
3    sort: sort,  
4    include: include,  
5    filter: filter,  
6    start: start,  
7    end: end,  
8    limit: limit,  
9    http_sync: http_sync,  
10    callback: callback  
11)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- sort (Type: Array, Default: n/a): Sort by id, name, updated. Use asc or desc.
- include (Type: Object, Default: { count: true }): Include fields:
  - count, custom, uuid_metadata, uuid_custom, status, type, uuid_status, uuid_type.
- filter (Type: String, Default: n/a): Filter expression. See /docs/general/metadata/filtering.
- start, end, limit, http_sync, callback: Same semantics as above.

Sample code

```
`1pubnub.get_channel_members(  
2    channel: 'channel-1',  
3    include: { count: true, custom: true, uuid_metadata: true }  
4) do |envelope|  
5    puts envelope  
6end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :members => [  
5                {  
6                    :uuid => {  
7                        :id => "uuid-identifier1",  
8                        :name => "uuid1",  
9                        :externalId => nil,  
10                        :profileUrl => nil,  
11                        :email => nil,  
12                        :updated => Date>,  
13                        :eTag => "AYfwuq+u+4C01gE",  
14                        # {...}  
15                    },  
16                    :custom => nil,  
17                    :updated => Date>,  
18                    :eTag => "AY39mJKK//C0VA"  
19                },  
20                # {...}  
21            ],  
22            :totalCount => 6,  
23            :next => "Ng",  
24            :prev => nil  
25        }  
26    },  
27    @status = {  
28        :code => 200  
29    }  
30>  
`
```

### Set channel members

Set users in a channel.

Methods

```
`1set_channel_members(  
2    channel: channel,  
3    uuids: uuids,  
4    sort: sort,  
5    include: include,  
6    filter: filter,  
7    start: start,  
8    end: end,  
9    limit: limit,  
10    http_sync: http_sync,  
11    callback: callback  
12)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- uuids (Type: Array, Required): List of members to set. Each entry can include:
  - uuid, custom, type, status. custom supports simple types (String, Integer).
- sort, include (Default: { count: true }), filter, start, end, limit, http_sync, callback: Same semantics and include options as in Get channel members.

API limits
- See /docs/sdks/rest-api/set-channel-members-metadata.

Sample code

```
`1pubnub.set_channel_members(  
2    channel: 'channel',  
3    uuids: [  
4        { uuid: 'uuid1' }  
5    ],  
6    include: { custom: true }  
7) do |envelope|  
8    puts envelope  
9end  
`
```

Response

```
`1#  
2    @result = {  
3        :data => {  
4            :members=>[  
5                {  
6                    :uuid => {  
7                        :id => "mg2",  
8                        # {...}  
9                    },  
10                    :custom => nil,  
11                    :updated=>Date>,  
12                    :eTag => "AY39mJKK//C0VA"  
13                }  
14            ],  
15            :totalCount => 1,  
16            :next => "MQ",  
17            :prev => nil  
18        }  
19    },  
20    @status = {  
21        :code => 200  
22    }  
23>  
`
```

### Remove channel members

Remove users from a channel.

Methods

```
`1remove_channel_members(  
2    channel: channel,  
3    uuids: uuids,  
4    sort: sort,  
5    include: include,  
6    filter: filter,  
7    start: start,  
8    end: end,  
9    limit: limit,  
10    http_sync: http_sync,  
11    callback: callback  
12)  
`
```

Parameters
- channel (Type: String, Required): Channel name.
- uuids (Type: Array, Required): UUIDs to remove.
- sort, include (Default: { count: true }), filter, start, end, limit, http_sync, callback: Same semantics and include options as in Get channel members.

Sample code

```
`1pubnub.remove_channel_members(  
2    channel: 'channel',  
3    uuids: [ 'mg1' ],  
4    include: { custom: true }  
5) do |envelope|  
6    puts envelope  
7end  
`
```

Response

```
`1#**2    @result = {  
3        :data => {  
4            :members=>[  
5                {  
6                    :uuid => {  
7                        :id => "uuid-identifier",  
8                        # {...}  
9                    },  
10                    :custom => nil,  
11                    :updated => Date>,  
12                    :eTag => "AY39mJKK//C0VA"  
13                }  
14            ],  
15            :totalCount => 1,  
16            :next => "MQ",  
17            :prev => nil  
18        }  
19    },  
20    @status = {  
21        :code => 200  
22    }  
23>  
`
```