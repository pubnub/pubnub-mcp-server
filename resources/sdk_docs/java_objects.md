# App Context API for Java SDK

Breaking changes in v9.0.0
- Unified Java/Kotlin SDKs, new client instantiation, updated async callbacks and status events. Apps < 9.0.0 may be impacted. See migration guide.
- This page describes App Context (formerly Objects v2). To upgrade from Objects v1, see migration guide.
- App Context stores user/channel metadata and memberships. Change events (set/update/remove) are emitted; setting identical data doesn’t trigger events.

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

Parameters
- limit — Type: Integer; Default: 100. Number of objects to return. Default/Max: 100.
- page — Type: PNPage; Default: n/a. Cursor-based pagination.
- filter — Type: String?; Default: n/a. Filter expression. See filtering.
- sort — Type: List<PNSortKey>; Default: listOf(). Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc (for example, PNSortKey.asc(PNSortKey.Key.TYPE)).
- includeTotalCount — Type: Boolean; Default: false. Include total count in paginated response.
- includeCustom — Type: Boolean; Default: false. Include the Custom object in the response.

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

Parameters
- uuid — Type: String; Default: pubnub.getConfiguration().getUserId().getValue(). Unique User Metadata identifier. If not supplied, configuration userId is used.
- includeCustom — Type: Boolean; Default: false. Include the Custom object in the response.

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

Set metadata for a UUID, optionally including the custom data object.

Note: Custom metadata overwrites existing value; partial updates aren’t supported. Use read-modify-write if you need to merge. Use If-Match eTag for concurrency control.

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

Parameters
- uuid — Type: String; Default: pubnub.getConfiguration().getUserId().getValue(). Unique identifier; defaults to configuration userId.
- name — Type: String; Display name.
- externalId — Type: String; External system identifier.
- profileUrl — Type: String; Profile picture URL.
- email — Type: String; Email address.
- custom — Type: Any; Custom JSON (strings, numbers, booleans). Filtering by Custom isn’t supported.
- includeCustom — Type: Boolean; Default: false. Include custom in response.
- ifMatchesEtag — Type: String; Use eTag for conditional update (HTTP 412 on mismatch).

API limits: See REST API docs for max parameter lengths.

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

Parameters
- uuid — Type: String; Default: pubnub.getConfiguration().getUserId().getValue(). Unique identifier; defaults to configuration userId.

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

Parameters
- limit — Type: Integer; Default: 100. Number of objects to return. Default/Max: 100.
- page — Type: PNPage; Cursor-based pagination.
- filter — Type: String; Filter expression. See filtering.
- sort — Type: List<PNSortKey>; Default: listOf(). Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- includeTotalCount — Type: Boolean; Default: false. Include total count.
- includeCustom — Type: Boolean; Default: false. Include Custom in response.

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

Returns metadata for the specified Channel, optionally including the custom data object.

#### Method(s)
Use the following in the Java SDK:
```
`1pubnub.getChannelMetadata()  
2    .channel(String)  
3    .includeCustom(Boolean)  
`
```

Parameters
- channel — Type: String. Channel name.
- includeCustom — Type: Boolean; Default: false. Include Custom in response.

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

Set metadata for a Channel, optionally including the custom data object.

Note: Custom metadata overwrites existing value; partial updates aren’t supported. Use read-modify-write if you need to merge. Use If-Match eTag for concurrency control.

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

Parameters
- channel — Type: String. Channel ID.
- name — Type: String. Channel name.
- description — Type: String. Channel description.
- custom — Type: Map<String, Object>. Custom key-value pairs. Filtering doesn’t support custom properties.
- includeCustom — Type: Boolean; Default: false. Include custom in response.
- ifMatchesEtag — Type: String. Conditional update with eTag (HTTP 412 on mismatch).

API limits: See REST API docs for max parameter lengths.

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

Parameters
- channel — Type: String. Channel ID.

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

Parameters
- userId — Type: String; Default: pubnub.getConfiguration().getUserId().getValue(). User ID; defaults to configuration userId.
- limit — Type: Integer; Default: 100. Number of objects to return. Default/Max: 100.
- page — Type: PNPage. Cursor-based pagination.
- filter — Type: String. Filter expression. See filtering.
- sort — Type: List<PNSortKey>; Default: listOf(). Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include — Type: MembershipInclude; Default: all false. Configure additional data to include.

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

Parameters
- channelMemberships — Type: List<PNChannelMembership>. Collection of PNChannelMembership to add.
- userId — Type: String; Default: pubnub.getConfiguration().getUserId().getValue().
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MembershipInclude; Default: all false.

API limits: See REST API docs for max parameter lengths.

#### PNChannelMembership

PNChannelMembership is a builder utility for channel membership with custom data.

- channel — Type: ChannelId. Channel name.
- custom — Type: Object. Custom metadata.
- status — Type: String. e.g., "active" or "inactive".
- type — Type: String. Membership type/category.

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

Parameters
- channelMemberships — Type: List<PNChannelMembership>. Collection of PNChannelMembership to remove.
- userId — Type: String; Default: pubnub.getConfiguration().getUserId().getValue().
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MembershipInclude; Default: all false.

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

Parameters
- set — Type: Collection<PNChannelMembership>. Members to add.
- remove — Type: Collection<Stirng>. Channel IDs to remove.
- userId — Type: String; Default: pubnub.getConfiguration().getUserId().getValue().
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MembershipInclude; Default: all false.

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

Parameters
- channel — Type: String. Channel ID.
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MemberInclude; Default: all false.

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

Sets members in a channel.

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

Parameters
- channel — Type: String. Channel name.
- channelMembers — Type: Collection<PNUser>. List of members to add.
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MemberInclude; Default: all false.

API limits: See REST API docs for max parameter lengths.

#### PNUser

PNUser is a builder utility to construct a user with custom metadata, status, and type.

- userId — Type: String. Required, non-empty.
- custom — Type: Object. Custom metadata.
- status — Type: String. e.g., active or inactive.
- type — Type: String. User categorization.

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

Parameters
- channel — Type: String. Channel name.
- channelMembers — Type: Collection<String>. List of member userIds to remove.
- limit — Type: Integer; Default: 100.
- page — Type: PNPage. Paging object.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf(). Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include — Type: MemberInclude; Default: all false. Options to include additional data.

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

Parameters
- channel — Type: String. Channel name.
- set — Type: Collection<PNUser>. Members to add.
- remove — Type: Collection<String>. userIds to remove.
- limit — Type: Integer; Default: 100.
- page — Type: PNPage.
- filter — Type: String.
- sort — Type: List<PNSortKey>; Default: listOf().
- include — Type: MemberInclude; Default: all false.

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