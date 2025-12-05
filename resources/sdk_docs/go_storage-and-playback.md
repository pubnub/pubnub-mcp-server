# Message Persistence API for Go SDK

Message Persistence provides real-time access to stored messages with 10-ns precision timetokens, replicated across regions. Messages can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence: enable for your key in the Admin Portal.

Fetch historical messages from one or multiple channels. Control ordering/selection with timetokens:
- start only: messages older than start timetoken (exclusive).
- end only: messages from end timetoken and newer (inclusive).
- start and end: messages between start and end (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- With IncludeMessageActions=true: one channel only, up to 25 messages.
Use iterative calls and adjust start to page results.

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
- Channels (Type: string, Default: n/a): Channel(s) to fetch history for; max 500 channels.
- Count (Type: int, Default: 100 or 25): Messages to return. Max 100 for single channel, 25 for multiple channels, and 25 when IncludeMessageActions is true.
- Start (Type: int64, Default: n/a): Start timetoken (exclusive).
- End (Type: int64, Default: n/a): End timetoken (inclusive).
- IncludeMeta (Type: bool, Default: false): Include message meta.
- IncludeMessageType (Type: bool, Default: true): Include message type per message.
- IncludeUUID (Type: bool, Default: true): Include publisher UUID.
- IncludeMessageActions (Type: bool, Default: false): Include message actions; limits to one channel and 25 messages.
- IncludeCustomMessageType (Type: bool, Default: n/a): Retrieve messages with custom message type.
- QueryParam (Type: map[string]string, Default: nil): Additional query string parameters.

Truncated response:
- When fetching with message actions, results may be truncated. A more object is returned with parameters to continue; make iterative calls accordingly.

### Sample code

Retrieve the last messages on a channel:
```
1
  

```

### Returns

Fetch() returns FetchResponse with:
- Messages (Type: map[string][]FetchResponseItem): Map of channel to array of message items.

FetchResponseItem:
- Message (Type: interface): Message content.
- Timetoken (Type: string): Message timetoken.
- Meta (Type: interface): Metadata.
- MessageType (Type: int): Message type; 4 for file messages.
- UUID (Type: string): Publisher UUID.
- MessageActions (Type: map[string]PNHistoryMessageActionsTypeMap): Message actions; see below.
- File (Type: PNFileDetails): File details if present.
- Error (Type: error): Decryption error if any.

#### PNHistoryMessageActionsTypeMap
- ActionsTypeValues (Type: map[string][]PNHistoryMessageActionTypeVal)

#### PNHistoryMessageActionTypeVal
- UUID (Type: string): Publisher UUID.
- ActionTimetoken (Type: string): Action publish timetoken.

### Status response

- Error (error)
- Category (StatusCategory)
- Operation (OperationType)
- StatusCode (int)
- TLSEnabled (bool)
- UUID (string)
- AuthKey (string)
- Origin (string)
- OriginalResponse (string)
- Request (string)
- AffectedChannels ([]string)
- AffectedChannelGroups ([]string)

### Other examples

#### Fetch with metadata
```
1
  

```

#### Fetch with time range
```
1
  

```

#### Fetch from multiple channels
```
1
  

```

## Delete messages from history

Requires Message Persistence: enable for your key in the Admin Portal.

Remove messages from a specific channel’s history.

Required setting:
- Enable Delete-From-History in Admin Portal and initialize SDK with a secret key.

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
- Channel (Type: string): Channel to delete messages from.
- Start (Type: int64): Start timetoken (inclusive).
- End (Type: int64): End timetoken (exclusive).
- QueryParam (Type: map[string]string): Additional query string parameters.

### Sample code
```
1
  

```

### Returns

DeleteMessages() returns an empty HistoryDeleteResponse. Verify success via status response.

### Status response

- Error (error)
- Category (StatusCategory)
- Operation (OperationType)
- StatusCode (int)
- TLSEnabled (bool)
- UUID (string)
- AuthKey (string)
- Origin (string)
- OriginalResponse (string)
- Request (string)
- AffectedChannels ([]string)
- AffectedChannelGroups ([]string)

### Other examples

#### Delete specific message from history

Pass the publish timetoken in End and timetoken-1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.
```
1
  

```

## Message counts

Requires Message Persistence: enable for your key in the Admin Portal.

Return the number of messages on channels since a given timetoken. Count includes messages with timetoken >= ChannelsTimetoken.

Unlimited retention note:
- For keys with unlimited retention, counts include only messages from the last 30 days.

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
- Channels (Type: []string, Default: n/a): Channels to count.
- ChannelsTimetoken (Type: []int64, Default: nil): One timetoken for all channels, or one per channel (same length as Channels). Otherwise returns PNStatus with error.
- QueryParam (Type: map[string]string, Default: nil): Additional query string parameters.

### Sample code
```
1
  

```

### Returns

MessageCounts() returns MessageCountsResponse:
- Channels (Type: map[string]int): Channel name to message count. 0 for no messages. 10000 for 10,000+ messages.

### Status response

- Error (error)
- Category (StatusCategory)
- Operation (OperationType)
- StatusCode (int)
- TLSEnabled (bool)
- UUID (string)
- AuthKey (string)
- Origin (string)
- OriginalResponse (string)
- Request (string)
- AffectedChannels ([]string)
- AffectedChannelGroups ([]string)

### Other examples

#### Retrieve count of messages using different timetokens for each channel
```
1
  

```

## History (deprecated)

Requires Message Persistence: enable for your key in the Admin Portal.

Alternative method: Deprecated. Use fetch history instead.

Fetch historical messages of a channel with controls over order and pagination:
- Reverse=false (default): search from newest end.
- Reverse=true: search from oldest end.
- Page with Start or End.
- Slice with both Start and End.
- Limit with Count.

Start & End clarity:
- Start only: messages older than and up to Start (exclusive).
- End only: messages matching End and newer (inclusive).
- Both: between Start and End (inclusive on End). Max 100 messages per call (or Count). Page by adjusting Start.

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
- Channel (Type: string, Default: n/a): Channel to fetch history from.
- Reverse (Type: bool, Default: false): Traverse timeline in reverse (oldest first).
- IncludeTimetoken (Type: bool, Default: false): Include event timetokens.
- IncludeMeta (Type: bool, Default: false): Include meta.
- Start (Type: int64, Default: n/a): Start timetoken (exclusive).
- End (Type: int64, Default: n/a): End timetoken (inclusive).
- Count (Type: int, Default: 100): Number of messages.
- QueryParam (Type: map[string]string, Default: nil): Additional query string parameters.

Tip (Reverse):
- Results are always sorted ascending by time. Reverse matters when more than Count messages exist in the interval; it selects which end to start retrieving from.

### Sample code

Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns

History() returns HistoryResponse:
- Messages (Type: []HistoryResponseItem): Array of messages.
- StartTimetoken (Type: int64)
- EndTimetoken (Type: int64)

HistoryResponseItem:
- Timetoken (Type: int64)
- Message (Type: interface)
- Meta (Type: interface)
- Error (Type: error)

### Status response

- Error (error)
- Category (StatusCategory)
- Operation (OperationType)
- StatusCode (int)
- TLSEnabled (bool)
- UUID (string)
- AuthKey (string)
- Origin (string)
- OriginalResponse (string)
- Request (string)
- AffectedChannels ([]string)
- AffectedChannelGroups ([]string)

### Other examples

#### Use history() to retrieve the three oldest messages
```
1
  

```

#### Use history() to retrieve messages newer than a given timetoken
```
1
  

```

#### Use history() to retrieve messages until a given timetoken
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

Last updated on Oct 29, 2025**