# Access Manager v3 – Unity SDK (condensed)

Access Manager issues time-limited tokens with embedded permissions.  
PAM must be enabled for your keyset.

---

## GrantToken – Channels, ChannelGroups, UUIDs

### Method
```
pubnub.GrantToken()  
    .TTL(int)  
    .Meta(Dictionary<string, object>)  
    .AuthorizedUuid(string)  
    .Resources(PNTokenResources)  
    .Patterns(PNTokenPatterns)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNAccessManagerTokenResult, PNStatus>)
```
`ExecuteAsync()` returns `Task<PNResult<PNAccessManagerTokenResult>>`.

### Parameters (summary)
* TTL (int, 1-43 200 min) – required.  
* Meta (Dictionary<string,object>) – scalar values only.  
* AuthorizedUuid (string) – lock token to one client.  
* Resources / Patterns – supply at least one permission set.  
* QueryParam – optional debug params.

### Permission object types
* PNTokenResources / PNTokenPatterns  
  * Channels, ChannelGroups, Uuids → `Dictionary<string, PNTokenAuthValues>`
* PNTokenAuthValues  
  * bool flags: Read, Write, Manage, Delete, Get, Update, Join

### Basic usage
```
`using System.Collections.Generic;  
using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class GrantTokenExample : MonoBehaviour {  
    //Reference to a pubnub manager previously setup in Unity Editor  
    //For more details see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    //NOTE: For Access Management to work the keyset must have PAM enabled  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    //An editor-serialized string with the test channel ID  
    [SerializeField] private string testChannelId = "test_channel_id";  
  
    private async void Start() {  
`
```
show all 51 lines

### Other examples
#### Mixed resources
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUuid("my-authorized-uuid")  
    .Resources(new PNTokenResources()  
    {  
        Channels = new Dictionarystring, PNTokenAuthValues>() {  
            { "channel-a", new PNTokenAuthValues() { Read = true } },  
            { "channel-b", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "channel-c", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "channel-d", new PNTokenAuthValues() { Read = true, Write = true } }},  
        ChannelGroups = new Dictionarystring, PNTokenAuthValues>() {   
            { "channel-group-b", new PNTokenAuthValues() { Read = true } } },  
        Uuids = new Dictionarystring, PNTokenAuthValues>() {   
            { "uuid-c", new PNTokenAuthValues() { Get = true } },  
            { "uuid-d", new PNTokenAuthValues() { Get = true, Update = true } }}  
`
```
show all 27 lines

#### RegEx channels
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUuid("my-authorized-uuid")  
    .Patterns(new PNTokenPatterns()  
    {  
        Channels = new Dictionarystring, PNTokenAuthValues>() {  
            { "channel-[A-Za-z0-9]", new PNTokenAuthValues() { Read = true } }}  
    })  
    .ExecuteAsync();  
PNAccessManagerTokenResult grantTokenResult = grantTokenResponse.Result;  
PNStatus grantTokenStatus = grantTokenResponse.Status;  
if (!grantTokenStatus.Error && grantTokenResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(grantTokenResult));  
}  
`
```
show all 20 lines

#### Resources + RegEx
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUuid("my-authorized-uuid")  
    .Resources(new PNTokenResources()  
    {  
        Channels = new Dictionarystring, PNTokenAuthValues>() {  
            { "channel-a", new PNTokenAuthValues() { Read = true } },  
            { "channel-b", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "channel-c", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "channel-d", new PNTokenAuthValues() { Read = true, Write = true } }},  
        ChannelGroups = new Dictionarystring, PNTokenAuthValues>() {  
            { "channel-group-b", new PNTokenAuthValues() { Read = true } } },  
        Uuids = new Dictionarystring, PNTokenAuthValues>() {  
            { "uuid-c", new PNTokenAuthValues() { Get = true } },  
            { "uuid-d", new PNTokenAuthValues() { Get = true, Update = true } }}  
`
```
show all 32 lines

### Return
`PNResult<PNAccessManagerTokenResult>` → `Result.Token` (string):
```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

---

## GrantToken – Spaces & Users

### Method
```
pubnub.GrantToken()  
    .TTL(int)  
    .Meta(Dictionary<string, object>)  
    .AuthorizedUserId(string)  
    .Resources(PNTokenResources)  
    .Patterns(PNTokenPatterns)  
    .QueryParam(Dictionary<string,object>)  
    .Execute(System.Action<PNAccessManagerTokenResult, PNStatus>)
```
Parameter types are identical; `Spaces` & `Users` replace Channels/Groups/Uuids.

### Basic usage
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUserId("my-authorized-userId")  
    .Resources(new PNTokenResources()   
    {  
        Spaces = new Dictionarystring, PNTokenAuthValues>() {  
                            { "my-space", new PNTokenAuthValues() { Read = true } } } // False to disallow  
    })   
    .ExecuteAsync();  
PNAccessManagerTokenResult grantTokenResult = grantTokenResponse.Result;  
PNStatus grantTokenStatus = grantTokenResponse.Status;  
// PNAccessManagerTokenResult is a parsed and abstracted response from the server  
if (!grantTokenStatus.Error && grantTokenResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(grantTokenResult));  
`
```
show all 20 lines

### Additional examples
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUserId("my-authorized-userId")  
    .Resources(new PNTokenResources()  
    {  
        Spaces = new Dictionarystring, PNTokenAuthValues>() {  
            { "space-a", new PNTokenAuthValues() { Read = true } },  
            { "space-b", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "space-c", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "space-d", new PNTokenAuthValues() { Read = true, Write = true } }},  
        Users = new Dictionarystring, PNTokenAuthValues>() {   
            { "user-c", new PNTokenAuthValues() { Get = true } },  
            { "user-d", new PNTokenAuthValues() { Get = true, Update = true } }}  
    })  
    .ExecuteAsync();  
`
```
show all 25 lines

RegEx only:
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUserId("my-authorized-userId")  
    .Patterns(new PNTokenPatterns()  
    {  
        Spaces = new Dictionarystring, PNTokenAuthValues>() {  
            { "space-[A-Za-z0-9]", new PNTokenAuthValues() { Read = true } }}  
    })  
    .ExecuteAsync();  
PNAccessManagerTokenResult grantTokenResult = grantTokenResponse.Result;  
PNStatus grantTokenStatus = grantTokenResponse.Status;  
if (!grantTokenStatus.Error && grantTokenResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(grantTokenResult));  
}  
`
```

Resources + RegEx:
```
`PNResultPNAccessManagerTokenResult> grantTokenResponse = await pubnub.GrantToken()  
    .TTL(15)  
    .AuthorizedUserId("my-authorized-userId")  
    .Resources(new PNTokenResources()  
    {  
        Spaces = new Dictionarystring, PNTokenAuthValues>() {  
            { "space-a", new PNTokenAuthValues() { Read = true } },  
            { "space-b", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "space-c", new PNTokenAuthValues() { Read = true, Write = true } },  
            { "space-d", new PNTokenAuthValues() { Read = true, Write = true } }},  
        Users = new Dictionarystring, PNTokenAuthValues>() {  
            { "user-c", new PNTokenAuthValues() { Get = true } },  
            { "user-d", new PNTokenAuthValues() { Get = true, Update = true } }}  
    })  
    .Patterns(new PNTokenPatterns()  
`
```
show all 30 lines

### Return
Same as channel variant:
```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"}  
`
```

---

## RevokeToken

### Method
```
pubnub.RevokeToken()  
    .Token(string)  
    .QueryParam(Dictionary<string, object>)  
    .Execute(System.Action<PNAccessManagerRevokeTokenResult, PNStatus>)
```
`ExecuteAsync()` returns `Task<PNResult<PNAccessManagerRevokeTokenResult>>`.

### Example
```
`PNResultPNAccessManagerRevokeTokenResult> revokeTokenResponse = await pubnub  
    .RevokeToken()  
    .Token("p0thisAkFl043rhDdHRsCkNDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
    .ExecuteAsync();  
PNAccessManagerRevokeTokenResult revokeTokenResult = revokeTokenResponse.Result;  
PNStatus revokeTokenStatus = revokeTokenResponse.Status;  
if (!revokeTokenStatus.Error && revokeTokenResult != null)  
{  
    Debug.Log("Revoke token success");  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(revokeTokenStatus));  
}  
`
```

---

## ParseToken

### Method
```
ParseToken(String token)
```

### Example
```
`pubnub.ParseToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

Returns a `TokenContents` object (Resources, Patterns, Meta, Signature, Version, Timestamp, TTL, AuthorizedUUID).

---

## SetAuthToken

### Method
```
SetAuthToken(String token)
```

### Example
```
`pubnub.SetAuthToken("p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI")  
`
```

*No return value.*

---

### Error handling (all calls)
`400 Bad Request`, `403 Forbidden`, `503 Service Unavailable` with descriptive message.