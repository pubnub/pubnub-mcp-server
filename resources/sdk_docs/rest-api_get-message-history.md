# Get message history (REST API)

Fetch historical messages for one or more channels with controllable time range and payload options.

• `start` only → messages *older than* `start` (exclusive)  
• `end` only   → messages *newer than/including* `end` (inclusive)  
• `start` + `end` → messages between them (`start` exclusive, `end` inclusive)  

Message limits:  
• 1 channel → up to **100** messages per call  
• 2–500 channels → up to **25** messages per channel per call  
Iterate with new `start` to page through history.

---

## HTTP Request

`GET /v3/history/sub-key/{sub_key}/channel/{channels}`

| Path parameter | Type | Required | Description |
|----------------|------|----------|-------------|
| `sub_key` | string | ✓ | App subscribe key. |
| `channels` | string | ✓ | Comma-separated channel list. |

---

## Query Parameters

| Name | Type | Default | Notes |
|------|------|---------|-------|
| `start` | number | — | Timetoken (exclusive). |
| `end` | number | — | Timetoken (inclusive). |
| `max` | integer | 100 (1 ch) / 25 (multi) | Upper limit of messages returned. |
| `include_meta` | boolean | `false` | Include published `meta`. |
| `include_uuid` | boolean | `false` | Include publisher `uuid`. |
| `include_message_type` | boolean | `false` | Include PubNub message type. |
| `include_custom_message_type` | boolean | `false` | Include custom message type. |
| `encode_channels` | boolean | `true` | URL-encode channel names in response. |
| `auth` | string | — | Auth Key or Access Manager token. |
| `uuid` | string | — | Caller UUID (≤ 92 UTF-8 chars). |
| `signature` | string | — | HMAC signature (Access Manager v2). |
| `timestamp` | integer | — | Epoch seconds (±60 s) when `signature` supplied. |

---

## Example

```bash
curl -X GET \
"https://ps.pndsn.com/v3/history/sub-key/sub-c-50264475-1902-558x-d213-7p19052012n2/channel/ch1,ch2\
?start=15463008000000000&end=15463872000000000&max=25&include_meta=true"
```

---

## Responses

### 200 OK
```json
{
  "status": 200,
  "error": false,
  "channels": {
    "ch1": [
      {
        "message": { ... },
        "timetoken": "15463008001234567",
        "meta": { ... },
        "uuid": "alice",
        "message_type": 0,
        "custom_message_type": 1
      }
    ],
    "ch2": [ ... ]
  }
}
```

### 400 Invalid request / 403 Forbidden
Same schema as above with `error` = true and `error_message`.