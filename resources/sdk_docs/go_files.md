On this page
# File Sharing API for Go SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `SendFile` internally calls the [`PublishFileMessage`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`pn.SendFile().  
    Channel(string).  
    Message(string).  
    Name(string).  
    File(*os.File).  
    TTL(int).  
    ShouldStore(bool).  
    Meta(interface{}).  
    CustomMessageType(string).      
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/aChannel to upload the file.`Message`Type: stringDefault:  
n/aMessage which should be sent along with file to specified `channel`.`File` *Type: *os.FileDefault:  
n/aPointer to the File object`TTL`Type: intDefault:  
n/aHow long message should be stored in channel's storage.`ShouldStore`Type: boolDefault:  
`true`If `true` the published file message will be stored in channel's history.`Meta`Type: interfaceDefault:  
nullMeta data object which can be used with the filtering ability`CustomMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

##### Deprecated parameter

The `CipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `CipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`package main  
  
import (  
	"fmt"  
	"log"  
	"os"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
`
```
show all 49 lines

### Returns[​](#returns)

The `SendFile()` operation returns a type `PNSendFileResponse` which contains the following properties:

Property NameTypeDescription`Data`PNFileDataDetails of type `PNFileData` are [here](#pnfiledata)`Timestamp`int64Returns an `int64` representation of the timetoken when the message was published.

#### PNFileData[​](#pnfiledata)

`PNFileData` contains the following properties:

Property NameTypeDescription`ID`stringReturns the `ID` of the file.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`pn.ListFiles().  
    Channel(string).  
    Limit(int).  
    Next(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/a`Channel` to get list of files.`Limit`Type: intDefault:  
100Number of files to return.`Next`Type: stringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

### Basic Usage[​](#basic-usage-1)

```
`resListFile, statusListFile, errListFile := pn.ListFiles()  
    .Channel("my_channel")  
    .Execute()  
fmt.Println(resListFile, statusListFile, errListFile)  
if resListFile != nil {  
    for _, m := range resListFile.Data {  
        fmt.Println(m.ID, m.Created, m.Name, m.Size)  
    }  
}  
`
```

### Returns[​](#returns-1)

The `ListFiles()` operation returns a type `PNListFilesResponse` which contains the following properties:

Property NameTypeDescription`Data`PNFileInfoDetails of type PNFileData are [here](#pnfileinfo)`Count`intNumber of files returned.`Next`stringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.

#### PNFileInfo[​](#pnfileinfo)

`PNFileInfo` contains the following properties:

Property NameTypeDescription`Name`string`Name` of the file.`Id`string`ID` of the file.`Size`int`Size` of the file.`Created`string`Created` date of the file.

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`pn.GetFileURL().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which `file` with `name` has been uploaded.`ID` *Type: stringUnique file `identifier` which has been assigned during file upload.`Name` *Type: stringName under which the uploaded `file` is stored for the `channel`.

### Basic Usage[​](#basic-usage-2)

```
`resGetFileUrl, statusGetFileUrl, errGetFileUrl := pn.GetFileURL()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(resGetFileUrl, statusGetFileUrl, errGetFileUrl)  
fmt.Println(resGetFileUrl.URL)  
`
```

### Returns[​](#returns-2)

The `GetFileUrl()` operation returns a type `PNGetFileURLResponse` which contains the following properties:

Property NameTypeDescription`Url`string`URL` which can be used to download remote file with specified `name` and `identifier`.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`pn.DownloadFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which `file` with `name` has been uploaded.`ID` *Type: stringUnique `file` identifier which has been assigned during `file` upload.`Name` *Type: stringName under which uploaded `file` is stored for `channel`.

##### Deprecated parameter

The `CipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/go/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `CipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

```
`resDLFile, statusDLFile, errDLFile := pn.DownloadFile()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
if resDLFile != nil {  
    filepathOutput := "cat_picture.jpg"  
    out, _ := os.Create(filepathOutput)  
    _, err := io.Copy(out, resDLFile.File)  
  
    if err != nil {  
        fmt.Println(err)  
    }  
}  
`
```

### Returns[​](#returns-3)

The `DownloadFile()` operation returns a type `PNDownloadFileResponse` which contains the following properties:

Property NameTypeDescription`File``io.Reader`File Reader that can be used to save the `File`.

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`pn.DeleteFile().  
    Channel(string).  
    ID(string).  
    Name(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringName of `channel` within which `file` with `name` needs to be deleted.`ID` *Type: stringUnique `file` identifier of the `file` to be deleted.`Name` *Type: stringName of the `file` to be deleted from the `channel`.

### Basic Usage[​](#basic-usage-4)

```
`_, statusDelFile, errDelFile := pn.DeleteFile()  
    .Channel("my_channel")  
    .ID("d9515cb7-48a7-41a4-9284-f4bf331bc770")  
    .Name("cat_picture.jpg")  
    .Execute()  
fmt.Println(statusDelFile, errDelFile)  
`
```

### Returns[​](#returns-4)

The `DeleteFile()` operation returns a type `PNDeleteFileResponse` which is `nil`.

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`SendFile`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `SendFile` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `PublishFileMessage` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`pn.PublishFileMessage().  
    TTL(int).  
    Meta(interface{}).  
    ShouldStore(bool).  
    Channel(string).  
    Message(PNPublishFileMessage).  
    CustomMessageType(string).  
    Execute()  
`
```

*  requiredParameterDescription`TTL`Type: intDefault:  
n/aHow long message should be stored in channel's storage.`Meta`Type: interfaceDefault:  
n/aMeta data object which can be used with the filtering ability.`ShouldStore`Type: boolDefault:  
`true`Store in `history`.`Channel` *Type: stringDefault:  
n/aName of `channel` to publish file message.`Message` *Type: PNPublishFileMessageDefault:  
n/aThe payload should be of the type `PNPublishFileMessage`.`CustomMessageType`Type: stringDefault:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-5)

```
`m := PNPublishMessage{  
    Text: "Look at this photo!",  
}  
  
file := PNFileInfoForPublish{  
    ID:   "d9515cb7-48a7-41a4-9284-f4bf331bc770",  
    Name: "cat_picture.jpg",  
}  
  
message := PNPublishFileMessage{  
    PNFile:    file,  
    PNMessage: m,  
}  
resPubFile, pubFileResponseStatus, errPubFileResponse := pn.PublishFileMessage()  
    .Channel("my_channel")  
`
```
show all 20 lines

### Returns[​](#returns-5)

The `PublishFileMessage()` operation returns type `PublishFileMessageResponse` which contains the following properties:

Property NameTypeDescription`Timetoken`int64Returns a long representation of the timetoken when the `message` was published.Last updated on **Mar 31, 2025**