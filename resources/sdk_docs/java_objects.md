# App Context API for Java SDK

Breaking changes in v9.0.0
- Unified Java/Kotlin codebases, new PubNub client instantiation, updated async callbacks and status events.
- Apps using < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.
- This page covers App Context (formerly Objects v2). For Objects v1, see migration guide.
- App Context stores user/channel metadata and memberships, and emits set/update/remove events (re-setting identical data doesn’t emit).

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

- requiredParameterDescription
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String? Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc for sort direction (for example, `PNSortKey.asc(PNSortKey.Key.TYPE)`).
`includeTotalCount` Type: Boolean Default: `false` Whether to include the total count in the paginated response.
`includeCustom` Type: Boolean Default: `false` Whether to include the Custom object in the response.

#### Sample code

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

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getUUIDMetadata()  
2    .uuid(String)  
3    .includeCustom(Boolean)  
`
```

- requiredParameterDescription
`uuid` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`includeCustom` Type: Boolean Default: `false` Whether to include the Custom object in the response.

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

Sets metadata for a UUID. Partial updates of custom metadata are not supported; the provided custom object overwrites existing data. Use ETag for conditional updates.

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

- requiredParameterDescription
`uuid` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`name` Type: String Default: n/a Display name for the user.
`externalId` Type: String Default: n/a User's identifier in an external system.
`profileUrl` Type: String Default: n/a The URL of the user's profile picture.
`email` Type: String Default: n/a The user's email address.
`custom` Type: Any Default: n/a Custom JSON values. Can be strings, numbers, or booleans. Filtering by Custom isn’t supported.
`includeCustom` Type: Boolean Default: `false` Whether to include the `custom` object in the fetch response.
`ifMatchesEtag` Type: String Default: n/a Use the eTag from an applicable get metadata call to ensure updates only apply if the object hasn’t changed. If the eTags differ, the server returns HTTP 412.

API limits
- For max parameter lengths, see REST API docs.

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

- requiredParameterDescription
`uuid` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.

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

- requiredParameterDescription
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc for sort direction (for example, `PNSortKey.asc(PNSortKey.Key.TYPE)`).
`includeTotalCount` Type: Boolean Default: `false` Whether to include the total count in the paginated response.
`includeCustom` Type: Boolean Default: `false` Whether to include the Custom object in the response.

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

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getChannelMetadata()  
2    .channel(String)  
3    .includeCustom(Boolean)  
`
```

- requiredParameterDescription
`channel` Type: String Default: n/a Channel name.
`includeCustom` Type: Boolean Default: `false` Whether to include the Custom object in the response.

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

Sets metadata for a Channel. Partial updates of custom metadata are not supported; provided custom overwrites existing. Use ETag for conditional updates.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel ID.
`name` Type: String Default: n/a Name for the channel.
`description` Type: String Default: n/a Description of a channel.
`custom` Type: Map`<String, Object>` Default: n/a Any object of key-value pairs with supported data types. App Context filtering language doesn’t support filtering by custom properties.
`includeCustom` Type: Boolean Default: `false` Whether to include the `custom` object in the fetch response.
`ifMatchesEtag` Type: String Default: n/a Use eTag to ensure updates only if unchanged; mismatch returns HTTP 412.

API limits
- For max parameter lengths, see REST API docs.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel ID.

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

- requiredParameterDescription
`userId` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc.
`include` Type: `MembershipInclude` Default: All parameters set to `false` Object holding the configuration for whether to include additional data in the response.

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

- requiredParameterDescription
`channelMemberships` Type: List`<PNChannelMembership>` Default: n/a Collection of PNChannelMembership to add to membership.
`userId` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc.
`include` Type: `MembershipInclude` Default: All parameters set to `false` Object holding the configuration for whether to include additional data in the response.

API limits
- For max parameter lengths, see REST API docs.

#### PNChannelMembership

`PNChannelMembership` is a utility class that uses the builder pattern to construct a channel membership with additional custom data.

- requiredParameterDescription
`channel` Type: `ChannelId` The name of the channel associated with this membership.
`custom` Type: `Object` A dictionary that stores custom metadata related to the membership.
`status` Type: `String` The status of the membership, for example: "active" or "inactive"
`type` Type: `String` The type of membership for categorization purposes.

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

- requiredParameterDescription
`channelMemberships` Type: List`<PNChannelMembership>` Default: n/a Collection of PNChannelMembership to add to membership.
`userId` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc.
`include` Type: `MembershipInclude` Default: All parameters set to `false` Object holding the configuration for whether to include additional data in the response.

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

Manage a user's channel memberships (set and remove in one call).

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

- requiredParameterDescription
`set` Type: `Collection<PNChannelMembership>` Default: n/a List of members PNChannelMembership to add to channel.
`remove` Type: `Collection<Stirng>` Default: n/a List of members channelIds to remove from channel.
`userId` Type: String Default: `pubnub.getConfiguration().getUserId().getValue()` Unique User Metadata identifier. If not supplied, then userId from configuration will be used.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc.
`include` Type: `MembershipInclude` Default: All parameters set to `false` Object holding the configuration for whether to include additional data in the response.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel ID.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc for sort direction (for example, `PNSortKey.asc(PNSortKey.Key.TYPE)`).
`include` Type: `MemberInclude` Default: All parameters set to `false`. Object holding the configuration for whether to include additional data in the response.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel name.
`channelMembers` Type: `Collection<PNUser>` Default: n/a List of members to add to channel.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a Cursor-based pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` Sort by `ID`, `NAME`, `UPDATED`, `STATUS`, `TYPE` with asc/desc.
`include` Type: `MemberInclude` Default: All parameters set to `false`. Object holding the configuration for whether to include additional data in the response.

API limits
- For max parameter lengths, see REST API docs.

#### PNUser

`PNUser` is a builder-based utility to construct a user with optional custom, status, and type.

- requiredPropertyDescription
`userId` Type: `String` The unique identifier for the user. Cannot be null or empty.
`custom` Type: `Object` Custom metadata related to the user.
`status` Type: `String` User status such as `active` or `inactive`.
`type` Type: `String` Categorization type of the user.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel name.
`channelMembers` Type: Collection`<String>` Default: n/a List of member userIds to remove from channel.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a The paging object used for pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` to specify sort direction. For example: `PNSortKey.asc(PNSortKey.Key.TYPE)` or `PNSortKey.asc(PNSortKey.Key.STATUS)`
`include` Type: `MemberInclude` Default: All parameters set to `false` Object defining options to include additional data in the response.

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

Set and remove channel members for a channel in one call.

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

- requiredParameterDescription
`channel` Type: String Default: n/a Channel name.
`set` Type: Collection`<PNUser>` Default: n/a List of members to add to channel.
`remove` Type: Collection`<String>` Default: n/a List of userIds to remove from channel.
`limit` Type: Integer Default: `100` Number of objects to return. Default/Max: 100.
`page` Type: PNPage Default: n/a The paging object used for pagination.
`filter` Type: String Default: n/a Filter expression. Only matching objects are returned. See filtering.
`sort` Type: List`<PNSortKey>` Default: `listOf()` List of properties to sort by. Available options are `PNSortKey.Key.ID`, `PNSortKey.Key.NAME`, `PNSortKey.Key.UPDATED`, `PNSortKey.Key.STATUS` and `PNSortKey.Key.TYPE`. Use `PNSortKey.asc` or `PNSortKey.desc` for direction.
`include` Type: `MemberInclude` Default: All parameters set to `false` Object holding the configuration for whether to include additional data in the response.

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

Last updated on Sep 3, 2025**