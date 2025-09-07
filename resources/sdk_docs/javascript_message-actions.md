On this page
# Message Actions API for JavaScript SDK

Use Message Actions to add/remove metadata on published messages (for receipts, reactions, custom data). Subscribe to channels to receive action events. Fetch past actions from Message Persistence on demand or with messages.

Supported and recommended asynchronous patterns
- PubNub supports Callbacks, Promises, and Async/Await. Use Async/Await with try...catch to receive error status.

Reactions
- “Message Reactions” uses the Message Actions API for emoji/social reactions.
- Message Actions is the low-level API; “Message Reactions” is the same functionality used specifically for emoji reactions (terminology differs between Core and Chat SDKs).

## Add message action[​](#add-message-action)

Requires Message Persistence
- Enable Message Persistence for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

Use this JavaScript method:

```
`addMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    action: {type: string, value: string}  
})  
`
```

Parameters
- channel (string): Channel name of the target message.
- messageTimetoken (string): Timetoken of the target message.
- action (Hash): Message action payload.
  - action.type (string): Message action type.
  - action.value (string): Message action value.

### Sample code[​](#sample-code)

Reference code
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

## Remove message action[​](#remove-message-action)

Requires Message Persistence
- Enable Message Persistence for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

Use this JavaScript method:

```
`removeMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    actionTimetoken: string  
})  
`
```

Parameters
- channel (string): Channel name of the target message.
- messageTimetoken (string): Timetoken of the target message.
- actionTimetoken (string): Timetoken of the message action to remove.

### Sample code[​](#sample-code-1)

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

## Get message actions[​](#get-message-actions)

Requires Message Persistence
- Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. Response is sorted by actionTimetoken ascending.

Truncated response
- Responses may be truncated. If so, a more property is returned with additional parameters. Make iterative calls, adjusting parameters to fetch more actions.

### Method(s)[​](#methods-2)

Use this JavaScript method:

```
`getMessageActions({  
    channel: string,  
    start: string,  
    end: string,  
    limit: number  
})  
`
```

Parameters
- channel (string): Channel name to list message actions for.
- start (string): Message action timetoken for start of range (exclusive).
- end (string): Message action timetoken for end of range (inclusive).
- limit (number): Number of message actions to return.

### Sample code[​](#sample-code-2)

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
show all 21 lines

Last updated on Sep 3, 2025**