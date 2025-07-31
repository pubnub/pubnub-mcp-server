# Python API & SDK Docs 10.4.1  

## Overview
PubNub’s Python SDK (Python 3.9+) adds real-time publish/subscribe messaging to any Python app. This quick-start covers minimal setup, message send/receive, and a runnable “Hello, World” example.

## Prerequisites
• Python 3.9 or later  
• PubNub account with publish & subscribe keys  

## Setup  

### Get your keys
1. Log in to the PubNub Admin Portal.  
2. Create/select an app and copy its Publish & Subscribe keys.  

### Install the SDK (latest recommended)

```
`pip install 'pubnub>=10.4.1'  
`
```
Source code: https://github.com/pubnub/python/

## Quick-start steps  

### 1. Initialize PubNub

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

### 2. Add a status listener

```
`from pubnub.pubnub import SubscribeListener  
  
# Create a custom listener for status events  
class StatusListener(SubscribeListener):  
    def status(self, pubnub, status):  
        print(f'Status: {status.category.name}')  
  
# Attach the listener  
status_listener = StatusListener()  
pubnub.add_listener(status_listener)  
`
```

### 3. Subscribe to a channel

```
`my_channel = 'my-channel'  
  
subscription = pubnub.channel(my_channel).subscription()  
subscription.on_message = lambda message: print(f'Message received: {message.message}')  
subscription.subscribe()  
  
print(f'Subscribed to channel: {my_channel}')  
`
```

### 4. Publish a message

```
`import time  
from pubnub.exceptions import PubNubException  
  
time.sleep(1)  # ensure subscription is active  
  
message = {'msg': 'Hello from PubNub Python SDK!'}  
  
try:  
    envelope = pubnub.publish().channel(my_channel).message(message).sync()  
    print(f'Published message with timetoken: {envelope.result.timetoken}')  
`
```
`sync()` is blocking; use `future()` or `async()` for non-blocking calls.

### 5. Run

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

## Complete example

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
pnconfig.daemon = True           # If using in a long-running app  
  
pubnub = PubNub(pnconfig)  
`
```
show all 58 lines

## Troubleshooting
• No connection – check internet, keys, firewall.  
• Message not received – confirm channel, check publish result, wait for delivery.  
• Import errors – ensure `pubnub` installed, correct Python version, proper imports.  
More: /docs/sdks/python/troubleshoot  

## Next steps
• Presence, Channel Groups, Message Persistence, Access Manager  
• Examples: https://github.com/pubnub/python/tree/master/examples  
• API reference: /docs/sdks/python/api-reference/configuration  
• Support/Discord: https://support.pubnub.com/ | https://discord.gg/pubnub  

_Last updated: May 7 2025_