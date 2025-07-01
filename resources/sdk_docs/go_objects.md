# PubNub Go SDK – App Context (Objects v2)

This condensed reference keeps every code block, method signature, parameter list, data-structure definition, and response schema from the full documentation. Only descriptive prose has been trimmed.

---

## User (UUID) Metadata

### Get All UUID Metadata

Method
```
pn.GetAllUUIDMetadata().
    Include([]pubnub.PNUUIDMetadataIncludeCustom).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Filter(string).
    Execute()
```

Parameters  
• Include – []pubnub.PNUUIDMetadataInclude (`pubnub.PNUUIDMetadataIncludeCustom`)  
• Sort – array: id | name | updated (`asc`|`desc`)  
• Limit – int (≤100)  
• Count – bool  
• Start / End – string (pagination cursor)  
• Filter – string (see filtering docs)

Usage
```
package main
import (
    "fmt"
    pubnub "github.com/pubnub/go/v7"
)
func main() {
    config := pubnub.NewConfigWithUserId("myUniqueUserId")
    config.SubscribeKey, config.PublishKey = "demo", "demo"
    pn := pubnub.NewPubNub(config)

    incl := []pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}
    …
}
```

Response (`PNGetAllChannelMetadataResponse`)  
Data []PNUUID • TotalCount int • Next/Prev string

---

### Get UUID Metadata

Method
```
pn.PNUUIDMetadataInclude().
    Include([]pubnub.PNUUIDMetadataIncludeCustom).
    Sort(sort).
    ID(string).
    Execute()
```

Parameters  
• Include – []pubnub.PNUUIDMetadataIncludeCustom  
• Sort – array id|name|updated (`asc`|`desc`)  
• ID – string (defaults to current UUID)

Usage
```
id := "testuuid"
incl := []pubnub.PNUUIDMetadataInclude{
        pubnub.PNUUIDMetadataIncludeCustom,
}
res, status, err := pn.GetUUIDMetadata().
    UUID(id).
    Include(incl).
    Execute()
fmt.Println(res, status, err)
```

Response (`PNGetUUIDMetadataResponse`)  
Data PNUUID

---

### Set UUID Metadata

Method
```
pn.SetUUIDMetadata().
    Include([]pubnub.PNUUIDMetadataIncludeCustom).
    Sort(sort).
    ID(id).
    Name(string).
    ExternalID(string).
    ProfileURL(string).
    Email(string).
    Custom(map[string]interface{}).
    Execute()
```

Parameters  
• Include – []pubnub.PNUUIDMetadataInclude (`Custom`)  
• Sort – array id|name|updated (`asc`|`desc`)  
• ID – string (defaults to current UUID)  
• Name – string  
• ExternalID – string  
• ProfileURL – string  
• Email – string  
• Custom – map[string]interface{}

Usage
```
id, name := "testuuid", "name"
extid, purl, email := "extid", "profileurl", "email"
custom := map[string]interface{}{"a":"b","c":"d"}
incl := []pubnub.PNUUIDMetadataInclude{pubnub.PNUUIDMetadataIncludeCustom}

res, status, err := pn.SetUUIDMetadata().
    UUID(id).
    Name(name).
    ExternalID(extid).
    ProfileURL(purl).
    Email(email).
    Custom(custom).
    Include(incl).
    Execute()
```

Response (`PNSetUUIDMetadataResponse`)  
Data PNUUID

PNUUID object  
ID • Name • ExternalID • ProfileURL • Email • Custom • Updated • ETag

---

### Remove UUID Metadata

Method
```
pn.RemoveUUIDMetadata().
    ID(string).
    Execute()
```

Parameter ID string

Usage
```
id := "testuuid"
res, status, err := pn.RemoveUUIDMetadata().
    UUID(id).
    Execute()
fmt.Println(res, status, err)
```

Response (`PNRemoveUUIDMetadataResponse`) Data interface{}

---

## Channel Metadata

### Get All Channel Metadata

Method
```
pn.GetAllChannelMetadata().
    Include([]pubnub.PNChannelMetadataInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Filter(string).
    Execute()
```

