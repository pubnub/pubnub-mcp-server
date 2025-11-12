# File Sharing API for Swift Native SDK

Upload and share files up to 5 MB per file. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

## Send file

Uploads a file to a channel, then publishes a file message on that channel with file metadata. Internally calls publish.

File encryption
- Uses the cryptoModule set in PubNub config unless overridden via the custom parameter.
- See: Crypto module configuration (/docs/sdks/swift/api-reference/configuration#cryptomodule)

### Method(s)

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

Parameters
- content (required)  
  Type: PubNub.FileUploadContent  
  The content to upload.
- channel (required)  
  Type: String  
  The channel to upload to.
- remoteFilename (required)  
  Type: String  
  The name of the content when uploaded.
- publishRequest  
  Type: PubNub.PublishFileRequest  
  Default: PubNub.PublishFileRequest()  
  Publish configuration for the file message.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration  
  Overrides for generating the File Upload URLRequest.
- uploadTask  
  Type: (HTTPFileUploadTask) -> Void  
  Default: { _ in }  
  Provides the upload task (references URLSessionUploadTask).
- completion  
  Type: ((Result<(task: HTTPFileUploadTask, file: PubNubFile, publishedAt: Timetoken), Error>) -> Void)?  
  Async result of the call.

#### Details

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

### Returns

- Success: Tuple of HTTPFileUploadTask, PubNubFile or PubNubLocalFile, and Timetoken when published.
- Failure: Error.

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

### Sample code

```

```

## List channel files

Retrieve a list of files uploaded to a channel.

### Method(s)

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

Parameters
- channel (required)  
  Type: String  
  Channel to list files from.
- limit  
  Type: UInt  
  Default: 100  
  Range: 1–100. Number of files to return.
- next  
  Type: String?  
  Default: nil  
  Forward pagination token from previous response.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Overrides for generating the File Upload URLRequest.
- completion  
  Type: ((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?  
  Async result of the call.

### Returns

- Success: Tuple of [PubNubFile] and next page identifier (if any).
- Failure: Error.

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

### Sample code

```

```

## Get file URL

Generate a URL to download a file from the target channel.

### Method(s)

```
`1func generateFileDownloadURL(  
2    channel: String,  
3    fileId: String,  
4    filename: String  
5) throws -> URL  
`
```

Parameters
- channel (required)  
  Type: String  
  Name of channel to which the file was uploaded.
- fileID (required)  
  Type: String  
  Unique file identifier assigned during upload.
- filename (required)  
  Type: String  
  Stored filename.

### Returns

- URL to download the file.

### Sample code

```

```

## Download file

Download a file from a channel.

File encryption
- If cryptoModule is set in PubNub config, it is used for decryption.  
- See: Crypto module configuration (/docs/sdks/swift/api-reference/configuration#cryptomodule)

### Method(s)

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

Parameters
- file (required)  
  Type: PubNubFile  
  The file to download.
- toFileURL (required)  
  Type: URL  
  Destination file URL (not the URL from generateFileDownloadURL).
- resumeData  
  Type: Data?  
  Default: nil  
  Data to resume a paused download.
- downloadTask  
  Type: (HTTPFileDownloadTask) -> Void  
  Default: { _ in }  
  Provides the download task (references URLSessionDownloadTask).
- completion  
  Type: ((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?  
  Async result of the call.

### Returns

- Success: Tuple of HTTPFileDownloadTask and PubNubLocalFile. fileURL may differ from requested toFileURL if a file exists at that location.
- Failure: Error.

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

### Sample code

```

```

#### Resume download

Downloads can be paused and resumed under certain conditions. See:
- Pausing and Resuming Downloads (https://developer.apple.com/documentation/foundation/url_loading_system/pausing_and_resuming_downloads?language=objc)
- cancel(byProducingResumeData:) (https://developer.apple.com/documentation/foundation/urlsessiondownloadtask/1411634-cancel)

If you have resumeData, use it to resume; otherwise start a new download.

```

```

#### Custom URLSession

PubNub uses a background URLSession by default so downloads continue in the background. See Apple documentation on Downloading Files in the Background (https://developer.apple.com/documentation/foundation/url_loading_system/downloading_files_in_the_background)

```

```

## Delete file

Delete a file from a channel.

### Method(s)

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

Parameters
- fileId (required)  
  Type: String  
  Unique file identifier assigned during upload.
- filename (required)  
  Type: String  
  Stored filename.
- channel (required)  
  Type: String  
  Channel the file was sent to.
- custom  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration()  
  Overrides for generating the File Download URLRequest.
- completion  
  Type: ((Result<(channel: String, fileId: String), Error>) -> Void)?  
  Async result of the call.

### Returns

- Success: Tuple of channel and fileId of the removed file.
- Failure: Error.

### Sample code

```

```

## Publish file message

Publishes a file message (containing file ID and filename) on a channel. Called internally by send; useful to retry publishing if send fails after upload.

You can call this directly when send fails with status.operation === PNPublishFileMessageOperation.

### Method(s)

```
`1func publish(  
2    file: PubNubFile,  
3    request: PublishFileRequest,  
4    completion: ((ResultTimetoken, Error>) -> Void)?  
5)  
`
```

Parameters
- file (required)  
  Type: PubNubFile  
  The uploaded file to publish.
- request (required)  
  Type: PubNub.PublishFileRequest  
  Additional information for file publish.
- completion  
  Type: ((Result<Timetoken, Error>) -> Void)?  
  Async result of the call.

#### PubNub.PublishFileRequest

- additionalMessage  
  Type: JSONCodable?  
  Default: nil  
  Optional message alongside file info.
- customMessageType  
  Type: String?  
  Case-sensitive, 3–50 chars, alphanumeric with - and _. Cannot start with special characters or with pn_ or pn-. Examples: text, action, poll.
- store  
  Type: Bool?  
  Default: nil  
  Store in history if true.
- ttl  
  Type: Int?  
  Default: nil  
  Per-message TTL in storage.
- meta  
  Type: JSONCodable?  
  Default: nil  
  Metadata to publish with the file.
- customRequestConfig  
  Type: PubNub.RequestConfiguration  
  Default: PubNub.RequestConfiguration?  
  Overrides for this request.

### Returns

- Success: Timetoken of the published message.
- Failure: Error.

### Sample code

```
1
**
```

Last updated on Sep 3, 2025**