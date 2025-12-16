# Message Persistence API for JavaScript SDK

Message Persistence provides access to stored message history (timestamped to 10ns, stored across multiple AZs/regions). Stored messages can be AES-256 encrypted (see [Message Persistence](/docs/general/storage)). Storage duration is controlled by your account retention policy (1 day → Unlimited).

You can retrieve:
- Messages
- Message reactions (message actions)
- Files (via File Sharing API)

### Supported and recommended asynchronous patterns
Supports Callbacks, Promises, and Async/Await. Examples use **Async/Await**. To capture status errors, use `try...catch`.

---

## Fetch history[​](#fetch-history)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/).

Fetch historical messages from one or more channels. Use `includeMessageActions` to include message actions.

**Time range rules**
- `start` only → messages **older than** `start` (start is exclusive)
- `end` only → messages from `end` and **newer**
- `start` + `end` → messages between them (**end is inclusive**)

**Limits / paging**
- Single channel: up to **100** messages
- Multiple channels (up to **500**): up to **25 per channel**
- If more match, page with iterative calls (adjust `start`).
- If `includeMessageActions` is used: **25 max**, **only one channel allowed**, may return truncated results with `more`.

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

**Parameters**
- `channels` *(required, Array<string>)*: Channels to fetch history from (up to 500).
- `count` *(number; default `100` single / `25` multi / `25` when `includeMessageActions`)*: Messages per channel.
- `includeMessageType` *(boolean; default `true`)*: Include message type.
- `includeCustomMessageType` *(Boolean)*: Retrieve messages with custom message type (see [Retrieving Messages](/docs/general/storage#retrieve-messages)).
- `includeUUID` *(boolean; default `true`)*: Include publisher UUID.
- `includeMeta` *(boolean)*: Include publish-time `meta`.
- `includeMessageActions` *(boolean)*: Include message actions. If used: one channel only; 25-limit; may be truncated; `more` provided.
- `start` *(string)*: Start timetoken (exclusive).
- `end` *(string)*: End timetoken (inclusive).

##### Truncated response
When fetching messages with actions, response may be truncated; if so, `more` is returned. Iterate using the provided values.

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

### Other examples[​](#other-examples)

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions)

```
1
  

```

#### Fetch messages with metadata and actions response[​](#fetch-messages-with-metadata-and-actions-response)

##### Return information on message actions
Use the `actions` object (not deprecated `data`) for actions such as reactions/edits/deletions/custom actions.

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

---

## Delete messages from history[​](#delete-messages-from-history)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove messages from a channel’s history.

##### Required setting
Enable **Delete-From-History** for your key in the Admin Portal and initialize the SDK with a **secret key**.

### Method(s)[​](#methods-1)

To `Delete Messages from History`, you can use the following method(s) in the JavaScript SDK.

```
`1pubnub.deleteMessages({  
2    channel: string,  
3    start: string,  
4    end: string  
5})  
`
```

##### Method behavior
`start` is **exclusive**; `end` is **inclusive**.

**Parameters**
- `channel` *(required, string)*: Channel whose messages will be deleted.
- `start` *(string)*: Start timetoken (exclusive).
- `end` *(string)*: End timetoken (inclusive).

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

To delete a specific message, set:
- `End` = publish timetoken
- `Start` = `timetoken - 1` (or `timetoken +/- 1` as described)

Example: for `15526611838554310`, use `Start=15526611838554309`, `End=15526611838554310`.

```
1
  

```

---

## Message counts[​](#message-counts)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns number of messages published since the given time (messages with timetoken **>=** `channelTimetokens`).

##### Unlimited message retention
Only the last **30 days** are counted.

### Method(s)[​](#methods-2)

You can use the following method(s) in the JavaScript SDK:

```
`1pubnub.messageCounts({  
2    channels: Arraystring>,  
3    channelTimetokens: Arraystring>  
4})  
`
```

**Parameters**
- `channels` *(required, Array<string>)*: Channels to count messages for.
- `channelTimetokens` *(required, Array<string>)*: Same order as `channels`. If one timetoken is provided, it applies to all channels; otherwise lengths must match or a `PNStatus` error is returned.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns)

##### Message count
- Channels without messages return `0`
- Channels with ≥ 10,000 messages return `10000`

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

---

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence
Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Alternative method
Deprecated; use [fetch history](#fetch-history).

Fetches historical messages of a channel.

**Behavior / controls**
- `reverse=false` (default) searches from newest end; `reverse=true` searches from oldest end.
- Page by providing `start` OR `end`.
- Retrieve slice by providing both `start` AND `end`.
- Limit by `count` (max 100).

##### Start & End parameter usage clarity
- `start` only → messages older than and up to `start`
- `end` only → messages at `end` and newer
- `start` + `end` → between values (end inclusive)
- Max 100 per call; page by iterating and adjusting `start`.

### Method(s)[​](#methods-3)

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

**Parameters**
- `channel` *(required, string)*: Channel to return history from.
- `reverse` *(boolean; default `false`)*: Traverse oldest→newest. If both `start` and `end` are provided, `reverse` is ignored and results start with newest.
- `count` *(number; default/max `100`)*: Number of messages.
- `stringifiedTimeToken` *(boolean; default `false`)*: Return timetokens as strings.
- `includeMeta` *(boolean)*: Include `meta`.
- `start` *(string)*: Start timetoken (exclusive).
- `end` *(string)*: End timetoken (inclusive).

##### Using the reverse parameter:
Messages are returned sorted ascending by time regardless; `reverse` affects which end is used when retrieving within a capped interval.

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