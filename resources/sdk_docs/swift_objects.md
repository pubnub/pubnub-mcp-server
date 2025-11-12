# App Context API for Swift Native SDK

App Context (formerly Objects v2) provides serverless storage for user, channel, and membership metadata, plus real-time change events. To upgrade from Objects v1, see the migration guide.

##### UUID and User ID
`PubNubUUIDMetadataBase` is deprecated and is a typealias for `PubNubUserMetadataBase`.

## User

### Get metadata for all users

Returns a paginated list of user metadata objects, optionally including the custom data object.

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
- include (Type: PubNub.UserIncludeFields, Default: PubNub.UserIncludeFields()): Include additional fields.
- filter (Type: String?, Default: nil): Filter expression. See filtering docs.
- sort (Type: [PubNub.ObjectSortField], Default: []): Sort by `.id`, `.name`, `.type`, `.status`, `.updated`.
- limit (Type: Int?, Default: 100): Page size.
- page (Type: PubNubHashedPage?, Default: PubNub.Page()): Cursor-based paging object (`next`/`start`, `end`).
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?, Default: nil)

#### UserIncludeFields
Controls which fields to include in user responses.

PropertyDescription`custom`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the user metadata object`type`Type: `Bool`Default:  
`true`Whether to include the type field for the user metadata object`status`Type: `Bool`Default:  
`true`Whether to include the status field for the user metadata object`totalCount`Type: `Bool`Default:  
`true`Whether to include the total count of how many user objects are available

#### Completion handler result

##### Success
Tuple of `[PubNubUserMetadata]` and next `PubNubHashedPage` (if any).
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
show all 32 lines

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
An Error describing the failure.

#### Sample code

##### Reference code
```
1
  

```

### Get user metadata

Returns metadata for the specified user.

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
- metadataId (Type: String, Required): Unique User Metadata ID. If not supplied, falls back to request/default configuration.
- include (Type: PubNub.UserIncludeFields, Default: PubNub.UserIncludeFields()): Include additional fields.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<PubNubUserMetadata, Error>) -> Void)?, Default: nil)

#### Completion handler result

##### Success
The `PubNubUserMetadata` object:
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
show all 32 lines

##### Failure
An Error describing the failure.

#### Sample code
```
1
  

```

### Set user metadata

Sets metadata for a user. Note: Custom metadata sent here overwrites the existing value.

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
- metadata (Type: PubNubUserMetadata, Required): Metadata to set.
- ifMatchesEtag (Type: String, Optional): Perform update only if eTag matches (HTTP 412 on mismatch).
- include (Type: PubNub.UserIncludeFields, Default: PubNub.UserIncludeFields()): Include additional fields.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<PubNubUserMetadata, Error>) -> Void)?, Default: nil)

##### API limits
See REST API docs for parameter length limits.

#### Completion handler result

##### Success
The `PubNubUserMetadata` object:
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
show all 32 lines

##### Failure
An Error describing the failure.

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

Parameters:
- metadataId (Type: String, Required): Unique User Metadata ID. If not supplied, falls back to request/default configuration.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<String, Error>) -> Void)?, Default: nil)

#### Completion handler result

##### Success
The removed user identifier.

##### Failure
An Error describing the failure.

#### Sample code
```
1
  

```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata objects, optionally including the custom data object.

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
- include (Type: PubNub.IncludeFields, Default: PubNub.IncludeFields()): Include additional fields.
- filter (Type: String?, Default: nil): Filter expression. See filtering docs.
- sort (Type: [PubNub.ObjectSortField], Default: []): Sort by `.id`, `.name`, `.type`, `.status`, `.updated`.
- limit (Type: Int?, Default: 100): Page size.
- page (Type: PubNubHashedPage?, Default: PubNub.Page()): Cursor-based paging.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?, Default: nil)

#### Completion handler result

##### Success
Tuple of `[PubNubChannelMetadata]` and next `PubNubHashedPage` (if any).
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
show all 26 lines

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
An Error describing the failure.

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
- channel (Type: String, Required): Unique Channel Metadata ID. If not supplied, falls back to request/default configuration.
- include (Type: PubNub.ChannelIncludeFields, Default: PubNub.ChannelIncludeFields()): Include additional fields.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<PubNubChannelMetadata, Error>) -> Void)?, Default: nil)

#### ChannelIncludeFields
Controls which fields to include in channel responses.

PropertyDescription`custom`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the channel metadata object`type`Type: `Bool`Default:  
`true`Whether to include the type field for the channel metadata object`status`Type: `Bool`Default:  
`true`Whether to include the status field for the channel metadata object`totalCount`Type: `Bool`Default:  
`true`Whether to include the total count of how many channel objects are available

#### Completion handler result

##### Success
The `PubNubChannelMetadata` object:
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
show all 26 lines

##### Failure
An Error describing the failure.

#### Sample code
```
1
  

```

### Set channel metadata

Sets metadata for a channel. Note: Custom metadata sent here overwrites the existing value.

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
- metadata (Type: PubNubChannelMetadata, Required): Metadata to set.
- ifMatchesEtag (Type: String, Optional): Perform update only if eTag matches (HTTP 412 on mismatch).
- include (Type: PubNub.ChannelIncludeFields, Default: PubNub.ChannelIncludeFields()): Include additional fields.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<PubNubChannelMetadata, Error>) -> Void)?, Default: nil)

