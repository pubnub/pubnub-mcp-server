# App Context API for Python SDK

App Context (formerly Objects v2) provides storage for user and channel metadata and their membership associations. PubNub triggers real-time events when object data is set, updated, or removed. Setting identical data doesn’t trigger events.

##### Request execution and return values

- `.sync()` returns an Envelope with:
  - Envelope.result: type varies by API
  - Envelope.status: PnStatus
- `.pn_async(callback)` returns None; callback receives (result, status)

```
`1pubnub.publish() \  
2    .channel("myChannel") \  
3    .message("Hello from PubNub Python SDK") \  
4    .sync()  
`
```

```
1def my_callback_function(result, status):  
2    print(f'TT: {result.timetoken}, status: {status.category.name}')  
3
  
4pubnub.publish() \  
5    .channel("myChannel") \  
6    .message("Hello from PubNub Python SDK") \  
7    .pn_async(my_callback_function)  

```

## User

Manage UUID metadata: list, fetch, set, and remove.

### Get metadata for all users

Get a paginated list of UUID metadata, with filter/sort options.

#### Methods

```
`1pubnub.get_all_uuid_metadata() \  
2    .limit(Integer) \  
3    .page(PNPage Object) \  
4    .filter(String) \  
5    .sort(ListPNSortKey>) \  
6    .include_total_count(Boolean) \  
7    .include_custom(Boolean) \  
8    .include_status(Boolean) \  
9    .include_type(Boolean)  
`
```

Parameters:
- limit (Integer, default: N/A) – Max objects per page.
- page (PNPage, default: N/A) – Pagination cursor.
- filter (String) – See filtering language docs.
- sort (List<PNSortKey>) – Sort by id|name|updated with asc|desc (e.g., {name: 'asc'}).
- include_total_count (Boolean, default: False) – Include total count.
- include_custom (Boolean, default: False) – Include custom object.
- include_status (Boolean, default: True) – Include status field.
- include_type (Boolean, default: True) – Include type field.

#### Sample code

Synchronous (Builder Pattern):

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def get_all_uuid_metadata(pubnub: PubNub):  
9    try:  
10        result = pubnub.get_all_uuid_metadata() \  
11            .include_custom(True) \  
12            .limit(10) \  
13            .include_total_count(True) \  
14            .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
15            .page(None) \  
16            .sync()  
17
  
18        for uuid_data in result.result.data:  
19            print(f"UUID: {uuid_data['id']}")  
20            print(f"Name: {uuid_data['name']}")  
21            print(f"Custom: {uuid_data['custom']}")  
22
  
23    except PubNubException as e:  
24        print(f"Error: {e}")  
25
  
26
  
27def main():  
28    # Configuration for PubNub instance  
29    pn_config = PNConfiguration()  
30    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
31    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
32    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
33
  
34    # Initialize PubNub client  
35    pubnub = PubNub(pn_config)  
36
  
37    # Get all UUID metadata  
38    get_all_uuid_metadata(pubnub)  
39
  
40
  
41if __name__ == "__main__":  
42    main()  
43
  

```

Asynchronous (Builder Pattern):

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
5
  
6
  
7def callback(response, status):  
8    if status.is_error():  
9        print(f"Error: {status.error_data}")  
10    else:  
11        for uuid_data in response.data:  
12            print(f"UUID: {uuid_data["id"]}")  
13            print(f"Name: {uuid_data["name"]}")  
14            print(f"Custom: {uuid_data["custom"]}")  
15
  
16
  
17def get_all_uuid_metadata(pubnub: PubNub):  
18    pubnub.get_all_uuid_metadata() \  
19        .include_custom(True) \  
20        .limit(10) \  
21        .include_total_count(True) \  
22        .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
23        .page(None) \  
24        .pn_async(callback)  
25
  
26
  
27def main():  
28    # Configuration for PubNub instance  
29    pn_config = PNConfiguration()  
30    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
31    pn_config.publish_key = os.getenv('PUBLISH_KEY', 'demo')  
32    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
33
  
34    # Initialize PubNub client  
35    pubnub = PubNub(pn_config)  
36
  
37    # Get all UUID metadata  
38    get_all_uuid_metadata(pubnub)  
39
  
40
  
41if __name__ == "__main__":  
42    main()  
43
  

```

Synchronous (Named Arguments):

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
5from pubnub.exceptions import PubNubException  
6
  
7
  
8def get_all_uuid_metadata(pubnub: PubNub):  
9    try:  
10        metadata = pubnub.get_all_uuid_metadata(  
11            limit=10,  
12            include_custom=True,  
13            include_total_count=True,  
14            sort_keys=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]  
15        ).sync()  
16
  
17        for uuid_data in metadata.result.data:  
18            print(f"UUID: {uuid_data["id"]}")  
19            print(f"Name: {uuid_data["name"]}")  
20            print(f"Custom: {uuid_data["custom"]}")  
21
  
