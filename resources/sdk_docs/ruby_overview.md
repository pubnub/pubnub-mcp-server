# Ruby API & SDK Docs 5.5.0 – Overview  

The PubNub Ruby SDK adds real-time capabilities (publish/subscribe, presence, storage, access control, push).  
Supported Ruby ≥ 2.7.

## Prerequisites
* Ruby 2.7+ (Bundler optional)  
* PubNub account with publish & subscribe keys

## Install

```bash
gem install pubnub
```

Using Bundler:

```ruby
# Gemfile
source 'https://rubygems.org'

gem 'pubnub', '~> 5.5.0'
```

```bash
bundle install
```

## Initialize the Client
```ruby
require 'pubnub'

# Initialize PubNub
pubnub = Pubnub.new(
  subscribe_key: 'demo',      # ← replace with your key
  publish_key:   'demo',      # ← replace with your key
  user_id:       'myUniqueUserId',
  ssl:           true         # TLS on
)

puts "PubNub initialized with user_id: #{pubnub.user_id}"
```

Params (Pubnub.new):
* subscribe_key (String, required)  
* publish_key  (String, required for publishes)  
* user_id      (String, required)  
* ssl          (Boolean, default false)

## Event Listeners
```ruby
# Define callbacks for different event types
callback = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) {
    puts "MESSAGE: #{envelope.result[:data][:message]['text']}"
  },
  presence: ->(envelope) {
    puts "PRESENCE: #{envelope.result[:data]}"
  },
  status:   ->(envelope) {
    if envelope.status[:error]
      puts "ERROR: #{envelope.status[:category]}"
    else
      puts "STATUS: #{envelope.status[:category]}"
    end
  }
)
```

## Subscribe
```ruby
# Subscribe to a channel
pubnub.subscribe(
  channels:      ['my_channel'],
  with_presence: true           # enables presence events
)

puts "Subscribed to 'my_channel'"
```

Method signature:  
`subscribe(channels:, channel_groups: nil, with_presence: false, **opts)`

## Publish
* Messages must be JSON-serializable and ≤ 32 KiB.

```ruby
# Define a message to publish
message = { text: 'Hello world!' }

# Publish the message
pubnub.publish(
  channel: 'my_channel',
  message: message
) do |envelope|
  if envelope.status[:error]
    puts "Publish Error: #{envelope.status[:error]}"
  else
    puts "Message Published! Timetoken: #{envelope.result[:timetoken]}"
  end
end
```

Method signature:  
`publish(channel:, message:, **opts) { |envelope| ... }`

## Run
```bash
ruby app.rb
```

### Example Output
```text
PubNub initialized with user_id: myUniqueUserId
Subscribed to 'my_channel'
Waiting for messages... (Press Ctrl+C to exit)
STATUS: ack
MESSAGE: Hello world!
PRESENCE: {message: {"action"=>"join", ...}}
Completed the demonstration
```

## Complete Example
```ruby
require 'pubnub'

# Initialize PubNub
pubnub = Pubnub.new(
  subscribe_key: 'demo',
  publish_key:   'demo',
  user_id:       'myUniqueUserId',
  ssl:           true
)

puts "PubNub initialized with user_id: #{pubnub.user_id}"

# Define callbacks for different event types
callback = Pubnub::SubscribeCallback.new(
  message: ->(envelope) {
```
*(remaining lines unchanged from previous sections)*

---

Next steps: explore Presence, Message Persistence, Access Manager, Channel Groups, Push Notifications. For full API details see PubNub Ruby SDK reference.