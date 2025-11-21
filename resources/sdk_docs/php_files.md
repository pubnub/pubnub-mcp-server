# File Sharing API for PHP SDK

Upload and share files up to 5 MB on a channel. When a file is uploaded, subscribers receive a file event with file ID, filename, and optional description.

## Send file

Uploads a file to a channel and publishes a file message. Internally calls Publish file message to notify the channel.

### Method(s)

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
- channel (required) – Type: string – Default: n/a – Channel for the file.
- fileName (required) – Type: string – Default: n/a – Name of the file to send.
- message – Type: string or array – Default: n/a – Message to send along with the file.
- shouldStore – Type: Boolean – Default: True – Whether to store the published file message in channel history.
- shouldCompress – Type: Boolean – Default: True – Whether to compress the request payload.
- ttl – Type: Integer – Default: n/a – How long the message should be stored.
- fileHandle (required) – Type: Resource – Default: n/a – Pointer to a resource to read into the buffer.
- fileContent (required) – Type: bytes or PHP file object – Default: n/a – Input stream with file content.
- meta – Type: string or array – Default: n/a – Metadata for message filtering.
- customMessageType – Type: string – Default: n/a – 3–50 char, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

```
1
  

```

### Returns

PNSendFileResult:
- name (string): Name of the uploaded file.
- fileId (string): ID of the uploaded file.

## List channel files

Retrieve a list of files uploaded to a channel.

### Method(s)

```
`1$pubnub->listFiles()  
2    ->channel(string)  
3    ->sync();  
`
```

Parameters:
- channel (required) – Type: string – Default: n/a – Channel to get the list of files.

### Sample code

```
1
  

```

### Returns

PNGetFilesResult:
- next (string): Token for forward pagination.
- prev (string): Token for backward pagination.
- count (Int): Number of files returned.
- data (Array): Array of PNGetFilesItem.

PNGetFilesItem:
- id (string): Id of the uploaded file.
- name (string): Name of the uploaded file.
- size (string): Size of the uploaded file.
- creationTime (string): Time of creation.

## Get file URL

Generate a URL to download a file from the target channel.

### Method(s)

```
`1$pubnub.getFileDownloadUrl()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel (required) – Type: string – Name of channel to which the file has been uploaded.
- fileName (required) – Type: string – Name under which the uploaded file is stored.
- fileId (required) – Type: string – Unique identifier for the file.

### Sample code

```
1
  

```

### Returns

PNGetFileDownloadURLResult:
- fileUrl (string): URL to download the requested file.

## Download file

Download a file from the specified channel.

### Method(s)

```
`1$pubnub.downloadFile()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel (required) – Type: string – Name of channel to which the file has been uploaded.
- fileName (required) – Type: string – Name under which the uploaded file is stored.
- fileId (required) – Type: string – Unique identifier for the file.

### Sample code

```
1
  

```

### Returns

PNDownloadFileResult:
- fileContent (bytes): The file that was uploaded.

## Delete file

Delete a file from the specified channel.

### Method(s)

```
`1$pubnub.deleteFile()  
2    ->channel(string)  
3    ->fileId(string)  
4    ->fileName(string)  
5    ->sync()  
`
```

Parameters:
- channel (required) – Type: string – The channel from which to delete the file.
- fileId (required) – Type: string – Unique identifier of the file to be deleted.
- fileName (required) – Type: string – Name of the file to be deleted.

### Sample code

```
1
  

```

### Returns

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message

Publish the uploaded file message to a specified channel. Called by sendFile to notify the channel that a file is available. Use directly if sendFile upload succeeded but publishing failed.

### Method(s)

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
- channel (required) – Type: String – Default: n/a – Name of channel to publish file message.
- file_id (required) – Type: String – Default: n/a – Unique identifier of the file.
- file_name (required) – Type: String – Default: n/a – Name of the file.
- message – Type: Dictionary – Default: n/a – The payload.
- meta – Type: Dictionary – Default: n/a – Metadata for filtering.
- should_store – Type: Boolean – Default: True – Whether to store this message in history.
- ttl – Type: Int – Default: 0 – How long the message should be stored in history.
- customMessageType – Type: string – Default: n/a – 3–50 char, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

```
1
  

```

### Returns

PNPublishFileMessageResult:
- timestamp (string): Timetoken when the message was published.