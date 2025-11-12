# App Context API for Unity SDK (Summary)

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. Changes to object data (set, updated, removed) trigger real-time events; setting identical data doesn’t trigger events. To upgrade from Objects v1, see the migration guide.

## User

Manage UUID metadata: list, fetch, set, and remove. Include only needed fields to reduce payload.

### Get metadata for all users

Methods

```
`1pubnub.GetAllUuidMetadata()  
2    .IncludeCustom(bool)  
3    .IncludeCount(bool)  
4    .Page(PNPageObject)  
5    .Sort(Liststring>)  
6    .Filter(string)  
7    .Limit(int)  
8    .Execute(System.ActionPNGetAllUuidMetadataResult, PNStatus>)  
`
```

Parameters
- IncludeCustom (bool): Include Custom in response.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects. Default/Max: 100.
- Execute (System.Action of PNGetAllUuidMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNGetAllUuidMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Uuids": [  
3        {  
4            "Uuid": "uuid-1",  
5            "Name": "John Doe",  
6            "Email": "jack@twitter.com",  
7            "ExternalId": null,  
8            "ProfileUrl": null,  
9            "Custom": null,  
10            "Updated": "2020-06-17T16:28:14.060718Z"  
11        },  
12        {  
13            "Uuid": "uuid-2",  
14            "Name": "Bob Cat",  
15            "Email": "bobc@example.com",  
16            "ExternalId": null,  
17            "ProfileUrl": null,  
18            "Custom": {  
19                "phone": "999-999-9999"  
20            },  
21            "Updated": "2020-06-17T16:42:22.906768Z"  
22        }  
23    ],  
24    "TotalCount": 2,  
25    "Page": {  
26        "Next": "MTI",  
27        "Prev": ""  
28    }  
29}  
`
```

### Get user metadata

Methods

```
`1pubnub.GetUuidMetadata()  
2    .Uuid(string)  
3    .IncludeCustom(bool)  
4    .Execute(System.ActionPNGetUuidMetadataResult, PNStatus>)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- IncludeCustom (bool): Include Custom in response.
- Execute (System.Action of PNGetUuidMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNGetUuidMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Uuid": "uuid-1",  
3    "Name": "John Doe",  
4    "Email": "jack@twitter.com",  
5    "ExternalId": null,  
6    "ProfileUrl": null,  
7    "Custom": null,  
8    "Updated": "2020-06-17T16:28:14.060718Z"  
9}  
`
```

### Set user metadata

Note: Partial updates of Custom are not supported. Setting Custom overwrites the stored value. To add to existing custom data: fetch current metadata, merge client-side, then set.

Methods

