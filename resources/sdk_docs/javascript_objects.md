# App Context API for JavaScript SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata, and membership associations. PubNub triggers events on metadata set, update, or removal. Setting the same data again doesn't trigger an event.

##### Supported and recommended asynchronous patterns
PubNub supports Callbacks, Promises, and Async/Await. Recommended: Async/Await with try...catch to handle errors.

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

- include (any): Whether to include additional fields.
  - totalCount (Boolean, default false): Include total count in the paginated response.
  - customFields (Boolean, default false): Include the Custom object in the response.
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (String): Cursor.
  - prev (String): Cursor. Ignored if next is supplied.

#### Sample code

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

Returns metadata for the specified UUID, optionally including the custom data object.

#### Method(s)

```
`1pubnub.objects.getUUIDMetadata({  
2    uuid: string,  
3    include: any  
4})  
`
```

- uuid (string, default current uuid): UUID. If not supplied, uses current user's UUID.
- include (any): Whether to include additional fields.
  - customFields (Boolean, default true): Include the Custom object.

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

Set metadata for a UUID in the database, optionally including the custom data object. Note: Partial updates of custom are unsupported; the provided custom object overwrites existing custom data.

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

- uuid (string, default current uuid): Unique user identifier. Defaults to current user's uuid.
- data (any, required): JSON object with UUID metadata to set.
  - name (string): Display name.
  - externalId (string): User's identifier in an external system.
  - profileUrl (string): URL of profile picture.
  - email (string): Email address.
  - custom (any): Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- include (any): Whether to include additional fields.
  - customFields (boolean, default true): Include the Custom object in the response.
- ifMatchesEtag (string): Use eTag from a get call to ensure conditional update. Mismatch returns HTTP 412.

##### API limits
See REST API docs (/docs/sdks/rest-api/set-user-metadata) for parameter length limits.

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

Removes metadata for a specified UUID.

#### Method(s)

```
`1pubnub.objects.removeUUIDMetadata({  
2    uuid: string  
3})  
`
```

- uuid (string, default current uuid): Unique user identifier. Defaults to current user's uuid.

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

- include (any): Whether to include additional fields.
  - totalCount (Boolean, default false): Include total count in the paginated response.
  - customFields (Boolean, default false): Include the Custom object.
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string): Cursor.
  - prev (string): Cursor. Ignored if next is supplied.

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

Returns metadata for the specified Channel, optionally including the custom data object.

#### Method(s)

```
`1pubnub.objects.getChannelMetadata({  
2    channel: string,  
3    include: any  
4})  
`
```

- channel (string, required): Channel name.
- include (any): Whether to include additional fields.
  - customFields (Boolean, default true): Include the Custom object.

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

Set metadata for a Channel in the database, optionally including the custom data object. Note: Partial updates of custom are unsupported; the provided custom object overwrites existing custom data.

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

- channel (string, required): Channel name.
- data (any, required): JSON object with channel metadata to set.
  - name (string): Channel name.
  - description (string): Channel description.
  - custom (any): Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- include (any): Whether to include additional fields.
  - customFields (boolean, default true): Include the Custom object in the response.
- ifMatchesEtag (string): Use eTag from a get call to ensure conditional update. Mismatch returns HTTP 412.

##### API limits
See REST API docs (/docs/sdks/rest-api/set-channel-metadata) for parameter length limits.

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

Removes the metadata from a specified channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMetadata({  
2    channel: string  
3})  
`
```

- channel (String, required): Channel name.

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

### Get channel memberships

Returns a list of channel memberships for a user. Does not include subscriptions.

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

- uuid (string, default current uuid): Unique user identifier. Defaults to current user's uuid.
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false): Include membership custom fields.
  - channelFields (boolean, default false): Include channel metadata fields.
  - customChannelFields (boolean, default false): Include custom fields for channel metadata.
  - statusField (boolean, default false): Include membership status.
  - channelStatusField (boolean, default false): Include channel status.
  - channelTypeField (boolean, default false): Include channel type.
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc (for example, {channel.name: 'asc'}).
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

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

Set channel memberships for a UUID.

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

- uuid (string, default current uuid): Unique user identifier. Defaults to current user's uuid.
- channels (Array<string>, required): Channels to add. May be:
  - String channel IDs, or
  - Objects with id and optional custom, status, type (e.g., { id: "my-channel-3", custom: { owner: "PubNubUser" }, type: "regular_membership", status: "active" }).
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - statusField (boolean, default false)
  - typeField (boolean, default false)
  - channelFields (boolean, default false)
  - customChannelFields (boolean, default false)
  - channelStatusField (boolean, default false)
  - channelTypeField (boolean, default false)
- filter (String): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc.
- limit (Number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

##### API limits
See REST API docs (/docs/sdks/rest-api/set-membership-metadata) for parameter length limits.

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

Remove channel memberships for a UUID.

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

- uuid (string, default current uuid): Unique user identifier. Defaults to current user's uuid.
- channels (Array<string>, required): Channels to remove from membership.
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - channelFields (boolean, default false)
  - customChannelFields (boolean, default false)
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, channel.id, channel.name, channel.updated with asc/desc.
- limit (Number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

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

### Get channel members

Returns a list of channel members. Includes user metadata when available.

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

- channel (string, required): Channel name.
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - UUIDFields (boolean, default false): Include UUID metadata fields.
  - customUUIDFields (boolean, default false): Include custom fields for UUID metadata.
  - statusField (boolean, default false): Include member status.
  - UUIDStatusField (boolean, default false): Include member status.
  - UUIDTypeField (boolean, default false): Include member type.
- filter (String): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc (for example, {uuid.name: 'asc'}).
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

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

Sets members in a channel.

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

- channel (string, required): Channel name.
- uuids (Array, required): Members to add. May be:
  - String UUIDs, or
  - Objects with id and optional custom (e.g., { id: "uuid-3", custom: { role: "Super Admin" } }).
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - statusField (boolean, default false)
  - typeField (boolean, default false)
  - UUIDFields (boolean, default false)
  - customUUIDFields (boolean, default false)
  - UUIDStatusField (boolean, default false)
  - UUIDTypeField (boolean, default false)
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc.
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

##### API limits
See REST API docs (/docs/sdks/rest-api/set-channel-members-metadata) for parameter length limits.

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

Remove members from a Channel.

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

- channel (string, required): Channel name.
- uuids (String[], required): Members to remove.
- include (any): Whether to include additional fields.
  - totalCount (boolean, default false)
  - customFields (boolean, default false)
  - UUIDFields (boolean, default false)
  - customUUIDFields (boolean, default false)
- filter (string): Filter expression. See filtering (/docs/general/metadata/filtering).
- sort (any): Sort by updated, uuid.id, uuid.name, uuid.updated with asc/desc.
- limit (number, default 100): Number of objects to return. Default/Max: 100.
- page (any): Cursor-based pagination.
  - next (string)
  - prev (string, ignored if next is supplied)

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