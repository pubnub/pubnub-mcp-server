On this page
# File Sharing API for Objective-C SDK

Allows users to upload and share files. You can upload any file of up to 5 MB in size. This feature is commonly used in social apps to share images, or in medical apps to share medical records for patients.

When a file is uploaded on a `channel`, it's stored and managed using a storage service, and associated with your key. Subscribers to that `channel` receive a file event which contains a file `ID`, `filename`, and optional `description`.

## Send file[​](#send-file)

Upload the file to a specified channel.

This method covers the entire process of sending a file, including preparation, uploading the file to a cloud storage service, and post-uploading messaging on a channel.

For the last messaging step, `sendFileWithRequest` internally calls the [`publishFileMessageWithRequest`](#publish-file-message) method to publish a message on the channel.

The published message contains metadata about the file, such as the file identifier and name, enabling others on the channel to find out about the file and access it.

### Method(s)[​](#methods)

```
`- (void)sendFileWithRequest:(PNSendFileRequest *)request   
                 completion:(nullable PNSendFileCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNSendFileRequest](#pnsendfilerequest)`Send file` request with all information about file and where it should be uploaded.`block`Type: PNSendFileCompletionBlock`Send file` file request completion block.

#### PNSendFileRequest[​](#pnsendfilerequest)

*  requiredParameterDescription`fileMessageMetadata`Type: NSDictionaryDefault:  
n/a`NSDictionary` with values to be used by PubNub service to filter file messages`fileMessageTTL`Type: NSUIntegerDefault:  
0How long message should be stored in channel's storage. Set to `0` (zero) to store message according to the retention policy you have set on your key.`fileMessageStore`Type: BOOLDefault:  
YESWhether published file messages should be stored in the channel's history`message`Type: idDefault:  
n/aMessage to be sent along with file to specified `channel``filename` *Type: NSStringDefault:  
n/aName to be used to store uploaded data. This is set by default only if the request is created with `requestWithChannel:fileURL:`.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/objective-c/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage)

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
show all 74 lines

### Response[​](#response)

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
show all 28 lines

### Other Examples[​](#other-examples)

#### Upload binary data[​](#upload-binary-data)

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
show all 23 lines

#### Upload using stream[​](#upload-using-stream)

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
show all 25 lines

### Returns[​](#returns)

Same as from basic usage.

## List channel files[​](#list-channel-files)

Retrieve list of files uploaded to `Channel`.

### Method(s)[​](#methods-1)

```
`- (void)listFilesWithRequest:(PNListFilesRequest *)request   
                  completion:(PNListFilesCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNListFilesRequest](#pnlistfilesrequest)`List files` request with all information which should be used to fetch channel's files list.`block` *Type: PNListFilesCompletionBlock`List files` request completion block.

#### PNListFilesRequest[​](#pnlistfilesrequest)

*  requiredParameterDescription`next`Type: NSStringDefault:  
n/aRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`limit`Type: NSUIntegerDefault:  
100Number of files to return in response.

### Basic Usage[​](#basic-usage-1)

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
show all 22 lines

### Response[​](#response-1)

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
show all 19 lines

## Get File Url[​](#get-file-url)

Generate URL which can be used to download file from target `Channel`.

### Method(s)[​](#methods-2)

```
`- (nullable NSURL *)downloadURLForFileWithName:(NSString *)name   
                                    identifier:(NSString *)identifier   
                                     inChannel:(NSString *)channel;  
`
```

*  requiredParameterDescription`name` *Type: NSStringName under which uploaded `file` is stored for `channel`.`identifier` *Type: NSStringUnique `file` identifier which has been assigned during `file` upload.`channel` *Type: NSStringName of channel within which `file` with `name` has been uploaded.

### Basic Usage[​](#basic-usage-2)

```
`NSURL *url = [self.client downloadURLForFileWithName:@"user_profile.png"  
                                          identifier:@""  
                                           inChannel:@"lobby"];  
`
```

### Returns[​](#returns-1)

URL which can be used to download remote file with specified `name` and `identifier`.

## Download file[​](#download-file)

Download file from specified `Channel`.

### Method(s)[​](#methods-3)

```
`- (void)downloadFileWithRequest:(PNDownloadFileRequest *)request   
                     completion:(PNDownloadFileCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNDownloadFileRequest](#pndownloadfilerequest)`Download file` request with information about file which should be downloaded.`block` *Type: PNDownloadFileCompletionBlock`Download file` request completion block.

#### PNDownloadFileRequest[​](#pndownloadfilerequest)

*  requiredParameterDescription`targetURL`Type: NSURLDefault:  
Temporary locationURL where downloaded file should be stored locally. File downloaded to temporary location will be removed after completion block return.

##### Deprecated parameter

The `cipherKey` parameter in this method is deprecated. We recommend that you configure the [crypto module](/docs/sdks/objective-c/api-reference/configuration#cryptomodule) on your PubNub instance instead.   
   
 If you pass `cipherKey` as an argument, it overrides the crypto module configuration and the legacy encryption with 128-bit cipher key entropy is used.

### Basic Usage[​](#basic-usage-3)

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
show all 24 lines

### Response[​](#response-2)

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
show all 22 lines

## Delete file[​](#delete-file)

Delete file from specified `Channel`.

### Method(s)[​](#methods-4)

```
`- (void)deleteFileWithRequest:(PNDeleteFileRequest *)request   
                   completion:(nullable PNDeleteFileCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: PNDeleteFileRequest`Delete file` request with all information about file for removal.`block`Type: PNDeleteFileCompletionBlock`Delete file` request completion block.

### Basic Usage[​](#basic-usage-4)

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
show all 16 lines

### Response[​](#response-3)

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
show all 16 lines

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a specified channel.

This method is called internally by [`sendFileWithRequest`](#send-file) as part of the file-sending process to publish the message with the file (already uploaded in a storage service) on a channel.

This message includes the file's unique identifier and name elements, which are needed to construct download links and inform channel subscribers that the file is available for download.

You can call this method when `sendFileWithRequest` fails and returns the `status.operation === PNPublishFileMessageOperation` error.
In that case, you can use the data from the `status` object to try again and use `publishFileMessageWithRequest` to manually resend a file message to a channel without repeating the upload step.

### Method(s)[​](#methods-5)

```
`- (void)publishFileMessageWithRequest:(PNPublishFileMessageRequest *)request   
                           completion:(nullable PNPublishCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNPublishFileMessageRequest](#pnpublishfilemessagerequest)`File message publish` request with all information about uploaded file.`block`Type: PNPublishCompletionBlock`File message publish` request completion block.

#### PNPublishFileMessageRequest[​](#pnpublishfilemessagerequest)

PropertyDescription`identifier`Type: NSString*Unique identifier provided during file upload.`filename`Type: NSString*Name with which uploaded data has been stored.`customMessageType`Type: NSString*A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

You can also set any parameters from the `PNBasePublishRequest` request:

PropertyDescription`arbitraryQueryParameters`Type: NSDictionary*Arbitrary percent-encoded query parameters which should be sent along with the original API call.`preparedMetadata`Type: NSString*Serialized `NSDictionary` with values used by PubNub service to filter messages.`replicate`Type: BOOLWhether the message should be replicated across the PubNub Real-Time Network and sent simultaneously to all subscribed clients on a channel.`store`Type: BOOLWhether `published` data should be stored and available with the history API or not.`metadata`Type: NSDictionary*`NSDictionary` with values used by PubNub service to filter messages.`channel`Type: NSString*Name of channel to which the message should be published.`message`Type: idMessage to be published. The object is serialized into JSON (supports `NSString`, `NSNumber`, `NSArray`, `NSDictionary`). If you configured a [crypto module](/docs/sdks/objective-c/api-reference/configuration#cryptomodule), the message is encrypted.`ttl`Type: NSUIntegerDuration for which the message should be stored in the channel's storage. Passing \b 0 will store the message according to retention policy.`retried`Type: BOOLIndicates whether the request is repeatedly sent to retry after a recent failure.

### Basic Usage[​](#basic-usage-5)

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

### Response[​](#response-4)

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
show all 19 linesLast updated on May 29, 2025**