22    except PubNubException as e:  
23        print(f"Error: {e}")  
24
  
25
  
26def main():  
27    # Configuration for PubNub instance  
28    pn_config = PNConfiguration()  
29    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
30    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
31
  
32    # Initialize PubNub client  
33    pubnub = PubNub(pn_config)  
34
  
35    # Get all UUID metadata  
36    get_all_uuid_metadata(pubnub)  
37
  
38
  
39if __name__ == "__main__":  
40    main()  
41
  

```

Asynchronous (Named Arguments):

```
1import os  
2from pubnub.pnconfiguration import PNConfiguration  
3from pubnub.pubnub import PubNub  
4from pubnub.models.consumer.objects_v2.sort import PNSortKey, PNSortKeyValue  
5
  
6
  
7def callback(response, status):  
8    if status.is_error():  
9        print(f"Error: {status.error_data}")  
10    else:  
11        for uuid_data in response.data:  
12            print(f"UUID: {uuid_data["id"]}")  
13            print(f"Name: {uuid_data["name"]}")  
14            print(f"Custom: {uuid_data["custom"]}")  
15
  
16
  
17def get_all_uuid_metadata(pubnub: PubNub):  
18    pubnub.get_all_uuid_metadata(  
19        limit=10,  
20        include_custom=True,  
21        include_total_count=True,  
22        sort_keys=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]  
23    ).pn_async(callback)  
24
  
25
  
26def main():  
27    # Configuration for PubNub instance  
28    pn_config = PNConfiguration()  
29    pn_config.subscribe_key = os.getenv('SUBSCRIBE_KEY', 'demo')  
30    pn_config.user_id = os.getenv('USER_ID', 'my_custom_user_id')  
31
  
32    # Initialize PubNub client  
33    pubnub = PubNub(pn_config)  
34
  
35    # Get all UUID metadata  
36    get_all_uuid_metadata(pubnub)  
37
  
38
  
39if __name__ == "__main__":  
40    main()  
41
  

```

##### Returns

- result: PNGetAllUUIDMetadataResult
- status: PNStatus

PNGetAllUUIDMetadataResult:
- data: list of UUID metadata dicts
- status: PNStatus

UUID metadata keys:
- id, name, externalId, profileUrl, email, custom, status, type

### Get user metadata

Fetch metadata for a single UUID.

#### Methods

```
`1pubnub.get_uuid_metadata() \  
2        .uuid(String) \  
3        .include_custom(Boolean)  
`
```

Parameters:
- uuid (String, default: pubnub.configuration.uuid) – UUID id; uses configured UUID if omitted.
- include_custom (Boolean, default: False)
- include_status (Boolean, default: True)
- include_type (Boolean, default: True)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.get_uuid_metadata() \  
2    .include_custom(True) \  
3    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_uuid_metadata() \  
5    .include_custom(True) \  
6    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1metadata = pubnub.get_uuid_metadata(include_custom=True).sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4metadata = pubnub.get_uuid_metadata(include_custom=True).pn_async(callback)  

```

##### Returns

- result: PNGetUUIDMetadataResult
- status: PNStatus

PNGetUUIDMetadataResult:
- data: UUID metadata dict
- status: PNStatus

UUID metadata keys:
- id, name, externalId, profileUrl, email, status, type, custom

### Set user metadata

Create or update metadata for a UUID. ETag can be used for concurrency control.

Note: Custom object updates overwrite existing custom data (partial updates unsupported).

#### Methods

```
`1pubnub.set_uuid_metadata() \  
2    .uuid(String) \  
3    .set_name(String) \  
4    .set_status(String) \  
5    .set_type(String) \  
6    .external_id(String) \  
7    .profile_url(String) \  
8    .email(String) \  
9    .custom(Dictionary) \  
10    .include_custom(Boolean) \  
11    .include_status(Boolean) \  
12    .include_type(Boolean) \  
13    .if_matches_etag(String)  
`
```

Parameters:
- uuid (String, default: pubnub.configuration.uuid)
- set_name (String) – Display name.
- set_status (String) – Max 50 chars.
- set_type (String) – Max 50 chars.
- external_id (String)
- profile_url (String)
- email (String)
- custom (Any) – Key-value pairs; filtering not supported on custom fields.
- include_custom (Boolean, default: False)
- include_status (Boolean, default: False)
- include_type (Boolean, default: False)
- if_matches_etag (String) – Use ETag from previous read; 412 if mismatch.

##### API limits

