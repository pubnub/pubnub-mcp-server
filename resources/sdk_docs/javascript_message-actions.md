# Message Actions API – JavaScript SDK

Message Actions let you attach metadata (reactions, read receipts, etc.) to any stored message.  
All operations require **Message Persistence** to be enabled for your key.  
Async patterns supported: callbacks, promises, **async/await** (recommended, wrap calls in `try…catch`).

---

## Add Message Reaction

```
`addMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    action: { type: string, value: string }  
})  
`
```

Parameters  
• `channel` (string, required) – target channel  
• `messageTimetoken` (string, required) – timetoken of the message to annotate  
• `action` (object, required)  
 • `action.type` (string) – action type  
 • `action.value` (string) – action value  

Sample code  

```
`  
`
```

Returns  

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
  }  
}  
`
```

---

## Remove Message Reaction

```
`removeMessageAction({  
    channel: string,  
    messageTimetoken: string,  
    actionTimetoken: string  
})  
`
```

Parameters  
• `channel` (string, required) – channel containing the message  
• `messageTimetoken` (string, required) – timetoken of annotated message  
• `actionTimetoken` (string, required) – timetoken of the action to remove  

Sample code  

```
`  
`
```

Returns  

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

---

## Get Message Reactions

```
`getMessageActions({  
    channel: string,  
    start: string,   // optional, actions < start  
    end: string,     // optional, actions ≥ end  
    limit: number    // optional  
})  
`
```

Parameters  
• `channel` (string, required) – channel to query  
• `start` (string) – upper timetoken bound (exclusive)  
• `end` (string) – lower timetoken bound (inclusive)  
• `limit` (number) – max actions returned  

Sample code  

```
`  
`
```

Returns  

```
`// Example of status  
{  
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
      "messageTimetoken": "15610547826969050"  
    }  
  ]  
}  
`
```

Use the `more` object in the response (if present) for paginated retrieval when data is truncated.