# Access Manager v3 – Go SDK

Requires:  
• Access Manager add-on enabled in the Admin Portal  
• `SecretKey` (for `GrantToken`, `RevokeToken`)  

---

## Grant Token (channels, groups, UUIDs)

Method
```go
`pn.GrantToken().
  UUIDs(map[string]UUIDPermissions).
  Channels(map[string]ChannelPermissions).
  ChannelGroups(map[string]GroupPermissions).
  UUIDsPattern(map[string]UUIDPermissions).
  ChannelsPattern(map[string]ChannelPermissions).
  ChannelGroupsPattern(map[string]GroupPermissions).
  TTL(int).
  AuthorizedUUID(string).
  Meta(map[string]interface{}).
  QueryParam(queryParam).
  Execute()`
```

Parameters  
• `UUIDs`, `Channels`, `ChannelGroups` – maps of resources to permissions  
• `UUIDsPattern`, `ChannelsPattern`, `ChannelGroupsPattern` – RegEx → permissions  
• `TTL` (required) minutes, 1–43 200  
• `AuthorizedUUID` (single client)  
• `Meta` (scalar values only)

At least one resource or pattern must be provided.

Permissions reference  
```
Channels: read | write | get | manage | update | join | delete  
ChannelGroups: read | manage  
UUIDs: get | update | delete
```

Return
```go
`PNGrantTokenResponse{
  Data: PNGrantTokenData{
    Message: "Success",
    Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF..."
  }
}`
```

Reference code
```go
`package main

import (
	"fmt"
	"log"

	pubnub "github.com/pubnub/go/v7"
)

func main() {
	config := pubnub.NewConfigWithUserId("myUniqueUserId")
	config.SubscribeKey = "demo"
	config.PublishKey  = "demo"
	config.SecretKey   = "mySecretKey" // Required for grantToken`
```  
(show all 48 lines)

Examples  

Grant multiple resource levels in one call
```go
`res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        Channels(map[string]pubnub.ChannelPermissions{
                "channel-a": {Read: true},
                "channel-b": {Read: true, Write: true},
                "channel-c": {Read: true, Write: true},
                // …
        }).
        ChannelGroups(map[string]pubnub.GroupPermissions{
                "channel-group-b": {Read: true},
        }).
        UUIDs(map[string]pubnub.UUIDPermissions{
                "uuid-c": {Get: true},
                "uuid-d": {Get: true, Update: true},
        }).
        Execute()`
```

Grant read to channels via RegEx
```go
`res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        ChannelsPattern(map[string]pubnub.ChannelPermissions{
                "^channel-[A-Za-z0-9]*$": {Read: true},
        }).
        Execute()`
```

Mixed explicit + RegEx
```go
`res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        // explicit resources …
        ChannelsPattern(map[string]pubnub.ChannelPermissions{
                "^channel-[A-Za-z0-9]*$": {Read: true},
        }).
        Execute()`
```

Error: HTTP 400 on invalid args (bad RegEx, timestamp, permissions, etc.).

---

## Grant Token (spaces & users)

Method
```go
`pn.GrantToken().
  UsersPermissions(map[UserId]UserPermissions).
  SpacesPermissions(map[SpaceId]SpacePermissions).
  UserPatternsPermissions(map[string]UserPermissions).
  SpacePatternsPermissions(map[string]SpacePermissions).
  TTL(int).
  AuthorizedUserId(UserId).
  Meta(map[string]interface{}).
  QueryParam(queryParam).
  Execute()`
```

Permissions
```
Spaces: read | write | get | manage | update | join | delete  
Users : get  | update | delete
```

Sample
```go
`res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUserId("my-authorized-userId").
        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{
                "my_spaces": {Read: true},
        }).
        Execute()`
```

Other examples mirror channel-based samples; code blocks unchanged.

Return / errors identical to channel variant.

---

## Revoke Token

Enable “Revoke v3 Token” in Admin Portal first.

Method
```go
`pn.RevokeToken().
        Token(string)`
```

Sample
```go
`res, status, err := pn.RevokeToken().
        Token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...").
        Execute()`
```

Returns: empty `PNRevokeTokenResponse`  
Errors: 400, 403, 503.

---

## Parse Token

Import
```go
`import (
        pubnub "github.com/pubnub/go/v5")`
```

Method
```go
`pubnub.ParseToken(token string)`
```

Sample
```go
`pubnub.ParseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...")`
```

Return (truncated)
```go
`PNToken{
  Version: 2,
  Timestamp: 1619718521,
  TTL: 15,
  AuthorizedUUID: "user1",
  Resources: PNTokenResources{
    Channels: make[string]ChannelPermissions{
      Read: true,
      Write: true,
      Delete: true,
      Get: true,
      Manage: true,
      Update: true,
      Join: true,
    },`
```  
(show remaining lines)  
Error: token malformed ⇒ request new one.

---

## Set Token

Method
```go
`pn.SetToken(token string)`
```

Sample
```go
`pn.SetToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...")`
```

No return value.

_Last updated Jul 15 2025_