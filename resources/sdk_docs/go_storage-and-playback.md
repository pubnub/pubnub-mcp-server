# Message Persistence API for Go SDK

Message Persistence provides access to stored messages (timestamped to ~10ns) across multiple regions. Messages can be encrypted with AES-256. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages from one or multiple channels. Use includeMessageActions to fetch actions with messages.

Ordering and range:
- start only: messages older than start timetoken.
- end only: messages from end timetoken and newer.
- start and end: messages between start and end (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500 channels): up to 25 per channel.
- If IncludeMessageActions is true: limited to one channel and 25 messages.
- For more results, page using start in iterative calls.

### Method(s)

```
`1pn.Fetch().  
2    Channels(channels).  
3    Count(count).  
4    Start(start).  
5    End(end).  
6    IncludeMeta(bool).  
7    IncludeMessageType(bool).  
8    IncludeUUID(bool).  
9    IncludeMessageActions(bool).  
10    IncludeCustomMessageType(bool).  
11    QueryParam(queryParam).  
12    Execute()  
`
```

Parameters:
- Channels (required)
  - Type: string
  - Default: n/a
  - Specifies channels to return history messages. Max 500 channels.
- Count
  - Type: int
  - Default: 100 (single channel) or 25 (multiple channels); 25 when IncludeMessageActions is true
  - Number of messages to return.
- Start
  - Type: int64
  - Timetoken marking exclusive start of time slice.
- End
  - Type: int64
  - Timetoken marking inclusive end of time slice.
- IncludeMeta
  - Type: bool
  - Default: false
  - Include meta (sent during publish).
- IncludeMessageType
  - Type: bool
  - Default: true
  - Include message type with each history message.
- IncludeUUID
  - Type: bool
  - Default: true
  - Include publisher uuid.
- IncludeMessageActions
  - Type: bool
  - Default: false
  - Include message actions. If true, limited to one channel and 25 messages.
- IncludeCustomMessageType
  - Type: bool
  - Default: n/a
  - Retrieve messages with custom message type.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Additional query string parameters.

Truncated response:
- When fetching messages with actions, response may include a more property. Make iterative calls using returned parameters to fetch more.

### Sample code

Reference code: retrieve the last messages on a channel.

```
1
  

```

### Returns

Fetch() returns FetchResponse with:
- Messages: map[string][]FetchResponseItem — keys are channel names; values are arrays of message items.

FetchResponseItem:
- Message: interface — message from history.
- Timetoken: string — message timetoken.
- Meta: interface — metadata (if sent with message).
- MessageType: int — message type (4 for file messages).
- UUID: string — publisher UUID.
- MessageActions: map[string]PNHistoryMessageActionsTypeMap — message actions (see below).
- File: PNFileDetails — file details if message contains a file.
- Error: error — decryption error if message couldn’t be decrypted.

PNHistoryMessageActionsTypeMap:
- ActionsTypeValues: map[string][]PNHistoryMessageActionTypeVal

PNHistoryMessageActionTypeVal:
- UUID: string — publisher UUID of the action.
- ActionTimetoken: string — publish timetoken of the action.

### Status response

- Error: error
- Category: StatusCategory
- Operation: OperationType
- StatusCode: int
- TLSEnabled: bool
- UUID: string
- AuthKey: string
- Origin: string
- OriginalResponse: string
- Request: string
- AffectedChannels: []string
- AffectedChannelGroups: []string

### Other examples

Fetch with metadata:

```
1
  

```

Fetch with time range:

```
1
  

```

Fetch from multiple channels:

```
1
  

```

## Delete messages from history

Requires Message Persistence.

Remove messages from the history of a specific channel.

Required setting:
- Enable Delete-From-History in Admin Portal.
- Initialize SDK with a secret key.

### Method(s)

```
`1pn.DeleteMessages().  
2    Channel(channel).  
3    Start(start).  
4    End(end).  
5    QueryParam(queryParam).  
6    Execute()  
`
```

Parameters:
- Channel (required)
  - Type: string
  - Specifies channel to delete messages from.
- Start
  - Type: int64
  - Timetoken delimiting inclusive start of time slice to delete.
- End
  - Type: int64
  - Timetoken delimiting exclusive end of time slice to delete.
- QueryParam
  - Type: map[string]string
  - Additional query string parameters.

### Sample code

```
1
  

```

### Returns

DeleteMessages() returns an empty HistoryDeleteResponse. Check status for success.

### Status response

