# App Context API for Java SDK

App Context (formerly Objects v2) stores metadata for users, channels, and memberships. Changes (set/update/remove) emit events; setting identical data doesn’t emit an event.

##### Breaking changes in v9.0.0
- Unified Java/Kotlin codebase, new PubNub client instantiation, updated async callbacks and status events.
- See Java/Kotlin SDK migration guide.
- To upgrade from Objects v1, see the migration guide.

## User

### Get metadata for all users

Returns a paginated list of UUID metadata. Optionally includes Custom.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getAllUUIDMetadata()  
2    .limit(Integer)  
3    .page(PNPage)  
4    .filter(String)  
5    .sort(ListPNSortKey>)  
6    .includeTotalCount(Boolean)  
7    .includeCustom(Boolean)  
`
```

- limit
  - Type: Integer
  - Default: 100
  - Number of objects to return. Default/Max: 100.
- page
  - Type: PNPage
  - Cursor-based pagination.
- filter
  - Type: String?
  - Filter expression. See filtering.
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
  - Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc (for example, PNSortKey.asc(PNSortKey.Key.TYPE)).
- includeTotalCount
  - Type: Boolean
  - Default: false
  - Include total count in response.
- includeCustom
  - Type: Boolean
  - Default: false
  - Include Custom in response.

#### Sample code

##### Reference code

```
1
  

```

#### Response

```
1public class PNGetAllUUIDMetadataResult extends EntityArrayEnvelopePNUUIDMetadata> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNUUIDMetadata> data;  
7    PNPage nextPage() {  
8        return PNPage.next(next);  
9    }  
10    PNPage previousPage() {  
11        return PNPage.previous(prev);  
12    }  
13}  
14
  
15public class PNUUIDMetadata extends PNObject {  
16    String id;  
17    Object custom;  
18    String updated;  
19    String eTag;  
20    String name;  
21    String email;  
22    String externalId;  
23    String profileUrl;  
24}  

```

### Get user metadata

Returns metadata for the specified UUID, optionally including the custom data object.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getUUIDMetadata()  
2    .uuid(String)  
3    .includeCustom(Boolean)  
`
```

- uuid
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
  - Unique User Metadata identifier. Defaults to configured userId.
- includeCustom
  - Type: Boolean
  - Default: false
  - Include Custom in response.

#### Sample code

```
1
  

```

#### Response

```
1public class PNGetUUIDMetadataResult extends EntityEnvelopePNUUIDMetadata> {  
2    int status;  
3    PNUUIDMetadata data;  
4}  
5
  
6public class PNUUIDMetadata extends PNObject {  
7    String id;  
8    Object custom;  
9    String updated;  
10    String eTag;  
11    String name;  
12    String email;  
13    String externalId;  
14    String profileUrl;  
15}  

```

### Set user metadata

Unsupported partial updates of custom metadata: the value of custom overwrites the stored value.

Set metadata for a UUID, optionally including the custom data object.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.setUUIDMetadata()  
2    .uuid(String)  
3    .name(String)  
4    .externalId(String)  
5    .profileUrl(String)  
6    .email(String)  
7    .custom(MapString, Object>)  
8    .includeCustom(true)  
9    .ifMatchesEtag(String)  
`
```

- uuid
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
- name
  - Type: String
- externalId
  - Type: String
- profileUrl
  - Type: String
- email
  - Type: String
- custom
  - Type: Any
  - Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- includeCustom
  - Type: Boolean
  - Default: false
  - Include custom in fetch response.
- ifMatchesEtag
  - Type: String
  - Use eTag for conditional update; mismatched eTag returns HTTP 412.

##### API limits

See REST API docs for parameter length limits.

#### Sample code

```
1
  

```

#### Response

```
1public class PNSetUUIDMetadataResult extends EntityEnvelopePNUUIDMetadata> {  
2    protected int status;  
3    protected PNUUIDMetadata data;  
4}  
5
  
6public class PNUUIDMetadata extends PNObject {  
7    String id;  
8    Object custom;  
9    String updated;  
10    String eTag;  
11    String name;  
12    String email;  
13    String externalId;  
14    String profileUrl;  
15}  

```

### Remove user metadata

Removes the metadata from a specified UUID.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.removeUUIDMetadata()  
2    .uuid(String)  
`
```

- uuid
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()

#### Sample code

```
1
  

```

#### Response

