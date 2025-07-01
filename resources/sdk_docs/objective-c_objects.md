# PubNub Objective-C SDK – App Context (Objects)  
Below is a condensed reference. All method signatures, request/response models, builder chains, and usage examples are preserved verbatim. Repeated narrative text, non-technical prose, and in-line hyperlinks have been removed.

---

## Users (UUID Metadata)

### Get Metadata for All Users
#### Method
```objective-c
- (void)allUUIDMetadataWithRequest:(PNFetchAllUUIDMetadataRequest *)request
                        completion:(PNFetchAllUUIDMetadataCompletionBlock)block;
```
#### Request – `PNFetchAllUUIDMetadataRequest`
* `sort` `NSArray<NSString *>`
* `includeFields` `PNUUIDFields`
* `filter` `NSString`
* `start | end` `NSString`
* `limit` `NSUInteger`

#### Basic Usage
```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"metadataUser"];
PubNub *client = [PubNub clientWithConfiguration:config];

NSLog(@"Fetching all UUID metadata...");
```

#### Response
```objective-c
@interface PNFetchAllUUIDMetadataData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNUUIDMetadata *> *metadata;
@property (nonatomic, nullable, readonly, strong) NSString *next;
@property (nonatomic, nullable, readonly, strong) NSString *prev;
@end
```

---

### Get Metadata for All Users – Builder Pattern
```objective-c
objects()
    .allUUIDMetadata()
    .includeFields(PNUUIDFields)
    .includeCount(BOOL)
    .filter(NSString *)
    .sort(NSArray<NSString *> *)
    .limit(NSUInteger)
    .start(NSString *)
    .end(NSString *)
    .performWithCompletion(PNFetchAllUUIDMetadataCompletionBlock);
```
#### Basic Usage
```objective-c
self.client.objects().allUUIDMetadata()
    .start(@"")
    .includeFields(PNUUIDCustomField)
    .includeCount(YES)
    .limit(40)
    .performWithCompletion(^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {
        /* Handle result / status */
    });
```

---

### Get User Metadata
#### Method
```objective-c
- (void)uuidMetadataWithRequest:(PNFetchUUIDMetadataRequest *)request
                     completion:(PNFetchUUIDMetadataCompletionBlock)block;
```
#### Request – `PNFetchUUIDMetadataRequest`
* `includeFields` `PNUUIDFields`
* `uuid` `NSString`

#### Basic Usage
```objective-c
PNFetchUUIDMetadataRequest *request = [PNFetchUUIDMetadataRequest requestWithUUID:@"uuid"];
request.includeFields = PNUUIDCustomField;

[self.client uuidMetadataWithRequest:request
                          completion:^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {
                              /* Handle response */
                          }];
```

---

### Get User Metadata – Builder Pattern
```objective-c
objects()
    .uuidMetadata()
    .uuid(NSString *)
    .includeFields(PNUUIDFields)
    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);
```

---

### Set User Metadata
#### Method
```objective-c
- (void)setUUIDMetadataWithRequest:(PNSetUUIDMetadataRequest *)request
                        completion:(nullable PNSetUUIDMetadataCompletionBlock)block;
```
#### Request – `PNSetUUIDMetadataRequest`
* `custom` `NSDictionary`
* `externalId | profileUrl | email | name | status | type` `NSString`
* `includeFields` `PNUUIDFields`
* `uuid` `NSString`
* `ifMatchesEtag` `NSString`

#### Basic Usage
```objective-c
PNSetUUIDMetadataRequest *request = [PNSetUUIDMetadataRequest requestWithUUID:@"uuid"];
request.includeFields = PNUUIDCustomField;
request.custom = @{ @"age": @(39), @"status": @"Checking some stuff..." };
request.email = @"support@pubnub.com";
request.name  = @"David";

[self.client setUUIDMetadataWithRequest:request
                              completion:^(PNSetUUIDMetadataStatus *status) {
                                  /* Handle status */
                              }];
```

---

### Set User Metadata – Builder Pattern
```objective-c
objects()
    .setUUIDMetadata()
    .uuid(NSString *)
    .name(NSString *)
    .externalId(NSString *)
    .profileUrl(NSString *)
    .custom(NSDictionary *)
    .email(NSString *)
    .includeFields(PNUUIDFields)
    .performWithCompletion(PNSetUUIDMetadataCompletionBlock);
```

---

