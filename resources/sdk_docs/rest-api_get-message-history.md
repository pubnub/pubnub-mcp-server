# Get message history

Fetch historical messages from one or multiple channels with control over time range and included fields.

- start only: returns messages older than start (start is exclusive).
- end only: returns messages from end and newer (end is inclusive).
- both start and end: returns messages between them (end inclusive).

Limits:
- Single channel: up to 100 messages.
- Multiple channels: up to 25 messages (batch history supports up to 500 channels).
- To retrieve more, make iterative calls and adjust start timetoken.

## Path Parameters

- sub_key (string, required) — Your app's subscribe key. Example: `sub-c-50264475-1902-558x-d213-7p19052012n2`
- channels (string, required) — Comma-separated channel names. Example: `ch1,ch2`

## Query Parameters

- start (number) — Start timetoken (exclusive). If not provided, defaults to current time. Example: `123323123123123`
- end (number) — End timetoken (inclusive). Example: `123323123123123`
- max (integer) — Max messages to return. Defaults/max: 100 for 1 channel, 25 for multiple channels or when retrieving message actions. Example: `25`
- include_meta (boolean) — Include publish meta field. Default: false. Example: `true`
- include_uuid (boolean) — Include uuid of publisher. Default: false. Example: `true`
- include_message_type (boolean) — Include PubNub message type. Default: false. Example: `true`
- include_custom_message_type (boolean) — Include custom message type. Default: false. Example: `true`
- encode_channels (boolean) — Encode channel names in response. Default: true. Example: `true`
- auth (string) — Auth key (legacy) or Access Manager token when access control is enabled. Example: `p0thisAkFl043rhDdHRsCkNyZXisRBjoERtZXRhoENzaWdYIGOAeTyWGJI`
- uuid (string) — Client identifier, up to 92 UTF-8 chars. Example: `myUniqueUserId`
- signature (string) — Signature using secret key for request verification; required if using signature-based auth. If Access Manager is enabled, provide either a valid token or a signature.
- timestamp (integer) — Unix epoch used as nonce for signature; required when signature is supplied. Must be within ±60 seconds of NTP.

## Responses

- 200 Success
  - status (integer)
  - error (boolean)
  - error_message (string)
  - channels (object)

Example Response
```
{
  "status": 200,
  "error": false,
  "error_message": "",
  "channels": {
    "demo-channel": [
      {
        "message": "Hello world",
        "timetoken": "15610547826970040",
        "uuid": "my-uuid",
        "message_type": 0,
        "meta": {
          "some-meta-key": "some_value"
        },
        "custom_message_type": "custom-user-msg-type"
      }
    ]
  }
}
```

- 400 Invalid request
  - status (integer) Example: `400`
  - error (boolean) Example: `true`
  - error_message (string) Example: `"Invalid Arguments: start"`
  - channels (object) Example: `{}`

- 403 Do not have permission
  - status (integer) Example: `403`
  - error (boolean) Example: `true`
  - error_message (string) Example: `"Do not have permission to delete"`