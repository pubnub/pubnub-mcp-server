On this page
# Message Persistence API for Unity SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/unity/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the Unity SDK:

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
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieving-messages).`IncludeUUID`Type: boolPass `true` to receive the publisher `uuid` with each history message. Default is `true`.`IncludeMessageActions`Type: boolThe flag denoting to retrieve history messages with `message` actions. If `true`, the method is limited to one channel and 25 messages only. Default is `false`.`Reverse`Type: boolSetting to `true` will traverse the time line in reverse starting with the oldest message first.`Start`Type: longTimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`End`Type: longTimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`MaximumPerChannel`Type: intSpecifies the number of historical messages to return. Default and maximum is 100 for a single channel, 25 for multiple channels, and 25 if `IncludeMessageActions` is `true`.`QueryParam`Type: Dictionary`<string, object>`QueryParam accepts a Dictionary object, the keys and values are passed as the query string parameters of the URL called by the API.`Execute` *Type: `System.Action``System.Action` of type `PNFetchHistoryResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNFetchHistoryResult>>`.

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last message on a channel:

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class FetchLastMessageExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized string for the channel ID  
    [SerializeField] private string channelId = "my_channel";  
  
    private async void Start() {  
        // Getting a reference to the Pubnub instance  
        var pubnub = pubnubManager.pubnub;  
`
```
show all 41 lines

### Returns[​](#returns)

The `FetchHistory()` operation returns a `PNFetchHistoryResult` that contains the following properties :

Property NameTypeDescriptionMessages`Dictionary<string, List<PNHistoryItemResult>>`List of messages.MoreMoreInfoPagination information.

The `Messages` has the following properties:

Property NameTypeDescription →  Channel NamestringName of the channel for which `FetchHistory()` has been executed. →  →  Timetokenlong`Timetoken` associated with the message. →  →  EntryobjectPayload of the message. →  →  MetaobjectMetadata associated with the message. →  →  Uuidstring`UUID` associated with the message. →  →  MessageTypestring`MessageType` associated with the message. →  →  CustomMessageTypestringThe custom message type associated with the message. →  →  ActionsobjectMessage Actions associated with the message.

The `More` has following properties:

Property NameTypeDescription →  →  StartlongTimetoken denoting the start of the requested range. →  →  EndlongTimetoken denoting the end of the requested range. →  →  LimitintNumber of messages returned in response.

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
                "MessageType":null,  
                "Actions":null  
            }]  
        },  
    "More":null  
}  
`
```

### Other Examples[​](#other-examples)

#### Retrieve the last 25 messages on a channel synchronously[​](#retrieve-the-last-25-messages-on-a-channel-synchronously)

```
`pubnub.FetchHistory()  
    .Channels(new string[] { "my_channel" })  
    .IncludeMeta(true)  
    .MaximumPerChannel(25)  
    .Execute(new PNFetchHistoryResultExt((result, status) =>  
    {  
  
    }));  
`
```

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Unity SDK.

