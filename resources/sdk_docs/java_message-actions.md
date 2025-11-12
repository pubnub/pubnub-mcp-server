# Message Actions API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java and Kotlin SDK codebases, changes client instantiation, and updates asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

Use Message Actions to add or remove metadata on published messages (receipts, reactions). Subscribe to channels to receive action events. Fetch past actions from Message Persistence on demand or with original messages.

##### Reactions
Message Reactions are a specific use of Message Actions for emoji/social reactions. Core and Chat SDKs may refer to this same API as “Message Reactions.”

## Add message action[​](#add-message-action)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)
Use this Java method:
```
`1this.pubnub.addMessageAction()  
2    .channel(String)  
3    .messageAction(PNMessageAction);  
`
```

Parameters:
- channel — Type: String. Channel name to add the message action to.
- messageAction — Type: PNMessageAction. Message action payload (type, value, message timetoken).
- async — Type: Consumer<Result>. Callback of type PNAddMessageActionResult.

### Sample code[​](#sample-code)
##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.
```
1
  

```

### Returns[​](#returns)
addMessageAction() returns PNAddMessageActionResult with:
- getType() — Type: String. Message action type.
- getValue() — Type: String. Message action value.
- getUuid() — Type: String. Publisher of the message action.
- getActionTimetoken() — Type: Long. Timestamp when the message action was created.
- getMessageTimetoken() — Type: Long. Timestamp when the related message was created.

#### PNMessageAction[​](#pnmessageaction)
- setType() — Type: String. Message action type.
- setValue() — Type: String. Message action value.
- setMessageTimetoken() — Type: Long. Timetoken of the target message.

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)
Use this Java method:
```
`1this.pubnub.removeMessageAction()  
2    .channel(String)  
3    .messageTimetoken(Long)  
4    .actionTimetoken(Long);  
`
```

Parameters:
- channel — Type: String. Channel name to remove the message action from.
- messageTimetoken — Type: Long. Timetoken of the target message.
- actionTimetoken — Type: Long. Timetoken of the message action to remove.
- async — Type: Consumer<Result>. Callback of type PNRemoveMessageActionResult.

### Sample code[​](#sample-code-1)
```
1
  

```

### Returns[​](#returns-1)
removeMessageAction() returns no actionable data.

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Get a list of message actions in a channel. Actions are sorted by action timetoken in ascending order.

##### Truncated response
If the response is truncated, a more property is returned with additional parameters. Make iterative calls adjusting parameters to fetch more actions.

### Method(s)[​](#methods-2)
Use this Java method:
```
`1this.pubnub.getMessageActions()  
2    .channel(String)  
3    .start(Long)  
4    .end(Long)  
5    .limit(Integer);  
`
```

Parameters:
- channel — Type: String. Default: n/a. Channel name to list message actions for.
- start — Type: Long. Default: n/a. Message action timetoken for the start of the range (exclusive).
- end — Type: Long. Default: n/a. Message action timetoken for the end of the range (inclusive).
- limit — Type: Integer. Default: 100. Maximum: 100. Maximum number of actions to return.
- async — Type: Consumer<Result>. Default: n/a. Callback of type PNGetMessageActionsResult.

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-2)
getMessageActions() returns a list of PNGetMessageActionsResult objects with:
- getType() — Type: String. Message action type.
- getValue() — Type: String. Message action value.
- getUuid() — Type: String. Publisher of the message action.
- getActionTimetoken() — Type: Long. Timestamp when the message action was created.
- getMessageTimetoken() — Type: Long. Timestamp when the related message was created.

### Other examples[​](#other-examples)

#### Fetch messages with paging[​](#fetch-messages-with-paging)
```
1
**
```

Last updated on Sep 3, 2025**