See REST API docs for max lengths.

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.set_uuid_metadata() \  
2    .include_custom(True) \  
3    .uuid("Some UUID") \  
4    .set_name("Some Name") \  
5    .set_status("Active") \  
6    .set_type("User") \  
7    .email("test@example.com") \  
8    .profile_url("http://example.com") \  
9    .external_id("1234567890") \  
10    .custom({"key1": "val1", "key2": "val2"}) \  
11    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_uuid_metadata() \  
5    .include_custom(True) \  
6    .uuid("Some UUID") \  
7    .set_name("Some Name") \  
8    .set_status("Active") \  
9    .set_type("User") \  
10    .email("test@example.com") \  
11    .profile_url("http://example.com") \  
12    .external_id("1234567890") \  
13    .custom({"key1": "val1", "key2": "val2"}) \  
14    pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.set_uuid_metadata(uuid="Some UUID",  
2                         name="Some Name",  
3                         status="Active", type="User",  
4                         email="test@example.com",  
5                         profile_url="http://example.com",  
6                         external_id="1234567890",  
7                         custom={"key1": "val1", "key2": "val2"}) \  
8    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_uuid_metadata(uuid="Some UUID",  
5                         name="Some Name",  
6                         status="Active", type="User",  
7                         email="test@example.com",  
8                         profile_url="http://example.com",  
9                         external_id="1234567890",  
10                         custom={"key1": "val1", "key2": "val2"}) \  
11    .pn_async(callback)  

```

##### Returns

PNSetUUIDMetadataResult:
- data: UUID metadata dict
- status: PNStatus

Keys: id, name, externalId, profileUrl, email, status, type, custom

### Remove user metadata

Delete metadata for the specified UUID.

#### Methods

```
`1pubnub.remove_uuid_metadata() \  
2    .uuid(String)  
`
```

Parameters:
- uuid (String, default: pubnub.configuration.uuid)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.remove_uuid_metadata() \  
2        .uuid("Some UUID").sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_uuid_metadata() \  
5        .uuid("Some UUID").pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.remove_uuid_metadata(uuid="Some UUID").sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_uuid_metadata(uuid="Some UUID").pn_async(callback)  

```

##### Returns

- result: PNRemoveUUIDMetadataResult
- status: PNStatus

PNRemoveUUIDMetadataResult:
- status: PNStatus

## Channel

Manage channel metadata: list, fetch, set, and remove.

### Get metadata for all channels

Paginated list of channel metadata with filter/sort options.

#### Methods

```
`1pubnub.get_all_channel_metadata() \  
2    .limit(Integer) \  
3    .page(PNPage) \  
4    .filter(String) \  
5    .sort(PNSortKey) \  
6    .include_total_count(Boolean) \  
7    .include_custom(Boolean) \  
8    .include_status(Boolean) \  
9    .include_type(Boolean)  
`
```

Parameters:
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort ([PNSortKey]) – id|name|updated asc|desc
- include_total_count (Boolean, default: False)
- include_custom (Boolean, default: False)
- include_status (Boolean, default: True)
- include_type (Boolean, default: True)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.get_all_channel_metadata() \  
2    .include_custom(True) \  
3    .limit(10) \  
4    .include_total_count(True) \  
5    .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
6    .page(None) \  
7    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_all_channel_metadata() \  
5    .include_custom(True) \  
6    .limit(10) \  
7    .include_total_count(True) \  
8    .sort(PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)) \  
9    .page(None) \  
10    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1metadata = pubnub.get_all_channel_metadata(limit=10,  
2                                           include_custom=True,  
3                                           include_total_count=True,  
4                                           sort=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]) \  
5    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_all_channel_metadata(limit=10,  
5                                include_custom=True,  
6                                include_total_count=True,  
7                                sort=[PNSortKey.asc(PNSortKeyValue.ID), PNSortKey.desc(PNSortKeyValue.UPDATED)]) \  
8    .pn_async(callback)  

```

#### Returns

- result: PNGetAllChannelMetadataResult
- status: PNStatus

PNGetAllChannelMetadataResult:
- data: list of channel metadata dicts
- status: PNStatus

Channel metadata keys: id, name, description, status, type, custom

### Get channel metadata

Fetch metadata for a single channel.

#### Methods

```
`1pubnub.get_channel_metadata() \  
2    .channel(String) \  
3    .include_custom(Boolean) \  
4    .include_status(Boolean) \  
5    .include_type(Boolean)  
`
```

Parameters:
- channel (str)
- include_custom (bool, default: False)
- include_status (Boolean, default: True)
- include_type (Boolean, default: True)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.get_channel_metadata() \  
2    .include_custom(True) \  
3    .channel("channel") \  
4    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_channel_metadata() \  
5    .include_custom(True) \  
6    .channel("channel") \  
7    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.get_channel_metadata(channel="channel", include_custom=True).sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_channel_metadata(channel="channel", include_custom=True).pn_async(callback)  

```

##### Returns

- result: PNGetChannelMetadataResult
- status: PNStatus

PNGetChannelMetadataResult:
- data: channel metadata dict
- status: PNStatus

Channel metadata keys: id, name, description, status, type, custom

### Set channel metadata

Create or update metadata for a channel. ETag can be used for concurrency control.

Note: Custom object updates overwrite existing custom data (partial updates unsupported).

#### Methods

