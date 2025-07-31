# PubNub Dart SDK – App Context (Objects v2)

Below is a condensed reference.  
All method signatures, parameters, defaults, and code samples are preserved exactly as in the original docs; only explanatory text has been reduced.

---

## User APIs

### Get metadata for all users
```dart
pubnub.objects.getAllUUIDMetadata(
  {bool? includeCustomFields,
  int? limit,
  String? start,
  String? end,
  bool? includeCount,
  bool includeStatus,
  bool includeType,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
* includeCustomFields (bool, default false) – include `custom`
* limit (int, default 100)
* start / end (String) – pagination cursors
* includeCount (bool, default true)
* includeStatus / includeType (bool, default true)
* filter (String) – [filter language](/docs/general/metadata/filtering)
* sort (Set\<String>) – `id`, `name`, `updated`
* keyset / using – keyset overrides

Sample  
```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
    ),
  );

  var result = await pubnub.objects.getAllUUIDMetadata(
    // …
  );
}
```
Response  
```json
{
  "status": 200,
  "data": [
    { "id": "uuid-1", "name": "John Doe", /* … */ },
    { "id": "uuid-2", /* … */ }
  ]
}
```

---

### Get user metadata
```dart
pubnub.objects.getUUIDMetadata(
  {String? uuid,
  Keyset? keyset,
  String? using,
  bool? includeCustomFields,
  bool includeStatus,
  bool includeType}
)
```
Sample  
```dart
var result = await pubnub.objects.getUUIDMetadata();
```
Response (truncated)  
```json
{ "status": 200, "data": { "id": "uuid-1", "name": "John Doe", /* … */ } }
```

---

### Set user metadata
```dart
pubnub.objects.setUUIDMetadata(
  UuidMetadataInput uuidMetadataInput,
  {String? uuid,
  bool? includeCustomFields,
  bool includeStatus,
  bool includeType,
  String? ifMatchesEtag,
  Keyset? keyset,
  String? using}
)

class UuidMetadataInput {
  String? name;
  String? email;
  dynamic custom;
  // …
}
```
Sample  
```dart
var uuidMetadataInput = UuidMetadataInput(
  name: 'foo',
  email: 'foo@example.domain',
  profileUrl: 'http://sample.com');
