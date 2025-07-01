On this page
# File Sharing API for PHP SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFile` internally calls the [`publishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`$pubnub->sendFile()  
    ->channel(string)  
    ->fileName(string)  
    ->message(string|array)  
    ->shouldStore(Boolean)  
    ->shouldCompress(Boolean)  
    ->ttl(Int)  
    ->fileHandle(Resource)  
    ->fileContent(bytes|File)  
    ->meta(string|array)  
    ->customMessageType(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel for the file.`fileName` *Type: stringDefault:  
n/aName of the file to send.`message`Type: string or arrayDefault:  
n/aMessage which should be sent along with file to specified `channel`.`shouldStore`Type: BooleanDefault:  
`True`Whether PubNub published `file message` should be stored in `channel` history.`shouldCompress`Type: BooleanDefault:  
`True`Whether the request payload should be compressed.`ttl`Type: IntegerDefault:  
n/aHow long message should be stored in channel's storage.`fileHandle` *Type: ResourceDefault:  
n/aPointer to a resource to be read and placed in the buffer.`fileContent` *Type: bytes or PHP file objectDefault:  
n/aInput stream with file content.`meta`Type: string or arrayDefault:  
n/a`Meta` data object which can be used with the filtering ability.`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-file-upload-demo");  
  
`
```
show all 71 lines

### Returns[​](#returns)

The `sendFile()` operation returns an `PNSendFileResult` which contains the following fields:

#### PNSendFileResult[​](#pnsendfileresult)

Property NameTypeDescription`name`stringName of the uploaded file.`fileId`stringID of the uploaded file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`$pubnub->listFiles()  
    ->channel(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: stringDefault:  
n/aChannel to get the list of files.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `listFiles()` operation returns an `PNGetFilesResult` which contains the following fields:

#### PNGetFilesResult[​](#pngetfilesresult)

Property NameTypeDescription`next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`prev`stringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.`count`IntNumber of files returned.`data`ArrayArray of `PNGetFilesItem`.

`PNGetFilesItem` contains the following properties:

Property NameTypeDescription`id`string`Id` of the uploaded file.`name`string`Name` of the upload file.`size`string`Size` of the uploaded file.`creationTime`stringTime of creation.

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`$pubnub.getFileDownloadUrl()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

*  requiredParameterDescription`channel` *Type: stringName of `channel` to which the file has been uploaded.`fileName` *Type: stringName under which the uploaded file is stored.`fileId` *Type: stringUnique identifier for the file, assigned during upload.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The `getFileDownloadUrl()` operation returns an `PNGetFileDownloadURLResult` which contains the following fields:

#### PNGetFileDownloadURLResult[​](#pngetfiledownloadurlresult)

Property NameTypeDescription`fileUrl`string`URL` to be used to download the requested file.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`$pubnub.downloadFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

*  requiredParameterDescription`channel` *Type: stringName of `channel` to which the file has been uploaded.`fileName` *Type: stringName under which the uploaded file is stored.`fileId` *Type: stringUnique identifier for the file, assigned during upload.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

### Returns[​](#returns-3)

The `downloadFile()` operation returns an `PNDownloadFileResult` which contains the following fields:

#### PNDownloadFileResult[​](#pndownloadfileresult)

Property NameTypeDescription`fileContent`bytesThe file that was uploaded.

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`$pubnub.deleteFile()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->sync()  
`
```

*  requiredParameterDescription`channel` *Type: stringThe `channel` from which to delete the file.`fileId` *Type: stringUnique identifier of the file to be deleted.`fileName` *Type: stringName of the file to be deleted.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

### Returns[​](#returns-4)

The `deleteFile()` operation returns an `PNDeleteFileResult` which contains the following fields:

Property NameTypeDescription`status`IntReturns a status code.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFileMessage` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`$pubnub.publishFileMessage()  
    ->channel(string)  
    ->fileId(string)  
    ->fileName(string)  
    ->message(string|array)  
    ->meta(string|array)  
    ->shouldStore(Boolean)  
    ->ttl(Int)  
    ->customMessageType(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aName of `channel` to publish file message.`file_id` *Type: StringDefault:  
n/aUnique identifier of the file.`file_name` *Type: StringDefault:  
n/aName of the file.`message`Type: DictionaryDefault:  
n/aThe payload.`meta`Type: DictionaryDefault:  
n/aMeta data object which can be used with the filtering ability.`should_store`Type: BooleanDefault:  
`True`Set to `False` to *not* store this message in history. By default, messages are stored according to the retention policy you set on your key.`ttl`Type: IntDefault:  
`0`How long the message should be stored in the channel's history. If not specified, defaults to the key set's retention value.`customMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-5)

```
`pubnub.publishFileMessage()  
    ->message("Hey, this is the requested file.")  
    ->channel("channel_1")  
    ->fileId("p1n4ppl3p1zz4")  
    ->fileName("pinapplePizza.jpg")  
    ->customMessageType("file-message")  
    ->sync();  
`
```

### Returns[​](#returns-5)

The `publish_file_message()` operation returns an `PNPublishFileMessageResult` which contains the following fields:

#### PNPublishFileMessageResult[​](#pnpublishfilemessageresult)

The `publishFileMessage()` operation returns a `PNPublishFileMessageResult` which contains the following property:

Property NameTypeDescription`timestamp`stringThe timetoken when the message was published.Last updated on **Apr 2, 2025**