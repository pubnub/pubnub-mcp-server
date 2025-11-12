# File Sharing API for PHP SDK

Upload and share files up to 5 MB. When a file is uploaded to a channel, it’s stored and associated with your key. Channel subscribers receive a file event containing file ID, filename, and optional description.

## Send file[​](#send-file)

Upload a file to a channel, then publish a file message so others can access it. Internally calls publishFileMessage.

### Method(s)[​](#methods)

```
`1$pubnub->sendFile()  
2    ->channel(string)  
3    ->fileName(string)  
4    ->message(string|array)  
5    ->shouldStore(Boolean)  
6    ->shouldCompress(Boolean)  
7    ->ttl(Int)  
8    ->fileHandle(Resource)  
9    ->fileContent(bytes|File)  
10    ->meta(string|array)  
11    ->customMessageType(string)  
12    ->sync();  
`
```

Parameters:
- channel* (Type: string, Default: n/a) Channel for the file.
- fileName* (Type: string, Default: n/a) Name of the file to send.
- message (Type: string|array, Default: n/a) Message to send with the file.
- shouldStore (Type: Boolean, Default: True) Store the published file message in channel history.
- shouldCompress (Type: Boolean, Default: True) Compress the request payload.
- ttl (Type: Int, Default: n/a) How long the message should be stored in the channel’s storage.
- fileHandle* (Type: Resource, Default: n/a) Pointer to a resource to read and buffer.
- fileContent* (Type: bytes or PHP file object, Default: n/a) Input stream with file content.
- meta (Type: string|array, Default: n/a) Metadata usable for filtering.
- customMessageType (Type: string, Default: n/a) Case-sensitive, 3–50 chars, alphanumeric, dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code)

##### Reference code
```
1
  

```

### Returns[​](#returns)

Returns PNSendFileResult:
- name (string) Name of the uploaded file.
- fileId (string) ID of the uploaded file.

## List channel files[​](#list-channel-files)

Retrieve files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1$pubnub->listFiles()  
2    ->channel(string)  
3    ->sync();  
`
```

Parameters:
- channel* (Type: string, Default: n/a) Channel to list files from.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

Returns PNGetFilesResult:
- next (string) Token for forward pagination.
- prev (string) Token for backward pagination.
- count (Int) Number of files returned.
- data (Array of PNGetFilesItem)

PNGetFilesItem:
- id (string) File ID.
- name (string) File name.
- size (string) File size.
- creationTime (string) Creation time.

## Get file URL[​](#get-file-url)

Generate a URL to download a file from a channel.

### Method(s)[​](#methods-2)

```
`1$pubnub.getFileDownloadUrl()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel* (Type: string) Channel to which the file was uploaded.
- fileName* (Type: string) Stored filename.
- fileId* (Type: string) Unique identifier assigned during upload.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

Returns PNGetFileDownloadURLResult:
- fileUrl (string) URL to download the file.

## Download file[​](#download-file)

Download a file from a channel.

### Method(s)[​](#methods-3)

```
`1$pubnub.downloadFile()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel* (Type: string) Channel to which the file was uploaded.
- fileName* (Type: string) Stored filename.
- fileId* (Type: string) Unique identifier assigned during upload.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

Returns PNDownloadFileResult:
- fileContent (bytes) The downloaded file content.

## Delete file[​](#delete-file)

Delete a file from a channel.

### Method(s)[​](#methods-4)

```
`1$pubnub.deleteFile()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel* (Type: string) Channel to delete from.
- fileId* (Type: string) File identifier.
- fileName* (Type: string) File name.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)

Returns PNDeleteFileResult:
- status (Int) Status code.

## Publish file message[​](#publish-file-message)

Publish an uploaded file message to a channel. Called by sendFile. Use directly if sendFile fails with status.operation === PNPublishFileMessageOperation to resend the message without re-uploading.

### Method(s)[​](#methods-5)

```
`1$pubnub.publishFileMessage()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->message(string|array)  
6    ->meta(string|array)  
7    ->shouldStore(Boolean)  
8    ->ttl(Int)  
9    ->customMessageType(string)  
10    ->sync();  
`
```

Parameters:
- channel* (Type: String, Default: n/a) Channel name.
- file_id* (Type: String, Default: n/a) File identifier.
- file_name* (Type: String, Default: n/a) File name.
- message (Type: Dictionary, Default: n/a) Payload.
- meta (Type: Dictionary, Default: n/a) Metadata usable for filtering.
- should_store (Type: Boolean, Default: True) Store in history; set False to skip.
- ttl (Type: Int, Default: 0) How long to store the message; defaults to key set retention if not specified.
- customMessageType (Type: string, Default: n/a) Case-sensitive, 3–50 chars, alphanumeric, dashes/underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-5)

```
1
  

```

### Returns[​](#returns-5)

Returns PNPublishFileMessageResult:
- timestamp (string) Timetoken when the message was published.