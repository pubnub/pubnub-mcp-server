# File Sharing API for C# SDK

Upload and share files (up to 5 MB) on a channel. Subscribers receive a file event with file ID, filename, and optional description.

##### Request execution

Use try/catch. Invalid parameters throw exceptions. Server/network errors are in the returned status.

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

## Send file[​](#send-file)

Uploads a file to a channel, then publishes a message (internally calls PublishFileMessage) with file metadata so others can access it.

### Method(s)[​](#methods)

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
- Channel (string, required): Channel for the file.
- File (string | byte[], required): Path to file or file bytes. If byte[], you must set FileName.
- FileName (string): Overrides default file name.
- Message (string): Message sent with the file.
- ShouldStore (bool): Whether the published file message is stored in history.
- Meta (Dictionary<string, object>): Values used for message filtering.
- Ttl (int): How long the message is stored.
- CustomMessageType (string): Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module on your PubNub instance instead. Passing CipherKey overrides crypto module config and uses legacy 128-bit encryption.

### Sample code[​](#sample-code)

##### Reference code
```
1
  

```

### Response[​](#response)

```
`1{  
2    "Timetoken":15957709330808500,  
3    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
4    "FileName":"cat_picture.jpg"  
5}  
`
```

### Returns[​](#returns)

SendFile() returns PNResult<PNFileUploadResult>:
- Result (PNFileUploadResult)
- Status (PNStatus)

PNFileUploadResult:
- Timetoken (long)
- FileId (string)
- FileName (string)

## List channel files[​](#list-channel-files)

Retrieve files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1pubnub.ListFiles()  
2        .Channel(string)  
`
```

Parameters:
- Channel (string, required): Channel to list files.
- Limit (int, default 100): Number of files to return.
- Next (string): Server-provided pagination cursor for next page.

### Sample code[​](#sample-code-1)

```
1
  

```

### Response[​](#response-1)

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

### Returns[​](#returns-1)

ListFiles() returns PNResult<PNListFilesResult>:
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

## Get file URL[​](#get-file-url)

Generate a URL to download a file from a channel.

### Method(s)[​](#methods-2)

```
`1pubnub.GetFileUrl()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel name where the file was uploaded.
- FileId (string, required): Unique file identifier.
- FileName (string, required): Name under which the file is stored.

### Sample code[​](#sample-code-2)

```
1
  

```

### Response[​](#response-2)

```
`1{  
2    "Url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
3}  
`
```

### Returns[​](#returns-2)

GetFileUrl() returns PNResult<PNFileUrlResult>:
- Result (PNFileUrlResult)
- Status (PNStatus)

PNFileUrlResult:
- Url (string)

## Download file[​](#download-file)

Download a file from a channel.

### Method(s)[​](#methods-3)

```
`1pubnub.DownloadFile()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel name where the file was uploaded.
- FileId (string, required): Unique file identifier.
- FileName (string, required): Stored file name.

Deprecated parameter:
- CipherKey: Deprecated. Use the crypto module. Passing CipherKey overrides module config and uses legacy 128-bit encryption.

### Sample code[​](#sample-code-3)

```
1
  

```

### Response[​](#response-3)

```
`1{  
2    //Call fileDownloadResult.SaveFileToLocal() to save file.  
3    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
4    "FileName":"cat_picture.jpg"  
5}  
`
```

### Returns[​](#returns-3)

DownloadFile() returns PNResult<PNDownloadFileResult>:
- Result (PNDownloadFileResult)
- Status (PNStatus)

PNDownloadFileResult:
- FileBytes (byte[]): Downloaded file bytes. Use SaveFileToLocal to save locally.
- FileName (string)
- SaveFileToLocal(string): Provide full destination path to save the file locally.

## Delete file[​](#delete-file)

Delete a file from a channel.

### Method(s)[​](#methods-4)

```
`1pubnub.DeleteFile()  
2        .Channel(string)  
3        .FileId(string)  
4        .FileName(string)  
`
```

Parameters:
- Channel (string, required): Channel containing the file.
- FileId (string, required): File identifier to delete.
- FileName (string, required): Name of the file to delete.

### Sample code[​](#sample-code-4)

```
1
  

```

### Response[​](#response-4)

```
`1{}  
`
```

### Returns[​](#returns-4)

DeleteFile() returns PNResult<PNDeleteFileResult>:
- Result (PNDeleteFileResult)
- Status (PNStatus)

PNDeleteFileResult returns an empty object.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a channel. Called internally by SendFile. Use this if SendFile fails with status.operation === PNPublishFileMessageOperation to resend the file message without re-uploading.

### Method(s)[​](#methods-5)

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
- Channel (string, required): Channel to publish the file message.
- FileId (string, required): Unique file identifier.
- FileName (string, required): File name.
- Message (string): Payload.
- Meta (string): Metadata for message filtering.
- ShouldStore (bool, default true): Store in history.
- CustomMessageType (string): Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-5)

```
1
  

```

### Response[​](#response-5)

```
`1{  
2    "Timetoken":15957738720237858  
3}  
`
```

### Returns[​](#returns-5)

PublishFileMessage() returns PNResult<PNPublishFileMessageResult>:
- Result (PNPublishFileMessageResult)
- Status (PNStatus)

PNPublishFileMessageResult:
- Timetoken (long)

Last updated on Jul 15, 2025