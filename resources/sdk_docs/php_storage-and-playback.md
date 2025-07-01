On this page
# Message Persistence API for PHP SDK

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

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/php/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the PHP SDK:

```
`$pubnub.fetchMessages()  
    ->channels(string|Arraystring>)  
    ->maximumPerChannel(Int)  
    ->start(string)  
    ->end(string)  
    ->includeMessageActions(Boolean)  
    ->includeMeta(Boolean)  
    ->includeMessageType(Boolean)  
    ->includeCustomMessageType(Boolean)  
    ->includeUuid(Boolean)  
`
```

*  requiredParameterDescription`channels` *Type: string or `Array<string>`Default:  
n/aSpecifies the channels for which to return history. Maximum of 500 channels are allowed.`maximumPerChannel`Type: IntDefault:  
`25` or `100`Specifies the number of historical messages to return. If `includeMessageActions` is `True`, method is limited to single channel and 25 is the default (and maximum) value; otherwise, default and maximum is 100 for a single channel, or 25 for multiple channels.`start`Type: stringDefault:  
n/aTimetoken delimiting the *exclusive* start of the time slice from which to pull messages.`end`Type: stringDefault:  
n/aTimetoken delimiting the *inclusive* end of the time slice from which to pull messages.`includeMessageActions`Type: BooleanDefault:  
`False`Set to `True` to retrieve history messages with their associated message actions. If you include message actions, the Messages()` method is limited to one channel only.`includeMeta`Type: BooleanDefault:  
`False`Whether to include message metadata within response or not.`includeMessageType`Type: BooleanDefault:  
n/aIndicates whether to retrieve messages with PubNub message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeCustomMessageType`Type: BooleanDefault:  
n/aIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`includeUuid`Type: BooleanDefault:  
n/aWhether to include user ID of the sender.

### Basic Usage[​](#basic-usage)

Retrieve the last message on a channel:

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
use PubNub\Exceptions\PubNubException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setPublishKey("demo");  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setUserId("fetch-messages-demo-user");  
`
```
show all 110 lines

### Returns[​](#returns)

The `fetchMessages()` operation returns an `PNFetchMessagesResult` which contains the following fields:

#### PNFetchMessagesResult[​](#pnfetchmessagesresult)

MethodDescription`channels`Type: ArrayArray of [`PNFetchMessageItem`](#pnfetchmessageitem)`startTimetoken`Type: IntStart timetoken.`endTimetoken`Type: IntEnd timetoken.

#### PNFetchMessageItem[​](#pnfetchmessageitem)

MethodDescription`message`Type: stringThe message`meta`Type: AnyMeta value`messageType`Type: AnyType of the message`customMessageType`Type: AnyCustom type of the message`uuid`Type: stringUUID of the sender`timetoken`Type: IntTimetoken of the message`actions`Type: ListA 3-dimensional List of message actions, grouped by action type and value

## History[​](#history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `true`.

- Page through results by providing a `start` OR `end` [timetoken](/docs/sdks/php/api-reference/misc#time).

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older** than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-1)

To run `History` you can use the following method(s) in the PHP SDK:

```
`$pubnub->history()  
    ->channel(String)  
    ->reverse(bool)  
    ->includeTimetoken(bool)  
    ->start(integer)  
    ->end(integer)  
    ->count(integer)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aSpecifies `channel` to return history messages from.`reverse`Type: BooleanDefault:  
`false`Setting to `true` will traverse the time line in reverse starting with the oldest message first.`includeTimetoken`Type: BooleanDefault:  
`false`Whether event dates timetokens should be included in response or not.`start`Type: IntegerDefault:  
n/aTimetoken delimiting the start of time slice (exclusive) to pull messages from.`end`Type: IntegerDefault:  
n/aTimetoken delimiting the end of time slice (inclusive) to pull messages from.`count`Type: IntegerDefault:  
n/aSpecifies the number of historical messages to return.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `count`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-1)

Retrieve the last 100 messages on a channel:

```
`$result = $pubnub->history()  
              ->channel("history_channel")  
              ->count(100)  
              ->sync();  
`
```

### Response[​](#response)

The `history()` operation returns a `PNHistoryResult` which contains the following operations:

