# PubNub Swift SDK – File Sharing API (condensed)

Upload, list, download, delete, and publish file events (≤ 5 MB) on a channel.  
If a `cryptoModule` is configured, it is automatically used for encryption/decryption unless overridden.

---

## Send file

Uploads a file and publishes a file-message on the target channel.

```swift
`func send(  
    _ content: FileUploadContent,  
    channel: String,  
    remoteFilename: String,  
    publishRequest: PubNub.PublishFileRequest = PubNub.PublishFileRequest(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    uploadTask: @escaping (HTTPFileUploadTask) -> Void,  
    completion: ((Result(task: HTTPFileUploadTask, file: PubNubLocalFile, publishedAt: Timetoken), Error>) -> Void)?  
)`  
```

Parameters  
• `content` – data, file URL, or stream to upload  
• `channel` – destination channel  
• `remoteFilename` – name to store remotely  
• `publishRequest` – optional publish controls (see below)  
• `custom` – per-request networking overrides  
• `uploadTask` – callback with underlying `URLSessionUploadTask`  
• `completion` – `Result<(task,file,publishedAt)>`

Returns  
`HTTPFileUploadTask`, uploaded `PubNubLocalFile`, publish `Timetoken`, or `Error`.

### Supporting types

```swift
`/// Content that can be uploaded as a File to PubNub
enum FileUploadContent: CustomStringConvertible, CustomDebugStringConvertible {
  case file(url: URL)
  case data(_ data: Data, contentType: String?)
  case stream(_ stream: InputStream, contentType: String?, contentLength: Int)
}

/// Additional information that can be sent during a File publish
struct PublishFileRequest {`
```

```swift
`protocol PubNubLocalFile {
  var fileURL: URL { get set }
  var remoteFilename: String { get }
  var channel: String { get }
  var fileId: String { get }
  /// User defined name for a file`
```

---

## List channel files

```swift
`func listFiles(  
    channel: String,  
    limit: UInt = 100,  
    next: String? = nil,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(files: [PubNubFile], next: String?), Error>) -> Void)?  
)`  
```

Parameters  
• `channel` – target channel  
• `limit` (1–100) – max items per page  
• `next` – pagination token  
• `custom` – networking overrides

Returns  
`([PubNubFile], next)` or `Error`.

```swift
`protocol PubNubFile {
  var channel: String { get }
  var fileId: String { get }
  var filename: String { get }
  var size: Int64 { get }
  var contentType: String? { get }`
```

---

## Get file URL

```swift
`func generateFileDownloadURL(  
    channel: String,  
    fileId: String,  
    filename: String  
) throws -> URL`  
```

Generate a signed, time-limited download URL.

---

## Download file

```swift
`func download(  
    file: PubNubFile,  
    toFileURL localFileURL: URL,  
    resumeData: Data? = nil,  
    downloadTask: @escaping (HTTPFileDownloadTask) -> Void,  
    completion: ((Result(task: HTTPFileDownloadTask, file: PubNubLocalFile), Error>) -> Void)?  
)`  
```

• `file` – file descriptor to download  
• `toFileURL` – local destination  
• `resumeData` – resume token (optional)  
• `downloadTask` – callback with underlying `URLSessionDownloadTask`

Returns  
`HTTPFileDownloadTask`, downloaded `PubNubLocalFile`, or `Error`.

```swift
`class HTTPFileDownloadTask {
  var urlSessionTask: URLSessionTask { get }
  var progress: Progress { get }
  var sessionIdentifier: String? { get }
  var error: Error? { get }`
```

---

## Delete file

```swift
`func remove(  
    fileId: String,  
    filename: String,  
    channel: String,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channel: String, fileId: String), Error>) -> Void)?  
)`  
```

Deletes the file; returns `(channel,fileId)` or `Error`.

---

## Publish file message

(Use when upload already completed; automatically called by `send`.)

```swift
`func publish(  
    file: PubNubFile,  
    request: PublishFileRequest,  
    completion: ((ResultTimetoken, Error>) -> Void)?  
)`  
```

`PublishFileRequest` fields:

• `additionalMessage` – JSON payload  
• `customMessageType` – 3–50 char label (no `pn_`, `pn-`)  
• `store` – history toggle  
• `ttl` – per-message TTL  
• `meta` – JSON metadata  
• `customRequestConfig` – networking overrides

Returns publish `Timetoken` or `Error`.

---

## Empty usage stubs (for reference)

```swift
`  `
```

(Identical empty code blocks kept from original documentation.)

Last updated Jun 12 2025