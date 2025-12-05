# Channel Groups API for Go SDK

Channel groups let you bundle many channels under a single name and subscribe to them to receive messages from all included channels.

##### Channel group operations
- You can't publish to a channel group; only subscribe to it. Publish to individual channels instead.

## Add channels to a channel group

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal.

Adds channels to a channel group.

### Method(s)
Maximum number of channels: up to 200 channels per API call.

```
`1pn.AddChannelToChannelGroup().  
2    Channels([]string).  
3    ChannelGroup(string).  
4    QueryParam(queryParam).  
5    Execute()  
`
```

Parameters:
- Channels (Type: []string) — The channels to add to the channel group.
- ChannelGroup (Type: string) — The channel group to add the channels to.
- QueryParam (Type: map[string]string) — Keys and values are passed as query string parameters.

### Sample code

#### Add channels
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

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal.

Lists all channels in a channel group.

### Method(s)
```
`1pn.ListChannelsInChannelGroup().  
2    ChannelGroup(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- ChannelGroup (Type: string) — The channel group for which to list channels.
- QueryParam (Type: map[string]string) — Keys and values are passed as query string parameters.

### Sample code

#### List channels
```
1
  

```

### Response
- Channels (Type: []string)
- Group (Type: string)

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal.

Removes channels from a channel group.

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
- ChannelGroup (Type: string) — The channel group from which to remove channels.
- Channels (Type: []string) — The channels to remove.
- QueryParam (Type: map[string]string) — Keys and values are passed as query string parameters.

### Sample code

#### Remove channels
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

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal.

Deletes a channel group.

### Method(s)
```
`1pn.DeleteChannelGroup().  
2    ChannelGroup(string).  
3    QueryParam(queryParam).  
4    Execute()  
`
```

Parameters:
- ChannelGroup (Type: string) — The channel group to delete.
- QueryParam (Type: map[string]string) — Keys and values are passed as query string parameters.

### Sample code

#### Delete channel group
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