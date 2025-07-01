On this page
# File Sharing API for Unity SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `SendFile` internally calls the [`PublishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`pubnub.SendFile()  
    .Channel(string)  
    .File(string|byte[])  
    .Texture(Texture2D | RenderTexture)  
    .FileName(string)  
    .Ttl(int)  
    .ShouldStore(bool)  
    .Message(string)  
    .Meta(Dictionarystring, object>)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNFileUploadResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: string`Channel` for the file.`File`Type: string or `byte[]`Full path of the file with file name or an array of bytes.   
 When using an array of bytes, you must set `FileName`.`Texture`Type: `Texture2D` or `RenderTexture`An instance of a `Texture` object. When you send a `Texture`, a `Message` with its size and format is added automatically.`FileName`Type: stringName of the file to send. You can use it to override the default file name.`TtL`Type: intHow long message should be stored in channel's storage.`ShouldStore`Type: boolWhether PubNub published file `message` should be stored in `channel` history.`Message`Type: stringMessage which should be sent along with file to specified `channel`.`Meta`Type: Dictionary`<string, object>`Dictionary`<string, object>` with values which should be used by PubNub service to filter file messages.`CustomMessageType`Type: stringA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`Execute` *Type: `System.Action``System.Action` of type `PNFileUploadResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNFileUploadResult>>`.

##### Deprecated parameter

The `CipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/unity/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `CipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class SendFileExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized string for the channel ID  
    [SerializeField] private string channelId = "my_channel";  
  
    // An editor-serialized string for the file path  
    [SerializeField] private string filePath = "cat_picture.jpg";  
  
`
```
show all 43 lines

### Response[​](#response)

```
`{  
    "Timetoken":15957709330808500,  
    "FileId":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    "FileName":"cat_picture.jpg"  
}  
`
```

### Returns[​](#returns)

The `SendFile()` operation returns a `PNResult``<PNFileUploadResult>` which contains the following properties:

Property NameTypeDescription`Result`PNFileUploadResultReturns a `PNFileUploadResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNFileUploadResult` contains the following properties:

