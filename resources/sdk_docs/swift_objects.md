# App Context API for Swift Native SDK

App Context (formerly Objects v2) provides serverless storage for user/channel metadata and membership associations. Object data changes can trigger events clients can receive in real time.

> To upgrade from Objects v1, see the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

##### UUID and User ID
`PubNubUUIDMetadataBase` is deprecated but will continue to work as a typealias for `PubNubUserMetadataBase`.

---

## User

### Get metadata for all users

Returns a paginated list of user metadata objects (optionally includes custom data).

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** for your keyset in the [Admin Portal](https://admin.pubnub.com).

#### Method(s)

```
`1func allUserMetadata(  
2    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
3    filter: String? = nil,  
4    sort: [PubNub.ObjectSortField] = [],  
5    limit: Int? = 100,  
6    page: PubNubHashedPage? = Page(),  
7    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
8    completion: ((Result(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?  
9)  
`
```

**Parameters**
- `include: PubNub.UserIncludeFields = PubNub.UserIncludeFields()` — include additional fields.
- `filter: String? = nil` — filter expression ([language](/docs/general/metadata/filtering)).
- `sort: [PubNub.ObjectSortField] = []` — sort fields: `.id`, `.name`, `.type`, `.status`, `.updated`.
- `limit: Int? = 100` — number of objects per page.
- `page: PubNubHashedPage? = PubNub.Page()` — cursor-based pagination using `next`.
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()` — per-request configuration ([docs](/docs/sdks/swift/api-reference/configuration#request-configuration)).
- `completion: ((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)? = nil`

#### UserIncludeFields

`PubNub.UserIncludeFields` controls optional response fields.

Properties (all `Bool`, default `true`):
- `custom` — include `custom` dictionary
- `type` — include `type`
- `status` — include `status`
- `totalCount` — include total available user count

#### Completion handler result

##### Success
Tuple: `[PubNubUserMetadata]` and next `PubNubHashedPage?`.

```
1public protocol PubNubUserMetadata {  
2
  
3  /// The unique identifier of the User  
4  var metadataId: String { get }  
5
  
6  /// The name of the User  
7  var name: String { get set }  
8
  
9  /// The classification of User  
10  var type: String? { get set }  
11
  
12  /// The current state of the User  
13  var status: String? { get set }  
14
  
15  /// The external identifier for the object  
16  var externalId: String? { get set }  
17
  
18  /// The profile URL for the object  
19  var profileURL: String? { get set }  
20
  
21  /// The email address of the object  
22  var email: String? { get set }  
23
  
24  /// The last updated timestamp for the object  
25  var updated: Date? { get set }  
26
  
27  /// The caching identifier for the object  
28  var eTag: String? { get set }  
29
  
30  /// All custom fields set on the object  
31  var custom: [String: JSONCodableScalar]? { get set }  
32}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code

##### Reference code
```
1
  

```

---

### Get user metadata

Returns metadata for a specified user (optionally includes custom data).

#### Method(s)

```
`1func fetchUserMetadata(  
2    _ metadataId: String?,  
3    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((ResultPubNubUserMetadata, Error>) -> Void)?  
6)  
`
```

**Parameters**
- `metadataId: String?` — unique user metadata id; if nil uses request/default config.
- `include: PubNub.UserIncludeFields = PubNub.UserIncludeFields()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<PubNubUserMetadata, Error>) -> Void)? = nil`

#### Completion handler result

##### Success
`PubNubUserMetadata`

```
1public protocol PubNubUserMetadata {  
2
  
3  /// The unique identifier of the User  
4  var metadataId: String { get }  
5
  
6  /// The name of the User  
7  var name: String { get set }  
8
  
9  /// The classification of User  
10  var type: String? { get set }  
11
  
12  /// The current state of the User  
13  var status: String? { get set }  
14
  
15  /// The external identifier for the object  
16  var externalId: String? { get set }  
17
  
18  /// The profile URL for the object  
19  var profileURL: String? { get set }  
20
  
21  /// The email address of the object  
22  var email: String? { get set }  
23
  
24  /// The last updated timestamp for the object  
25  var updated: Date? { get set }  
26
  
27  /// The caching identifier for the object  
28  var eTag: String? { get set }  
29
  
30  /// All custom fields set on the object  
31  var custom: [String: JSONCodableScalar]? { get set }  
32}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Set user metadata

##### Unsupported partial updates of custom metadata
`custom` always overwrites the stored value. To add to existing `custom`, you must:
1. $1  
2. $1  
3. $1  

Sets metadata for a user (optionally includes custom data).

#### Method(s)

```
`1func setUserMetadata(  
2    _ metadata: PubNubUserMetadata,  
3    ifMatchesEtag: String? = nil,  
4    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultPubNubUserMetadata, Error>) -> Void)?  
7)  
`
```

**Parameters**
- `metadata: PubNubUserMetadata` — metadata to set.
- `ifMatchesEtag: String? = nil` — optimistic concurrency; mismatch throws HTTP 412.
- `include: PubNub.UserIncludeFields = PubNub.UserIncludeFields()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<PubNubUserMetadata, Error>) -> Void)? = nil`

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Completion handler result

##### Success
`PubNubUserMetadata`

```
1public protocol PubNubUserMetadata {  
2
  
3  /// The unique identifier of the User  
4  var metadataId: String { get }  
5
  
6  /// The name of the User  
7  var name: String { get set }  
8
  
9  /// The classification of User  
10  var type: String? { get set }  
11
  
12  /// The current state of the User  
13  var status: String? { get set }  
14
  
15  /// The external identifier for the object  
16  var externalId: String? { get set }  
17
  
18  /// The profile URL for the object  
19  var profileURL: String? { get set }  
20
  
21  /// The email address of the object  
22  var email: String? { get set }  
23
  
24  /// The last updated timestamp for the object  
25  var updated: Date? { get set }  
26
  
27  /// The caching identifier for the object  
28  var eTag: String? { get set }  
29
  
30  /// All custom fields set on the object  
31  var custom: [String: JSONCodableScalar]? { get set }  
32}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Remove user metadata

Removes metadata for a specified UUID/user id.

#### Method(s)

```
`1func removeUserMetadata(  
2    _ metadataId: String?,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

**Parameters**
- `metadataId: String?` — unique user metadata id; if nil uses request/default config.
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<String, Error>) -> Void)? = nil`

#### Completion handler result
- **Success:** removed user identifier (`String`)
- **Failure:** `Error`

#### Sample code
```
1
  

```

---

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata objects (optionally includes custom data).

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** for your keyset in the [Admin Portal](https://admin.pubnub.com).

#### Method(s)

```
`1func allChannelMetadata(  
2    include: PubNub.IncludeFields = PubNub.IncludeFields(),  
3    filter: String? = nil,  
4    sort: [PubNub.ObjectSortField] = [],  
5    limit: Int? = 100,  
6    page: PubNubHashedPage? = Page(),  
7    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
8    completion: ((Result(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?  
9)  
`
```

**Parameters**
- `include: PubNub.IncludeFields = PubNub.IncludeFields()`
- `filter: String? = nil` — ([language](/docs/general/metadata/filtering)).
- `sort: [PubNub.ObjectSortField] = []` — `.id`, `.name`, `.type`, `.status`, `.updated`.
- `limit: Int? = 100`
- `page: PubNubHashedPage? = PubNub.Page()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)? = nil`

#### Completion handler result

##### Success
Tuple: `[PubNubChannelMetadata]` and next `PubNubHashedPage?`.

```
1public protocol PubNubChannelMetadata {  
2
  
3  /// The unique identifier of the Channel  
4  var metadataId: String { get }  
5
  
6  /// The name of the Channel  
7  var name: String { get set }  
8
  
9  /// The classification of ChannelMetadata  
10  var type: String? { get set }  
11    
12  /// The current state of the ChannelMetadata  
13  var status: String? { get set }  
14
  
15  /// Text describing the purpose of the channel  
16  var channelDescription: String? { get set }  
17
  
18  /// The last updated timestamp for the object  
19  var updated: Date? { get set }  
20
  
21  /// The caching identifier for the object  
22  var eTag: String? { get set }  
23
  
24  /// All custom fields set on the object  
25  var custom: [String: JSONCodableScalar]? { get set }  
26}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Get channel metadata

Returns metadata for a specified channel (optionally includes custom data).

#### Method(s)

```
`1func fetchChannelMetadata(  
2    _ metadataId: String?,  
3    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((ResultPubNubChannelMetadata, Error>) -> Void)?  
6)  
`
```

**Parameters**
- `metadataId: String?` — unique channel metadata id; if nil uses request/default config.
- `include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<PubNubChannelMetadata, Error>) -> Void)? = nil`

#### ChannelIncludeFields

`PubNub.ChannelIncludeFields` controls optional response fields.

Properties (all `Bool`, default `true`):
- `custom` — include `custom` dictionary
- `type` — include `type`
- `status` — include `status`
- `totalCount` — include total available channel count

#### Completion handler result

##### Success
`PubNubChannelMetadata`

```
1public protocol PubNubChannelMetadata {  
2
  
3  /// The unique identifier of the Channel  
4  var metadataId: String { get }  
5
  
6  /// The name of the Channel  
7  var name: String { get set }  
8
  
9  /// The classification of ChannelMetadata  
10  var type: String? { get set }  
11    
12  /// The current state of the ChannelMetadata  
13  var status: String? { get set }  
14
  
15  /// Text describing the purpose of the channel  
16  var channelDescription: String? { get set }  
17
  
18  /// The last updated timestamp for the object  
19  var updated: Date? { get set }  
20
  
21  /// The caching identifier for the object  
22  var eTag: String? { get set }  
23
  
24  /// All custom fields set on the object  
25  var custom: [String: JSONCodableScalar]? { get set }  
26}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Set channel metadata

##### Unsupported partial updates of custom metadata
`custom` always overwrites the stored value. To add to existing `custom`, you must:
1. $1  
2. $1  
3. $1  

Sets metadata for a channel (optionally includes custom data).

#### Method(s)

```
`1func setChannelMetadata(  
2    _ metadata: PubNubChannelMetadata,  
3    ifMatchesEtag: String? = nil  
4    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultPubNubChannelMetadata, Error>) -> Void)?  
7)  
`
```

**Parameters**
- `metadata: PubNubChannelMetadata` — metadata to set.
- `ifMatchesEtag: String? = nil` — optimistic concurrency; mismatch throws HTTP 412.
- `include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<PubNubChannelMetadata, Error>) -> Void)? = nil`

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Completion handler result

##### Success
`PubNubChannelMetadata`

```
1public protocol PubNubChannelMetadata {  
2
  
3  /// The unique identifier of the Channel  
4  var metadataId: String { get }  
5
  
6  /// The name of the Channel  
7  var name: String { get set }  
8
  
9  /// The classification of ChannelMetadata  
10  var type: String? { get set }  
11    
12  /// The current state of the ChannelMetadata  
13  var status: String? { get set }  
14
  
15  /// Text describing the purpose of the channel  
16  var channelDescription: String? { get set }  
17
  
18  /// The last updated timestamp for the object  
19  var updated: Date? { get set }  
20
  
21  /// The caching identifier for the object  
22  var eTag: String? { get set }  
23
  
24  /// All custom fields set on the object  
25  var custom: [String: JSONCodableScalar]? { get set }  
26}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

