# Message Actions API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new PubNub client instantiation pattern, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). Apps built with versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Use message actions to add/remove metadata on published messages (receipts, reactions). Clients subscribe to channels to receive action events and can fetch past actions from Message Persistence.

##### Reactions
“Message Reactions” are a specific application of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
Message Actions is the low-level API for arbitrary metadata (read receipts, delivery confirmations, custom data). Message Reactions refers to using Message Actions for emoji reactions; underlying API is the same.

## Requirements
Message Actions require Message Persistence. Enable it for your key in the [Admin Portal](https://admin.pubnub.com/) per this [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

## Add message action

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
- channel (Type: String) — Channel name to add the message action to.
- messageAction (Type: PNMessageAction) — Message action payload (type, value, message timetoken).
- async (Type: Consumer<Result>) — Callback of type PNAddMessageActionResult.

### Sample code
##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.
```
1
  

```

### Returns
addMessageAction() returns PNAddMessageActionResult:
- getType() (Type: String) — Message action type.
- getValue() (Type: String) — Message action value.
- getUuid() (Type: String) — Publisher of the message action.
- getActionTimetoken() (Type: Long) — Timestamp when the message action was created.
- getMessageTimetoken() (Type: Long) — Timestamp when the message the action belongs to was created.

#### PNMessageAction
- setType() (Type: String) — Message action type.
- setValue() (Type: String) — Message action value.
- setMessageTimetoken() (Type: Long) — Timetoken of the target message.

## Remove message action

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
- channel (Type: String) — Channel name to remove the message action from.
- messageTimetoken (Type: Long) — Timetoken of the target message.
- actionTimetoken (Type: Long) — Timetoken of the message action to remove.
- async (Type: Consumer<Result>) — Callback of type PNRemoveMessageActionResult.

### Sample code
```
1
  

```

### Returns
removeMessageAction() returns no actionable data.

## Get message actions

Get a list of message actions in a channel. Actions are sorted by action timetoken (ascending).

##### Truncated response
If internal limits are hit, the response may be truncated and include a more property with additional parameters. Make iterative calls, adjusting parameters to fetch more actions.

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
- channel (Type: String) — Channel name to list message actions for.
- start (Type: Long) — Message action timetoken for the start of the range (exclusive).
- end (Type: Long) — Message action timetoken for the end of the range (inclusive).
- limit (Type: Integer) — Maximum number of actions to return. Default/Maximum is 100.
- async (Type: Consumer<Result>) — Callback of type PNGetMessageActionsResult.

### Sample code
```
1
  

```

### Returns
getMessageActions() returns a list of PNGetMessageActionsResult:
- getType() (Type: String) — Message action type.
- getValue() (Type: String) — Message action value.
- getUuid() (Type: String) — Publisher of the message action.
- getActionTimetoken() (Type: Long) — Timestamp when the message action was created.
- getMessageTimetoken() (Type: Long) — Timestamp when the message the action belongs to was created.

### Other examples
#### Fetch messages with paging
```
1
**
```

Last updated on Sep 3, 2025**