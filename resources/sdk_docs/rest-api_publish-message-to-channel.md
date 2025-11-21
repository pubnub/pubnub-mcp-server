# Publish message to channel

Publish JSON to a channel using the GET request.

## Path Parameters
- `pub_key` string — REQUIRED  
  Your app’s publish key from Admin Portal.  
  Example: `pub-c-50264475-1902-558x-b37b-56d7fb64bf45`
- `sub_key` string — REQUIRED  
  Your app's subscribe key from Admin Portal.  
  Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`
- `channel` string — REQUIRED  
  The channel ID to perform the operation on.  
  Example: `myChannel`
- `callback` string — REQUIRED  
  JSONP callback name to wrap the function in. Use `0` for no callback.  
  Example (myCallback): `myCallback`  
  Example (zero): `0`
- `payload` string — REQUIRED  
  URL-encoded JSON. Payload size cannot be more than 32KiB.  
  Example: `%7B%22text%22%3A%22hey%22%7D`

## Query Parameters
- `store` integer  
  Overrides default message saving. `1` to save, `0` not to save.
- `auth` string  
  Auth key (legacy) or valid token (Access Manager) to authorize the operation if access control is enabled.  
  Example: `myAuthKey`
- `meta` string  
  JSON with additional information for stream filtering. Must be JSON-stringified and URI-encoded.  
  Example: `%7B%22cool%22%3A%22meta%22%7D`
- `uuid` string  
  UTF-8 string (max 92 chars) used to identify the client.  
  Example: `myUniqueUserId`
- `ttl` number  
  Per-message time-to-live in Message Persistence. Accepts integers and floats.

  For Integer values:
  - If `store = 1` and `ttl = 0`, message is stored with your subscribe key’s configured TTL.
  - If `store = 1` and `ttl = X` (Integer), message expires in `X` hours unless message retention is Unlimited on the keyset.
  - If `store = 0`, `ttl` is ignored.
  - If `ttl` is not specified, expiration defaults to the subscribe key’s configured TTL.

  For Float values:
  - If `store = 1` and `ttl <= 0`, message is stored with your subscribe key's configured TTL.
  - If `store = 1` and `ttl >=` your subscribe key's configured TTL, message is stored with your subscribe key's configured TTL.
  - If `store = 1` and `ttl = X` (Float), message expires in `X` hours (e.g., `0.5` = 30 minutes) unless message retention is Unlimited on the keyset.
  - If `store = 0`, `ttl` is ignored.
  - If `ttl` is not specified, expiration defaults to the subscribe key’s configured TTL.

  Example: `0.5`
- `signature` string  
  Signature verifying the request was signed with the secret key associated with the subscribe key. If Access Manager is enabled, either a valid authorization token or a signature is required. See Access Manager docs for signature computation.
- `timestamp` integer  
  Unix epoch used as a nonce for signature computation. Must be within ±60 seconds of NTP. Required if `signature` is supplied.
- `custom_message_type` string  
  Possible values: length 3–50; allowed chars: `[a-zA-Z0-9-_*]`. Case-sensitive user-specified message type.

## Responses
- `200` OK  
  Schema — OPTIONAL `undefined[]`
- `400` Bad Request  
  Schema — OPTIONAL `undefined[]`
- `403` Forbidden  
  Schema — OPTIONAL `undefined[]`
- `413` Message payload is too large (>=32KiB)  
  Schema — OPTIONAL `undefined[]`
- `429` Request rate limit exceeded  
  Schema — OPTIONAL  
  - `status` integer — OPTIONAL  
  - `error` boolean — OPTIONAL  
  - `message` string — OPTIONAL

Links:
- Admin Portal: https://admin.pubnub.com
- Access Manager: /docs/general/security/access-control
- Access Manager introduction: /docs/sdks/rest-api/access-manager-introduction
- Users and devices (UUID): /docs/general/setup/users-and-devices