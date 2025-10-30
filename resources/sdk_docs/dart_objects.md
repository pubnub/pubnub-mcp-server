# App Context API for Dart SDK

App Context (formerly Objects v2) provides serverless storage for user and channel metadata and their membership associations. PubNub emits real-time events when object data changes.

Refer to the migration guide for upgrading from Objects v1.

## User

### Get metadata for all users

Returns a paginated list of UUID Metadata objects, optionally including the custom data object.

#### Method(s)

```
`1pubnub.objects.getAllUUIDMetadata(  
2  {bool? includeCustomFields,  
3  int? limit,  
4  String? start,  
5  String? end,  
6  bool? includeCount,  
7  bool includeStatus,  
8  bool includeType,  
9  String? filter,  
10  SetString>? sort,  
11  Keyset? keyset,  
12  String? using}  
13)   
`
```

Parameters:
- includeCustomFields (bool, default: false) Include Custom in response.
- limit (int, default: 100, max: 100) Number of objects to return.
- start (String) Forward cursor for pagination.
- end (String) Backward cursor for pagination.
- includeCount (bool, default: false) Include total count in paginated response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.
- filter (String) Filter expression. See filtering guide.
- sort (Set<String>) Sort by id, name, updated with asc/desc (example: {name: 'asc'}).
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

#### Sample code

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Get metadata for all users  
14  try {  
15    var result = await pubnub.objects.getAllUUIDMetadata(  
16      includeCustomFields: true,  
17      limit: 20,  
18    );  
19
  
20    // Print the result  
21    for (var metadata in result.data) {  
22      print('UUID: ${metadata.id}, Name: ${metadata.name}');  
23    }  
24  } catch (e) {  
25    print('Failed to get all UUID metadata: $e');  
26  }  
27}  
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "id": "uuid-1",  
6            "name": "John Doe",  
7            "externalId": null,  
8            "profileUrl": null,  
9            "email": "johndoe@pubnub.com",  
10            "custom": null,  
11            "updated": "2019-02-20T23:11:20.893755",  
12            "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
13        },  
14        {  
15            "id": "uuid-2",  
16            "name": "Bob Cat",  
17            "externalId": null,  
18            "profileUrl": null,  
19            "email": "bobc@example.com",  
20            "custom": {  
21                "phone": "999-999-9999"  
22            },  
23            "updated": "2019-02-21T03:29:00.173452",  
24            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
25        }  
26    ]  
27}  
`
```

### Get user metadata

Returns metadata for a specified UUID.

#### Method(s)

```
`1pubnub.objects.getUUIDMetadata(  
2  {String? uuid,  
3  Keyset? keyset,  
4  String? using,  
5  bool? includeCustomFields,  
6  bool includeStatus,  
7  bool includeType  
8  }  
9)   
`
```

Parameters:
- uuid (String, default: UUID from default keyset) UUID to fetch.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.
- includeCustomFields (bool, default: false) Include Custom in response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.

#### Sample code

```
`1var result = await pubnub.objects.getUUIDMetadata();  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "uuid-1",  
5        "name": "John Doe",  
6        "externalId": null,  
7        "profileUrl": null,  
8        "email": "johndoe@pubnub.com",  
9        "updated": "2019-02-20T23:11:20.893755",  
10        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
11    }  
12}  
`
```

### Set user metadata

Set metadata for a UUID, optionally including custom data.

Unsupported partial updates of custom metadata:
- The custom field overwrites existing data. To merge:
  1) Get the current UUID metadata.
  2) Merge your changes locally into the custom object.
  3) Write back using setUUIDMetadata.

#### Method(s)

```
1pubnub.objects.setUUIDMetadata(  
2  UuidMetadataInput uuidMetadataInput,  
3  {String? uuid,  
4  bool? includeCustomFields,  
5  bool includeStatus,  
6  bool includeType,  
7  String? ifMatchesEtag,  
8  Keyset? keyset,  
9  String? using}  
10)  
11
  
12class UuidMetadataInput {  
13  String? name;  
14  String? email;  
15  dynamic custom;  
16  String? externalId;  
17  String? profileUrl;  
18  String? status;  
19  String? type;  
20}  
```

