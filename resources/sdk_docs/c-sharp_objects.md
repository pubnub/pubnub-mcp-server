# App Context API for C# SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and membership associations. Events are triggered on create/update/delete (no event if data is unchanged). Use try/catch with the C# SDK: invalid parameters throw exceptions; server/network errors are returned in status.

##### Request execution

Use `try`/`catch` when working with the C# SDK.

If a request has invalid parameters (for example, a missing required field), the SDK throws an exception. If the request reaches the server but fails (server error or network issue), the error details are available in the returned `status`.

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

## User[​](#user)

### Get metadata for all users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including custom data.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the C# SDK:

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
- IncludeCustom (bool): Include Custom in response.
- IncludeCount (bool): Include total count in response (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

#### Response[​](#response)

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

### Get user metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including custom data.

#### Method(s)[​](#methods-1)

To `Get UUID Metadata` you can use the following method(s) in the C# SDK:

```
`1pubnub.GetUuidMetadata()  
2        .Uuid(string)  
3        .IncludeCustom(bool)  
`
```

Parameters:
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- IncludeCustom (bool): Include Custom in response.

#### Sample code[​](#sample-code-1)

```
1
  

```

#### Response[​](#response-1)

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

### Set user metadata[​](#set-user-metadata)

Sets metadata for a UUID, optionally including custom data.

##### Unsupported partial updates of custom metadata

Custom data sent in this method overwrites the existing value on PubNub servers.

#### Method(s)[​](#methods-2)

To `Set UUID Metadata` you can use the following method(s) in the C# SDK:

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
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- Name (string): Display name.
- Email (string): Email address.
- ExternalId (string): External system identifier.
- ProfileUrl (string): Profile picture URL.
- Custom (Dictionary<string, object>): Custom JSON (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom in response.
- IfMatchesEtag (string): Conditional update using eTag; mismatched eTags return HTTP 412.

##### API limits

See REST API docs for maximum parameter sizes.

#### Sample code[​](#sample-code-2)

```
1
  

```

#### Response[​](#response-2)

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

### Remove user metadata[​](#remove-user-metadata)

Removes metadata for a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove UUID Metadata` you can use the following method(s) in the C# SDK:

```
`1pubnub.RemoveUuidMetadata()  
2        .Uuid(string)  
`
```

Parameters:
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.

#### Sample code[​](#sample-code-3)

```
1
  

```

#### Response[​](#response-3)

```
`1{}  
`
```

## Channel[​](#channel)

### Get metadata for all channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including custom data.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the C# SDK:

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
- IncludeCustom (bool): Include Custom in response.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.

#### Sample code[​](#sample-code-4)

```
1
  

```

#### Response[​](#response-4)

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

### Get channel metadata[​](#get-channel-metadata)

Returns metadata for a specified channel, optionally including custom data.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the C# SDK:

```
`1pubnub.GetChannelMetadata()  
2        .Channel(string)  
3        .IncludeCustom(bool)  
`
```

Parameters:
- Channel (string): Channel name.
- IncludeCustom (bool): Include Custom in response.

#### Sample code[​](#sample-code-5)

```
1
  

```

#### Response[​](#response-5)

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

### Set channel metadata[​](#set-channel-metadata)

Sets metadata for a channel, optionally including custom data.

##### Unsupported partial updates of custom metadata

Custom data sent in this method overwrites the existing value on PubNub servers.

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the C# SDK:

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
- Custom (Dictionary<string, object>): Custom JSON (strings, numbers, booleans). Filtering by Custom isn’t supported.
- IncludeCustom (bool): Include Custom in response.
- IfMatchesEtag (string): Conditional update using eTag; mismatched eTags return HTTP 412.

##### API limits

See REST API docs for maximum parameter sizes.

#### Sample code[​](#sample-code-6)

```
1
  

```

#### Response[​](#response-6)

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

#### Other examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
1
  

```

### Remove channel metadata[​](#remove-channel-metadata)

Removes metadata for a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the C# SDK:

```
`1pubnub.RemoveChannelMetadata()  
2        .Channel(string)  
`
```

Parameters:
- Channel (string): Channel name.

#### Sample code[​](#sample-code-7)

```
1
  

```

#### Response[​](#response-7)

```
`1{}  
`
```

## Channel memberships[​](#channel-memberships)

### Get channel memberships[​](#get-channel-memberships)

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the C# SDK:

```
`1pubnub.GetMemberships()  
2        .Uuid(string)  
3        .Include(PNMembershipField[])  
4        .IncludeCount(bool)  
5        .Page(PNPageObject)  
`
```

Parameters:
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.

#### Sample code[​](#sample-code-8)

```
1
  

```

#### Response[​](#response-8)

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

### Set channel memberships[​](#set-channel-memberships)

Sets channel memberships for a UUID.

#### Method(s)[​](#methods-9)

To `Set Memberships` you can use the following method(s) in the C# SDK:

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
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- Channels (List<PNMembership>): Channels to add (names or objects with optional custom data).
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits

See REST API docs for maximum parameter sizes.

#### PNMembership[​](#pnmembership)

- Channel (string): Channel name for this membership.
- Custom (Dictionary<string, object>): Custom metadata (strings, numbers, booleans).
- Status (string): Membership status (for example, "active" or "inactive").
- Type (string): Membership type for categorization.

#### Sample code[​](#sample-code-9)

```
1
  

```

#### Response[​](#response-9)

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

### Remove channel memberships[​](#remove-channel-memberships)

Removes channel memberships for a UUID.

#### Method(s)[​](#methods-10)

To `Remove Memberships` you can use the following method(s) in the C# SDK:

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
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- Channels (List<string>): Channels to remove.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code[​](#sample-code-10)

```
1
  

```

#### Response[​](#response-10)

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

### Manage channel memberships[​](#manage-channel-memberships)

Sets and removes channel memberships for a user in a single call.

#### Method(s)[​](#methods-11)

To `Manage Memberships` you can use the following method(s) in the C# SDK:

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
- Uuid (string): Unique user identifier; defaults to current user's UUID if omitted.
- Set (List<PNMembership>): Memberships to set.
- Remove (List<string>): Memberships to remove.
- Include (PNMembershipField[]): Include additional fields.
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.

#### Sample code[​](#sample-code-11)

```
1
  

```

#### Response[​](#response-11)

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

## Channel members[​](#channel-members)

### Get channel members[​](#get-channel-members)

Returns a list of members in a channel, with user metadata if available.

#### Method(s)[​](#methods-12)

To `Get Channel Members` you can use the following method(s) in the C# SDK:

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
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code[​](#sample-code-12)

```
1
  

```

#### Response[​](#response-12)

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

### Set channel members[​](#set-channel-members)

Sets members in a channel.

#### Method(s)[​](#methods-13)

To `Set Channel Members` you can use the following method(s) in the C# SDK:

```
`1pubnub.SetChannelMembers().Channel(string).Uuids(ListPNChannelMember>).Include(PNChannelMemberField[]).Page(PNPageObject).Sort(Liststring>).Filter(string).Limit(int)  
`
```

Parameters:
- Channel (string): Channel name.
- Uuids (List<PNChannelMember>): Members to add (UUIDs or objects with optional custom data).
- Include (PNChannelMemberField[]): Include additional fields.
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

##### API limits

See REST API docs for maximum parameter sizes.

#### Sample code[​](#sample-code-13)

```
1
  

```

#### Response[​](#response-13)

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

### Remove channel members[​](#remove-channel-members)

Removes members from a channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Members` you can use the following method(s) in the C# SDK:

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
- IncludeCount (bool): Include total count (default false).
- Page (PNPageObject): Cursor-based pagination.
- Sort (List<string>): Sort by id, name, updated with asc/desc.
- Filter (string): Filter expression. See filtering.
- Limit (int): Number of objects to return. Default/Max: 100.

#### Sample code[​](#sample-code-14)

```
1
  

```

#### Response[​](#response-14)

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