# Publish/Subscribe API for C# SDK

Use the C# SDK to publish and subscribe to channels.

##### Request execution

Use try/catch for all requests. SDK throws on invalid parameters; server/network errors are returned in Status.

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

`publish()` sends a message to all subscribers of a channel.

- Initialize PubNub with publishKey.
- You don't need to subscribe to publish.
- You can't publish to multiple channels at once.
- TLS/SSL: set ssl=true during initialization; optional message encryption available.
- Payload: any JSON-serializable data. Do not JSON-serialize message or meta (SDK does it).
- Size: max 32 KiB (includes escaped chars and channel name). Aim < ~1,800 bytes.
- Throughput: best-effort; in-memory queue holds 100 messages per subscriber. Throttle bursts.
- CustomMessageType: optional business label (for example, text, action, poll).
- Best practices:
  - Publish serially; publish next only after success.
  - Verify success response; on failure, retry.
  - Keep in-memory queue under 100; throttle (e.g., ≤5 msg/s) as needed.

### Method(s)

To Publish a message:

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
- Message (required) Type: object — The payload.
- Channel (required) Type: string — Destination channel ID.
- ShouldStore Type: bool — Store in history; if omitted, history config on key is used.
- Meta Type: Dictionary<string, object> — Metadata for filtering.
- UsePOST Type: bool — Use POST to publish.
- Ttl Type: int — Per-message TTL in storage.
- QueryParam Type: Dictionary<string, object> — Extra query params (debug).
- CustomMessageType Type: string — 3–50 chars, case-sensitive, alphanumeric, dashes/underscores allowed; cannot start with special chars or pn_/pn-.
- Sync Type: Command — Deprecated. Use Execute.
- Async Type: PNCallback — Deprecated. Use ExecuteAsync.
- Execute Type: PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Publish a message to a channel

```
1
  

```

##### Subscribe to the channel

Before publishing, ensure a subscriber is listening on the channel (via Debug Console or separate script).

### Returns

`Publish()` returns PNResult<PNPublishResult>:
- Result: PNPublishResult — contains:
  - Timetoken: long — publish timetoken.
- Status: PNStatus — operation status.

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

For Mobile Push, see Mobile Push docs.

## Fire

`fire()` sends a message to Functions event handlers and Illuminate. Messages are delivered to handlers on the target channel; not replicated to subscribers and not stored in history.

### Method(s)

To Fire a message:

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
- Meta Type: Dictionary<string, object> — Metadata for filtering.
- UsePOST Type: bool — Use POST.
- QueryParam Type: Dictionary<string, object> — Extra query params (debug).
- Sync Type: Command — Deprecated. Use Execute.
- Async Type: PNCallback — Deprecated. Use ExecuteAsync.
- Execute Type: PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code

#### Fire a message to a channel

```
1
  

```

## Signal

`signal()` sends a lightweight signal to all channel subscribers.

- Payload limit: 64 bytes (payload only).

### Method(s)

To Signal a message:

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
- CustomMessageType Type: string — Same constraints as Publish.

### Sample code

#### Signal a message to a channel

```
1
  

```

### Response

- Timetoken: long — timetoken when the signal was sent.

## Subscribe

Opens a TCP socket and listens for messages/events on specified entities. Configure subscribeKey during initialization. Messages start after subscribe() completes.

### Subscription scope

Two types:
- Subscription: entity-scoped (for example, a channel).
- SubscriptionSet: client-scoped (covers multiple subscriptions on a PubNub client).

The event listener receives all messages/signals/events for subscribed entities.

### Create a subscription

Keep a strong reference to each Subscription/SubscriptionSet to avoid GC cleanup.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

Parameters:
- options Type: SubscriptionOptions — subscription behavior.

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
- channels (required if no channelGroups) Type: string[] — Channels to subscribe to.
- channelGroups (required if no channels) Type: string[] — Channel groups to subscribe to.
- options Type: SubscriptionOptions — behavior configuration.

Add/remove sets: you can add and remove subscriptions to form new sets.

#### SubscriptionOptions

Enum with:
- ReceivePresenceEvents — deliver presence updates via listener streams. See Presence Events.

### Method(s)

`Subscription` and `SubscriptionSet` use the same subscribe<object>() method.

#### Subscribe

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

Parameters:
- cursor Type: SubscriptionCursor — Best-effort cached message retrieval. Format: { Timetoken: long?; Region: int? }. Primitive values are converted; non-17-digit numbers or non-numeric strings are ignored.

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

No return value.

## Entities

Subscribable objects:
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
- Channel (required) Type: String — channel name.

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
- ChannelGroup (required) Type: String — channel group name.

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
- ChannelMetadata (required) Type: String — channel metadata identifier.

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
- UserMetadata (required) Type: String — user metadata identifier.

#### Sample code

```
1
  

```

## Event listeners

Attach listeners to Subscription, SubscriptionSet, and (for connection status) the PubNub client. A listener receives messages, signals, and events.

### Add listeners

You can implement multiple listeners or event-specific listeners.

#### Method(s)

```
1
  

```

#### Sample code

```
1
  

```

### Add connection status listener

Client scope: only on the PubNub object.

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

Stop receiving updates from all data streams and remove associated entities.

Client scope: only on the PubNub object.

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