# Publish message to channel

Publish JSON to a channel using a GET request.

## Path Parameters

- `pub_key` string — REQUIRED  
  Your app’s publish key from Admin Portal.  
  Example: `pub-c-50264475-1902-558x-b37b-56d7fb64bf45`

- `sub_key` string — REQUIRED  
  Your app's subscribe key from Admin Portal.  
  Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`

- `channel` string — REQUIRED  
  Channel ID to publish to.  
  Example: `myChannel`

- `callback` string — REQUIRED  
  JSONP callback name to wrap the function. Use `0` for no callback.  
  Example (callback): `myCallback`  
  Example (no callback): `0`

- `payload` string — REQUIRED  
  URL-encoded JSON. Max size: 32 KiB.  
  Example: `%7B%22text%22%3A%22hey%22%7D`

## Query Parameters

- `store` integer  
  Override message saving: `1` to save, `0` not to save.

- `auth` string  
  Auth key (legacy) or valid token (Access Manager) to authorize if access control is enabled.  
  Example: `myAuthKey`

- `meta` string  
  Additional info for stream filtering. Must be JSON-stringified and URI-encoded.  
  Example: `%7B%22cool%22%3A%22meta%22%7D`

- `uuid` string  
  UTF-8 string up to 92 characters to identify the client.  
  Example: `myUniqueUserId`

- `ttl` number  
  Per-message time-to-live (hours) for Message Persistence.

  Integer values:
  - If `store=1` and `ttl=0`: store using the subscribe key’s configured TTL.
  - If `store=1` and `ttl=X` (integer): store with expiry `X` hours unless keyset retention is Unlimited.
  - If `store=0`: `ttl` is ignored.
  - If not specified: defaults to the subscribe key’s expiry.

  Float values:
  - If `store=1` and `ttl <= 0`: store using the subscribe key’s configured TTL.
  - If `store=1` and `ttl >=` the subscribe key’s configured TTL: store using the subscribe key’s configured TTL.
  - If `store=1` and `ttl=X` (float): store with expiry `X` hours (e.g., `0.5` = 30 minutes) unless keyset retention is Unlimited.
  - If `store=0`: `ttl` is ignored.
  - If not specified: defaults to the subscribe key’s expiry.

  Example: `0.5`

- `signature` string  
  Request signature computed with the secret key associated with the subscribe key. If Access Manager is enabled, either a valid authorization token or a signature is required. See Access Manager docs for signature computation.

- `timestamp` integer  
  Unix epoch timestamp used as a nonce for signature computation. Must be within ±60 seconds of NTP. Required if `signature` is supplied.

- `custom_message_type` string  
  User-specified message type, 3–50 characters; case-sensitive alphanumeric with only `-` and `_` allowed.  
  Allowed: `[a-zA-Z0-9-_*]`

## Responses

- `200` OK
- `400` Bad Request
- `403` Forbidden
- `413` Message payload is too large (>= 32 KiB)
- `429` Request rate limit exceeded  
  Schema fields (optional):
  - `status` integer
  - `error` boolean
  - `message` string