# App Context API for Objective-C SDK (Objects section)

App Context (formerly Objects v2) provides serverless storage for user/channel metadata and membership associations. Object events fire on set/update/remove; re-setting identical data does not trigger events.

---

## User

### Get metadata for all users

Returns a paginated list of UUID metadata objects, optionally including custom/status/type fields and total count.

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** for your keyset in the [Admin Portal](https://admin.pubnub.com).

#### Method(s)

To `Get All UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)allUUIDMetadataWithRequest:(PNFetchAllUUIDMetadataRequest *)request   
2                        completion:(PNFetchAllUUIDMetadataCompletionBlock)block;  
`
```

- `request` *(PNFetchAllUUIDMetadataRequest)*: fetch configuration  
- `block` *(PNFetchAllUUIDMetadataCompletionBlock)*: completion

#### PNFetchAllUUIDMetadataRequest

- `sort` *(NSArray<NSString *>)*: sort by `id`, `name`, `updated` with `asc/desc` (example: `{name: 'asc'}`)
- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDTotalCountField`, `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField`. Default: `PNUUIDTotalCountField` (set `0` to reset).
- `filter` *(NSString)*: filter expression (see [filtering](/docs/general/metadata/filtering))
- `start` *(NSString)*: cursor pagination
- `end` *(NSString)*: cursor pagination (ignored if `start` is set)
- `limit` *(NSUInteger)*: default/max `100`

#### Sample code

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Basic configuration  
5PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
6                                                          subscribeKey:@"demo"  
7                                                                userID:@"metadataUser"];  
8
  
9// Create a PubNub client instance  
10PubNub *client = [PubNub clientWithConfiguration:config];  
11
  
12// Example 1: Basic UUID metadata fetch  
13NSLog(@"Fetching all UUID metadata...");  
14
  
15// Create a basic request  
16PNFetchAllUUIDMetadataRequest *request = [PNFetchAllUUIDMetadataRequest new];  
17
  
18// Include custom fields and total count in the response  
19request.includeFields = PNUUIDCustomField | PNUUIDTotalCountField;  
20
  
21// Limit the number of results  
22request.limit = 25;  
23
  
24// Make the request  
25[client allUUIDMetadataWithRequest:request  
26                        completion:^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {  
27    if (!status.isError) {  
28        NSLog(@"✅ Successfully fetched UUID metadata!");  
29          
30        // Log the total count  
31        NSLog(@"Total UUID metadata count: %@", @(result.data.totalCount));  
32          
33        // Log each metadata object  
34        for (PNUUIDMetadata *metadata in result.data.metadata) {  
35            NSLog(@"UUID: %@, Name: %@", metadata.uuid, metadata.name);  
36              
37            if (metadata.custom) {  
38                NSLog(@"Custom data: %@", metadata.custom);  
39            }  
40              
41            NSLog(@"Updated: %@", metadata.updated);  
42            NSLog(@"----------------");  
43        }  
44          
45        // Log pagination tokens  
46        if (result.data.next) {  
47            NSLog(@"Next page token: %@", result.data.next);  
48        }  
49          
50        if (result.data.prev) {  
51            NSLog(@"Previous page token: %@", result.data.prev);  
52        }  
53    } else {  
54        NSLog(@"❌ Error fetching UUID metadata: %@", status.errorData.information);  
55        NSLog(@"Error category: %@", @(status.category));  
56    }  
57}];  
58
  
59// Example 2: UUID metadata fetch with pagination  
60NSLog(@"Fetching UUID metadata with pagination...");  
61
  
62// Create a paginated request  
63PNFetchAllUUIDMetadataRequest *paginatedRequest = [PNFetchAllUUIDMetadataRequest new];  
64
  
65// Use this token from a previous request to get the next page  
66// In a real app, you would store this value from previous responses  
67paginatedRequest.start = @"dGhpc19pc19hX3NhbXBsZV90b2tlbg=="; // Sample token, replace with actual token  
68
  
69paginatedRequest.includeFields = PNUUIDCustomField | PNUUIDTotalCountField;  
70paginatedRequest.limit = 10; // Smaller limit to demonstrate pagination  
71
  
72// Sort by name in ascending order  
73paginatedRequest.sort = @[@"name:asc"];  
74
  
75[client allUUIDMetadataWithRequest:paginatedRequest  
76                        completion:^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {  
77    if (!status.isError) {  
78        /**  
79         * UUID metadata successfully fetched.  
80         * Result object has following information:  
81         *   result.data.metadata - List of fetched UUID metadata.  
82         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
83         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
84         *   result.data.totalCount - Total number of created UUID metadata.  
85         */  
86          
87        NSLog(@"✅ Successfully fetched paginated UUID metadata!");  
88        NSLog(@"Page size: %lu", (unsigned long)result.data.metadata.count);  
89          
90        // Store the next token for future pagination  
91        if (result.data.next) {  
92            NSLog(@"Next page token (save this for next request): %@", result.data.next);  
93        }  
94    } else {  
95        /**  
96         * Handle UUID metadata fetch error. Check 'category' property to find out possible  
97         * issue because of which request did fail.  
98         *  
99         * Request can be resent using: [status retry]  
100         */  
101        NSLog(@"❌ Error fetching paginated UUID metadata: %@", status.errorData.information);  
102    }  
103}];  
104
  
105// Example 3: UUID metadata fetch with filtering  
106NSLog(@"Fetching UUID metadata with filtering...");  
107
  
108PNFetchAllUUIDMetadataRequest *filteredRequest = [PNFetchAllUUIDMetadataRequest new];  
109
  
110// Filter for UUIDs with names containing "admin"  
111filteredRequest.filter = @"name LIKE '*admin*'";  
112
  
113// Include all available fields  
114filteredRequest.includeFields = PNUUIDCustomField | PNUUIDTotalCountField | PNUUIDStatusField | PNUUIDTypeField;  
115
  
116[client allUUIDMetadataWithRequest:filteredRequest  
117                        completion:^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {  
118    if (!status.isError) {  
119        NSLog(@"✅ Successfully fetched filtered UUID metadata!");  
120        NSLog(@"Found %lu UUIDs matching filter criteria", (unsigned long)result.data.metadata.count);  
121          
122        // Process the filtered results  
123        for (PNUUIDMetadata *metadata in result.data.metadata) {  
124            NSLog(@"UUID: %@, Name: %@", metadata.uuid, metadata.name);  
125              
126            if (metadata.type) {  
127                NSLog(@"Type: %@", metadata.type);  
128            }  
129              
130            if (metadata.status) {  
131                NSLog(@"Status: %@", metadata.status);  
132            }  
133        }  
134    } else {  
135        NSLog(@"❌ Error fetching filtered UUID metadata: %@", status.errorData.information);  
136    }  
137}];  

```

#### Response

Response returned by the client for `fetch all UUID metadata`:

```
1@interface PNFetchAllUUIDMetadataData : PNServiceData  
2
  
3// List of UUID metadata objects created for current subscribe key.  
4@property (nonatomic, readonly, strong) NSArrayPNUUIDMetadata *> *metadata;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of objects created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNUUIDTotalCountField not added to 'includeFields'  
16 * of PNFetchAllUUIDMetadataRequest.  
17 */  
18@property (nonatomic, readonly, assign) NSUInteger totalCount;  
19
  
20@end  
21
  
22@interface PNFetchAllUUIDMetadataResult : PNResult  
23
  
24// Fetch all UUID metadata request processed information.  
25@property (nonatomic, readonly, strong) PNFetchAllUUIDMetadataData *data;  
26
  
