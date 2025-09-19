# PubNub REST API – Overview (Condensed)

##### Postman Collection
Use the PubNub Postman collection for quick testing:  
https://www.postman.com/pubnub-api/pubnub-s-workspace/collection/l2hxvr2/pubnub-api  

Blog guide: https://www.pubnub.com/blog/announcing-pubnubs-postman-collection/

## Authentication
• No username/password headers.  
• Include `publish` and `subscribe` keys from the Admin Portal.  
• When Access Manager is enabled, pass the `auth` query parameter (key or token).

## Common Query Parameters
| Parameter | Required | Description |
|-----------|----------|-------------|
| `uuid` | Yes | UTF-8 string ≤ 92 chars identifying the client. |
| `auth` | No | Access Manager key/token for protected endpoints. |
| `signature` | No | For Access Manager admin calls (see Signature generation). |
| `pnsdk` | No | Identifies client SDK, e.g., `CompanyABC-JS/1.0`. |

## Common Request Headers
| Header | Value |
|--------|-------|
| `Content-Encoding` | `gzip` (only when sending gzipped POST bodies) |
| `Content-Type` | `application/json; charset=UTF-8` |
| `Accept-Encoding` | `gzip`, `deflate`, `gzip, deflate`, or omit if unsupported |

## Common HTTP Status Codes
• `200` – Success.  
• `403` – Access Manager error (check or remove `auth`).  
• `414` – URI too large (> 32 KiB).