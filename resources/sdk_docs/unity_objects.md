# PubNub Unity SDK – App Context (Objects)

This condensed reference keeps every code block, method signature, parameter description, example, and response. All repetitive prose has been removed.

---

## User

### Get Metadata for All Users

Method
```csharp
pubnub.GetAllUuidMetadata()
    .IncludeCustom(bool)
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNGetAllUuidMetadataResult, PNStatus>)
```
* IncludeCustom – bool  
* IncludeCount – bool  
* Page – PNPageObject  
* Sort – List\<string> (`id`, `name`, `updated`; `asc|desc`)  
* Filter – string (see filtering docs)  
* Limit – int (default/max = 100)  
* ExecuteAsync → Task\<PNResult\<PNGetAllUuidMetadataResult>>

Example
```csharp
using PubnubApi;
using PubnubApi.Unity;
using UnityEngine;

public class GetAllUuidMetadataExample : MonoBehaviour {
    [SerializeField] PNManagerBehaviour pubnubManager;
    async void Start() {
        var pubnub = pubnubManager.pubnub;
        var res = await pubnub.GetAllUuidMetadata()
            .IncludeCustom(true)
            .IncludeCount(true)
            .ExecuteAsync();
    }
}
```
Response
```json
{
  "Uuids":[
    { "Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com","Updated":"2020-06-17T16:28:14.060718Z"},
    { "Uuid":"uuid-2","Name":"Bob Cat","Email":"bobc@example.com"}
  ]
}
```

---

### Get User Metadata
```csharp
pubnub.GetUuidMetadata()
    .Uuid(string)
    .IncludeCustom(bool)
    .Execute(Action<PNGetUuidMetadataResult, PNStatus>)
```
* Uuid – string (default = current)  
* IncludeCustom – bool  

Example
```csharp
// Current UUID
var r1 = await pubnub.GetUuidMetadata().ExecuteAsync();
// Specific UUID
var r2 = await pubnub.GetUuidMetadata()
    .Uuid("my-uuid")
    .ExecuteAsync();
```
Response
```json
{ "Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com","Updated":"2020-06-17T16:28:14.060718Z"}
```

---

### Set User Metadata  
(Calling this overwrites existing custom data.)

```csharp
pubnub.SetUuidMetadata()
    .Uuid(string)
    .Name(string)
    .Email(string)
    .ExternalId(string)
    .ProfileUrl(string)
    .Custom(Dictionary<string,object>)
    .IncludeCustom(bool)
    .IfMatchesEtag(string)
    .Execute(Action<PNSetUuidMetadataResult, PNStatus>)
```
* Uuid – string (default = current)  
* Name, Email, ExternalId, ProfileUrl – string  
* Custom – Dictionary<string,object>  
* IfMatchesEtag – string  
* IncludeCustom – bool  

Example
```csharp
var resp = await pubnub.SetUuidMetadata()
    .Uuid(config.Uuid)
    .Name("John Doe")
    .Email("john.doe@user.com")
    .ExecuteAsync();
```
Response
```json
{ "Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com","Updated":"2020-06-17T16:28:14.060718Z"}
```

---

### Remove User Metadata
```csharp
pubnub.RemoveUuidMetadata()
    .Uuid(string)
    .Execute(Action<PNRemoveUuidMetadataResult, PNStatus>)
```
Example
```csharp
var rm = await pubnub.RemoveUuidMetadata().ExecuteAsync();
```
Response
```json
{}
```

---

## Channel

### Get Metadata for All Channels
```csharp
pubnub.GetAllChannelMetadata()
    .IncludeCustom(bool)
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Execute(Action<PNGetAllChannelMetadataResult, PNStatus>)
```
Example
```csharp
var ch = await pubnub.GetAllChannelMetadata()
    .IncludeCount(true)
    .IncludeCustom(true)
    .ExecuteAsync();
```
Response
```json
{
  "Channels":[
    {"Channel":"my-channel","Name":"My channel","Description":"A channel that is mine","Updated":"2020-06-17T16:52:19.562469Z"}
  ]
}
```

---

### Get Channel Metadata
```csharp
pubnub.GetChannelMetadata()
    .Channel(string)
    .IncludeCustom(bool)
    .Execute(Action<PNGetChannelMetadataResult, PNStatus>)
```
Example
```csharp
var ch = await pubnub.GetChannelMetadata()
    .Channel("my-channel")
    .IncludeCustom(true)
    .ExecuteAsync();
```

### Set Channel Metadata  
(Custom overwrite behaviour identical to user metadata.)
```csharp
pubnub.SetChannelMetadata()
    .Channel(string)
    .Name(string)
    .Description(string)
    .Custom(Dictionary<string,object>)
    .IncludeCustom(bool)
    .IfMatchesEtag(string)
    .Execute(Action<PNSetChannelMetadataResult, PNStatus>)
```
Example
```csharp
var set = await pubnub.SetChannelMetadata()
    .Channel("my-channel")
    .Name("John Doe")
    .Description("sample description")
    .Custom(new Dictionary<string,object>{{"color","blue"}})
    .IncludeCustom(true)
    .ExecuteAsync();
```
Response
```json
{ "Channel":"my-channel","Name":"John Doe","Description":"sample description","Custom":{"color":"blue"} }
```

