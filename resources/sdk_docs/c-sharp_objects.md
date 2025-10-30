# App Context API for C# SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. Events trigger on set/update/remove actions; setting unchanged data doesn't trigger events. To upgrade from Objects v1, see the migration guide.

##### Request execution
Use try/catch. Invalid parameters throw exceptions. Server/network failures return details in Status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## User

### Get metadata for all users

Returns a paginated list of UUID Metadata objects, optionally including the custom object.

#### Method(s)

```
`1pubnub.GetAllUuidMetadata()  
2        .IncludeCustom(bool)  
3        .IncludeCount(bool)  
4        .Page(PNPageObject)  
5        .Sort(Liststring>)  
6        .Filter(string)  
7        .Limit(int)  
`
```

Parameters:
- IncludeCustom (bool): Include Custom in the response.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code
##### Reference code
```
1
  

```

#### Response
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

Returns metadata for a UUID, optionally including custom.

#### Method(s)

```
`1pubnub.GetUuidMetadata()  
2        .Uuid(string)  
3        .IncludeCustom(bool)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- IncludeCustom (bool): Include Custom in the response.

#### Sample code
```
1
  

```

#### Response
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

Custom metadata updates overwrite existing data. To augment existing custom data, read current metadata, merge client-side, then set.

#### Method(s)

```
`1pubnub.SetUuidMetadata()  
2        .Uuid(string)  
3        .Name(string)  
4        .Email(string)  
5        .ExternalId(string)  
6        .ProfileUrl(string)  
7        .Custom(Dictionarystring, object>)  
8        .IncludeCustom(bool)  
9        .IfMatchesEtag(string)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- Name (string): Display name.
- Email (string): Email address.
- ExternalId (string): Identifier in an external system.
- ProfileUrl (string): Profile picture URL.
- Custom (Dictionary<string, object>): Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom in response.
- IfMatchesEtag (string): Conditional update using eTag; if mismatch, HTTP 412.

##### API limits
See REST API docs for max parameter lengths.

#### Sample code
```
1
  

```

#### Response
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

Removes metadata for a UUID.

#### Method(s)

```
`1pubnub.RemoveUuidMetadata()  
2        .Uuid(string)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.

#### Sample code
```
1
  

```

#### Response
```
`1{}  
`
```

## Channel

### Get metadata for all channels

Returns a paginated list of Channel Metadata, optionally including custom.

#### Method(s)

```
`1pubnub.GetAllChannelMetadata()  
2        .IncludeCustom(bool)  
3        .IncludeCount(bool)  
4        .Page(PNPageObject)  
5        .Sort(Liststring>)  
6        .Filter(string)  
`
```

Parameters:
- IncludeCustom (bool): Include Custom in the response.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.

#### Sample code
```
1
  

```

#### Response
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

Returns metadata for a channel, optionally including custom.

#### Method(s)

```
`1pubnub.GetChannelMetadata()  
2        .Channel(string)  
3        .IncludeCustom(bool)  
`
```

Parameters:
- Channel (string): Channel name.
- IncludeCustom (bool): Include Custom in the response.

#### Sample code
```
1
  

```

#### Response
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

Custom metadata updates overwrite existing data. To augment existing custom data, read current metadata, merge client-side, then set.

#### Method(s)

```
`1pubnub.SetChannelMetadata()  
2        .Channel(string)  
3        .Name(string)  
4        .Description(string)  
5        .Custom(Dictionarystring, object>)  
6        .IncludeCustom(bool)  
7        .IfMatchesEtag(string)  
`
```

Parameters:
- Channel (string): Channel name.
- Name (string): Channel name.
- Description (string): Channel description.
- Custom (Dictionary<string, object>): Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom in response.
- IfMatchesEtag (string): Conditional update using eTag; if mismatch, HTTP 412.

##### API limits
See REST API docs for max parameter lengths.

#### Sample code
```
1
  

```

#### Response
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

#### Other examples
##### Iteratively update existing metadata
```
1
  

```

### Remove channel metadata

Removes metadata for a channel.

#### Method(s)

