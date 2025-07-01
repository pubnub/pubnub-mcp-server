# Access Manager v3 – C# SDK (Concise Reference)

Access Manager lets your server issue time-limited tokens that encode fine-grained permissions for PubNub resources.  
Enable the **Access Manager** add-on (and, for revocation, “Revoke v3 Token”) in the Admin Portal before using these APIs.

---

## Error Handling Pattern
```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

---

## GrantToken()

### Signature
```
`pubnub.GrantToken()  
      .TTL(int)                      // 1-43 200 minutes (required)  
      .Meta(Dictionary<string,object>)  
      .AuthorizedUuid(string)        // restrict token to single UUID  
      .Resources(PNTokenResources)   // explicit lists  
      .Patterns(PNTokenPatterns)     // RegEx permissions  
      .QueryParam(Dictionary<string,object>)  
`
```

`Execute( PNCallback<PNAccessManagerTokenResult> )`  
`ExecuteAsync() → PNResult<PNAccessManagerTokenResult>`

### Permission Objects
• `PNTokenResources` / `PNTokenPatterns`  
  • `Channels` - `read, write, get, manage, update, join, delete`  
  • `ChannelGroups` - `read, manage`  
  • `Uuids` - `get, update, delete`  
  (use `PNTokenAuthValues` booleans: `Read, Write, Manage, Delete, Get, Update, Join`)

At least one permission (resource or pattern) is mandatory.

### Return
`PNResult<PNAccessManagerTokenResult>` → `Token` (string) and `PNStatus`.
```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6...WGJI"}  
`
```

### Examples
_All sample blocks preserved as supplied in original doc_
```
`  
`
```
```
`  
`
```
```
`  
`
```

---

## RevokeToken()

### Signature
```
`pubnub.RevokeToken()  
        .Token(string)               // previously issued token (required)  
        .QueryParam(Dictionary<string,object>)  
`
```

`Execute( PNCallback<PNAccessManagerRevokeTokenResult> )`  
`ExecuteAsync() → PNResult<PNAccessManagerRevokeTokenResult>`

### Examples
```
`  
`
```

---

## ParseToken()

```
`ParseToken(String token)  
`
```
Returns decoded permissions object (useful for debugging).
```
`  
`
```
```
`  
`
```

---

## SetAuthToken()  (client-side)

```
`SetAuthToken(String token)  
`
```
Applies a new token to the current PubNub instance.
```
`  
`
```

---

## Deprecated: Spaces & Users GrantToken()

(Use standard `GrantToken()` instead.)

### Signature
```
`pubnub.GrantToken()  
      .TTL(int)  
      .Meta(Dictionary<string,object>)  
      .AuthorizedUserId(string)  
      .Resources(PNTokenResources)    // Spaces, Users  
      .Patterns(PNTokenPatterns)      // RegEx for Spaces, Users  
      .QueryParam(Dictionary<string,object>)  
`
```
Permissions: `Spaces` and `Users` with the same action flags as above.

### Return / Example Token
Same as current API.
```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6...WGJI"}  
`
```

### Example Blocks
```
`  
`
```
```
`  
`
```
```
`  
`
```

---

## Error Codes
400 Bad Request – invalid/missing arguments (TTL, RegEx, timestamp, etc.)  
403 Forbidden – unauthorized or bad token  
503 Service Unavailable – network/server issue

_Last updated Jun 30 2025_