```
`1pubnub.SetUuidMetadata()  
2    .Uuid(string)  
3    .Name(string)  
4    .Email(string)  
5    .ExternalId(string)  
6    .ProfileUrl(string)  
7    .Custom(Dictionarystring, object>)  
8    .IncludeCustom(bool)  
9    .IfMatchesEtag(string)  
10    .Execute(System.ActionPNSetUuidMetadataResult, PNStatus>)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- Name (string): Display name.
- Email (string): User’s email.
- ExternalId (string): External system ID.
- ProfileUrl (string): Profile picture URL.
- Custom (Dictionary<string, object>): Custom JSON values (strings, numbers, booleans). App Context filtering doesn’t support filtering by custom properties.
- IfMatchesEtag (string): Use eTag from a get call to ensure conditional updates. If mismatched, HTTP 412 is returned.
- IncludeCustom (bool): Include Custom in response.
- Execute (System.Action of PNSetUuidMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNSetUuidMetadataResult>>.

API limits: See REST API docs.

Sample code

```
1
  

```

Response

```
`1{  
2    "Uuid": "uuid-1",  
3    "Name": "John Doe",  
4    "Email": "jack@twitter.com",  
5    "ExternalId": null,  
6    "ProfileUrl": null,  
7    "Custom": null,  
8    "Updated": "2020-06-17T16:28:14.060718Z"  
9}  
`
```

### Remove user metadata

Methods

```
`1pubnub.RemoveUuidMetadata()  
2    .Uuid(string)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- Execute (System.Action of PNRemoveUuidMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNRemoveUuidMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{}  
`
```

## Channel

Manage channel metadata: list, fetch, set, and remove.

### Get metadata for all channels

Methods

```
`1pubnub.GetAllChannelMetadata()  
2    .IncludeCustom(bool)  
3    .IncludeCount(bool)  
4    .Page(PNPageObject)  
5    .Sort(Liststring>)  
6    .Filter(string)  
7    .Execute(System.ActionPNGetAllChannelMetadataResult, PNStatus>)  
`
```

Parameters
- IncludeCustom (bool): Include Custom in response.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Execute (System.Action of PNGetAllChannelMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNGetAllChannelMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Channels": [  
3        {  
4            "Channel": "my-channel",  
5            "Name": "My channel",  
6            "Description": "A channel that is mine",  
7            "Custom": null,  
8            "Updated": "2020-06-17T16:52:19.562469Z"  
9        },  
10        {  
11            "Channel": "main",  
12            "Name": "Main channel",  
13            "Description": "The main channel",  
14            "Custom": {  
15                "public": true,  
16                "motd": "Always check your spelling!"  
17            },  
18            "Updated": "2020-06-17T16:52:19.562469Z"  
19        }  
20    ],  
21    "TotalCount": 2,  
22    "Page": {  
23        "Next": "MTE",  
24        "Prev": ""  
25    }  
26}  
`
```

### Get channel metadata

Methods

```
`1pubnub.GetChannelMetadata()  
2    .Channel(string)  
3    .IncludeCustom(bool)  
`
```

Parameters
- Channel (string): Channel name.
- IncludeCustom (bool): Include Custom in response.
- Execute (System.Action of PNGetChannelMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNGetChannelMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "My channel",  
4    "Description": "A channel that is mine",  
5    "Custom": null,  
6    "Updated": "2020-06-17T16:52:19.562469Z"  
7}  
`
```

### Set channel metadata

Note: Partial updates of Custom are not supported; setting Custom overwrites existing data. To add to existing data, fetch, merge client-side, then set. Use eTag to avoid overwriting concurrent updates.

Methods

```
`1pubnub.SetChannelMetadata()  
2    .Channel(string)  
3    .Name(string)  
4    .Description(string)  
5    .Custom(Dictionarystring, object>)  
6    .IncludeCustom(bool)  
7    .IfMatchesEtag(string)  
8    .Execute(System.ActionPNSetChannelMetadataResult, PNStatus>)  
`
```

Parameters
- Channel (string): Channel name.
- Name (string): Channel name.
- Description (string): Channel description.
- Custom (Dictionary<string, object>): Custom JSON values (strings, numbers, booleans). App Context filtering doesn’t support filtering by custom properties.
- IncludeCustom (bool): Include Custom in response.
- IfMatchesEtag (string): Conditional update via eTag; mismatches return HTTP 412.
- Execute (System.Action of PNSetChannelMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNSetChannelMetadataResult>>.

API limits: See REST API docs.

Sample code

```
1
  

```

Response

```
`1{  
2    "Channel": "my-channel",  
3    "Name": "John Doe",  
4    "Description": "sample description",  
5    "Custom": {  
6        "color": "blue"  
7    },  
8    "Updated": "2020-06-17T16:52:19.562469Z"  
9}  
`
```

Other examples

Iteratively update existing metadata

```
1
  

```

### Remove channel metadata

Methods

```
`1pubnub.RemoveChannelMetadata()  
2    .Channel(string)  
`
```

Parameters
- Channel (string): Channel name.
- Execute (System.Action of PNRemoveChannelMetadataResult)
- ExecuteAsync: Returns Task<PNResult<PNRemoveChannelMetadataResult>>.

Sample code

```
1
  

```

Response

```
`1{}  
`
```

## Channel memberships

Manage the channels a UUID belongs to.

### Get channel memberships

Methods

```
`1pubnub.GetMemberships()  
2    .Uuid(string)  
3    .Include(PNMembershipField[])  
4    .IncludeCount(bool)  
5    .Page(PNPageObject)  
6    .Execute(System.ActionPNGetMembershipsResult, PNStatus>)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Execute (System.Action of PNGetMembershipsResult)
- ExecuteAsync: Returns Task<PNResult<PNGetMembershipsResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Memberships": [  
3        {  
4            "ChannelMetadata": {  
5                "Channel": "my-channel",  
6                "Name": "My channel",  
7                "Description": "A channel that is mine",  
8                "Custom": null,  
9                "Updated": "2020-06-17T16:55:44.632042Z"  
10            },  
11            "Custom": {  
12                "starred": false  
13            },  
14            "Updated": "2020-06-17T17:05:25.987964Z"  
15        },  
16        {  
17            "ChannelMetadata": {  
18                "Channel": "main",  
19                "Name": "Main channel",  
20                "Description": "The main channel",  
21                "Custom": {  
22                    "public": true,  
23                    "motd": "Always check your spelling!"  
24                },  
25                "Updated": "2020-06-17T16:55:44.632042Z"  
26            },  
27            "Custom": {  
28                "item": "book"  
29            },  
30            "Updated": "2020-06-17T17:05:25.987964Z"  
31        }  
32    ],  
33    "TotalCount": 2,  
34    "Page": {  
35        "Next": "MQ",  
36        "Prev": ""  
37    }  
38}  
`
```

