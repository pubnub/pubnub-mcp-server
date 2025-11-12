# Publish/Subscribe API for Unity SDK

Low-latency real-time messaging to one or many subscribers.

Prerequisites:
- Initialize PubNub with publishKey to publish; subscribeKey to subscribe.
- You don't need to subscribe to publish to a channel.
- You cannot publish to multiple channels simultaneously.

Security:
- Enable TLS/SSL by setting ssl = true during initialization.
- Optional payload encryption via CryptoModule.

Data and serialization:
- Messages must be JSON-serializable (objects, arrays, numbers, strings). Avoid Unity-specific classes/functions.
- Do not JSON-serialize message or meta yourself; pass the full object and the SDK will serialize.
- Strings support UTF-8.

Size and rate:
- Max message size: 32 KiB (includes channel name and escaped characters). Target < ~1,800 bytes for best performance.
- If exceeded: Message Too Large error. See Message size limits.
- Throughput: Publish as fast as bandwidth allows; soft limits apply. Subscriber in-memory queue holds 100 messages—avoid bursts that exceed subscriber capacity.

Circular references:
- For structures with circular references, use GetJsonSafe().

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

Custom message type:
- Optional CustomMessageType label (for example, text, action, poll). See constraints under methods.

Best practices:
- Publish serially (not concurrently).
- Publish the next message only after confirming success (for example, [1,"Sent","136074940..."]). Retry on failure ([0,"blah","<timetoken>"]).
- Keep publish queues under 100 messages; throttle bursts (for example, ≤ 5 msgs/sec) to meet latency goals.

## Publish

Sends a message to all subscribers on a channel; replicated globally.

### Method(s)

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
- Message (required): object – payload.
- Channel (required): string – destination channel ID.
- ShouldStore: bool – store in history (defaults to key’s history configuration).
- Meta: Dictionary<string, object> – metadata for message filtering.
- UsePOST: bool – use POST to publish.
- Ttl: int – per-message time to live in storage.
- QueryParam: Dictionary<string, object> – name/value query params for debugging.
- CustomMessageType: string – 3–50 chars, case-sensitive alphanumeric, dashes and underscores allowed. Cannot start with special chars or pn_/pn-.

Execution:
- Sync: Command – blocks; throws on error.
- Async: PNCallback of type PNPublishResult.
- Execute: System.Action of type PNPublishResult.
- ExecuteAsync: returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Publish a message to a channel

##### Reference code
```
1
  

```

##### Subscribe to the channel
Use Debug Console or a separate script to subscribe to the same channel before running the publish example.

### Returns

Publish() returns PNResult<PNPublishResult>:
- Result: PNPublishResult
- Status: PNStatus

PNPublishResult:
- Timetoken: long – publish timetoken.

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
See Mobile Push for details.

## Fire

Sends a message to Functions event handlers and Illuminate on the target channel. Not replicated to subscribers and not stored in history.

### Method(s)

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

Parameters and execution:
- Message (required): object – payload.
- Channel (required): string – channel ID.
- Meta: Dictionary<string, object> – metadata for filtering.
- UsePOST: bool – use POST.
- QueryParam: Dictionary<string, object> – debug query params.
- Sync: Command – blocks; throws on error.
- Async: PNCallback of type PNPublishResult
- Execute: System.Action of type PNPublishResult
- ExecuteAsync: returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Fire a message to a channel
```
1
  

```

## Signal

Sends a lightweight signal to channel subscribers.

Payload size:
- Default limit: 64 bytes for payload (URI and headers excluded). Contact support to request more.

### Method(s)

```
`1pubnub.Signal()  
2    .Message(object)  
3    .Channel(string)  
4    .CustomMessageType(string)  
5    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

Parameters and execution:
- Message (required): object – payload.
- Channel (required): string – destination channel ID.
- CustomMessageType: string – same constraints as Publish.
- Execute: System.Action of type PNPublishResult.
- ExecuteAsync: returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Signal a message to a channel
```
1
  

```

### Response

- Timetoken: long – signal timetoken.

## Subscribe

Opens a TCP socket and listens for messages and events on specified entities. Initialize with subscribeKey.

- After subscribe(), client receives new messages.
- Configure automaticRetry to reconnect and fetch available messages after a disconnect.

### Subscription scope

- Subscription: entity-scoped (for example, a specific channel).
- SubscriptionSet: client-scoped; can include multiple subscriptions.

All events are delivered through attached listeners. See Event listeners.

### Create a subscription

Keep a strong reference to each Subscription/SubscriptionSet to keep them alive.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

Parameters:
- options: SubscriptionOptions – behavior configuration.

### Create a subscription set

Keep a strong reference to each Subscription/SubscriptionSet to keep them alive.

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
- channels (required if no channelGroups): string[] – channels to subscribe to.
- channelGroups (required if no channels): string[] – channel groups to subscribe to.
- options: SubscriptionOptions – behavior configuration.

Add/remove sets: You can add/remove subscriptions to form new sets. See examples.

#### SubscriptionOptions

Enum options:
- ReceivePresenceEvents: deliver presence updates for userIds through listener streams. See Presence Events.

### Method(s)

#### Subscribe

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

Parameters:
- cursor: SubscriptionCursor – best-effort retrieval of cached messages from a specific timetoken/region.
  - cursor: { Timetoken: long?; Region: int? }
  - Primitive inputs are converted to SubscriptionCursor; invalid values are ignored.

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
- subscribe() has no return value.

## Entities

Subscribable objects that receive real-time updates:

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

Parameters:
- Channel (required): String – channel ID.

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
- ChannelGroup (required): String – channel group name.

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
- ChannelMetadata (required): String – channel metadata identifier.

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
- UserMetadata (required): String – user metadata identifier.

#### Sample code
```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and the PubNub client (for connection status).

### Add listeners

Multiple listeners supported via onEvent or type-specific handlers (message, file, etc.).

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

Client-only listener for connection status.

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
- Subscription status. See SDK statuses.

## Unsubscribe

Stop updates from a Subscription or SubscriptionSet.

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
- None

## Unsubscribe all

Stop updates from all streams and remove associated entities. Client-only.

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
- None