Parameters:
- uuidMetadataInput (UuidMetadataInput) UUID metadata details. Filtering by custom is not supported.
- uuid (String, default: UUID from default keyset) UUID to set.
- includeCustomFields (bool, default: false) Include Custom in response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.
- ifMatchesEtag (String?) Use eTag for conditional update; mismatches return HTTP 412.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

API limits: See REST API docs for parameter limits.

#### Sample code

```
`1var uuidMetadataInput = UuidMetadataInput(  
2    name: 'foo',  
3    email: 'foo@example.domain',  
4    profileUrl: 'http://sample.com');  
5var result = await pubnub.objects.setUUIDMetadata(uuidMetadataInput);  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "uuid-1",  
5        "name": "John Doe",  
6        "externalId": null,  
7        "profileUrl": null,  
8        "email": "johndoe@pubnub.com",  
9        "updated": "2019-02-20T23:11:20.893755",  
10        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
11    }  
12}  
`
```

### Remove user metadata

Removes metadata for a specified UUID.

#### Method(s)

```
`1pubnub.objects.removeUUIDMetadata(  
2  {String? uuid,  
3  Keyset? keyset,  
4  String? using}  
5)   
`
```

Parameters:
- uuid (String, default: UUID from default keyset) UUID to remove.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

#### Sample code

```
`1var result = await pubnub.objects.removeUUIDMetadata();  
`
```

#### Response

Returns RemoveUuidMetadataResult without actionable data; errors throw exceptions.

## Channel

### Get metadata for all channels

Returns a paginated list of Channel Metadata objects, optionally including the custom data object.

#### Method(s)

```
`1pubnub.objects.getAllChannelMetadata(  
2  {int? limit,  
3  String? start,  
4  String? end,  
5  bool? includeCustomFields,  
6  bool? includeCount,  
7  bool includeStatus,  
8  bool includeType,  
9  String? filter,  
10  SetString>? sort,  
11  Keyset? keyset,  
12  String? using}  
13)  
`
```

Parameters:
- limit (int, default: 100, max: 100) Number of objects to return.
- start (String) Forward cursor for pagination.
- end (String) Backward cursor for pagination (ignored if start is provided).
- includeCustomFields (bool, default: false) Include Custom in response.
- includeCount (bool, default: false) Include total count in paginated response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.
- filter (String) Filter expression. See filtering guide.
- sort (Set<String>) Sort by id, name, updated with asc/desc.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

#### Sample code

```
`1var result = await pubnub.objects.getAllChannelMetadata();  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "id": "my-channel",  
6            "name": "My channel",  
7            "description": "A channel that is mine",  
8            "custom": null,  
9            "updated": "2019-02-20T23:11:20.893755",  
10            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
11        },  
12        {  
13            "id": "main",  
14            "name": "Main channel",  
15            "description": "The main channel",  
16            "custom": {  
17                "public": true,  
18                "motd": "Always check your spelling!"  
19            },  
20            "updated": "2019-02-20T23:11:20.893755",  
21            "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
22        }  
23    ],  
24    "totalCount": 9,  
25    "next": "MUIwQTAwMUItQkRBRC00NDkyLTgyMEMtODg2OUU1N0REMTNBCg==",  
26    "prev": "M0FFODRENzMtNjY2Qy00RUExLTk4QzktNkY1Q0I2MUJFNDRCCg=="  
27}  
`
```

### Get channel metadata

Returns metadata for a specified channel.

#### Method(s)

```
`1pubnub.objects.getChannelMetadata(  
2  String channelId,  
3  {Keyset? keyset,  
4  String? using,  
5  bool? includeCustomFields  
6  bool includeStatus,  
7  bool includeType}  
8)   
`
```

