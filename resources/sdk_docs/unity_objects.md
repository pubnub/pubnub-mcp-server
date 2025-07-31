# App Context API – Unity SDK (Objects)

Use PubNub App Context to store and manage metadata for users, channels, memberships, and members.  
The following condensed reference keeps every method signature, parameter list, code block, and response sample from the original documentation.

---

## User

### Get metadata for all users

Method(s)
```
pubnub.GetAllUuidMetadata()  
    .IncludeCustom(bool)  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNGetAllUuidMetadataResult, PNStatus>)  
```
* required Parameter | Type | Description  
* IncludeCustom | bool | Fetch `Custom` fields.  
* IncludeCount | bool | Include total count in paginated response.  
* Page | PNPageObject | Pagination cursor.  
* Sort | List<string> | `id`, `name`, `updated` (`asc`/`desc`).  
* Filter | string | [Filtering expression](/docs/general/metadata/filtering).  
* Limit | int | Max 100.  
* Execute | System.Action | Callback (`PNGetAllUuidMetadataResult`).  
* ExecuteAsync | Task<PNResult<PNGetAllUuidMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Uuids": [  
        {  
            "Uuid": "uuid-1",  
            "Name": "John Doe",  
            "Email": "jack@twitter.com",  
            "ExternalId": null,  
            "ProfileUrl": null,  
            "Custom": null,  
            "Updated": "2020-06-17T16:28:14.060718Z"  
        },  
        {  
            "Uuid": "uuid-2",  
            "Name": "Bob Cat",  
            "Email": "bobc@example.com",  
```  
_show all 29 lines_

---

### Get user metadata

Method(s)
```
pubnub.GetUuidMetadata()  
    .Uuid(string)  
    .IncludeCustom(bool)  
    .Execute(System.Action<PNGetUuidMetadataResult, PNStatus>)  
```
* Parameter | Type | Description  
* Uuid | string | User ID (default: current).  
* IncludeCustom | bool | Fetch `Custom` fields.  
* Execute | System.Action | (`PNGetUuidMetadataResult`).  
* ExecuteAsync | Task<PNResult<PNGetUuidMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Uuid": "uuid-1",  
    "Name": "John Doe",  
    "Email": "jack@twitter.com",  
    "ExternalId": null,  
    "ProfileUrl": null,  
    "Custom": null,  
    "Updated": "2020-06-17T16:28:14.060718Z"  
}  
```

---

### Set user metadata

Method(s)
```
pubnub.SetUuidMetadata()  
    .Uuid(string)  
    .Name(string)  
    .Email(string)  
    .ExternalId(string)  
    .ProfileUrl(string)  
    .Custom(Dictionary<string, object>)  
    .IncludeCustom(bool)  
    .IfMatchesEtag(string)  
    .Execute(System.Action<PNSetUuidMetadataResult, PNStatus>)  
```
* Parameter | Type | Description  
* Uuid | string | User ID (default: current).  
* Name | string | Display name.  
* Email | string | Email address.  
* ExternalId | string | External system ID.  
* ProfileUrl | string | Avatar URL.  
* Custom | Dictionary<string, object> | Arbitrary JSON (overwrites existing).  
* IfMatchesEtag | string | Optimistic concurrency (HTTP 412 on mismatch).  
* IncludeCustom | bool | Return `Custom` fields.  
* Execute | System.Action | (`PNSetUuidMetadataResult`).  
* ExecuteAsync | Task<PNResult<PNSetUuidMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Uuid": "uuid-1",  
    "Name": "John Doe",  
    "Email": "jack@twitter.com",  
    "ExternalId": null,  
    "ProfileUrl": null,  
    "Custom": null,  
    "Updated": "2020-06-17T16:28:14.060718Z"  
}  
```

---

### Remove user metadata

Method(s)
```
pubnub.RemoveUuidMetadata()  
    .Uuid(string)  
```
* Parameter | Type | Description  
* Uuid | string | User ID (default: current).  
* Execute | System.Action (`PNRemoveUuidMetadataResult`)  
* ExecuteAsync | Task<PNResult<PNRemoveUuidMetadataResult>>

Sample code
```
  
```

Response
```
{}  
```

---

## Channel

### Get metadata for all channels

Method(s)
```
pubnub.GetAllChannelMetadata()  
    .IncludeCustom(bool)  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Execute(System.Action<PNGetAllChannelMetadataResult, PNStatus>)  
```
* IncludeCustom | bool | Fetch `Custom` fields.  
* IncludeCount | bool | Include total count.  
* Page | PNPageObject | Pagination cursor.  
* Sort | List<string> | `id`, `name`, `updated`.  
* Filter | string | Filter expression.  
* Execute | System.Action (`PNGetAllChannelMetadataResult`)  
* ExecuteAsync | Task<PNResult<PNGetAllChannelMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Channels": [  
        {  
            "Channel": "my-channel",  
            "Name": "My channel",  
            "Description": "A channel that is mine",  
            "Custom": null,  
            "Updated": "2020-06-17T16:52:19.562469Z"  
        },  
        {  
            "Channel": "main",  
            "Name": "Main channel",  
            "Description": "The main channel",  
            "Custom": {  
                "public": true,  
```  
_show all 26 lines_

---

### Get channel metadata

