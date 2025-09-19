# Access Manager v3 API for Swift SDK

The Swift SDK supports only client-side Access Manager operations: you can **parse** and **set** tokens provided by your server. Token creation (permission grants) must be done on a server SDK.

## Parse token

Decode an existing token and inspect its permissions.

### Method
````
`func parse(token: String)  
`
````

Parameter  
• `token` (String) – current token.

### Returns
````
`struct PAMToken {  
    
  /// Token version  
  public let version: Int { get }  
    
  /// Token generation date and time  
  public let timestamp: Int { get }  
    
  /// Maximum amount of time (in minutes) during which the token will be valid  
  public let ttl: Int { get }  
    
  /// The uuid that is exclusively authorized to use this token to make API requests  
  public let authorizedUUID: String? { get }  
    
  /// Permissions granted to specific resources  
`
````

Resource & pattern permissions:
````
`struct PAMTokenResource {  
  
  /// Permissions granted to specific / regexp matching channels  
  public let channels: [String: PAMPermission] { get }  
    
  /// Permissions granted to specific / regexp matching channel groups  
  public let groups: [String: PAMPermission] { get }  
    
  /// Permissions granted to specific / regexp matching uuids  
  public let uuids: [String: PAMPermission] { get }  
}  
`
````

### Sample code
````
`  
`
````

### Error
A parse error indicates a corrupted token; request a new one from the server.

---

## Set token

Update the SDK with a new token received from the server.

### Method
````
`func set(token: String)  
`
````

Parameter  
• `token` (String) – current token.

### Sample code
````
`  
`
````

### Returns
No value.

_Last updated: Jul 15 2025_