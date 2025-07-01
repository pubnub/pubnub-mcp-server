On this page
# Ruby API & SDK Docs 5.5.0

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Ruby application. You'll learn how to integrate the PubNub Ruby SDK to build real-time features into your applications.

The PubNub Ruby SDK provides a simple API for building real-time applications with features like:

- Publish/subscribe messaging

- Presence detection (online/offline status)

- Storage and playback

- Access control

- Push notifications

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Ruby

- Ruby 2.7 or later installed

- Bundler for managing dependencies (optional)

- A PubNub account (we'll help you set this up!)

## Setup[​](#setup)

### Get your PubNub keys[​](#get-your-pubnub-keys)

First things first – you'll need your PubNub keys to get started. Here's how to get them:

- [Sign in](https://admin.pubnub.com/#/login) or [create an account](https://admin.pubnub.com/#/signup) on the PubNub Admin Portal.

- Create a new app (or use an existing one).

- Find your publish and subscribe keys in the app's dashboard.

When you create a new app, PubNub automatically generates your first set of keys. While you can use the same keys for development and production, we recommend creating separate keysets for each environment for better security and management.

### Install the SDK[​](#install-the-sdk)

##### SDK version

Always use the latest SDK version to have access to the newest features and avoid security vulnerabilities, bugs, and performance issues.

Install the PubNub Ruby SDK using RubyGems:

```
`gem install pubnub  
`
```

Alternatively, if you're using Bundler:

1. $1

```
`# Gemfile  
source 'https://rubygems.org'  
  
gem 'pubnub', '~> 5.5.0'  
`
```

1. $1

```
`bundle install  
`
```

You can also get the source code directly from [GitHub](https://github.com/pubnub/ruby).

For a list of supported platforms, see the [platform support documentation](/docs/sdks/ruby/platform-support).

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

First, create a new `app.rb` file and add the following code to initialize the PubNub client.

Make sure to replace the demo keys with your own publish and subscribe keys from the Admin Portal.

```
`require 'pubnub'  
  
# Initialize PubNub  
pubnub = Pubnub.new(  
  subscribe_key: 'demo',  
  publish_key: 'demo',  
  user_id: 'myUniqueUserId',  
  ssl: true  
)  
  
puts "PubNub initialized with user_id: #{pubnub.user_id}"  
`
```

This creates a new PubNub instance with your keys and a unique user ID. The `ssl: true` parameter ensures your connections are secure.

For more information, refer to the [Configuration](/docs/sdks/ruby/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Next, set up listeners to handle incoming messages, presence events, and connection status updates:

```
`# Define callbacks for different event types  
callback = Pubnub::SubscribeCallback.new(  
  message: ->(envelope) {  
    puts "MESSAGE: #{envelope.result[:data][:message]['text']}"  
  },  
  presence: ->(envelope) {  
    puts "PRESENCE: #{envelope.result[:data]}"  
  },  
  status: ->(envelope) {  
    if envelope.status[:error]  
      puts "ERROR: #{envelope.status[:category]}"  
    else  
      puts "STATUS: #{envelope.status[:category]}"  
    end  
  }  
`
```
show all 19 lines
The message listener receives and processes incoming messages from subscribed channels.
The presence listener handles presence events, such as when users join or leave channels.
The status listener provides information about the connection status and any errors.

For more information, refer to the [Listeners](/docs/sdks/ruby/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

Now, subscribe to a channel to start receiving messages:

```
`# Subscribe to a channel  
pubnub.subscribe(  
  channels: ['my_channel'],  
  with_presence: true  
)  
  
puts "Subscribed to 'my_channel'"  
`
```

This code subscribes to the channel `my_channel`. The `with_presence: true` parameter enables presence events, allowing you to see when users join or leave the channel.

### Publish messages[​](#publish-messages)

After subscribing, you can publish messages to the channel.

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

```
`# Define a message to publish  
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
`
```

This publishes a simple message with the text "Hello world!" to the channel `my_channel`. The callback handles the response, confirming the message was published or reporting any errors.

### Run the app[​](#run-the-app)

Now that you've set up all the components, let's put them together and run the application:

1. $1

2. $1

```
`ruby app.rb  
`
```

You should see output similar to:

```
`PubNub initialized with user_id: myUniqueUserId  
Subscribed to 'my_channel'  
Waiting for messages... (Press Ctrl+C to exit)  
STATUS: ack  
MESSAGE: Hello world!  
PRESENCE: {message: {"action" => "join", "uuid" => "myUniqueUserId", "timestamp" => 1743511468, "precise_timestamp" => 1743511468385, "occupancy" => 4}, subscribed_channel: "my_channel-pnpres", actual_channel: "my_channel-pnpres", publish_time_object: {timetoken: "17435114683856450", region_code: 23}, message_meta_data: {"pn_action" => "join", "pn_channel" => "my_channel", "pn_ispresence" => 1, "pn_occupancy" => 4, "pn_precise_timestamp" => 1743511468385, "pn_timestamp" => 1743511468, "pn_uuid" => "myUniqueUserId"}, presence_event: "join", presence: {uuid: "myUniqueUserId", timestamp: 1743511468, state: nil, occupancy: 4}}  
Completed the demonstration  
`
```

This indicates that:

1. $1

2. $1

3. $1

4. $1

5. $1

6. $1

7. $1

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together:

```
`require 'pubnub'  
  
# Initialize PubNub  
pubnub = Pubnub.new(  
  subscribe_key: 'demo',  
  publish_key: 'demo',  
  user_id: 'myUniqueUserId',  
  ssl: true  
)  
  
puts "PubNub initialized with user_id: #{pubnub.user_id}"  
  
# Define callbacks for different event types  
callback = Pubnub::SubscribeCallback.new(  
  message: ->(envelope) {  
`
```
show all 60 lines

### Troubleshooting[​](#troubleshooting)

If you don't see the expected output, here are some common issues and how to fix them:

IssuePossible SolutionsNo connection message
- Check your internet connection.
- Verify your publish and subscribe keys are correct.
- Make sure you're not behind a firewall blocking PubNub's connections.

Message not received
- Double-check that you're subscribed to the correct channel.
- Verify that the message was actually sent (check for any error messages).
- Make sure you're waiting long enough for the message to be delivered.
- Ensure you set up the message listener correctly.

Ruby errors
- Ensure you've installed the PubNub gem correctly.
- Check that you're using a compatible version of Ruby (2.7+).
- Make sure all imports are correct.
- Verify your code matches the examples exactly.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub Ruby application. Here are some exciting things you can explore next:

- Advanced features
- Real examples
- More help

- Try out [Presence](/docs/sdks/ruby/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/ruby/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/ruby/api-reference/access-manager) to secure your channels.

- Explore [Channel Groups](/docs/sdks/ruby/api-reference/channel-groups) to organize your channels.

- Implement [Push Notifications](/docs/sdks/ruby/api-reference/mobile-push) for mobile applications.

- Explore our [GitHub repository](https://github.com/pubnub/ruby) for more code samples.

- Check out our [Ruby SDK reference documentation](/docs/sdks/ruby/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **Apr 2, 2025**