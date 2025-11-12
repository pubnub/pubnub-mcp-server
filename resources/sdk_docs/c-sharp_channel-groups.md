# Channel Groups API for C# SDK

Channel groups bundle many channels under a single name for subscription. You can't publish to a channel group—publish to individual channels instead.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions. If the server request fails, details are in the returned status.

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

##### Requires Stream Controller add-on

Adds channels to a channel group. Maximum 200 channels per API call.

### Method(s)

```
`1pubnub.AddChannelsToChannelGroup()  
2        .ChannelGroup(string)  
3        .Channels(Array)  
4        .QueryParam(Dictionarystring,object>)  
`
```

- ChannelGroup (required) — Type: string. Channel group to add channels to.
- Channels (required) — Type: Array. Channels to add.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debug.
- Async — Type: PNCallback of type PNChannelGroupsAddChannelResult. Deprecated; use ExecuteAsync.
- Execute — Type: PNCallback of type PNChannelGroupsAddChannelResult. Deprecated; use ExecuteAsync.
- ExecuteAsync — Type: None. Returns PNResult<PNChannelGroupsAddChannelResult>.

### Sample code

##### Reference code

```
1
  
```

### Returns

PNResult<PNChannelGroupsAddChannelResult>:
- Result — PNChannelGroupsAddChannelResult (empty object).
- Status — PNStatus.

PNChannelGroupsAddChannelResult:
- PNChannelGroupsAddChannelResult — Object. Empty.
- PNStatus — Object. Request status with error info if any.

## List channels in a channel group

##### Requires Stream Controller add-on

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.ListChannelsForChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

- ChannelGroup (required) — Type: string. Group for which to list channels.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debug.
- Async — Type: PNCallback of type PNChannelGroupsAllChannelsResult. Deprecated; use ExecuteAsync.
- Execute — Type: PNCallback of type PNChannelGroupsAllChannelsResult. Deprecated; use ExecuteAsync.
- ExecuteAsync — Type: None. Returns PNResult<PNChannelGroupsAllChannelsResult>.

### Sample code

#### List channels

```
1
  
```

### Returns

PNResult<PNChannelGroupsAllChannelsResult>:
- Result — PNChannelGroupsAllChannelsResult.
- Status — PNStatus.

PNChannelGroupsAllChannelsResult:
- Channels — List<string>. Channels in the group.

## Remove channels from a channel group

##### Requires Stream Controller add-on

Removes channels from a channel group.

### Method(s)

```
`1pubnub.RemoveChannelsFromChannelGroup()  
2        .ChannelGroup(string)  
3        .Channels(Array)  
4        .QueryParam(Dictionarystring,object>)  
`
```

- ChannelGroup (required) — Type: string. Group to remove channels from.
- Channels (required) — Type: Array. Channels to remove.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debug.
- Async — Type: PNCallback of type PNChannelGroupsRemoveChannelResult. Deprecated; use ExecuteAsync.
- Execute — Type: PNCallback of type PNChannelGroupsRemoveChannelResult. Deprecated; use ExecuteAsync.
- ExecuteAsync — Type: None. Returns PNResult<PNChannelGroupsRemoveChannelResult>.

### Sample code

#### Remove channels

```
1
  
```

### Returns

PNResult<PNChannelGroupsRemoveChannelResult>:
- Result — PNChannelGroupsRemoveChannelResult (empty object).
- Status — PNStatus.

PNChannelGroupsRemoveChannelResult:
- PNChannelGroupsRemoveChannelResult — Object. Empty.

## Delete a channel group

##### Requires Stream Controller add-on

Deletes a channel group.

### Method(s)

```
`1pubnub.DeleteChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

- ChannelGroup (required) — Type: string. Group to delete.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debug.
- Async — Type: PNCallback of type PNChannelGroupsDeleteGroupResult. Deprecated; use ExecuteAsync.
- Execute — Type: PNCallback of type PNChannelGroupsDeleteGroupResult. Deprecated; use ExecuteAsync.
- ExecuteAsync — Type: None. Returns PNResult<PNChannelGroupsAllChannelsResult>.

### Sample code

#### Delete channel group

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