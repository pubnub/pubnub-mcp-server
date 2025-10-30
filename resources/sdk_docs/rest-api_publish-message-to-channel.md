# Publish message to channel

Publish JSON to a channel using a GET request.

Endpoint
```
GET /publish/{pub_key}/{sub_key}/0/{channel}/{callback}/{payload}
```

## Path Parameters

- pub_key string — REQUIRED  
  Your app’s publish key from Admin Portal.  
  Example:
  ```
  pub-c-50264475-1902-558x-b37b-56d7fb64bf45
  ```

- sub_key string — REQUIRED  
  Your app’s subscribe key from Admin Portal.  
  Example:
  ```
  sub-c-50264475-1902-558x-d213-7p19052012n2
  ```

- channel string — REQUIRED  
  The channel ID to perform the operation on.  
  Example:
  ```
  myChannel
  ```

- callback string — REQUIRED  
  The JSONP callback name to wrap the function in. Use `0` for no callback.  
  Example (myCallback):
  ```
  myCallback
  ```
  Example (zero):
  ```
  0
  ```

- payload string — REQUIRED  
  URL-encoded JSON. Payload size cannot be more than 32KiB.  
  Example:
  ```
  %7B%22text%22%3A%22hey%22%7D
  ```

## Query Parameters

- store integer  
  Overrides default account configuration on message saving. `1` to save, `0` not to save.

- auth string  
  Either the auth key (Access Manager legacy) or a valid token (Access Manager) used to authorize the operation if access control is enabled.  
  Example:
  ```
  myAuthKey
  ```

- meta string  
  JSON with additional information for stream filtering. Value must be JSON-stringified and URI-encoded.  
  Example:
  ```
  %7B%22cool%22%3A%22meta%22%7D
  ```

- uuid string  
  UTF-8 encoded string up to 92 characters used to identify the client.  
  Example:
  ```
  myUniqueUserId
  ```

- ttl number  
  Per-message time-to-live (hours) in Message Persistence. Accepts integer or floating-point numbers.

  For Integer values:
  - If store = `1`, and `ttl` = `0`, the message is stored with your subscribe key’s configured TTL.
  - If store = `1`, and `ttl` = `X` (X is an Integer), the message is stored with an expiry time of `X` hours unless you have message retention set to Unlimited on your keyset configuration in the Admin Portal.
  - If store = `0`, the `ttl` parameter is ignored.
  - If `ttl` is not specified, expiration of the message defaults back to the expiry value of the subscribe key.

  For Float values:
  - If store = `1`, and `ttl` <= `0`, the message is stored with your subscribe key's configured TTL.
  - If store = `1`, and `ttl` >= your subscribe key's configured TTL, the message is stored with your subscribe key's configured TTL.
  - If store = `1`, and `ttl` = `X` (X is a Float), the message is stored with an expiry time of `X` hours (for example, `0.5` = 30 minutes) unless you have message retention set to Unlimited on your keyset configuration in the Admin Portal.
  - If store = `0`, the `ttl` parameter is ignored.
  - If `ttl` is not specified, expiration of the message defaults back to the expiry value of the subscribe key.

  Example:
  ```
  0.5
  ```

- signature string  
  Signature used to verify that the request was signed with the secret key associated with the subscribe key. If Access Manager is enabled, either a valid authorization token or a signature are required. See Access Manager documentation for signature computation.

- timestamp integer  
  Unix epoch timestamp used as a nonce for signature computation. Must have no more than ±60 seconds offset from NTP. Required if the `signature` parameter is supplied.

- custom_message_type string  
  User-specified message type string. Length 3–50. Case-sensitive alphanumeric; only `-` and `_` allowed.  
  Allowed set:
  ```
  [a-zA-Z0-9-_*]
  ```

## Responses

- 200 OK
- 400 Bad Request
- 403 Forbidden
- 413 Message payload is too large (>=32KiB)
- 429 Request rate limit exceeded  
  Optional fields:
  - status integer
  - error boolean
  - message string