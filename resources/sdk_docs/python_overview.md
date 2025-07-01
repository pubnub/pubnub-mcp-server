On this page
# Python API & SDK Docs 10.4.1

In this guide, we'll create a simple "Hello, World" application that demonstrates the core concepts of PubNub:

- Setting up a connection

- Sending messages

- Receiving messages in real-time

## Overview[​](#overview)

This guide will help you get up and running with PubNub in your Python application. The Python SDK provides a simple interface for integrating PubNub's real-time messaging capabilities into your applications. Whether you're building a web service, desktop application, or IoT device, this guide will show you how to get started.

## Prerequisites[​](#prerequisites)

Before we dive in, make sure you have:

- A basic understanding of Python

- Python 3.9 or later installed

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

There are several ways to install the PubNub Python SDK:

#### Use pip[​](#use-pip)

To integrate PubNub into your project using `pip`:

```
`pip install 'pubnub>=10.4.1'  
`
```

#### Source code[​](#source-code)

You can also download the source code directly from the [Python SDK](https://github.com/pubnub/python/) repository.

View the [supported platforms](/docs/sdks/python/platform-support) for more information about compatibility.

## Steps[​](#steps)

### Initialize PubNub[​](#initialize-pubnub)

In the IDE of your choice, create a new Python script with the following content. This is the minimum configuration you need to send and receive messages with PubNub.

Make sure to replace the demo keys with your app's publish and subscribe keys from the Admin Portal.

```
`# Import required modules  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
# Set up PubNub configuration  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = 'demo'  # Replace with your subscribe key  
pnconfig.publish_key = 'demo'    # Replace with your publish key  
pnconfig.user_id = 'python-user'  
pnconfig.enable_subscribe = True  
  
# Create a PubNub instance  
pubnub = PubNub(pnconfig)  
`
```

For more information, refer to the [Configuration](/docs/sdks/python/api-reference/configuration) section of the SDK documentation.

### Set up event listeners[​](#set-up-event-listeners)

Listeners help your app react to events and messages. You can implement custom app logic to respond to each type of message or event.

The Python SDK provides a way to handle connection status changes using a listener. Add the following code to set up a status listener:

```
`from pubnub.pubnub import SubscribeListener  
  
# Create a custom listener for status events  
class StatusListener(SubscribeListener):  
    def status(self, pubnub, status):  
        # This method is called when the status of the connection changes  
        print(f'Status: {status.category.name}')  
      
    # We're not implementing the message handler here as we'll use a subscription-specific handler  
  
# Add the listener to your PubNub instance  
status_listener = StatusListener()  
pubnub.add_listener(status_listener)  
`
```

For more information, refer to the [Listeners](/docs/sdks/python/api-reference/configuration#event-listeners) section of the SDK documentation.

### Create a subscription[​](#create-a-subscription)

To receive messages sent to a particular channel, you need to subscribe to it. This is done by creating a subscription and activating it:

```
`# Define the channel you want to subscribe to  
my_channel = 'my-channel'  
  
# Create a subscription for the channel  
subscription = pubnub.channel(my_channel).subscription()  
  
# Set up a message handler  
subscription.on_message = lambda message: print(f'Message received: {message.message}')  
  
# Subscribe to the channel  
subscription.subscribe()  
  
print(f'Subscribed to channel: {my_channel}')  
`
```

The SDK offers multiple ways to handle incoming messages, but using a subscription-specific handler (as shown above) is the recommended approach for most applications.

### Publish messages[​](#publish-messages)

When you publish a message to a channel, PubNub delivers that message to everyone who is subscribed to that channel.

A message can be any type of JSON-serializable data (such as objects, arrays, integers, strings) that is smaller than 32 KiB.

```
`import time  
from pubnub.exceptions import PubNubException  
  
# Wait for a moment to ensure the subscription is active  
time.sleep(1)  
  
# Create a message  
message = {  
    'msg': 'Hello from PubNub Python SDK!'  
}  
  
# Publish the message to the channel  
try:  
    envelope = pubnub.publish().channel(my_channel).message(message).sync()  
    print(f'Published message with timetoken: {envelope.result.timetoken}')  
`
```
show all 17 lines

The `sync()` method makes the call synchronously, meaning it will wait for the response before proceeding. For asynchronous calls, you can use `future()`  or `async()` depending on your application needs.

### Run the app[​](#run-the-app)

To test the code, save it as `pubnub_demo.py` and run it from your terminal:

```
`python pubnub_demo.py  
`
```

When you run the application, you should see output similar to the following:

```
`Subscribed to channel: my-channel  
Status: PNConnectedCategory  
From subscription: {'msg': 'Hello from PubNub Python SDK!'}  
Message received: {'msg': 'Hello from PubNub Python SDK!'}  
Published message with timetoken: 16967543908123456  
`
```

Note that you receive the message you just published because you're subscribed to the same channel.

## Complete example[​](#complete-example)

Here's the complete working example that puts everything together.

```
`import time  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub, SubscribeListener  
from pubnub.exceptions import PubNubException  
  
# Step 1: Initialize PubNub with configuration  
pnconfig = PNConfiguration()  
pnconfig.subscribe_key = 'demo'  # Replace with your subscribe key  
pnconfig.publish_key = 'demo'    # Replace with your publish key  
pnconfig.user_id = 'python-user'  
pnconfig.ssl = True              # Enable SSL for secure connection  
pnconfig.enable_subscribe = True  
pnconfig.daemon = True  # If using in a long-running app  
  
pubnub = PubNub(pnconfig)  
`
```
show all 58 lines

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

Import errors
- Ensure you've installed the PubNub package correctly.
- Check that you're using a compatible version of Python.
- Make sure all imports are correct.

For more detailed troubleshooting information, refer to the [Troubleshooting](/docs/sdks/python/troubleshoot) section of the SDK documentation.

## Next steps[​](#next-steps)

Great job! 🎉 You've successfully created your first PubNub application with Python. Here are some exciting things you can explore next:

- Build chat
- Advanced features
- Real examples
- More help

- Implement user [Presence](/docs/sdks/python/api-reference/presence) to show who's online.

- Add [Channel Groups](/docs/sdks/python/api-reference/channel-groups) to organize your channels.

- Implement typing indicators and read receipts.

- Try out [Presence](/docs/sdks/python/api-reference/presence) to track online/offline status.

- Implement [Message Persistence](/docs/sdks/python/api-reference/storage-and-playback) to store and retrieve messages.

- Use [Access Manager](/docs/sdks/python/api-reference/access-manager) to secure your channels.

- Explore our [GitHub repository](https://github.com/pubnub/python/) for more code samples.

- Check out our [Python SDK examples](https://github.com/pubnub/python/tree/master/examples) for practical examples.

- Check out our [SDK reference documentation](/docs/sdks/python/api-reference/configuration) for detailed API information.

- Join our [Discord community](https://discord.gg/pubnub) to connect with other developers.

- Visit our [support portal](https://support.pubnub.com/) for additional resources.

- Ask our AI assistant (the looking glass icon at the top of the page) for help.

Last updated on **May 7, 2025**