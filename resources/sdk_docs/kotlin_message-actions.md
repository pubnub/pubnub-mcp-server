# Message Actions API for Kotlin SDK

##### Breaking changes in v9.0.0
Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes PubNub client instantiation, and updates async callbacks and emitted status events. These changes affect apps built with versions < 9.0.0. See the Java/Kotlin SDK migration guide.

Use message actions to add or remove metadata on published messages (receipts, reactions). Clients subscribe to channels to receive message action events and can fetch message actions from Message Persistence.

##### Request execution
Most method invocations return an Endpoint you must execute via .sync() or .async().

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
“Message Reactions” are message actions used specifically for emoji/social reactions. Message Actions is the low-level API; “Message Reactions” is the same functionality when used for emoji reactions.

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)
Use this Kotlin method:
```
`1pubnub.addMessageAction(  
2    channel: String,  
3    messageAction: PNMessageAction  
4).async { result -> }  
`
```

Parameters:
- channel (String): Channel name to add the message action to.
- messageAction (PNMessageAction): Message action payload (type, value, message timetoken).

### Sample code
##### Reference code
```
1
  

```

### Returns
PNAddMessageActionResult:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher of the message action.
- actionTimetoken (String): Timestamp when the message action was created.
- messageTimetoken (Long): Timestamp when the target message was created.

#### PNMessageAction
- type (String): Message action type.
- value (String): Message action value.
- messageTimetoken (Long): Timetoken of the target message.

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)
Use this Kotlin method:
```
`1pubnub.removeMessageAction(  
2    channel: String,  
3    messageTimetoken: Long,  
4    actionTimetoken: Long  
5).async { result -> }  
`
```

Parameters:
- channel (String): Channel name to remove the message action from.
- messageTimetoken (Long): Timetoken of the target message.
- actionTimetoken (Long): Timetoken of the message action to remove.

### Sample code
```
1
  

```

### Returns
No actionable data.

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. The response sorts actions by the action timetoken in ascending order.

### Method(s)
Use this Kotlin method:
```
`1pubnub.getMessageActions(  
2    channel: String,  
3    page: PNBoundedPage  
4)  
`
```

Parameters:
- channel (String): Channel name to list message actions for.
- page (PNBoundedPage): Paging object. Set limit for number of actions (default/max 100). Use start and end as range boundaries (results are < start and ≥ end).

### Sample code
```
1
  

```

### Returns
List of PNGetMessageActionsResult? objects:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher of the message action.
- actionTimetoken (String): Timestamp when the message action was created.
- messageTimetoken (Long): Timestamp when the target message was created.
- page (PNBoundedPage): If present, more data is available. Pass it to another getMessageActions call to retrieve remaining data.

### Other examples

#### Fetch messages with paging
```
1
**
```

Last updated on Sep 3, 2025**