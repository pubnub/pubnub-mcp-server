# PubNub Go SDK – App Context (Objects v2)

Essential information, method signatures, parameters, responses, and ALL original code blocks are retained. Narrative text is reduced.

---

## Users

### Get all UUID metadata
```
`pn.GetAllUUIDMetadata().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()`  
```
Parameters  
• Include – []pubnub.PNUUIDMetadataInclude (values: `pubnub.PNUUIDMetadataIncludeCustom`)  
• Sort – []string (`id`,`name`,`updated` + `asc|desc`)  
• Limit int (default/max 100)  
• Count bool  
• Start, End string (pagination tokens)  
• Filter string (see filtering docs)

Sample
```
`package main  
import ( "fmt"; pubnub "github.com/pubnub/go/v7")  
func main() {  
    config := pubnub.NewConfigWithUserId("myUniqueUserId")  
    config.SubscribeKey, config.PublishKey = "demo", "demo"  
    pn := pubnub.NewPubNub(config)  
    incl := []pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}`  
```
show all 40 lines
Response `PNGetAllChannelMetadataResponse`  
• Data []PNUUID • TotalCount int • Next string • Prev string

---

### Get UUID metadata
```
`pn.PNUUIDMetadataInclude().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    ID(string).  
    Execute()`  
```
Parameters identical to above plus  
• ID string (defaults to caller uuid)

Sample
```
`id := "testuuid"  
incl := []pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}  
res, status, err := pn.GetUUIDMetadata().UUID(id).Include(incl).Execute()`  
```
Response `PNGetUUIDMetadataResponse` → Data PNUUID

---

### Set UUID metadata  
Partial updates of `Custom` overwrite existing data.
```
`pn.SetUUIDMetadata().  
    Include([]pubnub.PNUUIDMetadataIncludeCustom).  
    Sort(sort).  
    ID(id).  
    Name(string).  
    ExternalID(string).  
    ProfileURL(string).  
    Email(string).  
    Custom(map[string]interface{}).  
    Execute()`  
```
Parameters: same as above plus data fields.  
Sample
```
`id:="testuuid"; name:="name"; ...  
custom:=map[string]interface{}{"a":"b","c":"d"}  
incl:=[]pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}  
res,status,err:=pn.SetUUIDMetadata()`  
```
show all 24 lines  
Response `PNSetUUIDMetadataResponse` → Data PNUUID

PNUUID structure  
ID, Name, ExternalID, ProfileURL, Email, Custom, Updated, ETag

---

### Remove UUID metadata
```
`pn.RemoveUUIDMetadata().  
    ID(string).  
    Execute()`  
```
Sample
```
`id := "testuuid"  
res, status, err := pn.RemoveUUIDMetadata().UUID(id).Execute()`  
```
Response `PNRemoveUUIDMetadataResponse` → Data interface{}

---

## Channels

### Get all channel metadata
```
`pn.GetAllChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()`  
```
Parameter semantics identical to user list.

Sample
```
`incl := []pubnub.PNChannelMetadataInclude{pubnub.PNChannelMetadataIncludeCustom}  
res,status,err:=pn.GetAllChannelMetadata().Include(incl).Sort(sort).Limit(100).Count(true).Execute()`  
```
Response `PNGetAllChannelMetadataResponse` → Data []PNChannel …

---

### Get channel metadata
```
`pn.GetChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
    Sort(sort).  
    ID(string).  
    Execute()`  
```
Sample
```
`id:="testchannel"  
incl:=[]pubnub.PNChannelMetadataInclude{pubnub.PNChannelMetadataIncludeCustom}  
res,status,err:=pn.GetChannelMetadata().Include(incl).Channel(id).Execute()`  
```
Response `PNGetChannelMetadataResponse` → Data PNChannel

---

### Set channel metadata  
Custom object overwrites previous value.
```
`pn.SetChannelMetadata().  
    Include([]pubnub.PNChannelMetadataInclude).  
    Sort(sort).  
    ID(string).  
    Name(string).  
    Description(string).  
    Custom(map[string]interface{}).  
    Execute()`  
```
Sample
```
`id:="testchannel"; name:="name"; desc:="desc"  
custom:=map[string]interface{}{"a":"b","c":"d"}  
incl:=[]pubnub.PNChannelMetadataInclude{pubnub.PNChannelMetadataIncludeCustom}  
res,status,err:=pn.SetChannelMetadata().Include(incl).Channel(id).Name(name).Description(desc).Custom(custom).Execute()`  
```
Response `PNSetChannelMetadataResponse` → Data PNChannel

PNChannel: ID, Name, Description, Custom, Updated, ETag

---

### Remove channel metadata
```
`pn.RemoveChannelMetadata().  
    ID(string).  
    Execute()`  
```
Sample
```
`id := "testchannel"  
res,status,err := pn.RemoveChannelMetadata().Channel(id).Execute()`  
```
Response `PNRemoveChannelMetadataResponse` → Data interface{}

---

### Other example – iterative update
```
`package main  
import ( "bufio"; "fmt"; "os"; "strings"; "github.com/pubnub/go/v7")`  
```
show all 119 lines

