# File Sharing API for Dart SDK

Upload and share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file and publishes its file message on the channel. Internally calls Publish file message.

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
- file (List<int>, required): File content (bytes).
- fileMessage (dynamic, default null): File message published with the file.
- storeFileMessage (bool, default true): Store message in history. If not set, keyset history config applies.
- fileMessageTtl (int): If storeFileMessage is true and fileMessageTtl is 0, store with no expiry. If true and set to x, expire in x hours unless keyset retention is Unlimited. Ignored if storeFileMessage is false. If not set, defaults to key expiry value.
- customMessageType (String): 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.
- fileMessageMeta (dynamic): Additional info for stream filtering.
- keyset (Keyset, default: PubNub default keyset): Override keyset.
- using (String): Keyset name from keysetStore for this call.

Deprecated parameter:
- cipherKey: Deprecated. Use crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

### Sample code

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
- timetoken (int)
- isError (bool)
- description (String)
- fileInfo (FileInfo)

FileInfo:
- id (String)
- name (String)
- url (String)

## List channel files

Retrieves files uploaded to a channel.

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
- channel (String, required): Channel to list files from.
- limit (int): Max number of files returned.
- next (String): Forward pagination cursor to fetch next page.
- keyset (Keyset, default: PubNub default keyset): Override keyset.
- using (String): Keyset name from keysetStore for this call.

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
- filesDetail (List<FileDetail>)
- next (String): Forward pagination cursor.
- count (int)

FileDetail:
- name (String)
- id (String)
- size (int)
- created (String)

## Get file URL

Generates a URL to download a file from a channel.

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
- channel (String, required)
- fileId (String, required)
- fileName (String, required)
- keyset (Keyset, default: PubNub default keyset)
- using (String): Keyset name from keysetStore for this call.

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

Uri

## Download file

Downloads a file.

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
- channel (String, required)
- fileId (String, required)
- fileName (String, required)
- keyset (Keyset, default: PubNub default keyset)
- using (String): Keyset name from keysetStore for this call.

Deprecated parameter:
- cipherKey: Deprecated. Use crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

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

Deletes a file from a channel.

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
- channel (String, required)
- fileId (String, required)
- fileName (String, required)
- keyset (Keyset, default: PubNub default keyset)
- using (String): Keyset name from keysetStore for this call.

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

DeleteFileResult

## Publish file message

Publishes a file message to a channel. Used by Send file after upload. Can be called manually if Send file upload succeeded but message publish failed.

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
- channel (String, required)
- message (FileMessage, required)
- storeMessage (bool, default true): Store in history; falls back to keyset config if not set.
- ttl (int): If storeMessage is true and ttl is 0, store with no expiry. If true and set to x, expire in x hours unless retention is Unlimited. Ignored if storeMessage is false. If not set, defaults to key expiry value.
- meta (dynamic): Additional info for stream filtering.
- keyset (Keyset, default: PubNub default keyset)
- using (String): Keyset name from keysetStore for this call.
- customMessageType (String): 3–50 chars, case-sensitive alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

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
- timetoken (int)
- description (String): e.g., "sent" on success
- isError (bool)
- fileInfo (FileInfo)

FileInfo:
- id (String)
- name (String)
- url (String)