27@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get metadata for all users (builder pattern)

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** for your keyset in the [Admin Portal](https://admin.pubnub.com).

#### Method(s)

```
`1objects()  
2    .allUUIDMetadata()  
3    .includeFields(PNUUIDFields)  
4    .includeCount(BOOL)  
5    .filter(NSString *)  
6    .sort(NSArrayNSString *> *)  
7    .limit(NSUInteger)  
8    .start(NSString *)  
9    .end(NSString *)  
10    .performWithCompletion(PNFetchAllUUIDMetadataCompletionBlock);  
`
```

- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDTotalCountField`, `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField` (default `PNUUIDTotalCountField`, set `0` to reset)
- `includeCount` *(BOOL)*: include total count (default `YES`)
- `filter` *(NSString *)*: filter expression
- `sort` *(NSArray)*: sort by `id/name/updated` with `asc/desc`
- `limit` *(NSUInteger)*: default/max `100`
- `start` *(NSString *)*: pagination cursor
- `end` *(NSString *)*: pagination cursor (ignored if `start` set)
- `block` *(PNFetchAllUUIDMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().allUUIDMetadata()  
2    .start(@"")  
3    .includeFields(PNUUIDCustomField)  
4    .includeCount(YES)  
5    .limit(40)  
6    .performWithCompletion(^(PNFetchAllUUIDMetadataResult *result, PNErrorStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * UUID metadata successfully fetched.  
10             * Result object has following information:  
11             *   result.data.metadata - List of fetched UUID metadata.  
12             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
13             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
14             *   result.data.totalCount - Total number of created UUID metadata.  
15             */  
16        } else {  
17            /**  
18             * Handle UUID metadata fetch error. Check 'category' property to find out possible  
19             * issue because of which request did fail.  
20             *  
21             * Request can be resent using: [status retry]  
22             */  
23        }  
24    });  
`
```

#### Response

Response returned by the client for `fetch all UUID metadata`:

```
1@interface PNFetchAllUUIDMetadataData : PNServiceData  
2
  
3// List of UUID metadata objects created for current subscribe key.  
4@property (nonatomic, readonly, strong) NSArrayPNUUIDMetadata *> *metadata;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of objects created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNUUIDTotalCountField not added to 'includeFields'  
16 * of PNFetchAllUUIDMetadataRequest.  
17 */  
18@property (nonatomic, readonly, assign) NSUInteger totalCount;  
19
  
20@end  
21
  
22@interface PNFetchAllUUIDMetadataResult : PNResult  
23
  
24// Fetch all UUID metadata request processed information.  
25@property (nonatomic, readonly, strong) PNFetchAllUUIDMetadataData *data;  
26
  
27@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get user metadata

Returns metadata for the specified UUID.

#### Method(s)

To `Get UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)uuidMetadataWithRequest:(PNFetchUUIDMetadataRequest *)request   
2                     completion:(PNFetchUUIDMetadataCompletionBlock)block;  
`
```

- `request` *(PNFetchUUIDMetadataRequest)*
- `block` *(PNFetchUUIDMetadataCompletionBlock)*

#### PNFetchUUIDMetadataRequest

- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField`
- `uuid` *(NSString)*: identifier to fetch; defaults to configured client uuid if `nil`

#### Sample code

```
1PNFetchUUIDMetadataRequest *request = [PNFetchUUIDMetadataRequest requestWithUUID:@"uuid"];  
2// Add this request option, if returned metadata model should have value which has been set to  
3// 'custom' property.  
4request.includeFields = PNUUIDCustomField;  
5
  
6[self.client uuidMetadataWithRequest:request  
7                          completion:^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {  
8
  
9    if (!status.isError) {  
10        /**  
11         * UUID metadata successfully fetched.  
12         * Fetched UUID metadata information available here: result.data.metadata  
13         */  
14    } else {  
15        /**  
16         * Handle UUID metadata fetch error. Check 'category' property to find out possible issue  
17         * because of which request did fail.  
18         *  
19         * Request can be resent using: [status retry]  
20         */  
21    }  
22}];  

```

#### Response

Response returned by the client for `fetch UUID metadata`:

```
1@interface PNFetchUUIDMetadataData : PNServiceData  
2
  
3// Requested UUID metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNFetchUUIDMetadataResult : PNResult  
9
  
10// Fetch UUID metadata request processed information.  
11@property (nonatomic, readonly, strong) PNFetchUUIDMetadataData *data;  
12
  
13@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get user metadata (builder pattern)

#### Method(s)

```
`1objects()  
2    .uuidMetadata()  
3    .uuid(NSString *)  
4    .includeFields(PNUUIDFields)  
5    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);  
`
```

- `uuid` *(NSString)*: default configured client `uuid`
- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField`
- `block` *(PNFetchUUIDMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().uuidMetadata()  
2    .uuid(@"uuid")  
3    .includeFields(PNUUIDCustomField)  
4    .performWithCompletion(^(PNFetchUUIDMetadataResult *result, PNErrorStatus *status) {  
5      if (!status.isError) {  
6          /**  
7           * UUID metadata successfully fetched.  
8           * Fetched UUID metadata information available here: result.data.metadata  
9           */  
10      } else {  
11          /**  
12           * Handle UUID metadata fetch error. Check 'category' property to find out possible issue  
13           * because of which request did fail.  
14           *  
15           * Request can be resent using: [status retry]  
16           */  
17      }  
18    });  
`
```

#### Response

Response returned by the client for `fetch UUID metadata`:

```
1@interface PNFetchUUIDMetadataData : PNServiceData  
2
  
3// Requested UUID metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNFetchUUIDMetadataResult : PNResult  
9
  
10// Fetch UUID metadata request processed information.  
11@property (nonatomic, readonly, strong) PNFetchUUIDMetadataData *data;  
12
  
13@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Set user metadata

##### Unsupported partial updates of custom metadata
`custom` overwrites stored custom data. To add new custom fields, you must:  
1. $1  
2. $1  
3. $1  

#### Method(s)

To `Set UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)setUUIDMetadataWithRequest:(PNSetUUIDMetadataRequest *)request   
2                        completion:(nullable PNSetUUIDMetadataCompletionBlock)block;  
`
```

- `request` *(PNSetUUIDMetadataRequest)*
- `block` *(PNSetUUIDMetadataCompletionBlock)*

#### PNSetUUIDMetadataRequest

- `custom` *(NSDictionary)*: additional attributes (not filterable via App Context filtering)
- `externalId` *(NSString)*
- `profileUrl` *(NSString)*
- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField`
- `email` *(NSString)*
- `name` *(NSString)*
- `uuid` *(NSString)*: defaults to configured client uuid if `nil`
- `status` *(NSString)*
- `type` *(NSString)*
- `ifMatchesEtag` *(NSString)*: optimistic locking; mismatch => HTTP 412

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Sample code

```
1PNSetUUIDMetadataRequest *request = [PNSetUUIDMetadataRequest requestWithUUID:@"uuid"];  
2// With this option on, returned metadata model will have value which has been set to 'custom'  
3// property.  
4request.includeFields = PNUUIDCustomField;  
5request.custom = @{ @"age": @(39), @"status": @"Checking some stuff..." };  
6request.email = @"support@pubnub.com";  
7request.name = @"David";  
8
  
9[self.client setUUIDMetadataWithRequest:request completion:^(PNSetUUIDMetadataStatus *status) {  
10    if (!status.isError) {  
11        /**  
12         * UUID metadata successfully has been set.  
13         * UUID metadata information available here: status.data.metadata  
14         */  
15    } else {  
16        /**  
17         * Handle UUID metadata set error. Check 'category' property to find out possible issue  
18         * because of which request did fail.  
19         *  
20         * Request can be resent using: [status retry]  
21         */  
22    }  
23}];  

```

#### Response

Response returned by the client for `set UUID metadata`:

```
1@interface PNSetUUIDMetadataData : PNServiceData  
2
  
3// Updated UUID metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNSetUUIDMetadataStatus : PNAcknowledgmentStatus  
9
  
10// Set UUID metadata request processed information.  
11@property (nonatomic, readonly, strong) PNSetUUIDMetadataData *data;  
12
  
13@end  

```

---

### Set user metadata (builder pattern)

#### Method(s)

```
`1objects()  
2    .setUUIDMetadata()  
3    .uuid(NSString *)  
4    .name(NSString *)  
5    .externalId(NSString *)  
6    .profileUrl(NSString *)  
7    .custom(NSDictionary *)  
8    .email(NSString *)  
9    .includeFields(PNUUIDFields)  
10    .performWithCompletion(nullable PNSetUUIDMetadataCompletionBlock);  
`
```

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-user-metadata).

- `uuid` *(NSString)*: default configured client `uuid`
- `name`, `externalId`, `profileUrl`, `custom`, `email`
- `includeFields` *(PNUUIDFieldsBitfield)*: `PNUUIDCustomField`, `PNUUIDStatusField`, `PNUUIDTypeField`
- `block` *(PNSetUUIDMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().setUUIDMetadata()  
2    .uuid(@"uuid")  
3    .name(@"Serhii")  
4    .externalId(@"93FVfHUAf4RLu79J7Q3ejLVu")  
5    .profileUrl(@"https://pubnub.com")  
6    .custom(@{ @"age": @(36) })  
7    .email(@"support@pubnub.com")  
8    .includeFields(PNUUIDCustomField)  
9    .performWithCompletion(^(PNSetUUIDMetadataStatus *status) {  
10        if (!status.isError) {  
11            /**  
12             * UUID metadata successfully has been set.  
13             * UUID metadata information available here: status.data.metadata  
14             */  
15        } else {  
16            /**  
17             * Handle UUID metadata set error. Check 'category' property to find out possible issue  
18             * because of which request did fail.  
19             *  
20             * Request can be resent using: [status retry]  
21             */  
22        }  
23    });  
`
```

#### Response

Response returned by the client for `set UUID metadata`:

```
1@interface PNSetUUIDMetadataData : PNServiceData  
2
  
3// Updated UUID metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNUUIDMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNSetUUIDMetadataStatus : PNAcknowledgmentStatus  
9
  
10// Set UUID metadata request processed information.  
11@property (nonatomic, readonly, strong) PNSetUUIDMetadataData *data;  
12
  
13@end  

```

---

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)

To `Remove UUID Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)removeUUIDMetadataWithRequest:(PNRemoveUUIDMetadataRequest *)request   
2                           completion:(nullable PNRemoveUUIDMetadataCompletionBlock)block;  
`
```

