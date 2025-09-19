# File Sharing API – C# SDK (condensed)

Upload files ≤ 5 MB to a channel. Subscribers receive a file event containing `ID`, `filename`, and optional `description`.

## Error handling

Use `try/catch`. SDK throws exceptions for invalid parameters; network/server errors are in `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

---

## Send file

Uploads and automatically publishes a file message (internally calls `PublishFileMessage`).

```
`pubnub.SendFile()  
        .Channel(string)  
        .File(string|byte[])  
        .FileName(string)  
        .Message(string)  
        .ShouldStore(bool)  
        .Meta(Dictionarystring, object>)  
        .Ttl(int)  
        .CustomMessageType(string)  
`
```

Parameters  
• `Channel` *(string, required)* – target channel  
• `File` *(string path | byte[])* – file or data; set `FileName` when using `byte[]`  
• `FileName` *(string)* – override default file name  
• `Message` *(string)* – message sent with the file  
• `ShouldStore` *(bool)* – store published message in history  
• `Meta` *(Dictionary<string,object>)* – values used for message filtering  
• `Ttl` *(int)* – message storage time (in minutes)  
• `CustomMessageType` *(string)* – 3–50 char label (alphanumeric, `-`/`_`; cannot start with special chars nor `pn_`/`pn-`)  

Deprecated: `CipherKey` (configure Crypto module instead).

Response

```
`{  
    "Timetoken":15957709330808500,  
    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "FileName":"cat_picture.jpg"  
}  
`
```

Returns `PNResult<PNFileUploadResult>` → `Timetoken`, `FileId`, `FileName`, plus `PNStatus`.

---

## List channel files

```
`pubnub.ListFiles()  
        .Channel(string)  
`
```

Optional: `Limit` *(int, default 100)*, `Next` *(string)*.

Response

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

Returns `PNResult<PNListFilesResult>` → `FilesList` (list of `PNFileResult`), `Count`, `Next`, plus `PNStatus`.

---

## Get file URL

```
`pubnub.GetFileUrl()  
        .Channel(string)  
        .FileId(string)  
        .FileName(string)  
`
```

Response

```
`{  
    "Url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
}  
`
```

Returns `PNResult<PNFileUrlResult>` → `Url`, plus `PNStatus`.

---

## Download file

```
`pubnub.DownloadFile()  
        .Channel(string)  
        .FileId(string)  
        .FileName(string)  
`
```

Deprecated: `CipherKey`.

Response

```
`{  
    //Call fileDownloadResult.SaveFileToLocal() to save file.  
    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
    "FileName":"cat_picture.jpg"  
}  
`
```

Returns `PNResult<PNDownloadFileResult>` → `FileBytes`, `FileName`, `SaveFileToLocal(string)`, plus `PNStatus`.

---

## Delete file

```
`pubnub.DeleteFile()  
        .Channel(string)  
        .FileId(string)  
        .FileName(string)  
`
```

Response

```
`{}  
`
```

Returns `PNResult<PNDeleteFileResult>` (empty `Result`) + `PNStatus`.

---

## Publish file message

Use to re-publish a file message if `SendFile` upload succeeded but message publish failed.

```
`pubnub.PublishFileMessage()  
        .Channel(string)  
        .FileId(string)  
        .FileName(string)  
        .Message(object)  
        .Meta(Dictionarystring, object>)  
        .ShouldStore(bool)  
        .CustomMessageType(string)  
`
```

Parameters identical to `SendFile` (no file data).

Response

```
`{  
    "Timetoken":15957738720237858  
}  
`
```

Returns `PNResult<PNPublishFileMessageResult>` → `Timetoken`, plus `PNStatus`.

---

_Last updated: Jul 15 2025_