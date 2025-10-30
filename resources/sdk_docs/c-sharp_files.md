# File Sharing API for C# SDK

Upload and share files up to 5 MB per file. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions. If the request reaches the server but fails, error details are in the returned status.

```
try
{
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()
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
```

## Send file

Uploads a file to a channel and publishes a message about it. Internally calls PublishFileMessage after upload.

### Method(s)

```
pubnub.SendFile()
    .Channel(string)
    .File(string | byte[])
    .FileName(string)
    .Message(string)
    .ShouldStore(bool)
    .Meta(Dictionary<string, object>)
    .Ttl(int)
    .CustomMessageType(string)
```

Parameters:
- Channel (string, required): Channel for the file.
- File (string | byte[], required): Full path (including filename) or a byte array. When using byte[], you must set FileName.
- FileName (string): Name of the file to send; can override default.
- Message (string): Message to send along with the file.
- ShouldStore (bool): Whether the published file message should be stored in history.
- Meta (Dictionary<string, object>): For message filtering.
- Ttl (int): How long the message should be stored in history.
- CustomMessageType (string): Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher-key encryption.

### Response

```
{
  "Timetoken": 15957709330808500,
  "FileId": "d9515cb7-48a7-41a4-9284-f4bf331bc770",
  "FileName": "cat_picture.jpg"
}
```

### Returns

PNResult<PNFileUploadResult> with:
- Result (PNFileUploadResult):
  - Timetoken (long): Publish timetoken.
  - FileId (string): File ID.
  - FileName (string): File name.
- Status (PNStatus)

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
pubnub.ListFiles()
    .Channel(string)
```

Parameters:
- Channel (string, required): Channel to list files from.
- Limit (int, default 100): Number of files to return.
- Next (string): Server-provided cursor for forward pagination.

### Response

```
{
  "FilesList": [
    {
      "Name": "cat_picture.jpg",
      "Id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",
      "Size": 25778,
      "Created": "2020-07-26T13:42:06Z"
    }
  ],
  "Count": 1,
  "Next": null
}
```

### Returns

PNResult<PNListFilesResult> with:
- Result (PNListFilesResult):
  - FilesList (List<PNFileResult>): List of files.
  - Count (int): Number of files returned.
  - Next (string): Cursor for next page.
- Status (PNStatus)

PNFileResult:
- Name (string)
- Id (string)
- Size (int)
- Created (string)

## Get file URL

Generate a URL to download a file from a channel.

### Method(s)

```
pubnub.GetFileUrl()
    .Channel(string)
    .FileId(string)
    .FileName(string)
```

Parameters:
- Channel (string, required): Channel where the file is stored.
- FileId (string, required): Unique file identifier assigned at upload.
- FileName (string, required): Stored file name.

### Response

```
{
  "Url": "http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"
}
```

### Returns

PNResult<PNFileUrlResult> with:
- Result (PNFileUrlResult):
  - Url (string): Download URL.
- Status (PNStatus)

## Download file

Download a file from a channel.

### Method(s)

```
pubnub.DownloadFile()
    .Channel(string)
    .FileId(string)
    .FileName(string)
```

Parameters:
- Channel (string, required): Channel where the file is stored.
- FileId (string, required): File identifier.
- FileName (string, required): Stored file name.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit cipher-key encryption.

### Response

```
{
  // Call fileDownloadResult.SaveFileToLocal() to save file.
  "FileBytes": "/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...",
  "FileName": "cat_picture.jpg"
}
```

### Returns

PNResult<PNDownloadFileResult> with:
- Result (PNDownloadFileResult):
  - FileBytes (byte[]): Downloaded file bytes. Use SaveFileToLocal to save locally.
  - FileName (string): File name.
  - SaveFileToLocal(string): Provide full destination path to save the file locally.
- Status (PNStatus)

## Delete file

Delete a file from a channel.

### Method(s)

```
pubnub.DeleteFile()
    .Channel(string)
    .FileId(string)
    .FileName(string)
```

Parameters:
- Channel (string, required): Channel containing the file.
- FileId (string, required): File identifier to delete.
- FileName (string, required): File name to delete.

### Response

```
{}
```

### Returns

PNResult<PNDeleteFileResult> with:
- Result (PNDeleteFileResult): Empty object.
- Status (PNStatus)

## Publish file message

Publish a message to a channel for an already uploaded file. Called internally by SendFile. Use this when SendFile upload succeeded but the publish step failed.

### Method(s)

```
pubnub.PublishFileMessage()
    .Channel(string)
    .FileId(string)
    .FileName(string)
    .Message(object)
    .Meta(Dictionary<string, object>)
    .ShouldStore(bool)
    .CustomMessageType(string)
```

Parameters:
- Channel (string, required): Channel to publish to.
- FileId (string, required): File identifier.
- FileName (string, required): File name.
- Message (object, required): Payload.
- Meta (Dictionary<string, object>): For message filtering.
- ShouldStore (bool, default true): Store in history.
- CustomMessageType (string): Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Response

```
{
  "Timetoken": 15957738720237858
}
```

### Returns

PNResult<PNPublishFileMessageResult> with:
- Result (PNPublishFileMessageResult):
  - Timetoken (long): Publish timetoken.
- Status (PNStatus)