- `request` *(PNRemoveUUIDMetadataRequest)*
- `block` *(PNRemoveUUIDMetadataCompletionBlock)*

#### PNRemoveUUIDMetadataRequest

- `uuid` *(NSString)*: defaults to configured client uuid if `nil`

#### Sample code

```
1PNRemoveUUIDMetadataRequest *request = [PNRemoveUUIDMetadataRequest requestWithUUID:@"uuid"];  
2
  
3[self.client removeUUIDMetadataWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
4    if (!status.isError) {  
5        // UUID metadata successfully removed.  
6    } else {  
7        /**  
8         * Handle UUID metadata remove error. Check 'category' property to find out possible  
9         * issue because of which request did fail.  
10         *  
11         * Request can be resent using: [status retry]  
12         */  
13    }  
14}];  

```

#### Response

Response returned by the client for `remove UUID metadata`:

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

---

### Remove user metadata (builder pattern)

#### Method(s)

```
1objects()  
2    .removeUUIDMetadata()  
3    .uuid(NSString *)  
4    .performWithCompletion(PNFetchUUIDMetadataCompletionBlock);  
5
  

```

- `uuid` *(NSString)*: default configured client `uuid`
- `block` *(PNRemoveUUIDMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().removeUUIDMetadata()  
2    .uuid(@"uuid")  
3    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
4        if (!status.isError) {  
5             // User successfully deleted.  
6        } else {  
7            /**  
8             * Handle user delete error. Check 'category' property to find out possible issue  
9             * because of which request did fail.  
10             *  
11             * Request can be resent using: [status retry]  
12             */  
13        }  
14    });  
`
```

#### Response

Response returned by the client for `remove UUID metadata`:

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

---

## Channel

### Get metadata for all channels

Returns a paginated list of channel metadata objects.

##### Required keyset configuration
To get all channel and user metadata, uncheck **Disallow Get All Channel Metadata** and **Disallow Get All User Metadata** in **App Context** for your keyset in the [Admin Portal](https://admin.pubnub.com).

#### Method(s)

To `Get All Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)allChannelsMetadataWithRequest:(PNFetchAllChannelsMetadataRequest *)request   
2                            completion:(PNFetchAllChannelsMetadataCompletionBlock)block;  
`
```

- `request` *(PNFetchAllChannelsMetadataRequest)*
- `block` *(PNFetchAllChannelsMetadataCompletionBlock)*

#### PNFetchAllChannelsMetadataRequest

- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelTotalCountField`, `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField` (default `PNChannelTotalCountField`, set `0` to reset)
- `sort` *(NSArray<NSString *>)*: `id`, `name`, `updated` with `asc/desc` (example `{name: 'asc'}`)
- `filter` *(NSString)*: filter expression
- `start` *(NSString)*: forward pagination cursor
- `end` *(NSString)*: backward pagination cursor (ignored if `start` set)
- `limit` *(NSUInteger)*: default/max `100`

#### Sample code

```
1PNFetchAllChannelsMetadataRequest *request = [PNFetchAllChannelsMetadataRequest new];  
2request.start = @"";  
3// Add this request option, if returned metadata models should have value which has been set to  
4// 'custom' property.  
5request.includeFields = PNUUIDCustomField | PNUUIDTotalCountField;  
6request.limit = 40;  
7
  
8[self.client allChannelsMetadataWithRequest:request  
9                                 completion:^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {  
10    if (!status.isError) {  
11        /**  
12         * Channels metadata successfully fetched.  
13         * Result object has following information:  
14         *   result.data.metadata - List of fetched channels metadata.  
15         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
16         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
17         *   result.data.totalCount - Total number of associated channel metadata.  
18    } else {  
19        /**  
20         * Handle channels metadata fetch error. Check 'category' property to find out possible  
21         * issue because of which request did fail.  
22         *  
23         * Request can be resent using: [status retry]  
24         */  
25    }  
26}];  

```

#### Response

Response returned by the client for `fetch all UUID metadata`:

```
1@interface PNFetchAllChannelsMetadataData : PNServiceData  
2
  
3// List of channels metadata objects created for current subscribe key.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMetadata *> *metadata;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of objects created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNChannelTotalCountField not added to 'includeFields'  
16 * of PNFetchAllChannelsMetadataRequest.  
17 */  
18@property (nonatomic, readonly, assign) NSUInteger totalCount;  
19
  
20@end  
21
  
22@interface PNFetchAllChannelsMetadataResult : PNResult  
23
  
24// Fetch all channels metadata request processed information.  
25@property (nonatomic, readonly, strong) PNFetchAllChannelsMetadataData *data;  
26
  
27@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get metadata for all channels (builder pattern)

#### Method(s)

```
`1objects()  
2    .allChannelsMetadata()  
3    .includeFields(PNChannelFields)  
4    .includeCount(BOOL)  
5    .filter(NSString)  
6    .sort(NSArray)  
7    .limit(NSUInteger)  
8    .start(NSString)  
9    .end(NSString)  
10    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelTotalCountField`, `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField` (default `PNChannelTotalCountField`, set `0` to reset)
- `includeCount` *(BOOL)*: default `YES`
- `filter` *(NSString)*, `sort` *(NSArray)*, `limit` *(NSUInteger)* (default/max `100`)
- `start` *(NSString)*, `end` *(NSString)* (ignored if `start` set)
- `block` *(PNFetchAllChannelsMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().allChannelsMetadata()  
2    .start(@"")  
3    .includeFields(PNChannelCustomField)  
4    .includeCount(YES)  
5    .limit(40)  
6    .performWithCompletion(^(PNFetchAllChannelsMetadataResult *result, PNErrorStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * Channels metadata successfully fetched.  
10             * Result object has following information:  
11             *   result.data.metadata - List of fetched channels metadata.  
12             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
13             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
14             *   result.data.totalCount - Total number of associated channel metadata.  
15        } else {  
16            /**  
17             * Handle channels metadata fetch error. Check 'category' property to find out possible  
18             * issue because of which request did fail.  
19             *  
20             * Request can be resent using: [status retry]  
21             */  
22        }  
23    });  
`
```

#### Response

Response returned by the client for `fetch all UUID metadata`:

```
1@interface PNFetchAllChannelsMetadataData : PNServiceData  
2
  
3// List of channels metadata objects created for current subscribe key.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMetadata *> *metadata;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of objects created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNChannelTotalCountField not added to 'includeFields'  
16 * of PNFetchAllChannelsMetadataRequest.  
17 */  
18@property (nonatomic, readonly, assign) NSUInteger totalCount;  
19
  
20@end  
21
  
22@interface PNFetchAllChannelsMetadataResult : PNResult  
23
  
24// Fetch all channels metadata request processed information.  
25@property (nonatomic, readonly, strong) PNFetchAllChannelsMetadataData *data;  
26
  
27@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get channel metadata

Returns metadata for a specified channel.

#### Method(s)

To `Get Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)channelMetadataWithRequest:(PNFetchChannelMetadataRequest *)request   
2                        completion:(PNFetchChannelMetadataCompletionBlock)block;  
`
```

- `request` *(PNFetchChannelMetadataRequest)*
- `block` *(PNFetchChannelMetadataCompletionBlock)*

#### PNFetchChannelMetadataRequest

- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField`
- `channel` *(NSString)*: channel name

#### Sample code

```
1PNFetchChannelMetadataRequest *request = [PNFetchChannelMetadataRequest requestWithChannel:@"channel"];  
2// Add this request option, if returned metadata model should have value which has been set to  
3// 'custom' property.  
4request.includeFields = PNChannelCustomField;  
5
  
6[self.client channelMetadataWithRequest:request  
7                             completion:^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {  
8
  
9    if (!status.isError) {  
10        /**  
11         * Channel metadata successfully fetched.  
12         * Channel metadata information available here: result.data.metadata  
13         */  
14    } else {  
15        /**  
16         * Handle channel metadata fetch error. Check 'category' property to find out possible  
17         * issue because of which request did fail.  
18         *  
19         * Request can be resent using: [status retry]  
20         */  
21    }  
22}];  

```

#### Response

Response returned by the client for `fetch channel metadata`:

```
1@interface PNFetchChannelMetadataData : PNServiceData  
2
  
