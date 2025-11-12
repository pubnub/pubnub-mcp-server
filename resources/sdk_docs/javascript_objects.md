# App Context API for JavaScript SDK (Objects/App Context)

App Context stores metadata for users (UUIDs), channels, memberships (user-to-channel), and members (channel-to-user). The SDK triggers real-time events on set/update/remove. Re-setting identical data does not trigger events.

Supported async patterns: Callbacks, Promises, Async/Await. Recommended: Async/Await with try...catch for error handling.

## User

### Get metadata for all users

Returns a paginated list of UUID metadata. Optionally includes Custom.

#### Method(s)

```
`1pubnub.objects.getAllUUIDMetadata({  
2    include: any,  
3    filter: string,  
4    sort: any,  
5    limit: number,  
6    page: any  
7})  
`
```

Parameters:
- include (any): additional fields to include
  - totalCount (boolean, default false): include total count in response
  - customFields (boolean, default false): include Custom object
- filter (string): filter expression (see filtering)
- sort (any): sort by id, name, updated with asc/desc (e.g., { name: 'asc' })
- limit (number, default 100, max 100)
- page (any): cursor-based pagination
  - next (string)
  - prev (string; ignored if next supplied)

#### Sample code

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "id": "uuid-1",  
6            "name": "John Doe",  
7            "externalId": null,  
8            "profileUrl": null,  
9            "email": "johndoe@pubnub.com",  
10            "custom": null,  
11            "updated": "2019-02-20T23:11:20.893755",  
12            "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
13        },  
14        {  
15            "id": "uuid-2",  
16            "name": "Bob Cat",  
17            "externalId": null,  
18            "profileUrl": null,  
19            "email": "bobc@example.com",  
20            "custom": {  
21                "phone": "999-999-9999"  
22            },  
23            "updated": "2019-02-21T03:29:00.173452",  
24            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
25        }  
26    ]  
27}  
`
```

### Get user metadata

Returns metadata for the specified UUID, optionally including Custom.

#### Method(s)

```
`1pubnub.objects.getUUIDMetadata({  
2    uuid: string,  
3    include: any  
4})  
`
```

Parameters:
- uuid (string, default current uuid): UUID to fetch
- include (any):
  - customFields (boolean, default true): include Custom object

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "uuid-1",  
5        "name": "John Doe",  
6        "externalId": null,  
7        "profileUrl": null,  
8        "email": "johndoe@pubnub.com",  
9        "updated": "2019-02-20T23:11:20.893755",  
10        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
11    }  
12}  
`
```

### Set user metadata

Sets metadata for a UUID; Custom overwrites existing Custom completely.

Partial updates for Custom are not supported. To add/modify, read existing metadata, merge your changes, then set it.

#### Method(s)

```
`1pubnub.objects.setUUIDMetadata({  
2    uuid: string,  
3    data: any,  
4    include: any,  
5    ifMatchesEtag: string  
6})  
`
```

Parameters:
- uuid (string, default current uuid): user identifier
- data (any, required): JSON with UUID metadata fields:
  - name (string)
  - externalId (string)
  - profileUrl (string)
  - email (string)
  - custom (any): strings, numbers, booleans (filtering by Custom not supported)
- include (any):
  - customFields (boolean, default true): include Custom in response
- ifMatchesEtag (string): supply eTag for conditional update (HTTP 412 on mismatch)

API limits: see REST API docs for max parameter lengths.

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "uuid-1",  
5        "name": "John Doe",  
6        "externalId": null,  
7        "profileUrl": null,  
8        "email": "johndoe@pubnub.com",  
9        "updated": "2019-02-20T23:11:20.893755",  
10        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
11    }  
12}  
`
```

### Remove user metadata

Removes metadata for a UUID.

#### Method(s)

```
`1pubnub.objects.removeUUIDMetadata({  
2    uuid: string  
3})  
`
```

Parameters:
- uuid (string, default current uuid)

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 0,  
3    "data": {}  
4}  
`
```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata. Optionally includes Custom.

#### Method(s)

```
`1pubnub.objects.getAllChannelMetadata({  
2    include: any,  
3    filter: string,  
4    sort: any,  
5    limit: number,  
6    page: any  
7})  
`
```

