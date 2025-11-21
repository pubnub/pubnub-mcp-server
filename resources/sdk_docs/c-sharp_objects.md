# App Context API for C# SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub triggers events when object data is set, updated, or removed. Setting the same data that already exists does not trigger an event.

Use try/catch when working with the C# SDK. Invalid parameters throw exceptions; server/network errors are returned in PNStatus.

##### Request execution

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

Returns a paginated list of UUID Metadata objects. Optional: include custom data and total count.

#### Method(s)

To Get All UUID Metadata:

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

- IncludeCustom (bool): Include Custom object.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
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

Returns metadata for the specified UUID. Optional: include custom data.

#### Method(s)

To Get UUID Metadata:

```
`1pubnub.GetUuidMetadata()  
2        .Uuid(string)  
3        .IncludeCustom(bool)  
`
```

- Uuid (string): Unique user identifier. Defaults to current user's UUID if not supplied.
- IncludeCustom (bool): Include Custom object.

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

Note: Custom metadata is fully overwritten (no partial merge). Use a read-modify-write approach to add fields.

#### Method(s)

To Set UUID Metadata:

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

- Uuid (string): Unique user identifier. Defaults to current user's UUID.
- Name (string): Display name.
- Email (string): Email address.
- ExternalId (string): External system identifier.
- ProfileUrl (string): Profile image URL.
- Custom (Dictionary<string, object>): Custom JSON (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom object in response.
- IfMatchesEtag (string): Conditional update with eTag; mismatches return HTTP 412.

##### API limits

See REST API docs for parameter limits.

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

Removes metadata for a specified UUID.

#### Method(s)

To Remove UUID Metadata:

```
`1pubnub.RemoveUuidMetadata()  
2        .Uuid(string)  
`
```

- Uuid (string): Unique user identifier. Defaults to current user's UUID.

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

Returns a paginated list of Channel Metadata objects. Optional: include custom data and total count.

#### Method(s)

To Get All Channel Metadata:

```
`1pubnub.GetAllChannelMetadata()  
2        .IncludeCustom(bool)  
3        .IncludeCount(bool)  
4        .Page(PNPageObject)  
5        .Sort(Liststring>)  
6        .Filter(string)  
`
```

- IncludeCustom (bool): Include Custom object.
- IncludeCount (bool): Include total count (default false).
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

Returns metadata for the specified channel. Optional: include custom data.

#### Method(s)

To Get Channel Metadata:

```
`1pubnub.GetChannelMetadata()  
2        .Channel(string)  
3        .IncludeCustom(bool)  
`
```

- Channel (string): Channel name.
- IncludeCustom (bool): Include Custom object.

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

Note: Custom metadata is fully overwritten (no partial merge). Use a read-modify-write approach to add fields.

#### Method(s)

To Set Channel Metadata:

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

- Channel (string): Channel name.
- Name (string): Channel name.
- Description (string): Channel description.
- Custom (Dictionary<string, object>): Custom JSON (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom object in response.
- IfMatchesEtag (string): Conditional update with eTag; mismatches return HTTP 412.

##### API limits

See REST API docs for parameter limits.

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

Removes the metadata for a specified channel.

#### Method(s)

To Remove Channel Metadata:

```
`1pubnub.RemoveChannelMetadata()  
2        .Channel(string)  
`
```

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

To Get Memberships:

```
`1pubnub.GetMemberships()  
2        .Uuid(string)  
3        .Include(PNMembershipField[])  
4        .IncludeCount(bool)  
5        .Page(PNPageObject)  
`
```

- Uuid (string): Unique user identifier. Defaults to current user's UUID.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
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

To Set Memberships:

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

- Uuid (string): Unique user identifier. Defaults to current user's UUID.
- Channels (List<PNMembership>): Channels to add (names or objects with optional custom).
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits

See REST API docs for parameter limits.

#### PNMembership

- Channel (string): Channel name for this membership.
- Custom (Dictionary<string, object>): Custom metadata (strings, numbers, booleans).
- Status (string): Membership status (for example, active, inactive).
- Type (string): Membership type for categorization.

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

To Remove Memberships:

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

- Uuid (string): Unique user identifier. Defaults to current user's UUID.
- Channels (List<string>): Channels to remove.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
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

To Manage Memberships:

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

- Uuid (string): Unique user identifier. Defaults to current user's UUID.
- Set (List<PNMembership>): Channel memberships to set.
- Remove (List<string>): Channel memberships to remove.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
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

Returns a list of members in a channel. Includes user metadata when available.

#### Method(s)

To Get Channel Members:

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

- Channel (string): Channel name.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
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

Set members in a channel.

#### Method(s)

To Set Channel Members:

```
`1pubnub.SetChannelMembers().Channel(string).Uuids(ListPNChannelMember>).Include(PNChannelMemberField[]).Page(PNPageObject).Sort(Liststring>).Filter(string).Limit(int)  
`
```

- Channel (String): Channel name.
- Uuids (List<PNChannelMember>): Members to add (UUIDs or objects with optional custom).
- Include (PNChannelMemberField[]): Include additional fields.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits

See REST API docs for parameter limits.

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

Remove members from a channel.

#### Method(s)

To Remove Channel Members:

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

- Channel (string): Channel name.
- Uuids (List<string>): Members to remove.
- Include (PNChannelMemberField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
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