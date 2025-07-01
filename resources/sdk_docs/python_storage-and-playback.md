On this page
# Message Persistence API for Python SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

##### Request execution and return values

You can decide whether to perform the Python SDK operations synchronously or asynchronously.

`.sync()` returns an `Envelope` object, which has two fields: `Envelope.result`, whose type differs for each API, and `Envelope.status` of type `PnStatus`.

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` returns `None` and passes the values of `Envelope.result` and `Envelope.status` to a callback you must define beforehand.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `includeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` [timetoken](/docs/sdks/python/api-reference/misc#time)

- if you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer

- if you specify values for both `start` and `end` parameters, you will retrieve messages between those timetokens (inclusive of the `end` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

To run `Fetch History`, you can use the following method(s) in the Python SDK:

```
`pubnub.fetch_messages() \  
    .channels(List) \  
    .maximum_per_channel(Integer) \  
    .start(Integer) \  
    .end(Integer) \  
    .include_message_actions(Boolean) \  
    .include_meta(Boolean)  
    .include_message_type(Boolean) \  
    .include_custom_message_type(Boolean) \  
    .include_uuid(Boolean) \  
`
```

*  requiredParameterDescription`channels` *Type: List`<string>`Default:  
n/aSpecifies the channels for which to return history. Maximum of 500 channels are allowed.`maximum_per_channel`Type: IntegerDefault:  
`25` or `100`Specifies the number of historical messages to return. If `include_message_actions` is `True`, method is limited to single channel and 25 is the default (and maximum) value; otherwise, default and maximum is 100 for a single channel, or 25 for multiple channels.`start`Type: IntegerDefault:  
n/aTimetoken delimiting the *exclusive* start of the time slice from which to pull messages.`end`Type: IntegerDefault:  
n/aTimetoken delimiting the *inclusive* end of the time slice from which to pull messages.`include_message_actions`Type: BooleanDefault:  
`False`Set to `True` to retrieve history messages with their associated message actions. If you include message actions, the `fetch_messages()` method is limited to one channel only.`include_meta`Type: BooleanDefault:  
`False`Whether to include message metadata within response or not.`include_message_type`Type: BooleanDefault:  
n/aIndicates whether to retrieve messages with PubNub message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`include_custom_message_type`Type: BooleanDefault:  
n/aIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).`include_uuid`Type: BooleanDefault:  
n/aWhether to include UUID of the sender

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last message on a channel:

- Builder Pattern
- Named Arguments

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def my_fetch_messages_callback(envelope, status):  
    if status.is_error():  
        print(f"Something went wrong. Error: {status.error_data}")  
        return  
  
    print("Fetch Messages Result:\n")  
    for message in envelope.channels["my_channel"]:  
        print("Message: %s" % message.message)  
        print("Meta: %s" % message.meta)  
        print("Timetoken: %s" % message.timetoken)  
`
```
show all 48 lines
```
`message_envelope = pubnub.fetch_messages(channels=["my_channel"], maximum_per_channel=1, include_message_actions=True,  
    include_meta=True, include_message_type=True, include_custom_message_type=True, include_uuid=True).sync()  
  
if message_envelope.status.is_error():  
    print(f"Something went wrong. Error: {status.error_data}")  
else:  
        print("Fetch Messages Result:\n")  
    for message in message_envelope.result.channels["my_channel"]:  
        print(f"Message: {message.message}")  
        print(f"Meta: {message.meta}")  
        print(f"Timetoken: {message.timetoken}")  
  
        for action_type in message.actions:  
            print(f"Message Action type: {action_type}")  
            for action_value in message.actions[action_type]:  
`
```
show all 20 lines

### Returns[​](#returns)

The `fetch_messages()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNFetchMessagesResult`](#pnfetchmessagesresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNFetchMessagesResult[​](#pnfetchmessagesresult)

MethodDescription`channels`Type: DictionaryDictionary of [`PNFetchMessageItem`](#pnfetchmessageitem)`start_timetoken`Type: IntStart timetoken`end_timetoken`Type: IntEnd timetoken

#### PNFetchMessageItem[​](#pnfetchmessageitem)

MethodDescription`message`Type: StringThe message`meta`Type: AnyMeta value`message_type`Type: AnyType of the message`custom_message_type`Type: AnyCustom type of the message`uuid`Type: StringUUID of the sender`timetoken`Type: IntTimetoken of the message`actions`Type: ListA 3-dimensional List of message actions, grouped by action type and value

## Delete Messages from History[​](#delete-messages-from-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Removes the messages from the history of a specific channel.

##### Required setting

There is a setting to accept delete from history requests for a key, which you must enable by checking the Enable `Delete-From-History` checkbox in the key settings for your key in the Admin Portal.

Requires Initialization with secret key.

### Method(s)[​](#methods-1)

To `Delete Messages from History` you can use the following method(s) in the Python SDK.

```
`pubnub.delete_messages() \  
    .channel(String) \  
    .start(Integer) \  
    .end(Integer) \  
    .sync()  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aSpecifies `channels` to delete messages from.`start`Type: IntegerDefault:  
n/aTimetoken delimiting the `start` of time slice (inclusive) to delete messages from.`end`Type: IntegerDefault:  
n/aTimetoken delimiting the `end` of time slice (exclusive) to delete messages from.

### Basic Usage[​](#basic-usage-1)

- Builder Pattern
- Named Arguments

```
`envelope = PubNub(pnconf).delete_messages() \  
    .channel("my-ch") \  
    .start(123) \  
    .end(456) \  
    .sync()  
`
```

```
`envelope = pubnub.delete_messages(channels=["my_channel"], start=123, end=456).sync()  
`
```

### Returns[​](#returns-1)

The `delete_messages()` operation doesn't have a return value.

### Other Examples[​](#other-examples)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and `timetoken +/- 1` in the `Start` parameter. For example, if `15526611838554310` is the `publish timetoken`, pass `15526611838554309` in `Start` and `15526611838554310` in `End` parameters respectively as shown in the following code snippet.

- Builder Pattern
- Named Arguments

```
`envelope = PubNub(pnconf).delete_messages() \  
    .channel("my-ch") \  
    .start(15526611838554309) \  
    .end(15526611838554310) \  
    .sync()  
`
```

```
`envelope = pubnub.delete_messages(channels="my-ch", start=15526611838554309, end=15526611838554310).sync()  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value greater than or equal to the passed value in the `channel_timetokens` parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

You can use the following method(s) in the Python SDK:

```
`pn.message_counts() \  
    .channel(String) \  
    .channel_timetokens(List)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe `channels` to fetch the message count. Single channel or multiple channels, separated by comma are accepted.`channel_timetokens` *Type: ListDefault:  
`null`A list of timetokens ordered the same way as channels. Timetokens can be str or int type.

### Basic Usage[​](#basic-usage-2)

- Builder Pattern
- Named Arguments

```
`envelope = pn.message_counts() \  
    .channel('unique_1') \  
    .channel_timetokens([15510391957007182]) \  
    .sync() \  
print(envelope.result.channels['unique_1'])  
`
```

```
`envelope = pubnub.message_counts(channels="my-ch", channel_timetokens=[15510391957007182]).sync()  
`
```

### Returns[​](#returns-2)

The `message_counts()` operation returns an `Envelope` which contains the following fields:

FieldTypeDescriptionresult[`PNMessageCountResult`](#pnmessagecountresult)A detailed object containing the result of the operation.status`PNStatus`A status object with additional information.

#### PNMessageCountResult[​](#pnmessagecountresult)

FieldTypeDescription`channels`DictionaryA dictionary with the number of missed messages for each channel.

### Other Examples[​](#other-examples-1)

#### Retrieve count of messages using different timetokens for each channel[​](#retrieve-count-of-messages-using-different-timetokens-for-each-channel)

- Builder Pattern
- Named Arguments

```
`envelope = pn.message_counts() \  
    .channel('unique_1,unique_100') \  
    .channel_timetokens([15510391957007182, 15510391957007184]) \  
    .sync()  
print(envelope.result.channels)  
`
```

```
`envelope = pubnub.message_counts(channels="unique_1,unique_100",  
    channel_timetokens=[15510391957007182, 15510391957007184]).sync()  
`
```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

##### Alternative method

This method is deprecated. Use [fetch history](#fetch-history) instead.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `False`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `True`.

- Page through results by providing a `start` OR `end` timetoken.

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older** than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`), you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-3)

