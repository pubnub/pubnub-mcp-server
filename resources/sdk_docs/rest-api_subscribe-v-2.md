# Subscribe V2

To subscribe and receive messages:
- Send an initial subscribe call with tt=0.
- Continue sending subsequent subscribe calls using the last response’s t.t as tt and set tr to the last response’s t.r to remain on the same region and avoid duplicates.

The subscribe call returns messages newer than the provided timetoken.

- When subscribed to a channel group myCG and a member channel myCH publishes, b will be "myCG" and c will be "myCH".
- Message type (e):
  - 0 or missing: regular message
  - 1: Signal
  - 2: Objects
  - 3: Message Actions
  - 4: Files
- Message Actions publish action event messages on the same channel with e=3. The data shows the action added/removed and its details; the UUID that triggered it is in i.
- When subscribing to both channels and channel groups, non-CG member channel entries match corresponding non-CG entries.

### Success Responses

On success, an object is returned as shown in the examples below.

##### Body (For normal messages)

```
`{  
"t": {  
"t": "15628652479932717",  
"r": 4  
},  
"m": [  
{ "a": "1",  
"f": 514,  
"i": "pn-0ca50551-4bc8-446e-8829-c70b704545fd",  
"s": 1,  
"p": {  
"t": "15628652479933927",  
"r": 4  
},  
"k": "demo",  
"c": "my-channel",  
"d": "my message",  
"cmt": "chat_custom_message_type",  
"b": "my-channel"  
}  
]  
}  
`
```

##### Body (For messages of type `Signal`)

```
`{  
"t": {  
"t": "15665475668624925",  
"r": 7  
},  
"m": [  
{  
"a": "1",  
"f": 0,  
"e": 1,  
"i": "pn-2fedcc05-9909-4d46-9129-a75cb8b69a5a",  
"p": {  
"t": "15665475668605765",  
"r": 7  
},  
"k": "sub-c-s9n4nan48rn-casd2-1123123e9-8b24-569e8a5c3af3",  
"c": "userid0",  
"d": "my-signal",  
"cmt": "chat_custom_message_type",  
"b": "userid0"  
}  
]  
}  
`
```

##### Body (For messages of type `Objects`)

```
`{  
"t": {  
"t": "15665291391003207",  
"r": 7  
},  
"m": [  
{  
"a": "1",  
"f": 0,  
"e": 2,  
"p": {  
"t": "15665291390119767",  
"r": 2  
},  
"k": "sub-c-s9n4nan48rn-casd2-1123123e9-8b24-569e8a5c3af3",  
"c": "spaceid0",  
"d": {  
"source": "objects",  
"version": "1.0",  
"event": "update",  
"type": "space",  
"data": {  
"description": "desc5",  
"eTag": "AYSay6Cm6YfKEA",  
"id": "spaceid0",  
"name": "name",  
"updated": "2019-08-23T02:58:58.983927Z"  
}  
},  
"b": "spaceid0"  
}  
]  
}  
`
```

##### Body (For messages of type `Message Actions`)

```
`{  
"t": {  
"t": "15694740174268096",  
"r": 56  
},  
"m": [  
{  
"f": 0,  
"e": 3,  
"i": "pn-53ca01eb-f7c5-4653-9639-ab45b8768d0f",  
"p": {  
"t": "15694740174271958",  
"r": 56  
},  
"k": "sub-c-d7da9e58-c997-11e9-a139-dab2c75acd6f",  
"c": "my-channel",  
"d": {  
"source": "actions",  
"version": "1.0",  
"data": {  
"messageTimetoken": "15694739912496365",  
"type": "reaction",  
"value": "smiley_face",  
"actionTimetoken": "15694740173724452"  
},  
"event": "added"  
},  
"b": "my-channel"  
}  
]  
}  
`
```

##### Body (For messages of type `Files`)

