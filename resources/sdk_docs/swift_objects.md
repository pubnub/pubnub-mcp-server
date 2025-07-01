# PubNub Swift SDK – App Context (Objects v2)

`PubNubUUIDMetadataBase` is deprecated (type-alias of `PubNubUserMetadataBase`).

---

## User

### Get Metadata for All Users

```
func allUserMetadata(
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),
    filter: String? = nil,
    sort: [PubNub.ObjectSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?
)
```

Parameter highlights  
• `include` – `PubNub.UserIncludeFields()` (custom/type/status/totalCount flags)  
• `filter` – expression string (see filtering docs)  
• `sort` – `[.id, .name, .type, .status, .updated]`  
• Standard `limit`, `page`, `requestConfig`, `completion`

---

### Get User Metadata

```
func fetchUserMetadata(
    _ metadataId: String?,
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<PubNubUserMetadata, Error>) -> Void)?
)
```

---

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

`custom` data is always replaced (no partial update).

---

### Remove User Metadata

```
func removeUserMetadata(
    _ metadataId: String?,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<String, Error>) -> Void)?
)
```

---

## Channel

### Get Metadata for All Channels

```
func allChannelMetadata(
    include: PubNub.IncludeFields = PubNub.IncludeFields(),
    filter: String? = nil,
    sort: [PubNub.ObjectSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?
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

---

## Channel Memberships (User → Channels)

### Get Channel Memberships

```
func fetchMemberships(
    userId: String?,
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Set Channel Memberships

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
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Remove Channel Memberships

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
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

---

## Channel Members (Channel → Users)

### Get Channel Members

```
func fetchMembers(
    channel: String?,
    include: PubNub.MemberInclude = PubNub.MemberInclude(),
    filter: String? = nil,
    sort: [PubNub.MembershipSortField] = [],
    limit: Int? = 100,
    page: PubNubHashedPage? = Page(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Set Channel Members

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
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

### Remove Channel Members

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
    completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?
)
```

---

## Shared Model Definitions

```
public protocol PubNubUserMetadata {
  var metadataId: String { get }
  var name: String { get set }
  var type: String? { get set }
  var status: String? { get set }
  var externalId: String? { get set }
  var profileURL: String? { get set }
  var email: String? { get set }
  var custom: [String: JSONCodableScalar]? { get set }
  var updated: String? { get }
  var eTag: String? { get }
}

public protocol PubNubChannelMetadata {
  var metadataId: String { get }
  var name: String { get set }
  var description: String? { get set }
  var type: String? { get set }
  var status: String? { get set }
  var custom: [String: JSONCodableScalar]? { get set }
  var updated: String? { get }
  var eTag: String? { get }
}

public protocol PubNubMembershipMetadata {
  var userMetadataId: String { get }
  var channelMetadataId: String { get }
  var status: String? { get set }
  var type: String? { get set }
  var custom: [String: JSONCodableScalar]? { get set }
  var updated: String? { get }
  var eTag: String? { get }
  var user: PubNubUserMetadata? { get }
  var channel: PubNubChannelMetadata? { get }
}

public protocol PubNubHashedPage {
  var start: String? { get }
  var end: String? { get }
  var totalCount: Int? { get }
}
```

---

### Include-Field Types

```
struct PubNub.UserIncludeFields     { var custom = true; var type = true; var status = true; var totalCount = true }
struct PubNub.ChannelIncludeFields  { var custom = true; var type = true; var status = true; var totalCount = true }

struct PubNub.MembershipInclude {
  var customFields = true
  var channelFields = false
  var typeField = true
  var statusField = true
  var channelTypeField = false
  var channelStatusField = false
  var channelCustomFields = false
  var totalCount = false
}

struct PubNub.MemberInclude {
  var customFields = true
  var uuidFields = false
  var statusField = true
  var typeField = true
  var uuidTypeField = false
  var uuidStatusField = false
  var uuidCustomFields = false
  var totalCount = false
}
```

---

All methods support optional `filter`, `sort`, cursor-based `page`, `limit`, per-request `requestConfig`, and asynchronous `completion` returning `Result` with the appropriate model(s) and optional `next` `PubNubHashedPage`.