To run `History` you can use the following method(s) in the Python SDK:

```
`pubnub.history() \  
    .channel(String) \  
    .include_meta(True) \  
    .reverse(Boolean) \  
    .include_timetoken(Boolean) \  
    .start(Integer) \  
    .end(Integer) \  
    .count(Integer)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aSpecifies `channel` to return history messages from.`include_meta`Type: BooleanDefault:  
`False`Specifies whether or not the message's meta information should be returned.`reverse`Type: BooleanDefault:  
`False`Setting to `True` will traverse the time line in reverse starting with the oldest message first.`include_timetoken`Type: BooleanDefault:  
`False`Whether event dates timetokens should be included in response or not.`start`Type: IntegerDefault:  
n/aTimetoken delimiting the start of time slice (exclusive) to pull messages from.`end`Type: IntegerDefault:  
n/aTimetoken delimiting the end of time slice (inclusive) to pull messages from.`count`Type: IntegerDefault:  
n/aSpecifies the number of historical messages to return.

##### tip
Using the `reverse` parameter
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `count`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-3)

Retrieve the last 100 messages on a channel:

```
`envelope = pubnub.history() \  
    .channel("history_channel") \  
    .count(100) \  
    .sync()  
`
```

### Returns[​](#returns-3)

The `history()` operation returns a `PNHistoryResult` which contains the following fields:

