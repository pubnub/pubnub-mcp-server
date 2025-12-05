# Publish/Subscribe API for Unity SDK

Low-latency publish/subscribe for channels and entities. For conceptual guidance, see Connection Management and Publish Messages.

## Publish

publish() sends a JSON-serializable payload to all subscribers of a single channel.

Prerequisites and limits
- Initialize PubNub with publishKey.
- You can publish without subscribing.
- You cannot publish to multiple channels simultaneously.

Security
- Enable TLS/SSL by setting ssl = true during initialization.
- Optional message encryption via CryptoModule.

Message data
- Payload must be JSON-serializable (objects, arrays, numbers, strings). Avoid Unity-specific classes or functions unless serialized safely.
- Strings support UTF‑8.

Don't JSON serialize
- Do not pre-serialize message or meta. Pass objects and let the SDK handle serialization.

Size and throughput
- Max message size: 32 KiB (including channel name and escaped chars). Aim for < 1,800 bytes.
- Exceeding limit returns Message Too Large.
- Soft throughput limit; in-memory subscriber queue holds 100 messages. Bursts can cause drops if subscribers lag.

Serialization helpers
- For circular references (e.g., Vector3), use GetJsonSafe().

```
`pubnub.Publish().Channel(defaultChannel).Message(transform.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.position.GetJsonSafe()).Execute((a, b) => { });  
pubnub.Publish().Channel(defaultChannel).Message(transform.localRotation.GetJsonSafe()).Execute((a, b) => { });  
`
```

Custom message type
- Optional CustomMessageType label (e.g., text, action, poll).

Best practices
- Publish serially (not concurrently).
- Verify success return (e.g., [1,"Sent","136074940..."]) before next publish.
- Retry on failure ([0,"blah","<timetoken>"]).
- Keep in-memory queue under 100.
- Throttle bursts (e.g., ≤5 msg/s) to meet latency needs.

### Method(s)

To Publish a message you can use the following method(s) in the Unity SDK:

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

Parameters and options
- Message (required, object): Payload.
- Channel (required, string): Channel ID.
- ShouldStore (bool): Store in history. If not set, key’s history config applies.
- Meta (Dictionary<string, object>): For message filtering.
- UsePOST (bool): Use POST for publish.
- Ttl (int): Per-message TTL in storage (hours).
- QueryParam (Dictionary<string, object>): Additional query string params (debug).
- CustomMessageType (string): 3–50 chars, case-sensitive, alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-.
- Sync: Command; blocks thread, throws on error.
- Async: PNCallback of type PNPublishResult.
- Execute: System.Action of type PNPublishResult, PNStatus.
- ExecuteAsync: Task<PNResult<PNPublishResult>>.

### Sample code

#### Publish a message to a channel

##### Reference code

```
1
  

```

##### Subscribe to the channel
Before running the publish example, subscribe to the same channel (via Debug Console or separate script).

### Returns

Publish() returns PNResult<PNPublishResult>:
- Result (PNPublishResult): Timetoken.
- Status (PNStatus): Operation status.

PNPublishResult:
- Timetoken (long): Publish timetoken.

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

fire() sends a message to Functions event handlers and Illuminate without replicating to subscribers and without history storage.

### Method(s)

To Fire a message you can use the following method(s) in the Unity SDK:

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

Parameters and options
- Message (required, object): Payload.
- Channel (required, string): Channel ID.
- Meta (Dictionary<string, object>): For filtering.
- UsePOST (bool): Use POST.
- QueryParam (Dictionary<string, object>): Additional query params.
- Sync: Command; blocks thread, throws on error.
- Async: PNCallback of type PNPublishResult.
- Execute: System.Action of type PNPublishResult, PNStatus.
- ExecuteAsync: Task<PNResult<PNPublishResult>>.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

signal() sends a lightweight signal to all subscribers of a channel.

Limits
- Default payload limit: 64 bytes (payload only). Contact support to increase.

### Method(s)

To Signal a message you can use the following method(s) in the Unity SDK:

```
`1pubnub.Signal()  
2    .Message(object)  
3    .Channel(string)  
4    .CustomMessageType(string)  
5    .Execute(System.ActionPNPublishResult, PNStatus>)  
`
```

Parameters and options
- Message (required, object): Payload.
- Channel (required, string): Channel ID.
- CustomMessageType (string): Same constraints as Publish.
- Execute: System.Action of type PNPublishResult, PNStatus.
- ExecuteAsync: Task<PNResult<PNPublishResult>>.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timetoken (long): Signal timetoken.

## Subscribe

Opens a TCP socket to receive messages/events for specified entities. Set subscribeKey during initialization. Configure automaticRetry to recover and fetch available messages after disconnect.

Subscription scope
- Subscription: Entity-scoped (e.g., a single channel).
- SubscriptionSet: Client-scoped; aggregates one or more subscriptions. Single listener receives events across entities.

Keep a strong reference
- Retain Subscription/SubscriptionSet instances to keep them active in memory.

### Create a subscription

An entity-level Subscription limits events to that entity.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

- options (SubscriptionOptions): Behavior configuration.

### Create a subscription set

Client-level SubscriptionSet aggregates entities.

```
`// client-based, general-scoped  
SubscriptionSet subscriptionSet = pubnub.SubscriptionSet(  
   channels: string[],  
   channelGroups: string[],  
   options: SubscriptionOptions  
)  
`
```

- channels (string[]): One or more channels. Required if channelGroups not set.
- channelGroups (string[]): One or more channel groups. Required if channels not set.
- options (SubscriptionOptions): Behavior configuration.

Add/remove sets
- You can add or remove subscriptions to manage sets.

#### SubscriptionOptions

Enum options:
- ReceivePresenceEvents: Deliver presence updates via listeners. See Presence Events.

### Method(s)

Subscription and SubscriptionSet use the same subscribe<object>() method.

#### Subscribe

To subscribe, you can use the following method in the Unity SDK:

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

- cursor (SubscriptionCursor): Best-effort recovery cursor with Timetoken (long?) and Region (int?). Primitives are converted if they represent a 17-digit number; otherwise ignored.

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

Subscribable objects for real-time updates:

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

- Channel (String): Channel ID.

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

- ChannelGroup (String): Channel group name.

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

- ChannelMetadata (String): Channel metadata ID.

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

- UserMetadata (String): User metadata ID.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and PubNub client (connection status). A single listener can receive all messages, signals, and events.

### Add listeners

Implement one or multiple listeners; can be event-specific (e.g., message, file).

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

Stop receiving all updates and remove associated entities. Client scope only.

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