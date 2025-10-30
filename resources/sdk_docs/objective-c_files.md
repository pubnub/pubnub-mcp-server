# File Sharing API for Objective-C SDK

Upload and share files up to 5 MB on a channel. Uploaded files are stored with your key; channel subscribers receive a file event containing file ID, filename, and optional description.

## Send file[​](#send-file)

Uploads the file and publishes a file message on the channel (internally calls publishFileMessageWithRequest).

### Method(s)[​](#methods)

```
`1- (void)sendFileWithRequest:(PNSendFileRequest *)request   
2                 completion:(nullable PNSendFileCompletionBlock)block;  
`
```

- request Type: PNSendFileRequest — Send file request with all information about file and where it should be uploaded.
- block Type: PNSendFileCompletionBlock — Send file request completion block.

#### PNSendFileRequest[​](#pnsendfilerequest)

- fileMessageMetadata Type: NSDictionary — Values for PubNub message filtering.
- fileMessageTTL Type: NSUInteger Default: 0 — TTL for the file message. 0 uses key retention policy.
- fileMessageStore Type: BOOL Default: YES — Whether to store file messages in history.
- message Type: id — Message sent with the file.
- filename Type: NSString — Storage name for uploaded data. Set by default only when created with requestWithChannel:fileURL:.

##### Deprecated parameter

The cipherKey parameter is deprecated. Configure the crypto module instead. If cipherKey is passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code[​](#sample-code)

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Basic configuration  
5PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
6                                                          subscribeKey:@"demo"  
7                                                                userID:@"fileUser"];  
8
  
9// Optional: Configure encryption for files  
10config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
11                                           randomInitializationVector:YES];  
12
  
13// Create a PubNub client instance  
14PubNub *client = [PubNub clientWithConfiguration:config];  
15
  
16// Add listener for PubNub events  
17[client addListener:self];  
18
  
19// Sending file from byte data object  
20NSData *content = [@"This is a sample file uploaded using PubNub File API." dataUsingEncoding:NSUTF8StringEncoding];  
21
  
22// Create the file send request  
23PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"file-channel"  
24                                                          fileName:@"sample.txt"  
25                                                              data:content];  
26
  
27// Add optional parameters  
28request.message = @{@"description": @"Sample text file upload"};  
29request.fileMessageMetadata = @{@"type": @"text", @"size": @"small"};  
30request.fileMessageStore = YES;  
31
  
32NSLog(@"Sending file binary data as: sample.txt");  
33
  
34// Send the file  
35[client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {  
36    if (!status.isError) {  
37        NSLog(@"✅ File uploaded successfully!");  
38        NSLog(@"File ID: %@", status.data.fileIdentifier);  
39        NSLog(@"Stored as: %@", status.data.fileName);  
40        NSLog(@"Timetoken: %@", status.data.timetoken);  
41    } else {  
42        NSLog(@"❌ Error uploading file: %@", status.errorData.information);  
43          
44        if (status.data.fileUploaded) {  
45            NSLog(@"⚠️ File was uploaded but message publishing failed.");  
46            // Here you could implement retry logic for just the message publishing  
47        } else {  
48            NSLog(@"⚠️ File upload failed completely.");  
49            // Here you could implement retry logic for the whole file upload  
50        }  
51    }  
52}];  
53
  
54// Subscribe to a file channel  
55PNSubscribeRequest *request = [PNSubscribeRequest requestWithChannels:@[@"file-channel"]  
56                                                        channelGroups:nil];  
57      
58[self.client subscribeWithRequest:request];  
59
  
60// Required PNEventsListener methods  
61- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
62    // Checking connectivity only using subscribe operation.  
63    if (status.operation != PNSubscribeOperation) return;  
64      
65    if (status.category == PNConnectedCategory) {  
66        NSLog(@"✅ Successfully connected to PubNub!");  
67    } else if (status.isError) {  
68        NSLog(@"❌ PubNub connection error: %@", status);  
69    }  
70}  
71
  
72- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
73    NSLog(@"Received message: %@ on channel: %@", message.data.message, message.data.channel);  
74}  

