# Message Persistence API for Unity SDK

Message Persistence provides real-time access to stored messages, with per-message timetokens (10ns precision), multi-AZ/region storage, and optional AES-256 encryption. Configure retention: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

## Fetch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering:
- Only start: returns messages older than start.
- Only end: returns messages from end and newer.
- Both start and end: returns messages in range [end inclusive; start exclusive].

Limits: up to 100 messages on a single channel, or 25 per channel on up to 500 channels. For paging, iteratively update start.

### Method(s)

Use the following method(s) in the Unity SDK:

```
`1pubnub.FetchHistory()  
2    .Channels(string[])  
3    .IncludeMeta(bool)  
4    .IncludeMessageType(bool)  
5    .IncludeCustomMessageType(bool)  
6    .IncludeUUID(bool)  
7    .IncludeMessageActions(bool)  
8    .Reverse(bool)  
9    .Start(int)  
10    .End(int)  
11    .MaximumPerChannel(int)  
12    .QueryParam(Dictionarystring, object>)  
`
```

- Channels (required): Type: string[]. Channels to fetch (max 500).
- IncludeMeta: Type: bool. Include message meta.
- IncludeMessageType: Type: bool. Include message type. Default true.
- IncludeCustomMessageType: Type: bool. Include custom message type. See Retrieving Messages.
- IncludeUUID: Type: bool. Include publisher uuid. Default true.
- IncludeMessageActions: Type: bool. Include message actions. If true, limited to one channel and 25 messages. Default false.
- Reverse: Type: bool. true traverses oldest-to-newest.
- Start: Type: long. Exclusive start timetoken.
- End: Type: long. Inclusive end timetoken.
- MaximumPerChannel: Type: int. Default/max 100 (single channel), 25 (multiple channels), 25 if IncludeMessageActions true.
- QueryParam: Type: Dictionary<string, object>. Extra query parameters.
- Execute: Type: System.Action of PNFetchHistoryResult.
- ExecuteAsync: Returns Task<PNResult<PNFetchHistoryResult>>.

##### Truncated response
If truncated, a more property is returned with additional parameters. Make iterative calls adjusting parameters.

### Sample code

##### Reference code
Retrieve the last message on a channel:

```
1
  

```

### Returns

FetchHistory() returns PNFetchHistoryResult:

- Messages: Dictionary<string, List<PNHistoryItemResult>>. List of messages.
- More: MoreInfo. Pagination info.

Messages entries contain:
- Channel Name: string
- timetoken: long
- Entry: object
- Meta: object
- Uuid: string
- MessageType: string
- CustomMessageType: string
- Actions: object

More contains:
- Start: long
- End: long
- Limit: int

```
`1{  
2    "Messages":  
3        {  
4            "my_channel":  
5            [{  
6                "Timetoken":15717278253295153,  
7                "Entry":"sample message",  
8                "Meta":"",  
9                "Uuid":"user-1",  
10                "MessageType":null,  
11                "Actions":null  
12            }]  
13        },  
14    "More":null  
15}  
`
```

### Other examples

#### Retrieve the last 25 messages on a channel synchronously

```
1
  

```

## Delete messages from history

Requires Message Persistence. Also enable Delete-From-History in key settings and initialize with a secret key.

Removes messages from the history of a specific channel.

### Method(s)

To Delete Messages from History use:

```
`1pubnub.DeleteMessages()  
2    .Channel(string)  
3    .Start(long)  
4    .End(long)  
5    .QueryParam(Dictionarystring,object>)  
`
```

- Channel (required): Type: string. Channel to delete from.
- Start: Type: long. Inclusive start timetoken.
- End: Type: long. Exclusive end timetoken.
- QueryParam: Type: Dictionary<string, object>. Extra query parameters.
- Async: Type: PNCallback of PNDeleteMessageResult.
- Execute: Type: System.Action of PNDeleteMessageResult.
- ExecuteAsync: Returns Task<PNResult<PNDeleteMessageResult>>.

### Sample code

```
1
  

```

### Returns

DeleteMessages() returns PNResult<PNDeleteMessageResult> with an empty PNDeleteMessageResult.

### Other examples

#### Delete messages sent in a particular timeframe

```
1
  

```

#### Delete specific message from history

To delete a specific message, pass the publish timetoken (from a successful publish) in End and timetoken +/- 1 in Start. Example: publish timetoken 15526611838554310 => Start 15526611838554309, End 15526611838554310.

```
1
  

```

## Message counts

Requires Message Persistence.

Returns the number of messages published since the given timetoken (count of messages with timetoken ≥ value).

Unlimited retention: for keys with unlimited retention, counts consider only messages from the last 30 days.

### Method(s)

Use:

```
`1pubnub.MessageCounts()  
2    .Channels(string[])  
3    .ChannelsTimetoken(long[])  
4    .QueryParam(Dictionarystring, object>)  
`
```

- Channels (required): Type: string[]. Channels to fetch counts for.
- ChannelsTimetoken (required): Type: long[]. Array of timetokens matching channels order. Provide a single timetoken to apply to all channels; otherwise array length must equal channels length or an error PNStatus is returned.
- QueryParam: Type: Dictionary<string, object>. Extra query parameters.
- Async: Type: PNCallback of PNMessageCountResult.
- Execute: Type: System.Action of PNMessageCountResult.
- ExecuteAsync: Returns Task<PNResult<PNMessageCountResult>>.

### Sample code

```
1
  

```

### Returns

Returns PNResult<PNMessageCountResult>:
- Result: PNMessageCountResult
- Status: PNStatus

PNMessageCountResult:
- Channels: Dictionary<string, long>. Messages count per channel. Channels with no messages: 0. Channels with 10,000+ messages: 10000.

### Other examples

#### Retrieve count of messages for a single channel

```
1
  

```

#### Retrieve count of messages using different timetokens for each channel

```
1
**
```

Last updated on Sep 3, 2025**