Parameters identical to GetAllUUIDMetadata but using `PNChannelMetadataInclude`.

Usage
```
incl := []pubnub.PNChannelMetadataInclude{
        pubnub.PNChannelMetadataIncludeCustom,
}
res, status, err := pn.GetAllChannelMetadata().
    Include(incl).
    Sort(sort).
    Limit(100).
    Count(true).
    Execute()
```

Response (`PNGetAllChannelMetadataResponse`)  
Data []PNChannel • TotalCount int • Next/Prev string

---

### Get Channel Metadata

Method
```
pn.GetChannelMetadata().
    Include([]pubnub.PNChannelMetadataInclude).
    Sort(sort).
    ID(string).
    Execute()
```

Usage
```
id := "testchannel"
incl := []pubnub.PNChannelMetadataInclude{
        pubnub.PNChannelMetadataIncludeCustom,
}
res, status, err := pn.GetChannelMetadata().
    Include(incl).
    Channel(id).
    Execute()
```

Response (`PNGetChannelMetadataResponse`)  
Data PNChannel

---

### Set Channel Metadata

Method
```
pn.SetChannelMetadata().
    Include([]pubnub.PNChannelMetadataInclude).
    Sort(sort).
    ID(string).
    Name(string).
    Description(string).
    Custom(map[string]interface{}).
    Execute()
```

Usage
```
id, name, desc := "testchannel", "name", "desc"
custom := map[string]interface{}{"a":"b","c":"d"}
incl := []pubnub.PNChannelMetadataInclude{pubnub.PNChannelMetadataIncludeCustom}

res, status, err := pn.SetChannelMetadata().
    Include(incl).
    Channel(id).
    Name(name).
    Description(desc).
    Custom(custom).
    Execute()
```

Response (`PNSetChannelMetadataResponse`) Data PNChannel

PNChannel object  
ID • Name • Description • Custom • Updated • ETag

---

### Remove Channel Metadata

Method
```
pn.RemoveChannelMetadata().
    ID(string).
    Execute()
```

Usage
```
id := "testchannel"
res, status, err := pn.RemoveChannelMetadata().Channel(id).Execute()
```

Response (`PNRemoveChannelMetadataResponse`) Data interface{}

---

## Channel Memberships (per UUID)

### Get Memberships
```
pn.GetMemberships().
    UUID(string).
    Include([]pubnub.PNMembershipsInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Filter(string).
    Execute()
```

Usage
```
inclMemberships := []pubnub.PNMembershipsInclude{
        pubnub.PNMembershipsIncludeCustom,
        pubnub.PNMembershipsIncludeChannel,
        pubnub.PNMembershipsIncludeChannelCustom,
}
res, status, err := pn.GetMemberships().
    UUID("testuuid").
    Include(inclMemberships).
    Limit(100).
    Count(true).
    Execute()
```

Response (`PNGetMembershipsResponse`)  
Data []PNMemberships • TotalCount int • Next/Prev string

PNMemberships object  
ID • Channel PNChannel • Custom • Updated • ETag

---

### Set Memberships
```
pn.SetMemberships().
    UUID(string).
    Set([]pubnub.PNMembershipsSet).
    Include([]pubnub.PNMembershipsInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
inclMemberships := []pubnub.PNMembershipsInclude{
    pubnub.PNMembershipsIncludeCustom,
    pubnub.PNMembershipsIncludeChannel,
    pubnub.PNMembershipsIncludeChannelCustom,
}
custom := map[string]interface{}{"a":"b","c":"d"}
channel := pubnub.PNMembershipsChannel{ID: "testchannel"}
inMem := pubnub.PNMembershipsSet{ID: channel, Custom: custom}
res, status, err := pn.SetMemberships().
    UUID("testuuid").
    Set([]pubnub.PNMembershipsSet{inMem}).
    Include(inclMemberships).
    Execute()
```

Response (`PNSetMembershipsResponse`) same schema as GetMemberships

---

