# File Sharing API for Go SDK

Upload and share files up to 5 MB on PubNub. When a file is uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file to storage and publishes a message on the channel with file metadata. Internally calls PublishFileMessage.

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
- Channel (required)  
  Type: string; Default: n/a  
  Channel to upload the file.
- Message  
  Type: interface; Default: n/a  
  Message to send along with the file. Any JSON-serializable type: string, map[string]interface{}, []interface{}, number, bool, etc.
- File (required)  
  Type: *os.File; Default: n/a  
  Pointer to the file object.
- TTL  
  Type: int; Default: n/a  
  How long the message should be stored in the channel's storage.
- ShouldStore  
  Type: bool; Default: false  
  Whether to store the published file message in the channel's history.
- Meta  
  Type: interface; Default: null  
  Metadata object for message filtering.
- CustomMessageType  
  Type: string; Default: n/a  
  Case-sensitive, alphanumeric label (3–50 chars). Dashes (-) and underscores (_) allowed. Cannot start with special characters or pn_/pn- (examples: text, action, poll).
- UseRawMessage  
  Type: bool; Default: false  
  When true, sends the message directly without {"text": ...} wrapper. When false, wraps in a "text" field. Works with any JSON-serializable type.

Deprecated:
- CipherKey: Use the crypto module instead (/docs/sdks/go/api-reference/configuration#cryptomodule). If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNSendFileResponse:
- Data: PNFileData (see PNFileData)
- Timestamp: int64 (timetoken when the message was published)

PNFileData:
- ID: string

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
- Channel (required)  
  Type: string; Default: n/a  
  Channel to list files from.
- Limit  
  Type: int; Default: 100  
  Number of files to return.
- Next  
  Type: string; Default: n/a  
  Server-provided cursor for forward pagination.

### Sample code

```
1
  

```

### Returns

PNListFilesResponse:
- Data: PNFileInfo (see PNFileInfo)
- Count: int
- Next: string (pagination cursor)

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
- Channel (required)  
  Type: string  
  Channel where the file was uploaded.
- ID (required)  
  Type: string  
  Unique file identifier assigned during upload.
- Name (required)  
  Type: string  
  Stored filename for the channel.

### Sample code

```
1
  

```

### Returns

PNGetFileURLResponse:
- Url: string

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
- Channel (required)  
  Type: string  
  Channel where the file was uploaded.
- ID (required)  
  Type: string  
  Unique file identifier assigned during upload.
- Name (required)  
  Type: string  
  Stored filename for the channel.

Deprecated:
- CipherKey: Use the crypto module instead (/docs/sdks/go/api-reference/configuration#cryptomodule). If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNDownloadFileResponse:
- File: io.Reader (use to save the file)

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
- Channel (required)  
  Type: string  
  Channel where the file exists.
- ID (required)  
  Type: string  
  Unique file identifier to delete.
- Name (required)  
  Type: string  
  Filename to delete from the channel.

### Sample code

```
1
  

```

### Returns

PNDeleteFileResponse: nil

## Publish file message

Publish the uploaded file message to a channel. Called by SendFile after upload. Use directly if SendFile fails with PNPublishFileMessageOperation to resend the message without re-uploading.

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
- TTL  
  Type: int; Default: n/a  
  How long the message should be stored.
- Meta  
  Type: interface; Default: n/a  
  Metadata object for filtering.
- ShouldStore  
  Type: bool; Default: true  
  Store in history.
- Channel (required)  
  Type: string; Default: n/a  
  Channel to publish to.
- Message (required)  
  Type: PNPublishFileMessage; Default: n/a  
  Payload describing the uploaded file.
- CustomMessageType  
  Type: string; Default: n/a  
  Case-sensitive, alphanumeric label (3–50 chars). Dashes (-) and underscores (_) allowed. Cannot start with special characters or pn_/pn- (examples: text, action, poll).
- UseRawMessage  
  Type: bool; Default: false  
  When true, sends the message directly without {"text": ...} wrapper.

### Sample code

```
1
  

```

### Returns

PublishFileMessageResponse:
- Timetoken: int64 (when the message was published)

Last updated on Oct 29, 2025