Parameters:
- channelId (String) Channel name.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.
- includeCustomFields (bool, default: false) Include Custom in response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.

#### Sample code

```
`1var channelMetadata = await pubnub.objects.getChannelMetadata('my_channel');  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "my-channel",  
5        "name": "My channel",  
6        "description": "A channel that is mine",  
7        "updated": "2019-02-20T23:11:20.893755",  
8        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
9    }  
10}  
`
```

### Set channel metadata

Set metadata for a channel, optionally including custom data.

Unsupported partial updates of custom metadata:
- The custom field overwrites existing data. To merge:
  1) Get the current channel metadata (includeCustomFields: true).
  2) Merge your changes locally into the custom object.
  3) Write back using setChannelMetadata.

#### Method(s)

```
1pubnub.objects.setChannelMetadata(  
2  String channelId,  
3  ChannelMetadataInput channelMetadataInput,  
4  {bool? includeCustomFields,  
5  bool includeStatus,  
6  bool includeType,  
7  String? ifMatchesEtag,  
8  Keyset? keyset,  
9  String? using}  
10)   
11
  
12class ChannelMetadataInput {  
13  String? name;  
14  String? description;  
15  dynamic custom;  
16  String? status;  
17  String? type;  
18}  
```

Parameters:
- channelId (String) Channel name.
- channelMetadataInput (ChannelMetadataInput) Channel metadata details. Filtering by Custom isn’t supported.
- includeCustomFields (bool, default: false) Include Custom in response.
- includeStatus (bool, default: true) Include status in response.
- includeType (bool, default: true) Include type in response.
- ifMatchesEtag (String?) Use eTag for conditional update; mismatches return HTTP 412.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

API limits: See REST API docs for parameter limits.

#### Sample code

```
`1var channelMetadataInput = ChannelMetadataInput(  
2    name: 'Channel name', description: 'A channel that is mine');  
3      
4var result = await pubnub.objects  
5    .setChannelMetadata('my_channel', channelMetadataInput);  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": {  
4        "id": "my-channel",  
5        "name": "My channel",  
6        "description": "A channel that is mine",  
7        "updated": "2019-02-20T23:11:20.893755",  
8        "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
9    }  
10}  
`
```

#### Other examples

Iteratively update existing metadata:

```
1import 'dart:async';  
2import 'package:pubnub/pubnub.dart';  
3Futurevoid> main() async {  
4  var keyset = Keyset(  
5      publishKey: 'demo',  
6      subscribeKey: 'demo',  
7      userId: const UserId('example'));  
8  var pubnub = PubNub(defaultKeyset: keyset);  
9  var channel = 'main';  
10  var name = 'Main Channel';  
11  var description = 'This is the main channel.';  
12  var custom = {'users': 10};  
13
  
14  // Setting the basic channel info  
15  var channelMetadataInput = ChannelMetadataInput(  
16    name: name,  
17    description: description,  
18    custom: custom  
19  );  
20  var setResult =  
21      await pubnub.objects.setChannelMetadata(channel, channelMetadataInput);  
22  print('The channel has been created with name and description.\n');  
23
  
24    // First we have to get the current object to know what fields are already set  
25    var currentObject = await pubnub.objects  
26        .getChannelMetadata(channel, includeCustomFields: true);  
27
  
28    // We may have to initialize the custom field  
29    var customFields = currentObject.metadata.custom;  
30    customFields ??= {};  
31
  
32    // Updating the custom field  
33    customFields['private'] = false;  
34
  
35    // Writing the updated object back to the server  
36    channelMetadataInput = ChannelMetadataInput(  
37      name: currentObject.metadata.name,  
38      description: currentObject.metadata.description,  
39      custom: customFields,  
40    );  
41
  
42    try {  
43      setResult =  
44          await pubnub.objects.setChannelMetadata(channel, channelMetadataInput);  
45      print('The channel has been updated with the custom field.\n');  
46    } on PubNubException catch (e) {  
47      print('An error occurred: ${e.message}');  
48    }  
49}  
```

