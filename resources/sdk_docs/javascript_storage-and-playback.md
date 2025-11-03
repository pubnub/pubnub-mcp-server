# Message Persistence API for JavaScript SDK

Message Persistence provides real-time access to stored messages, reactions, and files. Messages are timestamped (10 ns precision), replicated across zones/regions, and can be AES-256 encrypted. Configure retention per key: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

- Supported data types: Messages, Message reactions, Files (via File Sharing API).
- Async patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch to handle errors.

## Fetch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages for one or more channels. Use includeMessageActions to include message actions.

Time range behavior:
- start only: returns messages older than start (exclusive).
- end only: returns messages from end (inclusive) and newer.
- start and end: returns messages between start (exclusive) and end (inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: only one channel, limit 25. Use pagination via start to iterate.

### Method(s)

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

Parameters:
- channels (Array<string>, required): Channels to fetch from (up to 500).
- count (number): Per-channel message count. Default 100 (single), 25 (multi), or 25 with includeMessageActions.
- includeMessageType (boolean, default true): Include message type.
- includeCustomMessageType (boolean): Retrieve messages with custom message type. See Retrieving Messages.
- includeUUID (boolean, default true): Include publisher uuid.
- includeMeta (boolean): Include meta object (if published).
- includeMessageActions (boolean): Include message actions; only one channel allowed; response may be truncated with more link.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

Truncated response:
- When including message actions, responses may be truncated. A more object is returned; make iterative calls using provided parameters.

### Sample code

Reference code (self-contained runnable example):

Retrieve a message from a channel:

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

Return information on message actions using actions (data is deprecated).

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

Requires Message Persistence. Also requires enabling Delete-From-History in Admin Portal and initializing with a secret key.

Removes messages from a channel’s history.

Method behavior:
- start is exclusive; end is inclusive.

### Method(s)

```
`1pubnub.deleteMessages({  
2    channel: string,  
3    start: string,  
4    end: string  
5})  
`
```

Parameters:
- channel (string, required): Channel to delete from.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

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

Pass the publish timetoken as End and timetoken-1 as Start (for example, Start: 15526611838554309, End: 15526611838554310).

```
1
  

```

## Message counts

Requires Message Persistence.

Returns the number of messages published since given timetokens (greater than or equal to each channel’s timetoken).

Note: With Unlimited retention, only messages from the last 30 days are counted.

### Method(s)

```
`1pubnub.messageCounts({  
2    channels: Arraystring>,  
3    channelTimetokens: Arraystring>  
4})  
`
```

Parameters:
- channels (Array<string>, required): Channels to count.
- channelTimetokens (Array<string>, required): Timetokens aligned to channels. A single timetoken applies to all channels; otherwise lengths must match or a PNStatus error is returned.

### Sample code

```
1
  

```

### Returns

Message count results:
- Channels without messages: 0.
- Channels with 10,000+ messages: 10000.

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

Requires Message Persistence. Deprecated; use fetch history instead.

Fetches historical messages for a single channel with legacy options.

Behavior:
- reverse=false (default): newest end of timeline.
- reverse=true: oldest end of timeline.
- Page using start OR end; retrieve slice using both start AND end.
- Limit via count (max 100).
- start is exclusive; end is inclusive. Max 100 per request; iterate using start to page.

### Method(s)

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

Parameters:
- channel (string, required): Channel to query.
- reverse (boolean, default false): Traverse from oldest to newest. Ignored if both start and end provided (results return from newest).
- count (number, default/max 100): Number of messages.
- stringifiedTimeToken (boolean, default false): Return timetokens as strings.
- includeMeta (boolean): Include meta object if published.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

Reverse details:
- Messages return sorted ascending. reverse only affects which end to start from when more than count messages exist in the interval.

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

Usage: Call with no argument or a timetoken.

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