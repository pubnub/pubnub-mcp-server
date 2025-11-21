# Publish/Subscribe API for Rust SDK (Condensed)

Use PubNub to publish and subscribe to messages with low latency. For conceptual overviews, see Connection Management and Publish Messages.

## Publish

Add features to Cargo.toml:

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
- Must configure a valid publish_key at initialization.
- You can publish without being subscribed.
- Message data: any JSON-serializable type; do not pre-serialize to JSON (SDK handles it).
- Max message size: 32 KiB (including channel name and escaped characters). Aim for < ~1,800 bytes for best performance. Exceeding 32 KiB returns an error.
- Publish rate: publish as bandwidth allows; subscribers have an in-memory queue limit of 100 messages. Excess may be dropped if subscribers can’t keep up.
- Publish to one channel at a time; multi-channel publish is not supported.
- Reliability best practices:
  - Publish serially per channel.
  - Wait for a success result before sending the next message.
  - Retry on failure.
  - Avoid overflowing the 100-message in-memory queue.
  - Throttle bursts as needed (for example, ≤ 5 msgs/sec per channel).

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
- publish_message (required): Type: T: Serialize. The message payload.
- channel (required): Type: Into<String>. Channel ID.
- store: Type: Option<bool>. Default: Account default. Whether to store in Message Persistence.
- meta: Type: Option<HashMap<String, String>>. Additional info for Filters.
- replicate: Type: bool. Whether to replicate across PoPs. See Replicated Transactions.
- ttl: Type: Option<u32>. Per-message TTL in Message Persistence.
  1) store=true, ttl=0 → stored with no expiry.
  2) store=true, ttl=X → expiry X hours (unless keyset retention is Unlimited).
  3) store=false → ttl ignored.
  4) ttl unspecified → defaults to key expiry value.
- use_post: Type: bool. Default: false. Use HTTP POST.
- execute: Executes the request; returns a Future to await.

### Sample code

```
1
  

```

### Other examples

```
1
  

```

### Returns

Publish returns PublishResult with timetoken or PubNub Error.

```
// success example  
PublishResult { timetoken: "16808621084073203" }  

  
// failure example  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  

```

## Subscribe

Add features to Cargo.toml:

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

Behavior:
- Opens a long-lived connection to receive messages/events on specified entities.
- Requires subscribe_key at initialization.
- New messages are received after subscribe() completes.
- Optional with_retry_policy() can reconnect and best-effort retrieve available messages after disconnects.

### Subscription scope

- Subscription: entity-level scope (for example, a channel).
- SubscriptionSet: client-level scope on a pubnub instance; can include multiple subscriptions.

Use event listeners to receive updates; see Event listeners.

### Create a subscription

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

- options (optional): Type: Option<Vec<SubscriptionOptions>>. Subscription behavior configuration. Pass None for no options.

### Create a subscription set

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

parameters: Type: SubscriptionParams<String>
- channels: Type: Option<&[String]>. Pass None for none.
- channel_groups: Type: Option<&[String]>. Pass None for none.
- options: Type: Option<Vec<SubscriptionOptions>>. Pass None for none.

Add/remove sets: you can compose and modify subscription sets (see examples below).

#### SubscriptionOptions

Enum variants:
- ReceivePresenceEvents: include presence updates in listener streams. See Presence Events for details.

### Method(s)

Common methods for Subscription and SubscriptionSet:
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

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

- cursor (required): Type: Into<SubscriptionCursor> (String, usize, u64). Cursor is best-effort and consists of timetoken and region: SubscriptionCursor{timetoken: String, region: u32}. Non-17-digit or non-numeric strings are ignored.

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

Create subscribable entities to receive real-time updates.

### Create channels

```
pubnub.channel(String)  

  
pubnub.channels(&[String])  

```

Parameters:
- channel: Type: String. Channel ID.
- channel: Type: &[String]. Slice of channel IDs.

#### Sample code

```
1
  

```

```
1
  

```

### Create channel groups

```
pubnub.channel_group(String)  

  
pubnub.channel_groups(&[String])  

```

Parameters:
- channel_group: Type: String. Channel group name.
- channel_groups: Type: &[String]. Slice of channel group names.

#### Sample code

```
1
  

```

```
1
  

```

### Create channel metadata

```
pubnub.channel_metadata(String)  

  
pubnub.channels_metadata(&[String])  

```

Parameters:
- channel_metadata: Type: String. Channel metadata identifier.
- channels_metadata: Type: &[String]. Slice of channel metadata identifiers.

#### Sample code

```
1
  

```

```
1
  

```

### Create user metadata

```
pubnub.user_metadata(String)  

  
pubnub.users_metadata(&[String])  

```

Parameters:
- user_metadata: Type: String. User metadata identifier.
- users_metadata: Type: &[String]. Slice of user metadata identifiers.

#### Sample code

```
1
  

```

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, or (for connection status) the PubNub client.

### Add listeners

Implement streams for specific update types or a generic stream.

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

Client scope only.

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

Clone a subscription with the same state but without any listeners.

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

Stop all streams and remove associated entities. Client scope only.

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