```
`1public class PNRemoveUUIDMetadataResult extends EntityEnvelopeJsonElement> {  
2    int status;  
3    JsonElement data;  
4}  
`
```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata. Optionally includes Custom.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getAllChannelsMetadata(  
2        .limit(Integer)  
3        .page(PNPage)  
4        .filter(String)  
5        .sort(ListPNSortKey>)  
6        .includeTotalCount(Boolean)  
7        .includeCustom(Boolean)  
`
```

- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
  - Filter expression. See filtering.
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
  - Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- includeTotalCount
  - Type: Boolean
  - Default: false
- includeCustom
  - Type: Boolean
  - Default: false

#### Sample code

```
1
  

```

#### Response

```
1public class PNGetAllChannelsMetadataResult extends EntityArrayEnvelopePNChannelMetadata> {  
2    int status;  
3    ListPNChannelMetadata> data;  
4    Integer totalCount;  
5    String next;  
6    String prev;  
7}  
8
  
9public class PNChannelMetadata extends PNObject {  
10    String id;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14    String name;  
15    String description;  
16}  

```

### Get channel metadata

Returns metadata for the specified Channel, optionally including Custom.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getChannelMetadata()  
2    .channel(String)  
3    .includeCustom(Boolean)  
`
```

- channel
  - Type: String
  - Channel name.
- includeCustom
  - Type: Boolean
  - Default: false

#### Sample code

```
1
  

```

#### Response

```
1public class PNGetChannelMetadataResult extends EntityEnvelopePNChannelMetadata> {  
2    protected int status;  
3    protected PNChannelMetadata data;  
4}  
5
  
6public class PNChannelMetadata extends PNObject {  
7    String id;  
8    Object custom;  
9    String updated;  
10    String eTag;  
11    String name;  
12    String description;  
13}  

```

### Set channel metadata

Unsupported partial updates of custom metadata: the value of custom overwrites the stored value.

Set metadata for a Channel, optionally including the custom data object.

#### Method(s)

Use the following in the Java SDK:

```
1pubnub.setChannelMetadata()  
2    .channel(String)  
3    .name(String)  
4    .description(String)  
5    .custom(MapString, Object>)  
6    .includeCustom(Boolean)  
7    .ifMatchesEtag(String)  
8
  

```

- channel
  - Type: String
  - Channel ID.
- name
  - Type: String
- description
  - Type: String
- custom
  - Type: Map<String, Object>
  - Key-value pairs. Filtering doesn’t support custom properties.
- includeCustom
  - Type: Boolean
  - Default: false
- ifMatchesEtag
  - Type: String
  - Conditional update using eTag; mismatched eTag returns HTTP 412.

##### API limits

See REST API docs for parameter length limits.

#### Sample code

```
1
  

```

#### Response

```
1public class PNSetChannelMetadataResult extends EntityEnvelopePNChannelMetadata> {  
2    protected int status;  
3    protected PNChannelMetadata data;  
4}  
5
  
6public class PNChannelMetadata extends PNObject {  
7    String id;  
8    Object custom;  
9    String updated;  
10    String eTag;  
11    String name;  
12    String description;  
13}  

```

#### Other examples

##### Iteratively update existing metadata

```
1
  

```

### Remove channel metadata

Removes the metadata from a specified channel.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.removeChannelMetadata()  
2    .channel(String)  
`
```

- channel
  - Type: String
  - Channel ID.

#### Sample code

```
1
  

```

#### Response

```
`1public class PNRemoveChannelMetadataResult extends EntityEnvelopeJsonElement> {  
2    int status;  
3    protected JsonElement data;  
4}  
`
```

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user. Does not include subscriptions.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getMemberships()  
2    .userId(String)  
3    .limit(Integer)  
4    .page(PNPage)  
5    .filter(String)  
6    .sort(ListPNSortKey>)  
7    .include(MembershipInclude)  
8    .async(result -> { /* check result */ });  
`
```

- userId
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
  - Filter expression. See filtering.
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
  - Sort by ID, NAME, UPDATED, STATUS, TYPE.
- include
  - Type: MembershipInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNGetMembershipsResult extends EntityArrayEnvelopePNMembership> {  
2    protected Integer totalCount;  
3    protected String next;  
4    protected String prev;  
5    protected int status;  
6    protected ListPNMembership> data;  
7}  
8
  
9public class PNMembership {  
10    PNChannelMetadata channel;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

#### Sample code with pagination

```
1
  

```

### Set channel memberships

Set channel memberships for a User.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.setMemberships(CollectionPNChannelMembership>)  
2    .userId(String)  
3    .limit(Integer)  
4    .page(PNPage)  
5    .filter(String)  
6    .sort(ListPNSortKey>)  
7    .include(MembershipInclude)  
8    .async(result -> { /* check result */ });  
`
```

- channelMemberships
  - Type: List<PNChannelMembership>
  - Collection to add to membership.
- userId
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MembershipInclude
  - Default: all false

##### API limits

See REST API docs for parameter length limits.

#### PNChannelMembership

PNChannelMembership is a utility class (builder pattern) for channel membership with custom data.

- channel
  - Type: ChannelId
  - Name of the channel for this membership.
- custom
  - Type: Object
- status
  - Type: String
  - Example: "active", "inactive".
- type
  - Type: String

#### Sample code

```
1
  

```

#### Response

```
1public class PNSetMembershipResult extends EntityArrayEnvelopePNMembership> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembership> data;  
7}  
8
  
9public class PNMembership {  
10    PNChannelMetadata channel;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

### Remove channel memberships

Remove channel memberships for a User.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.removeMemberships(CollectionPNChannelMembership>)  
2    .userId(String)  
3    .limit(Integer)  
4    .page(PNPage)  
5    .filter(String)  
6    .sort(ListPNSortKey>)  
7    .include(MembershipInclude)  
8    .async(result -> { /* check result */ });  
`
```

- channelMemberships
  - Type: List<PNChannelMembership>
- userId
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MembershipInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNRemoveMembershipResults extends EntityArrayEnvelopePNMembership> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembership> data;  
7}  
8
  
9public class PNMembership {  
10    PNChannelMetadata channel;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

### Manage channel memberships

Manage a user's channel memberships.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.manageMemberships(CollectionPNChannelMembership>, CollectionString>)  
2    .userId(String)  
3    .limit(Integer)  
4    .page(PNPage)  
5    .filter(String)  
6    .sort(ListPNSortKey>)  
7    .include(MembershipInclude)  
8    .async(result -> { /* check result */ });  
`
```

- set
  - Type: Collection<PNChannelMembership>
  - Members to add.
- remove
  - Type: Collection<Stirng>
  - Channel IDs to remove.
- userId
  - Type: String
  - Default: pubnub.getConfiguration().getUserId().getValue()
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MembershipInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNManageMembershipResult extends EntityArrayEnvelopePNMembership> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembership> data;  
7}  
8
  
9public class PNMembership {  
10    PNChannelMetadata channel;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

## Channel members

### Get channel members

Returns a list of channel members. Includes user metadata when available.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getChannelMembers(String)  
2    .limit(Integer)  
3    .page(PNPage)  
4    .filter(String)  
5    .sort(ListPNSortKey>)  
6    .include(MemberInclude)  
7    .async(result -> { /* check result */ });  
`
```

- channel
  - Type: String
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MemberInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNRemoveMembershipResults extends EntityArrayEnvelopePNMembers> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembers> data;  
7}  
8
  
9public class PNMembers {  
10    PNUUIDMetadata uuid;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

### Set channel members

This method sets members in a channel.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.setChannelMembers(String, CollectionPNUser>)  
2    .limit(Integer)  
3    .page(PNPage)  
4    .filter(String)  
5    .sort(ListPNSortKey>)  
6    .include(MemberInclude)  
7    .async(result -> { /* check result */ });  
`
```

- channel
  - Type: String
- channelMembers
  - Type: Collection<PNUser>
  - List of members to add.
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MemberInclude
  - Default: all false

##### API limits

See REST API docs for parameter length limits.

#### PNUser

PNUser is a utility class (builder pattern) to construct a user object with custom metadata, status, and type.

- userId
  - Type: String
  - Required. Cannot be null or empty.
- custom
  - Type: Object
- status
  - Type: String
- type
  - Type: String

#### Sample code

```
1
  

```

#### Response

```
1public class PNSetChannelMembersResult extends EntityArrayEnvelopePNMembers> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembers> data;  
7}  
8
  
9public class PNMembers {  
10    PNUUIDMetadata uuid;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

### Remove channel members

Remove members from a Channel.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.removeChannelMembers(String, ListString>)  
2    .limit(Integer)  
3    .page(PNPage)  
4    .filter(String)  
5    .sort(ListPNSortKey>)  
6    .includeTotalCount(Boolean)  
7    .includeCustom(Boolean)  
8    .includeUUID(PNUUIDDetailsLevel)  
`
```

- channel
  - Type: String
- channelMembers
  - Type: Collection<String>
  - List of member userIds to remove.
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MemberInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNRemoveChannelMembersResult extends EntityArrayEnvelopePNMembers> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembers> data;  
7}  
8
  
9public class PNMembers {  
10    PNUUIDMetadata uuid;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```

### Manage channel members

Set and Remove channel memberships for a user.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.manageChannelMembers(String, CollectionPNUser>, CollectionString>)  
2    .limit(Integer)  
3    .page(PNPage)  
4    .filter(String)  
5    .sort(ListPNSortKey>)  
6    .include(MemberInclude)  
`
```

- channel
  - Type: String
- set
  - Type: Collection<PNUser>
  - Members to add.
- remove
  - Type: Collection<String>
  - userIds to remove.
- limit
  - Type: Integer
  - Default: 100
- page
  - Type: PNPage
- filter
  - Type: String
- sort
  - Type: List<PNSortKey>
  - Default: listOf()
- include
  - Type: MemberInclude
  - Default: all false

#### Sample code

```
1
  

```

#### Response

```
1public class PNManageChannelMembersResult extends EntityArrayEnvelopePNMembers> {  
2    Integer totalCount;  
3    String next;  
4    String prev;  
5    int status;  
6    ListPNMembers> data;  
7}  
8
**9public class PNMembers {  
10    PNUUIDMetadata uuid;  
11    Object custom;  
12    String updated;  
13    String eTag;  
14}  

```