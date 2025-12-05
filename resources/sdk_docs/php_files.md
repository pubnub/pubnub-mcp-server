# File Sharing API for PHP SDK

Upload and share files up to 5 MB per file on a channel. When a file is uploaded, subscribers to that channel receive a file event containing file ID, filename, and optional description.

## Send file[​](#send-file)

Uploads a file and publishes its metadata as a message on the channel. Internally calls Publish file message.

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
- channel (string, required): Channel for the file.
- fileName (string, required): Name of the file to send.
- message (string|array): Message to send along with the file.
- shouldStore (Boolean, default: True): Store the published file message in channel history.
- shouldCompress (Boolean, default: True): Compress the request payload.
- ttl (Int): How long the message is stored in channel storage.
- fileHandle (Resource): Pointer to a readable resource for file content.
- fileContent (bytes|PHP file object): Input stream with file content.
- meta (string|array): Metadata for message filtering.
- customMessageType (string): 3–50 chars; case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

Returns PNSendFileResult.

PNSendFileResult:
- name (string): Uploaded file name.
- fileId (string): Uploaded file ID.

## List channel files[​](#list-channel-files)

Retrieve a list of files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1$pubnub->listFiles()  
2    ->channel(string)  
3    ->sync();  
`
```

Parameters:
- channel (string, required): Channel to list files from.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

Returns PNGetFilesResult.

PNGetFilesResult:
- next (string): Cursor for forward pagination.
- prev (string): Cursor for backward pagination.
- count (Int): Number of files returned.
- data (Array of PNGetFilesItem)

PNGetFilesItem:
- id (string): File ID.
- name (string): File name.
- size (string): File size.
- creationTime (string): Time of creation.

## Get file URL[​](#get-file-url)

Generate a URL to download a file from the target channel.

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
- channel (string, required): Channel where the file was uploaded.
- fileId (string, required): Unique identifier for the file.
- fileName (string, required): Stored file name.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

Returns PNGetFileDownloadURLResult.

PNGetFileDownloadURLResult:
- fileUrl (string): Download URL for the file.

## Download file[​](#download-file)

Download a file from the specified channel.

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
- channel (string, required): Channel where the file was uploaded.
- fileId (string, required): Unique identifier for the file.
- fileName (string, required): Stored file name.

### Sample code[​](#sample-code-3)

```
1
  

```

### Returns[​](#returns-3)

Returns PNDownloadFileResult.

PNDownloadFileResult:
- fileContent (bytes): The downloaded file content.

## Delete file[​](#delete-file)

Delete a file from the specified channel.

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
- channel (string, required): Channel from which to delete the file.
- fileId (string, required): Unique identifier of the file to delete.
- fileName (string, required): Name of the file to delete.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)

Returns PNDeleteFileResult.

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message[​](#publish-file-message)

Publish a message on a channel referencing an already uploaded file (called internally by sendFile). If sendFile fails with status.operation === PNPublishFileMessageOperation, use this to retry publishing without re-uploading.

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
- channel (string, required): Channel to publish the file message to.
- fileId (string, required): Unique identifier of the file.
- fileName (string, required): Name of the file.
- message (string|array): Payload.
- meta (string|array): Metadata for filtering.
- shouldStore (Boolean, default: True): Store the message in history; set False to skip.
- ttl (Int, default: 0): How long to store the message; defaults to key’s retention if not set.
- customMessageType (string): 3–50 chars; case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-5)

```
1
  

```

### Returns[​](#returns-5)

Returns PNPublishFileMessageResult.

PNPublishFileMessageResult:
- timestamp (string): Timetoken when the message was published.