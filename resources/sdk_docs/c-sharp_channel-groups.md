# Channel Groups API for C# SDK

Channel groups allow you to bundle channels under a single group name and subscribe to that group to receive messages from all contained channels.

##### Channel group operations
- You can't publish to a channel group. Publish to individual channels instead.

##### Request execution
- Use try/catch. Invalid parameters throw exceptions. If the request reaches the server but fails, details are in the returned status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Adds channels to a channel group.

### Method(s)

Maximum number of channels: 200 per API call.

```
`1pubnub.AddChannelsToChannelGroup()  
2        .ChannelGroup(string)  
3        .Channels(Array)  
4        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (string): Channel group to add channels to.
- Channels (Array): Channels to add.
- QueryParam (Dictionary<string, object>): Optional query string params for debugging.
- Async (PNCallback of PNChannelGroupsAddChannelResult): Deprecated; use ExecuteAsync.
- Execute (PNCallback of PNChannelGroupsAddChannelResult): Deprecated.
- ExecuteAsync: Returns PNResult<PNChannelGroupsAddChannelResult>.

### Sample code

```
1
  

```

### Returns

- PNResult<PNChannelGroupsAddChannelResult>
  - Result (PNChannelGroupsAddChannelResult): Empty object.
  - Status (PNStatus): Status of the request.

## List channels in a channel group

Requires Stream Controller add-on.

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.ListChannelsForChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (string): Channel group to list channels for.
- QueryParam (Dictionary<string, object>): Optional query string params for debugging.
- Async (PNCallback of PNChannelGroupsAllChannelsResult): Deprecated; use ExecuteAsync.
- Execute (PNCallback of PNChannelGroupsAllChannelsResult): Deprecated.
- ExecuteAsync: Returns PNResult<PNChannelGroupsAllChannelsResult>.

### Sample code

```
1
  

```

### Returns

- PNResult<PNChannelGroupsAllChannelsResult>
  - Result (PNChannelGroupsAllChannelsResult)
    - Channels (List<string>): Channels in the group.
  - Status (PNStatus)

## Remove channels from a channel group

Requires Stream Controller add-on.

Removes channels from a channel group.

### Method(s)

```
`1pubnub.RemoveChannelsFromChannelGroup()  
2        .ChannelGroup(string)  
3        .Channels(Array)  
4        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (string): Channel group to remove channels from.
- Channels (Array): Channels to remove.
- QueryParam (Dictionary<string, object>): Optional query string params for debugging.
- Async (PNCallback of PNChannelGroupsRemoveChannelResult): Deprecated; use ExecuteAsync.
- Execute (PNCallback of PNChannelGroupsRemoveChannelResult): Deprecated.
- ExecuteAsync: Returns PNResult<PNChannelGroupsRemoveChannelResult>.

### Sample code

```
1
  

```

### Returns

- PNResult<PNChannelGroupsRemoveChannelResult>
  - Result (PNChannelGroupsRemoveChannelResult): Empty object.
  - Status (PNStatus)

## Delete a channel group

Requires Stream Controller add-on.

Deletes a channel group.

### Method(s)

```
`1pubnub.DeleteChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (string): Channel group to delete.
- QueryParam (Dictionary<string, object>): Optional query string params for debugging.
- Async (PNCallback of PNChannelGroupsDeleteGroupResult): Deprecated; use ExecuteAsync.
- Execute (PNCallback of PNChannelGroupsDeleteGroupResult): Deprecated.
- ExecuteAsync: Returns PNResult<PNChannelGroupsAllChannelsResult>.

### Sample code

```
1
  

```

### Response

```
`1{**2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

Last updated on Sep 3, 2025