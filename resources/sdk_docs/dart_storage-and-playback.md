On this page
# Message Persistence API for Dart SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

## Batch History[​](#batch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from multiple channels. The `includeMessageActions` or `includeActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order. For example, you can:

- Search for messages starting on the newest end of the timeline.

- Search for messages from the oldest end of the timeline.

- Page through results by providing a `start` OR `end` timetoken.

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Retrieve a specific (maximum) number of messages using the `count` parameter.

Batch history returns up to 100 messages on a single channel, or 25 per channel on a maximum of 500 channels. Use the `start` and `end` timestamps to page through the next batch of messages.

##### Start & End parameter usage clarity

If you specify only the `start` parameter (without `end`), you will receive messages that are older than the `start` timetoken.

If you specify only the `end` parameter (without `start`), you will receive messages from that `end` timetoken and newer.

Specify values for both `start` and `end` parameters to retrieve messages between those timetokens (inclusive of the `end` value).

Keep in mind that you will still receive a maximum of 100 messages (or 25, for multiple channels) even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken are necessary to page through the full set of results if more messages meet the timetoken values.

### Method(s)[​](#methods)

To run `fetchMessages()` you can use the following method(s) in the Dart SDK:

```
`pubnub.batch.fetchMessages(  
  SetString> channels,  
  {Keyset? keyset,  
  String? using,  
  int? count,  
  Timetoken? start,  
  Timetoken? end,  
  bool? reverse,  
  bool? includeMeta,  
  bool includeMessageActions = false,  
  bool includeMessageType = true,  
  bool includeCustomMessageType,  
  bool includeUUID = true}  
)   
`
```

*  requiredParameterDescription`channels` *Type: `Set<String>`Default:  
n/aSpecifies `channels` to return history messages from.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`count`Type: `int`Default:  
n/aThe paging object used for pagination. Set `count` to specify the number of historical messages to return per channel.  
If `includeMessageActions` is `false`, then `100` is the default (and maximum) value. Otherwise it's `25`.  
Set `start` to delimit the start of time slice (exclusive) to pull messages from.  
Set `end` to delimit the end of time slice (inclusive) to pull messages from.`start`Type: TimetokenDefault:  
n/a`timetoken` denoting the start of the range requested (return values will be less than `start`).`end`Type: TimetokenDefault:  
n/a`timetoken` denoting the end of the range requested (return values will be greater than or equal to `end`).`reverse`Type: `bool`Default:  
`false`Setting to `true` traverses the time line in reverse, starting with the oldest message first.`includeMeta`Type: `bool`Default:  
`false`Whether to include message metadata within response or not.`includeMessageActions`Type: `bool`Default:  
`false`The flag denoting to retrieve history messages with message actions. If `true`, the method is limited to one channel only.`includeMessageType`Type: `bool`Default:  
`true`The flag denoting to retrieve history messages with message type.`includeCustomMessageType`Type: `bool`Default:  
`false`Indicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieving-messages).`includeUUID`Type: `bool`Default:  
n/aThe flag denoting to include message sender's UUID.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

Retrieve the last 25 messages on a channel:

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create a PubNub instance with the default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Channels to fetch history from  
  SetString> channels = {'my_channel'};  
  
`
```
show all 30 lines

### Returns[​](#returns)

The `fetchMessages()` operation returns a map of channels and a `List<BatchHistoryResultEntry>`:

