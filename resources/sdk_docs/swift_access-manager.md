# Access Manager v3 API for Swift SDK

Access Manager v3 issues tokens with embedded permissions granting client access to PubNub resources (channels, channel groups, UUID metadata):
- For a limited time (ttl in minutes).
- Via explicit resources or pattern-based (regular expression) matches.
- Mixed permission levels in one token (for example, `read` to `channel1`, `write` to `channel2`).
- Optional authorized UUID: restricts token usage to a single `uuid`.

For details on Access Manager v3, see Manage Permissions with Access Manager v3.

##### Client device support only
Swift SDK is client-only for Access Manager: you can parse and set server-issued tokens; you cannot grant permissions from the client.

## Parse token

The `parse()` method decodes an existing token and returns the permissions embedded in that token.

### Method(s)

```
`1func parse(token: String)  
`
```

- token (required) Type: String. Current token with embedded permissions.

### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

### Returns

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

### Error responses

Errors during parsing may indicate a damaged token. Request a new token from your server.

## Set token

The `set()` method updates the client’s authentication token granted by the server.

### Method(s)

```
`1func set(token: String)  
`
```

- token (required) Type: String. Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

No return value.

Last updated on Sep 3, 2025