```
`1pubnub.set_channel_metadata() \  
2    .channel(String) \  
3    .set_name(String) \  
4    .set_status(String) \  
5    .set_type(String) \  
6    .description(String) \  
7    .custom(Dictionary) \  
8    .include_custom(Boolean) \  
9    .include_status(Boolean) \  
10    .include_type(Boolean) \  
11    .if_matches_etag(String)  
`
```

Parameters:
- channel (String)
- set_name (String)
- set_status (String, max 50)
- set_type (String, max 50)
- description (String)
- custom (Map<String, Object>)
- include_custom (Boolean, default: False)
- include_status (Boolean, default: False)
- include_type (Boolean, default: False)
- if_matches_etag (String) – use ETag; 412 if mismatch

##### API limits

See REST API docs for max lengths.

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.set_channel_metadata() \  
2    .include_custom(True) \  
3    .channel("channel id") \  
4    .set_name("Channel Name") \  
5    .set_status("Archived") \  
6    .set_type("Archived") \  
7    .description("Description") \  
8    .custom({ "key1": "val1", "key2": "val2" }) \  
9    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_channel_metadata() \  
5    .include_custom(True) \  
6    .channel("channel id") \  
7    .set_name("Channel Name") \  
8    .set_status("Archived") \  
9    .set_type("Archived") \  
10    .description("Description") \  
11    .custom({ "key1": "val1", "key2": "val2" }) \  
12    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.set_channel_metadata(channel="channel id",  
2                            name="Channel Name",  
3                            status="Archived",  
4                            type="Archived",  
5                            description="Description",  
6                            custom={ "key1": "val1", "key2": "val2" },  
7                            include_custom=True) \  
8    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_channel_metadata(channel="channel id",  
5                            name="Channel Name",  
6                            status="Archived",  
7                            type="Archived",  
8                            description="Description",  
9                            custom={ "key1": "val1", "key2": "val2" },  
10                            include_custom=True) \  
11    .pn_async(callback)  

```

##### Returns

- result: PNSetChannelMetadataResult
- status: PNStatus

PNSetChannelMetadataResult:
- data: channel metadata dict
- status: PNStatus

Keys: id, name, description, status, type, custom

#### Other examples

```
1
  

```

### Remove channel metadata

Delete metadata for the specified channel.

#### Methods

```
`1pubnub.remove_channel_metadata() \  
2    .channel(String)  
`
```

Parameters:
- channel (String)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.remove_channel_metadata() \  
2    .channel("channel id") \  
3    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_channel_metadata() \  
5    .channel("channel id") \  
6    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.remove_channel_metadata(channel="channel id").sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_channel_metadata(channel="channel id").pn_async(callback)  

```

##### Returns

- result: PNRemoveChannelMetadataResult
- status: PNStatus

PNRemoveChannelMetadataResult:
- status: PNStatus

## Channel memberships

Manage channels a UUID belongs to.

### Get channel memberships

List channel memberships for a UUID (not subscriptions).

#### Methods

```
`1pubnub.get_memberships() \  
2    .uuid(String) \  
3    .limit(Integer) \  
4    .page(PNPage Object) \  
5    .filter(String) \  
6    .sort(* PNSortKey Object) \  
7    .include(MembershipIncludes)  
`
```

Parameters:
- uuid (String, default: pubnub.configuration.uuid)
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey) – id|name|updated asc|desc
- include (MembershipIncludes):
  - total_count (Boolean, default: False)
  - custom (Boolean, default: False)
  - status (Boolean, default: False)
  - type (Boolean, default: False)
  - channel (Boolean, default: False)
  - channel_custom (Boolean, default: False)
  - channel_type (Boolean, default: False)
  - channel_status (Boolean, default: False)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.get_memberships() \  
2    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
3    .uuid("Some UUID").sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_memberships() \  
5    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
6    .uuid("Some UUID").pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.get_memberships(uuid="Some UUID",  
2                       include=MembershipIncludes(custom=True, channel=True, channel_custom=True))  
3    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_memberships(uuid="Some UUID",  
5                       include=.MembershipIncludes(custom=True, channel=True, channel_custom=True))  
6    .pn_async(callback)  

```

##### Returns

- result: PNGetMembershipsResult
- status: PNStatus

PNGetMembershipsResult:
- data: list of membership dicts
- status: PNStatus
- total_count (int, when requested)
- prev (PNPage.Previous)
- next (PNPage.Next)

Membership keys: channel (dict: id, name, description, custom), custom

### Set channel memberships

Replace/add memberships for a UUID.

#### Methods

```
`1pubnub.set_memberships() \  
2    .channel_memberships([PNChannelMembership]) \  
3    .uuid(String) \  
4    .limit(Integer) \  
5    .page(PNPage) \  
6    .filter(String) \  
7    .sort(* PNSort Object) \  
8    .include(MembershipIncludes)  
`
```

Parameters:
- channelMemberships ([PNChannelMembership]) – collection to add
- uuid (String, default: pubnub.configuration.uuid)
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey) – id|name|updated asc|desc
- include (MembershipIncludes) – same options as above

##### API limits

See REST API docs for max lengths.

#### Sample code

Synchronous (Builder Pattern):

```
1some_channel = "somechannel"  
2some_channel_with_custom = "somechannel_with_custom"  
3
  
