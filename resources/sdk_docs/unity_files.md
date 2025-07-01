# File Sharing API – Unity SDK (Files)

Upload files ≤ 5 MB, publish metadata to a channel, and perform full CRUD + URL operations.

---  

## Send file

### Method
```
`pubnub.SendFile()  
    .Channel(string)  
    .File(string|byte[])  
    .Texture(Texture2D | RenderTexture)  
    .FileName(string)  
    .Ttl(int)  
    .ShouldStore(bool)  
    .Message(string)  
    .Meta(Dictionary<string, object>)  
    .CustomMessageType(string)  
    .Execute(System.Action<PNFileUploadResult, PNStatus>)  
`
```

### Parameters  
* **Channel** *(string, required)* – Target channel.  
* **File** *(string path | byte[])* – Full path or byte[]; if byte[] is used, set `FileName`.  
* **Texture** *(Texture2D | RenderTexture)* – Auto-adds size/format info to `Message`.  
* **FileName** *(string)* – Override default name or required for byte[].  
* **Ttl** *(int)* – Message storage lifetime.  
* **ShouldStore** *(bool)* – Store message in history.  
* **Message** *(string)* – Optional text payload.  
* **Meta** *(Dictionary<string,object>)* – Filtering metadata.  
* **CustomMessageType** *(string)* – 3-50 alphanumeric chars, may include `-` / `_`; must not start with `pn_` or `pn-`.  
* **Execute / ExecuteAsync** – Callback or `Task<PNResult<PNFileUploadResult>>`.

⚠ **CipherKey** parameter is deprecated; configure the crypto module instead (passing it forces legacy 128-bit encryption).

