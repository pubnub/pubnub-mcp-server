# PubNub JavaScript SDK – Files API (Concise Reference)

PubNub files API enables upload, listing, download, deletion, and publication of files (≤ 5 MB) on a channel. All asynchronous examples use the recommended `async/await` pattern; add `try…catch` to handle errors.

---

## sendFile

Uploads a file and publishes a file-message on the target channel.

```js
pubnub.sendFile(
  params: SendFileParameters
): Promise<SendFileResult>;
```

SendFileParameters  
• `channel` (string) – target channel  
• `file` (FileInput) – file to upload  
• `message` (any) – optional message payload  
• `storeInHistory` (boolean, default `true`) – store file-message in history  
• `ttl` (number, default `0`) – message TTL in minutes  
• `meta` (any) – message metadata  
• `customMessageType` (string) – 3–50 chars, alphanumeric, `-` or `_`; cannot start with `pn_`/`pn-`  

*Deprecated:* `cipherKey` (use the Crypto Module instead).

Returns

```js
{
  id: string,
  name: string,
  timetoken: string
}
```

---

## listFiles

Lists files previously uploaded to a channel.

```js
pubnub.listFiles(
  params: ListFilesParameters
): Promise<ListFilesResult>;
```

ListFilesParameters  
• `channel` (string) – channel to query  
• `limit` (number, default `100`) – max results  
• `next` (string) – pagination cursor  

Returns

```js
{
  status: number,
  data: [{
    name: string,
    id: string,
    size: number,
    created: string
  }],
  next: string,
  count: number
}
```

---

## getFileUrl

Creates a direct download URL (no network request, no decryption).

```js
pubnub.getFileUrl(
  params: GetFileUrlParams
): string;
```

GetFileUrlParams  
• `channel` (string)  
• `id` (string) – file ID  
• `name` (string) – file name  

Example

```text
https://ps.pndsn.com/v1/files/{subKey}/channels/my_channel/files/{id}/cat_picture.jpg
```

---

## downloadFile

Downloads a file from a channel.

```js
pubnub.downloadFile(
  params: DownloadFileParams
): Promise<PubNubFile>;
```

DownloadFileParams  
• `channel` (string)  
• `id` (string) – file ID  
• `name` (string) – file name  

*Deprecated:* `cipherKey` (use the Crypto Module instead).

Returns a `PubNubFile` instance (see “PubNub file” below).

---

## deleteFile

Deletes a file from a channel.

```js
pubnub.deleteFile(
  params: DeleteFileParams
): Promise<DeleteFileResult>;
```

DeleteFileParams  
• `channel` (string)  
• `id` (string) – file ID  
• `name` (string) – file name  

Success response

```js
{ status: 200 }
```

---

## publishFile

Publishes a file-message (without uploading).  
Useful when `sendFile` upload succeeded but message publish failed.

```js
pubnub.publishFile(
  params: PublishFileParams
): Promise<PublishFileResult>;
```

PublishFileParams  
• `channel` (string)  
• `message` (any) – optional payload  
• `fileId` (string) – file ID  
• `fileName` (string) – file name  
• `storeInHistory` (boolean, default `true`)  
• `ttl` (number, default `0`)  
• `meta` (any)  
• `customMessageType` (string) – same rules as above  

Returns

```js
{ timetoken: number }
```

---

## FileInput

Accepted file representations.

Node.js  
```ts
// Streams
{ stream: Readable, name: string, mimeType?: string }

// Buffers
{ data: Buffer,   name: string, mimeType?: string }
```

Browser  
```ts
File                                  // native File
{ data: string,      name: string, mimeType?: string }  // string
{ data: ArrayBuffer, name: string, mimeType?: string }  // ArrayBuffer
```

React / React Native  
```ts
{ uri: string, name: string, mimeType?: string }
```

---

## PubNub file

Unified file abstraction.

Node.js  
• `file.toBuffer(): Promise<Buffer>`  
• `file.toStream(): Promise<Readable>`  
• `file.toString(encoding?): string`  

Browser  
• `file.toFile(): Promise<File>`  
• `file.toBlob(): Promise<Blob>`  
• `file.toArrayBuffer(): Promise<ArrayBuffer>`  
• `file.toString(encoding?): string`  

React / React Native  
• `file.toBlob(): Promise<Blob>`

---

Last updated · Jul 15 2025