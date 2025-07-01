# PubNub C# SDK – App Context (Objects v2)

Use App Context to store and manage user/channel metadata and membership information. All calls are async and should be wrapped in `try/catch`.

```csharp
try {
    PNResult<PNPublishResult> res = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    Console.WriteLine(res.Status.StatusCode);
} catch (Exception ex) {
    Console.WriteLine($"Error: {ex.Message}");
}
```

---

## User

### Get Metadata for All Users
```csharp
pubnub.GetAllUuidMetadata()
      .IncludeCustom(bool)
      .IncludeCount(bool)
      .Page(PNPageObject)
      .Sort(List<string>)
      .Filter(string)
      .Limit(int);
```
Parameters  
• IncludeCustom – return `custom` fields  
• IncludeCount – include total count  
• Page – pagination object  
• Sort – properties: `id`, `name`, `updated` (+ `asc|desc`)  
• Filter – expression (see docs)  
• Limit – max 100 (default 100)

Response (truncated)
```json
{
  "Uuids":[
    {"Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com",...},
    {"Uuid":"uuid-2","Name":"Bob Cat","Email":"bobc@example.com",...}
  ]
}
```

---

### Get User Metadata
```csharp
pubnub.GetUuidMetadata()
      .Uuid(string)
      .IncludeCustom(bool);
```
• Uuid – defaults to current client  
• IncludeCustom – include `custom` fields  

```json
{"Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com",...}
```

---

### Set User Metadata
```csharp
pubnub.SetUuidMetadata()
      .Uuid(string)
      .Name(string)
      .Email(string)
      .ExternalId(string)
      .ProfileUrl(string)
      .Custom(Dictionary<string,object>)
      .IncludeCustom(bool)
      .IfMatchesEtag(string);
```
All supplied fields overwrite existing values (no patch support).  
`IfMatchesEtag` enforces optimistic locking.

```json
{"Uuid":"uuid-1","Name":"John Doe","Email":"jack@twitter.com",...}
```

---

### Remove User Metadata
```csharp
pubnub.RemoveUuidMetadata()
      .Uuid(string);
```
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
      .Filter(string);
```
Same parameter semantics as “Get All Users”.

```json
{
  "Channels":[
    {"Channel":"my-channel","Name":"My channel","Description":"A channel that is mine",...},
    {"Channel":"main","Name":"Main channel","Description":"The main channel","Custom":{"public":true},...}
  ]
}
```

---

### Get Channel Metadata
```csharp
pubnub.GetChannelMetadata()
      .Channel(string)
      .IncludeCustom(bool);
```
```json
{"Channel":"my-channel","Name":"My channel","Description":"A channel that is mine",...}
```

---

### Set Channel Metadata
```csharp
pubnub.SetChannelMetadata()
      .Channel(string)
      .Name(string)
      .Description(string)
      .Custom(Dictionary<string,object>)
      .IncludeCustom(bool)
      .IfMatchesEtag(string);
```
Overwrites existing custom data.

```json
{
  "Channel":"my-channel",
  "Name":"John Doe",
  "Description":"sample description",
  "Custom":{"color":"blue"},
  "Updated":"2020-06-17T16:52:19.562469Z"
}
```

---

### Remove Channel Metadata
```csharp
pubnub.RemoveChannelMetadata()
      .Channel(string);
```
```json
{}
```

---

## Channel Memberships (user-centric)

### Get Channel Memberships
```csharp
pubnub.GetMemberships()
      .Uuid(string)
      .Include(PNMembershipField[])
      .IncludeCount(bool)
      .Page(PNPageObject);
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
      .Limit(int);
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
      .Limit(int);
```

### Manage Channel Memberships (set & remove in one call)
```csharp
pubnub.ManageMemberships()
      .Uuid(string)
      .Set(List<PNMembership>)
      .Remove(List<string>)
      .Include(PNMembershipField[])
      .IncludeCount(bool)
      .Page(PNPageObject)
      .Sort(List<string>);
```

`PNMembership`
```csharp
class PNMembership {
  public string Channel;
  public Dictionary<string,object> Custom;
  public string Status;
  public string Type;
}
```

Sample response (truncated)
```json
{
  "Memberships":[
    {
      "ChannelMetadata":{"Channel":"my-channel","Name":"My channel",...},
      "Custom":{"starred":false},
      "Updated":"2020-06-17T17:05:25.987964Z"
    }
  ]
}
```

---

## Channel Members (channel-centric)

### Get Channel Members
```csharp
pubnub.GetChannelMembers()
      .Channel(string)
      .Include(PNChannelMemberField[])
      .IncludeCount(bool)
      .Page(PNPageObject)
      .Sort(List<string>)
      .Filter(string)
      .Limit(int);
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
      .Limit(int);
```

### Remove Channel Members
```csharp
pubnub.RemoveChannelMembers()
      .Channel(string)
      .Remove(List<string>)
      .Include(PNChannelMembersInclude[])
      .Limit(int)
      .Count(bool)
      .Start(string)
      .End(string)
      .Sort(List<string>)
      .Async();
```

Sample response (truncated)
```json
{
  "ChannelMembers":[
    {
      "UuidMetadata":{"Uuid":"uuid-1","Name":"John Doe",...},
      "Custom":{"role":"admin"}
    }
  ]
}
```

_Last updated: Jun 30 2025_