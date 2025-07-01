# Message Persistence API (JavaScript SDK)

Retains each message (AES-256 optional) for 1 day, 7 days, 30 days, 3 mo, 6 mo, 1 yr, or Unlimited, configurable per key.  
Requires the *Message Persistence* add-on (enable in Admin Portal).

Supported async styles: Callbacks, Promises, Async/Await (examples use `async/await` with `try…catch`).

---

## Fetch History

• Returns up to 100 messages for 1 channel, or 25 per channel for ≤ 500 channels (25 max if `includeMessageActions:true`).  
• `start` is exclusive; `end` is inclusive.  
• If response is truncated, a `more` object is returned—repeat the call with provided parameters.

### Method

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

Parameter essentials  
• `channels` (array<string>, required, max 500)  
• `count` (number, default 100/25)  
• `includeMessageType` (boolean, default true)  
• `includeCustomMessageType` (boolean)  
• `includeUUID` (boolean, default true)  
• `includeMeta` (boolean)  
• `includeMessageActions` (boolean) – single-channel only, returns ≤ 25 messages, truncates if actions > 25 000 (see `more` link)  
• `start`, `end` (string timetoken)

### Basic usage

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
(show all 23 lines)

### Fetch with metadata & actions

```
`  
`
```

Response (uses `actions` object):

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
(show all 40 lines)

---

## Delete Messages from History

Requires: Message Persistence enabled, *Enable Delete-From-History* checked, and SDK initialized with **secret key**.  
`start` is exclusive, `end` inclusive.

### Method

```
`pubnub.deleteMessages({  
    channel: string,  
    start: string,  
    end: string  
})  
`
```

Parameters  
• `channel` (string)  
• `start`, `end` (string timetoken)

### Basic usage

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

### Delete a specific message

```
`  
`
```
(Use publish-timetoken as `end`, timetoken − 1 as `start`.)

---

## Message Counts

Returns number of messages on channels since supplied timetoken(s).  
For Unlimited retention keys, only messages from last 30 days are counted.

### Method

```
`pubnub.messageCounts({  
    channels: Arraystring>,  
    channelTimetokens: Arraystring>  
})  
`
```

Parameters  
• `channels` (array<string>)  
• `channelTimetokens` (array<string>) – one per channel or single value for all.

### Basic usage

```
`  
`
```

### Returns

```
`{  
    channels: {  
        ch1: 49  
    }  
}  
`
```

Status:

```
`{  
    error: false,  
    operation: 'PNMessageCountsOperation',  
    statusCode: 200  
}  
`
```

Example with different timetokens per channel:

```
`  
`
```

---

## History (deprecated)

Use *Fetch History* instead.  
Still available; max 100 messages per call.

### Method

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

Key points  
• `reverse:true` reads oldest→newest (ignored if both `start` and `end` provided).  
• `stringifiedTimeToken:true` prevents JS integer rounding.  
• `start` exclusive, `end` inclusive.

### Basic usage

```
`try {  
    const result = await pubnub.history({  
        channel: "history_channel",  
        count: 100,  
        stringifiedTimeToken: true,  
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
(show all 21 lines)

### Additional history examples

Retrieve three oldest messages (`reverse:true`):

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        reverse: true,  
        count: 3,  
        stringifiedTimeToken: true,  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

Paging forward from a timetoken:

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        reverse: true,  
        stringifiedTimeToken: true,  
        start: "13406746780720711",  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

Paging backward until a timetoken:

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        stringifiedTimeToken: true,  
        end: "13406746780720711",  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

Full paging loop example:

```
`async function getAllMessages(initialTimetoken = 0) {  
    const allMessages = [];  
    let latestCount = 100;  
    let timetoken = initialTimetoken;  
  
    while (latestCount === 100) {  
        const { messages, startTimeToken, endTimeToken } = await pubnub.history(  
            {  
                channel: "history_test",  
                stringifiedTimeToken: true,  
                start: timetoken,  
            }  
        );  
  
        latestCount = messages.length;  
`
```
(show all 28 lines)

Fetch with metadata:

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

Promise style:

```
`pubnub.history({**    channel: 'history_channel',  
    reverse: true,  
    count: 100,  
    stringifiedTimeToken: true,  
    start: '123123123123',  
    end: '123123123133',  
}).then((response) => {  
    console.log(response);  
}).catch((error) => {  
    console.log(error);  
});  
`
```

_Last updated Jun 30 2025_