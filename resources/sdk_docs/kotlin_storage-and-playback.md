# Message Persistence API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes PubNub client instantiation, and updates async callbacks and emitted status events. Apps built with < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

Message Persistence stores timestamped messages (10ns precision) across multiple regions. Optional AES-256 encryption. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

##### Request execution
Most methods return an Endpoint you must execute with .sync() or .async().

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

## Batch history

##### Requires Message Persistence
Enable in the Admin Portal.

Fetch messages across multiple channels. Use includeMessageActions/includeActions to include message actions.

Time window rules:
- start only: messages older than start (exclusive).
- end only: messages from end (inclusive) and newer.
- start and end: between start (exclusive) and end (inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
Page iteratively by adjusting start.

### Method(s)
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
- channels (List<String>) — required. Channels to fetch from.
- page (PNBoundedPage) — required. Pagination:
  - limit: messages per channel. If includeMessageActions = false, default/max 100; otherwise 25.
  - start: start of slice (exclusive).
  - end: end of slice (inclusive).
- includeMeta (Boolean, default false) — include message metadata.
- includeMessageActions (Boolean, default false) — include message actions. When true, limited to one channel.
- includeMessageType (Boolean, default true) — include message type.
- includeCustomMessageType (Boolean, default false) — include custom message type.

### Sample code
##### Reference code
```
1
  
```

### Returns
fetchMessages() returns:
- channels: HashMap<String, List<PNFetchMessageItem>> — map of channel to list of PNFetchMessageItem.
- page: PNBoundedPage — if present, more data is available; pass it to fetch next page.

#### PNFetchMessageItem
- message: JsonElement
- timetoken: Long — always returned.
- meta: JsonElement? — null if not requested; empty when requested but not present.
- actions: Map<String, HashMap<String, List<Action>>>? — null if not requested. Outer key: action type. Inner key: action value. List contains actions (UUIDs) that posted the action.
- customMessageType: String

#### Action
- uuid: String — publisher UUID.
- actionTimetoken: String — publish timetoken of the action.

### Other examples

#### Paging history responses
```
1
  
```

## Delete messages from history

##### Requires Message Persistence
Enable in the Admin Portal.

Remove messages from a channel.

##### Required setting
Enable Delete-From-History for your key and initialize the SDK with a secret key.

### Method(s)
```
`1pubnub.deleteMessages(  
2    channels:P ListString>,  
3    start: Long,  
4    end: Long  
5).async { result -> }  
`
```

Parameters:
- channels (List<String>) — required. Channels to delete from.
- start (Long) — required. Start of slice (inclusive).
- end (Long) — required. End of slice (exclusive).

### Sample code
```
1
  
```

### Other examples

#### Delete specific message from history
To delete a specific message, use publish timetoken as End and timetoken +/- 1 as Start. Example: for 15526611838554310, use Start=15526611838554309 and End=15526611838554310.

```
1
  
```

## Message counts

##### Requires Message Persistence
Enable in the Admin Portal.

Return the number of messages published since the given time. Count is messages with timetoken >= channelsTimetoken.

##### Unlimited message retention
Only messages from the last 30 days are counted.

### Method(s)
```
`1pubnub.messageCounts(  
2    channels: ListString>,  
3    channelsTimetoken: ListLong>  
4).async { result -> }  
`
```

Parameters:
- channels (List<String>) — required. Channels to count.
- channelsTimetoken (List<Long>) — required. Single entry applies to all channels; otherwise list length must match channels.

### Sample code
```
1
  
```

### Returns
- channels: Map<String, Long> — counts per channel. 0 for none; 10000 when >= 10,000 messages.

### Other examples
```
1
  
```

## History (deprecated)

##### Requires Message Persistence
Enable in the Admin Portal.

##### Deprecated
Will be removed in a future version. Use fetchHistory() instead.

### Method(s)
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
- channel (String) — required. Channel to fetch.
- reverse (Boolean, default false) — traverse from oldest to newest when true. Messages are returned in ascending time. reverse determines which end of the interval to start from when more than count messages are present.
- includeTimetoken (Boolean, default false) — include message timetokens.
- includeMeta (Boolean, default false) — include meta object.
- start (Long) — start of slice (exclusive).
- end (Long) — end of slice (inclusive).
- count (Int, default 100) — number of messages to return.

### Sample code
Retrieve the last 100 messages on a channel:
```
1
  
```

### Returns
history() returns PNHistoryResult:
- messages: List<PNHistoryItemResult>
- startTimetoken: Long
- endTimetoken: Long

#### PNHistoryItemResult
- timetoken: Long? — null if not requested.
- entry: JsonElement
- meta: JsonElement? — null if not requested; empty when requested but not present.

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
```
1
  
```

#### Include timetoken in history response
```
1
**
```