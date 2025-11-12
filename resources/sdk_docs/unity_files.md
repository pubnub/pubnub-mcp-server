# File Sharing API for Unity SDK

Upload and share files up to 5 MB. When a file is uploaded to a channel, it's stored with your key. Subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file to a channel and publishes a file message on that channel. Internally calls PublishFileMessage to announce the uploaded file.

### Method(s)

```
`1pubnub.SendFile()  
2    .Channel(string)  
3    .File(string|byte[])  
4    .Texture(Texture2D | RenderTexture)  
5    .FileName(string)  
6    .Ttl(int)  
7    .ShouldStore(bool)  
8    .Message(string)  
9    .Meta(Dictionarystring, object>)  
10    .CustomMessageType(string)  
11    .Execute(System.ActionPNFileUploadResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Target channel.
- File (string | byte[]): Full path with filename, or file bytes. If passing bytes, set FileName.
- Texture (Texture2D | RenderTexture): Optional texture to send. When used, a Message with size and format is added automatically.
- FileName (string): Overrides default filename or required when sending bytes/texture.
- Ttl (int): How long to store the message in channel storage.
- ShouldStore (bool): Whether to store the published file message in history.
- Message (string): Message to send along with the file.
- Meta (Dictionary<string, object>): Metadata used for message filtering.
- CustomMessageType (string): 3–50 char case-sensitive label. Alphanumeric, dashes -, underscores _. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action<PNFileUploadResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNFileUploadResult>>.

Deprecated:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  
```

### Response

```
`1{  
2    "Timetoken":15957709330808500,  
3    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
4    "FileName":"cat_picture.jpg"  
5}  
`
```

### Returns

SendFile returns PNResult<PNFileUploadResult>:
- Result (PNFileUploadResult): 
  - Timetoken (long)
  - FileId (string)
  - FileName (string)
- Status (PNStatus)

---

## List channel files

Retrieve a paginated list of files uploaded to a channel.

### Method(s)

```
`1pubnub.ListFiles()  
2    .Channel(string)  
3    .Limit(int)  
4    .Next(string)  
5    .QueryParam(Dictionarystring, object>)  
6    .Execute(System.ActionPNListFilesResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Channel to list files for.
- Limit (int, default 100): Number of files to return.
- Next (string): Server-provided cursor for forward pagination.
- QueryParam (Dictionary<string, object>): Extra URL query params (debug).
- Execute (System.Action<PNListFilesResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNListFilesResult>>.

### Sample code

```
1
  
```

### Response

```
`1{  
2    "FilesList":[  
3    {  
4        "Name":"cat_picture.jpg",  
5        "Id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
6        "Size":25778,  
7        "Created":"2020-07-26T13:42:06Z"  
8    }],  
9    "Count":1,  
10    "Next":null  
11}  
`
```

### Returns

ListFiles returns PNResult<PNListFilesResult>:
- Result (PNListFilesResult):
  - FilesList (List<PNFileResult>): 
    - Name (string)
    - Id (string)
    - Size (int)
    - Created (string)
  - Count (int)
  - Next (string)
- Status (PNStatus)

---

## Get file URL

Generate a URL to download a file from a channel.

### Method(s)

```
`1pubnub.GetFileUrl()  
2    .Channel(string)  
3    .FileId(string)  
4    .FileName(string)  
5    .Execute(System.ActionPNFileUrlResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Channel containing the file.
- FileId (string, required): Unique file identifier assigned at upload.
- FileName (string, required): Stored filename.
- Execute (System.Action<PNFileUrlResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNFileUrlResult>>.

### Sample code

```
1
  
```

### Returns

GetFileUrl returns PNResult<PNFileUrlResult>:
- Result (PNFileUrlResult):
  - Url (string)
- Status (PNStatus)

---

## Download file

Download a file from a channel.

### Method(s)

```
`1pubnub.DownloadFile()  
2    .Channel(string)  
3    .FileId(string)  
4    .FileName(string)  
5    .Execute(System.ActionPNDownloadFileResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Channel containing the file.
- FileId (string, required): Unique file identifier.
- FileName (string, required): Stored filename.
- Execute (System.Action<PNDownloadFileResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNDownloadFileResult>>.

Deprecated:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  
```

### Response

```
`1{  
2    //Call fileDownloadResult.SaveFileToLocal() to save file.  
3    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
4    "FileName":"cat_picture.jpg"  
5}  
`
```

### Returns

DownloadFile returns PNResult<PNDownloadFileResult>:
- Result (PNDownloadFileResult):
  - FileBytes (byte[])
  - FileName (string)
  - SaveFileToLocal(string): Save bytes to a local path.
- Status (PNStatus)

---

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pubnub.DeleteFile()  
2    .Channel(string)  
3    .FileId(string)  
4    .FileName(string)  
5    .Execute(System.ActionPNDeleteFileResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Channel containing the file.
- FileId (string, required): Unique file identifier.
- FileName (string, required): File to delete.
- Execute (System.Action<PNDeleteFileResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNDeleteFileResult>>.

### Sample code

```
1
  
```

### Response

```
`1{}  
`
```

### Returns

DeleteFile returns PNResult<PNDeleteFileResult>:
- Result (PNDeleteFileResult): empty
- Status (PNStatus)

---

## Publish file message

Publish the uploaded file message to a channel. Called by SendFile after upload. Use directly if SendFile fails with status.operation === PNPublishFileMessageOperation to resend the message without re-uploading.

### Method(s)

```
`1pubnub.PublishFileMessage()  
2    .Channel(string)  
3    .FileId(string)  
4    .FileName(string)  
5    .Message(object)  
6    .Meta(Dictionarystring, object>)  
7    .ShouldStore(bool)  
8    .CustomMessageType(string)  
9    .Execute(System.ActionPNPublishFileMessageResult, PNStatus>)  
`
```

Parameters:
- Channel (string, required): Target channel.
- FileId (string, required): File identifier.
- FileName (string, required): File name.
- Message (object): Payload to send with the file message.
- Meta (Dictionary<string, object>): Metadata for filtering.
- ShouldStore (bool, default true): Store message in history.
- CustomMessageType (string): 3–50 char case-sensitive label. Alphanumeric, dashes -, underscores _. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action<PNPublishFileMessageResult, PNStatus>): Callback.
- ExecuteAsync: Returns Task<PNResult<PNPublishFileMessageResult>>.

### Sample code

```
1
  
```

### Response

```
`1{  
2    "Timetoken":15957738720237858  
3}  
`
```

### Returns

PublishFileMessage returns PNResult<PNPublishFileMessageResult>:
- Result (PNPublishFileMessageResult):
  - Timetoken (long)
- Status (PNStatus)