4pubnub.set_channel_metadata() \  
5    .channel(some_channel) \  
6    .set_name("some name") \  
7    .sync()  
8
  
9custom_1 = {  
10    "key3": "val1",  
11    "key4": "val2",  
12}  
13
  
14pubnub.set_channel_metadata() \  
15    .channel(some_channel_with_custom) \  
16    .set_name("some name with custom") \  
17    .custom(custom_1) \  
18    .sync()  
19
  
20custom_2 = {  
21    "key5": "val1",  
22    "key6": "val2",  
23}  
24
  
25channel_memberships_to_set = [  
26    PNChannelMembership.channel(some_channel),  
27    PNChannelMembership.channel_with_custom(some_channel_with_custom, custom_2),  
28]  
29
  
30pubnub.set_memberships() \  
31    .uuid("some-uuid") \  
32    .channel_memberships(channel_memberships_to_set) \  
33    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
34    .sync()  

```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4some_channel = "somechannel"  
5some_channel_with_custom = "somechannel_with_custom"  
6
  
7pubnub.set_channel_metadata() \  
8    .channel(some_channel) \  
9    .set_name("some name") \  
10    .sync()  
11
  
12custom_1 = {  
13    "key3": "val1",  
14    "key4": "val2"  
15}  
16
  
17pubnub.set_channel_metadata() \  
18    .channel(some_channel_with_custom) \  
19    .set_name("some name with custom") \  
20    .custom(custom_1) \  
21    .sync()  
22
  
23custom_2 = {  
24    "key5": "val1",  
25    "key6": "val2",  
26}  
27
  
28channel_memberships_to_set = [  
29    PNChannelMembership.channel(some_channel),  
30    PNChannelMembership.channel_with_custom(some_channel_with_custom, custom_2),  
31]  
32
  
33pubnub.set_memberships() \  
34    .uuid("some-uuid") \  
35    .channel_memberships(channel_memberships_to_set) \  
36    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
37    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
1some_channel = "somechannel"  
2some_channel_with_custom = "somechannel_with_custom"  
3
  
4pubnub.set_channel_metadata(channel=some_channel, name="some name").sync()  
5
  
6custom_1 = {  
7    "key3": "val1",  
8    "key4": "val2",  
9}  
10
  
11pubnub.set_channel_metadata(channel=some_channel_with_custom,  
12                            name="some name with custom",  
13                            custom=custom_1) \  
14    .sync()  
15
  
16custom_2 = {  
17    "key5": "val1",  
18    "key6": "val2",  
19}  
20
  
21channel_memberships_to_set = [  
22    PNChannelMembership.channel(some_channel),  
23    PNChannelMembership.channel_with_custom(some_channel_with_custom, custom_2),  
24]  
25
  
26pubnub.set_memberships(uuid="some-uuid",  
27                       channel_memberships=channel_memberships_to_set,  
28                       include(MembershipIncludes(custom=True, channel=True, channel_custom=True))) \  
29    .sync()  

```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4some_channel = "somechannel"  
5some_channel_with_custom = "somechannel_with_custom"  
6
  
7pubnub.set_channel_metadata(channel=some_channel, name="some name").pn_async(callback)  
8
  
9custom_1 = {  
10    "key3": "val1",  
11    "key4": "val2"  
12}  
13
  
14pubnub.set_channel_metadata(channel=some_channel_with_custom,  
15                            name="some name with custom",  
16                            custom=custom_1) \  
17    .pn_async(callback)  
18
  
19custom_2 = {  
20    "key5": "val1",  
21    "key6": "val2",  
22}  
23
  
24channel_memberships_to_set = [  
25    PNChannelMembership.channel(some_channel),  
26    PNChannelMembership.channel_with_custom(some_channel_with_custom, custom_2),  
27]  
28
  
29pubnub.set_memberships(uuid="some-uuid",  
30                       channel_memberships=channel_memberships_to_set,  
31                       include(MembershipIncludes(custom=True, channel=True, channel_custom=True))) \  
32    .pn_async(callback)  

