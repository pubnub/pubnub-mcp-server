# App Context API for JavaScript SDK

App Context (formerly Objects v2) provides serverless storage for user/channel metadata and membership associations. Object change events are emitted on set/update/remove; setting identical data does **not** trigger an event.

PubNub supports callbacks, promises, and async/await (recommended). With async/await, add `try...catch` to handle error status.

---

## User[​](#user)

### Get metadata for all users[​](#get-metadata-for-all-users)

Returns a **paginated** list of UUID metadata. Optionally includes Custom.

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** keyset settings (Admin Portal).

#### Method(s)[​](#methods)

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

Parameters (key options):
- `include` (any): additional fields  
  - `totalCount` (Boolean, default `false`)
  - `customFields` (Boolean, default `false`)
- `filter` (string): filter expression (see filtering docs)
- `sort` (any): `{id|name|updated: 'asc'|'desc'}`
- `limit` (number, default/max `100`)
- `page` (any): cursor pagination
  - `next` (String)
  - `prev` (String, ignored if `next` is supplied)

#### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

```
1
  

```

#### Response[​](#response)

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

---

### Get user metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including custom data.

#### Method(s)[​](#methods-1)

```
`1pubnub.objects.getUUIDMetadata({  
2    uuid: string,  
3    include: any  
4})  
`
```

- `uuid` (string, default current `uuid`): if omitted, uses current user UUID
- `include` (any)
  - `customFields` (Boolean, default `true`)

#### Sample code[​](#sample-code-1)

```
1
  

```

#### Response[​](#response-1)

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

---

### Set user metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata
`data.custom` **overwrites** stored custom data (no merge). To add/modify custom fields, first fetch existing metadata, update locally, then set the full custom object.

Sets metadata for a UUID.

#### Method(s)[​](#methods-2)

```
`1pubnub.objects.setUUIDMetadata({  
2    uuid: string,  
3    data: any,  
4    include: any,  
5    ifMatchesEtag: string  
6})  
`
```

- `uuid` (string, default current `uuid`)
- `data` (any): UUID metadata
  - `name` (string)
  - `externalId` (string)
  - `profileUrl` (string)
  - `email` (string)
  - `custom` (any): JSON (strings/numbers/booleans). Filtering by Custom not supported.
- `include` (any)
  - `customFields` (boolean, default `true`)
- `ifMatchesEtag` (string): optimistic concurrency via eTag; mismatch returns HTTP `412`

##### API limits
See REST API: `/docs/sdks/rest-api/set-user-metadata`.

#### Sample code[​](#sample-code-2)

```
1
  

```

#### Response[​](#response-2)

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

---

### Remove user metadata[​](#remove-user-metadata)

Removes metadata for a UUID.

#### Method(s)[​](#methods-3)

```
`1pubnub.objects.removeUUIDMetadata({  
2    uuid: string  
3})  
`
```

- `uuid` (string, default current `uuid`)

#### Sample code[​](#sample-code-3)

```
1
  

```

#### Response[​](#response-3)

```
`1{  
2    "status": 0,  
3    "data": {}  
4}  
`
```

---

## Channel[​](#channel)

### Get metadata for all channels[​](#get-metadata-for-all-channels)

Returns a **paginated** list of channel metadata. Optionally includes Custom.

##### Required keyset configuration
Uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in keyset **App Context** settings.

#### Method(s)[​](#methods-4)

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

- `include` (any)
  - `totalCount` (Boolean, default `false`)
  - `customFields` (Boolean, default `false`)
- `filter` (string)
- `sort` (any): `{id|name|updated: 'asc'|'desc'}`
- `limit` (number, default/max `100`)
- `page` (any)
  - `next` (string)
  - `prev` (string, ignored if `next` is supplied)

#### Sample code[​](#sample-code-4)

```
1
  

```

#### Response[​](#response-4)

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

---

### Get channel metadata[​](#get-channel-metadata)

Returns metadata for the specified channel, optionally including custom data.

#### Method(s)[​](#methods-5)

```
`1pubnub.objects.getChannelMetadata({  
2    channel: string,  
3    include: any  
4})  
`
```

- `channel` (string): channel name
- `include` (any)
  - `customFields` (Boolean, default `true`)

#### Sample code[​](#sample-code-5)

```
1
  

```

#### Response[​](#response-5)

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

---

### Set channel metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata
`data.custom` **overwrites** stored custom data (no merge). Fetch → modify → set full custom object to “update” custom fields.

Sets metadata for a channel.

#### Method(s)[​](#methods-6)

```
`1pubnub.objects.setChannelMetadata({  
2    channel: string,  
3    data: any,  
4    include: any,  
5    ifMatchesEtag: string  
6})  
`
```

- `channel` (string)
- `data` (any)
  - `name` (string)
  - `description` (string)
  - `custom` (any): JSON (strings/numbers/booleans). Filtering by Custom not supported.
- `include` (any)
  - `customFields` (boolean, default `true`)
- `ifMatchesEtag` (string): eTag precondition; mismatch returns HTTP `412`

##### API limits
See REST API: `/docs/sdks/rest-api/set-channel-metadata`.

#### Sample code[​](#sample-code-6)

```
1
  

```

#### Response[​](#response-6)

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

#### Other examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
1
  

