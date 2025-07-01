# File Sharing API – JavaScript SDK (≤ 5 MB per file)

Subscribers receive a `file` event with `id`, `filename`, and optional `description`.

**Async patterns:** callbacks, promises, Async/Await (recommended; wrap in `try…catch`).

---

## Send file
Upload a file and automatically publish the related file message.

### Method
```
pubnub.sendFile(
  params: SendFileParameters
): Promise<SendFileResult>;
```

### SendFileParameters
* `channel` **string** – target channel  
* `file` **FileInput** – file to send  
* `message` any – optional message  
* `storeInHistory` boolean (default `true`)  
* `ttl` number – message TTL (0 = key-set default)  
* `meta` any  
* `customMessageType` string – 3-50 chars, case-sensitive  
* **Deprecated:** `cipherKey` (overrides crypto module; 128-bit legacy)

### Returns
```
{
  id: string,
  name: string,
  timetoken: string
}
```

### Examples
```
  
```
Usage with message and custom cipher key:
```
  
```

---

## List channel files
```
pubnub.listFiles(
  params: ListFilesParameters
): Promise<ListFilesResult>;
```

### ListFilesParameters
* `channel` **string** – target channel  
* `limit` number (default 100)  
* `next` string – pagination token

### Returns
```
{
  status: number,
  data: Array<{
    name: string,
    id: string,
    size: number,
    created: string
  }>,
  next: string,
  count: number
}
```

Example:
```
  
```

---

## Get file URL
No network call; does not decrypt.

```
pubnub.getFileUrl(
  params: GetFileUrlParams
): string;
```

### GetFileUrlParams
* `channel` string  
* `id` string  
* `name` string  

Example:
```
  
```

Returns:
```
'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'
```

---

## Download file
```
pubnub.downloadFile(
  params: DownloadFileParams
): Promise<DownloadFileResult>;
```

### DownloadFileParams
* `channel` string  
* `id` string  
* `name` string  
* **Deprecated:** `cipherKey`

Returns: `PubNubFile`

Examples:
```
  
```
Custom cipher key:
```
  
```

---

## Delete file
```
pubnub.deleteFile(
  params: DeleteFileParams
): Promise<DeleteFileResult>;
```

### DeleteFileParams
* `channel` string  
* `id` string  
* `name` string  

Returns:
```
{ status: 200 }
```
Example:
```
  
```

---

## Publish file message
(Re-send the file message if `sendFile` upload succeeded but publish failed.)

```
pubnub.publishFile(
  params: PublishFileParams
): Promise<PublishFileResult>;
```

### PublishFileParams
* `channel` string  
* `message` any  
* `fileId` string  
* `fileName` string  
* `storeInHistory` boolean (default `true`)  
* `ttl` number  
* `meta` any  
* `customMessageType` string  

Returns
```
{ timetoken: number }
```

Example:
```
  
```

---

## FileInput
Representations accepted by `sendFile`.

### Node.js
Streams
```
{
  stream: Readable,
  name: string,
  mimeType?: string
}
```
Buffers
```
{
  data: Buffer,
  name: string,
  mimeType?: string
}
```

### Browsers
File API
```
File
```
Strings
```
{
  data: string,
  name: string,
  mimeType?: string
}
```
ArrayBuffer
```
{
  data: ArrayBuffer,
  name: string,
  mimeType?: string
}
```

### React / React Native
```
{
  uri: string,
  name: string,
  mimeType?: string
}
```

---

## PubNubFile
Returned by `downloadFile`.

### Node.js
* `toBuffer(): Promise<Buffer>`
* `toStream(): Promise<Readable>`
* `toString(encoding: string)`

### Browsers
* `toFile(): Promise<File>`
* `toBlob(): Promise<Blob>`
* `toArrayBuffer(): Promise<ArrayBuffer>`
* `toString(encoding: string)`

### React / React Native
* `toBlob(): Promise<Blob>`

_Last updated Jun 30 2025_