Parameters:
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
- filter (string)
- sort (any): sort by id, name, updated with asc/desc
- limit (number, default 100, max 100)
- page (any):
  - next (string)
  - prev (string; ignored if next supplied)

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "id": "team.blue",  
6            "name": "Blue Team",  
7            "description": "The channel for Blue team and no other teams.",  
8            "custom": null,  
9            "updated": "2019-02-20T23:11:20.893755",  
10            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
11        },  
12        {  
13            "id": "team.red",  
14            "name": "Red Team",  
15            "description": "The channel for Red team and no other teams.",  
16            "custom": null,  
17            "updated": "2019-02-20T23:11:20.893755",  
18            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
19        },  
20        {  
21            "id": "team.all",  
22            "name": "All Teams channel",  
23            "description": "The channel for all teams",  
24            "custom": {  
25                "public": true,  
26                "motd": "Red and Blue makes Purple!"  
27            },  
28            "updated": "2019-02-20T23:11:20.893755",  
29            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30        }  
31    ],  
32    "totalCount": 9,  
33    "next": "MUIwQTAwMUItQkRBRC00NDkyLTgyMEMtODg2OUU1N0REMTNBCg==",  
34    "prev": "M0FFODRENzMtNjY2Qy00RUExLTk4QzktNkY1Q0I2MUJFNDRCCg=="  
35}  
`
```

### Get channel metadata

Returns metadata for the specified channel.

#### Method(s)

```
`1pubnub.objects.getChannelMetadata({  
2    channel: string,  
3    include: any  
4})  
`
```

Parameters:
- channel (string, required)
- include (any):
  - customFields (boolean, default true)

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "team.blue",  
5        "name": "Blue Team",  
6        "description": "The channel for Blue team and no other teams.",  
7        "updated": "2019-02-20T23:11:20.893755",  
8        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
9    }  
10}  
`
```

### Set channel metadata

Sets metadata for a channel; Custom overwrites existing Custom completely.

Partial updates for Custom are not supported. To add/modify, read existing metadata, merge your changes, then set it.

#### Method(s)

```
`1pubnub.objects.setChannelMetadata({  
2    channel: string,  
3    data: any,  
4    include: any,  
5    ifMatchesEtag: string  
6})  
`
```

Parameters:
- channel (string, required)
- data (any, required): JSON with channel metadata:
  - name (string)
  - description (string)
  - custom (any): strings, numbers, booleans (filtering by Custom not supported)
- include (any):
  - customFields (boolean, default true)
- ifMatchesEtag (string): conditional update via eTag (HTTP 412 on mismatch)

API limits: see REST API docs for max parameter lengths.

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "team.red",  
5        "name": "Red Team",  
6        "description": "The channel for Blue team and no other teams.",  
7        "updated": "2019-02-20T23:11:20.893755",  
8        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
9    }  
10}  
`
```

#### Other examples

##### Iteratively update existing metadata

```
1
  

```

### Remove channel metadata

Removes the metadata for a channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMetadata({  
2    channel: string  
3})  
`
```

Parameters:
- channel (string, required)

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 0,  
3    "data": {}  
4}  
`
```

## Channel memberships

Memberships are channels associated with a user (UUID). Does not include subscriptions.

### Get channel memberships

#### Method(s)

```
`1pubnub.objects.getMemberships({  
2    uuid: string,  
3    include: any,  
4    filter: string,  
5    sort: any,  
6    limit: number,  
7    page: any  
8})  
`
```

Parameters:
- uuid (string, default current uuid)
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false): include membership custom
  - channelFields (boolean, default false): include channel metadata
  - customChannelFields (boolean, default false): include channel custom
  - statusField (boolean, default false): include membership status
  - channelStatusField (boolean, default false): include channel status
  - channelTypeField (boolean, default false): include channel type
- filter (string)
- sort (any): updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc
- limit (number, default 100, max 100)
- page (any):
  - next (string)
  - prev (string)

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6                "id": "my-channel",  
7                "name": "My channel",  
8                "description": "A channel that is mine",  
9                "custom": null,  
10                "updated": "2019-02-20T23:11:20.893755",  
11                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20            "channel": {  
21                "id": "main",  
22                "name": "Main channel",  
23                "description": "The main channel",  
24                "custom": {  
25                    "public": true,  
26                    "motd": "Always check your spelling!"  
27                },  
28                "updated": "2019-02-20T23:11:20.893755",  
29                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30            },  
31            "updated": "2019-02-20T23:11:20.893755",  
32            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

