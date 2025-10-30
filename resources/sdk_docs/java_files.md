# File Sharing API for Java SDK

##### Breaking changes in v9.0.0
PubNub Java SDK v9.0.0 unifies Java and Kotlin codebases, changes client instantiation, async callbacks, and emitted status events. Apps using < 9.0.0 may be impacted. See Java/Kotlin SDK migration guide.

Use the Files API to upload and share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file and publishes a file message on the channel. Internally calls publishFileMessage to announce the file (ID and name) to subscribers.

##### Don't JSON serialize
Pass full objects for message and meta; SDK handles serialization.

### Method(s)
```
`1pubnub.sendFile()  
2    .channel(String)  
3    .fileName(String)  
4    .inputStream(InputStream)  
5    .message(Object)  
6    .shouldStore(Boolean)  
7    .meta(Object)  
8    .ttl(Integer)  
9    .customMessageType(String)  
`
```

Parameters:
- channel (String, required): Channel for the file.
- fileName (String, required): File name.
- inputStream (InputStream, required): File content.
- message (Object): Message payload to send with the file.
- shouldStore (Boolean, default: true): Store the file message in history.
- meta (Object): Metadata for filtering.
- ttl (Integer): How long to store the message.
- customMessageType (String): Business-specific label (3–50 chars, alphanumeric, dashes/underscores allowed, cannot start with special chars or pn_/pn-). Examples: text, action, poll.

##### Deprecated parameter
cipherKey is deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code
```
1
  

```

### Returns
PNFileUploadResult:
- timetoken (Long): Publish timetoken.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info:
  - id (Long): File ID.
  - name (String): File name.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)
```
`1pubnub.listFiles()  
2    .channel(String)  
3    .limit(Integer)  
4    .next(String)  
`
```

Parameters:
- channel (String, required): Channel to list files from.
- limit (Integer, default: 100, min: 1, max: 100): Number of files.
- next (String): Server-provided cursor for forward pagination.

### Sample code
```
1
  

```

### Response
```
`1{  
2  "data":[  
3      {  
4      "name":"cat_picture.jpg",  
5      "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
6      "size":25778,  
7      "created":"2025-05-27T13:55:35Z"  
8      }],  
9   "status": 200  
10   "count": 1,  
11   "next": null  
12}  
`
```

### Returns
PNListFilesResult:
- timetoken (Long): Publish timetoken.
- status (Integer): Remote call return code.
- next (String): Cursor for next page.
- count (Integer): Number of files returned.
- data (List<PNUploadedFile>): Files:
  - id (Long): File ID.
  - name (String): File name.
  - size (Integer): File size.
  - created (String): Creation time.

## Get file URL

Generate a direct download URL for a file in a channel.

### Method(s)
```
`1pubnub.getFileUrl()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

Parameters:
- channel (String, required): Channel of the file.
- fileName (String, required): Stored file name.
- fileId (String, required): File ID from upload.

### Sample code
```
1
  

```

### Response
```
`1{  
2  "url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=PubNub-Java-Unified/4.32.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
3}  
`
```

### Returns
PNFileUrlResult:
- url (String): Download URL.

## Download file

Download a file from a channel.

### Method(s)
```
`1pubnub.downloadFile()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

Parameters:
- channel (String, required): Channel of the file.
- fileName (String, required): Stored file name.
- fileId (String, required): File ID from upload.

##### Deprecated parameter
cipherKey is deprecated. Configure the crypto module instead. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code
```
1
  

```

### Response
```
`1{  
2    "fileName": "cat_picture.jpg",  
3    "byteStream": file data>  
4}  
`
```

### Returns
PNDownloadFileResult:
- fileName (String): File name.
- byteStream (InputStream): File bytes.

## Delete file

Delete a file from a channel.

### Method(s)
```
`1pubnub.deleteFile()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

Parameters:
- channel (String, required): Channel to delete from.
- fileName (String, required): File name.
- fileId (String, required): File ID.

### Sample code
```
1
  

```

### Response
```
`1{  
2    "status": 200  
3}  
`
```

### Returns
PNDeleteFileResult:
- Status (Integer): Status code.

## Publish file message

Publishes a file message (with file ID and name) to a channel. Called internally by sendFile. Use directly to retry publishing if sendFile fails after upload (status.operation === PNPublishFileMessageOperation).

##### Don't JSON serialize
Pass full objects for message and meta; SDK handles serialization.

### Method(s)
```
`1pubnub.publishFileMessage()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
5    .message(Object)  
6    .meta(Object)  
7    .shouldStore(Boolean)  
8    .customMessageType(String)  
`
```

Parameters:
- channel (String, required): Channel to publish to.
- fileName (String, required): File name.
- fileId (String, required): File ID.
- message (Object): Payload.
- meta (Object): Metadata for filtering.
- shouldStore (Boolean, default: true): Store message in history.
- customMessageType (String): Business-specific label (3–50 chars, alphanumeric, dashes/underscores allowed, cannot start with special chars or pn_/pn-). Examples: text, action, poll.

### Sample code
```
1
  

```

### Response
```
`1[1, "Sent", "17483548017978763"]  
`
```

### Returns
PNFileUploadResult:
- timetoken (Long): Publish timetoken.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info:
  - id (Long): Unique identifier.
  - name (String): File name.

Last updated on Sep 3, 2025