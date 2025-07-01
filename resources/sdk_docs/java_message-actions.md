On this page
# Message Actions API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To add a Message Action you can use the following method(s) in the Java SDK:

```
`this.pubnub.addMessageAction()  
    .channel(String)  
    .messageAction(PNMessageAction);  
`
```

*  requiredParameterDescription`channel` *Type: StringSpecifies channel name to `publish` message actions to.`messageAction` *Type: PNMessageActionThe message action object containing the message action's `type`, `value` and the publish `timetoken` of the original `message`.`async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNAddMessageActionResult`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `addMessageAction()` operation returns a `PNAddMessageActionResult` which contains the following operations:

MethodDescription`getType()`Type: `String`Message action's type.`getValue()`Type: `String`Message action's value.`getUuid()`Type: `String`Publisher of the message action.`getActionTimetoken()`Type: `Long`Timestamp when the message action was created.`getMessageTimetoken()`Type: `Long`Timestamp when the actual message was created the message action belongs to.

#### PNMessageAction[​](#pnmessageaction)

MethodDescription`setType()`Type: `String`Message action's type.`setValue()`Type: `String`Message action's value.`setMessageTimetoken()`Type: `Long`Timestamp of the actual message was created the message action belongs to.

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the Java SDK:

```
`this.pubnub.removeMessageAction()  
    .channel(String)  
    .messageTimetoken(Long)  
    .actionTimetoken(Long);  
`
```

*  requiredParameterDescription`channel` *Type: StringSpecifies channel name to `publish` message actions to.`messageTimetoken` *Type: LongPublish `timetoken` of the original `message``actionTimetoken` *Type: LongPublish `timetoken` of the message action to be removed.`async` *Type: `Consumer<Result>``Consumer` of a `Result` of type `PNRemoveMessageActionResult`.

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

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Java SDK:

```
`this.pubnub.getMessageActions()  
    .channel(String)  
    .start(Long)  
    .end(Long)  
    .limit(Integer);  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aThe `channel` name.`start`Type: LongDefault:  
n/aMessage Action `timetoken` denoting the `start` of the range requested (return values will be less than `start`).`end`Type: LongDefault:  
n/aMessage Action `timetoken` denoting the `end` of the range requested (return values will be greater than or equal to `end`).`limit`Type: IntegerDefault:  
100Specifies the number of actions to return in response. Default/Maximum is `100`.`async` *Type: `Consumer<Result>`Default:  
n/a`Consumer` of a `Result` of type `PNGetMessageActionsResult`.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The `getMessageActions()` operation returns a list of `PNGetMessageActionsResult` objects, each containing the following operations:

MethodDescription`getType()`Type: `String`Message action's type.`getValue()`Type: `String`Message action's value.`getUuid()`Type: `String`Publisher of the message action.`getActionTimetoken()`Type: `Long`Timestamp when the message action was created.`getMessageTimetoken()`Type: `Long`Timestamp when the actual message was created the message action belongs to.

### Other Examples[​](#other-examples)

#### Fetch Messages with paging[​](#fetch-messages-with-paging)

```
`**`
```
Last updated on Jun 10, 2025**