### Remove Memberships
```
pn.RemoveMemberships().
    UUID(string).
    Remove([]pubnub.PNMembershipsRemove).
    Include([]pubnub.PNMembershipsInclude).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
channel := pubnub.PNMembershipsChannel{ID:"testchannel"}
reArrMem := []pubnub.PNMembershipsRemove{{ID: channel}}
res, status, err := pn.RemoveMemberships().
    UUID("testuuid").
    Remove(reArrMem).
    Execute()
```

Response (`PNRemoveMembershipsResponse`) same schema as GetMemberships

---

### Manage Memberships
```
pn.ManageMemberships().
    UUID(string).
    Set([]pubnub.PNMembershipsSet).
    Remove([]pubnub.PNMembershipsRemove).
    Include([]pubnub.PNMembershipsInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
channel := pubnub.PNMembershipsChannel{ID:"testchannel"}
setArr := []pubnub.PNMembershipsSet{{ID:channel}}
remArr := []pubnub.PNMembershipsRemove{{ID:channel}}
res, status, err := pn.ManageMemberships().
    UUID("testuuid").
    Set(setArr).
    Remove(remArr).
    Include(inclMemberships).
    Execute()
```

Response (`PNManageMembershipsResponse`) same schema as GetMemberships

---

## Channel Members (per Channel)

### Get Channel Members
```
pn.GetChannelMembers().
    Channel(string).
    Include(PNChannelMembersInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Filter(string).
    Execute()
```

Usage
```
inclSm := []pubnub.PNChannelMembersInclude{
    pubnub.PNChannelMembersIncludeCustom,
    pubnub.PNChannelMembersIncludeUUID,
    pubnub.PNChannelMembersIncludeUUIDCustom,
}
res, status, err := pn.GetChannelMembers().
    Channel("testchannel").
    Include(inclSm).
    Limit(100).
    Count(true).
    Execute()
```

Response (`PNGetChannelMembersResponse`)  
Data []PNChannelMembers • TotalCount int • Next/Prev string

PNChannelMembers object  
ID • UUID PNUUID • Custom • Updated • ETag

---

### Set Channel Members
```
pn.SetChannelMembers().
    Channel(string).
    Set([]pubnub.PNChannelMembersSet).
    Include([]pubnub.PNChannelMembersInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
custom := map[string]interface{}{"a":"b","c":"d"}
uuid := pubnub.PNChannelMembersUUID{ID:"testuuid"}
inputUUID := pubnub.PNChannelMembersSet{UUID:uuid, Custom:custom}

res, status, err := pn.SetChannelMembers().
    Channel("testchannel").
    Set([]pubnub.PNChannelMembersSet{inputUUID}).
    Include(inclSm).
    Execute()
```

Response (`PNSetChannelMembersResponse`) same schema as GetChannelMembers

---

### Remove Channel Members
```
pn.RemoveChannelMembers().
    Channel(string).
    Remove([]pubnub.PNChannelMembersRemove{}).
    Include([]pubnub.PNChannelMembersInclude).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
uuid := pubnub.PNChannelMembersUUID{ID:"testuuid"}
reArr := []pubnub.PNChannelMembersRemove{{UUID: uuid}}
res, status, err := pn.RemoveChannelMembers().
    Channel("testchannel").
    Remove(reArr).
    Execute()
```

Response (`PNRemoveChannelMembersResponse`) same schema as GetChannelMembers

---

### Manage Channel Members
```
pn.ManageChannelMembers().
    Channel(string).
    Set([]pubnub.PNChannelMembersSet).
    Remove([]pubnub.PNChannelMembersRemove{}).
    Include([]pubnub.PNChannelMembersInclude).
    Sort(sort).
    Limit(int).
    Count(bool).
    Start(string).
    End(string).
    Execute()
```

Usage
```
inputUUID := pubnub.PNChannelMembersSet{UUID:uuid, Custom:custom}
rem := pubnub.PNChannelMembersRemove{UUID:uuid}
res, status, err := pn.ManageChannelMembers().
    Channel("testchannel").
    Set([]pubnub.PNChannelMembersSet{inputUUID}).
    Remove([]pubnub.PNChannelMembersRemove{rem}).
    Include(inclSm).
    Execute()
```

Response (`PNManageMembersResponse`) same schema as GetChannelMembers

---

_Last updated Mar 31 2025_