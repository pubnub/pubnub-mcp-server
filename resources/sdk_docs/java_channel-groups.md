# Channel Groups API – Java SDK

> PubNub Java SDK v9.0.0 merges Java & Kotlin codebases, introduces a new client constructor, and changes async callbacks/status events. Applications built with <9.0.0 **must** follow the migration guide.

Channel Groups bundle many channels under one name.  
• You can **subscribe**, **not publish**, to a group.  
• Every operation below requires the **Stream Controller** add-on.

---

## Add channels to a channel group
Maximum 200 channels per call.

```java
this.pubnub.addChannelsToChannelGroup()
    .channelGroup(String)
    .channels(Array)
```

Parameter | Type | Description
--------- | ---- | -----------
channelGroup | String | Target group
channels | Array<String> | Channels to add
async | Consumer<Result<PNChannelGroupsAddChannelResult>> | Completion callback

Sample:

```
`  
`
```

Response: no payload—use `result.isFailure()` or `result.onFailure(e -> { ... })`.

---

## List channels in a channel group

```java
pubnub.listChannelsForChannelGroup()
    .channelGroup(String)
    .async(result -> { /* check result */ });
```

Parameter | Type | Description
--------- | ---- | -----------
channelGroup | String | Group to query
async | Consumer<Result<PNChannelGroupsAllChannelsResult>> | Completion callback

Sample:

```
`  
`
```

Return object: `PNChannelGroupsAllChannelsResult`  
• `getChannels()` → `List<String>`

---

## Remove channels from a channel group

```java
pubnub.removeChannelsFromChannelGroup()
    .channelGroup(String)
    .channels(Array)
```

Parameter | Type | Description
--------- | ---- | -----------
channels | Array<String> | Channels to remove
channelGroup | String | Target group
async | Consumer<Result<PNChannelGroupsRemoveChannelResult>> | Completion callback

Sample:

```
`  
`
```

Response: no payload—check `result.isFailure()` / `onFailure`.

---

## Delete a channel group

```java
pubnub.deleteChannelGroup()
    .channelGroup(String)
```

Parameter | Type | Description
--------- | ---- | -----------
channelGroup | String | Group to delete
async | Consumer<Result<PNChannelGroupsDeleteGroupResult>> | Completion callback

Sample:

```
`  
`
```

Response: no payload—check `result.isFailure()` / `onFailure`.

_Last updated: Jul 15 2025_