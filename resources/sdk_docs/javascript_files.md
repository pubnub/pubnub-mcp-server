# File Sharing API for JavaScript SDK

- Upload and share files up to 5 MB per file.
- When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.
- Asynchronous patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch to capture errors.

## Send file

Upload a file to a channel. Handles preparation, cloud upload, and publishing a file message (internally calls publishFile).

### Method(s)

```
`pubnub.sendFile(  
  params: SendFileParameters  
): PromiseSendFileResult>;  
`
```

- params: SendFileParameters (required)

#### SendFileParameters

- channel: string (required) — Channel to send the file to.
- file: FileInput (required) — File to send.
- message: any — Optional message to attach to the file.
- storeInHistory: boolean (default: true) — Whether to store the message in channel history. If omitted, uses key configuration.
- ttl: number (default: 0) — How long to store the message in history. Defaults to key set retention.
- meta: any — Metadata for the message.
- customMessageType: string — Case-sensitive 3–50 char alphanumeric label; dashes/underscores allowed. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

Deprecated parameter:
- cipherKey — Deprecated. Configure the crypto module instead. If provided, overrides crypto module and uses legacy 128-bit cipher.

### Sample code

##### Reference code
```
`  
`
```

```
`  
`
```

### Returns

```
`{  
  id: string,  
  name: string,  
  timetoken: string  
}  
`
```

### Other examples

#### Usage with a message and custom cipher key

```
`  
`
```

## List channel files

Retrieve a list of files uploaded to a channel.

### Method(s)

```
`pubnub.listFiles(  
  params: ListFilesParameters  
): PromiseListFilesResult>;  
`
```

- params: ListFilesParameters (required)

#### ListFilesParameters

- channel: string (required) — Channel to list files for.
- limit: number (default: 100) — Number of files to return.
- next: string — Token for the next batch.

### Sample code

```
`  
`
```

### Returns

```
`{  
  status: number,  
  data: Array{  
    name: string,  
    id: string,  
    size: number,  
    created: string  
  }>,  
  next: string,  
  count: number,  
}  
`
```

## Get file URL

Construct a file's direct download URL. No API call. Does not decrypt files.

### Method(s)

```
`pubnub.getFileUrl(  
  params: GetFileUrlParams  
): string;  
`
```

- params: GetFileUrlParams (required)

#### GetFileUrlParams

- channel: string — Channel the file was sent to.
- id: string — File identifier.
- name: string — File name.

### Sample code

```
`  
`
```

### Returns

```
`'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'  
`
```

## Download file

Download a file from a channel.

### Method(s)

```
`pubnub.downloadFile(  
  params: DownloadFileParams  
): PromiseDownloadFileResult>;  
`
```

- params: DownloadFileParams (required)

#### DownloadFileParams

- channel: string (required) — Channel the file was sent to.
- id: string (required) — File identifier.
- name: string (required) — File name.

Deprecated parameter:
- cipherKey — Deprecated. Configure the crypto module instead. If provided, overrides crypto module and uses legacy 128-bit cipher.

### Sample code

```
`  
`
```

```
`  
`
```

```
`  
`
```

### Returns

Returns instance of PubNubFile.

### Other examples

#### Usage with custom cipher key

```
`  
`
```

## Delete file

Delete a file from a channel.

### Method(s)

```
`pubnub.deleteFile(  
  params: DeleteFileParams  
): PromiseDeleteFileResult>;  
`
```

- params: DeleteFileParams (required)

#### DeleteFileParams

- channel: string — Channel that the file was sent to.
- id: string — File identifier.
- name: string — File name.

### Sample code

```
`  
`
```

### Returns

Example of successful deletion:
```
`{  
  status: 200  
}  
`
```

## Publish file message

Publish the uploaded file message to a channel. Called internally by sendFile. Can be used to resend the file message (e.g., when sendFile fails with status.operation === PNPublishFileMessageOperation).

### Method(s)

```
`pubnub.publishFile(  
  params: PublishFileParams  
): PromisePublishFileResult>;  
`
```

- params: PublishFileParams (required)

#### PublishFileParams

- channel: string (required) — Channel to which the file was sent.
- message: any — Optional message to attach to the file.
- fileId: string (required) — File identifier.
- fileName: string (required) — File name.
- storeInHistory: boolean (default: true) — Whether to store the message in history. If omitted, uses key configuration.
- ttl: number (default: 0) — How long to store the message. Defaults to key set retention.
- meta: any — Metadata for the message.
- customMessageType: string — Case-sensitive 3–50 char alphanumeric label; dashes/underscores allowed. Cannot start with special chars or pn_/pn-. Examples: text, action, poll.

### Sample code

```
`  
`
```

### Returns

```
`{  
  timetoken: number  
}  
`
```

## FileInput

Represents file inputs across environments.

### Node.js

#### Using streams

```
`{  
    stream: Readable,  
    name: string,  
    mimeType?: string  
}  
`
```

#### Using buffers

```
`{  
    data: Buffer,  
    name: string,  
    mimeType?: string  
}  
`
```

### Browsers

#### Using File API

```
`File  
`
```

#### Using strings

```
`{  
    data: string,  
    name: string,  
    mimeType?: string  
}  
`
```

#### Using ArrayBuffer

```
`{  
    data: ArrayBuffer,  
    name: string,  
    mimeType?: string  
}  
`
```

### React and React Native

#### Using URI

```
`{  
    uri: string,  
    name: string,  
    mimeType?: string  
}  
`
```

## PubNub file

Internal representation of the file. Methods vary by environment.

### Methods supported in Node.js

- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string (defaults to utf8)

### Methods supported in a browser

- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string (defaults to utf8)

### React and React Native

- file.toBlob() returns Promise<Blob>

Last updated on Sep 3, 2025