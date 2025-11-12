# File Sharing API for Kotlin SDK

##### Breaking changes in v9.0.0
PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new client instantiation, and changes async callbacks and emitted status events. These changes can impact apps built with versions < 9.0.0. See the Java/Kotlin SDK migration guide for details.

You can upload/share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

##### Request execution
Most Kotlin SDK methods return an Endpoint. You must call .sync() or .async() to execute, otherwise the operation will not run.

```
1val channel = pubnub.channel("channelName")  
2
  
3channel.publish("This SDK rules!").async { result ->  
4    result.onFailure { exception ->  
5        // Handle error  
6    }.onSuccess { value ->  
7        // Handle successful method result  
8    }  
9}  
```

## Send file

Upload a file to a channel. This performs preparation, upload to storage, then publishes a file message on the channel using publishFileMessage.

### Method(s)
```
`1pubnub.sendFile(  
2    channel: String,  
3    fileName: String,  
4    inputStream: InputStream,  
5    message: Any? = null,  
6    meta: Any? = null,  
7    ttl: Int? = null,  
8    shouldStore: Boolean? = null  
9    customMessageType: String  
10)  
`
```

Parameters:
- channel (String, required): Channel for the file.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): Input stream with file content.
- message (Any?, optional): Message to send along with the file.
- meta (Any?, optional): Metadata object usable with filtering.
- ttl (Int?, optional): How long the message should be stored in channel storage.
- shouldStore (Boolean?, optional, default: true): Whether to store the published file message in channel history.
- customMessageType (String, required): Case-sensitive alphanumeric label (3–50 chars). Dashes and underscores allowed. Cannot start with special chars or pn_ / pn- (e.g., text, action, poll).

Deprecated parameter:
- cipherKey: Deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

### Sample code
##### Reference code
```
1
  

```

### Response
```
`1{  
2  "timetoken": 15957709330808500,  
3  "status": 200,  
4  "file": {  
5      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
6      "name": "cat_picture.jpg"  
7  }  
8}  
`
```

### Returns
PNFileUploadResult
- timetoken (Long): Timetoken when the message was published.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file info.

PNBaseFile
- id (Long): Id of the uploaded file.
- name (String): Name of the uploaded file.

## List channel files

Retrieve a list of files uploaded to a channel.

### Method(s)
```
`1pubnub.listFiles()  
2    channel: String,  
3    limit: Int,  
4    next: String?  
5)  
`
```

Parameters:
- channel (String, required): Channel to get list of files.
- limit (Int, optional, default: 100): Number of files to return (1–100).
- next (String?, optional): Position token for forward pagination.

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
5      "id":"fileId",  
6      "size":25778,  
7      "created":"202007 - 26T13:42:06Z"  
8      }],  
9   "status": 200  
10   "totalCount": 1,  
11   "next": null,  
12   "prev": null  
13}  
`
```

### Returns
PNListFilesResult
- timetoken (Long): Timetoken when the message was published.
- status (Int): Remote call return code.
- next (String): Token for forward pagination.
- count (Int): Number of files returned.
- data (List<PNUploadedFile>): List of channel files.

PNUploadedFile
- id (Long): Id of the uploaded file.
- name (String): Name of the uploaded file.
- size (Int): Size of the uploaded file.
- created (String): Time of creation.

## Get file URL

Generate a URL to download a file from a channel.

### Method(s)
```
`1pubnub.getFileUrl(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel to which the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique identifier assigned during upload.

### Sample code
```
1
  

```

### Response
```
`1{  
2    "url" : http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/fileID/cat_picture.jpg?pnsdk=PubNub-kotlin-Unified/4.32.0&timestamp=1595771548&uuid=someUuid  
3}  
`
```

### Returns
PNFileUrlResult
- url (String): Download URL for the requested file.

## Download file

Download a specific file.

### Method(s)
```
`1pubnub.downloadFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel to which the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique identifier assigned during upload.

Deprecated parameter:
- cipherKey: Deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

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
- fileName (string): Name of the downloaded file.
- byteStream (InputStream): Stream containing file bytes.

## Delete file

Delete a file from a channel.

### Method(s)
```
`1pubnub.deleteFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel from which to delete.
- fileName (String, required): File name to delete.
- fileId (String, required): Unique identifier of the file to delete.

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
- Status (int): Status code.

## Publish file message

Publish the uploaded file message to a channel. Called internally by sendFile after upload. Use directly to retry publishing if sendFile fails with PNPublishFileMessageOperation.

### Method(s)
```
`1pubnub.publishFileMessage(  
2    channel: String,  
3    fileName: String,  
4    fileId: String,  
5    message: Any?,  
6    meta: Any?,  
7    shouldStore: Boolean,  
8    customMessageType: String  
9)  
`
```

Parameters:
- channel (String, required): Channel to publish the file message.
- fileName (String, required): File name.
- fileId (String, required): Unique file identifier.
- message (Any?, optional): Payload.
- meta (Any?, optional): Metadata for filtering.
- shouldStore (Boolean, optional, default: true): Store in history. Set false to skip; otherwise follows key retention.
- customMessageType (String, required): Case-sensitive alphanumeric label (3–50 chars). Dashes and underscores allowed. Cannot start with special chars or pn_ / pn- (e.g., text, action, poll).

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
- timetoken (Long): Timetoken at which the message was published.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file information.

PNBaseFile
- id (Long): Unique identifier of the uploaded file
- name (String): Name of the uploaded file