3// Requested channel metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNFetchChannelsMetadataResult : PNResult  
9
  
10// Fetch channel metadata request processed information.  
11@property (nonatomic, readonly, strong) PNFetchChannelMetadataData *data;  
12
  
13@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get channel metadata (builder pattern)

#### Method(s)

```
`1objects()  
2    .channelMetadata(NSString *)  
3    .includeFields(PNChannelFields)  
4    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

- `channel` *(NSString)*
- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField`
- `block` *(PNFetchChannelMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().channelMetadata(@"channel")  
2    .includeFields(PNChannelCustomField)  
3    .performWithCompletion(^(PNFetchChannelsMetadataResult *result, PNErrorStatus *status) {  
4        if (!status.isError) {  
5            /**  
6             * Channel metadata successfully fetched.  
7             * Channel metadata information available here: result.data.metadata  
8             */  
9        } else {  
10            /**  
11             * Handle channel metadata fetch error. Check 'category' property to find out possible  
12             * issue because of which request did fail.  
13             *  
14             * Request can be resent using: [status retry]  
15             */  
16        }  
17    });  
`
```

#### Response

Response returned by the client for `fetch channel metadata`:

```
1@interface PNFetchChannelMetadataData : PNServiceData  
2
  
3// Requested channel metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNFetchChannelsMetadataResult : PNResult  
9
  
10// Fetch channel metadata request processed information.  
11@property (nonatomic, readonly, strong) PNFetchChannelMetadataData *data;  
12
  
13@end  

```

Error response (App Context API failure):

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Set channel metadata

##### Unsupported partial updates of custom metadata
`custom` overwrites stored custom data. To add new custom fields, you must:  
1. $1  
2. $1  
3. $1  

#### Method(s)

To `Set Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)setChannelMetadataWithRequest:(PNSetChannelMetadataRequest *)request   
2                           completion:(nullable PNSetChannelMetadataCompletionBlock)block;  
`
```

- `request` *(PNSetChannelMetadataRequest)*
- `block` *(PNSetChannelMetadataCompletionBlock)*

#### PNSetChannelMetadataRequest

- `custom` *(NSDictionary)*: not filterable via App Context filtering
- `information` *(NSString)*: description
- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField`
- `name` *(NSString)*
- `channel` *(NSString)*
- `status` *(NSString)*
- `type` *(NSString)*
- `ifMatchesEtag` *(NSString)*: optimistic locking; mismatch => HTTP 412

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Sample code

```
1PNSetChannelMetadataRequest *request = [PNSetChannelMetadataRequest requestWithChannel:@"channel"];  
2// Add this request option, if returned metadata model should have value which has been set to  
3// 'custom' property.  
4request.includeFields = PNChannelCustomField;  
5request.custom = @{ @"responsibilities": @"Manage tests", @"status": @"offline" };  
6request.name = @"Updated channel name";  
7
  
8[self.client setChannelMetadataWithRequest:request completion:^(PNSetChannelMetadataStatus *status) {  
9    if (!status.isError) {  
10        /**  
11         * Channel metadata successfully has been set.  
12         * Channel metadata information available here: status.data.metadata  
13         */  
14    } else {  
15        /**  
16         * Handle channel metadata update error. Check 'category' property to find out possible  
17         * issue because of which request did fail.  
18         *  
19         * Request can be resent using: [status retry]  
20         */  
21    }  
22}];  

```

#### Response

Response returned by the client for `set channel metadata`:

```
1@interface PNSetChannelMetadataData : PNServiceData  
2
  
3// Associated channel's metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNSetChannelMetadataStatus : PNAcknowledgmentStatus  
9
  
10// Set channel metadata request processed information.  
11@property (nonatomic, readonly, strong) PNSetChannelMetadataData *data;  
12
  
13@end  

```

#### Other examples

##### Iteratively update existing metadata

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// Assume 'client' is an initialized PubNub instance as shown in previous examples.  
5// PubNub *client = [PubNub clientWithConfiguration:config];  
6
  
7NSString *channel = @"demo_example";  
8NSString *initialName = @"Initial Channel Name";  
9NSString *initialDescription = @"Initial channel description.";  
10NSDictionary *initialCustom = @{ @"location": @"default_location" };  
11
  
12// First, set some initial metadata for the channel  
13PNSetChannelMetadataRequest *initialSetRequest = [PNSetChannelMetadataRequest requestWithChannel:channel];  
14initialSetRequest.name = initialName;  
15initialSetRequest.information = initialDescription;  
16initialSetRequest.custom = initialCustom;  
17initialSetRequest.includeFields = PNChannelCustomField; // To see custom fields in the response  
18
  
19NSLog(@"Setting initial metadata for channel: %@", channel);  
20[client setChannelMetadataWithRequest:initialSetRequest completion:^(PNSetChannelMetadataStatus *setStatus) {  
21    if (!setStatus.isError) {  
22        NSLog(@"✅ Successfully set initial metadata for channel '%@'.", channel);  
23        NSLog(@"Initial custom data: %@", setStatus.data.metadata.custom);  
24
  
25        // Now, let's fetch and update this metadata.  
26        // In a real application, you might get the eTag from this setStatus.data.metadata.eTag  
27        // or perform a separate fetch operation if needed.  
28
  
29        // For this example, we'll simulate updating a custom field.  
30        NSString *fieldName = @"location";  
31        NSString *fieldValue = @"new_york_office";  
32
  
33        // Create a mutable copy of the existing custom data or a new dictionary  
34        NSMutableDictionary *updatedCustom = [initialCustom mutableCopy] ?: [NSMutableDictionary new];  
35        updatedCustom[fieldName] = fieldValue;  
36          
37        // Prepare the request to update the channel metadata  
38        PNSetChannelMetadataRequest *updateRequest = [PNSetChannelMetadataRequest requestWithChannel:channel];  
39        updateRequest.name = initialName; // Or a new name if you want to change it  
40        updateRequest.information = initialDescription; // Or a new description  
41        updateRequest.custom = updatedCustom;  
42        // Optionally, use eTag for optimistic locking if you have it from a previous get/set operation  
43        // updateRequest.ifMatchesEtag = @"";  
44
  
45        NSLog(@"Updating custom field '%@' to '%@' for channel: %@", fieldName, fieldValue, channel);  
46        [client setChannelMetadataWithRequest:updateRequest completion:^(PNSetChannelMetadataStatus *updateStatus) {  
47            if (!updateStatus.isError) {  
48                NSLog(@"✅ Successfully updated metadata for channel '%@'.", channel);  
49                NSLog(@"Updated custom data: %@", updateStatus.data.metadata.custom);  
50            } else {  
51                NSLog(@"❌ Error updating channel metadata: %@. Category: %@", updateStatus.errorData.information, @(updateStatus.category));  
52                // Request can be resent using: [updateStatus retry]  
53            }  
54        }];  
55    } else {  
56        NSLog(@"❌ Error setting initial channel metadata: %@. Category: %@", setStatus.errorData.information, @(setStatus.category));  
57        // Request can be resent using: [setStatus retry]  
58    }  
59}];  
60
  
61// Note: The PubNub client operations are asynchronous.  
62// In a command-line tool or a script, you might need to keep the program running  
63// until the callbacks are executed, for example, by using a dispatch group or run loop.  
64// For typical application (e.g. iOS/macOS app) this is handled by the app's main run loop.  
65
  

```

---

### Set channel metadata (builder pattern)

#### Method(s)

```
`1objects()  
2    .setChannelMetadata(NSString *)  
3    .includeFields(PNChannelFields)  
4    .channel(NSString)  
5    .name(NSString)  
6    .information(NSString)  
7    .custom(NSDictionary)  
8    .performWithCompletion(PNFetchChannelMetadataCompletionBlock);  
`
```

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

- `channel`, `name`, `information`, `custom`
- `includeFields` *(PNChannelFieldsBitfield)*: `PNChannelCustomField`, `PNChannelStatusField`, `PNChannelTypeField`
- `block` *(PNSetChannelMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().setChannelMetadata(@"channel")  
2    .name(@"Admin")  
3    .information(@"Administrative channel")  
4    .custom(@{ @"responsibilities": @"Manage access to protected resources" })  
5    .includeFields(PNChannelCustomField)  
6    .performWithCompletion(^(PNSetChannelMetadataStatus *status) {  
7      if (!status.isError) {  
8          /**  
9           * Channel metadata successfully has been set.  
10           * Channel metadata information available here: status.data.metadata  
11           */  
12      } else {  
13          /**  
14           * Handle channel metadata update error. Check 'category' property to find out possible  
15           * issue because of which request did fail.  
16           *  
17           * Request can be resent using: [status retry]  
18           */  
19      }  
20    });  
`
```

#### Response

Response returned by the client for `set channel metadata`:

```
1@interface PNSetChannelMetadataData : PNServiceData  
2
  
3// Associated channel's metadata object.  
4@property (nonatomic, nullable, readonly, strong) PNChannelMetadata *metadata;  
5
  
6@end  
7
  
8@interface PNSetChannelMetadataStatus : PNAcknowledgmentStatus  
9
  
10// Set channel metadata request processed information.  
11@property (nonatomic, readonly, strong) PNSetChannelMetadataData *data;  
12
  
13@end  

```

---

### Remove channel metadata

Removes metadata from a specified channel.

#### Method(s)

To `Remove Channel Metadata` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)removeChannelMetadataWithRequest:(PNRemoveChannelMetadataRequest *)request   
2                              completion:(nullable PNRemoveChannelMetadataCompletionBlock)block;  
`
```

