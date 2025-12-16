# File Sharing API for JavaScript SDK

Upload/share files up to **5 MB**. Uploading on a `channel` stores the file via a storage service associated with your key; subscribers receive a file event containing **file `ID`**, **`filename`**, and optional **`description`**.

## Supported async patterns
Supports **Callbacks, Promises, Async/Await**. Samples use **Async/Await**; add `try...catch` to capture error status (status returned only on error).

---

## Send file[​](#send-file)

Uploads a file to a channel end-to-end: preparation → upload to storage → publish file message on the channel. Internally calls [`publishFile`](#publish-file-message) for the final publish step.

### Method(s)[​](#methods)

```
`1pubnub.sendFile(  
2  params: SendFileParameters  
3): PromiseSendFileResult>;  
`
```

* requiredParameterDescription `params` *Type: [SendFileParameters](#sendfileparameters) Parameters used to upload the file to a channel.

#### SendFileParameters[​](#sendfileparameters)

* requiredParameterDescription `channel` *Type: string Default: n/a Channel to send the file to.  
`file` *Type: [FileInput](#fileinput) Default: n/a File to send.  
`message` Type: any Default: n/a Optional message to attach to the file.  
`storeInHistory` Type: boolean Default: `true` Whether to store published file messages in the channel's history. If `storeInHistory` is not specified, the history configuration on the key is used.  
`ttl` Type: number Default: 0 How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.  
`meta` Type: any Default: n/a Metadata for the message.  
`customMessageType` Type: string Default: n/a A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.

Examples: `text`, `action`, `poll`.

##### Deprecated parameter
`cipherKey` is deprecated; configure the **crypto module** instead. If passed, it overrides crypto module configuration and uses legacy encryption with 128-bit cipher key entropy.

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

---

## List channel files[​](#list-channel-files)

Retrieve files uploaded to a `channel`.

### Method(s)[​](#methods-1)

```
`1pubnub.listFiles(  
2  params: ListFilesParameters  
3): PromiseListFilesResult>;  
`
```

* requiredParameterDescription `params` *Type: [ListFilesParameters](#listfilesparameters) Parameters used to retrieve the list of uploaded files.

#### ListFilesParameters[​](#listfilesparameters)

* requiredParameterDescription `channel` *Type: string Default: n/a Retrieve list of files for this channel.  
`limit` Type: number Default: 100 Number of files to return.  
`next` Type: string Default: n/a String token to get the next batch of files.

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

---

## Get file URL[​](#get-file-url)

Construct a direct download URL. **No API calls** and **does not decrypt** encrypted files.

### Method(s)[​](#methods-2)

```
`1pubnub.getFileUrl(  
2  params: GetFileUrlParams  
3): string;  
`
```

* requiredParameterDescription `params` *Type: [GetFileUrlParams](#getfileurlparams) Parameters used to construct file URL.

#### GetFileUrlParams[​](#getfileurlparams)

* requiredParameterDescription `channel` *Type: string Channel that the file was sent to.  
`id` *Type: string The file's unique identifier.  
`name` *Type: string Name of the file.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

```
`1'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'  
`
```

---

## Download file[​](#download-file)

Download a file from a `channel`.

### Method(s)[​](#methods-3)

```
`1pubnub.downloadFile(  
2  params: DownloadFileParams  
3): PromiseDownloadFileResult>;  
`
```

* requiredParameterDescription `params` *Type: [DownloadFileParams](#downloadfileparams) Parameters used to download the file.

#### DownloadFileParams[​](#downloadfileparams)

* requiredParameterDescription `channel` *Type: string Default: n/a Channel that the file was sent to.  
`id` *Type: string Default: n/a The file's unique identifier.  
`name` *Type: string Default: n/a Name of the file.

##### Deprecated parameter
`cipherKey` is deprecated; configure the **crypto module** instead. If passed, it overrides crypto module configuration and uses legacy encryption with 128-bit cipher key entropy.

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

Returns instance of [PubNubFile](#pubnub-file).

### Other examples[​](#other-examples-1)

#### Usage with custom cipher key[​](#usage-with-custom-cipher-key)

```
1
  

```

---

## Delete file[​](#delete-file)

Delete a file from a `channel`.

### Method(s)[​](#methods-4)

```
`1pubnub.deleteFile(  
2  params: DeleteFileParams  
3): PromiseDeleteFileResult>;  
`
```

* requiredParameterDescription `params` *Type: [DeleteFileParams](#deletefileparams) Parameters used to delete the file.

#### DeleteFileParams[​](#deletefileparams)

* requiredParameterDescription `channel` *Type: string Channel that the file was sent to.  
`id` *Type: string The file's unique identifier.  
`name` *Type: string Name of the file.

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

---

## Publish file message[​](#publish-file-message)

Publish a message referencing an **already uploaded** file (file `id` + `name`) to a channel. Called internally by [`sendFile`](#send-file). Useful to retry only the publish step when `sendFile` fails with `status.operation === PNPublishFileMessageOperation`.

### Method(s)[​](#methods-5)

```
`1pubnub.publishFile(  
2  params: PublishFileParams  
3): PromisePublishFileResult>;  
`
```

* requiredParameterDescription `params` *Type: [PublishFileParams](#publishfileparams) Parameters used to publish the file.

#### PublishFileParams[​](#publishfileparams)

* requiredParameterDescription `channel` *Type: string Default: n/a Channel to which the file was sent.  
`message` Type: any Default: n/a Optional message to attach to the file.  
`fileId` *Type: string Default: n/a The file's unique identifier.  
`fileName` *Type: string Default: n/a Name of the file.  
`storeInHistory` Type: boolean Default: `true` Whether to store published file messages in the channel's history. If `storeInHistory` is not specified, the history configuration on the key is used.  
`ttl` Type: number Default: 0 How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.  
`meta` Type: any Default: n/a Metadata for the message.  
`customMessageType` Type: string Default: n/a A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.

Examples: `text`, `action`, `poll`.

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

---

## FileInput[​](#fileinput)

`FileInput` is a cross-environment file representation.

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

---

## PubNub file[​](#pubnub-file)

SDK internal file representation returned by download.

##### Methods supported in Node.js[​](#methods-supported-in-nodejs)

- `file.toBuffer()` returns `Promise<Buffer>`
- `file.toStream()` returns `Promise<Readable>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (if not available, defaults to `utf8`)

##### Methods supported in a browser[​](#methods-supported-in-a-browser)

- `file.toFile()` returns `Promise<File>`
- `file.toBlob()` returns `Promise<Blob>`
- `file.toArrayBuffer()` returns `Promise<ArrayBuffer>`
- `file.toString(encoding: string)` returns a string encoded using `encoding` (if not available, defaults to `utf8`)

##### React and React Native[​](#react-and-react-native-1)

- `file.toBlob()` returns `Promise<Blob>`

Last updated on **Sep 3, 2025**