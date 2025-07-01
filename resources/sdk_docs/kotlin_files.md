# File Sharing API for Kotlin SDK (v9+)

⚠️ v9 merges Kotlin & Java codebases and changes client instantiation, async callbacks, and status events. See the Java/Kotlin migration guide for full details.

## Request execution

All SDK methods return an `Endpoint` that **must** be executed.

```kotlin
val channel = pubnub.channel("channelName")

channel.publish("This SDK rules!").async { result ->
    result.onFailure { exception ->
        // Handle error
    }.onSuccess { value ->
        // Handle successful method result
    }
}
```

---

## Send file

Uploads a file (≤ 5 MB) and publishes a file-message to the channel.

### Method

```kotlin
pubnub.sendFile(
    channel: String,
    fileName: String,
    inputStream: InputStream,
    message: Any? = null,
    meta: Any? = null,
    ttl: Int? = null,
    shouldStore: Boolean? = null,
    customMessageType: String
)
```

Parameter | Type | Default | Description
----------|------|---------|------------
channel* | String | — | Target channel
fileName* | String | — | File name
inputStream* | InputStream | — | File content
message | Any? | null | Payload published with the file
meta | Any? | null | Metadata for filtering
ttl | Int? | null | Message TTL (history)
shouldStore | Boolean? | true | Store in history
customMessageType | String | — | 3-50 chars label (e.g., `text`, `action`, `poll`)

`cipherKey` parameter is **deprecated**—use the Crypto module instead.

#### Example

```
  
```

#### Response

```json
{
  "timetoken": 15957709330808500,
  "status": 200,
  "file": {
    "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",
    "name": "cat_picture.jpg"
  }
}
```

#### Returns

`PNFileUploadResult`

Property | Type | Description
---------|------|------------
timetoken | Long | Publish timetoken
status | Int | HTTP status
file | PNBaseFile | Uploaded file info (`id`, `name`)

---

## List channel files

### Method

```kotlin
pubnub.listFiles(
    channel: String,
    limit: Int = 100,
    next: String? = null
)
```

Parameter | Type | Default | Description
----------|------|---------|------------
channel* | String | — | Channel name
limit | Int | 100 (1-100) | Page size
next | String? | null | Forward-pagination cursor

#### Example

```
  
```

#### Response

```json
{
  "data": [
    {
      "name": "cat_picture.jpg",
      "id": "fileId",
      "size": 25778,
      "created": "2020-07-26T13:42:06Z"
    }
  ],
  "status": 200,
  "totalCount": 1,
  "next": null,
  "prev": null
}
```

#### Returns

`PNListFilesResult` (`status`, `next`, `count`, `data`)

`PNUploadedFile` fields: `id`, `name`, `size`, `created`.

---

## Get file URL

### Method

```kotlin
pubnub.getFileUrl(
    channel: String,
    fileName: String,
    fileId: String
)
```

Parameter | Type | Description
----------|------|------------
channel* | String | Channel name
fileName* | String | Stored file name
fileId* | String | File UUID

#### Example

```
  
```

#### Response

```json
{
  "url": "http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/fileID/cat_picture.jpg?pnsdk=PubNub-kotlin-Unified/4.32.0&timestamp=1595771548&uuid=someUuid"
}
```

#### Returns

`PNFileUrlResult` (`url`)

---

## Download file

### Method

```kotlin
pubnub.downloadFile(
    channel: String,
    fileName: String,
    fileId: String
)
```

Parameter | Type | Description
----------|------|------------
channel* | String | Channel name
fileName* | String | Stored file name
fileId* | String | File UUID

`cipherKey` parameter is **deprecated**—use the Crypto module instead.

#### Example

```
  
```

#### Response

```json
{
  "fileName": "cat_picture.jpg",
  "byteStream": "file data"
}
```

#### Returns

`PNDownloadFileResult` (`fileName`, `byteStream`)

---

## Delete file

### Method

```kotlin
pubnub.deleteFile(
    channel: String,
    fileName: String,
    fileId: String
)
```

Parameter | Type | Description
----------|------|------------
channel* | String | Channel name
fileName* | String | File to delete
fileId* | String | File UUID

#### Example

```
  
```

#### Response

```json
{
  "status": 200
}
```

#### Returns

`PNDeleteFileResult` (`status`)

---

## Publish file message

Re-publishes the file message if the original `sendFile` publish step fails.

### Method

```kotlin
pubnub.publishFileMessage(
    channel: String,
    fileName: String,
    fileId: String,
    message: Any?,
    meta: Any?,
    shouldStore: Boolean,
    customMessageType: String
)
```

Parameter | Type | Default | Description
----------|------|---------|------------
channel* | String | — | Channel
fileName* | String | — | File name
fileId* | String | — | File UUID
message | Any? | null | Payload
meta | Any? | null | Metadata
shouldStore | Boolean | true | Store in history
customMessageType | String | — | Business label

#### Example

```
  
```

#### Response

```json
[1, "Sent", "17483548017978763"]
```

#### Returns

`PNFileUploadResult` (`timetoken`, `status`, `file`)

---

_Last updated: Jun 2 2025_