#### Other examples

##### Iteratively update existing metadata
```
1
  

```

---

### Remove channel metadata

Removes metadata from a specified channel.

#### Method(s)

```
`1func removeChannelMetadata(  
2    _ metadataId: String?,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

**Parameters**
- `metadataId: String?` — unique channel metadata id; if nil uses request/default config.
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<PubNubChannelMetadata, Error>) -> Void)? = nil` *(as written in source)*

#### Completion handler result
- **Success:** removed channel identifier
- **Failure:** `Error`

#### Sample code
```
1
  

```

---

## Channel memberships

### Get channel memberships

Returns memberships (channels a user belongs to). Does **not** return subscriptions.

#### Method(s)

```
`1func fetchMemberships(  
2    userId: String?,  
3    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
4    filter: String? = nil,  
5    sort: [PubNub.MembershipSortField] = [],  
6    limit: Int? = 100,  
7    page: PubNubHashedPage? = Page(),  
8    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
9    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
10)  
`
```

**Parameters**
- `userId: String?` — unique user metadata id; if nil uses request/default config.
- `include: PubNub.MembershipInclude = PubNub.MembershipInclude()`
- `filter: String? = nil` — ([language](/docs/general/metadata/filtering)).
- `sort: [PubNub.MembershipSortField] = []` — `.object(.id|.name|.type|.status|.updated)`, `.type`, `.status`, `.updated`.
- `limit: Int? = 100`
- `page: PubNubHashedPage? = PubNub.Page()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)? = nil`

#### MembershipInclude

Controls membership fields + associated channel fields.

Defaults:
- `customFields: Bool = true`
- `channelFields: Bool = false` (include full `PubNubChannelMetadata` in membership)
- `typeField: Bool = true`
- `statusField: Bool = true`
- `channelTypeField: Bool = false`
- `channelStatusField: Bool = false`
- `channelCustomFields: Bool = false`
- `totalCount: Bool = false`

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code

- Fetch and handle user channel memberships.
```
1
  