- `request` *(PNRemoveChannelMetadataRequest)*
- `block` *(PNRemoveChannelMetadataCompletionBlock)*

#### PNRemoveChannelMetadataRequest

- `channel` *(NSString)*: channel name

#### Sample code

```
1PNRemoveChannelMetadataRequest *request = [PNRemoveChannelMetadataRequest requestWithChannel:@"channel"];  
2
  
3[self.client removeChannelMetadataWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
4    if (!status.isError) {  
5        // Channel metadata successfully removed.  
6    } else {  
7        /**  
8         * Handle channel metadata remove error. Check 'category' property to find out possible  
9         * issue because of which request did fail.  
10         *  
11         * Request can be resent using: [status retry]  
12         */  
13    }  
14}];  

```

#### Response

Response returned by the client for `remove channel metadata`:

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

---

### Remove channel metadata (builder pattern)

#### Method(s)

```
`1objects()  
2    .removeChannelMetadata(NSString *)  
3    .performWithCompletion(nullable PNRemoveChannelMetadataCompletionBlock);  
`
```

- `channel` *(NSString)*
- `block` *(PNRemoveChannelMetadataCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().removeChannelMetadata(@"channel")  
2    .performWithCompletion(^(PNAcknowledgmentStatus *status) {  
3        if (!status.isError) {  
4            // Channel metadata successfully removed.  
5        } else {  
6            /**  
7             * Handle channel metadata remove error. Check 'category' property to find out possible  
8             * issue because of which request did fail.  
9             *  
10             * Request can be resent using: [status retry]  
11             */  
12        }  
13    });  
`
```

#### Response

Response returned by the client for `remove channel metadata`:

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

---

## Channel memberships

### Get channel memberships

Returns memberships for a user (not subscriptions).

#### Method(s)

To `Get Memberships` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)membershipsWithRequest:(PNFetchMembershipsRequest *)request   
2                    completion:(PNFetchMembershipsCompletionBlock)block;  
`
```

#### PNFetchMembershipsRequest

- `sort` *(NSArray<NSString *>)*: sort by `id`, `name`, `updated` with `asc/desc`
- `includeFields` *(PNMembershipFieldsBitfield)*: `PNMembershipsTotalCountField`, `PNMembershipCustomField`, `PNMembershipStatusField`, `PNMembershipTypeField`, `PNMembershipChannelField`, `PNMembershipChannelCustomField`, `PNMembershipChannelStatusField`, `PNMembershipChannelTypeField` (default `PNMembershipsTotalCountField`, set `0` to reset)
- `filter` *(NSString)*, `start` *(NSString)*, `end` *(NSString)* (ignored if `start` set), `limit` *(NSUInteger)* default/max `100`

#### Sample code

```
1PNFetchMembershipsRequest *request = [PNFetchMembershipsRequest requestWithUUID:@"uuid"];  
2request.start = @"";  
3// Add this request option, if returned membership models should have value which has been set to  
4// 'custom' and 'channel' properties.  
5request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
6request.limit = 40;  
7
  
8[self.client membershipsWithRequest:request  
9                         completion:^(PNFetchMembershipsResult *result, PNErrorStatus *status) {  
10
  
11    if (!status.isError) {  
12        /**  
13         * UUID's memberships successfully fetched.  
14         * Result object has following information:  
15         *   result.data.memberships - List of UUID's memberships.  
16         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
17         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
18         *   result.data.totalCount - Total number of UUID's memberships.  
19         */  
20    } else {  
21        /**  
22         * Handle UUID's memberships fetch error. Check 'category' property to find out possible  
23         * issue because of which request did fail.  
24         *  
25         * Request can be resent using: [status retry]  
26         */  
27    }  
28}];  

```

#### Response

```
1@interface PNFetchMembershipsData : PNServiceData  
2
  
3// List of fetched memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of members created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNFetchMembershipsResult : PNAcknowledgmentStatus  
24
  
25// Fetch memberships request processed information.  
26@property (nonatomic, readonly, strong) PNFetchMembershipsData *data;  
27
  
28@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get channel memberships (builder pattern)

#### Method(s)

```
`1objects()  
2    .memberships()  
3    .uuid(NSString *)  
4    .includeFields(PNMembershipFields)  
5    .includeCount(BOOL)  
6    .filter(NSString *)  
7    .sort(NSArrayNSString *> *)  
8    .limit(NSUInteger)  
9    .start(NSString *)  
10    .end(NSString *)  
11    .performWithCompletion(PNFetchMembershipsCompletionBlock);  
`
```

- `uuid` *(NSString)*: (as written) “Name of channel from which members should be fetched.”
- `includeFields` *(PNMembershipFieldsBitfield)*: same as non-builder
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNFetchMembershipsCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().memberships()  
2    .uuid(@"uuid")  
3    .includeCount(YES)  
4    .limit(40)  
5    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
6    .performWithCompletion(^(PNFetchMembershipsResult *result, PNErrorStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * UUID's memberships successfully fetched.  
10             * Result object has following information:  
11             *   result.data.memberships - List of UUID's memberships.  
12             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
13             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
14             *   result.data.totalCount - Total number of UUID's memberships.  
15             */  
16        } else {  
17            /**  
18             * Handle UUID's memberships fetch error. Check 'category' property to find out possible  
19             * issue because of which request did fail.  
20             *  
21             * Request can be resent using: [status retry]  
22             */  
23        }  
24    });  
`
```

#### Response

```
1@interface PNFetchMembershipsData : PNServiceData  
2
  
3// List of fetched memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of members created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNFetchMembershipsResult : PNAcknowledgmentStatus  
24
  
25// Fetch memberships request processed information.  
26@property (nonatomic, readonly, strong) PNFetchMembershipsData *data;  
27
  
28@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Set channel memberships

#### Method(s)

To `Set Memberships` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)setMembershipsWithRequest:(PNSetMembershipsRequest *)request   
2                       completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

#### PNSetMembershipsRequest

- `sort` *(NSArray<NSString *>)*: `id/name/updated` with `asc/desc`
- `includeFields` *(PNMembershipFieldsBitfield)*:  
  - `PNMembershipsTotalCountField`, `PNMembershipCustomField`, `PNMembershipStatusField`, `PNMembershipTypeField`,  
  - `PNMembershipChannelField`, `PNMembershipChannelCustomField`, `PNMembershipChannelStatusField`, `PNMembershipChannelTypeField`
- `filter` *(NSString)*, `start` *(NSString)*, `end` *(NSString)* (ignored if `start` set), `limit` *(NSUInteger)* default/max `100`

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Sample code

```
1NSArrayNSDictionary *> *channels = @[  
2  @{   
3    @"channel": @"channel1",   
4    @"status": @"active",  
5    @"type": @"public",   
6    @"custom": @{ @"role": @"moderator" }   
7  }  
8];  
9
  
10PNSetMembershipsRequest *request = [PNSetMembershipsRequest requestWithUUID:@"uuid"  
11                                                                   channels:channels];  
12// Add this request option, if returned membership models should have value which has been set to  
13// 'custom' and 'channel' properties.  
14request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
15request.limit = 40;  
16
  
17[self.client setMembershipsWithRequest:request completion:^(PNManageMembershipsStatus *status) {  
18    if (!status.isError) {  
19        /**  
20         * UUID's memberships successfully set.  
21         * Result object has following information:  
22         *   status.data.memberships - List of UUID's existing memberships.  
23         *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
24         *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
25         *   status.data.totalCount - Total number of UUID's memberships.  
26         */  
27    } else {  
28        /**  
29         * Handle UUID's memberships set error. Check 'category' property to find out possible  
30         * issue because of which request did fail.  
31         *  
32         * Request can be resent using: [status retry]  
33         */  
34    }  
35}];  

```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

### Set channel memberships (builder pattern)

#### Method(s)

