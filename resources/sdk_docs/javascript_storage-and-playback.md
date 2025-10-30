# Message Persistence API for JavaScript SDK

Message Persistence provides access to stored, timestamped messages across multiple regions with optional AES-256 encryption. Configure message retention per key: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited. You can retrieve messages, message reactions, and files (via File Sharing API).

Supported async patterns: Callbacks, Promises, Async/Await. Recommended: Async/Await with try...catch for error statuses.

## Fetch history

Requires Message Persistence enabled in the Admin Portal.

Fetch historical messages from one or more channels, optionally including message actions. Ordering and slicing:
- start only: messages older than start (start is exclusive).
- end only: messages from end and newer (end is inclusive).
- start and end: between start and end (end is inclusive).
- Limits: up to 100 per single channel; up to 25 per channel for multiple channels (up to 500 channels) or when includeMessageActions is used. Page with iterative calls by adjusting start.

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
- count (number): Messages per channel. Default 100 (single channel) and 25 (multi-channel) or 25 when includeMessageActions is true.
- includeMessageType (boolean, default true): Include message type.
- includeCustomMessageType (boolean): Retrieve messages with custom message type.
- includeUUID (boolean, default true): Include publisher uuid.
- includeMeta (boolean): Include meta object if published with message.
- includeMessageActions (boolean): Include message actions. When used: single channel only; limit 25; response may be truncated with a more link.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

Truncated response: When including message actions, response may include more with parameters to continue pagination.

### Sample code

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

Return information on message actions using the actions object (data is deprecated).

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

Requires Message Persistence enabled. Also enable Delete-From-History in Admin Portal and initialize the SDK with a secret key.

Removes messages from a channel’s history. Behavior: start is exclusive; end is inclusive.

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

To delete a specific message, pass the publish timetoken in End and timetoken +/- 1 in Start. Example: Start 15526611838554309, End 15526611838554310.

```
1
  

```

## Message counts

Requires Message Persistence enabled.

Returns the number of messages published since the given timetoken(s). Count includes messages with timetoken >= channelTimetokens. For Unlimited message retention keys, only the last 30 days are counted.

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
- channelTimetokens (Array<string>, required): Timetokens in same order as channels. A single value applies to all channels; otherwise, array lengths must match or a PNStatus error is returned.

### Sample code

```
1
  

```

### Returns

Message count: Channels without messages have 0. Channels with 10,000+ messages report 10000.

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

Requires Message Persistence enabled. Deprecated: use fetch history instead.

Fetches historical messages for a single channel with ordering, slicing, and paging:
- reverse=false (default): newest end of timeline; reverse=true: oldest end first.
- Page with start OR end; slice with both start AND end.
- count limits to max 100.
- start only: older than start; end only: end and newer; both: between (end inclusive). Iteratively adjust start to page beyond 100.

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
- channel (string, required): Channel to fetch.
- reverse (boolean, default false): Oldest-to-newest traversal when interval exceeds count. Ignored if both start and end provided.
- count (number, default/max 100): Number of messages.
- stringifiedTimeToken (boolean, default false): Return timetokens as strings.
- includeMeta (boolean): Include meta object.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

Using reverse: Messages are returned in ascending time. reverse controls which end to start from when more than count messages exist in the interval.

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