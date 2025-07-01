# PubNub Python SDK 10.4.1 – Overview (Condensed)

## Prerequisites
• Python 3.9+  
• PubNub publish & subscribe keys.

## Install

```
`pip install 'pubnub>=10.4.1'  
`
```
(Or clone https://github.com/pubnub/python/)

## Initialize PubNub

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
Key `PNConfiguration` fields  
• `subscribe_key`, `publish_key`, `user_id` (str)  
• `ssl` (bool) – enable TLS  
• `enable_subscribe` (bool) – receive messages  
• `daemon` (bool) – long-running apps

## Event Listener (connection status)

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

## Subscribe to a Channel

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

## Publish a Message  (JSON < 32 KiB)

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
• `.sync()` blocks until response; use `.future()` or `.async()` for non-blocking.

## Run

Save as `pubnub_demo.py` then execute:

```
`python pubnub_demo.py  
`
```
Expected output:

```
`Subscribed to channel: my-channel  
Status: PNConnectedCategory  
From subscription: {'msg': 'Hello from PubNub Python SDK!'}  
Message received: {'msg': 'Hello from PubNub Python SDK!'}  
Published message with timetoken: 16967543908123456  
`
```

## Complete Example

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

## Troubleshooting (quick reference)
• No connection: check keys, network, firewall.  
• No message: confirm channel & subscription, wait for delivery, inspect errors.  
• Import error: verify `pubnub` install and Python version.

Explore advanced APIs (Presence, Channel Groups, Storage, Access Manager) in the full SDK docs.