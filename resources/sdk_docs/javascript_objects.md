# PubNub JavaScript SDK – App Context (Objects v2) Quick Reference  

Async style: Callbacks, Promises, or (recommended) `async/await` with `try…catch`.

---

## User (UUID) Metadata  

### Get ALL UUID metadata  

```js
pubnub.objects.getAllUUIDMetadata({
  include: {                         // optional
    totalCount?: boolean,            // default false
    customFields?: boolean           // default false
  },
  filter?: string,                   // see filtering docs
  sort?: {id|name|updated : 'asc'|'desc'|null},
  limit?: number,                    // 1-100, default 100
  page?: {next?: string, prev?: string}
})
```

Response (truncated):

```json
{
  "status": 200,
  "data": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      "email": "johndoe@pubnub.com",
      "updated": "2019-02-20T23:11:20.893755",
      "eTag": "MDcy..."
    }
  ]
}
```

---

### Get one UUID metadata  

```js
pubnub.objects.getUUIDMetadata({
  uuid?: string,                     // default current uuid
  include?: {customFields?: boolean} // default true
})
```

---

### Set UUID metadata  
(complete overwrite of `custom`; use GET-modify-SET for partial updates)

```js
pubnub.objects.setUUIDMetadata({
  uuid?: string,                     // default current uuid
  data: {
    name?: string,
    externalId?: string,
    profileUrl?: string,
    email?: string,
    custom?: {[k:string]: scalar}    // scalars only
  },
  include?: {customFields?: boolean},// default true
  ifMatchesEtag?: string             // optimistic lock
})
```

---

### Remove UUID metadata  

```js
pubnub.objects.removeUUIDMetadata({ uuid?: string })
```

---

## Channel Metadata  

### Get ALL channel metadata  

```js
pubnub.objects.getAllChannelMetadata({
  include?: {totalCount?:boolean, customFields?:boolean},
  filter?: string,
  sort?: {id|name|updated : 'asc'|'desc'|null},
  limit?: number,                    // 1-100
  page?: {next?:string, prev?:string}
})
```

---

### Get one channel metadata  

```js
pubnub.objects.getChannelMetadata({
  channel: string,
  include?: {customFields?:boolean}  // default true
})
```

---

### Set channel metadata  
(`custom` fully replaced on each call)

```js
pubnub.objects.setChannelMetadata({
  channel: string,
  data: {
    name?: string,
    description?: string,
    custom?: {[k:string]: scalar}
  },
  include?: {customFields?: boolean},// default true
  ifMatchesEtag?: string
})
```

---

### Remove channel metadata  

```js
pubnub.objects.removeChannelMetadata({ channel: string })
```

---

## Channel Memberships (User ↔ Channel)  

### Get memberships for a UUID  

```js
pubnub.objects.getMemberships({
  uuid?: string,                     // default current uuid
  include?: {
    totalCount?: boolean,
    customFields?: boolean,
    channelFields?: boolean,
    customChannelFields?: boolean,
    statusField?: boolean,
    channelStatusField?: boolean,
    channelTypeField?: boolean
  },
  filter?: string,
  sort?: {updated|status|type|'channel.*' : 'asc'|'desc'|null},
  limit?: number,                    // 1-100
  page?: {next?:string, prev?:string}
})
```

---

### Set memberships for a UUID  

```js
pubnub.objects.setMemberships({
  uuid?: string,
  channels: (
    string | {                       // add/update
      id: string,
      custom?: object,
      type?: string,
      status?: string
    })[],
  include?, filter?, sort?, limit?, page?
})
```

---

### Remove memberships for a UUID  

```js
pubnub.objects.removeMemberships({
  uuid?: string,
  channels: string[],                // remove
  include?, filter?, sort?, limit?, page?
})
```

---

## Channel Members (Channel ↔ User)  

### Get members of a channel  

```js
pubnub.objects.getChannelMembers({
  channel: string,
  include?: {
    totalCount?: boolean,
    customFields?: boolean,
    UUIDFields?: boolean,
    customUUIDFields?: boolean,
    statusField?: boolean,
    UUIDStatusField?: boolean,
    UUIDTypeField?: boolean
  },
  filter?: string,
  sort?: {updated|status|type|'uuid.*' : 'asc'|'desc'|null},
  limit?: number,                    // 1-100
  page?: {next?:string, prev?:string}
})
```

---

### Set channel members  

```js
pubnub.objects.setChannelMembers({
  channel: string,
  uuids: (
    string | {                       // add/update
      id: string,
      custom?: object,
      type?: string,
      status?: string
    })[],
  include?, filter?, sort?, limit?, page?
})
```

---

### Remove channel members  

```js
pubnub.objects.removeChannelMembers({
  channel: string,
  uuids: string[],                   // remove
  include?, filter?, sort?, limit?, page?
})
```

---

### Sample Responses  
(All mutate-calls return the modified entity/entities inside `"data"` with the associated `eTag` and timestamps. Delete calls return `{ "status": 0, "data": {} }`.)

---

### API Limits  
Maximum field lengths match the REST equivalents; see individual REST docs for:  
• Set User Metadata  
• Set Channel Metadata  
• Set Membership Metadata  
• Set Channel‐Members Metadata

_Last updated: Jun 30 2025_