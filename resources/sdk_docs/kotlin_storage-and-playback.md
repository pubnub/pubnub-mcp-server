# Message Persistence API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin SDK 9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and status events. Apps built with < 9.0.0 may be impacted.
- See Java/Kotlin SDK migration guide.

Message Persistence provides real-time access to stored messages (10 ns precision), replicated across multiple regions, with optional AES-256 encryption. Storage retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

Retrievable:
- Messages
- Message reactions
- Files (using the File Sharing API)

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
Enable Message Persistence for your key in the Admin Portal.

Fetch historical messages from multiple channels. Use includeMessageActions/includeActions to include message actions.

Ordering rules:
- start only: messages older than start (exclusive).
- end only: messages from end (inclusive) and newer.
- start and end: between both (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- Page by iteratively adjusting start to retrieve more.

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
- channels (required) — Type: List<String>. Channels to return history from.
- page (required) — Type: PNBoundedPage. Set limit per channel (100 max without actions, 25 with actions); set start (exclusive) and end (inclusive) timetokens.
- includeMeta — Type: Boolean. Default: false. Include message metadata.
- includeMessageActions — Type: Boolean. Default: false. Retrieve messages with message actions. If true, limited to one channel only.
- includeMessageType — Type: Boolean. Default: true. Include message type.
- includeCustomMessageType — Type: Boolean. Default: false. Include custom message type.

### Sample code[​](#sample-code)
##### Reference code
```
1
  

```

### Returns[​](#returns)
- channels — Type: HashMap<String, List<PNFetchMessageItem>>. Map of channels to lists of PNFetchMessageItem.
- page — Type: PNBoundedPage. If present, more data is available; pass into fetchMessages to continue.

#### PNFetchMessageItem[​](#pnfetchmessageitem)
- message — Type: JsonElement.
- timetoken — Type: Long. Always returned.
- meta — Type: JsonElement?. Null if not requested; empty if requested but none present.
- actions — Type: Map<String, HashMap<String, List<Action>>>?. Null if not requested. Key: action type; value: map keyed by action value with list of actions (UUIDs).
- customMessageType — Type: String.

#### Action[​](#action)
- uuid — Type: String. Publisher UUID.
- actionTimetoken — Type: String. Publish timetoken of the action.

### Other examples[​](#other-examples)

#### Paging history responses[​](#paging-history-responses)
```
1
  

```

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove messages from a channel’s history.

##### Required setting
Enable Delete-From-History in the Admin Portal and initialize the SDK with a secret key.

### Method(s)[​](#methods-1)
```
`1pubnub.deleteMessages(  
2    channels:P ListString>,  
3    start: Long,  
4    end: Long  
5).async { result -> }  
`
```

Parameters:
- channels (required) — Type: List<String>. Channels to delete from.
- start (required) — Type: Long. Start timetoken (inclusive).
- end (required) — Type: Long. End timetoken (exclusive).

### Sample code[​](#sample-code-1)
```
1
  

```

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)
Pass the publish timetoken in end and timetoken +/- 1 in start. Example: for publish timetoken 15526611838554310, use start 15526611838554309 and end 15526611838554310.
```
1
  

```

## Message counts[​](#message-counts)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

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
- channels (required) — Type: List<String>. Channels to fetch counts for.
- channelsTimetoken (required) — Type: List<Long>. Single timetoken applies to all channels, or provide one per channel (lengths must match).

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-1)
- channels — Type: Map<String, Long>. Count per channel. Channels without messages return 0. 10,000 or more returns 10000.

### Other examples[​](#other-examples-2)
```
1
  

```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence
Enable in the Admin Portal.

##### Deprecated
Will be removed in a future version. Use fetchHistory() instead.

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
- channel (required) — Type: String. Channel to return from.
- reverse — Type: Boolean. Default: false. Traverse from oldest to newest when true.
- includeTimetoken — Type: Boolean. Default: false. Include message timetokens.
- includeMeta — Type: Boolean. Default: false. Include meta if provided at publish.
- start — Type: Long. Start timetoken (exclusive).
- end — Type: Long. End timetoken (inclusive).
- count — Type: Int. Default: 100. Number of messages to return.

Using the reverse parameter:
- Messages are returned sorted ascending by time. reverse matters only when more than count messages match the interval; it determines which end to start retrieving from.

### Sample code[​](#sample-code-3)
Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns[​](#returns-2)
PNHistoryResult:
- messages — Type: List<PNHistoryItemResult>.
- startTimetoken — Type: Long.
- endTimetoken — Type: Long.

#### PNHistoryItemResult[​](#pnhistoryitemresult)
- timetoken — Type: Long?. Null if not requested.
- entry — Type: JsonElement. Message.
- meta — Type: JsonElement?. Null if not requested; empty if requested but none.

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

Last updated on Sep 3, 2025**