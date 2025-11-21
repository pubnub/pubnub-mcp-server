# Channel Groups API for Go SDK

Channel groups let you bundle many channels under a single group name for subscription. You can't publish to a channel group; publish to individual channels instead.

## Add channels to a channel group

Requires Stream Controller add-on (enable in Admin Portal). Adds channels to a channel group.

- Limit: up to 200 channels per API call.

### Method(s)

```
`1pn.AddChannelToChannelGroup().  
2    Channels([]string).  
3    ChannelGroup(string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels (required) — Type: []string. Channels to add.
- ChannelGroup (required) — Type: string. Target channel group.
- QueryParam — Type: map[string]string. Extra query string parameters.

### Sample code

```
1
  

```

### Response

```
`1{  
2    "service" : "channel-registry",  
3    "status"  : 200,  
4    "error"   : false,  
5    "message" : "OK"  
6}  
`
```

## List channels in a channel group

Requires Stream Controller add-on. Lists all channels in a channel group.

### Method(s)

```
`1pn.ListChannelsInChannelGroup().  
2    ChannelGroup(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- ChannelGroup (required) — Type: string. Channel group to list.
- QueryParam — Type: map[string]string. Extra query string parameters.

### Sample code

```
1
  

```

### Response

Fields:
- Channels — Type: []string. Required.
- Group — Type: string. Required.

## Remove channels from a channel group

Requires Stream Controller add-on. Removes channels from a channel group.

### Method(s)

```
`1pn.RemoveChannelFromChannelGroup().  
2    ChannelGroup(string).  
3    Channels([]string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- ChannelGroup (required) — Type: string. Group to remove from.
- Channels (required) — Type: []string. Channels to remove.
- QueryParam — Type: map[string]string. Extra query string parameters.

### Sample code

```
1
  

```

### Response

```
`1{  
2    Error:nil>  
3    Category:Unknown  
4    Operation:Remove Channel From Channel Group  
5    StatusCode:200  
6    TLSEnabled:true  
7    UUID:d9713e5a-6bcb-439a-942e-5ba064f2e5dd  
8    AuthKey:  
9    Origin:ps.pndsn.com  
10    OriginalResponse: {  
11        "status": 200,  
12        "message": "OK",  
13        "service": "channel-registry",  
14        "error": false  
15    }  
16    AffectedChannels:[]  
17    AffectedChannelGroups:[]  
18}  
`
```

## Delete a channel group

Requires Stream Controller add-on. Deletes a channel group.

### Method(s)

```
`1pn.DeleteChannelGroup().  
2    ChannelGroup(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- ChannelGroup (required) — Type: string. Group to delete.
- QueryParam — Type: map[string]string. Extra query string parameters.

### Sample code

```
1
  

```

### Response

```
`1{**2    Error:nil>  
3    Category:Unknown  
4    Operation:Remove Channel Group  
5    StatusCode:200  
6    TLSEnabled:true  
7    UUID:650089a0-922c-4de6-b422-7a38a964bf45  
8    AuthKey:  
9    Origin:ps.pndsn.com  
10    OriginalResponse: {  
11        "status": 200,  
12        "message": "OK",  
13        "service": "channel-registry",  
14        "error": false  
15    }  
16    AffectedChannels:[]  
17    AffectedChannelGroups:[]  
18}  
`
```