Property NameTypeDescription`Timetoken`longReturns a `PNFileUploadResult` object.`FileId`stringReturns the `ID` of the file.`FileName`stringReturns the `name` of the file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pubnub.ListFiles()  
    .Channel(string)  
    .Limit(int)  
    .Next(string)  
    .QueryParam(Dictionarystring, object>)  
    .Execute(System.ActionPNListFilesResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/a`Channel` to get list of files.`Limit`Type: intDefault:  
100Number of files to return.`Next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`QueryParam`Type: Dictionary`<string, object>`Default:  
n/aDictionary `object` to pass name/value pairs as query `string` params with PubNub URL request for debug purpose.`Execute` *Type: `System.Action`Default:  
n/a`System.Action` of type `PNListFilesResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `Task<PNResult<PNListFilesResult>>`.

### Basic Usage[​](#basic-usage-1)

```
`PNResultPNListFilesResult> listFilesResponse = await pubnub.ListFiles()  
    .Channel("my_channel")  
    .ExecuteAsync();  
PNListFilesResult listFilesResult = listFilesResponse.Result;  
PNStatus listFilesStatus = listFilesResponse.Status;  
if (!listFilesStatus.Error && listFilesResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(listFilesResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(listFilesStatus));  
}  
`
```

### Response[​](#response-1)

```
`{  
    "FilesList":[  
    {  
        "Name":"cat_picture.jpg",  
        "Id":"d9515cb7-48a7-41a4-9284-f4bf331bc770",  
        "Size":25778,  
        "Created":"2020-07-26T13:42:06Z"  
    }],  
    "Count":1,  
    "Next":null  
}  
`
```

### Returns[​](#returns-1)

The `ListFiles()` operation returns a `PNResult<PNListFilesResult>` which contains the following properties:

Property NameTypeDescription`Result`PNListFilesResultReturns a `PNListFilesResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNListFilesResult` contains the following properties:

Property NameTypeDescription`FilesList`list`<PNFileResult>``List` of channel files.`Count`intNumber of files returned.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

`PNFileResult` contains the following properties:

Property NameTypeDescription`Name`string`Name` of the file.`Id`string`ID` of the file.`Size`int`Size` of the file.`Created`stringCreate date of the file.

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`pubnub.GetFileUrl()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNFileUrlResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which file with name has been uploaded.`FileId` *Type: stringUnique file identifier which has been assigned during file upload.`FileName` *Type: stringName under which uploaded file is stored for `channel`.`Execute` *Type: `System.Action``System.Action` of type `PNFileUrlResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNFileUrlResult>>`.

### Basic Usage[​](#basic-usage-2)

```
`PNResultPNFileUrlResult> getFileUrlResponse = await pubnub.GetFileUrl()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .ExecuteAsync();  
PNFileUrlResult getFileUrlResult = getFileUrlResponse.Result;  
PNStatus getFileUrlStatus = getFileUrlResponse.Status;  
if (!getFileUrlStatus.Error && getFileUrlResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(getFileUrlResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(getFileUrlStatus));  
}  
`
```

### Response[​](#response-2)

```
`{  
    "Url":"http://ps.pndsn.com/v1/files/demo/channels/my_channel/files/d9515cb7-48a7-41a4-9284-f4bf331bc770/cat_picture.jpg?pnsdk=NET461CSharp4.9.0.0&timestamp=1595771548&uuid=pn-9ce9e988-8e04-40bf-90c4-ebe170478f7d"  
}  
`
```

### Returns[​](#returns-2)

The `GetFileUrl()` operation returns a `PNResult<PNFileUrlResult>` which contains the following properties:

Property NameTypeDescription`Result`PNFileUrlResultReturns a `PNFileUrlResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNFileUrlResult` contains the following properties:

Property NameTypeDescription`Url`string`URL` which can be used to download remote file with specified name and identifier.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`pubnub.DownloadFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNDownloadFileResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which file with name has been uploaded.`FileId` *Type: stringUnique file identifier which has been assigned during file upload.`FileName` *Type: stringName under which uploaded file is stored for `channel`.`Execute` *Type: `System.Action``System.Action` of type `PNDownloadFileResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNDownloadFileResult>>`.

##### Deprecated parameter

The `CipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/unity/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `CipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

```
`PNResultPNDownloadFileResult> fileDownloadResponse = await pubnub.DownloadFile()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .CipherKey("my_cipher_key")  
    .ExecuteAsync();  
PNDownloadFileResult fileDownloadResult = fileDownloadResponse.Result;  
PNStatus fileDownloadStatus = fileDownloadResponse.Status;  
if (!fileDownloadStatus.Error && fileDownloadResult != null)  
{  
    fileDownloadResult.SaveFileToLocal(downloadUrlFileName); //saves to bin folder if no path is provided  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(fileDownloadResult.FileName));  
}  
else  
{  
`
```
show all 17 lines

### Response[​](#response-3)

```
`{  
    //Call fileDownloadResult.SaveFileToLocal() to save file.  
    "FileBytes":"/9j/4AAQSkZJRgABAQEAkACQAAD/4RCERXhpZgAATU0AKgAAAAgABAE7AAIAAAAGAAAISodpAAQAAAABAAAIUJydAAEAAAA...,  
    "FileName":"cat_picture.jpg"  
}  
`
```

### Returns[​](#returns-3)

The `DownloadFile()` operation returns a `PNResult<PNDownloadFileResult>` which contains the following properties:

Property NameTypeDescription`Result`PNDownloadFileResultReturns a `PNDownloadFileResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNDownloadFileResult` contains the following properties:

Property NameTypeDescription`FileBytes`byte[]byte array of the downloaded file. Use SaveFileToLocal method to copy file to local.`FileName`stringName of the downloaded file from channel.`SaveFileToLocal(string)`Provide full destination path to `SaveFileToLocal` for saving the downloaded file locally.

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`pubnub.DeleteFile()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Execute(System.ActionPNDeleteFileResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which file with name needs to be deleted.`FileId` *Type: stringUnique file identifier of the file to be deleted.`FileName` *Type: stringName of the file to be deleted from the `channel`.`Execute` *Type: `System.Action``System.Action` of type `PNDeleteFileResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNDeleteFileResult>>`.

### Basic Usage[​](#basic-usage-4)

```
`PNResultPNDeleteFileResult> deleteFileResponse = await pubnub.DeleteFile()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg")  
    .ExecuteAsync();  
PNDeleteFileResult deleteFileResult = deleteFileResponse.Result;  
PNStatus deleteFileStatus = deleteFileResponse.Status;  
if (!deleteFileStatus.Error && deleteFileResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(deleteFileResult));  
}  
else  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(deleteFileStatus));  
}  
`
```

### Response[​](#response-4)

```
`{}  
`
```

### Returns[​](#returns-4)

The `DeleteFile()` operation returns a `PNResult<PNDeleteFileResult>` which contains the following properties:

Property NameTypeDescription`Result`PNDeleteFileResultReturns a `PNDeleteFileResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNDeleteFileResult` returns empty object

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`SendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `SendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `PublishFileMessage` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`pubnub.PublishFileMessage()  
    .Channel(string)  
    .FileId(string)  
    .FileName(string)  
    .Message(object)  
    .Meta(Dictionarystring, object>)  
    .ShouldStore(bool)  
    .CustomMessageType(string)  
    .Execute(System.ActionPNPublishFileMessageResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/aName of `channel` to publish file message`FileId` *Type: stringDefault:  
n/aUnique file identifier of the file.`FileName` *Type: stringDefault:  
n/aName of the file.`Message`Type: stringDefault:  
n/aThe payload.`Meta`Type: stringDefault:  
n/aMeta data object which can be used with the filtering ability.`ShouldStore`Type: boolDefault:  
`true`Store in `history`.`CustomMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`Execute` *Type: `System.Action`Default:  
n/a`System.Action` of type `PNPublishFileMessageResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `Task<PNResult<PNPublishFileMessageResult>>`.

### Basic Usage[​](#basic-usage-5)

```
`PNResultPNPublishFileMessageResult> publishFileMsgResponse = await pubnub.PublishFileMessage()  
    .Channel("my_channel")  
    .FileId("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .FileName("cat_picture.jpg") //checks the bin folder if no path is provided  
    .Message("This is a sample message")  
    .CustomMessageType("file-message")  
    .ExecuteAsync();  
PNPublishFileMessageResult publishFileMsgResult = publishFileMsgResponse.Result;  
PNStatus publishFileMsgStatus = publishFileMsgResponse.Status;  
if (!publishFileMsgStatus.Error && publishFileMsgResult != null)  
{  
    Debug.Log(pubnub.JsonPluggableLibrary.SerializeToJsonString(publishFileMsgResult));  
}  
else  
{  
`
```
show all 17 lines

### Response[​](#response-5)

```
`{  
    "Timetoken":15957738720237858  
}  
`
```

### Returns[​](#returns-5)

The `PublishFileMessage()` operation returns a `PNResult<PNPublishFileMessageResult>` which contains the following properties:

Property NameTypeDescription`Result`PNPublishFileMessageResultReturns a `PNPublishFileMessageResult` object.`Status`PNStatusReturns a `PNStatus` object.

`PNPublishFileMessageResult` contains the following properties:

Property NameTypeDescription`Timetoken`longReturns a long representation of the timetoken when the `message` was published.Last updated on **May 6, 2025**