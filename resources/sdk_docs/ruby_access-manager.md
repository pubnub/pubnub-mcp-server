# Access Manager v3 API for Ruby SDK

Access Manager grants time-limited tokens with embedded permissions to PubNub resources:
- Time-bound (ttl)
- Resource lists or RegEx patterns
- Mixed permission levels in one request
- Restrictable to a single authorized_user_id (UUID)

User ID / UUID
- User ID is also referred to as UUID/uuid in some APIs and responses and holds the value of userId set during initialization.

## Grant token

Requires:
- Access Manager add-on enabled on the keyset (Admin Portal).
- Initialization with a Secret Key.

Grants token permissions for:
- channels
- channel_groups
- uuids (users' object metadata)

Resource permissions:
- channel: read, write, get, manage, update, join, delete
- channel_group: read, manage
- uuid: get, update, delete

Token scope:
- Only the authorized_user_id (if set) can use the token; invalid/unauthorized use returns HTTP 403.
- ttl is required (1–43,200 minutes).

Method(s)
```
`1grant_token(  
2  ttl: ttl,  
3  authorized_user_id: authorized_user_id,  
4  uuids: uuids,  
5  channels: channels,  
6  channel_groups: channel_groups  
7)  
`
```

Parameters
- ttl (Integer, required): minutes token is valid; min 1, max 43,200 (30 days).
- authorized_user_id (String): single uuid authorized to use the token.
- uuids (Hash): uuid metadata permissions as list or RegEx pattern, e.g. {"uuid-1": Pubnub::Permissions.res(get: true, update: true, delete: true),"^uuid-2.$": Pubnub::Permissions.pat(...)}.
- channels (Hash): channel permissions as list or RegEx pattern, e.g. {"channel-1": Pubnub::Permissions.res(read: true, write: true, manage: true, delete: true, get: true, update: true, join: true),"^channel-2.$": Pubnub::Permissions.pat(...)}.
- channel_groups (Hash): channel group permissions as list or RegEx pattern, e.g. {"group-id-1": Pubnub::Permissions.res(read: true, manage: true),"^group-id-2.$": Pubnub::Permissions.pat(...)}.
- meta (Object): scalar-only metadata to publish with the request.

Required key/value mappings
- Specify permissions for at least one uuid, channel, or channel_groups (list or RegEx).

Sample code
```
1require 'pubnub'  
2
  
3
  
4def grant_token(pubnub)  
5  future_result = pubnub.grant_token(  
6    ttl: 15,  
7    authorized_user_id: "my-authorized-uuid",  
8    channels: {  
9      "my-channel" => Pubnub::Permissions.res(read: true)  
10    }  
11  )  
12  result = future_result.value  
13  result.result[:data]['token']  
14end  
15
  
16
  
17def main  
18  # Configuration for PubNub instance  
19  pubnub = Pubnub.new(  
20    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
21    publish_key: ENV.fetch('PUBLISH_KEY', 'demo'),  
22    secret_key: ENV.fetch('SECRET_KEY', 'my_secret_key'),  
23    user_id: 'myUniqueUserId'  
24  )  
25
  
26  begin  
27    # Grant token  
28    token = grant_token(pubnub)  
29    puts "Token granted successfully: #{token}"  
30  rescue StandardError => e  
31    puts "Error: #{e.message}"  
32  end  
33end  
34
  
35
  
36if __FILE__ == $0  
37  main  
38end  
```

Returns
```
`1#  
2    @result = {  
3        :data => {  
4            "message" => "Success",  
5            "token" => "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
6        }  
7    },  
8    @status = {  
9        :code => 200  
10    }  
11>  
`
```

Other examples

Grant an authorized client different levels of access to various resources in a single call
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-uuid",  
4      channels: {  
5            "channel-a": Pubnub::Permissions.res(  
6               read: true  
7            ),  
8            "channel-b": Pubnub::Permissions.res(  
9               read: true,  
10               write: true  
11            ),  
12            "channel-c": Pubnub::Permissions.res(  
13               read: true,  
14               write: true  
15            ),  
16            "channel-d": Pubnub::Permissions.res(  
17               read: true,  
18               write: true  
19            )  
20      },  
21      channel_groups: {  
22            "channel-group-b": Pubnub::Permissions.res(  
23               read: true  
24            )  
25      },  
26      uuids: {  
27            "uuid-c": Pubnub::Permissions.res(  
28               get: true  
29            ),  
30            "uuid-d": Pubnub::Permissions.res(  
31               get: true,  
32               update: true  
33            )  
34      }  
35   );  
`
```

