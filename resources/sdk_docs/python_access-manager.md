# PubNub Python SDK – Access Manager v3 (condensed)

## Request execution

`.sync()` – returns `Envelope` (`Envelope.result`, `Envelope.status : PNStatus`).

```
`pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .sync()  
`
```

`.pn_async(callback)` – returns `None`, delivers the same two values to the callback.

```
`def my_callback_function(result, status):  
    print(f'TT: {result.timetoken}, status: {status.category.name}')  
  
pubnub.publish() \  
    .channel("myChannel") \  
    .message("Hello from PubNub Python SDK") \  
    .pn_async(my_callback_function)  
`
```

`userId` configured at init is returned by some APIs as **UUID/uuid**.

---

## grant_token (channels / groups / uuids)

Requires the *Access Manager* add-on.

Generates a time-limited token containing:
• `ttl` (1-43 200 min, required)  
• optional `authorized_uuid` (recommended)  
• permissions for `channels`, `groups`, `uuids` (lists or RegEx patterns)

### Permissions

• channels – `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• groups   – `read`, `manage`  
• uuids    – `get`, `update`, `delete`

### Builder

```
`grant_token() \  
    .ttl(int) \  
    .meta(Dictionary) \  
    .authorized_uuid(str) \  
    .channels(listChannel>) \  
    .groups(listGroup>) \  
    .uuids(listUUID>)  
`
```

Parameter notes  
• `meta` – scalar values only.  
• At least one permission (channel/group/uuid) must be supplied.

### Samples

Builder pattern:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.v3.channel import Channel  
from pubnub.exceptions import PubNubException  
  
  
def grant_pubnub_token(pubnub: PubNub) -> str:  
    envelope = pubnub.grant_token() \  
        .channels([  
            Channel.id('readonly-channel').read(),  
            Channel.id('readwrite-channel').read().write(),  
        ]) \  
        .authorized_uuid("my-authorized-uuid") \  
        .ttl(15) \  
`
```

Named arguments:

```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
from pubnub.models.consumer.v3.channel import Channel  
from pubnub.exceptions import PubNubException  
  
  
def grant_pubnub_token(pubnub: PubNub) -> str:  
    grant = pubnub.grant_token(  
        channels=[  
            Channel.id('readonly-channel').read(),  
            Channel.id('readwrite-channel').read().write(),  
        ],  
        authorized_user_id="my-authorized-uuid",  
        ttl=15  
`
```

Multiple-resource grant:

```
`from pubnub.models.consumer.v3.channel import Channel  
from pubnub.models.consumer.v3.group import Group  
from pubnub.models.consumer.v3.uuid import UUID  
  
channels = [  
    Channel.id("channel-a").read(),  
    Channel.id("channel-b").read().write(),  
    Channel.id("channel-c").read().write(),  
    Channel.id("channel-d").read().write()  
]  
groups = [  
    Group.id("channel-group-b").read()  
]  
uuids = [  
    UUID.id("uuid-c").get(),  
`
```

RegEx grant:

```
`envelope = pubnub.grant_token() \  
    .channels(Channel.pattern("channel-[A-Za-z0-9]").read()) \  
    .authorized_uuid("my-authorized-uuid") \  
    .ttl(15) \  
    .sync()  
`
```

Combined list + RegEx:

```
`from pubnub.models.consumer.v3.channel import Channel  
from pubnub.models.consumer.v3.group import Group  
from pubnub.models.consumer.v3.uuid import UUID  
  
channels = [  
    Channel.id("channel-a").read(),  
    Channel.pattern("channel-[A-Za-z0-9]").read(),  
    Channel.id("channel-b").read().write(),  
    Channel.id("channel-c").read().write(),  
    Channel.id("channel-d").read().write()  
]  
groups = [  
    Group.id("channel-group-b").read()  
]  
uuids = [  
`
```

Return example:

```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

Error responses: `400` for invalid arguments, `403` unauthorized.

---

## grant_token (spaces / users)

Same rules, scoped to `spaces`, `users`.

Permissions  
• space  – `read`, `write`, `get`, `manage`, `update`, `join`, `delete`  
• user   – `get`, `update`, `delete`

### Builder

```
`grant_token() \  
    .ttl(Integer) \  
    .meta(Dictionary) \  
    .authorized_user(String) \  
    .spaces(listSpace>) \  
    .users(listUser>)  
`
```

### Samples

Builder:

```
`envelope = pubnub.grant_token() \  
    .authorized_user('some_user_id')\  
    .spaces([  
        Space().id('some_space_id').read().write(),  
        Space().pattern('some_*').read().write()  
    ]) \  
    .ttl(60) \  
    .sync()  
`
```

Named args:

```
`grant = pubnub.grant_token(spaces=[Space().id('some_space_id').read().write(), Space().pattern('some_*').read().write()],  
                           authorized_uuid="my-authorized-uuid",  
                           ttl=60) \  
    .sync()  
  
print(f'Token granted: {grant.result.get_token()}')  
`
```

Multi-resource:

```
`from pubnub.models.consumer.v3.space import Space  
from pubnub.models.consumer.v3.user import User  
  
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
envelope = pubnub.grant_token()  
    .spaces(spaces)  
`
```

RegEx:

```
`envelope = pubnub.grant_token()  
    .spaces(Space.pattern("space-[A-Za-z0-9]").read())  
    .ttl(15)  
    .authorized_user("my-authorized-userId")  
    .sync()  
`
```

Combined list + RegEx:

```
`from pubnub.models.consumer.v3.space import Space  
from pubnub.models.consumer.v3.user import User  
  
channels = [  
    Space.id("space-a").read(),  
    Space.pattern("space-[A-Za-z0-9]").read(),  
    Space.id("space-b").read().write(),  
    Space.id("space-c").read().write(),  
    Space.id("space-d").read().write()  
]  
users = [  
    User.id("user-c").get(),  
    User.id("user-d").get().update()  
]  
envelope = pubnub.grant_token()  
`
```

Return:

```
`{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

---

## revoke_token

Requires *Revoke v3 Token* enabled (Admin Portal). Revokes a previously granted token (≤ 30 day TTL).

Method:

```
`revoke_token(String)  
`
```

Sample:

```
`pubnub.revoke_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Result:

```
`Revoke token success with status: 200  
`
```

Errors: `400`, `403`, `503`.

---

## parse_token

```
`parse_token(String)  
`
```

Sample:

```
`pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Return (truncated):

```
`{  
   "version":2,  
   "timestamp":1629394579,  
   "ttl":15,  
   "authorized_uuid": "user1",  
   "resources":{  
      "uuids":{  
         "user1":{  
            "read": False,  
            "write": False,  
            "manage": False,  
            "delete": False,  
            "get": True,  
            "update": True,  
            "join": False  
`
```

---

## set_token

```
`set_token(String)  
`
```

Sample:

```
`pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

(No return value)

---

Last updated Jul 15 2025