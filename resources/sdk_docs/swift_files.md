# File Sharing API – Swift SDK (Condensed)

Supports uploading, listing, downloading, deleting, and publishing files (≤ 5 MB) on a PubNub channel.  
If `cryptoModule` is set in `PubNub.Configuration`, encryption/decryption is automatic (override with the `custom` parameter).

---

## Send file

Uploads a file and automatically publishes a file-message on the channel.

```swift
func send(
    _ content: FileUploadContent,
    channel: String,
    remoteFilename: String,
    publishRequest: PubNub.PublishFileRequest = PubNub.PublishFileRequest(),
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    uploadTask: @escaping (HTTPFileUploadTask) -> Void,
    completion: ((Result<(task: HTTPFileUploadTask,
                           file: PubNubLocalFile,
                           publishedAt: Timetoken), Error>) -> Void)?
)
```

Parameters  
• `content`: `FileUploadContent` (file, data, or stream)  
• `channel`: target channel  
• `remoteFilename`: filename in storage  
• `publishRequest`: `PublishFileRequest` options (see below)  
• `custom`: per-request overrides  
• `uploadTask`: callback with `HTTPFileUploadTask`  
• `completion`: async result

```swift
enum FileUploadContent {
  case file(url: URL)
  case data(_ data: Data, contentType: String?)
  case stream(_ stream: InputStream, contentType: String?, contentLength: Int)
}
```

Success → `(task, file, publishedAt)`  
Failure → `Error`

---

## List channel files

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
• `channel` (required)  
• `limit`: 1…100 (default 100)  
• `next`: pagination token  
• `custom`, `completion` as above

Success → `(files, next)`  
Failure → `Error`

---

## Get file URL

```swift
func generateFileDownloadURL(
    channel: String,
    fileId: String,
    filename: String
) throws -> URL
```

Returns a signed URL for direct download.

---

## Download file

```swift
func download(
    file: PubNubFile,
    toFileURL localFileURL: URL,
    resumeData: Data? = nil,
    downloadTask: @escaping (HTTPFileDownloadTask) -> Void,
    completion: ((Result<(task: HTTPFileDownloadTask,
                           file: PubNubLocalFile), Error>) -> Void)?
)
```

Parameters  
• `file`: file to download  
• `toFileURL`: destination path  
• `resumeData`: resume info (optional)  
• `downloadTask`, `completion` as above

Success → `(task, file)`  
Failure → `Error`

```swift
class HTTPFileDownloadTask {
  var urlSessionTask: URLSessionTask { get }
  var progress: Progress { get }
  var sessionIdentifier: String? { get }
  var error: Error? { get }
  // …
}
```

---

## Delete file

```swift
func remove(
    fileId: String,
    filename: String,
    channel: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(channel: String, fileId: String), Error>) -> Void)?
)
```

Success → `(channel, fileId)`  
Failure → `Error`

---

## Publish file message

Use when upload succeeded but message publish needs to be retried.

```swift
func publish(
    file: PubNubFile,
    request: PublishFileRequest,
    completion: ((Result<Timetoken, Error>) -> Void)?
)
```

### PublishFileRequest

```swift
struct PublishFileRequest {
  var additionalMessage: JSONCodable? = nil
  var customMessageType: String? = nil  // 3–50 alphanumeric, -, _
  var store: Bool? = nil
  var ttl: Int? = nil
  var meta: JSONCodable? = nil
  var customRequestConfig: PubNub.RequestConfiguration? = PubNub.RequestConfiguration()
}
```

---

## Common Protocols

```swift
protocol PubNubFile {
  var channel: String { get }
  var fileId: String { get }
  var filename: String { get }
  var size: Int64 { get }
  var mimeType: String? { get }
  // …
}

protocol PubNubLocalFile {
  var fileURL: URL { get set }
  var remoteFilename: String { get }
  var channel: String { get }
  var fileId: String { get }
  var filename: String { get }
  // …
}
```

---

Last updated Jul 15 2025