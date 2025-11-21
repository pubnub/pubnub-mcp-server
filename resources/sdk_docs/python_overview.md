# Python API & SDK Docs 10.4.1

This guide demonstrates how to connect, publish, and subscribe with the PubNub Python SDK.

## Overview

Use the Python SDK to add real-time messaging to Python apps (web, desktop, IoT).

## Prerequisites

- Python 3.9+
- PubNub account and keyset (publish and subscribe keys)

## Setup

### Get your PubNub keys

- Sign in to the PubNub Admin Portal, create an app, and copy your publish and subscribe keys.
- Use separate keysets for development and production.

### Install the SDK

##### SDK version

Use the latest SDK for features, security, and performance.

#### Use pip

```
`1pip install 'pubnub>=10.4.1'  
`
```

#### Source code

You can also download the source from the Python SDK repository. See supported platforms for compatibility.

## Steps

### Initialize PubNub

Replace demo keys with your own.

```
1# Import required modules  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4
  
5# Set up PubNub configuration  
6pnconfig = PNConfiguration()  
7pnconfig.subscribe_key = 'demo'  # Replace with your subscribe key  
8pnconfig.publish_key = 'demo'    # Replace with your publish key  
9pnconfig.user_id = 'python-user'  
10pnconfig.enable_subscribe = True  
11
  
12# Create a PubNub instance  
13pubnub = PubNub(pnconfig)  

```

### Set up event listeners

Handle connection status changes with a listener.

```
1from pubnub.pubnub import SubscribeListener  
2
  
3# Create a custom listener for status events  
4class StatusListener(SubscribeListener):  
5    def status(self, pubnub, status):  
6        # This method is called when the status of the connection changes  
7        print(f'Status: {status.category.name}')  
8      
9    # We're not implementing the message handler here as we'll use a subscription-specific handler  
10
  
11# Add the listener to your PubNub instance  
12status_listener = StatusListener()  
13pubnub.add_listener(status_listener)  

```

### Create a subscription

Subscribe to a channel and handle messages with a subscription-specific handler.

```
1# Define the channel you want to subscribe to  
2my_channel = 'my-channel'  
3
  
4# Create a subscription for the channel  
5subscription = pubnub.channel(my_channel).subscription()  
6
  
7# Set up a message handler  
8subscription.on_message = lambda message: print(f'Message received: {message.message}')  
9
  
10# Subscribe to the channel  
11subscription.subscribe()  
12
  
13print(f'Subscribed to channel: {my_channel}')  

```

### Publish messages

Messages must be JSON-serializable and smaller than 32 KiB. Use sync() to block for a response; asynchronous alternatives include future() or async().

```
1import time  
2from pubnub.exceptions import PubNubException  
3
  
4# Wait for a moment to ensure the subscription is active  
5time.sleep(1)  
6
  
7# Create a message  
8message = {  
9    'msg': 'Hello from PubNub Python SDK!'  
10}  
11
  
12# Publish the message to the channel  
13try:  
14    envelope = pubnub.publish().channel(my_channel).message(message).sync()  
15    print(f'Published message with timetoken: {envelope.result.timetoken}')  
16except PubNubException as e:  
17    print(f'Publish failed: {e}')  

```

### Run the app

Save as pubnub_demo.py and run:

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
1import time  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub, SubscribeListener  
4from pubnub.exceptions import PubNubException  
5
  
6# Step 1: Initialize PubNub with configuration  
7pnconfig = PNConfiguration()  
8pnconfig.subscribe_key = 'demo'  # Replace with your subscribe key  
9pnconfig.publish_key = 'demo'    # Replace with your publish key  
10pnconfig.user_id = 'python-user'  
11pnconfig.ssl = True              # Enable SSL for secure connection  
12pnconfig.enable_subscribe = True  
13pnconfig.daemon = True  # If using in a long-running app  
14
  
15pubnub = PubNub(pnconfig)  
16
  
17# Step 2: Create a status listener  
18class StatusListener(SubscribeListener):  
19    def status(self, pubnub, status):  
20        print(f'Status: {status.category.name}')  
21      
22    # We're only monitoring connection status, not messages  
23
  
24# Step 3: Add the listener  
25status_listener = StatusListener()  
26pubnub.add_listener(status_listener)  
27
  
28# Step 4: Define the channel and create a subscription  
29my_channel = 'my-channel'  
30subscription = pubnub.channel(my_channel).subscription()  
31
  
32# Step 5: Set up a message handler for the subscription  
33subscription.on_message = lambda message: print(f'Message received: {message.message}')  
34
  
35# Step 6: Subscribe to the channel  
36subscription.subscribe()  
37print(f'Subscribed to channel: {my_channel}')  
38
  
39# Wait for connection to establish before publishing  
40time.sleep(1)  
41
  
42# Step 7: Create and publish a message  
43message = {  
44    'msg': 'Hello from PubNub Python SDK!'  
45}  
46
  
47try:  
48    envelope = pubnub.publish().channel(my_channel).message(message).sync()  
49    print(f'Published message with timetoken: {envelope.result.timetoken}')  
50except PubNubException as e:  
51    print(f'Publish failed: {e}')  
52
  
53# Keep the script running to receive messages  
54time.sleep(3)  
55
  
56# Step 8: Clean up before exiting  
57pubnub.stop()  
58print('Cleanup complete.')  

```

## Troubleshooting

- No connection:
  - Check internet, verify keys, ensure firewall allows PubNub.
- Message not received:
  - Confirm channel name, check publish errors, allow time for delivery.
- Import errors:
  - Verify PubNub package installed, Python version compatible, imports correct.

## Next steps

- Channel Groups
- Presence
- Message Persistence
- Access Manager
- SDK reference, examples, GitHub repository, Discord, and Support Portal

Last updated on Sep 3, 2025