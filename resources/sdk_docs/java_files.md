# File Sharing API for Java SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new PubNub client instantiation, and changes asynchronous API callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

Use the Files API to upload and share files up to 5 MB. When a file is uploaded to a channel, it's stored and associated with your key. Channel subscribers receive a file event with file ID, filename, and optional description.

## Send file

Uploads a file to storage and publishes a file message to the channel. Internally calls publishFileMessage.

##### Don't JSON serialize
Don't JSON serialize the message and meta parameters; pass full objects.

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

- channel (String, required): Channel for the file.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): Input stream with file content.
- message (Object): Message to send with the file.
- shouldStore (Boolean, default: true): Store the published file message in channel history.
- meta (Object): Metadata for message filtering.
- ttl (Integer): How long the message should be stored.
- customMessageType (String): Case-sensitive, 3–50 chars, alphanumeric with dashes/underscores; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

##### Deprecated parameter
cipherKey is deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

##### Reference code

```
1
  

```

### Returns

PNFileUploadResult:
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info.

PNBaseFile:
- id (Long): ID of the uploaded file.
- name (String): Name of the uploaded file.

## List channel files

Retrieve a list of files uploaded to a channel.

### Method(s)

```
`1pubnub.listFiles()  
2    .channel(String)  
3    .limit(Integer)  
4    .next(String)  
`
```

- channel (String, required): Channel to list files from.
- limit (Integer, default: 100): Number of files to return. Min 1, max 100.
- next (String): Server-provided position token for forward pagination.

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
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- next (String): Pagination token for next page.
- count (Integer): Number of files returned.
- data (List): List of channel files.

PNUploadedFile:
- id (Long): ID of the uploaded file.
- name (String): Name of the uploaded file.
- size (Integer): Size of the uploaded file.
- created (String): Time of creation.

## Get file URL

Generate a URL to download a file from a channel.

### Method(s)

```
`1pubnub.getFileUrl()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

- channel (String, required): Channel the file was uploaded to.
- fileName (String, required): Stored file name.
- fileId (String, required): File identifier assigned during upload.

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
- url (String): Download URL for the file.

## Download file

Download a file from the specified channel.

### Method(s)

```
`1pubnub.downloadFile()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

- channel (String, required): Channel the file was uploaded to.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique file identifier.

##### Deprecated parameter
cipherKey is deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit encryption.

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
- fileName (String): Name of the downloaded file.
- byteStream (InputStream): Input stream with file bytes.

## Delete file

Delete a file from the specified channel.

### Method(s)

```
`1pubnub.deleteFile()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

- channel (String, required): Channel from which to delete the file.
- fileName (String, required): Name of the file to delete.
- fileId (String, required): Unique file identifier to delete.

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

Publish the uploaded file message to a channel. Called internally by sendFile. Use directly if sendFile fails with status.operation === PNPublishFileMessageOperation to resend the file message without reuploading.

##### Don't JSON serialize
Don't JSON serialize the message and meta parameters; pass full objects.

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

- channel (String, required): Channel to publish the file message.
- fileName (String, required): File name.
- fileId (String, required): File identifier.
- message (Object): Payload.
- meta (Object): Metadata for filtering.
- shouldStore (Boolean, default: true): Store message in history; set false to skip.
- customMessageType (String): Case-sensitive, 3–50 chars, alphanumeric with dashes/underscores; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

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
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info.

PNBaseFile:
- id (Long): Unique identifier of the uploaded file
- name (String): Name of the uploaded file

Last updated on Sep 3, 2025