```

### Response[​](#response)

```
1@interface PNSendFileData : PNServiceData  
2
  
3// Unique identifier assigned to the file during upload  
4@property (nonatomic, nullable, readonly, strong) NSString *fileIdentifier;  
5
  
6// Time at which the file information message was published.  
7@property (nonatomic, nullable, readonly, strong) NSNumber *timetoken;  
8
  
9// Name under which the uploaded file is stored  
10@property (nonatomic, nullable, readonly, strong) NSString *fileName;  
11
  
12/**  
13 * Whether the file uploaded or not.  
14 *  
15 * This property should be used during error handling to identify whether the  
16 * send-file request should be resent, or if you just need to call  
17 * file message publish.  
18*/  
19@property (nonatomic, readonly, assign) BOOL fileUploaded;  
20
  
21@end  
22
  
23@interface PNSendFileStatus : PNAcknowledgmentStatus  
24
  
25// Send file request processed information.  
26@property (nonatomic, readonly, strong) PNSendFileData *data;  
27
  
28@end  

```

### Other examples[​](#other-examples)

#### Upload binary data[​](#upload-binary-data)

```
1NSData *data = [[NSUUID UUID].UUIDString dataUsingEncoding:NSUTF8StringEncoding];  
2PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"  
3                                                          fileName:@"cat_picture.jpg"  
4                                                              data:data];  
5
  
6[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {  
7    if (!status.isError) {  
8        /**  
9         * File upload successfully completed.  
10         * Uploaded file information available here:  
11         *   status.data.fileIdentifier - unique file identifier  
12         *   status.data.fileName - name which has been used to store file  
13         */  
14    } else {  
15        /**  
16         * Handle send file error. Check 'category' property to find out possible issue  
17         * because of which request did fail.  
18         *  
19         * Check 'status.data.fileUploaded' to figure out whether request should be resent or  
20         * only file message publish should be called.  
21         */  
22    }  
23}];  

```

#### Upload using stream[​](#upload-using-stream)

```
1NSInputStream *stream = ...;  
2NSUInteger streamSize = /* size of data in stream */;  
3PNSendFileRequest *request = [PNSendFileRequest requestWithChannel:@"channel"  
4                                                          fileName:@"image.png"  
5                                                            stream:stream  
6                                                              size:streamSize];  
7
  
8[self.client sendFileWithRequest:request completion:^(PNSendFileStatus *status) {  
9    if (!status.isError) {  
10        /**  
11         * File upload successfully completed.  
12         * Uploaded file information available here:  
13         *   status.data.fileIdentifier - unique file identifier  
14         *   status.data.fileName - name which has been used to store file  
15         */  
16    } else {  
17        /**  
18         * Handle send file error. Check 'category' property to find out possible issue  
19         * because of which request did fail.  
20         *  
21         * Check 'status.data.fileUploaded' to figure out whether request should be resent or  
22         * only file message publish should be called.  
23         */  
24    }  
25}];  

```

### Returns[​](#returns)

Same as from basic usage.

## List channel files[​](#list-channel-files)

Retrieve files uploaded to a channel.

### Method(s)[​](#methods-1)

```
`1- (void)listFilesWithRequest:(PNListFilesRequest *)request   
2                  completion:(PNListFilesCompletionBlock)block;  
`
```

- request Type: PNListFilesRequest — Fetch channel files list.
- block Type: PNListFilesCompletionBlock — Completion block.

#### PNListFilesRequest[​](#pnlistfilesrequest)

- next Type: NSString — Server-provided cursor for forward pagination.
- limit Type: NSUInteger Default: 100 — Number of files to return.

### Sample code[​](#sample-code-1)

```
1PNListFilesRequest *request = [PNListFilesRequest requestWithChannel:@"channel"];  
2request.limit = 20;  
3request.next = ...;  
4
  