Method(s)
```
pubnub.GetChannelMetadata()  
    .Channel(string)  
    .IncludeCustom(bool)  
```
* Channel | string | Channel name.  
* IncludeCustom | bool | Fetch `Custom` fields.  
* Execute | System.Action (`PNGetChannelMetadataResult`)  
* ExecuteAsync | Task<PNResult<PNGetChannelMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Channel": "my-channel",  
    "Name": "My channel",  
    "Description": "A channel that is mine",  
    "Custom": null,  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
```

---

### Set channel metadata

Method(s)
```
pubnub.SetChannelMetadata()  
    .Channel(string)  
    .Name(string)  
    .Description(string)  
    .Custom(Dictionary<string, object>)  
    .IncludeCustom(bool)  
    .IfMatchesEtag(string)  
    .Execute(System.Action<PNSetChannelMetadataResult, PNStatus>)  
```
* Channel | string | Channel name.  
* Name | string | Channel display name.  
* Description | string | Channel description.  
* Custom | Dictionary<string,object> | Arbitrary JSON (overwrites existing).  
* IncludeCustom | bool | Return `Custom` fields.  
* IfMatchesEtag | string | Optimistic concurrency.  
* Execute | System.Action (`PNSetChannelMetadataResult`)  
* ExecuteAsync | Task<PNResult<PNSetChannelMetadataResult>>

Sample code
```
  
```

Response
```
{  
    "Channel": "my-channel",  
    "Name": "John Doe",  
    "Description": "sample description",  
    "Custom": {  
        "color": "blue"  
    },  
    "Updated": "2020-06-17T16:52:19.562469Z"  
}  
```

Iteratively update example
```
  
```

---

### Remove channel metadata

Method(s)
```
pubnub.RemoveChannelMetadata()  
    .Channel(string)  
```
* Channel | string | Channel name.  
* Execute | System.Action (`PNRemoveChannelMetadataResult`)  
* ExecuteAsync | Task<PNResult<PNRemoveChannelMetadataResult>>

Sample code
```
  
```

Response
```
{}  
```

---

## Channel memberships

### Get channel memberships
```
pubnub.GetMemberships()  
    .Uuid(string)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Execute(System.Action<PNGetMembershipsResult, PNStatus>)  
```
* Uuid | string | User ID (default: current).  
* Include | PNMembershipField[] | Additional fields.  
* IncludeCount | bool | Include total count.  
* Page | PNPageObject | Pagination.  
* Execute | System.Action (`PNGetMembershipsResult`)  
* ExecuteAsync | Task<PNResult<PNGetMembershipsResult>>

Sample code
```
  
```

Response
```
{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
                "Custom": null,  
                "Updated": "2020-06-17T16:55:44.632042Z"  
            },  
            "Custom": {  
                "starred": false  
            },  
            "Updated": "2020-06-17T17:05:25.987964Z"  
        },  
```  
_show all 38 lines_

---

### Set channel memberships
```
pubnub.SetMemberships()  
    .Uuid(string)  
    .Channels(List<PNMembership>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNMembershipsResult, PNStatus>)  
```
PNMembership
* Channel (string) – Channel name  
* Custom (Dictionary<string, object>) – Custom data  
* Status (string) – e.g., "active"  
* Type (string) – Membership category  

Sample code
```
  
```

Response
```
{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
                "Name": "My channel",  
                "Description": "A channel that is mine",  
```  
_show all 38 lines_

---

### Remove channel memberships
```
pubnub.RemoveMemberships()  
    .Uuid(string)  
    .Channels(List<string>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNMembershipsResult, PNStatus>)  
```
Sample code
```
  
```

Response
```
{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
```  
_show all 38 lines_

---

### Manage channel memberships
```
pubnub.ManageMemberships()  
    .Uuid(string)  
    .Set(List<PNMembership>)  
    .Remove(List<string>)  
    .Include(PNMembershipField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Execute(System.Action<PNMembership, PNStatus>)  
```
Sample code
```
  
```

Response
```
{  
    "Memberships": [  
        {  
            "ChannelMetadata": {  
                "Channel": "my-channel",  
```  
_show all 38 lines_

---

## Channel members

### Get channel members
```
pubnub.GetChannelMembers()  
    .Channel(string)  
    .Include(PNChannelMemberField[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNChannelMembersResult, PNStatus>)  
```
Sample code
```
  
```

Response
```
{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
```  
_show all 39 lines_

---

### Set channel members
```
pubnub.SetChannelMembers()  
    .Channel(string)  
    .Uuids(List<PNChannelMember>)  
    .Include(PNChannelMemberField[])  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNChannelMembersResult, PNStatus>)  
```
Sample code
```
  
```

Response
```
{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
```  
_show all 39 lines_

---

### Remove channel members
```
pubnub.RemoveChannelMembers()  
    .Channel(string)  
    .Uuids(List<string>)  
    .Include(PNChannelMembersInclude[])  
    .IncludeCount(bool)  
    .Page(PNPageObject)  
    .Sort(List<string>)  
    .Filter(string)  
    .Limit(int)  
    .Execute(System.Action<PNChannelMembersResult, PNStatus>)  
```
Sample code
```
  
```

Response
```
{  
    "ChannelMembers": [  
        {  
            "UuidMetadata": {  
                "Uuid": "uuid-1",  
                "Name": "John Doe",  
                "Email": "jack@twitter.com",  
```  
_show all 39 lines_

_Last updated Jul 15 2025_