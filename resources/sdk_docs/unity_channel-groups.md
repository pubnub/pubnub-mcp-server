# Channel Groups – Unity SDK (Condensed)

Channel Groups let you bundle thousands of channels under one name and subscribe to that name (publishing must still occur on individual channels).

All Channel Group operations require the **Stream Controller** add-on (enable it in the Admin Portal).

---

## Add Channels to a Channel Group

Maximum 200 channels per request.

### Method
```
`pubnub.AddChannelsToChannelGroup()  
    .ChannelGroup(string)  
    .Channels(Array)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsAddChannelResult, PNStatus>);  
`
```

Parameters  
• ChannelGroup (string) – target group  
• Channels (array) – channels to add  
• QueryParam (Dictionary<string, object>) – optional URL query pairs  

Async variants  
• Execute(Action<PNChannelGroupsAddChannelResult, PNStatus>)  
• ExecuteAsync() ⇒ Task<PNResult<PNChannelGroupsAddChannelResult>>

### Example
```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class AddChannelsToGroupExample : MonoBehaviour {  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
    [SerializeField] private string channelGroupId = "cg1";  
    [SerializeField] private string[] channelsToAdd = { "ch1", "ch2", "ch3" };  
  
`
```

### Return
PNResult<PNChannelGroupsAddChannelResult>  
• Result – empty object  
• Status – PNStatus

---

## List Channels in a Channel Group

### Method
```
`pubnub.ListChannelsForChannelGroup()  
    .ChannelGroup(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsAllChannelsResult, PNStatus>);  
`
```

### Example
```
`PNResultPNChannelGroupsAllChannelsResult> cgListChResponse = await pubnub.ListChannelsForChannelGroup()  
    .ChannelGroup("cg1")  
    .ExecuteAsync();  
`
```

### Return
PNResult<PNChannelGroupsAllChannelsResult>  
• Result.Channels – List<string>  
• Status – PNStatus

---

## Remove Channels from a Channel Group

### Method
```
`pubnub.RemoveChannelsFromChannelGroup()  
    .ChannelGroup(string)  
    .Channels(Array)  
    .QueryParam(Dictionarystring,object>)  
    .Execute((result, status) => {});  
`
```

### Example
```
`PNResultPNChannelGroupsRemoveChannelResult> rmChFromCgResponse = await pubnub.RemoveChannelsFromChannelGroup()  
    .ChannelGroup("family")  
    .Channels(new string[] {  
        "son"  
    })  
    .Execute((result, status) => {});  
`
```

### Return
PNResult<PNChannelGroupsRemoveChannelResult>  
• Result – empty object  
• Status – PNStatus

---

## Delete a Channel Group

### Method
```
`pubnub.DeleteChannelGroup()  
    .ChannelGroup(string)  
    .QueryParam(Dictionarystring,object>)  
    .Execute(System.ActionPNChannelGroupsDeleteGroupResult, PNStatus>);  
`
```

### Example
```
`PNResultPNChannelGroupsDeleteGroupResult> delCgResponse = await pubnub.DeleteChannelGroup()  
    .ChannelGroup("family")  
    .ExecuteAsync();  
`
```

### Return
PNResult<PNChannelGroupsDeleteGroupResult>  
```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

_Last updated: May 6, 2025_