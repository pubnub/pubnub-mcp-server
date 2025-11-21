# File Sharing API for Go SDK

Upload and share files (up to 5 MB) on PubNub. Uploading a file to a channel stores it with your key and publishes a file event with file ID, filename, and optional description.

## Send file

Upload a file and publish a file message on the channel. Internally calls PublishFileMessage to notify subscribers.

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
- Channel (required, string): Channel to upload the file.
- Message (interface): JSON-serializable payload to send with the file (string, map[string]interface{}, []interface{}, number, bool, etc.).
- Name (string): File name.
- File (required, *os.File): Pointer to the file object.
- TTL (int): How long the message should be stored in the channel's storage.
- ShouldStore (bool, default: false): Whether to store the file message in history.
- Meta (interface): Metadata object for message filtering.
- CustomMessageType (string): Case-sensitive, alphanumeric (3–50 chars), dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- UseRawMessage (bool, default: false): When true, sends the message directly without {"text": ...} wrapper; otherwise wraps in "text" for backward compatibility.

Deprecated:
- CipherKey: Deprecated. Configure the crypto module on the PubNub instance instead. Passing CipherKey overrides the module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNSendFileResponse:
- Data: PNFileData (see PNFileData)
- Timestamp: int64 (timetoken when the message was published)

PNFileData:
- ID: string (file ID)

## List channel files

Retrieve files uploaded to a channel.

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
- Channel (required, string): Channel to list files from.
- Limit (int, default: 100): Number of files to return.
- Next (string): Server-provided cursor for forward pagination.

### Sample code

```
1
  

```

### Returns

PNListFilesResponse:
- Data: PNFileInfo (see PNFileInfo)
- Count: int (number of files returned)
- Next: string (server cursor for next page)

PNFileInfo:
- Name: string
- Id: string
- Size: int
- Created: string

## Get file URL

Generate a URL to download a file from a channel.

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
- Channel (required, string): Channel where the file was uploaded.
- ID (required, string): Unique file identifier assigned at upload.
- Name (required, string): File name stored in the channel.

### Sample code

```
1
  

```

### Returns

PNGetFileURLResponse:
- Url: string (download URL for the file)

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
- Channel (required, string): Channel where the file was uploaded.
- ID (required, string): Unique file identifier assigned at upload.
- Name (required, string): File name stored in the channel.

Deprecated:
- CipherKey: Deprecated. Configure the crypto module on the PubNub instance instead. Passing CipherKey overrides the module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNDownloadFileResponse:
- File: io.Reader (file reader to save the file)

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
- Channel (required, string): Channel containing the file.
- ID (required, string): File identifier to delete.
- Name (required, string): File name to delete.

### Sample code

```
1
  

```

### Returns

PNDeleteFileResponse: nil

## Publish file message

Publish an uploaded file message to a channel. Called internally by SendFile. Use directly if SendFile fails with PNPublishFileMessageOperation to resend the message without re-uploading.

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
- TTL (int): How long the message should be stored in channel storage.
- Meta (interface): Metadata object for message filtering.
- ShouldStore (bool, default: true): Store in history.
- Channel (required, string): Channel to publish the file message.
- Message (required, PNPublishFileMessage): Payload of type PNPublishFileMessage.
- CustomMessageType (string): Case-sensitive, alphanumeric (3–50 chars), dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.
- UseRawMessage (bool, default: false): When true, sends the message directly without {"text": ...} wrapper; otherwise wraps in "text" for backward compatibility.

### Sample code

```
1
  

```

### Returns

PublishFileMessageResponse:
- Timetoken: int64 (timetoken when the message was published)