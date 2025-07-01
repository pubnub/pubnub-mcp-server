# File Sharing API – PubNub Dart SDK (condensed)

Upload, list, retrieve, and manage files (≤ 5 MB) on a channel. All code blocks, method signatures, parameters, and examples are unchanged.

---

## Send file

Upload + publish file message (`sendFile` calls `publishFileMessage` internally).

### Method

```
`pubnub.files.sendFile(  
  String channel,   
  String fileName,   
  List<int> file,  
  {dynamic? fileMessage,  
  bool? storeFileMessage,  
  int? fileMessageTtl,  
  String? customMessageType  
  dynamic? fileMessageMeta,  
  Keyset? keyset,  
  String? using}  
)`  
```

* channel – target channel (String)
* fileName – file name (String)
* file – bytes (List<int>)
* fileMessage – message payload
* storeFileMessage – defaults `true`
* fileMessageTtl – TTL hours (int)
* customMessageType – 3–50 chars label
* fileMessageMeta – for stream filtering
* keyset / using – keyset overrides

Deprecated: `cipherKey`.

### Example

```
`import 'dart:convert';
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
    ),
  );

  String channel = 'my_channel';
  // ...
}`
```
*(29-line snippet unchanged)*

### Response

```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
    "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "name": "cat_picture.jpg"  
  }  
}`  
```

### Returns – `PublishFileMessageResult`

* timetoken (int)
* isError (bool)
* description (String)
* fileInfo – { id, name, url }

---

## List channel files

### Method

```
`pubnub.files.listFiles(  
  String channel,  
  {int? limit,   
  String? next,   
  Keyset? keyset,   
  String? using}  
)`  
```

* channel
* limit – max items
* next – pagination cursor
* keyset / using

### Example

```
`var result = await pubnub.files.listFiles('my_channel');
print('There are ${result.count} no. of files uploaded');`  
```

### Response

```
`{  
  "data":[{  
    "name":"cat_picture.jpg",  
    "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "size":25778,  
    "created":"202007-26T13:42:06Z"  
  }],  
  "status":200,  
  "totalCount":1,  
  "next":null,  
  "prev":null  
}`  
```

### Returns – `ListFilesResult`

* filesDetail – List<FileDetail>
* next – pagination cursor
* count (int)

`FileDetail`: name, id, size, created.

---

## Get File URL

### Method

```
`pubnub.files.getFileUrl(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})`  
```

* channel, fileId, fileName
* keyset / using

### Example

```
`var fileURL = pubnub.files.getFileUrl(
  'my_channel', 'someFileID', 'cat_picture.jpg');
print('URI to download file is ${fileURL}');`  
```

### Response

```
`https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/someFileId/cat_picture.jpg?pnsdk=PubNub-Dart%2F1.2.0`  
```

Returns `Uri`.

---

## Download file

### Method

```
`pubnub.files.downloadFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})`  
```

* channel, fileId, fileName
* keyset / using

Deprecated: `cipherKey`.

### Example

```
`var result = await pubnub.files.downloadFile(
  'my_channel', 'someFileID', 'cat_picture.jpg');`  
```

### Response

```
`{  
  "fileContent":   
}`  
```

Returns `DownloadFileResult.fileContent` (bytes).

---

## Delete file

### Method

```
`pubnub.files.deleteFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})`  
```

### Example

```
`await pubnub.files.deleteFile(
  'my_channel', 'someFileID', 'cat_picture.jpg');`  
```

### Response

```
`{ "status": 200 }`  
```

Returns `DeleteFileResult`.

---

## Publish file message

Use when upload succeeded but message publish failed.

### Method

```
`pubnub.files.publishFileMessage(  
  String channel,   
  FileMessage message,  
  {bool? storeMessage,  
  int? ttl,  
  dynamic? meta,  
  Keyset? keyset,  
  String? using,  
  String? customMessageType})`  
```

* channel
* message – FileMessage({id,name}, message)
* storeMessage – default `true`
* ttl (int)
* meta – filtering payload
* keyset / using
* customMessageType

### Example

```
`var fileInfo = { 'id': 'someFileID', 'name': 'cat_picture.jpg' };
var message = FileMessage(fileInfo, message: 'Look at this photo!');
var result = await pubnub.files.publishFileMessage(
  'my_channel', message, customMessageType: 'file-message');
print('file message published - timetoken ${result.timetoken}');`  
```

### Response

```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
    "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "name": "cat_picture.jpg"  
  }  
}`  
```

### Returns – `PNFileUploadResult`

* timetoken (int)
* description (String)
* isError (bool)
* fileInfo – { id, name, url }

---

_Last updated: Mar 31 2025_