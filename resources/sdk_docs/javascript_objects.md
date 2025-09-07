# App Context API for JavaScript SDK

App Context (Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub triggers events on set/update/remove (no event when data is unchanged). Use async/await with try...catch for errors.

Supported async patterns: Callbacks, Promises, and Async/Await (recommended).

## User

### Get metadata for all users

Returns a paginated list of UUID metadata. Optionally includes custom fields.

#### Method(s)

```
`pubnub.objects.getAllUUIDMetadata({  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- include (any)
  - totalCount: boolean (default false) – include total count in paginated response.
  - customFields: boolean (default false) – include Custom object.
- filter (string) – filter expression. See filtering.
- sort (any) – sort by id, name, updated with asc/desc (for example, {name: 'asc'}).
- limit (number, default 100, max 100) – number of objects to return.
- page (any) – cursor-based pagination.
  - next (string)
  - prev (string) – ignored if next is supplied.

#### Sample code

```
`  
`
```

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "id": "uuid-1",  
            "name": "John Doe",  
            "externalId": null,  
            "profileUrl": null,  
            "email": "johndoe@pubnub.com",  
            "custom": null,  
            "updated": "2019-02-20T23:11:20.893755",  
            "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
        },  
        {  
            "id": "uuid-2",  
`
```
show all 27 lines

### Get user metadata

Returns metadata for a specified UUID. Optionally includes custom fields.

#### Method(s)

```
`pubnub.objects.getUUIDMetadata({  
    uuid: string,  
    include: any  
})  
`
```

Parameters:
- uuid (string, default current uuid) – UUID; defaults to current user’s UUID.
- include (any)
  - customFields: boolean (default true) – include Custom object.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "johndoe@pubnub.com",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
    }  
}  
`
```

### Set user metadata

Sets metadata for a UUID. Custom metadata sent overwrites existing custom data (no partial merges).

#### Method(s)

```
`pubnub.objects.setUUIDMetadata({  
    uuid: string,  
    data: any,  
    include: any,  
    ifMatchesEtag: string  
})  
`
```

Parameters:
- uuid (string, default current uuid) – target user UUID.
- data (any, required) – JSON with UUID metadata to set:
  - name (string)
  - externalId (string)
  - profileUrl (string)
  - email (string)
  - custom (any: strings, numbers, booleans; filtering by Custom isn’t supported)
- include (any)
  - customFields: boolean (default true) – include Custom object in response.
- ifMatchesEtag (string) – use eTag from a GET call to ensure conditional update (HTTP 412 if mismatch).

API limits: See REST API docs for maximum parameter lengths.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "johndoe@pubnub.com",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
    }  
}  
`
```

### Remove user metadata

Removes metadata for the specified UUID.

#### Method(s)

```
`pubnub.objects.removeUUIDMetadata({  
    uuid: string  
})  
`
```

Parameters:
- uuid (string, default current uuid) – target user UUID.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 0,  
    "data": {}  
}  
`
```

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata. Optionally includes custom fields.

#### Method(s)

```
`pubnub.objects.getAllChannelMetadata({  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- include (any)
  - totalCount: boolean (default false) – include total count.
  - customFields: boolean (default false) – include Custom object.
- filter (string) – filter expression. See filtering.
- sort (any) – sort by id, name, updated with asc/desc.
- limit (number, default 100, max 100)
- page (any)
  - next (string)
  - prev (string) – ignored if next provided.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "id": "team.blue",  
            "name": "Blue Team",  
            "description": "The channel for Blue team and no other teams.",  
            "custom": null,  
            "updated": "2019-02-20T23:11:20.893755",  
            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
        },  
        {  
            "id": "team.red",  
            "name": "Red Team",  
            "description": "The channel for Red team and no other teams.",  
`
```
show all 35 lines

### Get channel metadata

Returns metadata for a specified channel. Optionally includes custom fields.

#### Method(s)

```
`pubnub.objects.getChannelMetadata({  
    channel: string,  
    include: any  
})  
`
```

Parameters:
- channel (string, required) – channel name.
- include (any)
  - customFields: boolean (default true) – include Custom object.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": {  
        "id": "team.blue",  
        "name": "Blue Team",  
        "description": "The channel for Blue team and no other teams.",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
    }  
}  
`
```

