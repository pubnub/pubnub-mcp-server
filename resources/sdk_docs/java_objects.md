# App Context API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, changes client instantiation, and updates asynchronous callbacks and emitted status events. Apps built with < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide: /docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub emits events on set, update, or removal (idempotent sets don’t emit).

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

Parameters:
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc (for example, PNSortKey.asc(PNSortKey.Key.TYPE)).
- includeTotalCount (Boolean, default false): Include total count in response.
- includeCustom (Boolean, default false): Include the Custom object.

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

Returns metadata for the specified UUID, optionally including the custom data object.

#### Method(s)

Use the following in the Java SDK:

```
`1pubnub.getUUIDMetadata()  
2    .uuid(String)  
3    .includeCustom(Boolean)  
`
```

Parameters:
- uuid (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. If not supplied, configuration userId is used.
- includeCustom (Boolean, default false): Include the Custom object.

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

Sets metadata for a UUID. Custom overwrites existing custom data; use read-modify-write if you need to merge.

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

Parameters:
- uuid (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.
- name (String): Display name.
- externalId (String): ID in external system.
- profileUrl (String): Profile image URL.
- email (String): Email address.
- custom (Any): Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- includeCustom (Boolean, default false): Include custom in fetch response.
- ifMatchesEtag (String): Use eTag from get to ensure conditional update; mismatches return HTTP 412.

API limits: See /docs/sdks/rest-api/set-user-metadata.

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

Parameters:
- uuid (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.

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

Parameters:
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc (e.g., PNSortKey.asc(PNSortKey.Key.TYPE)).
- includeTotalCount (Boolean, default false): Include total count.
- includeCustom (Boolean, default false): Include the Custom object.

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

Parameters:
- channel (String): Channel name.
- includeCustom (Boolean, default false): Include the Custom object.

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

Sets metadata for a Channel. Custom overwrites existing data; use read-modify-write to merge.

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

Parameters:
- channel (String): Channel ID.
- name (String): Channel name.
- description (String): Channel description.
- custom (Map<String, Object>): Key-value pairs; filtering by custom not supported.
- includeCustom (Boolean, default false): Include custom in fetch response.
- ifMatchesEtag (String): Conditional update using eTag; mismatches return HTTP 412.

API limits: See /docs/sdks/rest-api/set-channel-metadata.

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

Parameters:
- channel (String): Channel ID.

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

Parameters:
- userId (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MembershipInclude, defaults false for all): Include additional data in response.

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

Parameters:
- channelMemberships (List<PNChannelMembership>): Collection of PNChannelMembership to add.
- userId (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MembershipInclude, defaults false for all): Include additional data in response.

API limits: See /docs/sdks/rest-api/set-membership-metadata.

#### PNChannelMembership

PNChannelMembership is a utility class (builder) for constructing a channel membership with additional custom data.

- channel (ChannelId): The name of the channel for this membership.
- custom (Object): Custom metadata for the membership.
- status (String): Membership status (e.g., "active", "inactive").
- type (String): Membership type for categorization.

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

Parameters:
- channelMemberships (List<PNChannelMembership>): Collection of PNChannelMembership to add to membership.
- userId (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MembershipInclude, defaults false for all): Include additional data in response.

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

Parameters:
- set (Collection<PNChannelMembership>): List of members to add to channel.
- remove (Collection<Stirng>): List of channelIds to remove from channel.
- userId (String, default pubnub.getConfiguration().getUserId().getValue()): Unique User Metadata identifier. Defaults to configuration userId.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MembershipInclude, defaults false for all): Include additional data in response.

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

Parameters:
- channel (String): Channel ID.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MemberInclude, defaults false for all): Include additional data in response.

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

Parameters:
- channel (String): Channel name.
- channelMembers (Collection<PNUser>): List of members to add to channel.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Cursor-based pagination.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MemberInclude, defaults false for all): Include additional data in response.

API limits: See /docs/sdks/rest-api/set-channel-members-metadata.

#### PNUser

PNUser is a utility class (builder) to construct a user object with optional custom metadata.

- userId (String, required): Unique user identifier; non-null, non-empty.
- custom (Object): Custom metadata for the user.
- status (String): e.g., active, inactive.
- type (String): Categorization type.

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

Parameters:
- channel (String): Channel name.
- channelMembers (Collection<String>): Member userIds to remove.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Paging object.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc (e.g., PNSortKey.asc(PNSortKey.Key.TYPE)).
- include (MemberInclude, defaults false for all): Object defining options to include additional data in the response.

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

Set and remove channel memberships for a user.

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

Parameters:
- channel (String): Channel name.
- set (Collection<PNUser>): Members to add to channel.
- remove (Collection<String>): userIds to remove from channel.
- limit (Integer, default 100): Number of objects to return. Default/Max: 100.
- page (PNPage): Paging object.
- filter (String): Filter expression. See /docs/general/metadata/filtering.
- sort (List<PNSortKey>, default listOf()): Sort by ID, NAME, UPDATED, STATUS, TYPE with asc/desc.
- include (MemberInclude, defaults false for all): Include additional data in response.

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