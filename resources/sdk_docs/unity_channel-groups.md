# Channel Groups API for Unity SDK

Channel groups bundle thousands of channels into a named group you can subscribe to and receive data from.
- You can't publish to a channel group—only subscribe. To publish, send to individual channels.

##### Channel group operations

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Adds channels to a channel group.

### Method(s)

Maximum number of channels: 200 per API call.

```
`1pubnub.AddChannelsToChannelGroup()  
2    .ChannelGroup(string)  
3    .Channels(Array)  
4    .QueryParam(Dictionarystring,object>)  
5    .Execute(System.ActionPNChannelGroupsAddChannelResult, PNStatus>);  
`
```

Parameters:
- ChannelGroup (string): Group to add channels to.
- Channels (Array): Channels to add.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Execute/Async: Callback receives PNChannelGroupsAddChannelResult and PNStatus. ExecuteAsync returns Task<PNResult<PNChannelGroupsAddChannelResult>>.

### Sample code

#### Add channels

##### Reference code

```
1
  

```

### Returns

AddChannelsToChannelGroup() returns PNResult<PNChannelGroupsAddChannelResult> with:
- Result (PNChannelGroupsAddChannelResult): Operation result.
- Status (PNStatus): Request status.

PNChannelGroupsAddChannelResult:
- PNChannelGroupsAddChannelResult (Object): Empty object.
- PNStatus (Object): Request status, including errors.

## List channels in a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.ListChannelsForChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsAllChannelsResult, PNStatus>);  
`
```

Parameters:
- ChannelGroup (string): Group to fetch channels from.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Execute/Async: Callback receives PNChannelGroupsAllChannelsResult and PNStatus. ExecuteAsync returns Task<PNResult<PNChannelGroupsAllChannelsResult>>.

### Sample code

#### List channels

```
1
  

```

### Returns

ListChannelsForChannelGroup() returns PNChannelGroupsAllChannelsResult with:
- Result (PNChannelGroupsAllChannelsResult): Operation result.
- Status (PNStatus): Request status.

PNChannelGroupsAllChannelsResult:
- Channels (List<string>): Channel names in the group.

## Remove channels from a channel group

Requires Stream Controller add-on (enable in Admin Portal).

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

Parameters:
- ChannelGroup (string): Group to remove channels from.
- Channels (Array): Channels to remove.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Execute/Async: Callback receives PNChannelGroupsRemoveChannelResult and PNStatus. ExecuteAsync returns Task<PNResult<PNChannelGroupsRemoveChannelResult>>.

### Sample code

#### Remove channels

```
1
  

```

### Returns

RemoveChannelsFromChannelGroup() returns a PNChannelGroupsAddChannelResult with:
- Result (PNChannelGroupsRemoveChannelResult): Operation result.
- Status (PNStatus): Request status.

PNChannelGroupsRemoveChannelResult:
- PNChannelGroupsRemoveChannelResult (Object): Empty object.

## Delete a channel group

Requires Stream Controller add-on (enable in Admin Portal).

Removes a channel group.

### Method(s)

```
`1pubnub.DeleteChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsDeleteGroupResult, PNStatus>);  
`
```

Parameters:
- ChannelGroup (string): Group to remove.
- QueryParam (Dictionary<string, object>): Optional query parameters.
- Execute/Async: Callback receives PNChannelGroupsDeleteGroupResult and PNStatus. ExecuteAsync returns Task<PNResult<PNChannelGroupsDeleteGroupResult>>.

### Sample code

#### Delete channel group

```
1
  

```

### Returns

DeleteChannelGroup() returns PNResult<PNChannelGroupsDeleteGroupResult> with:
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