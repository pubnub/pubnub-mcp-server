# Get message history

Fetch historical messages from one or multiple channels with control over time range and included fields.

- start only: returns messages older than start (start is exclusive).
- end only: returns messages from end and newer (end is inclusive).
- start and end: returns messages between them (end inclusive).
- Limits: max 100 messages for a single channel; 25 messages when querying multiple channels; batch history limited to 500 channels. For more results, paginate by adjusting start (or end) across iterative calls.

## Path Parameters

- sub_key string — REQUIRED  
  Your app's subscribe key from Admin Portal.  
  Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`

- channels string — REQUIRED  
  Comma-separated channel names.  
  Example: `ch1,ch2`

## Query Parameters

- start number  
  Start timetoken (exclusive). Use to page older messages or define a start of a slice.  
  Example: `123323123123123`

- end number  
  End timetoken (inclusive). Use to page newer messages or define an end of a slice.  
  Example: `123323123123123`

- max integer  
  Max messages to return. Default and max are 100 for a single channel, 25 for multiple channels (or when retrieving message actions). Batch history limited to 500 channels.  
  Example: `25`

- include_meta boolean  
  Include publish-time metadata. Default false.  
  Example: `true`

- include_uuid boolean  
  Include uuid published with the message. Default false.  
  Example: `true`

- include_message_type boolean  
  Include PubNub message type. Default false.  
  Example: `true`

- include_custom_message_type boolean  
  Include custom message type. Default false.  
  Example: `true`

- encode_channels boolean  
  Encode channel names in the response. Default true.  
  Example: `true`

- auth string  
  Auth key (legacy) or Access Manager token. Required if access control is enabled.  
  Example: `authKey / p0thisAkFl043rhDdHRsCkNyZXisRBjoERtZXRhoENzaWdYIGOAeTyWGJI`

- uuid string  
  Client identifier (UTF-8, up to 92 chars).  
  Example: `myUniqueUserId`

- signature string  
  Request signature for Access Manager (alternative to token). See Access Manager docs for computing signatures.

- timestamp integer  
  Unix epoch used as nonce for signature; must be within ±60s of NTP. Required when signature is supplied.

## Responses

- 200 Success  
  Schema fields (optional): `status` integer, `error` boolean, `error_message` string, `channels` object

- 400 Invalid request  
  Schema fields (optional): `status` integer, `error` boolean, `error_message` string, `channels` object

- 403 Do not have permission  
  Schema fields (optional): `status` integer, `error` boolean, `error_message` string, `channels` object