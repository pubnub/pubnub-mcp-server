# Message Actions API for JavaScript SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Subscribe to channels to receive message action events. You can also fetch past actions from Message Persistence (on demand or when fetching original messages).

- Supported async patterns: Callbacks, Promises, and Async/Await (recommended). Use try...catch to handle errors.
- Message Actions is the low-level API for arbitrary metadata; Message Reactions is the same API used for emoji/social reactions.

## Add message action

Requires Message Persistence. Enable it in the Admin Portal: https://admin.pubnub.com/ (see: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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

Requires Message Persistence. Enable it in the Admin Portal: https://admin.pubnub.com/ (see: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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

Requires Message Persistence. Enable it in the Admin Portal: https://admin.pubnub.com/ (see: https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Get a list of message actions in a channel. Results are sorted by action timetoken in ascending order.

Truncated response: If limits are hit, the response includes a more property with parameters for pagination. Make iterative calls, adjusting parameters to fetch additional actions.

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