---

## Channel Memberships (User ↔ Channel)

### Get memberships
```
`pn.GetMemberships().  
    UUID(string).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()`  
```
Sample
```
`inclMemberships:=[]pubnub.PNMembershipsInclude{pubnub.PNMembershipsIncludeCustom,pubnub.PNMembershipsIncludeChannel,pubnub.PNMembershipsIncludeChannelCustom}  
res,status,err:=pn.GetMemberships().UUID("testuuid").Include(inclMemberships).Limit(100).Count(true).Execute()`  
```
Response `PNGetMembershipsResponse` → Data []PNMemberships …

PNMemberships: ID, Channel PNChannel, Custom, Updated, ETag

---

### Set memberships
```
`pn.SetMemberships().  
    UUID(string).  
    Set([]pubnub.PNMembershipsSet).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclMemberships:=[]pubnub.PNMembershipsInclude{...}  
custom:=map[string]interface{}{"a":"b","c":"d"}  
channel:=pubnub.PNMembershipsChannel{ID:"testchannel"}  
inMem:=pubnub.PNMembershipsSet{ID:channel,`  
```
show all 29 lines  
Response `PNSetMembershipsResponse`

### Remove memberships
```
`pn.RemoveMemberships().  
    UUID(string).  
    Remove([]pubnub.PNMembershipsRemove).  
    Include([]pubnub.PNMembershipsInclude).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclMemberships:=[]pubnub.PNMembershipsInclude{...}  
channel:=pubnub.PNMembershipsChannel{ID:"testchannel"}  
reMem:=pubnub.PNMembershipsRemove{ID:channel}`  
```
show all 22 lines  
Response `PNRemoveMembershipsResponse`

### Manage memberships (add/update/remove in one call)
```
`pn.ManageMemberships().  
    UUID(string).  
    Set([]pubnub.PNMembershipsSet).  
    Remove([]pubnub.PNMembershipsRemove).  
    Include([]pubnub.PNMembershipsInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclMemberships:=[]pubnub.PNMembershipsInclude{...}  
custom:=map[string]interface{}{"a":"b"}  
channel:=pubnub.PNMembershipsChannel{ID:"testchannel"}  
inMem:=pubnub.PNMembershipsSet{ID:channel,`  
```
show all 30 lines  
Response `PNManageMembershipsResponse`

---

## Channel Members (Channel ↔ User)

### Get channel members
```
`pn.GetChannelMembers().  
    Channel(string).  
    Include(PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Filter(string).  
    Execute()`  
```
Sample
```
`inclSm:=[]pubnub.PNChannelMembersInclude{pubnub.PNChannelMembersIncludeCustom,pubnub.PNChannelMembersIncludeUUID,pubnub.PNChannelMembersIncludeUUIDCustom}  
res,status,err:=pn.GetChannelMembers().Channel("testchannel").Include(inclSm).Limit(100).Count(true).Execute()`  
```
Response `PNGetChannelMembersResponse`

PNChannelMembers: ID, UUID PNUUID, Custom, Updated, ETag

---

### Set channel members
```
`pn.SetChannelMembers().  
    Channel(string).  
    Set([]pubnub.PNChannelMembersSet).  
    Include([]pubnub.PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclSm:=[]pubnub.PNChannelMembersInclude{...}  
custom:=map[string]interface{}{"a":"b"}  
uuid:=pubnub.PNChannelMembersUUID{ID:"testuuid"}  
inputUUID:=pubnub.PNChannelMembersSet{UUID:uuid,Custom:custom}`  
```
show all 28 lines  
Response `PNSetChannelMembersResponse`

### Remove channel members
```
`pn.RemoveChannelMembers().  
    Channel(string).  
    Remove([]pubnub.PNChannelMembersRemove{}).  
    Include([]pubnub.PNChannelMembersInclude).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclSm:=[]pubnub.PNChannelMembersInclude{...}  
uuid:=pubnub.PNChannelMembersUUID{ID:"testuuid"}  
re:=pubnub.PNChannelMembersRemove{UUID:uuid}`  
```
show all 24 lines  
Response `PNRemoveChannelMembersResponse`

### Manage channel members
```
`pn.ManageChannelMembers().  
    Channel(string).  
    Set([]pubnub.PNChannelMembersSet).  
    Remove([]pubnub.PNChannelMembersRemove{}).  
    Include([]pubnub.PNChannelMembersInclude).  
    Sort(sort).  
    Limit(int).  
    Count(bool).  
    Start(string).  
    End(string).  
    Execute()`  
```
Sample
```
`inclSm:=[]pubnub.PNChannelMembersInclude{...}  
custom:=map[string]interface{}{"a":"b"}  
uuid:=pubnub.PNChannelMembersUUID{ID:"testuuid"}  
inputUUID:=pubnub.PNChannelMembersSet{UUID:uuid,Custom:custom}`  
```
show all 29 lines  
Response `PNManageMembersResponse`

---

_Last updated Jul 15 2025_