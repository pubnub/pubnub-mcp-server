# Publish/Subscribe API for Unity SDK

Low-latency global messaging. For concepts, see Connection Management and Publish Messages.

## Publish

`publish()` sends a JSON-serializable message to all subscribers of a single channel.

- Requirements
  - Initialize PubNub with publishKey.
  - You don't have to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL by setting ssl = true during initialization. Encryption is supported.
- Message data
  - Message can be any JSON-serializable data (objects, arrays, numbers, strings). Avoid Unity-specific classes; if needed, use GetJsonSafe().
- Don't JSON serialize
  - Do not JSON serialize message or meta; the SDK handles serialization automatically.
- Size
  - Max message size: 32 KiB (includes channel and escaped characters). Aim for under 1,800 bytes.
  - Exceeding returns Message Too Large.
- Publish rate
  - Publish as fast as bandwidth allows; soft throughput limits apply. In-memory subscriber queue is 100.
- Message serialization
  - Circular references can cause issues; use GetJsonSafe() extension if needed.
- Custom message type
  - Optional CustomMessageType label, e.g., text, action, poll.
- Best practices
  - Publish serially.
  - Verify success return code ([1,"Sent","136074940..."]); publish next only after success.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep queues under 100; throttle bursts (e.g., ≤5 msgs/sec).

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

### Method(s)

To Publish a message use:

```
`1pubnub.Publish()  
2    .Message(object)  
3    .Channel(string)  
4    .ShouldStore(bool)  
5    .Meta(Dictionarystring, object>)  
6    .UsePOST(bool)  
7    .Ttl(int)  
8    .QueryParam(Dictionarystring,object>)  
9    .CustomMessageType(string)  
10    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

- Parameters
  - Message (required) Type: object — Payload.
  - Channel (required) Type: string — Destination channel ID.
  - ShouldStore Type: bool — Store in history. If not set, key’s history config is used.
  - Meta Type: Dictionary<string, object> — Metadata for filtering.
  - UsePOST Type: bool — Use POST to publish.
  - Ttl Type: int — Per-message TTL in storage.
  - QueryParam Type: Dictionary<string, object> — Extra query params for debugging.
  - CustomMessageType Type: string — 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- Execution styles
  - Sync Type: Command — Blocks, throws on error.
  - Async Type: PNCallback<PNPublishResult>.
  - Execute Type: System.Action<PNPublishResult>.
  - ExecuteAsync: Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel.

### Returns

Publish() returns PNResult<PNPublishResult>:
- Result: PNPublishResult
- Status: PNStatus

PNPublishResult:
- Timetoken: long — Publish timetoken.

### Other examples

#### Publish a message to a channel synchronously

```
1
  

```

#### Publish with metadata

```
1
  

```

#### Store the published message for 10 hours

```
1
  

```

#### Publishing messages for receipt on FCM and APNS associated devices, sample payload

```
1
  

```

For details, see Mobile Push.

## Fire

Sends a message to Functions event handlers and Illuminate for the target channel. Not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message use:

```
`1pubnub.Fire()  
2    .Message(object)  
3    .Channel(string)  
4    .Meta(Dictionarystring, object>)  
5    .UsePOST(bool)  
6    .QueryParam(Dictionarystring,object>)  
7    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

- Parameters
  - Message (required) Type: object — Payload.
  - Channel (required) Type: string — Destination channel ID.
  - Meta Type: Dictionary<string, object> — Metadata for filtering.
  - UsePOST Type: bool — Use POST to publish.
  - QueryParam Type: Dictionary<string, object> — Extra query params for debugging.
- Execution styles
  - Sync Type: Command — Blocks, throws on error.
  - Async Type: PNCallback<PNPublishResult>.
  - Execute Type: System.Action<PNPublishResult>.
  - ExecuteAsync: Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

Sends a lightweight signal to all subscribers of a channel.

- Payload size limit: 64 bytes (payload only). Contact support to increase.

### Method(s)

To Signal a message use:

