# Message Actions API – JavaScript SDK (condensed)

Message Actions let you attach metadata (reactions, read-receipts, etc.) to previously published messages.  
All methods require Message Persistence to be enabled for the key.

Async patterns: callbacks, promises, and **async/await** (recommended—wrap calls in `try…catch`).

---

## Add Message Action

```
addMessageAction({
  channel: string,             // channel containing the target message
  messageTimetoken: string,    // timetoken of the target message
  action: {                    // action object
    type:  string,             // action feature (e.g., "reaction")
    value: string              // value (e.g., "smiley_face")
  }
})
```

### Returns
```js
// status
{
  "error": false,
  "operation": "PNAddMessageActionOperation",
  "statusCode": 200
}

// response
{
  "data": {
    "type": "reaction",
    "value": "smiley_face",
    "uuid": "user-456",
    "actionTimetoken": "15610547826970050",
    "messageTimetoken": "15610547826969050"
  }
}
```

---

## Remove Message Action

```
removeMessageAction({
  channel: string,          // channel containing the action
  messageTimetoken: string, // message timetoken
  actionTimetoken: string   // timetoken of the action to remove
})
```

### Returns
```js
// status
{
  "error": false,
  "operation": "PNRemoveMessageActionOperation",
  "statusCode": 200
}

// response
{ "data": {} }
```

---

## Get Message Actions

Truncated results include a `more` object; issue additional calls using its parameters.

```
getMessageActions({
  channel: string, // channel to query
  start: string,   // (optional) return actions with tt < start
  end: string,     // (optional) return actions with tt ≥ end
  limit: number    // (optional) max actions (default 25, max 100)
})
```

### Returns
```js
// status
{
  "error": false,
  "operation": "PNGetMessageActionsOperation",
  "statusCode": 200
}

// response (truncated)
{
  "data": [
    {
      "type": "reaction",
      "value": "smiley_face",
      "uuid": "user-456",
      "actionTimetoken": "15610547826970050",
      ...
    }
  ],
  "more": {
    "start": "15610547826970049",
    "limit": 100
  }
}
```

_Last updated: Jun 30 2025_