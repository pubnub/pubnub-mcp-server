On this page
# Message Persistence API for Go SDK

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

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/go/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the Go SDK:

```
`pn.Fetch().  
    Channels(channels).  
    Count(count).  
    Start(start).  
    End(end).  
    IncludeMeta(bool).  
    IncludeMessageType(bool).  
    IncludeUUID(bool).  
    IncludeMessageActions(bool).  
    IncludeCustomMessageType(bool).  
    Reverse(reverse).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels` *Type: stringDefault:  
n/aSpecifies `channels`to return history messages. Maximum of 500 channels are allowed.`Count`Type: intDefault:  
`100` or `25`Specifies the number of historical messages to return. Default and maximum value is 100 for a single channel, 25 for multiple channels, and 25 when `IncludeMessageActions` is `true`.`Start`Type: int64Default:  
n/aTimetoken delimiting the `start` of time slice (exclusive) to pull messages from.`End`Type: int64Default:  
n/aTimetoken delimiting the `end` of time slice (inclusive) to pull messages from.`IncludeMeta`Type: boolDefault:  
`false`Whether meta (passed when Publishing the message) should be included in response or not.`IncludeMessageType`Type: boolDefault:  
`true`Pass `true` to receive the message type with each history message.`IncludeUUID`Type: boolDefault:  
`true`Pass `true` to receive the publisher `uuid` with each history message.`IncludeMessageActions`Type: boolDefault:  
`false`Whether MessageActions should be included in response or not. If `true`, the method is limited to one channel and 25 messages only.`IncludeCustomMessageType`Type: boolDefault:  
n/aIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieving-messages).`Reverse`Type: boolDefault:  
`false`Setting to `true` will traverse the time line in `reverse` starting with the oldest message first.`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last messages on a channel:

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
`
```
show all 43 lines

### Returns[​](#returns)

