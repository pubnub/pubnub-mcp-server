# Publish/Subscribe API for C# SDK

Low-latency publish/subscribe for channels and entities. For background, see Connection Management and Publish Messages. This section focuses on C# SDK APIs, configuration, and examples.

##### Request execution

Use try/catch. Invalid parameters throw exceptions. Server/network errors are in Status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Publish[​](#publish)

`publish()` sends a JSON-serializable payload to all subscribers on a channel.

- Prerequisites and limitations
  - Initialize PubNub with the publishKey.
  - You don't need to subscribe to publish to a channel.
  - You can't publish to multiple channels at the same time.
- Security
  - Enable TLS/SSL by setting ssl=true during initialization. Optional message encryption via CryptoModule.
- Message data
  - Any JSON-serializable data: objects, arrays, numbers, strings (UTF-8).
  - Don't JSON serialize message or meta; pass objects and let the SDK handle serialization.
- Size
  - Max 32 KiB per message (includes escaped characters and channel name). Aim for < 1,800 bytes. Over-limit returns Message Too Large.
- Publish rate and queue
  - Soft throughput limits; messages can drop if subscribers can’t keep up.
  - In-memory queue holds 100 messages per subscriber. Bursts beyond that may drop earlier messages.
- Custom message type
  - Optionally set CustomMessageType (for example text, action, poll).
- Best practices
  - Publish serially, verify success ([1,"Sent","136074940..."]), publish next only on success.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep queue under 100 messages.
  - Throttle bursts (e.g., ≤ 5 msg/s) to meet latency needs.

### Method(s)[​](#methods)

```
`1pubnub.Publish()  
2        .Message(object)  
3        .Channel(string)  
4        .ShouldStore(bool)  
5        .Meta(Dictionarystring, object>)  
6        .UsePOST(bool)  
7        .Ttl(int)  
8        .QueryParam(Dictionarystring,object>)  
9        .CustomMessageType(string)  
`
```

- Parameters
  - Message (required) Type: object — The payload.
  - Channel (required) Type: string — Destination channel ID.
  - ShouldStore Type: bool — Store in history; if not set, key-level history config applies.
  - Meta Type: Dictionary<string, object> — Metadata for server-side filtering.
  - UsePOST Type: bool — Use POST for publish.
  - Ttl Type: int — Per-message TTL in storage.
  - QueryParam Type: Dictionary<string, object> — Name/value pairs appended as query params (debug).
  - CustomMessageType Type: string — 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
  - Sync Type: Command — Deprecated. Blocks thread; throws on error. Use Execute instead.
  - Async Type: PNCallback<PNPublishResult> — Deprecated. Use ExecuteAsync instead.
  - Execute Type: PNCallback<PNPublishResult>.
  - ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code[​](#sample-code)

##### Reference code

Self-contained snippet including imports and logging.

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (see Subscribe).

### Returns[​](#returns)

`Publish()` returns PNResult<PNPublishResult> with:

- Result: PNPublishResult — Timetoken: long (publish timetoken).
- Status: PNStatus.

### Other examples[​](#other-examples)

#### Publish a message to a channel synchronously[​](#publish-a-message-to-a-channel-synchronously)

```
1
  

```

#### Publish with metadata[​](#publish-with-metadata)

```
1
  

```

#### Store the published message for 10 hours[​](#store-the-published-message-for-10-hours)

```
1
  

```

#### Publish a Mobile Push payload[​](#publish-a-mobile-push-payload)

```
1
  

```

For more details, refer to Mobile Push.

## Fire[​](#fire)

`fire()` sends a message to Functions event handlers and Illuminate. Not delivered to subscribers and not stored in history.

### Method(s)[​](#methods-1)

```
`1pubnub.Fire()  
2        .Message(object)  
3        .Channel(string)  
4        .Meta(Dictionarystring, object>)  
5        .UsePOST(bool)  
6        .QueryParam(Dictionarystring,object>)  
`
```

- Parameters
  - Message (required) Type: object — The payload.
  - Channel (required) Type: string — Destination channel ID.
  - Meta Type: Dictionary<string, object>.
  - UsePOST Type: bool.
  - QueryParam Type: Dictionary<string, object>.
  - Sync Type: Command — Deprecated. Use Execute.
  - Async Type: PNCallback<PNPublishResult> — Deprecated. Use ExecuteAsync.
  - Execute Type: PNCallback<PNPublishResult>.
  - ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code[​](#sample-code-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
1
  

```

## Signal[​](#signal)

`signal()` sends a lightweight signal to all channel subscribers. Payload limit: 64 bytes (payload only).

### Method(s)[​](#methods-2)

```
`1pubnub.Signal()  
2        .Message(object)  
3        .Channel(string)  
4        .CustomMessageType(string)  
`
```

- Parameters
  - Message (required) Type: object — The payload.
  - Channel (required) Type: string — Destination channel ID.
  - CustomMessageType Type: string — 3–50 chars; same rules as Publish.

### Sample code[​](#sample-code-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
1
  

```

### Response[​](#response)

- Timetoken: long — Signal timetoken.

## Subscribe[​](#subscribe)

Opens a TCP socket to PubNub and listens for messages/events on specified entities. Requires subscribeKey during initialization.

- Entities you can subscribe to: Channel, ChannelGroup, UserMetadata, ChannelMetadata.
- Messages are received after subscribe() completes.

### Subscription scope[​](#subscription-scope)

- Subscription: entity-scoped (for a specific channel or entity).
- SubscriptionSet: client-scoped; can include one or more subscriptions created on a single PubNub client.

Use event listeners to receive messages, signals, and events.

### Create a subscription[​](#create-a-subscription)

Entity-level Subscription receives updates only for that entity. Use separate Subscriptions for different channels or event types.

##### Keep a strong reference

Keep strong references to Subscription/SubscriptionSet or the GC may collect them and updates stop.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

- Parameters
  - options Type: SubscriptionOptions — Behavior configuration.

### Create a subscription set[​](#create-a-subscription-set)

Client-level SubscriptionSet receives updates across specified entities. Use one set for similar handling across channels.

##### Keep a strong reference

Keep strong references to avoid GC collection and missed updates.

```
`// client-based, general-scoped  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)  
`
```

- Parameters
  - channels Type: string[] — One or more channels. Either channels or channelGroups required.
  - channelGroups Type: string[] — One or more channel groups. Either channels or channelGroups required.
  - options Type: SubscriptionOptions — Behavior configuration.

##### Add/remove sets

You can add and remove subscriptions to create new sets (see Other examples).

#### `SubscriptionOptions`[​](#subscriptionoptions)

- ReceivePresenceEvents — Whether presence updates for userIds are delivered via listener streams.

### Method(s)[​](#methods-3)

Subscription and SubscriptionSet use the same subscribe<object>() method.

#### Subscribe[​](#subscribe-1)

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

- Parameters
  - cursor Type: SubscriptionCursor — Best-effort retrieval from a timetoken/region cursor: { Timetoken: long?; Region: int? }. Primitive inputs converted if numeric; non-17-digit or non-numeric strings are ignored.

##### Sample code[​](#sample-code-3)

```
1
  

```

##### Other examples[​](#other-examples-1)

###### Create a subscription set from two subscriptions[​](#create-a-subscription-set-from-two-subscriptions)

```
1
  

```

##### Returns[​](#returns-1)

None.

## Entities[​](#entities)

Subscribable objects for real-time updates:

- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels[​](#create-channels)

Returns a local Channel entity.

```
`pubnub.Channel(String)  
`
```

- Parameters
  - Channel Type: String — Channel name.

#### Sample code[​](#sample-code-4)

```
1
  

```

### Create channel groups[​](#create-channel-groups)

Returns a local ChannelGroup entity.

```
`pubnub.ChannelGroup(String)  
`
```

- Parameters
  - ChannelGroup Type: String — Channel group name.

#### Sample code[​](#sample-code-5)

```
1
  

```

### Create channel metadata[​](#create-channel-metadata)

Returns a local ChannelMetadata entity.

```
`pubnub.ChannelMetadata(String)  
`
```

- Parameters
  - ChannelMetadata Type: String — Channel metadata identifier.

#### Sample code[​](#sample-code-6)

```
1
  

```

### Create user metadata[​](#create-user-metadata)

Returns a local UserMetadata entity.

```
`pubnub.UserMetadata(String)  
`
```

- Parameters
  - UserMetadata Type: String — User metadata identifier.

#### Sample code[​](#sample-code-7)

```
1
  

```

## Event listeners[​](#event-listeners)

Attach listeners to Subscription, SubscriptionSet, and the PubNub client (for connection status) to receive messages, signals, and events. You can implement multiple listeners or event-specific listeners.

### Add listeners[​](#add-listeners)

#### Method(s)[​](#methods-4)

```
1
  

```

#### Sample code[​](#sample-code-8)

```
1
  

```

### Add connection status listener[​](#add-connection-status-listener)

Client-scoped listener on the PubNub object for connection status updates.

#### Method(s)[​](#methods-5)

```
`1pubnub.AddListener(listener)  
`
```

#### Sample code[​](#sample-code-9)

```
1
  

```

#### Returns[​](#returns-2)

Subscription status (see SDK statuses).

## Unsubscribe[​](#unsubscribe)

Stop receiving updates from a Subscription or SubscriptionSet.

### Method(s)[​](#methods-6)

```
subscription.Unsubscribeobject>()  

  
subscriptionSet.Unsubscribeobject>()  

```

### Sample code[​](#sample-code-10)

```
1
  

```

### Returns[​](#returns-3)

None

## Unsubscribe all[​](#unsubscribe-all)

Stop receiving updates from all data streams and remove associated entities. Client-scoped (PubNub object).

### Method(s)[​](#methods-7)

```
`1pubnub.UnsubscribeAllobject>()  
`
```

### Sample code[​](#sample-code-11)

```
1
  

```

### Returns[​](#returns-4)

None