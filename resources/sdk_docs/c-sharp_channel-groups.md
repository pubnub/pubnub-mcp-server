# Channel Groups API – C# SDK (condensed)

Channel Groups bundle up to thousands of channels under one name.  
• You can **subscribe** to a channel group but **cannot publish** to it (publish to individual channels instead).  
• All operations below require the **Stream Controller** add-on to be enabled for your key.

---

## Error handling

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```
• SDK throws exceptions for bad parameters; network/API errors are reported in `status`.

---

## Add Channels to a Channel Group

```
`pubnub.AddChannelsToChannelGroup()  
        .ChannelGroup(string)  
        .Channels(Array)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• `ChannelGroup` (string) – group to add channels to  
• `Channels` (Array) – channels to add (max 200 per call)  
• `QueryParam` (Dictionary<string,object>) – optional URL query values  
Execution  
• `ExecuteAsync()` → `PNResult<PNChannelGroupsAddChannelResult>`  

Returns  
`PNChannelGroupsAddChannelResult` (empty) + `PNStatus`

---

## List Channels in a Channel Group

```
`pubnub.ListChannelsForChannelGroup()  
        .ChannelGroup(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• `ChannelGroup` (string) – group to query  
• `QueryParam` (Dictionary<string,object>) – optional URL query values  
Execution  
• `ExecuteAsync()` → `PNResult<PNChannelGroupsAllChannelsResult>`  

Returns  
`PNChannelGroupsAllChannelsResult.Channels` → `List<string>` + `PNStatus`

---

## Remove Channels from a Channel Group

```
`pubnub.RemoveChannelsFromChannelGroup()  
        .ChannelGroup(string)  
        .Channels(Array)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• `ChannelGroup` (string) – group to update  
• `Channels` (Array) – channels to remove  
• `QueryParam` (Dictionary<string,object>) – optional URL query values  
Execution  
• `ExecuteAsync()` → `PNResult<PNChannelGroupsRemoveChannelResult>`  

Returns  
`PNChannelGroupsRemoveChannelResult` (empty) + `PNStatus`

---

## Delete a Channel Group

```
`pubnub.DeleteChannelGroup()  
        .ChannelGroup(string)  
        .QueryParam(Dictionarystring,object>)  
`
```

Parameters  
• `ChannelGroup` (string) – group to delete  
• `QueryParam` (Dictionary<string,object>) – optional URL query values  
Execution  
• `ExecuteAsync()` → `PNResult<PNChannelGroupsAllChannelsResult>`  

Success response

```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

_Last updated: Jun 30 2025_