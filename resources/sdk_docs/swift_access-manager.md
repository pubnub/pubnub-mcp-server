# Access Manager v3 API for Swift SDK

Access Manager enforces security controls for client access to PubNub resources (channels, channel groups, UUID metadata) via server-issued tokens with embedded permissions:

- Valid for a limited time (`ttl`).
- Scoped to resource lists or regex patterns.
- Granted in a single request even with different permission levels per resource (e.g., `read` on `channel1`, `write` on `channel2`).
- Optional **authorized UUID** restriction: include the [authorized UUID](/docs/general/security/access-control#authorized-uuid) in the grant so only that `uuid` can use the token for permitted resources.

More details: [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

##### Client device support only

Swift SDK supports **client-side** Access Manager only: you **cannot grant** permissions with Swift; you can **parse** and **set** tokens received from a server SDK.

## Parse token[​](#parse-token)

Use `parse()` to decode an existing token and return an object containing embedded permissions and token details (including `ttl`). Useful for debugging.

### Method(s)[​](#methods)

```
`1func parse(token: String)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Sample code[​](#sample-code)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns[​](#returns)

Returns a `PAMToken` struct:

```
1struct PAMToken {  
2    
3  /// Token version  
4  public let version: Int { get }  
5    
6  /// Token generation date and time  
7  public let timestamp: Int { get }  
8    
9  /// Maximum amount of time (in minutes) during which the token will be valid  
10  public let ttl: Int { get }  
11    
12  /// The uuid that is exclusively authorized to use this token to make API requests  
13  public let authorizedUUID: String? { get }  
14    
15  /// Permissions granted to specific resources  
16  public let resources: PAMTokenResource { get }  
17    
18  /// Permissions granted to resources which match a specified regular expression  
19  public let patterns: PAMTokenResource { get }  
20
  
21  /// Additional information which has been added to the token  
22  public let meta: [String: AnyJSON] { get }  
23
  
24  /// The computed signature  
25  public let signature: String { get }  
26}  

```
show all 26 lines

Resource and pattern permissions are stored in `PAMTokenResource`:

```
1struct PAMTokenResource {  
2
  
3  /// Permissions granted to specific / regexp matching channels  
4  public let channels: [String: PAMPermission] { get }  
5    
6  /// Permissions granted to specific / regexp matching channel groups  
7  public let groups: [String: PAMPermission] { get }  
8    
9  /// Permissions granted to specific / regexp matching uuids  
10  public let uuids: [String: PAMPermission] { get }  
11}  

```

### Error responses[​](#error-responses)

If parsing fails, the token may be damaged; request a new token from the server.

## Set token[​](#set-token)

Use `set()` on client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-1)

```
`1func set(token: String)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

No return value.

Last updated on **Sep 3, 2025**