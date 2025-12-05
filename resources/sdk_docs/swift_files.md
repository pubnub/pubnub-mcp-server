# File Sharing API for Swift Native SDK (Condensed)

Upload and share files up to 5 MB per file on a channel. Subscribers receive file events containing file ID, filename, and optional description.

## Send file

Uploads a file to a channel and publishes a message with file metadata. Internally calls publish.

File encryption
- Uses the cryptoModule set in PubNub config unless overridden via custom in the request.
- See Crypto module configuration.

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
- content (PubNub.FileUploadContent, required): The content to upload.
- channel (String, required): Target channel.
- remoteFilename (String, required): Name to assign to uploaded content.
- publishRequest (PubNub.PublishFileRequest, default: PubNub.PublishFileRequest()): Publish configuration for the file message.
- custom (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration()): Overrides for generating the file upload URLRequest.
- uploadTask ((HTTPFileUploadTask) -> Void, default: { _ in }): Upload task callback with URLSessionUploadTask reference.
- completion (((Result<(task: HTTPFileUploadTask, file: PubNubFile, publishedAt: Timetoken), Error>) -> Void)?, required): Async result callback.

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

Completion returns Result.

Success
- Tuple: (task: HTTPFileUploadTask, file: PubNubFile or PubNubLocalFile, publishedAt: Timetoken).

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

Failure
- Error describing the failure.

### Sample code

##### Reference code

```
1
  

```

## List channel files

Retrieve a paginated list of files uploaded to a channel.

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
- channel (String, required): Channel to list files from.
- limit (UInt, default: 100): Number of files to return (1–100).
- next (String?, default: nil): Forward pagination cursor.
- custom (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration()): Overrides for generating the file upload URLRequest.
- completion (((Result<(files: [PubNubFile], next: String?), Error>) -> Void)?, required): Async result callback.

### Returns

Completion returns Result.

Success
- Tuple: (files: [PubNubFile], next: String?)

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

Failure
- Error describing the failure.

### Sample code

```
1
  

```

## Get file URL

Generate a direct download URL for a file in a channel.

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
- channel (String, required): Channel name.
- fileID (String, required): File identifier assigned during upload.
- filename (String, required): Stored filename.

### Returns

- URL for downloading the file.

### Sample code

```
1
  

```

## Download file

Download a file from a channel to a local destination.

File encryption
- Decryption uses cryptoModule from PubNub config if set. See Crypto module configuration.

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
- file (PubNubFile, required): File descriptor to download.
- toFileURL (URL, required): Local destination URL (not the generated download URL).
- resumeData (Data?, default: nil): Data used to resume a paused download.
- downloadTask ((HTTPFileDownloadTask) -> Void, default: { _ in }): Download task callback with URLSessionDownloadTask reference.
- completion (((Result<(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?, required): Async result callback.

### Returns

Completion returns Result.

Success
- Tuple: (task: HTTPFileDownloadTask, file: PubNubLocalFile). fileURL may differ from requested destination if a file already exists there.

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

Failure
- Error describing the failure.

### Sample code

```
1
  

```

#### Resume download

- Downloads can be paused/resumed under certain conditions. See Apple docs: Pausing and Resuming Downloads and cancel(byProducingResumeData:).
- Use resumeData to resume; otherwise, start a new download.

```
1
  

```

#### Custom URLSession

- PubNub uses a background URLSession by default, allowing downloads to proceed in background. See Apple docs: Downloading Files in the Background.

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

Parameters
- fileId (String, required): Unique file identifier.
- filename (String, required): Stored filename.
- channel (String, required): Channel of the file.
- custom (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration()): Overrides for generating the file download URLRequest.
- completion (((Result<(channel: String, fileId: String), Error>) -> Void)?, required): Async result callback.

### Returns

Completion returns Result.

Success
- Tuple: (channel: String, fileId: String)

Failure
- Error describing the failure.

### Sample code

```
1
  

```

## Publish file message

Publishes a message to a channel for an already-uploaded file. Called internally by send. Use directly if send fails after upload to publish metadata without re-uploading.

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
- file (PubNubFile, required): The uploaded file descriptor.
- request (PubNub.PublishFileRequest, required): Additional publish info.
- completion (((Result<Timetoken, Error>) -> Void)?, required): Async result callback.

#### PubNub.PublishFileRequest

- additionalMessage (JSONCodable?, default: nil): Optional message to include.
- customMessageType (String?, required range/format): 3–50 chars; alphanumeric; dashes and underscores allowed; cannot start with special characters or pn_/pn- (examples: text, action, poll).
- store (Bool?, default: nil): Store message in history if true.
- ttl (Int?, default: nil): Per-message TTL.
- meta (JSONCodable?, default: nil): Additional metadata.
- customRequestConfig (PubNub.RequestConfiguration, default: PubNub.RequestConfiguration?): Request overrides.

### Returns

Completion returns Result.

Success
- Timetoken of the published message.

Failure
- Error describing the failure.

### Sample code

```
1
**
```