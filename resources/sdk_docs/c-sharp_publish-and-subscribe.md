# Publish/Subscribe API for C# SDK

Low-latency publish/subscribe using the C# SDK. See Connection Management and Publish Messages for broader context.

##### Request execution

Use try/catch. Invalid parameters throw exceptions; server/network errors are in Status.

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

Send a message to all subscribers on a channel.

Key points:
- Initialize with publishKey.
- You don't need to subscribe to publish.
- Can't publish to multiple channels simultaneously.
- Enable TLS/SSL via ssl: true; optional message encryption.
- Messages: any JSON-serializable data; UTF-8 strings supported.
- Don't JSON serialize message/meta yourself (SDK handles it).
- Max message size 32 KiB (includes escaped characters and channel); aim < 1,800 bytes; otherwise Message Too Large error.
- Throughput: best-effort with in-memory queue of 100; throttle bursts.
- Optional CustomMessageType for business labels (for example, text, action, poll).
- Best practices:
  - Publish serially; verify success code before next publish.
  - Retry on failure.
  - Keep in-memory queue under 100.
  - Throttle (for example, ≤5 msgs/sec) to meet latency needs.

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

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- ShouldStore Type: bool — Store in history; if omitted, use key’s history configuration.
- Meta Type: Dictionary<string, object> — Metadata for filtering.
- UsePOST Type: bool — Use POST to publish.
- Ttl Type: int — Per-message TTL in storage.
- QueryParam Type: Dictionary<string, object> — Extra query string params.
- CustomMessageType Type: string — 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- Sync Type: Command — Deprecated. Use Execute.
- Async Type: PNCallback of PNPublishResult — Deprecated. Use ExecuteAsync.
- Execute Type: PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code[​](#sample-code)

##### Reference code

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

```
1
  

```

##### Subscribe to the channel

Before running the above publish example, either use the Debug Console or in a separate script, subscribe to the same channel.

### Returns[​](#returns)

Publish() returns PNResult<PNPublishResult>:
- Result: PNPublishResult — Timetoken (long) when published.
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

Send a message to Functions handlers and Illuminate. Not replicated to subscribers; not stored in history.

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

Parameters:
- Message (required) Type: object — Payload.
- Channel (required) Type: string — Destination channel ID.
- Meta Type: Dictionary<string, object>.
- UsePOST Type: bool.
- QueryParam Type: Dictionary<string, object>.
- Sync Type: Command — Deprecated. Use Execute.
- Async Type: PNCallback of PNPublishResult — Deprecated. Use ExecuteAsync.
- Execute Type: PNCallback of PNPublishResult.
- ExecuteAsync Type: None — Returns Task<PNResult<PNPublishResult>>.

### Sample code[​](#sample-code-1)

#### Fire a message to a channel[​](#fire-a-message-to-a-channel)

```
1
  

```

## Signal[​](#signal)

Send lightweight signals to all channel subscribers. Payload limit: 64 bytes (payload only).

### Method(s)[​](#methods-2)

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
- CustomMessageType Type: string — 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).

### Sample code[​](#sample-code-2)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
1
  

```

### Response[​](#response)

- Timetoken: long — When the signal was sent.

## Subscribe[​](#subscribe)

Open a socket and listen for messages/events. Initialize with subscribeKey.

##### Conceptual overview

Subscribe to entities:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

A newly subscribed client receives messages after subscribe() completes.

### Subscription scope[​](#subscription-scope)

- Subscription: entity-scoped (for example, a single channel).
- SubscriptionSet: client-scoped; can include multiple subscriptions.

Event listeners deliver messages, signals, and events. See Event listeners.

### Create a subscription[​](#create-a-subscription)

Keep a strong reference to each Subscription/SubscriptionSet to avoid GC.

```
// entity-based, local-scoped  
Channel firstChannel = pubnub.Channel("first");  

  
Subscription subscription = firstChannel.Subscription(SubscriptionOptions options);  

```

Parameters:
- options Type: SubscriptionOptions — Subscription behavior.

### Create a subscription set[​](#create-a-subscription-set)

Keep a strong reference to each Subscription/SubscriptionSet to avoid GC.

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
- channels Type: string[] — One or more channels; required if channelGroups not provided.
- channelGroups Type: string[] — One or more channel groups; required if channels not provided.
- options Type: SubscriptionOptions.

##### Add/remove sets

You can add and remove subscriptions to create new sets. Refer to the Other examples section.

#### `SubscriptionOptions`[​](#subscriptionoptions)

- ReceivePresenceEvents — Deliver presence updates for userIds via listeners. See Presence Events.

### Method(s)[​](#methods-3)

`Subscription` and `SubscriptionSet` share the same subscribe<object>() method.

#### Subscribe[​](#subscribe-1)

```
`subscription.Subscribeobject>(SubscriptionCursor cursor)  
`
```

Parameters:
- cursor Type: SubscriptionCursor — Best-effort retrieval of cached messages from timetoken/region: cursor: { Timetoken: long?; Region: int? }. Primitive types are converted to SubscriptionCursor; non-numeric values are ignored.

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

No return value.

## Entities[​](#entities)

Subscribable objects:
- Channel
- ChannelGroup
- UserMetadata
- ChannelMetadata

### Create channels[​](#create-channels)

```
`pubnub.Channel(String)  
`
```

Parameters:
- Channel Type: String — Channel name.

#### Sample code[​](#sample-code-4)

```
1
  

```

### Create channel groups[​](#create-channel-groups)

```
`pubnub.ChannelGroup(String)  
`
```

Parameters:
- ChannelGroup Type: String — Channel group name.

#### Sample code[​](#sample-code-5)

```
1
  

```

### Create channel metadata[​](#create-channel-metadata)

```
`pubnub.ChannelMetadata(String)  
`
```

Parameters:
- ChannelMetadata Type: String — Channel metadata identifier.

#### Sample code[​](#sample-code-6)

```
1
  

```

### Create user metadata[​](#create-user-metadata)

```
`pubnub.UserMetadata(String)  
`
```

Parameters:
- UserMetadata Type: String — User metadata identifier.

#### Sample code[​](#sample-code-7)

```
1
  

```

## Event listeners[​](#event-listeners)

Attach listeners to Subscription, SubscriptionSet, and PubNub client (connection status).

### Add listeners[​](#add-listeners)

You can register a generic onEvent listener or event-specific ones (message, file, etc).

#### Method(s)[​](#methods-4)

```
1
  

```

#### Sample code[​](#sample-code-8)

```
1
  

```

### Add connection status listener[​](#add-connection-status-listener)

Client scope only.

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

Stop receiving real-time updates from a Subscription or SubscriptionSet.

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

Stop receiving all updates and remove related entities. Client scope only.

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