### Set channel memberships

Adds/updates channel memberships for a UUID.

#### Method(s)

```
`1pubnub.objects.setMemberships({  
2    uuid: string,  
3    channels: Arraystring>,  
4    include: any,  
5    filter: string,  
6    sort: any,  
7    limit: number,  
8    page: any  
9})  
`
```

Parameters:
- uuid (string, default current uuid)
- channels (Array<string> | Array<object>, required): channel IDs or objects with { id, custom, type, status }
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false): include membership custom
  - statusField (boolean, default false): include membership status
  - typeField (boolean, default false): include membership type
  - channelFields (boolean, default false)
  - customChannelFields (boolean, default false)
  - channelStatusField (boolean, default false)
  - channelTypeField (boolean, default false)
- filter (string)
- sort (any): updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc
- limit (number, default 100, max 100)
- page (any): next, prev

API limits: see REST API docs for max parameter lengths.

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6              "id": "my-channel",  
7              "name": "My channel",  
8              "description": "A channel that is mine",  
9              "custom": null,  
10              "updated": "2019-02-20T23:11:20.893755",  
11              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20          "channel": {  
21              "id": "main",  
22              "name": "Main channel",  
23              "description": "The main channel",  
24              "custom": {  
25                  "public": true,  
26                  "motd": "Always check your spelling!"  
27              },  
28              "updated": "2019-02-20T23:11:20.893755",  
29              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30          },  
31          "updated": "2019-02-20T23:11:20.893755",  
32          "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

### Remove channel memberships

Removes channels from a UUID’s memberships.

#### Method(s)

```
`1pubnub.objects.removeMemberships({  
2    uuid: string,  
3    channels: Arraystring>,  
4    include: any,  
5    filter: string,  
6    sort: any,  
7    limit: number,  
8    page: any  
9})  
`
```

Parameters:
- uuid (string, default current uuid)
- channels (Array<string>, required): channel IDs to remove
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - channelFields (boolean, default false)
  - customChannelFields (boolean, default false)
- filter (string)
- sort (any): updated, channel.id, channel.name, channel.updated with asc/desc
- limit (number, default 100, max 100)
- page (any): next, prev

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6              "id": "my-channel",  
7              "name": "My channel",  
8              "description": "A channel that is mine",  
9              "custom": null,  
10              "updated": "2019-02-20T23:11:20.893755",  
11              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20            "channel": {  
21              "id": "main",  
22              "name": "Main channel",  
23              "description": "The main channel",  
24              "custom": {  
25                  "public": true,  
26                  "motd": "Always check your spelling!"  
27              },  
28              "updated": "2019-02-20T23:11:20.893755",  
29              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30            },  
31            "updated": "2019-02-20T23:11:20.893755",  
32            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

## Channel members

Members are users (UUIDs) associated with a channel.

### Get channel members

Returns a list of channel members; includes user metadata when requested.

#### Method(s)

```
`1pubnub.objects.getChannelMembers({  
2    channel: string,  
3    include: any,  
4    filter: string,  
5    sort: any,  
6    limit: number,  
7    page: any  
8})  
`
```

Parameters:
- channel (string, required)
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - UUIDFields (boolean, default false): include UUID metadata
  - customUUIDFields (boolean, default false)
  - statusField (boolean, default false): include member status
  - UUIDStatusField (boolean, default false): include UUID status
  - UUIDTypeField (boolean, default false): include UUID type
- filter (string)
- sort (any): updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc
- limit (number, default 100, max 100)
- page (any): next, prev

#### Sample code

```
1
  

```

#### Response

