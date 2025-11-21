# Message Actions API for Kotlin SDK

Use Message Actions to add/remove metadata on published messages (receipts, reactions, custom data). Subscribe to channels to receive message action events. You can also fetch past actions from Message Persistence.

##### Breaking changes in v9.0.0
- Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and emitted status events.
- See the Java/Kotlin SDK migration guide for details.

##### Request execution
Most method invocations return an Endpoint. You must call .sync() or .async() to execute the request.

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
“Message Reactions” is a specific use of Message Actions for emoji/social reactions. Core and Chat SDKs may refer to this functionality as “Message Reactions,” but it uses the same Message Actions API.

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
- messageAction (PNMessageAction): Payload including type, value, and message timetoken.

### Sample code

##### Reference code
```
1
  

```

### Returns
PNAddMessageActionResult with:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher UUID of the message action.
- actionTimetoken (String): Timetoken when the action was created.
- messageTimetoken (Long): Timetoken of the message the action belongs to.

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

Get a list of message actions in a channel, sorted by action timetoken ascending.

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
- page (PNBoundedPage): Paging object. Set limit to specify number of actions (default/maximum 100). Use start and end to set range boundaries (results are < start and ≥ end).

### Sample code
```
1
  

```

### Returns
List of PNGetMessageActionsResult? with:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher UUID of the message action.
- actionTimetoken (String): Timetoken when the action was created.
- messageTimetoken (Long): Timetoken of the message the action belongs to.
- page (PNBoundedPage): If present, more data is available. Pass it to another getMessageActions call to fetch remaining data.

### Other examples

#### Fetch messages with paging
```
1
**
```

Last updated on Sep 3, 2025**