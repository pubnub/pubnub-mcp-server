# Message Persistence API for Go SDK

Message Persistence provides real-time access to stored, timestamped messages across multiple availability zones. Stored messages can be encrypted with AES-256. See Message Persistence docs for details.

Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

Retrievable data:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history[​](#fetch-history)

Requires Message Persistence. Enable in the Admin Portal.

Fetch historical messages from one or multiple channels. Use `includeMessageActions` to include message actions.

Ordering and time window:
- Only `start`: returns messages older than `start` timetoken (start exclusive).
- Only `end`: returns messages from `end` timetoken and newer (end inclusive).
- Both `start` and `end`: messages between them (inclusive of `end`).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- When `IncludeMessageActions` is true: 25 messages max, one channel only.
- Page by iteratively calling with adjusted `start`.

### Method(s)[​](#methods)

To run Fetch History:

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
- Channels (string, required): Channels to fetch history from. Max 500 channels.
- Count (int, default 100 or 25): Max 100 for single channel; 25 for multiple channels; 25 when `IncludeMessageActions` is true.
- Start (int64): Start timetoken (exclusive).
- End (int64): End timetoken (inclusive).
- IncludeMeta (bool, default false): Include message meta.
- IncludeMessageType (bool, default true): Include message type.
- IncludeUUID (bool, default true): Include publisher UUID.
- IncludeMessageActions (bool, default false): Include message actions. Restricts to one channel and 25 messages.
- IncludeCustomMessageType (bool): Include custom message type filtering.
- QueryParam (map[string]string, default nil): Additional query string parameters.

Truncated response:
- When including message actions, response may be truncated. A `more` property includes parameters to page for additional results.

### Sample code[​](#sample-code)

Reference code: Retrieve the last messages on a channel.

```
1
  

```

### Returns[​](#returns)

Fetch() returns FetchResponse:
- Messages (map[string][]FetchResponseItem): Map of channel to list of messages.

FetchResponseItem:
- Message (interface): Message payload.
- Timetoken (string): Message timetoken.
- Meta (interface): Metadata (if provided on publish).
- MessageType (int): Type; 4 for file messages.
- UUID (string): Publisher UUID.
- MessageActions (map[string]PNHistoryMessageActionsTypeMap): Message actions.
- File (PNFileDetails): File info if applicable.
- Error (error): Decryption error if decryption failed.

PNHistoryMessageActionsTypeMap:
- ActionsTypeValues (map[string][]PNHistoryMessageActionTypeVal)

PNHistoryMessageActionTypeVal:
- UUID (string): Publisher UUID.
- ActionTimetoken (string): Action publish timetoken.

### Status response[​](#status-response)

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

### Other examples[​](#other-examples)

#### Fetch with metadata[​](#fetch-with-metadata)

```
1
  

```

#### Fetch with time range[​](#fetch-with-time-range)

```
1
  

```

#### Fetch from multiple channels[​](#fetch-from-multiple-channels)

```
1
  

```

## Delete messages from history[​](#delete-messages-from-history)

Requires Message Persistence. Enable in the Admin Portal.

Remove messages from a specific channel’s history.

Required setting:
- Enable Delete-From-History in the Admin Portal.
- Initialize the SDK with a secret key.

### Method(s)[​](#methods-1)

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
- QueryParam (map[string]string): Additional query parameters.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

DeleteMessages() returns an empty HistoryDeleteResponse. Check status response for success.

### Status response[​](#status-response-1)

See Status response fields above.

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a single message, pass its publish timetoken in End and timetoken-1 in Start.
Example: Start=15526611838554309, End=15526611838554310.

```
1
  

```

## Message counts[​](#message-counts)

Requires Message Persistence. Enable in the Admin Portal.

Return the number of messages on one or more channels since the given timetoken.
- Count includes messages with timetoken >= corresponding ChannelsTimetoken.
- For Unlimited retention keys, counts only consider messages from the last 30 days.

### Method(s)[​](#methods-2)

```
`1pn.MessageCounts().  
2    Channels(channels).  
3    ChannelsTimetoken(channelsTimetoken).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels ([]string, required): Channels to count messages for.
- ChannelsTimetoken ([]int64, default nil): Single timetoken to apply to all channels, or per-channel list equal in length to Channels. Otherwise returns PNStatus with error.
- QueryParam (map[string]string, default nil): Additional query parameters.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

MessageCounts() returns MessageCountsResponse:
- Channels (map[string]int): Channel-to-count map. Channels with no messages: 0. Channels with >= 10,000 messages: 10000.

### Status response[​](#status-response-2)

See Status response fields above.

### Other examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
1
  

```

## History (deprecated)[​](#history-deprecated)

Requires Message Persistence. Deprecated, use Fetch History instead.

Fetch historical messages of a channel. Controls:
- Default: newest end of the timeline (Reverse=false).
- Set Reverse=true to search from oldest end.
- Page with Start OR End timetoken.
- Retrieve a slice with both Start AND End.
- Limit with Count.

Start & End behavior:
- Only Start: older than and up to Start timetoken (start exclusive).
- Only End: End timetoken and newer (end inclusive).
- Both: between Start and End (inclusive on End).
- Max 100 messages per call; page by adjusting Start.

### Method(s)[​](#methods-3)

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
- Channel (string, required): Channel to fetch history from.
- Reverse (bool, default false): If true, traverse from oldest first for paging windows.
- IncludeTimetoken (bool, default false): Include event timetokens.
- IncludeMeta (bool, default false): Include message meta.
- Start (int64): Start timetoken (exclusive).
- End (int64): End timetoken (inclusive).
- Count (int, default 100): Number of messages to return.
- QueryParam (map[string]string, default nil): Additional query parameters.

Tip: Messages are returned in ascending time order regardless of Reverse. Reverse affects where retrieval starts when more than Count messages exist in the interval.

### Sample code[​](#sample-code-3)

Retrieve the last 100 messages on a channel:

```
1
  

```

### Returns[​](#returns-3)

History() returns HistoryResponse:
- Messages ([]HistoryResponseItem)
- StartTimetoken (int64)
- EndTimetoken (int64)

HistoryResponseItem:
- Timetoken (int64)
- Message (interface)
- Meta (interface)
- Error (error)

### Status response[​](#status-response-3)

See Status response fields above.

### Other examples[​](#other-examples-3)

#### Use history() to retrieve the three oldest messages[​](#use-history-to-retrieve-the-three-oldest-messages)

```
1
  

```

#### Use history() to retrieve messages newer than a given timetoken[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken)

```
1
  

```

#### Use history() to retrieve messages until a given timetoken[​](#use-history-to-retrieve-messages-until-a-given-timetoken)

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

Last updated on Oct 29, 2025**