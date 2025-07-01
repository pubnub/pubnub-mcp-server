On this page
# Message Persistence API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

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

To run `fetchMessages()`, you can use the following method(s) in the Kotlin SDK:

```
`pubnub.fetchMessages(  
    channels: ListString>,  
    page: PNBoundedPage,  
    includeMeta: Boolean,  
    includeMessageAction: Boolean,  
    includeMessageType: Boolean,  
    includeCustomMessageType: Boolean,  
).async { result -> }  
`
```

*  requiredParameterDescription`channels` *Type: `List<String>`Default:  
n/aSpecifies `channels` to return history messages from.`page`Type: `PNBoundedPage`Default:  
n/aThe paging object used for pagination. Set `limit` to specify the number of historical messages to return per channel.  
If `includeMessageActions` is `false`, then `100` is the default (and maximum) value. Otherwise it's `25`.  
Set `start` to delimit the start of time slice (exclusive) to pull messages from.  
Set `end` to delimit the end of time slice (inclusive) to pull messages from.`includeMeta`Type: `Boolean`Default:  
`false`Whether to include message metadata within response or not.`includeMessageActions`Type: `Boolean`Default:  
`false`The flag denoting to retrieve history messages with message actions. If `true`, the method is limited to one channel only.`includeMessageType`Type: `Boolean`Default:  
`true`The flag denoting to retrieve history messages with message type.`includeCustomMessageType`Type: `Boolean`Default:  
`false`Indicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `fetchMessages()` operation returns a map of channels and `List<PNFetchMessagesResult>` and `PNBoundedPage` object.

MethodDescription`channels`Type: `HashMap<String, List<PNFetchMessageItem>>`Map of channels and their respective lists of `PNFetchMessageItem`. See [PNFetchMessageItem](#pnfetchmessageitem) for more details.`page`Type: `PNBoundedPage`If exists indicates that more data is available. It can be passed directly to another call of `fetchMessages` to retrieve this remaining data.

#### PNFetchMessageItem[​](#pnfetchmessageitem)

MethodDescription`message`Type: `JsonElement`Message`timetoken`Type: `Long``Timetoken` of the message. Always returned by default.`meta`Type: `JsonElement?`Metadata of the message. Is `null` if not requested, otherwise an empty string if requested but no associated metadata.`actions`Type: `Map<String, HashMap<String, List<Action>>>?`The message actions associated with the message. Is `null` if not requested. The key of the map is the action type. The value is another map, which key is the actual value of the message action, and the key being a list of actions, ie. a list of UUIDs which have posted such a message action.  See [Action](#action) for more details.`customMessageType`Type: `String`The custom message type.

#### Action[​](#action)

MethodDescription`uuid`Type: `String`The UUID of the publisher.`actionTimetoken`Type: `String`The publish timetoken of the action.

### Other Examples[​](#other-examples)

#### Paging History Responses[​](#paging-history-responses)

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

To `deleteMessages()` you can use the following method(s) in the Kotlin SDK.

```
`pubnub.deleteMessages(  
    channels:P ListString>,  
    start: Long,  
    end: Long  
).async { result -> }  
`
```

*  requiredParameterDescription`channels` *Type: `List<String>`Default:  
n/aSpecifies `channels` to delete messages from.`start`Type: `Long`Default:  
n/aTimetoken delimiting the `start` of time slice (inclusive) to delete messages from.`end`Type: `Long`Default:  
n/aTimetoken delimiting the `end` of time slice (exclusive) to delete messages from.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Other Examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the `publish timetoken` (received from a successful publish) in the `End` parameter and timetoken `+/- 1` in the `Start` parameter. For example, if `15526611838554310` is the publish timetoken, pass `15526611838554309` in Start and `15526611838554310` in End parameters respectively as shown in the following code snippet.

```
`  
`
```

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The `count` returned is the number of messages in history with a `timetoken` value `greater than or equal to` than the passed value in the `channelsTimetoken`parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-2)

To run `messageCounts()`, you can use the following method(s) in the Kotlin SDK:

```
`pubnub.messageCounts(  
    channels: ListString>,  
    channelsTimetoken: ListLong>  
).async { result -> }  
`
```

*  requiredParameterDescription`channels` *Type: `List<String>`Default:  
n/aThe `channels` to fetch the message count.`channelsTimetoken` *Type: `List<Long>`Default:  
n/aList of `timetokens`, in order of the channels list. Specify a single `timetoken` to apply it to all channels. Otherwise, the list of timetokens must be the same length as the list of channels, or the function returns a `PNStatus` with an error flag.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-1)

MethodDescription`channels`Type: `Map<String, Long>`A map with values of Long for each channel. Channels without messages have a count of 0. Channels with 10,000 messages or more have a count of 10000.

