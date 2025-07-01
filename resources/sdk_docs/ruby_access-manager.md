# Access Manager v3 – Ruby SDK (condensed)

Access Manager v3 lets your servers issue JSON Web Tokens (JWT) that embed fine-grained, time-limited permissions for PubNub resources. All methods below require the *Access Manager* add-on to be enabled in the Admin Portal.

---

## Grant Token  (channels / channel-groups / uuids)

Resources you can authorize:  

• `channels` • `channel_groups` • `uuids`  

Permissions:  
channel → `read write get manage update join delete`  
channel_group → `read manage`  
uuid → `get update delete`

Token fields  
• `ttl` (1-43 200 min, required) • optional `authorized_user_id` (restricts use to one UUID)  

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
• At least one of `uuids`, `channels`, `channel_groups` is required (map of id/pattern ⇒ `Pubnub::Permissions.res|pat`).  
• Optional scalar `meta`.

### Basic usage
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
All original examples are preserved below.

```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-uuid",  
      channels: {  
            "channel-a": Pubnub::Permissions.res(  
               read: true  
            ),  
            "channel-b": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
            "channel-c": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
`
```
*(show all 35 lines)*

```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-uuid",  
      channels: {  
            "^channel-[A-Za-z0-9]$": Pubnub::Permission.pat(  
               read: true  
            )  
      },  
   );  
`
```

```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-uuid",  
      channels: {  
            "channel-a": Pubnub::Permissions.res(  
               read: true  
            ),  
            "channel-b": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
            "channel-c": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
`
```
*(show all 38 lines)*

Invalid input returns HTTP 400 with details (bad regex, timestamp, etc.).

---

## Grant Token – Spaces & Users

Resources: `spaces`, `users`  
Permissions:  
space → `read write get manage update join delete`  
user  → `get update delete`

### Method
```
`grant_token(ttl: ttl, authorized_user_id: authorized_user_id, users_permissions: users, spaces_permissions: spaces)  
`
```
• Supply at least one `users_permissions` or `spaces_permissions`.

### Basic usage
```
`pubnub.grant_token(  
    ttl: 15,  
    authorized_user_id: "my-authorized-userId",  
    spaces_permissions: {  
      "my-space": Pubnub::Permissions.res(  
        read: true  
      )  
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
```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-userId",  
      spaces_permissions: {  
            "space-a": Pubnub::Permissions.res(  
               read: true  
            ),  
            "space-b": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
            "space-c": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
`
```
*(show all 30 lines)*

```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-userId",  
      spaces_permissions: {  
            "^space-[A-Za-z0-9]$": Pubnub::Permission.pat(  
               read: true  
            )  
      },  
   );  
`
```

```
`pubnub.grant_token(  
      ttl: 15,  
      authorized_user_id: "my-authorized-userId",  
      space_permissions: {  
            "space-a": Pubnub::Permissions.res(  
               read: true  
            ),  
            "space-b": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
            "space-c": Pubnub::Permissions.res(  
               read: true,  
               write: true  
            ),  
`
```
*(show all 33 lines)*

---

## Revoke Token

Enable “Revoke v3 Token” in the Admin Portal before use.  
Use for tokens with `ttl` ≤ 30 days.

### Method
```
`revoke_token(  
   token: token  
)  
`
```

### Basic usage
```
`pubnub.revoke_token("p0thisAkFl043rhDXisRGNoYW6han3Jwsample3KgQ3NwY6BDcGF0pERjaG3BjoERGOAeTyWGJI")  
`
```

### Returns
```
`Pubnub::Envelope  
    @result = {  
        :data => {  
            "message" => "Success"  
        }  
    },  
    @status = {  
        :code => 200  
    }  
>  
`
```
Errors: 400 / 403 / 503.

---

## Parse Token

### Method
```
`parse_token(  
   token: token  
)  
`
```

### Basic usage
```
`pubnub.parse_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

### Returns
```
`{  
    "v"=>2,  
    "t"=>1627968380,  
    "ttl"=>15,  
    "res"=>{  
        "chan"=>{  
            "channel-1"=>239  
        },  
        "grp"=>{  
            "channel_group-1"=>5  
        },  
        "usr"=>{},  
        "spc"=>{},  
        "uuid"=>{  
            "uuid-1"=>104}  
`
```
*(show all 33 lines)*

---

## Set Token

### Method
```
`set_token(token: token)  
`
```

### Basic usage
```
`pubnub.set_token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```
(No return value)

---

_Last updated : Apr 29 2025_