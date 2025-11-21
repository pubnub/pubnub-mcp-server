# Publish/Subscribe API for Python SDK

PubNub publishes and delivers messages to subscribers with low latency. Use synchronous or asynchronous execution patterns.

##### Request execution and return values

- `.sync()` returns an `Envelope` with:
  - `Envelope.result` (type varies by API)
  - `Envelope.status` (`PnStatus`)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

- `.pn_async(callback)` returns `None` and invokes your callback with `result` and `status`.

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

Send a message to all subscribers of a channel. Requires `publishKey` in configuration.

Key points:
- Initialization must include `publishKey`.
- You can publish without subscribing.
- You cannot publish to multiple channels simultaneously.
- Security: enable TLS/SSL via `ssl=True` during initialization; optional encryption supported.
- Message data: any JSON-serializable data (objects, arrays, numbers, strings, UTF‑8). Do not pass special classes/functions.
- Don't JSON serialize: pass raw objects for `message` and `meta`; the SDK serializes automatically.
- Size: max 32 KiB (including escapes and channel). Aim < ~1,800 bytes. Oversized payloads return `Message Too Large`.
- Throughput: publish as fast as bandwidth allows; soft limit applies if subscribers lag. In-memory queue per subscriber holds 100 messages; older messages may drop during bursts.
- `custom_message_type`: optional business-specific label, e.g., `text`, `action`, `poll`. Rules: 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or `pn_`/`pn-`.
- Best practices:
  - Publish serially; verify success before next publish.
  - On success expect codes like `[1,"Sent","<timetoken>"]`; on failure `[0,"...", "<timetoken>"]`, retry.
  - Keep queue under 100 messages; throttle bursts (e.g., ≤5 msg/s) to meet latency goals.

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
- channel (required, String): Channel ID.
- message (required, Object): Payload.
- custom_message_type (String): Business label; see rules above.
- should_store (Boolean, default: account setting): Store in History.
- meta (Object/Dictionary, default: None): Metadata for filtering.
- use_post (Boolean): Use POST to publish.

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

Send a message to Functions event handlers and Illuminate on a channel. Not delivered to subscribers and not stored.

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
- channel (required, String): Channel ID.
- message (required, Object): Payload.
- use_post (Boolean, default: False): Use POST.
- meta (Object, default: None): Metadata (filtering).

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

Send a lightweight signal to all channel subscribers.

- Payload limit: 64 bytes (payload only).

### Method(s)

```
`1pubnub.signal() \  
2    .message(Object) \  
3    .custom_message_type(String) \  
4    .channel(String)  
`
```

Parameters:
- message (required, Object): Payload.
- custom_message_type (String): Same rules as publish.
- channel (required, String): Channel ID.

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

Opens a TCP socket and listens for messages and events on entities. Configure `subscribe_key` during initialization. Enable automatic retries in configuration to reconnect and attempt to retrieve available messages if disconnected.

### Subscription scope

- `Subscription`: entity-scoped (for a specific channel, channel group, user metadata, or channel metadata).
- `SubscriptionSet`: client-scoped (can include one or more `Subscription`s).

### Create a subscription

```
`1# entity-based, local-scoped  
2subscription = pubnub.channel(f'{channel}').subscription(with_presence: bool = False)  
`
```

Parameter:
- with_presence (bool): Deliver presence updates via listener streams. See Presence Events docs for details.

### Create a subscription set

```
`1# client-based, general-scoped  
2subscription_set = pubnub.subscription_set(subscriptions: List[PubNubSubscription])  
`
```

Parameter:
- subscriptions (List[PubNubSubscription], required): Channels/channel groups to include.

### Method(s)

#### Subscribe

```
`1subscription.subscribe(timetoken: Optional[int] = None, region: Optional[str] = None,)  
`
```

Parameters:
- timetoken (int): Start from timetoken for best-effort cached message retrieval (17-digit recommended).
- region (String): Region where the message was published.

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

None

## Entities

Subscribable objects you can receive real-time updates from.

- `PubNubChannel`
- `PubNubChannelGroup`
- `PubNubUserMetadata`
- `PubNubChannelMetadata`

### Create channels

```
`pubnub.channel(String)  
`
```

Parameter:
- channel (String): Channel ID.

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

Parameter:
- channel_group (String): Channel group name.

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

Parameter:
- channel_metadata (String): Channel metadata identifier.

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

Parameter:
- user_metadata (String): User metadata identifier.

#### Sample code

```
`pubnub.userMetadata("user_metadata")  
`
```

## Event listeners

Attach listeners to `Subscription`, `SubscriptionSet`, or (for connection status) the PubNub client to receive messages, signals, presence, metadata updates, files, and status events.

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

Client scope only.

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

Subscription status (see SDK statuses in Connection Management).

## Unsubscribe

Stop receiving updates from a `Subscription` or `SubscriptionSet`.

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

Client scope only. Stop receiving updates from all data streams and remove associated entities.

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