# Message Persistence API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java and Kotlin SDK codebases, changes PubNub client instantiation, and updates async callbacks and emitted status events. Apps using < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Message Persistence stores timestamped (10 ns) messages redundantly across regions and supports AES-256 encryption. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Return behavior:
- Only start: messages older than start (exclusive).
- Only end: messages from end (inclusive) and newer.
- Both start and end: messages between them (inclusive on end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions(true): limited to one channel and 25 messages.
Page by making iterative calls and adjusting start.

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
  - Default: n/a
  - Channels to fetch history from (up to 500).
- maximumPerChannel
  - Type: Integer
  - Default: 100 (single channel) or 25 (multi) and 25 with includeMessageActions.
  - Number of messages to return.
- start
  - Type: Long
  - Default: n/a
  - Start timetoken (exclusive).
- end
  - Type: Long
  - Default: n/a
  - End timetoken (inclusive).
- includeMessageActions
  - Type: Boolean
  - Default: false
  - Include message actions. If true, limited to one channel and 25 messages.
- includeMeta
  - Type: Boolean
  - Default: false
  - Include meta object (if provided at publish).
- includeMessageType
  - Type: Boolean
  - Default: true
  - Include message type.
- includeCustomMessageType
  - Type: Boolean
  - Default: false
  - Include custom message type. See Retrieving Messages.
- includeUUID
  - Type: Boolean
  - Default: true
  - Include publisher UUID.
- async (required)
  - Type: Consumer<Result>
  - Result type: PNFetchMessagesResult

##### Truncated response
When fetching with message actions, responses may be truncated. A more property is returned with additional parameters. Continue fetching iteratively using provided parameters.

### Sample code

##### Reference code
Retrieve the last message on a channel:

```
1
  

```

### Returns
fetchMessages() returns a list of PNFetchMessagesResult with:
- getMessage() — Type: JsonElement — Message content.
- getMeta() — Type: JsonElement — Meta if requested via includeMeta(true).
- getTimetoken() — Type: Long — Publish timetoken.
- getActionTimetoken() — Type: Long — Timestamp when the message action was created.
- getActions() — Type: HashMap — Actions data if includeMessageActions(true).
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
Enable Message Persistence in the Admin Portal.

Remove messages for a specific channel or channels.

##### Required setting
Enable Delete-From-History in the Admin Portal and initialize the SDK with a secret key.

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
  - Default: n/a
  - Channels to delete messages from.
- start
  - Type: Long
  - Default: n/a
  - Start timetoken (inclusive).
- end
  - Type: Long
  - Default: n/a
  - End timetoken (exclusive).
- async (required)
  - Type: Consumer<Result>
  - Result type: PNDeleteMessagesResult

### Sample code

```
1
  

```

### Other examples

#### Delete specific message from history
To delete a specific message, pass its publish timetoken in End and timetoken ± 1 in Start. Example: for publish timetoken 15526611838554310, use Start 15526611838554309 and End 15526611838554310.

```
1
  

```

## Message counts

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Return the number of messages published since given time. Count includes messages with timetoken >= channelsTimetoken.

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
  - Default: n/a
  - Channels to fetch the message count.
- channelsTimetoken (required)
  - Type: Array
  - Default: n/a
  - Same order as channels. A single timetoken applies to all channels; otherwise lengths must match exactly.
- async (required)
  - Type: Consumer<Result>
  - Result type: PNMessageCountResult

### Sample code

```
1
  

```

### Returns
PNMessageCountResult:
- getChannels() — Type: Map<String, Long> — Count per channel. Channels without messages have 0. Channels with 10,000+ messages return 10000.

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
  

```

## History (deprecated)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

##### Alternative method
This method is deprecated. Use fetch history instead.

Fetch historical messages for a channel. You can:
- Use reverse=false (default) to search from newest end; reverse=true from oldest.
- Page by providing start OR end timetoken.
- Retrieve a slice by providing both start AND end.
- Limit results with count.

Start & End usage:
- Only start: messages older than start (exclusive).
- Only end: messages matching end and newer (inclusive on end).
- Both: between start and end (inclusive on end).
Max 100 messages per call; page by adjusting start.

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
  - Default: n/a
  - Channel to return history from.
- reverse
  - Type: Boolean
  - Default: false
  - Oldest to newest if true.
- includeTimetoken
  - Type: Boolean
  - Default: false
  - Include message timetokens.
- includeMeta
  - Type: Boolean
  - Default: false
  - Include meta object.
- start
  - Type: Long
  - Default: n/a
  - Start timetoken (exclusive).
- end
  - Type: Long
  - Default: n/a
  - End timetoken (inclusive).
- count
  - Type: Int
  - Default: 100
  - Number of messages to return.
- async (required)
  - Type: Consumer<Result>
  - Result type: PNHistoryResult

##### Using the reverse parameter
History always returns results sorted ascending by time. reverse affects which side of the interval to begin when more than count messages exist.

### Sample code
Retrieve the last 100 messages on a channel:

```
1
  

```

### Returns
PNHistoryResult:
- getMessages() — Type: List<PNHistoryItemResult> — History items.
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
Call the method by passing 0 or a valid timetoken.

```
1
  

```

#### Include timetoken in history

```
1
**
```

Last updated on Sep 3, 2025