```

##### Returns

- result: PNSetMembershipsResult
- status: PNStatus

PNSetMembershipsResult:
- data: list of membership dicts
- status: PNStatus
- total_count, prev, next

Membership keys: channel (dict), custom

### Remove channel memberships

Remove memberships for a UUID.

#### Methods

```
`1pubnub.remove_memberships() \  
2    .channel_memberships([PNChannelMembership]) \  
3    .uuid(String) \  
4    .limit(Integer) \  
5    .page(PNPage) \  
6    .filter(String) \  
7    .sort(* PNSort) \  
8    .include_total_count(Boolean) \  
9    .include_custom(Boolean) \  
10    .include_channel(Integer)  
`
```

Parameters:
- channel_memberships ([PNChannelMembership]) – list to remove
- uuid (String, default: pubnub.configuration.uuid)
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey) – id|name|updated asc|desc
- include_total_count (Boolean, default: False)
- include_custom (Boolean, default: False)
- include_channel (Integer) – ChannelIncludeEndpoint.CHANNEL or CHANNEL_WITH_CUSTOM

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.remove_memberships() \  
2    .uuid("some_uuid") \  
3    .channel_memberships([PNChannelMembership.channel(some_channel)]) \  
4    .include_custom(True) \  
5    .include_channel(ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM) \  
6    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_memberships() \  
5    .uuid("some_uuid") \  
6    .channel_memberships([PNChannelMembership.channel(some_channel)]) \  
7    .include_custom(True) \  
8    .include_channel(ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM) \  
9    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.remove_memberships(uuid="some_uuid",  
2                          channel_memberships=[PNChannelMembership.channel(some_channel)],  
3                          include_channel=ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM  
4                          include_custom=True) \  
5    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_memberships(uuid="some_uuid",  
5                          channel_memberships=[PNChannelMembership.channel(some_channel)],  
6                          include_channel=ChannelIncludeEndpoint.CHANNEL_WITH_CUSTOM  
7                          include_custom=True) \  
8    .pn_async(callback)  

```

##### Returns

- result: PNRemoveMembershipsResult
- status: PNStatus

PNRemoveMembershipsResult:
- data: list of membership dicts
- status: PNStatus
- total_count, prev, next

Membership keys: channel (dict), custom

### Manage channel memberships

Add and remove memberships for a UUID in one request.

#### Methods

```
`1pubnub.manage_memberships() \  
2    .uuid(String) \  
3    .set([PNChannelMembership>]) \  
4    .remove([PNChannelMembership]) \  
5    .limit(Integer) \  
6    .page(PNPage) \  
7    .filter(String) \  
8    .sort(* PNSortKey) \  
9    .include(MembershipIncludes)  
`
```