### Other Examples[​](#other-examples-2)

```
`  
`
```

## History (deprecated)[​](#history-deprecated)

##### Requires Message Persistence

This method requires that Message Persistence is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function fetches historical messages of a channel.

It is possible to control how messages are returned and in what order, for example you can:

- Search for messages starting on the newest end of the timeline (default behavior - `reverse` = `false`)

- Search for messages from the oldest end of the timeline by setting `reverse` to `true`.

- Page through results by providing a `start` OR `end` [timetoken](/docs/sdks/kotlin/api-reference/misc#time).

- Retrieve a *slice* of the time line by providing both a `start` AND `end` timetoken.

- Limit the number of messages to a specific quantity using the `count` parameter.

##### Start & End parameter usage clarity

If only the `start` parameter is specified (without `end`), you will receive messages that are **older**  than and up to that `start` timetoken value. If only the `end` parameter is specified (without `start`) you will receive messages that match that `end` timetoken value and **newer**. Specifying values for both `start` *and* `end` parameters will return messages between those timetoken values (inclusive on the `end` value). Keep in mind that you will still receive a maximum of 100 messages even if there are more messages that meet the timetoken values. Iterative calls to history adjusting the `start` timetoken is necessary to page through the full set of results if more than 100 messages meet the timetoken values.

### Method(s)[​](#methods-3)

To run `history()`, you can use the following method(s) in the Kotlin SDK:

```
`pubnub.history(  
    channel: String,  
    reverse: Boolean,  
    includeTimetoken: Boolean,  
    includeMeta: Boolean,  
    start: Long,  
    end: Long,  
    count: Int  
).async { result ->  }  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aSpecifies `channel` to return history messages from.`reverse`Type: `Boolean`Default:  
`false`Setting to `true` will traverse the time line in reverse starting with the oldest message first.`includeTimetoken`Type: `Boolean`Default:  
`false`Whether event dates timetokens should be included in response or not.`includeMeta`Type: `Boolean`Default:  
`false`Whether to include message metadata within response or not.`start`Type: `Long`Default:  
n/aTimetoken delimiting the start of time slice (exclusive) to pull messages from.`end`Type: `Long`Default:  
n/aTimetoken delimiting the end of time slice (inclusive) to pull messages from.`count`Type: `Int`Default:  
`100`Specifies the number of historical messages to return.  
Default/Maximum is `100`.

##### tip
Using the `reverse` parameter:
Messages are always returned sorted in ascending time direction from history regardless of `reverse`. The `reverse` direction matters when you have more than 100 (or `count`, if it's set) messages in the time interval, in which case `reverse` determines the end of the time interval from which it should start retrieving the messages.

### Basic Usage[​](#basic-usage-3)

Retrieve the last 100 messages on a channel:

```
`  
`
```

### Returns[​](#returns-2)

The `history()` operation returns a `PNHistoryResult` which contains the following operations:

MethodDescription`messages`Type: `List<PNHistoryItemResult>`List of messages of type `PNHistoryItemResult`. See [PNHistoryItemResult](#pnhistoryitemresult) for more details.`startTimetoken`Type: `Long`Start `timetoken`.`endTimetoken`Type: `Long`End `timetoken`.

#### PNHistoryItemResult[​](#pnhistoryitemresult)

MethodDescription`timetoken`Type: `Long?``Timetoken` of the message. Is `null` if not requested.`entry`Type: `JsonElement`Message`meta`Type: `JsonElement?`Metadata of the message. Is `null` if not requested, otherwise an empty string if requested but no associated metadata.

### Other Examples[​](#other-examples-3)

#### Use `history()` to retrieve the three oldest messages by retrieving from the time line in reverse[​](#use-history-to-retrieve-the-three-oldest-messages-by-retrieving-from-the-time-line-in-reverse)

```
`  
`
```

#### Use `history()` to retrieve messages newer than a given timetoken by paging from oldest message to newest message starting at a single point in time (exclusive)[​](#use-history-to-retrieve-messages-newer-than-a-given-timetoken-by-paging-from-oldest-message-to-newest-message-starting-at-a-single-point-in-time-exclusive)

```
`  
`
```

#### Use `history()` to retrieve messages until a given timetoken by paging from newest message to oldest message until a specific end point in time (inclusive)[​](#use-history-to-retrieve-messages-until-a-given-timetoken-by-paging-from-newest-message-to-oldest-message-until-a-specific-end-point-in-time-inclusive)

```
`  
`
```

#### History Paging Example[​](#history-paging-example)

```
`  
`
```

#### Include `timetoken` in history response[​](#include-timetoken-in-history-response)

```
`**`
```
Last updated on Jun 10, 2025**