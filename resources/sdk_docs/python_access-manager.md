# Access Manager v3 API for Python SDK (Condensed)

Access Manager lets servers (initialized with a Secret Key) grant clients time-limited tokens with embedded permissions for PubNub resources using resource lists or RegEx patterns, and optional restriction to a single authorized user.

Resources:
- Channels, channel groups, and UUIDs (users’ object metadata)
- Spaces and users (alternate model)

Token options:
- TTL (minutes, required, 1–43,200)
- Authorized user (authorized_uuid or authorized_user)
- Resource lists and/or RegEx patterns
- Mixed permissions in a single request

Unauthorized or invalid tokens return HTTP 403.

##### Request execution and return values
Synchronous: .sync() returns Envelope with:
- Envelope.result (type depends on API)
- Envelope.status (PnStatus)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

Asynchronous: .pn_async(callback) returns None and invokes callback(result, status).

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  
```

##### User ID / UUID
User ID may be referred to as UUID/uuid in APIs; it holds the value set as userId during initialization.

## Grant token

Requires:
- Access Manager add-on enabled (Admin Portal)
- Secret Key in SDK initialization

Generates a token with ttl, authorized_uuid, and permissions on:
- channels
- groups
- uuids

Only authorized_uuid (if set) can use the token.

Permissions per resource:
- channels: read, write, get, manage, update, join, delete
- groups: read, manage
- uuids: get, update, delete

TTL:
- Required; minutes the token is valid (1–43,200). No default.

RegEx:
- Grant by pattern using pattern definitions.

Authorized UUID:
- If omitted, any UUID can use the token. Set it to prevent impersonation.

### Method(s)
```
`1grant_token() \  
2    .ttl(int) \  
3    .meta(Dictionary) \  
4    .authorized_uuid(str) \  
5    .channels(listChannel>) \  
6    .groups(listGroup>) \  
7    .uuids(listUUID>)  
`
```

Parameters:
- ttl (Number, required): Minutes token is valid. Min 1, max 43,200.
- meta (Dictionary): Scalar values only; arrays/objects not supported.
- authorized_uuid (Str): Single uuid authorized to use the token.
- channels (list<Channel>): Channel grants list or RegEx pattern.
- groups (list<Group>): Channel group grants list or RegEx pattern.
- uuids (list<UUID>): UUID grants list or RegEx pattern.

Required: At least one permission for uuid, channel, or group (list or RegEx).

### Sample code

Reference code (Builder Pattern and Named Arguments):

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.v3.channel import Channel  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def grant_pubnub_token(pubnub: PubNub) -> str:  
9    envelope = pubnub.grant_token() \  
10        .channels([  
11            Channel.id('readonly-channel').read(),  
12            Channel.id('readwrite-channel').read().write(),  
13        ]) \  
14        .authorized_uuid("my-authorized-uuid") \  
15        .ttl(15) \  
16        .sync()  
17    return envelope.result.token  
18
  
19
  
20def main():  
21    # Configuration for PubNub instance  
22    pn_config = PNConfiguration()  
23
  
24    # Only configure what's necessary  
25    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
26    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
27    pn_config.secret_key = os.getenv('SECRET_KEY', 'my_secret_key')  
28    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
29
  
30    # Initialize PubNub client  
31    pubnub = PubNub(pn_config)  
32
  
33    try:  
34        # Grant token  
35        token = grant_pubnub_token(pubnub)  
36        print(f"Granted token: {token}")  
37
  
38    except PubNubException as e:  
39        print(f"Error: {e}")  
40
  
41
  
42if __name__ == "__main__":  
43    main()  
```

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.v3.channel import Channel  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def grant_pubnub_token(pubnub: PubNub) -> str:  
9    grant = pubnub.grant_token(  
10        channels=[  
11            Channel.id('readonly-channel').read(),  
12            Channel.id('readwrite-channel').read().write(),  
13        ],  
14        authorized_uuid="my-authorized-uuid",  
15        ttl=15  
16    ).sync()  
17    return grant.result.token  
18
  
19
  
