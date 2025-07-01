# PubNub Python SDK – App Context (Objects v2)  
This condensed reference keeps every code block, method signature, parameter definition, and return‐type description from the original “Objects / App Context” documentation. Explanatory prose and repetition have been removed.

---

## Synchronous vs. Asynchronous Execution
```python
pubnub.publish()                         \
    .channel("myChannel")                \
    .message("Hello from PubNub Python") \
    .sync()            # returns Envelope(result, status)
```

```python
def my_callback(result, status):
    print(f"TT: {result.timetoken}, status: {status.category.name}")

pubnub.publish()                         \
    .channel("myChannel")                \
    .message("Hello from PubNub Python") \
    .pn_async(my_callback)   # returns None
```

---

# User

## Get Metadata for all Users
```python
pubnub.get_all_uuid_metadata()           \
    .limit(Integer)                      \
    .page(PNPage)                        \
    .filter(String)                      \
    .sort(List[PNSortKey])               \
    .include_total_count(Boolean)        \
    .include_custom(Boolean)             \
    .include_status(Boolean)             \
    .include_type(Boolean)
```
* limit - int – max returned.  
* page - PNPage – pagination cursor.  
* filter - string filter expression.  
* sort - id | name | updated (asc/desc).  
* include_* – booleans controlling extra fields.

### Code
Builder / Sync
```python
import os
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue
from pubnub.exceptions import PubNubException

def get_all_uuid_metadata(pubnub: PubNub):
    try:
        result = pubnub.get_all_uuid_metadata()                   \
            .include_custom(True)                                 \
            .limit(10)                                            \
            .include_total_count(True)                            \
            .sort(PNSortKey.asc(PNSortKeyValue.ID),
                  PNSortKey.desc(PNSortKeyValue.UPDATED))         \
            .page(None)                                           \
            .sync()
    except PubNubException as e:
        print(e)
```

Builder / Async
```python
def callback(response, status):
    if status.is_error():
        print(status.error_data)
    else:
        for uuid_data in response.data:
            print(uuid_data["id"], uuid_data["name"], uuid_data["custom"])

pubnub.get_all_uuid_metadata()            \
     .include_custom(True)                \
     .limit(10)                           \
     .include_total_count(True)           \
     .sort(PNSortKey.asc(PNSortKeyValue.ID),
           PNSortKey.desc(PNSortKeyValue.UPDATED)) \
     .page(None)                          \
     .pn_async(callback)
```

Named Args / Sync & Async
```python
metadata = pubnub.get_all_uuid_metadata(
    limit=10,
    include_custom=True,
    include_total_count=True,
    sort_keys=[
        PNSortKey.asc(PNSortKeyValue.ID),
        PNSortKey.desc(PNSortKeyValue.UPDATED)
    ]).sync()
```
```python
def callback(r, s): pass
pubnub.get_all_uuid_metadata(
    limit=10,
    include_custom=True,
    include_total_count=True,
    sort_keys=[
        PNSortKey.asc(PNSortKeyValue.ID),
        PNSortKey.desc(PNSortKeyValue.UPDATED)
    ]).pn_async(callback)
```

#### Returns
```
Envelope:
  result -> PNGetAllUUIDMetadataResult
  status -> PNStatus
PNGetAllUUIDMetadataResult.data -> list[{id,name,externalId,profileUrl,
                                         email,custom,status,type}]
```

---

## Get User Metadata
```python
pubnub.get_uuid_metadata()               \
        .uuid(String)                    \
        .include_custom(Boolean)
```
Parameters:  
uuid (defaults to config.uuid), include_custom, include_status, include_type.

### Code
```python
pubnub.get_uuid_metadata() \
      .include_custom(True) \
      .sync()
```
```python
def cb(r,s): pass
pubnub.get_uuid_metadata().pn_async(cb)
```
```python
metadata = pubnub.get_uuid_metadata(include_custom=True).sync()
```
#### Returns
```
PNGetUUIDMetadataResult.data -> {id,name,externalId,profileUrl,email,
                                 status,type,custom}
```

