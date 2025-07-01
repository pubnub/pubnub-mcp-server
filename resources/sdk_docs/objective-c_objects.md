On this page
# App Context API for Objective- SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is changed: set, updated, or removed from the database. At the same time, making a request to set the same data that already exist, doesn't trigger any event. Clients can receive these events in real time and update their front-end application accordingly.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of UUID Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)allUUIDMetadataWithRequest:(PNFetchAllUUIDMetadataRequest *)request   
                        completion:(PNFetchAllUUIDMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchAllUUIDMetadataRequest](#pnfetchalluuidmetadatarequest)`Fetch all UUID metadata` request object with all information which should be used to fetch existing `UUID metadata`.`block` *Type: PNFetchAllUUIDMetadataCompletionBlock`Fetch all UUID metadata` request completion `block`.

#### PNFetchAllUUIDMetadataRequest[​](#pnfetchalluuidmetadatarequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDTotalCountField` - include how many UUID has been associated with metadata.
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

Default value (`PNUUIDTotalCountField`) can be reset by setting 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"metadataUser"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Example 1: Basic UUID metadata fetch  
NSLog(@"Fetching all UUID metadata...");  
  
// Create a basic request  
`
```
show all 137 lines

#### Response[​](#response)

Response objects which is returned by client when `fetch all UUID metadata` Object API is used:

```
`@interface PNFetchAllUUIDMetadataData : PNServiceData  
  
// List of UUID metadata objects created for current subscribe key.  
@property (nonatomic, readonly, strong) NSArrayPNUUIDMetadata *> *metadata;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of objects created for current subscribe key.  
 *  
 * Value will be 0 in case if PNUUIDTotalCountField not added to 'includeFields'  
`
```
show all 27 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Metadata for All Users (Builder Pattern)[​](#get-metadata-for-all-users-builder-pattern)

#### Method(s)[​](#methods-1)

```
`objects()  
    .allUUIDMetadata()  
    .includeFields(PNUUIDFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(PNFetchAllUUIDMetadataCompletionBlock);  
`
```

*  requiredParameterDescription`includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDTotalCountField` - include how many UUID has been associated with metadata.
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

Default value (`PNUUIDTotalCountField`) can be reset by setting 0.`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block` *Type: PNFetchAllUUIDMetadataCompletionBlockAssociated `metadata fetch` completion handler block.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-1)

```
`self.client.objects().allUUIDMetadata()  
    .start(@"")  
    .includeFields(PNUUIDCustomField)  
    .includeCount(YES)  
    .limit(40)  
    .performWithCompletion(^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
             * UUID metadata successfully fetched.  
             * Result object has following information:  
             *   result.data.metadata - List of fetched UUID metadata.  
             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   result.data.totalCount - Total number of created UUID metadata.  
             */  
`
```
show all 24 lines

#### Response[​](#response-1)

Response objects which is returned by client when `fetch all UUID metadata` Object API is used:

```
`@interface PNFetchAllUUIDMetadataData : PNServiceData  
  
// List of UUID metadata objects created for current subscribe key.  
@property (nonatomic, readonly, strong) NSArrayPNUUIDMetadata *> *metadata;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of objects created for current subscribe key.  
 *  
 * Value will be 0 in case if PNUUIDTotalCountField not added to 'includeFields'  
`
```
show all 27 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified UUID, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Get UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)uuidMetadataWithRequest:(PNFetchUUIDMetadataRequest *)request   
                     completion:(PNFetchUUIDMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchUUIDMetadataRequest](#pnfetchuuidmetadatarequest)`Fetch UUID metadata` request with all information which should be used to fetch existing `UUID metadata`.`block` *Type: PNFetchUUIDMetadataCompletionBlock`Fetch UUID metadata` request completion `block`.

#### PNFetchUUIDMetadataRequest[​](#pnfetchuuidmetadatarequest)

*  requiredParameterDescription`includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

`uuid`Type: NSStringCreate and configure fetch `UUID` metadata request. `uuid` - Identifier for metadata should be fetched. Will be set to current PubNub configuration uuid if nil is set.

#### Basic Usage[​](#basic-usage-2)

```
`PNFetchUUIDMetadataRequest *request = [PNFetchUUIDMetadataRequest requestWithUUID:@"uuid"];  
// Add this request option, if returned metadata model should have value which has been set to  
// 'custom' property.  
request.includeFields = PNUUIDCustomField;  
  
[self.client uuidMetadataWithRequest:request  
                          completion:^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * UUID metadata successfully fetched.  
         * Fetched UUID metadata information available here: result.data.metadata  
         */  
    } else {  
        /**  
`
```
show all 22 lines

#### Response[​](#response-2)

Response objects which is returned by client when `fetch UUID metadata` Object API is used:

```
`@interface PNFetchUUIDMetadataData : PNServiceData  
  
// Requested UUID metadata object.  
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
  
@end  
  
@interface PNFetchUUIDMetadataResult : PNResult  
  
// Fetch UUID metadata request processed information.  
@property (nonatomic, readonly, strong) PNFetchUUIDMetadataData *data;  
  
@end  
`
```

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get User Metadata (Builder Pattern)[​](#get-user-metadata-builder-pattern)

#### Method(s)[​](#methods-3)

```
`objects()  
    .uuidMetadata()  
    .uuid(NSString *)  
    .includeFields(PNUUIDFields)  
    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringIdentifier for which associated `metadata` should be fetched. Default: configured PubNub client `uuid``includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

`block` *Type: PNFetchUUIDMetadataCompletionBlock`Fetch UUID metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-3)

```
`self.client.objects().uuidMetadata()  
    .uuid(@"uuid")  
    .includeFields(PNUUIDCustomField)  
    .performWithCompletion(^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {  
      if (!status.isError) {  
          /**  
           * UUID metadata successfully fetched.  
           * Fetched UUID metadata information available here: result.data.metadata  
           */  
      } else {  
          /**  
           * Handle UUID metadata fetch error. Check 'category' property to find out possible issue  
           * because of which request did fail.  
           *  
           * Request can be resent using: [status retry]  
`
```
show all 18 lines

#### Response[​](#response-3)

Response objects which is returned by client when `fetch UUID metadata` Object API is used:

```
`@interface PNFetchUUIDMetadataData : PNServiceData  
  
// Requested UUID metadata object.  
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
  
@end  
  
@interface PNFetchUUIDMetadataResult : PNResult  
  
// Fetch UUID metadata request processed information.  
@property (nonatomic, readonly, strong) PNFetchUUIDMetadataData *data;  
  
@end  
`
```

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a UUID in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Set UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)setUUIDMetadataWithRequest:(PNSetUUIDMetadataRequest *)request   
                        completion:(nullable PNSetUUIDMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNSetUUIDMetadataRequest](#pnsetuuidmetadatarequest)`Set UUID metadata` request with all information which should be associated with `UUID`.`block`Type: PNSetUUIDMetadataCompletionBlock`Set UUID metadata` request completion `block`.

#### PNSetUUIDMetadataRequest[​](#pnsetuuidmetadatarequest)

*  requiredParameterDescription`custom`Type: NSDictionaryAdditional / complex attributes which should be associated with metadata. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.`externalId`Type: NSStringIdentifier from external service (database, auth service).`profileUrl`Type: NSStringURL at which profile available.`includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

`email`Type: NSStringEmail address.`name`Type: NSStringName which should be stored in metadata associated with specified identifier.`uuid`Type: NSStringCreate and configure set UUID metadata request. `uuid` - Identifier with which \c metadata is linked. Will be set to current PubNub configuration uuid if nil is set.`status`Type: NSStringThe custom status of the user.`type`Type: NSStringThe custom type of the user.`ifMatchesEtag`Type: NSStringThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Basic Usage[​](#basic-usage-4)

```
`PNSetUUIDMetadataRequest *request = [PNSetUUIDMetadataRequest requestWithUUID:@"uuid"];  
// With this option on, returned metadata model will have value which has been set to 'custom'  
// property.  
request.includeFields = PNUUIDCustomField;  
request.custom = @{ @"age": @(39), @"status": @"Checking some stuff..." };  
request.email = @"support@pubnub.com";  
request.name = @"David";  
  
[self.client setUUIDMetadataWithRequest:request completion:^(PNSetUUIDMetadataStatus *status) {  
    if (!status.isError) {  
        /**  
         * UUID metadata successfully has been set.  
         * UUID metadata information available here: status.data.metadata  
         */  
    } else {  
`
```
show all 23 lines

#### Response[​](#response-4)

Response objects which is returned by client when `set UUID metadata` Object API is used:

```
`@interface PNSetUUIDMetadataData : PNServiceData  
  
// Updated UUID metadata object.  
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
  
@end  
  
@interface PNSetUUIDMetadataStatus : PNAcknowledgmentStatus  
  
// Set UUID metadata request processed information.  
@property (nonatomic, readonly, strong) PNSetUUIDMetadataData *data;  
  
@end  
`
```

### Set User Metadata (Builder Pattern)[​](#set-user-metadata-builder-pattern)

#### Method(s)[​](#methods-5)

```
`objects()  
    .setUUIDMetadata()  
    .uuid(NSString *)  
    .name(NSString *)  
    .externalId(NSString *)  
    .profileUrl(NSString *)  
    .custom(NSDictionary *)  
    .email(NSString *)  
    .includeFields(PNUUIDFields)  
    .performWithCompletion(nullable PNSetUUIDMetadataCompletionBlock);  
`
```

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

*  requiredParameterDescription`uuid`Type: NSStringIdentifier with which new `metadata` should be associated. Default: configured PubNub client `uuid``name`Type: NSStringName which should stored in `metadata` associated with specified `UUID`.`externalId`Type: NSStringExternal identifier (database, auth service) associated with specified `UUID`.`profileUrl`Type: NSStringExternal URL with information for specified `UUID` representation.`custom`Type: NSDictionaryAdditional information which should be stored in `metadata` associated with specified `UUID`. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.`email`Type: NSStringEmail address which should be stored in `metadata` associated with specified `UUID`.`includeFields`Type: PNUUIDFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNUUIDCustomField` - include field with additional information from metadata which has been used during UUID metadata set requests.
- `PNUUIDStatusField` - include field with `metadata` status which has been used during `UUID metadata set` requests
- `PNUUIDTypeField` - Include field with `metadata` type which has been used during `UUID metadata set` requests.

`block`Type: PNSetUUIDMetadataCompletionBlock`Set UUID metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-5)

```
`self.client.objects().setUUIDMetadata()  
    .uuid(@"uuid")  
    .name(@"Serhii")  
    .externalId(@"93FVfHUAf4RLu79J7Q3ejLVu")  
    .profileUrl(@"https://pubnub.com")  
    .custom(@{ @"age": @(36) })  
    .email(@"support@pubnub.com")  
    .includeFields(PNUUIDCustomField)  
    .performWithCompletion(^(PNSetUUIDMetadataStatus *status) {  
        if (!status.isError) {  
            /**  
             * UUID metadata successfully has been set.  
             * UUID metadata information available here: status.data.metadata  
             */  
        } else {  
`
```
show all 23 lines

#### Response[​](#response-5)

Response objects which is returned by client when `set UUID metadata` Object API is used:

```
`@interface PNSetUUIDMetadataData : PNServiceData  
  
// Updated UUID metadata object.  
@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
  
@end  
  
@interface PNSetUUIDMetadataStatus : PNAcknowledgmentStatus  
  
// Set UUID metadata request processed information.  
@property (nonatomic, readonly, strong) PNSetUUIDMetadataData *data;  
  
@end  
`
```

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-6)

To `Remove UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeUUIDMetadataWithRequest:(PNRemoveUUIDMetadataRequest *)request   
                           completion:(nullable PNRemoveUUIDMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveUUIDMetadataRequest](#pnremoveuuidmetadatarequest)`Remove UUID metadata` request with information about existing `metadata`.`block`Type: PNRemoveUUIDMetadataCompletionBlock`Remove UUID metadata` request completion `block`.

#### PNRemoveUUIDMetadataRequest[​](#pnremoveuuidmetadatarequest)

*  requiredParameterDescription`uuid`Type: NSStringCreate and configure delete user request. `identifier` - Create and configure remove `UUID` metadata request. Will be set to current PubNub configuration uuid if nil is set.

#### Basic Usage[​](#basic-usage-6)

```
`PNRemoveUUIDMetadataRequest *request = [PNRemoveUUIDMetadataRequest requestWithUUID:@"uuid"];  
  
[self.client removeUUIDMetadataWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
    if (!status.isError) {  
        // UUID metadata successfully removed.  
    } else {  
        /**  
         * Handle UUID metadata remove error. Check 'category' property to find out possible  
         * issue because of which request did fail.  
         *  
         * Request can be resent using: [status retry]  
         */  
    }  
}];  
`
```

#### Response[​](#response-6)

Response objects which is returned by client when `remove UUID metadata` Object API is used:

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

### Remove User Metadata (Builder Pattern)[​](#remove-user-metadata-builder-pattern)

#### Method(s)[​](#methods-7)

```
`objects()  
    .removeUUIDMetadata()  
    .uuid(NSString *)  
    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);  
  
`
```

*  requiredParameterDescription`uuid`Type: NSStringIdentifier for which associated `metadata` should be removed. Default: configured PubNub client `uuid``block`Type: PNRemoveUUIDMetadataCompletionBlock`Remove UUID metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-7)

```
`self.client.objects().removeUUIDMetadata()  
    .uuid(@"uuid")  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
             // User successfully deleted.  
        } else {  
            /**  
             * Handle user delete error. Check 'category' property to find out possible issue  
             * because of which request did fail.  
             *  
             * Request can be resent using: [status retry]  
             */  
        }  
    });  
`
```

#### Response[​](#response-7)

Response objects which is returned by client when `remove UUID metadata` Object API is used:

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

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-8)

To `Get All Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)allChannelsMetadataWithRequest:(PNFetchAllChannelsMetadataRequest *)request   
                            completion:(PNFetchAllChannelsMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchAllChannelsMetadataRequest](#pnfetchallchannelsmetadatarequest)`Fetch all UUID metadata` request object with all information which should be used to fetch existing `UUID metadata`.`block` *Type: PNFetchAllChannelsMetadataCompletionBlock`Fetch all UUID metadata` request completion `block`.

#### PNFetchAllChannelsMetadataRequest[​](#pnfetchallchannelsmetadatarequest)

*  requiredParameterDescription`includeFields`Type: PNChannelFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelTotalCountField` - include how many channels has been associated with metadata.
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

 Default value (`PNChannelTotalCountField`) can be reset by setting 0.`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-8)

```
`PNFetchAllChannelsMetadataRequest *request = [PNFetchAllChannelsMetadataRequest new];  
request.start = @"";  
// Add this request option, if returned metadata models should have value which has been set to  
// 'custom' property.  
request.includeFields = PNUUIDCustomField | PNUUIDTotalCountField;  
request.limit = 40;  
  
[self.client allChannelsMetadataWithRequest:request  
                                 completion:^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {  
    if (!status.isError) {  
        /**  
         * Channels metadata successfully fetched.  
         * Result object has following information:  
         *   result.data.metadata - List of fetched channels metadata.  
         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
`
```
show all 26 lines

#### Response[​](#response-8)

Response objects which is returned by client when `fetch all UUID metadata` Object API is used:

```
`@interface PNFetchAllChannelsMetadataData : PNServiceData  
  
// List of channels metadata objects created for current subscribe key.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMetadata *> *metadata;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of objects created for current subscribe key.  
 *  
 * Value will be 0 in case if PNChannelTotalCountField not added to 'includeFields'  
`
```
show all 27 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Metadata for All Channels (Builder Pattern)[​](#get-metadata-for-all-channels-builder-pattern)

#### Method(s)[​](#methods-9)

```
`objects()  
    .allChannelsMetadata()  
    .includeFields(PNChannelFields)  
    .includeCount(BOOL)  
    .filter(NSString)  
    .sort(NSArray)  
    .limit(NSUInteger)  
    .start(NSString)  
    .end(NSString)  
    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

*  requiredParameterDescription`includeFields`Type: PNChannelFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelTotalCountField` - include how many channels has been associated with metadata.
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

 Default value (`PNChannelTotalCountField`) can be reset by setting 0.`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block` *Type: PNFetchAllChannelsMetadataCompletionBlock`Fetch all UUID metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-9)

```
`self.client.objects().allChannelsMetadata()  
    .start(@"")  
    .includeFields(PNChannelCustomField)  
    .includeCount(YES)  
    .limit(40)  
    .performWithCompletion(^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
             * Channels metadata successfully fetched.  
             * Result object has following information:  
             *   result.data.metadata - List of fetched channels metadata.  
             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   result.data.totalCount - Total number of associated channel metadata.  
        } else {  
`
```
show all 23 lines

#### Response[​](#response-9)

Response objects which is returned by client when `fetch all UUID metadata` Object API is used:

```
`@interface PNFetchAllChannelsMetadataData : PNServiceData  
  
// List of channels metadata objects created for current subscribe key.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMetadata *> *metadata;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of objects created for current subscribe key.  
 *  
 * Value will be 0 in case if PNChannelTotalCountField not added to 'includeFields'  
`
```
show all 27 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-10)

To `Get Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)channelMetadataWithRequest:(PNFetchChannelMetadataRequest *)request   
                        completion:(PNFetchChannelMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchChannelMetadataRequest](#pnfetchchannelmetadatarequest)`Fetch channel metadata` request with all information which should be used to fetch existing `channel metadata`.`block` *Type: PNFetchChannelMetadataCompletionBlock`Fetch channel metadata` request completion `block`.

#### PNFetchChannelMetadataRequest[​](#pnfetchchannelmetadatarequest)

*  requiredParameterDescription`includeFields`Type: PNChannelFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

`channel`Type: NSStringCreate and configure fetch channel metadata request. `channel` - Name of channel for which metadata should be fetched.

#### Basic Usage[​](#basic-usage-10)

```
`PNFetchChannelMetadataRequest *request = [PNFetchChannelMetadataRequest requestWithChannel:@"channel"];  
// Add this request option, if returned metadata model should have value which has been set to  
// 'custom' property.  
request.includeFields = PNChannelCustomField;  
  
[self.client channelMetadataWithRequest:request  
                             completion:^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * Channel metadata successfully fetched.  
         * Channel metadata information available here: result.data.metadata  
         */  
    } else {  
        /**  
`
```
show all 22 lines

#### Response[​](#response-10)

Response objects which is returned by client when `fetch channel metadata` Object API is used:

```
`@interface PNFetchChannelMetadataData : PNServiceData  
  
// Requested channel metadata object.  
@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
  
@end  
  
@interface PNFetchChannelsMetadataResult : PNResult  
  
// Fetch channel metadata request processed information.  
@property (nonatomic, readonly, strong) PNFetchChannelMetadataData *data;  
  
@end  
`
```

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Channel Metadata (Builder Pattern)[​](#get-channel-metadata-builder-pattern)

#### Method(s)[​](#methods-11)

```
`objects()  
    .channelMetadata(NSString *)  
    .includeFields(PNChannelFields)  
    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel for which associated `metadata` should be fetched.`includeFields`Type: NSStringBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

`block` *Type: PNFetchChannelMetadataCompletionBlock`Fetch channel metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-11)

```
`self.client.objects().channelMetadata(@"channel")  
    .includeFields(PNChannelCustomField)  
    .performWithCompletion(^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
             * Channel metadata successfully fetched.  
             * Channel metadata information available here: result.data.metadata  
             */  
        } else {  
            /**  
             * Handle channel metadata fetch error. Check 'category' property to find out possible  
             * issue because of which request did fail.  
             *  
             * Request can be resent using: [status retry]  
             */  
`
```
show all 17 lines

#### Response[​](#response-11)

Response objects which is returned by client when `fetch channel metadata` Object API is used:

```
`@interface PNFetchChannelMetadataData : PNServiceData  
  
// Requested channel metadata object.  
@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
  
@end  
  
@interface PNFetchChannelsMetadataResult : PNResult  
  
// Fetch channel metadata request processed information.  
@property (nonatomic, readonly, strong) PNFetchChannelMetadataData *data;  
  
@end  
`
```

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a Channel in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-12)

To `Set Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)setChannelMetadataWithRequest:(PNSetChannelMetadataRequest *)request   
                           completion:(nullable PNSetChannelMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNSetChannelMetadataRequest](#pnsetchannelmetadatarequest)`Set channel metadata` request with all information which should be associated with `channel`.`block`Type: PNSetChannelMetadataCompletionBlock`Set channel metadata` request completion `block`.

#### PNSetChannelMetadataRequest[​](#pnsetchannelmetadatarequest)

*  requiredParameterDescription`custom`Type: NSDictionaryAdditional / complex attributes which should be stored in metadata associated with specified channel. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.`information`Type: NSStringDescription which should be stored in metadata associated with specified channel.`includeFields`Type: PNChannelFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

`name`Type: NSStringName which should be stored in metadata associated with specified channel.`channel`Type: NSStringCreate and configure set channel metadata request. `channel` - Name of channel for which metadata should be set.`status`Type: NSStringThe custom status of the channel.`type`Type: NSStringThe custom type of the channel.`ifMatchesEtag`Type: NSStringThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Basic Usage[​](#basic-usage-12)

```
`PNSetChannelMetadataRequest *request = [PNSetChannelMetadataRequest requestWithChannel:@"channel"];  
// Add this request option, if returned metadata model should have value which has been set to  
// 'custom' property.  
request.includeFields = PNChannelCustomField;  
request.custom = @{ @"responsibilities": @"Manage tests", @"status": @"offline" };  
request.name = @"Updated channel name";  
  
[self.client setChannelMetadataWithRequest:request completion:^(PNSetChannelMetadataStatus *status) {  
    if (!status.isError) {  
        /**  
         * Channel metadata successfully has been set.  
         * Channel metadata information available here: status.data.metadata  
         */  
    } else {  
        /**  
`
```
show all 22 lines

#### Response[​](#response-12)

Response objects which is returned by client when `set channel metadata` Object API is used:

```
`@interface PNSetChannelMetadataData : PNServiceData  
  
// Associated channel's metadata object.  
@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
  
@end  
  
@interface PNSetChannelMetadataStatus : PNAcknowledgmentStatus  
  
// Set channel metadata request processed information.  
@property (nonatomic, readonly, strong) PNSetChannelMetadataData *data;  
  
@end  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// Assume 'client' is an initialized PubNub instance as shown in previous examples.  
// PubNub *client = [PubNub clientWithConfiguration:config];  
  
NSString *channel = @"demo_example";  
NSString *initialName = @"Initial Channel Name";  
NSString *initialDescription = @"Initial channel description.";  
NSDictionary *initialCustom = @{ @"location": @"default_location" };  
  
// First, set some initial metadata for the channel  
PNSetChannelMetadataRequest *initialSetRequest = [PNSetChannelMetadataRequest requestWithChannel:channel];  
initialSetRequest.name = initialName;  
initialSetRequest.information = initialDescription;  
`
```
show all 65 lines

### Set Channel Metadata (Builder Pattern)[​](#set-channel-metadata-builder-pattern)

#### Method(s)[​](#methods-13)

```
`objects()  
    .setChannelMetadata(NSString *)  
    .includeFields(PNChannelFields)  
    .channel(NSString)  
    .name(NSString)  
    .information(NSString)  
    .custom(NSDictionary)  
    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

*  requiredParameterDescription`channel` *Type: NSStringName of channel with which new `metadata` should be associated.`name`Type: NSStringName which should stored in `metadata` associated with specified `channel`.`information`Type: NSStringDescription which should be stored in `metadata` associated with specified `channel`.`custom`Type: NSDictionaryAdditional information which should be stored in `metadata` associated with specified `channel`. [App Context filtering language](/docs/general/metadata/filtering) doesn't support filtering by custom properties.`includeFields`Type: PNChannelFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNChannelCustomField` - include field with additional information from metadata which has been used during channel metadata set requests.
- `PNChannelStatusField` - include field with `metadata` status which has been used during `channel metadata set` requests
- `PNChannelTypeField` - Include field with `metadata` type which has been used during `channel metadata set` requests.

`block`Type: PNSetChannelMetadataCompletionBlock`Set channel metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-13)

```
`self.client.objects().setChannelMetadata(@"channel")  
    .name(@"Admin")  
    .information(@"Administrative channel")  
    .custom(@{ @"responsibilities": @"Manage access to protected resources" })  
    .includeFields(PNChannelCustomField)  
    .performWithCompletion(^(PNSetChannelMetadataStatus *status) {  
      if (!status.isError) {  
          /**  
           * Channel metadata successfully has been set.  
           * Channel metadata information available here: status.data.metadata  
           */  
      } else {  
          /**  
           * Handle channel metadata update error. Check 'category' property to find out possible  
           * issue because of which request did fail.  
`
```
show all 20 lines

#### Response[​](#response-13)

Response objects which is returned by client when `set channel metadata` Object API is used:

```
`@interface PNSetChannelMetadataData : PNServiceData  
  
// Associated channel's metadata object.  
@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
  
@end  
  
@interface PNSetChannelMetadataStatus : PNAcknowledgmentStatus  
  
// Set channel metadata request processed information.  
@property (nonatomic, readonly, strong) PNSetChannelMetadataData *data;  
  
@end  
`
```

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-14)

To `Remove Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeChannelMetadataWithRequest:(PNRemoveChannelMetadataRequest *)request   
                              completion:(nullable PNRemoveChannelMetadataCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveChannelMetadataRequest](#pnremovechannelmetadatarequest)`Remove channel metadata` request with information about existing metadata.`block`Type: PNRemoveChannelMetadataCompletionBlock`Remove channel metadata` request completion `block`.

#### PNRemoveChannelMetadataRequest[​](#pnremovechannelmetadatarequest)

*  requiredParameterDescription`channel`Type: NSStringCreate and configure remove channel metadata request. `channel` - Name of channel for which metadata should be removed.

#### Basic Usage[​](#basic-usage-14)

```
`PNRemoveChannelMetadataRequest *request = [PNRemoveChannelMetadataRequest requestWithChannel:@"channel"];  
  
[self.client removeChannelMetadataWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
    if (!status.isError) {  
        // Channel metadata successfully removed.  
    } else {  
        /**  
         * Handle channel metadata remove error. Check 'category' property to find out possible  
         * issue because of which request did fail.  
         *  
         * Request can be resent using: [status retry]  
         */  
    }  
}];  
`
```

#### Response[​](#response-14)

Response objects which is returned by client when `remove channel metadata` Object API is used:

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

### Remove Channel Metadata (Builder Pattern)[​](#remove-channel-metadata-builder-pattern)

#### Method(s)[​](#methods-15)

```
`objects()  
    .removeChannelMetadata(NSString *)  
    .performWithCompletion(nullable PNRemoveChannelMetadataCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel for which associated `metadata` should be removed.`block`Type: PNRemoveChannelMetadataCompletionBlock`Remove channel metadata` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-15)

```
`self.client.objects().removeChannelMetadata(@"channel")  
    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
        if (!status.isError) {  
            // Channel metadata successfully removed.  
        } else {  
            /**  
             * Handle channel metadata remove error. Check 'category' property to find out possible  
             * issue because of which request did fail.  
             *  
             * Request can be resent using: [status retry]  
             */  
        }  
    });  
`
```

#### Response[​](#response-15)

Response objects which is returned by client when `remove channel metadata` Object API is used:

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

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-16)