##### API limits
See REST API docs for parameter length limits.

#### Completion handler result

##### Success
The `PubNubChannelMetadata` object:
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
show all 26 lines

##### Failure
An Error describing the failure.

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

Removes the metadata from a specified channel.

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
- channel (Type: String, Required): Unique Channel Metadata ID. If not supplied, falls back to request/default configuration.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<PubNubChannelMetadata, Error>) -> Void)?, Default: nil)

#### Completion handler result

##### Success
The removed channel identifier.

##### Failure
An Error describing the failure.

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
- userId (Type: String, Required): Unique User Metadata ID. If not supplied, falls back to request/default configuration.
- include (Type: PubNub.MembershipInclude, Default: PubNub.MembershipInclude()): Include additional fields.
- filter (Type: String?, Default: nil): Filter expression. See filtering docs.
- sort (Type: [PubNub.MembershipSortField], Default: []): Sort by `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, `.updated`.
- limit (Type: Int?, Default: 100): Page size.
- page (Type: PubNubHashedPage?, Default: PubNub.Page()): Cursor-based paging.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?, Default: nil)

#### MembershipInclude
Controls which fields to include for user memberships (channels a user belongs to).

PropertyDescription`customFields`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the membership object`channelFields`Type: `Bool`Default:  
`false`Whether to include the full PubNubChannelMetadata instance in the membership`typeField`Type: `Bool`Default:  
`true`Whether to include the type field of the membership object`statusField`Type: `Bool`Default:  
`true`Whether to include the status field of the membership object`channelTypeField`Type: `Bool`Default:  
`false`Whether to include the type field of the associated channel metadata`channelStatusField`Type: `Bool`Default:  
`false`Whether to include the status field of the associated channel metadata`channelCustomFields`Type: `Bool`Default:  
`false`Whether to include the custom dictionary of the associated channel metadata`totalCount`Type: `Bool`Default:  
`false`Whether to include the total count of how many membership objects are available

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

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
- userId (Type: String, Required): Unique User Metadata ID. If not supplied, falls back to request/default configuration.
- channels (Type: [PubNubMembershipMetadata], Required): Memberships with `PubNubChannelMetadata` or `channelMetadataId`.
- include (Type: PubNub.MembershipInclude, Default: PubNub.MembershipInclude()): Include additional fields.
- filter (Type: String?, Default: nil): Filter expression. See filtering docs.
- sort (Type: [PubNub.MembershipSortField], Default: []): Sort by `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, `.updated`.
- limit (Type: Int?, Default: 100)
- page (Type: PubNubHashedPage?, Default: PubNub.Page())
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration())
- completion (Type: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?, Default: nil)

##### API limits
See REST API docs for parameter length limits.

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

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
- userId (Type: String, Required): Unique User Metadata ID. If not supplied, falls back to request/default configuration.
- channels (Type: [PubNubMembershipMetadata], Required): Memberships with `PubNubChannelMetadata` or `channelMetadataId`.
- include, filter, sort, limit, page, custom, completion: Same as Set channel memberships.

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

#### Sample code
```
1
  

```

## Channel members

### Get channel members

Returns a list of members in a channel, including user metadata when available.

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
- channel (Type: String, Required): Unique Channel Metadata ID.
- include (Type: PubNub.MemberInclude, Default: PubNub.MemberInclude()): Include additional fields.
- filter (Type: String?, Default: nil): Filter expression. See filtering docs.
- sort (Type: [PubNub.MembershipSortField], Default: []): Sort by `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, `.updated`.
- limit (Type: Int?, Default: 100)
- page (Type: PubNubHashedPage?, Default: PubNub.Page())
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration())
- completion (Type: ((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?, Default: nil)

#### MemberInclude
Controls which fields to include for channel members (users in a channel).

PropertyDescription`customFields`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the membership object`uuidFields`Type: `Bool`Default:  
`false`Whether to include the full PubNubUserMetadata instance in the membership`statusField`Type: `Bool`Default:  
`true`Whether to include the status field of the membership object`typeField`Type: `Bool`Default:  
`true`Whether to include the type field of the membership object`uuidTypeField`Type: `Bool`Default:  
`false`Whether to include the type field of the associated user metadata`uuidStatusField`Type: `Bool`Default:  
`false`Whether to include the status field of the associated user metadata`uuidCustomFields`Type: `Bool`Default:  
`false`Whether to include the custom dictionary of the associated user metadata`totalCount`Type: `Bool`Default:  
`false`Whether to include the total count of how many member objects are available

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

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
- channel (Type: String, Required): Channel identifier.
- users (Type: [PubNubMembershipMetadata], Required): Memberships with `PubNubUserMetadata` or `userMetadataId`.
- include, filter, sort, limit, page, custom, completion: Same as Fetch members.

##### API limits
See REST API docs for parameter length limits.

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

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
- channel (Type: String, Required): Channel identifier.
- uuids (Type: [PubNubMembershipMetadata], Required): Memberships with `PubNubUserMetadata` or `userMetadataId`.
- include, filter, sort, limit, page, custom, completion: Same as Set channel members.

#### Completion handler result

##### Success
Tuple of `[PubNubMembershipMetadata]` and next `PubNubHashedPage` (if any).
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
show all 29 lines

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
An Error describing the failure.

#### Sample code
```
1
**
```

Last updated on Sep 3, 2025**