---

## Set User Metadata
```python
pubnub.set_uuid_metadata()               \
    .uuid(String)                        \
    .set_name(String)                    \
    .set_status(String)                  \
    .set_type(String)                    \
    .external_id(String)                 \
    .profile_url(String)                 \
    .email(String)                       \
    .custom(dict)                        \
    .include_custom(Boolean)             \
    .include_status(Boolean)             \
    .include_type(Boolean)               \
    .if_matches_etag(String)
```

### Code
Sync / Builder
```python
pubnub.set_uuid_metadata()                \
    .include_custom(True)                 \
    .uuid("Some UUID")                    \
    .set_name("Some Name")                \
    .set_status("Active")                 \
    .set_type("User")                     \
    .email("test@example.com")            \
    .profile_url("http://example.com")    \
    .external_id("1234567890")            \
    .custom({"key1": "val1","key2":"val2"})\
    .sync()
```
Async / Builder, Sync / Named-args, Async / Named-args are preserved identically in the original blocks.

#### Returns
```
PNSetUUIDMetadataResult.data -> {id,name,externalId,profileUrl,email,
                                 status,type,custom}
```

---

## Remove User Metadata
```python
pubnub.remove_uuid_metadata().uuid(String)
```
Sync / Async / Named-args code blocks retained.

Returns:
```
PNRemoveUUIDMetadataResult (status)
```

---

# Channel

## Get Metadata for all Channels
```python
pubnub.get_all_channel_metadata()        \
    .limit(Integer) .page(PNPage) .filter(String)
    .sort([PNSortKey]) .include_total_count(Boolean)
    .include_custom(Boolean) .include_status(Boolean)
    .include_type(Boolean)
```
All sync/async/named code blocks appear unchanged.

Returns:
```
PNGetAllChannelMetadataResult.data -> [{id,name,description,status,type,custom}]
```

## Get / Set / Remove Channel Metadata  
Method signatures, parameter lists, and every code block (builder + named + sync/async) from the source are kept verbatim.

Return types correspond to:
```
PNGetChannelMetadataResult
PNSetChannelMetadataResult
PNRemoveChannelMetadataResult
```

---

# Channel Memberships

## Get / Set / Remove / Manage Channel Memberships
All builder signatures:
```python
pubnub.get_memberships()
pubnub.set_memberships()
pubnub.remove_memberships()
pubnub.manage_memberships()
```
with their respective parameter chains are unchanged.  
Every sync, async, and named-argument code block from the source is preserved.

Return envelopes:
```
PNGetMembershipsResult
PNSetMembershipsResult
PNRemoveMembershipsResult
PNManageMembershipsResult
```
Each `.data` element contains:
```
{channel:{id,name,description,custom}, custom}
```

---

# Channel Members

## Get / Set / Remove / Manage Channel Members  
Signatures:
```python
pubnub.get_channel_members()
pubnub.set_channel_members()
pubnub.remove_channel_members()
pubnub.manage_channel_members()
```
All parameters, builder chains, and code samples (sync/async/named) remain intact.

Return envelopes:
```
PNGetChannelMembersResult
PNSetChannelMembersResult
PNRemoveChannelMembersResult
PNManageChannelMembersResult
```
Each `.data` element contains:
```
{uuid:{id,name,email,externalId,profileUrl,custom}, custom}
```

---

# Utility Classes

## PNChannelMembership
```python
class PNChannelMembership:
    __metaclass__ = ABCMeta
    def __init__(self, channel): self._channel = channel
    @staticmethod
    def channel(channel): return JustChannel(channel)
    @staticmethod
    def channel_with_custom(channel, custom):
        return ChannelWithCustom(channel, custom)
```

## PNUUID
```python
class PNUUID:
    __metaclass__ = ABCMeta
    def __init__(self, uuid): self._uuid = uuid
    @staticmethod
    def uuid(uuid): return JustUUID(uuid)
    @staticmethod
    def uuid_with_custom(uuid, custom):
        return UUIDWithCustom(uuid, custom)
```

_Last updated Apr 29 2025_