To `Get Memberships` you can use the following method(s) in the Objective-C SDK:

```
`- (void)membershipsWithRequest:(PNFetchMembershipsRequest *)request   
                    completion:(PNFetchMembershipsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchMembershipsRequest](#pnfetchmembershipsrequest)`Fetch UUID's memberships` request with all information which should be used to fetch existing `UUID's memberships`.`block` *Type: PNFetchMembershipsCompletionBlock`Fetch UUID's memberships` request completion `block`.

#### PNFetchMembershipsRequest[​](#pnfetchmembershipsrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNMembershipFieldsBitfield set to fields that should be included in the response. **Supported fields:** 
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include additional information from `metadata` associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include `metadata` status associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include `metadata` type associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel`'s `metadata` in the response (not only the name).
- `PNMembershipChannelCustomField` - include `channel`'s additional information used during `channel` `metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` used during `channel` `metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` used during `channel` `metadata set` requests.

 The default value (`PNMembershipsTotalCountField`) can be reset by setting it to 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of members to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-16)

```
`PNFetchMembershipsRequest *request = [PNFetchMembershipsRequest requestWithUUID:@"uuid"];  
request.start = @"";  
// Add this request option, if returned membership models should have value which has been set to  
// 'custom' and 'channel' properties.  
request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
request.limit = 40;  
  
[self.client membershipsWithRequest:request  
                         completion:^(PNFetchMembershipsResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * UUID's memberships successfully fetched.  
         * Result object has following information:  
         *   result.data.memberships - List of UUID's memberships.  
`
```
show all 28 lines

#### Response[​](#response-16)

Response objects which is returned by client when `fetch memberships` Object API is used:

```
`@interface PNFetchMembershipsData : PNServiceData  
  
// List of fetched memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of members created for current subscribe key.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Channel Memberships (Builder Pattern)[​](#get-channel-memberships-builder-pattern)

#### Method(s)[​](#methods-17)

```
`objects()  
    .memberships()  
    .uuid(NSString *)  
    .includeFields(PNMembershipFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(PNFetchMembershipsCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringName of channel from which members should be fetched.`includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block` *Type: PNFetchMembershipsCompletionBlock`Fetch UUID's memberships` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-17)

```
`self.client.objects().memberships()  
    .uuid(@"uuid")  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
    .performWithCompletion(^(PNFetchMembershipsResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
             * UUID's memberships successfully fetched.  
             * Result object has following information:  
             *   result.data.memberships - List of UUID's memberships.  
             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   result.data.totalCount - Total number of UUID's memberships.  
             */  
`
```
show all 24 lines

#### Response[​](#response-17)

Response objects which is returned by client when `fetch memberships` Object API is used:

```
`@interface PNFetchMembershipsData : PNServiceData  
  
// List of fetched memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of members created for current subscribe key.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a UUID.

#### Method(s)[​](#methods-18)

To `Set Memberships` you can use the following method(s) in the Objective-C SDK:

```
`- (void)setMembershipsWithRequest:(PNSetMembershipsRequest *)request   
                       completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNSetMembershipsRequest](#pnsetmembershipsrequest)`Set UUID's memberships` request with information which should be used to set `channels` membership.`block`Type: PNManageMembershipsCompletionBlock`Set UUID's memberships` request completion `block`.

#### PNSetMembershipsRequest[​](#pnsetmembershipsrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Basic Usage[​](#basic-usage-18)

```
`NSArrayNSDictionary *> *channels = @[  
  @{   
    @"channel": @"channel1",   
    @"status": @"active",  
    @"type": @"public",   
    @"custom": @{ @"role": @"moderator" }   
  }  
];  
  
PNSetMembershipsRequest *request = [PNSetMembershipsRequest requestWithUUID:@"uuid"  
                                                                   channels:channels];  
// Add this request option, if returned membership models should have value which has been set to  
// 'custom' and 'channel' properties.  
request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
request.limit = 40;  
`
```
show all 35 lines

#### Response[​](#response-18)

Response objects which is returned by client when `set memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Set Channel Memberships (Builder Pattern)[​](#set-channel-memberships-builder-pattern)

#### Method(s)[​](#methods-19)

```
`objects()  
    .setMemberships()  
    .uuid(NSString *)  
    .channels(NSArrayNSDictionary *> *)  
    .includeFields(PNMembershipFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

*  requiredParameterDescription`uuid`Type: NSStringIdentifier for which memberships should be set. Default: configured PubNub client `uuid``channels`Type: NSArrayList of `channels` for which `metadata` associated with each of them in context of `UUID` should be set. Each entry is dictionary with `channel` and `optional` `custom` fields. `custom` should be dictionary with simple objects: `NSString` and `NSNumber`.`includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageMembershipsCompletionBlock`Set UUID's memberships` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-19)

```
`NSArrayNSDictionary *> *channels = @[  
  @{   
    @"channel": @"channel1",   
    @"status": @"active",  
    @"type": @"public",   
    @"custom": @{ @"role": @"moderator" }   
  }  
];  
  
self.client.objects().setMemberships()  
    .uuid(@"uuid")  
    .channels(channels)  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(NMembershipCustomField | PNMembershipChannelField)  
`
```
show all 34 lines

#### Response[​](#response-19)

Response objects which is returned by client when `set memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a UUID.

#### Method(s)[​](#methods-20)

To `Remove Memberships` you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeMembershipsWithRequest:(PNRemoveMembershipsRequest *)request   
                          completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveMembershipsRequest](#pnremovemembershipsrequest)`Remove UUID's memberships` request with information which should be used to remove `channels` membership.`block`Type: PNManageMembershipsCompletionBlock`Remove UUID's memberships` request completion block.

#### PNRemoveMembershipsRequest[​](#pnremovemembershipsrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-20)

```
`NSArrayNSString *> *channels = @[@"channel1", @"channel2"];  
PNRemoveMembershipsRequest *request = [PNRemoveMembershipsRequest requestWithUUID:@"uuid"  
                                                                         channels:channels];  
// Add this request option, if returned membership models should have value which has been set to  
// 'custom' and 'channel' properties.  
request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
request.limit = 40;  
  
[self.client removeMembershipsWithRequest:request  
                               completion:^(PNManageMembershipsStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * UUID's memberships successfully removed.  
         * Result object has following information:  
`
```
show all 29 lines

#### Response[​](#response-20)

Response objects which is returned by client when `remove memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Remove Channel Memberships (Builder Pattern)[​](#remove-channel-memberships-builder-pattern)

#### Method(s)[​](#methods-21)

```
`objects()  
    .removeMemberships()  
    .uuid(NSString *)  
    .channels(NSArrayNSString *> *)  
    .includeFields(PNMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringIdentifier for which memberships should be removed. Default: configured PubNub client `uuid``channels`Type: NSArrayList of `channels` from which `UUID` should be removed as `member`.`includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`includeCount`Type: BOOLWhether total count of `members` should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageMembershipsCompletionBlock`Remove UUID's memberships` request completion block.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-21)

```
`self.client.objects().removeMemberships()  
    .uuid(@"uuid")  
    .channels(@[@"channel1", @"channel2"])  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
    .performWithCompletion(^(PNManageMembershipsStatus *status) {  
        if (!status.isError) {  
            /**  
             * UUID's memberships successfully removed.  
             * Result object has following information:  
             *   status.data.memberships - List of UUID's existing memberships.  
             *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   status.data.totalCount - Total number of UUID's memberships.  
`
```
show all 25 lines

#### Response[​](#response-21)

Response objects which is returned by client when `remove memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Manage Channel Memberships[​](#manage-channel-memberships)

The method Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-22)

To `Manage Memberships` you can use the following method(s) in the Objective-C SDK:

```
`- (void)manageMembershipsWithRequest:(PNManageMembershipsRequest *)request   
                          completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNManageMembershipsRequest](#pnmanagemembershipsrequest)`Manage UUID's memberships` request with information what modifications to `UUID's memberships` should be done (`set` / `remove` `channels`).`block`Type: PNManageMembershipsCompletionBlock`Manage UUID's memberships` request completion `block`.

#### PNManageMembershipsRequest[​](#pnmanagemembershipsrequest)

*  requiredParameterDescription`setChannels`Type: NSArray`<NSDictionary *>`List of channels within which UUID should be set as member. Each entry is dictionary with channel and optional `custom` fields. `custom` should be dictionary with simple objects: NSString and NSNumber.`removeChannels`Type: NSArray`<NSString *>`List of channels from which UUID should be removed as member.`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-22)

```
`PNManageMembershipsRequest *request = [PNManageMembershipsRequest requestWithUUID:@"uuid"];  
request.setChannels = @[  
    @{ @"channel": @"channel1", @"custom": @{ @"role": @"moderator" } }  
];  
request.removeChannels = @[@"channel3", @"channel4"];  
// Add this request option, if returned membership models should have value which has been set to  
// 'custom' and 'channel' properties.  
request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
request.limit = 40;  
  
[self.client manageMembershipsWithRequest:request  
                               completion:^(PNManageMembershipsStatus *status) {  
  
    if (!status.isError) {  
        /**  
`
```
show all 31 lines

#### Response[​](#response-22)

Response objects which is returned by client when `manage memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Manage Channel Memberships (Builder Pattern)[​](#manage-channel-memberships-builder-pattern)

#### Method(s)[​](#methods-23)

```
`objects()  
    .manageMemberships()  
    .uuid(NSString *)  
    .set(NSArrayNSDictionary *> *)  
    .remove(NSArrayNSString *> *)  
    .includeFields(PNMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringIdentifier for which memberships should be set. Default: configured PubNub client `uuid``set`Type: NSArrayList of `channels` for which `metadata` associated with each of them in context of `UUID` should be set. Each entry is dictionary with `channel` and `optional` `custom` fields. `custom` should be dictionary with simple objects: `NSString` and `NSNumber`.`remove`Type: NSArrayList of `channels` from which `UUID` should be removed as `member`.`includeFields`Type: PNMembershipFieldsBitfield set to fields which should be returned with response. **Supported fields:**  
- `PNMembershipsTotalCountField` - include how many memberships `UUID` has.
- `PNMembershipCustomField` - include field with additional information from `metadata` which has been associated with `UUID` during `membership set` requests.
- `PNMembershipStatusField` - include field with `metadata` status which has been associated with `UUID` during `membership set` requests.
- `PNMembershipTypeField` - include field with `metadata` type which has been associated with `UUID` during `membership set` requests.
- `PNMembershipChannelField` - include `channel's metadata` into response (not only name).
- `PNMembershipChannelCustomField` - include `channel's` additional information which has been used during `channel metadata set` requests.
- `PNMembershipChannelStatusField` - include `channel`'s `status` which has been used during `channel metadata set` requests.
- `PNMembershipChannelTypeField` - include `channel`'s `type` which has been used during `channel metadata set` requests.

`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageMembershipsCompletionBlock`Manage UUID's memberships` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-23)

```
`NSArrayNSDictionary *> *setChannels = @[  
    @{ @"channel": @"channel1", @"custom": @{ @"role": @"moderator" } }  
];  
NSArrayNSString *> *removeChannels = @[@"channel3", @"channel4"];  
  
self.client.objects().manageMemberships()  
    .uuid(@"uuid")  
    .set(setChannels)  
    .remove(removeChannels)  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
    .performWithCompletion(^(PNManageMembershipsStatus *status) {  
        if (!status.isError) {  
            /**  
`
```
show all 31 lines

#### Response[​](#response-23)

Response objects which is returned by client when `manage memberships` Object API is used:

```
`@interface PNManageMembershipsData : PNServiceData  
  
// List of existing memberships.  
@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-24)

To `Get Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`- (void)channelMembersWithRequest:(PNFetchChannelMembersRequest *)request   
                       completion:(PNFetchChannelMembersCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNFetchChannelMembersRequest](#pnfetchchannelmembersrequest)`Fetch channel's members` request with all information which should be used to fetch existing `channel's members`.`block` *Type: PNFetchChannelMembersCompletionBlock`Fetch channel's members` request completion block.

#### PNFetchChannelMembersRequest[​](#pnfetchchannelmembersrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of members to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-24)

```
`PNFetchChannelMembersRequest *request = [PNFetchChannelMembersRequest requestWithChannel:@"channel"];  
request.start = @"";  
// Add this request option, if returned member models should have value which has been set to  
// 'custom' and 'uuid' properties.  
request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
request.limit = 40;  
  
[self.client channelMembersWithRequest:request  
                            completion:^(PNFetchChannelMembersResult *result, PNErrorStatus *status) {  
  
    if (!status.isError) {  
        /**  
         * Channel's members successfully fetched.  
         * Result object has following information:  
         *   result.data.members - List of channel's members.  
`
```
show all 28 lines

#### Response[​](#response-24)

Response objects which is returned by client when `fetch members` Object API is used:

```
`@interface PNFetchChannelMembersData : PNServiceData  
  
// List of fetched members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of members created for current subscribe key.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Get Channel Members (Builder Pattern)[​](#get-channel-members-builder-pattern)

#### Method(s)[​](#methods-25)

```
`objects()  
    .channelMembers(NSString *)  
    .includeFields(PNChannelMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(PNFetchChannelMembersCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which members should be fetched.`includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block` *Type: PNFetchChannelMembersCompletionBlock`Fetch channel's members` request completion block.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-25)

```
`self.client.objects().channelMembers(@"channel")  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNChannelMemberCustomField | PNChannelMemberUUIDField)  
    .performWithCompletion(^(PNFetchChannelMembersResult *result, PNErrorStatus *status) {  
        if (!status.isError) {  
            /**  
             * Channel's members successfully fetched.  
             * Result object has following information:  
             *   result.data.members - List of channel's members.  
             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   result.data.totalCount - Total number of channel's members.  
             */  
        } else {  
`
```
show all 23 lines

#### Response[  ​](#response-25)

Response objects which is returned by client when `fetch members` Object API is used:

```
`@interface PNFetchChannelMembersData : PNServiceData  
  
// List of fetched members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of members created for current subscribe key.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

Error response which is used in case of App Context API call failure:

```
`@interface PNErrorData : PNServiceData  
  
// Stringified error information.  
@property (nonatomic, readonly, strong) NSString *information;  
  
@end  
  
@interface PNErrorStatus : PNStatus  
  
// Whether status object represent error or not.  
@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
  
// Additional information related to error status object.  
@property (nonatomic, readonly, strong) PNErrorData *errorData;  
  
`
```
show all 16 lines

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-26)

To `Set Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`- (void)setChannelMembersWithRequest:(PNSetChannelMembersRequest *)request   
                          completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNSetChannelMembersRequest](#pnsetmembersrequest)`Set channel's members` list request with information which should be used to set `UUID` member.`block`Type: PNManageChannelMembersCompletionBlock`Set channel's members` list request completion `block`.

#### PNSetMembersRequest[​](#pnsetmembersrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Basic Usage[​](#basic-usage-26)

```
`NSArrayNSDictionary *> *uuids = @[  
  @{   
    @"uuid": @"uuid2"  
    @"status": @"active",  
    @"type": @"admin",  
    @"custom": @{ @"role": @"moderator" }   
  }  
];  
  
PNSetChannelMembersRequest *request = [PNSetChannelMembersRequest requestWithChannel:@"channel" uuids:uuids];  
// Add this request option, if returned member models should have value which has been set to  
// 'custom' and 'uuid' properties.  
request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
request.limit = 40;  
  
`
```
show all 34 lines

#### Response[​](#response-26)

Response objects which is returned by client when `set members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData  
  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Set Channel Members (Builder Pattern)[​](#set-channel-members-builder-pattern)

#### Method(s)[​](#methods-27)

```
`objects()  
    .setChannelMembers(NSString *)  
    .uuids(NSArrayNSDictionary *> *)  
    .includeFields(PNChannelMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which members should be set.`uuids`Type: NSArrayList of `UUIDs` for which `metadata` associated with each of them in context of `channel` should be set. Each entry is dictionary with `UUID` and `optional` `custom` fields. `custom` should be dictionary with simple objects: `NSString` and `NSNumber`.`includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. Only objects whose properties satisfy the given expression are returned. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageChannelMembersCompletionBlock`Set channel's members` list request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-27)

```
`NSArrayNSDictionary *> *uuids = @[  
  @{   
    @"uuid": @"uuid2"  
    @"status": @"active",  
    @"type": @"admin",  
    @"custom": @{ @"role": @"moderator" }   
  }  
];  
  
self.client.objects().setChannelMembers(@"channel")  
    .uuids(uuids)  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)  
    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
`
```
show all 33 lines

#### Response[​](#response-27)

Response objects which is returned by client when `set members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData  
  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-28)

To `Remove Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`- (void)removeChannelMembersWithRequest:(PNRemoveChannelMembersRequest *)request   
                             completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNRemoveChannelMembersRequest](#pnremovechannelmembersrequest)`Remove channel's members` request with information which should be used to remove `UUID` members.`block`Type: PNManageChannelMembersCompletionBlock`Remove channel's members` request completion `block`.

#### PNRemoveChannelMembersRequest[​](#pnremovechannelmembersrequest)

*  requiredParameterDescription`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-28)

```
`NSArrayNSString *> *uuids = @[@"uuid3", @"uuid4"];  
PNRemoveChannelMembersRequest *request = [PNRemoveChannelMembersRequest requestWithChannel:@"channel"  
                                                                                     uuids:uuids];  
// Add this request option, if returned member models should have value which has been set to  
// 'custom' and 'uuid' properties.  
request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
request.limit = 40;  
  
[self.client removeChannelMembersWithRequest:request completion:^(PNManageChannelMembersStatus *status) {  
    if (!status.isError) {  
        /**  
         * Channel's members successfully removed.  
         * Result object has following information:  
         *   result.data.members - List of channel's existing members.  
         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
`
```
show all 27 lines

#### Response[​](#response-28)

Response objects which is returned by client when `remove members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData  
  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Remove Channel Members (Builder Pattern)[​](#remove-channel-members-builder-pattern)

#### Method(s)[​](#methods-29)

```
`objects()  
    .removeChannelMembers(NSString *)  
    .uuids(NSArrayNSString *> *)  
    .includeFields(PNChannelMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which members should be removed.`uuids`Type: NSArrayList of `UUIDs` which should be removed from `channel's` list.`includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`includeCount`Type: BOOLWhether total count of `members` should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageChannelMembersCompletionBlock`Remove channel's members` request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-29)

```
`self.client.objects().removeChannelMembers(@"channel")  
    .uuids(@[@"uuid3", @"uuid4"])  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)  
    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
        if (!status.isError) {  
            /**  
             * Channel's members successfully removed.  
             * Result object has following information:  
             *   result.data.members - List of channel's existing members.  
             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
             *   result.data.totalCount - Total number of channel's members.  
             */  
`
```
show all 24 lines

#### Response[​](#response-29)

Response objects which is returned by client when `remove members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData  
  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Manage Channel Members[​](#manage-channel-members)

The method Set and Remove channel memberships for a user.

#### Method(s)[​](#methods-30)

To `Manage Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`- (void)manageChannelMembersWithRequest:(PNManageChannelMembersRequest *)request   
                             completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNManageChannelMembersRequest](#pnmanagechannelmembersrequest)`Manage channel's members` list request with information what modifications to `channel's` members list should be done (`set` / `remove` `UUID`).`block`Type: PNManageChannelMembersCompletionBlock`Manage channel's members` list request completion `block`.

#### PNManageChannelMembersRequest[​](#pnmanagechannelmembersrequest)

*  requiredParameterDescription`setMembers`Type: NSArray`<NSDictionary *`>List of UUIDs which should be added to channel's members list. Each entry is dictionary with uuid and optional `custom` fields. `custom` should be dictionary with simple objects: NSString and NSNumber.`removeMembers`Type: NSArray`<NSString *>`BList of UUIDs which should be removed from channel's list.`sort`Type: NSArray`<NSString *>`List of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`limit`Type: NSUIntegerNumber of objects to return in response. Will be set to 100 (which is also maximum value) if not specified.

#### Basic Usage[​](#basic-usage-30)

```
`PNManageChannelMembersRequest *request = [PNManageChannelMembersRequest requestWithChannel:@"channel"];  
request.setMembers = @[  
    @{ @"uuid": @"uuid2", @"custom": @{ @"role": @"moderator" } }  
];  
request.removeMembers = @[@"uuid3", @"uuid4"];  
// Add this request option, if returned member models should have value which has been set to  
// 'custom' and 'uuid' properties.  
request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
request.limit = 40;  
  
[self.client manageChannelMembersWithRequest:request  
                               completion:^(PNManageChannelMembersStatus *status) {  
  
    if (!status.isError) {  
        /**  
`
```
show all 31 lines

#### Response[​](#response-30)

Response objects which is returned by client when `manage members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData  
  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 lines

### Manage Channel Members (Builder Pattern)[​](#manage-channel-members-builder-pattern)

#### Method(s)[​](#methods-31)

```
`objects()  
    .manageChannelMembers(NSString *)  
    .set(NSArrayNSDictionary *> *)  
    .remove(NSArrayNSString *> *)  
    .includeFields(PNChannelMemberFields)  
    .includeCount(BOOL)  
    .filter(NSString *)  
    .sort(NSArrayNSString *> *)  
    .limit(NSUInteger)  
    .start(NSString *)  
    .end(NSString *)  
    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

*  requiredParameterDescription`channel` *Type: NSStringName of channel from which members should be managed.`set`Type: NSArrayList of `UUIDs` which should be added to `channel's` members list. Each entry is dictionary with `UUID` and `optional` `custom` fields. `custom` should be dictionary with simple objects: `NSString` and `NSNumber`.`remove`Type: NSArrayList of `UUIDs` which should be removed from `channel's` list.`includeFields`Type: PNChannelMemberFieldsBitfield set to fields that should be returned with the response. **Supported fields:** 
- `PNChannelMembersTotalCountField` - include how many members the channel has.
- `PNChannelMemberCustomField` - include field with additional information from `metadata` associated with `UUID` during `channel member set` requests.
- `PNChannelMemberStatusField` - include field with `metadata` status associated with `UUID` during `channel member set` requests.
- `PNChannelMemberTypeField` - include field with `metadata` type associated with `UUID` during `channel member set` requests.
- `PNChannelMemberUUIDField` - include `UUID`'s `metadata` in the response (not only the identifier).
- `PNChannelMemberUUIDCustomField` - include `UUID`'s additional information used during `UUID metadata set` requests.
- `PNChannelMemberUUIDStatusField` - include `UUID`'s `status` used during `UUID metadata set` requests.
- `PNChannelMemberUUIDTypeField` - include `UUID`'s `type` used during `UUID metadata set` requests.

 The default value (`PNChannelMembersTotalCountField`) can be reset by setting it to 0.`includeCount`Type: BOOLWhether total count of objects should be included in response or not. Default: `YES``filter`Type: NSStringExpression to filter out results basing on specified criteria. For more details on the supported grammar, check [this](/docs/general/metadata/filtering)`sort`Type: NSArrayList of criteria (name of field) which should be used for sorting in ascending order. Available options are `id`, `name`, and `updated`. Use `asc` or `desc` to specify sort direction. For example: `{name: 'asc'}``limit`Type: NSUIntegerMaximum number of objects per fetched page. Default: `100` (which is also maximum value)`start`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.`end`Type: NSStringRandom string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data. Ignored if the `start` parameter is supplied.`block`Type: PNManageChannelMembersCompletionBlock`Set channel's members` list request completion `block`.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Basic Usage[​](#basic-usage-31)

```
`NSArrayNSDictionary *> *setMembers = @[  
    @{ @"uuid": @"uuid2", @"custom": @{ @"role": @"moderator" } }  
];  
NSArrayNSDictionary *> *removeMembers = @[@"uuid3", @"uuid4"];  
  
self.client.objects().manageChannelMembers(@"channel")  
    .set(setMembers)  
    .remove(removeMembers)  
    .includeCount(YES)  
    .limit(40)  
    .includeFields(PNChannelMemberCustomField | PNChannelMemberUUIDField)  
    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
        if (!status.isError) {  
            /**  
             * Channel's members successfully changed.  
`
```
show all 30 lines

#### Response[​](#response-31)

Response objects which is returned by client when `manage members` Object API is used:

```
`@interface PNManageChannelMembersData : PNServiceData**  
// List of existing members.  
@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
@property (nonatomic, nullable, readonly, strong) NSString *next;  
  
// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
@property (nonatomic, nullable, readonly, strong) NSString *prev;  
  
/**  
 * Total number of existing objects.  
 *  
 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
`
```
show all 28 linesLast updated on May 29, 2025**