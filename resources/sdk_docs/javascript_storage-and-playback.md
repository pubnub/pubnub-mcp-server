# Message Persistence API for JavaScript SDK

Message Persistence provides real-time access to stored messages (timestamped to 10ns, replicated across zones/regions). Messages can be encrypted with AES-256. You control retention (1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited). You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

Supported async patterns: Callbacks, Promises, Async/Await (recommended). Async/Await returns status only on error; use try...catch.

## Fetch history

Requires Message Persistence (enable in Admin Portal).

Fetch historical messages from one or more channels. Use includeMessageActions to include message actions. Order and range:
- start only: messages older than start.
- end only: messages from end and newer.
- start and end: messages between them (end inclusive).
Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 messages per channel.
- With includeMessageActions: limit is 25 and only one channel allowed.
Page by making iterative calls and adjusting start.

### Method(s)

```
`pubnub.fetchMessages({  
    channels: Arraystring>,  
    count: number,  
    includeMessageType: boolean,  
    includeCustomMessageType: boolean,  
    includeUUID: boolean,  
    includeMeta: boolean,  
    includeMessageActions: boolean,  
    start: string,  
    end: string  
})  
`
```

Parameters:
- channels (Array<string>, required): Channels to fetch from (up to 500).
- count (number, default: 100 for single channel, 25 for multi-channel or when includeMessageActions): Number per channel.
- includeMessageType (boolean, default: true): Include message type.
- includeCustomMessageType (boolean): Retrieve messages with the custom message type.
- includeUUID (boolean, default: true): Include publisher uuid.
- includeMeta (boolean): Include meta object from publish time.
- includeMessageActions (boolean): Retrieve messages with actions. If used, limit is 25; only one channel allowed. Response may be truncated; more link provided.
- start (string): Timetoken start (exclusive).
- end (string): Timetoken end (inclusive).

Truncated response: When including message actions, response may include more for pagination. Make iterative calls using returned parameters.

### Sample code

Reference code (self-contained):

Retrieve a message from a channel:

```
`  
`
```

```
`  
`
```

### Response

```
`//Example of status  
{  
    error: false,  
    operation: 'PNFetchMessagesOperation',  
    statusCode: 200  
}  
  
