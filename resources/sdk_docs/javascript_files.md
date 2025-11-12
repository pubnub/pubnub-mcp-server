# File Sharing API for JavaScript SDK

Upload and share files up to 5 MB. Files uploaded to a channel are stored via a storage service and associated with your key. Channel subscribers receive a file event containing file ID, filename, and optional description.

##### Supported and recommended asynchronous patterns

Callbacks, Promises, and Async/Await are supported. Recommended: Async/Await with try...catch to receive error status (status is returned only on error).

## Send file[​](#send-file)

Upload a file to a channel. Handles preparation, upload to cloud storage, and publishing a file message on the channel. Internally calls publishFile to announce the file (ID and name) to subscribers.

### Method(s)[​](#methods)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

- params: SendFileParameters

#### SendFileParameters[​](#sendfileparameters)

- channel (Type: string) – Channel to send the file to.
- file (Type: FileInput) – File to send.
- message (Type: any) – Optional message to attach to the file.
- storeInHistory (Type: boolean, Default: true) – Whether to store the file message in history. If not provided, key-level history config is used.
- ttl (Type: number, Default: 0) – History retention for this message; defaults to key set retention.
- meta (Type: any) – Metadata for the message.
- customMessageType (Type: string) – Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed. Cannot start with special chars or pn_ / pn-. Examples: text, action, poll.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

```
1
  

```

### Returns[​](#returns)

```
`1{  
2  id: string,  
3  name: string,  
4  timetoken: string  
5}  
`
```

### Other examples[​](#other-examples)

#### Usage with a message and custom cipher key[​](#usage-with-a-message-and-custom-cipher-key)

```
1
  

```

## List channel files[​](#list-channel-files)

Retrieve a list of files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1pubnub.listFiles(  
2  params: ListFilesParameters  
3): PromiseListFilesResult>;  
`
```

- params: ListFilesParameters

#### ListFilesParameters[​](#listfilesparameters)

- channel (Type: string) – Channel to list files for.
- limit (Type: number, Default: 100) – Number of files to return.
- next (Type: string) – Token for next page.

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

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

## Get file URL[​](#get-file-url)

Construct a file’s direct download URL. No API call is made and encrypted files aren’t decrypted.

### Method(s)[​](#methods-2)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

- params: GetFileUrlParams

#### GetFileUrlParams[​](#getfileurlparams)

- channel (Type: string) – Channel the file was sent to.
- id (Type: string) – File’s unique identifier.
- name (Type: string) – File name.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

```
`1'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'  
`
```

## Download file[​](#download-file)

Download a file from a channel.

### Method(s)[​](#methods-3)

```
`1pubnub.downloadFile(  
2  params: DownloadFileParams  
3): PromiseDownloadFileResult>;  
`
```

- params: DownloadFileParams

#### DownloadFileParams[​](#downloadfileparams)

- channel (Type: string) – Channel the file was sent to.
- id (Type: string) – File’s unique identifier.
- name (Type: string) – File name.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead. If provided, it overrides the crypto module and uses legacy 128-bit cipher key encryption.

### Sample code[​](#sample-code-3)

```
1
  

```

```
1
  

```

```
1
  

```

### Returns[​](#returns-3)

Returns instance of PubNubFile.

### Other examples[​](#other-examples-1)

#### Usage with custom cipher key[​](#usage-with-custom-cipher-key)

```
1
  

```

## Delete file[​](#delete-file)

Delete a file from a channel.

### Method(s)[​](#methods-4)

```
`1pubnub.deleteFile(  
2  params: DeleteFileParams  
3): PromiseDeleteFileResult>;  
`
```

- params: DeleteFileParams

#### DeleteFileParams[​](#deletefileparams)

- channel (Type: string) – Channel the file was sent to.
- id (Type: string) – File’s unique identifier.
- name (Type: string) – File name.

### Sample code[​](#sample-code-4)

```
1
  

```

### Returns[​](#returns-4)

Example of successful deletion:

```
`1{  
2  status: 200  
3}  
`
```

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a channel. Called internally by sendFile. Use this if sendFile fails with status.operation === PNPublishFileMessageOperation; reuse data from status to publish without re-uploading.

### Method(s)[​](#methods-5)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

- params: PublishFileParams

#### PublishFileParams[​](#publishfileparams)

- channel (Type: string) – Channel to which the file was sent.
- message (Type: any) – Optional message to attach to the file.
- fileId (Type: string) – File’s unique identifier.
- fileName (Type: string) – File name.
- storeInHistory (Type: boolean, Default: true) – Whether to store in history. If not provided, key-level history config is used.
- ttl (Type: number, Default: 0) – History retention; defaults to key set retention.
- meta (Type: any) – Metadata for the message.
- customMessageType (Type: string) – Case-sensitive, 3–50 alphanumeric chars; dashes and underscores allowed. Cannot start with special chars or pn_ / pn-. Examples: text, action, poll.

### Sample code[​](#sample-code-5)

```
1
  

```

### Returns[​](#returns-5)

```
`1{  
2  timetoken: number  
3}  
`
```

## FileInput[​](#fileinput)

Represents file inputs across environments.

#### Node.js[​](#nodejs)

##### Using streams[​](#using-streams)

```
`1{  
2    stream: Readable,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

##### Using buffers[​](#using-buffers)

```
`1{  
2    data: Buffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

#### Browsers[​](#browsers)

##### Using File API[​](#using-file-api)

```
`1File  
`
```

##### Using strings[​](#using-strings)

```
`1{  
2    data: string,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

##### Using ArrayBuffer[​](#using-arraybuffer)

```
`1{  
2    data: ArrayBuffer,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

#### React and React Native[​](#react-and-react-native)

##### Using URI[​](#using-uri)

```
`1{  
2    uri: string,  
3    name: string,  
4    mimeType?: string  
5}  
`
```

## PubNub file[​](#pubnub-file)

Internal representation of the file with environment-specific extraction methods.

##### Methods supported in Node.js[​](#methods-supported-in-nodejs)

- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### Methods supported in a browser[​](#methods-supported-in-a-browser)

- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string encoded using encoding (defaults to utf8)

##### React and React Native[​](#react-and-react-native-1)

- file.toBlob() returns Promise<Blob>

Last updated on Sep 3, 2025