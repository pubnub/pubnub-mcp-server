# File Sharing API for Go SDK

Upload and share files up to 5 MB on PubNub. Files are uploaded to a channel, stored with your key, and subscribers receive a file event containing file ID, filename, and optional description.

## Send file[​](#send-file)

Upload a file to a channel and publish a file message. Internally calls PublishFileMessage.

### Method(s)[​](#methods)

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
  - Type: string
  - Description: Channel to upload the file.
- Message (required)
  - Type: interface
  - Description: Any JSON-serializable type: string, map[string]interface{}, []interface{}, number, bool, etc.
- Name
  - Type: string
  - Description: File name to store.
- File (required)
  - Type: *os.File
  - Description: Pointer to the file object.
- TTL
  - Type: int
  - Description: How long the message should be stored in the channel’s storage.
- ShouldStore
  - Type: bool
  - Default: false
  - Description: Whether to store the published file message in history.
- Meta
  - Type: interface
  - Default: null
  - Description: Metadata object for message filtering.
- CustomMessageType
  - Type: string
  - Description: Case-sensitive alphanumeric label (3–50 chars). Dashes - and underscores _ allowed. Must not start with special characters or with pn_ or pn-. Examples: text, action, poll.
- UseRawMessage
  - Type: bool
  - Default: false
  - Description: When true, sends the message directly without {"text": ...}. When false (default), wraps the message in "text" for backward compatibility.

Deprecated:
- CipherKey: Configure the crypto module instead. Passing CipherKey overrides crypto module config and uses legacy 128-bit encryption.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

PNSendFileResponse:
- Data: PNFileData (see PNFileData)
- Timestamp: int64 (timetoken when the message was published)

#### PNFileData[​](#pnfiledata)

- ID: string (file ID)

## List channel files[​](#list-channel-files)

Retrieve a list of files uploaded to a channel.

### Method(s)[​](#methods-1)

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
  - Type: string
  - Description: Channel to list files from.
- Limit
  - Type: int
  - Default: 100
  - Description: Number of files to return.
- Next
  - Type: string
  - Description: Server-provided cursor for forward pagination.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

PNListFilesResponse:
- Data: PNFileInfo (see PNFileInfo)
- Count: int (number of files returned)
- Next: string (pagination cursor)

#### PNFileInfo[​](#pnfileinfo)

- Name: string
- Id: string
- Size: int
- Created: string

## Get file URL[​](#get-file-url)

Generate a URL to download a file from the target channel.

### Method(s)[​](#methods-2)

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
  - Type: string
  - Description: Channel where the file was uploaded.
- ID (required)
  - Type: string
  - Description: Unique file identifier assigned during upload.
- Name (required)
  - Type: string
  - Description: Stored file name on the channel.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

PNGetFileURLResponse:
- Url: string (download URL)

## Download file[​](#download-file)

Download a file from the specified channel.

### Method(s)[​](#methods-3)

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
  - Type: string
  - Description: Channel where the file was uploaded.
- ID (required)
  - Type: string
  - Description: File identifier assigned during upload.
- Name (required)
  - Type: string
  - Description: Stored file name on the channel.

Deprecated:
- CipherKey: Configure the crypto module instead. Passing CipherKey overrides crypto module config and uses legacy 128-bit encryption.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

PNDownloadFileResponse:
- File: io.Reader (reader for the file content)

## Delete file[​](#delete-file)

Delete a file from the specified channel.

### Method(s)[​](#methods-4)

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
  - Type: string
  - Description: Channel where the file was uploaded.
- ID (required)
  - Type: string
  - Description: File identifier to delete.
- Name (required)
  - Type: string
  - Description: File name to delete.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)

PNDeleteFileResponse: nil

## Publish file message[​](#publish-file-message)

Publish metadata for an already-uploaded file to a channel. Called internally by SendFile. Use directly if SendFile fails with status.operation === PNPublishFileMessageOperation to resend the file message without re-uploading.

### Method(s)[​](#methods-5)

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
  - Type: int
  - Description: How long the message should be stored in channel storage.
- Meta
  - Type: interface
  - Description: Metadata object for message filtering.
- ShouldStore
  - Type: bool
  - Default: true
  - Description: Store in history.
- Channel (required)
  - Type: string
  - Description: Channel to publish the file message.
- Message (required)
  - Type: PNPublishFileMessage
  - Description: Payload of type PNPublishFileMessage.
- CustomMessageType
  - Type: string
  - Description: Case-sensitive alphanumeric label (3–50 chars). Dashes - and underscores _ allowed. Must not start with special characters or with pn_ or pn-. Examples: text, action, poll.
- UseRawMessage
  - Type: bool
  - Default: false
  - Description: When true, sends the message directly without {"text": ...}. When false (default), wraps the message in "text".

### Sample code[​](#sample-code-5)

```
1
  

```

### Returns[​](#returns-5)

PublishFileMessageResponse:
- Timetoken: int64 (timetoken when the message was published)

Last updated on Oct 29, 2025