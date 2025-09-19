# App Context API – C# SDK (Condensed)

Use App Context (Objects v2) to read/write metadata for users (UUIDs), channels, memberships, and members. All methods are async/fluent and should be wrapped in `try/catch`.  
If SDK parameters are invalid, an exception is thrown; server/network issues are returned inside `PNStatus`.

```csharp
try {
    PNResult<PNPublishResult> res = await pubnub.Publish()
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .Channel("my_channel")
        .ExecuteAsync();

    Console.WriteLine($"Status: {res.Status.StatusCode}");
} catch (Exception ex) {
    Console.WriteLine($"Error: {ex.Message}");
}
```

---

## User (UUID)

### Get metadata for all users
```csharp
pubnub.GetAllUuidMetadata()  
        .IncludeCustom(bool)  
        .IncludeCount(bool)  
        .Page(PNPageObject)  
        .Sort(List<string>)  
        .Filter(string)  
        .Limit(int)  
```
*Parameters*  
`IncludeCustom` (bool) – include `Custom` fields.  
`IncludeCount` (bool) – include total count.  
`Page` (PNPageObject) – pagination.  
`Sort` (List<string>) – `id|name|updated asc|desc`.  
`Filter` (string) – expression.  
`Limit` (int, max 100).

```json
{
  "Uuids": [
    { "Uuid": "uuid-1", "Name": "John Doe", "Email": "jack@twitter.com", "Custom": null, "Updated": "2020-06-17T16:28:14.060718Z" }
  ]
}
```

### Get user metadata
```csharp
pubnub.GetUuidMetadata()  
        .Uuid(string)  
        .IncludeCustom(bool)  
```
*Parameters*  
`Uuid` (string) – defaults to current client.  
`IncludeCustom` (bool).

```json
{ "Uuid": "uuid-1", "Name": "John Doe", "Email": "jack@twitter.com", "Custom": null }
```

### Set user metadata
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
```
*All supplied fields overwrite existing values.*  
`IfMatchesEtag` enforces optimistic locking (HTTP 412 on mismatch).

```json
{ "Uuid": "uuid-1", "Name": "John Doe", "Email": "jack@twitter.com", "Custom": null }
```

### Remove user metadata
```csharp
pubnub.RemoveUuidMetadata().Uuid(string)
```
```json
{}
```

---

## Channel

### Get metadata for all channels
```csharp
pubnub.GetAllChannelMetadata()  
        .IncludeCustom(bool)  
        .IncludeCount(bool)  
        .Page(PNPageObject)  
        .Sort(List<string>)  
        .Filter(string)  
```
```json
{
  "Channels": [
    { "Channel": "my-channel", "Name": "My channel", "Description": "A channel that is mine", "Custom": null }
  ]
}
```

### Get channel metadata
```csharp
pubnub.GetChannelMetadata()  
        .Channel(string)  
        .IncludeCustom(bool)  
```
```json
{ "Channel": "my-channel", "Name": "My channel", "Description": "A channel that is mine", "Custom": null }
```

### Set channel metadata
```csharp
pubnub.SetChannelMetadata()  
        .Channel(string)  
        .Name(string)  
        .Description(string)  
        .Custom(Dictionary<string,object>)  
        .IncludeCustom(bool)  
        .IfMatchesEtag(string)  
```
```json
{ "Channel": "my-channel", "Name": "John Doe", "Description": "sample description", "Custom": { "color": "blue" } }
```

### Remove channel metadata
```csharp
pubnub.RemoveChannelMetadata().Channel(string)
```
```json
{}
```

---

## Channel memberships (channels a user belongs to)

### Get channel memberships
```csharp
pubnub.GetMemberships()  
        .Uuid(string)  
        .Include(PNMembershipField[])  
        .IncludeCount(bool)  
        .Page(PNPageObject)  
```
```json
{ "Memberships": [ { "ChannelMetadata": { "Channel": "my-channel" }, "Custom": { "starred": false } } ] }
```

### Set channel memberships
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
```
`PNMembership` fields: `Channel` (string, required), `Custom` (Dictionary), `Status`, `Type`.

### Remove channel memberships
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
```

### Manage channel memberships (set + remove in one call)
```csharp
pubnub.ManageMemberships()  
        .Uuid(string)  
        .Set(List<PNMembership>)  
        .Remove(List<string>)  
        .Include(PNMembershipField[])  
        .IncludeCount(bool)  
        .Page(PNPageObject)  
        .Sort(List<string>)  
```

---

## Channel members (users in a channel)

### Get channel members
```csharp
pubnub.GetChannelMembers()  
        .Channel(string)  
        .Include(PNChannelMemberField[])  
        .IncludeCount(bool)  
        .Page(PNPageObject)  
        .Sort(List<string>)  
        .Filter(string)  
        .Limit(int)  
```
```json
{ "ChannelMembers": [ { "UuidMetadata": { "Uuid": "uuid-1", "Name": "John Doe" }, "Custom": { "role": "admin" } } ] }
```

### Set channel members
```csharp
pubnub.SetChannelMembers()  
        .Channel(string)  
        .Uuids(List<PNChannelMember>)  
        .Include(PNChannelMemberField[])  
        .Page(PNPageObject)  
        .Sort(List<string>)  
        .Filter(string)  
        .Limit(int)  
```

### Remove channel members
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
        .Async()  
```

```json
{ "ChannelMembers": [ { "UuidMetadata": { "Uuid": "uuid-1", "Name": "John Doe" }, "Custom": { "role": "admin" } } ] }
```

---

_Last updated Jul 15 2025_