```
`{  
"t": {  
"t": "15632184115458813",  
"r": 1  
},  
"m": [  
{  
"a": "1",  
"f": 514,  
"p": {  
"t": "15632184115444394",  
"r": 1  
},  
"k": "demo",  
"c": "my-channel",  
"d": {  
"message": "Hello World",  
"file": {  
"id": "5a3eb38c-483a-4b25-ac01-c4e20deba6d6",  
"name": "test_file.jpg"  
}  
},  
"e": "4",  
"i": "uuid-1",  
"b": "my-channel"  
}  
]  
}  
`
```

Schema — OPTIONAL
- t object — OPTIONAL
  - t string — OPTIONAL: the timetoken
  - r integer — OPTIONAL: the region
- m object[] — OPTIONAL
  - a string — OPTIONAL: Shard
  - f integer — OPTIONAL: Flags
  - e integer — OPTIONAL: Message type (1 Signal, 2 Objects, 3 MessageAction, 4 Files)
  - i string — OPTIONAL: Issuing Client Id
  - s integer — OPTIONAL: Sequence number
  - p object — OPTIONAL: Publish Timetoken Metadata
    - t string — OPTIONAL
    - r integer — OPTIONAL
  - k string — OPTIONAL: Subscribe Key
  - c string — OPTIONAL: Channel
  - d string — OPTIONAL: The payload
  - b string — OPTIONAL: Subscription match or channel group
  - cmt string — OPTIONAL: Published custom message type data if query parameter set

### Error Responses

On error, a non-200 status is returned. For unknown status codes or unparseable JSON, treat as error, call error callback with available info, wait 1 second, and retry indefinitely. Subscribe logic must be durable; developers can unsubscribe as needed.

Common HTTP status codes apply. For non-common or parse errors, follow the retry guidance above.

- 400 Bad Request  
  Schema — OPTIONAL: status integer, service string, error boolean, message string
- 403 Unauthorized access  
  Schema — OPTIONAL: message string, payload object, channels string[], error boolean, service string, status integer
- 413 Request Entity too large (larger than 64 bytes).  
  Schema — OPTIONAL: status integer, service string, error boolean, message string
- 429 Request rate limit exceeded.  
  Schema — OPTIONAL: status integer, error boolean, message string

## Parameters

Path Parameters
- sub_key string — REQUIRED  
  Your app's subscribe key from Admin Portal.
- channel string — REQUIRED  
  Channel ID(s) to subscribe to. Multiple via comma. Use a single comma (,) if subscribing to no channels (channel groups only). You may subscribe to channels, channel groups, or both.  
  Example: myChannel
- callback string — REQUIRED  
  JSONP callback name; use 0 for no callback.  
  Examples: myCallback, 0

Query Parameters
- tt string  
  0 for initial subscribe, or a valid timetoken to resume/continue/fast-forward.  
  Example: 1231312313123
- tr string  
  Region from the initial or subsequent subscribe response; prevents duplicates by pinning to a data center.
- channel-group string  
  Channel group name(s), comma-separated. Can subscribe to channels, groups, or both.  
  Example: cg1,cg2,cg3
- state string  
  URL-encoded JSON object of state per channel.  
  Example: %7B%22text%22%3A%22hey%22%7D
- heartbeat integer  
  Presence timeout (seconds). Default 300. Presence only; no effect on client performance/integrity.
- auth string  
  Auth key (legacy) or valid Access Manager token authorizing the operation.  
  Example: myAuthKey
- uuid string  
  UTF-8 string up to 92 chars to identify the client.  
  Example: myUniqueUserId
- filter-expr string  
  Filter expression for message filtering.  
  Example: uuid%20!%3D%20%27cvc1%27
- signature string  
  Signature validating the request using the secret key for the subscribe key. If Access Manager is enabled, either a valid authorization token or a signature is required. See Access Manager for signature computation.
- timestamp integer  
  Unix epoch timestamp used as a nonce for signature computation; must be within ±60s of NTP. Required if signature is supplied.