### Set channel memberships

Replace or add memberships for a UUID.

Methods

```
`1pubnub.SetMemberships()  
2    .Uuid(string)  
3    .Channels(ListPNMembership>)  
4    .Include(PNMembershipField[])  
5    .IncludeCount(bool)  
6    .Page(PNPageObject)  
7    .Sort(Liststring>)  
8    .Filter(string)  
9    .Limit(int)  
10    .Execute(System.ActionPNMembershipsResult, PNStatus>)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- Channels (List<PNMembership>): Memberships to set. Accepts channel names or PNMembership objects with optional custom data.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Default/Max: 100.
- Execute (System.Action of PNMembershipsResult)
- ExecuteAsync: Returns Task<PNResult<PNMembershipsResult>>.

API limits: See REST API docs.

PNMembership

- Channel (string): Channel name for this membership.
- Custom (Dictionary<string, object>): Custom metadata for the membership.
- Status (string): Membership status, e.g., "active" or "inactive".
- Type (string): Membership type for categorization.

Sample code

```
1
  

```

Response

```
`1{  
2    "Memberships": [  
3        {  
4            "ChannelMetadata": {  
5                "Channel": "my-channel",  
6                "Name": "My channel",  
7                "Description": "A channel that is mine",  
8                "Custom": null,  
9                "Updated": "2020-06-17T16:55:44.632042Z"  
10            },  
11            "Custom": {  
12                "starred": false  
13            },  
14            "Updated": "2020-06-17T17:05:25.987964Z"  
15        },  
16        {  
17            "ChannelMetadata": {  
18                "Channel": "main",  
19                "Name": "Main channel",  
20                "Description": "The main channel",  
21                "Custom": {  
22                    "public": true,  
23                    "motd": "Always check your spelling!"  
24                },  
25                "Updated": "2020-06-17T16:55:44.632042Z"  
26            },  
27            "Custom": {  
28                "item": "book"  
29            },  
30            "Updated": "2020-06-17T17:05:25.987964Z"  
31        }  
32    ],  
33    "TotalCount": 2,  
34    "Page": {  
35        "Next": "MQ",  
36        "Prev": ""  
37    }  
38}  
`
```

### Remove channel memberships

Remove memberships for a UUID.

Methods

```
`1pubnub.RemoveMemberships()  
2    .Uuid(string)  
3    .Channels(Liststring>)  
4    .Include(PNMembershipField[])  
5    .IncludeCount(bool)  
6    .Page(PNPageObject)  
7    .Sort(Liststring>)  
8    .Filter(string)  
9    .Limit(int)  
10    .Execute(System.ActionPNMembershipsResult, PNStatus>)  
`
```

