# Channel Groups API for C# SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle thousands of [channels](/docs/general/channels/overview) into a named group. Subscribe to a channel group to receive data from all channels it contains.

- You can't publish to a channel group. Publish to individual channels instead.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions. If the request reaches the server but fails (server/network), error details are in the returned status.

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

Enable Stream Controller for your key in the PubNub [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Adds channels to a channel group.

### Method(s)

Maximum number of channels: up to 200 channels per API call.

```
`1pubnub.AddChannelsToChannelGroup()  
2        .ChannelGroup(string)  
3        .Channels(Array)  
4        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (required) — Type: string. The channel group to add the channels to.
- Channels (required) — Type: Array. The channels to add to the channel group.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debugging.
- Async — Type: PNCallback of type PNChannelGroupsAddChannelResult. Deprecated; use ExecuteAsync instead.
- Execute — Type: PNCallback of type PNChannelGroupsAddChannelResult.
- ExecuteAsync — Returns PNResult<PNChannelGroupsAddChannelResult>.

### Sample code

#### Add channels

```
1
  

```

### Returns

AddChannelsToChannelGroup() returns PNResult<PNChannelGroupsAddChannelResult> with:
- Result — PNChannelGroupsAddChannelResult.
- Status — PNStatus.

PNChannelGroupsAddChannelResult contains:
- PNChannelGroupsAddChannelResult — Object. Empty object.
- PNStatus — Object. Status of request if error occurred or not.

## List channels in a channel group

##### Requires Stream Controller add-on

Enable Stream Controller for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.ListChannelsForChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (required) — Type: string. The channel group for which to list channels.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debugging.
- Async — Type: PNCallback of type PNChannelGroupsAllChannelsResult. Deprecated; use ExecuteAsync instead.
- Execute — Type: PNCallback of type PNChannelGroupsAllChannelsResult.
- ExecuteAsync — Returns PNResult<PNChannelGroupsAllChannelsResult>.

### Sample code

#### List channels

```
1
  

```

### Returns

ListChannelsForChannelGroup() returns PNChannelGroupsAllChannelsResult with:
- Result — PNChannelGroupsAllChannelsResult.
- Status — PNStatus.

PNChannelGroupsAllChannelsResult contains:
- Channels — List<string>. Channels of the channel group.

## Remove channels from a channel group

##### Requires Stream Controller add-on

Enable Stream Controller for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

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
- ChannelGroup (required) — Type: string. The channel group from which to remove the channels.
- Channels (required) — Type: Array. The channels to remove.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debugging.
- Async — Type: PNCallback of type PNChannelGroupsRemoveChannelResult. Deprecated; use ExecuteAsync instead.
- Execute — Type: PNCallback of type PNChannelGroupsRemoveChannelResult.
- ExecuteAsync — Returns PNResult<PNChannelGroupsRemoveChannelResult>.

### Sample code

#### Remove channels

```
1
  

```

### Returns

RemoveChannelsFromChannelGroup() returns a PNChannelGroupsAddChannelResult with:
- Result — PNChannelGroupsRemoveChannelResult.
- Status — PNStatus.

PNChannelGroupsRemoveChannelResult contains:
- PNChannelGroupsRemoveChannelResult — Object. Empty object.

## Delete a channel group

##### Requires Stream Controller add-on

Enable Stream Controller for your key in the [Admin Portal](https://admin.pubnub.com/). See the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-).

Deletes a channel group.

### Method(s)

```
`1pubnub.DeleteChannelGroup()  
2        .ChannelGroup(string)  
3        .QueryParam(Dictionarystring,object>)  
`
```

Parameters:
- ChannelGroup (required) — Type: string. The channel group to delete.
- QueryParam — Type: Dictionary<string, object>. Name/value query params for debugging.
- Async — Type: PNCallback of type PNChannelGroupsDeleteGroupResult. Deprecated; use ExecuteAsync instead.
- Execute — Type: PNCallback of type PNChannelGroupsDeleteGroupResult.
- ExecuteAsync — Returns PNResult<PNChannelGroupsAllChannelsResult>.

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

Last updated on Sep 3, 2025**