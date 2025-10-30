# Ruby API & SDK Docs 6.0.0

This guide demonstrates core PubNub concepts in Ruby:
- Setting up a connection
- Sending messages
- Receiving messages in real-time

## Overview

Integrate the PubNub Ruby SDK to build real-time features:
- Publish/subscribe messaging
- Presence detection (online/offline status)
- Storage and playback
- Access control
- Push notifications

## Prerequisites

- Ruby 2.7+
- Basic Ruby knowledge
- Bundler (optional)
- PubNub account and keys

## Setup

### Get your PubNub keys

- Sign in or create an account in the Admin Portal.
- Create an app and use the generated keyset (use separate keysets for dev/prod).
- Note your publish and subscribe keys.

### Install the SDK

##### SDK version

Use the latest SDK version.

Install with RubyGems:

```
`1gem install pubnub  
`
```

Using Bundler:

```
1# Gemfile  
2source 'https://rubygems.org'  
3
  
4gem 'pubnub', '~> 6.0.0'  

```

```
`1bundle install  
`
```

#### Source code

Clone the GitHub repository:

```
`1git clone https://github.com/pubnub/ruby  
`
```

For supported platforms, see the platform support documentation.

## Steps

### Initialize PubNub

Replace demo keys with your own from the Admin Portal.

```
1require 'pubnub'  
2
  
3# Initialize PubNub  
4pubnub = Pubnub.new(  
5  subscribe_key: 'demo',  
6  publish_key: 'demo',  
7  user_id: 'myUniqueUserId',  
8  ssl: true  
9)  
10
  
11puts "PubNub initialized with user_id: #{pubnub.user_id}"  

```

ssl: true secures connections. See Configuration docs for more options.

### Set up event listeners

```
1# Define callbacks for different event types  
2callback = Pubnub::SubscribeCallback.new(  
3  message: ->(envelope) {  
4    puts "MESSAGE: #{envelope.result[:data][:message]['text']}"  
5  },  
6  presence: ->(envelope) {  
7    puts "PRESENCE: #{envelope.result[:data]}"  
8  },  
9  status: ->(envelope) {  
10    if envelope.status[:error]  
11      puts "ERROR: #{envelope.status[:category]}"  
12    else  
13      puts "STATUS: #{envelope.status[:category]}"  
14    end  
15  }  
16)  
17
  
18# Add the listener to the PubNub instance  
19pubnub.add_listener(callback: callback)  

```

Message, presence, and status callbacks handle incoming data and connection updates.

### Create a subscription

```
1# Subscribe to a channel  
2pubnub.subscribe(  
3  channels: ['my_channel'],  
4  with_presence: true  
5)  
6
  
7puts "Subscribed to 'my_channel'"  

```

with_presence: true enables presence events. See Subscribe docs.

### Publish messages

Messages must be JSON-serializable data under 32 KiB.

```
1# Define a message to publish  
2message = { text: 'Hello world!' }  
3
  
4# Publish the message  
5pubnub.publish(  
6  channel: 'my_channel',  
7  message: message  
8) do |envelope|  
9  if envelope.status[:error]  
10    puts "Publish Error: #{envelope.status[:error]}"  
11  else  
12    puts "Message Published! Timetoken: #{envelope.result[:timetoken]}"  
13  end  
14end  

```

### Run the app

```
`ruby app.rb  
`
```

Sample output:

```
`1PubNub initialized with user_id: myUniqueUserId  
2Subscribed to 'my_channel'  
3Waiting for messages... (Press Ctrl+C to exit)  
4STATUS: ack  
5MESSAGE: Hello world!  
6PRESENCE: {message: {"action" => "join", "uuid" => "myUniqueUserId", "timestamp" => 1743511468, "precise_timestamp" => 1743511468385, "occupancy" => 4}, subscribed_channel: "my_channel-pnpres", actual_channel: "my_channel-pnpres", publish_time_object: {timetoken: "17435114683856450", region_code: 23}, message_meta_data: {"pn_action" => "join", "pn_channel" => "my_channel", "pn_ispresence" => 1, "pn_occupancy" => 4, "pn_precise_timestamp" => 1743511468385, "pn_timestamp" => 1743511468, "pn_uuid" => "myUniqueUserId"}, presence_event: "join", presence: {uuid: "myUniqueUserId", timestamp: 1743511468, state: nil, occupancy: 4}}  
7Completed the demonstration  
`
```

## Complete example

```
1require 'pubnub'  
2
  
3# Initialize PubNub  
4pubnub = Pubnub.new(  
5  subscribe_key: 'demo',  
6  publish_key: 'demo',  
7  user_id: 'myUniqueUserId',  
8  ssl: true  
9)  
10
  
11puts "PubNub initialized with user_id: #{pubnub.user_id}"  
12
  
13# Define callbacks for different event types  
14callback = Pubnub::SubscribeCallback.new(  
15  message: ->(envelope) {  
16    puts "MESSAGE: #{envelope.result[:data][:message]['text']}"  
17  },  
18  presence: ->(envelope) {  
19    puts "PRESENCE: #{envelope.result[:data]}"  
20  },  
21  status: ->(envelope) {  
22    if envelope.status[:error]  
23      puts "ERROR: #{envelope.status[:category]}"  
24    else  
25      puts "STATUS: #{envelope.status[:category]}"  
26    end  
27  }  
28)  
29
  
30# Add the listener to the PubNub instance  
31pubnub.add_listener(callback: callback)  
32
  
33# Subscribe to a channel  
34pubnub.subscribe(  
35  channels: ['my_channel'],  
36  with_presence: true  
37)  
38
  
39puts "Subscribed to 'my_channel'"  
40
  
41# Define a message to publish  
42message = { text: 'Hello world!' }  
43
  
44# Publish the message  
45pubnub.publish(  
46  channel: 'my_channel',  
47  message: message  
48) do |envelope|  
49  if envelope.status[:error]  
50    puts "Publish Error: #{envelope.status[:error]}"  
51  else  
52    puts "Message Published! Timetoken: #{envelope.result[:timetoken]}"  
53  end  
54end  
55
  
56# Keep the program running to receive messages  
57# In a real application, you might use an event loop or framework  
58puts "Waiting for messages... (Press Ctrl+C to exit)"  
59sleep 5  # Wait for 5 seconds to see the results  
60puts "Completed the demonstration"  

```

## Troubleshooting

- No connection:
  - Check internet.
  - Verify publish/subscribe keys.
  - Ensure firewall allows PubNub.
- Message not received:
  - Confirm channel name.
  - Check publish callback for errors.
  - Wait for delivery and ensure listener is set up.
- Ruby errors:
  - Install the pubnub gem.
  - Use Ruby 2.7+.
  - Verify imports and code match examples.

## Next steps

- Presence
- Message Persistence
- Access Manager
- Channel Groups
- Push Notifications
- GitHub repository for samples
- Ruby SDK reference documentation
- Support portal
- Ask the AI assistant

Last updated on Sep 3, 2025