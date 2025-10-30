# File Sharing API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK v9.0.0 unifies Kotlin and Java SDKs, introduces a new PubNub client instantiation, and changes async callbacks and emitted status events. Apps built with versions < 9.0.0 may be impacted. See the Java/Kotlin SDK migration guide.

You can upload and share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

##### Request execution

Most method invocations return an Endpoint; call .sync() or .async() to execute.

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

Uploads a file to a channel, then publishes a file message (internally calls publishFileMessage).

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

- channel (String, required): Channel for the file.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): Input stream with file content.
- message (Any?, optional): Message to send with the file.
- meta (Any?, optional): Metadata for filtering.
- ttl (Int?, optional): How long the message should be stored.
- shouldStore (Boolean?, default true): Store the published file message in channel history.
- customMessageType (String, required): Case-sensitive, 3–50 chars; alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead. Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

PNFileUploadResult:
- timetoken (Long): Timetoken when the message was published.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file info.

PNBaseFile:
- id (Long): Id of the uploaded file.
- name (String): Name of the upload file.

## List channel files[​](#list-channel-files)

Retrieves files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1pubnub.listFiles()  
2    channel: String,  
3    limit: Int,  
4    next: String?  
5)  
`
```

- channel (String, required): Channel to get list of files.
- limit (Int, default 100): 1–100.
- next (String?, optional): Server-provided cursor for forward pagination.

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

PNListFilesResult:
- timetoken (Long): Timetoken when the message was published.
- status (Int): Remote call return code.
- next (String): Cursor for forward pagination.
- count (Int): Number of files returned.
- data (List<PNUploadedFile>): List of channel files.

PNUploadedFile:
- id (Long): Id of the uploaded file.
- name (String): Name of the upload file.
- size (Int): Size of the uploaded file.
- created (String): Time of creation.

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

- channel (String, required): Channel to which the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique file identifier.

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

PNFileUrlResult:
- url (String): Download URL.

## Download file[​](#download-file)

Downloads the specified file.

### Method(s)[​](#methods-3)

```
`1pubnub.downloadFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

- channel (String, required): Channel to which the file was uploaded.
- fileName (String, required): Stored file name.
- fileId (String, required): Unique file identifier.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead. Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

PNDownloadFileResult:
- fileName (string): Name of the downloaded file.
- byteStream (InputStream): Input stream with file bytes.

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

- channel (String, required): Channel from which to delete the file.
- fileName (String, required): Name of the file to delete.
- fileId (String, required): Unique identifier of the file to delete.

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

PNDeleteFileResult:
- Status (int): Status code.

## Publish file message[​](#publish-file-message)

Publishes a file message to a channel (used internally by sendFile; can be called to resend a message if sendFile upload succeeded but message publish failed).

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

- channel (String, required): Channel to publish file message.
- fileName (String, required): Name of the file.
- fileId (String, required): Unique identifier of the file.
- message (Any?, optional): Payload.
- meta (Any?, optional): Metadata for filtering.
- shouldStore (Boolean, default true): Store in history; set false to skip.
- customMessageType (String, required): Case-sensitive, 3–50 chars; alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

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

The sendFile() operation returns a PNFileUploadResult:

- timetoken (Long): The timetoken at which the message was published.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file information.

PNBaseFile:
- id (Long): Unique identifier of the uploaded file
- name (String): Name of the uploaded file

Last updated on Sep 3, 2025