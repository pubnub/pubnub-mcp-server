# File Sharing API for JavaScript SDK

Upload and share files up to 5 MB. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

Supported async patterns: Callbacks, Promises, Async/Await. Recommended: Async/Await with try...catch for error handling.

## Send file

Uploads a file to a channel and publishes a file message. Internally calls publishFile.

### Method(s)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

Parameters (SendFileParameters):
- channel (string, required): Channel to send the file to.
- file (FileInput, required): File to send.
- message (any, optional): Message to attach to the file.
- storeInHistory (boolean, default: true): Store published file messages in history. If omitted, key configuration is used.
- ttl (number, default: 0): Message retention in history. Defaults to key set retention.
- meta (any, optional): Message metadata.
- customMessageType (string, optional): 3–50 char case-sensitive alphanumeric label; dashes and underscores allowed. Must not start with special characters or pn_/pn-. Examples: text, action, poll.

Deprecated:
- cipherKey: Configure the crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

### Sample code

##### Reference code

```
1
  
```

```
1
  
```

### Returns

```
`1{  
2  id: string,  
3  name: string,  
4  timetoken: string  
5}  
`
```

### Other examples

#### Usage with a message and custom cipher key

```
1
  
```

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```
`1pubnub.listFiles(  
2  params: ListFilesParameters  
3): PromiseListFilesResult>;  
`
```

Parameters (ListFilesParameters):
- channel (string, required): Channel to list files for.
- limit (number, default: 100): Number of files to return.
- next (string, optional): Token for the next page.

### Sample code

```
1
  
```

### Returns

```
`1{  
2  status: number,  
3  data: Array{  
4    name: string,  
5    id: string,  
6    size: number,  
7    created: string  
8  }>,  
9  next: string,  
10  count: number,  
11}  
`
```

## Get file URL

Constructs a direct download URL. No API calls. Does not decrypt encrypted files.

### Method(s)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

Parameters (GetFileUrlParams):
- channel (string): Channel the file was sent to.
- id (string): File ID.
- name (string): File name.

### Sample code

```
1
  
```

### Returns

```
`1'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'  
`
```

## Download file

Download a file from a channel.

### Method(s)

```
`1pubnub.downloadFile(  
2  params: DownloadFileParams  
3): PromiseDownloadFileResult>;  
`
```

Parameters (DownloadFileParams):
- channel (string, required): Channel the file was sent to.
- id (string, required): File ID.
- name (string, required): File name.

Deprecated:
- cipherKey: Configure the crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

### Sample code

```
1
  
```

```
1
  
```

```
1
  
```

### Returns

Returns instance of PubNubFile.

### Other examples

#### Usage with custom cipher key

```
1
  
```

## Delete file

Delete a file from a channel.

### Method(s)

```
`1pubnub.deleteFile(  
2  params: DeleteFileParams  
3): PromiseDeleteFileResult>;  
`
```

Parameters (DeleteFileParams):
- channel (string): Channel the file was sent to.
- id (string): File ID.
- name (string): File name.

### Sample code

```
1
  
```

### Returns

Example:

```
`1{  
2  status: 200  
3}  
`
```

## Publish file message

Publish the uploaded file message to a channel. Called by sendFile. Use directly to republish when sendFile fails with status.operation === PNPublishFileMessageOperation (reuse data from status to avoid re-uploading).

### Method(s)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

Parameters (PublishFileParams):
- channel (string, required): Channel the file was sent to.
- message (any, optional): Message to attach.
- fileId (string, required): File ID.
- fileName (string, required): File name.
- storeInHistory (boolean, default: true): Store in history. If omitted, key configuration is used.
- ttl (number, default: 0): Retention in history. Defaults to key set retention.
- meta (any, optional): Message metadata.
- customMessageType (string, optional): 3–50 char case-sensitive alphanumeric label; dashes and underscores allowed. Must not start with special characters or pn_/pn-. Examples: text, action, poll.

### Sample code

```
1
  
```

### Returns

```
`1{  
2  timetoken: number  
3}  
`
```

## FileInput

Represents possible inputs across environments.

### Node.js

##### Using streams

```
`1{  
2    stream: Readable,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

##### Using buffers

```
`1{  
2    data: Buffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

### Browsers

##### Using File API

```
`1File  
`
```

##### Using strings

```
`1{  
2    data: string,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

##### Using ArrayBuffer

```
`1{  
2    data: ArrayBuffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

### React and React Native

##### Using URI

```
`1{  
2    uri: string,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

## PubNub file

Internal representation of the file used by the SDK.

##### Methods supported in Node.js
- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### Methods supported in a browser
- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### React and React Native
- file.toBlob() returns Promise<Blob>

Last updated on Sep 3, 2025