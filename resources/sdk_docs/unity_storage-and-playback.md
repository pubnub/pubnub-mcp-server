# Message Persistence API for Unity SDK

Message Persistence provides real-time access to stored, timestamped messages (10 ns precision) across multiple availability zones and regions. Messages can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires: Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Ordering and range:
- start only: messages older than start (exclusive)
- end only: messages from end and newer (inclusive of end)
- start and end: messages between them (inclusive of end)

Limits:
- Up to 100 messages for a single channel
- Up to 25 per channel for up to 500 channels
- If IncludeMessageActions = true: one channel only, max 25 messages

Pagination: use the returned more parameters and iteratively update start.

### Method(s)

```
pubnub.FetchHistory()
    .Channels(string[])
    .IncludeMeta(bool)
    .IncludeMessageType(bool)
    .IncludeCustomMessageType(bool)
    .IncludeUUID(bool)
    .IncludeMessageActions(bool)
    .Reverse(bool)
    .Start(long)
    .End(long)
    .MaximumPerChannel(int)
    .QueryParam(Dictionary<string, object>)
```

Parameters
- Channels (required) Type: string[] — Channels to fetch history from (max 500).
- IncludeMeta Type: bool — Include meta payload if it was published.
- IncludeMessageType Type: bool — Include message type. Default true.
- IncludeCustomMessageType Type: bool — Retrieve messages with a custom message type.
- IncludeUUID Type: bool — Include publisher UUID. Default true.
- IncludeMessageActions Type: bool — Include message actions. If true, restricted to one channel and 25 messages. Default false.
- Reverse Type: bool — If true, return oldest first.
- Start Type: long — Start timetoken (exclusive).
- End Type: long — End timetoken (inclusive).
- MaximumPerChannel Type: int — Number of messages to return. Default/max: 100 for single channel, 25 for multiple channels, 25 if IncludeMessageActions is true.
- QueryParam Type: Dictionary<string, object> — Extra query parameters.

Execution
- Execute Type: System.Action — Action<PNFetchHistoryResult>.
- ExecuteAsync Type: Task<PNResult<PNFetchHistoryResult>>.

Truncated response: A more property is returned with additional pagination parameters. Make iterative calls adjusting parameters.

### Sample code

Retrieve the last message on a channel:
```
1
  

```

### Returns

FetchHistory returns PNFetchHistoryResult:
- Messages: Dictionary<string, List<PNHistoryItemResult>> — Messages per channel.
- More: MoreInfo — Pagination info or null.

PNHistoryItemResult fields:
- Timetoken: long — Message timetoken.
- Entry: object — Message payload.
- Meta: object — Message metadata.
- Uuid: string — Publisher UUID.
- MessageType: string — Message type.
- CustomMessageType: string — Custom message type.
- Actions: object — Message actions.

More fields:
- Start: long — Start timetoken of requested range.
- End: long — End timetoken of requested range.
- Limit: int — Number of messages returned.

Example:
```
{
  "Messages": {
    "my_channel": [
      {
        "Timetoken": 15717278253295153,
        "Entry": "sample message",
        "Meta": "",
        "Uuid": "user-1",
        "MessageType": null,
        "Actions": null
      }
    ]
  },
  "More": null
}
```

### Other examples

Retrieve the last 25 messages on a channel synchronously
```
1
  

```

## Delete messages from history

Requires: 
- Message Persistence enabled for your key in the Admin Portal.
- Delete-From-History enabled in key settings.
- Initialize with a secret key.

Removes messages from a channel’s history within a timetoken range.

Range semantics:
- Start: inclusive
- End: exclusive

### Method(s)

```
pubnub.DeleteMessages()
    .Channel(string)
    .Start(long)
    .End(long)
    .QueryParam(Dictionary<string, object>)
```

Parameters
- Channel (required) Type: string — Channel to delete from.
- Start Type: long — Inclusive start timetoken.
- End Type: long — Exclusive end timetoken.
- QueryParam Type: Dictionary<string, object> — Extra query parameters.

Execution
- Async Type: PNCallback — PNCallback<PNDeleteMessageResult>.
- Execute Type: System.Action — Action<PNDeleteMessageResult>.
- ExecuteAsync Type: Task<PNResult<PNDeleteMessageResult>>.

### Sample code

```
1
  

```

### Returns

DeleteMessages returns PNResult<PNDeleteMessageResult> with an empty PNDeleteMessageResult.

### Other examples

Delete messages sent in a particular timeframe
```
1
  

```

Delete specific message from history

To delete a specific message, pass the publish timetoken (from a successful publish) in End, and timetoken - 1 in Start. For example, for publish timetoken 15526611838554310, use Start = 15526611838554309 and End = 15526611838554310:
```
1
  

```

## Message counts

Requires: Message Persistence enabled for your key in the Admin Portal.

Returns the count of messages published since the given timetoken (count includes messages with timetoken ≥ provided).

Note for unlimited retention: Only messages from the last 30 days are considered.

### Method(s)

```
pubnub.MessageCounts()
    .Channels(string[])
    .ChannelsTimetoken(long[])
    .QueryParam(Dictionary<string, object>)
```

Parameters
- Channels (required) Type: string[] — Channels to count messages for.
- ChannelsTimetoken (required) Type: long[] — Timetokens aligned with channels. Provide a single timetoken to apply to all channels, or one per channel (must match length). Otherwise returns PNStatus with error.
- QueryParam Type: Dictionary<string, object> — Extra query parameters.

Execution
- Async Type: PNCallback — PNCallback<PNMessageCountResult>.
- Execute Type: System.Action — Action<PNMessageCountResult>.
- ExecuteAsync Type: Task<PNResult<PNMessageCountResult>>.

### Sample code

```
1
  

```

### Returns

Returns PNResult<PNMessageCountResult>:
- Result: PNMessageCountResult
- Status: PNStatus

PNMessageCountResult:
- Channels: Dictionary<string, long> — Message counts per channel. Channels with no messages have 0. Channels with 10,000+ messages return 10000.

### Other examples

Retrieve count of messages for a single channel
```
1
  

```

Retrieve count of messages using different timetokens for each channel
```
1
**
```