Parameters
- Uuid (String): Unique user identifier. If not supplied, current user's Uuid is used.
- Channels (List<string>): Channels to remove from membership.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Default/Max: 100.
- Execute (System.Action of PNMembershipsResult)
- ExecuteAsync: Returns Task<PNResult<PNMembershipsResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Memberships": [  
3        {  
4            "ChannelMetadata": {  
5                "Channel": "my-channel",  
6                "Name": "My channel",  
7                "Description": "A channel that is mine",  
8                "Custom": null,  
9                "Updated": "2020-06-17T16:55:44.632042Z"  
10            },  
11            "Custom": {  
12                "starred": false  
13            },  
14            "Updated": "2020-06-17T17:05:25.987964Z"  
15        },  
16        {  
17            "ChannelMetadata": {  
18                "Channel": "main",  
19                "Name": "Main channel",  
20                "Description": "The main channel",  
21                "Custom": {  
22                    "public": true,  
23                    "motd": "Always check your spelling!"  
24                },  
25                "Updated": "2020-06-17T16:55:44.632042Z"  
26            },  
27            "Custom": {  
28                "item": "book"  
29            },  
30            "Updated": "2020-06-17T17:05:25.987964Z"  
31        }  
32    ],  
33    "TotalCount": 2,  
34    "Page": {  
35        "Next": "MQ",  
36        "Prev": ""  
37    }  
38}  
`
```

### Manage channel memberships

Add and remove memberships for a UUID in one request.

Methods

```
`1pubnub.ManageMemberships()  
2    .Uuid(string)  
3    .Set(ListPNMembership>)  
4    .Remove(Liststring>)  
5    .Include(PNMembershipField[])  
6    .IncludeCount(bool)  
7    .Page(PNPageObject)  
8    .Sort(Liststring>)  
9    .Execute(System.ActionPNMembership, PNStatus>)  
`
```

Parameters
- Uuid (string): Unique user identifier. If not supplied, current user's Uuid is used.
- Set (List<PNMembership>): Set channel memberships for the user.
- Remove (List<string>): Remove channel memberships for the user.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Execute (System.Action of PNMembership)
- ExecuteAsync: Returns Task<PNResult<PNMembership>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "Memberships": [  
3        {  
4            "ChannelMetadata": {  
5                "Channel": "my-channel",  
6                "Name": "My channel",  
7                "Description": "A channel that is mine",  
8                "Custom": null,  
9                "Updated": "2020-06-17T16:55:44.632042Z"  
10            },  
11            "Custom": {  
12                "starred": false  
13            },  
14            "Updated": "2020-06-17T17:05:25.987964Z"  
15        },  
16        {  
17            "ChannelMetadata": {  
18                "Channel": "main",  
19                "Name": "Main channel",  
20                "Description": "The main channel",  
21                "Custom": {  
22                    "public": true,  
23                    "motd": "Always check your spelling!"  
24                },  
25                "Updated": "2020-06-17T16:55:44.632042Z"  
26            },  
27            "Custom": {  
28                "item": "book"  
29            },  
30            "Updated": "2020-06-17T17:05:25.987964Z"  
31        }  
32    ],  
33    "TotalCount": 2,  
34    "Page": {  
35        "Next": "MQ",  
36        "Prev": ""  
37    }  
38}  
`
```

## Channel members

Manage the users in a channel.

### Get channel members

Methods

```
`1pubnub.GetChannelMembers()  
2    .Channel(string)  
3    .Include(PNChannelMemberField[])  
4    .IncludeCount(bool)  
5    .Page(PNPageObject)  
6    .Sort(Liststring>)  
7    .Filter(string)  
8    .Limit(int)  
9    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

Parameters
- Channel (string): Channel name.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Default/Max: 100.
- Execute (System.Action of PNChannelMembersResult)
- ExecuteAsync: Returns Task<PNResult<PNChannelMembersResult>>.

Sample code

```
1
  

```

Response

```
`1{  
2    "ChannelMembers": [  
3        {  
4            "UuidMetadata": {  
5                "Uuid": "uuid-1",  
6                "Name": "John Doe",  
7                "Email": "jack@twitter.com",  
8                "ExternalId": "",  
9                "ProfileUrl": "",  
10                "Custom": null,  
11                "Updated": "2019-02-20T23:11:20.89375"  
12            },  
13            "Custom": {  
14                "role": "admin"  
15            },  
16            "Updated": "2020-06-17T17:05:25.987964Z"  
17        },  
18        {  
19            "UuidMetadata": {  
20                "Uuid": "uuid-2",  
21                "Name": "Bob Cat",  
22                "Email": "bobc@example.com",  
23                "ExternalId": "",  
24                "ProfileUrl": "",  
25                "Custom": {  
26                    "phone": "999-999-9999"  
27                },  
28                "Updated": "2019-02-20T23:11:20.89375"  
29            },  
30            "Custom": null,  
31            "Updated": "2020-06-17T17:05:25.987964Z"  
32        }  
33    ],  
34    "TotalCount": 2,  
35    "Page": {  
36        "Next": "MQ",  
37        "Prev": ""  
38    }  
39}  
`
```

