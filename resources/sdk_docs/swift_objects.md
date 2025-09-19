# PubNub Swift SDK – App Context (Objects v2)

• `PubNubUUIDMetadataBase` is deprecated; it aliases `PubNubUserMetadataBase`.

## Users

### Get All User Metadata
```
func allUserMetadata(
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),
    filter: String? = nil,
    sort: [PubNub.ObjectSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?
)
```
Parameters  
• `include` – fields to return (see *UserIncludeFields*).  
• `filter`, `sort`, `limit`, `page` – pagination utilities.  
• `custom` – per-request configuration.  
• `completion` – `Result<(users,next)>`.

### Get User Metadata
```
func fetchUserMetadata(
    _ metadataId: String?,
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<PubNubUserMetadata, Error>) -> Void)?
)
```
`metadataId` defaults to configured UUID when `nil`.

### Set User Metadata
```
func setUserMetadata(
    _ metadata: PubNubUserMetadata,
    ifMatchesEtag: String? = nil,
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<PubNubUserMetadata, Error>) -> Void)?
)
```
`ifMatchesEtag` ensures optimistic concurrency (HTTP 412 on mismatch).  
Custom payload always overwrites existing server value.

### Remove User Metadata
```
func removeUserMetadata(
    _ metadataId: String?,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<String, Error>) -> Void)?
)
```

#### UserIncludeFields
Controls returned fields.
```
struct PubNub.UserIncludeFields {
  var custom     = true
  var type       = true
  var status     = true
  var totalCount = true
}
```

#### Common Result Types
```
public protocol PubNubUserMetadata {
  var metadataId: String { get }
  var name: String { get set }
  var type: String? { get set }
  var status: String? { get set }
  // …additional fields…
}

public protocol PubNubHashedPage {
  var start: String? { get }
  var end: String? { get }
  var totalCount: Int? { get }
}
```

---

## Channels

### Get All Channel Metadata
```
func allChannelMetadata(
    include: PubNub.IncludeFields = PubNub.IncludeFields(),
    filter: String? = nil,
    sort: [PubNub.ObjectSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?
)
```

### Get Channel Metadata
```
func fetchChannelMetadata(
    _ metadataId: String?,
    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?
)
```

### Set Channel Metadata
```
func setChannelMetadata(
    _ metadata: PubNubChannelMetadata,
    ifMatchesEtag: String? = nil,
    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?
)
```

### Remove Channel Metadata
```
func removeChannelMetadata(
    _ metadataId: String?,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<String, Error>) -> Void)?
)
```

#### ChannelIncludeFields
```
struct PubNub.ChannelIncludeFields {
  var custom     = true
  var type       = true
  var status     = true
  var totalCount = true
}
```

#### Channel Metadata Protocol
```
public protocol PubNubChannelMetadata {
  var metadataId: String { get }
  var name: String { get set }
  var type: String? { get set }
  var status: String? { get set }
  // …additional fields…
}
```

---

## Channel Memberships (User → Channels)

### Get Memberships
```
func fetchMemberships(
    userId: String?,
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Set Memberships
```
func setMemberships(
    userId metadataId: String?,
    channels memberships: [PubNubMembershipMetadata],
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Remove Memberships
```
func removeMemberships(
    userId metadataId: String?,
    channels memberships: [PubNubMembershipMetadata],
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

#### MembershipInclude
```
struct PubNub.MembershipInclude {
  var customFields        = true
  var channelFields       = false
  var typeField           = true
  var statusField         = true
  var channelTypeField    = false
  var channelStatusField  = false
  var channelCustomFields = false
  var totalCount          = false
}
```

#### Membership Metadata Protocol
```
public protocol PubNubMembershipMetadata {
  var userMetadataId: String { get }
  var channelMetadataId: String { get }
  var status: String? { get set }
  var type: String? { get set }
  // …associated metadata…
}
```

---

## Channel Members (Channel → Users)

### Get Members
```
func fetchMembers(
    channel: String?,
    include: PubNub.MemberInclude = PubNub.MemberInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Set Members
```
func setMembers(
    channel metadataId: String,
    users members: [PubNubMembershipMetadata],
    include: PubNub.MemberInclude = PubNub.MemberInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Remove Members
```
func removeMembers(
    channel metadataId: String,
    users members: [PubNubMembershipMetadata],
    include: PubNub.MemberInclude = PubNub.MemberInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

#### MemberInclude
```
struct PubNub.MemberInclude {
  var customFields     = true
  var uuidFields       = false
  var statusField      = true
  var typeField        = true
  var uuidTypeField    = false
  var uuidStatusField  = false
  var uuidCustomFields = false
  var totalCount       = false
}
```

*All completion handlers return either the described payload(s) or `Error`.*

_Last updated Jul 15 2025_