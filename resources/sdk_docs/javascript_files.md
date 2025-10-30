# File Sharing API for JavaScript SDK

Upload and share files up to 5 MB on PubNub. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

##### Supported and recommended asynchronous patterns

Use Callbacks, Promises, or Async/Await (recommended). Add try...catch to handle errors.

## Send file[​](#send-file)

Uploads a file to a channel and publishes a file message. Internally calls publishFile to announce the upload.

### Method(s)[​](#methods)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

- params (required): Type: SendFileParameters

#### SendFileParameters[​](#sendfileparameters)

- channel (required)
  - Type: string
  - Description: Channel to send the file to.
- file (required)
  - Type: FileInput
  - Description: File to send.
- message
  - Type: any
  - Description: Optional message to attach to the file.
- storeInHistory
  - Type: boolean
  - Default: true
  - Description: Store published file messages in channel history; if omitted, key’s history configuration is used.
- ttl
  - Type: number
  - Default: 0
  - Description: How long to store the message in history; defaults to key set’s retention.
- meta
  - Type: any
  - Description: Metadata for the message.
- customMessageType
  - Type: string
  - Description: Case-sensitive, 3–50 char alphanumeric label; dashes and underscores allowed; cannot start with special chars or pn_ / pn-. Examples: text, action, poll.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead (/docs/sdks/javascript/api-reference/configuration#cryptomodule). Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

Retrieve files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1pubnub.listFiles(  
2  params: ListFilesParameters  
3): PromiseListFilesResult>;  
`
```

- params (required): Type: ListFilesParameters

#### ListFilesParameters[​](#listfilesparameters)

- channel (required)
  - Type: string
  - Description: Channel whose files to list.
- limit
  - Type: number
  - Default: 100
  - Description: Number of files to return.
- next
  - Type: string
  - Description: Token for next page.

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

Construct a file’s direct download URL. No network call; does not decrypt encrypted files.

### Method(s)[​](#methods-2)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

- params (required): Type: GetFileUrlParams

#### GetFileUrlParams[​](#getfileurlparams)

- channel (required)
  - Type: string
- id (required)
  - Type: string
- name (required)
  - Type: string

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

- params (required): Type: DownloadFileParams

#### DownloadFileParams[​](#downloadfileparams)

- channel (required)
  - Type: string
  - Description: Channel that the file was sent to.
- id (required)
  - Type: string
  - Description: File’s unique identifier.
- name (required)
  - Type: string
  - Description: Name of the file.

##### Deprecated parameter

cipherKey is deprecated. Configure the crypto module instead (/docs/sdks/javascript/api-reference/configuration#cryptomodule). Passing cipherKey overrides the crypto module and uses legacy 128-bit encryption.

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

- params (required): Type: DeleteFileParams

#### DeleteFileParams[​](#deletefileparams)

- channel (required)
  - Type: string
- id (required)
  - Type: string
- name (required)
  - Type: string

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

Publish the uploaded file message to a channel. Called internally by sendFile. If sendFile fails with status.operation === PNPublishFileMessageOperation, reuse data from status to call publishFile without re-uploading.

### Method(s)[​](#methods-5)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

- params (required): Type: PublishFileParams

#### PublishFileParams[​](#publishfileparams)

- channel (required)
  - Type: string
  - Description: Channel to which the file was sent.
- message
  - Type: any
  - Description: Optional message to attach to the file.
- fileId (required)
  - Type: string
- fileName (required)
  - Type: string
- storeInHistory
  - Type: boolean
  - Default: true
  - Description: Store published file messages in channel history; if omitted, key’s history configuration is used.
- ttl
  - Type: number
  - Default: 0
  - Description: How long to store the message in history; defaults to key set’s retention.
- meta
  - Type: any
  - Description: Metadata for the message.
- customMessageType
  - Type: string
  - Description: Case-sensitive, 3–50 char alphanumeric label; dashes and underscores allowed; cannot start with special chars or pn_ / pn-. Examples: text, action, poll.

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

Represents possible file inputs across environments.

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

Internal file representation. Methods vary by environment.

##### Methods supported in Node.js[​](#methods-supported-in-nodejs)

- file.toBuffer() returns Promise<Buffer>
- file.toStream() returns Promise<Readable>
- file.toString(encoding: string) returns a string (defaults to utf8)

##### Methods supported in a browser[​](#methods-supported-in-a-browser)

- file.toFile() returns Promise<File>
- file.toBlob() returns Promise<Blob>
- file.toArrayBuffer() returns Promise<ArrayBuffer>
- file.toString(encoding: string) returns a string (defaults to utf8)

##### React and React Native[​](#react-and-react-native-1)

- file.toBlob() returns Promise<Blob>

Last updated on Sep 3, 2025