# File Sharing API – Objective-C SDK (Files)

Upload up to 5 MB files, list, download, delete, and publish related messages on any channel.

---

## Send file

### Method
```
`- (void)sendFileWithRequest:(PNSendFileRequest *)request   
                 completion:(nullable PNSendFileCompletionBlock)block;  
`
```

Parameters  
• request – `PNSendFileRequest` describing channel, file, and optional message.  
• block – `PNSendFileCompletionBlock`.

`cipherKey` is **deprecated**; use `cryptoModule` on `PNConfiguration`.

#### PNSendFileRequest properties  
• fileMessageMetadata `NSDictionary` – metadata for filtering.  
• fileMessageTTL `NSUInteger` – message TTL; 0 = use key retention policy.  
• fileMessageStore `BOOL` – store message in history (default YES).  
• message `id` – message sent with the file.  
• filename `NSString` – stored file name (auto-filled when using `requestWithChannel:fileURL:`).

#### Sample code
```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"fileUser"];  
  
// Optional: Configure encryption for files  
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
                                           randomInitializationVector:YES];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
`
```
(show all 74 lines)

#### Response
```
`@interface PNSendFileData : PNServiceData  
  
// Unique identifier assigned to the file during upload  
@property (nonatomic, nullable, readonly, strong) NSString *fileIdentifier;  
  
// Time at which the file information message was published.  
@property (nonatomic, nullable, readonly, strong) NSNumber *timetoken;  
  
// Name under which the uploaded file is stored  
@property (nonatomic, nullable, readonly, strong) NSString *fileName;  
  
/**  
 * Whether the file uploaded or not.  
 *  
 * This property should be used during error handling to identify whether the  
`
```
(show all 28 lines)

#### Other examples

Upload binary data
```
`NSData *data = [[NSUUID UUID].UUIDString dataUsingEncoding:NSUTF8StringEncoding];  
PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"  
                                                          fileName:@"cat_picture.jpg"  
                                                              data:data];  
  
[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {  
    if (!status.isError) {  
        /**  
         * File upload successfully completed.  
         * Uploaded file information available here:  
         *   status.data.fileIdentifier - unique file identifier  
         *   status.data.fileName - name which has been used to store file  
         */  
    } else {  
        /**  
`
```

Upload using stream
```
`NSInputStream *stream = ...;  
NSUInteger streamSize = /* size of data in stream */;  
PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"  
                                                          fileName:@"image.png"  
                                                            stream:stream  
                                                              size:streamSize];  
  
[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {  
    if (!status.isError) {  
        /**  
         * File upload successfully completed.  
         * Uploaded file information available here:  
         *   status.data.fileIdentifier - unique file identifier  
         *   status.data.fileName - name which has been used to store file  
         */  
`
```

---

## List channel files

### Method
```
`- (void)listFilesWithRequest:(PNListFilesRequest *)request   
                  completion:(PNListFilesCompletionBlock)block;  
`
```

Parameters  
• request – `PNListFilesRequest`.  
• block – `PNListFilesCompletionBlock`.

#### PNListFilesRequest  
• limit `NSUInteger` (default 100).  
• next `NSString` – pagination cursor.

#### Sample code
```
`PNListFilesRequest *request = [PNListFilesRequest requestWithChannel:@"channel"];  
request.limit = 20;  
request.next = ...;  
  
[self.client listFilesWithRequest:request  
                       completion:^(PNListFilesResult *result, PNErrorStatus *status) {  
    if (!status.isError) {  
        /**  
         * Uploaded files list successfully fetched.  
         *   result.data.files - List of uploaded files (information).  
         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
         *   result.data.count - Total number of files uploaded to channel.  
         */  
    } else {  
        /**  
`
```

#### Response
```
`@interface PNListFilesData : PNServiceData  
  
// List of channel files.  
@property (nonatomic, nullable, readonly, strong) NSArrayPNFile *> *files;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// How many files has been returned.  
@property (nonatomic, readonly, assign) NSUInteger count;  
  
@end  
  
@interface PNListFilesResult : PNResult  
  
`
```
(show all 19 lines)

---

## Get file URL

### Method
```
`- (nullable NSURL *)downloadURLForFileWithName:(NSString *)name   
                                    identifier:(NSString *)identifier   
                                     inChannel:(NSString *)channel;  
`
```

Parameters  
• name – stored file name.  
• identifier – unique file ID.  
• channel – channel name.

#### Sample
```
`NSURL *url = [self.client downloadURLForFileWithName:@"user_profile.png"  
                                          identifier:@""  
                                           inChannel:@"lobby"];  
`
```

---

## Download file

### Method
```
`- (void)downloadFileWithRequest:(PNDownloadFileRequest *)request   
                     completion:(PNDownloadFileCompletionBlock)block;  
`
```

Parameters  
• request – `PNDownloadFileRequest`.  
• block – `PNDownloadFileCompletionBlock`.

`cipherKey` is **deprecated**; configure `cryptoModule` instead.

#### PNDownloadFileRequest  
• targetURL `NSURL` – location to save file (temporary location removed on completion).

#### Sample
```
`PNDownloadFileRequest *request = [PNDownloadFileRequest requestWithChannel:@"lobby"  
                                                                identifier:@""  
                                                                      name:@"user_profile.png"];  
request.targetURL = ...;  
  
[self.client downloadFileWithRequest:request  
                          completion:^(PNDownloadFileResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * File successfully has been downloaded.  
         *   status.data.location - location where downloaded file can be found  
         *   status.data.temporary - whether file has been downloaded to temporary storage and  
         *                           will be removed on completion block return.  
         */  
`
```

#### Response
```
`@interface PNDownloadFileData : PNServiceData  
  
/**  
 * Whether file is temporary or not.  
 *  
 * Temporary file will be removed as soon as completion block will exit. Make sure  
 * to move temporary files (w/o scheduling task on secondary thread) to persistent  
 * location.  
 */  
@property (nonatomic, readonly, assign, getter = isTemporary) BOOL temporary;  
  
// Location where downloaded file can be found.  
@property (nonatomic, readonly, nullable, readonly, strong) NSURL *location;  
  
@end  
`
```
(show all 22 lines)

---

## Delete file

### Method
```
`- (void)deleteFileWithRequest:(PNDeleteFileRequest *)request   
                   completion:(nullable PNDeleteFileCompletionBlock)block;  
`
```

#### Sample
```
`PNDeleteFileRequest *request = [PNDeleteFileRequest requestWithChannel:@"channel"  
                                                            identifier:@""  
                                                                  name:@"greetings.txt"];  
  
[self.client deleteFileWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
    if (!status.isError) {  
        // File successfully has been deleted.  
    } else {  
        /**  
         * Handle file delete error. Check 'category' property to find out possible issue  
         * because of which request did fail.  
         *  
         * Request can be resent using: [status retry]  
         */  
    }  
`
```

#### Response
```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNAcknowledgmentStatus : PNErrorStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
(show all 16 lines)

