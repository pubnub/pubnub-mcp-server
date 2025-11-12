# Message Persistence API for JavaScript SDK (Condensed)

Message Persistence provides real-time access to stored messages, reactions, and files. Messages are timestamped (10 ns precision), replicated across regions, and can be encrypted with AES-256. Configure storage retention in the Admin Portal (1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited).

Supported async patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch to handle errors.

## Fetch history

Requires Message Persistence (enable in Admin Portal). Retrieve historical messages from one or more channels. Use includeMessageActions to include message actions.

Ordering and ranges:
- start only: messages older than start (exclusive).
- end only: messages from end (inclusive) and newer.
- start and end: messages between them (inclusive of end).

Limits:
- Single channel: up to 100 messages.
- Multiple channels (up to 500): up to 25 per channel.
- With includeMessageActions: single channel only, limit 25; response may be truncated with a more pointer (make iterative calls).

### Method(s)

```
pubnub.fetchMessages({
  channels: Array<string>,
  count: number,
  includeMessageType: boolean,
  includeCustomMessageType: boolean,
  includeUUID: boolean,
  includeMeta: boolean,
  includeMessageActions: boolean,
  start: string,
  end: string
})
```

Parameters:
- channels (required) Type: Array<string> — Channels to fetch from (up to 500).
- count Type: number — Default 100 (single channel), 25 (multi-channel), or 25 with includeMessageActions.
- includeMessageType Type: boolean — Default true.
- includeCustomMessageType Type: boolean — Retrieve messages with a custom message type.
- includeUUID Type: boolean — Default true; include publisher uuid.
- includeMeta Type: boolean — Include meta object published with the message.
- includeMessageActions Type: boolean — Include message actions; limit 25 and single channel only. Response may include a more link.
- start Type: string — Start timetoken (exclusive).
- end Type: string — End timetoken (inclusive).

Truncated response:
- If includeMessageActions triggers truncation, a more object is returned. Use its parameters to fetch more.

### Sample code

Reference code: Retrieve a message from a channel:

```

```

```

```

### Response

```
# Example of status
{
  error: false,
  operation: 'PNFetchMessagesOperation',
  statusCode: 200
}

# Example of response
{
  "channels": {
    "my-channel": [
      {
        "message": "message_1",
        "timetoken": "15483367794816642",
        "uuid": "my-uuid",
        "message_type": null,
        // the value depends on the custom message type
        // that the message was sent with
        "custom_message_type": "text-message"
      }
    ]
  }
}
```

### Other examples

#### Fetch messages with metadata and actions

```

```

#### Fetch messages with metadata and actions response

Return information on message actions (use actions, not deprecated data):

```
# Example of status
{
  "error": false,
  "operation": "PNFetchMessagesOperation",
  "statusCode": 200
}

# Example of response
{
  "channels": {
    "my_channel": [
      {
        "channel : "my_channel",
        "timetoken":"15741125155552287",
        "message": {
          "text":"Hello world!"
        },
        "messageType": 1,
        "customMessageType": "your custom type",
        "uuid": "someUserId",
        "meta":"",
        "actions": {
          "reaction": {
            "smiley_face": [
              {
                "uuid":"my-uuid",
                "actionTimetoken":"15741125155943280"
              }
            ]
          }
        }
      }
    ]
  },
  "more": {
    "url": "/v3/history-with-actions/sub-key/subscribeKey/channel/myChannel?start=15610547826970000&max=98",
    "start": "15610547826970000",
    "max": 98
  }
}
```

## Delete messages from history

Requires Message Persistence. Also requires enabling Delete-From-History and initializing the SDK with a secret key.

Removes messages from a specific channel’s history.

Method behavior:
- start is exclusive; end is inclusive.

### Method(s)

```
pubnub.deleteMessages({
  channel: string,
  start: string,
  end: string
})
```

Parameters:
- channel (required) Type: string — Channel to delete from.
- start Type: string — Start timetoken (exclusive).
- end Type: string — End timetoken (inclusive).

### Sample code

```

```

### Response

```
{
  error: false,
  operation: 'PNDeleteMessagesOperation',
  statusCode: 200
}
```

### Other examples

#### Delete specific message from a Message Persistence

To delete a specific message, pass the publish timetoken in End and timetoken -/+ 1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

```

```

## Message counts

Requires Message Persistence. Returns number of messages published since given timetokens.

Note: Only messages from the last 30 days are counted (even with Unlimited retention).

### Method(s)

```
pubnub.messageCounts({
  channels: Array<string>,
  channelTimetokens: Array<string>
})
```

