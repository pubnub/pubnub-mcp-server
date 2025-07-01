On this page
# Message Actions API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

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

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Kotlin SDK:

```
`pubnub.addMessageAction(  
    channel: String,  
    messageAction: PNMessageAction  
).async { result -> }  
`
```

*  requiredParameterDescription`channel` *Type: `String`Specifies channel name to `publish` message actions to.`messageAction` *Type: `PNMessageAction`The message action object containing the message action's type, value and the publish timetoken of the original message. See [PNMessageAction](#pnmessageaction) for more details.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `addMessageAction()` operation returns a `PNAddMessageActionResult` which contains the following operations:

MethodDescription`type`Type: `String`Message action's type.`value`Type: `String`Message action's value.`uuid`Type: `String`Publisher of the message action.`actionTimetoken`Type: `String`Timestamp when the message action was created.`messageTimetoken`Type: `Long`Timestamp when the actual message was created the message action belongs to.

#### PNMessageAction[​](#pnmessageaction)

MethodDescription`type`Type: `String`Message action's type.`value`Type: `String`Message action's value.`messageTimetoken`Type: `Long`Timestamp when the actual message was created the message action belongs to.

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the Kotlin SDK:

```
`pubnub.removeMessageAction(  
    channel: String,  
    messageTimetoken: Long,  
    actionTimetoken: Long  
).async { result -> }  
`
```

*  requiredParameterDescription`channel` *Type: `String`Specifies channel name to remove message actions from.`messageTimetoken` *Type: `Long`Publish timetoken of the original message.`actionTimetoken` *Type: `Long`Publish timetoken of the message action to be removed.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `removeMessageAction()` operation returns a no actionable data.

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Kotlin SDK:

```
`pubnub.getMessageActions(  
    channel: String,  
    page: PNBoundedPage  
)  
`
```

*  requiredParameterDescription`channel` *Type: `String`The `channel` name.`page`Type: `PNBoundedPage`The paging object used for pagination. Set `limit` to specify the number of actions to return in response.   
Default/Maximum is `100`.   
 `start` and `end` denotes the range boundaries. Return values will be less than `start` and greater or equal to `end`.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The `getMessageActions()` operation returns a list of `PNGetMessageActionsResult?` objects, each containing the following operations:

MethodDescription`type`Type: `String`Message action's type.`value`Type: `String`Message action's value.`uuid`Type: `String`Publisher of the message action.`actionTimetoken`Type: `String`Timestamp when the message action was created.`messageTimetoken`Type: `Long`Timestamp when the actual message was created the message action belongs to.`page`Type: `PNBoundedPage`If exists indicates that more data is available. It can be passed directly to another call of `getMessageActions` to retrieve this remaining data.

### Other Examples[​](#other-examples)

#### Fetch Messages with paging[​](#fetch-messages-with-paging)

```
`**`
```
Last updated on Jun 10, 2025**