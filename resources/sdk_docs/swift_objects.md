# App Context API for Swift Native SDK (Objects v2)

App Context provides serverless storage for user and channel metadata and their membership associations, plus real-time events on changes. For Objects v1 upgrades, see the migration guide.

Note: PubNubUUIDMetadataBase is deprecated; it aliases PubNubUserMetadataBase.

## User

### Get metadata for all users

Returns a paginated list of user metadata objects (optionally including custom data).

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

- include: PubNub.UserIncludeFields, default PubNub.UserIncludeFields(). Additional fields to include.
- filter: String?, default nil. Filter expression (see filtering docs).
- sort: [PubNub.ObjectSortField], default []. Valid: .id, .name, .type, .status, .updated.
- limit: Int?, default 100. Page size.
- page: PubNubHashedPage?, default PubNub.Page(). Cursor-based pagination.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?, default nil.

#### UserIncludeFields

- custom: Bool, default true. Include custom dictionary.
- type: Bool, default true. Include type field.
- status: Bool, default true. Include status field.
- totalCount: Bool, default true. Include total count.

#### Completion handler result

Success: Tuple of [PubNubUserMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

### Get user metadata

Returns user metadata by ID (optionally including custom data).

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

- metadataId: String (required). Unique User Metadata ID. If not supplied, uses request/default configuration.
- include: PubNub.UserIncludeFields, default PubNub.UserIncludeFields().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<PubNubUserMetadata, Error>) -> Void)?, default nil.

#### Completion handler result

Success: PubNubUserMetadata.

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

Failure: Error.

#### Sample code

```
1
  
```

### Set user metadata

Overwrites full custom metadata; partial updates are not supported.

Unsupported partial updates of custom metadata:
1. $1
2. $1
3. $1

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

- metadata: PubNubUserMetadata (required). User metadata to set.
- ifMatchesEtag: String. Conditional update using eTag; mismatches return HTTP 412.
- include: PubNub.UserIncludeFields, default PubNub.UserIncludeFields().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<PubNubUserMetadata, Error>) -> Void)?, default nil.

API limits: See REST API docs for maximum parameter lengths.

#### Completion handler result

Success: PubNubUserMetadata.

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

Failure: Error.

#### Sample code

```
1
  
```

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)

```
`1func removeUserMetadata(  
2    _ metadataId: String?,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

- metadataId: String (required). Unique User Metadata ID. If not supplied, uses request/default configuration.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<String, Error>) -> Void)?, default nil.

#### Completion handler result

Success: Removed user ID.  
Failure: Error.

#### Sample code

```
1
  
```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata objects (optionally including custom data).

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

- include: PubNub.IncludeFields, default PubNub.IncludeFields().
- filter: String?, default nil. Filter expression.
- sort: [PubNub.ObjectSortField], default []. Valid: .id, .name, .type, .status, .updated.
- limit: Int?, default 100.
- page: PubNubHashedPage?, default PubNub.Page().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?, default nil.

#### Completion handler result

