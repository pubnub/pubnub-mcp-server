# PubNub Kotlin SDK – File APIs (≥ 9.0.0)

➜ v9.0.0 merges the Java/Kotlin codebases, adds a new client-builder, and changes callback/status APIs.  
See the Java/Kotlin migration guide for full details.

## Request execution  

Most SDK calls return an `Endpoint`. Invoke **either** `.sync()` or `.async()`—otherwise nothing happens.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

---

## sendFile

Uploads a ≤ 5 MB file and automatically publishes a file message.

### Method

```
`pubnub.sendFile(  
    channel: String,  
    fileName: String,  
    inputStream: InputStream,  
    message: Any? = null,  
    meta: Any? = null,  
    ttl: Int? = null,  
    shouldStore: Boolean? = null  
    customMessageType: String  
)  
`
```

Parameter | Type | Default | Description
---|---|---|---
channel* | String | — | Target channel
fileName* | String | — | File name
inputStream* | InputStream | — | File content
message | Any? | null | Optional payload published with the file message
meta | Any? | null | Filtering metadata
ttl | Int? | null | Message TTL
shouldStore | Boolean? | true | Store in history
customMessageType | String | — | 3–50 char business label

*Deprecated:* `cipherKey` – use the Crypto Module; passing this parameter re-enables legacy 128-bit encryption.

##### Sample

```
`  
`
```

##### Response

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

##### Returns (`PNFileUploadResult`)
Property | Type | Description
---|---|---
timetoken | Long | Publish timetoken
status | Int | HTTP code
file | PNBaseFile | Uploaded file info (`id`, `name`)

---

## listFiles

Lists files previously uploaded to a channel.

### Method

```
`pubnub.listFiles()  
    channel: String,  
    limit: Int,  
    next: String?  
)  
`
```

Parameter | Type | Default | Description
---|---|---|---
channel* | String | — | Channel to query
limit | Int | 100 | 1–100 results
next | String? | null | Pagination cursor

##### Sample

```
`  
`
```

##### Response

```
`{  
  "data":[  
      {  
      "name":"cat_picture.jpg",  
      "id":"fileId",  
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

##### Returns (`PNListFilesResult`)
timetoken • status • next/prev • count • data (`List<PNUploadedFile>`: `id`, `name`, `size`, `created`)

---

## getFileUrl

Generates a download URL.

### Method

```
`pubnub.getFileUrl(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

Parameter | Type | Description
---|---|---
channel* | String | Channel name
fileName* | String | Stored file name
fileId* | String | File identifier

##### Sample

```
`  
`
```

##### Response

```
`{  
    "url" : http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/fileID/cat_picture.jpg?pnsdk=PubNub-kotlin-Unified/4.32.0&timestamp=1595771548&uuid=someUuid  
}  
`
```

##### Returns (`PNFileUrlResult`)
url — downloadable link.

---

## downloadFile

Downloads a file to an `InputStream`.

### Method

```
`pubnub.downloadFile(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

Parameter | Type | Description
---|---|---
channel* | String | Channel name
fileName* | String | File name
fileId* | String | Identifier

*Deprecated:* `cipherKey` – use Crypto Module.

##### Sample

```
`  
`
```

##### Response

```
`{  
    "fileName": "cat_picture.jpg",  
    "byteStream": file data>  
}  
`
```

##### Returns (`PNDownloadFileResult`)
fileName • byteStream (`InputStream`)

---

## deleteFile

Removes a file from a channel.

### Method

```
`pubnub.deleteFile(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

Parameter | Type | Description
---|---|---
channel* | String | Channel to delete from
fileName* | String | File name
fileId* | String | Identifier

##### Sample

```
`  
`
```

##### Response

```
`{  
    "status": 200  
}  
`
```

##### Returns (`PNDeleteFileResult`)
status — HTTP code.

---

## publishFileMessage

Manually publishes a message referencing an already-uploaded file. Internally used by `sendFile`.

### Method

```
`pubnub.publishFileMessage(  
    channel: String,  
    fileName: String,  
    fileId: String,  
    message: Any?,  
    meta: Any?,  
    shouldStore: Boolean,  
    customMessageType: String  
)  
`
```

Parameter | Type | Default | Description
---|---|---|---
channel* | String | — | Target channel
fileName* | String | — | File name
fileId* | String | — | Identifier
message | Any? | null | Payload
meta | Any? | null | Metadata (filtering)
shouldStore | Boolean | true | Skip history when `false`
customMessageType | String | — | 3–50 char label

##### Sample

```
`  
`
```

##### Response

```
`[1, "Sent", "17483548017978763"]  
`
```

##### Returns (`PNFileUploadResult`)
timetoken • status • file (`id`, `name`)

_Last updated: Jul 15 2025_