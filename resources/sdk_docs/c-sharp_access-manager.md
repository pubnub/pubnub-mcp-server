# Access Manager v3 – C# SDK (Condensed)

> ALL code blocks, method signatures, parameters, and examples are preserved verbatim.

---

## Request Execution

We recommend wrapping SDK calls in `try/catch`.  
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
}`  
```

---

## Grant Token

Requires *Access Manager* add-on.

### Method
```
`pubnub.GrantToken()  
      .TTL(int)  
      .Meta(Dictionarystring, object>)  
      .AuthorizedUuid(string)  
      .Resources(PNTokenResources)  
      .Patterns(PNTokenPatterns)  
      .QueryParam(Dictionarystring, object>)`  
```

### Parameters (essential)

* **TTL (int)** – 1 … 43 ,200 min (required).  
* **AuthorizedUuid (string)** – restricts token to one client.  
* **Resources / Patterns** – `PNTokenResources / PNTokenPatterns` objects with per-resource `PNTokenAuthValues`.  
* **Meta** – `Dictionary<string,object>` (scalar values only).  
* **Execute / ExecuteAsync** – sync callback or `PNResult<PNAccessManagerTokenResult>`.

`PNTokenAuthValues` boolean flags: `Read`, `Write`, `Manage`, `Delete`, `Get`, `Update`, `Join`.

At least one permission must be set on Channels, ChannelGroups, or Uuids (or RegEx patterns).

### Sample Code
```
`  
`
```

### Return
`PNResult<PNAccessManagerTokenResult>` → `Token` string.
```
`{ "Token":"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI" }`  
```

### Error
HTTP 400 on invalid input (e.g., bad RegEx, timestamp, or permissions).

#### Example: Mixed permissions in one call
```
`  
`
```

#### Example: RegEx read access
```
`  
`
```

#### Example: Resources + RegEx in one grant
```
`  
`
```

---

## Revoke Token

Requires *Access Manager* add-on (enable “Revoke v3 Token” in portal).

### Method
```
`pubnub.RevokeToken()  
        .Token(string)  
        .QueryParam(Dictionarystring, object>)`  
```

### Parameters
* **Token (string)** – previously granted v3 token.  
* **Execute / ExecuteAsync** – returns `PNResult<PNAccessManagerRevokeTokenResult>`.

### Sample
```
`  
`
```

### Errors
May return 400, 403, 503.

---

## Parse Token
```
`ParseToken(String token)`  
```
Returns decoded permission object.
```
`  
`
```

---

## Set Token
```
`SetAuthToken(String token)`  
```
No return value.
```
`  
`
```

---

## Grant Token – Spaces & Users (Deprecated)

Use the standard `GrantToken()` instead. API, parameters, and code blocks remain identical except:

* `AuthorizedUserId` replaces `AuthorizedUuid`.
* Resources/Patterns contain `Spaces` and `Users`.

### Method
```
`pubnub.GrantToken()  
      .TTL(int)  
      .Meta(Dictionarystring, object>)  
      .AuthorizedUserId(string)  
      .Resources(PNTokenResources)  
      .Patterns(PNTokenPatterns)  
      .QueryParam(Dictionarystring, object>)`  
```

`PNTokenResources / PNTokenPatterns` hold `Spaces` and `Users`.

### Sample / Other Examples
```
`  
`
```

### Error
Same 400 response rules as current API.

---

_Last updated: Jul 15 2025_