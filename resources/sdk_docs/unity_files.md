# File Sharing API for Unity SDK

Upload and share files up to 5 MB on a channel. Subscribers receive a file event with file ID, filename, and optional description.

## Send file

Upload a file to a channel. This performs preparation, upload to storage, and posts a message to the channel. Internally calls PublishFileMessage to publish the file metadata.

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
- Channel (string) Required. Target channel.
- File (string | byte[]) Full path + filename, or file bytes. If using bytes, set FileName.
- Texture (Texture2D | RenderTexture) Sends a Texture; a Message with size and format is auto-added.
- FileName (string) File name or override.
- Ttl (int) Message storage duration in channel history.
- ShouldStore (bool) Whether to store the published file message in history.
- Message (string) Message to send with the file.
- Meta (Dictionary<string, object>) Metadata for filtering.
- CustomMessageType (string) 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_ / pn-. Examples: text, action, poll.
- Execute (System.Action<PNFileUploadResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNFileUploadResult>>.

Deprecated parameter:
- CipherKey is deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

### Sample code

##### Reference code

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

Retrieve a list of files uploaded to a channel.

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
- Channel (string) Required. Channel to list files.
- Limit (int) Default: 100. Number of files to return.
- Next (string) Forward pagination cursor returned by server.
- QueryParam (Dictionary<string, object>) Optional query params (debug).
- Execute (System.Action<PNListFilesResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNListFilesResult>>.

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
- Channel (string) Required. Channel where the file was uploaded.
- FileId (string) Required. Unique ID assigned during upload.
- FileName (string) Required. Stored filename.
- Execute (System.Action<PNFileUrlResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNFileUrlResult>>.

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
- Channel (string) Required.
- FileId (string) Required.
- FileName (string) Required.
- Execute (System.Action<PNDownloadFileResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNDownloadFileResult>>.

Deprecated parameter:
- CipherKey is deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

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
- SaveFileToLocal(string) Save to a local destination path.

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
- Channel (string) Required.
- FileId (string) Required.
- FileName (string) Required.
- Execute (System.Action<PNDeleteFileResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNDeleteFileResult>>.

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

PNDeleteFileResult: Empty.

## Publish file message

Publish the uploaded file metadata message to a channel. Automatically called by SendFile. Use directly if SendFile fails at the publish step (status.operation == PNPublishFileMessageOperation) to resend the message without re-uploading.

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
- Channel (string) Required. Channel to publish the file message.
- FileId (string) Required.
- FileName (string) Required.
- Message (object) The payload.
- Meta (Dictionary<string, object>) Metadata for filtering.
- ShouldStore (bool) Default: true. Whether to store in history.
- CustomMessageType (string) 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_ / pn-. Examples: text, action, poll.
- Execute (System.Action<PNPublishFileMessageResult, PNStatus>) Callback. ExecuteAsync returns Task<PNResult<PNPublishFileMessageResult>>.

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