### Remove User Metadata
#### Method
```objective-c
- (void)removeUUIDMetadataWithRequest:(PNRemoveUUIDMetadataRequest *)request
                           completion:(nullable PNRemoveUUIDMetadataCompletionBlock)block;
```
#### Basic Usage
```objective-c
PNRemoveUUIDMetadataRequest *request = [PNRemoveUUIDMetadataRequest requestWithUUID:@"uuid"];
[self.client removeUUIDMetadataWithRequest:request
                                completion:^(PNAcknowledgmentStatus *status) {
                                    /* Handle status */
                                }];
```

### Remove User Metadata – Builder Pattern
```objective-c
objects()
    .removeUUIDMetadata()
    .uuid(NSString *)
    .performWithCompletion(PNRemoveUUIDMetadataCompletionBlock);
```

---

## Channels (Channel Metadata)

### Get Metadata for All Channels
#### Method
```objective-c
- (void)allChannelsMetadataWithRequest:(PNFetchAllChannelsMetadataRequest *)request
                            completion:(PNFetchAllChannelsMetadataCompletionBlock)block;
```
#### Request – `PNFetchAllChannelsMetadataRequest`
* `includeFields` `PNChannelFields`
* `sort | filter | start | end | limit`

#### Basic Usage
```objective-c
PNFetchAllChannelsMetadataRequest *request = [PNFetchAllChannelsMetadataRequest new];
request.start = @"";
request.includeFields = PNChannelCustomField | PNChannelTotalCountField;
request.limit = 40;

[self.client allChannelsMetadataWithRequest:request
                                 completion:^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {
                                     /* Handle result */
                                 }];
```

---

### Get Metadata for All Channels – Builder Pattern
```objective-c
objects()
    .allChannelsMetadata()
    .includeFields(PNChannelFields)
    .includeCount(BOOL)
    .filter(NSString)
    .sort(NSArray)
    .limit(NSUInteger)
    .start(NSString)
    .end(NSString)
    .performWithCompletion(PNFetchAllChannelsMetadataCompletionBlock);
```

---

### Get Channel Metadata
#### Method
```objective-c
- (void)channelMetadataWithRequest:(PNFetchChannelMetadataRequest *)request
                        completion:(PNFetchChannelMetadataCompletionBlock)block;
```
#### Request – `PNFetchChannelMetadataRequest`
* `includeFields` `PNChannelFields`
* `channel` `NSString`

#### Basic Usage
```objective-c
PNFetchChannelMetadataRequest *request = [PNFetchChannelMetadataRequest requestWithChannel:@"channel"];
request.includeFields = PNChannelCustomField;

[self.client channelMetadataWithRequest:request
                             completion:^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {
                                 /* Handle result */
                             }];
```

### Get Channel Metadata – Builder Pattern
```objective-c
objects()
    .channelMetadata(@"channel")
    .includeFields(PNChannelFields)
    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);
```

---

### Set Channel Metadata
#### Method
```objective-c
- (void)setChannelMetadataWithRequest:(PNSetChannelMetadataRequest *)request
                           completion:(nullable PNSetChannelMetadataCompletionBlock)block;
```
#### Request – `PNSetChannelMetadataRequest`
* `custom | information | name | status | type` `NSString/NSDictionary`
* `includeFields` `PNChannelFields`
* `channel` `NSString`
* `ifMatchesEtag` `NSString`

#### Basic Usage
```objective-c
PNSetChannelMetadataRequest *request = [PNSetChannelMetadataRequest requestWithChannel:@"channel"];
request.includeFields = PNChannelCustomField;
request.custom = @{ @"responsibilities": @"Manage tests", @"status": @"offline" };
request.name = @"Updated channel name";

[self.client setChannelMetadataWithRequest:request
                                 completion:^(PNSetChannelMetadataStatus *status) {
                                     /* Handle status */
                                 }];
```

### Set Channel Metadata – Builder Pattern
```objective-c
objects()
    .setChannelMetadata(@"channel")
    .name(NSString *)
    .information(NSString *)
    .custom(NSDictionary *)
    .includeFields(PNChannelFields)
    .performWithCompletion(PNSetChannelMetadataCompletionBlock);
```

---

