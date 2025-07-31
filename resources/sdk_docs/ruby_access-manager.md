# Access Manager v3 – Ruby SDK (Condensed)

Below are the essential APIs, signatures, parameters, and examples for Access-Manager v3 in the Ruby SDK. All code blocks are unchanged from the original documentation.

---

## Grant token  (channels / channel groups / uuids)

### Method
```
`grant_token(  
  ttl: ttl,  
  authorized_user_id: authorized_user_id,  
  uuids: uuids,  
  channels: channels,  
  channel_groups: channel_groups  
)  
`
```

### Parameters  
* `ttl`* Integer, required. Minutes (1-43 200) before token expiry.  
* `authorized_user_id` String. Restrict token to a single UUID.  
* `uuids` Hash. `"uuid" => Pubnub::Permissions.res(...)` or RegEx pattern.  
* `channels` Hash. `"channel" => Pubnub::Permissions.res(...)` or RegEx pattern.  
* `channel_groups` Hash. `"group" => Pubnub::Permissions.res(...)` or RegEx pattern.  
* `meta` Object. Scalar values only.

At least one of `uuids`, `channels`, or `channel_groups` is required.

### Reference code
```
`require 'pubnub'  
  
def grant_token(pubnub)  
  future_result = pubnub.grant_token(  
    ttl: 15,  
    authorized_user_id: "my-authorized-uuid",  
    channels: {  
      "my-channel" => Pubnub::Permissions.res(read: true)  
    }  
  )  
  result = future_result.value  
  result.result[:data]['token']  
end  
  
`
```

### Returns
```
`#  
    @result = {  
        :data => {  
            "message" => "Success",  
            "token" => "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

### Additional examples

#### Mixed permissions in one call
```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-uuid",  
      channels: {  
            "channel-a": Pubnub::Permissions.res( read: true ),  
            "channel-b": Pubnub::Permissions.res( read: true, write: true ),  
            "channel-c": Pubnub::Permissions.res( read: true, write: true )  
      },  
      channel_groups: { "channel-group-b": Pubnub::Permissions.res(read: true) },  
      uuids: { "uuid-c": Pubnub::Permissions.res(get: true),  
               "uuid-d": Pubnub::Permissions.res(get: true, update: true) }  
);  
`
```

#### RegEx example
```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-uuid",  
      channels: {  
            "^channel-[A-Za-z0-9]$": Pubnub::Permission.pat( read: true )  
      },  
   );  
`
```

---

## Grant token  (spaces / users)

### Method
```
`grant_token(ttl: ttl, authorized_user_id: authorized_user_id, users_permissions: users, spaces_permissions: spaces)  
`
```

### Parameters  
* `ttl`* Integer, required (1-43 200).  
* `authorized_user_id` String. Single UUID allowed to use token.  
* `users_permissions` Hash. `"user-id" => Pubnub::Permissions.res(...)` or RegEx.  
* `spaces_permissions` Hash. `"space-id" => Pubnub::Permissions.res(...)` or RegEx.  
* `meta` Object. Scalars only.

At least one User or Space permission is required.

### Sample
```
`pubnub.grant_token(  
    ttl: 15,  
    authorized_user_id: "my-authorized-userId",  
    spaces_permissions: {  
      "my-space": Pubnub::Permissions.res( read: true )  
    }  
);  
`
```

### Returns
```
`#  
    @result = {  
        :data => {  
            "message" => "Success",  
            "token" => "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```

### Additional examples

#### Mixed User/Space permissions
```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-userId",  
      spaces_permissions: {  
            "space-a": Pubnub::Permissions.res( read: true ),  
            "space-b": Pubnub::Permissions.res( read: true, write: true )  
      },  
      users_permissions: {  
            "userId-c": Pubnub::Permissions.res( get: true ),  
            "userId-d": Pubnub::Permissions.res( get: true, update: true )  
      }  
);  
`
```

#### RegEx for spaces
```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-userId",  
      spaces_permissions: {  
            "^space-[A-Za-z0-9]$": Pubnub::Permission.pat( read: true )  
      },  
   );  
`
```

---

## Revoke token

### Method
```
`revoke_token(  
   token: token  
)  
`
```

Parameter  
* `token`* String. Existing v3 token to revoke.

### Sample
```
`pubnub.revoke_token("p0thisAkFl043rhDXisRGNoYW6han3Jwsample3KgQ3NwY6BDcGF0pERjaG3BjoERGOAeTyWGJI")  
`
```

### Returns
```
`Pubnub::Envelope  
    @result = { :data => { "message" => "Success" } },  
    @status = { :code => 200 }  
>  
`
```

Possible errors: `400`, `403`, `503`.

---

## Parse token

### Method
```
`parse_token(  
   token: token  
)  
`
```

### Sample
```
`pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns (truncated for brevity)
```
`{  
    "v"=>2,  
    "t"=>1627968380,  
    "ttl"=>15,  
    "res"=>{  
        "chan"=>{ "channel-1"=>239 },  
        "grp"=>{ "channel_group-1"=>5 },  
        "uuid"=>{ "uuid-1"=>104 }  
    }  
    ...  
}`  
```

---

## Set token

### Method
```
`set_token(token: token)  
`
```

Parameter  
* `token`* String. Authentication token to apply.

### Sample
```
`pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

(This call returns no value.)

---

Last updated **Jul 15 2025**