# Message Actions API for Java SDK

##### Breaking changes in v9.0.0
Java SDK v9.0.0 unifies Java/Kotlin, changes client instantiation, async callbacks, and status events. Apps using < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Use Message Actions to add or remove metadata on published messages (receipts, reactions). Subscribe to receive action events. You can also fetch past actions from Message Persistence.

##### Reactions
“Message Reactions” uses Message Actions for emoji/social reactions. It’s the same API; terminology differs by use case.

## Add message action

##### Requires Message Persistence
Enable in the Admin Portal per the support article.

Add an action to a published message. The response includes the added action.

### Method(s)

Use this Java method:

```
`1this.pubnub.addMessageAction()  
2    .channel(String)  
3    .messageAction(PNMessageAction);  
`
```

Parameters:
- channel (String, required): Channel name to add the message action to.
- messageAction (PNMessageAction, required): Message action payload (type, value, message timetoken).
- async (Consumer<Result>): Callback of type PNAddMessageActionResult.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns

The addMessageAction() operation returns a PNAddMessageActionResult with:
- getType() (String): Message action type.
- getValue() (String): Message action value.
- getUuid() (String): Publisher of the message action.
- getActionTimetoken() (Long): Timestamp when the message action was created.
- getMessageTimetoken() (Long): Timestamp when the target message was created.

#### PNMessageAction
- setType() (String): Message action type.
- setValue() (String): Message action value.
- setMessageTimetoken() (Long): Timetoken of the target message.

## Remove message action

##### Requires Message Persistence
Enable in the Admin Portal per the support article.

Remove a previously added action from a published message. The response is empty.

### Method(s)

Use this Java method:

```
`1this.pubnub.removeMessageAction()  
2    .channel(String)  
3    .messageTimetoken(Long)  
4    .actionTimetoken(Long);  
`
```

Parameters:
- channel (String, required): Channel name to remove the message action from.
- messageTimetoken (Long, required): Timetoken of the target message.
- actionTimetoken (Long, required): Timetoken of the message action to remove.
- async (Consumer<Result>): Callback of type PNRemoveMessageActionResult.

### Sample code

```
1
  

```

### Returns
removeMessageAction() returns no actionable data.

## Get message actions

##### Requires Message Persistence
Enable in the Admin Portal per the support article.

Get a list of message actions in a channel. Results are sorted by action timetoken (ascending).

##### Truncated response
Responses may be truncated; a more property is returned with additional parameters. Make iterative calls adjusting parameters to fetch more actions.

### Method(s)

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
- channel (String, required): Channel name to list message actions for.
- start (Long): Message action timetoken for the start of the range (exclusive).
- end (Long): Message action timetoken for the end of the range (inclusive).
- limit (Integer, default/max 100): Maximum number of actions to return.
- async (Consumer<Result>): Callback of type PNGetMessageActionsResult.

### Sample code

```
1
  

```

### Returns
getMessageActions() returns a list of PNGetMessageActionsResult with:
- getType() (String): Message action type.
- getValue() (String): Message action value.
- getUuid() (String): Publisher of the message action.
- getActionTimetoken() (Long): Timestamp when the message action was created.
- getMessageTimetoken() (Long): Timestamp when the target message was created.

### Other examples

#### Fetch messages with paging

```
1
**
```

Last updated on Sep 3, 2025**