# File Sharing API for Swift Native SDK

Upload and share files up to 5 MB per file. When uploaded to a channel, subscribers receive a file event containing file ID, filename, and optional description.

## Send file

Uploads a file to storage and publishes a file message on the channel. Internally calls publish.

File encryption
- Uses the cryptoModule from PubNub configuration unless overridden via the custom parameter.

### Method(s)

```swift
func send(
  _ content: PubNub.FileUploadContent,
  channel: String,
  remoteFilename: String,
  publishRequest: PubNub.PublishFileRequest = PubNub.PublishFileRequest(),
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  uploadTask: @escaping (HTTPFileUploadTask) -> Void,
  completion: ((Result<(task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken), Error>) -> Void)?
)
```

Parameters
- content (required)  
  Type: PubNub.FileUploadContent  
  The content to upload.
- channel (required)  
  Type: String  
  Target channel.
- remoteFilename  
  Type: String  
  Default: nil  
  Name to assign to the uploaded content.
- publishRequest  
  Type: PubNub.PublishFileRequest  
  Default: PubNub.PublishFileRequest()  
  Publish configuration for the file message.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Overrides for generating the upload URLRequest.
- uploadTask  
  Type: (HTTPFileUploadTask) -> Void  
  Default: { _ in }  
  Receives the executing upload task (wraps URLSessionUploadTask).
- completion  
  Type: ((Result<(task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken), Error>) -> Void)?  
  Completion with result.

#### Details

```swift
/// Content that can be uploaded as a File to PubNub
enum FileUploadContent: CustomStringConvertible, CustomDebugStringConvertible {
  /// A URL to an existing file
  case file(url: URL)

  /// The raw content of a file and the content type that best describes it
  case data(_ data: Data, contentType: String?)

  /// A stream of data, the content type of that stream, and the total length of the stream in bytes
  case stream(_ stream: InputStream, contentType: String?, contentLength: Int)
}
```

```swift
/// Additional information that can be sent during a File publish
struct PublishFileRequest {
  /// The optional message that will be include alongside the File information
  public var additionalMessage: JSONCodable?

  /// A user-provided custom message type
  public var customMessageType: String?

  /// A user-provided custom message type. If true the published message is stored in history.
  public var store: Bool?

  /// Set a per message time to live in storage.
  public var ttl: Int?

  /// Additional metadata to publish alongside the file
  public var meta: JSONCodable?

  /// Custom configuration overrides for this request
  public var customRequestConfig: RequestConfiguration
}
```

```swift
/// The uploadTask handler will respond with an instance of HTTPFileUploadTask
class HTTPFileUploadTask {
  /// The underlying URLSessionTask that is being processed
  var urlSessionTask: URLSessionTask { get }

  /// A representation of the overall task progress
  var progress: Progress { get }

  /// The background identifier of the URLSession that is processing this task
  var sessionIdentifier: String? { get }

  // An error object that indicates why the task failed
  var error: Error? { get }

  // The server's response to the currently active request
  var response: HTTPURLResponse? { get }

  // The body of the response
  var responseData: Data? { get }
}
```

### Returns

- Success: tuple (task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken).

```swift
protocol PubNubLocalFile {
  /// The local URL of the file
  var fileURL: URL { get set }

  /// If the local filenames change this can be used to track the remote filename
  var remoteFilename: String { get }

  /// The channel the file is associated with
  var channel: String { get }

  /// PubNub-generated ID for a file
  var fileId: String { get }

  /// User defined name for a file
  var filename: String { get }

  /// Size, in bytes, of the stored file
  var size: Int64 { get }

  /// The MIME Type of the file
  var contentType: String { get }

  /// ISO 8601 date and time the file was uploaded
  var createdDate: Date? { get set }

  /// Custom payload that can be used to store additional file details
  var custom: JSONCodable? { get set }
}
```

- Failure: Error

## List channel files

Retrieve files uploaded to a channel.

### Method(s)

```swift
func listFiles(
  channel: String,
  limit: UInt = 100,
  next: String? = nil,
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?
)
```

Parameters
- channel (required)  
  Type: String  
  Channel to list files from.
- limit  
  Type: UInt  
  Default: 100 (min 1, max 100)  
  Number of files to return.
- next  
  Type: String?  
  Default: nil  
  Pagination cursor for next page.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Overrides for generating the URLRequest.
