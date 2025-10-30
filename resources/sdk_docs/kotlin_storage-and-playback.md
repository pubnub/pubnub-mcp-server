# Message Persistence API for Kotlin SDK

##### Breaking changes in v9.0.0

- Unifies Kotlin and Java SDKs, new PubNub client instantiation, updated async callbacks and [status events](/docs/sdks/kotlin/status-events).
- Apps built with versions < 9.0.0 may be impacted. See [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Message Persistence provides real-time access to stored messages (timestamped to 10ns, replicated across regions). Optional AES-256 encryption; see [Message Persistence](/docs/general/storage).

Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

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

## Batch history

##### Requires Message Persistence

Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Fetch historical messages from multiple channels. Use includeMessageActions (or includeActions) to include message actions.

Ordering and range:
- start only: returns messages older than start.
- end only: returns messages from end and newer.
- start and end: returns messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- For more, iterate and page using start.

### Method(s)

Use the following method(s) in the Kotlin SDK:

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
- requiredParameterDescription`channels` Type: `List<String>` Default: n/a
  Channels to return history messages from.
- `page` Type: `PNBoundedPage` Default: n/a
  Paging object. Set limit (per-channel message count): 100 default/max if includeMessageActions = false; otherwise 25. Set start (exclusive) and end (inclusive).
- `includeMeta` Type: `Boolean` Default: `false`
  Include message metadata.
- `includeMessageActions` Type: `Boolean` Default: `false`
  Retrieve messages with message actions. If `true`, limited to one channel only.
- `includeMessageType` Type: `Boolean` Default: `true`
  Include message type.
- `includeCustomMessageType` Type: `Boolean` Default: `false`
  Retrieve custom message type. See [Retrieving Messages](/docs/general/storage#retrieve-messages).

### Sample code

##### Reference code

```
1
  

```

### Returns

fetchMessages() returns:
- `channels` Type: `HashMap<String, List<PNFetchMessageItem>>`
  Map of channels to lists of PNFetchMessageItem (see below).
- `page` Type: `PNBoundedPage`
  If present, more data is available; pass it to another fetchMessages call.

#### PNFetchMessageItem

- `message` Type: `JsonElement` Message payload.
- `timetoken` Type: `Long` Message timetoken (always returned).
- `meta` Type: `JsonElement?` Null if not requested; empty string if requested but none present.
- `actions` Type: `Map<String, HashMap<String, List<Action>>>?`
  Null if not requested. Key = action type; value = map of action value -> list of actions (UUIDs that posted the action). See Action.
- `customMessageType` Type: `String` Custom message type.

#### Action

- `uuid` Type: `String` Publisher UUID.
- `actionTimetoken` Type: `String` Publish timetoken of the action.

### Other examples

#### Paging history responses

```
1
  

```

## Delete messages from history

##### Requires Message Persistence

Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Remove messages from a channel’s history.

##### Required setting

Enable Delete-From-History for your key and initialize the SDK with a secret key.

### Method(s)

To deleteMessages() use:

```
`1pubnub.deleteMessages(  
2    channels:P ListString>,  
3    start: Long,  
4    end: Long  
5).async { result -> }  
`
```

Parameters:
- requiredParameterDescription`channels` Type: `List<String>` Default: n/a
  Channels to delete from.
- `start` Type: `Long` Default: n/a
  Start timetoken (inclusive).
- `end` Type: `Long` Default: n/a
  End timetoken (exclusive).

### Sample code

```
1
  

```

### Other examples

#### Delete specific message from history

To delete a specific message, pass the publish timetoken (from publish result) in End and timetoken +/- 1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

```
1
  

```

## Message counts

##### Requires Message Persistence

Enable in the [Admin Portal](https://admin.pubnub.com/). See how to [enable add-on features](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Returns the number of messages published since given timetokens. Count includes messages with timetokens >= channelsTimetoken.

##### Unlimited message retention

Only messages from the last 30 days are counted.

### Method(s)

Use the following method(s) in the Kotlin SDK:

```
`1pubnub.messageCounts(  
2    channels: ListString>,  
3    channelsTimetoken: ListLong>  
4).async { result -> }  
`
```

Parameters:
- requiredParameterDescription`channels` Type: `List<String>` Default: n/a
  Channels to fetch counts for.
- requiredParameterDescription`channelsTimetoken` Type: `List<Long>` Default: n/a
  Either a single timetoken for all channels or a list matching channels length exactly.

### Sample code

```
1
  

```

### Returns

- `channels` Type: `Map<String, Long>`
  Per-channel counts. Channels with no messages return 0. Channels with ≥10,000 messages return 10000.

### Other examples

```
1
  

```

## History (deprecated)

##### Requires Message Persistence

Enable in the [Admin Portal](https://admin.pubnub.com/). See support page on enabling add-ons.

##### Deprecated

This method is deprecated and will be removed. Use fetchHistory() instead.

### Method(s)

Use the following method(s) in the Kotlin SDK:

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
- requiredParameterDescription`channel` Type: `String` Default: n/a
  Channel to return history from.
- `reverse` Type: `Boolean` Default: `false`
  Traverse from oldest to newest when true. Messages are returned sorted ascending by time; reverse affects which end is fetched first when more than count messages match.
- `includeTimetoken` Type: `Boolean` Default: `false`
  Include message timetokens.
- `includeMeta` Type: `Boolean` Default: `false`
  Include meta object if provided at publish time.
- `start` Type: `Long` Default: n/a
  Start timetoken (exclusive).
- `end` Type: `Long` Default: n/a
  End timetoken (inclusive).
- `count` Type: `Int` Default: `100`
  Number of messages to return.

### Sample code

Retrieve the last 100 messages on a channel:

```
1
  

```

### Returns

history() returns `PNHistoryResult`:
- `messages` Type: `List<PNHistoryItemResult>` Messages.
- `startTimetoken` Type: `Long`
- `endTimetoken` Type: `Long`

#### PNHistoryItemResult

- `timetoken` Type: `Long?` Null if not requested.
- `entry` Type: `JsonElement` Message payload.
- `meta` Type: `JsonElement?` Null if not requested; empty string if requested but none present.

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
Last updated on Sep 3, 2025**