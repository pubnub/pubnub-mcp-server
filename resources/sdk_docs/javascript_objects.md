# App Context API for JavaScript SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub triggers events on set, update, or removal (re-setting the same data doesn't trigger events). Clients can receive these events in real time.

Supported async patterns: Callbacks, Promises, and Async/Await (recommended). Use try...catch to receive error status.

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

- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: Boolean Default: false Whether to include the total count in the paginated response.
  - customFields Type: Boolean Default: false Whether to include the Custom object in the response.
- filter Type: string Default: n/a Filter expression. Only matching objects are returned. See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- limit Type: number Default: 100 Number of objects to return. Default/Max: 100.
- page Type: any Default: n/a Cursor-based pagination.
  - next Type: String Default: n/a Cursor-based pagination.
  - prev Type: String Default: n/a Cursor-based pagination. Ignored if next is supplied.

#### Sample code

##### Reference code

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

Returns metadata for the specified UUID. Optionally includes Custom.

#### Method(s)

```
`1pubnub.objects.getUUIDMetadata({  
2    uuid: string,  
3    include: any  
4})  
`
```

- uuid Type: string Default: current uuid UUID. If not supplied, the current user's UUID is used.
- include Type: any Default: n/a Whether to include additional fields.
  - customFields Type: Boolean Default: true Whether to include the Custom object in the response.

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

Custom metadata updates overwrite the stored value.

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

- uuid Type: string Default: current uuid Unique user identifier. If not supplied then current user's uuid is used.
- data Type: any Default: n/a JSON object with UUID metadata to set.
  - name Type: string Default: n/a Display name for the user.
  - externalId Type: string Default: n/a User's identifier in an external system
  - profileUrl Type: string Default: n/a The URL of the user's profile picture
  - email Type: string Default: n/a The user's email address.
  - custom Type: any Default: n/a Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- include Type: any Default: n/a Whether to include additional fields.
  - customFields Type: boolean Default: true Whether to include the Custom object in the response.
- ifMatchesEtag Type: string Default: n/a Use the eTag from a get call to ensure conditional updates. If eTags differ, server returns HTTP 412.

API limits: See REST API docs (/docs/sdks/rest-api/set-user-metadata).

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

- uuid Type: string Default: current uuid Unique user identifier. If not supplied then current user's uuid is used.

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

- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: Boolean Default: false Whether to include the total count in the paginated response.
  - customFields Type: Boolean Default: false Whether to include the Custom object in the response.
- filter Type: string Default: n/a Filter expression. See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- limit Type: number Default: 100 Number of objects to return. Default/Max: 100.
- page Type: any Default: n/a Cursor-based pagination.
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

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

Returns metadata for the specified Channel. Optionally includes Custom.

#### Method(s)

```
`1pubnub.objects.getChannelMetadata({  
2    channel: string,  
3    include: any  
4})  
`
```

- channel Type: string Default: n/a Channel name.
- include Type: any Default: n/a Whether to include additional fields.
  - customFields Type: Boolean Default: true Whether to include the Custom object in the response.

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

Custom metadata updates overwrite the stored value.

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

- channel Type: string Default: n/a Channel name.
- data Type: any Default: n/a JSON object with channel metadata to set.
  - name Type: string Default: n/a Name of a channel.
  - description Type: string Default: n/a Description of a channel.
  - custom Type: any Default: n/a Custom JSON values (strings, numbers, booleans). Filtering by Custom isn’t supported.
- include Type: any Default: n/a Whether to include additional fields.
  - customFields Type: boolean Default: true Whether to include the Custom object in the response.
- ifMatchesEtag Type: string Default: n/a Conditional update using eTag; returns HTTP 412 on mismatch.

API limits: See REST API docs (/docs/sdks/rest-api/set-channel-metadata).

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

Removes metadata for a channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMetadata({  
2    channel: string  
3})  
`
```

- channel Type: String Default: n/a Channel name.

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

Returns a list of channel memberships for a user (not subscriptions).

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

