# Message Persistence API – JavaScript SDK (Storage & Playback)

Message Persistence stores every published message (optional AES-256 encryption) and lets you:
• Fetch stored messages, reactions, and files  
• Delete stored messages  
• Count stored messages  

Retention is account-configurable: 1 day, 7 days, 30 days, 3 mo, 6 mo, 1 yr, or Unlimited.

Async patterns: callbacks, promises, or (recommended) async/await with `try…catch`.

---

## Fetch History  (requires Message Persistence)

• Returns up to 100 msgs on one channel or 25 msgs on ≤500 channels (25 if `includeMessageActions` is true).  
• `start` only → older than `start`; `end` only → `end` and newer; both → between them (`end` inclusive).  
• When `includeMessageActions` is true, response may be truncated and include a `more` link.

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
• `channels` *Array<string>* max 500 – required  
• `count` number – default 100 (single channel) / 25 (multi-channel or with actions)  
• `includeMessageType` boolean – default true  
• `includeCustomMessageType` boolean  
• `includeUUID` boolean – default true  
• `includeMeta` boolean  
• `includeMessageActions` boolean – single-channel only; max 25 k actions/msg  
• `start`, `end` string timetokens

### Sample code
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
(show all 23 lines)

#### Fetch messages with metadata and actions
```
`  
`
```

#### Sample response (actions object)
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

## Delete Messages from History  (requires Message Persistence & “Enable Delete-From-History”, secret key)

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
• `channel` string – required  
• `start`, `end` string timetokens

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

#### Delete a specific message
```
`  
`
```

---

## Message Counts  (requires Message Persistence)

Returns number of messages published **≥** each supplied timetoken (last 30 days if unlimited retention).

### Method
```
`pubnub.messageCounts({  
    channels: Arraystring>,  
    channelTimetokens: Arraystring>  
})  
`
```

Parameters  
• `channels` Array<string> – required  
• `channelTimetokens` Array<string> – one timetoken for all channels or one per channel

### Sample code
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

### Status response
```
`{  
    error: false,  
    operation: 'PNMessageCountsOperation',  
    statusCode: 200  
}  
`
```

#### Example (different timetokens per channel)
```
`  
`
```

---

## History (deprecated – use Fetch History)

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
• Max 100 msgs; `reverse` ignored if both `start` and `end` provided.  
• `start` exclusive, `end` inclusive.  
• `stringifiedTimeToken: true` recommended for large integers.

### Sample code
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

#### Additional examples  
• Retrieve oldest 3 messages (`reverse: true`)  
• Page forwards from a timetoken (`reverse: true`, `start`)  
• Page backwards until a timetoken (`end`)  
• Full paging loop (`while`)  
• Fetch with metadata  
• Promise-based usage

(All original code blocks retained below.)

```
`try {  
    const result = await pubnub.history({  
        channel: "my_channel",  
        reverse: true, // Setting to true will traverse the time line in reverse starting with the oldest message first.  
        count: 3,  
        stringifiedTimeToken: true,  
    });  
} catch (status) {  
    console.log(status);  
}  
`
```

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

_Last updated Jul 15 2025_