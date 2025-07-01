On this page
# File Sharing API for Kotlin SDK

##### Breaking changes in v9.0.0

PubNub Kotlin SDK version 9.0.0 unifies the codebases for Kotlin and [Java](/docs/sdks/java) SDKs, introduces a new way of instantiating the PubNub client, and changes asynchronous API callbacks and emitted [status events](/docs/sdks/kotlin/status-events). These changes can impact applications built with previous versions (< `9.0.0` ) of the Kotlin SDK.

For more details about what has changed, refer to [Java/Kotlin SDK migration guide](/docs/general/resources/migration-guides/java-kotlin-sdk-migration-guide).

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

##### Request execution

Most PubNub Kotlin SDK method invocations return an Endpoint object, which allows you to decide whether to perform the operation synchronously or asynchronously.

You must invoke the `.sync()` or `.async()` method on the Endpoint to execute the request, or the operation **will not** be performed.

```
`val channel = pubnub.channel("channelName")  
  
channel.publish("This SDK rules!").async { result ->  
    result.onFailure { exception ->  
        // Handle error  
    }.onSuccess { value ->  
        // Handle successful method result  
    }  
}  
`
```

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFile` internally calls the [`publishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`pubnub.sendFile(  
    channel: String,  
    fileName: String,  
    inputStream: InputStream,  
    message: Any? = null,  
    meta: Any? = null,  
    ttl: Int? = null,  
    shouldStore: Boolean? = null  
    customMessageType: String  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
N/AChannel for the file`fileName` *Type: StringDefault:  
N/AName of the file to send`inputStream` *Type: InputStreamDefault:  
N/AInput stream with file content`message`Type: Any?Default:  
N/AMessage which should be sent along with file to specified `channel`.`meta`Type: Any?Default:  
N/A`Meta` data object which can be used with the filtering ability.`ttl`Type: Int?Default:  
nullHow long message should be stored in channel's storage.`shouldStore`Type: Boolean?Default:  
trueWhether PubNub published `file message` should be stored in `channel` history.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Response[​](#response)

```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "name": "cat_picture.jpg"  
  }  
}  
`
```

### Returns[​](#returns)

The `sendFile()` operation returns a `PNFileUploadResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongA representation of the timetoken when the message was published.`status`IntRemote call return code.`file`PNBaseFileUploaded file information.

`PNBaseFile` contains the following properties:

Property NameTypeDescription`id`LongId of the uploaded file.`name`StringName of the upload file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.listFiles()  
    channel: String,  
    limit: Int,  
    next: String?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel to get list of files.`limit`Type: IntDefault:  
100Number of files to return. Minimum value is 1, and maximum is 100.`next`Type: String?Default:  
nullRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

### Basic usage[​](#basic-usage-1)

```
`  
`
```

### Response[​](#response-1)

```
`{  
  "data":[  
      {  
      "name":"cat_picture.jpg",  
      "id":"fileId",  
      "size":25778,  
      "created":"202007 - 26T13:42:06Z"  
      }],  
   "status": 200  
   "totalCount": 1,  
   "next": null,  
   "prev": null  
}  
`
```

### Returns[​](#returns-1)

The `listFiles()` operation returns a `PNListFilesResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongA representation of the timetoken when the message was published.`status`IntRemote call return code.`next`StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`count`IntNumber of files returned.`data`List`<PNUploadedFile>`List of channel files.

`PNUploadedFile` contains the following properties:

Property NameTypeDescription`id`LongId of the uploaded file.`name`StringName of the upload file.`size`IntSize of the uploaded file.`created`StringTime of creation.

## Get File URL[​](#get-file-url)

Generate a URL to be used to download a file from the target `channel`.

### Method(s)[​](#methods-2)

```
`pubnub.getFileUrl(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
N/AName of channel to which the file has been uploaded.`fileName` *Type: StringDefault:  
N/AName under which the uploaded file is stored.`fileId` *Type: StringDefault:  
N/AUnique identifier for the file, assigned during upload.

### Basic usage[​](#basic-usage-2)

```
`  
`
```

### Response[​](#response-2)

```
`{  
    "url" : http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/fileID/cat_picture.jpg?pnsdk=PubNub-kotlin-Unified/4.32.0&timestamp=1595771548&uuid=someUuid  
}  
`
```

### Returns[​](#returns-2)

The `getFileUrl()` operation returns a `PNFileUrlResult` which contains the following properties:

Property NameTypeDescription`url`StringURL to be used to download the requested file.

## Download file[​](#download-file)

Download the specified file.

### Method(s)[​](#methods-3)

```
`pubnub.downloadFile(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
N/AName of channel to which the file has been uploaded.`fileName` *Type: StringDefault:  
N/AName under which the uploaded file is stored.`fileId` *Type: StringDefault:  
N/AUnique identifier for the file, assigned during upload.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/kotlin/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic usage[​](#basic-usage-3)

```
`  
`
```

### Response[​](#response-3)

```
`{  
    "fileName": "cat_picture.jpg",  
    "byteStream": file data>  
}  
`
```

### Returns[​](#returns-3)

The `downloadFile()` operation returns a `PNDownloadFileResult` which contains the following properties:

Property NameTypeDescription`fileName`stringName of the downloaded file.`byteStream`InputStreamInput stream containing all bytes of the downloaded file.

## Delete file[​](#delete-file)

Delete a file from the specified channel.

### Method(s)[​](#methods-4)

```
`pubnub.deleteFile(  
    channel: String,  
    fileName: String,  
    fileId: String  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
N/AThe channel from which to delete the file.`fileName` *Type: StringDefault:  
N/AName of the file to be deleted.`fileId` *Type: StringDefault:  
N/AUnique identifier of the file to be deleted.

### Basic usage[​](#basic-usage-4)

```
`  
`
```

### Response[​](#response-4)

```
`{  
    "status": 200  
}  
`
```

### Returns[​](#returns-4)

The `deleteFile()` operation returns a `PNDeleteFileResult` which contains the following property:

Property NameTypeDescription`Status`intReturns a status code

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFileMessage` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`pubnub.publishFileMessage(  
    channel: String,  
    fileName: String,  
    fileId: String,  
    message: Any?,  
    meta: Any?,  
    shouldStore: Boolean,  
    customMessageType: String  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
N/AName of channel to publish file message.`fileName` *Type: StringDefault:  
N/AName of the `file`.`fileId` *Type: StringDefault:  
N/AUnique identifier of the file.`message`Type: Any?Default:  
nullThe payload.`meta`Type: Any?Default:  
nullMetadata object which can be used with the filtering capability.`shouldStore`Type: BooleanDefault:  
TrueSet to `False` to *not* store this message in history. By default, messages are stored according to the retention policy you set on your key.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic usage[​](#basic-usage-5)

```
`  
`
```

### Response[​](#response-5)

```
`[1, "Sent", "17483548017978763"]  
`
```

### Returns[​](#returns-5)

The sendFile() operation returns a `PNFileUploadResult` which contains the following properties:

Property NameTypeDescription`timetoken`LongThe timetoken at which the message was published.`status`IntRemote call return code.`file`PNBaseFileUploaded file information.

`PNBaseFile` contains the following properties:

Property NameTypeDescription`id`LongUnique identifier of the uploaded file`name`StringName of the uploaded fileLast updated on **Jun 2, 2025**