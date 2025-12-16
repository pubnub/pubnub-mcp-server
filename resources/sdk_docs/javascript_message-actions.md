# Message Actions API for JavaScript SDK

Use **Message Actions** to add/remove metadata on published messages (for example, receipts, reactions). Clients can subscribe to a channel to receive message action events and can fetch historical actions via **Message Persistence**.

## Async patterns

PubNub supports **Callbacks, Promises, and Async/Await**. Recommended: **Async/Await**. Errors are returned via exceptions; use `try...catch`.

## Reactions terminology

- **Message Actions**: low-level API for any metadata (read receipts, delivery confirmations, custom data).
- **Message Reactions**: using Message Actions specifically for emoji/social reactions. In PubNub Core/Chat SDKs, “Message Reactions” is the same underlying API.

---

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Adds an action to a published message; response includes the added action.

### Method(s)[​](#methods)

Use this JavaScript method:

```
`1addMessageAction({  
2    channel: string,  
3    messageTimetoken: string,  
4    action: {type: string, value: string}  
5})  
`
```

*  requiredParameterDescription`channel` *Type: stringChannel name of the target message.`messageTimetoken` *Type: stringTimetoken of the target message.`action` *Type: HashMessage action payload.`action.type` *Type: stringMessage action type.`action.value` *Type: stringMessage action value.

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

```
1
  

```

### Returns[​](#returns)

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
show all 17 lines

---

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Removes a previously added action from a published message; response is empty.

### Method(s)[​](#methods-1)

Use this JavaScript method:

```
`1removeMessageAction({  
2    channel: string,  
3    messageTimetoken: string,  
4    actionTimetoken: string  
5})  
`
```

*  requiredParameterDescription`channel` *Type: stringChannel name of the target message.`messageTimetoken` *Type: stringTimetoken of the target message.`actionTimetoken` *Type: stringTimetoken of the message action to remove.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

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

---

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Enable Message Persistence for your key in the [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

Lists message actions in a channel. Actions are sorted by **action timetoken** ascending.

##### Truncated response

Responses may be truncated due to internal limits. If truncated, a `more` property is returned with parameters for additional fetches; make iterative calls adjusting parameters to retrieve the rest.

### Method(s)[​](#methods-2)

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

*  requiredParameterDescription`channel` *Type: stringChannel name to list message actions for.`start`Type: stringMessage action timetoken for the start of the range (exclusive).`end`Type: stringMessage action timetoken for the end of the range (inclusive).`limit`Type: numberNumber of message actions to return.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

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
show all 21 linesLast updated on Sep 3, 2025**