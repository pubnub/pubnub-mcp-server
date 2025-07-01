On this page
# Access Manager v3 API for Swift SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources, such as channels, channel groups, and UUID metadata:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [authorized UUID](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to only one client with a given `uuid`. Once specified, only this authorized UUID will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

For more information about Access Manager v3, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

##### Client device support only

The Swift SDK supports only client implementation of Access Manager functionality. This means that you cannot use it to grant permissions, but rather to parse and set tokens received from a server SDK.

## Parse Token[​](#parse-token)

The `parse()` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` (time to live) details.

### Method(s)[​](#methods)

```
`func parse(token: String)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

This method responds with a struct of `PAMToken`:

```
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
```
show all 26 lines

See the resource and pattern permissions stored in the `PAMTokenResource` structure:

```
`struct PAMTokenResource {  
  
  /// Permissions granted to specific / regexp matching channels  
  public let channels: [String: PAMPermission] { get }  
    
  /// Permissions granted to specific / regexp matching channel groups  
  public let groups: [String: PAMPermission] { get }  
    
  /// Permissions granted to specific / regexp matching uuids  
  public let uuids: [String: PAMPermission] { get }  
}  
`
```

### Error Responses[​](#error-responses)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `set()` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-1)

```
`func set(token: String)  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

This method doesn't return any response value.
Last updated on **Jun 12, 2025**