5[self.client listFilesWithRequest:request  
6                       completion:^(PNListFilesResult *result, PNErrorStatus *status) {  
7    if (!status.isError) {  
8        /**  
9         * Uploaded files list successfully fetched.  
10         *   result.data.files - List of uploaded files (information).  
11         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
12         *   result.data.count - Total number of files uploaded to channel.  
13         */  
14    } else {  
15        /**  
16         * Handle fetch files list error. Check 'category' property to find out possible issue  
17         * because of which request did fail.  
18         *  
19         * Request can be resent using: [status retry]  
20         */  
21    }  
22}];  

```

### Response[​](#response-1)

```
1@interface PNListFilesData : PNServiceData  
2
  
3// List of channel files.  
4@property (nonatomic, nullable, readonly, strong) NSArrayPNFile *> *files;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// How many files has been returned.  
10@property (nonatomic, readonly, assign) NSUInteger count;  
11
  
12@end  
13
  
14@interface PNListFilesResult : PNResult  
15  
16// List files request processed information.  
17@property (nonatomic, readonly, strong) PNListFilesData *data;  
18
  
19@end  

```

## Get file URL[​](#get-file-url)

Generate a download URL for a file in a channel.

### Method(s)[​](#methods-2)

```
`1- (nullable NSURL *)downloadURLForFileWithName:(NSString *)name   
2                                    identifier:(NSString *)identifier   
3                                     inChannel:(NSString *)channel;  
`
```

- name Type: NSString — Stored file name.
- identifier Type: NSString — Unique file identifier assigned during upload.
- channel Type: NSString — Channel name.

### Sample code[​](#sample-code-2)

```
`1NSURL *url = [self.client downloadURLForFileWithName:@"user_profile.png"  
2                                          identifier:@""  
3                                           inChannel:@"lobby"];  
`
```

### Returns[​](#returns-1)

URL to download the file with specified name and identifier.

## Download file[​](#download-file)

Download a file from a channel.

### Method(s)[​](#methods-3)

```
`1- (void)downloadFileWithRequest:(PNDownloadFileRequest *)request   
2                     completion:(PNDownloadFileCompletionBlock)block;  
`
```

- request Type: PNDownloadFileRequest — Information about the file to download.
- block Type: PNDownloadFileCompletionBlock — Completion block.

#### PNDownloadFileRequest[​](#pndownloadfilerequest)

- targetURL Type: NSURL Default: Temporary location — Local URL to store the downloaded file. Files in a temporary location are removed after the completion block returns.

##### Deprecated parameter

The cipherKey parameter is deprecated. Configure the crypto module instead. If cipherKey is passed, it overrides the crypto module and uses legacy 128-bit encryption.

### Sample code[​](#sample-code-3)

```
1PNDownloadFileRequest *request = [PNDownloadFileRequest requestWithChannel:@"lobby"  
2                                                                identifier:@""  
3                                                                      name:@"user_profile.png"];  
4request.targetURL = ...;  
5
  
6[self.client downloadFileWithRequest:request  
7                          completion:^(PNDownloadFileResult *result, PNErrorStatus *status) {  
8
  
9    if (!status.isError) {  
10        /**  
11         * File successfully has been downloaded.  
12         *   status.data.location - location where downloaded file can be found  
13         *   status.data.temporary - whether file has been downloaded to temporary storage and  
14         *                           will be removed on completion block return.  
15         */  
16    } else {  
17        /**  
18         * Handle file download error. Check 'category' property to find out possible issue  
19         * because of which request did fail.  
20         *  
21         * Request can be resent using: [status retry]  
22         */  
23    }  
24}];  

```

### Response[​](#response-2)

```
1@interface PNDownloadFileData : PNServiceData  
2
  
3/**  
4 * Whether file is temporary or not.  
5 *  
6 * Temporary file will be removed as soon as completion block will exit. Make sure  
7 * to move temporary files (w/o scheduling task on secondary thread) to persistent  
8 * location.  
9 */  
10@property (nonatomic, readonly, assign, getter = isTemporary) BOOL temporary;  
11
  
12// Location where downloaded file can be found.  
13@property (nonatomic, readonly, nullable, readonly, strong) NSURL *location;  
14
  
15@end  
16
  
17@interface PNDownloadFileResult : PNResult  
18
  
19// Download file request processed information.  
20@property (nonatomic, readonly, strong) PNDownloadFileData *data;  
21
  