### Remove channel metadata

Removes metadata for a specified channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMetadata(  
2  String channelId,  
3  {Keyset? keyset,  
4  String? using}  
5)   
`
```

Parameters:
- channelID (String) Channel name.
- keyset (Keyset) Override default keyset configuration.
- using (String) Keyset name from keysetStore to use.

#### Sample code

```
`1var result = await pubnub.objects.removeChannelMetadata('my_channel');  
`
```

#### Response

Returns RemoveChannelMetadataResult without actionable data; errors throw exceptions.

## Channel memberships

### Get channel memberships

Returns a list of channel memberships for a user (not subscriptions).

#### Method(s)

```
`1pubnub.objects.getMemberships(  
2  {String? uuid,  
3  int? limit,  
4  String? start,  
5  String? end,  
6  bool? includeCustomFields,  
7  bool? includeChannelFields,  
8  bool? includeChannelCustomFields,  
9  bool? includeChannelStatus,  
10  bool? includeChannelType,  
11  bool? includeCount = true,  
12  String? filter,  
13  SetString>? sort,  
14  Keyset? keyset,  
15  String? using}  
16)   
`
```

Parameters:
- uuid (String, default: UUID from default keyset) UUID to fetch memberships for.
- limit (int, default: 100, max: 100)
- start (String) Forward cursor.
- end (String) Backward cursor.
- includeCustomFields (bool, default: false) Include membership Custom in response.
- includeChannelFields (bool, default: false) Include channel metadata fields.
- includeChannelCustomFields (bool, default: false) Include channel custom fields.
- includeChannelStatus (bool, default: true) Include channel status.
- includeChannelType (bool, default: true) Include channel type.
- includeCount (bool, default: false) Include total count.
- filter (String) Filter expression. See filtering guide.
- sort (Set<String>) Sort by id, name, updated with asc/desc.
- keyset (Keyset) Override default keyset.
- using (String) Keyset name from keysetStore.

#### Sample code

```
`1  var memberships = await pubnub.objects.getMemberships();  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6                "id": "my-channel",  
7                "name": "My channel",  
8                "description": "A channel that is mine",  
9                "custom": null,  
10                "updated": "2019-02-20T23:11:20.893755",  
11                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20            "channel": {  
21                "id": "main",  
22                "name": "Main channel",  
23                "description": "The main channel",  
24                "custom": {  
25                    "public": true,  
26                    "motd": "Always check your spelling!"  
27                },  
28                "updated": "2019-02-20T23:11:20.893755",  
29                "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30            },  
31            "updated": "2019-02-20T23:11:20.893755",  
32            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

### Set channel memberships

Set channel memberships for a UUID.

#### Method(s)

```
1pubnub.objects.setMemberships(  
2  ListMembershipMetadataInput> setMetadata,  
3  {String? uuid,  
4  int? limit,  
5  String? start,  
6  String? end,  
7  bool? includeCustomFields,  
8  bool? includeChannelFields,  
9  bool? includeChannelCustomFields,  
10  bool includeChannelStatus,  
11  bool includeChannelType,  
12  bool includeStatus,  
13  bool includeType,  
14  bool? includeCount = true,  
15  String? filter,  
16  SetString>? sort,  
17  Keyset? keyset,  
18  String? using}  
19)  
20
  
21class MembershipMetadataInput {  
22  String channelId;  
23  MapString, dynamic>? custom;  
24}  
```

Parameters:
- setMetadata (List<MembershipMetadataInput>) Memberships to set.
- uuid (String, default: UUID from default keyset)
- limit (int, default: 100, max: 100)
- start (String), end (String) Pagination cursors.
- includeCustomFields (bool, default: false) Include membership Custom.
- includeChannelFields (bool, default: false) Include channel metadata fields.
- includeChannelCustomFields (bool, default: false)
- includeChannelStatus (bool, default: true)
- includeChannelType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>) Sort by id, name, updated with asc/desc.
- keyset (Keyset), using (String)

