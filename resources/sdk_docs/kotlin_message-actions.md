# Message Actions API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Clients subscribe to a channel to receive message action events and can fetch past message actions from Message Persistence.

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation will not be performed.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

##### Reactions

"Message Reactions" is a specific application of the Message Actions API for emoji or social reactions.

##### Message Actions vs. Message Reactions

Message Actions is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while Message Reactions specifically refers to using Message Actions for emoji/social reactions. In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as Message Reactions when used for emoji reactions.

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) as described in the [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

Use this Kotlin method:

```
`1pubnub.addMessageAction(  
2    channel: String,  
3    messageAction: PNMessageAction  
4).async { result -> }  
`
```

- channel Type: String — Channel name to add the message action to.
- messageAction Type: PNMessageAction — Message action payload (type, value, message timetoken).

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

The addMessageAction() operation returns a PNAddMessageActionResult:

- type Type: String — Message action type.
- value Type: String — Message action value.
- uuid Type: String — Publisher of the message action.
- actionTimetoken Type: String — Timestamp when the message action was created.
- messageTimetoken Type: Long — Timestamp when the target message was created.

#### PNMessageAction[​](#pnmessageaction)

- type Type: String — Message action type.
- value Type: String — Message action value.
- messageTimetoken Type: Long — Timetoken of the target message.

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) as described in the [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

Use this Kotlin method:

```
`1pubnub.removeMessageAction(  
2    channel: String,  
3    messageTimetoken: Long,  
4    actionTimetoken: Long  
5).async { result -> }  
`
```

- channel Type: String — Channel name to remove the message action from.
- messageTimetoken Type: Long — Timetoken of the target message.
- actionTimetoken Type: Long — Timetoken of the message action to remove.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

The removeMessageAction() operation returns no actionable data.

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) as described in the [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get a list of message actions in a channel. The response sorts actions by the action timetoken in ascending order.

### Method(s)[​](#methods-2)

Use this Kotlin method:

```
`1pubnub.getMessageActions(  
2    channel: String,  
3    page: PNBoundedPage  
4)  
`
```

- channel Type: String — Channel name to list message actions for.
- page Type: PNBoundedPage — Paging object. Set limit to specify the number of actions to return (default/maximum is 100). Use start and end to set range boundaries (results are < start and ≥ end).

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

The getMessageActions() operation returns a list of PNGetMessageActionsResult? objects:

- type Type: String — Message action type.
- value Type: String — Message action value.
- uuid Type: String — Publisher of the message action.
- actionTimetoken Type: String — Timestamp when the message action was created.
- messageTimetoken Type: Long — Timestamp when the target message was created.
- page Type: PNBoundedPage — If present, more data is available. Pass it to another getMessageActions call to retrieve remaining data.

### Other examples[​](#other-examples)

#### Fetch messages with paging[​](#fetch-messages-with-paging)

```
1
**
```

Last updated on Sep 3, 2025**