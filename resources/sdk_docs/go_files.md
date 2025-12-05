# File Sharing API for Go SDK

Upload and share files up to 5 MB on a channel. When a file is uploaded, subscribers receive a file event with file ID, filename, and optional description. SendFile uploads and then publishes a file message; PublishFileMessage can be called directly if needed.

## Send file

Upload a file to a channel and publish its metadata on that channel. Internally calls PublishFileMessage.

### Method(s)

```
`1pn.SendFile().  
2    Channel(string).  
3    Message(interface{}).  
4    Name(string).  
5    File(*os.File).  
6    TTL(int).  
7    ShouldStore(bool).  
8    Meta(interface{}).  
9    CustomMessageType(string).  
10    UseRawMessage(bool).      
11    Execute()  
`
```

Parameters:
- Channel (string, required): Target channel.
- Message (interface, required): JSON-serializable payload to send along with the file.
- Name (string, optional): File name to use.
- File (*os.File, required): File handle.
- TTL (int, optional): How long the message is stored.
- ShouldStore (bool, default: false): Store the published file message in history.
- Meta (interface, optional): Metadata for message filtering.
- CustomMessageType (string, optional): Case-sensitive, 3–50 char alphanumeric label; dashes/underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- UseRawMessage (bool, default: false): When true, send raw message without {"text": ...} wrapper. Works with any JSON-serializable type.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. Passing CipherKey overrides crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNSendFileResponse:
- Data (PNFileData): See PNFileData.
- Timestamp (int64): Timetoken when the message was published.

#### PNFileData

- ID (string): File ID.

## List channel files

Retrieve a paginated list of files uploaded to a channel.

### Method(s)

```
`1pn.ListFiles().  
2    Channel(string).  
3    Limit(int).  
4    Next(string).  
5    Execute()  
`
```

Parameters:
- Channel (string, required): Channel to list files from.
- Limit (int, default: 100): Number of files to return.
- Next (string, optional): Server-provided pagination token for next page.

### Sample code

```
1
  

```

### Returns

PNListFilesResponse:
- Data ([]PNFileInfo): List of files.
- Count (int): Number of files returned.
- Next (string): Pagination token for next page.

#### PNFileInfo

- Name (string): File name.
- Id (string): File ID.
- Size (int): File size.
- Created (string): Creation date.

## Get file URL

Generate a download URL for a file on a channel.

### Method(s)

```
`1pn.GetFileURL().  
2    Channel(string).  
3    ID(string).  
4    Name(string).  
5    Execute()  
`
```

Parameters:
- Channel (string, required): Channel name containing the file.
- ID (string, required): File identifier from upload.
- Name (string, required): Stored file name.

### Sample code

```
1
  

```

### Returns

PNGetFileURLResponse:
- Url (string): Download URL for the file.

## Download file

Download a file from a channel.

### Method(s)

```
`1pn.DownloadFile().  
2    Channel(string).  
3    ID(string).  
4    Name(string).  
5    Execute()  
`
```

Parameters:
- Channel (string, required): Channel name containing the file.
- ID (string, required): File identifier.
- Name (string, required): Stored file name.

Deprecated parameter:
- CipherKey: Deprecated. Configure the crypto module instead. Passing CipherKey overrides crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNDownloadFileResponse:
- File (io.Reader): Reader for saving the file.

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pn.DeleteFile().  
2    Channel(string).  
3    ID(string).  
4    Name(string).  
5    Execute()  
`
```

Parameters:
- Channel (string, required): Channel containing the file.
- ID (string, required): File identifier.
- Name (string, required): File name.

### Sample code

```
1
  

```

### Returns

PNDeleteFileResponse: nil.

## Publish file message

Publish the uploaded file message to a channel. Called internally by SendFile. Use directly if upload succeeded but message publish failed (status.operation === PNPublishFileMessageOperation).

### Method(s)

```
`1pn.PublishFileMessage().  
2    TTL(int).  
3    Meta(interface{}).  
4    ShouldStore(bool).  
5    Channel(string).  
6    Message(PNPublishFileMessage).  
7    CustomMessageType(string).  
8    UseRawMessage(bool).  
9    Execute()  
`
```

Parameters:
- TTL (int, optional): How long the message is stored.
- Meta (interface, optional): Metadata for message filtering.
- ShouldStore (bool, default: true): Store in history.
- Channel (string, required): Target channel.
- Message (PNPublishFileMessage, required): File message payload.
- CustomMessageType (string, optional): Case-sensitive, 3–50 char alphanumeric label; dashes/underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- UseRawMessage (bool, default: false): Send raw message without {"text": ...} wrapper.

### Sample code

```
1
  

```

### Returns

PublishFileMessageResponse:
- Timetoken (int64): Timetoken when the message was published.

Last updated on Oct 29, 2025