- Error: error
- Category: StatusCategory
- Operation: OperationType
- StatusCode: int
- TLSEnabled: bool
- UUID: string
- AuthKey: string
- Origin: string
- OriginalResponse: string
- Request: string
- AffectedChannels: []string
- AffectedChannelGroups: []string

### Other examples

Delete specific message from history:
- Use publish timetoken in End, and timetoken-1 in Start.
- Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

```
1
  

```

## Message counts

Requires Message Persistence.

Returns number of messages on channels since a given time. Count is the number of messages with timetoken >= value in ChannelsTimetoken.

Unlimited message retention:
- With unlimited retention, counts consider only messages from the last 30 days.

### Method(s)

```
`1pn.MessageCounts().  
2    Channels(channels).  
3    ChannelsTimetoken(channelsTimetoken).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels (required)
  - Type: []string
  - Default: n/a
  - Channels to fetch counts for.
- ChannelsTimetoken (required)
  - Type: []int64
  - Default: nil
  - Array of timetokens in same order as channels. A single timetoken applies to all channels. Otherwise, lengths must match or an error PNStatus is returned.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Additional query string parameters.

### Sample code

```
1
  

```

### Returns

MessageCounts() returns MessageCountsResponse with:
- Channels: map[string]int — channel names to message counts. 0 if no messages; 10000 if 10,000 or more.

### Status response

- Error: error
- Category: StatusCategory
- Operation: OperationType
- StatusCode: int
- TLSEnabled: bool
- UUID: string
- AuthKey: string
- Origin: string
- OriginalResponse: string
- Request: string
- AffectedChannels: []string
- AffectedChannelGroups: []string

### Other examples

Retrieve count of messages using different timetokens for each channel:

```
1
  

```

## History (deprecated)

Requires Message Persistence. Deprecated — use Fetch History instead.

Fetch historical messages of a channel. Controls:
- Reverse: false (default) searches from newest; true searches from oldest.
- Page using Start or End.
- Slice using Start and End.
- Limit using Count.

Start & End clarity:
- Start only: older than and up to Start.
- End only: match End and newer.
- Both: between Start and End (inclusive of End).
- Max 100 messages per call; page by adjusting Start.

### Method(s)

```
`1pn.History().  
2    Channel(string).  
3    Reverse(bool).  
4    IncludeTimetoken(bool).  
5    IncludeMeta(bool).  
6    Start(int64).  
7    End(int64).  
8    Count(int).  
9    QueryParam(queryParam).  
10    Execute()  
`
```

Parameters:
- Channel
  - Type: string
  - Default: n/a
  - Channel to return history from.
- Reverse
  - Type: bool
  - Default: false
  - Traverse timeline from oldest if true.
- IncludeTimetoken
  - Type: bool
  - Default: false
  - Include event timetokens.
- IncludeMeta
  - Type: bool
  - Default: false
  - Include meta (sent during publish).
- Start
  - Type: int64
  - Timetoken marking exclusive start.
- End
  - Type: int64
  - Timetoken marking inclusive end.
- Count
  - Type: int
  - Default: 100
  - Number of messages to return.
- QueryParam
  - Type: map[string]string
  - Default: nil
  - Additional query string parameters.

Tip: Messages are returned sorted in ascending time regardless of Reverse. Reverse affects which end of the interval to begin when more than Count messages exist.

### Sample code

Retrieve the last 100 messages on a channel:

```
1
  

```

### Returns

History() returns HistoryResponse with:
- Messages: []HistoryResponseItem — array of messages.
- StartTimetoken: int64 — start timetoken of returned messages.
- EndTimetoken: int64 — end timetoken of returned messages.

HistoryResponseItem:
- Timetoken: int64 — message timetoken.
- Message: interface — message content.
- Meta: interface — metadata (if sent during publish).
- Error: error — decryption error if message couldn’t be decrypted.

### Status response

- Error: error
- Category: StatusCategory
- Operation: OperationType
- StatusCode: int
- TLSEnabled: bool
- UUID: string
- AuthKey: string
- Origin: string
- OriginalResponse: string
- Request: string
- AffectedChannels: []string
- AffectedChannelGroups: []string

### Other examples

Use history() to retrieve the three oldest messages:

```
1
  

```

Use history() to retrieve messages newer than a given timetoken:

```
1
  

```

Use history() to retrieve messages until a given timetoken:

```
1
  

```

History paging example:

```
1
  

```

Include timetoken in history response:

```
1
**
```

Last updated on Oct 29, 2025**