# Publish message to channel (REST API)

Publish JSON to a channel with an HTTP **GET** request.

```text
GET /publish/{pub_key}/{sub_key}/0/{channel}/{callback}/{payload}
```

## Path parameters (all REQUIRED)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `pub_key` | string | Publish key from the Admin Portal. | `pub-c-50264475-1902-558x-b37b-56d7fb64bf45` |
| `sub_key` | string | Subscribe key from the Admin Portal. | `sub-c-50264475-1902-558x-d213-7p19052012n2` |
| `channel` | string | Channel ID. | `myChannel` |
| `callback` | string | JSONP callback; use `0` for none. | `myCallback` or `0` |
| `payload` | string | URL-encoded JSON ≤ 32 KiB. | `%7B%22text%22%3A%22hey%22%7D` |

## Query parameters

| Parameter | Type | Notes |
|-----------|------|-------|
| `store` | integer | `1` = save, `0` = do not save (overrides account default). |
| `auth` | string | Auth key or JWT. |
| `meta` | string | URI-encoded JSON metadata, e.g. `%7B%22cool%22%3A%22meta%22%7D`. |
| `uuid` | string | Client UUID (≤ 92 UTF-8 chars), e.g. `myUniqueUserId`. |
| `ttl` | number | Per-message TTL (hours). See rules below. |
| `signature` | string | Signature when Access Manager is enabled. |
| `timestamp` | integer | Unix epoch (nonce) required with `signature`; ± 60 s from NTP. |
| `custom_message_type` | string | 3–50 chars, `[a-zA-Z0-9-_]`. |

### TTL behaviour

Integer values  
• `store=1, ttl=0` → default keyset TTL  
• `store=1, ttl=X` → expires in `X` hours (unless keyset retention = Unlimited)  
• `store=0` → `ttl` ignored  
• not specified → default keyset TTL  

Float values  
• `store=1, ttl<=0` → default keyset TTL  
• `store=1, ttl>=keyset TTL` → default keyset TTL  
• `store=1, ttl=X` → expires in `X` hours (e.g. `0.5` = 30 min)  
• `store=0` → `ttl` ignored  
• not specified → default keyset TTL  

## Example requests

With JSONP callback:

```text
GET /publish/pub-c-50264475-1902-558x-b37b-56d7fb64bf45/sub-c-50264475-1902-558x-d213-7p19052012n2/0/myChannel/myCallback/%7B%22text%22%3A%22hey%22%7D
```

Without JSONP (`callback=0`):

```text
GET /publish/pub-c-50264475-1902-558x-b37b-56d7fb64bf45/sub-c-50264475-1902-558x-d213-7p19052012n2/0/myChannel/0/%7B%22text%22%3A%22hey%22%7D
```

## Responses

| HTTP | Description |
|------|-------------|
| `200 OK` | Message published. |
| `400 Bad Request` | Invalid input. |
| `403 Forbidden` | Not authorized. |
| `413 Payload Too Large` | Payload ≥ 32 KiB. |
| `429 Too Many Requests` | Rate limit exceeded. |

Error body (400/403/413/429):

```json
{
  "status": <integer>,
  "error": <boolean>,
  "message": "<string>"
}
```