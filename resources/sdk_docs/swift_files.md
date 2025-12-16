# File Sharing API for Swift Native SDK

Upload/share files up to **5 MB** on PubNub. Uploading a file on a `channel` stores it via a storage service tied to your keys; subscribers receive a file event containing file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Uploads a file to a channel (prepare → upload to storage → publish file message on channel). The final step uses [`publish`](#publish-file-message) internally.

##### File encryption

The `cryptoModule` set in PubNub config is used for encryption unless overridden using the `custom` parameter.  
For more info: [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods)

```
`1func send(  
2    _ content: FileUploadContent,  
3    channel: String,  
4    remoteFilename: String,  
5    publishRequest: PubNub.PublishFileRequest = PubNub.PublishFileRequest(),  
6    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
7    uploadTask: @escaping (HTTPFileUploadTask) -> Void,  
8    completion: ((Result(task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken), Error>) -> Void)?  
9)  
`
```

* `content` *(PubNub.FileUploadContent, required)*: content to upload.  
* `channel` *(String, required)*: channel to upload to.  
* `remoteFilename` *(String)*: name used when uploaded.  
* `publishRequest` *(PubNub.PublishFileRequest, default `PubNub.PublishFileRequest()`)*: publish-time options for the file message.  
* `custom requestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`)*: overrides for the upload `URLRequest`.  
* `uploadTask` *((HTTPFileUploadTask) -> Void)*: provides the active upload task (`URLSessionUploadTask`).  
* `completion` *((Result<(task: HTTPFileUploadTask, file: PubNubFile, publishedAt: Timetoken), Error>) -> Void)?*: async result.

#### Details[​](#details)

```
1/// Content that can be uploaded as a File to PubNub  
2enum FileUploadContent: CustomStringConvertible, CustomDebugStringConvertible {  
3
  
4  /// A URL to an existing file  
5  case file(url: URL)  
6
  
7  /// The raw content of a file and the content type that best describes it  
8  case data(_ data: Data, contentType: String?)  
9
  
10  /// A stream of data, the content type of that stream, and the total length of the stream in bytes  
11  case stream(_ stream: InputStream, contentType: String?, contentLength: Int)  
12}  
13
  
14/// Additional information that can be sent during a File publish  
15struct PublishFileRequest {  
16
  
17  /// The optional message that will be include alongside the File information  
18  public var additionalMessage: JSONCodable?  
19
  
20  /// A user-provided custom message type  
21  public var customMessageType: String?  
22
  
23  /// A user-provided custom message type. If true the published message is stored in history.  
24  public var store: Bool?  
25
  
26  /// Set a per message time to live in storage.  
27  public var ttl: Int?  
28
  
29  /// Additional metadata to publish alongside the file  
30  public var meta: JSONCodable?  
31
  
32  /// Custom configuration overrides for this request  
33  public var customRequestConfig: RequestConfiguration  
34}  
35
  
36/// The uploadTask handler will respond with an instance of HTTPFileUploadTask  
37class HTTPFileUploadTask {  
38
  
39  /// The underlying URLSessionTask that is being processed  
40  var urlSessionTask: URLSessionTask { get }  
41
  
42  /// A representation of the overall task progress  
43  var progress: Progress { get }  
44
  
45  /// The background identifier of the URLSession that is processing this task  
46  var sessionIdentifier: String? { get }  
47
  
48  // An error object that indicates why the task failed  
49  var error: Error? { get }  
50
  
51  // The server's response to the currently active request  
52  var response: HTTPURLResponse? { get }  
53
  
54  // The body of the response  
55  var responseData: Data? { get }  
56}  

```

### Returns[​](#returns)

`completion` returns a `Result`.

#### Success[​](#success)

Tuple: completed `HTTPFileUploadTask`, uploaded `PubNubFile`/`PubNubLocalFile`, and publish `Timetoken`.

```
1protocol PubNubLocalFile {  
2
  
3  /// The local URL of the file  
4  var fileURL: URL { get set }  
5
  
6  /// If the local filenames change this can be used to track the remote filename  
7  var remoteFilename: String { get }  
8
  
9  /// The channel the file is associated with  
10  var channel: String { get }  
11
  
12  /// PubNub-generated ID for a file  
13  var fileId: String { get }  
14
  
15  /// User defined name for a file  
16  var filename: String { get }  
17
  
18  /// Size, in bytes, of the stored file  
19  var size: Int64 { get }  
20
  
21  /// The MIME Type of the file  
22  var contentType: String { get }  
23
  
24  /// ISO 8601 date and time the file was uploaded  
25  var createdDate: Date? { get set }  
26
  
27  /// Custom payload that can be used to store additional file details  
28  var custom: JSONCodable? { get set }  
29}  

```

