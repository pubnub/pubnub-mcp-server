# App Context API for Swift Native SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub emits events when object data is set or removed so clients can update in real time.

##### UUID and User ID
PubNubUUIDMetadataBase is deprecated and is a typealias for PubNubUserMetadataBase.

## User

### Get metadata for all users

Returns a paginated list of user metadata, optionally including custom data.

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

Parameters:
- include: PubNub.UserIncludeFields. Default: PubNub.UserIncludeFields(). Include additional fields.
- filter: String?. Default: nil. Server-side filter expression (see filtering docs).
- sort: [PubNub.ObjectSortField]. Default: []. Sort by .id, .name, .type, .status, .updated.
- limit: Int?. Default: 100. Page size.
- page: PubNubHashedPage?. Default: PubNub.Page(). Cursor-based pagination.
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration(). Per-request config.
- completion: ((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?. Default: nil.

#### UserIncludeFields

Defines which additional fields are included in user responses.

- custom: Bool. Default: true. Include custom fields.
- type: Bool. Default: true. Include type.
- status: Bool. Default: true. Include status.
- totalCount: Bool. Default: true. Include total count.

#### Completion handler result

Success returns array of PubNubUserMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

#### Sample code

```
1
  

```

### Get user metadata

Fetch metadata for a specified user, optionally including custom data.

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

Parameters:
- metadataId: String. Required. User Metadata ID. Falls back to request/default config if nil.
- include: PubNub.UserIncludeFields. Default: PubNub.UserIncludeFields().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<PubNubUserMetadata, Error>) -> Void)?. Default: nil.

#### Completion handler result

Success returns PubNubUserMetadata.

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

Failure returns an Error.

#### Sample code

```
1
  

```

### Set user metadata

Sets metadata for a user; the custom object overwrites existing custom data (no partial update).

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

Parameters:
- metadata: PubNubUserMetadata. Required. User metadata to set.
- ifMatchesEtag: String. Optional. Conditional update using eTag; mismatches return HTTP 412.
- include: PubNub.UserIncludeFields. Default: PubNub.UserIncludeFields().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<PubNubUserMetadata, Error>) -> Void)?. Default: nil.

##### API limits
See REST API docs for limits: /docs/sdks/rest-api/set-user-metadata

#### Completion handler result

Success returns PubNubUserMetadata.

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

Failure returns an Error.

#### Sample code

```
1
  

```

### Remove user metadata

Removes metadata for a specified user ID.

#### Method(s)

```
`1func removeUserMetadata(  
2    _ metadataId: String?,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

Parameters:
- metadataId: String. Required. User Metadata ID. Falls back to request/default config if nil.
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<String, Error>) -> Void)?. Default: nil.

#### Completion handler result

- Success: removed user identifier.
- Failure: Error.

#### Sample code

```
1
  

```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata, optionally including custom data.

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

Parameters:
- include: PubNub.IncludeFields. Default: PubNub.IncludeFields().
- filter: String?. Default: nil. Server-side filter expression.
- sort: [PubNub.ObjectSortField]. Default: []. Sort by .id, .name, .type, .status, .updated.
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?. Default: nil.

#### Completion handler result

Success returns array of PubNubChannelMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

#### Sample code

```
1
  

```

### Get channel metadata

Returns metadata for the specified channel.

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

Parameters:
- channel: String. Required. Channel Metadata ID. Falls back to request/default config if nil.
- include: PubNub.ChannelIncludeFields. Default: PubNub.ChannelIncludeFields().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?. Default: nil.

#### ChannelIncludeFields

Defines which additional fields are included in channel responses.

- custom: Bool. Default: true. Include custom fields.
- type: Bool. Default: true. Include type.
- status: Bool. Default: true. Include status.
- totalCount: Bool. Default: true. Include total count.

#### Completion handler result

Success returns PubNubChannelMetadata.

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

Failure returns an Error.

#### Sample code

```
1
  

```

### Set channel metadata

Sets metadata for a channel; the custom object overwrites existing custom data (no partial update).

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

Parameters:
- metadata: PubNubChannelMetadata. Required. Channel metadata to set.
- ifMatchesEtag: String. Optional. Conditional update using eTag; mismatches return HTTP 412.
- include: PubNub.ChannelIncludeFields. Default: PubNub.ChannelIncludeFields().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?. Default: nil.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-channel-metadata

