# Publish/Subscribe API for C# SDK

Low-latency publish/subscribe with the C# SDK. See Connection Management and Publish Messages for broader concepts.

##### Request execution

Use try/catch. Invalid parameters throw exceptions; server/network errors are returned in status.

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

## Publish

publish() sends a message to all subscribers of a channel.

Essentials:
- Initialize PubNub with publishKey.
- No need to subscribe to publish. You can’t publish to multiple channels at once.
- TLS/SSL: set ssl=true during initialization. Optional message encryption supported.
- Message data: any JSON-serializable type; don’t pre-serialize message/meta (SDK handles serialization).
- Size: max 32 KiB (including escaped characters and channel name). Target <1,800 bytes for performance. Errors: Message Too Large.
- Throughput: publish as fast as bandwidth allows; subscriber in-memory queue holds 100 messages (older may drop). Throttle bursts as needed.
- CustomMessageType: optional business label (for example text, action, poll).
- Best practices:
  - Publish serially; publish next only after success code (for example, [1,"Sent","136074940..."]).
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep in-memory queue under 100; throttle (for example, <=5 msg/s).

### Method(s)

To publish a message:

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

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- ShouldStore Type: bool — Store in history. If not set, the key’s history config applies.
- Meta Type: Dictionary<string, object> — For message filtering.
- UsePOST Type: bool — Use POST to publish.
- Ttl Type: int — Per-message time-to-live in storage.
- QueryParam Type: Dictionary<string, object> — Extra query string name/value pairs (debug).
- CustomMessageType Type: string — Case-sensitive, 3–50 chars, alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_ / pn- (examples: text, action, poll).
- Sync Type: Command — Blocks thread; deprecated. Use Execute.
- Async Type: PNCallback — PNCallback of PNPublishResult; deprecated. Use ExecuteAsync.
- Execute Type: PNCallback — PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code

##### Reference code

```
1
  

```

#### Publish a message to a channel

```
1
  

```

##### Subscribe to the channel

Before running the publish example, subscribe to the same channel (for example, via Debug Console) or a separate script/terminal.

### Returns

Publish() returns PNResult<PNPublishResult>:
- Result: PNPublishResult — Timetoken (long).
- Status: PNStatus.

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

#### Publish a Mobile Push payload

```
1
  

```

See Mobile Push for details.

## Fire

Sends a message to Functions event handlers and Illuminate. Triggers handlers registered on the channel. Not replicated to subscribers and not stored in history.

### Method(s)

```
`1pubnub.Fire()  
2        .Message(object)  
3        .Channel(string)  
4        .Meta(Dictionarystring, object>)  
5        .UsePOST(bool)  
6        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- Meta Type: Dictionary<string, object> — For filtering.
- UsePOST Type: bool — Use POST.
- QueryParam Type: Dictionary<string, object> — Extra query string name/value pairs (debug).
- Sync Type: Command — Blocks thread; deprecated. Use Execute.
- Async Type: PNCallback — PNCallback of PNPublishResult; deprecated. Use ExecuteAsync.
- Execute Type: PNCallback — PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

signal() sends a signal to all subscribers of a channel.

Limits:
- Payload max 64 bytes (payload only).

### Method(s)

```
`1pubnub.Signal()  
2        .Message(object)  
3        .Channel(string)  
4        .CustomMessageType(string)  
`
```

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- CustomMessageType Type: string — Case-sensitive, 3–50 chars, alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_ / pn- (examples: text, action, poll).

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timetoken: long — Timetoken when the signal was sent.

## Subscribe

Opens a TCP socket and listens for messages/events on specified entities. Initialize with subscribeKey to subscribe.

Concepts:
- Entities are first-class: Channel, ChannelGroup, UserMetadata, ChannelMetadata.
- Subscriptions start receiving after subscribe() completes.

### Subscription scope

- Subscription: scoped to a single entity (for example, a channel).
- SubscriptionSet: scoped to the PubNub client; can include multiple subscriptions.
- Event listeners deliver all messages/signals/events for subscribed entities.

### Create a subscription

Entity-level Subscription receives only that entity’s updates.

Keep a strong reference to Subscription/SubscriptionSet to avoid GC collection and loss of updates.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

Parameters:
- options Type: SubscriptionOptions — Behavior configuration.

### Create a subscription set

Client-level SubscriptionSet receives updates across entities.

Keep a strong reference to avoid GC collection.

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
- channels Type: string[] — One or more channels. Either channels or channelGroups required.
- channelGroups Type: string[] — One or more channel groups. Either channels or channelGroups required.
- options Type: SubscriptionOptions — Behavior configuration.

Add/remove sets: you can add/remove subscriptions to create new sets (see examples).

#### SubscriptionOptions

Enum options:
- ReceivePresenceEvents — Deliver presence updates for userIds via listener streams. See Presence Events for details.

### Method(s)

Subscription and SubscriptionSet use the same subscribe<object>().

#### Subscribe

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

Parameters:
- cursor Type: SubscriptionCursor — Cursor for best-effort cached message retrieval: { Timetoken: long?; Region: int? }. Primitive types are converted to SubscriptionCursor; non-17-digit numbers or non-numeric strings are ignored.

##### Sample code

```
1
  

```

##### Other examples

###### Create a subscription set from two subscriptions

```
1
  

```

##### Returns

subscribe() has no return value.

## Entities

Subscribable entities for real-time updates:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels

Returns a local Channel entity.

```
`pubnub.Channel(String)  
`
```

Parameters:
- Channel Type: String — Channel name.

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

Parameters:
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

Parameters:
- ChannelMetadata Type: String — Channel metadata identifier.

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

Parameters:
- UserMetadata Type: String — User metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Receive messages and events via listeners. Attach to Subscription, SubscriptionSet, and (for connection status) the PubNub client.

### Add listeners

You can implement multiple listeners with onEvent or register event-specific listeners (message, file, etc).

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

### Add connection status listener

Client-only listener for connection status updates.

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

Stop receiving updates from a Subscription or SubscriptionSet.

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

Client scope: Available only on the PubNub object.

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