```

---

### Remove channel metadata[​](#remove-channel-metadata)

Removes metadata for a channel.

#### Method(s)[​](#methods-7)

```
`1pubnub.objects.removeChannelMetadata({  
2    channel: string  
3})  
`
```

- `channel` (String): channel name

#### Sample code[​](#sample-code-7)

```
1
  

```

#### Response[​](#response-7)

```
`1{  
2    "status": 0,  
3    "data": {}  
4}  
`
```

---

## Channel memberships[​](#channel-memberships)

### Get channel memberships[​](#get-channel-memberships)

Returns a list of channel memberships for a user (**not** subscriptions).

#### Method(s)[​](#methods-8)

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

- `uuid` (string, default current `uuid`)
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `channelFields` (boolean, default `false`)
  - `customChannelFields` (boolean, default `false`)
  - `statusField` (boolean, default `false`)
  - `channelStatusField` (boolean, default `false`)
  - `channelTypeField` (boolean, default `false`)
- `filter` (string)
- `sort` (any): by `updated`, `status`, `type`, `channel.id`, `channel.name`, `channel.updated`, `channel.status`, `channel.type`
- `limit` (number, default/max `100`)
- `page` (any)
  - `next` (string)
  - `prev` (string, ignored if `next` is supplied)

#### Sample code[​](#sample-code-8)

```
1
  

```

#### Response[​](#response-8)

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

---

### Set channel memberships[​](#set-channel-memberships)

Sets channel memberships for a UUID.

#### Method(s)[​](#methods-9)

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

- `uuid` (string, default current `uuid`)
- `channels` (Array`<string>`): channels to add. Items may be:
  - string channel id, or
  - object with metadata, e.g. `{ id: "my-channel-3", custom: { owner: "PubNubUser" }, type: "regular_membership", status: "active" }`
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `statusField` (boolean, default `false`)
  - `typeField` (boolean, default `false`)
  - `channelFields` (boolean, default `false`)
  - `customChannelFields` (boolean, default `false`)
  - `channelStatusField` (boolean, default `false`)
  - `channelTypeField` (boolean, default `false`)
- `filter` (String)
- `sort` (any): by `updated`, `status`, `type`, `channel.*`
- `limit` (Number, default/max `100`)
- `page` (any): `next`/`prev`

##### API limits
See REST API: `/docs/sdks/rest-api/set-membership-metadata`.

#### Sample code[​](#sample-code-9)

```
1
  

```

#### Response[​](#response-9)

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

---

### Remove channel memberships[​](#remove-channel-memberships)

Removes channel memberships for a UUID.

#### Method(s)[​](#methods-10)

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

- `uuid` (string, default current `uuid`)
- `channels` (Array`<string>`): channels to remove
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `channelFields` (boolean, default `false`)
  - `customChannelFields` (boolean, default `false`)
- `filter` (string)
- `sort` (any): by `updated`, `channel.id`, `channel.name`, `channel.updated`
- `limit` (Number, default/max `100`)
- `page` (any): `next`/`prev`

#### Sample code[​](#sample-code-10)

```
1
  

```

#### Response[​](#response-10)

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

---

## Channel members[​](#channel-members)

### Get channel members[​](#get-channel-members)

Returns a list of channel members; includes user metadata when available.

#### Method(s)[​](#methods-11)

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

- `channel` (string)
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `UUIDFields` (boolean, default `false`)
  - `customUUIDFields` (boolean, default `false`)
  - `statusField` (boolean, default `false`)
  - `UUIDStatusField` (boolean, default `false`)
  - `UUIDTypeField` (boolean, default `false`)
- `filter` (String)
- `sort` (any): by `updated`, `status`, `type`, `uuid.*`
- `limit` (number, default/max `100`)
- `page` (any): `next`/`prev`

#### Sample code[​](#sample-code-11)

```
1
  

```

#### Response[​](#response-11)

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

---

### Set channel members[​](#set-channel-members)

Sets members in a channel.

#### Method(s)[​](#methods-12)

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

- `channel` (string)
- `uuids` (Array): members to add; items may be:
  - string UUID, or
  - object with custom, e.g. `{ id: "uuid-3", custom: { role: "Super Admin" } }`
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `statusField` (boolean, default `false`)
  - `typeField` (boolean, default `false`)
  - `UUIDFields` (boolean, default `false`)
  - `customUUIDFields` (boolean, default `false`)
  - `UUIDStatusField` (boolean, default `false`)
  - `UUIDTypeField` (boolean, default `false`)
- `filter` (string)
- `sort` (any): by `updated`, `status`, `type`, `uuid.*`
- `limit` (number, default/max `100`)
- `page` (any): `next`/`prev`

##### API limits
See REST API: `/docs/sdks/rest-api/set-channel-members-metadata`.

#### Sample code[​](#sample-code-12)

```
1
  

```

#### Response[​](#response-12)

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

---

### Remove channel members[​](#remove-channel-members)

Removes members from a channel.

#### Method(s)[​](#methods-13)

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

- `channel` (string)
- `uuids` (String[]): members to remove
- `include` (any)
  - `totalCount` (boolean, default `false`)
  - `customFields` (boolean, default `false`)
  - `UUIDFields` (boolean, default `false`)
  - `customUUIDFields` (boolean, default `false`)
- `filter` (string)
- `sort` (any): by `updated`, `uuid.id`, `uuid.name`, `uuid.updated`
- `limit` (number, default/max `100`)
- `page` (any): `next`/`prev`

#### Sample code[​](#sample-code-13)

```
1
  

```

#### Response[​](#response-13)

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