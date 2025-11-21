# File Sharing API for JavaScript SDK

##### Breaking changes in v9.0.0

PubNub Java SDK v9.0.0 unifies Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new PubNub client instantiation, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with versions < 9.0.0. See the [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide) for details.

Use the Files API to upload and share files up to 5 MB on PubNub. When a file is uploaded to a channel, it is stored using a storage service and associated with your key. Subscribers to that channel receive a file event containing the file ID, filename, and optional description.

## Send file

Upload the file to a specified channel. This includes preparing, uploading to storage, and publishing a message on the channel. Internally calls [publishFileMessage](#publish-file-message).

##### Don't JSON serialize
Pass objects directly for message and meta; serialization is automatic.

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

- channel (required)
  - Type: String
  - Description: Channel for the file.
- fileName (required)
  - Type: String
  - Description: Name of the file to send.
- inputStream (required)
  - Type: InputStream
  - Description: Input stream with file content.
- message
  - Type: Object
  - Description: Message to send along with the file to the channel.
- shouldStore
  - Type: Boolean
  - Default: true
  - Description: Whether to store the published file message in channel history.
- meta
  - Type: Object
  - Description: Metadata object for message filtering.
- ttl
  - Type: Integer
  - Description: How long the message should be stored in the channel's storage.
- customMessageType
  - Type: String
  - Description: Case-sensitive, alphanumeric string (3–50 chars). Dashes and underscores allowed. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.

##### Deprecated parameter
cipherKey is deprecated. Configure the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) on your PubNub instance instead. If passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  

```

### Returns

sendFile() returns PNFileUploadResult:
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file information.

PNBaseFile:
- id (Long): Id of the uploaded file.
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

- channel (required)
  - Type: String
  - Description: Channel to get list of files.
- limit
  - Type: Integer
  - Default: 100
  - Constraints: 1–100
  - Description: Number of files to return.
- next
  - Type: String
  - Description: Pagination cursor for fetching the next page.

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

listFiles() returns PNListFilesResult:
- timetoken (Long): Timetoken when the message was published.
- status (Integer): Remote call return code.
- next (String): Pagination cursor for the next page.
- count (Integer): Number of files returned.
- data (List): List of channel files.

PNUploadedFile:
- id (Long): Id of the uploaded file.
- name (String): Name of the uploaded file.
- size (Integer): Size of the uploaded file.
- created (String): Time of creation.

## Get file URL

Generate a URL to download a file from the target channel.

### Method(s)

```
`1pubnub.getFileUrl()  
2    .channel(String)  
3    .fileName(String)  
4    .fileId(String)  
`
```

- channel (required)
  - Type: String
  - Description: Name of channel to which the file has been uploaded.
- fileName (required)
  - Type: String
  - Description: Name under which the uploaded file is stored.
- fileId (required)
  - Type: String
  - Description: Unique identifier for the file, assigned during upload.

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

getFileUrl() returns PNFileUrlResult:
- url (String): URL to download the requested file.

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

- channel (required)
  - Type: String
  - Description: Name of channel to which the file has been uploaded.
- fileName (required)
  - Type: String
  - Description: Name under which the uploaded file is stored.
- fileId (required)
  - Type: String
  - Description: Unique identifier for the file, assigned during upload.

##### Deprecated parameter
cipherKey is deprecated. Configure the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule). If passed, it overrides the crypto module and uses legacy 128-bit encryption.

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

downloadFile() returns PNDownloadFileResult:
- fileName (String): Name of the downloaded file.
- byteStream (InputStream): Input stream containing all bytes of the downloaded file.

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

- channel (required)
  - Type: String
  - Description: Channel from which to delete the file.
- fileName (required)
  - Type: String
  - Description: Name of the file to be deleted.
- fileId (required)
  - Type: String
  - Description: Unique identifier of the file to be deleted.

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

deleteFile() returns PNDeleteFileResult:
- Status (Integer): Status code.

## Publish file message

Publish the uploaded file message to a specified channel. Called internally by [sendFile](#send-file). Use this to manually resend a file message without re-uploading if sendFile fails with status.operation === PNPublishFileMessageOperation.

##### Don't JSON serialize
Pass objects directly for message and meta; serialization is automatic.

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

- channel (required)
  - Type: String
  - Description: Name of channel to publish file message.
- fileName (required)
  - Type: String
  - Description: Name of the file.
- fileId (required)
  - Type: String
  - Description: Unique identifier of the file.
- message
  - Type: Object
  - Description: The payload.
- meta
  - Type: Object
  - Description: Metadata object for message filtering.
- shouldStore
  - Type: Boolean
  - Default: true
  - Description: Whether to store this message in history.
- customMessageType
  - Type: String
  - Description: Case-sensitive, alphanumeric string (3–50 chars). Dashes and underscores allowed. Cannot start with special characters or pn_/pn-. Examples: text, action, poll.

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

publishFileMessage() returns PNFileUploadResult:
- timetoken (Long): Timetoken at which the message was published.
- status (Integer): Remote call return code.
- file (PNBaseFile): Uploaded file information.

PNBaseFile:
- id (Long): Unique identifier of the uploaded file
- name (String): Name of the uploaded file

Last updated on Sep 3, 2025