### Set channel metadata

Sets metadata for a channel. Custom metadata sent overwrites existing custom data.

#### Method(s)

```
`pubnub.objects.setChannelMetadata({  
    channel: string,  
    data: any,  
    include: any,  
    ifMatchesEtag: string  
})  
`
```

Parameters:
- channel (string, required) – channel name.
- data (any, required) – JSON with channel metadata:
  - name (string)
  - description (string)
  - custom (any: strings, numbers, booleans; filtering by Custom isn’t supported)
- include (any)
  - customFields: boolean (default true) – include Custom object in response.
- ifMatchesEtag (string) – conditional update using eTag (HTTP 412 if mismatch).

API limits: See REST API docs for maximum parameter lengths.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": {  
        "id": "team.red",  
        "name": "Red Team",  
        "description": "The channel for Blue team and no other teams.",  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
    }  
}  
`
```

#### Other examples

##### Iteratively update existing metadata

```
`  
`
```

### Remove channel metadata

Removes metadata for a specified channel.

#### Method(s)

```
`pubnub.objects.removeChannelMetadata({  
    channel: string  
})  
`
```

Parameters:
- channel (string, required) – channel name.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 0,  
    "data": {}  
}  
`
```

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)

```
`pubnub.objects.getMemberships({  
    uuid: string,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- uuid (string, default current uuid) – target user UUID.
- include (any)
  - totalCount: boolean (default false)
  - customFields: boolean (default false) – include membership custom.
  - channelFields: boolean (default false) – include channel metadata fields.
  - customChannelFields: boolean (default false) – include channel custom metadata.
  - statusField: boolean (default false) – include membership status.
  - channelStatusField: boolean (default false) – include channel status.
  - channelTypeField: boolean (default false) – include channel type.
- filter (string) – filter expression. See filtering.
- sort (any) – sort by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc (for example, {channel.name: 'asc'}).
- limit (number, default 100, max 100)
- page (any)
  - next (string)
  - prev (string) – ignored if next provided.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
                "id": "my-channel",  
                "name": "My channel",  
                "description": "A channel that is mine",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

### Set channel memberships

Sets channel memberships for a UUID.

#### Method(s)

```
`pubnub.objects.setMemberships({  
    uuid: string,  
    channels: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- uuid (string, default current uuid)
- channels (Array<string> | Array<object>, required) – channels to add. Elements may be:
  - "channel-name" (string), or
  - { id: "my-channel-3", custom: { owner: "PubNubUser" }, type: "regular_membership", status: "active" }
- include (any)
  - totalCount, customFields, statusField, typeField, channelFields, customChannelFields, channelStatusField, channelTypeField (all boolean; default false)
- filter (string) – see filtering.
- sort (any) – by updated, status, type, channel.id, channel.name, channel.updated, channel.status, channel.type with asc/desc.
- limit (number, default 100, max 100)
- page (any): next, prev (string; prev ignored if next provided)

API limits: See REST API docs for maximum parameter lengths.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
              "id": "my-channel",  
              "name": "My channel",  
              "description": "A channel that is mine",  
              "custom": null,  
              "updated": "2019-02-20T23:11:20.893755",  
              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

### Remove channel memberships

Removes channel memberships for a UUID.

#### Method(s)

```
`pubnub.objects.removeMemberships({  
    uuid: string,  
    channels: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- uuid (string, default current uuid)
- channels (Array<string>, required) – channels to remove from membership.
- include (any)
  - totalCount, customFields, channelFields, customChannelFields (boolean; default false)
- filter (string) – see filtering.
- sort (any) – by updated, channel.id, channel.name, channel.updated with asc/desc.
- limit (number, default 100, max 100)
- page (any): next, prev (string; prev ignored if next provided)

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "channel": {  
              "id": "my-channel",  
              "name": "My channel",  
              "description": "A channel that is mine",  
              "custom": null,  
              "updated": "2019-02-20T23:11:20.893755",  
              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
            },  
            "custom": {  
                "starred": false  
            },  
`
```
show all 38 lines

## Channel members

### Get channel members

Returns a list of channel members. Includes user metadata when available.

#### Method(s)

```
`pubnub.objects.getChannelMembers({  
    channel: string,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- channel (string, required)
- include (any)
  - totalCount: boolean (default false)
  - customFields: boolean (default false) – include member custom.
  - UUIDFields: boolean (default false) – include UUID metadata fields.
  - customUUIDFields: boolean (default false) – include UUID custom metadata.
  - statusField: boolean (default false) – include member status.
  - UUIDStatusField: boolean (default false)
  - UUIDTypeField: boolean (default false)
- filter (string) – see filtering.
- sort (any) – by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc (for example, {uuid.name: 'asc'}).
- limit (number, default 100, max 100)
- page (any): next, prev (string; prev ignored if next provided)

#### Sample code

```
`  
`
```

#### Response

```
`{  
  "status": 200,  
  "data": [  
    {  
      "uuid": {  
        "id": "uuid-1",  
        "name": "John Doe",  
        "externalId": null,  
        "profileUrl": null,  
        "email": "jack@twitter.com",  
        "custom": null,  
        "updated": "2019-02-20T23:11:20.893755",  
        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
      },  
      "custom": {  
`
```
show all 41 lines

### Set channel members

Sets members in a channel.

#### Method(s)

```
`pubnub.objects.setChannelMembers({  
    channel: string,  
    uuids: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- channel (string, required)
- uuids (Array<string|object>, required) – members to add; elements may be:
  - "uuid-3" (string), or
  - { id: "uuid-3", custom: { role: "Super Admin" } }
- include (any)
  - totalCount, customFields, statusField, typeField, UUIDFields, customUUIDFields, UUIDStatusField, UUIDTypeField (boolean; default false)
- filter (string) – see filtering.
- sort (any) – by updated, status, type, uuid.id, uuid.name, uuid.updated, uuid.status, uuid.type with asc/desc.
- limit (number, default 100, max 100)
- page (any): next, prev (string; prev ignored if next provided)

API limits: See REST API docs for maximum parameter lengths.

#### Sample code

```
`  
`
```

#### Response

```
`{  
    "status": 200,  
    "data": [  
        {  
            "uuid": {  
                "id": "uuid-1",  
                "name": "John Doe",  
                "externalId": null,  
                "profileUrl": null,  
                "email": "johndoe@pubnub.com",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
            },  
            "custom": {  
`
```
show all 41 lines

### Remove channel members

Removes members from a channel.

#### Method(s)

```
`pubnub.objects.removeChannelMembers({  
    channel: string,  
    uuids: Arraystring>,  
    include: any,  
    filter: string,  
    sort: any,  
    limit: number,  
    page: any  
})  
`
```

Parameters:
- channel (string, required)
- uuids (string[], required) – members to remove.
- include (any)
  - totalCount, customFields, UUIDFields, customUUIDFields (boolean; default false)
- filter (string) – see filtering.
- sort (any) – by updated, uuid.id, uuid.name, uuid.updated with asc/desc.
- limit (number, default 100, max 100)
- page (any): next, prev (string; prev ignored if next provided)

#### Sample code

```
`  
`
```

#### Response

```
`{**    "status": 200,  
    "data": [  
        {  
            "uuid": {  
                "id": "uuid-1",  
                "name": "John Doe",  
                "externalId": null,  
                "profileUrl": null,  
                "email": "johndoe@pubnub.com",  
                "custom": null,  
                "updated": "2019-02-20T23:11:20.893755",  
                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
            },  
            "custom": {  
`
```
show all 41 lines