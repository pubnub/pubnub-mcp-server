On this page
# Message Persistence API for C# SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/c-sharp/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the C# SDK:

```
`pubnub.FetchHistory()  
        .Channels(string[])  
        .IncludeMeta(bool)  
        .IncludeMessageType(bool)  
        .IncludeCustomMessageType(bool)  
        .IncludeUUID(bool)  
        .IncludeMessageActions(bool)  
        .Reverse(bool)  
        .Start(int)  
        .End(int)  
        .MaximumPerChannel(int)  
        .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`Channels` *Type: string[]Specifies `channel` to return history messages from. Maximum of 500 channels are allowed.`IncludeMeta`Type: boolWhether meta (passed when Publishing the message) should be included in response or not.`IncludeMessageType`Type: boolPass `true` to receive the message type with each history message. Default is `true`.`IncludeCustomMessageType`Type: boolIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieving-messages).`IncludeUUID`Type: boolPass `true` to receive the publisher `uuid` with each history message. Default is `true`.`IncludeMessageActions`Type: boolThe flag denoting to retrieve history messages with `message` actions. If `true`, the method is limited to one channel and 25 messages only. Default is `false`.`Reverse`Type: boolSetting to `true` will traverse the time line in reverse starting with the oldest message first.`Start`Type: longTimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`End`Type: longTimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`MaximumPerChannel`Type: intSpecifies the number of historical messages to return. Default and maximum is 100 for a single channel, 25 for multiple channels, and 25 if `IncludeMessageActions` is `true`.`QueryParam`Type: Dictionary`<string, object>`QueryParam accepts a Dictionary object, the keys and values are passed as the query string parameters of the URL called by the API.`Execute` *Type: PNCallback`PNCallback` of type `PNFetchHistoryResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNFetchHistoryResult>`.

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last message on a channel:

```
`  
`
```

### Returns[​](#returns)

