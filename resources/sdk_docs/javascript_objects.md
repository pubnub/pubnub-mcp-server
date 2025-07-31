# PubNub JavaScript SDK – App Context (Objects v2)

The list below contains every Objects-related API, its method signature, parameters (with types & defaults), and example responses. All original code blocks are preserved.

---

## Users (UUID Metadata)

### Get metadata for all users
```js
pubnub.objects.getAllUUIDMetadata({
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
Parameters  
* include: `{ totalCount?: boolean=false, customFields?: boolean=false }`  
* filter: `string` – [filter syntax](/docs/general/metadata/filtering)  
* sort: `{ id|name|updated : 'asc'|'desc'|null }`  
* limit: `number=100` (max 100)  
* page: `{ next?: string, prev?: string }`

Reference code  
```
  
```
```
  
```
Response  
```json
{
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
```
show all 27 lines
```

---

### Get user metadata
```js
pubnub.objects.getUUIDMetadata({
  uuid: string,
  include: any
})
```
* uuid: `string` – defaults to current UUID  
* include: `{ customFields?: boolean=true }`

```
  
```
```json
{
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
```

---

### Set user metadata
```js
pubnub.objects.setUUIDMetadata({
  uuid: string,
  data: any,
  include: any,
  ifMatchesEtag: string
})
```
* uuid: `string` – defaults to current UUID  
* data (required): `{ name?: string, externalId?: string, profileUrl?: string, email?: string, custom?: any }` (custom values scalar only)  
* include: `{ customFields?: boolean=true }`  
* ifMatchesEtag: `string` – supply previous eTag to enforce conditional update (HTTP 412 if mismatched)

```
  
```
```json
{
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
```

---

### Remove user metadata
```js
pubnub.objects.removeUUIDMetadata({ uuid: string })
```
* uuid: `string` – defaults to current UUID  

```
  
```
```json
{ "status": 0, "data": {} }
```

---

## Channels (Channel Metadata)

### Get metadata for all channels
```js
pubnub.objects.getAllChannelMetadata({
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* include: `{ totalCount?: boolean=false, customFields?: boolean=false }`  
* filter, sort, limit (100), page – same usage as UUID list

```
  
```
```json
{
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
```
show all 35 lines
```

---

### Get channel metadata
```js
pubnub.objects.getChannelMetadata({
  channel: string,
  include: any
})
```
* channel (required)  
* include: `{ customFields?: boolean=true }`

```
  
```
```json
{
  "status": 200,
  "data": {
    "id": "team.blue",
    "name": "Blue Team",
    "description": "The channel for Blue team and no other teams.",
    "updated": "2019-02-20T23:11:20.893755",
    "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="
  }
}
```

---

### Set channel metadata
```js
pubnub.objects.setChannelMetadata({
  channel: string,
  data: any,
  include: any,
  ifMatchesEtag: string
})
```
* channel (required)  
* data (required): `{ name?: string, description?: string, custom?: any }`  
* include: `{ customFields?: boolean=true }`  
* ifMatchesEtag: conditional update

```
  
```
```json
{
  "status": 200,
  "data": {
    "id": "team.red",
    "name": "Red Team",
    "description": "The channel for Blue team and no other teams.",
    "updated": "2019-02-20T23:11:20.893755",
    "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="
  }
}
```

Other example – iterative update  
```
  
```

---

### Remove channel metadata
```js
pubnub.objects.removeChannelMetadata({ channel: string })
```
* channel (required)

```
  
```
```json
{ "status": 0, "data": {} }
```

---

## Channel Memberships (Channels a UUID belongs to)

### Get channel memberships
```js
pubnub.objects.getMemberships({
  uuid: string,
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* uuid: defaults to current UUID  
* include: `{ totalCount?:boolean, customFields?:boolean, channelFields?:boolean,
             customChannelFields?:boolean, statusField?:boolean,
             channelStatusField?:boolean, channelTypeField?:boolean }`  
* filter, sort (`updated|status|type|channel.*`), limit, page

```
  
```
```json
{
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
      "custom": { "starred": false },
```
show all 38 lines
```

---

### Set channel memberships
```js
pubnub.objects.setMemberships({
  uuid: string,
  channels: Array<string|{id:string,custom?:any,type?:string,status?:string}>,
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* channels (required) – see signature for object form  
* include: `totalCount, customFields, statusField, typeField,
            channelFields, customChannelFields,
            channelStatusField, channelTypeField`

```
  
```
```json
{
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
      "custom": { "starred": false },
```
show all 38 lines
```

---

### Remove channel memberships
```js
pubnub.objects.removeMemberships({
  uuid: string,
  channels: string[],
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* channels (required)  
* include: `totalCount, customFields, channelFields, customChannelFields`  

```
  
```
```json
{
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
      "custom": { "starred": false },
```
show all 38 lines
```

---

## Channel Members (UUIDs in a Channel)

### Get channel members
```js
pubnub.objects.getChannelMembers({
  channel: string,
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* include: `{ totalCount, customFields, UUIDFields, customUUIDFields,
             statusField, UUIDStatusField, UUIDTypeField }`  
* sort supports `updated|status|type|uuid.*`

```
  
```
```json
{
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
```
show all 41 lines
```

---

### Set channel members
```js
pubnub.objects.setChannelMembers({
  channel: string,
  uuids: Array<string|{id:string,custom?:any}>,
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* include: `{ totalCount, customFields, statusField, typeField,
             UUIDFields, customUUIDFields, UUIDStatusField, UUIDTypeField }`

```
  
```
```json
{
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
```
show all 41 lines
```

---

### Remove channel members
```js
pubnub.objects.removeChannelMembers({
  channel: string,
  uuids: string[],
  include: any,
  filter: string,
  sort: any,
  limit: number,
  page: any
})
```
* include: `{ totalCount, customFields, UUIDFields, customUUIDFields }`

```
  
```
```json
{
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
```
show all 41 lines
```

_Last updated Jul 15 2025_