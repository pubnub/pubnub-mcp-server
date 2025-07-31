# Ruby API & SDK Docs 5.5.0 — Overview (Condensed)

## Prerequisites
* Ruby 2.7+
* Bundler (optional)
* PubNub account (publish & subscribe keys)

## Install the SDK
```bash
gem install pubnub
```
Bundler:
```ruby
# Gemfile
source 'https://rubygems.org'
gem 'pubnub', '~> 5.5.0'
```
```bash
bundle install
```

## Get Your Keys
Create or open an app in the [PubNub Admin Portal](https://admin.pubnub.com). Copy the **Publish** and **Subscribe** keys.

## Initialize PubNub
Replace the demo keys with your own.
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
```

## Set Up Event Listeners
```ruby
# Define callbacks for different event types
callback = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) { puts "MESSAGE: #{envelope.result[:data][:message]['text']}" },
  presence: ->(envelope) { puts "PRESENCE: #{envelope.result[:data]}" },
  status:   ->(envelope) {
    if envelope.status[:error]
      puts "ERROR: #{envelope.status[:category]}"
    else
      puts "STATUS: #{envelope.status[:category]}"
    end
  }
)

pubnub.add_listener(callback)
```

## Subscribe
```ruby
# Subscribe to a channel
pubnub.subscribe(
  channels:      ['my_channel'],
  with_presence: true
)

puts "Subscribed to 'my_channel'"
```

## Publish
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

## Run the App
```bash
ruby app.rb
```
Expected output (abbreviated):
```text
PubNub initialized with user_id: myUniqueUserId
Subscribed to 'my_channel'
STATUS: ack
MESSAGE: Hello world!
PRESENCE: { ... "uuid"=>"myUniqueUserId" ... }
```

## Complete Example
```ruby
require 'pubnub'

pubnub = Pubnub.new(
  subscribe_key: 'demo',
  publish_key:   'demo',
  user_id:       'myUniqueUserId',
  ssl:           true
)

callback = Pubnub::SubscribeCallback.new(
  message:  ->(envelope) { puts "MESSAGE: #{envelope.result[:data][:message]['text']}" },
  presence: ->(envelope) { puts "PRESENCE: #{envelope.result[:data]}" },
  status:   ->(envelope) { puts "STATUS: #{envelope.status[:category]}" }
)

pubnub.add_listener(callback)

pubnub.subscribe(
  channels:      ['my_channel'],
  with_presence: true
)

pubnub.publish(
  channel: 'my_channel',
  message: { text: 'Hello world!' }
) { |_| }

sleep
```

## Troubleshooting (Quick Ref)
* **No connection:** check internet, keys, firewall.
* **Message not received:** confirm channel name, wait, ensure listener added.
* **Ruby errors:** verify gem installed, Ruby 2.7+, code matches examples.

## Next Steps
* Presence, Message Persistence, Access Manager, Channel Groups, Push Notifications
* Docs & samples:  
  * API reference: /docs/sdks/ruby/api-reference  
  * GitHub: https://github.com/pubnub/ruby  
  * Discord community & support portal