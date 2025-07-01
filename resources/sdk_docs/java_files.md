# PubNub Java SDK — Files

File sharing lets you upload, list, download, delete, and publish file messages (≤ 5 MB) on a channel.  
Do **not** JSON-serialize `message` or `meta`; pass objects directly.

---

## sendFile

Uploads a file and publishes its file message.

```java
pubnub.sendFile()
    .channel(String)
    .fileName(String)
    .inputStream(InputStream)
    .message(Object)
    .shouldStore(Boolean)
    .meta(Object)
    .ttl(Integer)
    .customMessageType(String)
```

Parameters  
• `channel` (String, required) – Target channel.  
• `fileName` (String, required) – File name.  
• `inputStream` (InputStream, required) – File content.  
• `message` (Object) – Payload sent with the file.  
• `shouldStore` (Boolean, default `true`) – Store message in history.  
• `meta` (Object) – Filtering metadata.  
• `ttl` (Integer) – Message Time-to-Live.  
• `customMessageType` (String) – 3-50 char business label.  

Deprecated: `cipherKey` (use Crypto Module).

Example
```java

```

Returns `PNFileUploadResult`  
• `timetoken` (Long) – Publish timetoken.  
• `status` (Integer) – HTTP status.  
• `file` (PNBaseFile) – `id`, `name`.

---

## listFiles

Lists files previously uploaded to a channel.

```java
pubnub.listFiles()
    .channel(String)
    .limit(Integer)
    .next(String)
```

Parameters  
• `channel` (String, required) – Channel name.  
• `limit` (Integer, 1–100, default 100) – Items per page.  
• `next` (String) – Pagination cursor.

Example
```java

```

Sample response
```json
{
  "data":[{"name":"cat_picture.jpg","id":"d9515cb7-48a7-41a4-9284-f4bf331bc770","size":25778,"created":"2025-05-27T13:55:35Z"}],
  "status":200,
  "count":1,
  "next":null
}
```

Returns `PNListFilesResult`  
• `timetoken` (Long)  
• `status` (Integer)  
• `next` (String)  
• `count` (Integer)  
• `data` (List<PNUploadedFile>) – each with `id`, `name`, `size`, `created`.

---

## getFileUrl

Generates a public download URL.

```java
pubnub.getFileUrl()
    .channel(String)
    .fileName(String)
    .fileId(String)
```

Parameters  
• `channel` (String, required)  
• `fileName` (String, required)  
• `fileId` (String, required)

Example
```java

```

Sample response
```json
{
  "url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=PubNub-Java-Unified/4.32.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"
}
```

Returns `PNFileUrlResult`  
• `url` (String)

---

## downloadFile

Downloads a file from a channel.

```java
pubnub.downloadFile()
    .channel(String)
    .fileName(String)
    .fileId(String)
```

Parameters identical to `getFileUrl`.

Deprecated: `cipherKey` (use Crypto Module).

Example
```java

```

Sample response
```json
{
  "fileName":"cat_picture.jpg",
  "byteStream":"<file data>"
}
```

Returns `PNDownloadFileResult`  
• `fileName` (String)  
• `byteStream` (InputStream)

---

## deleteFile

Removes a file from a channel.

```java
pubnub.deleteFile()
    .channel(String)
    .fileName(String)
    .fileId(String)
```

Parameters  
• `channel` (String, required)  
• `fileName` (String, required)  
• `fileId` (String, required)

Example
```java

```

Sample response
```json
{ "status":200 }
```

Returns `PNDeleteFileResult`  
• `status` (Integer)

---

## publishFileMessage

Manually publishes a file message (used automatically by `sendFile`).

```java
pubnub.publishFileMessage()
    .channel(String)
    .fileName(String)
    .fileId(String)
    .message(Object)
    .meta(Object)
    .shouldStore(Boolean)
    .customMessageType(String)
```

Parameters  
• `channel` (String, required)  
• `fileName` (String, required)  
• `fileId` (String, required)  
• `message` (Object) – Payload.  
• `meta` (Object)  
• `shouldStore` (Boolean, default `true`)  
• `customMessageType` (String)

Example
```java

```

Sample response
```json
[1,"Sent","17483548017978763"]
```

Returns `PNFileUploadResult` (same fields as `sendFile`).

---

_Last updated: May 28 2025_