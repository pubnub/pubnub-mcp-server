On this page
# File Sharing API for JavaScript SDK

##### Breaking changes in v9.0.0

PubNub Java SDK version 9.0.0 unifies the codebases for Java and [Kotlin](/docs/sdks/kotlin) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/java/status-events). These changes can impact applications built with previous versions (< `9.0.0`) of the Java SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFile` internally calls the [`publishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is done automatically. Pass the full object as the message/meta payload and let PubNub take care of everything for you.

### Method(s)[​](#methods)

```
`pubnub.sendFile()  
    .channel(String)  
    .fileName(String)  
    .inputStream(InputStream)  
    .message(Object)  
    .shouldStore(Boolean)  
    .meta(Object)  
    .ttl(Integer)  
    .customMessageType(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel for the file.`fileName` *Type: StringDefault:  
n/aName of the file to send.`inputStream` *Type: InputStreamDefault:  
n/aInput stream with file content.`message`Type: ObjectDefault:  
n/aMessage which should be sent along with file to specified `channel`.`shouldStore`Type: BooleanDefault:  
`true`Whether PubNub published `file message` should be stored in `channel` history.`meta`Type: ObjectDefault:  
n/a`Meta` data object which can be used with the filtering ability.`ttl`Type: IntegerDefault:  
n/aHow long message should be stored in channel's storage.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

The `sendFile()` operation returns a `PNFileUploadResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongA representation of the timetoken when the message was published.`status`IntegerRemote call return code.`file`PNBaseFileUploaded `file` information.

`PNBaseFile` contains the following properties:

Property NameTypeDescription`id`Long`Id` of the uploaded file.`name`String`Name` of the upload file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.listFiles()  
    .channel(String)  
    .limit(Integer)  
    .next(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel to get list of files.`limit`Type: IntegerDefault:  
100Number of files to return. Minimum value is 1, and maximum is 100.`next`Type: StringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Response[​](#response)

```
`{  
  "data":[  
      {  
      "name":"cat_picture.jpg",  
      "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "size":25778,  
      "created":"2025-05-27T13:55:35Z"  
      }],  
   "status": 200  
   "count": 1,  
   "next": null  
}  
`
```

### Returns[​](#returns-1)

The `listFiles()` operation returns a `PNListFilesResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongA representation of the timetoken when the message was published.`status`IntegerRemote call return code.`next`StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`count`IntegerNumber of files returned.`data`List`List` of channel files.

`PNUploadedFile` contains the following properties:

Property NameTypeDescription`id`Long`Id` of the uploaded file.`name`String`Name` of the upload file.`size`Integer`Size` of the uploaded file.`created`StringTime of creation.

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`pubnub.getFileUrl()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringName of `channel` to which the file has been uploaded.`fileName` *Type: StringName under which the uploaded file is stored.`fileId` *Type: StringUnique identifier for the file, assigned during upload.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Response[​](#response-1)

```
`{  
  "url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=PubNub-Java-Unified/4.32.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
}  
`
```

### Returns[​](#returns-2)

The `getFileUrl()` operation returns a `PNFileUrlResult` which contains the following properties:

Property NameTypeDescription`url`String`URL` to be used to download the requested file.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`pubnub.downloadFile()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringName of `channel` to which the file has been uploaded.`fileName` *Type: StringName under which the uploaded file is stored.`fileId` *Type: StringUnique identifier for the file, assigned during upload.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/java/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Response[​](#response-2)

```
`{  
    "fileName": "cat_picture.jpg",  
    "byteStream": file data>  
}  
`
```

### Returns[​](#returns-3)

The `downloadFile()` operation returns a `PNDownloadFileResult` which contains the following properties:

Property NameTypeDescription`fileName`StringName of the downloaded file.`byteStream`InputStreamInput stream containing all bytes of the downloaded file.

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`pubnub.deleteFile()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringThe `channel` from which to delete the file.`fileName` *Type: StringName of the file to be deleted.`fileId` *Type: StringUnique identifier of the file to be deleted.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

### Response[​](#response-3)

```
`{  
    "status": 200  
}  
`
```

### Returns[​](#returns-4)

The `deleteFile()` operation returns a `PNDeleteFileResult` which contains the following property:

Property NameTypeDescription`Status`IntegerReturns a status code.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFileMessage` to manually resend a file message to a channel without repeating the upload step.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is done automatically. Pass the full object as the message/meta payload and let PubNub take care of everything for you.

### Method(s)[​](#methods-5)

```
`pubnub.publishFileMessage()  
    .channel(String)  
    .fileName(String)  
    .fileId(String)  
    .message(Object)  
    .meta(Object)  
    .shouldStore(Boolean)  
    .customMessageType(String)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of `channel` to publish file message.`fileName` *Type: StringDefault:  
n/aName of the file.`fileId` *Type: StringDefault:  
n/aUnique identifier of the file.`message`Type: ObjectDefault:  
n/aThe payload.`meta`Type: ObjectDefault:  
n/aMeta data object which can be used with the filtering ability.`shouldStore`Type: BooleanDefault:  
`true`Set to `false` to *not* store this message in history. By default, messages are stored according to the retention policy you set on your key.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-5)

```
`  
`
```

### Response[​](#response-4)

```
`[1, "Sent", "17483548017978763"]  
`
```

### Returns[​](#returns-5)

The `publishFileMessage()` operation returns a `PNFileUploadResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongThe timetoken at which the message was published.`status`IntegerRemote call return code.`file`PNBaseFileUploaded `file` information.

`PNBaseFile` contains the following properties:

Property NameTypeDescription`id`LongUnique identifier of the uploaded file`name`String`Name` of the uploaded fileLast updated on **May 28, 2025**