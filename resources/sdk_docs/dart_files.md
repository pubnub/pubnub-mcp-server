On this page
# File Sharing API for Dart SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFile` internally calls the [`publishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`pubnub.files.sendFile(  
  String channel,   
  String fileName,   
  Listint> file,  
  {dynamic? fileMessage,  
  bool? storeFileMessage,  
  int? fileMessageTtl,  
  String? customMessageType  
  dynamic? fileMessageMeta,  
  Keyset? keyset,  
  String? using}  
)  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`fileName` *Type: `String`Default:  
n/aName of the file.`file` *Type: `List<int>`Default:  
n/aFile content.`fileMessage`Type: `dynamic`Default:  
nullThe file message which published with the file.`storeFileMessage`Type: `bool`Default:  
`true`If `true` the messages are stored in history. If not specified, the history configuration on the key is used.`fileMessageTtl`Type: `int`Default:  
n/aStorage time to live for each message. If `storeFileMessage` is `true`, and `ttl` is set to `0`, the message is stored with no expiry time. If `storeFileMessage` is `true` and `ttl` is `x` (`x` is an Integer value), the message is stored with an expiry time of `x` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal. If `storeFileMessage` is `false`, the `ttl` parameter is ignored. If `ttl` is not specified, then expiration of the message defaults back to the expiry value for the key.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`fileMessageMeta`Type: `dynamic`Default:  
n/aAdditional information about the message which can be used on stream filtering.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/dart/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import 'dart:convert';  
import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // File details  
  String channel = 'my_channel';  
`
```
show all 29 lines

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

The `sendFile()` operation returns a `PublishFileMessageResult` which contains the following properties:

Property NameTypeDescription`timetoken`intA representation of the timetoken when the file was published.`isError`BooleanA flag that describes whether there was an error during upload.`description`StringFile publish operation status description.`fileInfo``FileInfo`Uploaded file information.

`FileInfo` contains the following properties:

Property NameTypeDescription`id`String`id` of the uploaded file.`name`String`name` of the upload file.`url`String`url` of the uploaded file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.files.listFiles(  
  String channel,  
  {int? limit,   
  String? next,   
  Keyset? keyset,   
  String? using}  
)  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`limit`Type: `int`Default:  
n/aThe max number of files that can be returned in the response.`next`Type: `String`Default:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

### Basic usage[​](#basic-usage-1)

```
`var result = await pubnub.files.listFiles('my_channel');  
  
print('There are ${result.count} no. of files uploaded');  
`
```

### Response[​](#response-1)

```
`{  
  "data":[  
      {  
      "name":"cat_picture.jpg",  
      "id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
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

The `listFiles()` operation returns a `ListFilesResult` which contains the following properties:

Property NameTypeDescription`filesDetail``List<FileDetail>`List of files information.`next`StringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`count`intNumber of files returned.

`FileDetail` contains the following properties:

Property NameTypeDescription`name`String`name` of the upload file.`id`String`id` of the uploaded file.`size`int`size` of the uploaded file.`created`StringTime of creation.

## Get File URL[​](#get-file-url)

Generate a URL to be used to download a file from the target `channel`.

### Method(s)[​](#methods-2)

```
`pubnub.files.getFileUrl(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`fileId` *Type: `String`Default:  
n/aID of the file.`fileName` *Type: `String`Default:  
n/aName of the file.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

### Basic usage[​](#basic-usage-2)

```
`var fileURL = pubnub.files.getFileUrl(  
  'my_channel', 'someFileID', 'cat_picture.jpg'  
);  
print('URI to download file is ${fileURL}');  
`
```

### Response[​](#response-2)

```
`https://ps.pndsn.com/v1/files/demo/channels/my_channel/files/someFileId/cat_picture.jpg?pnsdk=PubNub-Dart%2F1.2.0  
`
```

### Returns[​](#returns-2)

The `getFileUrl()` operation returns a `Uri`.

## Download file[​](#download-file)

Download the specified file.

### Method(s)[​](#methods-3)

```
`pubnub.files.downloadFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`fileId` *Type: `String`Default:  
n/aID of the file.`fileName` *Type: `String`Default:  
n/aName of the file.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/dart/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic usage[​](#basic-usage-3)

```
`var result = await pubnub.files.downloadFile(  
  'my_channel', 'someFileID', 'cat_picture.jpg');  
`
```

### Response[​](#response-3)

```
`{  
    "fileContent":   
}  
`
```

### Returns[​](#returns-3)

The `downloadFile()` operation returns a `DownloadFileResult` which contains the following property:

Property NameTypeDescription`fileContent`dynamicList of all bytes of the downloaded file.

## Delete file[​](#delete-file)

Delete a file from the specified channel.

### Method(s)[​](#methods-4)

```
`pubnub.files.deleteFile(  
  String channel,   
  String fileId,   
  String fileName,  
  {Keyset? keyset,   
  String? using})  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`fileId` *Type: `String`Default:  
n/aID of the file.`fileName` *Type: `String`Default:  
n/aName of the file.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.

### Basic usage[​](#basic-usage-4)

```
`await pubnub.files.deleteFile(  
  'my_channel', 'someFileID', 'cat_picture.jpg');  
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

The `deleteFile()` operation returns a `DeleteFileResult`.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFileMessage` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`pubnub.files.publishFileMessage(  
  String channel,   
  FileMessage message,  
  {bool? storeMessage,  
  int? ttl,  
  dynamic? meta,  
  Keyset? keyset,  
  String? using,  
  String? customMessageType})  
`
```

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aChannel to send the file to.`message` *Type: `FileMessage`Default:  
n/aMessage to publish.`storeMessage`Type: `bool`Default:  
`true`If `true` the messages are stored in history. If not specified, the history configuration on the key is used.`ttl`Type: `int`Default:  
n/aStorage time to live for each message. If `storeMessage` is `true`, and `ttl` is set to `0`, the message is stored with no expiry time. If `storeMessage` is `true` and `ttl` is `x` (`x` is an Integer value), the message is stored with an expiry time of `x` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal. If `storeMessage` is `false`, the `ttl` parameter is ignored. If `ttl` is not specified, then expiration of the message defaults back to the expiry value for the key.`meta`Type: `dynamic`Default:  
n/aAdditional information about the message which can be used on stream filtering.`keyset`Type: `Keyset`Default:  
default keysetOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`customMessageType`Type: StringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic usage[​](#basic-usage-5)

```
`var fileInfo = {  
  'id': 'someFileID',  
  'name': 'cat_picture.jpg'  
};  
  
var message = FileMessage(fileInfo, message: 'Look at this photo!');  
var result =  
  await pubnub.files.publishFileMessage('my_channel', message, customMessageType: 'file-message');  
      
print('file message published - timetoken ${result.timetoken}');  
`
```

### Response[​](#response-5)

```
`{  
  "timetoken": 15957709330808500,  
  "status": 200,  
  "file": {  
      "id": "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
      "name": "cat_picture.jpg",  
  }  
}  
`
```

### Returns[​](#returns-5)

The `publishFileMessage()` operation returns a `PNFileUploadResult` which contains the following properties:

Property NameTypeDescription`timetoken`intThe timetoken at which the message was published.`description`Stringresult description e.g 'sent' for successfull publish`isError`Booleanit shows error status of file Message publish operation`fileInfo``FileInfo`file information

`FileInfo` contains the following properties:

Property NameTypeDescription`id`String`id` of the uploaded file.`name`String`name` of the uploaded file.`url`String`url` of the uploaded file.Last updated on **Mar 31, 2025**