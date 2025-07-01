On this page
# Message Actions API for JavaScript SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To `Add a Message Action`, you can use the following method(s) in the JavaScript SDK:

```
`addMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    action: {type: string, value: string}  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringName of channel which stores the message for which `action` should be added.`messageTimetoken` *Type: stringTimetoken of message for which `action` should be added.`action` *Type: HashMessage `action` information.`action.type` *Type: stringWhat feature this message action represents.`action.value` *Type: stringValue which should be stored along with message action.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

```
`  
`
```

### Returns[​](#returns)

```
`// Example of status  
{  
    "error": false,  
    "operation": "PNAddMessageActionOperation",  
    "statusCode": 200  
}  
  
// Example of response  
{  
    "data": {  
        "type": "reaction",  
        "value": "smiley_face",  
        "uuid": "user-456",  
        "actionTimetoken": "15610547826970050",  
        "messageTimetoken": "15610547826969050"  
`
```
show all 17 lines

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To `Remove a Message Action`, you can use the following method(s) in the JavaScript SDK:

```
`removeMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    actionTimetoken: string  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringName of channel which store message for which `action` should be removed.`messageTimetoken` *Type: stringTimetoken of message for which `action` should be removed.`actionTimetoken` *Type: string`Action` addition timetoken.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

```
`// Example of status  
{  
    "error": false,  
    "operation": "PNRemoveMessageActionOperation",  
    "statusCode": 200  
}  
  
// Example of response  
{  
    "data": {}  
}  
`
```

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

To `Get Message Actions`, you can use the following method(s) in the JavaScript SDK:

```
`getMessageActions({  
    channel: string,  
    start: string,  
    end: string,  
    limit: number  
})  
`
```

*  requiredParameterDescription`channel` *Type: stringName of channel from which list of messages `actions` should be retrieved.`start`Type: string`Message action timetoken denoting the start of the range requested. Return values will be less than start.`end`Type: stringMessage action timetoken denoting the end of the range requested. Return values will be greater than or equal to end.`limit`Type: numberNumber of message actions to return in response.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

```
`// Example of status**{  
    "error": false,  
    "operation": "PNGetMessageActionsOperation",  
    "statusCode": 200  
}  
  
// Example of response  
{  
    "data": [  
        {  
            "type": "reaction",  
            "value": "smiley_face",  
            "uuid": "user-456",  
            "actionTimetoken": "15610547826970050",  
`
```
show all 21 linesLast updated on Jun 30, 2025**