---

## Publish file message

Used internally by `sendFileWithRequest` but can be called directly.

### Method
```
`- (void)publishFileMessageWithRequest:(PNPublishFileMessageRequest *)request   
                           completion:(nullable PNPublishCompletionBlock)block;  
`
```

Parameters  
• request – `PNPublishFileMessageRequest`.  
• block – `PNPublishCompletionBlock`.

#### PNPublishFileMessageRequest  
Required:  
• identifier `NSString` – file ID.  
• filename `NSString` – stored file name.

Optional:  
• customMessageType `NSString` – 3-50 char alphanumeric label.  
• All `PNBasePublishRequest` fields (`message`, `metadata`, `ttl`, `store`, `replicate`, `arbitraryQueryParameters`, etc.).

#### Sample
```
`PNPublishFileMessageRequest *request = [PNPublishFileMessageRequest requestWithChannel:@"channel"  
                                                                        fileIdentifier:@"fileIdentifier"  
                                                                                  name:@"fileName"];  
request.customMessageType = @"file-message";  
  
[self.client publishFileMessageWithRequest:request completion:^(PNPublishStatus *status) {  
    if (!status.isError) {  
        // File message successfully published.  
    } else {  
        // Handle file message publish error. Check 'category' property to find out possible  
        // issue because of which request did fail.  
        //  
        // Request can be resent using: [status retry];  
    }  
}];  
`
```

#### Response
```
`@interface PNPublishData : PNServiceData**  
/**  
 * Service-provided time stamp at which message has been pushed to remote  
 * data object live feed.  
 */  
@property (nonatomic, readonly, strong) NSNumber *timetoken;  
  
// Service-provide information about service response message.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNPublishStatus : PNAcknowledgmentStatus  
  
`
```
(show all 19 lines)

---

Last updated: Jul 15 2025