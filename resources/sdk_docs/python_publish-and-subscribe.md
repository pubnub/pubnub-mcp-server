# PubNub Python SDK – Publish / Subscribe Quick Reference

This condensed guide keeps every code block, method signature, parameter list, and limit from the original documentation.

---

## Synchronous vs Asynchronous Execution
`.sync()` → returns an `Envelope`  
`.pn_async(callback)` → returns `None`, result passed to callback

```
`pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .sync()`
```

```
`def my_callback_function(result, status):
    print(f'TT: {result.timetoken}, status: {status.category.name}')

pubnub.publish() \
    .channel("myChannel") \
    .message("Hello from PubNub Python SDK") \
    .pn_async(my_callback_function)`
```

`Envelope` fields  
• `result` – type per-API • `status` – `PnStatus`

---

## Publish

### Essentials
• `publishKey` required at initialization.  
• No need to be subscribed to publish.  
• One channel per call (serial, not concurrent).  
• SSL/TLS: set `ssl=True` during initialization; optional encryption via `crypto_module`.  
• Message: any JSON-serializable data; do NOT pre-serialize `message` or `meta`.  
• Size limit: 32 KiB (optimum < 1 800 bytes).  
• Throughput: queue holds 100 msgs; throttle bursts.  
• Optional `custom_message_type` (3-50 chars, no leading `pn_`/`pn-`).  

### Method

```
`pubnub.publish() \
    .channel(String) \
    .message(Object) \
    .custom_message_type(String) \
    .should_store(Boolean) \
    .meta(Dictionary) \
    .use_post(Boolean)`
```

Parameter | Type | Default | Notes
----------|------|---------|------
`channel`* | String | — | Target channel
`message`* | Object | — | Payload
`custom_message_type` | String | — | e.g. `text`, `action`
`should_store` | Boolean | account default | Store in History
`meta` | Object | None | For message filters

### Sample Code

```
`import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.exceptions import PubNubException


def publish_message(pubnub: PubNub):
    try:
        envelope = pubnub.publish() \
            .channel("my_channel") \
            .message({
                'name': 'Alex',
                'online': True
            }) \
            .custom_message_type("text-message") \
`
```
show all 37 lines
```
`import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.exceptions import PubNubException


def publish_message(pubnub: PubNub):
    try:
        envelope = pubnub.publish(
            channel="my_channel",
            message={
                'name': 'Alex',
                'online': True
            },
            custom_message_type="text-message"
`
```
show all 38 lines

#### Publish with metadata

```
`def publish_callback(result, status):
    pass
    # handle publish result, status always present, result if successful
    # status.is_error() to see if error happened

pubnub.publish().channel("my_channel").message(["hello", "there"]) \
    .meta({'name': 'Alex'}).pn_async(publish_callback)`
```

### Return

`PNPublishResult` in `Envelope.result`  
```
`Publish success with timetoken 17193163560057793`
```

---

## Fire (Functions-only, not delivered to subscribers)

```
`pubnub.fire() \
    .channel(String) \
    .message(Object) \
    .use_post(Boolean) \
    .meta(Object)`
```

Parameters: `channel`*, `message`*, `use_post` (False), `meta` (Object).

Sample:

```
`envelope = pubnub.fire() \
    .channel('my_channel') \
    .message('hello there') \
    .use_post(True) \
    .sync()
print(f'fire timetoken: {envelope.result.timetoken}')`
```

```
`fire = pubnub.fire(channel="my_channel", message='hello there').sync()
print(f'fire timetoken: {fire.result.timetoken}')`
```

Return:

```
`Fire success with timetoken 17193163560057793`
```

---

## Signal  (≤ 64 byte payload)

```
`pubnub.signal() \
    .message(Object) \
    .custom_message_type(String) \
    .channel(String)`
```

Sample:

```
`envelope = pubnub.signal() \
    .channel('some_channel') \
    .message('foo') \
    .custom_message_type('text-message') \
    .sync()`
```

```
`signal = pubnub.signal(channel="my_channel",
                       message='hello there',
                       custom_message_type='text-message').sync()
print(f'signal timetoken: {signal.result.timetoken}')`
```

Return:

```
`Signal success with timetoken 17193165584676126`
```

---

## Subscribe

Initialization must include `subscribeKey`.

### Entities & Scopes
• `Subscription` (single entity)  
• `SubscriptionSet` (multiple entities via client)

### Create Subscription

```
`# entity-based, local-scoped
subscription = pubnub.channel(f'{channel}').subscription(with_presence: bool = False)`
```

### Create Subscription Set

```
`# client-based, general-scoped
subscription_set = pubnub.subscription_set(subscriptions: List[PubNubSubscription])`
```

### Subscribing

```
`subscription.subscribe(timetoken: Optional[int] = None,
                        region: Optional[str] = None,)`
```

Sample:

```
`# single channel subscription
channel = pubnub.channel(f'{channel}')
t1_subscription = channel.subscription()
t1_subscription.subscribe()

# multiple channel subscription
channel_1 = pubnub.channel(channel).subscription()
channel_2 = pubnub.channel(f'{channel}.2').subscription(with_presence=True)
channel_x = pubnub.channel(f'{channel}.*').subscription(with_presence=True)
group = pubnub.channel_group('group-test').subscription()
subscription_set = pubnub.subscription_set([channel_1, channel_2, channel_x, group])
set_subscription = subscription_set.subscribe()`
```

---

## Entities

```
`pubnub.channel(String)`
`pubnub.channel_group(String)`
`pubnub.channel_metadata(String)`
`pubnub.user_metadata(String)`
```

Samples:

```
`pubnub.channel(f'{channel1}')`
```
```
`pubnub.channel_group("channelGroupName")`
```
```
`pubnub.channel_metadata("channelMetadata")`
```
```
`pubnub.userMetadata("user_metadata")`
```

---

## Event Listeners

### Adding Listeners

```
`# Add event-specific listeners

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
`
```
show all 77 lines

Sample:

```
`subscription = pubnub.channel(f'{channel1}').subscription()

def on_message(listener):
    def message_callback(message):
        print(f"\033[94mMessage received on: {listener}: \n{message.message}\033[0m\n")
    return message_callback

def on_message_action(message_action):
    print(f"\033[5mMessageAction received: \n{message_action.value}\033[0m\n")

subscription.on_message = on_message('message_listener')
subscription.on_message_action = on_message_action

subscription.subscribe()`
```
show all 20 lines

### Connection Status Listener (client-level)

```
`class PrintListener(SubscribeListener):
    def status(self, pubnub, status):
        print(f'Status:\n{status.__dict__}')

    def message(self, pubnub, message):
        pass

    def presence(self, pubnub, presence):
        pass

listener = PrintListener()
pubnub.add_listener(listener)`
```

---

## Unsubscribe

```
`subscription.unsubscribe()

subscription_set.unsubscribe()`
```

Sample:

```
`channel = pubnub.channel(f'{channel}')
t1_subscription = channel.subscription()
t1_subscription.subscribe()

subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])
subscription_set.subscribe()


t1_subscription1.unsubscribe()
subscription_set.unsubscribe()`
```

## Unsubscribe All  (client-level)

```
`pubnub.unsubscribe_all()`
```

Sample:

```
`channel = pubnub.channel(f'{channel}')
t1_subscription = channel.subscription()
t1_subscription.subscribe()

subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])
subscription_set.subscribe()


t1_subscription1.unsubscribe()
subscription_set.unsubscribe()

pubnub.unsubscribe_all()`
```

---