```
`1objects()  
2    .setMemberships()  
3    .uuid(NSString *)  
4    .channels(NSArrayNSDictionary *> *)  
5    .includeFields(PNMembershipFields)  
6    .includeCount(BOOL)  
7    .filter(NSString *)  
8    .sort(NSArrayNSString *> *)  
9    .limit(NSUInteger)  
10    .start(NSString *)  
11    .end(NSString *)  
12    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

- `uuid` *(NSString)*: default configured client `uuid`
- `channels` *(NSArray)*: dictionaries with `channel` and optional `custom` (`NSString`/`NSNumber`)
- `includeFields` *(PNMembershipFieldsBitfield)*: same as non-builder
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageMembershipsCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
1NSArrayNSDictionary *> *channels = @[  
2  @{   
3    @"channel": @"channel1",   
4    @"status": @"active",  
5    @"type": @"public",   
6    @"custom": @{ @"role": @"moderator" }   
7  }  
8];  
9
  
10self.client.objects().setMemberships()  
11    .uuid(@"uuid")  
12    .channels(channels)  
13    .includeCount(YES)  
14    .limit(40)  
15    .includeFields(NMembershipCustomField | PNMembershipChannelField)  
16    .performWithCompletion(^(PNManageMembershipsStatus *status) {  
17        if (!status.isError) {  
18            /**  
19             * UUID's memberships successfully set.  
20             * Result object has following information:  
21             *   status.data.memberships - List of UUID's existing memberships.  
22             *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
23             *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
24             *   status.data.totalCount - Total number of UUID's memberships.  
25             */  
26        } else {  
27            /**  
28             * Handle UUID's memberships set error. Check 'category' property to find out possible  
29             * issue because of which request did fail.  
30             *  
31             * Request can be resent using: [status retry]  
32             */  
33        }  
34    });  

```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

### Remove channel memberships

#### Method(s)

To `Remove Memberships` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)removeMembershipsWithRequest:(PNRemoveMembershipsRequest *)request   
2                          completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

#### PNRemoveMembershipsRequest

- `sort` *(NSArray<NSString *>)*, `includeFields` *(PNMembershipFieldsBitfield)* (same supported fields as set), `filter`, `start`, `end` (ignored if `start` set), `limit` default/max `100`

#### Sample code

```
1NSArrayNSString *> *channels = @[@"channel1", @"channel2"];  
2PNRemoveMembershipsRequest *request = [PNRemoveMembershipsRequest requestWithUUID:@"uuid"  
3                                                                         channels:channels];  
4// Add this request option, if returned membership models should have value which has been set to  
5// 'custom' and 'channel' properties.  
6request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
7request.limit = 40;  
8
  
9[self.client removeMembershipsWithRequest:request  
10                               completion:^(PNManageMembershipsStatus *status) {  
11
  
12    if (!status.isError) {  
13        /**  
14         * UUID's memberships successfully removed.  
15         * Result object has following information:  
16         *   status.data.memberships - List of UUID's existing memberships.  
17         *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
18         *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
19         *   status.data.totalCount - Total number of UUID's memberships.  
20         */  
21    } else {  
22        /**  
23         * Handle UUID's memberships remove error. Check 'category' property to find out possible  
24         * issue because of which request did fail.  
25         *  
26         * Request can be resent using: [status retry]  
27         */  
28    }  
29}];  

```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

### Remove channel memberships (builder pattern)

#### Method(s)

```
`1objects()  
2    .removeMemberships()  
3    .uuid(NSString *)  
4    .channels(NSArrayNSString *> *)  
5    .includeFields(PNMemberFields)  
6    .includeCount(BOOL)  
7    .filter(NSString *)  
8    .sort(NSArrayNSString *> *)  
9    .limit(NSUInteger)  
10    .start(NSString *)  
11    .end(NSString *)  
12    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

- `uuid` *(NSString)*: default configured client `uuid`
- `channels` *(NSArray<NSString *>)*: channels to remove membership from
- `includeFields` *(PNMembershipFieldsBitfield)*: supported fields as above
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageMembershipsCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().removeMemberships()  
2    .uuid(@"uuid")  
3    .channels(@[@"channel1", @"channel2"])  
4    .includeCount(YES)  
5    .limit(40)  
6    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
7    .performWithCompletion(^(PNManageMembershipsStatus *status) {  
8        if (!status.isError) {  
9            /**  
10             * UUID's memberships successfully removed.  
11             * Result object has following information:  
12             *   status.data.memberships - List of UUID's existing memberships.  
13             *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
14             *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
15             *   status.data.totalCount - Total number of UUID's memberships.  
16             */  
17        } else {  
18            /**  
19             * Handle UUID's memberships remove error. Check 'category' property to find out possible  
20             * issue because of which request did fail.  
21             *  
22             * Request can be resent using: [status retry]  
23             */  
24        }  
25    });  
`
```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

### Manage channel memberships

Sets and removes memberships for a UUID in one request.

#### Method(s)

To `Manage Memberships` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)manageMembershipsWithRequest:(PNManageMembershipsRequest *)request   
2                          completion:(nullable PNManageMembershipsCompletionBlock)block;  
`
```

#### PNManageMembershipsRequest

- `setChannels` *(NSArray<NSDictionary *>)*: dictionaries with `channel` and optional `custom` (`NSString`/`NSNumber`)
- `removeChannels` *(NSArray<NSString *>)*: channels to remove UUID from
- `sort` *(NSArray<NSString *>)*, `includeFields` *(PNMembershipFieldsBitfield)*, `filter`, `start`, `end` (ignored if `start` set), `limit` default/max `100`

#### Sample code

```
1PNManageMembershipsRequest *request = [PNManageMembershipsRequest requestWithUUID:@"uuid"];  
2request.setChannels = @[  
3    @{ @"channel": @"channel1", @"custom": @{ @"role": @"moderator" } }  
4];  
5request.removeChannels = @[@"channel3", @"channel4"];  
6// Add this request option, if returned membership models should have value which has been set to  
7// 'custom' and 'channel' properties.  
8request.includeFields = PNMembershipCustomField | PNMembershipChannelField | PNMembershipsTotalCountField;  
9request.limit = 40;  
10
  
11[self.client manageMembershipsWithRequest:request  
12                               completion:^(PNManageMembershipsStatus *status) {  
13
  
14    if (!status.isError) {  
15        /**  
16         * UUID's memberships successfully set.  
17         * Result object has following information:  
18         *   status.data.memberships - List of UUID's existing memberships.  
19         *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
20         *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
21         *   status.data.totalCount - Total number of UUID's memberships.  
22         */  
23    } else {  
24        /**  
25         * Handle UUID's memberships set error. Check 'category' property to find out possible  
26         * issue because of which request did fail.  
27         *  
28         * Request can be resent using: [status retry]  
29         */  
30    }  
31}];  

```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

### Manage channel memberships (builder pattern)

#### Method(s)

```
`1objects()  
2    .manageMemberships()  
3    .uuid(NSString *)  
4    .set(NSArrayNSDictionary *> *)  
5    .remove(NSArrayNSString *> *)  
6    .includeFields(PNMemberFields)  
7    .includeCount(BOOL)  
8    .filter(NSString *)  
9    .sort(NSArrayNSString *> *)  
10    .limit(NSUInteger)  
11    .start(NSString *)  
12    .end(NSString *)  
13    .performWithCompletion(nullable PNManageMembershipsCompletionBlock);  
`
```

- `uuid` *(NSString)*: default configured client `uuid`
- `set` *(NSArray)*: set memberships (dicts with `channel` and optional `custom`)
- `remove` *(NSArray)*: channels to remove memberships from
- `includeFields` *(PNMembershipFieldsBitfield)*: supported fields as above
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageMembershipsCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
1NSArrayNSDictionary *> *setChannels = @[  
2    @{ @"channel": @"channel1", @"custom": @{ @"role": @"moderator" } }  
3];  
4NSArrayNSString *> *removeChannels = @[@"channel3", @"channel4"];  
5
  
6self.client.objects().manageMemberships()  
7    .uuid(@"uuid")  
8    .set(setChannels)  
9    .remove(removeChannels)  
10    .includeCount(YES)  
11    .limit(40)  
12    .includeFields(PNMembershipCustomField | PNMembershipChannelField)  
13    .performWithCompletion(^(PNManageMembershipsStatus *status) {  
14        if (!status.isError) {  
15            /**  
16             * UUID's memberships successfully set.  
17             * Result object has following information:  
18             *   status.data.memberships - List of UUID's existing memberships.  
19             *   status.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
20             *   status.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
21             *   status.data.totalCount - Total number of UUID's memberships.  
22             */  
23        } else {  
24            /**  
25             * Handle UUID's memberships set error. Check 'category' property to find out possible  
26             * issue because of which request did fail.  
27             *  
28             * Request can be resent using: [status retry]  
29             */  
30        }  
31    });  

```