Iterative update example (truncated):
```csharp
using System.Collections.Generic;
using PubnubApi;
// ...
```

### Remove Channel Metadata
```csharp
pubnub.RemoveChannelMetadata()
    .Channel(string)
    .Execute(Action<PNRemoveChannelMetadataResult, PNStatus>)
```
Example
```csharp
var rm = await pubnub.RemoveChannelMetadata()
    .Channel("mychannel")
    .ExecuteAsync();
```

---

## Channel Memberships (User ↔ Channel)

### Get Channel Memberships
```csharp
pubnub.GetMemberships()
    .Uuid(string)
    .Include(PNMembershipField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Execute(Action<PNGetMembershipsResult, PNStatus>)
```
Example
```csharp
var mem = await pubnub.GetMemberships()
    .Uuid("my-uuid")
    .Include(new[]{PNMembershipField.CUSTOM,PNMembershipField.CHANNEL,PNMembershipField.CHANNEL_CUSTOM})
    .IncludeCount(true)
    .ExecuteAsync();
```

### Set Channel Memberships
```csharp
pubnub.SetMemberships()
    .Uuid(string)
    .Channels(List<PNMembership>)
    .Include(PNMembershipField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNMembershipsResult, PNStatus>)
```
PNMembership
* Channel – string  
* Custom – Dictionary<string,object>  
* Status, Type – string  

Example
```csharp
var list = new List<PNMembership>{
  new PNMembership{Channel="my-channel",Custom=new Dictionary<string,object>{{"item","book"}}}
};
var set = await pubnub.SetMemberships()
    .Uuid("my-uuid")
    .Channels(list)
    .IncludeCount(true)
    .ExecuteAsync();
```

### Remove Channel Memberships
```csharp
pubnub.RemoveMemberships()
    .Uuid(string)
    .Channels(List<string>)
    .Include(PNMembershipField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNMembershipsResult, PNStatus>)
```
Example
```csharp
var rm = await pubnub.RemoveMemberships()
    .Uuid("uuid")
    .Channels(new List<string>{"my-channel","your-channel"})
    .IncludeCount(true)
    .ExecuteAsync();
```

### Manage Channel Memberships (set + remove)
```csharp
pubnub.ManageMemberships()
    .Uuid(string)
    .Set(List<PNMembership>)
    .Remove(List<string>)
    .Include(PNMembershipField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Execute(Action<PNMembership, PNStatus>)
```
Example
```csharp
var setList = new List<PNMembership>{
  new PNMembership{Channel="ch1",Custom=new Dictionary<string,object>{{"say","hello"}}},
  new PNMembership{Channel="ch2",Custom=new Dictionary<string,object>{{"say","world"}}}
};
var rmList = new List<string>{"ch4"};
var res = await pubnub.ManageMemberships()
    .Uuid("my-uuid")
    .Set(setList)
    .Remove(rmList)
    .IncludeCount(true)
    .ExecuteAsync();
```

---

## Channel Members (Channel ↔ User)

### Get Channel Members
```csharp
pubnub.GetChannelMembers()
    .Channel(string)
    .Include(PNChannelMemberField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNChannelMembersResult, PNStatus>)
```
Example
```csharp
var mem = await pubnub.GetChannelMembers()
    .Channel("my-channel")
    .Include(new[]{PNChannelMemberField.CUSTOM,PNChannelMemberField.UUID,PNChannelMemberField.UUID_CUSTOM})
    .IncludeCount(true)
    .ExecuteAsync();
```

### Set Channel Members
```csharp
pubnub.SetChannelMembers()
    .Channel(string)
    .Uuids(List<PNChannelMember>)
    .Include(PNChannelMemberField[])
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNChannelMembersResult, PNStatus>)
```
Example
```csharp
var list = new List<PNChannelMember>{
  new PNChannelMember{Uuid="my-uuid",Custom=new Dictionary<string,object>{{"planet","earth"}}}
};
var set = await pubnub.SetChannelMembers()
    .Channel("my-channel")
    .Uuids(list)
    .IncludeCount(true)
    .ExecuteAsync();
```

### Remove Channel Members
```csharp
pubnub.RemoveChannelMembers()
    .Channel(string)
    .Uuids(List<string>)
    .Include(PNChannelMemberField[])
    .IncludeCount(bool)
    .Page(PNPageObject)
    .Sort(List<string>)
    .Filter(string)
    .Limit(int)
    .Execute(Action<PNChannelMembersResult, PNStatus>)
```
Example
```csharp
var rm = await pubnub.RemoveChannelMembers()
    .Channel("my-channel")
    .Uuids(new List<string>{"my-uuid","your-uuid"})
    .IncludeCount(true)
    .ExecuteAsync();
```

---

_Last updated May 6 2025_