# Message Persistence API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java/Kotlin SDKs, changes client instantiation, async callbacks, and status events. Apps on < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Message Persistence provides real-time access to stored messages (10 ns precision) replicated across zones/regions. Messages can be encrypted with AES-256. See Message Persistence. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (using the File Sharing API)

## Fetch history

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal. You can fetch messages from one or more channels; use includeMessageActions to include message actions.

Ordering and range:
- start only: messages older than start timetoken.
- end only: messages from end timetoken and newer.
- start and end: messages between both (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: limited to one channel and 25 messages.
Use iterative calls and adjust start to page through results.

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
- channels (required) — Type: List<String>; Channels to fetch (up to 500).
- maximumPerChannel — Type: Integer; Default: 100 (single), 25 (multi), 25 with includeMessageActions.
- start — Type: Long; Timetoken for start (exclusive).
- end — Type: Long; Timetoken for end (inclusive).
- includeMessageActions — Type: Boolean; Default: false; If true, single channel only and max 25 messages.
- includeMeta — Type: Boolean; Default: false; Include meta (if published).
- includeMessageType — Type: Boolean; Default: true.
- includeCustomMessageType — Type: Boolean; Default: false; Include custom message type (see Retrieving Messages).
- includeUUID — Type: Boolean; Default: true; Include publisher UUID.
- async — Type: Consumer<Result>; Consumer of a Result of type PNFetchMessagesResult.

##### Truncated response
When including message actions, results may be truncated. If so, a more property is returned; make iterative calls using provided parameters to fetch more.

### Sample code
Retrieve the last message on a channel:
```
1
  

```

### Returns
fetchMessages() returns a list of PNFetchMessagesResult with:
- getMessage() — Type: JsonElement; Message content.
- getMeta() — Type: JsonElement; Meta if included.
- getTimetoken() — Type: Long; Publish timetoken.
- getActionTimetoken() — Type: Long; Timestamp when action was created.
- getActions() — Type: HashMap; Actions data if included.
- getMessageType() — Type: Integer; Message type: 0 message, 1 signal, 2 object, 3 message action, 4 files.
- getCustomMessageType() — Type: String; Custom message type.
- getUuid() — Type: String; Publisher UUID.

### Other examples

#### Paging history responses
```
1
  

```

## Delete messages from history

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

##### Required setting
Enable Delete-From-History for your key and initialize the SDK with a secret key.

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
- channels (required) — Type: Array; Channels to delete from.
- start — Type: Long; Start timetoken (inclusive).
- end — Type: Long; End timetoken (exclusive).
- async — Type: Consumer<Result>; Consumer of a Result of type PNDeleteMessagesResult.

### Sample code
```
1
  

```

### Other examples

#### Delete specific message from history
To delete a specific message, pass the publish timetoken in End and timetoken - 1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.
```
1
  

```

## Message counts

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Counts messages published since the given timetoken (>= channelsTimetoken).

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
- channels (required) — Type: Array; Channels to count.
- channelsTimetoken (required) — Type: Array; Single value applies to all channels or one per channel (lengths must match).
- async — Type: Consumer<Result>; Consumer of a Result of type PNMessageCountResult.

### Sample code
```
1
  

```

### Returns
Returns PNMessageCountResult with:
- getChannels() — Type: Map<String, Long>; Count per channel. Channels with no messages have 0; channels with 10,000+ messages return 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel
```
1
  

```

## History (deprecated)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

##### Alternative method
Deprecated. Use fetch history.

Retrieves historical messages for a channel with paging controls:
- reverse=false (default): start from newest end.
- reverse=true: start from oldest end.
- Page with start or end; slice with both.
- Limit count.

Start & End usage:
- start only: older than start.
- end only: end and newer.
- both: between start and end (inclusive of end). Max 100 messages per request; page with iterative calls adjusting start.

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
- channel (required) — Type: String; Channel to fetch from.
- reverse — Type: Boolean; Default: false; Oldest→newest when true.
- includeTimetoken — Type: Boolean; Default: false; Include message timetokens.
- includeMeta — Type: Boolean; Default: false; Include meta.
- start — Type: Long; Start timetoken (exclusive).
- end — Type: Long; End timetoken (inclusive).
- count — Type: Int; Default: 100; Number of messages.
- async — Type: Consumer<Result>; Consumer of a Result of type PNHistoryResult.

Reverse behavior:
Messages are returned in ascending time order. reverse determines which end of the interval retrieval begins when more than count messages match.

### Sample code
Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns
history() returns PNHistoryResult with:
- getMessages() — Type: List<PNHistoryItemResult>; See PNHistoryItemResult.
- getStartTimetoken() — Type: Long.
- getEndTimetoken() — Type: Long.

#### PNHistoryItemResult
- getTimetoken() — Type: Long.
- getEntry() — Type: JsonElement.

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
Call with 0 or a valid timetoken.
```
1
  

```

#### Include timetoken in history
```
1
**
```

Last updated on Sep 3, 2025