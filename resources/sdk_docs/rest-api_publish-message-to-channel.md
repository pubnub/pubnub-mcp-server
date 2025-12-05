# Publish message to channel

Publish JSON to a channel using a GET request.

#### Path Parameters

- `pub_key` (string) — REQUIRED  
  Your app’s publish key from Admin Portal.  
  Example: `pub-c-50264475-1902-558x-b37b-56d7fb64bf45`

- `sub_key` (string) — REQUIRED  
  Your app's subscribe key from Admin Portal.  
  Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`

- `channel` (string) — REQUIRED  
  The channel ID to perform the operation on.  
  Example: `myChannel`

- `callback` (string) — REQUIRED  
  JSONP callback name. Use `0` for no callback.  
  Example (myCallback): `myCallback`  
  Example (zero): `0`

- `payload` (string) — REQUIRED  
  URL-encoded JSON. Max size: 32 KiB.  
  Example: `%7B%22text%22%3A%22hey%22%7D`

#### Query Parameters

- `store` (integer)  
  Overrides default message persistence. `1` to save, `0` not to save.

- `auth` (string)  
  Auth key (legacy) or a valid token used to authorize the operation if access control is enabled.

- `meta` (string)  
  JSON with additional information for stream filtering. Must be JSON-stringified and URI-encoded.  
  Example: `%7B%22cool%22%3A%22meta%22%7D`

- `uuid` (string)  
  UTF-8 string up to 92 characters used to identify the client.  
  Example: `myUniqueUserId`

- `ttl` (number)  
  Per-message time-to-live (hours) for Message Persistence. Accepts integer or float.
  - Integer values:
    - If `store=1` and `ttl=0`: uses subscribe key’s configured TTL.
    - If `store=1` and `ttl=X` (integer): expires in `X` hours unless keyset retention is Unlimited.
    - If `store=0`: `ttl` is ignored.
    - If omitted: defaults to subscribe key’s TTL.
  - Float values:
    - If `store=1` and `ttl <= 0`: uses subscribe key’s configured TTL.
    - If `store=1` and `ttl >=` subscribe key’s configured TTL: uses configured TTL.
    - If `store=1` and `ttl=X` (float): expires in `X` hours (e.g., `0.5` = 30 minutes) unless retention is Unlimited.
    - If `store=0`: `ttl` is ignored.
    - If omitted: defaults to subscribe key’s TTL.  
  Example: `0.5`

- `signature` (string)  
  Signature verifying the request was signed with the secret key for the subscribe key. If Access Manager is enabled, either a valid authorization token or a signature is required. See Access Manager docs for signature computation.

- `timestamp` (integer)  
  Unix epoch timestamp used as a nonce for signature computation. Must be within ±60 seconds of NTP. Required if `signature` is supplied.

- `custom_message_type` (string)  
  User-specified message type; length 3–50, case-sensitive alphanumeric with `-` and `_` allowed.  
  Allowed pattern: [a-zA-Z0-9-_*]

#### Responses

- `200` OK  
  Example Response
  ```
  [
    1,
    "Sent",
    "14375220012064619"
  ]
  ```

- `400` Bad Request  
  Example Response
  ```
  [
    0,
    "Wildcard maximum depth exceeded",
    "16866840224081436"
  ]
  ```

- `403` Forbidden  
  Example Response
  ```
  [
    0,
    "Forbidden"
  ]
  ```

- `413` Message payload is too large (>=32KiB)  
  Example Response
  ```
  [
    0,
    "Request Entity Too Large"
  ]
  ```

- `429` Request rate limit exceeded  
  Schema may include: `status` (integer), `error` (boolean), `message` (string).