# File Sharing API for Kotlin SDK

##### Breaking changes in v9.0.0

Kotlin SDK v9.0.0 unifies Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new PubNub client instantiation, and changes async callbacks and [status events](/docs/sdks/kotlin/status-events). See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

You can upload and share files up to 5 MB. When a file is uploaded to a `channel`, subscribers receive a file event with file `ID`, `filename`, and optional `description`.

##### Request execution

Most method calls return an Endpoint. You must call `.sync()` or `.async()` to execute the request.

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

Uploads a file to a channel and publishes a file message (internally calls [`publishFileMessage`](#publish-file-message)).

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

- channel (String, required): Channel for the file.
- fileName (String, required): Name of the file to send.
- inputStream (InputStream, required): Input stream with file content.
- message (Any?, optional): Message to send along with the file.
- meta (Any?, optional): Metadata for message filtering.
- ttl (Int?, optional): How long the message should be stored.
- shouldStore (Boolean?, optional, default true): Whether to store the file message in history.
- customMessageType (String, required): Case-sensitive, 3–50 chars, alphanumeric with `-` and `_` allowed. Cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.

##### Deprecated parameter

`cipherKey` is deprecated. Configure the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) instead. Passing `cipherKey` overrides the crypto module and uses legacy 128-bit entropy encryption.

### Sample code

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

`PNFileUploadResult`:
- timetoken (Long): Publish timetoken.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file info.

`PNBaseFile`:
- id (Long): Uploaded file ID.
- name (String): Uploaded file name.

## List channel files

Retrieves files uploaded to a `channel`.

### Method(s)

```
`1pubnub.listFiles()  
2    channel: String,  
3    limit: Int,  
4    next: String?  
5)  
`
```

- channel (String, required): Channel to list files for.
- limit (Int, optional, default 100): 1–100.
- next (String?, optional): Server pagination token for next page.

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

`PNListFilesResult`:
- timetoken (Long): Publish timetoken.
- status (Int): Remote call return code.
- next (String): Pagination token for next page.
- count (Int): Number of files returned.
- data (List<PNUploadedFile>): List of files.

`PNUploadedFile`:
- id (Long): File ID.
- name (String): File name.
- size (Int): File size.
- created (String): Creation time.

## Get file URL

Generates a download URL for a file on a channel.

### Method(s)

```
`1pubnub.getFileUrl(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

- channel (String, required): Channel of the uploaded file.
- fileName (String, required): Stored filename.
- fileId (String, required): File identifier.

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

`PNFileUrlResult`:
- url (String): Download URL.

## Download file

Downloads the specified file.

### Method(s)

```
`1pubnub.downloadFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

- channel (String, required): Channel of the uploaded file.
- fileName (String, required): Stored filename.
- fileId (String, required): File identifier.

##### Deprecated parameter

`cipherKey` is deprecated. Use the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule). Passing `cipherKey` overrides it and uses legacy 128-bit entropy encryption.

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

`PNDownloadFileResult`:
- fileName (string): Downloaded file name.
- byteStream (InputStream): File bytes stream.

## Delete file

Deletes a file from a channel.

### Method(s)

```
`1pubnub.deleteFile(  
2    channel: String,  
3    fileName: String,  
4    fileId: String  
5)  
`
```

- channel (String, required): Channel to delete from.
- fileName (String, required): File name to delete.
- fileId (String, required): File identifier to delete.

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

`PNDeleteFileResult`:
- Status (int): Status code.

## Publish file message

Publishes a file message to a channel (used by [`sendFile`](#send-file)). Use this if `sendFile` fails with `status.operation === PNPublishFileMessageOperation` to publish the message without re-uploading.

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

- channel (String, required): Channel to publish to.
- fileName (String, required): File name.
- fileId (String, required): File identifier.
- message (Any?, optional): Payload.
- meta (Any?, optional): Metadata for filtering.
- shouldStore (Boolean, optional, default true): Store in history.
- customMessageType (String, required): Case-sensitive, 3–50 chars, alphanumeric with `-` and `_` allowed; cannot start with special chars or `pn_`/`pn-`. Examples: `text`, `action`, `poll`.

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

`PNFileUploadResult`:
- timetoken (Long): Publish timetoken.
- status (Int): Remote call return code.
- file (PNBaseFile): Uploaded file information.

`PNBaseFile`:
- id (Long): Unique identifier of the uploaded file
- name (String): Name of the uploaded file

Last updated on Sep 3, 2025