# Publish/Subscribe – Rust SDK (Condensed)

---

## Publish

Critical details:
• `publish_key` required at initialization  
• Max payload: 32 KiB (ideal ≤1 800 B). Errors returned if exceeded.  
• Any JSON-serializable type; **do not pre-serialize** payload.  
• One channel per call; publishing and subscriber pace must match (100-message in-memory queue).  

### Method

```
`pubnub  
    .publish_message(T: Serialize)  
    .channel(IntoString>)  
    .store(Optionbool>)  
    .meta(OptionHashMapString, String>>)  
    .replicate(bool)  
    .ttl(Optionu32>)  
    .use_post(bool)  
    .execute()  
`
```

### Parameters (essentials)

* `publish_message` (T: Serialize) – message payload.  
* `channel` (Into<String>) – target channel.  
* `store` (Option<bool>) – enable Message Persistence.  
* `meta` (Option<HashMap<String,String>>) – data for Filters.  
* `replicate` (bool) – replicate across PoPs.  
* `ttl` (Option<u32>) – hours to live:  
  1. `store=true, ttl=0` → no expiry  
  2. `store=true, ttl=X` → X hours (ignored if unlimited retention)  
  3. `store=false` → `ttl` ignored  
  4. unset `ttl` → key-level default  
* `use_post` (bool) – send via HTTP POST.  
* `execute()` – returns `Future`; `.await` required.

### Sample code

```
`  
`
```

### Other examples

```
`  
`
```

### Returns

```
`// success  
PublishResult { timetoken: "16808621084073203" }  
  
// failure  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  
`
```

---

## Subscribe

Requirements: valid `subscribe_key`. Auto-reconnect available via `with_retry_policy()`.

### Subscription objects

1. `Subscription` – single entity (channel, group, metadata).  
2. `SubscriptionSet` – multiple entities/global.

#### Create a subscription

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

#### Create a subscription set

```
`// client-based, general-scoped  
pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Option&[String]>,  
    channel_groups: Option&[String]>,  
    options: OptionVecSubscriptionOptions>>  
}))  
`
```

`SubscriptionOptions` enum:  
• `ReceivePresenceEvents` – deliver presence updates.

### Methods

```
`subscription.subscribe()  
`
```

Sample code

```
`  
`
```

##### Compose sets

```
`// individual subscriptions → set  
let channel = client.channel("channelName");  
let subscription1 = channel.subscription(options: OptionVecSubscriptionOptions>>);  
let channel_group = client.channel_group("channelGroup");  
let subscription2 = channel_group.subscription(options: OptionVecSubscriptionOptions>>);  
let set = subscription1 + subscription2;  
set += subscription3  
// Or  
set.add_subscriptions(subscription3)  
`
```

```
`// merge two sets  
let set1 = pubnub.subscription(parameters: (SubscriptionParams {  
    channels: Some(&["channelName1", "channelName2"]),  
    channel_groups: None,  
    options: None  
}))  
let set2 = pubnub.subscription(parameters: (SubscriptionParams {  
    channels: None,  
    channel_groups: Some(&["channelGroup1", "channelGroup2"]),  
    options: OptionVecSubscriptionOptions>>  
}))  
// create a new subscription set from 2 sets  
`
```

#### Subscribe with timetoken

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

Sample:

```
`let subscription = pubnub.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: Some(vec![SubscriptionOptions::ReceivePresenceEvents]),  
});  
  
let cursor = SubscriptionCursor {  
    timetoken: "100000000000".to_string(),  
    region: 1,  
};  
  
subscription.subscribe_with_timetoken(cursor);  
`
```

---

## Entities

Creation helpers:

```
`pubnub.channel(String)  
pubnub.channels(&[String])  
`
```

```
`pubnub.channel_group(String)  
pubnub.channel_groups(&[String])  
`
```

```
`pubnub.channel_metadata(String)  
pubnub.channels_metadata(&[String])  
`
```

```
`pubnub.user_metadata(String)  
pubnub.users_metadata(&[String])  
`
```

Sample code blocks (placeholders):

```
`  
`
```

---

## Event Listeners

```
`subscription  
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
`
```

Client connection status:

```
`pubnub.status_stream()  
`
```

---

## Clone (empty listeners)

```
`subscription.clone_empty()  
`
```

---

## Unsubscribe

```
`subscription.unsubscribe()  
subscription_set.unsubscribe()  
`
```

Example:

```
`let subscription = client.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: None  
});  
subscription.subscribe(None);  
subscription.unsubscribe();  
`
```

---

## Unsubscribe All (client scope)

```
`pubnub.unsubscribe_all()  
`
```

Example:

```
`let subscription = client.subscription(SubscriptionParams {  
    channels: Some(&["my_channel", "other_channel"]),  
    channel_groups: None,  
    options: None  
});  
subscription.subscribe();  
  
let channel_group = client.channel_group("my_channel_group");  
let cg_subscription = channel_group.subscription(None);  
cg_subscription.subscribe();  
  
pubnub.unsubscribe_all();  
`
```

_Last updated Jul 15 2025_