```

- Return sorted channel memberships for the given user ID.
```
1
  

```

---

### Set channel memberships

Sets channel memberships for a user.

#### Method(s)

```
`1func setMemberships(  
2    userId metadataId: String?,  
3    channels memberships: [PubNubMembershipMetadata],  
4    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
5    filter: String? = nil,  
6    sort: [PubNub.MembershipSortField] = [],  
7    limit: Int? = 100,  
8    page: PubNubHashedPage? = Page(),  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
11)  
`
```

**Parameters**
- `userId metadataId: String?` — user metadata id; if nil uses request/default config.
- `channels memberships: [PubNubMembershipMetadata]` — each membership must include `PubNubChannelMetadata` or `channelMetadataId`.
- Remaining parameters identical to `fetchMemberships` (`include`, `filter`, `sort`, `limit`, `page`, `custom`, `completion`).

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Remove channel memberships

Removes channel memberships for a user.

#### Method(s)

```
`1func removeMemberships(  
2    userId metadataId: String?,  
3    channels memberships: [PubNubMembershipMetadata],  
4    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
5    filter: String? = nil,  
6    sort: [PubNub.MembershipSortField] = [],  
7    limit: Int? = 100,  
8    page: PubNubHashedPage? = Page(),  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
11)  
`
```

**Parameters**
Same as `setMemberships`.

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

## Channel members

### Get channel members

Returns members in a channel; includes user metadata for members that have it stored.

#### Method(s)

```
`1func fetchMembers(  
2    channel: String?,  
3    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
4    filter: String? = nil,  
5    sort: [PubNub.MembershipSortField] = [],  
6    limit: Int? = 100,  
7    page: PubNubHashedPage? = Page(),  
8    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
9    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
10)  
`
```

**Parameters**
- `channel: String?` — unique channel metadata id.
- `include: PubNub.MemberInclude = PubNub.MemberInclude()`
- `filter: String? = nil` — ([language](/docs/general/metadata/filtering)).
- `sort: [PubNub.MembershipSortField] = []`
- `limit: Int? = 100`
- `page: PubNubHashedPage? = PubNub.Page()`
- `custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration()`
- `completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)? = nil`

#### MemberInclude

Controls membership fields + associated user fields.

Defaults:
- `customFields: Bool = true`
- `uuidFields: Bool = false` (include full `PubNubUserMetadata` in membership)
- `statusField: Bool = true`
- `typeField: Bool = true`
- `uuidTypeField: Bool = false`
- `uuidStatusField: Bool = false`
- `uuidCustomFields: Bool = false`
- `totalCount: Bool = false`

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Set channel members

Sets members in a channel.

#### Method(s)

```
`1func setMembers(  
2    channel metadataId: String,  
3    users members: [PubNubMembershipMetadata],  
4    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
5    filter: String? = nil,  
6    sort: [PubNub.MembershipSortField] = [],  
7    limit: Int? = 100,  
8    page: PubNubHashedPage? = Page(),  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
11)  
`
```

**Parameters**
- `channel metadataId: String` — unique channel identifier.
- `users members: [PubNubMembershipMetadata]` — each membership must include `PubNubUserMetadata` or `userMetadataId`.
- Remaining parameters as in `fetchMembers`.

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userdMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
  

```

