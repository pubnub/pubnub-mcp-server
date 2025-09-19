# Channel Groups API (Unity SDK)

Channel Groups let you subscribe to many channels via a single group name.  
Publishing must be done to individual channels (not to the channel-group itself).  
All operations below require the **Stream Controller** add-on to be enabled for the key.

---

## Add channels to a channel group

```csharp
pubnub.AddChannelsToChannelGroup()
      .ChannelGroup(string)
      .Channels(string[])
      .QueryParam(Dictionary<string, object>)
      .Execute(System.Action<PNChannelGroupsAddChannelResult, PNStatus>);
// async version
Task<PNResult<PNChannelGroupsAddChannelResult>> ExecuteAsync();
```

Parameters  
• ChannelGroup (string) – target channel group.  
• Channels (string[]) – up to 200 channels per call.  
• QueryParam (Dictionary<string,object>) – optional URL query parameters.  

Returns `PNResult<PNChannelGroupsAddChannelResult>`  
• Result – empty `PNChannelGroupsAddChannelResult` object.  
• Status – `PNStatus`.

```csharp

```

---

## List channels in a channel group

```csharp
pubnub.ListChannelsForChannelGroup()
      .ChannelGroup(string)
      .QueryParam(Dictionary<string, object>)
      .Execute(System.Action<PNChannelGroupsAllChannelsResult, PNStatus>);
// async version
Task<PNResult<PNChannelGroupsAllChannelsResult>> ExecuteAsync();
```

Parameters  
• ChannelGroup (string) – group to inspect.  
• QueryParam (Dictionary<string,object>) – optional.

Returns `PNResult<PNChannelGroupsAllChannelsResult>`  
• Result.Channels – `List<string>` of channels.  
• Status – `PNStatus`.

```csharp

```

---

## Remove channels from a channel group

```csharp
pubnub.RemoveChannelsFromChannelGroup()
      .ChannelGroup(string)
      .Channels(string[])
      .QueryParam(Dictionary<string, object>)
      .Execute(System.Action<PNChannelGroupsRemoveChannelResult, PNStatus>);
// async version
Task<PNResult<PNChannelGroupsRemoveChannelResult>> ExecuteAsync();
```

Parameters  
• ChannelGroup (string) – group to modify.  
• Channels (string[]) – channels to remove.  
• QueryParam (Dictionary<string,object>) – optional.

Returns `PNResult<PNChannelGroupsRemoveChannelResult>` (empty `Result` object + `PNStatus`).

```csharp

```

---

## Delete a channel group

```csharp
pubnub.DeleteChannelGroup()
      .ChannelGroup(string)
      .QueryParam(Dictionary<string, object>)
      .Execute(System.Action<PNChannelGroupsDeleteGroupResult, PNStatus>);
// async version
Task<PNResult<PNChannelGroupsDeleteGroupResult>> ExecuteAsync();
```

Parameters  
• ChannelGroup (string) – group to delete.  
• QueryParam (Dictionary<string,object>) – optional.

Returns `PNResult<PNChannelGroupsDeleteGroupResult>`  
• Status (int) – HTTP status code.  
• Error  (bool).

```csharp

```

Example response:

```json
{
  "status": 200,
  "message": "OK",
  "service": "channel-registry",
  "error": false
}
```

_Last updated: Jul 15 2025_