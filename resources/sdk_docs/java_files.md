# File Sharing API – PubNub Java SDK ≥ 9.0.0

PubNub Java 9 unifies Java/Kotlin codebases, introduces a new client instantiation model, and changes async callbacks & status events. See the Java/Kotlin migration guide for full details.

Max file size: 5 MB. When a file is uploaded to a `channel`, subscribers receive a file event containing `id`, `filename`, and optional `description`.

---
## Do NOT JSON-serialize `message` or `meta`
Pass plain objects; the SDK handles serialization.

---
## sendFile

Uploads a file and publishes its metadata message on the channel (internally uses `publishFileMessage`).

### Method
```
`pubnub.sendFile()  
    .channel(String)  
    .fileName(String)  
    .inputStream(InputStream)  
    .message(Object)  
    .shouldStore(Boolean)  
    .meta(Object)  
    .ttl(Integer)  
    .customMessageType(String)  
`
```

### Parameters
* channel (String, required) – Target channel.  
* fileName (String, required) – File name.  
* inputStream (InputStream, required) – File data.  
* message (Object) – Message payload sent with the file.  
* shouldStore (Boolean, default `true`) – Store file message in history.  
* meta (Object) – Metadata for message filtering.  
* ttl (Integer) – Message TTL.  
* customMessageType (String) – 3–50 char label (alphanumeric, `-`, `_`; cannot start with special chars or `pn_` / `pn-`).  
* cipherKey (String, deprecated) – Use the Crypto Module instead; supplying this overrides the module.

### Sample code
```
`  
`
```

### Returns (`PNFileUploadResult`)
* timetoken (Long) – Publish timetoken.  
* status (Integer) – HTTP status code.  
* file (PNBaseFile) –  
  • id (Long) – File ID.  
  • name (String) – File name.

---
## listFiles

Lists files uploaded to a channel.

### Method
```
`pubnub.listFiles()  
    .channel(String)  
    .limit(Integer)  
    .next(String)  
`
```

### Parameters
* channel (String, required) – Channel name.  
* limit (Integer, default 100, 1-100) – Page size.  
* next (String) – Pagination token.

### Sample code
```
`  
`
```

### Response
```
`{  
  "data":[{  
    "name":"cat_picture.jpg",  
    "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "size":25778,  
    "created":"2025-05-27T13:55:35Z"  
  }],  
  "status":200,  
  "count":1,  
  "next":null  
}  
`
```

### Returns (`PNListFilesResult`)
* timetoken (Long)  
* status (Integer)  
* next (String) – Pagination token.  
* count (Integer) – Items returned.  
* data (List<PNUploadedFile>) where each item includes:  
  • id (Long)  
  • name (String)  
  • size (Integer)  
  • created (String)

---
## getFileUrl

Generates a download URL.

### Method
```
`pubnub.getFileUrl()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

### Parameters
* channel (String, required)  
* fileName (String, required)  
* fileId (String, required)

### Sample code
```
`  
`
```

### Response
```
`{  
  "url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=PubNub-Java-Unified/4.32.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
}  
`
```

### Returns (`PNFileUrlResult`)
* url (String)

---
## downloadFile

Downloads a file from a channel.

### Method
```
`pubnub.downloadFile()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

### Parameters
* channel (String, required)  
* fileName (String, required)  
* fileId (String, required)  
* cipherKey (String, deprecated) – Prefer Crypto Module.

### Sample code
```
`  
`
```

### Response
```
`{  
  "fileName":"cat_picture.jpg",  
  "byteStream": file data>  
}  
`
```

### Returns (`PNDownloadFileResult`)
* fileName (String)  
* byteStream (InputStream)

---
## deleteFile

Removes a file from a channel.

### Method
```
`pubnub.deleteFile()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

### Parameters
* channel (String, required)  
* fileName (String, required)  
* fileId (String, required)

### Sample code
```
`  
`
```

### Response
```
`{ "status":200 }  
`
```

### Returns (`PNDeleteFileResult`)
* status (Integer)

---
## publishFileMessage

Publishes a message referencing an already-uploaded file. Used internally by `sendFile`; call directly if upload succeeded but publish failed.

### Method
```
`pubnub.publishFileMessage()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
    .message(Object)  
    .meta(Object)  
    .shouldStore(Boolean)  
    .customMessageType(String)  
`
```

### Parameters
* channel (String, required) – Destination channel.  
* fileName (String, required)  
* fileId (String, required)  
* message (Object) – Payload.  
* meta (Object) – Metadata.  
* shouldStore (Boolean, default `true`) – Store in history.  
* customMessageType (String) – 3–50 char label (rules as above).

### Sample code
```
`  
`
```

### Response
```
`[1,"Sent","17483548017978763"]  
`
```

### Returns (`PNFileUploadResult`)
* timetoken (Long)  
* status (Integer)  
* file (PNBaseFile)  
  • id (Long)  
  • name (String)

_Last updated: Jul 15 2025_