# Message Actions API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and [Java](/docs/sdks/java) SDKs, changes client instantiation, async callbacks, and [status events](/docs/sdks/kotlin/status-events). Applications on versions < 9.0.0 may be impacted. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Use Message Actions to add/remove metadata on published messages (receipts, reactions). Subscribe to channels to receive action events, and fetch past actions from Message Persistence.

##### Request execution
Most methods return an Endpoint. You must call .sync() or .async() to execute.

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
“Message Reactions” are a specific use of Message Actions for emoji/social reactions. The same API underlies “Message Reactions” in [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs.

## Add message action

##### Requires Message Persistence
Enable Message Persistence in the [Admin Portal](https://admin.pubnub.com/) per this [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns
PNAddMessageActionResult:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher of the message action.
- actionTimetoken (String): Timestamp when the action was created.
- messageTimetoken (Long): Timetoken of the message the action belongs to.

#### PNMessageAction
- type (String): Message action type.
- value (String): Message action value.
- messageTimetoken (Long): Timetoken of the target message.

## Remove message action

##### Requires Message Persistence
Enable Message Persistence in the [Admin Portal](https://admin.pubnub.com/) per this [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Remove a previously added action. The response is empty.

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
- channel (String): Channel name to remove the action from.
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
Enable Message Persistence in the [Admin Portal](https://admin.pubnub.com/) per this [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get a list of message actions for a channel. Sorted by action timetoken ascending.

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
- page (PNBoundedPage): Paging object. limit specifies number of actions (default/maximum 100). Use start and end to set range boundaries (results are < start and ≥ end).

### Sample code
```
1
  

```

### Returns
List of PNGetMessageActionsResult?:
- type (String): Message action type.
- value (String): Message action value.
- uuid (String): Publisher of the message action.
- actionTimetoken (String): Timestamp when the action was created.
- messageTimetoken (Long): Timetoken of the message the action belongs to.
- page (PNBoundedPage): If present, more data is available. Pass to another getMessageActions call to retrieve remaining data.

### Other examples

#### Fetch messages with paging
```
1
**
```

Last updated on Sep 3, 2025**