Grant an authorized client read access to multiple channels using RegEx
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-uuid",  
4      channels: {  
5            "^channel-[A-Za-z0-9]$": Pubnub::Permission.pat(  
6               read: true  
7            )  
8      },  
9   );  
`
```

Grant an authorized client different levels of access to various resources and read access to channels using RegEx in a single call
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-uuid",  
4      channels: {  
5            "channel-a": Pubnub::Permissions.res(  
6               read: true  
7            ),  
8            "channel-b": Pubnub::Permissions.res(  
9               read: true,  
10               write: true  
11            ),  
12            "channel-c": Pubnub::Permissions.res(  
13               read: true,  
14               write: true  
15            ),  
16            "channel-d": Pubnub::Permissions.res(  
17               read: true,  
18               write: true  
19            ),  
20            "^channel-[A-Za-z0-9]$": Pubnub::Permission.pat(  
21               read: true  
22            )  
23      },  
24      channel_groups: {  
25            "channel-group-b": Pubnub::Permissions.res(  
26               read: true  
27            )  
28      },  
29      uuids: {  
30            "uuid-c": Pubnub::Permissions.res(  
31               get: true  
32            ),  
33            "uuid-d": Pubnub::Permissions.res(  
34               get: true,  
35               update: true  
36            )  
37      }  
38   );  
`
```

Error responses
- HTTP 400 with details for invalid requests (e.g., RegEx, invalid timestamp, incorrect permissions). Returns error details in JSON.

## Grant token - spaces & users

Requires Access Manager add-on.

Grants token permissions for:
- spaces
- users (other users' metadata)

Resource permissions:
- space: read, write, get, manage, update, join, delete
- user: get, update, delete

Token scope and ttl behavior as above.

Method(s)
```
`1grant_token(ttl: ttl, authorized_user_id: authorized_user_id, users_permissions: users, spaces_permissions: spaces)  
`
```

Parameters
- ttl (Integer, required): minutes token is valid; min 1, max 43,200 (30 days).
- authorized_user_id (String): single uuid authorized to use the token.
- users_permissions (Hash): User permissions list or RegEx patterns, e.g. {"user-1": Pubnub::Permissions.res(get: true, update: true, delete: true),"^user-2.$": Pubnub::Permissions.pat(...)}.
- spaces_permissions (Hash): Space permissions list or RegEx patterns, e.g. {"space-1": Pubnub::Permissions.res(read: true, write: true, manage: true, delete: true, get: true, update: true, join: true),"^space-2.$": Pubnub::Permissions.pat(...)}.
- meta (Object): scalar-only metadata.

Required key/value mappings
- Specify permissions for at least one User or Space (list or RegEx).

Sample code
```
`1pubnub.grant_token(  
2    ttl: 15,  
3    authorized_user_id: "my-authorized-userId",  
4    spaces_permissions: {  
5      "my-space": Pubnub::Permissions.res(  
6        read: true  
7      )  
8    }  
9);  
`
```

Returns
```
`1#  
2    @result = {  
3        :data => {  
4            "message" => "Success",  
5            "token" => "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6han3Jwsample3KgQ3NwY6BDcGF0pERjaG3BjoERGOAeTyWGJI"  
6        }  
7    },  
8    @status = {  
9        :code => 200  
10    }  
11>  
`
```

Other examples

Grant an authorized client different levels of access to various resources in a single call
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-userId",  
4      spaces_permissions: {  
5            "space-a": Pubnub::Permissions.res(  
6               read: true  
7            ),  
8            "space-b": Pubnub::Permissions.res(  
9               read: true,  
10               write: true  
11            ),  
12            "space-c": Pubnub::Permissions.res(  
13               read: true,  
14               write: true  
15            ),  
16            "space-d": Pubnub::Permissions.res(  
17               read: true,  
18               write: true  
19            )  
20      },  
21      users_permissions: {  
22            "userId-c": Pubnub::Permissions.res(  
23               get: true  
24            ),  
25            "userId-d": Pubnub::Permissions.res(  
26               get: true,  
27               update: true  
28            )  
29      }  
30   );  
`
```