//Example of response  
{  
    "channels":{  
        "my-channel":[  
            {  
                "message":"message_1",  
                "timetoken":"15483367794816642",  
                "uuid":"my-uuid",  
`
```
show all 23 lines

### Other examples

#### Fetch messages with metadata and actions

```
`  
`
```

#### Fetch messages with metadata and actions response

Return information on message actions using actions (deprecated: data).

```
`// Example of status  
{  
    "error": false,  
    "operation": "PNFetchMessagesOperation",  
    "statusCode": 200  
}  
  
// Example of response  
{  
    "channels":{  
        "my_channel":[  
            {  
                "channel : "my_channel",  
                "timetoken":"15741125155552287",  
                "message":{  
`
```
show all 40 lines

## Delete messages from history

Requires Message Persistence (enable in Admin Portal). Also enable Delete-From-History and initialize SDK with a secret key.

Remove messages from a channel’s history.
- start is exclusive; end is inclusive.

### Method(s)

```
`pubnub.deleteMessages({  
    channel: string,  
    start: string,  
    end: string  
})  
`
```

Parameters:
- channel (string, required): Channel to delete from.
- start (string): Timetoken start (exclusive).
- end (string): Timetoken end (inclusive).

### Sample code

```
`  
`
```

### Response

```
`{  
    error: false,  
    operation: 'PNDeleteMessagesOperation',  
    statusCode: 200  
}  
`
```

### Other examples

#### Delete specific message from a Message Persistence

To delete a specific message, pass publish timetoken in End and timetoken-1 in Start (e.g., Start=15526611838554309, End=15526611838554310).

```
`  
`
```

## Message counts

Requires Message Persistence (enable in Admin Portal).

Returns the number of messages published since the given time (timetoken >= channelTimetokens).
- Unlimited retention: only last 30 days are counted.
- Channels without messages: 0.
- Channels with 10,000+ messages: 10000.

### Method(s)

```
`pubnub.messageCounts({  
    channels: Arraystring>,  
    channelTimetokens: Arraystring>  
})  
`
```

Parameters:
- channels (Array<string>, required): Channels to fetch the count for.
- channelTimetokens (Array<string>, required): Same order as channels. A single timetoken applies to all channels; otherwise lengths must match or PNStatus error returned.

### Sample code

```
`  
`
```

### Returns

Message count:

```
`{  
    channels: {  
        ch1: 49  
    }  
}  
`
```

### Status response

```
`{  
    error: false,  
    operation: 'PNMessageCountsOperation',  
    statusCode: 200  
}  
`
```

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```
`  
`
```

## History (deprecated)

Requires Message Persistence (enable in Admin Portal).

Deprecated. Use fetch history instead.

Fetches historical messages of a channel. Control order and retrieval:
- Default newest-first window (reverse=false).
- Oldest-first by setting reverse=true.
- Page by providing start OR end.
- Retrieve slice by providing both start AND end.
- Limit via count (max 100).

Start & End clarity:
- start only: messages older than up to start.
- end only: messages matching end and newer.
- both: messages between them (end inclusive).
- Max 100 per call; page by adjusting start.

### Method(s)

```
`pubnub.history({  
    channel: string,  
    reverse: boolean,  
    count: number,  
    stringifiedTimeToken: boolean,  
    includeMeta: boolean,  
    start: string,  
    end: string  
})  
`
```

Parameters:
- channel (string, required): Channel to fetch from.
- reverse (boolean, default: false): Traverse from oldest to newest. If both start and end are provided, reverse is ignored; results start from newest within range.
- count (number, default/max: 100): Number to return.
- stringifiedTimeToken (boolean, default: false): Return timetokens as strings.
- includeMeta (boolean): Include meta object.
- start (string): Timetoken start (exclusive).
- end (string): Timetoken end (inclusive).

Reverse behavior: Messages are returned in ascending time order. reverse affects which end of the interval retrieval starts from when more than count messages exist.

### Sample code

Retrieve the last 100 messages on a channel:

```
`try {  
    const result = await pubnub.history({  
        channel: "history_channel",  
        count: 100, // how many items to fetch  
        stringifiedTimeToken: true, // false is the default  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

### Response

```
`// Example of Status  
{  
    error: false,  
    operation: "PNHistoryOperation",  
    statusCode: 200  
}  
  
// Example of Response  
{  
    endTimeToken: "14867650866860159",  
    messages: [  
        {  
            timetoken: "14867650866860159",  
            entry: "[User 636] hello World"  
        },  
`
```
show all 21 lines

### Other examples

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
        count: 3, // how many items to fetch  
        stringifiedTimeToken: true, // false is the default  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
        stringifiedTimeToken: true, // false is the default  
        start: "13406746780720711", // start timetoken to fetch  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        stringifiedTimeToken: true, // false is the default  
        end: "13406746780720711", // start timetoken to fetch  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

#### History paging example

Usage: Call with nothing or a valid timetoken.

```
`async function getAllMessages(initialTimetoken = 0) {  
    const allMessages = [];  
    let latestCount = 100;  
    let timetoken = initialTimetoken;  
  
    while (latestCount === 100) {  
        const { messages, startTimeToken, endTimeToken } = await pubnub.history(  
            {  
                channel: "history_test",  
                stringifiedTimeToken: true, // false is the default  
                start: timetoken, // start timetoken to fetch  
            }  
        );  
  
        latestCount = messages.length;  
`
```
show all 28 lines

#### Fetch messages with metadata

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        stringifiedTimeToken: true,  
        includeMeta: true,  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

#### Sample code with promises

```
`pubnub.history({**    channel: 'history_channel',  
    reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
    count: 100, // how many items to fetch  
    stringifiedTimeToken: true, // false is the default  
    start: '123123123123', // start timetoken to fetch  
    end: '123123123133', // end timetoken to fetch  
}).then((response) => {  
    console.log(response);  
}).catch((error) => {  
    console.log(error);  
});  
`
```

Last updated on Sep 3, 2025**