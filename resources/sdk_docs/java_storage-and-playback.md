# Message Persistence API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and Kotlin SDK codebases, introduces a new client instantiation pattern, and changes asynchronous API callbacks and emitted status events. Applications using versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Message Persistence provides real-time access to historical messages. Messages are timestamped to 10 ns precision, stored redundantly across regions, and can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal. You can fetch from one or more channels and optionally include message actions.

Ordering rules:
- start only: returns messages older than start (exclusive).
- end only: returns messages from end (inclusive) and newer.
- start and end: returns messages between them (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- With includeMessageActions(true): limited to one channel and 25 messages.
Use paginated calls by updating the start timetoken.

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
  - Include message actions; if true, restricted to one channel and 25 messages.
- includeMeta
  - Type: Boolean
  - Default: false
  - Include meta object if published.
- includeMessageType
  - Type: Boolean
  - Default: true
  - Include message type.
- includeCustomMessageType
  - Type: Boolean
  - Default: false
  - Include custom message type.
- includeUUID
  - Type: Boolean
  - Default: true
  - Include publisher UUID.
- async
  - Type: Consumer<Result>
  - Result type: PNFetchMessagesResult

##### Truncated response
When including message actions, responses may be truncated. A more property is returned; continue with iterative calls using its parameters.

### Sample code

##### Reference code
Retrieve the last message on a channel:
```
1
  
```

### Returns
fetchMessages() returns a list of PNFetchMessagesResult entries with:
- getMessage() — Type: JsonElement — Message content.
- getMeta() — Type: JsonElement — Meta if includeMeta(true).
- getTimetoken() — Type: Long — Publish timetoken.
- getActionTimetoken() — Type: Long — When the message action was created.
- getActions() — Type: HashMap — Actions if includeMessageActions(true).
- getMessageType() — Type: Integer — Message type: 0 message, 1 signal, 2 object, 3 message action, 4 files.
- getCustomMessageType() — Type: String — Custom message type.
- getUuid() — Type: String — Publisher UUID.

### Other examples

#### Paging history responses
```
1
  
```

## Delete messages from history

##### Requires Message Persistence
Enable Message Persistence and Delete-From-History in the Admin Portal, and initialize the SDK with a secret key.

Remove messages from a channel's history.

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
  - Channels to delete from.
- start
  - Type: Long
  - Start timetoken (inclusive).
- end
  - Type: Long
  - End timetoken (exclusive).
- async
  - Type: Consumer<Result>
  - Result type: PNDeleteMessagesResult

### Sample code
```
1
  
```

### Other examples

#### Delete specific message from history
To delete a specific message, pass the publish timetoken in End and timetoken +/- 1 in Start.
Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.
```
1
  
```

## Message counts

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Return the number of messages published since the given time. Count includes messages with timetoken >= channelsTimetoken.

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
  - Timetokens aligned with channels. A single timetoken applies to all channels; otherwise, lengths must match exactly.
- async
  - Type: Consumer<Result>
  - Result type: PNMessageCountResult

### Sample code
```
1
  
```

### Returns
PNMessageCountResult:
- getChannels() — Type: Map<String, Long> — Count per channel. Channels with 0 messages return 0. Channels with 10,000+ messages return 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel
```
1
  
```

## History (deprecated)

##### Requires Message Persistence
This method is deprecated. Use fetch history instead.

Fetch historical messages of a single channel with control over direction and paging.
- reverse=false (default): search from newest end.
- reverse=true: search from oldest end.
- Page by providing start OR end timetokens.
- Retrieve a slice by providing both start AND end.
- Limit results with count.

Start/End clarity:
- start only: returns messages older than start (exclusive).
- end only: returns messages matching end and newer (inclusive).
- both: returns messages between them (end inclusive).
Max 100 messages per call (or count). Page by adjusting start.

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
  - Channel to return history from.
- reverse
  - Type: Boolean
  - Default: false
  - If true, traverse oldest to newest.
- includeTimetoken
  - Type: Boolean
  - Default: false
  - Include message timetokens in response.
- includeMeta
  - Type: Boolean
  - Default: false
  - Include meta object if published.
- start
  - Type: Long
  - Start timetoken (exclusive).
- end
  - Type: Long
  - End timetoken (inclusive).
- count
  - Type: Int
  - Default: 100
  - Number of messages to return.
- async
  - Type: Consumer<Result>
  - Result type: PNHistoryResult

##### Using the reverse parameter
Messages are always returned sorted ascending by timetoken. reverse affects which end of the interval is used to begin fetching when more than count messages match.

### Sample code
Retrieve the last 100 messages on a channel:
```
1
  
```

### Returns
PNHistoryResult:
- getMessages() — Type: List<PNHistoryItemResult> — List of messages.
- getStartTimetoken() — Type: Long — Start timetoken.
- getEndTimetoken() — Type: Long — End timetoken.

#### PNHistoryItemResult
- getTimetoken() — Type: Long — Message timetoken.
- getEntry() — Type: JsonElement — Message.

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse
```
1
  
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest to newest starting at a single point in time (exclusive)
```
1
  
```

#### Use history() to retrieve messages until a given timetoken by paging from newest to oldest until a specific end point in time (inclusive)
```
1
  
```

#### History paging example

##### Usage
Call the method by passing 0 or a valid timetoken.
```
1
  
```

#### Include timetoken in history
```
1
** 
```