22@end  

```

## Delete file[​](#delete-file)

Remove a file from a channel.

### Method(s)[​](#methods-4)

```
`1- (void)deleteFileWithRequest:(PNDeleteFileRequest *)request   
2                   completion:(nullable PNDeleteFileCompletionBlock)block;  
`
```

- request Type: PNDeleteFileRequest — File removal request data.
- block Type: PNDeleteFileCompletionBlock — Completion block.

### Sample code[​](#sample-code-4)

```
1PNDeleteFileRequest *request = [PNDeleteFileRequest requestWithChannel:@"channel"  
2                                                            identifier:@""  
3                                                                  name:@"greetings.txt"];  
4
  
5[self.client deleteFileWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
6    if (!status.isError) {  
7        // File successfully has been deleted.  
8    } else {  
9        /**  
10         * Handle file delete error. Check 'category' property to find out possible issue  
11         * because of which request did fail.  
12         *  
13         * Request can be resent using: [status retry]  
14         */  
15    }  
16}];  

```

### Response[​](#response-3)

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNAcknowledgmentStatus : PNErrorStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

## Publish file message[​](#publish-file-message)

Publish the uploaded file message to a channel. Called internally by sendFileWithRequest. Use directly if sendFileWithRequest fails at PNPublishFileMessageOperation to resend the file message without re-uploading.

### Method(s)[​](#methods-5)

```
`1- (void)publishFileMessageWithRequest:(PNPublishFileMessageRequest *)request   
2                           completion:(nullable PNPublishCompletionBlock)block;  
`
```

- request Type: PNPublishFileMessageRequest — Publish request with uploaded file info.
- block Type: PNPublishCompletionBlock — Completion block.

#### PNPublishFileMessageRequest[​](#pnpublishfilemessagerequest)

- identifier Type: NSString — Unique identifier provided during file upload.
- filename Type: NSString — Stored file name.
- customMessageType Type: NSString — Case-sensitive, 3–50 chars, alphanumeric, dashes and underscores allowed; cannot start with special characters or pn_/pn-. Examples: text, action, poll.

Also supports PNBasePublishRequest parameters:
- arbitraryQueryParameters Type: NSDictionary — Additional percent-encoded query params.
- preparedMetadata Type: NSString — Serialized NSDictionary for message filtering.
- replicate Type: BOOL — Replicate across the PubNub network.
- store Type: BOOL — Store message in history.
- metadata Type: NSDictionary — Values for message filtering.
- channel Type: NSString — Target channel.
- message Type: id — JSON-serializable object; encrypted if crypto module configured.
- ttl Type: NSUInteger — Storage duration; 0 uses retention policy.
- retried Type: BOOL — Indicates retry after failure.

### Sample code[​](#sample-code-5)

```
1PNPublishFileMessageRequest *request = [PNPublishFileMessageRequest requestWithChannel:@"channel"  
2                                                                        fileIdentifier:@"fileIdentifier"  
3                                                                                  name:@"fileName"];  
4request.customMessageType = @"file-message";  
5
  
6[self.client publishFileMessageWithRequest:request completion:^(PNPublishStatus *status) {  
7    if (!status.isError) {  
8        // File message successfully published.  
9    } else {  
10        // Handle file message publish error. Check 'category' property to find out possible  
11        // issue because of which request did fail.  
12        //  
13        // Request can be resent using: [status retry];  
14    }  
15}];  

```

### Response[​](#response-4)

```
1@interface PNPublishData : PNServiceData  
2
  
3/**  
4 * Service-provided time stamp at which message has been pushed to remote  
5 * data object live feed.  
6 */  
7@property (nonatomic, readonly, strong) NSNumber *timetoken;  
8
  
9// Service-provide information about service response message.  
10@property (nonatomic, readonly, strong) NSString *information;  
11
  
12@end  
13
  
14@interface PNPublishStatus : PNAcknowledgmentStatus  
15
  
16// Stores reference on publish request processing status information.  
17@property (nonatomic, readonly, strong) PNPublishData *data;  
18
**19@end  

```