Parameters:
- uuid (String, default: pubnub.configuration.uuid)
- set ([PNChannelMembership]) – add
- remove ([PNChannelMembership]) – remove
- limit (Integer, default: 100)
- page (PNPage, default: null)
- filter (String, default: null)
- sort (PNSortKey)
- include (MembershipIncludes) – same options as Get Memberships

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.manage_memberships() \  
2    .uuid("some_uuid") \  
3    .set([PNChannelMembership.channel(some_channel)]) \  
4    .remove([PNChannelMembership.channel(some_channel_with_custom)]) \  
5    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
6    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.manage_memberships() \  
5    .uuid("some_uuid") \  
6    .set([PNChannelMembership.channel(some_channel)]) \  
7    .remove([PNChannelMembership.channel(some_channel_with_custom)]) \  
8    .include(MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
9    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.manage_memberships(uuid="some_uuid",  
2                          set=[PNChannelMembership.channel(some_channel)],  
3                          remove=[PNChannelMembership.channel(some_channel_with_custom)],  
4                          include=MembershipIncludes(custom=True, channel=True, channel_custom=True)) \  
5    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.manage_memberships(uuid="some_uuid",  
5                          set=[PNChannelMembership.channel(some_channel)],  
6                          remove=[PNChannelMembership.channel(some_channel_with_custom)],  
7                          include=MembershipIncludes(custom=True, channel=True, channel_custom=True))  
8    .pn_async(callback)  

```

##### Returns

- result: PNManageMembershipsResult
- status: PNStatus

PNManageMembershipsResult:
- data: list of membership dicts
- status: PNStatus
- total_count, prev, next

Membership keys: channel (dict), custom

## Channel members

Manage the users in a channel.

### Get channel members

List users in a channel; optionally include user metadata.

#### Methods

```
`1pubnub.get_channel_members() \  
2    .channel(String) \  
3    .limit(Integer) \  
4    .page(PNPage) \  
5    .filter(String) \  
6    .sort(* PNSortKey) \  
7    .include(MemberIncludes)  
`
```

Parameters:
- channel (String)
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey) – id|name|updated asc|desc
- include (MemberIncludes):
  - total_count, custom, status, type, user, user_custom, user_type, user_status (all Boolean, default: False)

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.get_channel_members() \  
2    .channel("channel") \  
3    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
4    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_channel_members() \  
5    .channel("channel") \  
6    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
7    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.get_channel_members(channel="channel",  
2                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
3    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.get_channel_members(channel="channel",  
5                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
6    .pn_async(callback)  

```

#### Returns

- result: PNManageMembershipsResult
- status: PNStatus

PNGetChannelMembersResult:
- data: list of channel member dicts
- status: PNStatus
- total_count, prev, next

Member keys: uuid (dict: id, name, email, externalId, profileUrl, custom), custom

### Set channel members

Set users in a channel.

#### Methods

```
`1pubnub.set_channel_members() \  
2    .channel(String) \  
3    .uuids([PNUUID object]) \  
4    .limit(Integer) \  
5    .page(PNPage) \  
6    .filter(String) \  
7    .sort(* PNSortKey) \  
8    .include(MemberIncludes)  
`
```

Parameters:
- channel (String)
- uuids ([PNUUID]) – members to add
- limit (Integer, default: 100)
- page (PNPage, default: null)
- filter (String, default: null)
- sort (PNSortKey)
- include (MemberIncludes) – same as above

##### API limits

See REST API docs for max lengths.

#### Sample code

Synchronous (Builder Pattern):

```
1pubnub.set_uuid_metadata() \  
2    .uuid("some_uuid") \  
3    .set_name("some name") \  
4    .sync()  
5
  
6custom_1 = {  
7    "key3": "val1",  
8    "key4": "val2"  
9}  
10
  
11pubnub.set_uuid_metadata() \  
12    .uuid("some_uuid_with_custom") \  
13    .set_name("some name with custom") \  
14    .custom(custom_1) \  
15    .sync()  
16
  
17uuids_to_set = [  
18    PNUUID.uuid("some_uuid"),  
19    PNUUID.uuid_with_custom("some_uuid_with_custom", custom_2)  
20]  
21
  
22pubnub.set_channel_members() \  
23    .channel("channel id") \  
24    .uuids(uuids_to_set) \  
25    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
26    .sync()  

```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_uuid_metadata() \  
5    .uuid("some_uuid") \  
6    .set_name("some name") \  
7    .sync()  
8
  
9custom_1 = {  
10    "key3": "val1",  
11    "key4": "val2"  
12}  
13
  
14pubnub.set_uuid_metadata() \  
15    .uuid("some_uuid_with_custom") \  
16    .set_name("some name with custom") \  
17    .custom(custom_1) \  
18    .sync()  
19
  
20uuids_to_set = [  
21    PNUUID.uuid("some_uuid"),  
22    PNUUID.uuid_with_custom("some_uuid_with_custom", custom_2)  
23]  
24
  
25pubnub.set_channel_members() \  
26    .channel("channel id") \  
27    .uuids(uuids_to_set) \  
28    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
29    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
1pubnub.set_uuid_metadata(uuid=some_uuid, name="some name").sync()  
2
  
3custom_1 = {  
4    "key3": "val1",  
5    "key4": "val2"  
6}  
7
  
8pubnub.set_uuid_metadata(uuid=some_uuid_with_custom,  
9                         name="some name with custom",  
10                         custom=custom_1) \  
11    .sync()  
12
  
13uuids_to_set = [  
14    PNUUID.uuid(some_uuid),  
15    PNUUID.uuid_with_custom(some_uuid_with_custom, custom_2)  
16]  
17
  
18pubnub.set_channel_members(channel="channel id",  
19                           uuids=uuids_to_set,  
20                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
21    .sync()  

```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.set_uuid_metadata(uuid=some_uuid, name="some name").sync().sync()  
5
  
6custom_1 = {  
7    "key3": "val1",  
8    "key4": "val2"  
9}  
10
  
11pubnub.set_uuid_metadata(uuid=some_uuid_with_custom,  
12                         name="some name with custom",  
13                         custom=custom_1) \  
14    .sync()  
15
  
16uuids_to_set = [  
17    PNUUID.uuid(some_uuid),  
18    PNUUID.uuid_with_custom(some_uuid_with_custom, custom_2)  
19]  
20
  
21pubnub.set_channel_members(channel="channel id",  
22                           uuids=uuids_to_set,  
23                           include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
24    .pn_async(callback)  

```

#### Returns

- result: PNSetChannelMembersResult
- status: PNStatus

PNSetChannelMembersResult:
- data: list of channel member dicts
- status: PNStatus
- total_count, prev, next

Member keys: uuid (dict), custom

### Remove channel members

Remove users from a channel.

#### Methods

```
`1pubnub.remove_channel_members() \  
2    .channel(String) \  
3    .uuids([PNUUID]) \  
4    .limit(Integer) \  
5    .page(PNPage) \  
6    .filter(String) \  
7    .sort(* PNSortKey) \  
8    .include_total_count(Boolean) \  
9    .include_custom(Boolean) \  
10    .includeUUID(Integer)  
`
```

Parameters:
- channel (String)
- uuids ([PNUUID]) – list to remove
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey)
- include_total_count (Boolean, default: False)
- include_custom (Boolean, default: False)
- include_uuid (Integer) – UUIDIncludeEndpoint.UUID or UUID_WITH_CUSTOM

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.remove_channel_members() \  
2    .channel("channel id") \  
3    .uuids([PNUUID.uuid(some_uuid)]) \  
4    .include_custom(True) \  
5    .include_uuid(UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
6    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_channel_members() \  
5    .channel("channel id") \  
6    .uuids([PNUUID.uuid(some_uuid)]) \  
7    .include_custom(True) \  
8    .include_uuid(UUIDIncludeEndpoint.UUID_WITH_CUSTOM).pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.remove_channel_members(channel="channel id",  
2                              uuids=[PNUUID.uuid(some_uuid)],  
3                              include_custom=True,  
4                              include_uuid=UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
5    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.remove_channel_members(channel="channel id",  
5                              uuids=[PNUUID.uuid(some_uuid)],  
6                              include_custom=True,  
7                              include_uuid=UUIDIncludeEndpoint.UUID_WITH_CUSTOM) \  
8    .pn_async(callback)  
9
  

```

#### Returns

- result: PNRemoveChannelMembersResult
- status: PNStatus

PNRemoveChannelMembersResult:
- data: list of channel member dicts
- status: PNStatus
- total_count, prev, next

Member keys: uuid (dict), custom

### Manage channel members

Add and remove users in a channel in one request.

#### Methods

```
`1pubnub.manage_channel_members() \  
2    .channel(String) \  
3    .set([PNUUID]) \  
4    .remove([PNUUID]) \  
5    .limit(Integer) \  
6    .page(PNPage) \  
7    .filter(String) \  
8    .sort(* PNSortKey) \  
9    .include(MemberIncludes)  
`
```

Parameters:
- channel (String)
- set ([PNUUID]) – add members
- remove ([PNUUID]) – remove members
- limit (Integer, default: 100)
- page (PNPage)
- filter (String)
- sort (PNSortKey)
- include (MemberIncludes) – same as Get channel members

#### Sample code

Synchronous (Builder Pattern):

```
`1pubnub.manage_channel_members() \  
2    .channel("channel id") \  
3    .set([PNUUID.uuid(some_uuid)]) \  
4    .remove([PNUUID.uuid(some_uuid_with_custom)]) \  
5    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
6    .sync()  
`
```

Asynchronous (Builder Pattern):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.manage_channel_members() \  
5    .channel("channel id") \  
6    .set([PNUUID.uuid(some_uuid)]) \  
7    .remove([PNUUID.uuid(some_uuid_with_custom)]) \  
8    .include(MemberIncludes(custom=True, channel=True, user_custom=True)) \  
9    .pn_async(callback)  

```

Synchronous (Named Arguments):

```
`1pubnub.manage_channel_members(channel="channel id",  
2                              set=[PNUUID.uuid(some_uuid)],  
3                              remove=[PNUUID.uuid(some_uuid_with_custom)],  
4                              include=MemberIncludes(custom=True, channel=True, user_custom=True)) \  
5    .sync()  
`
```

Asynchronous (Named Arguments):

```
1def callback(response, status):  
2    pass  
3
  
4pubnub.manage_channel_members(channel="channel id",  
5                              set=[PNUUID.uuid(some_uuid)],  
6                              remove=[PNUUID.uuid(some_uuid_with_custom)],  
7                              include=MemberIncludes(custom=True, channel=True, user_custom=True))  
8    .pn_async(callback)  

```

#### Returns

- result: PNManageChannelMembersResult
- status: PNStatus

PNManageChannelMembersResult:
- data: list of channel member dicts
- status: PNStatus
- total_count, prev, next

Member keys: uuid (dict), custom

## PNChannelMembership class

Utility class to build membership payloads.

```
1class PNChannelMembership:  
2    __metaclass__ = ABCMeta  
3
  
4    def __init__(self, channel):  
5        self._channel = channel  
6
  
7    @staticmethod  
8    def channel(channel):  
9        return JustChannel(channel)  
10
  
11    @staticmethod  
12    def channel_with_custom(channel, custom):  
13        return ChannelWithCustom(channel, custom)  
14
  
15
  
16class JustChannel(PNChannelMembership):  
17    def __init__(self, channel):  
18        PNChannelMembership.__init__(self, channel)  
19
  
20
  
21class ChannelWithCustom(PNChannelMembership):  
22    def __init__(self, channel, custom):  
23        PNChannelMembership.__init__(self, channel)  
24        self._custom = custom  

```

## PNUUID class

Utility class to build UUID payloads.

```
1class PNUUID:  
2    __metaclass__ = ABCMeta  
3
  
4    def __init__(self, uuid):  
5        self._uuid = uuid  
6
  
7    @staticmethod  
8    def uuid(uuid):  
9        return JustUUID(uuid)  
10
  
11    @staticmethod  
12    def uuid_with_custom(uuid, custom):  
13        return UUIDWithCustom(uuid, custom)  
14
  
15
  
16class JustUUID(PNUUID):  
17    def __init__(self, uuid, custom):  
18        PNUUID.__init__(self, uuid)  
19
  
20
**21class UUIDWithCustom(PNUUID):  
22    def __init__(self, uuid, custom):  
23        PNUUID.__init__(self, uuid)  
24        self._custom = custom  

```