```
`1pubnub.RemoveChannelMetadata()  
2        .Channel(string)  
`
```

Parameters:
- Channel (string): Channel name.

#### Sample code
```
1
  

```

#### Response
```
`1{}  
`
```

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)

```
`1pubnub.GetMemberships()  
2        .Uuid(string)  
3        .Include(PNMembershipField[])  
4        .IncludeCount(bool)  
5        .Page(PNPageObject)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.

#### Sample code
```
1
  

```

#### Response
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

Set channel memberships for a UUID.

#### Method(s)

```
`1pubnub.SetMemberships()  
2        .Uuid(string)  
3        .Channels(ListPNMembership>)  
4        .Include(PNMembershipField[])  
5        .IncludeCount(bool)  
6        .Page(PNPageObject)  
7        .Sort(Liststring>)  
8        .Filter(string)  
9        .Limit(int)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- Channels (List<PNMembership>): Channels to add to membership. Accepts channel names (strings) or objects (with optional custom data).
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits
See REST API docs for max parameter lengths.

#### PNMembership

- Channel (string): Channel name for this membership.
- Custom (Dictionary<string, object>): Custom metadata (strings, numbers, booleans).
- Status (string): Membership status (for example, "active" or "inactive").
- Type (string): Membership type/category.

#### Sample code
```
1
  

```

#### Response
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

Remove channel memberships for a UUID.

#### Method(s)

```
`1pubnub.RemoveMemberships()  
2        .Uuid(string)  
3        .Channels(Liststring>)  
4        .Include(PNMembershipField[])  
5        .IncludeCount(bool)  
6        .Page(PNPageObject)  
7        .Sort(Liststring>)  
8        .Filter(string)  
9        .Limit(int)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- Channels (List<string>): Channels to remove from membership.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code
```
1
  

```

#### Response
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

Set and remove channel memberships for a user.

#### Method(s)

```
`1pubnub.ManageMemberships()  
2        .Uuid(string)  
3        .Set(ListPNMembership>)  
4        .Remove(Liststring>)  
5        .Include(PNMembershipField[])  
6        .IncludeCount(bool)  
7        .Page(PNPageObject)  
8        .Sort(Liststring>)  
`
```

Parameters:
- Uuid (string): Unique user identifier. If omitted, current user's UUID is used.
- Set (List<PNMembership>): Set channel memberships.
- Remove (List<string>): Remove channel memberships.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.

#### Sample code
```
1
  

```

#### Response
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

### Get channel members

Returns a list of members in a channel, including user metadata if stored.

#### Method(s)

```
`1pubnub.GetChannelMembers()  
2        .Channel(string)  
3        .Include(PNChannelMemberField[])  
4        .IncludeCount(bool)  
5        .Page(PNPageObject)  
6        .Sort(Liststring>)  
7        .Filter(string)  
8        .Limit(int)  
`
```

Parameters:
- Channel (string): Channel name.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code
```
1
  

```

#### Response
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

Sets members in a channel.

#### Method(s)

```
`1pubnub.SetChannelMembers().Channel(string).Uuids(ListPNChannelMember>).Include(PNChannelMemberField[]).Page(PNPageObject).Sort(Liststring>).Filter(string).Limit(int)  
`
```

Parameters:
- Channel (string): Channel name.
- Uuids (List<PNChannelMember>): Members to add. Accepts UUIDs (strings) or objects (with optional custom data).
- Include (PNChannelMemberField[]): Include additional fields.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits
See REST API docs for max parameter lengths.

#### Sample code
```
1
  

```

#### Response
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

Removes members from a channel.

#### Method(s)

```
`1pubnub.RemoveChannelMembers()  
2        .Channel(string)  
3        .Remove( List)  
4        .Include(PNChannelMembersInclude[])  
5        .Limit(int)  
6        .Count(bool)  
7        .Start(string)  
8        .End(string)  
9        .Sort(List)  
10        .Async()  
`
```

Parameters:
- Channel (string): Channel name.
- Uuids (List<string>): Members to remove.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count in paginated response. Default false.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code
```
1
  

```

#### Response
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