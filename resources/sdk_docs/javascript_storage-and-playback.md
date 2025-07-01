On this page
# Message Persistence API for JavaScript SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the status errors, you must use the [`try...catch`](https://javascript.info/try-catch) syntax in your code.

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/javascript/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the JavaScript SDK:

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

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aSpecifies `channels` to return history messages from. Maximum of 500 channels are allowed.`count`Type: numberDefault:  
`100` or `25`Specifies the number of historical messages to return per channel. Default is `100` per single channel and `25` per multiple channels or per single channel if `includeMessageActions` is used.`includeMessageType`Type: booleanDefault:  
`true`Pass `true` to receive the message type with each history message.`includeCustomMessageType`Type: BooleanDefault:  
n/aIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeUUID`Type: booleanDefault:  
`true`Pass `true` to receive the publisher `uuid` with each history message.`includeMeta`Type: booleanDefault:  
n/aWhether message meta information should be fetched or not.`includeMessageActions`Type: booleanDefault:  
n/aWhether message-added message actions should be fetched or not. If used, the limit of messages retrieved will be 25 per single channel. Throws an exception if API is called with more than one `channel`. Truncation will happen if the number of actions on the messages returned is > 25000. Each message can have a maximum of 25000 actions attached to it. Consider the example of querying for 10 messages. The first five messages have 5000 actions attached to each of them. The API will return the first 5 messages and all their 25000 actions. The response will also include a `more` link to get the remaining 5 messages.`start`Type: stringDefault:  
n/aTimetoken delimiting the `start` of `time` slice (exclusive) to pull messages from.`end`Type: stringDefault:  
n/aTimetoken delimiting the `end` of `time` slice (inclusive) to pull messages from.

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve a message from a channel:

```
`  
`
```

```
`  
`
```

### Response[​](#response)

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

### Other Examples[​](#other-examples)

#### Fetch messages with metadata and actions[​](#fetch-messages-with-metadata-and-actions)

```
`  
`
```

#### Fetch messages with metadata and actions Response[​](#fetch-messages-with-metadata-and-actions-response)

##### Return information on message actions

To get information on actions taken on specific messages within a PubNub channel (like reactions, edits, deletions, or other custom-defined actions) use the `actions` object instead of the deprecated `data` object.

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

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History`, you can use the following method(s) in the JavaScript SDK.

```
`pubnub.deleteMessages({  
    channel: string,  
    start: string,  
    end: string  
})  
`
```

##### Method behavior

The Delete Messages method behaves slightly differently than other history methods. Note that the `start` parameter is exclusive and the `end` parameter is inclusive.

*  requiredParameterDescription`channel` *Type: stringSpecifies `channel` messages to be deleted from history.`start`Type: stringTimetoken delimiting the `start` of time slice (exclusive) to delete messages from.`end`Type: stringTimetoken delimiting the `end` of time slice (inclusive) to delete messages from.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Response[​](#response-1)

```
`{  
    error: false,  
    operation: 'PNDeleteMessagesOperation',  
    statusCode: 200  
}  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from a Message Persistence[​](#delete-specific-message-from-a-message-persistence)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `channelTimetokens`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the JavaScript SDK:

```
`pubnub.messageCounts({  
    channels: Arraystring>,  
    channelTimetokens: Arraystring>  
})  
`
```

*  requiredParameterDescription`channels` *Type: Array`<string>`Default:  
n/aThe `channels` to fetch the message count`channelTimetokens` *Type: Array`<string>`Default:  
n/aList of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns)

##### Message count

`Channels` without messages have a count of 0. `Channels` with 10,000 messages or more have a count of 10000.

```
`{  
    channels: {  
        ch1: 49  
    }  
}  
`
```

### Status Response[​](#status-response)

```
`{  
    error: false,  
    operation: 'PNMessageCountsOperation',  
    statusCode: 200  
}  
`
```

### Other Examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`  
`
```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Alternative method

This method is deprecated. Use [fetch history](#fetch-history) instead.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `true`.

- Page through results by providing a `start` OR `end` timetoken.

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older**  than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-3)

To run `History`, you can use the following method(s) in the JavaScript SDK

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

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aSpecifies `channel` to return history messages from.`reverse`Type: booleanDefault:  
`false`Setting to `true` will traverse the `time` line in `reverse` starting with the oldest `message` first.If both `start` and `end` arguments are provided, `reverse` is ignored and messages are returned starting with the newest `message`.`count`Type: numberDefault:  
`100`Specifies the number of historical messages to return. Default/Maximum is `100`.`stringifiedTimeToken`Type: booleanDefault:  
`false`If `stringifiedTimeToken` is specified as `true`, the SDK will return `timetoken` values as a strings instead of integers. Usage of setting is encouraged in JavaScript environments which perform round-up/down on large integers.`includeMeta`Type: booleanDefault:  
n/aWhether message meta information should be fetched or not.`start`Type: stringDefault:  
n/aTimetoken delimiting the `start` of `time` slice (exclusive) to pull messages from.`end`Type: stringDefault:  
n/aTimetoken delimiting the `end` of `time` slice (inclusive) to pull messages from.

##### Using the reverse parameter:

Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `count`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-3)

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

### Response[​](#response-2)

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

### Other Examples[​](#other-examples-3)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

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

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

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

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

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

#### History Paging Example[​](#history-paging-example)

##### Usage

You can call the method by passing nothing or a valid **timetoken** as the argument.

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

#### Fetch messages with metadata[​](#fetch-messages-with-metadata)

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

#### Basic usage with Promises[​](#basic-usage-with-promises)

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
Last updated on Jun 30, 2025**