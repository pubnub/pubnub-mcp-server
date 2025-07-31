# PubNub Dart SDK – Files

Maximum file size: **5 MB**. All code blocks below are unchanged from the original docs.

---

## Send file

Uploads a file and automatically publishes a file message on the channel (internally uses `publishFileMessage`).

### Method
```
`pubnub.files.sendFile(  
  String channel,   
  String fileName,   
  Listint> file,  
  {dynamic? fileMessage,  
  bool? storeFileMessage,  
  int? fileMessageTtl,  
  String? customMessageType  
  dynamic? fileMessageMeta,  
  Keyset? keyset,  
  String? using}  
)  
`
```

Parameters  
• `channel` (String) – target channel  
• `fileName` (String) – file name  
• `file` (List<int>) – file bytes  
• `fileMessage` (dynamic) – payload that accompanies the file  
• `storeFileMessage` (bool, default `true`) – store in history  
• `fileMessageTtl` (int) – TTL in hours (ignored if `storeFileMessage` is false)  
• `customMessageType` (String) – 3–50 char label, no `pn_`/`pn-` prefix  
• `fileMessageMeta` (dynamic) – stream-filtering metadata  
• `keyset` (Keyset) – override default keyset  
• `using` (String) – keyset name from `keysetStore`

Deprecated: `cipherKey` (use crypto module instead).

#### Sample
```
`import 'dart:convert';  
import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // File details  
  String channel = 'my_channel';  
`
```

#### Response
```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "name": "cat_picture.jpg"  
  }  
}  
`
```

Returns: `PublishFileMessageResult`  
• `timetoken` (int) – publish time  
• `isError` (bool) – upload status  
• `description` (String) – status text  
• `fileInfo` (`FileInfo`) – `id`, `name`, `url`

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
)  
`
```

Parameters  
• `channel` (String) – channel name  
• `limit` (int) – max items  
• `next` (String) – pagination token  
• `keyset`, `using` – same as above

#### Sample
```
`var result = await pubnub.files.listFiles('my_channel');  
  
print('There are ${result.count} no. of files uploaded');  
`
```

#### Response
```
`{  
  "data":[{  
      "name":"cat_picture.jpg",  
      "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "size":25778,  
      "created":"202007 - 26T13:42:06Z"  
  }],  
  "status": 200,  
  "totalCount": 1,  
  "next": null,  
  "prev": null  
}  
`
```

Returns: `ListFilesResult` (`filesDetail`, `next`, `count`).  
`FileDetail` ⇒ `name`, `id`, `size`, `created`.

---

## Get file URL

### Method
```
`pubnub.files.getFileUrl(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

Parameters: `channel`, `fileId`, `fileName`, `keyset`, `using`.

#### Sample
```
`var fileURL = pubnub.files.getFileUrl(  
  'my_channel', 'someFileID', 'cat_picture.jpg'  
);  
print('URI to download file is ${fileURL}');  
`
```

#### Response
```
`https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/someFileId/cat_picture.jpg?pnsdk=PubNub-Dart%2F1.2.0  
`
```

Returns: `Uri`

---

## Download file

### Method
```
`pubnub.files.downloadFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

Parameters identical to Get file URL.  
Deprecated: `cipherKey`.

#### Sample
```
`var result = await pubnub.files.downloadFile(  
  'my_channel', 'someFileID', 'cat_picture.jpg');  
`
```

#### Response
```
`{  
    "fileContent":   
}  
`
```

Returns: `DownloadFileResult` → `fileContent` (bytes).

---

## Delete file

### Method
```
`pubnub.files.deleteFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

#### Sample
```
`await pubnub.files.deleteFile(  
  'my_channel', 'someFileID', 'cat_picture.jpg');  
`
```

#### Response
```
`{  
  "status": 200  
}  
`
```

Returns: `DeleteFileResult`

---

## Publish file message

Used when the upload succeeds but the automatic publish fails (or for manual publishing).

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
  String? customMessageType})  
`
```

Parameters  
• `channel` (String) – target channel  
• `message` (FileMessage) – contains `fileInfo` and optional `message`  
• `storeMessage` (bool, default `true`) – store in history  
• `ttl` (int) – message TTL (hours)  
• `meta` (dynamic) – stream-filter metadata  
• `keyset`, `using`, `customMessageType` – same rules as above

#### Sample
```
`var fileInfo = {  
  'id': 'someFileID',  
  'name': 'cat_picture.jpg'  
};  
  
var message = FileMessage(fileInfo, message: 'Look at this photo!');  
var result =  
  await pubnub.files.publishFileMessage('my_channel', message, customMessageType: 'file-message');  
      
print('file message published - timetoken ${result.timetoken}');  
`
```

#### Response
```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "name": "cat_picture.jpg",  
  }  
}  
`
```

Returns: `PNFileUploadResult` (`timetoken`, `description`, `isError`, `fileInfo`).

---

_Last updated Jul 15 2025_