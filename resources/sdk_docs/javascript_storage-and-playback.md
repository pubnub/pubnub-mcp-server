# Message Persistence API for JavaScript SDK

Message Persistence provides real-time access to historical messages, reactions, and files. Messages are timestamped to the nearest 10 ns and replicated across regions. Optional AES-256 encryption is supported. See Message Persistence for details.

Retention policy: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve:
- Messages
- Message reactions
- Files (using the File Sharing API)

##### Supported and recommended asynchronous patterns
Callbacks, Promises, and Async/Await are supported. Async/Await is recommended; use try...catch to handle status errors.

## Fetch history[​](#fetch-history)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering and pagination:
- Only start: returns messages older than the start timetoken (exclusive).
- Only end: returns messages from that end timetoken and newer (inclusive).
- Both start and end: returns messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: limit is 25 for a single channel and only one channel is allowed. The response may be truncated and include a more link; make iterative calls with provided parameters.

### Method(s)[​](#methods)

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

Parameters:
- channels (Array<string>) required: Channels to fetch history from (up to 500).
- count (number): Per-channel message count. Default is 100 (single channel) and 25 (multi-channel) or 25 with includeMessageActions.
- includeMessageType (boolean): Include message type. Default true.
- includeCustomMessageType (boolean): Include custom message type.
- includeUUID (boolean): Include publisher uuid. Default true.
- includeMeta (boolean): Include meta object (if published with meta).
- includeMessageActions (boolean): Include message actions. Only one channel allowed; limit 25; responses may be truncated with more.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

##### Truncated response
When fetching with message actions, the response may be truncated. If so, a more property is returned with additional parameters; call again with those parameters to continue.

### Sample code[​](#sample-code)

##### Reference code
Retrieve a message from a channel:

```
1
  

```

```
1
  

```

### Response[​](#response)

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
show all 23 lines

### Other examples[​](#other-examples)

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions)

```
1
  

```

#### Fetch messages with metadata and actions response[​](#fetch-messages-with-metadata-and-actions-response)

##### Return information on message actions
Use the actions object (not the deprecated data object) to receive reactions, edits, deletions, or custom actions.

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
show all 40 lines

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Remove messages from a specific channel’s history.

##### Required setting
Enable Delete-From-History for your key in the Admin Portal and initialize the SDK with a secret key.

### Method(s)[​](#methods-1)

To Delete Messages from History, use:

```
`1pubnub.deleteMessages({  
2    channel: string,  
3    start: string,  
4    end: string  
5})  
`
```

##### Method behavior
start is exclusive; end is inclusive.

Parameters:
- channel (string) required: Channel to delete from.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

### Sample code[​](#sample-code-1)

```
1
  

```

### Response[​](#response-1)

```
`1{  
2    error: false,  
3    operation: 'PNDeleteMessagesOperation',  
4    statusCode: 200  
5}  
`
```

### Other examples[​](#other-examples-1)

#### Delete specific message from a Message Persistence[​](#delete-specific-message-from-a-message-persistence)
To delete a specific message, pass the publish timetoken in End and timetoken +/- 1 in Start. Example: for publish timetoken 15526611838554310, use Start 15526611838554309 and End 15526611838554310.

```
1
  

```

## Message counts[​](#message-counts)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

Return the number of messages published since the given time. Count includes messages with timetoken >= channelTimetokens.

##### Unlimited message retention
Only messages from the last 30 days are counted.

### Method(s)[​](#methods-2)

Use:

```
`1pubnub.messageCounts({  
2    channels: Arraystring>,  
3    channelTimetokens: Arraystring>  
4})  
`
```

Parameters:
- channels (Array<string>) required: Channels to fetch counts for.
- channelTimetokens (Array<string>) required: Either a single timetoken for all channels or one per channel (array lengths must match). Otherwise returns PNStatus error.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns)

##### Message count
Channels without messages have count 0. Channels with 10,000 or more messages return 10000.

```
`1{  
2    channels: {  
3        ch1: 49  
4    }  
5}  
`
```

### Status response[​](#status-response)

```
`1{  
2    error: false,  
3    operation: 'PNMessageCountsOperation',  
4    statusCode: 200  
5}  
`
```

### Other examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
1
  

```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal.

##### Alternative method
Deprecated. Use fetch history instead.

Fetch historical messages for a channel with ordering and pagination controls:
- reverse=false (default): start from newest end of timeline.
- reverse=true: start from oldest end.
- Page with start OR end timetoken.
- Retrieve a slice with both start AND end.
- Limit results with count (max 100).

##### Start & End parameter usage clarity
- Only start: messages older than and up to start (exclusive).
- Only end: messages matching end and newer (inclusive).
- Both: messages between start and end (inclusive of end). Maximum 100 per call; page by adjusting start.

### Method(s)[​](#methods-3)

Use:

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
- channel (string) required: Channel to return history from.
- reverse (boolean, default false): Traverse oldest to newest. Ignored if both start and end provided; messages always returned in ascending time.
- count (number, default/max 100): Number of messages to return.
- stringifiedTimeToken (boolean, default false): Return timetokens as strings.
- includeMeta (boolean): Include meta object if published with meta.
- start (string): Start timetoken (exclusive).
- end (string): End timetoken (inclusive).

##### Using the reverse parameter:
Messages are always returned in ascending time. reverse determines which end of the interval to start from when more than count messages exist.

### Sample code[​](#sample-code-3)

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

### Response[​](#response-2)

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
show all 21 lines

### Other examples[​](#other-examples-3)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

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

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

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

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

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

#### History paging example[​](#history-paging-example)

##### Usage
Call with nothing or a valid timetoken.

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
show all 28 lines

#### Fetch messages with metadata[​](#fetch-messages-with-metadata)

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

#### Sample code with promises[​](#sample-code-with-promises)

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