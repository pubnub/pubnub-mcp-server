# Publish/Subscribe API for Unity SDK

PubNub delivers messages to subscribers on channels.

- Initialize PubNub with publishKey for publishing and subscribeKey for subscribing.
- You don't need to be subscribed to publish.
- You can't publish to multiple channels simultaneously.
- Enable TLS/SSL by setting ssl = true during initialization. You can also encrypt messages.

## Publish

- Message payload: Any JSON-serializable data (objects, arrays, integers, strings). Avoid Unity-specific classes/functions. Strings can include UTF‑8.
- Do not JSON serialize message/meta; PubNub serializes automatically.
- Max message size: 32 KiB (including channel name and escaped chars). Aim < ~1,800 bytes. Oversize returns "Message Too Large".
- Throughput: Send as fast as bandwidth allows; soft limit. Subscriber in-memory queue is 100 messages—bursts may drop older messages.
- Circular references: Use GetJsonSafe() extension for Unity types.

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

- CustomMessageType: Optional business label (for example, text, action, poll).

Best practices:
- Publish serially.
- Verify success (for example, [1,"Sent","136074940..."]); publish next only on success.
- Retry on failure ([0,"blah","<timetoken>"]).
- Keep queue < 100 messages.
- Throttle bursts (for example, ≤ 5 msg/s) to meet latency targets.

### Method(s)

To Publish a message:

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

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- ShouldStore Type: bool — Store in history; defaults to key’s history configuration.
- Meta Type: Dictionary<string, object> — For message filtering.
- UsePOST Type: bool — Use POST for publish.
- Ttl Type: int — Per-message TTL in storage.
- QueryParam Type: Dictionary<string, object> — Extra query params for debugging.
- CustomMessageType Type: string — 3–50 chars, case-sensitive, alphanumeric, may include - and _. Cannot start with special chars or pn_/pn- (examples: text, action, poll).
- Sync Type: Command — Blocks thread; throws on error.
- Async Type: PNCallback — Callback of type PNPublishResult.
- Execute Type: System.Action — Action of type PNPublishResult, PNStatus.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel

Subscribe to the same channel (using Debug Console or another script) before running the publish example.

### Returns

Publish() returns PNResult<PNPublishResult>:
- Result: PNPublishResult
- Status: PNStatus

PNPublishResult:
- Timetoken: long

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

For more details, refer to Mobile Push.

## Fire

Sends a message to Functions event handlers and Illuminate on a channel. Not delivered to subscribers and not stored in history.

### Method(s)

To Fire a message:

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

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- Meta Type: Dictionary<string, object> — For filtering.
- UsePOST Type: bool — Use POST.
- QueryParam Type: Dictionary<string, object> — Extra query params.
- Sync/Async/Execute/ExecuteAsync — Same as Publish.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

Sends a lightweight signal to all channel subscribers.

- Default payload limit: 64 bytes (payload only). Contact support for larger limits.

### Method(s)

To Signal a message:

```
`1pubnub.Signal()  
2    .Message(object)  
3    .Channel(string)  
4    .CustomMessageType(string)  
5    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- CustomMessageType Type: string — 3–50 chars, case-sensitive, alphanumeric, may include - and _. Cannot start with special chars or pn_/pn- (examples: text, action, poll).
- Execute/ExecuteAsync — Returns PNResult<PNPublishResult>.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timetoken: long — Signal timetoken.

## Subscribe

Opens a TCP socket to receive messages and events. Set subscribeKey during initialization. Configure automaticRetry to reconnect and fetch available messages after a disconnect.

### Subscription scope

- Subscription: Scoped to a single entity (for example, one channel).
- SubscriptionSet: Scoped to the PubNub client; can include one or more subscriptions.

Use event listeners to receive messages, signals, and events.

### Create a subscription

Keep a strong reference to each Subscription/SubscriptionSet to keep it in memory.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

- options Type: SubscriptionOptions — Subscription behavior configuration.

### Create a subscription set

Keep a strong reference to each Subscription/SubscriptionSet.

```
`// client-based, general-scoped  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)  
`
```

Parameters:
- channels Type: string[] — One or more channels. Either channels or channelGroups is required.
- channelGroups Type: string[] — One or more channel groups. Either channels or channelGroups is required.
- options Type: SubscriptionOptions — Subscription behavior configuration.

Add/remove sets: You can add and remove subscriptions to create new sets.

#### SubscriptionOptions

Enum options:
- ReceivePresenceEvents — Deliver presence updates for userIds through listener streams.

### Method(s)

#### Subscribe

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

- cursor Type: SubscriptionCursor — Cursor to return any available cached messages. Best-effort only. Consists of Timetoken: long? and Region: int?. Primitive types are converted to SubscriptionCursor; if not a 17-digit number or numeric string, value is ignored.

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

Subscribable objects:

- ChannelRepresentation
- ChannelGroupRepresentation
- UserMetadataRepresentation
- ChannelMetadataRepresentation

### Create channels

Returns a local Channel entity.

```
`pubnub.Channel(String)  
`
```

- Channel Type: String — Channel ID.

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

- ChannelGroup Type: String — Channel group name.

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

- ChannelMetadata Type: String — Channel metadata ID.

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

- UserMetadata Type: String — User metadata ID.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and (for connection status) the PubNub client.

### Add listeners

Implement multiple listeners with onEvent or register event-specific listeners (message, file, etc.).

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

Client scope only. Stop receiving real-time updates from all data streams and remove their entities.

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