```
`1{  
2  "status": 200,  
3  "data": [  
4    {  
5      "uuid": {  
6        "id": "uuid-1",  
7        "name": "John Doe",  
8        "externalId": null,  
9        "profileUrl": null,  
10        "email": "jack@twitter.com",  
11        "custom": null,  
12        "updated": "2019-02-20T23:11:20.893755",  
13        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14      },  
15      "custom": {  
16        "role": "admin"  
17      },  
18      "updated": "2019-02-20T23:11:20.893755",  
19      "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20    },  
21    {  
22      "uuid": {  
23        "id": "uuid-2",  
24        "name": "Bob Cat",  
25        "externalId": null,  
26        "profileUrl": null,  
27        "email": "bobc@example.com",  
28        "custom": {  
29          "phone": "999-999-9999"  
30        },  
31        "updated": "2019-02-21T03:29:00.173452",  
32        "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33      },  
34      "updated": "2019-02-20T23:11:20.893755",  
35      "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36    }  
37  ],  
38  "totalCount": 37,  
39  "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40  "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```

### Set channel members

Adds/updates members in a channel.

#### Method(s)

```
`1pubnub.objects.setChannelMembers({  
2    channel: string,  
3    uuids: Arraystring>,  
4    include: any,  
5    filter: string,  
6    sort: any,  
7    limit: number,  
8    page: any  
9})  
`
```

Parameters:
- channel (string, required)
- uuids (Array<string> | Array<object>, required): UUIDs or objects with { id, custom }; also supports status/type flags
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - statusField (boolean, default false): member custom status
  - typeField (boolean, default false): member custom type
  - UUIDFields (boolean, default false)
  - customUUIDFields (boolean, default false)
  - UUIDStatusField (boolean, default false)
  - UUIDTypeField (boolean, default false)
- filter (string)
- sort (any): updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc
- limit (number, default 100, max 100)
- page (any): next, prev

API limits: see REST API docs for max parameter lengths.

#### Sample code

```
1
  

```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "uuid": {  
6                "id": "uuid-1",  
7                "name": "John Doe",  
8                "externalId": null,  
9                "profileUrl": null,  
10                "email": "johndoe@pubnub.com",  
11                "custom": null,  
12                "updated": "2019-02-20T23:11:20.893755",  
13                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14            },  
15            "custom": {  
16                "role": "admin"  
17            },  
18            "updated": "2019-02-20T23:11:20.893755",  
19            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20        },  
21        {  
22            "uuid": {  
23                "id": "uuid-2",  
24                "name": "Bob Cat",  
25                "externalId": null,  
26                "profileUrl": null,  
27                "email": "bobc@example.com",  
28                "custom": {  
29                    "phone": "999-999-9999"  
30                },  
31                "updated": "2019-02-21T03:29:00.173452",  
32                "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33            },  
34            "updated": "2019-02-20T23:11:20.893755",  
35            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36        }  
37    ],  
38    "totalCount": 37,  
39    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```

### Remove channel members

Removes members from a channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMembers({  
2    channel: string,  
3    uuids: Arraystring>,  
4    include: any,  
5    filter: string,  
6    sort: any,  
7    limit: number,  
8    page: any  
9})  
`
```

Parameters:
- channel (string, required)
- uuids (string[], required): UUIDs to remove
- include (any):
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - UUIDFields (boolean, default false)
  - customUUIDFields (boolean, default false)
- filter (string)
- sort (any): updated, uuid.id, uuid.name, uuid.updated with asc/desc
- limit (number, default 100, max 100)
- page (any): next, prev

#### Sample code

```
1
  

```

#### Response

```
`1{**2    "status": 200,  
3    "data": [  
4        {  
5            "uuid": {  
6                "id": "uuid-1",  
7                "name": "John Doe",  
8                "externalId": null,  
9                "profileUrl": null,  
10                "email": "johndoe@pubnub.com",  
11                "custom": null,  
12                "updated": "2019-02-20T23:11:20.893755",  
13                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14            },  
15            "custom": {  
16                "role": "admin"  
17            },  
18            "updated": "2019-02-20T23:11:20.893755",  
19            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20        },  
21        {  
22            "uuid": {  
23                "id": "uuid-2",  
24                "name": "Bob Cat",  
25                "externalId": null,  
26                "profileUrl": null,  
27                "email": "bobc@example.com",  
28                "custom": {  
29                    "phone": "999-999-9999"  
30                },  
31                "updated": "2019-02-21T03:29:00.173452",  
32                "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33            },  
34            "updated": "2019-02-20T23:11:20.893755",  
35            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36        }  
37    ],  
38    "totalCount": 37,  
39    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```