```
`1pubnub.Signal()  
2    .Message(object)  
3    .Channel(string)  
4    .CustomMessageType(string)  
5    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

- Parameters
  - Message (required) Type: object — Payload.
  - Channel (required) Type: string — Destination channel ID.
  - CustomMessageType Type: string — 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- Execution
  - Execute Type: System.Action<PNPublishResult>.
  - ExecuteAsync: Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timetoken: long — Signal timetoken.

## Subscribe

Opens a TCP socket and listens for messages and events on specified entities. Initialize with subscribeKey. Configure automaticRetry to reconnect and fetch available messages after disconnect.

### Subscription scope

- Subscription: Created from an entity (e.g., a Channel), scoped to that entity.
- SubscriptionSet: Created from the PubNub client, scoped to the client and can include multiple subscriptions.

The event listener is a single point for messages, signals, and events. See Event listeners.

### Create a subscription

Keep a strong reference to each Subscription/SubscriptionSet so it stays in memory.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

- Parameters
  - options Type: SubscriptionOptions — Behavior configuration.

### Create a subscription set

Keep a strong reference to each Subscription/SubscriptionSet so it stays in memory.

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
  - channels (required if no channelGroups) Type: string[].
  - channelGroups (required if no channels) Type: string[].
  - options Type: SubscriptionOptions.

Add/remove sets: You can add/remove subscriptions to create new sets.

#### SubscriptionOptions

Enum options:
- ReceivePresenceEvents — Deliver presence updates via listener streams.

### Method(s)

Subscription and SubscriptionSet use the same subscribe<object>() method.

#### Subscribe

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

- Parameters
  - cursor Type: SubscriptionCursor — Best-effort cached message retrieval; cursor is { Timetoken: long?; Region: int? }. Primitive values are converted if 17-digit number or numeric string; otherwise ignored.

##### Sample code

```
1
  

```

##### Other examples

###### Create a subscription set from 2 individual subscriptions

```
1
  

```

##### Returns

subscribe() has no return value.

## Entities

Subscribable objects that deliver real-time updates: ChannelRepresentation, ChannelGroupRepresentation, UserMetadataRepresentation, ChannelMetadataRepresentation.

### Create channels

Returns a local Channel entity.

```
`pubnub.Channel(String)  
`
```

- Parameters
  - Channel (required) Type: String — Channel ID.

#### Sample code

```
1
  

```

### Create channel groups

Returns a local ChannelGroup entity.

```
`pubnub.ChannelGroup(String)  
`
```

- Parameters
  - ChannelGroup (required) Type: String — Channel group name.

#### Sample code

```
1
  

```

### Create channel metadata

Returns a local ChannelMetadata entity.

```
`pubnub.ChannelMetadata(String)  
`
```

- Parameters
  - ChannelMetadata (required) Type: String — Channel metadata ID.

#### Sample code

```
1
  

```

### Create user metadata

Returns a local UserMetadata entity.

```
`pubnub.UserMetadata(String)  
`
```

- Parameters
  - UserMetadata (required) Type: String — User metadata ID.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and PubNub client (for connection status). A single listener can receive messages, signals, and events; or register event-specific listeners.

### Add listeners

#### Method(s)

```
1
  

```

```
1
  

```

#### Sample code

```
1
  

```

### Add connection status listener

Client scope only.

#### Method(s)

```
`1pubnub.AddListener(listener)  
`
```

#### Sample code

```
1
  

```

#### Returns

Subscription status (see SDK statuses).

## Unsubscribe

Stop receiving real-time updates from a Subscription or SubscriptionSet.

### Method(s)

```
subscription.Unsubscribeobject>()  

  
subscriptionSet.Unsubscribeobject>()  

```

### Sample code

```
1
  

```

### Returns

None

## Unsubscribe all

Stop receiving updates from all streams and remove associated entities.

Client scope only.

### Method(s)

```
`1pubnub.UnsubscribeAllobject>()  
`
```

### Sample code

```
1
  

```

### Returns

None