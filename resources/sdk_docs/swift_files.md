On this page
# File Sharing API for Swift Native SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `send` internally calls the [`publish`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

##### File encryption

The `cryptoModule` set in PubNub config will be used for encryption unless you overwrite it using the `custom` parameter.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods)

```
`func send(  
    _ content: FileUploadContent,  
    channel: String,  
    remoteFilename: String,  
    publishRequest: PubNub.PublishFileRequest = PubNub.PublishFileRequest(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    uploadTask: @escaping (HTTPFileUploadTask) -> Void,  
    completion: ((Result(task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`content` *Type: `PubNub.FileUploadContent`Default:  
n/aThe content to be uploaded.`channel` *Type: StringDefault:  
n/aThe channel the file should be uploaded to.`remoteFilename` *Type: StringDefault:  
`nil`The name of the content when uploaded.`publishRequest`Type: `PubNub.PublishFileRequest`Default:  
`PubNub.PublishFileRequest()`The request configuration object when the file is published to PubNub.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration`Custom configuration overrides when generating the File Upload `URLRequest`.`uploadTask`Type: `(HTTPFileUploadTask) -> Void`Default:  
`{ _ in }`The file upload task executing the upload; contains a reference to the actual `URLSessionUploadTask`.`completion`Type: `((Result<(task: HTTPFileUploadTask, file: PubNubFile, publishedAt: Timetoken), Error>) -> Void)?`Default:  
n/aThe async `Result`of the method call.

#### Details[​](#details)

```
`/// Content that can be uploaded as a File to PubNub  
enum FileUploadContent: CustomStringConvertible, CustomDebugStringConvertible {  
  
  /// A URL to an existing file  
  case file(url: URL)  
  
  /// The raw content of a file and the content type that best describes it  
  case data(_ data: Data, contentType: String?)  
  
  /// A stream of data, the content type of that stream, and the total length of the stream in bytes  
  case stream(_ stream: InputStream, contentType: String?, contentLength: Int)  
}  
  
/// Additional information that can be sent during a File publish  
struct PublishFileRequest {  
`
```
show all 56 lines

### Returns[​](#returns)

The `completion` handler will respond with a `Result`.

#### Success[​](#success)

A `Tuple` containing the `HTTPFileUploadTask` that completed, the `PubNubFile` or `PubNubLocalFile` that was uploaded, and the `Timetoken` when it was published.

```
`protocol PubNubLocalFile {  
  
  /// The local URL of the file  
  var fileURL: URL { get set }  
  
  /// If the local filenames change this can be used to track the remote filename  
  var remoteFilename: String { get }  
  
  /// The channel the file is associated with  
  var channel: String { get }  
  
  /// PubNub-generated ID for a file  
  var fileId: String { get }  
  
  /// User defined name for a file  
`
```
show all 29 lines

#### Failure[​](#failure)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`func listFiles(  
    channel: String,  
    limit: UInt = 100,  
    next: String? = nil,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(files: [PubNubFile], next: String?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aChannel to get list of files.`limit`Type: `UInt`Default:  
100Number of files to return. Minimum value is 1, and maximum is 100.`next`Type: String?Default:  
`nil`Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`Custom configuration overrides when generating the File Upload `URLRequest`.`completion`Type: `((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?`Default:  
n/aThe async `Result` of the method call.

### Returns[​](#returns-1)

The `completion` handler will respond with a `Result`.

#### Success[​](#success-1)

A `Tuple` list of `PubNubFile` objects, and the next page identifier (if one exists).

```
`protocol PubNubFile {  
  
  /// The channel the file is associated with  
  var channel: String { get }  
  
  /// PubNub-generated ID for a file  
  var fileId: String { get }  
  
  /// User defined name for a file  
  var filename: String { get }  
  
  /// Size, in bytes, of the stored file  
  var size: Int64 { get }  
  
  /// The MIME Type of the file  
`
```
show all 23 lines

#### Failure[​](#failure-1)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`func generateFileDownloadURL(  
    channel: String,  
    fileId: String,  
    filename: String  
) throws -> URL  
`
```

*  requiredParameterDescription`channel` *Type: StringName of `channel` to which the file has been uploaded.`fileID` *Type: StringUnique file identifier which has been assigned during file upload.`filename` *Type: StringName under which the uploaded file is stored.

### Returns[​](#returns-2)

The URL where the file can be downloaded.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

## Download file[​](#download-file)

Download file from specified `Channel`.

##### File encryption

If the `cryptoModule` is set in PubNub config, it will be used for decryption.   
   
 For more information, refer to [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-3)

```
`func download(  
    file: PubNubFile,  
    toFileURL localFileURL: URL,  
    resumeData: Data? = nil,  
    downloadTask: @escaping (HTTPFileDownloadTask) -> Void,  
    completion: ((Result(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`file` *Type: `PubNubFile`Default:  
n/aThe file that should be downloaded.`toFileURL` *Type: URLDefault:  
n/aThe file URL where the file should be downloaded to. This is NOT the URL returned from `generateFileDownloadURL`.`resumeData`Type: `Data?`Default:  
`nil`A data object that provides the data necessary to resume a download.`downloadTask`Type: `(HTTPFileDownloadTask) -> Void`Default:  
`{ _ in }`The file upload task executing the upload; contains a reference to the actual `URLSessionDownloadTask`.`completion`Type: `((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?`Default:  
n/aThe async `Result` of the method call.

### Returns[​](#returns-3)

The `completion` handler will respond with an instance of `Result`.

#### Success[​](#success-2)

A `Tuple` containing the `HTTPFileDownloadTask`that completed and the `PubNubLocalFile` that was downloaded. The `fileURL` of this object might be different from the `toFileURL` in the request if a file already exists at that location.

```
`class HTTPFileDownloadTask {  
  
  /// The underlying URLSessionTask that is being processed  
  var urlSessionTask: URLSessionTask { get }  
  
  /// A representation of the overall task progress  
  var progress: Progress { get }  
  
  /// The background identifier of the URLSession that is processing this task  
  var sessionIdentifier: String? { get }  
  
  /// An error object that indicates why the task failed  
  var error: Error? { get }  
  
  /// The server's response to the currently active request  
`
```
show all 20 lines

```
`protocol PubNubLocalFile {  
  
  /// The local URL of the file  
  var fileURL: URL { get set }  
  
  /// If the local filename changes this can be used to track the remote filename  
  var remoteFilename: String { get }  
  
  /// The channel the file is associated with  
  var channel: String { get }  
  
  /// PubNub-generated ID for a file  
  var fileId: String { get }  
  
  /// User defined name for a file  
`
```
show all 29 lines

#### Failure[​](#failure-2)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-3)

```
`  
`
```

#### Resume Download[​](#resume-download)

Downloads can be paused and resumed at a later time under certain conditions. See [Pausing and Resuming Downloads](https://developer.apple.com/documentation/foundation/url_loading_system/pausing_and_resuming_downloads?language=objc) and [cancel(byProducingResumeData:)](https://developer.apple.com/documentation/foundation/urlsessiondownloadtask/1411634-cancel)

If you were given `resumeData` you can use the following example to try and resume your download; otherwise you can restart a new download.

```
`  
`
```

#### Custom URLSession[​](#custom-urlsession)

By default, the PubNub instance will use a [background](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/1407496-background) configured `URLSession`. This will allow the download to continue while the application is not in the foreground. For more information, see Apple's documentation on [Downloading Files in the Background](https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background)

```
`  
`
```

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`func remove(  
    fileId: String,  
    filename: String,  
    channel: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channel: String, fileId: String), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`fileId` *Type: StringDefault:  
n/aUnique file identifier which has been assigned during file upload.`filename` *Type: StringDefault:  
n/aName under which the uploaded file is stored.`channel` *Type: StringDefault:  
n/aChannel the file was sent to.`custom`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration()`Custom configuration overrides when generating the File Download `URLRequest`.`completion`Type: `((Result<(channel: String, fileId: String), Error>) -> Void)?`Default:  
n/aThe async `Result` of the method call.

### Returns[​](#returns-4)

The `completion` handler will respond with an instance of `Result`.

#### Success[​](#success-3)

A `Tuple` containing the `channel`that completed and the `fileId` of the removed file.

#### Failure[​](#failure-3)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-4)

```
`  
`
```

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`send`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `send` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publish` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`func publish(  
    file: PubNubFile,  
    request: PublishFileRequest,  
    completion: ((ResultTimetoken, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`file` *Type: `PubNubFile`Default:  
n/aThe `PubNubFile` representing the uploaded file.`request` *Type: `PubNub.PublishFileRequest`Default:  
n/aAdditional information that can be sent during a File publish.`completion`Type: `((Result<Timetoken, Error>) -> Void)?`Default:  
n/aThe async `Result` of the method call.

#### PubNub.PublishFileRequest[​](#pubnubpublishfilerequest)

*  requiredParameterDescription`additionalMessage` *Type: `JSONCodable?`Default:  
`nil`The optional message to include alongside the File information.`customMessageType`Type: `String?`Default:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.`store`Type: `Bool?`Default:  
`nil`If true the published message is stored in history.`ttl`Type: `Int?`Default:  
`nil`Set a per message time to live in storage.`meta`Type: `JSONCodable?`Default:  
`nil`Additional metadata to publish alongside the file.`customRequestConfig`Type: `PubNub.RequestConfiguration`Default:  
`PubNub.RequestConfiguration?`Custom configuration overrides for this request.

### Returns[​](#returns-5)

The `completion` handler will respond with an instance of `Result`.

#### Success[​](#success-4)

A `Timetoken` of the published message.

#### Failure[​](#failure-4)

An `Error` describing the failure.

### Basic Usage[​](#basic-usage-5)

```
`**`
```
Last updated on Jun 12, 2025**