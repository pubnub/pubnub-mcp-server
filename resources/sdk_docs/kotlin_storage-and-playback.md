# Message Persistence API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin SDK 9.0.0 unifies Kotlin and Java SDK codebases, changes client instantiation, async callbacks, and emitted status events.
- See Java/Kotlin SDK migration guide for details.

Message Persistence provides access to stored, timestamped messages (10 ns precision), replicated across multiple zones/regions. Messages can be encrypted with AES-256. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve messages, message reactions, and files.

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  

```

## Batch history[​](#batch-history)

##### Requires Message Persistence
Enable Message Persistence for your key.

Fetch historical messages from multiple channels. Use includeMessageActions or includeActions to include message actions.

Ordering and time window:
- start only: returns messages older than start.
- end only: returns messages from end and newer.
- both: returns messages between start and end (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- Page using start to iterate through more results.

### Method(s)[​](#methods)

```
`1pubnub.fetchMessages(  
2    channels: ListString>,  
3    page: PNBoundedPage,  
4    includeMeta: Boolean,  
5    includeMessageAction: Boolean,  
6    includeMessageType: Boolean,  
7    includeCustomMessageType: Boolean,  
8).async { result -> }  
`
```

Parameters:
- channels (List<String>) Required. Channels to return history from.
- page (PNBoundedPage) Required. Pagination object:
  - limit: number per channel. If includeMessageActions=false, default/max 100; otherwise 25.
  - start: start of slice (exclusive).
  - end: end of slice (inclusive).
- includeMeta (Boolean, default false): Include message metadata.
- includeMessageActions (Boolean, default false): Include message actions. If true, limited to one channel.
- includeMessageType (Boolean, default true): Include message type.
- includeCustomMessageType (Boolean, default false): Include custom message type.

### Sample code[​](#sample-code)

##### Reference code
```
1
  

```

### Returns[​](#returns)
- channels (HashMap<String, List<PNFetchMessageItem>>): Map of channels to lists of PNFetchMessageItem.
- page (PNBoundedPage): If present, more data is available; pass to another fetchMessages call.

#### PNFetchMessageItem[​](#pnfetchmessageitem)
- message (JsonElement): Message payload.
- timetoken (Long): Message timetoken (always returned).
- meta (JsonElement?): Metadata; null if not requested; empty string if requested but none.
- actions (Map<String, HashMap<String, List<Action>>>?): Message actions; null if not requested. Outer key: action type. Inner key: action value. Value: list of actions (UUIDs that posted such action).
- customMessageType (String): Custom message type.

#### Action[​](#action)
- uuid (String): Publisher UUID.
- actionTimetoken (String): Publish timetoken of the action.

### Other examples[​](#other-examples)

#### Paging history responses[​](#paging-history-responses)
```
1
  

```

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence

Remove messages from a channel's history.

##### Required setting
Enable Delete-From-History and initialize with a secret key.

### Method(s)[​](#methods-1)

```
`1pubnub.deleteMessages(  
2    channels: ListString>,  
3    start: Long,  
4    end: Long  
5).async { result -> }  
`
```

Parameters:
- channels (List<String>) Required. Channels to delete messages from.
- start (Long) Required. Start timetoken (inclusive).
- end (Long) Required. End timetoken (exclusive).

### Sample code[​](#sample-code-1)
```
1
  

```

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)
To delete a specific message, use the publish timetoken in end and timetoken +/- 1 in start. Example: for 15526611838554310, use start=15526611838554309 and end=15526611838554310.
```
1
  

```

## Message counts[​](#message-counts)

##### Requires Message Persistence
Return the number of messages published since the given time (timetoken >= channelsTimetoken).

##### Unlimited message retention
Only messages from the last 30 days are counted.

### Method(s)[​](#methods-2)

```
`1pubnub.messageCounts(  
2    channels: ListString>,  
3    channelsTimetoken: ListLong>  
4).async { result -> }  
`
```

Parameters:
- channels (List<String>) Required. Channels to fetch counts for.
- channelsTimetoken (List<Long>) Required. If single value, applies to all channels; otherwise must match channels length.

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-1)
- channels (Map<String, Long>): Count per channel. No messages -> 0. 10,000 or more -> 10000.

### Other examples[​](#other-examples-2)
```
1
  

```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

##### Deprecated
This method is deprecated and will be removed in a future version. Please use the fetchHistory() method instead.

### Method(s)[​](#methods-3)

```
`1pubnub.history(  
2    channel: String,  
3    reverse: Boolean,  
4    includeTimetoken: Boolean,  
5    includeMeta: Boolean,  
6    start: Long,  
7    end: Long,  
8    count: Int  
9).async { result ->  }  
`
```

Parameters:
- channel (String) Required. Channel to return history from.
- reverse (Boolean, default false): Traverse oldest to newest when true.
- includeTimetoken (Boolean, default false): Include message timetokens.
- includeMeta (Boolean, default false): Include meta object (if provided at publish).
- start (Long): Start timetoken (exclusive).
- end (Long): End timetoken (inclusive).
- count (Int, default 100): Number of messages to return.

##### Using the reverse parameter:
Messages are always returned in ascending time order. reverse matters only when more than count messages match; it selects which end to start from.

### Sample code[​](#sample-code-3)
Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns[​](#returns-2)
PNHistoryResult:
- messages (List<PNHistoryItemResult>): Messages.
- startTimetoken (Long): Start timetoken.
- endTimetoken (Long): End timetoken.

#### PNHistoryItemResult[​](#pnhistoryitemresult)
- timetoken (Long?): Message timetoken; null if not requested.
- entry (JsonElement): Message.
- meta (JsonElement?): Metadata; null if not requested; empty string if requested but none.

### Other examples[​](#other-examples-3)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)
```
1
  

```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)
```
1
  

```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)
```
1
  

```

#### History paging example[​](#history-paging-example)
```
1
  

```

#### Include timetoken in history response[​](#include-timetoken-in-history-response)
```
1
**
```
Last updated on Nov 26, 2025**