#### Response

```
1@interface PNManageMembershipsData : PNServiceData  
2
  
3// List of existing memberships.  
4@property (nonatomic, readonly, strong) NSArrayPNMembership *> *memberships;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNMembershipsTotalCountField not added to 'includeFields'  
16 * of PNSetMembershipsRequest / PNRemoveMembershipsRequest / PNManageMembershipsRequest or  
17 * PNFetchMembershipsRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageMembershipsStatus : PNAcknowledgmentStatus  
24
  
25// Memberships set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageMembershipsData *data;  
27
  
28@end  

```

---

## Channel members

### Get channel members

Returns members in a channel; includes user metadata when available.

#### Method(s)

To `Get Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)channelMembersWithRequest:(PNFetchChannelMembersRequest *)request   
2                       completion:(PNFetchChannelMembersCompletionBlock)block;  
`
```

#### PNFetchChannelMembersRequest

- `sort` *(NSArray<NSString *>)*: `id/name/updated` with `asc/desc`
- `includeFields` *(PNChannelMemberFieldsBitfield)*:  
  `PNChannelMembersTotalCountField`, `PNChannelMemberCustomField`, `PNChannelMemberStatusField`, `PNChannelMemberTypeField`,  
  `PNChannelMemberUUIDField`, `PNChannelMemberUUIDCustomField`, `PNChannelMemberUUIDStatusField`, `PNChannelMemberUUIDTypeField`  
  Default: `PNChannelMembersTotalCountField` (set `0` to reset)
- `filter` *(NSString)*, `start` *(NSString)*, `end` *(NSString)* (ignored if `start` set), `limit` *(NSUInteger)* default/max `100`

#### Sample code

```
1PNFetchChannelMembersRequest *request = [PNFetchChannelMembersRequest requestWithChannel:@"channel"];  
2request.start = @"";  
3// Add this request option, if returned member models should have value which has been set to  
4// 'custom' and 'uuid' properties.  
5request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
6request.limit = 40;  
7
  
8[self.client channelMembersWithRequest:request  
9                            completion:^(PNFetchChannelMembersResult *result, PNErrorStatus *status) {  
10
  
11    if (!status.isError) {  
12        /**  
13         * Channel's members successfully fetched.  
14         * Result object has following information:  
15         *   result.data.members - List of channel's members.  
16         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
17         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
18         *   result.data.totalCount - Total number of channel's members.  
19         */  
20    } else {  
21        /**  
22         * Handle channel's members fetch error. Check 'category' property to find out possible  
23         * issue because of which request did fail.  
24         *  
25         * Request can be resent using: [status retry]  
26         */  
27    }  
28}];  

```

#### Response

```
1@interface PNFetchChannelMembersData : PNServiceData  
2
  
3// List of fetched members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of members created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNFetchChannelMembersResult : PNAcknowledgmentStatus  
24
  
25// Fetch members request processed information.  
26@property (nonatomic, readonly, strong) PNFetchChannelMembersData *data;  
27
  
28@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Get channel members (builder pattern)

#### Method(s)

```
`1objects()  
2    .channelMembers(NSString *)  
3    .includeFields(PNChannelMemberFields)  
4    .includeCount(BOOL)  
5    .filter(NSString *)  
6    .sort(NSArrayNSString *> *)  
7    .limit(NSUInteger)  
8    .start(NSString *)  
9    .end(NSString *)  
10    .performWithCompletion(PNFetchChannelMembersCompletionBlock);  
`
```

- `channel` *(NSString)*
- `includeFields` *(PNChannelMemberFieldsBitfield)*: supported fields above; default resettable by setting `0`
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNFetchChannelMembersCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().channelMembers(@"channel")  
2    .includeCount(YES)  
3    .limit(40)  
4    .includeFields(PNChannelMemberCustomField | PNChannelMemberUUIDField)  
5    .performWithCompletion(^(PNFetchChannelMembersResult *result, PNErrorStatus *status) {  
6        if (!status.isError) {  
7            /**  
8             * Channel's members successfully fetched.  
9             * Result object has following information:  
10             *   result.data.members - List of channel's members.  
11             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
12             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
13             *   result.data.totalCount - Total number of channel's members.  
14             */  
15        } else {  
16            /**  
17             * Handle channel's members fetch error. Check 'category' property to find out possible  
18             * issue because of which request did fail.  
19             *  
20             * Request can be resent using: [status retry]  
21             */  
22        }  
23    });  
`
```

#### Response

```
1@interface PNFetchChannelMembersData : PNServiceData  
2
  
3// List of fetched members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of members created for current subscribe key.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNFetchChannelMembersResult : PNAcknowledgmentStatus  
24
  
25// Fetch members request processed information.  
26@property (nonatomic, readonly, strong) PNFetchChannelMembersData *data;  
27
  
28@end  

```

Error response:

```
1@interface PNErrorData : PNServiceData  
2
  
3// Stringified error information.  
4@property (nonatomic, readonly, strong) NSString *information;  
5
  
6@end  
7
  
8@interface PNErrorStatus : PNStatus  
9
  
10// Whether status object represent error or not.  
11@property (nonatomic, readonly, assign, getter = isError) BOOL error;  
12
  
13// Additional information related to error status object.  
14@property (nonatomic, readonly, strong) PNErrorData *errorData;  
15
  
16@end  

```

---

### Set channel members

#### Method(s)

To `Set Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)setChannelMembersWithRequest:(PNSetChannelMembersRequest *)request   
2                          completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

#### PNSetMembersRequest

- `sort` *(NSArray<NSString *>)*, `includeFields` *(PNChannelMemberFieldsBitfield)* (supported fields listed in docs), `filter`, `start`, `end` (ignored if `start` set), `limit` default/max `100`

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Sample code

```
1NSArrayNSDictionary *> *uuids = @[  
2  @{   
3    @"uuid": @"uuid2"  
4    @"status": @"active",  
5    @"type": @"admin",  
6    @"custom": @{ @"role": @"moderator" }   
7  }  
8];  
9
  
10PNSetChannelMembersRequest *request = [PNSetChannelMembersRequest requestWithChannel:@"channel" uuids:uuids];  
11// Add this request option, if returned member models should have value which has been set to  
12// 'custom' and 'uuid' properties.  
13request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
14request.limit = 40;  
15
  
16[self.client setChannelMembersWithRequest:request completion:^(PNManageChannelMembersStatus *status) {  
17    if (!status.isError) {  
18        /**  
19         * Channel's members successfully set.  
20         * Result object has following information:  
21         *   result.data.members - List of existing channel's members.  
22         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
23         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
24         *   result.data.totalCount - Total number of channel's members.  
25         */  
26    } else {  
27        /**  
28         * Handle channel's members set error. Check 'category' property to find out possible  
29         * issue because of which request did fail.  
30         *  
31         * Request can be resent using: [status retry]  
32         */  
33    }  
34}];  

```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
  
28@end  

```

---

### Set channel members (builder pattern)

#### Method(s)

```
`1objects()  
2    .setChannelMembers(NSString *)  
3    .uuids(NSArrayNSDictionary *> *)  
4    .includeFields(PNChannelMemberFields)  
5    .includeCount(BOOL)  
6    .filter(NSString *)  
7    .sort(NSArrayNSString *> *)  
8    .limit(NSUInteger)  
9    .start(NSString *)  
10    .end(NSString *)  
11    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

##### API limits
See [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

- `channel` *(NSString)*, `uuids` *(NSArray)* dicts with `uuid` and optional `custom` (`NSString`/`NSNumber`)
- `includeFields` *(PNChannelMemberFieldsBitfield)*: supported fields above; default resettable by setting `0`
- `includeCount` *(BOOL)*: default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageChannelMembersCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
1NSArrayNSDictionary *> *uuids = @[  
2  @{   
3    @"uuid": @"uuid2"  
4    @"status": @"active",  
5    @"type": @"admin",  
6    @"custom": @{ @"role": @"moderator" }   
7  }  
8];  
9
  
10self.client.objects().setChannelMembers(@"channel")  
11    .uuids(uuids)  
12    .includeCount(YES)  
13    .limit(40)  
14    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)  
15    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
16        if (!status.isError) {  
17            /**  
18             * Channel's members successfully set.  
19             * Result object has following information:  
20             *   result.data.members - List of existing channel's members.  
21             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
22             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
23             *   result.data.totalCount - Total number of channel's members.  
24             */  
25        } else {  
26            /**  
27             * Handle channel's members set error. Check 'category' property to find out possible  
28             * issue because of which request did fail.  
29             *  
30             * Request can be resent using: [status retry]  
31             */  
32        }  
33    });  

