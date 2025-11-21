# File Sharing API for Dart SDK

Upload and share files up to 5 MB. Uploaded files on a channel trigger file events with file ID, filename, and optional description.

## Send file

Uploads the file and publishes a file message to the channel. Internally calls Publish file message.

### Method(s)

```
`1pubnub.files.sendFile(  
2  String channel,   
3  String fileName,   
4  Listint> file,  
5  {dynamic? fileMessage,  
6  bool? storeFileMessage,  
7  int? fileMessageTtl,  
8  String? customMessageType  
9  dynamic? fileMessageMeta,  
10  Keyset? keyset,  
11  String? using}  
12)  
`
```

Parameters:
- channel (String, required): Channel to send the file to.
- fileName (String, required): Name of the file.
- file (List<int>, required): File content.
- fileMessage (dynamic, default: null): Message published with the file.
- storeFileMessage (bool, default: true): Store the message in history. If unset, key’s history config is used.
- fileMessageTtl (int): TTL hours if stored. 0 = no expiry. Ignored if storeFileMessage is false. If unset, uses key’s expiry unless keyset retention is Unlimited.
- customMessageType (String): 3–50 chars, alphanumeric, dashes and underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).
- fileMessageMeta (dynamic): Additional metadata for stream filtering.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.

Deprecated parameter:
- cipherKey: Deprecated; use crypto module instead. If passed, overrides crypto module and uses legacy 128-bit encryption.

### Sample code

##### Reference code
```
1import 'dart:convert';  
2import 'package:pubnub/pubnub.dart';  
3
  
4void main() async {  
5  // Create PubNub instance with default keyset.  
6  var pubnub = PubNub(  
7    defaultKeyset: Keyset(  
8      subscribeKey: 'demo',  
9      publishKey: 'demo',  
10      userId: UserId('myUniqueUserId'),  
11    ),  
12  );  
13
  
14  // File details  
15  String channel = 'my_channel';  
16  String fileName = 'example.txt';  
17  Listint> fileContent = utf8.encode('Hello, PubNub! This is a test file.');  
18
  
19  // Send the file  
20  var result = await pubnub.files.sendFile(  
21    channel,  
22    fileName,  
23    fileContent,  
24    fileMessage: 'Check out this file!',  
25  );  
26
  
27  // Print result  
28  print('File uploaded and file message published - timetoken ${result.timetoken}');  
29}  
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

PublishFileMessageResult:
- timetoken (int): Publish timetoken.
- isError (Boolean): Error status.
- description (String): Operation status.
- fileInfo (FileInfo): Uploaded file info.

FileInfo:
- id (String): Uploaded file ID.
- name (String): Uploaded file name.
- url (String): Uploaded file URL.

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1pubnub.files.listFiles(  
2  String channel,  
3  {int? limit,   
4  String? next,   
5  Keyset? keyset,   
6  String? using}  
7)  
`
```

Parameters:
- channel (String, required): Channel name.
- limit (int): Max number of files returned.
- next (String): Forward pagination cursor.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.

### Sample code

```
1var result = await pubnub.files.listFiles('my_channel');  
2
  
3print('There are ${result.count} no. of files uploaded');  
```

### Response

```
`1{  
2  "data":[  
3      {  
4      "name":"cat_picture.jpg",  
5      "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
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

ListFilesResult:
- filesDetail (List<FileDetail>): Files info.
- next (String): Forward pagination cursor.
- count (int): Number of files returned.

FileDetail:
- name (String): File name.
- id (String): File ID.
- size (int): File size.
- created (String): Creation time.

## Get file URL

Generate a download URL for a file in a channel.

### Method(s)

```
`1pubnub.files.getFileUrl(  
2  String channel,   
3  String fileId,   
4  String fileName,  
5  {Keyset? keyset,   
6  String? using})  
`
```

Parameters:
- channel (String, required): Channel name.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.

### Sample code

```
`1var fileURL = pubnub.files.getFileUrl(  
2  'my_channel', 'someFileID', 'cat_picture.jpg'  
3);  
4print('URI to download file is ${fileURL}');  
`
```

### Response

```
`1https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/someFileId/cat_picture.jpg?pnsdk=PubNub-Dart%2F1.2.0  
`
```

### Returns

- Uri

## Download file

Download a file.

### Method(s)

```
`1pubnub.files.downloadFile(  
2  String channel,   
3  String fileId,   
4  String fileName,  
5  {Keyset? keyset,   
6  String? using})  
`
```

Parameters:
- channel (String, required): Channel name.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.

Deprecated parameter:
- cipherKey: Deprecated; use crypto module instead. If passed, overrides crypto module and uses legacy 128-bit encryption.

### Sample code

```
`1var result = await pubnub.files.downloadFile(  
2  'my_channel', 'someFileID', 'cat_picture.jpg');  
`
```

### Response

```
`1{  
2    "fileContent":   
3}  
`
```

### Returns

DownloadFileResult:
- fileContent (dynamic): Bytes of the downloaded file.

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pubnub.files.deleteFile(  
2  String channel,   
3  String fileId,   
4  String fileName,  
5  {Keyset? keyset,   
6  String? using})  
`
```

Parameters:
- channel (String, required): Channel name.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.

### Sample code

```
`1await pubnub.files.deleteFile(  
2  'my_channel', 'someFileID', 'cat_picture.jpg');  
`
```

### Response

```
`1{  
2  "status": 200  
3}  
`
```

### Returns

- DeleteFileResult

## Publish file message

Publishes a file message to a channel. Used internally by sendFile, or directly to retry message publish without re-uploading the file.

### Method(s)

```
`1pubnub.files.publishFileMessage(  
2  String channel,   
3  FileMessage message,  
4  {bool? storeMessage,  
5  int? ttl,  
6  dynamic? meta,  
7  Keyset? keyset,  
8  String? using,  
9  String? customMessageType})  
`
```

Parameters:
- channel (String, required): Channel name.
- message (FileMessage, required): Message to publish.
- storeMessage (bool, default: true): Store message in history. If unset, key’s history config is used.
- ttl (int): TTL hours if stored. 0 = no expiry. Ignored if storeMessage is false. If unset, uses key’s expiry unless keyset retention is Unlimited.
- meta (dynamic): Additional metadata for stream filtering.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Named keyset from keysetStore.
- customMessageType (String): 3–50 chars, alphanumeric, dashes and underscores allowed; cannot start with special chars or pn_/pn- (examples: text, action, poll).

### Sample code

```
1var fileInfo = {  
2  'id': 'someFileID',  
3  'name': 'cat_picture.jpg'  
4};  
5
  
6var message = FileMessage(fileInfo, message: 'Look at this photo!');  
7var result =  
8  await pubnub.files.publishFileMessage('my_channel', message, customMessageType: 'file-message');  
9      
10print('file message published - timetoken ${result.timetoken}');  
```

### Response

```
`1{  
2  "timetoken": 15957709330808500,  
3  "status": 200,  
4  "file": {  
5      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
6      "name": "cat_picture.jpg",  
7  }  
8}  
`
```

### Returns

PNFileUploadResult:
- timetoken (int): Publish timetoken.
- description (String): Result description (e.g., "sent").
- isError (Boolean): Error status.
- fileInfo (FileInfo): File information.

FileInfo:
- id (String): Uploaded file ID.
- name (String): Uploaded file name.
- url (String): Uploaded file URL.