# Subscribe V2

To receive messages, issue at least two subscribe requests:
- Initial request with tt=0.
- Subsequent requests using the last response’s t.t as tt and t.r as tr to stay on the same region and avoid duplicates.

The subscribe call returns messages newer than the tt you pass. Always set tr to the last received r.

Success responses return an object (see Responses). When subscribed to a channel group myCG and receiving a message on member channel myCH, b is "myCG" and c is "myCH".

Message types (e):
- 0 or missing: regular message
- 1: Signal
- 2: Objects
- 3: Message Actions
- 4: Files

Message Actions: Action events are published on the same channel as the parent message and appear in the subscribe stream with e=3. The event indicates added/removed, includes the action data, and the UUID that performed it in i.

Error handling: On non-200, retry indefinitely with a 1-second delay. Design subscribe logic to be durable; developers can still unsubscribe as needed.

Path Parameters
- sub_key string — REQUIRED
  Your app's subscribe key from Admin Portal.
- channel string — REQUIRED
  Comma-separated channel IDs. Use a single comma (,) as a placeholder when subscribing only to channel groups. You may subscribe to channels, channel groups, or both. Example: myChannel
- callback string — REQUIRED
  JSONP callback name. Use 0 for no callback. Examples: myCallback or 0

Query Parameters
- tt string
  0 for the initial subscribe; otherwise a valid timetoken to resume/continue/fast-forward. Example: 1231312313123
- tr string
  Region from the previous response. Prevents duplicate messages by sticking to the same data center.
- channel-group string
  Comma-separated channel group names. Example: cg1,cg2,cg3
- state string
  Percent-encoded JSON object of state per channel. Example: %7B%22text%22%3A%22hey%22%7D
- heartbeat integer
  Presence timeout (seconds). Default 300. Presence-only; no effect on client performance.
- auth string
  Access Manager auth key or token if protected. Example: myAuthKey
- uuid string
  UTF-8 string up to 92 chars identifying the client. Example: myUniqueUserId
- filter-expr string
  Subscribe filter expression. Example: uuid%20!%3D%20%27cvc1%27
- signature string
  Request signature. Required if using signature-based auth. Provide timestamp as well. See Access Manager docs.
- timestamp integer
  Unix epoch used as nonce for signature, within ±60 seconds of NTP. Required when signature is supplied.

Responses
200 Success

Body (For normal messages)
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

Body (For messages of type Signal)
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

Body (For messages of type Objects)
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

Body (For messages of type Message Actions)
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

Body (For messages of type Files)
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

Body (For normal messages)
```
{
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
```

Body (For messages of type Signal)
```
{
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
```

Body (For messages of type Objects)
```
{
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
```

Body (For messages of type Message Actions)
```
{
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
```

Body (For messages of type Files)
```
{
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
```

t Type: object
- t string — timetoken
- r integer — region

m Type: array of objects
- a string — shard
- f integer — flags
- e integer — message type (1 Signal, 2 Objects, 3 MessageAction, 4 Files)
- i string — issuing client UUID
- s integer — sequence number
- p object — publish timetoken metadata
  - t string
  - r integer
- k string — subscribe key
- c string — channel
- d string/object — payload
- b string — subscription match (channel group)
- cmt string — published custom message type (if set)

Example Response
```
{
  "t": {
    "t": "96137360022444528",
    "r": 4
  },
  "m": [
    {
      "a": "1",
      "f": 514,
      "i": "pn-0ca50551-4bc8-446e-8829-c70b704545fd",
      "s": 1,
      "p": {
        "t": "0",
        "r": 4
      },
      "k": "demo",
      "c": "my-channel",
      "d": "my message",
      "b": "my-channel",
      "cmt": "chat_custom_message_type"
    }
  ]
}
```

Error Responses
- 400 Bad Request
  - status integer
  - service string
  - error boolean
  - message string
- 403 Unauthorized access
  - message string
  - payload object
  - channels string[]
  - error boolean
  - service string
  - status integer
- 413 Request Entity too large (larger than 64 bytes)
  - status integer
  - service string
  - error boolean
  - message string
- 429 Request rate limit exceeded
  - status integer
  - error boolean
  - message string

Security
- If Access Manager is enabled, pass either a valid authorization token (auth) or a signature with timestamp.