```
`pubnub.DeleteMessages()  
    .Channel(string)  
    .Start(long)  
    .End(long)  
    .QueryParam(Dictionarystring,object>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies `channel` messages to be deleted from history.`Start`Type: longTimetoken delimiting the `Start` of time slice (inclusive) to delete messages from.`End`Type: long`Timetoken` delimiting the End of time slice (exclusive) to delete messages from.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallback`PNCallback` of type `PNDeleteMessageResult`.`Execute` *Type: `System.Action``System.Action` of type `PNDeleteMessageResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNDeleteMessageResult>>`.

### Basic Usage[​](#basic-usage-1)

```
`PNResultPNDeleteMessageResult> delMsgResponse = await pubnub.DeleteMessages()  
    .Channel("history_channel")  
    .Start(15088506076921021)  
    .End(15088532035597390)  
    .ExecuteAsync();  
  
PNDeleteMessageResult delMsgResult = delMsgResponse.Result;  
PNStatus status = delMsgResponse.Status;  
  
if (status != null && status.Error)  
{  
    //Check for any error  
    Debug.Log(status.ErrorData.Information);  
}  
else if (delMsgResult != null)  
`
```
show all 19 lines

### Returns[​](#returns-1)

The `DeleteMessages()` operation returns a `PNResult<PNDeleteMessageResult>` which returns empty `PNDeleteMessageResult` object.

### Other Examples[​](#other-examples-1)

#### Delete messages sent in a particular timeframe[​](#delete-messages-sent-in-a-particular-timeframe)

```
`pubnub.DeleteMessages()  
    .Channel("history_channel")  
    .Start(15088506076921021)  
    .End(15088532035597390)  
    .Execute(new PNDeleteMessageResultExt(  
        (result, status) => {  
            if (status != null && status.Error) {  
                //Check for any error  
                Debug.Log(status.ErrorData.Information);  
            }  
            else if (result != null) {  
                //Expect empty object  
                Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(result));  
            }  
        }  
`
```
show all 16 lines

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`PNResultPNDeleteMessageResult> delMsgResponse = await pubnub.DeleteMessages()  
    .Channel("history_channel")  
    .Start(15526611838554309)  
    .End(15526611838554310)  
    .ExecuteAsync();  
  
PNDeleteMessageResult delMsgResult = delMsgResponse.Result;  
PNStatus status = delMsgResponse.Status;  
  
if (status != null && status.Error)  
{  
    //Check for any error  
    Debug.Log(status.ErrorData.Information);  
}  
else if (delMsgResult != null)  
`
```
show all 19 lines

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `ChannelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the Unity SDK:

```
`pubnub.MessageCounts()  
    .Channels(string[])  
    .ChannelsTimetoken(long[])  
    .QueryParam(Dictionarystring, object>)  
`
```

*  requiredParameterDescription`Channels` *Type: string[]The `channels` to fetch the message count`ChannelsTimetoken` *Type: long[]Array of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.`QueryParam`Type: Dictionary`<string, object>`Dictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Async`Type: PNCallbackPNCallback of type `PNMessageCountResult`.`Execute` *Type: `System.Action``System.Action` of type `PNMessageCountResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNMessageCountResult>>`.

### Basic Usage[​](#basic-usage-2)

```
`PNResultPNMessageCountResult> msgCountResponse = await pubnub.MessageCounts()  
    .Channels(new string[] { "message_count_channel" })  
    .ChannelsTimetoken(new long[] { 15088506076921021 })  
    .ExecuteAsync();  
  
PNMessageCountResult msgCountResult = msgCountResponse.Result;  
PNStatus status = msgCountResponse.Status;  
  
if (status != null && status.Error)  
{  
    //Check for any error  
    Debug.Log(status.ErrorData.Information);  
}  
else  
{  
`
```
show all 17 lines

### Returns[​](#returns-2)

The operation returns a `PNResult<PNMessageCountResult>` which contains the following operations:

Property NameTypeDescription`Result`PNMessageCountResultReturns a `PNMessageCountResult` object.`Status`PNStatusReturns a `PNStatus` object

`PNMessageCountResult` contains the following properties:

Property NameTypeDescription`Channels``Dictionary<string, long>`Collection of `channels` along with the messages count. `channels` without messages have a count of 0. `channels` with 10,000 messages or more have a count of 10000.

### Other Examples[​](#other-examples-2)

#### Retrieve count of messages for a single channel[​](#retrieve-count-of-messages-for-a-single-channel)

```
`pubnub.MessageCounts()  
    .Channels(new string[] { "message_count_channel" })  
    .ChannelsTimetoken(new long[] { 15088506076921021 })  
    .Execute(new PNMessageCountResultExt(  
    (result, status) => {  
        if (status != null && status.Error)  
        {  
            //Check for any error  
            Debug.Log(status.ErrorData.Information);  
        }  
        else  
        {  
            Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(result));  
        }  
    }));  
`
```

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`PNResultPNMessageCountResult> msgCountResponse = await pubnub.MessageCounts()**    .Channels(new string[] { "message_count_channel", "message_count_channel2" })  
    .ChannelsTimetoken(new long[] { 15088506076921021, 15088506076921131 })  
    .ExecuteAsync();  
  
PNMessageCountResult msgCountResult = msgCountResponse.Result;  
PNStatus status = msgCountResponse.Status;  
  
if (status != null && status.Error)  
{  
    //Check for any error  
    Debug.Log(status.ErrorData.Information);  
}  
else  
{  
`
```
show all 17 linesLast updated on Jun 10, 2025**