MethodDescription`getMessages()`Type: Arrayarray of messages of type PNHistoryItemResult. See [PNHistoryItemResult](#pnhistoryitemresult)  for more details.`getStartTimetoken()`Type: IntegerStart timetoken.`getEndTimetoken()`Type: IntegerEnd timetoken.

#### PNHistoryItemResult[​](#pnhistoryitemresult)

MethodDescription`getTimetoken()`Type: Integer`Timetoken` of the message.`getEntry()`Type: ObjectMessage.

### Other Examples[​](#other-examples)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`$pubnub->history()  
    ->channel("my_channel")  
    ->count(3)  
    ->reverse(true)  
    ->sync();  
`
```

##### Response[​](#response-1)

```
`PubNub\Models\Consumer\History\PNHistoryResult Object(  
    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
                [a] => 11  
                [b] => 22  
            )  
            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
        )  
        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
                [a] => 33  
                [b] => 44  
            )  
`
```
show all 31 lines

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`$pubnub->history()  
    ->channel("my_channel")  
    ->start(13847168620721752)  
    ->reverse(true)  
    ->sync();  
`
```

##### Response[​](#response-2)

```
`PubNub\Models\Consumer\History\PNHistoryResult Object(  
    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array  
                (  
                    [a] => 11  
                    [b] => 22  
                )  
  
            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
        )  
        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
                [a] => 33  
`
```
show all 36 lines

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`$pubnub->history()  
    ->channel("my_channel")  
    ->count(100)  
    ->start(-1)  
    ->end(13847168819178600)  
    ->reverse(true)  
    ->sync();  
`
```

##### Response[​](#response-3)

```
`PubNub\Models\Consumer\History\PNHistoryResult Object(  
    [messages:PubNub\Models\Consumer\History\PNHistoryResult:private] => Array(  
        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
                [a] => 11  
                [b] => 22  
            )  
  
            [crypto:PubNub\Models\Consumer\History\PNHistoryItemResult:private] =>  
            [timetoken:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => 1111  
        )  
        [1] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(  
            [entry:PubNub\Models\Consumer\History\PNHistoryItemResult:private] => Array(  
                [a] => 33  
                [b] => 44  
`
```
show all 35 lines

#### Include timetoken in history response[​](#include-timetoken-in-history-response)

```
`$pubnub->history()  
    ->channel("my_channel")  
    ->count(100)  
    ->includeTimetoken(true)  
    ->sync();  
`
```

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-2)

To `Delete Messages from History` you can use the following method(s) in the PHP SDK.

```
`$pubnub->deleteMessages()  
    ->channel(String)  
    ->start(integer)  
    ->end(integer)  
    ->sync()  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aSpecifies `channels` to delete messages from.`start`Type: IntegerDefault:  
n/aTimetoken delimiting the `start` of time slice (inclusive) to delete messages from.`end`Type: IntegerDefault:  
n/aTimetoken delimiting the `end` of time slice (exclusive) to delete messages from.

### Basic Usage[​](#basic-usage-2)

```
`$pubnub->deleteMessages()  
    ->channel("ch")  
    ->start(123)  
    ->end(456)  
    ->sync();  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

```
`$pubnub->deleteMessages()  
    ->channel("ch")  
    ->start(15526611838554309)  
    ->end(15526611838554310)  
    ->sync();  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `channelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-3)

You can use the following method(s) in the PHP SDK:

```
`$pubnub->messageCounts()  
    ->channels(array)  
    ->channelsTimetoken(array)  
`
```

*  requiredParameterDescription`channels` *Type: ArrayDefault:  
n/aThe `channels` to fetch the message count`channelsTimetoken` *Type: ArrayDefault:  
n/aArray of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of `timetokens` must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.

### Basic Usage[​](#basic-usage-3)

```
`$response = $pubnub->messageCounts()  
    ->channels(["mychannel"])  
    ->channelsTimetoken(["15513576173381797"])  
    ->sync();  
  
print_r($response->getChannels());  
`
```

### Returns[​](#returns-1)

The operation returns a `PNMessageCountsResult` which contains the following operations

MethodDescription`getChannels()`Type: ArrayAn associative array with channel name as key and messages count as value. `Channels` without messages have a count of 0. `Channels` with 10,000 messages or more have a count of 10000.

### Other Examples[​](#other-examples-2)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

```
`$response = $pubnub->messageCounts()**    ->channels(["mychannel", "another_channel"])  
    ->channelsTimetoken(["15513576173381797","15513574291261651"])  
    ->sync();  
  
print_r($response->getChannels());  
`
```
Last updated on Jun 10, 2025**