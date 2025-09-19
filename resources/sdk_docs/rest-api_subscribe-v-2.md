# Subscribe V2 (REST)

Subscribe is a long-poll GET request.  
Endpoint:  

```
GET https://ps.pndsn.com/v2/subscribe/{sub_key}/{channel}/0
```

Call flow  
1. First call: `tt=0` (initial timetoken).  
2. Each subsequent call:  
   • Set `tt` to the last value of `t.t` returned.  
   • Set `tr` to the last value of `t.r` returned (keeps you on the same data center and avoids duplicate messages).  
Continue calling immediately after the previous request completes.

---

## Path Parameters (required)

| Name      | Description                                    |
|-----------|------------------------------------------------|
| `sub_key` | Your Subscribe Key (from Admin Portal).        |
| `channel` | Comma-separated channel list. Use a single comma (`,`) when subscribing only to channel groups. |

## Query Parameters

| Name            | Type / Default | Description / Example |
|-----------------|----------------|-----------------------|
| `callback`*     | string / —     | JSONP function name, or `0` for none. |
| `tt`            | string / `0`   | Timetoken to resume from.<br>Example: `1231312313123` |
| `tr`            | string / —     | Region returned by previous subscribe. |
| `channel-group` | string / —     | Comma-separated channel-group list.<br>Example: `cg1,cg2` |
| `state`         | string / —     | URL-encoded JSON state object.<br>Example: `%7B%22text%22%3A%22hey%22%7D` |
| `heartbeat`     | int / `300`    | Presence timeout (seconds). |
| `auth`          | string / —     | Auth key or token. |
| `uuid`          | string / —     | Client UUID (≤ 92 UTF-8 chars). |
| `filter-expr`   | string / —     | Message filter expression.<br>Example: `uuid%20!%3D%20'cvc1'` |
| `signature`     | string / —     | Signature (required if Access Manager & no token). |
| `timestamp`     | int / —        | Unix epoch used when `signature` is present. |

\*`callback` is mandatory even when using `0`.

---

## Message Types (`e` field)

| `e` | Type            |
|-----|-----------------|
| 0 / missing | Standard message |
| 1   | Signal          |
| 2   | Objects         |
| 3   | Message Action  |
| 4   | Files           |

Message actions (add/remove) are delivered as standard subscribe events with `e = 3`; the acting `uuid` is in field `i`.

---

## Success Response 200

Common envelope:

```
{
  "t": {         // subscribe cursor
    "t": "<timetoken>",
    "r": <region>
  },
  "m": [         // array of messages
    {
      "a": "1",            // shard
      "f": 0,              // flags
      "e": 0,              // message type (see table above)
      "i": "<uuid>",       // publishing client
      "s": 1,              // sequence
      "p": {               // publish metadata
        "t": "<pub_timetoken>",
        "r": <region>
      },
      "k": "<sub_key>",
      "c": "<channel>",    // channel
      "b": "<cg>",         // channel-group if any
      "d": <payload>,      // message payload
      "cmt": "<custom>"    // optional message-type
    }
  ]
}
```

Sample bodies:

##### Normal Message
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
...
```

##### Signal (`e = 1`)
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
...
```

##### Objects (`e = 2`)
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
...
```

##### Message Actions (`e = 3`)
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
...
```

##### Files (`e = 4`)
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
...
```

---

## Error Responses

| HTTP | Meaning                       | Notes                              |
|------|-------------------------------|------------------------------------|
| 400  | Bad Request                   | Malformed parameters.              |
| 403  | Unauthorized                  | Invalid or missing auth / signature|
| 413  | Payload Too Large (>64 KB)    |                                    |
| 429  | Rate limit exceeded           |                                    |

On non-200 responses: invoke error callback, wait 1 s, and retry indefinitely (or until the app decides to unsubscribe).

---

## Schema (all fields optional unless noted)

`t.t`   — cursor timetoken (string)  
`t.r`   — region (int)  
`m[]`   — array of message objects  
Within `m[]` objects:  

• `a`  shard (string)  
• `f`  flags (int)  
• `e`  message type (int, see table)  
• `i`  issuing client UUID (string)  
• `s`  sequence number (int)  
• `p.t` publish timetoken (string)  
• `p.r` publish region (int)  
• `k`  subscribe key (string)  
• `c`  channel name (string)  
• `b`  channel group (string)  
• `d`  payload (JSON)  
• `cmt` custom message type (string)  

---

Implement robust retry logic, always using the latest `t.t` and `t.r` returned.