# File Sharing API for Kotlin SDK

##### Breaking changes in v9.0.0
- Kotlin SDK 9.0.0 unifies Kotlin and Java SDKs, changes client instantiation, async callbacks, and status events.
- Apps built with < 9.0.0 may need updates. See Java/Kotlin SDK migration guide.

You can upload/share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

##### Request execution
Most SDK methods return an Endpoint. You must call .sync() or .async() to execute.

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

## Send file[​](#send-file)
Uploads a file to a channel and publishes a file message (internally calls publishFileMessage).

### Method(s)[​](#methods)
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
- channel (String, required): Target channel.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): File content.
- message (Any?, optional): Message payload to send with the file.
- meta (Any?, optional): Metadata for message filtering.
- ttl (Int?, optional): How long the message is stored.
- shouldStore (Boolean?, optional, default true): Store the file message in history.
- customMessageType (String, required): Case-sensitive, 3–50 chars, alphanumeric with - and _. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- cipherKey is deprecated. Configure the crypto module on your PubNub instance instead. Passing cipherKey overrides the module and uses legacy 128-bit encryption.

### Sample code[​](#sample-code)
##### Reference code
```
1
  

```

### Response[​](#response)
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

### Returns[​](#returns)
sendFile() returns PNFileUploadResult:
- timetoken (Long): Message publish timetoken.
- status (Int): Remote call status code.
- file (PNBaseFile): Uploaded file info.

PNBaseFile:
- id (Long): Uploaded file ID.
- name (String): Uploaded file name.

## List channel files[​](#list-channel-files)
Retrieves a paginated list of files uploaded to a channel.

### Method(s)[​](#methods-1)
```
`1pubnub.listFiles()  
2    channel: String,  
3    limit: Int,  
4    next: String?  
5)  
`
```

Parameters:
- channel (String, required): Channel to list files from.
- limit (Int, optional, default 100, min 1, max 100): Number of files to return.
- next (String?, optional): Token for forward pagination.

### Sample code[​](#sample-code-1)
```
1
  

```

### Response[​](#response-1)
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

### Returns[​](#returns-1)
listFiles() returns PNListFilesResult:
- timetoken (Long): Message publish timetoken.
- status (Int): Status code.
- next (String): Pagination token for next page.
- count (Int): Number of files returned.
- data (List<PNUploadedFile>): Files.

PNUploadedFile:
- id (Long): File ID.
- name (String): File name.
- size (Int): File size.
- created (String): Creation time.

## Get file URL[​](#get-file-url)
Generates a download URL for a file.

### Method(s)[​](#methods-2)
```
`1pubnub.getFileUrl(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel containing the file.
- fileName (String, required): Stored file name.
- fileId (String, required): File ID from upload.

### Sample code[​](#sample-code-2)
```
1
  

```

### Response[​](#response-2)
```
`1{  
2    "url" : http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/fileID/cat_picture.jpg?pnsdk=PubNub-kotlin-Unified/4.32.0&timestamp=1595771548&uuid=someUuid  
3}  
`
```

### Returns[​](#returns-2)
getFileUrl() returns PNFileUrlResult:
- url (String): Download URL.

## Download file[​](#download-file)
Downloads a file by channel, name, and ID.

### Method(s)[​](#methods-3)
```
`1pubnub.downloadFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel containing the file.
- fileName (String, required): Stored file name.
- fileId (String, required): File ID from upload.

Deprecated parameter:
- cipherKey is deprecated. Use the crypto module instead. Passing cipherKey overrides the module and uses legacy 128-bit encryption.

### Sample code[​](#sample-code-3)
```
1
  

```

### Response[​](#response-3)
```
`1{  
2    "fileName": "cat_picture.jpg",  
3    "byteStream": file data>  
4}  
`
```

### Returns[​](#returns-3)
downloadFile() returns PNDownloadFileResult:
- fileName (string): Downloaded file name.
- byteStream (InputStream): File bytes.

## Delete file[​](#delete-file)
Deletes a file from a channel.

### Method(s)[​](#methods-4)
```
`1pubnub.deleteFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

Parameters:
- channel (String, required): Channel to delete from.
- fileName (String, required): File name to delete.
- fileId (String, required): File ID to delete.

### Sample code[​](#sample-code-4)
```
1
  

```

### Response[​](#response-4)
```
`1{  
2    "status": 200  
3}  
`
```

### Returns[​](#returns-4)
deleteFile() returns PNDeleteFileResult:
- Status (int): Status code.

## Publish file message[​](#publish-file-message)
Publishes a message about an already-uploaded file to a channel. Called internally by sendFile. Use directly if sendFile fails after upload (status.operation === PNPublishFileMessageOperation) to resend the file message without re-uploading.

### Method(s)[​](#methods-5)
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
- fileId (String, required): File ID.
- message (Any?, optional): Payload.
- meta (Any?, optional): Metadata for filtering.
- shouldStore (Boolean, default true): Store in history; set false to skip.
- customMessageType (String, required): Case-sensitive, 3–50 chars, alphanumeric with - and _. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-5)
```
1
  

```

### Response[​](#response-5)
```
`1[1, "Sent", "17483548017978763"]  
`
```

### Returns[​](#returns-5)
publishFileMessage() returns PNFileUploadResult:
- timetoken (Long): Message publish timetoken.
- status (Int): Remote call status code.
- file (PNBaseFile): Uploaded file information.

PNBaseFile:
- id (Long): Unique identifier of the uploaded file.
- name (String): Name of the uploaded file

Last updated on Sep 3, 2025