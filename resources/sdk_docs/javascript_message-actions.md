# Message Actions API for JavaScript SDK

Use message actions to add/remove metadata on published messages (for example, receipts and reactions). Clients subscribe to channels to receive message action events and can fetch past message actions from Message Persistence (on demand or with original messages).

##### Supported and recommended asynchronous patterns
- Supports Callbacks, Promises, and Async/Await.
- Recommended: Async/Await. Add try...catch to receive error status.

##### Reactions
“Message Reactions” are message actions used specifically for emoji/social reactions.

##### Message Actions vs. Message Reactions
- Message Actions: general-purpose metadata on messages (receipts, delivery confirmations, custom data).
- Message Reactions: the same API used for emoji reactions; terminology varies in Core/Chat SDKs.

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Add an action to a published message. The response includes the added action.

### Method(s)

Use this JavaScript method:
```
`1addMessageAction({  
2    channel: string,  
3    messageTimetoken: string,  
4    action: {type: string, value: string}  
5})  
`
```

Parameters:
- channel (string): Channel name of the target message.
- messageTimetoken (string): Timetoken of the target message.
- action (object): Message action payload.
  - action.type (string): Message action type.
  - action.value (string): Message action value.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.
```
1
  
```

```
1
  
```

### Returns
```
1// Example of status  
2{  
3    "error": false,  
4    "operation": "PNAddMessageActionOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of response  
9{  
10    "data": {  
11        "type": "reaction",  
12        "value": "smiley_face",  
13        "uuid": "user-456",  
14        "actionTimetoken": "15610547826970050",  
15        "messageTimetoken": "15610547826969050"  
16    }  
17}  
```

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)

Use this JavaScript method:
```
`1removeMessageAction({  
2    channel: string,  
3    messageTimetoken: string,  
4    actionTimetoken: string  
5})  
`
```

Parameters:
- channel (string): Channel name of the target message.
- messageTimetoken (string): Timetoken of the target message.
- actionTimetoken (string): Timetoken of the message action to remove.

### Sample code
```
1
  
```

### Returns
```
1// Example of status  
2{  
3    "error": false,  
4    "operation": "PNRemoveMessageActionOperation",  
5    "statusCode": 200  
6}  
7
  
8// Example of response  
9{  
10    "data": {}  
11}  
```

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. The response sorts actions by the action timetoken in ascending order.

##### Truncated response
If the response is truncated, a more property is returned with additional parameters. Send iterative calls, adjusting parameters to fetch more actions.

### Method(s)

Use this JavaScript method:
```
`1getMessageActions({  
2    channel: string,  
3    start: string,  
4    end: string,  
5    limit: number  
6})  
`
```

Parameters:
- channel (string): Channel name to list message actions for.
- start (string): Message action timetoken for the start of the range (exclusive).
- end (string): Message action timetoken for the end of the range (inclusive).
- limit (number): Number of message actions to return.

### Sample code
```
1
  
```

### Returns
```
1// Example of status  
2{  
3    "error": false,  
4    "operation": "PNGetMessageActionsOperation",  
5    "statusCode": 200  
6}  
7
**8// Example of response  
9{  
10    "data": [  
11        {  
12            "type": "reaction",  
13            "value": "smiley_face",  
14            "uuid": "user-456",  
15            "actionTimetoken": "15610547826970050",  
16            "messageTimetoken": "15610547826969050"  
17        }  
18    ],  
19    "start": "15646822873784630",  
20    "end": "15645905639093361",  
21}  
```