---

### Remove channel members

Removes members from a channel.

#### Method(s)

```
`1func removeMembers(  
2    channel metadataId: String,  
3    users members: [PubNubMembershipMetadata],  
4    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
5    filter: String? = nil,  
6    sort: [PubNub.MembershipSortField] = [],  
7    limit: Int? = 100,  
8    page: PubNubHashedPage? = Page(),  
9    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
10    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
11)  
`
```

**Parameters**
- `channel metadataId: String` — unique channel identifier.
- `users members: [PubNubMembershipMetadata]` — membership entries containing `PubNubUserMetadata` or `userMetadataId`.
- Remaining parameters as in `fetchMembers`.

#### Completion handler result

##### Success
Tuple: `[PubNubMembershipMetadata]` and next page.

```
1public protocol PubNubMembershipMetadata {  
2
  
3  /// The unique identifier of the associated User  
4  var userdMetadataId: String { get }  
5
  
6  /// The unique identifier of the associated Channel  
7  var channelMetadataId: String { get }  
8
  
9  /// The current status of the MembershipMetadata  
10  var status: String? { get set }  
11    
12  /// The current type of the MembershipMetadata  
13  var type: String? { get set }  
14
  
15  /// The associated User metadata  
16  var user: PubNubUserMetadata? { get set }  
17
  
18  /// The associated Channel metadata  
19  var channel: PubNubChannelMetadata? { get set }  
20
  
21  /// The last updated timestamp for the object  
22  var updated: Date? { get set }  
23
  
24  /// The caching identifier for the object  
25  var eTag: String? { get set }  
26
  
27  /// All custom fields set on the object  
28  var custom: [String: JSONCodableScalar]? { get set }  
29}  

```

```
1public protocol PubNubHashedPage {  
2
  
3  /// The hash value representing the next set of data  
4  var start: String? { get }  
5
  
6  /// The hash value representing the previous set of data  
7  var end: String? { get }  
8
  
9  /// The total count of all objects withing range  
10  var totalCount: Int? { get }  
11}  

```

##### Failure
`Error`

#### Sample code
```
1
**
```

Last updated on Dec 15, 2025**