20def main():  
21    # Configuration for PubNub instance  
22    pn_config = PNConfiguration()  
23  
24    # Only configure what's necessary  
25    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
26    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
27    pn_config.secret_key = os.getenv('SECRET_KEY', 'my_secret_key')  
28    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
29  
30    # Initialize PubNub client  
31    pubnub = PubNub(pn_config)  
32  
33    try:  
34        # Grant token using named arguments  
35        token = grant_pubnub_token(pubnub)  
36        print(f"Granted token: {token}")  
37  
38    except PubNubException as e:  
39        print(f"Error: {e}")  
40  
41  
42if __name__ == "__main__":  
43    main()  
44
```

### Returns
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

Grant different levels to various resources in one call:
```
1from pubnub.models.consumer.v3.channel import Channel  
2from pubnub.models.consumer.v3.group import Group  
3from pubnub.models.consumer.v3.uuid import UUID  
4
  
5channels = [  
6    Channel.id("channel-a").read(),  
7    Channel.id("channel-b").read().write(),  
8    Channel.id("channel-c").read().write(),  
9    Channel.id("channel-d").read().write()  
10]  
11groups = [  
12    Group.id("channel-group-b").read()  
13]  
14uuids = [  
15    UUID.id("uuid-c").get(),  
16    UUID.id("uuid-d").get().update()  
17]  
18envelope = pubnub.grant_token() \  
19    .channels(channels) \  
20    .groups(groups) \  
21    .uuids(uuids) \  
22    .authorized_uuid("my-authorized-uuid") \  
23    .ttl(15) \  
24    .sync()  
```

Grant read access to multiple channels using RegEx:
```
`1envelope = pubnub.grant_token() \  
2    .channels(Channel.pattern("channel-[A-Za-z0-9]").read()) \  
3    .authorized_uuid("my-authorized-uuid") \  
4    .ttl(15) \  
5    .sync()  
`
```

Combine resource lists and channel RegEx:
```
1from pubnub.models.consumer.v3.channel import Channel  
2from pubnub.models.consumer.v3.group import Group  
3from pubnub.models.consumer.v3.uuid import UUID  
4
  
5channels = [  
6    Channel.id("channel-a").read(),  
7    Channel.pattern("channel-[A-Za-z0-9]").read(),  
8    Channel.id("channel-b").read().write(),  
9    Channel.id("channel-c").read().write(),  
10    Channel.id("channel-d").read().write()  
11]  
12groups = [  
13    Group.id("channel-group-b").read()  
14]  
15uuids = [  
16    UUID.id("uuid-c").get(),  
17    UUID.id("uuid-d").get().update()  
18]  
19envelope = pubnub.grant_token() \  
20    .channels(channels) \  
21    .groups(groups) \  
22    .uuids(uuids) \  
23    .authorized_uuid("my-authorized-uuid") \  
24    .ttl(15) \  
25    .sync()  
```

### Error responses
HTTP 400 with details for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions). Details are in the envelope object.

## Grant token - spaces & users

Requires Access Manager add-on.

Generates a token with ttl, authorized_user, and permissions on:
- spaces
- users

Only authorized_user (if set) can use the token.

Permissions per resource:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

TTL and RegEx rules are the same as above. Setting authorized_user restricts token usage to that userId.

### Method(s)
```
`1grant_token() \  
2    .ttl(Integer) \  
3    .meta(Dictionary) \  
4    .authorized_user(String) \  
5    .spaces(listSpace>) \  
6    .users(listUser>)  
`
```

Parameters:
- ttl (Integer, required): Minutes token is valid. Min 1, max 43,200.
- meta (Dictionary): Scalar values only.
- authorized_user (String): Single user_id authorized to use the token.
- spaces (list<Space>): Space permissions (list or RegEx).
- users (list<User>): User permissions (list or RegEx).

Required: At least one permission for a User or Space.

### Sample code

Builder Pattern and Named Arguments:
```
`1envelope = pubnub.grant_token() \  
2    .authorized_user('some_user_id')\  
3    .spaces([  
4        Space().id('some_space_id').read().write(),  
5        Space().pattern('some_*').read().write()  
6    ]) \  
7    .ttl(60) \  
8    .sync()  
`
```

```
1grant = pubnub.grant_token(spaces=[Space().id('some_space_id').read().write(), Space().pattern('some_*').read().write()],  
2                           authorized_user="my-authorized-uuid",  
3                           ttl=60) \  
4    .sync()  
5
  
6print(f'Token granted: {grant.result.get_token()}')  
```

### Returns
```
`1{"token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

### Other examples

Grant varying access to spaces and users:
```
1from pubnub.models.consumer.v3.space import Space  
2from pubnub.models.consumer.v3.user import User  
3
  
