# File Sharing API – Objective-C SDK

All code blocks, method signatures, parameters, defaults, and examples are preserved. Redundant prose has been removed.

---

## Send file

Upload a file (≤ 5 MB) to a channel and automatically publish its file-info message.

### Method

```
- (void)sendFileWithRequest:(PNSendFileRequest *)request
                 completion:(nullable PNSendFileCompletionBlock)block;
```

* **request** — `PNSendFileRequest`; file + target channel.  
* **block**   — `PNSendFileCompletionBlock`.

### PNSendFileRequest

* `fileMessageMetadata` — `NSDictionary`, metadata for filtering.  
* `fileMessageTTL` — `NSUInteger`, default `0`.  
* `fileMessageStore` — `BOOL`, default `YES`.  
* `message` — `id`, optional accompanying message.  
* `filename` — `NSString`, required.  

**Deprecated:** `cipherKey` (use `cryptoModule` instead).

### Basic Usage

```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// Configuration
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"fileUser"];
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"
                                           randomInitializationVector:YES];

PubNub *client = [PubNub clientWithConfiguration:config];
```
show all 74 lines

### Response

```objective-c
@interface PNSendFileData : PNServiceData

@property (nonatomic, nullable, readonly, strong) NSString *fileIdentifier;
@property (nonatomic, nullable, readonly, strong) NSNumber  *timetoken;
@property (nonatomic, nullable, readonly, strong) NSString *fileName;
/**
 * Whether the file uploaded or not.
 */
```
show all 28 lines

### Other Examples

#### Upload binary data

```objective-c
NSData *data = [[NSUUID UUID].UUIDString dataUsingEncoding:NSUTF8StringEncoding];
PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"
                                                          fileName:@"cat_picture.jpg"
                                                              data:data];

[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {
    if (!status.isError) {
        // status.data.fileIdentifier / fileName
    } else {
        …
    }
}];
```
show all 23 lines

#### Upload using stream

```objective-c
NSInputStream *stream = …;
NSUInteger streamSize = /* size of data in stream */;
PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"
                                                          fileName:@"image.png"
                                                            stream:stream
                                                              size:streamSize];

[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {
    if (!status.isError) {
        // status.data.fileIdentifier / fileName
    } else {
        …
    }
}];
```
show all 25 lines

---

## List channel files

### Method

```
- (void)listFilesWithRequest:(PNListFilesRequest *)request
                  completion:(PNListFilesCompletionBlock)block;
```

### PNListFilesRequest

* `next`  — `NSString`, forward-pagination cursor.  
* `limit` — `NSUInteger`, default `100`.

### Basic Usage

```objective-c
PNListFilesRequest *request = [PNListFilesRequest requestWithChannel:@"channel"];
request.limit = 20;
request.next  = …;

[self.client listFilesWithRequest:request
                       completion:^(PNListFilesResult *result, PNErrorStatus *status) {
    if (!status.isError) {
        // result.data.files, next, count
    } else {
        …
    }
}];
```
show all 22 lines

### Response

```objective-c
@interface PNListFilesData : PNServiceData
@property (nonatomic, nullable, readonly, strong) NSArray<PNFile *> *files;
@property (nonatomic, nullable, readonly, strong) NSString *next;
@property (nonatomic, readonly, assign) NSUInteger count;
@end
@interface PNListFilesResult : PNResult
```
show all 19 lines

---

## Get File URL

### Method

```
- (nullable NSURL *)downloadURLForFileWithName:(NSString *)name
                                    identifier:(NSString *)identifier
                                     inChannel:(NSString *)channel;
```

### Basic Usage

```objective-c
NSURL *url = [self.client downloadURLForFileWithName:@"user_profile.png"
                                          identifier:@""
                                           inChannel:@"lobby"];
```

---

## Download file

### Method

```
- (void)downloadFileWithRequest:(PNDownloadFileRequest *)request
                     completion:(PNDownloadFileCompletionBlock)block;
```

### PNDownloadFileRequest

* `targetURL` — `NSURL`, optional temp location.

**Deprecated:** `cipherKey` (use `cryptoModule`).

### Basic Usage

```objective-c
PNDownloadFileRequest *request = [PNDownloadFileRequest requestWithChannel:@"lobby"
                                                                identifier:@""
                                                                      name:@"user_profile.png"];
request.targetURL = …;

[self.client downloadFileWithRequest:request
                          completion:^(PNDownloadFileResult *result, PNErrorStatus *status) {
    if (!status.isError) {
        // result.data.location  (temp if result.data.temporary == YES)
    } else {
        …
    }
}];
```
show all 24 lines

### Response

```objective-c
@interface PNDownloadFileData : PNServiceData
@property (nonatomic, readonly, assign, getter=isTemporary) BOOL temporary;
@property (nonatomic, readonly, nullable, strong) NSURL *location;
@end
```
show all 22 lines

---

## Delete file

### Method

```
- (void)deleteFileWithRequest:(PNDeleteFileRequest *)request
                   completion:(nullable PNDeleteFileCompletionBlock)block;
```

### Basic Usage

```objective-c
PNDeleteFileRequest *request = [PNDeleteFileRequest requestWithChannel:@"channel"
                                                            identifier:@""
                                                                  name:@"greetings.txt"];

[self.client deleteFileWithRequest:request completion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) {
        // deleted
    } else {
        // [status retry];
    }
}];
```
show all 16 lines

### Response

```objective-c
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@property (nonatomic, readonly, assign, getter=isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
```
show all 16 lines

---

## Publish file message

Publish the file-info message only (no upload).

### Method

```
- (void)publishFileMessageWithRequest:(PNPublishFileMessageRequest *)request
                           completion:(nullable PNPublishCompletionBlock)block;
```

* **request** — `PNPublishFileMessageRequest`.  
* **block**   — `PNPublishCompletionBlock`.

### PNPublishFileMessageRequest

* `identifier` — `NSString`*  
* `filename`   — `NSString`*  
* `customMessageType` — `NSString`  

Supported `PNBasePublishRequest` fields: `arbitraryQueryParameters`, `preparedMetadata`, `replicate`, `store`, `metadata`, `channel`, `message`, `ttl`, `retried`.

### Basic Usage

```objective-c
PNPublishFileMessageRequest *request =
    [PNPublishFileMessageRequest requestWithChannel:@"channel"
                                     fileIdentifier:@"fileIdentifier"
                                               name:@"fileName"];
request.customMessageType = @"file-message";

[self.client publishFileMessageWithRequest:request completion:^(PNPublishStatus *status) {
    if (!status.isError) {
        // success
    } else {
        // [status retry];
    }
}];
```

### Response

```objective-c
@interface PNPublishData : PNServiceData
@property (nonatomic, readonly, strong) NSNumber *timetoken;
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNPublishStatus : PNAcknowledgmentStatus
```
show all 19 lines

_Last updated: May 29 2025_