API limits: See REST API docs for parameter limits.

#### Sample code

```
1  var setMetadata = [  
2    MembershipMetadataInput('my_channel', custom: {'starred': 'false'})  
3  ];  
4
  
5  var result = await pubnub.objects  
6      .setMemberships(setMetadata, includeChannelFields: true);  
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6              "id": "my-channel",  
7              "name": "My channel",  
8              "description": "A channel that is mine",  
9              "custom": null,  
10              "updated": "2019-02-20T23:11:20.893755",  
11              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20          "channel": {  
21              "id": "main",  
22              "name": "Main channel",  
23              "description": "The main channel",  
24              "custom": {  
25                  "public": true,  
26                  "motd": "Always check your spelling!"  
27              },  
28              "updated": "2019-02-20T23:11:20.893755",  
29              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30          },  
31          "updated": "2019-02-20T23:11:20.893755",  
32          "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

### Remove channel memberships

Remove channel memberships for a UUID.

#### Method(s)

```
`1pubnub.objects.removeMemberships(  
2  SetString> channelIds,  
3  {String? uuid,  
4  int? limit,  
5  String? start,  
6  String? end,  
7  bool? includeCustomFields,  
8  bool? includeChannelFields,  
9  bool? includeChannelCustomFields,  
10  bool includeStatus,  
11  bool includeType,  
12  bool includeChannelStatus,  
13  bool includeChannelType,  
14  bool? includeCount = true,  
15  String? filter,  
16  SetString>? sort,  
17  Keyset? keyset,  
18  String? using}  
19)  
`
```

Parameters:
- channelIds (Set<String>) Channels to remove from membership.
- uuid (String, default: UUID from default keyset)
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false)
- includeChannelFields (bool, default: false)
- includeChannelCustomFields (bool, default: false)
- includeChannelStatus (bool, default: true)
- includeChannelType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

#### Sample code

```
1  var result = await pubnub.objects.removeMemberships({'my_channel', 'main_channel'});  
2
  
3  // for other uuid  
4  var result = await pubnub.objects.removeMemberships({'my_channel'}, uuid: 'uuid1');  
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6              "id": "my-channel",  
7              "name": "My channel",  
8              "description": "A channel that is mine",  
9              "custom": null,  
10              "updated": "2019-02-20T23:11:20.893755",  
11              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20            "channel": {  
21              "id": "main",  
22              "name": "Main channel",  
23              "description": "The main channel",  
24              "custom": {  
25                  "public": true,  
26                  "motd": "Always check your spelling!"  
27              },  
28              "updated": "2019-02-20T23:11:20.893755",  
29              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30            },  
31            "updated": "2019-02-20T23:11:20.893755",  
32            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

### Manage channel memberships

Manage a user's channel memberships (set and remove in one call).

#### Method(s)

```
1pubnub.objects.manageMemberships(  
2  ListMembershipMetadataInput> setMetadata,  
3  SetString> removeChannelIds,  
4  {String? uuid,  
5  int? limit,  
6  String? start,  
7  String? end,  
8  bool? includeCustomFields,  
9  bool? includeChannelFields,  
10  bool? includeChannelCustomFields,  
11  bool includeStatus,  
12  bool includeType,  
13  bool includeChannelStatus,  
14  bool includeChannelType,  
15  bool? includeCount,  
16  String? filter,  
17  SetString>? sort,  
18  Keyset? keyset,  
19  String? using}  
20)  
21
  
22class MembershipMetadataInput {  
23  String channelId;  
24  MapString, dynamic>? custom;  
25}  
```

Parameters:
- setMetadata (List<MembershipMetadataInput>) Memberships to set.
- removeChannelIds (Set<String>) Channels to remove from membership.
- uuid (String, default: UUID from default keyset)
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false)
- includeChannelFields (bool, default: false)
- includeChannelCustomFields (bool, default: false)
- includeChannelStatus (bool, default: true)
- includeChannelType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