4spaces = [  
5    Space.id("space-a").read(),  
6    Space.id("space-b").read().write(),  
7    Space.id("space-c").read().write(),  
8    Space.id("space-d").read().write()  
9]  
10users = [  
11    User.id("userId-c").get(),  
12    User.id("userId-d").get().update()  
13]  
14envelope = pubnub.grant_token()  
15    .spaces(spaces)  
16    .ttl(15)  
17    .users(users)  
18    .authorized_user("my-authorized-uuid")  
19    .sync()  
```

Grant read access to multiple spaces using RegEx:
```
`1envelope = pubnub.grant_token()  
2    .spaces(Space.pattern("space-[A-Za-z0-9]").read())  
3    .ttl(15)  
4    .authorized_user("my-authorized-userId")  
5    .sync()  
`
```

Combine resource lists and space RegEx:
```
1from pubnub.models.consumer.v3.space import Space  
2from pubnub.models.consumer.v3.user import User  
3
  
4channels = [  
5    Space.id("space-a").read(),  
6    Space.pattern("space-[A-Za-z0-9]").read(),  
7    Space.id("space-b").read().write(),  
8    Space.id("space-c").read().write(),  
9    Space.id("space-d").read().write()  
10]  
11users = [  
12    User.id("user-c").get(),  
13    User.id("user-d").get().update()  
14]  
15envelope = pubnub.grant_token()  
16    .spaces(spaces)  
17    .ttl(15)  
18    .groups(groups)  
19    .users(users)  
20    .authorized_user("my-authorized-userId")  
21    .sync()  
```

### Error responses
HTTP 400 with details for invalid requests (e.g., RegEx issues, invalid timestamp, incorrect permissions).

## Revoke token

Requires:
- Access Manager add-on
- Revoke v3 Token feature enabled (Admin Portal)

Disables an existing token previously granted by grant_token(). Recommended for tokens with ttl ≤ 30 days; contact support for longer.

### Method(s)
```
`1revoke_token(String)  
`
```

Parameters:
- token (String, required): Existing token to revoke.

### Sample code
```
`1pubnub.revoke_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
Envelope with:
- result: PNRevokeTokenResult
- status: PNStatus

PNRevokeTokenResult:
```
`1Revoke token success with status: 200  
`
```

### Error Responses
Possible: 400 Bad Request, 403 Forbidden, 503 Service Unavailable.

## Parse token

Decodes a token into its embedded permissions and TTL.

### Method(s)
```
`1parse_token(String)  
`
```

Parameters:
- token (String, required): Token to decode.

### Sample code
```
`1pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
```
`1{  
2   "version":2,  
3   "timestamp":1629394579,  
4   "ttl":15,  
5   "authorized_uuid": "user1",  
6   "resources":{  
7      "uuids":{  
8         "user1":{  
9            "read": False,  
10            "write": False,  
11            "manage": False,  
12            "delete": False,  
13            "get": True,  
14            "update": True,  
15            "join": False  
16         }  
17      },  
18      "channels":{  
19         "channel1":{  
20            "read": True,  
21            "write": True,  
22            "manage": False,  
23            "delete": False,  
24            "get": False,  
25            "update": False,  
26            "join": False  
27         }  
28      },  
29      "groups":{  
30         "group1":{  
31            "read": True,  
32            "write": False,  
33            "manage": False,  
34            "delete": False,  
35            "get": False,  
36            "update": False,  
37            "join": False  
38         }  
39      }  
40   },  
41   "patterns":{  
42      "uuids":{  
43         ".*":{  
44            "read": False,  
45            "write": False,  
46            "manage": False,  
47            "delete": False,  
48            "get": True,  
49            "update": False,  
50            "join": False  
51         }  
52      },  
53      "channels":{  
54         ".*":{  
55            "read": True,  
56            "write": True,  
57            "manage": False,  
58            "delete": False,  
59            "get": False,  
60            "update": False,  
61            "join": False  
62         }  
63      },  
64      "groups":{  
65         ".*":{  
66            "read": True,  
67            "write": False,  
68            "manage": False,  
69            "delete": False,  
70            "get": False,  
71            "update": False,  
72            "join": False  
73         }  
74      }  
75   }  
76}  
`
```

### Error Responses
Errors may indicate a damaged token; request a new token from the server.

## Set token

Used by clients to update the authentication token.

### Method(s)
```
`1set_token(String)  
`
```

Parameters:
- token (String, required): Token with embedded permissions.

### Sample code
```
`1pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
No return value.

Last updated on Sep 3, 2025