### Remove Channel Metadata
```objective-c
- (void)removeChannelMetadataWithRequest:(PNRemoveChannelMetadataRequest *)request
                              completion:(nullable PNRemoveChannelMetadataCompletionBlock)block;
```
#### Builder Pattern
```objective-c
objects()
    .removeChannelMetadata(NSString *)
    .performWithCompletion(PNRemoveChannelMetadataCompletionBlock);
```

---

## Channel Memberships (UUID ↔︎ Channels)

### Get Channel Memberships
```objective-c
- (void)membershipsWithRequest:(PNFetchMembershipsRequest *)request
                    completion:(PNFetchMembershipsCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .memberships()
    .uuid(NSString *)
    .includeFields(PNMembershipFields)
    .includeCount(BOOL)
    .filter(NSString *)
    .sort(NSArray<NSString *> *)
    .limit(NSUInteger)
    .start(NSString *)
    .end(NSString *)
    .performWithCompletion(PNFetchMembershipsCompletionBlock);
```

### Set Memberships
```objective-c
- (void)setMembershipsWithRequest:(PNSetMembershipsRequest *)request
                       completion:(nullable PNManageMembershipsCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .setMemberships()
    .uuid(NSString *)
    .channels(NSArray<NSDictionary *> *)
    .includeFields(PNMembershipFields)
    .performWithCompletion(PNManageMembershipsCompletionBlock);
```

### Remove Memberships
```objective-c
- (void)removeMembershipsWithRequest:(PNRemoveMembershipsRequest *)request
                          completion:(nullable PNManageMembershipsCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .removeMemberships()
    .uuid(NSString *)
    .channels(NSArray<NSString *> *)
    .performWithCompletion(PNManageMembershipsCompletionBlock);
```

### Manage Memberships (set & remove in one call)
```objective-c
- (void)manageMembershipsWithRequest:(PNManageMembershipsRequest *)request
                          completion:(nullable PNManageMembershipsCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .manageMemberships()
    .uuid(NSString *)
    .set(NSArray<NSDictionary *> *)
    .remove(NSArray<NSString *> *)
    .performWithCompletion(PNManageMembershipsCompletionBlock);
```

---

## Channel Members (Channel ↔︎ UUIDs)

### Get Channel Members
```objective-c
- (void)channelMembersWithRequest:(PNFetchChannelMembersRequest *)request
                       completion:(PNFetchChannelMembersCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .channelMembers(NSString *)
    .includeFields(PNChannelMemberFields)
    .includeCount(BOOL)
    .filter(NSString *)
    .sort(NSArray<NSString *> *)
    .limit(NSUInteger)
    .start(NSString *)
    .end(NSString *)
    .performWithCompletion(PNFetchChannelMembersCompletionBlock);
```

### Set Channel Members
```objective-c
- (void)setChannelMembersWithRequest:(PNSetChannelMembersRequest *)request
                          completion:(nullable PNManageChannelMembersCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .setChannelMembers(NSString *)
    .uuids(NSArray<NSDictionary *> *)
    .includeFields(PNChannelMemberFields)
    .performWithCompletion(PNManageChannelMembersCompletionBlock);
```

### Remove Channel Members
```objective-c
- (void)removeChannelMembersWithRequest:(PNRemoveChannelMembersRequest *)request
                             completion:(nullable PNManageChannelMembersCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .removeChannelMembers(NSString *)
    .uuids(NSArray<NSString *> *)
    .includeFields(PNChannelMemberFields)
    .performWithCompletion(PNManageChannelMembersCompletionBlock);
```

### Manage Channel Members
```objective-c
- (void)manageChannelMembersWithRequest:(PNManageChannelMembersRequest *)request
                             completion:(nullable PNManageChannelMembersCompletionBlock)block;
```
#### Builder
```objective-c
objects()
    .manageChannelMembers(NSString *)
    .set(NSArray<NSDictionary *> *)
    .remove(NSArray<NSString *> *)
    .includeFields(PNChannelMemberFields)
    .performWithCompletion(PNManageChannelMembersCompletionBlock);
```

---

### Error & Acknowledgement Models (shared)
```objective-c
@interface PNErrorData : PNServiceData
@property (nonatomic, readonly, strong) NSString *information;
@end

@interface PNErrorStatus : PNStatus
@property (nonatomic, readonly, assign, getter = isError) BOOL error;
@property (nonatomic, readonly, strong) PNErrorData *errorData;
@end

@interface PNAcknowledgmentStatus : PNErrorStatus
@end
```

_Last updated May 29 2025_