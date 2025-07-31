# App Context (Objects v2) – PubNub Java SDK v9+

• v9.0.0 merges Java & Kotlin SDKs, introduces a new PubNub client builder, and changes async callbacks / status events.  
• If you upgrade from Java SDK < 9.0.0 or from Objects v1, read the migration guides.

---

## User (UUID metadata)

### Get metadata for all users
```
pubnub.getAllUUIDMetadata()
    .limit(Integer)
    .page(PNPage)
    .filter(String)
    .sort(List<PNSortKey>)
    .includeTotalCount(Boolean)
    .includeCustom(Boolean)
```
Parameters  
• limit (Integer, default 100) – max objects per page  
• page (PNPage) – paging cursor  
• filter (String) – expression (see filtering docs)  
• sort (List<PNSortKey>) – use PNSortKey.asc/desc on ID, NAME, UPDATED, STATUS, TYPE  
• includeTotalCount (Boolean, default false)  
• includeCustom (Boolean, default false)

Response
```
public class PNGetAllUUIDMetadataResult extends EntityArrayEnvelope<PNUUIDMetadata> {
    Integer totalCount;
    String next; String prev; int status;
    List<PNUUIDMetadata> data;
    PNPage nextPage(); PNPage previousPage();
}
public class PNUUIDMetadata extends PNObject {
    String id; Object custom; String updated; String eTag;
    String name; String email; String externalId; String profileUrl;
}
```
```
  
```

### Get user metadata
```
pubnub.getUUIDMetadata()
    .uuid(String)
    .includeCustom(Boolean)
```
Parameters  
• uuid (String, default configuration.userId)  
• includeCustom (Boolean, default false)

Response (same PNUUIDMetadata)
```
public class PNGetUUIDMetadataResult extends EntityEnvelope<PNUUIDMetadata> {
    int status; PNUUIDMetadata data;
}
```
```
  
```

### Set user metadata
```
pubnub.setUUIDMetadata()
    .uuid(String)
    .name(String)
    .externalId(String)
    .profileUrl(String)
    .email(String)
    .custom(Map<String,Object>)
    .includeCustom(Boolean)
    .ifMatchesEtag(String)
```
Parameters – same names as builder chain; custom completely overwrites existing value.

Response
```
public class PNSetUUIDMetadataResult extends EntityEnvelope<PNUUIDMetadata> {
    int status; PNUUIDMetadata data;
}
```
```
  
```

### Remove user metadata
```
pubnub.removeUUIDMetadata()
    .uuid(String)
```
Response
```
public class PNRemoveUUIDMetadataResult extends EntityEnvelope<JsonElement> {
    int status; JsonElement data;
}
```
```
  
```

---

## Channel metadata

### Get metadata for all channels
```
pubnub.getAllChannelsMetadata()
    .limit(Integer)
    .page(PNPage)
    .filter(String)
    .sort(List<PNSortKey>)
    .includeTotalCount(Boolean)
    .includeCustom(Boolean)
```
Parameters identical to UUID version.

Response
```
public class PNGetAllChannelsMetadataResult extends EntityArrayEnvelope<PNChannelMetadata> {
    int status; List<PNChannelMetadata> data;
    Integer totalCount; String next; String prev;
}
public class PNChannelMetadata extends PNObject {
    String id; Object custom; String updated; String eTag;
    String name; String description;
}
```
```
  
```

### Get channel metadata
```
pubnub.getChannelMetadata()
    .channel(String)
    .includeCustom(Boolean)
```
Response
```
public class PNGetChannelMetadataResult extends EntityEnvelope<PNChannelMetadata> {
    int status; PNChannelMetadata data;
}
```
```
  
```

### Set channel metadata
```
pubnub.setChannelMetadata()
    .channel(String)
    .name(String)
    .description(String)
    .custom(Map<String,Object>)
    .includeCustom(Boolean)
    .ifMatchesEtag(String)
```
(custom replaces existing value)

