# Message Persistence API for Go SDK

Message Persistence gives real-time access to published message history. Each message is timestamped to the nearest 10 ns and stored redundantly across regions. Stored messages can be encrypted with AES-256. See Message Persistence.

Retention policy options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

Retrievable items:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages from one or multiple channels. Use includeMessageActions to fetch message actions alongside messages.

Time window behavior:
- Only start: returns messages older than start timetoken.
- Only end: returns messages from end timetoken and newer.
- Both start and end: returns messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- When IncludeMessageActions=true: limited to 1 channel and 25 messages.
Page by iteratively adjusting the start timetoken.

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
- Channels (string, required): Channels to return history for. Max 500.
- Count (int, default: 100 single channel, 25 multi-channel, 25 when IncludeMessageActions=true): Number of messages to return.
- Start (int64): Start timetoken (exclusive).
- End (int64): End timetoken (inclusive).
- IncludeMeta (bool, default false): Include message meta.
- IncludeMessageType (bool, default true): Include message type.
- IncludeUUID (bool, default true): Include publisher UUID.
- IncludeMessageActions (bool, default false): Include message actions; enforces single channel and 25 messages.
- IncludeCustomMessageType (bool): Retrieve messages with the custom message type. See Retrieving Messages.
- QueryParam (map[string]string, default nil): Extra query string parameters.

Truncated response:
- When fetching with message actions, results may be truncated due to internal limits. A more property is returned with additional parameters; make iterative calls adjusting parameters to fetch more.

### Sample code

Reference code

Retrieve the last messages on a channel:
```
1
  

```

### Returns

Fetch() returns FetchResponse:

- Messages (map[string][]FetchResponseItem): Map from channel name to message items.

FetchResponseItem:
- Message (interface)
- Timetoken (string)
- Meta (interface)
- MessageType (int) — 4 for file messages
- UUID (string)
- MessageActions (map[string]PNHistoryMessageActionsTypeMap)
- File (PNFileDetails)
- Error (error) — decryption error if any

PNHistoryMessageActionsTypeMap:
- ActionsTypeValues (map[string][]PNHistoryMessageActionTypeVal)

PNHistoryMessageActionTypeVal:
- UUID (string)
- ActionTimetoken (string)

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

Fetch with metadata
```
1
  

```

Fetch with time range
```
1
  

```

Fetch from multiple channels
```
1
  

```

## Delete messages from history

Requires Message Persistence (enable in Admin Portal).

Removes messages from a specific channel’s history.

Required setting:
- Enable Delete-From-History for your key in Admin Portal.
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
- Channel (string, required): Channel to delete messages from.
- Start (int64): Start timetoken (inclusive).
- End (int64): End timetoken (exclusive).
- QueryParam (map[string]string): Extra query string parameters.

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

Delete specific message from history

To delete one message, pass its publish timetoken in End and timetoken-1 in Start (e.g., Start=15526611838554309, End=15526611838554310).

```
1
  

```

## Message counts

Requires Message Persistence (enable in Admin Portal).

Returns the number of messages published on channels since a given time. Count is the number of history messages with a timetoken >= value(s) provided in ChannelsTimetoken.

Unlimited retention note:
- For keys with unlimited retention, only messages from the last 30 days are counted.

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
- Channels ([]string, required): Channels to fetch message counts for.
- ChannelsTimetoken ([]int64, default nil): Array of timetokens aligned with channels. Provide a single timetoken to apply to all channels, or one per channel. Mismatched lengths return PNStatus with error.
- QueryParam (map[string]string, default nil): Extra query string parameters.

### Sample code

```
1
  

```

### Returns

MessageCounts() returns MessageCountsResponse:
- Channels (map[string]int): Channel names with message counts. 0 if none. 10000 if >= 10,000.

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

Retrieve count of messages using different timetokens for each channel
```
1
  

```

## History (deprecated)

Requires Message Persistence (enable in Admin Portal).

Alternative method:
- Deprecated. Use fetch history instead.

Fetches historical messages of a channel. You can:
- Use Reverse=false (default, newest end) or Reverse=true (oldest end).
- Page with Start OR End timetokens.
- Retrieve a slice with both Start AND End.
- Limit with Count.

Start & End usage:
- Only Start: messages older than and up to Start.
- Only End: messages matching End and newer.
- Both: messages between Start and End (inclusive of End).
Max 100 messages per call; page by adjusting Start if more are available.

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
- Channel (string, required): Channel to return history from.
- Reverse (bool, default false): Traverse from oldest first.
- IncludeTimetoken (bool, default false): Include event timetokens in response.
- IncludeMeta (bool, default false): Include meta.
- Start (int64): Start timetoken (exclusive).
- End (int64): End timetoken (inclusive).
- Count (int, default 100): Number of messages to return.
- QueryParam (map[string]string, default nil): Extra query string parameters.

Tip: Messages are returned sorted ascending by time regardless of Reverse. Reverse only affects which end is used when more than Count messages are in the interval.

### Sample code

Retrieve the last 100 messages on a channel:
```
1
  

```

### Returns

History() returns HistoryResponse:
- Messages ([]HistoryResponseItem)
- StartTimetoken (int64)
- EndTimetoken (int64)

HistoryResponseItem:
- Timetoken (int64)
- Message (interface)
- Meta (interface)
- Error (error) — decryption error if any

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

Use history() to retrieve the three oldest messages
```
1
  

```

Use history() to retrieve messages newer than a given timetoken
```
1
  

```

Use history() to retrieve messages until a given timetoken
```
1
  

```

History paging example
```
1
  

```

Include timetoken in history response
```
1
**
```
Last updated on Oct 29, 2025**