Grant an authorized client read access to multiple spaces using RegEx
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-userId",  
4      spaces_permissions: {  
5            "^space-[A-Za-z0-9]$": Pubnub::Permission.pat(  
6               read: true  
7            )  
8      },  
9   );  
`
```

Grant an authorized client different levels of access to various resources and read access to spaces using RegEx in a single call
```
`1pubnub.grant_token(  
2      ttl: 15,  
3      authorized_user_id: "my-authorized-userId",  
4      space_permissions: {  
5            "space-a": Pubnub::Permissions.res(  
6               read: true  
7            ),  
8            "space-b": Pubnub::Permissions.res(  
9               read: true,  
10               write: true  
11            ),  
12            "space-c": Pubnub::Permissions.res(  
13               read: true,  
14               write: true  
15            ),  
16            "space-d": Pubnub::Permissions.res(  
17               read: true,  
18               write: true  
19            ),  
20            "^space-[A-Za-z0-9]$": Pubnub::Permission.pat(  
21               read: true  
22            )  
23      },  
24      users_permissions: {  
25            "userId-c": Pubnub::Permissions.res(  
26               get: true  
27            ),  
28            "userId-d": Pubnub::Permissions.res(  
29               get: true,  
30               update: true  
31            )  
32      }  
33   );  
`
```

Error responses
- HTTP 400 with details for invalid requests (e.g., RegEx, invalid timestamp, incorrect permissions). Returns error details in JSON.

## Revoke token

Requires:
- Access Manager add-on.
- Revoke v3 Token enabled on keyset (Admin Portal > ACCESS MANAGER).

Revokes a valid token previously obtained via grant_token(). Use for tokens with ttl ≤ 30 days; for longer ttl, contact support.

Method(s)
```
`1revoke_token(  
2   token: token  
3)  
`
```

Parameters
- token (String, required): existing token to revoke.

Sample code
```
`1pubnub.revoke_token("p0thisAkFl043rhDXisRGNoYW6han3Jwsample3KgQ3NwY6BDcGF0pERjaG3BjoERGOAeTyWGJI")  
`
```

Returns
```
`1Pubnub::Envelope  
2    @result = {  
3        :data => {  
4            "message" => "Success"  
5        }  
6    },  
7    @status = {  
8        :code => 200  
9    }  
10>  
`
```

Error Responses
- 400 Bad Request
- 403 Forbidden
- 503 Service Unavailable

## Parse token

Decodes a token and returns its embedded permissions and ttl. Useful for debugging.

Method(s)
```
`1parse_token(  
2   token: token  
3)  
`
```

Parameters
- token (String, required): current token to parse.

Sample code
```
`1pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Returns
```
`1{  
2    "v"=>2,  
3    "t"=>1627968380,  
4    "ttl"=>15,  
5    "res"=>{  
6        "chan"=>{  
7            "channel-1"=>239  
8        },  
9        "grp"=>{  
10            "channel_group-1"=>5  
11        },  
12        "usr"=>{},  
13        "spc"=>{},  
14        "uuid"=>{  
15            "uuid-1"=>104}  
16        },  
17    "pat"=>{  
18        "chan"=>{  
19            "^channel-\\S*$"=>239  
20        },  
21        "grp"=>{  
22            "^:channel_group-\\S*$"=>5  
23        },  
24        "usr"=>{},  
25        "spc"=>{},  
26        "uuid"=>{  
27            "^uuid-\\S*$"=>104  
28        }  
29    },  
30    "meta"=>{},  
31    "uuid"=>"test-authorized-uuid",  
32    "sig"=>"\xFAT\xFA\xF0\x9E\xF6\xB9)b\xCF;aJ\xC55i26\xAF\x02V\xF9\x8A\xC0H\xD5\x8Ay\xC3\xAC\x92\\"  
33}  
`
```

Error Responses
- Parse errors may indicate a damaged token; request a new token.

## Set token

Updates the authentication token on the client.

Method(s)
```
`1set_token(token: token)  
`
```

Parameters
- token (String, required): current token.

Sample code
```
`1pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Returns
- No response value.