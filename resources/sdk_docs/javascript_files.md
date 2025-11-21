# File Sharing API for JavaScript SDK

Upload and share files (up to 5 MB) on a channel. Subscribers receive a file event with file ID, filename, and optional description.

##### Supported and recommended asynchronous patterns

PubNub supports Callbacks, Promises, and Async/Await. Recommended: Async/Await. Add try...catch to receive error status.

## Send file

Upload a file to a channel and publish its metadata message. Internally calls publishFile.

### Method(s)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

- params Type: SendFileParameters — Parameters used to upload the file to a channel.

#### SendFileParameters

- channel Type: string Default: n/a — Channel to send the file to.
- file Type: FileInput Default: n/a — File to send.
- message Type: any Default: n/a — Optional message to attach to the file.
- storeInHistory Type: boolean Default: true — Whether to store published file messages in channel history. If not specified, uses key configuration.
- ttl Type: number Default: 0 — How long the message is stored in history. Defaults to key set retention.
- meta Type: any Default: n/a — Metadata for the message.
- customMessageType Type: string Default: n/a — Case-sensitive, alphanumeric string (3–50 chars). Dashes - and underscores _ allowed. Cannot start with special characters or pn_ / pn-. Examples: text, action, poll.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module on your PubNub instance instead. If passed, it overrides crypto module config and uses legacy 128-bit cipher key entropy.

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

- params Type: ListFilesParameters — Parameters used to retrieve the list of uploaded files.

#### ListFilesParameters

- channel Type: string Default: n/a — Channel to list files for.
- limit Type: number Default: 100 — Number of files to return.
- next Type: string Default: n/a — Token for next page.

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

Construct the file’s direct download URL. No API call; does not decrypt.

### Method(s)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

- params Type: GetFileUrlParams — Parameters used to construct file URL.

#### GetFileUrlParams

- channel Type: string — Channel that the file was sent to.
- id Type: string — File’s unique identifier.
- name Type: string — File name.

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

- params Type: DownloadFileParams — Parameters used to download the file.

#### DownloadFileParams

- channel Type: string Default: n/a — Channel that the file was sent to.
- id Type: string Default: n/a — File’s unique identifier.
- name Type: string Default: n/a — File name.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module on your PubNub instance instead. If passed, it overrides crypto module config and uses legacy 128-bit cipher key entropy.

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

- params Type: DeleteFileParams — Parameters used to delete the file.

#### DeleteFileParams

- channel Type: string — Channel that the file was sent to.
- id Type: string — File’s unique identifier.
- name Type: string — File name.

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

Publish the uploaded file message to a channel. Called by sendFile; use directly if sendFile fails with status.operation === PNPublishFileMessageOperation to resend the message without re-uploading.

### Method(s)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

- params Type: PublishFileParams — Parameters used to publish the file.

#### PublishFileParams

- channel Type: string Default: n/a — Channel to which the file was sent.
- message Type: any Default: n/a — Optional message to attach.
- fileId Type: string Default: n/a — File’s unique identifier.
- fileName Type: string Default: n/a — File name.
- storeInHistory Type: boolean Default: true — Whether to store published file messages in history. If not specified, uses key configuration.
- ttl Type: number Default: 0 — How long the message is stored in history. Defaults to key set retention.
- meta Type: any Default: n/a — Metadata for the message.
- customMessageType Type: string Default: n/a — Case-sensitive, alphanumeric string (3–50 chars). Dashes - and underscores _ allowed. Cannot start with special characters or pn_ / pn-. Examples: text, action, poll.

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

Represents file inputs across environments.

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

Internal file representation with environment-specific extractors.

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