Response
```
public class PNSetChannelMetadataResult extends EntityEnvelope<PNChannelMetadata> {
    int status; PNChannelMetadata data;
}
```
```
  
```
Iterative update example
```
  
```

### Remove channel metadata
```
pubnub.removeChannelMetadata()
    .channel(String)
```
Response
```
public class PNRemoveChannelMetadataResult extends EntityEnvelope<JsonElement> {
    int status; JsonElement data;
}
```
```
  
```

---

## Channel memberships (user ↔ channel links)

### Get channel memberships
```
pubnub.getMemberships()
    .userId(String)
    .limit(Integer)
    .page(PNPage)
    .filter(String)
    .sort(List<PNSortKey>)
    .include(MembershipInclude)
    .async(result -> { ... });
```
Response
```
public class PNGetMembershipsResult extends EntityArrayEnvelope<PNMembership> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembership> data;
}
public class PNMembership {
    PNChannelMetadata channel; Object custom; String updated; String eTag;
}
```
```
  
```
Pagination sample
```
  
```

### Set channel memberships
```
pubnub.setMemberships(Collection<PNChannelMembership>)
    .userId(String)
    .limit(Integer).page(PNPage).filter(String)
    .sort(List<PNSortKey>).include(MembershipInclude)
    .async(result -> { ... });
```
PNChannelMembership builder fields: channel, custom, status, type.

Response
```
public class PNSetMembershipResult extends EntityArrayEnvelope<PNMembership> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembership> data;
}
```
```
  
```

### Remove channel memberships
```
pubnub.removeMemberships(Collection<PNChannelMembership>)
    .userId(String) ...
```
Response
```
public class PNRemoveMembershipResults extends EntityArrayEnvelope<PNMembership> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembership> data;
}
```
```
  
```

### Manage channel memberships (set + remove in one call)
```
pubnub.manageMemberships(Collection<PNChannelMembership>, Collection<String>)
    .userId(String) ...
```
Response
```
public class PNManageMembershipResult extends EntityArrayEnvelope<PNMembership> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembership> data;
}
```
```
  
```

---

## Channel members (channel ↔ user links)

### Get channel members
```
pubnub.getChannelMembers(String)
    .limit(Integer).page(PNPage).filter(String)
    .sort(List<PNSortKey>).include(MemberInclude)
    .async(result -> { ... });
```
Response
```
public class PNRemoveMembershipResults extends EntityArrayEnvelope<PNMembers> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembers> data;
}
public class PNMembers {
    PNUUIDMetadata uuid; Object custom; String updated; String eTag;
}
```
```
  
```

### Set channel members
```
pubnub.setChannelMembers(String, Collection<PNUser>)
    .limit(Integer).page(PNPage).filter(String)
    .sort(List<PNSortKey>).include(MemberInclude) ...
```
PNUser builder fields: userId, custom, status, type.

Response
```
public class PNSetChannelMembersResult extends EntityArrayEnvelope<PNMembers> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembers> data;
}
```
```
  
```

### Remove channel members
```
pubnub.removeChannelMembers(String, List<String>)
    .limit(Integer).page(PNPage).filter(String)
    .sort(List<PNSortKey>).include(MemberInclude)
```
Response
```
public class PNRemoveChannelMembersResult extends EntityArrayEnvelope<PNMembers> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembers> data;
}
```
```
  
```

### Manage channel members
```
pubnub.manageChannelMembers(String,
        Collection<PNUser> set,
        Collection<String> remove)
    .limit(Integer).page(PNPage).filter(String)
    .sort(List<PNSortKey>).include(MemberInclude)
```
Response
```
public class PNManageChannelMembersResult extends EntityArrayEnvelope<PNMembers> {
    Integer totalCount; String next; String prev; int status;
    List<PNMembers> data;
}
```
```
  
```

_Last updated Jul 15 2025_