# Publish/Subscribe API for Rust SDK

PubNub delivers messages globally in <30 ms. Publish to a channel and all subscribers receive the message.

For concepts and setup, see Connection Management and Publish Messages.

## Publish

Add one of these to Cargo.toml:

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

For a full list, see Available features.

### Available in features
default full publish

`publish_message()` sends a message to all subscribers on a channel. Requires a valid publish_key during initialization.

- Publish anytime: You don't need to be subscribed to publish.
- Message data: Any JSON-serializable data (objects, arrays, numbers, strings, UTF‑8).
- Don't JSON serialize: Pass the object; SDK serializes for you.
- Message size: Max 32 KiB (including channel and escapes). Aim < ~1.8 KiB for optimal performance.
- Message too large: >32 KiB returns an error (see payload size guide).
- Publish rate: Soft limit based on subscriber capacity. In-memory queue holds 100 messages; older messages may drop if overwhelmed.
- Multiple channels: Not supported in a single call; publish per channel.
- Reliability best practices:
  - Publish to a channel serially (not concurrently).
  - Check success code (e.g., [1,"Sent","136074940..."]) before sending next.
  - Retry on failure ([0,"blah","<timetoken>"]).
  - Avoid exceeding 100-message in-memory queue.
  - Throttle as needed (e.g., ≤5 msgs/sec per channel).

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

- publish_message (required)
  - Type: T: Serialize
  - The message payload.
- channel (required)
  - Type: Into<String>
  - The destination channel ID.
- store
  - Type: Option<bool>
  - Default: Account default
  - Store in Message Persistence.
- meta
  - Type: Option<HashMap<String, String>>
  - Additional metadata for Filters.
- replicate
  - Type: bool
  - Replicate across PoPs (see Replicated Transactions).
- ttl
  - Type: Option<u32>
  - Per-message TTL (hours) in Message Persistence.
    1. If store = true and ttl = 0: no expiry.
    2. If store = true and ttl = X: expires in X hours (unless Unlimited retention).
    3. If store = false: ttl ignored.
    4. If ttl not provided: defaults to key’s expiry.
- use_post
  - Type: bool
  - Default: false
  - Use HTTP POST to publish.
- execute
  - Returns a Future; must .await.

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

Publish returns PublishResult { timetoken } or a PubNub Error.

```
// success example  
PublishResult { timetoken: "16808621084073203" }  

  
// failure example  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  

```

## Subscribe

Add one of these to Cargo.toml:

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

For a full list, see Available features.

### Available in features
default full subscribe

Subscribe creates an open TCP socket and listens for messages/events on specified entities. Requires a valid subscribe_key at initialization.

Use with_retry_policy() to auto-reconnect and attempt to retrieve available messages after disconnects.

### Subscription scope

Use entity-level Subscription (single entity) or client-level SubscriptionSet (global scope, multiple subscriptions). Add event listeners to receive updates (see Event listeners).

### Create a subscription

Entity-level Subscription for a specific entity:

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

- options (optional)
  - Type: Option<Vec<SubscriptionOptions>>
  - Subscription behavior configuration. Pass None for no options.

### Create a subscription set

Client-level SubscriptionSet for multiple entities:

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

- parameters (required)
  - Type: SubscriptionParams<String>
  - channels: Option<&[String]>
  - channel_groups: Option<&[String]>
  - options: Option<Vec<SubscriptionOptions>>

Add/remove sets: You can add or remove subscription sets to compose new sets (see Other examples).

#### SubscriptionOptions

Enum variants include:
- ReceivePresenceEvents: deliver presence updates for userIds. See Presence Events.

### Method(s)

Subscription and SubscriptionSet share:

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

Create a subscription set from 2 individual subscriptions:
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

Create a subscription set from 2 sets:
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

##### Returns

subscribe() has no return value.

#### Subscribe with timetoken

Start receiving from a given timetoken:

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

- cursor (required)
  - Type: Into<SubscriptionCursor> | String | usize | u64
  - Best-effort retrieval of available cached messages from cursor (timetoken + region): SubscriptionCursor{timetoken: String, region: u32}. Non-17-digit numeric inputs or non-numeric strings are ignored.

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

Subscribable entities:

- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels

Return one or more local Channel entities.

```
pubnub.channel(String)  

  
pubnub.channels(&[String])  

```

- channel
  - Type: String
  - Channel ID to create a subscription of.
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

Return one or more local ChannelGroup entities.

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

Return one or more local ChannelMetadata entities.

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

Return one or more local UserMetadata entities.

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

Attach listeners to Subscription, SubscriptionSet, and (for connection status) the PubNub client.

### Add listeners

Implement typed streams or a generic stream:

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

Client-only listener for connection status.

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

Create a clone of an existing subscription with the same state but no listeners.

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

Stop all real-time updates and remove associated entities.

Client scope: Only on the PubNub object.

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