- uuid Type: string Default: current uuid Unique user identifier. If not supplied then current user's uuid is used.
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include custom fields.
  - channelFields Type: boolean Default: false Include channel metadata fields.
  - customChannelFields Type: boolean Default: false Include custom fields for channel metadata.
  - statusField Type: boolean Default: false Include membership status field.
  - channelStatusField Type: boolean Default: false Include channel status field.
  - channelTypeField Type: boolean Default: false Include channel type fields.
- filter Type: string Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type (asc/desc).
- limit Type: number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

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

Sets channel memberships for a UUID.

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

- uuid Type: string Default: current uuid Unique user identifier. If not supplied then current user's uuid is used.
- channels Type: Array<string> Default: n/a Channels to add to membership. May be strings (channel id) or objects with custom, status, type (for example: { id: "my-channel-3", custom: { owner: "PubNubUser" }, type: "regular_membership", status: "active" }).
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include membership custom fields.
  - statusField Type: boolean Default: false Include membership status field.
  - typeField Type: boolean Default: false Include membership type field.
  - channelFields Type: boolean Default: false Include channel metadata fields.
  - customChannelFields Type: boolean Default: false Include custom fields for channel metadata.
  - channelStatusField Type: boolean Default: false Include channel status field.
  - channelTypeField Type: boolean Default: false Include channel type fields.
- filter Type: String Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type (asc/desc).
- limit Type: Number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

API limits: See REST API docs (/docs/sdks/rest-api/set-membership-metadata).

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

Removes channel memberships for a UUID.

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

- uuid Type: string Default: current uuid Unique user identifier. If not supplied then current user's uuid is used.
- channels Type: Array<string> Default: n/a Channels to remove from membership.
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include Custom.
  - channelFields Type: boolean Default: false Include channel metadata fields.
  - customChannelFields Type: boolean Default: false Include custom fields for channel metadata.
- filter Type: string Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, channel.id, channel.name, channel.updated (asc/desc).
- limit Type: Number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

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

- channel Type: string Default: n/a Channel name.
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include Custom.
  - UUIDFields Type: boolean Default: false Include UUID metadata fields.
  - customUUIDFields Type: boolean Default: false Include custom fields for UUID metadata.
  - statusField Type: boolean Default: false Include the member's status field.
  - UUIDStatusField Type: boolean Default: false Include the member's status field.
  - UUIDTypeField Type: boolean Default: false Include member's type fields.
- filter Type: String Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type (asc/desc).
- limit Type: number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

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

- channel Type: string Default: n/a Channel name.
- uuids Type: Array Default: n/a Members to add. May be strings (uuid) or objects with custom (for example: { id: "uuid-3", custom: { role: "Super Admin" } }).
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include Custom.
  - statusField Type: boolean Default: false Include member's custom status field.
  - typeField Type: boolean Default: false Include member's custom type field.
  - UUIDFields Type: boolean Default: false Include UUID metadata fields.
  - customUUIDFields Type: boolean Default: false Include custom fields for UUIDs metadata.
  - UUIDStatusField Type: boolean Default: false Include the member's status field.
  - UUIDTypeField Type: boolean Default: false Include the member's type field.
- filter Type: string Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type (asc/desc).
- limit Type: number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

API limits: See REST API docs (/docs/sdks/rest-api/set-channel-members-metadata).

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

- channel Type: string Default: n/a Channel name.
- uuids Type: String[] Default: n/a Members to remove.
- include Type: any Default: n/a Whether to include additional fields.
  - totalCount Type: boolean Default: false
  - customFields Type: boolean Default: false Include Custom.
  - UUIDFields Type: boolean Default: false Include UUID metadata fields.
  - customUUIDFields Type: boolean Default: false Include custom fields for UUID metadata.
- filter Type: string Default: n/a See filtering (/docs/general/metadata/filtering).
- sort Type: any Default: n/a Sort by updated, uuid.id, uuid.name, uuid.updated (asc/desc).
- limit Type: number Default: 100
- page Type: any Default: n/a
  - next Type: string Default: n/a
  - prev Type: string Default: n/a Ignored if next is supplied.

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