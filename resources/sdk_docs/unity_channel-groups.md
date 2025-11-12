# Channel Groups API for Unity SDK

Channel groups allow you to bundle thousands of channels into a named group. You can subscribe to a channel group to receive messages from all channels it contains.

Channel group operations
- You can't publish to a channel group. Publish to individual channels instead.

## Add channels to a channel group

Requires Stream Controller add-on

Adds channels to a channel group.

Maximum number of channels
- Up to 200 channels per API call.

### Method(s)

Use in Unity SDK:
```
pubnub.AddChannelsToChannelGroup()
    .ChannelGroup(string)
    .Channels(Array)
    .QueryParam(Dictionary<string, object>)
    .Execute(System.Action<PNChannelGroupsAddChannelResult, PNStatus>);
```

Parameters and options
- ChannelGroup (string, required): Group to add channels to.
- Channels (Array, required): Channels to add.
- QueryParam (Dictionary<string, object>): Query string name-value pairs.
- Execute: System.Action<PNChannelGroupsAddChannelResult, PNStatus>.
- ExecuteAsync: Task<PNResult<PNChannelGroupsAddChannelResult>>.
- PNCallback: PNCallback of type PNChannelGroupsAddChannelResult.

### Sample code

#### Add channels
```
1
  

```

### Returns

AddChannelsToChannelGroup() returns PNResult<PNChannelGroupsAddChannelResult>:
- Result: PNChannelGroupsAddChannelResult (empty result object).
- Status: PNStatus (request status, including errors).

PNChannelGroupsAddChannelResult includes:
- PNChannelGroupsAddChannelResult: Object (empty).
- PNStatus: Object (request status, including errors).

## List channels in a channel group

Requires Stream Controller add-on

Lists all channels in a channel group.

### Method(s)

Use in Unity SDK:
```
pubnub.ListChannelsForChannelGroup()
    .ChannelGroup(string)
    .QueryParam(Dictionary<string, object>)
    .Execute(System.Action<PNChannelGroupsAllChannelsResult, PNStatus>);
```

Parameters and options
- ChannelGroup (string, required): Group to list channels from.
- QueryParam (Dictionary<string, object>): Query string name-value pairs.
- Execute: System.Action<PNChannelGroupsAllChannelsResult, PNStatus>.
- ExecuteAsync: Task<PNResult<PNChannelGroupsAllChannelsResult>>.
- PNCallback: PNCallback of type PNChannelGroupsAllChannelsResult.

### Sample code

#### List channels
```
1
  

```

### Returns

ListChannelsForChannelGroup() returns PNResult<PNChannelGroupsAllChannelsResult>:
- Result: PNChannelGroupsAllChannelsResult.
- Status: PNStatus.

PNChannelGroupsAllChannelsResult includes:
- Channels: List<string> (channel names in the group).

## Remove channels from a channel group

Requires Stream Controller add-on

Removes channels from a channel group.

### Method(s)

Use in Unity SDK:
```
pubnub.RemoveChannelsFromChannelGroup()
    .ChannelGroup(string)
    .Channels(Array)
    .QueryParam(Dictionary<string, object>)
    .Execute((result, status) => {});
```

Parameters and options
- ChannelGroup (string, required): Group to remove channels from.
- Channels (Array, required): Channels to remove.
- QueryParam (Dictionary<string, object>): Query string name-value pairs.
- Execute: System.Action<PNChannelGroupsRemoveChannelResult, PNStatus>.
- ExecuteAsync: Task<PNResult<PNChannelGroupsRemoveChannelResult>>.
- PNCallback: PNCallback of type PNChannelGroupsRemoveChannelResult.

### Sample code

#### Remove channels
```
1
  

```

### Returns

RemoveChannelsFromChannelGroup() returns PNResult<PNChannelGroupsRemoveChannelResult>:
- Result: PNChannelGroupsRemoveChannelResult (empty result object).
- Status: PNStatus.

PNChannelGroupsRemoveChannelResult includes:
- PNChannelGroupsRemoveChannelResult: Object (empty).

## Delete a channel group

Requires Stream Controller add-on

Deletes a channel group.

### Method(s)

Use in Unity SDK:
```
pubnub.DeleteChannelGroup()
    .ChannelGroup(string)
    .QueryParam(Dictionary<string, object>)
    .Execute(System.Action<PNChannelGroupsDeleteGroupResult, PNStatus>);
```

Parameters and options
- ChannelGroup (string, required): Group to remove.
- QueryParam (Dictionary<string, object>): Query string name-value pairs.
- Execute: System.Action<PNChannelGroupsDeleteGroupResult, PNStatus>.
- ExecuteAsync: Task<PNResult<PNChannelGroupsDeleteGroupResult>>.
- PNCallback: PNCallback of type PNChannelGroupsDeleteGroupResult.

### Sample code

#### Delete channel group
```
1
  

```

### Returns

DeleteChannelGroup() returns PNResult<PNChannelGroupsDeleteGroupResult>:
- Status: int (HTTP status code).
- Error: bool (true if operation failed).

Example response:
```
{
    "status" : 200,
    "message" : "OK",
    "service" : "channel-registry",
    "error" : false
}
```