Success: Tuple of [PubNubChannelMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

### Get channel metadata

Returns channel metadata by ID (optionally including custom data).

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

- channel: String (required). Unique Channel Metadata ID. If not supplied, uses request/default configuration.
- include: PubNub.ChannelIncludeFields, default PubNub.ChannelIncludeFields().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?, default nil.

#### ChannelIncludeFields

- custom: Bool, default true. Include custom dictionary.
- type: Bool, default true. Include type field.
- status: Bool, default true. Include status field.
- totalCount: Bool, default true. Include total count.

#### Completion handler result

Success: PubNubChannelMetadata.

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

Failure: Error.

#### Sample code

```
1
  
```

### Set channel metadata

Overwrites full custom metadata; partial updates are not supported.

Unsupported partial updates of custom metadata:
1. $1
2. $1
3. $1

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

- metadata: PubNubChannelMetadata (required).
- ifMatchesEtag: String. Conditional update using eTag; mismatches return HTTP 412.
- include: PubNub.ChannelIncludeFields, default PubNub.ChannelIncludeFields().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?, default nil.

API limits: See REST API docs for maximum parameter lengths.

#### Completion handler result

Success: PubNubChannelMetadata.

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

Failure: Error.

#### Sample code

```
1
  
```

#### Other examples

##### Iteratively update existing metadata

```
1
  
```

### Remove channel metadata

Removes metadata for a specified channel.

#### Method(s)

```
`1func removeChannelMetadata(  
2    _ metadataId: String?,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

- channel: String (required). Unique Channel Metadata ID. If not supplied, uses request/default configuration.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?, default nil.

#### Completion handler result

Success: Removed channel ID.  
Failure: Error.

#### Sample code

```
1
  
```

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

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

- userId: String (required). Unique User Metadata ID. If not supplied, uses request/default configuration.
- include: PubNub.MembershipInclude, default PubNub.MembershipInclude().
- filter: String?, default nil. Filter expression.
- sort: [PubNub.MembershipSortField], default []. Valid: .object(.id/.name/.type/.status/.updated), .type, .status, .updated.
- limit: Int?, default 100.
- page: PubNubHashedPage?, default PubNub.Page().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?, default nil.

#### MembershipInclude

- customFields: Bool, default true. Include membership custom dictionary.
- channelFields: Bool, default false. Include full PubNubChannelMetadata in membership.
- typeField: Bool, default true. Include membership type.
- statusField: Bool, default true. Include membership status.
- channelTypeField: Bool, default false. Include channel metadata type.
- channelStatusField: Bool, default false. Include channel metadata status.
- channelCustomFields: Bool, default false. Include channel metadata custom dictionary.
- totalCount: Bool, default false. Include total count.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

- Fetch and handle user channel memberships.

```
1
  
```

- Return sorted channel memberships for the given user ID.

```
1
  
```

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

- userId: String (required). Unique User Metadata ID. If not supplied, uses request/default configuration.
- channels: [PubNubMembershipMetadata] (required). Each includes PubNubChannelMetadata or channelMetadataId.
- include, filter, sort, limit, page, custom, completion: same as fetchMemberships.

API limits: See REST API docs for maximum parameter lengths.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

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

- userId: String (required).
- channels: [PubNubMembershipMetadata] (required). Each includes PubNubChannelMetadata or channelMetadataId.
- include, filter, sort, limit, page, custom, completion: same as fetchMemberships.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

## Channel members

### Get channel members

Returns a list of members in a channel, including user metadata if stored.

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

- channel: String (required). Unique Channel Metadata ID.
- include: PubNub.MemberInclude, default PubNub.MemberInclude().
- filter: String?, default nil.
- sort: [PubNub.MembershipSortField], default []. Valid: .object(.id/.name/.type/.status/.updated), .type, .status, .updated.
- limit: Int?, default 100.
- page: PubNubHashedPage?, default PubNub.Page().
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?, default nil.

#### MemberInclude

- customFields: Bool, default true. Include membership custom dictionary.
- uuidFields: Bool, default false. Include full PubNubUserMetadata in membership.
- statusField: Bool, default true. Include membership status.
- typeField: Bool, default true. Include membership type.
- uuidTypeField: Bool, default false. Include user metadata type.
- uuidStatusField: Bool, default false. Include user metadata status.
- uuidCustomFields: Bool, default false. Include user metadata custom dictionary.
- totalCount: Bool, default false. Include total count.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

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

- channel: String (required). Channel identifier.
- users: [PubNubMembershipMetadata] (required). Each includes PubNubUserMetadata or userMetadataId.
- include, filter, sort, limit, page, custom, completion: as above.

API limits: See REST API docs for maximum parameter lengths.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
  
```

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

- channel: String (required). Channel identifier.
- uuids: [PubNubMembershipMetadata] (required). Each includes PubNubUserMetadata or userMetadataId.
- include, filter, sort, limit, page, custom, completion: as above.

#### Completion handler result

Success: Tuple of [PubNubMembershipMetadata] and next PubNubHashedPage (if any).

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

Failure: Error.

#### Sample code

```
1
**
```

Last updated on Sep 3, 2025**