### Basic usage
```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class SendFileExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized string for the channel ID  
    [SerializeField] private string channelId = "my_channel";  
  
    // An editor-serialized string for the file path  
    [SerializeField] private string filePath = "cat_picture.jpg";  
  
`
```
show all 43 lines

### Response
```
`{  
    "Timetoken":15957709330808500,  
    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "FileName":"cat_picture.jpg"  
}  
`
```

### Returns  
`PNResult<PNFileUploadResult>` →  

| Property | Type | Description |
|----------|------|-------------|
| Result   | PNFileUploadResult | Upload info |
| Status   | PNStatus           | Request status |

`PNFileUploadResult`: `Timetoken` *(long)*, `FileId` *(string)*, `FileName` *(string)*.

---  

## List channel files

### Method
```
`pubnub.ListFiles()  
    .Channel(string)  
    .Limit(int)  
    .Next(string)  
    .QueryParam(Dictionary<string, object>)  
    .Execute(System.Action<PNListFilesResult, PNStatus>)  
`
```

### Parameters  
* Channel *(string, required)* – Channel to query.  
* Limit *(int, default 100)* – Max items.  
* Next *(string)* – Pagination cursor.  
* QueryParam *(Dictionary<string,object>)* – Extra URL params.  

### Basic usage
```
`PNResult<PNListFilesResult> listFilesResponse = await pubnub.ListFiles()  
    .Channel("my_channel")  
    .ExecuteAsync();  
PNListFilesResult listFilesResult = listFilesResponse.Result;  
PNStatus listFilesStatus = listFilesResponse.Status;  
if (!listFilesStatus.Error && listFilesResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(listFilesResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(listFilesStatus));  
}  
`
```

### Response
```
`{  
    "FilesList":[  
        {  
            "Name":"cat_picture.jpg",  
            "Id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
            "Size":25778,  
            "Created":"2020-07-26T13:42:06Z"  
        }],  
    "Count":1,  
    "Next":null  
}  
`
```

### Returns  
`PNResult<PNListFilesResult>` →  

`PNListFilesResult`:  
* `FilesList` *(List<PNFileResult>)* – File descriptors.  
* `Count` *(int)* – Returned count.  
* `Next` *(string)* – Pagination cursor.

`PNFileResult`: `Name` *(string)*, `Id` *(string)*, `Size` *(int)*, `Created` *(string)*.

---  

## Get file URL

### Method
```
`pubnub.GetFileUrl()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.Action<PNFileUrlResult, PNStatus>)  
`
```

### Parameters  
* Channel *(string)* – Channel containing the file.  
* FileId *(string)* – Unique file ID.  
* FileName *(string)* – Stored filename.  

### Basic usage
```
`PNResult<PNFileUrlResult> getFileUrlResponse = await pubnub.GetFileUrl()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .ExecuteAsync();  
PNFileUrlResult getFileUrlResult = getFileUrlResponse.Result;  
PNStatus getFileUrlStatus = getFileUrlResponse.Status;  
if (!getFileUrlStatus.Error && getFileUrlResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(getFileUrlResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(getFileUrlStatus));  
}  
`
```

### Response
```
`{  
    "Url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
}  
`
```

### Returns  
`PNResult<PNFileUrlResult>` → `Url` *(string)*.

---  

## Download file

### Method
```
`pubnub.DownloadFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.Action<PNDownloadFileResult, PNStatus>)  
`
```

### Parameters  
* Channel *(string)*  
* FileId *(string)*  
* FileName *(string)*  

⚠ **CipherKey** deprecated – use crypto module; passing it re-enables legacy 128-bit encryption.

### Basic usage
```
`PNResult<PNDownloadFileResult> fileDownloadResponse = await pubnub.DownloadFile()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .CipherKey("my_cipher_key")  
    .ExecuteAsync();  
PNDownloadFileResult fileDownloadResult = fileDownloadResponse.Result;  
PNStatus fileDownloadStatus = fileDownloadResponse.Status;  
if (!fileDownloadStatus.Error && fileDownloadResult != null)  
{  
    fileDownloadResult.SaveFileToLocal(downloadUrlFileName); //saves to bin folder if no path is provided  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(fileDownloadResult.FileName));  
}  
else  
{  
`
```
show all 17 lines

### Response
```
`{  
    //Call fileDownloadResult.SaveFileToLocal() to save file.  
    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
    "FileName":"cat_picture.jpg"  
}  
`
```

### Returns  
`PNResult<PNDownloadFileResult>` →  

`PNDownloadFileResult`:  
* `FileBytes` *(byte[])* – File content.  
* `FileName` *(string)*.  
* `SaveFileToLocal(string)` – Persist to disk.

---  

## Delete file

### Method
```
`pubnub.DeleteFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.Action<PNDeleteFileResult, PNStatus>)  
`
```

### Parameters  
* Channel *(string)*  
* FileId *(string)*  
* FileName *(string)*  

### Basic usage
```
`PNResult<PNDeleteFileResult> deleteFileResponse = await pubnub.DeleteFile()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .ExecuteAsync();  
PNDeleteFileResult deleteFileResult = deleteFileResponse.Result;  
PNStatus deleteFileStatus = deleteFileResponse.Status;  
if (!deleteFileStatus.Error && deleteFileResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(deleteFileResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(deleteFileStatus));  
}  
`
```

### Response
```
`{}  
`
```

### Returns  
`PNResult<PNDeleteFileResult>` – empty result object.

---  

## Publish file message

### Method
```
`pubnub.PublishFileMessage()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Message(object)  
    .Meta(Dictionary<string, object>)  
    .ShouldStore(bool)  
    .CustomMessageType(string)  
    .Execute(System.Action<PNPublishFileMessageResult, PNStatus>)  
`
```

### Parameters  
* Channel *(string, required)*  
* FileId *(string, required)*  
* FileName *(string, required)*  
* Message *(object)* – Payload.  
* Meta *(Dictionary<string,object>)* – Filtering metadata.  
* ShouldStore *(bool, default true)* – Store in history.  
* CustomMessageType *(string)* – Business-specific label (same rules as above).  

### Basic usage
```
`PNResult<PNPublishFileMessageResult> publishFileMsgResponse = await pubnub.PublishFileMessage()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg") //checks the bin folder if no path is provided  
    .Message("This is a sample message")  
    .CustomMessageType("file-message")  
    .ExecuteAsync();  
PNPublishFileMessageResult publishFileMsgResult = publishFileMsgResponse.Result;  
PNStatus publishFileMsgStatus = publishFileMsgResponse.Status;  
if (!publishFileMsgStatus.Error && publishFileMsgResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(publishFileMsgResult));  
}  
else  
{  
`
```
show all 17 lines

### Response
```
`{  
    "Timetoken":15957738720237858  
}  
`
```

### Returns  
`PNResult<PNPublishFileMessageResult>` → `Timetoken` *(long)*.

---

_Last updated: May 6 2025_