#### Completion handler result

Success returns PubNubChannelMetadata.

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

Failure returns an Error.

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

Parameters:
- channel: String. Required. Channel Metadata ID. Falls back to request/default config if nil.
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<PubNubChannelMetadata, Error>) -> Void)?. Default: nil.

#### Completion handler result

- Success: removed channel identifier.
- Failure: Error.

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

Parameters:
- userId: String. Required. User Metadata ID. Falls back to request/default config if nil.
- include: PubNub.MembershipInclude. Default: PubNub.MembershipInclude().
- filter: String?. Default: nil. Server-side filter expression.
- sort: [PubNub.MembershipSortField]. Default: []. Sort by .object(.id|.name|.type|.status|.updated), .type, .status, .updated.
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

#### MembershipInclude

Controls fields included when fetching a user's channel memberships.

- customFields: Bool. Default: true. Include membership custom fields.
- channelFields: Bool. Default: false. Include full PubNubChannelMetadata.
- typeField: Bool. Default: true. Include membership type.
- statusField: Bool. Default: true. Include membership status.
- channelTypeField: Bool. Default: false. Include channel type.
- channelStatusField: Bool. Default: false. Include channel status.
- channelCustomFields: Bool. Default: false. Include channel custom fields.
- totalCount: Bool. Default: false. Include total count.

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

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

Parameters:
- userId: String. Required. User Metadata ID. Falls back to request/default config if nil.
- channels: [PubNubMembershipMetadata]. Required. Provide PubNubChannelMetadata or channelMetadataId.
- include: PubNub.MembershipInclude. Default: PubNub.MembershipInclude().
- filter: String?. Default: nil.
- sort: [PubNub.MembershipSortField]. Default: [].
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-membership-metadata

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

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

Parameters:
- userId: String. Required. User Metadata ID. Falls back to request/default config if nil.
- channels: [PubNubMembershipMetadata]. Required. Provide PubNubChannelMetadata or channelMetadataId.
- include: PubNub.MembershipInclude. Default: PubNub.MembershipInclude().
- filter: String?. Default: nil.
- sort: [PubNub.MembershipSortField]. Default: [].
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

#### Sample code

```
1
  

```

## Channel members

### Get channel members

Returns a list of members in a channel. Includes user metadata if available.

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

Parameters:
- channel: String. Required. Channel Metadata ID.
- include: PubNub.MemberInclude. Default: PubNub.MemberInclude().
- filter: String?. Default: nil.
- sort: [PubNub.MembershipSortField]. Default: [].
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

#### MemberInclude

Controls fields included when fetching channel members.

- customFields: Bool. Default: true. Include membership custom fields.
- uuidFields: Bool. Default: false. Include full PubNubUserMetadata.
- statusField: Bool. Default: true. Include membership status.
- typeField: Bool. Default: true. Include membership type.
- uuidTypeField: Bool. Default: false. Include user type.
- uuidStatusField: Bool. Default: false. Include user status.
- uuidCustomFields: Bool. Default: false. Include user custom fields.
- totalCount: Bool. Default: false. Include total count.

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

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

Parameters:
- channel: String. Required. Channel identifier.
- users: [PubNubMembershipMetadata]. Required. Provide PubNubUserMetadata or userMetadataId.
- include: PubNub.MemberInclude. Default: PubNub.MemberInclude().
- filter: String?. Default: nil.
- sort: [PubNub.MembershipSortField]. Default: [].
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

##### API limits
See REST API docs: /docs/sdks/rest-api/set-channel-members-metadata

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

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

Parameters:
- channel: String. Required. Channel identifier.
- uuids: [PubNubMembershipMetadata]. Required. Provide PubNubUserMetadata or userMetadataId.
- include: PubNub.MemberInclude. Default: PubNub.MemberInclude().
- filter: String?. Default: nil.
- sort: [PubNub.MembershipSortField]. Default: [].
- limit: Int?. Default: 100.
- page: PubNubHashedPage?. Default: PubNub.Page().
- custom: PubNub.RequestConfiguration. Default: PubNub.RequestConfiguration().
- completion: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?. Default: nil.

#### Completion handler result

Success returns array of PubNubMembershipMetadata and next PubNubHashedPage (if any).

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

Failure returns an Error.

#### Sample code

```
1
**
```