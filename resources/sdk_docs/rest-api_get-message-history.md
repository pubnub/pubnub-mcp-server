# Get message history

Fetch historical messages from one or multiple channels within a specified time interval.

- start only: returns messages older than the start timetoken (start is exclusive).
- end only: returns messages from that end timetoken and newer (end is inclusive).
- start and end: returns messages between timetokens (end inclusive).

Limits:
- Single channel: up to 100 messages per request.
- Multiple channels: up to 25 messages per request (batch history supports up to 500 channels).
- For more messages, make iterative calls, adjusting the start timetoken.

## Path Parameters

- `sub_key` string — REQUIRED  
  Your app's subscribe key from Admin Portal.  
  Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`

- `channels` string — REQUIRED  
  Comma-separated channel names.  
  Example: `ch1,ch2`

## Query Parameters

- `start` number  
  Timetoken delimiting the start of the time slice (exclusive). Provide to page backward or to define a slice with `end`.  
  Example: `123323123123123`

- `end` number  
  Timetoken delimiting the end of the time slice (inclusive). Provide to page forward or to define a slice with `start`.  
  Example: `123323123123123`

- `max` integer  
  Max messages to return. Defaults to 100 for a single channel, 25 for multiple channels or when retrieving message actions. Batch history limited to 500 channels.  
  Example: `25`

- `include_meta` boolean  
  Include metadata published with messages. Default: false.  
  Example: `true`

- `include_uuid` boolean  
  Include UUID published with messages. Default: false.  
  Example: `true`

- `include_message_type` boolean  
  Include PubNub message type. Default: false.  
  Example: `true`

- `include_custom_message_type` boolean  
  Include custom message type. Default: false.  
  Example: `true`

- `encode_channels` boolean  
  Encode channel names in the response. Default: true.  
  Example: `true`

- `auth` string  
  Auth key (legacy) or Access Manager token to authorize the operation if access control is enabled.  
  Example: `authKey / p0thisAkFl043rhDdHRsCkNyZXisRBjoERtZXRhoENzaWdYIGOAeTyWGJI`

- `uuid` string  
  UTF-8 string (up to 92 chars) identifying the client.  
  Example: `myUniqueUserId`

- `signature` string  
  Signature to verify the request with the secret key associated with the subscribe key. If Access Manager is enabled, supply a valid token or a signature. See Access Manager for signature computation details.

- `timestamp` integer  
  Unix epoch timestamp used as a nonce for signature computation, within ±60s of NTP. Required if `signature` is supplied.

## Responses

- 200 Success  
  Schema (optional):  
  - `status` integer  
  - `error` boolean  
  - `error_message` string  
  - `channels` object

- 400 Invalid request  
  Schema (optional):  
  - `status` integer  
  - `error` boolean  
  - `error_message` string  
  - `channels` object

- 403 Do not have permission  
  Schema (optional):  
  - `status` integer  
  - `error` boolean  
  - `error_message` string