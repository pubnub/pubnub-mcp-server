# File Sharing API – PHP SDK (Condensed)

Upload, list, download, delete, and publish messages for files (≤ 5 MB) on a channel. Subscribers receive events with the file ID, name, and optional description.

---

## Send file

Uploads and publishes the file (calls `publishFileMessage` internally).

### Method

```
`$pubnub->sendFile()  
    ->channel(string)  
    ->fileName(string)  
    ->message(string|array)  
    ->shouldStore(Boolean)  
    ->shouldCompress(Boolean)  
    ->ttl(Int)  
    ->fileHandle(Resource)  
    ->fileContent(bytes|File)  
    ->meta(string|array)  
    ->customMessageType(string)  
    ->sync();  
`
```

### Parameters

* **channel** *(string, required)* – Target channel.  
* **fileName** *(string, required)* – Name to store.  
* **message** *(string | array)* – Message published with the file.  
* **shouldStore** *(Boolean, default true)* – Store message in history.  
* **shouldCompress** *(Boolean, default true)* – Compress payload.  
* **ttl** *(Int)* – Message TTL (secs).  
* **fileHandle** *(Resource)* – Resource pointer to read from.  
* **fileContent** *(bytes | File)* – Raw file data.  
* **meta** *(string | array)* – Metadata for filtering.  
* **customMessageType** *(string)* – 3–50 chars, alphanum, `-` or `_` allowed.

### Returns: `PNSendFileResult`

* **name** *(string)* – File name.  
* **fileId** *(string)* – File ID.

### Sample

```
`
// Include Composer autoloader
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-file-upload-demo");
`
```

---

## List channel files

### Method

```
`$pubnub->listFiles()  
    ->channel(string)  
    ->sync();  
`
```

### Parameter

* **channel** *(string, required)* – Channel to query.

### Returns: `PNGetFilesResult`

* **next / prev** *(string)* – Pagination tokens.  
* **count** *(int)* – Number of files returned.  
* **data** *(array<PNGetFilesItem>)* – File entries.

`PNGetFilesItem`  
* **id** *(string)* – File ID.  
* **name** *(string)* – File name.  
* **size** *(string)* – File size.  
* **creationTime** *(string)* – ISO timestamp.

---

## Get file URL

### Method

```
`$pubnub.getFileDownloadUrl()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

### Parameters

* **channel** *(string, required)*  
* **fileId** *(string, required)*  
* **fileName** *(string, required)*  

### Returns: `PNGetFileDownloadURLResult`

* **fileUrl** *(string)* – Direct download URL.

---

## Download file

### Method

```
`$pubnub.downloadFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

### Parameters

* **channel**, **fileId**, **fileName** – Same as above.

### Returns: `PNDownloadFileResult`

* **fileContent** *(bytes)* – File data.

---

## Delete file

### Method

```
`$pubnub.deleteFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

### Parameters

* **channel**, **fileId**, **fileName** – Same as above.

### Returns: `PNDeleteFileResult`

* **status** *(int)* – HTTP status code.

---

## Publish file message

Publishes a message that references an already-uploaded file.

### Method

```
`$pubnub.publishFileMessage()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->message(string|array)  
    ->meta(string|array)  
    ->shouldStore(Boolean)  
    ->ttl(Int)  
    ->customMessageType(string)  
    ->sync();  
`
```

### Parameters

* **channel** *(string, required)* – Channel.  
* **fileId** *(string, required)* – File ID.  
* **fileName** *(string, required)* – File name.  
* **message** *(string | array)* – Payload.  
* **meta** *(string | array)* – Metadata.  
* **shouldStore** *(Boolean, default true)* – Store in history.  
* **ttl** *(Int, default 0)* – TTL.  
* **customMessageType** *(string)* – Business label (3–50 chars).

### Sample

```
`pubnub.publishFileMessage()  
    ->message("Hey, this is the requested file.")  
    ->channel("channel_1")  
    ->fileId("p1n4ppl3p1zz4")  
    ->fileName("pinapplePizza.jpg")  
    ->customMessageType("file-message")  
    ->sync();  
`
```

### Returns: `PNPublishFileMessageResult`

* **timestamp** *(string)* – Publish timetoken.

_Last updated: Jul 15 2025_