#### Sample code

```
`1  var setMetadata = [  
2    MembershipMetadataInput('my_channel', custom: {'starred': 'false'})  
3  ];  
4  var result =  
5      await pubnub.objects.manageMemberships(setMetadata, {'main_channel'});  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "channel": {  
6              "id": "my-channel",  
7              "name": "My channel",  
8              "description": "A channel that is mine",  
9              "custom": null,  
10              "updated": "2019-02-20T23:11:20.893755",  
11              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
12            },  
13            "custom": {  
14                "starred": false  
15            },  
16            "updated": "2019-02-20T23:11:20.893755",  
17            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
18        },  
19        {  
20            "channel": {  
21              "id": "main",  
22              "name": "Main channel",  
23              "description": "The main channel",  
24              "custom": {  
25                  "public": true,  
26                  "motd": "Always check your spelling!"  
27              },  
28              "updated": "2019-02-20T23:11:20.893755",  
29              "eTag": "RTc1NUQwNUItREMyNy00Q0YxLUJCNDItMEZDMTZDMzVCN0VGCg=="  
30            },  
31            "updated": "2019-02-20T23:11:20.893755",  
32            "eTag": "RUNDMDUwNjktNUYwRC00RTI0LUI1M0QtNUUzNkE2NkU0MEVFCg=="  
33        }  
34    ],  
35    "totalCount": 7,  
36    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
37    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
38}  
`
```

## Channel members

### Get channel members

Returns a list of members in a channel. Includes user metadata when available.

#### Method(s)

```
`1pubnub.objects.getChannelMembers(  
2  String channelId,  
3  {int? limit,  
4  String? start,  
5  String? end,  
6  bool? includeCustomFields,  
7  bool? includeUUIDFields,  
8  bool? includeUUIDCustomFields,  
9  bool includeStatus,  
10  bool includeType,  
11  bool includeUUIDStatus,  
12  bool includeUUIDType,  
13  bool? includeCount = true,  
14  String? filter,  
15  SetString>? sort,  
16  Keyset? keyset,  
17  String? using}  
18)   
`
```

Parameters:
- channelId (String) Channel name.
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false) Include membership Custom.
- includeUUIDFields (bool, default: false) Include user metadata fields.
- includeUUIDCustomFields (bool, default: false) Include user custom fields.
- includeUUIDStatus (bool, default: true)
- includeUUIDType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

#### Sample code

```
`1  var channelMembers = await pubnub.objects.getChannelMembers('my_channel');  
`
```

#### Response

