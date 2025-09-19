# File Sharing API – Go SDK (Condensed)

Upload, manage, and share files (≤ 5 MB) on PubNub channels. All method signatures, parameters, and examples are preserved below.

---

## Send file

Upload a file and automatically publish its metadata message on the channel.

### Method(s)
```go
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
* **Channel** (string, required) – target channel.  
* **Message** (string) – accompanying text.  
* **Name** (string) – file name.  
* **File** (*os.File, required) – pointer to file.  
* **TTL** (int) – storage time.  
* **ShouldStore** (bool, default `true`) – store in history.  
* **Meta** (interface{}) – filtering metadata.  
* **CustomMessageType** (string) – 3–50 chars label.

Deprecated: `CipherKey` (use Crypto Module).

#### Sample code
```go
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
_show all 49 lines_

#### Returns
`PNSendFileResponse`  
* Data – PNFileData  
* Timestamp – int64

##### PNFileData
* ID – string

---

## List channel files

### Method(s)
```go
`pn.ListFiles().  
    Channel(string).  
    Limit(int).  
    Next(string).  
    Execute()  
`
```

Parameters  
* **Channel** (string, required)  
* **Limit** (int, default 100)  
* **Next** (string) – pagination cursor

#### Sample code
```go
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

#### Returns
`PNListFilesResponse`  
* Data – []PNFileInfo  
* Count – int  
* Next – string

##### PNFileInfo
* Name – string  
* Id – string  
* Size – int  
* Created – string

---

## Get file URL

### Method(s)
```go
`pn.GetFileURL().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters  
* **Channel** (string, required)  
* **ID** (string, required)  
* **Name** (string, required)

#### Sample code
```go
`resGetFileUrl, statusGetFileUrl, errGetFileUrl := pn.GetFileURL()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(resGetFileUrl, statusGetFileUrl, errGetFileUrl)  
fmt.Println(resGetFileUrl.URL)  
`
```

#### Returns
`PNGetFileURLResponse`  
* Url – string

---

## Download file

### Method(s)
```go
`pn.DownloadFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters  
* **Channel** (string, required)  
* **ID** (string, required)  
* **Name** (string, required)

Deprecated: `CipherKey`.

#### Sample code
```go
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

#### Returns
`PNDownloadFileResponse`  
* File – io.Reader

---

## Delete file

### Method(s)
```go
`pn.DeleteFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

Parameters  
* **Channel** (string, required)  
* **ID** (string, required)  
* **Name** (string, required)

#### Sample code
```go
`_, statusDelFile, errDelFile := pn.DeleteFile()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(statusDelFile, errDelFile)  
`
```

#### Returns
`PNDeleteFileResponse` (nil)

---

## Publish file message

Send a file message if `SendFile` upload succeeded but publish failed.

### Method(s)
```go
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
* **TTL** (int)  
* **Meta** (interface{})  
* **ShouldStore** (bool, default `true`)  
* **Channel** (string, required)  
* **Message** (PNPublishFileMessage, required)  
* **CustomMessageType** (string)

#### Sample code
```go
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
_show all 20 lines_

#### Returns
`PublishFileMessageResponse`  
* Timetoken – int64

---

Last updated **Jul 15 2025**