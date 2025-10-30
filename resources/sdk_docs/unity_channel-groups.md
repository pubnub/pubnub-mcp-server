# Channel Groups API for Unity SDK

Channel groups allow bundling thousands of channels into a named group. You can subscribe to a channel group but can't publish to it. To publish, send to each channel individually.

Note: All operations below require the Stream Controller add-on enabled for your key in the Admin Portal.

##### Channel group operations
- You can't publish to a channel group. Subscribe to the group; publish to individual channels.

## Add channels to a channel group

This function adds channels to a channel group.

### Method(s)

Use the following method in the Unity SDK:

```
`1pubnub.AddChannelsToChannelGroup()  
2    .ChannelGroup(string)  
3    .Channels(Array)  
4    .QueryParam(Dictionarystring,object>)  
5    .Execute(System.ActionPNChannelGroupsAddChannelResult, PNStatus>);  
`
```

- Maximum number of channels: You can add up to 200 channels per API call.
- Parameters:
  - ChannelGroup — Type: string. The ChannelGroup to add the channels to.
  - Channels — Type: Array. The Channels to add to the channel group.
  - QueryParam — Type: Dictionary<string, object>. Name-value pairs to include as query parameters.
- Async:
  - Async — Type: PNCallback of type PNChannelGroupsAddChannelResult.
  - Execute — Type: System.Action of type PNChannelGroupsAddChannelResult.
  - ExecuteAsync — Returns Task<PNResult<PNChannelGroupsAddChannelResult>>.

### Sample code

#### Add channels

##### Reference code

```
1
  

```

### Returns

The AddChannelsToChannelGroup() operation returns a PNResult<PNChannelGroupsAddChannelResult> with:
- Result — PNChannelGroupsAddChannelResult. The operation result.
- Status — PNStatus. The request status.

PNChannelGroupsAddChannelResult includes:
- PNChannelGroupsAddChannelResult — Object. Empty object.
- PNStatus — Object. Request status, including errors.

## List channels in a channel group

This function lists all channels in a channel group.

### Method(s)

Use the following method in the Unity SDK:

```
`1pubnub.ListChannelsForChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsAllChannelsResult, PNStatus>);  
`
```

- Parameters:
  - ChannelGroup — Type: string. The channel group to fetch the channels of.
  - QueryParam — Type: Dictionary<string, object>. Name-value pairs to include as query parameters.
- Async:
  - Async — Type: PNCallback of type PNChannelGroupsAllChannelsResult.
  - Execute — Type: System.Action of type PNChannelGroupsAllChannelsResult.
  - ExecuteAsync — Returns Task<PNResult<PNChannelGroupsAllChannelsResult>>.

### Sample code

#### List channels

```
1
  

```

### Returns

The ListChannelsForChannelGroup() operation returns a PNChannelGroupsAllChannelsResult with:
- Result — PNChannelGroupsAllChannelsResult. The operation result.
- Status — PNStatus. The request status.

PNChannelGroupsAllChannelsResult includes:
- Channels — List<string>. Channel names in the group.

## Remove channels from a channel group

This function removes channels from a channel group.

### Method(s)

Use the following method in the Unity SDK:

```
`1pubnub.RemoveChannelsFromChannelGroup()  
2    .ChannelGroup(string)  
3    .Channels(Array)  
4    .QueryParam(Dictionarystring,object>)  
5    .Execute((result, status) => {});  
`
```

- Parameters:
  - ChannelGroup — Type: string. The channel group to remove channels from.
  - Channels — Type: Array. The channels to remove.
  - QueryParam — Type: Dictionary<string, object>. Name-value pairs to include as query parameters.
- Async:
  - Async — Type: PNCallback of type PNChannelGroupsRemoveChannelResult.
  - Execute — Type: System.Action of type PNChannelGroupsRemoveChannelResult.
  - ExecuteAsync — Returns Task<PNResult<PNChannelGroupsRemoveChannelResult>>.

### Sample code

#### Remove channels

```
1
  

```

### Returns

The RemoveChannelsFromChannelGroup() operation returns a PNChannelGroupsAddChannelResult with:
- Result — PNChannelGroupsRemoveChannelResult. The operation result.
- Status — PNStatus. The request status.

PNChannelGroupsRemoveChannelResult includes:
- PNChannelGroupsRemoveChannelResult — Object. Empty object.

## Delete a channel group

This function removes a channel group.

### Method(s)

Use the following method in the Unity SDK:

```
`1pubnub.DeleteChannelGroup()  
2    .ChannelGroup(string)  
3    .QueryParam(Dictionarystring,object>)  
4    .Execute(System.ActionPNChannelGroupsDeleteGroupResult, PNStatus>);  
`
```

- Parameters:
  - ChannelGroup — Type: string. The channel group to remove.
  - QueryParam — Type: Dictionary<string, object>. Name-value pairs to include as query parameters.
- Async:
  - Async — Type: PNCallback of type PNChannelGroupsDeleteGroupResult.
  - Execute — Type: System.Action of type PNChannelGroupsDeleteGroupResult.
  - ExecuteAsync — Returns Task<PNResult<PNChannelGroupsDeleteGroupResult>>.

### Sample code

#### Delete channel group

```
1
  

```

### Returns

The DeleteChannelGroup() operation returns a PNResult<PNChannelGroupsDeleteGroupResult> with:
- Status — int. HTTP status code.
- Error — bool. True if the operation failed.

```
`1{**2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "channel-registry",  
5    "error" : False  
6}  
`
```

Last updated on Sep 3, 2025**