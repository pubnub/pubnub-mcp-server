# Publish/Subscribe API for Rust SDK

PubNub delivers messages worldwide in less than 30 ms.

For high-level concepts, see Connection Management and Publish Messages.

## Publish

Add any of the following features to Cargo.toml:

```
`[dependencies]  
# default  
pubnub = "0.7.0"   
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# no default features, just Publish   
pubnub = { version = "0.7.0", default-features = false, features = ["publish"] }  
`
```

Available in features: default, full, publish.

Requirements and behavior:
- Requires a valid publish_key at initialization.
- You don’t need to be subscribed to publish.
- Message data: any JSON-serializable type (objects, arrays, numbers, strings; UTF‑8 strings allowed). Don’t JSON-serialize manually; the SDK does it for you.
- Max message size: 32 KiB (including channel and escapes). Aim for < ~1,800 bytes for optimal performance. Exceeding 32 KiB returns an error.
- Publish rate: publish as fast as bandwidth allows; subscribers have an in-memory queue limit of 100 messages (older messages may drop if overwhelmed).
- You can’t publish to multiple channels simultaneously; publish per channel.
- Reliability best practices:
  - Publish serially per channel.
  - Check success return (for example, [1,"Sent","136074940..."]) and publish next only after success.
  - Retry on failure (for example, [0,"blah","<timetoken>"]).
  - Avoid overflowing subscriber queues (100 messages).
  - Throttle bursts per channel (for example, ≤5 msg/sec depending on latency needs).

### Method(s)

```
`1pubnub  
2    .publish_message(T: Serialize)  
3    .channel(IntoString>)  
4    .store(Optionbool>)  
5    .meta(OptionHashMapString, String>>)  
6    .replicate(bool)  
7    .ttl(Optionu32>)  
8    .use_post(bool)  
9    .execute()  
`
```

Parameters:
- publish_message
  - Type: T: Serialize
  - The message payload (any Serialize type).
- channel
  - Type: Into<String>
  - Target channel ID.
- store
  - Type: Option<bool>
  - Default: account default
  - Whether to store in Message Persistence.
- meta
  - Type: Option<HashMap<String, String>>
  - Additional info for Filters.
- replicate
  - Type: bool
  - Whether to replicate across points of presence.
- ttl
  - Type: Option<u32>
  - Per-message TTL (hours) in Message Persistence:
    1) If store = true and ttl = 0 → stored with no expiry.
    2) If store = true and ttl = X → expires in X hours (unless keyset retention is Unlimited).
    3) If store = false → ttl ignored.
    4) If ttl not specified → uses key expiry configuration.
- use_post
  - Type: bool
  - Default: false
  - Use HTTP POST.
- execute
  - Executes the request; returns a Future to await.

### Sample code

```
1
  

```

### Other examples

```
1
  

```

### Returns

The publish() operation returns a PublishResult with timetoken, or a PubNub Error.

```
// success example  
PublishResult { timetoken: "16808621084073203" }  

  
// failure example  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  

```

## Subscribe

Add any of the following features to Cargo.toml:

```
`[dependencies]  
# default  
pubnub = "0.7.0"   
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Subscribe   
pubnub = { version = "0.7.0", features = ["subscribe"] }  
`
```

Available in features: default, full, subscribe.

Behavior and requirements:
- Opens a TCP socket and listens for messages/events on specified entities. Requires subscribe_key at initialization.
- New subscribers receive messages after subscribe() completes.
- You can configure with_retry_policy() to auto-reconnect and attempt to retrieve available messages on disconnect.

### Subscription scope

Two types:
- Subscription: entity-scoped (for example, a specific channel).
- SubscriptionSet: client-scoped (global across entities added to the set). A set can contain one or more subscriptions.

Event listeners deliver messages, signals, and events; see Event listeners.

### Create a subscription

Entity-level Subscription for a single entity.

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

- options
  - Type: Option<Vec<SubscriptionOptions>>
  - Subscription behavior configuration. Use None for no options.

### Create a subscription set

Client-level SubscriptionSet across channels and/or channel groups.

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

- parameters
  - Type: SubscriptionParams<String>
  - channels
    - Type: Option<&[String]>
  - channel_groups
    - Type: Option<&[String]>
  - options
    - Type: Option<Vec<SubscriptionOptions>>
    - Subscription behavior configuration. Use None for no options.

Add/remove sets: You can add and remove subscription sets to create new sets (see examples).

#### SubscriptionOptions

Enum variants:
- ReceivePresenceEvents: deliver presence updates for userIds through listener streams.

### Method(s)

- Subscribe
- Subscribe with timetoken

#### Subscribe

```
`subscription.subscribe()  
`
```

##### Sample code

```
1
  

```

##### Other examples

###### Create a subscription set from 2 individual subscriptions

```
1// create a subscription from a channel entity  
2let channel = client.channel("channelName");  
3let subscription1 = channel.subscription(options: OptionVecSubscriptionOptions>>);  
4
  
5// create a subscription from a channel group entity  
6let channel_group = client.channel_group("channelGroup");  
7let subscription2 = channel_group.subscription(options: OptionVecSubscriptionOptions>>);  
8
  
9// create a subscription set from individual entities  
10let set = subscription1 + subscription2;  
11
  
12// Add another subscription to the set  
13set += subscription3  
14// Or  
15set.add_subscriptions(subscription3)  
16
  
17// Remove a subscription from the set  
18set -= subscription3  
19// Or  
20set.sub_subscriptions(subscription3)  

```

###### Create a subscription set from 2 sets

