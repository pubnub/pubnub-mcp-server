# File Sharing API for PHP SDK

Upload and share files up to 5 MB on a channel. Uploaded files are stored and associated with your key. Channel subscribers receive a file event with file ID, filename, and optional description.

## Send file

Upload a file to a channel and publish a file message (internally calls publishFileMessage).

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
- channel (string, required): Target channel.
- fileName (string, required): Name of the file to send.
- message (string|array): Message to send with the file.
- shouldStore (Boolean, default: True): Store the published file message in channel history.
- shouldCompress (Boolean, default: True): Compress the request payload.
- ttl (Int): How long the message is stored.
- fileHandle (Resource): Pointer to a readable resource.
- fileContent (bytes|File): Input stream with file content.
- meta (string|array): Metadata for message filtering.
- customMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

```
1
  
```

### Returns

PNSendFileResult:
- name (string): Uploaded file name.
- fileId (string): Uploaded file ID.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1$pubnub->listFiles()  
2    ->channel(string)  
3    ->sync();  
`
```

Parameters:
- channel (string, required): Channel to list files from.

### Sample code

```
1
  
```

### Returns

PNGetFilesResult:
- next (string): Token for forward pagination.
- prev (string): Token for backward pagination.
- count (Int): Number of files returned.
- data (Array<PNGetFilesItem>)

PNGetFilesItem:
- id (string): File ID.
- name (string): File name.
- size (string): File size.
- creationTime (string): Creation time.

## Get file URL

Generate a download URL for a file.

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
- channel (string, required): Channel of the uploaded file.
- fileName (string, required): Stored file name.
- fileId (string, required): File identifier.

### Sample code

```
1
  
```

### Returns

PNGetFileDownloadURLResult:
- fileUrl (string): URL for downloading the file.

## Download file

Download a file from a channel.

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
- channel (string, required): Channel of the uploaded file.
- fileName (string, required): Stored file name.
- fileId (string, required): File identifier.

### Sample code

```
1
  
```

### Returns

PNDownloadFileResult:
- fileContent (bytes): The downloaded file content.

## Delete file

Delete a file from a channel.

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
- channel (string, required): Channel from which to delete.
- fileId (string, required): File identifier.
- fileName (string, required): File name.

### Sample code

```
1
  
```

### Returns

PNDeleteFileResult:
- status (Int): Status code.

## Publish file message

Publish the uploaded file message to a channel. Called internally by sendFile; use directly to resend a file message without re-uploading if sendFile fails with operation PNPublishFileMessageOperation.

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
- channel (String, required): Channel to publish the file message.
- file_id (String, required): File identifier.
- file_name (String, required): File name.
- message (Dictionary): Payload.
- meta (Dictionary): Metadata for filtering.
- should_store (Boolean, default: True): Store message in history.
- ttl (Int, default: 0): Time to store the message; defaults to key set retention if not specified.
- customMessageType (string): 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

```
1
  
```

### Returns

PNPublishFileMessageResult:
- timestamp (string): Timetoken when the message was published.

Last updated on Sep 3, 2025