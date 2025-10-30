# File Sharing API for Swift Native SDK

Upload and share files up to 5 MB per file on PubNub. When a file is uploaded to a channel, subscribers receive a file event with file ID, filename, and optional description.

## Send file

Uploads a file to storage and publishes a file message to the channel. Internally calls publish to announce the uploaded file with identifier and name.

##### File encryption

Uses the cryptoModule set in PubNub config unless overridden via the custom parameter. See Crypto module configuration.

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

- content
  - Type: PubNub.FileUploadContent
  - Default: n/a
  - The content to be uploaded.
- channel
  - Type: String
  - Default: n/a
  - Target channel.
- remoteFilename
  - Type: String
  - Default: nil
  - Name to assign to the uploaded content.
- publishRequest
  - Type: PubNub.PublishFileRequest
  - Default: PubNub.PublishFileRequest()
  - Request configuration for publishing the file message.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration
  - Overrides for generating the File Upload URLRequest.
- uploadTask
  - Type: (HTTPFileUploadTask) -> Void
  - Default: { _ in }
  - Provides the running upload task (with URLSessionUploadTask reference).
- completion
  - Type: ((Result<(task: HTTPFileUploadTask, file: PubNubFile, publishedAt: Timetoken), Error>) -> Void)?
  - Default: n/a
  - Result of the operation.

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

completion returns Result.

#### Success

Tuple of HTTPFileUploadTask, the uploaded PubNubFile or PubNubLocalFile, and the Timetoken.

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

#### Failure

An Error describing the failure.

### Sample code

```
1
  
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

- channel
  - Type: String
  - Default: n/a
  - Channel to list files from.
- limit
  - Type: UInt
  - Default: 100
  - 1–100.
- next
  - Type: String?
  - Default: nil
  - Forward pagination cursor returned by server.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Overrides for generating the File Upload URLRequest.
- completion
  - Type: ((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?
  - Default: n/a
  - Result of the operation.

### Returns

completion returns Result.

#### Success

Tuple: array of PubNubFile and next page token (if any).

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

#### Failure

An Error describing the failure.

### Sample code

```
1
  
```

## Get file URL

Generate a URL to download a file from the channel.

### Method(s)

```
`1func generateFileDownloadURL(  
2    channel: String,  
3    fileId: String,  
4    filename: String  
5) throws -> URL  
`
```

- channel
  - Type: String
  - Name of channel the file was uploaded to.
- fileID
  - Type: String
  - Unique file identifier assigned during upload.
- filename
  - Type: String
  - Stored filename.

### Returns

Download URL.

### Sample code

```
1
  
```

## Download file

Download a file from a channel.

##### File encryption

If cryptoModule is set in PubNub config, it will be used for decryption. See Crypto module configuration.

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

- file
  - Type: PubNubFile
  - Default: n/a
  - File to download.
- toFileURL
  - Type: URL
  - Default: n/a
  - Local destination path (not the generateFileDownloadURL result).
- resumeData
  - Type: Data?
  - Default: nil
  - Data needed to resume a download.
- downloadTask
  - Type: (HTTPFileDownloadTask) -> Void
  - Default: { _ in }
  - Provides the running download task (URLSessionDownloadTask reference).
- completion
  - Type: ((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?
  - Default: n/a
  - Result of the operation.

### Returns

completion returns Result.

#### Success

Tuple of HTTPFileDownloadTask and the downloaded PubNubLocalFile. fileURL may differ from toFileURL if a file already exists at the destination.

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

#### Failure

An Error describing the failure.

### Sample code

```
1
  
```

#### Resume download

Downloads can be paused and resumed under certain conditions (see Apple docs). If you have resumeData, you can attempt to resume; otherwise start a new download.

```
1
  
```

#### Custom URLSession

By default, a background URLSession is used so downloads continue when the app is not foregrounded. See Apple’s Downloading Files in the Background.

```
1
  
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

- fileId
  - Type: String
  - Default: n/a
  - Unique file identifier assigned during upload.
- filename
  - Type: String
  - Default: n/a
  - Stored filename.
- channel
  - Type: String
  - Default: n/a
  - Channel the file was sent to.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Overrides for generating the File Download URLRequest.
- completion
  - Type: ((Result<(channel: String, fileId: String), Error>) -> Void)?
  - Default: n/a
  - Result of the operation.

### Returns

completion returns Result.

#### Success

Tuple of channel and fileId of the removed file.

#### Failure

An Error describing the failure.

### Sample code

```
1
  
```

## Publish file message

Publish the uploaded file message to a channel. Called internally by send. Use directly if send fails after upload to re-publish the file message without re-uploading.

### Method(s)

```
`1func publish(  
2    file: PubNubFile,  
3    request: PublishFileRequest,  
4    completion: ((ResultTimetoken, Error>) -> Void)?  
5)  
`
```

- file
  - Type: PubNubFile
  - Default: n/a
  - The uploaded file reference.
- request
  - Type: PubNub.PublishFileRequest
  - Default: n/a
  - Additional info to include with the file publish.
- completion
  - Type: ((Result<Timetoken, Error>) -> Void)?
  - Default: n/a
  - Result of the operation.

#### PubNub.PublishFileRequest

- additionalMessage
  - Type: JSONCodable?
  - Default: nil
  - Optional message included with the file info.
- customMessageType
  - Type: String?
  - Default: n/a
  - Case-sensitive, alphanumeric 3–50 chars; dashes and underscores allowed; cannot start with special chars or pn_/pn-.
  - Examples: text, action, poll.
- store
  - Type: Bool?
  - Default: nil
  - If true, message is stored in history.
- ttl
  - Type: Int?
  - Default: nil
  - Time to live in storage (per message).
- meta
  - Type: JSONCodable?
  - Default: nil
  - Additional metadata to publish with the file.
- customRequestConfig
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration?
  - Request-level overrides.

### Returns

completion returns Result.

#### Success

Timetoken of the published message.

#### Failure

An Error describing the failure.

### Sample code

```
1
**
```

Last updated on Sep 3, 2025**