Parameters:
- channels (required) Type: Array<string> — Channels to count.
- channelTimetokens (required) Type: Array<string> — Same order as channels. A single timetoken applies to all channels; otherwise lengths must match or returns a PNStatus error.

### Sample code

```

```

### Returns

Message count:
- Channels without messages: 0.
- Channels with ≥10,000 messages: 10000.

```
{
  channels: {
    ch1: 49
  }
}
```

### Status response

```
{
  error: false,
  operation: 'PNMessageCountsOperation',
  statusCode: 200
}
```

### Other examples

#### Retrieve count of messages using different timetokens for each channel

```

```

## History (deprecated)

Deprecated. Use fetch history instead. Retrieves historical messages for a single channel.

Behavior and parameters:
- reverse=false (default): search from newest end.
- reverse=true: search from oldest end.
- Pagination via start or end.
- Slice via both start and end.
- count limits results (max 100).
- start is exclusive; end is inclusive.
- Messages are returned in ascending time order; reverse only affects which end is used to begin retrieval when more than count messages are in range.

### Method(s)

```
pubnub.history({
  channel: string,
  reverse: boolean,
  count: number,
  stringifiedTimeToken: boolean,
  includeMeta: boolean,
  start: string,
  end: string
})
```

Parameters:
- channel (required) Type: string — Channel to fetch from.
- reverse Type: boolean — Default false. If both start and end provided, reverse is ignored; returns starting with newest.
- count Type: number — Default/Max 100.
- stringifiedTimeToken Type: boolean — Default false; return timetokens as strings.
- includeMeta Type: boolean — Include meta object published with messages.
- start Type: string — Start timetoken (exclusive).
- end Type: string — End timetoken (inclusive).

### Sample code

Retrieve the last 100 messages on a channel:

```
try {
  const result = await pubnub.history({
    channel: "history_channel",
    count: 100, // how many items to fetch
    stringifiedTimeToken: true // false is the default
  });
} catch (status) {
  console.log(status);
}
```

### Response

```
# Example of Status
{
  error: false,
  operation: "PNHistoryOperation",
  statusCode: 200
}

# Example of Response
{
  endTimeToken: "14867650866860159",
  messages: [
    {
      timetoken: "14867650866860159",
      entry: "[User 636] hello World"
    },
    {...},
    {...},
    {...}
  ],
  startTimeToken: "14867650866860159"
}
```

### Other examples

#### Retrieve three oldest messages (reverse)

```
try {
  const result = await pubnub.history({
    channel: "my_channel",
    reverse: true, // traverse from oldest to newest
    count: 3, // how many items to fetch
    stringifiedTimeToken: true // false is the default
  });
} catch (status) {
  console.log(status);
}
```

#### Retrieve messages newer than a timetoken (page oldest→newest from a point)

```
try {
  const result = await pubnub.history({
    channel: "my_channel",
    reverse: true, // traverse from oldest to newest
    stringifiedTimeToken: true, // false is the default
    start: "13406746780720711" // start timetoken to fetch
  });
} catch (status) {
  console.log(status);
}
```

#### Retrieve messages until a timetoken (page newest→oldest to an end point)

```
try {
  const result = await pubnub.history({
    channel: "my_channel",
    stringifiedTimeToken: true, // false is the default
    end: "13406746780720711" // end timetoken to fetch
  });
} catch (status) {
  console.log(status);
}
```

#### History paging example

Usage: Call with nothing or a valid timetoken.

```
async function getAllMessages(initialTimetoken = 0) {
  const allMessages = [];
  let latestCount = 100;
  let timetoken = initialTimetoken;

  while (latestCount === 100) {
    const { messages, startTimeToken, endTimeToken } = await pubnub.history({
      channel: "history_test",
      stringifiedTimeToken: true, // false is the default
      start: timetoken // start timetoken to fetch
    });

    latestCount = messages.length;
    timetoken = startTimeToken;

    if (messages && messages.length > 0) {
      allMessages.push(...messages);
    }
  }

  return allMessages;
}

// Usage examples:
// await getAllMessages();
// await getAllMessages("12345678901234");
```

#### Fetch messages with metadata

```
try {
  const result = await pubnub.history({
    channel: "my_channel",
    stringifiedTimeToken: true,
    includeMeta: true
  });
} catch (status) {
  console.log(status);
}
```

#### Sample code with promises

```
pubnub.history({
  channel: 'history_channel',
  reverse: true, // traverse from oldest to newest
  count: 100, // how many items to fetch
  stringifiedTimeToken: true, // false is the default
  start: '123123123123', // start timetoken to fetch
  end: '123123123133' // end timetoken to fetch
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
```