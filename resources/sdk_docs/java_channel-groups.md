# Channel Groups API (Java SDK)

## Notes for v9.0.0  
Version 9.0.0 merges Java and Kotlin SDKs, changes client instantiation, async callbacks, and status events. See the Java/Kotlin SDK migration guide for details.

## Channel Group Operations
• You can only *subscribe* to a channel group; publishing must target individual channels.  
• Stream Controller add-on required for all operations below.  
• Max 200 channels may be added per call.

---

## Add Channels

### Method
```
`this.pubnub.addChannelsToChannelGroup()  
    .channelGroup(String)  
    .channels(Array)  
`
```
Parameters  
• `channelGroup` (String): target group  
• `channels` (Array): channels to add  
• `async` (Consumer<Result<PNChannelGroupsAddChannelResult>>)

### Basic Usage
```
`  
`
```

### Response  
No actionable data; inspect `result.isFailure()` or `result.onFailure(...)`.

---

## List Channels

### Method
```
`pubnub.listChannelsForChannelGroup()  
    .channelGroup(String)  
    .async(result -> { /* check result */ });  
`
```
Parameters  
• `channelGroup` (String): group to query  
• `async` (Consumer<Result<PNChannelGroupsAllChannelsResult>>)

### Basic Usage
```
`  
`
```

### Returns  
`PNChannelGroupsAllChannelsResult`  
• `getChannels()` → `List<String>`

---

## Remove Channels

### Method
```
`pubnub.removeChannelsFromChannelGroup()  
    .channelGroup(String)  
    .channels(Array)  
`
```
Parameters  
• `channels` (Array): channels to remove  
• `channelGroup` (String): target group  
• `async` (Consumer<Result<PNChannelGroupsRemoveChannelResult>>)

### Basic Usage
```
`  
`
```

### Response  
No actionable data; inspect `result.isFailure()` or `result.onFailure(...)`.

---

## Delete Channel Group

### Method
```
`pubnub.deleteChannelGroup()  
    .channelGroup(String)  
`
```
Parameters  
• `channelGroup` (String): group to delete  
• `async` (Consumer<Result<PNChannelGroupsDeleteGroupResult>>)

### Basic Usage
```
`  
`
```

### Response  
No actionable data; inspect `result.isFailure()` or `result.onFailure(...)`.

_Last updated: May 28 2025_