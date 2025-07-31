# Channel Groups · C# SDK

Channel groups bundle up to thousands of channels under one name.  
• Subscribe to a group; publish to individual channels.  
• All operations require the **Stream Controller** add-on (enable in the Admin Portal).  
• Wrap calls in `try/catch`; SDK throws on invalid arguments, network/server issues are returned in `status`.

```csharp
try
{
    PNResult<PNPublishResult> res = await pubnub.Publish()
        .Channel("my_channel")
        .Message("Why do Java developers wear glasses? Because they can't C#.")
        .ExecuteAsync();

    Console.WriteLine($"Server status code: {res.Status.StatusCode}");
}
catch (Exception ex)
{
    Console.WriteLine($"Request failed: {ex.Message}");
}
```

---

## 1. Add Channels to a Group

```csharp
pubnub.AddChannelsToChannelGroup()
      .ChannelGroup(string)              // REQUIRED
      .Channels(string[])                // REQUIRED (≤ 200 per call)
      .QueryParam(Dictionary<string,object>)
      .ExecuteAsync();                   // returns PNResult<PNChannelGroupsAddChannelResult>
```

Return object:  
• `Result` → `PNChannelGroupsAddChannelResult` (empty)  
• `Status` → `PNStatus`

---

## 2. List Channels in a Group

```csharp
pubnub.ListChannelsForChannelGroup()
      .ChannelGroup(string)              // REQUIRED
      .QueryParam(Dictionary<string,object>)
      .ExecuteAsync();                   // returns PNResult<PNChannelGroupsAllChannelsResult>
```

Return object:  
• `Result.Channels` → `List<string>`  
• `Status` → `PNStatus`

---

## 3. Remove Channels from a Group

```csharp
pubnub.RemoveChannelsFromChannelGroup()
      .ChannelGroup(string)              // REQUIRED
      .Channels(string[])                // REQUIRED
      .QueryParam(Dictionary<string,object>)
      .ExecuteAsync();                   // returns PNResult<PNChannelGroupsRemoveChannelResult>
```

Return object:  
• `Result` → `PNChannelGroupsRemoveChannelResult` (empty)  
• `Status` → `PNStatus`

---

## 4. Delete a Channel Group

```csharp
pubnub.DeleteChannelGroup()
      .ChannelGroup(string)              // REQUIRED
      .QueryParam(Dictionary<string,object>)
      .ExecuteAsync();                   // returns PNResult<PNChannelGroupsAllChannelsResult>
```

Sample response:

```json
{
  "status": 200,
  "message": "OK",
  "service": "channel-registry",
  "error": false
}
```

_Last updated: Jul 15 2025_