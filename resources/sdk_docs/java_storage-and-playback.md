# Message Persistence API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, updates client instantiation, and changes async callbacks and emitted [status events](/docs/sdks/java/status-events). Applications built with versions < 9.0.0 may need changes. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Message Persistence stores published messages with 10-ns timestamps across multiple regions. Optional AES-256 encryption is supported. See [Message Persistence](/docs/general/storage).

Retention policy (per key): 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

##### Requires Message Persistence
Enable it for your key in the [Admin Portal](https://admin.pubnub.com/). See [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Result ordering and time window:
- start only: messages older than start timetoken (exclusive).
- end only: messages from end timetoken and newer (inclusive of end).
- start and end: messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- With includeMessageActions = true: limited to one channel and 25 messages.

Page by iterating calls and adjusting start.

### Method(s)

Use the following method(s) in the Java SDK:

```
`1this.pubnub.fetchMessages()  
2    .channels(ListString>)  
3    .maximumPerChannel(Integer)  
4    .start(Long)  
5    .end(Long)  
6    .includeMessageActions(Boolean)  
7    .includeMeta(Boolean)  
8    .includeMessageType(Boolean)  
9    .includeCustomMessageType(Boolean)  
10    .includeUUID(Boolean)  
`
```

Parameters:
- channels (required)
  - Type: List<String>
  - Channels to fetch history from (up to 500).
- maximumPerChannel
  - Type: Integer
  - Default/Max: 100 (single channel), 25 (multi-channel), 25 with includeMessageActions.
- start
  - Type: Long
  - Start timetoken (exclusive).
- end
  - Type: Long
  - End timetoken (inclusive).
- includeMessageActions
  - Type: Boolean
  - Default: false
  - Include message actions; forces single channel and 25 messages.
- includeMeta
  - Type: Boolean
  - Default: false
  - Include meta if published with the message.
- includeMessageType
  - Type: Boolean
  - Default: true
- includeCustomMessageType
  - Type: Boolean
  - Default: false
  - Include custom message type. See [Retrieving Messages](/docs/general/storage#retrieve-messages).
- includeUUID
  - Type: Boolean
  - Default: true
- async
  - Type: Consumer<Result>
  - Consumer of PNFetchMessagesResult.

##### Truncated response
When includeMessageActions is true, responses may be truncated. A more property may be returned; iterate with the provided parameters to fetch more.

### Sample code

##### Reference code
Retrieve the last message on a channel:

```
1
  

```

### Returns

fetchMessages() returns a list of PNFetchMessagesResult objects with:
- getMessage(): JsonElement — message content.
- getMeta(): JsonElement — meta if included.
- getTimetoken(): Long — publish timetoken.
- getActionTimetoken(): Long — timetoken when the message action was created.
- getActions(): HashMap — actions data if included.
- getMessageType(): Integer — message type:
  - 0: message, 1: signal, 2: object, 3: message action, 4: files
- getCustomMessageType(): String — custom message type.
- getUuid(): String — publisher UUID.

### Other examples

#### Paging history responses

```
1
  

```

## Delete messages from history

##### Requires Message Persistence
Enable in the [Admin Portal](https://admin.pubnub.com/). See [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Remove messages from a specific channel’s history.

##### Required setting
Enable Delete-From-History for your key in the Admin Portal and initialize the SDK with a secret key.

### Method(s)

Use the following method(s) in the Java SDK:

```
`1this.pubnub.deleteMessages()  
2    .channels(Array)  
3    .start(Long)  
4    .end(Long)  
`
```

Parameters:
- channels (required)
  - Type: Array
  - Channels to delete messages from.
- start
  - Type: Long
  - Start timetoken (inclusive).
- end
  - Type: Long
  - End timetoken (exclusive).
- async
  - Type: Consumer<Result>
  - Consumer of PNDeleteMessagesResult.

### Sample code

```
1
  

```

### Other examples

#### Delete specific message from history
To delete a specific message: set End to the publish timetoken and Start to timetoken - 1. Example: for publish timetoken 15526611838554310, use Start = 15526611838554309 and End = 15526611838554310.

```
1
  

```

## Message counts

##### Requires Message Persistence
Enable in the [Admin Portal](https://admin.pubnub.com/). See [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Return the number of messages published since the given time. Count is messages with timetoken >= channelsTimetoken.

##### Unlimited message retention
Only messages from the last 30 days are counted.

### Method(s)

Use the following method(s) in the Java SDK:

```
`1this.pubnub.messageCounts()  
2    .channels(Array)  
3    .channelsTimetoken(Array)  
`
```

Parameters:
- channels (required)
  - Type: Array
  - Channels to fetch message counts for.
- channelsTimetoken (required)
  - Type: Array
  - Either a single timetoken for all channels or one per channel (lengths must match).
- async
  - Type: Consumer<Result>
  - Consumer of PNMessageCountResult.

### Sample code

```
1
  

```

### Returns

PNMessageCountResult:
- getChannels(): Map<String, Long> — per-channel counts. Channels with no messages: 0. Channels with 10,000+ messages: 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
  

```

## History (deprecated)

##### Requires Message Persistence
Enable in the [Admin Portal](https://admin.pubnub.com/). See [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

##### Alternative method
Deprecated. Use fetch history instead.

Fetch historical messages of a channel with control over direction, paging, and time slicing.

Behavior:
- reverse=false (default): search from newest end.
- reverse=true: search from oldest end.
- Page with start OR end timetoken.
- Slice with both start AND end.
- Limit with count (max 100).

Start/End semantics:
- start only: messages older than start (exclusive).
- end only: messages at end and newer (inclusive).
- both: between them (inclusive of end).
- Max returned: 100; page with iterative calls adjusting start.

### Method(s)

Use the following method(s) in the Java SDK:

```
`1this.pubnub.history()  
2    .channel(String)  
3    .reverse(Boolean)  
4    .includeTimetoken(Boolean)  
5    .includeMeta(Boolean)  
6    .start(Long)  
7    .end(Long)  
8    .count(Integer);  
`
```

Parameters:
- channel (required)
  - Type: String
- reverse
  - Type: Boolean
  - Default: false
- includeTimetoken
  - Type: Boolean
  - Default: false
- includeMeta
  - Type: Boolean
  - Default: false
- start
  - Type: Long
  - Start timetoken (exclusive).
- end
  - Type: Long
  - End timetoken (inclusive).
- count
  - Type: Int
  - Default: 100
- async
  - Type: Consumer<Result>
  - Consumer of PNHistoryResult.

Note on reverse:
Messages are returned in ascending time order. reverse only determines which end of the interval to start from when the interval exceeds count.

### Sample code
Retrieve the last 100 messages on a channel:

```
1
  

```

### Returns

PNHistoryResult:
- getMessages(): List<PNHistoryItemResult> — messages.
- getStartTimetoken(): Long — start timetoken.
- getEndTimetoken(): Long — end timetoken.

#### PNHistoryItemResult
- getTimetoken(): Long — message timetoken.
- getEntry(): JsonElement — message.

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
1
  

```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

```
1
  

```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

```
1
  

```

#### History paging example

##### Usage
Call the method by passing 0 or a valid timetoken as the argument.

```
1
  

```

#### Include timetoken in history

```
1
**
```

Last updated on Sep 3, 2025