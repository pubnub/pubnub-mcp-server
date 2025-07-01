# Access Manager v3 – Go SDK (Condensed)

Access Manager issues time-limited, permission-encoded tokens for PubNub resources. Tokens may target specific resources or RegEx patterns and can be restricted to a single UUID/UserID (recommended).  
Add-on must be enabled in the Admin Portal.

---

## Grant Token – Channels / Channel Groups / UUIDs

### Method

```
pn.GrantToken().
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
  Execute()
```

Parameter (type) – notes  
• UUIDs `map[string]UUIDPermissions` Direct resource list  
• Channels `map[string]ChannelPermissions`  
• ChannelGroups `map[string]GroupPermissions`  
• UUIDsPattern / ChannelsPattern / ChannelGroupsPattern `map[string]…Permissions` RegEx patterns  
• TTL `int` *required* (1-43 200 min)  
• AuthorizedUUID `string` Limit token to one UUID  
• Meta `map[string]interface{}` Scalar values only

At least one resource OR pattern is mandatory.

### Basic usage

```
package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configuration for PubNub with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
	config.SecretKey = "mySecretKey" // Required for grantToken  
```
*(show all 48 lines)*

### Return

```
PNGrantTokenResponse{
  Data: PNGrantTokenData{
      Message: "Success",
      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...WGJI",
  }
}
```

### Examples

Grant mixed permissions:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        Channels(map[string]pubnub.ChannelPermissions{
                "channel-a": { Read: true },
                "channel-b": { Read: true, Write: true },
                "channel-c": { Read: true, Write: true },
```
*(show all 35 lines)*

Grant read via RegEx:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        ChannelsPattern(map[string]pubnub.ChannelPermissions{
                "^channel-[A-Za-z0-9]*$": { Read: true },
        }).
        Execute()
```

Mixed explicit + RegEx:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUUID("my-authorized-uuid").
        Channels(map[string]pubnub.ChannelPermissions{
                "channel-a": { Read: true },
                "channel-b": { Read: true, Write: true },
                "channel-c": { Read: true, Write: true },
```
*(show all 40 lines)*

Error: invalid arguments → `400`; invalid token/permissions → `403`.

---

## Grant Token – Spaces & Users

### Method

```
pn.GrantToken().
  UsersPermissions(map[UserId]UserPermissions).
  SpacesPermissions(map[SpaceId]SpacePermissions).
  UserPatternsPermissions(map[string]UserPermissions).
  SpacePatternsPermissions(map[string]SpacePermissions).
  TTL(int).
  AuthorizedUserId(UserId).
  Meta(map[string]interface{}).
  QueryParam(queryParam).
  Execute()
```

Mandatory fields mirror the previous section (Users/Spaces instead of UUIDs/Channels).

### Basic usage

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUserId("my-authorized-userId").
        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{
                "my_spaces": { Read: true },
        }).
        Execute()
```

### Return (identical format)

```
PNGrantTokenResponse{
  Data: PNGrantTokenData{
      Message: "Success",
      Token: "p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...WGJI",
  }
}
```

### Examples

Different levels:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUserId("my-authorized-userId").
        SpacesPermissions(map[SpaceId]pubnub.SpacePermissions{
                "space-a": { Read: true },
                "space-b": { Read: true, Write: true },
                "space-c": { Read: true, Write: true },
```
*(show all 30 lines)*

RegEx read:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUserId("my-authorized-userId").
        SpacePatternsPermissions(map[string]pubnub.SpacePermissions{
                "^space-[A-Za-z0-9]*$": { Read: true },
        }).
        Execute()
```

Combined:

```
res, status, err := pn.GrantToken().
        TTL(15).
        AuthorizedUserId("my-authorized-userId").
        SpacesPermissions(map[string]pubnub.SpacePermissions{
                "space-a": { Read: true },
                "space-b": { Read: true, Write: true },
                "space-c": { Read: true, Write: true },
```
*(show all 35 lines)*

---

## Revoke Token

Enable “Revoke v3 Token” in the Admin Portal first.

### Method

```
pn.RevokeToken().
        Token(string)
```

### Usage

```
res, status, err := pn.RevokeToken().
        Token("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...").
        Execute()
```

Returns empty `PNRevokeTokenResponse`.  
Errors: `400`, `403`, `503`.

---

## Parse Token

```
import (
        pubnub "github.com/pubnub/go/v5")
```

### Method

```
pubnub.ParseToken(token string)
```

### Usage

```
pubnub.ParseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...")
```

### Return

```
PNToken{
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
    },
```
*(show all 46 lines)*

---

## Set Token

### Method

```
pn.SetToken(token string)
```

### Usage

```
pn.SetToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAF...")
```

(No return value)

---

Last updated **Apr 29 2025**