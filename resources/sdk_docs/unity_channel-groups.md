# Channel Groups API for Unity SDK

Channel groups let you bundle many channels under a single group name. You can subscribe to a channel group to receive messages from all its member channels.

Channel group operations
- You can't publish to a channel group. Publish to individual channels instead.

## Add channels to a channel group

Requires Stream Controller add-on
- Enable the Stream Controller add-on for your key in the Admin Portal.

Adds channels to a channel group.

### Method(s)

Maximum number of channels
- Up to 200 channels per API call.

```
`1pubnub.AddChannelsToChannelGroup()  
2    .ChannelGroup(string)  
3    .Channels(Array)  
4    .QueryParam(Dictionarystring,object>)  
5    .Execute(System.ActionPNChannelGroupsAddChannelResult, PNStatus>);  
`
```

Parameters
- ChannelGroup (string): The channel group to add the channels to.
- Channels (Array): The channels to add.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Async: PNCallback of type PNChannelGroupsAddChannelResult.
- Execute: System.Action of type PNChannelGroupsAddChannelResult, PNStatus.
- ExecuteAsync: Returns Task<PNResult<PNChannelGroupsAddChannelResult>>.

### Sample code

#### Add channels

Reference code
- Self-contained snippet with imports and console logging.

```
1
  

```

### Returns

The AddChannelsToChannelGroup() operation returns a PNResult<PNChannelGroupsAddChannelResult> with:
- Result (PNChannelGroupsAddChannelResult): The operation result.
- Status (PNStatus): The request status.

PNChannelGroupsAddChannelResult includes:
- PNChannelGroupsAddChannelResult (Object): Empty object.
- PNStatus (Object): Request status, including errors.

## List channels in a channel group

Requires Stream Controller add-on
- Enable the Stream Controller add-on for your key in the Admin Portal.

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.ListChannelsForChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsAllChannelsResult, PNStatus>);  
`
```

Parameters
- ChannelGroup (string): The channel group to fetch channels of.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Async: PNCallback of type PNChannelGroupsAllChannelsResult.
- Execute: System.Action of type PNChannelGroupsAllChannelsResult, PNStatus.
- ExecuteAsync: Returns Task<PNResult<PNChannelGroupsAllChannelsResult>>.

### Sample code

#### List channels

```
1
  

```

### Returns

The ListChannelsForChannelGroup() operation returns a PNChannelGroupsAllChannelsResult with:
- Result (PNChannelGroupsAllChannelsResult): The operation result.
- Status (PNStatus): The request status.

PNChannelGroupsAllChannelsResult includes:
- Channels (List<string>): Channel names in the group.

## Remove channels from a channel group

Requires Stream Controller add-on
- Enable the Stream Controller add-on for your key in the Admin Portal.

Removes channels from a channel group.

### Method(s)

```
`1pubnub.RemoveChannelsFromChannelGroup()  
2    .ChannelGroup(string)  
3    .Channels(Array)  
4    .QueryParam(Dictionarystring,object>)  
5    .Execute((result, status) => {});  
`
```

Parameters
- ChannelGroup (string): The channel group to remove channels from.
- Channels (Array): The channels to remove.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Async: PNCallback of type PNChannelGroupsRemoveChannelResult.
- Execute: System.Action of type PNChannelGroupsRemoveChannelResult.
- ExecuteAsync: Returns Task<PNResult<PNChannelGroupsRemoveChannelResult>>.

### Sample code

#### Remove channels

```
1
  

```

### Returns

The RemoveChannelsFromChannelGroup() operation returns a PNChannelGroupsAddChannelResult with:
- Result (PNChannelGroupsRemoveChannelResult): The operation result.
- Status (PNStatus): The request status.

PNChannelGroupsRemoveChannelResult includes:
- PNChannelGroupsRemoveChannelResult (Object): Empty object.

## Delete a channel group

Requires Stream Controller add-on
- Enable the Stream Controller add-on for your key in the Admin Portal.

Removes a channel group.

### Method(s)

```
`1pubnub.DeleteChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsDeleteGroupResult, PNStatus>);  
`
```

Parameters
- ChannelGroup (string): The channel group to remove.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Async: PNCallback of type PNChannelGroupsDeleteGroupResult.
- Execute: System.Action of type PNChannelGroupsDeleteGroupResult, PNStatus.
- ExecuteAsync: Returns Task<PNResult<PNChannelGroupsDeleteGroupResult>>.

### Sample code

#### Delete channel group

```
1
  

```

### Returns

The DeleteChannelGroup() operation returns a PNResult<PNChannelGroupsDeleteGroupResult> with:
- Status (int): HTTP status code.
- Error (bool): True if the operation failed.

```
`1{**2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

Last updated on Sep 3, 2025**