```
`1{  
2  "status": 200,  
3  "data": [  
4    {  
5      "uuid": {  
6        "id": "uuid-1",  
7        "name": "John Doe",  
8        "externalId": null,  
9        "profileUrl": null,  
10        "email": "someone@pubnub.com",  
11        "custom": null,  
12        "updated": "2019-02-20T23:11:20.893755",  
13        "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14      },  
15      "custom": {  
16        "role": "admin"  
17      },  
18      "updated": "2019-02-20T23:11:20.893755",  
19      "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20    },  
21    {  
22      "uuid": {  
23        "id": "uuid-2",  
24        "name": "Bob Cat",  
25        "externalId": null,  
26        "profileUrl": null,  
27        "email": "bobc@example.com",  
28        "custom": {  
29          "phone": "999-999-9999"  
30        },  
31        "updated": "2019-02-21T03:29:00.173452",  
32        "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33      },  
34      "updated": "2019-02-20T23:11:20.893755",  
35      "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36    }  
37  ],  
38  "totalCount": 37,  
39  "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40  "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```

### Set channel members

Sets members in a channel.

#### Method(s)

```
1pubnub.objects.setChannelMembers(  
2  String channelId,  
3  ListChannelMemberMetadataInput> setMetadata,  
4  {int? limit,  
5  String? start,  
6  String? end,  
7  bool? includeCustomFields,  
8  bool? includeUUIDFields,  
9  bool? includeUUIDCustomFields,  
10  bool includeStatus,  
11  bool includeType,  
12  bool includeUUIDStatus,  
13  bool includeUUIDType,  
14  bool? includeCount,  
15  String? filter,  
16  SetString>? sort,  
17  Keyset? keyset,  
18  String? using}  
19)  
20
  
21class ChannelMemberMetadataInput {  
22  String uuid;  
23  MapString, dynamic>? custom;  
24  String? status;  
25  String type;  
26}  
```

Parameters:
- channelId (String) Channel name.
- setMetadata (List<ChannelMemberMetadataInput>) Metadata to add.
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false)
- includeUUIDFields (bool, default: false)
- includeUUIDCustomFields (bool, default: false)
- includeUUIDStatus (bool, default: true)
- includeUUIDType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

API limits: See REST API docs for parameter limits.

#### Sample code

```
`1  var setMetadata = [  
2    ChannelMemberMetadataInput('myUUID', custom: {'role': 'admin'})  
3  ];  
4  var result =  
5      await pubnub.objects.setChannelMembers('my_channel', setMetadata);  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "uuid": {  
6                "id": "uuid-1",  
7                "name": "John Doe",  
8                "externalId": null,  
9                "profileUrl": null,  
10                "email": "johndoe@pubnub.com",  
11                "custom": null,  
12                "updated": "2019-02-20T23:11:20.893755",  
13                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14            },  
15            "custom": {  
16                "role": "admin"  
17            },  
18            "updated": "2019-02-20T23:11:20.893755",  
19            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20        },  
21        {  
22            "uuid": {  
23                "id": "uuid-2",  
24                "name": "Bob Cat",  
25                "externalId": null,  
26                "profileUrl": null,  
27                "email": "bobc@example.com",  
28                "custom": {  
29                    "phone": "999-999-9999"  
30                },  
31                "updated": "2019-02-21T03:29:00.173452",  
32                "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33            },  
34            "updated": "2019-02-20T23:11:20.893755",  
35            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36        }  
37    ],  
38    "totalCount": 37,  
39    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```

### Remove channel members

Removes members from a channel.

#### Method(s)

```
`1pubnub.objects.removeChannelMembers(  
2  String channelId,  
3  SetString> uuids,  
4  {int? limit,  
5  String? start,  
6  String? end,  
7  bool? includeCustomFields,  
8  bool? includeUUIDFields,  
9  bool? includeUUIDCustomFields,  
10  bool includeStatus,  
11  bool includeType,  
12  bool includeUUIDStatus,  
13  bool includeUUIDType,  
14  bool? includeCount,  
15  String? filter,  
16  SetString>? sort,  
17  Keyset? keyset,  
18  String? using}  
19)   
`
```

Parameters:
- channelId (String) Channel name.
- uuids (Set<String>) UUIDs to remove.
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false)
- includeUUIDFields (bool, default: false)
- includeUUIDCustomFields (bool, default: false)
- includeUUIDStatus (bool, default: true)
- includeUUIDType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

#### Sample code

```
`1  var result = await pubnub.objects  
2      .removeChannelMembers('my_channel', {'uuid-1', 'uuid-2'});  
`
```

#### Response

```
`1{  
2    "status": 200,  
3    "data": [  
4        {  
5            "uuid": {  
6                "id": "uuid-1",  
7                "name": "John Doe",  
8                "externalId": null,  
9                "profileUrl": null,  
10                "email": "johndoe@pubnub.com",  
11                "custom": null,  
12                "updated": "2019-02-20T23:11:20.893755",  
13                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14            },  
15            "custom": {  
16                "role": "admin"  
17            },  
18            "updated": "2019-02-20T23:11:20.893755",  
19            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20        },  
21        {  
22            "uuid": {  
23                "id": "uuid-2",  
24                "name": "Bob Cat",  
25                "externalId": null,  
26                "profileUrl": null,  
27                "email": "bobc@example.com",  
28                "custom": {  
29                    "phone": "999-999-9999"  
30                },  
31                "updated": "2019-02-21T03:29:00.173452",  
32                "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33            },  
34            "updated": "2019-02-20T23:11:20.893755",  
35            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36        }  
37    ],  
38    "totalCount": 37,  
39    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```

### Manage channel members

Set and remove channel members in a single call.

#### Method(s)

```
1pubnub.objects.manageChannelMembers(  
2  String channelId,  
3  ListChannelMemberMetadataInput> setMetadata,  
4  SetString> removeMemberUuids,  
5  {int? limit,  
6  String? start,  
7  String? end,  
8  bool? includeCustomFields,  
9  bool? includeUUIDFields,  
10  bool? includeUUIDCustomFields,  
11  bool includeStatus,  
12  bool includeType,  
13  bool includeUUIDStatus,  
14  bool includeUUIDType,  
15  bool? includeCount = true,  
16  String? filter,  
17  SetString>? sort,  
18  Keyset? keyset,  
19  String? using}  
20)  
21
  
22class ChannelMemberMetadataInput {  
23  String uuid;  
24  MapString, dynamic>? custom;  
25  String? status;  
26  String type;  
27}  
```

Parameters:
- channelId (String) Channel name.
- setMetadata (List<ChannelMemberMetadataInput>) Metadata to set.
- removeMemberUuids (Set<String>) UUIDs to remove.
- limit (int, default: 100, max: 100)
- start/end (String) Pagination cursors.
- includeCustomFields (bool, default: false)
- includeUUIDFields (bool, default: false)
- includeUUIDCustomFields (bool, default: false)
- includeUUIDStatus (bool, default: true)
- includeUUIDType (bool, default: true)
- includeStatus (bool, default: true)
- includeType (bool, default: true)
- includeCount (bool, default: false)
- filter (String) See filtering guide.
- sort (Set<String>)
- keyset (Keyset), using (String)

#### Sample code

```
`1  var setMetadata = [  
2    ChannelMemberMetadataInput('uuidToSet', custom: {'role': 'admin'})  
3  ];  
4  var result = await pubnub.objects  
5      .manageChannelMembers('my_channel', setMetadata, {'uuidToRemove'});  
`
```

#### Response

```
`1{**2    "status": 200,  
3    "data": [  
4        {  
5            "uuid": {  
6                "id": "uuid-1",  
7                "name": "John Doe",  
8                "externalId": null,  
9                "profileUrl": null,  
10                "email": "johndoe@pubnub.com",  
11                "custom": null,  
12                "updated": "2019-02-20T23:11:20.893755",  
13                "eTag": "MDcyQ0REOTUtNEVBOC00QkY2LTgwOUUtNDkwQzI4MjgzMTcwCg=="  
14            },  
15            "custom": {  
16                "role": "admin"  
17            },  
18            "updated": "2019-02-20T23:11:20.893755",  
19            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
20        },  
21        {  
22            "uuid": {  
23                "id": "uuid-2",  
24                "name": "Bob Cat",  
25                "externalId": null,  
26                "profileUrl": null,  
27                "email": "bobc@example.com",  
28                "custom": {  
29                    "phone": "999-999-9999"  
30                },  
31                "updated": "2019-02-21T03:29:00.173452",  
32                "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
33            },  
34            "updated": "2019-02-20T23:11:20.893755",  
35            "eTag": "QkRENDA5MjItMUZCNC00REI5LUE4QTktRjJGNUMxNTc2MzE3Cg=="  
36        }  
37    ],  
38    "totalCount": 37,  
39    "next": "RDIwQUIwM0MtNUM2Ni00ODQ5LUFGRjMtNDk1MzNDQzE3MUVCCg==",  
40    "prev": "MzY5RjkzQUQtNTM0NS00QjM0LUI0M0MtNjNBQUFGODQ5MTk2Cg=="  
41}  
`
```