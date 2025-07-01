On this page
# File Sharing API for JavaScript SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

##### Supported and recommended asynchronous patterns

PubNub supports [Callbacks, Promises, and Async/Await](https://javascript.info/async) for asynchronous JS operations. The recommended pattern is Async/Await and all sample requests in this document are based on it. This pattern returns a status only on detecting an error. To receive the error status, you must add the [`try...catch`](https://javascript.info/try-catch) syntax to your code.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFile` internally calls the [`publishFile`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`pubnub.sendFile(  
  params: SendFileParameters  
): PromiseSendFileResult>;  
`
```

*  requiredParameterDescription`params` *Type: [SendFileParameters](#sendfileparameters)Parameters used to upload the file to a channel.

#### SendFileParameters[​](#sendfileparameters)

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel to send the file to.`file` *Type: [FileInput](#fileinput)Default:  
n/aFile to send.`message`Type: anyDefault:  
n/aOptional message to attach to the file.`storeInHistory`Type: booleanDefault:  
`true`Whether published file messages should be stored in the channel's history. If `storeInHistory` is not specified, then the history configuration on the key is used.`ttl`Type: numberDefault:  
0How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.`meta`Type: anyDefault:  
n/aMetadata for the message.`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

```
`  
`
```

### Returns[​](#returns)

```
`{  
  id: string,  
  name: string,  
  timetoken: string  
}  
`
```

### Other Examples[​](#other-examples)

#### Usage with a message and custom cipher key[​](#usage-with-a-message-and-custom-cipher-key)

```
`  
`
```

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.listFiles(  
  params: ListFilesParameters  
): PromiseListFilesResult>;  
`
```

*  requiredParameterDescription`params` *Type: [ListFilesParameters](#listfilesparameters)Parameters used to retrieve the list of uploaded files.

#### ListFilesParameters[​](#listfilesparameters)

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aRetrieve list of files for this channel.`limit`Type: numberDefault:  
100Number of files to return.`next`Type: stringDefault:  
n/aString token to get the next batch of files.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

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

## Get File Url[​](#get-file-url)

Get a file's direct download URL. This method doesn't make any API calls, and won't `decrypt` an encrypted file.

### Method(s)[​](#methods-2)

```
`pubnub.getFileUrl(  
  params: GetFileUrlParams  
): string;  
`
```

*  requiredParameterDescription`params` *Type: [GetFileUrlParams](#getfileurlparams)Parameters used to construct file URL.

#### GetFileUrlParams[​](#getfileurlparams)

*  requiredParameterDescription`channel` *Type: stringChannel that the file was sent to.`id` *Type: stringThe file's unique identifier.`name` *Type: stringName of the file.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

```
`'https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/12345678-1234-5678-123456789012/cat_picture.jpg'  
`
```

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`pubnub.downloadFile(  
  params: DownloadFileParams  
): PromiseDownloadFileResult>;  
`
```

*  requiredParameterDescription`params` *Type: [DownloadFileParams](#downloadfileparams)Parameters used to download the file.

#### DownloadFileParams[​](#downloadfileparams)

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel that the file was sent to.`id` *Type: stringDefault:  
n/aThe file's unique identifier.`name` *Type: stringDefault:  
n/aName of the file.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/javascript/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

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

### Returns[​](#returns-3)

Returns instance of [PubNubFile](#pubnub-file).

### Other Examples[​](#other-examples-1)

#### Usage with custom cipher key[​](#usage-with-custom-cipher-key)

```
`  
`
```

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`pubnub.deleteFile(  
  params: DeleteFileParams  
): PromiseDeleteFileResult>;  
`
```

*  requiredParameterDescription`params` *Type: [DeleteFileParams](#deletefileparams)Parameters used to delete the file.

#### DeleteFileParams[​](#deletefileparams)

*  requiredParameterDescription`channel` *Type: stringChannel that the file was sent to.`id` *Type: stringThe file's unique identifier.`name` *Type: stringName of the file.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

### Returns[​](#returns-4)

Example of successful deletion:

```
`{  
  status: 200  
}  
`
```

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFile` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`pubnub.publishFile(  
  params: PublishFileParams  
): PromisePublishFileResult>;  
`
```

*  requiredParameterDescription`params` *Type: [PublishFileParams](#publishfileparams)Parameters used to publish the file.

#### PublishFileParams[​](#publishfileparams)

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel to which the file was sent.`message`Type: anyDefault:  
n/aOptional message to attach to the file.`fileId` *Type: stringDefault:  
n/aThe file's unique identifier.`fileName` *Type: stringDefault:  
n/aName of the file.`storeInHistory`Type: booleanDefault:  
`true`Whether published file messages should be stored in the channel's history. If `storeInHistory` is not specified, then the history configuration on the key is used.`ttl`Type: numberDefault:  
0How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.`meta`Type: anyDefault:  
n/aMetadata for the message.`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

### Returns[​](#returns-5)

```
`{  
  timetoken: number  
}  
`
```

## FileInput[​](#fileinput)

`FileInput` represents a variety of possible inputs that represent a file in different environments.

#### Node.js[​](#nodejs)

##### Using streams[​](#using-streams)

```
`{  
    stream: Readable,  
    name: string,  
    mimeType?: string  
}  
`
```

##### Using buffers[​](#using-buffers)

```
`{  
    data: Buffer,  
    name: string,  
    mimeType?: string  
}  
`
```

#### Browsers[​](#browsers)

##### Using File API[​](#using-file-api)

```
`File  
`
```

##### Using strings[​](#using-strings)

```
`{  
    data: string,  
    name: string,  
    mimeType?: string  
}  
`
```

##### Using ArrayBuffer[​](#using-arraybuffer)

```
`{  
    data: ArrayBuffer,  
    name: string,  
    mimeType?: string  
}  
`
```

#### React and React Native[​](#react-and-react-native)

##### Using URI[​](#using-uri)

```
`{  
    uri: string,  
    name: string,  
    mimeType?: string  
}  
`
```

## PubNub File[​](#pubnub-file)

Internal representation of the file used by the SDK. Depending on the environment, different methods can be used to extract the file.

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

Last updated on **Jun 30, 2025**