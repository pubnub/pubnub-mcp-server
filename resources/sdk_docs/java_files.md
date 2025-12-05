# File Sharing API for Java SDK

Breaking changes in v9.0.0
- Java SDK v9.0.0 unifies Java and Kotlin SDKs, introduces a new way to instantiate PubNub, and changes async callbacks and status events. See Java/Kotlin SDK migration guide and status events.

Use the Files API to upload and share files up to 5 MB on a channel. Uploads are stored and associated with your key. Channel subscribers receive a file event with file ID, filename, and optional description.

## Send file

Upload a file to a channel and publish a file message with its metadata. Internally calls publishFileMessage after upload.

Don't JSON serialize
- Do not JSON-serialize message and meta; pass objects directly.

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

Parameters
- channel (String, required): Channel for the file.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): Input stream with file content.
- message (Object): Message payload to send with the file.
- shouldStore (Boolean, default true): Store the file message in channel history.
- meta (Object): Metadata for message filtering.
- ttl (Integer): How long the message is stored.
- customMessageType (String): Case-sensitive 3–50 char label (alphanumeric, dash, underscore). Must not start with special chars or pn_/pn- (examples: text, action, poll).

Deprecated parameter
- cipherKey: Deprecated. Configure the crypto module on your PubNub instance instead. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

PNFileUploadResult
- timetoken (Long): Timetoken when message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info.
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

Parameters
- channel (String, required): Channel to list files from.
- limit (Integer, default 100): 1–100 number of files to return.
- next (String): Forward pagination cursor to fetch the next page.

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

PNListFilesResult
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- next (String): Forward pagination cursor.
- count (Integer): Number of files returned.
- data (List<PNUploadedFile>): Channel files.
  - id (Long): ID of the uploaded file.
  - name (String): Name of the uploaded file.
  - size (Integer): Size of the uploaded file.
  - created (String): Creation time.

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

Parameters
- channel (String, required): Channel where the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique file ID from upload.

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

PNFileUrlResult
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

Parameters
- channel (String, required): Channel where the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique file ID from upload.

Deprecated parameter
- cipherKey: Deprecated. Configure the crypto module on your PubNub instance instead. If provided, it overrides crypto module config and uses legacy 128-bit encryption.

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

PNDownloadFileResult
- fileName (String): Downloaded file name.
- byteStream (InputStream): InputStream with downloaded file bytes.

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

Parameters
- channel (String, required): Channel to delete from.
- fileName (String, required): File name to delete.
- fileId (String, required): Unique file ID to delete.

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

PNDeleteFileResult
- Status (Integer): Status code.

## Publish file message

Publish the uploaded file message to a channel. Used internally by sendFile. Can be called manually if sendFile fails after upload.

Don't JSON serialize
- Do not JSON-serialize message and meta; pass objects directly.

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

Parameters
- channel (String, required): Channel to publish the file message.
- fileName (String, required): File name.
- fileId (String, required): Unique file identifier.
- message (Object): Payload.
- meta (Object): Metadata for filtering.
- shouldStore (Boolean, default true): Store in history (subject to key retention policy).
- customMessageType (String): Case-sensitive 3–50 char label (alphanumeric, dash, underscore). Must not start with special chars or pn_/pn- (examples: text, action, poll).

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

PNFileUploadResult
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file info.
  - id (Long): Unique identifier of the uploaded file
  - name (String): Name of the uploaded file

Last updated on Sep 3, 2025