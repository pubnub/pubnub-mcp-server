# File Sharing API – Unity SDK (Condensed)

Below are the essential signatures, parameters, responses, and return objects for every file-handling operation.  
All original code blocks are kept verbatim.

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
    .Meta(Dictionarystring, object>)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNFileUploadResult, PNStatus>)  
`
```

Parameters  
• Channel (string, required) – Target channel.  
• File (string path | byte[]) – Full file path or byte array (set FileName when using bytes).  
• Texture (Texture2D | RenderTexture) – Sends Unity texture; size/format auto-added to message.  
• FileName (string) – Overrides default name / required for byte[].  
• Ttl (int) – Message TTL.  
• ShouldStore (bool) – Store publish in History.  
• Message (string) – Optional message payload.  
• Meta (Dictionary<string,object>) – Values used for message filtering.  
• CustomMessageType (string) – 3–50 chars label (no leading special chars, “pn_”, “pn-”).  
• Execute / ExecuteAsync – Callback or Task.

Deprecated: `CipherKey` (use Crypto Module).

#### Sample code
```
`  
`
```

#### Response
```
`{  
    "Timetoken":15957709330808500,  
    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "FileName":"cat_picture.jpg"  
}  
`
```

Returns  
`PNResult<PNFileUploadResult>` →  
• Result: Timetoken (long), FileId (string), FileName (string)  
• Status: PNStatus

---

## List channel files

### Method
```
`pubnub.ListFiles()  
    .Channel(string)  
    .Limit(int)  
    .Next(string)  
    .QueryParam(Dictionarystring, object>)  
    .Execute(System.ActionPNListFilesResult, PNStatus>)  
`
```

Parameters  
• Channel (string, required) – Channel to query.  
• Limit (int, default 100) – Max files per page.  
• Next (string) – Forward-pagination cursor.  
• QueryParam (Dictionary<string,object>) – Extra query args.  
• Execute / ExecuteAsync – Callback or Task.

#### Sample code
```
`  
`
```

#### Response
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

Returns  
`PNResult<PNListFilesResult>` →  
• FilesList (List<PNFileResult>), Count (int), Next (string)  
• Each PNFileResult: Name, Id, Size, Created

---

## Get file URL

### Method
```
`pubnub.GetFileUrl()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNFileUrlResult, PNStatus>)  
`
```

Parameters  
• Channel (string, required)  
• FileId (string, required)  
• FileName (string, required)  
• Execute / ExecuteAsync

#### Sample code
```
`  
`
```

Returns  
`PNResult<PNFileUrlResult>` → Url (string) in Result + Status

---

## Download file

### Method
```
`pubnub.DownloadFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNDownloadFileResult, PNStatus>)  
`
```

Parameters identical to GetFileUrl.  
Deprecated: `CipherKey`.

#### Sample code
```
`  
`
```

#### Response
```
`{  
    //Call fileDownloadResult.SaveFileToLocal() to save file.  
    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
    "FileName":"cat_picture.jpg"  
}  
`
```

Returns  
`PNResult<PNDownloadFileResult>` →  
• FileBytes (byte[]), FileName (string), SaveFileToLocal(string) helper  
• Status

---

## Delete file

### Method
```
`pubnub.DeleteFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNDeleteFileResult, PNStatus>)  
`
```

Parameters  
• Channel, FileId, FileName (all required)  
• Execute / ExecuteAsync

#### Sample code
```
`  
`
```

#### Response
```
`{}  
`
```

Returns  
`PNResult<PNDeleteFileResult>` (empty Result) + Status

---

## Publish file message

### Method
```
`pubnub.PublishFileMessage()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Message(object)  
    .Meta(Dictionarystring, object>)  
    .ShouldStore(bool)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNPublishFileMessageResult, PNStatus>)  
`
```

Parameters  
• Channel, FileId, FileName (required)  
• Message (object) – Payload  
• Meta (Dictionary<string,object>) – For filtering  
• ShouldStore (bool, default true) – History storage  
• CustomMessageType (string) – 3–50 chars label  
• Execute / ExecuteAsync

#### Sample code
```
`  
`
```

#### Response
```
`{  
    "Timetoken":15957738720237858  
}  
`
```

Returns  
`PNResult<PNPublishFileMessageResult>` → Timetoken (long) + Status