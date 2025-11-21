# File Sharing API for Unity SDK

Upload and share files up to 5 MB. When a file is uploaded on a channel, it’s stored with your key; subscribers receive a file event with file ID, filename, and optional description.

## Send file

Uploads a file to a channel and publishes a file message. Internally calls PublishFileMessage to publish metadata (file ID and name).

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
- Channel (required, string): Channel for the file.
- File (string | byte[]): Full path with filename or byte array. If byte[], you must set FileName.
- Texture (Texture2D | RenderTexture): Texture instance. When provided, a Message with size and format is auto-added.
- FileName (string): Override default name or required when File is byte[].
- Ttl (int): How long the message is stored in channel history.
- ShouldStore (bool): Whether to store the published file message in history.
- Message (string): Message to send with the file.
- Meta (Dictionary<string, object>): For server-side filtering.
- CustomMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action): System.Action of type PNFileUploadResult.
- ExecuteAsync: Returns Task<PNResult<PNFileUploadResult>>.

Deprecated:
- CipherKey parameter is deprecated. Configure the crypto module instead (/docs/sdks/unity/api-reference/configuration#cryptomodule). Passing CipherKey overrides the module and uses legacy 128-bit encryption.

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
- Timetoken (long): Publish timetoken.
- FileId (string): File ID.
- FileName (string): File name.

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
- Channel (required, string): Channel to list files from.
- Limit (int, default 100): Number of files to return.
- Next (string): Server-provided cursor for forward pagination.
- QueryParam (Dictionary<string, object>): Extra query params for debugging.
- Execute (System.Action): System.Action of type PNListFilesResult.
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
- FilesList (List<PNFileResult>): List of files.
- Count (int): Number of files returned.
- Next (string): Cursor for forward pagination.

PNFileResult:
- Name (string): File name.
- Id (string): File ID.
- Size (int): File size.
- Created (string): Creation date.

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
- Channel (required, string): Channel where the file was uploaded.
- FileId (required, string): Uploaded file identifier.
- FileName (required, string): File name stored for the channel.
- Execute (System.Action): System.Action of type PNFileUrlResult.
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
- Url (string): Download URL for the file.

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
- Channel (required, string): Channel where the file was uploaded.
- FileId (required, string): Uploaded file identifier.
- FileName (required, string): Stored file name.
- Execute (System.Action): System.Action of type PNDownloadFileResult.
- ExecuteAsync: Returns Task<PNResult<PNDownloadFileResult>>.

Deprecated:
- CipherKey parameter is deprecated. Use the crypto module (/docs/sdks/unity/api-reference/configuration#cryptomodule). Passing CipherKey uses legacy 128-bit encryption.

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
- FileBytes (byte[]): Downloaded bytes.
- FileName (string): Downloaded file name.
- SaveFileToLocal(string): Call with destination path to save locally.

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
- Channel (required, string): Channel containing the file.
- FileId (required, string): File identifier to delete.
- FileName (required, string): Name of the file to delete.
- Execute (System.Action): System.Action of type PNDeleteFileResult.
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

PNDeleteFileResult: Empty.

## Publish file message

Publish a previously uploaded file message to a channel. Used internally by SendFile. If SendFile fails with status.operation === PNPublishFileMessageOperation, use data from status to retry with PublishFileMessage (no re-upload).

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
- Channel (required, string): Channel to publish file message.
- FileId (required, string): File identifier.
- FileName (required, string): File name.
- Message (string): Payload.
- Meta (string): Metadata for filtering.
- ShouldStore (bool, default true): Store message in history.
- CustomMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes/underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- Execute (System.Action): System.Action of type PNPublishFileMessageResult.
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
- Timetoken (long): Publish timetoken.

Last updated on Sep 3, 2025