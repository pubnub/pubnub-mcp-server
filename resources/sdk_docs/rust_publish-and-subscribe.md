# Publish/Subscribe – Rust SDK (Condensed)

Below is the essential reference for PubNub’s Rust Publish/Subscribe APIs.  
All code blocks, method signatures, parameters, and critical limits are preserved.

---

## Publish

Maximum payload: **32 KiB** (ideal < 1.8 KiB).  
Data is JSON-serialized automatically—pass native data structures.

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

Parameters (defaults follow PubNub keyset configuration unless stated):

* `publish_message` (required) – message implementing `Serialize`.
* `channel` (required) – destination channel.
* `store` – `true/false`; enables Message Persistence.
* `meta` – `HashMap<String,String>` for filter expressions.
* `replicate` – replicate across Points of Presence.
* `ttl` – hours to live (see detailed rules below):
  1. `store=true, ttl=0` → stored indefinitely.  
  2. `store=true, ttl=X` → stored X hours (unless keyset retention = Unlimited).  
  3. `store=false` → `ttl` ignored.  
  4. `ttl` omitted → key default.
* `use_post` – publish with HTTP POST.
* `execute` – returns `Future`; `await` to complete.

### Basic usage

```
`  
`
```

### Other examples

```
`  
`
```

### Result

```
`// success  
PublishResult { timetoken: "16808621084073203" }  
  
// failure  
Error: PublishError("Status code: 400, body: OtherResponse { status: 400, error: true, service: \"Access Manager\", message: \"Invalid Subscribe Key\" }")  
`
```

---

## Subscribe

Requires a valid `subscribe_key`. Provides two scopes:

* `Subscription` – single entity (channel, group, metadata).  
* `SubscriptionSet` – collection of entities created on a `pubnub` client.

Automatic reconnection can be configured with `with_retry_policy()`.

### Create a subscription

```
`// entity-based, local-scoped  
let channel = client.channel("channelName");  
channel.subscription(options: OptionVecSubscriptionOptions>>)  
`
```

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

`SubscriptionOptions` enum currently supports:

* `ReceivePresenceEvents` – include presence updates.

---

### Subscribe

```
`subscription.subscribe()  
`
```

```
`  
`
```

#### Combining subscriptions

```
`// individual entities  
...  
let set = subscription1 + subscription2;  
set += subscription3; // or set.add_subscriptions(subscription3)  
`
```

```
`// combining sets  
let set1 = pubnub.subscription(...);  
let set2 = pubnub.subscription(...);  
// create new set from both  
`
```

---

### Subscribe with timetoken

```
`subscription.subscribe_with_timetoken(cursor: IntoSubscriptionCursor>)  
`
```

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

Create local handles to channels, groups, and metadata objects:

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

---

## Event Listeners

Attach streams to `Subscription`, `SubscriptionSet`, or `pubnub` (status only).

```
`subscription  
    .messages_stream() -> DataStreamMessage>;  
    .signals_stream() -> DataStreamMessage>;  
    .message_actions_stream() -> DataStreamMessageAction>;  
    .files_stream() -> DataStreamFile>;  
    .app_context_stream() -> DataStreamAppContext>;  
`
```

Add connection status listener (client-scope):

```
`pubnub.status_stream()  
`
```

---

## Utility Operations

Clone subscription without listeners:

```
`subscription.clone_empty()  
`
```

Unsubscribe:

```
`subscription.unsubscribe()  
  
subscription_set.unsubscribe()  
`
```

```
`let subscription = client.subscription(...);  
subscription.subscribe(None);  
subscription.unsubscribe();  
`
```

Unsubscribe from all streams (client-scope):

```
`pubnub.unsubscribe_all()  
`
```

```
`let subscription = client.subscription(...);  
...  
pubnub.unsubscribe_all();  
`
```

---

Last updated: **Jun 16 2025**