# App Context API – Java SDK (v9+)  
The Objects (App Context) API stores and manages metadata for users (UUIDs), channels, and their relationships.  
Below is a condensed reference that keeps every original code block, method signature, parameter, and response model.

---

## User

### Get Metadata for All Users  

```java
pubnub.getAllUUIDMetadata()  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .includeTotalCount(Boolean)  
    .includeCustom(Boolean)  
```

Parameters: limit (100 default), page, filter, sort, includeTotalCount (false), includeCustom (false).  

```java
  
```

```java
public class PNGetAllUUIDMetadataResult extends EntityArrayEnvelope<PNUUIDMetadata> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNUUIDMetadata> data;  
    PNPage nextPage() { return PNPage.next(next); }  
    PNPage previousPage() { return PNPage.previous(prev); }  
}  
  
public class PNUUIDMetadata extends PNObject {  
```
show all 24 lines
```

---

### Get User Metadata  

```java
pubnub.getUUIDMetadata()  
    .uuid(String)  
    .includeCustom(Boolean)  
```

Parameters: uuid (default configuration userId), includeCustom (false).  

```java
  
```

```java
public class PNGetUUIDMetadataResult extends EntityEnvelope<PNUUIDMetadata> {  
    int status;  
    PNUUIDMetadata data;  
}  
  
public class PNUUIDMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String email;  
    String externalId;  
    String profileUrl;  
}  
```

---

### Set User Metadata  

```java
pubnub.setUUIDMetadata()  
    .uuid(String)  
    .name(String)  
    .externalId(String)  
    .profileUrl(String)  
    .email(String)  
    .custom(Map<String, Object>)  
    .includeCustom(true)  
    .ifMatchesEtag(String)  
```

All supplied fields overwrite previous values (no partial-merge for `custom`).  

```java
  
```

```java
public class PNSetUUIDMetadataResult extends EntityEnvelope<PNUUIDMetadata> {  
    protected int status;  
    protected PNUUIDMetadata data;  
}  
  
public class PNUUIDMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String email;  
    String externalId;  
    String profileUrl;  
}  
```

---

### Remove User Metadata  

```java
pubnub.removeUUIDMetadata()  
    .uuid(String)  
```

```java
  
```

```java
public class PNRemoveUUIDMetadataResult extends EntityEnvelope<JsonElement> {  
    int status;  
    JsonElement data;  
}  
```

---

## Channel

### Get Metadata for All Channels  

```java
pubnub.getAllChannelsMetadata()  
        .limit(Integer)  
        .page(PNPage)  
        .filter(String)  
        .sort(List<PNSortKey>)  
        .includeTotalCount(Boolean)  
        .includeCustom(Boolean)  
```

Parameters mirror the UUID variant.  

```java
  
```

```java
public class PNGetAllChannelsMetadataResult extends EntityArrayEnvelope<PNChannelMetadata> {  
    int status;  
    List<PNChannelMetadata> data;  
    Integer totalCount;  
    String next;  
    String prev;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
```
show all 16 lines
```

---

### Get Channel Metadata  

```java
pubnub.getChannelMetadata()  
    .channel(String)  
    .includeCustom(Boolean)  
```

```java
  
```

```java
public class PNGetChannelMetadataResult extends EntityEnvelope<PNChannelMetadata> {  
    protected int status;  
    protected PNChannelMetadata data;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
}  
```

---

### Set Channel Metadata  

```java
pubnub.setChannelMetadata()  
    .channel(String)  
    .name(String)  
    .description(String)  
    .custom(Map<String, Object>)  
    .includeCustom(Boolean)  
    .ifMatchesEtag(String)  
```

`custom` fully overwrites previous value.  

```java
  
```

```java
public class PNSetChannelMetadataResult extends EntityEnvelope<PNChannelMetadata> {  
    protected int status;  
    protected PNChannelMetadata data;  
}  
  
public class PNChannelMetadata extends PNObject {  
    String id;  
    Object custom;  
    String updated;  
    String eTag;  
    String name;  
    String description;  
}  
```

```java
  
```

---

### Remove Channel Metadata  

```java
pubnub.removeChannelMetadata()  
    .channel(String)  
```

```java
  
```

```java
public class PNRemoveChannelMetadataResult extends EntityEnvelope<JsonElement> {  
    int status;  
    protected JsonElement data;  
}  
```

---

## Channel Memberships (User ↔ Channel)

### Get Memberships  

```java
pubnub.getMemberships()  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
```

```java
  
```

```java
public class PNGetMembershipsResult extends EntityArrayEnvelope<PNMembership> {  
    protected Integer totalCount;  
    protected String next;  
    protected String prev;  
    protected int status;  
    protected List<PNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

```java
  
```

---

### Set Memberships  

```java
pubnub.setMemberships(Collection<PNChannelMembership>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
```

`PNChannelMembership` builder: channel, custom, status, type.  

```java
  
```

```java
public class PNSetMembershipResult extends EntityArrayEnvelope<PNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

### Remove Memberships  

```java
pubnub.removeMemberships(Collection<PNChannelMembership>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
```

```java
  
```

```java
public class PNRemoveMembershipResults extends EntityArrayEnvelope<PNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

### Manage Memberships (set & remove in one call)

```java
pubnub.manageMemberships(Collection<PNChannelMembership>, Collection<String>)  
    .userId(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MembershipInclude)  
    .async(result -> { /* check result */ });  
```

```java
  
```

```java
public class PNManageMembershipResult extends EntityArrayEnvelope<PNMembership> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembership> data;  
}  
  
public class PNMembership {  
    PNChannelMetadata channel;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

## Channel Members (Channel ↔ User)

### Get Channel Members  

```java
pubnub.getChannelMembers(String)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MemberInclude)  
    .async(result -> { /* check result */ });  
```

```java
  
```

```java
public class PNRemoveMembershipResults extends EntityArrayEnvelope<PNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

### Set Channel Members  

```java
pubnub.setChannelMembers(String, Collection<PNUser>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MemberInclude)  
    .async(result -> { /* check result */ });  
```

`PNUser` builder: userId, custom, status, type.  

```java
  
```

```java
public class PNSetChannelMembersResult extends EntityArrayEnvelope<PNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

### Remove Channel Members  

```java
pubnub.removeChannelMembers(String, List<String>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .includeTotalCount(Boolean)  
    .includeCustom(Boolean)  
    .includeUUID(PNUUIDDetailsLevel)  
```

```java
  
```

```java
public class PNRemoveChannelMembersResult extends EntityArrayEnvelope<PNMembers> {  
    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

---

### Manage Channel Members  

```java
pubnub.manageChannelMembers(String, Collection<PNUser>, Collection<String>)  
    .limit(Integer)  
    .page(PNPage)  
    .filter(String)  
    .sort(List<PNSortKey>)  
    .include(MemberInclude)  
```

```java
  
```

```java
public class PNManageChannelMembersResult extends EntityArrayEnvelope<PNMembers> {**    Integer totalCount;  
    String next;  
    String prev;  
    int status;  
    List<PNMembers> data;  
}  
  
public class PNMembers {  
    PNUUIDMetadata uuid;  
    Object custom;  
    String updated;  
    String eTag;  
}  
```

_Last updated May 28 2025_