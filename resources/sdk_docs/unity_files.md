# File Sharing API for Unity SDK

Upload and share files up to 5 MB on a channel. Subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file and publishes a file message on the channel. Internally calls PublishFileMessage to publish metadata (file ID, name).

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
- File (string | byte[]): Full file path or byte array. If byte[], set FileName.
- Texture (Texture2D | RenderTexture): When provided, a Message with texture size/format is added automatically.
- FileName (string): Override or set name when using byte[]/Texture.
- Ttl (int): Time to store the message in channel storage.
- ShouldStore (bool): Whether to store the published file message in history.
- Message (string): Optional message sent with the file.
- Meta (Dictionary<string, object>): Metadata for message filtering.
- CustomMessageType (string): 3–50 chars, case‑sensitive alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action of PNFileUploadResult): Callback.
- ExecuteAsync: Returns Task<PNResult<PNFileUploadResult>>.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

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

Returns PNResult<PNFileUploadResult>:
- Result (PNFileUploadResult)
- Status (PNStatus)

PNFileUploadResult:
- Timetoken (long)
- FileId (string)
- FileName (string)

## List channel files

Retrieve files uploaded to a channel.

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
- Channel (string, required): Channel to list files from.
- Limit (int, default 100): Number of files to return.
- Next (string): Server-provided cursor for forward pagination.
- QueryParam (Dictionary<string, object>): Extra query params (debug).
- Execute (System.Action of PNListFilesResult)
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

Returns PNResult<PNListFilesResult>:
- Result (PNListFilesResult)
- Status (PNStatus)

PNListFilesResult:
- FilesList (List<PNFileResult>)
- Count (int)
- Next (string)

PNFileResult:
- Name (string)
- Id (string)
- Size (int)
- Created (string)

## Get file URL

Generate a download URL for a file on a channel.

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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)
- Execute (System.Action of PNFileUrlResult)
- ExecuteAsync: Returns Task<PNResult<PNFileUrlResult>>.

### Sample code

```
1
  

```

### Returns

Returns PNResult<PNFileUrlResult>:
- Result (PNFileUrlResult)
- Status (PNStatus)

PNFileUrlResult:
- Url (string)

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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)
- Execute (System.Action of PNDownloadFileResult)
- ExecuteAsync: Returns Task<PNResult<PNDownloadFileResult>>.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

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

Returns PNResult<PNDownloadFileResult>:
- Result (PNDownloadFileResult)
- Status (PNStatus)

PNDownloadFileResult:
- FileBytes (byte[])
- FileName (string)
- SaveFileToLocal(string): Save file to a destination path.

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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)
- Execute (System.Action of PNDeleteFileResult)
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

Returns PNResult<PNDeleteFileResult>:
- Result (PNDeleteFileResult)
- Status (PNStatus)

PNDeleteFileResult: empty.

## Publish file message

Publish the uploaded file message to a channel. Use if SendFile fails with status.operation === PNPublishFileMessageOperation to resend the file message without re-uploading.

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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)
- Message (object): Payload.
- Meta (object): Metadata for filtering.
- ShouldStore (bool, default true): Store in history.
- CustomMessageType (string): 3–50 chars, case‑sensitive alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action of PNPublishFileMessageResult)
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

Returns PNResult<PNPublishFileMessageResult>:
- Result (PNPublishFileMessageResult)
- Status (PNStatus)

PNPublishFileMessageResult:
- Timetoken (long)

Last updated on Sep 3, 2025