```
1// create a subscription set with multiple channels  
2let set1 = pubnab.subscription(parameters: (SubscriptionParams {  
3    channels: Some(&["channelName1", "channelName2"]),  
4    channel_groups: None,  
5    options: None  
6}))  
7
  
8// create a subscription set with multiple channel groups and options  
9let set2 = pubnub.subscription(parameters: (SubscriptionParams {  
10    channels: None,  
11    channel_groups: Some(&["channelGroup1", "channelGroup2"]),  
12    options: OptionVecSubscriptionOptions>>  
13}))  
14
  
15// create a new subscription set from 2 sets  
16let set_of_channels_and_channel_groups = set1 + set2;  
17
  
18// you can also remove sets  
19let set_of_channels_only = set_of_channels_and_channel_groups - set2;  

```

##### Returns

subscribe() has no return value.

#### Subscribe with timetoken

Subscribe from a given timetoken cursor (best-effort retrieval).

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

- cursor
  - Type: Into<SubscriptionCursor> (String | usize | u64)
  - Cursor includes timetoken and region: SubscriptionCursor{timetoken: String, region: u32}. Primitive values are converted; if not a 17-digit number or numeric string, value is ignored.

##### Sample code

```
1let subscription = pubnub.subscription(SubscriptionParams {  
2    channels: Some(&["my_channel", "other_channel"]),  
3    channel_groups: None,  
4    options: Some(vec![SubscriptionOptions::ReceivePresenceEvents]),  
5});  
6
  
7let cursor = SubscriptionCursor {  
8    timetoken: "100000000000".to_string(),  
9    region: 1,  
10};  
11
  
12subscription.subscribe_with_timetoken(cursor);  

```

##### Returns

subscribe_with_timetoken() has no return value.

## Entities

Subscribable objects for real-time updates:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels

These methods return one or more local Channel entities.

```
pubnub.channel(String)  

  
pubnub.channels(&[String])  

```

- channel
  - Type: String
  - Channel ID.
- channel
  - Type: &[String]
  - Slice of channel IDs.

#### Sample code

```
1
  

```

```
1
  

```

### Create channel groups

These methods return one or more local ChannelGroup entities.

```
pubnub.channel_group(String)  

  
pubnub.channel_groups(&[String])  

```

- channel_group
  - Type: String
  - Channel group name.
- channel_groups
  - Type: &[String]
  - Slice of channel group names.

#### Sample code

```
1
  

```

```
1
  

```

### Create channel metadata

These methods return one or more local ChannelMetadata entities.

```
pubnub.channel_metadata(String)  

  
pubnub.channels_metadata(&[String])  

```

- channel_metadata
  - Type: String
  - Channel metadata identifier.
- channels_metadata
  - Type: &[String]
  - Slice of channel metadata identifiers.

#### Sample code

```
1
  

```

```
1
  

```

### Create user metadata

These methods return one or more local UserMetadata entities.

```
pubnub.user_metadata(String)  

  
pubnub.users_metadata(&[String])  

```

- user_metadata
  - Type: String
  - User metadata identifier.
- users_metadata
  - Type: &[String]
  - Slice of user metadata identifiers.

#### Sample code

```
1
  

```

```
1
  

```

## Event listeners

Attach listeners on Subscription, SubscriptionSet, and client (status) to receive messages and events.

### Add listeners

You can use typed streams (Message, File, etc.) or a generic Update stream.

#### Method(s)

```
subscription  
    /// Stream used to notify regular messages.  
    .messages_stream() -> DataStreamMessage>;  

  
    /// Stream used to notify signals.  
    .signals_stream() -> DataStreamMessage>;  

  
    /// Stream used to notify message action updates.  
    .message_actions_stream() -> DataStreamMessageAction>;  

  
    /// Stream used to notify about file receive.  
    .files_stream() -> DataStreamFile>;  

  
    /// Stream used to notify about App Context (Channel and User) updates.  
    .app_context_stream() -> DataStreamAppContext>;  

  
    /// Stream used to notify about subscribers' presence updates.  
    .presence_stream() -> DataStreamPresence>;  

  
    /// Generic stream used to notify all updates mentioned above.  
    .stream() -> DataStreamUpdate>;  

```

#### Sample code

```
1
  

```

### Add connection status listener

Client-only listener for connection status updates.

#### Method(s)

```
`1pubnub.status_stream()  
`
```

#### Sample code

```
1
  

```

#### Returns

Subscription status (see SDK statuses).

## Clone empty

Clone an existing subscription with the same state but no listeners.

### Method(s)

```
`1subscription.clone_empty()  
`
```

### Sample code

```
1
  

```

### Returns

New subscription instance with an empty event dispatcher.

## Unsubscribe

Stop receiving real-time updates from a Subscription or SubscriptionSet.

### Method(s)

```
subscription.unsubscribe()  

  
subscription_set.unsubscribe()  

```

### Sample code

```
1let subscription = client.subscription(SubscriptionParams {  
2    channels: Some(&["my_channel", "other_channel"]),  
3    channel_groups: None,  
4    options: None  
5});  
6subscription.subscribe(None);  
7
  
8subscription.unsubscribe();  

```

### Returns

None

## Unsubscribe all

Stop receiving real-time updates from all data streams and remove associated entities.

Client scope: available only on the PubNub object.

### Method(s)

```
`1pubnub.unsubscribe_all()  
`
```

### Sample code

```
1let subscription = client.subscription(SubscriptionParams {  
2    channels: Some(&["my_channel", "other_channel"]),  
3    channel_groups: None,  
4    options: None  
5});  
6subscription.subscribe();  
7
  
8let channel_group = client.channel_group("my_channel_group");  
9let cg_subscription = channel_group.subscription(None);  
10cg_subscription.subscribe();  
11
  
12pubnub.unsubscribe_all();  

```

### Returns

None

Last updated on Sep 9, 2025