```
`{  
    "Messages":  
        {  
            "my_channel":  
            [{  
                "Timetoken":15717278253295153,  
                "Entry":"sample message",  
                "Meta":"",  
                "Uuid":"user-1",  
                "MessageType":0,  
                "CustomMessageType":"text-message",  
                "Actions":null  
            }]  
        },  
    "More":null  
`
```
show all 16 lines

### Other Examples[​](#other-examples)

#### Retrieve the last 25 messages on a channel synchronously[​](#retrieve-the-last-25-messages-on-a-channel-synchronously)

```
`  
`
```

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the C# SDK.

```
`pubnub.DeleteMessages()  
        .Channel(string)  
        .Start(long)  
        .End(long)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies `channel` messages to be deleted from history.`Start`Type: longTimetoken delimiting the `Start` of time slice (inclusive) to delete messages from.`End`Type: long`Timetoken` delimiting the End of time slice (exclusive) to delete messages from.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNDeleteMessageResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNDeleteMessageResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNDeleteMessageResult>`.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `DeleteMessages()` operation returns a `PNResult<PNDeleteMessageResult>` which returns empty `PNDeleteMessageResult` object.

### Other Examples[​](#other-examples-1)

#### Delete messages sent in a particular timeframe[​](#delete-messages-sent-in-a-particular-timeframe)

```
`  
`
```

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `ChannelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the C# SDK:

```
`pubnub.MessageCounts()  
        .Channels(string[])  
        .ChannelsTimetoken(long[])  
        .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`Channels` *Type: string[]The `channels` to fetch the message count`ChannelsTimetoken` *Type: long[]Array of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.`Async`Type: PNCallbackPNCallback of type `PNMessageCountResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallbackPNCallback of type `PNMessageCountResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNMessageCountResult>`.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The operation returns a `PNResult<PNMessageCountResult>` which contains the following operations:

Property NameTypeDescription`Result`PNMessageCountResultReturns a `PNMessageCountResult` object.`Status`PNStatusReturns a `PNStatus` object

`PNMessageCountResult` contains the following properties:

Property NameTypeDescription`Channels``Dictionary<string, long>`Collection of `channels` along with the messages count. `channels` without messages have a count of 0. `channels` with 10,000 messages or more have a count of 10000.

### Other Examples[​](#other-examples-2)

#### Retrieve count of messages for a single channel[​](#retrieve-count-of-messages-for-a-single-channel)

```
`  
`
```

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`  
`
```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Deprecated

This method is deprecated and will be removed in a future version. Please use the `fetchHistory()` method instead.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `Reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `Reverse` to `true`.

- Page through results by providing a `Start` OR `End` timetoken.

- Retrieve a *slice* of the time line by providing both a `Start` AND `End` timetoken.

- Limit the number of messages to a specific quantity using the `Count` parameter.

##### Start & End parameter usage clarity

If only the `Start` parameter is specified (without `End`), you will receive messages that are **older**  than and up to that `Start` timetoken value. If only the `End` parameter is specified (without `Start`) you will receive messages that match that `End` timetoken value and **newer**   Specifying values for both `Start` *and* `End` parameters will return messages between those timetoken values (inclusive on the `End` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `Start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

#### Method(s) (deprecated)[​](#methods-deprecated)

To run `History` you can use the following method(s) in the C# SDK:

```
`pubnub.History()  
        .Channel(string)  
        .IncludeMeta(bool)  
        .Reverse(bool)  
        .IncludeTimetoken(bool)  
        .Start(long)  
        .End(long)  
        .count(int)  
        .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies `Channel`to return history messages from.`IncludeMeta`Type: boolWhether meta (passed when Publishing the message) should be included in response or not.`Reverse`Type: boolSetting to `true` will traverse the time line in reverse starting with the oldest message first.`IncludeTimetoken`Type: boolWhether event dates `timetokens` should be included in response or not.`Start`Type: longTimetoken delimiting the `Start` of time slice (exclusive) to pull messages from.`End`Type: longTimetoken delimiting the `End` of time slice (inclusive) to pull messages from.`Count`Type: intSpecifies the number of historical messages to return.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNHistoryResult`.   
   
 This parameter is deprecated and will be removed in a future version. Please use the `ExecuteAsync` parameter instead.`Execute` *Type: PNCallback`PNCallback` of type `PNHistoryResult`.`ExecuteAsync`Type: NoneReturns `PNResult<PNHistoryResult>`.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `Reverse`. The `Reverse` direction matters when you have more than 100 (or `Count`, if it's set) messages in the time interval, in which case `Reverse` determines the end of the time interval from which it should start retrieving the messages.

#### Basic Usage (deprecated)[​](#basic-usage-deprecated)

Retrieve the last 100 messages on a channel:

```
`  
`
```

#### Returns (deprecated)[​](#returns-deprecated)

The `History()` operation returns a `PNResult<PNHistoryResult>` which contains the following properties:

Property NameTypeDescription`Result`PNHistoryResultReturns a `PNHistoryResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNHistoryResult` which contains the following properties:

Property NameTypeDescription`Messages`List`<PNHistoryItemResult>`List of messages of type `PNHistoryItemResult`. See [PNHistoryItemResult](#pnhistoryitemresult-deprecated)  for more details.`StartTimetoken`longStart `timetoken`.`EndTimetoken`longEnd `timetoken`.

##### PNHistoryItemResult (deprecated)[​](#pnhistoryitemresult-deprecated)

Property NameTypeDescription`Timetoken`long`Timetoken` of the message.`Entry`objectMessage.

#### Other Examples (deprecated)[​](#other-examples-deprecated)

##### Retrieve the last 100 messages on a channel synchronously (deprecated)[​](#retrieve-the-last-100-messages-on-a-channel-synchronously-deprecated)

```
`  
`
```

##### Use History() to retrieve the three oldest messages by retrieving from the time line in reverse (deprecated)[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse-deprecated)

```
`  
`
```

##### Response (deprecated)[​](#response-deprecated)

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub1"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub2"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        }  
    ],  
`
```
show all 18 lines

##### Use History() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive) (deprecated)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive-deprecated)

```
`  
`
```

##### Response (deprecated)[​](#response-deprecated-1)

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub4"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub5"  
        }  
    ],  
`
```
show all 18 lines

##### Use History() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive) (deprecated)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive-deprecated)

```
`  
`
```

##### Response (deprecated)[​](#response-deprecated-2)

```
`{  
    "Messages":[  
        {  
            "Timetoken": 0,  
            "Entry": "Pub3"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub4"  
        },  
        {  
            "Timetoken": 0,  
            "Entry": "Pub5"  
        }  
    ],  
`
```
show all 18 lines

##### History Paging Example (deprecated)[​](#history-paging-example-deprecated)

##### Usage

You can call the method by passing 0 or a valid **timetoken** as the argument.

```
`  
`
```

##### Include timetoken in history response (deprecated)[​](#include-timetoken-in-history-response-deprecated)

```
`**`
```
Last updated on Jun 30, 2025**