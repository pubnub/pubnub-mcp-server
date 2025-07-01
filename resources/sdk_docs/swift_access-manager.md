# Access Manager v3 API – Swift SDK (Client-side)

Access Manager v3 lets your server issue tokens that grant time-limited, fine-grained permissions (read, write, etc.) on channels, channel groups, and UUID metadata.  
The Swift SDK is **client-only**: it can *parse* and *set* tokens received from your server, but it **cannot** grant or revoke permissions.

---

## Parse Token

Decode an existing token to inspect its permissions and TTL.

### Method
```swift
func parse(token: String)
```
* **token** – `String` (required)  
  The token containing embedded permissions.

### Return
```swift
struct PAMToken {
  /// Token version
  public let version: Int { get }

  /// Token generation timestamp
  public let timestamp: Int { get }

  /// Token validity in minutes
  public let ttl: Int { get }

  /// UUID exclusively authorized to use this token
  public let authorizedUUID: String? { get }

  /// Permissions for exact resources
  public let resources: PAMTokenResource { get }

  /// Permissions for pattern resources
  public let patterns: PAMTokenResource { get }
}
```

Resource & pattern permissions:
```swift
struct PAMTokenResource {
  /// Channel permissions
  public let channels: [String: PAMPermission] { get }

  /// Channel-group permissions
  public let groups: [String: PAMPermission] { get }

  /// UUID permissions
  public let uuids: [String: PAMPermission] { get }
}
```

#### Error
A parse error indicates a corrupted token; request a new token from the server.

---

## Set Token

Attach / replace the current authentication token on the client.

### Method
```swift
func set(token: String)
```
* **token** – `String` (required)  
  The new token to use for all subsequent PubNub API calls.

### Return
No value (void).

---

_Last updated: Jun 12 2025_