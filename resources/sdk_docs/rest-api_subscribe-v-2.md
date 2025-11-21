# Subscribe V2

Subscribe V2 returns messages newer than the timetoken you pass. To maintain continuity:
- Start with an initial subscribe using tt=0.
- On subsequent calls, set tr to the last received r to remain on the same data center and avoid duplicates.

Success responses include message envelopes and metadata. When subscribed to a channel group myCG and a message arrives from member channel myCH: b contains "myCG" and c contains "myCH".

Message type is denoted by e:
- 0 or absent: regular message
- 1: Signal
- 2: Objects
- 3: Message Actions (includes action details and the issuing UUID in i)
- 4: Files

Always design subscribe logic to retry on failure (exponential or constant backoff is acceptable). On each failure, fire the error callback so callers can unsubscribe if needed.

### Path Parameters
- sub_key string — REQUIRED  
  Your app's subscribe key from Admin Portal.
- channel string — REQUIRED  
  The channel ID(s) to subscribe to. Use comma to subscribe to multiple channels. If subscribing to no channels (only channel groups), use a comma char (,) as a placeholder.  
  Example:  
  `myChannel`
- callback string — REQUIRED  
  JSONP callback name. Use 0 for no callback.  
  Example (myCallback):  
  `myCallback`  
  Example (zero):  
  `0`

### Query Parameters
- tt string  
  0 for initial subscribe, or a valid timetoken to resume/continue/fast-forward.  
  Example:  
  `1231312313123`
- tr string  
  Region value returned from the previous subscribe call. Keeps you on the same data center to prevent duplicates.
- channel-group string  
  Channel group name(s), comma-separated.  
  Example:  
  `cg1,cg2,cg3`
- state string  
  Sets Presence state (URL-encoded JSON).  
  Example:  
  `%7B%22text%22%3A%22hey%22%7D`
- heartbeat integer  
  Presence timeout (default 300). Used only for Presence heartbeats.
- auth string  
  Auth key (legacy) or a valid token for Access Manager–protected resources.  
  Example:  
  `myAuthKey`
- uuid string  
  UTF-8 string (≤92 chars) identifying the client.  
  Example:  
  `myUniqueUserId`
- filter-expr string  
  Subscribe filter expression.  
  Example:  
  `uuid%20!%3D%20%27cvc1%27`
- signature string  
  Request signature used with Access Manager. If Access Manager is enabled, either a valid authorization token or a signature is required. See Access Manager docs for signature computation.
- timestamp integer  
  Unix epoch used as nonce for signature. Must be within ±60s of NTP. Required if signature is supplied.

### Success Responses

On success, an object is returned.

If you are subscribed to a channel group named myCG, and you receive a message on myCG from a member channel named myCH, b will contain "myCG", and c will contain "myCH".

Each time a message action is added or removed, a specially-structured action event message is published on the same channel as the parent message with e=3. The event body shows whether the action was added or removed, the action data, and the UUID in i.

#### 200 Success

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
  - t string — OPTIONAL — the timetoken
  - r integer — OPTIONAL — the region
- m object[] — OPTIONAL
  - a string — OPTIONAL — Shard
  - f integer — OPTIONAL — Flags
  - e integer — OPTIONAL — Message type: 1 Signal, 2 Objects, 3 MessageAction, 4 Files
  - i string — OPTIONAL — Issuing Client Id
  - s integer — OPTIONAL — Sequence number
  - p object — OPTIONAL — Publish Timetoken Metadata
    - t string — OPTIONAL
    - r integer — OPTIONAL
  - k string — OPTIONAL — Subscribe Key
  - c string — OPTIONAL — Channel
  - d string — OPTIONAL — The payload
  - b string — OPTIONAL — Subscription match or the channel group
  - cmt string — OPTIONAL — Published custom message type data if query parameter set

### Error Responses

Non-200 HTTP status codes indicate errors. For unparseable JSON or uncommon errors, assume failure, invoke error callback with available info, wait 1 second, and retry indefinitely.

- 400 Bad Request

  Schema — OPTIONAL  
  - status integer — OPTIONAL  
  - service string — OPTIONAL  
  - error boolean — OPTIONAL  
  - message string — OPTIONAL

- 403 Unauthorized access

  Schema — OPTIONAL  
  - message string — OPTIONAL  
  - payload object — OPTIONAL  
  - channels string[] — OPTIONAL  
  - error boolean — OPTIONAL  
  - service string — OPTIONAL  
  - status integer — OPTIONAL

- 413 Request Entity too large (larger than 64 bytes).

  Schema — OPTIONAL  
  - status integer — OPTIONAL  
  - service string — OPTIONAL  
  - error boolean — OPTIONAL  
  - message string — OPTIONAL

- 429 Request rate limit exceeded.

  Schema — OPTIONAL  
  - status integer — OPTIONAL  
  - error boolean — OPTIONAL  
  - message string — OPTIONAL