MethodDescription`messages`Type: ListList of messages of type `PNHistoryItemResult`. See [PNHistoryItemResult](#pnhistoryitemresult)  for more details.`start_timetoken`Type: IntegerStart `timetoken`.`end_timetoken`Type: IntegerEnd `timetoken`.

#### PNHistoryItemResult[​](#pnhistoryitemresult)

MethodDescription`timetoken`Type: Integer`Timetoken` of the message.`entry`Type: ObjectMessage.

### Other Examples[​](#other-examples-2)

#### Use history() to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`envelope = pubnub.history() \  
    .channel("my_channel") \  
    .count(3) \  
    .reverse(True) \  
    .sync()  
`
```

##### Response[​](#response)

```
`{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub1',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub2',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub2',  
        timetoken: None  
`
```
show all 17 lines

#### Use history() to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`pubnub.history()\  
    .channel("my_channel")\  
    .start(13847168620721752)\  
    .reverse(True)\  
    .sync()  
`
```

##### Response[​](#response-1)

```
`{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub4',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub5',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub6',  
        timetoken: None  
`
```
show all 17 lines

#### Use history() to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`pubnub.history()\  
    .channel("my_channel")\  
    .count(100)\  
    .start(-1)\  
    .end(13847168819178600)\  
    .reverse(True)\  
    .sync()  
`
```

##### Response[​](#response-2)

```
`{  
    end_timetoken: 13406746729185766,  
    start_timetoken: 13406746780720711,  
    messages: [{  
        crypto: None,  
        entry: 'Pub4',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub5',  
        timetoken: None  
    },{  
        crypto: None,  
        entry: 'Pub6',  
        timetoken: None  
`
```
show all 17 lines

#### History Paging Example[​](#history-paging-example)

##### Usage

You can call the method by passing 0 or a valid **timetoken** as the argument.

```
`def get_all_messages(start_tt):  
    def history_callback(result, status):  
        msgs = result.messages  
        start = result.start_timetoken  
        end = result.end_timetoken  
        count = len(msgs)  
  
        if count > 0:  
            print("%d" % count)  
            print("start %d" % start)  
            print("end %d" % end)  
  
        if count == 100:  
            get_all_messages(start)  
  
`
```
show all 22 lines

#### Include timetoken in history response[​](#include-timetoken-in-history-response)

```
`pubnub.history()\**    .channel("my_channel")\  
    .count(100)\  
    .include_timetoken()  
    .sync()  
`
```
Last updated on Jun 10, 2025**