```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
  
28@end  

```

---

### Remove channel members

#### Method(s)

To `Remove Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)removeChannelMembersWithRequest:(PNRemoveChannelMembersRequest *)request   
2                             completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

#### PNRemoveChannelMembersRequest

- `sort`, `includeFields` *(PNChannelMemberFieldsBitfield)*, `filter`, `start`, `end` (ignored if `start` set), `limit` default/max `100`

#### Sample code

```
1NSArrayNSString *> *uuids = @[@"uuid3", @"uuid4"];  
2PNRemoveChannelMembersRequest *request = [PNRemoveChannelMembersRequest requestWithChannel:@"channel"  
3                                                                                     uuids:uuids];  
4// Add this request option, if returned member models should have value which has been set to  
5// 'custom' and 'uuid' properties.  
6request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
7request.limit = 40;  
8
  
9[self.client removeChannelMembersWithRequest:request completion:^(PNManageChannelMembersStatus *status) {  
10    if (!status.isError) {  
11        /**  
12         * Channel's members successfully removed.  
13         * Result object has following information:  
14         *   result.data.members - List of channel's existing members.  
15         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
16         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
17         *   result.data.totalCount - Total number of channel's members.  
18         */  
19    } else {  
20        /**  
21         * Handle channel's members remove error. Check 'category' property to find out possible  
22         * issue because of which request did fail.  
23         *  
24         * Request can be resent using: [status retry]  
25         */  
26    }  
27}];  

```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
  
28@end  

```

---

### Remove channel members (builder pattern)

#### Method(s)

```
`1objects()  
2    .removeChannelMembers(NSString *)  
3    .uuids(NSArrayNSString *> *)  
4    .includeFields(PNChannelMemberFields)  
5    .includeCount(BOOL)  
6    .filter(NSString *)  
7    .sort(NSArrayNSString *> *)  
8    .limit(NSUInteger)  
9    .start(NSString *)  
10    .end(NSString *)  
11    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

- `channel` *(NSString)*, `uuids` *(NSArray<NSString *>)*  
- `includeFields` *(PNChannelMemberFieldsBitfield)* (supported fields listed above; default resettable by `0`)
- `includeCount` *(BOOL)* default `YES`
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageChannelMembersCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
`1self.client.objects().removeChannelMembers(@"channel")  
2    .uuids(@[@"uuid3", @"uuid4"])  
3    .includeCount(YES)  
4    .limit(40)  
5    .includeFields(PNChannelMemberCustomField | PNChannelMemberUserField)  
6    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
7        if (!status.isError) {  
8            /**  
9             * Channel's members successfully removed.  
10             * Result object has following information:  
11             *   result.data.members - List of channel's existing members.  
12             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
13             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
14             *   result.data.totalCount - Total number of channel's members.  
15             */  
16        } else {  
17            /**  
18             * Handle channel's members remove error. Check 'category' property to find out possible  
19             * issue because of which request did fail.  
20             *  
21             * Request can be resent using: [status retry]  
22             */  
23        }  
24    });  
`
```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
  
28@end  

```

---

### Manage channel members

Sets and removes channel members in one request.

#### Method(s)

To `Manage Channel Members` you can use the following method(s) in the Objective-C SDK:

```
`1- (void)manageChannelMembersWithRequest:(PNManageChannelMembersRequest *)request   
2                             completion:(nullable PNManageChannelMembersCompletionBlock)block;  
`
```

#### PNManageChannelMembersRequest

- `setMembers` *(NSArray<NSDictionary *>)*: dicts with `uuid` and optional `custom` (`NSString`/`NSNumber`)
- `removeMembers` *(NSArray<NSString *>)*: UUIDs to remove
- `sort`, `includeFields` *(PNChannelMemberFieldsBitfield)*, `filter`, `start`, `end` (ignored if `start` set), `limit` default/max `100`

#### Sample code

```
1PNManageChannelMembersRequest *request = [PNManageChannelMembersRequest requestWithChannel:@"channel"];  
2request.setMembers = @[  
3    @{ @"uuid": @"uuid2", @"custom": @{ @"role": @"moderator" } }  
4];  
5request.removeMembers = @[@"uuid3", @"uuid4"];  
6// Add this request option, if returned member models should have value which has been set to  
7// 'custom' and 'uuid' properties.  
8request.includeFields = PNChannelMemberCustomField | PNChannelMemberUUIDField | PNChannelMembersTotalCountField;  
9request.limit = 40;  
10
  
11[self.client manageChannelMembersWithRequest:request  
12                               completion:^(PNManageChannelMembersStatus *status) {  
13
  
14    if (!status.isError) {  
15        /**  
16         * Channel's members successfully set.  
17         * Result object has following information:  
18         *   result.data.members - List of existing channel's members.  
19         *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
20         *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
21         *   result.data.totalCount - Total number of channel's members.  
22         */  
23    } else {  
24        /**  
25         * Handle channel's members manage error. Check 'category' property to find out possible  
26         * issue because of which request did fail.  
27         *  
28         * Request can be resent using: [status retry]  
29         */  
30    }  
31}];  

```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
  
28@end  

```

---

### Manage channel members (builder pattern)

#### Method(s)

```
`1objects()  
2    .manageChannelMembers(NSString *)  
3    .set(NSArrayNSDictionary *> *)  
4    .remove(NSArrayNSString *> *)  
5    .includeFields(PNChannelMemberFields)  
6    .includeCount(BOOL)  
7    .filter(NSString *)  
8    .sort(NSArrayNSString *> *)  
9    .limit(NSUInteger)  
10    .start(NSString *)  
11    .end(NSString *)  
12    .performWithCompletion(nullable PNManageChannelMembersCompletionBlock);  
`
```

- `channel` *(NSString)*
- `set` *(NSArray)*: dicts with `UUID` and optional `custom`
- `remove` *(NSArray)*: UUIDs to remove
- `includeFields` *(PNChannelMemberFieldsBitfield)*: supported fields above; default resettable by setting `0`
- `includeCount` *(BOOL)*: default is false.
- `filter`, `sort`, `limit` (default/max `100`), `start`, `end` (ignored if `start` set)
- `block` *(PNManageChannelMembersCompletionBlock)*

##### Note
Builder pattern: omit optional arguments.

#### Sample code

```
1NSArrayNSDictionary *> *setMembers = @[  
2    @{ @"uuid": @"uuid2", @"custom": @{ @"role": @"moderator" } }  
3];  
4NSArrayNSDictionary *> *removeMembers = @[@"uuid3", @"uuid4"];  
5
  
6self.client.objects().manageChannelMembers(@"channel")  
7    .set(setMembers)  
8    .remove(removeMembers)  
9    .includeCount(YES)  
10    .limit(40)  
11    .includeFields(PNChannelMemberCustomField | PNChannelMemberUUIDField)  
12    .performWithCompletion(^(PNManageChannelMembersStatus *status) {  
13        if (!status.isError) {  
14            /**  
15             * Channel's members successfully changed.  
16             * Result object has following information:  
17             *   result.data.members - List of existing channel's members.  
18             *   result.data.next - Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
19             *   result.data.prev - Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
20             *   result.data.totalCount - Total number of channel's members.  
21             */  
22        } else {  
23            /**  
24             * Handle channel's members manage error. Check 'category' property to find out possible  
25             * issue because of which request did fail.  
26             *  
27             * Request can be resent using: [status retry]  
28             */  
29        }  
30    });  

```

#### Response

```
1@interface PNManageChannelMembersData : PNServiceData  
2
  
3// List of existing members.  
4@property (nonatomic, readonly, strong) NSArrayPNChannelMember *> *members;  
5
  
6// Random string returned from the server, indicating a specific position in a data set. Used for forward pagination, it fetches the next page, allowing you to continue from where you left off.  
7@property (nonatomic, nullable, readonly, strong) NSString *next;  
8
  
9// Random string returned from the server, indicating a specific position in a data set. Used for backward pagination, it fetches the previous page, enabling access to earlier data.  
10@property (nonatomic, nullable, readonly, strong) NSString *prev;  
11
  
12/**  
13 * Total number of existing objects.  
14 *  
15 * Value will be 0 in case if PNChannelMembersTotalCountField not added to 'includeFields'  
16 * of PNSetChannelMembersRequest / PNRemoveChannelMembersRequest /  
17 * PNManageChannelMembersRequest or PNFetchChannelMembersRequest.  
18 */  
19@property (nonatomic, readonly, assign) NSUInteger totalCount;  
20
  
21@end  
22
  
23@interface PNManageChannelMembersStatus : PNAcknowledgmentStatus  
24
  
25// Members set / remove / manage request processed information.  
26@property (nonatomic, readonly, strong) PNManageChannelMembersData *data;  
27
**28@end  

```