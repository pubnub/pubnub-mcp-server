# File Sharing API for C# SDK

Upload and share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

##### Request execution

Use try/catch. Invalid parameters throw exceptions. Server/network errors are in the returned PNStatus.

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

Uploads the file and publishes a file message to the channel (internally calls PublishFileMessage).

### Method(s)

```
pubnub.SendFile()
    .Channel(string)
    .File(string|byte[])
    .FileName(string)
    .Message(string)
    .ShouldStore(bool)
    .Meta(Dictionary<string, object>)
    .Ttl(int)
    .CustomMessageType(string)
```

Parameters:
- Channel (string, required): Target channel.
- File (string | byte[], required): Full file path or byte array. If byte[], you must set FileName.
- FileName (string): Name to send (overrides default or required for byte[] input).
- Message (string): Message sent along with the file.
- ShouldStore (bool): Store the published file message in history.
- Meta (Dictionary<string, object>): Used for server-side message filtering.
- Ttl (int): How long the message should be stored.
- CustomMessageType (string): 3–50 char, case-sensitive alphanumeric label; dashes and underscores allowed. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead: /docs/sdks/c-sharp/api-reference/configuration#cryptomodule. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```

```

### Response

```
{
  "Timetoken": 15957709330808500,
  "FileId": "d9515cb7-48a7-41a4-9284-f4bf331bc770",
  "FileName": "cat_picture.jpg"
}
```

### Returns

PNResult<PNFileUploadResult>:
- Result (PNFileUploadResult)
  - Timetoken (long)
  - FileId (string)
  - FileName (string)
- Status (PNStatus)

## List channel files

Retrieve the list of files uploaded to a channel.

### Method(s)

```
pubnub.ListFiles()
    .Channel(string)
```

Parameters:
- Channel (string, required): Channel to list files from.
- Limit (int, default 100): Number of files to return.
- Next (string): Cursor for forward pagination.

### Sample code

```

```

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

PNResult<PNListFilesResult>:
- Result (PNListFilesResult)
  - FilesList (List<PNFileResult>)
    - Name (string)
    - Id (string)
    - Size (int)
    - Created (string)
  - Count (int)
  - Next (string)
- Status (PNStatus)

## Get file URL

Generate a downloadable URL for a file in a channel.

### Method(s)

```
pubnub.GetFileUrl()
    .Channel(string)
    .FileId(string)
    .FileName(string)
```

Parameters:
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)

### Sample code

```

```

### Response

```
{
  "Url": "http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"
}
```

### Returns

PNResult<PNFileUrlResult>:
- Result (PNFileUrlResult)
  - Url (string)
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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)

Deprecated parameter:
- CipherKey: Deprecated. Use the crypto module: /docs/sdks/c-sharp/api-reference/configuration#cryptomodule. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```

```

### Response

```
{
  // Call fileDownloadResult.SaveFileToLocal() to save file.
  "FileBytes": "/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...",
  "FileName": "cat_picture.jpg"
}
```

### Returns

PNResult<PNDownloadFileResult>:
- Result (PNDownloadFileResult)
  - FileBytes (byte[]): File content. Use SaveFileToLocal to save.
  - FileName (string)
  - SaveFileToLocal(string destinationPath): Save the downloaded file locally.
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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)

### Sample code

```

```

### Response

```
{}
```

### Returns

PNResult<PNDeleteFileResult>:
- Result (PNDeleteFileResult): Empty object.
- Status (PNStatus)

## Publish file message

Publishes a message to a channel referencing an already uploaded file. Called internally by SendFile. Useful if SendFile upload succeeded but message publish failed; retry with this method using data from PNStatus when status.operation === PNPublishFileMessageOperation.

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
- Channel (string, required)
- FileId (string, required)
- FileName (string, required)
- Message (object, required): Payload.
- Meta (Dictionary<string, object>): Metadata for filtering.
- ShouldStore (bool, default true): Store in history.
- CustomMessageType (string): 3–50 char, case-sensitive alphanumeric label; dashes/underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code

```

```

### Response

```
{
  "Timetoken": 15957738720237858
}
```

### Returns

PNResult<PNPublishFileMessageResult>:
- Result (PNPublishFileMessageResult)
  - Timetoken (long)
- Status (PNStatus)