# Message Actions API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, async callbacks, and emitted status events. Apps built with versions < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Use Message Actions to add/remove metadata on published messages (receipts, reactions). Subscribe to channels to receive action events. You can fetch past actions from Message Persistence.

##### Reactions
“Message Reactions” is a specific use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
Message Actions is the low-level API for attaching metadata (read receipts, confirmations, custom data). “Message Reactions” is the same API used for emoji reactions (terminology differs by use case).

## Add message action[​](#add-message-action)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

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
- channel (String): Channel to add the message action to.
- messageAction (PNMessageAction): Action payload (type, value, message timetoken).
- async (Consumer<Result>): Callback of type PNAddMessageActionResult.

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.
```
1
  

```

### Returns[​](#returns)
addMessageAction() returns PNAddMessageActionResult:
- getType(): String — Message action type.
- getValue(): String — Message action value.
- getUuid(): String — Publisher of the message action.
- getActionTimetoken(): Long — When the action was created.
- getMessageTimetoken(): Long — Timetoken of the message the action belongs to.

#### PNMessageAction[​](#pnmessageaction)
- setType(String): Message action type.
- setValue(String): Message action value.
- setMessageTimetoken(Long): Timetoken of the target message.

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

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
- channel (String): Channel to remove the action from.
- messageTimetoken (Long): Timetoken of the target message.
- actionTimetoken (Long): Timetoken of the action to remove.
- async (Consumer<Result>): Callback of type PNRemoveMessageActionResult.

### Sample code[​](#sample-code-1)
```
1
  

```

### Returns[​](#returns-1)
removeMessageAction() returns no actionable data.

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by action timetoken ascending.

##### Truncated response
Responses may be truncated. If so, a more property is returned with additional parameters. Send iterative calls, adjusting parameters to fetch more actions.

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
- channel (String): Channel to list actions for.
- start (Long): Start action timetoken (exclusive).
- end (Long): End action timetoken (inclusive).
- limit (Integer): Max actions to return. Default/Max 100.
- async (Consumer<Result>): Callback of type PNGetMessageActionsResult.

### Sample code[​](#sample-code-2)
```
1
  

```

### Returns[​](#returns-2)
getMessageActions() returns a list of PNGetMessageActionsResult:
- getType(): String — Message action type.
- getValue(): String — Message action value.
- getUuid(): String — Publisher of the message action.
- getActionTimetoken(): Long — When the action was created.
- getMessageTimetoken(): Long — Timetoken of the message the action belongs to.

### Other examples[​](#other-examples)

#### Fetch messages with paging[​](#fetch-messages-with-paging)
```
1
**
```

Last updated on Sep 3, 2025**