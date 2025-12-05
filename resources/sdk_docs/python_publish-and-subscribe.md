# Publish/Subscribe API for Python SDK

Use PubNub to publish and subscribe to real-time messages. For conceptual guidance, see Connection Management and Publish Messages.

##### Request execution and return values

- Synchronous: `.sync()` returns an `Envelope` with:
  - `Envelope.result` (type varies by API)
  - `Envelope.status` (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

- Asynchronous: `.pn_async(callback)` returns `None` and invokes your callback with `(result, status)`:

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  

```

## Publish

`publish()` sends a message to all subscribers of a channel.

- Prerequisites and limitations
  - Initialize PubNub with `publishKey`.
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.

- Security
  - Enable TLS/SSL by setting `ssl=true` during initialization.
  - Optional message encryption is available.

- Message data
  - Send any JSON-serializable data (objects, arrays, integers, strings).
  - Don't JSON serialize `message` or `meta`; the SDK does this automatically.

- Size
  - Max message size: 32 KiB (includes escaped characters and channel name). Aim for < 1,800 bytes. Oversized messages return `Message Too Large`.

- Publish rate
  - Publish as fast as bandwidth allows. There's a soft throughput limit; in-memory queue stores 100 messages. Subscribers that can't keep up may drop earlier messages.

- Custom message type
  - `custom_message_type`: 3–50 chars, case-sensitive alphanumeric; `-` and `_` allowed; cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.

- Best practices
  - Publish serially.
  - Verify success return code; publish next only after success.
  - Retry on failure.
  - Keep queue under 100 messages.
  - Throttle bursts (for example, ≤ 5 msgs/s).

### Method(s)

```
`1pubnub.publish() \  
2    .channel(String) \  
3    .message(Object) \  
4    .custom_message_type(String) \  
5    .should_store(Boolean) \  
6    .meta(Dictionary) \  
7    .use_post(Boolean)  
`
```

Parameters:
- channel (required) — Type: String. Destination channel ID.
- message (required) — Type: Object. The payload.
- custom_message_type — Type: String. Business-specific label (constraints above).
- should_store — Type: Boolean. Default: account default. Store in history.
- meta — Type: Object. Default: None. Metadata for filtering.
- use_post — Type: Boolean. Use POST to publish.

### Sample code

#### Publish a message to a channel

- Builder Pattern
- Named Arguments

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def publish_message(pubnub: PubNub):  
8    try:  
9        envelope = pubnub.publish() \  
10            .channel("my_channel") \  
11            .message({  
12                'name': 'Alex',  
13                'online': True  
14            }) \  
15            .custom_message_type("text-message") \  
16            .sync()  
17        print("Publish timetoken: %d" % envelope.result.timetoken)  
18    except PubNubException as e:  
19        print(f"Error: {e}")  
20
  
21
  
22def main():  
23    # Configuration for PubNub instance  
24    pn_config = PNConfiguration()  
25    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
26    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
27    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
28
  
29    # Initialize PubNub client  
30    pubnub = PubNub(pn_config)  
31
  
32    # Publish message  
33    publish_message(pubnub)  
34
  
35
  
36if __name__ == "__main__":  
37    main()  

```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.exceptions import PubNubException  
5
  
6
  
7def publish_message(pubnub: PubNub):  
8    try:  
9        envelope = pubnub.publish(  
10            channel="my_channel",  
11            message={  
12                'name': 'Alex',  
13                'online': True  
14            },  
15            custom_message_type="text-message"  
16        ).sync()  
17        print("Publish timetoken: %d" % envelope.result.timetoken)  
18    except PubNubException as e:  
19        print(f"Error: {e}")  
20
  
21
  
22def main():  
23    # Configuration for PubNub instance  
24    pn_config = PNConfiguration()  
25    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
26    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
27    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
28
  
29    # Initialize PubNub client  
30    pubnub = PubNub(pn_config)  
31
  
32    # Publish message  
33    publish_message(pubnub)  
34
  
35
  
36if __name__ == "__main__":  
37    main()  
38
  

```

##### Subscribe to the channel

Before running the above publish example, subscribe to the same channel (for example, with the Debug Console or a separate script).

### Returns

`publish()` returns an `Envelope`:
- result: `PNPublishResult` (includes timetoken)
- status: `PNStatus`

#### PNPublishResult

```
`1Publish success with timetoken 17193163560057793  
`
```

### Other examples

#### Publish with metadata

```
1def publish_callback(result, status):  
2    pass  
3    # handle publish result, status always present, result if successful  
4    # status.is_error() to see if error happened  
5
  
6pubnub.publish().channel("my_channel").message(["hello", "there"]) \  
7    .meta({'name': 'Alex'}).pn_async(publish_callback)  

```

## Fire

Sends a message to Functions event handlers and Illuminate only. Not replicated to subscribers; not stored in history.

### Method(s)

```
`1pubnub.fire() \  
2    .channel(String) \  
3    .message(Object) \  
4    .use_post(Boolean) \  
5    .meta(Object)  
`
```

Parameters:
- channel (required) — Type: String. Destination channel ID.
- message (required) — Type: Object. The payload.
- use_post — Type: Boolean. Default: False.
- meta — Type: Object. Default: None.

### Sample code

- Builder Pattern
- Named Arguments

```
`1envelope = pubnub.fire() \  
2    .channel('my_channel') \  
3    .message('hello there') \  
4    .use_post(True) \  
5    .sync()  
6print(f'fire timetoken: {envelope.result.timetoken}')  
`
```

```
`1fire = pubnub.fire(channel="my_channel", message='hello there').sync()  
2print(f'fire timetoken: {fire.result.timetoken}')  
`
```

### Returns

`fire()` returns an `Envelope`:
- result: `PNFireResult` (includes timetoken)
- status: `PNStatus`

#### PNFireResult

```
`1Fire success with timetoken 17193163560057793  
`
```

## Signal

`signal()` sends a signal to all subscribers of a channel. Payload limit: 64 bytes (payload only).

### Method(s)

```
`1pubnub.signal() \  
2    .message(Object) \  
3    .custom_message_type(String) \  
4    .channel(String)  
`
```

Parameters:
- message (required) — Type: Object. Payload (≤ 64 bytes).
- custom_message_type — Type: String. Same constraints as publish.
- channel (required) — Type: String. Destination channel ID.

### Sample code

- Builder Pattern
- Named Arguments

```
`1envelope = pubnub.signal() \  
2    .channel('some_channel') \  
3    .message('foo') \  
4    .custom_message_type('text-message') \  
5    .sync()  
`
```

```
`1signal = pubnub.signal(channel="my_channel", message='hello there', custom_message_type='text-message').sync()  
2print(f'signal timetoken: {signal.result.timetoken}')  
`
```

### Returns

`signal()` returns an `Envelope`:
- result: `PNSignalResult` (includes timetoken)
- status: `PNStatus`

#### PNSignalResult

```
`1Signal success with timetoken 17193165584676126  
`
```

## Subscribe

Opens a TCP socket and listens for messages and events on specified entities. Configure `subscribeKey` during initialization. Newly subscribed clients receive messages after `subscribe()` completes. Enable automatic retries to reconnect and fetch available messages after disconnects.

### Subscription scope

- Subscription: entity-scoped (for a specific channel/group/metadata).
- SubscriptionSet: client-scoped (can include multiple subscriptions created on a `pubnub` client).

### Create a subscription

```
`1# entity-based, local-scoped  
2subscription = pubnub.channel(f'{channel}').subscription(with_presence: bool = False)  
`
```

- with_presence — Type: bool. Deliver presence updates for userIds. See Presence Events for details.

### Create a subscription set

```
`1# client-based, general-scoped  
2subscription_set = pubnub.subscription_set(subscriptions: List[PubNubSubscription])  
`
```

- subscriptions (required) — Type: List[PubNubSubscription]. Channel/Channel group subscriptions.

### Method(s)

#### Subscribe

```
`1subscription.subscribe(timetoken: Optional[int] = None, region: Optional[str] = None,)  
`
```

Parameters:
- timetoken — Type: int. Best-effort retrieval from a specific 17-digit timetoken.
- region — Type: String. Region where the message was published.

##### Sample code

```
# single channel subscription  
channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  

  
# multiple channel subscription  
channel_1 = pubnub.channel(channel).subscription()  
channel_2 = pubnub.channel(f'{channel}.2').subscription(with_presence=True)  
channel_x = pubnub.channel(f'{channel}.*').subscription(with_presence=True)  

  
group = pubnub.channel_group('group-test').subscription()  

  
subscription_set = pubnub.subscription_set([channel_1, channel_2, channel_x, group])  

  
set_subscription = subscription_set.subscribe()  

```

##### Returns

The `subscribe()` method doesn't return a value.

## Entities

Subscribable objects for which you can receive real-time updates:

- PubNubChannel
- PubNubChannelGroup
- PubNubUserMetadata
- PubNubChannelMetadata

### Create channels

```
`pubnub.channel(String)  
`
```

- channel (required) — Type: String. Channel ID.

#### Sample code

```
`pubnub.channel(f'{channel1}')  
`
```

### Create channel groups

```
`pubnub.channel_group(String)  
`
```

- channel_group (required) — Type: String. Channel group name.

#### Sample code

```
`pubnub.channel_group("channelGroupName")  
`
```

### Create channel metadata

```
`pubnub.channel_metadata(String)  
`
```

- channel_metadata (required) — Type: String. Channel metadata ID.

#### Sample code

```
`pubnub.channel_metadata("channelMetadata")  
`
```

### Create user metadata

```
`pubnub.user_metadata(String)  
`
```

- user_metadata (required) — Type: String. User metadata ID.

#### Sample code

```
`pubnub.userMetadata("user_metadata")  
`
```

## Event listeners

Attach listeners to `Subscription`, `SubscriptionSet`, and (for connection status) the PubNub client to receive messages, signals, presence, files, and metadata events.

### Add listeners

```
# Add event-specific listeners  

  
# using closure for reusable listener  
def on_message(listener):  
    def message_callback(message):  
        print(f"\033[94mMessage received on: {listener}: \n{message.message}\033[0m\n")  
    return message_callback  

  
# without closure  
def on_message_action(message_action):  
    print(f"\033[5mMessageAction received: \n{message_action.value}\033[0m\n")  

  
def on_presence(listener):  
    def presence_callback(presence):  
        print(f"\033[0;32mPresence received on: {listener}: \t{presence.uuid} {presence.event}s "  
              f"{presence.subscription or presence.channel}\033[0m")  
    return presence_callback  

  
def on_status(listener):  
    def status_callback(status):  
        print(f"\033[92mStatus received on: {listener}: \t{status.category.name}\033[0m")  
    return status_callback  

  
def on_signal(listener):  
    def signal_callback(signal):  
        print(f"\033[0;36mSignal received on: {listener}: \n{signal.publisher} says: \t{signal.message}\033[0m")  
    return signal_callback  

  
def on_channel_metadata(listener):  
    def channel_metadata_callback(channel_meta):  
        print(f"\033[0;36mChannel metadata received on: {listener}: \n{channel_meta.__dict__}\033[0m")  
    return channel_metadata_callback  

  
def on_user_metadata(listener):  
    def user_metadata_callback(user_meta):  
        print(f"\033[0;36mUser metadata received on: {listener}: \n{user_meta.__dict__}\033[0m")  
    return user_metadata_callback  

  
def on_file(listener):  
    def file_callback(files):  
        print(f"\033[0;36mFile received on: {listener}: \n{user_meta.__dict__}\033[0m")  
    return file_callback  

  
subscription.on_message = on_message('message_listener')  
subscription.on_message_action = on_message_action  

  
# add generic listener  
class PrintListener(SubscribeCallback):  
    def status(self, _, status):  
        print(f'\033[92mPrintListener.status:\n{status.category.name}\033[0m')  

  
    def message(self, _, message):  
        print(f'\033[94mPrintListener.message:\n{message.message}\033[0m')  

  
    def presence(self, _, presence):  
        print(f'PrintListener.presence:\n{presence.uuid} {presence.event}s '  
              f'{presence.subscription or presence.channel}\033[0m')  

  
    def signal(self, _, signal):  
        print(f'PrintListener.signal:\n{signal.message} from {signal.publisher}\033[0m')  

  
    def channel(self, _, channel):  
        print(f'\033[0;37mChannel Meta:\n{channel.__dict__}\033[0m')  

  
    def uuid(self, _, uuid):  
        print(f'User Meta:\n{uuid.__dict__}\033[0m')  

  
    def membership(self, _, membership):  
        print(f'Membership:\n{membership.__dict__}\033[0m')  

  
    def message_action(self, _, message_action):  
        print(f'PrintListener.message_action {message_action}\033[0m')  

  
    def file(self, _, file_message):  
        print(f' {file_message.__dict__}\033[0m')  

  
subscription.add_listener(PrintListener())  

```

#### Sample code

```
subscription = pubnub.channel(f'{channel1}').subscription()  

  
def on_message(listener):  
    def message_callback(message):  
        print(f"\033[94mMessage received on: {listener}: \n{message.message}\033[0m\n")  
    return message_callback  

  
def on_message_action(message_action):  
    print(f"\033[5mMessageAction received: \n{message_action.value}\033[0m\n")  

  
subscription.on_message = on_message('message_listener')  
subscription.on_message_action = on_message_action  

  
subscription.subscribe()  

  
subscription_set = pubnub.subscription_set(channels=["channel", "channel2"],  
                                          channel_groups=["cg_1"],  
                                          with_presence=True)  

  
subscription_set.subscribe()  

```

### Add connection status listener

Client-scoped listener for connection status updates.

#### Method(s)

```
`1pubnub.add_listener()  
`
```

#### Sample code

```
1class PrintListener(SubscribeListener):  
2    def status(self, pubnub, status):  
3        print(f'Status:\n{status.__dict__}')  
4
  
5    def message(self, pubnub, message):  
6        pass  
7
  
8    def presence(self, pubnub, presence):  
9        pass  
10
  
11listener = PrintListener()  
12pubnub.add_listener(listener)  

```

#### Returns

Subscription status (see SDK statuses).

## Unsubscribe

Stop receiving real-time updates from a `Subscription` or a `SubscriptionSet`.

### Method(s)

```
subscription.unsubscribe()  

  
subscription_set.unsubscribe()  

```

### Sample code

```
1channel = pubnub.channel(f'{channel}')  
2t1_subscription = channel.subscription()  
3t1_subscription.subscribe()  
4
  
5subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
6subscription_set.subscribe()  
7
  
8
  
9t1_subscription1.unsubscribe()  
10subscription_set.unsubscribe()  

```

### Returns

None

## Unsubscribe all

Stop receiving real-time updates from all data streams and remove associated entities. Client-scoped.

### Method(s)

```
`1pubnub.unsubscribe_all()  
`
```

### Sample code

```
1channel = pubnub.channel(f'{channel}')  
2t1_subscription = channel.subscription()  
3t1_subscription.subscribe()  
4
  
5subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
6subscription_set.subscribe()  
7
  
8
  
9t1_subscription1.unsubscribe()  
10subscription_set.unsubscribe()  
11
  
12pubnub.unsubscribe_all()  

```

### Returns

None