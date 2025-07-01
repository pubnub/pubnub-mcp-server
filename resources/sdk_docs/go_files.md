# File Sharing API – Go SDK (condensed)

Up to 5 MB per file. All code blocks below are unchanged from the original docs.

---

## SendFile

```
`pn.SendFile().  
    Channel(string).  
    Message(string).  
    Name(string).  
    File(*os.File).  
    TTL(int).  
    ShouldStore(bool).  
    Meta(interface{}).  
    CustomMessageType(string).      
    Execute()  
`
```

Parameters  
• Channel (string, required) – target channel  
• Message (string) – text payload  
• Name (string) – filename (as stored)  
• File (*os.File, required) – open handle (≤ 5 MB)  
• TTL (int) – history retention  
• ShouldStore (bool, default true) – store in history  
• Meta (interface{}) – message filter payload  
• CustomMessageType (string) – 3-50 chars label  

Deprecated: `CipherKey` → use crypto module.

Returns `PNSendFileResponse`  
• Data (PNFileData{ID string})  
• Timestamp (int64)

Example

```
`package main  
  
import (  
	"fmt"  
	"log"  
	"os"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
`
```

---

## List channel files

```
`pn.ListFiles().  
    Channel(string).  
    Limit(int).  
    Next(string).  
    Execute()  
`
```

Parameters  
• Channel (string, required)  
• Limit (int, default 100)  
• Next (string) – pagination cursor  

Returns `PNListFilesResponse`  
• Data ([]PNFileInfo{Id,Name,Size,Created})  
• Count (int)  
• Next (string)

```
`resListFile, statusListFile, errListFile := pn.ListFiles()  
    .Channel("my_channel")  
    .Execute()  
fmt.Println(resListFile, statusListFile, errListFile)  
if resListFile != nil {  
    for _, m := range resListFile.Data {  
        fmt.Println(m.ID, m.Created, m.Name, m.Size)  
    }  
}  
`
```

---

## GetFileURL

```
`pn.GetFileURL().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters: Channel, ID, Name.

Returns `PNGetFileURLResponse{Url string}`

```
`resGetFileUrl, statusGetFileUrl, errGetFileUrl := pn.GetFileURL()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(resGetFileUrl, statusGetFileUrl, errGetFileUrl)  
fmt.Println(resGetFileUrl.URL)  
`
```

---

## DownloadFile

```
`pn.DownloadFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters: Channel, ID, Name.  
Deprecated: `CipherKey`.

Returns `PNDownloadFileResponse{File io.Reader}`

```
`resDLFile, statusDLFile, errDLFile := pn.DownloadFile()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
if resDLFile != nil {  
    filepathOutput := "cat_picture.jpg"  
    out, _ := os.Create(filepathOutput)  
    _, err := io.Copy(out, resDLFile.File)  
  
    if err != nil {  
        fmt.Println(err)  
    }  
}  
`
```

---

## DeleteFile

```
`pn.DeleteFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters: Channel, ID, Name.  
Returns `nil`.

```
`_, statusDelFile, errDelFile := pn.DeleteFile()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(statusDelFile, errDelFile)  
`
```

---

## PublishFileMessage

```
`pn.PublishFileMessage().  
    TTL(int).  
    Meta(interface{}).  
    ShouldStore(bool).  
    Channel(string).  
    Message(PNPublishFileMessage).  
    CustomMessageType(string).  
    Execute()  
`
```

Parameters  
• TTL (int)  
• Meta (interface{})  
• ShouldStore (bool, default true)  
• Channel (string, required)  
• Message (PNPublishFileMessage, required)  
• CustomMessageType (string)

Returns `PublishFileMessageResponse{Timetoken int64}`

```
`m := PNPublishMessage{  
    Text: "Look at this photo!",  
}  
  
file := PNFileInfoForPublish{  
    ID:   "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    Name: "cat_picture.jpg",  
}  
  
message := PNPublishFileMessage{  
    PNFile:    file,  
    PNMessage: m,  
}  
resPubFile, pubFileResponseStatus, errPubFileResponse := pn.PublishFileMessage()  
    .Channel("my_channel")  
`
```

---

_Last updated Mar 31 2025_