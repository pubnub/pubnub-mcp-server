# Publish / Subscribe – Python SDK (Condensed)

The following keeps every code block, all method signatures, parameters, and essential limits or behaviors. Non-technical narrative has been removed.

---

## Request Execution

Synchronous (`.sync()`) returns an `Envelope(result, status)`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

Asynchronous (`.pn_async(callback)`) returns `None` and invokes your callback.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

---

## Publish

* Requires `publishKey` at initialization.  
* Max payload (including channel/name): 32 KiB (optimum < 1 800 bytes).  
* One channel per call; publish serially and check success `[1,"Sent",<timetoken>]`.  
* Optional: `ssl` for TLS, CryptoModule for encryption, `custom_message_type`.

### Method

```
`pubnub.publish() \  
    .channel(String) \  
    .message(Object) \  
    .custom_message_type(String) \  
    .should_store(Boolean) \  
    .meta(Dictionary) \  
    .use_post(Boolean)  
`
```

Parameter summary (required unless stated):

* `channel` (str) – destination channel.  
* `message` (object) – JSON-serializable payload.  
* `custom_message_type` (str, 3-50 chars, no `pn_`/`pn-`).  
* `should_store` (bool, default account setting).  
* `meta` (dict) – for filtering.

### Examples

Builder pattern:

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

Named arguments:

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

With metadata:

```
`def publish_callback(result, status):  
    pass  
    # handle publish result, status always present, result if successful  
    # status.is_error() to see if error happened  
  
pubnub.publish().channel("my_channel").message(["hello", "there"]) \  
    .meta({'name': 'Alex'}).pn_async(publish_callback)  
`
```

Return type:

Field | Type | Description  
--- | --- | ---  
`result` | `PNPublishResult` | timetoken.  
`status` | `PNStatus` | status info.

```
`Publish success with timetoken 17193163560057793  
`
```

---

## Fire

* Triggers Functions/Illuminate only; not replicated, not stored, not delivered to subscribers.

### Method

```
`pubnub.fire() \  
    .channel(String) \  
    .message(Object) \  
    .use_post(Boolean) \  
    .meta(Object)  
`
```

Parameters: `channel`, `message`, `use_post=False`, `meta=None`.

### Examples

```
`envelope = pubnub.fire() \  
    .channel('my_channel') \  
    .message('hello there') \  
    .use_post(True) \  
    .sync()  
print(f'fire timetoken: {envelope.result.timetoken}')  
`
```

```
`fire = pubnub.fire(channel="my_channel", message='hello there').sync()  
print(f'fire timetoken: {fire.result.timetoken}')  
`
```

Return:

```
`Fire success with timetoken 17193163560057793  
`
```

---

## Signal

* Lightweight; default payload limit 64 bytes (payload only).

### Method

```
`pubnub.signal() \  
    .message(Object) \  
    .custom_message_type(String) \  
    .channel(String)  
`
```

Parameters: `message`, `custom_message_type`, `channel`.

### Examples

```
`envelope = pubnub.signal() \  
    .channel('some_channel') \  
    .message('foo') \  
    .custom_message_type('text-message') \  
    .sync()  
`
```

```
`signal = pubnub.signal(channel="my_channel", message='hello there', custom_message_type='text-message').sync()  
print(f'signal timetoken: {signal.result.timetoken}')  
`
```

Return:

```
`Signal success with timetoken 17193165584676126  
`
```

---

## Subscribe

Requires `subscribeKey`. Two scopes:

1. `Subscription` (single entity)  
2. `SubscriptionSet` (multiple entities)

### Create Subscription

```
`# entity-based, local-scoped  
subscription = pubnub.channel(f'{channel}').subscription(with_presence: bool = False)  
`
```

### Create Subscription Set

```
`# client-based, general-scoped  
subscription_set = pubnub.subscription_set(subscriptions: List[PubNubSubscription])  
`
```

### Subscribe Method

```
`subscription.subscribe(timetoken: Optional[int] = None, region: Optional[str] = None,)  
`
```

Return: none.

### Sample

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
  
set_subscription = subscription_set.subscribe()  
`
```

---

## Entities

Methods for local representations:

```
`pubnub.channel(String)  
`
```

```
`pubnub.channel(f'{channel1}')  
`
```

```
`pubnub.channel_group(String)  
`
```

```
`pubnub.channel_group("channelGroupName")  
`
```

```
`pubnub.channel_metadata(String)  
`
```

```
`pubnub.channel_metadata("channelMetadata")  
`
```

```
`pubnub.user_metadata(String)  
`
```

```
`pubnub.userMetadata("user_metadata")  
`
```

---

## Event Listeners

Attach listeners to `Subscription`, `SubscriptionSet`, or client.

### Add Listeners

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

Example:

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
  
subscription.subscribe()  
  
`
```
show all 20 lines

### Connection Status Listener (client-scope)

Method:

```
`pubnub.add_listener()  
`
```

Example:

```
`class PrintListener(SubscribeListener):  
    def status(self, pubnub, status):  
        print(f'Status:\n{status.__dict__}')  
  
    def message(self, pubnub, message):  
        pass  
  
    def presence(self, pubnub, presence):  
        pass  
  
listener = PrintListener()  
pubnub.add_listener(listener)  
`
```

---

## Unsubscribe

Method(s):

```
`subscription.unsubscribe()  
  
subscription_set.unsubscribe()  
`
```

Example:

```
`channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  
  
subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
subscription_set.subscribe()  
  
  
t1_subscription1.unsubscribe()  
subscription_set.unsubscribe()  
`
```

Return: none.

---

## Unsubscribe All (client-scope)

Method:

```
`pubnub.unsubscribe_all()  
`
```

Example:

```
`channel = pubnub.channel(f'{channel}')  
t1_subscription = channel.subscription()  
t1_subscription.subscribe()  
  
subscription_set1 = pubnub.subscription_set(channels=['channel1', 'channel2'])  
subscription_set.subscribe()  
  
  
t1_subscription1.unsubscribe()  
subscription_set.unsubscribe()  
  
pubnub.unsubscribe_all()  
`
```

Return: none.