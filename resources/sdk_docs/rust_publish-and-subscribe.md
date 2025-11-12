# Publish/Subscribe API for Rust SDK

Essential notes:
- Requires valid publish_key to publish and subscribe_key to subscribe.
- Messages are JSON-serializable data. Do not pre-serialize; SDK handles it.
- Max message size: 32 KiB (including channel name and escaping). Aim for <1,800 bytes. Over 32 KiB returns error.
- In-memory queue per subscriber: 100 messages. Publishing faster than subscribers can consume may drop older messages. Publish serially per channel and throttle as needed.
- Can't publish to multiple channels in a single call.
- Publish returns a Future; await it.
- Best-effort message retrieval from cursor (timetoken + region); not guaranteed.

## Publish

Add any of the following features to `Cargo.toml` to use this API:

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

For a list of all features, refer to [Available features](/docs/sdks/rust#available-features).

### Available in features
defaultfullpublish

- Publish anytime: You don't need to be subscribed to the channel.
- Message too large error: See support article: https://support.pubnub.com/hc/en-us/articles/360051495932-Calculating-Message-Payload-Size-Before-Publish
- Reliability recommendations:
  - Publish serially per channel.
  - Wait for success before sending next; on failure, retry.
  - Avoid overflowing 100-message in-memory queue.
  - Throttle (for example, ≤5 msgs/sec/channel) per app latency needs.

### Method(s)

To Publish a message you can use the following method(s) in the Rust SDK:

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
- publish_message (required)
  - Type: T: Serialize
  - Message payload.
- channel (required)
  - Type: Into<String>
  - Target channel ID.
- store
  - Type: Option<bool>
  - Default: Account default
  - Whether to store the message in Message Persistence.
- meta
  - Type: Option<HashMap<String, String>>
  - Additional key/value metadata for Filters.
- replicate
  - Type: bool
  - Whether to replicate across PoPs. See Replicated Transactions.
- ttl
  - Type: Option<u32>
  - Per-message TTL in hours when stored.
    1. If store = true and ttl = 0: stored with no expiry.
    2. If store = true and ttl = X: stored with X-hour expiry unless keyset retention is Unlimited.
    3. If store = false: ttl ignored.
    4. If ttl unspecified: defaults to key expiry value.
- use_post
  - Type: bool
  - Default: false
  - Use HTTP POST to publish.
- execute
  - Returns a Future; await it to execute.

### Sample code

Publish a message to a channel:

```
1
  

```

### Other examples

```
1
  

```

### Returns

The `publish()` operation returns a `PublishResult` which contains the timetoken, or a `PubNub Error` which contains the error indicator and the description of the error.

```
// success example  
PublishResult { timetoken: "16808621084073203" }  

  
// failure example  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  

```

## Subscribe

Add any of the following features to `Cargo.toml` to use this API:

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

For a list of all features, refer to [Available features](/docs/sdks/rust#available-features).

### Available in features
defaultfullsubscribe

- Opens a TCP socket and streams messages/events for specified entities.
- Configure with subscribe_key at initialization.
- Use with_retry_policy() to auto-reconnect and attempt retrieval of available messages on disconnect.

### Subscription scope

Two types:
- Subscription: entity-scoped (for example, a single channel).
- SubscriptionSet: client-scoped; can include multiple subscriptions. One event listener can receive all message types.

### Create a subscription

An entity-level `Subscription` allows you to receive messages and events for only that entity for which it was created.

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

Parameters:
- options (optional)
  - Type: Option<Vec<SubscriptionOptions>>
  - Subscription behavior configuration. Pass None for no options.

### Create a subscription set

A client-level `SubscriptionSet` allows you to receive messages and events for all entities in the set.

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

Parameters:
- parameters (required)
  - Type: SubscriptionParams<String>
  - channels: Option<&[String]> — Pass None for no channels.
  - channel_groups: Option<&[String]> — Pass None for no channel groups.
  - options: Option<Vec<SubscriptionOptions>> — Subscription behavior configuration. Pass None for no options.

Add/remove sets: You can add and remove subscription sets to create new sets.

#### SubscriptionOptions

`SubscriptionOptions` is an enum:
- ReceivePresenceEvents — deliver presence updates via listener streams. See Presence Events docs for details.

### Method(s)

`Subscription` and `SubscriptionSet` share methods:
- Subcribe
- Subscribe with timetoken

#### Subscribe

To subscribe, you can use the following method in the Rust SDK:

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
show all 20 lines

###### Create a subscription set from 2 sets

```
1// create a subscription set with multiple channels  
2let set1 = pubnub.subscription(parameters: (SubscriptionParams {  
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
show all 19 lines

##### Returns

The `subscribe()` method doesn't have a return value.

#### Subscribe with timetoken

To subscribe to real-time updates from a given timetoken:

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

Parameters:
- cursor (required)
  - Type: Into<SubscriptionCursor> | String | usize | u64
  - Cursor consists of timetoken and region: SubscriptionCursor{timetoken: String, region: u32}
  - Primitive types are converted; if not a 17-digit number or numeric string, the value is ignored.
  - Retrieval with cursor is best-effort, not guaranteed.

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

The `subscribe_with_timetoken()` method doesn't have a return value.

## Entities

Entities are subscribable objects for which you can receive real-time updates (messages, events, etc).

- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels

These methods return one or more local `Channel` entities.

```
pubnub.channel(String)  

  
pubnub.channels(&[String])  

```

Parameters:
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

These methods return one or more local `ChannelGroup` entities.

```
pubnub.channel_group(String)  

  
pubnub.channel_groups(&[String])  

```

Parameters:
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

These methods return one or more local `ChannelMetadata` entities.

```
pubnub.channel_metadata(String)  

  
pubnub.channels_metadata(&[String])  

```

Parameters:
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

These methods return one or more local `UserMetadata` entities.

```
pubnub.user_metadata(String)  

  
pubnub.users_metadata(&[String])  

```

Parameters:
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

Attach listeners to Subscription, SubscriptionSet, and PubNub client (status).

### Add listeners

Choose dedicated streams (messages, signals, files, etc.) or a generic Update stream.

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
show all 21 lines

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

Subscription status. See SDK statuses in Connection Management docs.

## Clone empty

Clone a subscription’s state with no attached listeners.

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

A new subscription instance with an empty event dispatcher.

## Unsubscribe

Stop receiving updates from a Subscription or SubscriptionSet.

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

Stop all streams and remove associated entities.

Client scope: Only available on the PubNub object.

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