var result = await pubnub.objects.setUUIDMetadata(uuidMetadataInput);
```
Response – same structure as *Get user metadata*.

---

### Remove user metadata
```dart
pubnub.objects.removeUUIDMetadata(
  {String? uuid, Keyset? keyset, String? using}
)
```
Sample  
```dart
await pubnub.objects.removeUUIDMetadata();
```
Returns `RemoveUuidMetadataResult` (no body on success).

---

## Channel APIs

### Get metadata for all channels
```dart
pubnub.objects.getAllChannelMetadata(
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeCount,
  bool includeStatus,
  bool includeType,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var result = await pubnub.objects.getAllChannelMetadata();
```
Response (truncated)  
```json
{ "status": 200, "data": [ { "id": "my-channel", /* … */ }, /* … */ ] }
```

---

### Get channel metadata
```dart
pubnub.objects.getChannelMetadata(
  String channelId,
  {Keyset? keyset,
  String? using,
  bool? includeCustomFields,
  bool includeStatus,
  bool includeType}
)
```
Sample  
```dart
var channelMetadata = await pubnub.objects.getChannelMetadata('my_channel');
```

---

### Set channel metadata
```dart
pubnub.objects.setChannelMetadata(
  String channelId,
  ChannelMetadataInput channelMetadataInput,
  {bool? includeCustomFields,
  bool includeStatus,
  bool includeType,
  String? ifMatchesEtag,
  Keyset? keyset,
  String? using}
)

class ChannelMetadataInput {
  String? name;
  String? description;
  dynamic custom;
  // …
}
```
Sample  
```dart
var input = ChannelMetadataInput(
  name: 'Channel name',
  description: 'A channel that is mine');
var result = await pubnub.objects.setChannelMetadata('my_channel', input);
```

##### Iterative update example
```dart
import 'dart:async';
import 'package:pubnub/pubnub.dart';

Future<void> main() async {
  var keyset = Keyset(publishKey:'demo', subscribeKey:'demo', userId:UserId('example'));
  var pubnub = PubNub(defaultKeyset: keyset);
  var channel = 'main';
  var name = 'Main Channel';
  var description = 'This is the main channel.';
  var custom = {'users': 10};

  var channelMetadataInput = ChannelMetadataInput(
    name: name, description: description, custom: custom);
  await pubnub.objects.setChannelMetadata(channel, channelMetadataInput);
  // …
}
```

---

### Remove channel metadata
```dart
pubnub.objects.removeChannelMetadata(
  String channelId,
  {Keyset? keyset, String? using}
)
```
Sample  
```dart
await pubnub.objects.removeChannelMetadata('my_channel');
```

---

## Channel Memberships (User ↔ Channels)

### Get channel memberships
```dart
pubnub.objects.getMemberships(
  {String? uuid,
  int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeChannelFields,
  bool? includeChannelCustomFields,
  bool? includeChannelStatus,
  bool? includeChannelType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var memberships = await pubnub.objects.getMemberships();
```
Response (truncated) shows `channel` and `custom` per membership.

---

### Set channel memberships
```dart
pubnub.objects.setMemberships(
  List<MembershipMetadataInput> setMetadata,
  {String? uuid,
  int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeChannelFields,
  bool? includeChannelCustomFields,
  bool includeChannelStatus,
  bool includeChannelType,
  bool includeStatus,
  bool includeType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var setMetadata = [
  MembershipMetadataInput('my_channel', custom: {'starred': 'false'})
];
var result = await pubnub.objects
    .setMemberships(setMetadata, includeChannelFields: true);
```

---

### Remove channel memberships
```dart
pubnub.objects.removeMemberships(
  Set<String> channelIds,
  {String? uuid,
  int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeChannelFields,
  bool? includeChannelCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeChannelStatus,
  bool includeChannelType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
await pubnub.objects.removeMemberships({'my_channel', 'main_channel'});
```

---

### Manage channel memberships (set + remove in one call)
```dart
pubnub.objects.manageMemberships(
  List<MembershipMetadataInput> setMetadata,
  Set<String> removeChannelIds,
  {String? uuid,
  int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeChannelFields,
  bool? includeChannelCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeChannelStatus,
  bool includeChannelType,
  bool? includeCount,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var setMetadata = [
  MembershipMetadataInput('my_channel', custom: {'starred': 'false'})
];
var result =
    await pubnub.objects.manageMemberships(setMetadata, {'main_channel'});
```

---

## Channel Members (Channel ↔ Users)

### Get channel members
```dart
pubnub.objects.getChannelMembers(
  String channelId,
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeUUIDFields,
  bool? includeUUIDCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeUUIDStatus,
  bool includeUUIDType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var members = await pubnub.objects.getChannelMembers('my_channel');
```

---

### Set channel members
```dart
pubnub.objects.setChannelMembers(
  String channelId,
  List<ChannelMemberMetadataInput> setMetadata,
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeUUIDFields,
  bool? includeUUIDCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeUUIDStatus,
  bool includeUUIDType,
  bool? includeCount,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var setMetadata = [
  ChannelMemberMetadataInput('myUUID', custom: {'role': 'admin'})
];
await pubnub.objects.setChannelMembers('my_channel', setMetadata);
```

---

### Remove channel members
```dart
pubnub.objects.removeChannelMembers(
  String channelId,
  Set<String> uuids,
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeUUIDFields,
  bool? includeUUIDCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeUUIDStatus,
  bool includeUUIDType,
  bool? includeCount,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
await pubnub.objects.removeChannelMembers('my_channel', {'uuid-1', 'uuid-2'});
```

---

### Manage channel members (set + remove in one call)
```dart
pubnub.objects.manageChannelMembers(
  String channelId,
  List<ChannelMemberMetadataInput> setMetadata,
  Set<String> removeMemberUuids,
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeUUIDFields,
  bool? includeUUIDCustomFields,
  bool includeStatus,
  bool includeType,
  bool includeUUIDStatus,
  bool includeUUIDType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Sample  
```dart
var setMetadata = [
  ChannelMemberMetadataInput('uuidToSet', custom: {'role': 'admin'})
];
await pubnub.objects.manageChannelMembers(
  'my_channel', setMetadata, {'uuidToRemove'});
```

---

_Last updated Jul 15 2025_