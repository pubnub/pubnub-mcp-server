# File Sharing API for PHP SDK

Upload files (≤ 5 MB) to a channel; subscribers receive a file event (`id`, `filename`, optional `description`).

---

## Send file <a id="send-file"></a>

Upload a file and automatically publish its metadata.

### Method(s)

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

* required  
  * `channel` *string* — channel for the file.  
  * `fileName` *string* — name of the file to send.
* optional  
  * `message` *string | array* — message sent with the file.  
  * `shouldStore` *Boolean* (default `True`) — store published file message in history.  
  * `shouldCompress` *Boolean* (default `True`) — gzip request payload.  
  * `ttl` *Int* — message retention (seconds).  
  * `fileHandle` *Resource* — file pointer to read.  
  * `fileContent` *bytes | File* — file content stream.  
  * `meta` *string | array* — metadata for message filtering.  
  * `customMessageType` *string* — 3-50 chars, alphanumeric/`-`/`_`; cannot start with special chars, `pn_`, or `pn-`.

### Basic Usage

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-file-upload-demo");  
  
`
```

### Returns

`PNSendFileResult`

Property | Type | Description  
---------|------|------------  
`name`   | string | uploaded file name.  
`fileId` | string | uploaded file ID.

---

## List channel files <a id="list-channel-files"></a>

### Method(s)

```
`$pubnub->listFiles()  
    ->channel(string)  
    ->sync();  
`
```

* required `channel` *string* — channel to query.

### Basic Usage

```
`  
`
```

### Returns

`PNGetFilesResult`

Property | Type | Description  
---------|------|------------  
`next`  | string | forward-pagination cursor.  
`prev`  | string | backward-pagination cursor.  
`count` | Int    | number of files returned.  
`data`  | array  | array of `PNGetFilesItem`.

`PNGetFilesItem`

Property | Type | Description  
---------|------|------------  
`id`           | string | file ID.  
`name`         | string | file name.  
`size`         | string | file size.  
`creationTime` | string | creation timestamp.

---

## Get File Url <a id="get-file-url"></a>

### Method(s)

```
`$pubnub.getFileDownloadUrl()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

Parameters (all required)  
* `channel` *string* — target channel.  
* `fileName` *string* — stored filename.  
* `fileId` *string* — unique file ID.

### Basic Usage

```
`  
`
```

### Returns

`PNGetFileDownloadURLResult`

Property | Type  | Description  
---------|-------|------------  
`fileUrl` | string | download URL.

---

## Download file <a id="download-file"></a>

### Method(s)

```
`$pubnub.downloadFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

Required  
* `channel` *string*  
* `fileName` *string*  
* `fileId` *string*

### Basic Usage

```
`  
`
```

### Returns

`PNDownloadFileResult`

Property | Type | Description  
---------|------|------------  
`fileContent` | bytes | downloaded file content.

---

## Delete file <a id="delete-file"></a>

### Method(s)

```
`$pubnub.deleteFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

Required  
* `channel` *string* — channel to delete from.  
* `fileId`  *string* — file ID.  
* `fileName` *string* — file name.

### Basic Usage

```
`  
`
```

### Returns

`PNDeleteFileResult`

Property | Type | Description  
---------|------|------------  
`status` | Int  | HTTP status code.

---

## Publish file message <a id="publish-file-message"></a>

Publish metadata for an already-uploaded file.  
Use when `sendFile` upload succeeded but message publish must be retried.

### Method(s)

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

Required  
* `channel` *string* — target channel.  
* `file_id` *string* — file ID.  
* `file_name` *string* — file name.

Optional  
* `message` *dict* — payload.  
* `meta` *dict* — metadata.  
* `should_store` *Boolean* (default `True`).  
* `ttl` *Int* (default `0`).  
* `customMessageType` *string* — see rules above.

### Basic Usage

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

### Returns

`PNPublishFileMessageResult`

Property | Type | Description  
---------|------|------------  
`timestamp` | string | publish timetoken.

_Last updated Apr 2 2025_