PropertyDescription`channels`Type: `Map<String, List<BatchHistoryResultEntry>>`Map of channels and their respective lists of `BatchHistoryResultEntry`. See [BatchHistoryResultEntry](#batchhistoryresultentry) for more details.

#### BatchHistoryResultEntry[​](#batchhistoryresultentry)

MethodDescription`message`Type: `dynamic`The message content.`timetoken`Type: `Timetoken``Timetoken` of the message. Always returned by default.`uuid`Type: `String`UUID of the sender.`actions`Type: `Map<String, dynamic>?`If `includeMessageActions` was `true`, this contains message actions. Otherwise, it's `null`.`messageType`Type: `MessageType`Internal type of the message.`customMessageType`Type: `String?`Custom type of the message. `null` if empty.`meta`Type: `Map<String, dynamic>`If `includeMeta` was `true`, this contains message metadata. Otherwise, it's null.`error`Type: `PubNubException?`The exception thrown if message decryption failed for a given message.

### Other Examples[​](#other-examples)

#### Paging History Responses[​](#paging-history-responses)

```
`  var messages = BatchHistoryResultEntry>[];  
  var channel = 'my_channel';  
  var loopResult, start, count;  
  do {  
    loopResult =  
        await pubnub.batch.fetchMessages({channel}, start: start, count: count);  
  
    messages.addAll((loopResult as BatchHistoryResult).channels[channel]!);  
  
    if ((loopResult).more != null) {  
      var more = loopResult.more as MoreHistory;  
      start = Timetoken(BigInt.parse(more.start));  
      count = more.count;  
    }  
  } while (loopResult.more != null);  
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

To `deleteMessages()` you can use the following method(s) in the Dart SDK.

```
`pubnub.delete()   
`
```

*  requiredParameterDescription`channels` *Type: `List<String>`Specifies `channels` to delete messages from.`start`Type: `Long`Timetoken delimiting the `start` of time slice (inclusive) to delete messages from.`end`Type: `Long`Timetoken delimiting the `end` of time slice (exclusive) to delete messages from.

### Basic Usage[​](#basic-usage-1)

```
`await pubnub  
  .channel('channel-name')  
  .messages(  
    from: Timetoken(BigInt.parse('123345')),  
    to: Timetoken(BigInt.parse('123538293')),  
  )  
  .delete();  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and timetoken `+/- 1` in the `Start` parameter. For example, if `15526611838554310` is the publish timetoken, pass `15526611838554309` in Start and `15526611838554310` in End parameters respectively as shown in the following code snippet.

```
`await pubnub  
  .channel('channel-name')  
  .messages(  
    from: Timetoken(BigInt.parse('15526611838554309')),  
    to: Timetoken(BigInt.parse('15526611838554310')),  
  )  
  .delete();  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `channelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 7 days.

### Method(s)[​](#methods-2)

To run `messageCounts()` you can use the following method(s) in the Dart SDK:

```
`pubnub.batch.countMessages(  
  dynamic channels,  
  {Keyset? keyset,   
  String? using,   
  Timetoken? timetoken}  
)  
`
```

*  requiredParameterDescription`channels` *Type: `Map<String, Timetoken>` or `Set<String>`Specifies `channels` set. Or Map of channel names and timetoken for message count.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.`timetoken`Type: `Timetoken``timetoken` is required when channels is a `Set` of channel names.

### Basic Usage[​](#basic-usage-2)

```
`var result = await pubnub.batch.countMessages({'my_channel'},  
    timetoken: Timetoken(BigInt.from(13406746780720711)));  
`
```

### Returns[​](#returns-1)

This operation returns a `CountMessagesResult` which contains the following property:

Property NameTypeDescription`channels``Map<String, int>`Channel names with message count.

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function fetches historical messages of a channel.

It's possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `true`.

- Page through results by providing a `start` OR `end` [timetoken](/docs/sdks/dart/api-reference/misc#time).

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older**  than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

#### Method(s)[​](#methods-3)

To run `history()` you can use the following method(s) in the Dart SDK:

```
`pubnub.channel(String).history(  
  {ChannelHistoryOrder order = ChannelHistoryOrder.descending,  
  int chunkSize = 100}  
)  
  
// OR  
  
pubnub.channel(String).messages()  
`
```

*  requiredParameterDescription`order` *Type: `ChannelHistoryOrder`Default:  
`ChannelHistoryOrder.descending`Order of messages based on timetoken. Refer to [Channel History Order](#channel-history-order) for more details.`chunkSize`Type: `int`Default:  
`false`Number of returned messages.

#### Channel History Order[​](#channel-history-order)

ParameterDescription`ascending`Type: const `ChannelHistoryOrder`Ascending order of messages, based on timetokens.`descending`Type: const `ChannelHistoryOrder`Descending order of messages, based on timetokens.`values`Type: const `List<ChannelHistoryOrder>`A constant list of the values in this enum, in order of their declaration.

#### Basic Usage[​](#basic-usage-3)

Retrieve the last 100 messages on a channel:

```
`var history = pubnub.channel('my_channel').history(chunkSize: 100);  
`
```

#### Returns[​](#returns-2)

The `history()` operation returns a `PaginatedChannelHistory` which contains the following properties:

PropertyDescription`chunkSize`Type: `int`Maximum number of fetched messages when calling `more()`.`endTimetoken`Type: `Timetoken`Upper boundary of fetched messages timetokens.`hasMore`Type: `bool`Returns true if there are more messages to be fetched. Keep in mind, that before the first `more` call, it will always be `true`.`messages`Type: `List<BaseMessage>`Readonly list of messages. It will be empty before first `more` call. Refer to the method description below for more details on the `more` call.`order`Type: `ChannelHistoryOrder`Order of messages based on timetoken. Refer to [Channel History Order](#channel-history-order) for more details.`startTimetoken`Type: `Long`Lower boundary of fetched messages timetokens.

`PaginatedChannelHistory` has the following methods:

MethodReturnsDescription`more``Future<FetchHistoryResult>`Fetches more messages and stores them in the `messages` property of `PaginatedChannelHistory`.`reset``void`Resets the history to the beginning.

#### Base Message[​](#base-message)

ParameterDescription`content`Type: `dynamic`The message content.`message`Type: `dynamic`Alias for `content`.`originalMessage`Type: `dynamic`Original JSON message received from the server.`publishedAt`Type: `Timetoken`Timetoken at which the server accepted the message.`timetoken`Type: `Timetoken`Alias for `timetoken`.

#### Other Examples[​](#other-examples-2)

##### Use `history()` to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`var history = pubnub  
    .channel('my_channel')  
    .history(order: ChannelHistoryOrder.ascending, chunkSize: 3)  
`
```

###### Response[​](#response)

```
`{  
    "messages":[  
        {  
            "Timetoken": 0,  
            "message": "Pub1"  
        },  
        {  
            "Timetoken": 0,  
            "message": "Pub2"  
        },  
        {  
            "Timetoken": 0,  
            "message": "Pub3"  
        }  
    ],  
`
```
show all 18 lines

##### History Paging Example[​](#history-paging-example)

```
`var history = pubnub.channel('asdf').history(chunkSize: 100, order: ChannelHistoryOrder.descending);**// To fetch next page:  
await history.more();  
// To access messages:  
print(history.messages);  
`
```
Last updated on Jun 10, 2025**