MethodDescription`Message`Type: interface`Message` from History.`Timetoken`Type: string`{{Timetoken}}` of the message.`Meta`Type: interfaceThe meta data (if sent, when publishing the message)`MessageType`Type: numberReturns `4` for file messages.`CustomMessageType`Type: stringThe custom message type.`Uuid`Type: stringPublisher `uuid` of the message.`MessageActions`Type: map[string]PNHistoryMessageActionsTypeMapThe message actions associated with the message. Details of type `PNHistoryMessageActionsTypeMap` are [here](#pnhistorymessageactionstypemap)

#### PNHistoryMessageActionsTypeMap[​](#pnhistorymessageactionstypemap)

Property NameTypeDescription`ActionsTypeValues`map[string][]PNHistoryMessageActionTypeValDetails of type `PNHistoryMessageActionTypeVal` are [here](#pnhistorymessageactiontypeval)

#### PNHistoryMessageActionTypeVal[​](#pnhistorymessageactiontypeval)

Property NameTypeDescription`UUID`stringThe UUID of the publisher.`ActionTimetoken`stringThe publish timetoken of the action.

### Response[​](#response)

Method`Error`Type: error`Category`Type: StatusCategory`Operation`Type: OperationType`StatusCode`Type: int`TLSEnabled`Type: bool`UUID`Type: string`AuthKey`Type: string`Origin`Type: string`OriginalResponse`Type: string`Request`Type: string`AffectedChannels`Type: []string`AffectedChannelGroups`Type: []string

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Go SDK.

```
`pn.DeleteMessages().  
    Channel(channel).  
    Start(start).  
    End(end).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies `channels` to delete messages from.`Start`Type: int64Timetoken delimiting the `start` of time slice (inclusive) to delete messages from.`End`Type: int64Timetoken delimiting the `end` of time slice (exclusive) to delete messages from.`QueryParam`Type: map[string]stringQueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-1)

```
`res, status, err := pn.DeleteMessages().  
        Channel("ch").  
        Start(int64(15343325214676133)).  
        End(int64(15343325004275466)).  
        Execute()  
`
```

### Response[​](#response-1)

Method`Error`Type: error`Category`Type: StatusCategory`Operation`Type: OperationType`StatusCode`Type: int`TLSEnabled`Type: bool`UUID`Type: string`AuthKey`Type: string`Origin`Type: string`OriginalResponse`Type: string`Request`Type: string`AffectedChannels`Type: []string`AffectedChannelGroups`Type: []string

### Other Examples[​](#other-examples)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`res, status, err := pn.DeleteMessages().  
        Channel("ch").  
        Start(int64(15526611838554309)).  
        End(int64(15526611838554310)).  
        Execute()  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `ChannelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the Go SDK:

```
`pn.MessageCounts().  
    Channels(channels).  
    ChannelsTimetoken(channelsTimetoken).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channels` *Type: []stringDefault:  
n/aThe `channels` to fetch the message count`ChannelsTimetoken` *Type: []int64Default:  
`nil`Array of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

### Basic Usage[​](#basic-usage-2)

```
`res, status, err := pn.MessageCounts().  
        Channels([]string{"ch1", "ch2"}).  
        ChannelsTimetoken([]int64{1551795013294}).  
        Execute()  
`
```

### Returns[​](#returns-1)

The `MessageCounts()` operation returns a `MessageCountsResponse` object which contains the following operations:

MethodDescription`Channels`Type: map[string]intA map of `Channels` with message count. `Channels` without messages have a count of 0. `Channels` with 10,000 messages or more have a count of 10000.

### Status Response[​](#status-response)

Method`Error`Type: error`Category`Type: StatusCategory`Operation`Type: OperationType`StatusCode`Type: int`TLSEnabled`Type: bool`UUID`Type: string`AuthKey`Type: string`Origin`Type: string`OriginalResponse`Type: string`Request`Type: string`AffectedChannels`Type: []string`AffectedChannelGroups`Type: []string

### Other Examples[​](#other-examples-1)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`pn.MessageCounts().  
        Channels([]string{ch1, ch2}).  
        ChannelsTimetoken([]int64{1551795013294,155179501329433}).  
        Execute()  
`
```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Alternative method

This method is deprecated. Use [fetch history](#fetch-history) instead.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `Reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `Reverse` to `true`.

- Page through results by providing a `Start` OR `End` timetoken.

- Retrieve a *slice* of the time line by providing both a `Start` AND `End` timetoken.

- Limit the number of messages to a specific quantity using the `Count` parameter.

##### Start & End parameter usage clarity

If only the `Start` parameter is specified (without `End`), you will receive messages that are **older** than and up to that `Start` timetoken value. If only the `End` parameter is specified (without `Start`) you will receive messages that match that `End` timetoken value and **newer**. Specifying values for both `Start` *and* `End` parameters will return messages between those timetoken values (inclusive on the `End` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `Start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-3)

To run `History` you can use the following method(s) in the Go SDK:

```
`pn.History().  
    Channel(string).  
    Reverse(bool).  
    IncludeTimetoken(bool).  
    IncludeMeta(bool).  
    Start(int64).  
    End(int64).  
    Count(int).  
    QueryParam(queryParam).  
    Execute()  
`
```

*  requiredParameterDescription`Channel`Type: stringDefault:  
n/aSpecifies `channel` to return history messages from.`Reverse`Type: boolDefault:  
`false`Setting to true will traverse the time line in reverse starting with the oldest message first.`IncludeTimetoken`Type: boolDefault:  
`false`Whether event dates timetokens should be included in response or not.`IncludeMeta`Type: boolDefault:  
`false`Whether meta (passed when Publishing the message) should be included in response or not.`Start`Type: int64Default:  
n/aTimetoken delimiting the start of time slice (exclusive) to pull messages from.`End`Type: int64Default:  
n/aTimetoken delimiting the end of time slice (inclusive) to pull messages from.`Count`Type: intDefault:  
100Specifies the number of historical messages to return.`QueryParam`Type: map[string]stringDefault:  
`nil`QueryParam accepts a map, the keys and values of the map are passed as the query string parameters of the URL called by the API.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `Reverse`. The `Reverse` direction matters when you have more than 100 (or `Count`, if it's set) messages in the time interval, in which case `Reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-3)

Retrieve the last 100 messages on a channel:

```
`res, status, err := pn.History().  
    Channel("history_channel"). // where to fetch history from  
    Count(). // how many items to fetch  
    Execute()  
  
fmt.Println(res, status, err)  
`
```

### Response[​](#response-2)

The `History()` operation returns a `PNHistoryResult` which contains the following operations:

MethodDescription`Messages`Type: []HistoryResponseItemarray of messages of type `PNHistoryItemResult`. See [PNHistoryItemResult](#pnhistoryitemresult)  for more details.`StartTimetoken`Type: int64Start `timetoken`.`EndTimetoken`Type: int64End `timetoken`.

#### PNHistoryItemResult[​](#pnhistoryitemresult)

MethodDescription`Timetoken`Type: int64`Timetoken` of the message.`Message`Type: interfaceThe Message.`Meta`Type: interfaceThe meta data (if sent, when publishing the message).

### Other Examples[​](#other-examples-2)

#### Use History() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`res, status, err := pn.History().  
    Channel("my-ch"). // where to fetch history from  
    Count(3). // how many items to fetch  
    Reverse(true). // should go in reverse?  
    Execute()  
`
```

##### Response[​](#response-3)

```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry) // custom JSON structure for message  
}  
`
```

#### Use History() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`res, status, err := pn.History().  
    Channel("my-ch"). // where to fetch history from  
    Start(int64(13847168620721752)). // first timestamp  
    Reverse(true). // should go in reverse?  
    Execute()  
`
```

##### Response[​](#response-4)

```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry) // custom JSON structure for message  
}  
`
```

#### Use History() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`res, status, err := pn.History().  
    Channel("my-ch"). // where to fetch history from  
    Count(100).  
    Start(int64(-1)). // first timestamp  
    End(int64(13847168819178600)). // last timestamp  
    Reverse(true). // should go in reverse?  
    Execute()  
`
```

##### Response[​](#response-5)

```
`for _, v := range res.Messages {  
    fmt.Println(v.Entry) // custom JSON structure for message  
}  
`
```

#### History Paging Example[​](#history-paging-example)

```
`func getAllMessages(startTT int64) {  
    res, _, _ := pn.History().  
        Channel("history_channel").  
        Count(2).  
        Execute()  
  
    msgs := res.Messages  
    start := res.StartTimetoken  
    end := res.EndTimetoken  
  
    if len(msgs) > 0 {  
        fmt.Println(len(msgs))  
        fmt.Println("start " + strconv.Itoa(int(start)))  
        fmt.Println("end " + strconv.Itoa(int(end)))  
    }  
`
```
show all 22 lines

#### Include timetoken in history response[​](#include-timetoken-in-history-response)

```
`res, status, status := pn.History().**    Channel("history_channel").  
    Count(100).  
    IncludeTimetoken(true).  
    Execute()  
  
fmt.Println(res, status, err)  
`
```
Last updated on Jun 10, 2025**