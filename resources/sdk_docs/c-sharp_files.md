# File Sharing API for C# SDK

Upload and share files up to 5 MB on a channel. Uploaded files are stored with your key; channel subscribers receive a file event with file ID, filename, and optional description.

##### Request execution

Use try/catch. Invalid parameters throw exceptions. Server/network errors are in returned status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Send file

Uploads a file to a channel (prepares, uploads to storage, then publishes a message on the channel). Internally calls PublishFileMessage.

### Method(s)

```
`1pubnub.SendFile()  
2        .Channel(string)  
3        .File(string|byte[])  
4        .FileName(string)  
5        .Message(string)  
6        .ShouldStore(bool)  
7        .Meta(Dictionarystring, object>)  
8        .Ttl(int)  
9        .CustomMessageType(string)  
`
```

Parameters:
- Channel (string, required): Target channel.
- File (string or byte[], required): Local file path or byte array. If byte[], you must set FileName.
- FileName (string, required when File is byte[]): Name to send/override.
- Message (string, optional): Message to send with the file.
- ShouldStore (bool, optional): Store the published file message in history.
- Meta (Dictionary<string, object>, optional): Metadata for message filtering.
- Ttl (int, optional): How long the message is stored.
- CustomMessageType (string, optional): 3–50 char, alphanumeric, dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. Passing CipherKey overrides crypto module and uses legacy 128-bit encryption.

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

SendFile() returns PNResult<PNFileUploadResult>:
- Result (PNFileUploadResult): Upload result.
- Status (PNStatus): Request status.

PNFileUploadResult:
- Timetoken (long): Publish timetoken.
- FileId (string): File ID.
- FileName (string): File name.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1pubnub.ListFiles()  
2        .Channel(string)  
`
```

Parameters:
- Channel (string, required): Channel name.
- Limit (int, optional, default 100): Number of files to return.
- Next (string, optional): Server-provided pagination cursor for next page.

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

ListFiles() returns PNResult<PNListFilesResult>:
- Result (PNListFilesResult): Listing result.
- Status (PNStatus): Request status.

PNListFilesResult:
- FilesList (List<PNFileResult>): Files on the channel.
- Count (int): Number of files returned.
- Next (string): Pagination cursor.

PNFileResult:
- Name (string): File name.
- Id (string): File ID.
- Size (int): File size.
- Created (string): Creation timestamp.

## Get file URL

Generate a direct download URL for a file on a channel.

### Method(s)

```
`1pubnub.GetFileUrl()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel where the file was uploaded.
- FileId (string, required): File identifier.
- FileName (string, required): Stored file name.

### Sample code

```
1
  

```

### Response

```
`1{  
2    "Url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
3}  
`
```

### Returns

GetFileUrl() returns PNResult<PNFileUrlResult>:
- Result (PNFileUrlResult): URL result.
- Status (PNStatus): Request status.

PNFileUrlResult:
- Url (string): Download URL.

## Download file

Download a file from a channel.

### Method(s)

```
`1pubnub.DownloadFile()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel name.
- FileId (string, required): File identifier.
- FileName (string, required): File name.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. Passing CipherKey overrides crypto module and uses legacy 128-bit encryption.

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

DownloadFile() returns PNResult<PNDownloadFileResult>:
- Result (PNDownloadFileResult): Download result.
- Status (PNStatus): Request status.

PNDownloadFileResult:
- FileBytes (byte[]): Downloaded file bytes. Use SaveFileToLocal to save.
- FileName (string): Downloaded file name.
- SaveFileToLocal(string): Provide full destination path to save locally.

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pubnub.DeleteFile()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel name.
- FileId (string, required): File identifier.
- FileName (string, required): File name.

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

DeleteFile() returns PNResult<PNDeleteFileResult>:
- Result (PNDeleteFileResult): Empty result.
- Status (PNStatus): Request status.

PNDeleteFileResult: Empty object.

## Publish file message

Publishes a message to a channel for an already uploaded file. Called internally by SendFile. If SendFile fails with PNPublishFileMessageOperation, use this to retry publishing without re-uploading.

### Method(s)

```
`1pubnub.PublishFileMessage()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
5        .Message(object)  
6        .Meta(Dictionarystring, object>)  
7        .ShouldStore(bool)  
8        .CustomMessageType(string)  
`
```

Parameters:
- Channel (string, required): Channel to publish to.
- FileId (string, required): File identifier.
- FileName (string, required): File name.
- Message (string, required): Payload.
- Meta (string, optional): Metadata for filtering.
- ShouldStore (bool, optional, default true): Store in history.
- CustomMessageType (string, optional): 3–50 char, alphanumeric, dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

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

PublishFileMessage() returns PNResult<PNPublishFileMessageResult>:
- Result (PNPublishFileMessageResult): Publish result.
- Status (PNStatus): Request status.

PNPublishFileMessageResult:
- Timetoken (long): Publish timetoken.

Last updated on Jul 15, 2025