- completion  
  Type: ((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?  
  Completion with result.

### Returns

- Success: tuple (files: [PubNubFile], next: String?)

```swift
protocol PubNubFile {
  /// The channel the file is associated with
  var channel: String { get }

  /// PubNub-generated ID for a file
  var fileId: String { get }

  /// User defined name for a file
  var filename: String { get }

  /// Size, in bytes, of the stored file
  var size: Int64 { get }

  /// The MIME Type of the file
  var contentType: String { get }

  /// ISO 8601 date and time the file was uploaded
  var createdDate: Date? { get set }

  /// Custom payload that can be used to store additional file details
  var custom: JSONCodable? { get set }
}
```

- Failure: Error

## Get file URL

Generate a URL to download a file from the target channel.

### Method(s)

```swift
func generateFileDownloadURL(
  channel: String,
  fileId: String,
  filename: String
) throws -> URL
```

Parameters
- channel (required)  
  Type: String  
  Channel where file was uploaded.
- fileId (required)  
  Type: String  
  Unique file identifier assigned during upload.
- filename (required)  
  Type: String  
  Stored filename.

### Returns

- URL for downloading the file.

## Download file

Download a file from a channel.

File encryption
- If cryptoModule is set, it is used for decryption.

### Method(s)

```swift
func download(
  file: PubNubFile,
  toFileURL localFileURL: URL,
  resumeData: Data? = nil,
  downloadTask: @escaping (HTTPFileDownloadTask) -> Void,
  completion: ((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?
)
```

Parameters
- file (required)  
  Type: PubNubFile  
  File to download.
- toFileURL (required)  
  Type: URL  
  Destination file URL (not the pre-signed download URL).
- resumeData  
  Type: Data?  
  Default: nil  
  Data used to resume a paused download.
- downloadTask  
  Type: (HTTPFileDownloadTask) -> Void  
  Default: { _ in }  
  Receives the executing download task (wraps URLSessionDownloadTask).
- completion  
  Type: ((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?  
  Completion with result.

### Returns

- Success: tuple (task: HTTPFileDownloadTask, file: PubNubLocalFile). file.fileURL may differ from toFileURL if a file exists at destination.
- Failure: Error

```swift
class HTTPFileDownloadTask {
  /// The underlying URLSessionTask that is being processed
  var urlSessionTask: URLSessionTask { get }

  /// A representation of the overall task progress
  var progress: Progress { get }

  /// The background identifier of the URLSession that is processing this task
  var sessionIdentifier: String? { get }

  /// An error object that indicates why the task failed
  var error: Error? { get }

  /// The server's response to the currently active request
  var response: HTTPURLResponse? { get }

  /// The location where the temporary downloaded file should be copied
  var destinationURL: URL { get }
}
```

```swift
protocol PubNubLocalFile {
  /// The local URL of the file
  var fileURL: URL { get set }

  /// If the local filename changes this can be used to track the remote filename
  var remoteFilename: String { get }

  /// The channel the file is associated with
  var channel: String { get }

  /// PubNub-generated ID for a file
  var fileId: String { get }

  /// User defined name for a file
  var filename: String { get }

  /// Size, in bytes, of the stored file
  var size: Int64 { get }

  /// The MIME Type of the file
  var contentType: String { get }

  /// ISO 8601 date and time the file was uploaded
  var createdDate: Date? { get set }

  /// Custom payload that can be used to store additional file details
  var custom: JSONCodable? { get set }
}
```

#### Resume download

- Downloads can be paused/resumed if URLSession provides resumeData. See Apple docs for pausing and resuming downloads and cancel(byProducingResumeData:).

#### Custom URLSession

- By default, PubNub uses a background URLSession so downloads continue in background. See Apple docs on Downloading Files in the Background.

## Delete file

Delete a file from a channel.

### Method(s)

```swift
func remove(
  fileId: String,
  filename: String,
  channel: String,
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<(channel: String, fileId: String), Error>) -> Void)?
)
```

Parameters
- fileId (required)  
  Type: String  
  Unique file identifier assigned during upload.
- filename (required)  
  Type: String  
  Stored filename.
- channel (required)  
  Type: String  
  Channel file was sent to.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Overrides for generating the delete URLRequest.
- completion  
  Type: ((Result<(channel: String, fileId: String), Error>) -> Void)?  
  Completion with result.

### Returns

- Success: tuple (channel: String, fileId: String)
- Failure: Error

## Publish file message

Publishes a message about an already uploaded file to a channel. Called by send; use directly to retry message publishing without re-uploading.

### Method(s)

```swift
func publish(
  file: PubNubFile,
  request: PublishFileRequest,
  completion: ((Result<Timetoken, Error>) -> Void)?
)
```

Parameters
- file (required)  
  Type: PubNubFile  
  Represents the uploaded file.
- request (required)  
  Type: PubNub.PublishFileRequest  
  Additional publish details.
- completion  
  Type: ((Result<Timetoken, Error>) -> Void)?  
  Completion with result.

#### PubNub.PublishFileRequest

- additionalMessage  
  Type: JSONCodable?  
  Default: nil  
  Message to include with file info.
- customMessageType  
  Type: String?  
  Case-sensitive, alphanumeric 3–50 chars; dashes and underscores allowed; cannot start with special chars or pn_ / pn-.
- store  
  Type: Bool?  
  Default: nil  
  Store message in history if true.
- ttl  
  Type: Int?  
  Default: nil  
  Per-message TTL in storage.
- meta  
  Type: JSONCodable?  
  Default: nil  
  Additional metadata.
- customRequestConfig  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Request overrides.

### Returns

- Success: Timetoken
- Failure: Error

Last updated on Sep 3, 2025