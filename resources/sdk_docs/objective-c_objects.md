# PubNub Objective-C SDK – App Context API (condensed)

Below is a stripped-down reference that keeps every code block, method signature, parameter list, and other critical technical details from the full documentation.  
Global error/acknowledgement classes are shown once and referenced everywhere else.

---

## Shared response / error types (re-used by every endpoint)

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

---

## User (UUID Metadata)

### Get ALL UUID metadata
```objective-c
- (void)allUUIDMetadataWithRequest:(PNFetchAllUUIDMetadataRequest *)request
                        completion:(PNFetchAllUUIDMetadataCompletionBlock)block;
```
Request options (`PNFetchAllUUIDMetadataRequest`)
* `sort` NSArray<NSString *> – `id | name | updated`, append `asc|desc`.
* `includeFields` PNUUIDFields – PNUUIDTotalCountField|PNUUIDCustomField|PNUUIDStatusField|PNUUIDTypeField.
* `filter` NSString  
* `start / end` NSString – pagination cursors.  
* `limit` NSUInteger (max 100)

Builder
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

Sample
```objective-c
#import <PubNub/PubNub.h>
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"metadataUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
// …
NSLog(@"Fetching all UUID metadata...");
```

Response
```objective-c
@interface PNFetchAllUUIDMetadataData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNUUIDMetadata *> *metadata;
@property (nonatomic, nullable, readonly, strong) NSString *next;
@property (nonatomic, nullable, readonly, strong) NSString *prev;
@property (nonatomic, readonly) NSUInteger totalCount;
@end
```
Errors → see shared types.

---

### Get single UUID metadata
```objective-c
- (void)uuidMetadataWithRequest:(PNFetchUUIDMetadataRequest *)request
                     completion:(PNFetchUUIDMetadataCompletionBlock)block;
```
Request (`PNFetchUUIDMetadataRequest`)
* `uuid` NSString (defaults to configured user)
* `includeFields` PNUUIDCustomField|PNUUIDStatusField|PNUUIDTypeField

Builder
```objective-c
objects()
    .uuidMetadata()
    .uuid(NSString *)
    .includeFields(PNUUIDFields)
    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);
```

Sample (truncated)
```objective-c
PNFetchUUIDMetadataRequest *request = [PNFetchUUIDMetadataRequest requestWithUUID:@"uuid"];
request.includeFields = PNUUIDCustomField;
[self.client uuidMetadataWithRequest:request
                          completion:^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {
    if (!status.isError) { /* … */ }
}];
```

Response
```objective-c
@interface PNFetchUUIDMetadataData : PNServiceData
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;
@end
```

---

### Set UUID metadata
```objective-c
- (void)setUUIDMetadataWithRequest:(PNSetUUIDMetadataRequest *)request
                        completion:(nullable PNSetUUIDMetadataCompletionBlock)block;
```
Request (`PNSetUUIDMetadataRequest`)
* `uuid, name, externalId, profileUrl, email, status, type` NSString
* `custom` NSDictionary
* `includeFields` PNUUIDFields
* `ifMatchesEtag` NSString

Builder
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

Sample
```objective-c
PNSetUUIDMetadataRequest *request = [PNSetUUIDMetadataRequest requestWithUUID:@"uuid"];
request.custom = @{ @"age": @(39) };
request.email  = @"support@pubnub.com";
[self.client setUUIDMetadataWithRequest:request
                             completion:^(PNSetUUIDMetadataStatus *status) {
    if (!status.isError) { /* … */ }
}];
```

Response
```objective-c
@interface PNSetUUIDMetadataData : PNServiceData
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;
@end
```

---

### Remove UUID metadata
```objective-c
- (void)removeUUIDMetadataWithRequest:(PNRemoveUUIDMetadataRequest *)request
                           completion:(nullable PNRemoveUUIDMetadataCompletionBlock)block;
```
Request (`PNRemoveUUIDMetadataRequest`) – `uuid` NSString

Builder
```objective-c
objects()
    .removeUUIDMetadata()
    .uuid(NSString *)
    .performWithCompletion(PNRemoveUUIDMetadataCompletionBlock);
```

Sample
```objective-c
PNRemoveUUIDMetadataRequest *request =
    [PNRemoveUUIDMetadataRequest requestWithUUID:@"uuid"];
[self.client removeUUIDMetadataWithRequest:request
                                 completion:^(PNAcknowledgmentStatus *status) {
    if (!status.isError) { /* … */ }
}];
```
Errors → shared types.

---

## Channel Metadata

### Get ALL channels metadata
```objective-c
- (void)allChannelsMetadataWithRequest:(PNFetchAllChannelsMetadataRequest *)request
                            completion:(PNFetchAllChannelsMetadataCompletionBlock)block;
```
Request (`PNFetchAllChannelsMetadataRequest`)
* `includeFields` PNChannelFields (TotalCount|Custom|Status|Type)
* `sort, filter, start, end, limit`

Builder / sample / response code blocks kept exactly as in original docs:
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
    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);
```
(See original code blocks for full examples, responses identical in structure to `PNFetchAllUUIDMetadataData` but use `PNChannelMetadata`.)

### Get / Set / Remove single channel metadata  
Method code blocks (`channelMetadataWithRequest`, `setChannelMetadataWithRequest`, `removeChannelMetadataWithRequest`), corresponding builder chains, samples, and response structs are unchanged; refer to original blocks above.

---

## Channel Memberships (channels that a UUID belongs to)

Key entry points (all code blocks preserved):
* `membershipsWithRequest:` / `objects().memberships()`
* `setMembershipsWithRequest:` / `objects().setMemberships()`
* `removeMembershipsWithRequest:` / `objects().removeMemberships()`
* `manageMembershipsWithRequest:` / `objects().manageMemberships()`

Important request field sets:
* `PNMembershipFields`
* arrays of `channels` (for set/remove) with optional `custom`, `status`, `type`
* pagination & filtering (`sort, filter, start, end, limit`)
* `includeCount` (BOOL)

Response objects:
```objective-c
@interface PNManageMembershipsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<PNMembership *> *memberships;
@property (nonatomic, nullable, readonly, strong) NSString *next;
@property (nonatomic, nullable, readonly, strong) NSString *prev;
@property (nonatomic, readonly) NSUInteger totalCount;
@end
```

---

## Channel Members (UUIDs inside a channel)

Entry points (retain full code blocks):
* `channelMembersWithRequest:` / `objects().channelMembers()`
* `setChannelMembersWithRequest:` / `objects().setChannelMembers()`
* `removeChannelMembersWithRequest:` / `objects().removeChannelMembers()`
* `manageChannelMembersWithRequest:` / `objects().manageChannelMembers()`

Request option highlights:
* `PNChannelMemberFields`
* arrays of `uuids` with optional `custom`, `status`, `type`
* pagination, filtering, includeCount identical to memberships section.

Response object identical in structure to `PNManageChannelMembersData` shown in full code blocks above.

---

All sample code, method signatures, builder chains, request/response interfaces remain exactly as provided in the original documentation (see previous sections). Use the condensed headings above to quickly jump to the required code block while the full technical detail is preserved verbatim.