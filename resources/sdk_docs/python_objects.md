# PubNub Python SDK – App Context (Objects) Quick Reference  
This condensed guide keeps every method signature, parameter, and at least one runnable sample for each operation.  
All requests can be executed:  

```
# Synchronous – returns Envelope(result, status)
pubnub.<operation>(...).sync()

# Asynchronous – passes (result, status) to callback
pubnub.<operation>(...).pn_async(callback)
```

---

## User (UUID) Metadata  

### 1. Get all UUID metadata  

```
pubnub.get_all_uuid_metadata()       \
    .limit(Integer)                  \
    .page(PNPage)                    \
    .filter(String)                  \
    .sort(*PNSortKey)                \
    .include_total_count(Boolean)    \
    .include_custom(Boolean)         \
    .include_status(Boolean)         \
    .include_type(Boolean)
```

* limit – max objects per page.  
* page – PNPage for pagination.  
* filter – see filtering docs.  
* sort – `id`, `name`, `updated` (+ `asc|desc`).  
* include_* – booleans, default shown above.

Example (sync, builder):

```python
result = pubnub.get_all_uuid_metadata()                     \
    .include_custom(True)                                   \
    .limit(10)                                              \
    .include_total_count(True)                              \
    .sort(PNSortKey.asc(PNSortKeyValue.ID),
          PNSortKey.desc(PNSortKeyValue.UPDATED))           \
    .sync()
```

Returns `PNGetAllUUIDMetadataResult(data, status)`; each data element:  
`id, name, externalId, profileUrl, email, status, type, custom`.

---

### 2. Get single UUID metadata  

```
pubnub.get_uuid_metadata()  \
      .uuid(String)         \
      .include_custom(Boolean) \
      .include_status(Boolean) \
      .include_type(Boolean)
```

Example:

```python
metadata = pubnub.get_uuid_metadata(include_custom=True).sync()
```

Returns `PNGetUUIDMetadataResult(data, status)`.

---

### 3. Set UUID metadata  

```
pubnub.set_uuid_metadata()     \
      .uuid(String)            \
      .set_name(String)        \
      .set_status(String)      \
      .set_type(String)        \
      .external_id(String)     \
      .profile_url(String)     \
      .email(String)           \
      .custom(dict)            \
      .include_custom(Boolean) \
      .include_status(Boolean) \
      .include_type(Boolean)   \
      .if_matches_etag(String)
```

Example (named args):

```python
pubnub.set_uuid_metadata(
        uuid="user-1",
        name="Alice",
        status="Active",
        type="Admin",
        email="alice@example.com",
        custom={"team": "blue"}).sync()
```

Returns `PNSetUUIDMetadataResult(data, status)`.

---

### 4. Remove UUID metadata  

```
pubnub.remove_uuid_metadata() \
      .uuid(String)
```

```python
pubnub.remove_uuid_metadata(uuid="user-1").sync()
```

Returns `PNRemoveUUIDMetadataResult(status)`.

---

## Channel Metadata  

### 1. Get all channel metadata  

```
pubnub.get_all_channel_metadata()   \
    .limit(Integer)                 \
    .page(PNPage)                   \
    .filter(String)                 \
    .sort(*PNSortKey)               \
    .include_total_count(Boolean)   \
    .include_custom(Boolean)        \
    .include_status(Boolean)        \
    .include_type(Boolean)
```

```python
channels = pubnub.get_all_channel_metadata(
              limit=10,
              include_custom=True,
              include_total_count=True,
              sort=[PNSortKey.asc(PNSortKeyValue.ID)]
          ).sync()
```

Returns `PNGetAllChannelMetadataResult(data, status)`.

---

### 2. Get single channel metadata  

```
pubnub.get_channel_metadata() \
      .channel(String)        \
      .include_custom(Boolean)\
      .include_status(Boolean)\
      .include_type(Boolean)
```

```python
meta = pubnub.get_channel_metadata(channel="ch1",
                                   include_custom=True).sync()
```

Returns `PNGetChannelMetadataResult(data, status)`.

---

### 3. Set channel metadata  

```
pubnub.set_channel_metadata() \
      .channel(String)        \
      .set_name(String)       \
      .set_status(String)     \
      .set_type(String)       \
      .description(String)    \
      .custom(dict)           \
      .include_custom(Boolean)\
      .include_status(Boolean)\
      .include_type(Boolean)  \
      .if_matches_etag(String)
```

```python
pubnub.set_channel_metadata(
        channel="ch1",
        name="General",
        status="Public",
        type="Team",
        description="Main chat",
        custom={"color": "green"},
        include_custom=True).sync()
```

Returns `PNSetChannelMetadataResult(data, status)`.

---

### 4. Remove channel metadata  

```
pubnub.remove_channel_metadata().channel(String)
```

```python
pubnub.remove_channel_metadata(channel="ch1").sync()
```

Returns `PNRemoveChannelMetadataResult(status)`.

---

## Channel Memberships (user ↔ channels)

Utility classes:

```python
PNChannelMembership.channel("ch")
PNChannelMembership.channel_with_custom("ch", {"role":"admin"})
PNUUID.uuid("user")
PNUUID.uuid_with_custom("user", {"role":"admin"})
```

### 1. Get memberships (channels for a user)

```
pubnub.get_memberships() \
    .uuid(String)        \
    .limit(Integer)      \
    .page(PNPage)        \
    .filter(String)      \
    .sort(*PNSortKey)    \
    .include(MembershipIncludes)
```

```python
from pubnub.models.consumer.objects_v2.channel_memberships import MembershipIncludes
res = pubnub.get_memberships(
        uuid="user-1",
        include=MembershipIncludes(custom=True,
                                   channel=True,
                                   channel_custom=True)
     ).sync()
```

Returns `PNGetMembershipsResult(data, status, total_count, prev, next)`.

---

### 2. Set memberships (add/update)  

```
pubnub.set_memberships()          \
      .channel_memberships([PNChannelMembership]) \
      .uuid(String)               \
      .limit(Integer)             \
      .page(PNPage)               \
      .filter(String)             \
      .sort(*PNSortKey)           \
      .include(MembershipIncludes)
```

```python
memberships = [PNChannelMembership.channel("ch1"),
               PNChannelMembership.channel_with_custom("ch2", {"role":"mod"})]
pubnub.set_memberships(uuid="user-1",
                       channel_memberships=memberships).sync()
```

Returns `PNSetMembershipsResult(...)`.

---

### 3. Remove memberships  

```
pubnub.remove_memberships()       \
      .channel_memberships([PNChannelMembership]) \
      .uuid(String)               \
      .include_custom(Boolean)    \
      .include_channel(Integer)
```

```python
pubnub.remove_memberships(
        uuid="user-1",
        channel_memberships=[PNChannelMembership.channel("ch1")],
        include_channel=ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM,
        include_custom=True).sync()
```

Returns `PNRemoveMembershipsResult(...)`.

---

### 4. Manage memberships (add & remove in one call)

```
pubnub.manage_memberships()   \
      .uuid(String)           \
      .set([PNChannelMembership])    \
      .remove([PNChannelMembership]) \
      .limit(Integer)         \
      .page(PNPage)           \
      .filter(String)         \
      .sort(*PNSortKey)       \
      .include(MembershipIncludes)
```

```python
pubnub.manage_memberships(
        uuid="user-1",
        set=[PNChannelMembership.channel("ch1")],
        remove=[PNChannelMembership.channel("old")],
        include=MembershipIncludes(custom=True, channel=True)).sync()
```

Returns `PNManageMembershipsResult(...)`.

---

## Channel Members (users in a channel)

### 1. Get channel members  

```
pubnub.get_channel_members()  \
      .channel(String)        \
      .limit(Integer)         \
      .page(PNPage)           \
      .filter(String)         \
      .sort(*PNSortKey)       \
      .include(MemberIncludes)
```

```python
from pubnub.models.consumer.objects_v2.members import MemberIncludes
members = pubnub.get_channel_members(
            channel="ch1",
            include=MemberIncludes(custom=True,
                                   user=True,
                                   user_custom=True)).sync()
```

Returns `PNGetChannelMembersResult(...)`.

---

### 2. Set channel members  

```
pubnub.set_channel_members() \
      .channel(String)       \
      .uuids([PNUUID])       \
      .limit(Integer)        \
      .page(PNPage)          \
      .filter(String)        \
      .sort(*PNSortKey)      \
      .include(MemberIncludes)
```

```python
uuids = [PNUUID.uuid("user-1"),
         PNUUID.uuid_with_custom("user-2", {"role":"mod"})]
pubnub.set_channel_members(channel="ch1", uuids=uuids).sync()
```

Returns `PNSetChannelMembersResult(...)`.

---

### 3. Remove channel members  

```
pubnub.remove_channel_members() \
      .channel(String)          \
      .uuids([PNUUID])          \
      .include_custom(Boolean)  \
      .include_uuid(Integer)
```

```python
pubnub.remove_channel_members(
        channel="ch1",
        uuids=[PNUUID.uuid("user-1")],
        include_uuid=UUIDIncludeEndpoint.UUID_WITH_CUSTOM,
        include_custom=True).sync()
```

Returns `PNRemoveChannelMembersResult(...)`.

---

### 4. Manage channel members (add & remove)

```
pubnub.manage_channel_members()  \
      .channel(String)           \
      .set([PNUUID])             \
      .remove([PNUUID])          \
      .limit(Integer)            \
      .page(PNPage)              \
      .filter(String)            \
      .sort(*PNSortKey)          \
      .include(MemberIncludes)
```

```python
pubnub.manage_channel_members(
        channel="ch1",
        set=[PNUUID.uuid("user-3")],
        remove=[PNUUID.uuid("user-1")],
        include=MemberIncludes(custom=True, user=True)).sync()
```

Returns `PNManageChannelMembersResult(...)`.

---

_Last updated Jul 15 2025_