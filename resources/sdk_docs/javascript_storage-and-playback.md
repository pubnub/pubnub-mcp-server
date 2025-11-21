# Message Persistence API for JavaScript SDK

Message Persistence provides real-time access to stored published messages. Messages are timestamped to the nearest 10 ns, stored redundantly, and can be AES-256 encrypted. Retention options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited. You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

Supported async patterns: Callbacks, Promises, and Async/Await (recommended). Use try...catch to handle errors.

## Fetch history

Requires Message Persistence (enable in Admin Portal). Fetch historical messages from one or more channels; use includeMessageActions to include message actions.

Ordering:
- start only: messages older than start.
- end only: messages from end and newer.
- both: messages between start and end (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: only one channel allowed, limit 25. Pagination may be required; use start to iterate.

### Method(s)

Use the following method(s) in the JavaScript SDK:

```
`1pubnub.fetchMessages({  
2    channels: Arraystring>,  
3    count: number,  
4    includeMessageType: boolean,  
5    includeCustomMessageType: boolean,  
6    includeUUID: boolean,  
7    includeMeta: boolean,  
8    includeMessageActions: boolean,  
9    start: string,  
10    end: string  
11})  
`
```

- required
- Parameter
- Description
`channels`  Type: Array`<string>`  Default: n/a  Channels to fetch history messages from (up to 500).
`count` Type: number  Default: `100` or `25`  Number of historical messages to return per channel. Default is `100` (single) and `25` (multi) or `25` with `includeMessageActions`.
`includeMessageType` Type: boolean  Default: `true`  Whether to pass `true` to include message type. Default is `true`.
`includeCustomMessageType` Type: Boolean  Default: n/a  Whether to retrieve messages with the custom message type. For more information, refer to Retrieving Messages.
`includeUUID` Type: boolean  Default: `true`  Whether to receive the publisher `uuid`. Default is `true`.
`includeMeta` Type: boolean  Default: n/a  Whether to include the meta object (if provided at publish time) in the response.
`includeMessageActions` Type: boolean  Default: n/a  Whether to retrieve history messages with message actions. If used, limit is 25 per single channel and only one `channel` is allowed. The response may be truncated; a `more` link is provided.
`start` Type: string  Default: n/a  Timetoken delimiting the start (exclusive) of the time slice.
`end` Type: string  Default: n/a  Timetoken delimiting the end (inclusive) of the time slice.

##### Truncated response
When including message actions, responses may be truncated. A `more` property is returned with parameters for iterative calls.

### Sample code

Reference code (self-contained placeholder):

```
1
  
```

```
1
  
```

### Response

```
1//Example of status  
2{  
3    error: false,  
4    operation: 'PNFetchMessagesOperation',  
5    statusCode: 200  
6}  
7
  
8//Example of response  
9{  
10    "channels":{  
11        "my-channel":[  
12            {  
13                "message":"message_1",  
14                "timetoken":"15483367794816642",  
15                "uuid":"my-uuid",  
16                "message_type":null,  
17                // the value depends on the custom message type  
18                // that the message was sent with  
19                "custom_message_type":"text-message"  
20            }  
21        ]  
22    }  
23}  
```

### Other examples

#### Fetch messages with metadata and actions

```
1
  
```

#### Fetch messages with metadata and actions response

Return information on message actions using the `actions` object.

```
1// Example of status  
2{  
3    "error": false,  
4    "operation": "PNFetchMessagesOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of response  
9{  
10    "channels":{  
11        "my_channel":[  
12            {  
13                "channel : "my_channel",  
14                "timetoken":"15741125155552287",  
15                "message":{  
16                    "text":"Hello world!",  
17                },  
18                "messageType": 1,  
19                "customMessageType": "your custom type",  
20                "uuid": "someUserId",  
21                "meta":""  
22                "actions":{  
23                    "reaction":{  
24                        "smiley_face":[  
25                            {  
26                                "uuid":"my-uuid",  
27                                "actionTimetoken":"15741125155943280"  
28                            }  
29                        ]  
30                    }  
31                }  
32            }  
33        ]  
34    },  
35"more": {  
36    "url": "/v3/history-with-actions/sub-key/subscribeKey/channel/myChannel?start=15610547826970000&max=98",  
37    "start": "15610547826970000",  
38    "max": 98  
39}  
40}  
```

## Delete messages from history

Requires Message Persistence. Enable Delete-From-History in Admin Portal and initialize the SDK with a secret key.

Removes messages from a specific channel’s history.

### Method(s)

To Delete Messages from History, use:

```
`1pubnub.deleteMessages({  
2    channel: string,  
3    start: string,  
4    end: string  
5})  
`
```

Method behavior: `start` is exclusive; `end` is inclusive.

- required
- Parameter
- Description
`channel`  Type: string  Specifies `channel` messages to be deleted from history.
`start` Type: string  Timetoken delimiting the `start` of time slice (exclusive) to delete messages from.
`end` Type: string  Timetoken delimiting the `end` of time slice (inclusive) to delete messages from.

### Sample code

```
1
  
```

### Response

```
`1{  
2    error: false,  
3    operation: 'PNDeleteMessagesOperation',  
4    statusCode: 200  
5}  
`
```

### Other examples

#### Delete specific message from a Message Persistence

Pass the exact publish timetoken in `end` and timetoken +/- 1 in `start`.

```
1
  
```

## Message counts

Requires Message Persistence. Returns number of messages with timetoken >= channelTimetokens.
Note: With unlimited retention, only the last 30 days are counted.

### Method(s)

```
`1pubnub.messageCounts({  
2    channels: Arraystring>,  
3    channelTimetokens: Arraystring>  
4})  
`
```

- required
- Parameter
- Description
`channels`  Type: Array`<string>`  Default: n/a  Channels to fetch the message count.
`channelTimetokens`  Type: Array`<string>`  Default: n/a  Array in the same order as channels; a single timetoken applies to all channels; otherwise, lengths must match or the function returns a `PNStatus` error.

### Sample code

```
1
  
```

### Returns

Message count: Channels without messages have a count of 0. Channels with 10,000+ messages return 10000.

```
`1{  
2    channels: {  
3        ch1: 49  
4    }  
5}  
`
```

### Status response

```
`1{  
2    error: false,  
3    operation: 'PNMessageCountsOperation',  
4    statusCode: 200  
5}  
`
```

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
1
  
```

## History (deprecated)

Requires Message Persistence.

Alternative method: This method is deprecated. Use fetch history instead.

Fetches historical messages of a channel with ordering and pagination controls:
- Default search from newest end (`reverse = false`).
- `reverse = true` to search from oldest end.
- Page with `start` OR `end`.
- Retrieve a slice with both `start` AND `end`.
- Limit with `count`.

Start & End clarity:
- start only: messages older than start.
- end only: messages matching end and newer.
- both: between start and end (inclusive of end).
Maximum 100 messages per call; use iterative calls adjusting start.

### Method(s)

Use the following method(s) in the JavaScript SDK

```
`1pubnub.history({  
2    channel: string,  
3    reverse: boolean,  
4    count: number,  
5    stringifiedTimeToken: boolean,  
6    includeMeta: boolean,  
7    start: string,  
8    end: string  
9})  
`
```

- required
- Parameter
- Description
`channel`  Type: string  Default: n/a  Channel to return history messages from.
`reverse` Type: boolean  Default: `false`  Whether to traverse from oldest to newest. If both `start` and `end` are provided, `reverse` is ignored and messages return starting with the newest message.
`count` Type: number  Default: `100`  Number of historical messages to return. Default/Maximum is `100`.
`stringifiedTimeToken` Type: boolean  Default: `false`  Whether to return timetokens as strings.
`includeMeta` Type: boolean  Default: n/a  Whether to include the meta object (if provided at publish time) in the response.
`start` Type: string  Default: n/a  Timetoken delimiting the start (exclusive) of the time slice.
`end` Type: string  Default: n/a  Timetoken delimiting the end (inclusive) of the time slice.

Using the reverse parameter:
Messages are always returned sorted ascending by time. `reverse` only affects which end of the interval is used to start when more than `count` messages exist.

### Sample code

Retrieve the last 100 messages on a channel:

```
`1try {  
2    const result = await pubnub.history({  
3        channel: "history_channel",  
4        count: 100, // how many items to fetch  
5        stringifiedTimeToken: true, // false is the default  
6    });  
7} catch (status) {  
8    console.log(status);  
9}  
`
```

### Response

```
1// Example of Status  
2{  
3    error: false,  
4    operation: "PNHistoryOperation",  
5    statusCode: 200  
6}  
7
  
8// Example of Response  
9{  
10    endTimeToken: "14867650866860159",  
11    messages: [  
12        {  
13            timetoken: "14867650866860159",  
14            entry: "[User 636] hello World"  
15        },  
16        {...},  
17        {...},  
18        {...}  
19    ],  
20    startTimeToken: "14867650866860159"  
21}  
```

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
`1try {  
2    const result = await pubnub.history({  
3        channel: "my_channel",  
4        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
5        count: 3, // how many items to fetch  
6        stringifiedTimeToken: true, // false is the default  
7    });  
8} catch (status) {  
9    console.log(status);  
10}  
`
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

```
`1try {  
2    const result = await pubnub.history({  
3        channel: "my_channel",  
4        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
5        stringifiedTimeToken: true, // false is the default  
6        start: "13406746780720711", // start timetoken to fetch  
7    });  
8} catch (status) {  
9    console.log(status);  
10}  
`
```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

```
`1try {  
2    const result = await pubnub.history({  
3        channel: "my_channel",  
4        stringifiedTimeToken: true, // false is the default  
5        end: "13406746780720711", // start timetoken to fetch  
6    });  
7} catch (status) {  
8    console.log(status);  
9}  
`
```

#### History paging example

Usage: Call with nothing or a valid timetoken.

```
1async function getAllMessages(initialTimetoken = 0) {  
2    const allMessages = [];  
3    let latestCount = 100;  
4    let timetoken = initialTimetoken;  
5
  
6    while (latestCount === 100) {  
7        const { messages, startTimeToken, endTimeToken } = await pubnub.history(  
8            {  
9                channel: "history_test",  
10                stringifiedTimeToken: true, // false is the default  
11                start: timetoken, // start timetoken to fetch  
12            }  
13        );  
14
  
15        latestCount = messages.length;  
16        timetoken = startTimeToken;  
17
  
18        if (messages && messages.length > 0) {  
19            allMessages.push(...messages);  
20        }  
21    }  
22
  
23    return allMessages;  
24}  
25
  
26// Usage examples:  
27// await getAllMessages();  
28// await getAllMessages("12345678901234");  
```

#### Fetch messages with metadata

```
`1try {  
2    const result = await pubnub.history({  
3        channel: "my_channel",  
4        stringifiedTimeToken: true,  
5        includeMeta: true,  
6    });  
7} catch (status) {  
8    console.log(status);  
9}  
`
```

#### Sample code with promises

```
`1pubnub.history({**2    channel: 'history_channel',  
3    reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
4    count: 100, // how many items to fetch  
5    stringifiedTimeToken: true, // false is the default  
6    start: '123123123123', // start timetoken to fetch  
7    end: '123123123133', // end timetoken to fetch  
8}).then((response) => {  
9    console.log(response);  
10}).catch((error) => {  
11    console.log(error);  
12});  
`
```

Last updated on Sep 3, 2025**