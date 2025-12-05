# File Sharing API for JavaScript SDK

Upload and share files up to 5 MB. Files uploaded to a channel are stored using a storage service and associated with your key. Subscribers to that channel receive a file event containing file ID, filename, and optional description.

##### Supported and recommended asynchronous patterns
- Supports Callbacks, Promises, and Async/Await (recommended).
- Async/Await returns status only on error; use try...catch to handle errors.

## Send file

Uploads a file to a channel and publishes a file message. Internally calls publishFile to announce the uploaded file to subscribers.

### Method(s)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

- params: SendFileParameters (required)

#### SendFileParameters

- channel (string, required): Channel to send the file to.
- file (FileInput, required): File to send.
- message (any, optional): Optional message to attach.
- storeInHistory (boolean, default: true): Store published file messages in history; if omitted, key’s history config applies.
- ttl (number, default: 0): Message history TTL; defaults to key set’s retention.
- meta (any, optional): Metadata for the message.
- customMessageType (string, optional): Case-sensitive, 3–50 chars, alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- cipherKey: Deprecated. Configure the crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

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

Retrieve a list of files uploaded to a channel.

### Method(s)

```
`1pubnub.listFiles(  
2  params: ListFilesParameters  
3): PromiseListFilesResult>;  
`
```

- params: ListFilesParameters (required)

#### ListFilesParameters

- channel (string, required): Channel to list files from.
- limit (number, default: 100): Number of files to return.
- next (string, optional): Token for next page.

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

Construct a file’s direct download URL. No API calls; does not decrypt encrypted files.

### Method(s)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

- params: GetFileUrlParams (required)

#### GetFileUrlParams

- channel (string, required): Channel the file was sent to.
- id (string, required): File identifier.
- name (string, required): File name.

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

- params: DownloadFileParams (required)

#### DownloadFileParams

- channel (string, required): Channel the file was sent to.
- id (string, required): File identifier.
- name (string, required): File name.

Deprecated parameter:
- cipherKey: Deprecated. Configure the crypto module instead. Passing cipherKey overrides crypto module and uses legacy 128-bit encryption.

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

Returns instance of [PubNubFile](#pubnub-file).

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

- params: DeleteFileParams (required)

#### DeleteFileParams

- channel (string, required): Channel the file was sent to.
- id (string, required): File identifier.
- name (string, required): File name.

### Sample code

```
1
  

```

### Returns

Example of successful deletion:

```
`1{  
2  status: 200  
3}  
`
```

## Publish file message

Publish a message about an already-uploaded file to a channel. Called by sendFile after upload. If sendFile fails with status.operation === PNPublishFileMessageOperation, you can retry by calling publishFile using data from the status object without re-uploading.

### Method(s)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

- params: PublishFileParams (required)

#### PublishFileParams

- channel (string, required): Channel where the file was sent.
- message (any, optional): Optional message to attach.
- fileId (string, required): File identifier.
- fileName (string, required): File name.
- storeInHistory (boolean, default: true): Store published file messages in history; if omitted, key’s history config applies.
- ttl (number, default: 0): Message history TTL; defaults to key set’s retention.
- meta (any, optional): Metadata for the message.
- customMessageType (string, optional): Case-sensitive, 3–50 chars, alphanumeric; dashes and underscores allowed; cannot start with special chars or pn_/pn-. Examples: text, action, poll.

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

Represents environment-specific file inputs.

#### Node.js

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

#### Browsers

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

#### React and React Native

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

Internal file representation with environment-specific extraction methods.

##### Methods supported in Node.js

- file.toBuffer(): Promise<Buffer>
- file.toStream(): Promise<Readable>
- file.toString(encoding: string): string (defaults to utf8 if not available)

##### Methods supported in a browser

- file.toFile(): Promise<File>
- file.toBlob(): Promise<Blob>
- file.toArrayBuffer(): Promise<ArrayBuffer>
- file.toString(encoding: string): string (defaults to utf8 if not available)

##### React and React Native

- file.toBlob(): Promise<Blob>

Last updated on Sep 3, 2025