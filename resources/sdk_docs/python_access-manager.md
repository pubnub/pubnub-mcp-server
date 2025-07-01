# Access Manager v3 – Python SDK (condensed)

Jump to:  
[Sync vs Async](#sync-async) · [Grant Token (Channels/Groups/UUIDs)](#grant-token) · [Grant Token (Spaces/Users)](#grant-token-spaces-users) · [Revoke Token](#revoke-token) · [Parse Token](#parse-token) · [Set Token](#set-token)

---

## <a name="sync-async"></a>Request execution

```python
# synchronous – returns Envelope(result, status)
env = pubnub.publish()\
    .channel("myChannel")\
    .message("Hello from PubNub Python SDK")\
    .sync()

# asynchronous – result, status passed to callback
def cb(result, status):
    print(f'TT: {result.timetoken}, status: {status.category.name}')

pubnub.publish()\
    .channel("myChannel")\
    .message("Hello from PubNub Python SDK")\
    .pn_async(cb)
```

`Envelope.result` type depends on API. `Envelope.status` is `PnStatus`.

User ID (`userId`) is exposed in some APIs as `uuid`.

---

## <a name="grant-token"></a>Grant Token  — Channels, Groups, UUIDs
Requires Access Manager add-on.

Permissions per resource  
• channels: read, write, get, manage, update, join, delete  
• groups:   read, manage  
• uuids:    get, update, delete  

TTL (`ttl`, required): 1–43 200 min (no default).  
Token may be limited to a single `authorized_uuid`.  
Resource lists or RegEx patterns can be mixed in one request.

### Builder API
```python
pubnub.grant_token()\
    .ttl(int)\
    .meta(dict)\
    .authorized_uuid(str)\
    .channels(list[Channel])\
    .groups(list[Group])\
    .uuids(list[UUID])
```

Parameter summary  
ttl* int  | validity (min)  
meta dict | scalar values only  
authorized_uuid str | restrict token to one client  
channels/groups/uuids list | resource list or RegEx pattern  
*ttl is required; at least one resource permission must be supplied.

### Named-argument variant
```python
grant = pubnub.grant_token(
    channels=[
        Channel.id('readonly-channel').read(),
        Channel.id('readwrite-channel').read().write(),
    ],
    authorized_user_id="my-authorized-uuid",
    ttl=15
).sync()
print(grant.result.get_token())
```

### Minimal builder example
```python
envelope = pubnub.grant_token()\
    .channels([
        Channel.id('readonly-channel').read(),
        Channel.id('readwrite-channel').read().write(),
    ])\
    .authorized_uuid("my-authorized-uuid")\
    .ttl(15)\
    .sync()
```

Returned payload:

```json
{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6...GJI"}
```

### More examples
Different permissions in one call:

```python
from pubnub.models.consumer.v3.channel import Channel
from pubnub.models.consumer.v3.group   import Group
from pubnub.models.consumer.v3.uuid    import UUID

channels = [
    Channel.id("channel-a").read(),
    Channel.id("channel-b").read().write(),
    Channel.id("channel-c").read().write(),
    Channel.id("channel-d").read().write()
]
groups = [Group.id("channel-group-b").read()]
uuids  = [
    UUID.id("uuid-c").get(),
    UUID.id("uuid-d").get().update()
]

envelope = pubnub.grant_token()\
    .channels(channels)\
    .groups(groups)\
    .uuids(uuids)\
    .authorized_uuid("my-authorized-uuid")\
    .ttl(15)\
    .sync()
```

Grant via RegEx:

```python
envelope = pubnub.grant_token()\
    .channels(Channel.pattern("channel-[A-Za-z0-9]").read())\
    .authorized_uuid("my-authorized-uuid")\
    .ttl(15)\
    .sync()
```

Error: invalid parameters → HTTP 400; server details are in `envelope.status`.

---

## <a name="grant-token-spaces-users"></a>Grant Token  — Spaces & Users
Same syntax, different resources.

Permissions  
• space: read, write, get, manage, update, join, delete  
• user:  get, update, delete  

```python
pubnub.grant_token()\
    .ttl(int)\
    .meta(dict)\
    .authorized_user(str)\
    .spaces(list[Space])\
    .users(list[User])
```

Examples
```python
envelope = pubnub.grant_token()\
    .authorized_user('some_user_id')\
    .spaces([
        Space().id('some_space_id').read().write(),
        Space().pattern('some_*').read().write()
    ])\
    .ttl(60)\
    .sync()
```

```python
from pubnub.models.consumer.v3.space import Space
from pubnub.models.consumer.v3.user  import User

spaces = [
    Space.id("space-a").read(),
    Space.id("space-b").read().write(),
    Space.id("space-c").read().write(),
    Space.id("space-d").read().write()
]
users = [
    User.id("userId-c").get(),
    User.id("userId-d").get().update()
]

envelope = pubnub.grant_token()\
    .spaces(spaces)\
    .users(users)\
    .authorized_user("my-authorized-userId")\
    .ttl(15)\
    .sync()
```

Return and error behaviour identical to channel variant.

---

## <a name="revoke-token"></a>Revoke Token
Requires *Revoke v3 Token* enabled in Admin Portal.

```python
pubnub.revoke_token("existing_token_string")
```

Returns `Envelope` with `PNRevokeTokenResult`:

```
Revoke token success with status: 200
```

Errors: 400, 403, 503.

---

## <a name="parse-token"></a>Parse Token
Decode permissions for inspection.

```python
pubnub.parse_token("token_string")
```

Sample output (truncated):

```json
{
  "version":2,
  "timestamp":1629394579,
  "ttl":15,
  "authorized_uuid":"user1",
  "resources":{
     "uuids":{
        "user1":{"get":true,"update":true}
     }
  }
}
```

---

## <a name="set-token"></a>Set Token
Client-side update of current auth token.

```python
pubnub.set_token("token_string")
```

No return value.

---

_Last updated: Apr 29 2025_