### Set channel members

Methods

```
`1pubnub.SetChannelMembers()  
2    .Channel(string)  
3    .Uuids(ListPNChannelMember>)  
4    .Include(PNChannelMemberField[])  
5    .Page(PNPageObject)  
6    .Sort(Liststring>)  
7    .Filter(string)  
8    .Limit(int)  
9    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

Parameters
- Channel (String): Channel name.
- Uuids (List<PNChannelMember>): Members to add. List can contain strings (UUIDs) or objects (with optional custom data).
- Include (PNChannelMemberField[]): Include additional fields.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Default/Max: 100.
- Execute (System.Action of PNChannelMembersResult)
- ExecuteAsync: Returns Task<PNResult<PNChannelMembersResult>>.

API limits: See REST API docs.

Sample code

```
1
  

```

Response

```
`1{  
2    "ChannelMembers": [  
3        {  
4            "UuidMetadata": {  
5                "Uuid": "uuid-1",  
6                "Name": "John Doe",  
7                "Email": "jack@twitter.com",  
8                "ExternalId": "",  
9                "ProfileUrl": "",  
10                "Custom": null,  
11                "Updated": "2019-02-20T23:11:20.89375"  
12            },  
13            "Custom": {  
14                "role": "admin"  
15            },  
16            "Updated": "2020-06-17T17:05:25.987964Z"  
17        },  
18        {  
19            "UuidMetadata": {  
20                "Uuid": "uuid-2",  
21                "Name": "Bob Cat",  
22                "Email": "bobc@example.com",  
23                "ExternalId": "",  
24                "ProfileUrl": "",  
25                "Custom": {  
26                    "phone": "999-999-9999"  
27                },  
28                "Updated": "2019-02-20T23:11:20.89375"  
29            },  
30            "Custom": null,  
31            "Updated": "2020-06-17T17:05:25.987964Z"  
32        }  
33    ],  
34    "TotalCount": 2,  
35    "Page": {  
36        "Next": "MQ",  
37        "Prev": ""  
38    }  
39}  
`
```

### Remove channel members

Methods

```
`1pubnub.RemoveChannelMembers()  
2    .Channel(string)  
3    .Uuids(List)  
4    .Include(PNChannelMembersInclude[])  
5    .IncludeCount(bool)  
6    .Page(PnPageObject)  
7    .Sort(List)  
8    .Filter(string)  
9    .Limit(int)  
10    .Execute(System.ActionPNChannelMembersResult, PNStatus>)  
`
```

Parameters
- Channel (string): Channel name.
- Uuids (List<string>): Members to remove from channel.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Default/Max: 100.
- Execute (System.Action of PNChannelMembersResult)
- ExecuteAsync: Returns Task<PNResult<PNChannelMembersResult>>.

Sample code

```
1
  

```

Response

```
`1{**2    "ChannelMembers": [  
3        {  
4            "UuidMetadata": {  
5                "Uuid": "uuid-1",  
6                "Name": "John Doe",  
7                "Email": "jack@twitter.com",  
8                "ExternalId": "",  
9                "ProfileUrl": "",  
10                "Custom": null,  
11                "Updated": "2019-02-20T23:11:20.89375"  
12            },  
13            "Custom": {  
14                "role": "admin"  
15            },  
16            "Updated": "2020-06-17T17:05:25.987964Z"  
17        },  
18        {  
19            "UuidMetadata": {  
20                "Uuid": "uuid-2",  
21                "Name": "Bob Cat",  
22                "Email": "bobc@example.com",  
23                "ExternalId": "",  
24                "ProfileUrl": "",  
25                "Custom": {  
26                    "phone": "999-999-9999"  
27                },  
28                "Updated": "2019-02-20T23:11:20.89375"  
29            },  
30            "Custom": null,  
31            "Updated": "2020-06-17T17:05:25.987964Z"  
32        }  
33    ],  
34    "TotalCount": 2,  
35    "Page": {  
36        "Next": "MQ",  
37        "Prev": ""  
38    }  
39}  
`
```