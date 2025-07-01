On this page
# App Context API for Swift Native SDK

This page describes App Context (formerly Objects v2). To upgrade from Objects v1, refer to the [migration guide](/docs/general/resources/migration-guides/objects-v2-migration).

App Context provides easy-to-use, serverless storage for user and channel data you need to build innovative, reliable, scalable applications. Use App Context to easily store metadata about your application users and channels, and their membership associations, without the need to stand up your own databases.

PubNub also triggers events when object data is set or removed from the database. Clients can receive these events in real-time and update their front-end application accordingly.

##### UUID and User ID

`PubNubUUIDMetadataBase` is deprecated but will continue to work as a typealias for `PubNubUserMetadataBase`.

## User[​](#user)

### Get Metadata for All Users[​](#get-metadata-for-all-users)

Returns a paginated list of User Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods)

To `Get All User Metadata` you can use the following method(s) in the Swift SDK:

```
`func allUserMetadata(  
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
    filter: String? = nil,  
    sort: [PubNub.ObjectSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`include`Type: [`PubNub.UserIncludeFields`](#userincludefields)Default:  
`PubNub.UserIncludeFields()`Whether to include the custom field in the fetch response. For more information, refer to the [UserIncludeFields](#userincludefields) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering)`sort`Type: [PubNub.ObjectSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.id`, `.name`, `.type`, `.status`, and `.updated`.`page`Type: `PubNubHashedPage?`Default:  
`PubNub.Page()`The paging object used for pagination that allows for cursor-based pagination where the pages are navigated using a cursor, such as a `next` value.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(users: [PubNubUserMetadata], next: PubNubHashedPage?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### UserIncludeFields[​](#userincludefields)

`PubNub.UserIncludeFields` is a struct that defines which additional fields should be included in the response when fetching user metadata. It allows fine-grained control over what data is returned, helping optimize response payload size and network efficiency.

PropertyDescription`custom`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the user metadata object`type`Type: `Bool`Default:  
`true`Whether to include the type field for the user metadata object`status`Type: `Bool`Default:  
`true`Whether to include the status field for the user metadata object`totalCount`Type: `Bool`Default:  
`true`Whether to include the total count of how many user objects are available

#### Completion Handler Result[​](#completion-handler-result)

##### Success[​](#success)

A `Tuple` containing an `Array` of `PubNubUserMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubUserMetadata {  
  
  /// The unique identifier of the User  
  var metadataId: String { get }  
  
  /// The name of the User  
  var name: String { get set }  
  
  /// The classification of User  
  var type: String? { get set }  
  
  /// The current state of the User  
  var status: String? { get set }  
  
  /// The external identifier for the object  
`
```
show all 32 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Get User Metadata[​](#get-user-metadata)

Returns metadata for the specified User, optionally including the custom data object for each.

#### Method(s)[​](#methods-1)

To `Get User Metadata` you can use the following method(s) in the Swift SDK:

```
`func fetchUserMetadata(  
    _ metadataId: String?,  
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubUserMetadata, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`metadataId` *Type: StringDefault:  
n/aUnique User Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`include`Type: [`PubNub.UserIncludeFields`](#userincludefields)Default:  
`PubNub.UserIncludeFields()`Whether to include the custom field in the fetch response. For more information, refer to the [UserIncludeFields](#userincludefields) section.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubUserMetadata, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-1)

##### Success[​](#success-1)

The `PubNubUserMetadata` object belonging to the identifier.

```
`public protocol PubNubUserMetadata {  
  
  /// The unique identifier of the User  
  var metadataId: String { get }  
  
  /// The name of the User  
  var name: String { get set }  
  
  /// The classification of User  
  var type: String? { get set }  
  
  /// The current state of the User  
  var status: String? { get set }  
  
  /// The external identifier for the object  
`
```
show all 32 lines

##### Failure[​](#failure-1)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Set User Metadata[​](#set-user-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a User in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-2)

To `Set User Metadata` you can use the following method(s) in the Swift SDK:

```
`func setUserMetadata(  
    _ metadata: PubNubUserMetadata,  
    ifMatchesEtag: String? = nil,  
    include: PubNub.UserIncludeFields = PubNub.UserIncludeFields(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubUserMetadata, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`metadata` *Type: PubNubUserMetadataDefault:  
n/aUser Metadata to set.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`include`Type: [`PubNub.UserIncludeFields`](#userincludefields)Default:  
`PubNub.UserIncludeFields()`Whether to include the custom field in the fetch response. For more information, refer to the [UserIncludeFields](#userincludefields) section.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubUserMetadata, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### API limits

To learn about the maximum length of parameters used to set user metadata, refer to [REST API docs](/docs/sdks/rest-api/set-user-metadata).

#### Completion Handler Result[​](#completion-handler-result-2)

##### Success[​](#success-2)

The `PubNubUserMetadata` object belonging to the identifier.

```
`public protocol PubNubUserMetadata {  
  
  /// The unique identifier of the User  
  var metadataId: String { get }  
  
  /// The name of the User  
  var name: String { get set }  
  
  /// The classification of User  
  var type: String? { get set }  
  
  /// The current state of the User  
  var status: String? { get set }  
  
  /// The external identifier for the object  
`
```
show all 32 lines

##### Failure[​](#failure-2)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Remove User Metadata[​](#remove-user-metadata)

Removes the metadata from a specified UUID.

#### Method(s)[​](#methods-3)

To `Remove User Metadata` you can use the following method(s) in the Swift SDK:

```
`func removeUserMetadata(  
    _ metadataId: String?,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultString, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`metadataId` *Type: StringDefault:  
n/aUnique User Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<String, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-3)

##### Success[​](#success-3)

The User identifier of the removed object.

##### Failure[​](#failure-3)

An `Error` describing the failure

#### Basic Usage[​](#basic-usage-3)

```
`  
`
```

## Channel[​](#channel)

### Get Metadata for All Channels[​](#get-metadata-for-all-channels)

Returns a paginated list of Channel Metadata objects, optionally including the custom data object for each.

#### Method(s)[​](#methods-4)

To `Get All Channel Metadata` you can use the following method(s) in the Swift SDK:

```
`func allChannelMetadata(  
    include: PubNub.IncludeFields = PubNub.IncludeFields(),  
    filter: String? = nil,  
    sort: [PubNub.ObjectSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`include`Type: PubNub.IncludeFieldsDefault:  
`PubNub.IncludeFields()`Whether to include the custom field in the fetch response.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.ObjectSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.id`, `.name`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(channels: [PubNubChannelMetadata], next: PubNubHashedPage?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-4)

##### Success[​](#success-4)

A `Tuple` containing an `Array` of `PubNubChannelMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubChannelMetadata {  
  
  /// The unique identifier of the Channel  
  var metadataId: String { get }  
  
  /// The name of the Channel  
  var name: String { get set }  
  
  /// The classification of ChannelMetadata  
  var type: String? { get set }  
    
  /// The current state of the ChannelMetadata  
  var status: String? { get set }  
  
  /// Text describing the purpose of the channel  
`
```
show all 26 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-4)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-4)

```
`  
`
```

### Get Channel Metadata[​](#get-channel-metadata)

Returns metadata for the specified Channel, optionally including the custom data object for each.

#### Method(s)[​](#methods-5)

To `Get Channel Metadata` you can use the following method(s) in the Swift SDK:

```
`func fetchChannelMetadata(  
    _ metadataId: String?,  
    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubChannelMetadata, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aUnique Channel Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`include`Type: [`PubNub.ChannelIncludeFields`](#channelincludefields)Default:  
`PubNub.ChannelIncludeFields()`Whether to include the custom field in the fetch response. For more information, refer to the [ChannelIncludeFields](#channelincludefields) section.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubChannelMetadata, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### ChannelIncludeFields[​](#channelincludefields)

`PubNub.ChannelIncludeFields` is a struct that defines which additional fields should be included in the response when fetching channel metadata. It provides the same control options as `PubNub.UserIncludeFields` but for channel-specific operations.

PropertyDescription`custom`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the channel metadata object`type`Type: `Bool`Default:  
`true`Whether to include the type field for the channel metadata object`status`Type: `Bool`Default:  
`true`Whether to include the status field for the channel metadata object`totalCount`Type: `Bool`Default:  
`true`Whether to include the total count of how many channel objects are available

#### Completion Handler Result[​](#completion-handler-result-5)

##### Success[​](#success-5)

The `PubNubChannelMetadata` object belonging to the identifier.

```
`public protocol PubNubChannelMetadata {  
  
  /// The unique identifier of the Channel  
  var metadataId: String { get }  
  
  /// The name of the Channel  
  var name: String { get set }  
  
  /// The classification of ChannelMetadata  
  var type: String? { get set }  
    
  /// The current state of the ChannelMetadata  
  var status: String? { get set }  
  
  /// Text describing the purpose of the channel  
`
```
show all 26 lines

##### Failure[​](#failure-5)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-5)

```
`  
`
```

### Set Channel Metadata[​](#set-channel-metadata)

##### Unsupported partial updates of custom metadata

The value of the custom metadata parameter sent in this method always overwrites the value stored on PubNub servers. If you want to add new custom data to an existing one, you must:

1. $1

2. $1

3. $1

Set metadata for a Channel in the database, optionally including the custom data object for each.

#### Method(s)[​](#methods-6)

To `Set Channel Metadata` you can use the following method(s) in the Swift SDK:

```
`func setChannelMetadata(  
    _ metadata: PubNubChannelMetadata,  
    ifMatchesEtag: String? = nil  
    include: PubNub.ChannelIncludeFields = PubNub.ChannelIncludeFields(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultPubNubChannelMetadata, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`metadata` *Type: PubNubChannelMetadataDefault:  
n/aChannel Metadata to set.`ifMatchesEtag`Type: StringDefault:  
n/aThe entity tag to be used to ensure updates only happen if the object hasn't been modified since it was read. Use the eTag you received from an applicable get metadata method to check against the server entity tag. If the eTags don't match, an HTTP 412 error is thrown.`include`Type: [`PubNub.ChannelIncludeFields`](#channelincludefields)Default:  
`PubNub.ChannelIncludeFields()`Whether to include the custom field in the fetch response. For more information, refer to the [ChannelIncludeFields](#channelincludefields) section.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubChannelMetadata, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### API limits

To learn about the maximum length of parameters used to set channel metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-metadata).

#### Completion Handler Result[​](#completion-handler-result-6)

##### Success[​](#success-6)

The `PubNubChannelMetadata` object belonging to the identifier.

```
`public protocol PubNubChannelMetadata {  
  
  /// The unique identifier of the Channel  
  var metadataId: String { get }  
  
  /// The name of the Channel  
  var name: String { get set }  
  
  /// The classification of ChannelMetadata  
  var type: String? { get set }  
    
  /// The current state of the ChannelMetadata  
  var status: String? { get set }  
  
  /// Text describing the purpose of the channel  
`
```
show all 26 lines

##### Failure[​](#failure-6)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-6)

```
`  
`
```

#### Other Examples[​](#other-examples)

##### Iteratively update existing metadata[​](#iteratively-update-existing-metadata)

```
`  
`
```

### Remove Channel Metadata[​](#remove-channel-metadata)

Removes the metadata from a specified channel.

#### Method(s)[​](#methods-7)

To `Remove Channel Metadata` you can use the following method(s) in the Swift SDK:

```
`func removeChannelMetadata(  
    _ metadataId: String?,  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((ResultString, Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aUnique Channel Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<PubNubChannelMetadata, Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-7)

##### Success[​](#success-7)

The Channel identifier of the removed object.

##### Failure[​](#failure-7)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-7)

```
`  
`
```

## Channel Memberships[​](#channel-memberships)

### Get Channel Memberships[​](#get-channel-memberships)

The method returns a list of channel memberships for a user. This method doesn't return a user's subscriptions.

#### Method(s)[​](#methods-8)

To `Get Memberships` you can use the following method(s) in the Swift SDK:

To `Get Channel Memberships` you can use the following method(s) in the Swift SDK:

```
`func fetchMemberships(  
    userId: String?,  
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`userId` *Type: StringDefault:  
n/aUnique User Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`include`Type: [`PubNub.MembershipInclude`](#membershipinclude)Default:  
`PubNub.MembershipInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MembershipInclude](#membershipinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### MembershipInclude[​](#membershipinclude)

`PubNub.MembershipInclude` is a struct that defines which additional fields should be included in the response when fetching user membership data (channels a user belongs to). It provides granular control over both membership fields and associated channel metadata fields.

PropertyDescription`customFields`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the membership object`channelFields`Type: `Bool`Default:  
`false`Whether to include the full PubNubChannelMetadata instance in the membership`typeField`Type: `Bool`Default:  
`true`Whether to include the type field of the membership object`statusField`Type: `Bool`Default:  
`true`Whether to include the status field of the membership object`channelTypeField`Type: `Bool`Default:  
`false`Whether to include the type field of the associated channel metadata`channelStatusField`Type: `Bool`Default:  
`false`Whether to include the status field of the associated channel metadata`channelCustomFields`Type: `Bool`Default:  
`false`Whether to include the custom dictionary of the associated channel metadata`totalCount`Type: `Bool`Default:  
`false`Whether to include the total count of how many membership objects are available

#### Completion Handler Result[​](#completion-handler-result-8)

##### Success[​](#success-8)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-8)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-8)

- Fetch and handle user channel memberships.

```
`  
`
```

- Return sorted channel memberships for the given user ID.

```
`  
`
```

### Set Channel Memberships[​](#set-channel-memberships)

Set channel memberships for a User.

#### Method(s)[​](#methods-9)

To `Set Channel Memberships` you can use the following method(s) in the Swift SDK:

```
`func setMemberships(  
    userId metadataId: String?,  
    channels memberships: [PubNubMembershipMetadata],  
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`userId` *Type: StringDefault:  
n/aUnique User Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`channels` *Type: [PubNubMembershipMetadata]Default:  
n/aArray of `PubNubMembershipMetadata` with the `PubNubChannelMetadata` or `channelMetadataId` provided.`include`Type: [`PubNub.MembershipInclude`](#membershipinclude)Default:  
`PubNub.MembershipInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MembershipInclude](#membershipinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### API limits

To learn about the maximum length of parameters used to set channel membership metadata, refer to [REST API docs](/docs/sdks/rest-api/set-membership-metadata).

#### Completion Handler Result[​](#completion-handler-result-9)

##### Success[​](#success-9)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-9)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-9)

```
`  
`
```

### Remove Channel Memberships[​](#remove-channel-memberships)

Remove channel memberships for a User.

#### Method(s)[​](#methods-10)

To `Remove Channel Memberships` you can use the following method(s) in the Swift SDK:

```
`func removeMemberships(  
    userId metadataId: String?,  
    channels memberships: [PubNubMembershipMetadata],  
    include: PubNub.MembershipInclude = PubNub.MembershipInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`userId` *Type: StringDefault:  
n/aUnique User Metadata identifier. If not supplied, then it will use the request configuration and then the default configuration.`channels` *Type: [PubNubMembershipMetadata]Default:  
n/aArray of `PubNubMembershipMetadata` with the `PubNubChannelMetadata` or `channelMetadataId` provided.`include`Type: [`PubNub.MembershipInclude`](#membershipinclude)Default:  
`PubNub.MembershipInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MembershipInclude](#membershipinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-10)

##### Success[​](#success-10)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-10)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-10)

```
`  
`
```

## Channel Members[​](#channel-members)

### Get Channel Members[​](#get-channel-members)

The method returns a list of members in a channel. The list will include user metadata for members that have additional metadata stored in the database.

#### Method(s)[​](#methods-11)

To `Get Channel Members` you can use the following method(s) in the Swift SDK:

```
`func fetchMembers(  
    channel: String?,  
    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aUnique Channel Metadata identifier.`include`Type: [`PubNub.MemberInclude`](#memberinclude)Default:  
`PubNub.MemberInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MemberInclude](#memberinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### MemberInclude[​](#memberinclude)

`PubNub.MemberInclude` is a struct that defines which additional fields should be included in the response when fetching channel member data (users that belong to a channel). It provides granular control over both membership fields and associated user metadata fields.

PropertyDescription`customFields`Type: `Bool`Default:  
`true`Whether to include the custom dictionary for the membership object`uuidFields`Type: `Bool`Default:  
`false`Whether to include the full PubNubUserMetadata instance in the membership`statusField`Type: `Bool`Default:  
`true`Whether to include the status field of the membership object`typeField`Type: `Bool`Default:  
`true`Whether to include the type field of the membership object`uuidTypeField`Type: `Bool`Default:  
`false`Whether to include the type field of the associated user metadata`uuidStatusField`Type: `Bool`Default:  
`false`Whether to include the status field of the associated user metadata`uuidCustomFields`Type: `Bool`Default:  
`false`Whether to include the custom dictionary of the associated user metadata`totalCount`Type: `Bool`Default:  
`false`Whether to include the total count of how many member objects are available

#### Completion Handler Result[​](#completion-handler-result-11)

##### Success[​](#success-11)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-11)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-11)

```
`  
`
```

### Set Channel Members[​](#set-channel-members)

This method sets members in a channel.

#### Method(s)[​](#methods-12)

To `Set Channel Members` you can use the following method(s) in the Swift SDK:

```
`func setMembers(  
    channel metadataId: String,  
    users members: [PubNubMembershipMetadata],  
    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aUnique Channel identifier.`users` *Type: [PubNubMembershipMetadata]Default:  
n/aArray of `PubNubMembershipMetadata` with the `PubNubUserMetadata` or `userMetadataId` provided.`include`Type: [`PubNub.MemberInclude`](#memberinclude)Default:  
`PubNub.MemberInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MemberInclude](#memberinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

##### API limits

To learn about the maximum length of parameters used to set channel members metadata, refer to [REST API docs](/docs/sdks/rest-api/set-channel-members-metadata).

#### Completion Handler Result[​](#completion-handler-result-12)

##### Success[​](#success-12)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userdMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-12)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-12)

```
`  
`
```

### Remove Channel Members[​](#remove-channel-members)

Remove members from a Channel.

#### Method(s)[​](#methods-13)

To `Remove Channel Members` you can use the following method(s) in the Swift SDK:

```
`func removeMembers(  
    channel metadataId: String,  
    users members: [PubNubMembershipMetadata],  
    include: PubNub.MemberInclude = PubNub.MemberInclude(),  
    filter: String? = nil,  
    sort: [PubNub.MembershipSortField] = [],  
    limit: Int? = 100,  
    page: PubNubHashedPage? = Page(),  
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
    completion: ((Result(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?  
)  
`
```

*  requiredParameterDescription`channel` *Type: StringDefault:  
n/aUnique Channel identifier.`uuids` *Type: [PubNubMembershipMetadata]Default:  
n/aArray of `PubNubMembershipMetadata` with the `PubNubUserMetadata` or `userMetadataId` provided.`include`Type: [`PubNub.MemberInclude`](#memberinclude)Default:  
`PubNub.MemberInclude()`Whether to include the custom field in the fetch response. For more information, refer to the [MemberInclude](#memberinclude) section.`filter`Type: String?Default:  
`nil`Expression used to filter the results. Only objects whose properties satisfy the given expression are returned. The filter language is defined [here](/docs/general/metadata/filtering).`sort`Type: [PubNub.MembershipSortField]Default:  
`[]`List of properties to sort response objects. The following properties are valid for sorting: `.object(.id)`, `.object(.name)`, `.object(.type)`, `.object(.status)`, `.object(.updated)`, `.type`, `.status`, and `.updated`.`limit`Type: Int?Default:  
100The number of objects to retrieve at a time.`page`Type: PubNubHashedPage?Default:  
`PubNub.Page()`The paging object used for pagination.`custom`Type: [`PubNub.RequestConfiguration`](/docs/sdks/swift/api-reference/configuration#request-configuration)Default:  
`PubNub.RequestConfiguration()`An object that allows for per-request customization of PubNub configuration or network session. For more information, refer to the [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration) section.`completion`Type: `((Result<(memberships: [PubNubMembershipMetadata], next: PubNubHashedPageBase?), Error>) -> Void)?`Default:  
`nil`The async `Result` of the method call.

#### Completion Handler Result[​](#completion-handler-result-13)

##### Success[​](#success-13)

A `Tuple` containing an `Array` of `PubNubMembershipMetadata`, and the next pagination `PubNubHashedPage` (if one exists).

```
`public protocol PubNubMembershipMetadata {  
  
  /// The unique identifier of the associated User  
  var userdMetadataId: String { get }  
  
  /// The unique identifier of the associated Channel  
  var channelMetadataId: String { get }  
  
  /// The current status of the MembershipMetadata  
  var status: String? { get set }  
    
  /// The current type of the MembershipMetadata  
  var type: String? { get set }  
  
  /// The associated User metadata  
`
```
show all 29 lines

```
`public protocol PubNubHashedPage {  
  
  /// The hash value representing the next set of data  
  var start: String? { get }  
  
  /// The hash value representing the previous set of data  
  var end: String? { get }  
  
  /// The total count of all objects withing range  
  var totalCount: Int? { get }  
}  
`
```

##### Failure[​](#failure-13)

An `Error` describing the failure.

#### Basic Usage[​](#basic-usage-13)

```
`**`
```
Last updated on Jun 12, 2025**