# File Sharing API for Dart SDK

Use the Files API to upload and share files up to 5 MB on PubNub. When a file is uploaded to a channel, it’s stored with your key and a file event is delivered to subscribers with file ID, filename, and optional description.

## Send file

Upload the file to a specified channel. This handles preparation, upload to storage, and publishes a file message on the channel. Internally calls publishFileMessage.

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
- storeFileMessage (bool, default: true): Store message in history; falls back to key configuration if not specified.
- fileMessageTtl (int): Per-message TTL (hours). If storeFileMessage is true and ttl is 0, store indefinitely; if true and ttl is x, store for x hours unless keyset retention is Unlimited. Ignored if storeFileMessage is false. If not specified, uses key’s expiry.
- customMessageType (String): 3–50 char case-sensitive alphanumeric label; dashes and underscores allowed; cannot start with special chars or with pn_ / pn-. Examples: text, action, poll.
- fileMessageMeta (dynamic): Additional info for stream filtering.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore for this call.

Deprecated:
- cipherKey: Use the crypto module instead (/docs/sdks/dart/api-reference/configuration#cryptomodule). Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

sendFile() returns PublishFileMessageResult with:
- timetoken (int): Publish timetoken.
- isError (Boolean): Upload error flag.
- description (String): Status description.
- fileInfo (FileInfo): Uploaded file information.

FileInfo:
- id (String): File ID.
- name (String): File name.
- url (String): File URL.

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
- channel (String, required): Channel.
- limit (int): Max number of files to return.
- next (String): Forward pagination token from server to fetch next page.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore.

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

listFiles() returns ListFilesResult with:
- filesDetail (List<FileDetail>): Files info.
- next (String): Forward pagination token.
- count (int): Number of files returned.

FileDetail:
- name (String): File name.
- id (String): File ID.
- size (int): File size.
- created (String): Creation time.

## Get file URL

Generate a URL to download a file from a channel.

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
- channel (String, required): Channel.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore.

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

getFileUrl() returns a Uri.

## Download file

Download the specified file.

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
- channel (String, required): Channel.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore.

Deprecated:
- cipherKey: Use the crypto module instead (/docs/sdks/dart/api-reference/configuration#cryptomodule). Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

downloadFile() returns DownloadFileResult with:
- fileContent (dynamic): Bytes of the downloaded file.

## Delete file

Delete a file from the specified channel.

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
- channel (String, required): Channel.
- fileId (String, required): File ID.
- fileName (String, required): File name.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore.

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

deleteFile() returns a DeleteFileResult.

## Publish file message

Publish the uploaded file message to a specified channel. Called internally by sendFile. Use directly to resend the file message (without re-upload) if sendFile fails after upload.

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
- channel (String, required): Channel.
- message (FileMessage, required): Message to publish.
- storeMessage (bool, default: true): Store message in history; falls back to key configuration if not specified.
- ttl (int): Per-message TTL (hours). If storeMessage is true and ttl is 0, store indefinitely; if true and ttl is x, store for x hours unless keyset retention is Unlimited. Ignored if storeMessage is false. If not specified, uses key’s expiry.
- meta (dynamic): Additional info for stream filtering.
- keyset (Keyset, default: default keyset): Override default keyset.
- using (String): Keyset name from keysetStore.
- customMessageType (String): 3–50 char case-sensitive alphanumeric label; dashes and underscores allowed; cannot start with special chars or with pn_ / pn-. Examples: text, action, poll.

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

publishFileMessage() returns PNFileUploadResult with:
- timetoken (int): Publish timetoken.
- description (String): Result description (e.g., sent).
- isError (Boolean): Error status.
- fileInfo (FileInfo): File information.

FileInfo:
- id (String): File ID.
- name (String): File name.
- url (String): File URL.