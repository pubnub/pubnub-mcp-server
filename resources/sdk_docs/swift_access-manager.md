# Access Manager v3 API for Swift SDK

Access Manager v3 lets servers grant clients time-limited tokens with embedded permissions to PubNub resources (channels, channel groups, UUID metadata). Permissions can be:
- Time-bound (TTL).
- Applied to specific resources or patterns (regex).
- Mixed per resource in one grant (for example, read to channel1 and write to channel2).
- Restricted to an authorized UUID (only that UUID can use the token).

For end-to-end details, see Manage Permissions with Access Manager v3.

##### Client device support only
Swift SDK supports only client-side Access Manager operations: parse and set tokens received from a server. It does not grant permissions.

## Parse token

Decode a token and inspect its embedded permissions and TTL.

### Method(s)

```
`1func parse(token: String)  
`
```

- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

This method responds with a struct of PAMToken:

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

See the resource and pattern permissions stored in the PAMTokenResource structure:

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

If parsing fails, the token may be damaged. Request a new token from the server.

## Set token

Update the authentication token on the client.

### Method(s)

```
`1func set(token: String)  
`
```

- token (String, required): Current token with embedded permissions.

### Sample code

```
1
  

```

### Returns

This method doesn't return any response value.

Last updated on Sep 3, 2025