#### Failure[​](#failure)

`Error`.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

## List channel files[​](#list-channel-files)

List files uploaded to a `channel` (supports forward pagination via `next`).

### Method(s)[​](#methods-1)

```
`1func listFiles(  
2    channel: String,  
3    limit: UInt = 100,  
4    next: String? = nil,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((Result(files: [PubNubFile], next: String?), Error>) -> Void)?  
7)  
`
```

* `channel` *(String, required)*: channel to list files for.  
* `limit` *(UInt, default 100)*: min 1, max 100.  
* `next` *(String?, default `nil`)*: server-provided cursor for forward pagination.  
* `custom requestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`)*: request overrides.  
* `completion` *((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?*: async result.

### Returns[​](#returns-1)

`completion` returns a `Result`.

#### Success[​](#success-1)

Tuple: `[PubNubFile]` and `next` cursor (if present).

```
1protocol PubNubFile {  
2
  
3  /// The channel the file is associated with  
4  var channel: String { get }  
5
  
6  /// PubNub-generated ID for a file  
7  var fileId: String { get }  
8
  
9  /// User defined name for a file  
10  var filename: String { get }  
11
  
12  /// Size, in bytes, of the stored file  
13  var size: Int64 { get }  
14
  
15  /// The MIME Type of the file  
16  var contentType: String { get }  
17
  
18  /// ISO 8601 date and time the file was uploaded  
19  var createdDate: Date? { get set }  
20
  
21  /// Custom payload that can be used to store additional file details  
22  var custom: JSONCodable? { get set }  
23}  

```

#### Failure[​](#failure-1)

`Error`.

### Sample code[​](#sample-code-1)

```
1
  

```

## Get file URL[​](#get-file-url)

Generate a download URL for a file on a `channel`.

### Method(s)[​](#methods-2)

```
`1func generateFileDownloadURL(  
2    channel: String,  
3    fileId: String,  
4    filename: String  
5) throws -> URL  
`
```

* `channel` *(String, required)*: channel where file was uploaded.  
* `fileID` *(String, required)*: unique file identifier assigned during upload.  
* `filename` *(String, required)*: stored filename.

### Returns[​](#returns-2)

A downloadable `URL`.

### Sample code[​](#sample-code-2)

```
1
  

```

## Download file[​](#download-file)

Download a file from a `channel` to a local file URL.

##### File encryption

If `cryptoModule` is set in PubNub config, it is used for decryption.  
For more info: [Crypto module configuration](/docs/sdks/swift/api-reference/configuration#cryptomodule).

### Method(s)[​](#methods-3)

```
`1func download(  
2    file: PubNubFile,  
3    toFileURL localFileURL: URL,  
4    resumeData: Data? = nil,  
5    downloadTask: @escaping (HTTPFileDownloadTask) -> Void,  
6    completion: ((Result(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?  
7)  
`
```

* `file` *(PubNubFile, required)*: file to download.  
* `toFileURL` *(URL, required)*: destination local file URL (**not** the URL from `generateFileDownloadURL`).  
* `resumeData` *(Data?, default `nil`)*: data to resume a previous download.  
* `downloadTask` *((HTTPFileDownloadTask) -> Void)*: provides the active download task (`URLSessionDownloadTask`).  
* `completion` *((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?*: async result.

### Returns[​](#returns-3)

`completion` returns a `Result`.

#### Success[​](#success-2)

Tuple: completed `HTTPFileDownloadTask` and downloaded `PubNubLocalFile`. `fileURL` may differ from `toFileURL` if a file already exists at destination.

```
1class HTTPFileDownloadTask {  
2
  
3  /// The underlying URLSessionTask that is being processed  
4  var urlSessionTask: URLSessionTask { get }  
5
  
6  /// A representation of the overall task progress  
7  var progress: Progress { get }  
8
  
9  /// The background identifier of the URLSession that is processing this task  
10  var sessionIdentifier: String? { get }  
11
  
12  /// An error object that indicates why the task failed  
13  var error: Error? { get }  
14
  
15  /// The server's response to the currently active request  
16  var response: HTTPURLResponse? { get  
17
  
18  /// The location where the temporary downloaded file should be copied  
19  var destinationURL: URL { get }  
20}  

```

```
1protocol PubNubLocalFile {  
2
  
3  /// The local URL of the file  
4  var fileURL: URL { get set }  
5
  
6  /// If the local filename changes this can be used to track the remote filename  
7  var remoteFilename: String { get }  
8
  
9  /// The channel the file is associated with  
10  var channel: String { get }  
11
  
12  /// PubNub-generated ID for a file  
13  var fileId: String { get }  
14
  
15  /// User defined name for a file  
16  var filename: String { get }  
17
  
18  /// Size, in bytes, of the stored file  
19  var size: Int64 { get }  
20
  
21  /// The MIME Type of the file  
22  var contentType: String { get }  
23
  
24  /// ISO 8601 date and time the file was uploaded  
25  var createdDate: Date? { get set }  
26
  
27  /// Custom payload that can be used to store additional file details  
28  var custom: JSONCodable? { get set }  
29}  

```

#### Failure[​](#failure-2)

`Error`.

### Sample code[​](#sample-code-3)

```
1
  

```

#### Resume download[​](#resume-download)

Downloads may be paused/resumed (see Apple docs: [Pausing and Resuming Downloads](https://developer.apple.com/documentation/foundation/url_loading_system/pausing_and_resuming_downloads?language=objc), [`cancel(byProducingResumeData:)`](https://developer.apple.com/documentation/foundation/urlsessiondownloadtask/1411634-cancel)). If you have `resumeData`, attempt resumption; otherwise start a new download.

```
1
  

```

#### Custom URLSession[​](#custom-urlsession)

By default, PubNub uses a [background](https://developer.apple.com/documentation/foundation/urlsessionconfiguration/1407496-background) `URLSessionConfiguration` to allow downloads to continue while the app is backgrounded (see Apple: [Downloading Files in the Background](https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background)).

```
1
  

```

## Delete file[​](#delete-file)

Delete a file from a `channel`.

### Method(s)[​](#methods-4)

```
`1func remove(  
2    fileId: String,  
3    filename: String,  
4    channel: String,  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((Result(channel: String, fileId: String), Error>) -> Void)?  
7)  
`
```

* `fileId` *(String, required)*: unique file id assigned during upload.  
* `filename` *(String, required)*: stored filename.  
* `channel` *(String, required)*: channel the file was sent to.  
* `custom requestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration()`)*: request overrides.  
* `completion` *((Result<(channel: String, fileId: String), Error>) -> Void)?*: async result.

### Returns[​](#returns-4)

`completion` returns a `Result`.

#### Success[​](#success-3)

Tuple: `channel` and removed `fileId`.

#### Failure[​](#failure-3)

`Error`.

### Sample code[​](#sample-code-4)

```
1
  

```

## Publish file message[​](#publish-file-message)

Publish the message announcing an already-uploaded file to a channel. Called internally by [`send`](#send-file). Use directly when upload succeeded but publish failed (error with `status.operation === PNPublishFileMessageOperation`) to retry without re-uploading.

### Method(s)[​](#methods-5)

```
`1func publish(  
2    file: PubNubFile,  
3    request: PublishFileRequest,  
4    completion: ((ResultTimetoken, Error>) -> Void)?  
5)  
`
```

* `file` *(PubNubFile, required)*: uploaded file reference.  
* `request` *(PubNub.PublishFileRequest, required)*: publish options.  
* `completion` *((Result<Timetoken, Error>) -> Void)?*: async result.

#### PubNub.PublishFileRequest[​](#pubnubpublishfilerequest)

* `additionalMessage` *(JSONCodable?, default `nil`)*: optional message alongside file info.  
* `customMessageType` *(String?)*: case-sensitive 3–50 chars; alphanumeric plus `-` and `_`; cannot start with special chars or `pn_`/`pn-` (examples: `text`, `action`, `poll`).  
* `store` *(Bool?, default `nil`)*: store in history if true.  
* `ttl` *(Int?, default `nil`)*: per-message TTL in storage.  
* `meta` *(JSONCodable?, default `nil`)*: metadata alongside the file.  
* `customRequestConfig` *(PubNub.RequestConfiguration, default `PubNub.RequestConfiguration?`)*: request overrides.

### Returns[​](#returns-5)

`completion` returns a `Result`.

#### Success[​](#success-4)

Published message `Timetoken`.

#### Failure[​](#failure-4)

`Error`.

### Sample code[​](#sample-code-5)

```
1
**
```