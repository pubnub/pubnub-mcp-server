# PubNub Dart SDK – App Context (Objects)

This is a stripped-down reference that keeps every code block, method signature, parameter description, and usage example. Everything else (marketing text, long prose, and repeated explanations) has been removed.

---

## User

### Get Metadata for All Users
```
pubnub.objects.getAllUUIDMetadata(
  {bool? includeCustomFields,
  int?  limit,
  String? start,
  String? end,
  bool? includeCount,
  bool  includeStatus,
  bool  includeType,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
* includeCustomFields `bool` (default `false`)
* limit `int` (default `100`)
* start / end `String` – server cursor for pagination  
* includeCount `bool` (default `true`)
* filter / sort – see [filtering](https://www.pubnub.com/docs/general/metadata/filtering)  
* keyset / using – override or select keyset

#### Basic usage
```
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey:  'demo',
      userId:      UserId('myUniqueUserId'),
    ),
  );

  var result = await pubnub.objects.getAllUUIDMetadata();
}
```

#### Response
```
{
  "status": 200,
  "data": [
    {
      "id": "uuid-1",
      "name": "John Doe",
      ...
    },
    ...
  ]
}
```

---

### Get User Metadata
```
pubnub.objects.getUUIDMetadata(
  {String? uuid,
  Keyset? keyset,
  String? using,
  bool? includeCustomFields,
  bool  includeStatus,
  bool  includeType}
)
```
* uuid `String` – defaults to configured UUID  
Other params identical to *Get All* above.

```
var result = await pubnub.objects.getUUIDMetadata();
```
Response identical to single-object variant shown earlier.

---

### Set User Metadata
```
pubnub.objects.setUUIDMetadata(
  UuidMetadataInput uuidMetadataInput,
  {String? uuid,
  bool? includeCustomFields,
  bool  includeStatus,
  bool  includeType,
  String? ifMatchesEtag,
  Keyset? keyset,
  String? using}
)

class UuidMetadataInput {
  String?  name;
  String?  email;
  String?  externalId;
  String?  profileUrl;
  dynamic  custom;
}
```
```
var input = UuidMetadataInput(
  name:       'foo',
  email:      'foo@example.com',
  profileUrl: 'http://sample.com',
);

var res = await pubnub.objects.setUUIDMetadata(input);
```
Response identical to *Get User Metadata*.

---

### Remove User Metadata
```
pubnub.objects.removeUUIDMetadata(
  {String? uuid,
  Keyset? keyset,
  String? using}
)
```
```
await pubnub.objects.removeUUIDMetadata();
```
Returns `RemoveUuidMetadataResult`.

---

## Channel

### Get Metadata for All Channels
```
pubnub.objects.getAllChannelMetadata(
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeCount,
  bool  includeStatus,
  bool  includeType,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
Usage:
```
var result = await pubnub.objects.getAllChannelMetadata();
```
Response:
```
{
  "status": 200,
  "data": [
    { "id": "my-channel", "name": "My channel", ... },
    ...
  ]
}
```

---

### Get / Set / Remove Channel Metadata
```
pubnub.objects.getChannelMetadata(
  String channelId,
  {Keyset? keyset,
  String? using,
  bool? includeCustomFields,
  bool  includeStatus,
  bool  includeType}
)

pubnub.objects.setChannelMetadata(
  String channelId,
  ChannelMetadataInput channelMetadataInput,
  {bool? includeCustomFields,
  bool  includeStatus,
  bool  includeType,
  String? ifMatchesEtag,
  Keyset? keyset,
  String? using}
)

class ChannelMetadataInput {
  String? name;
  String? description;
  dynamic custom;
}

pubnub.objects.removeChannelMetadata(
  String channelId,
  {Keyset? keyset,
  String? using}
)
```
Set example:
```
var input = ChannelMetadataInput(
  name: 'Channel name',
  description: 'A channel that is mine',
);

await pubnub.objects.setChannelMetadata('my_channel', input);
```

---

## Channel Memberships (user → channels)

### Get Memberships
```
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
```
var memberships = await pubnub.objects.getMemberships();
```

### Set / Remove / Manage Memberships
```
pubnub.objects.setMemberships(
  List<MembershipMetadataInput> setMetadata,
  {...same optional params...}
)

pubnub.objects.removeMemberships(
  Set<String> channelIds,
  {...same optional params...}
)

pubnub.objects.manageMemberships(
  List<MembershipMetadataInput> setMetadata,
  Set<String> removeChannelIds,
  {...same optional params...}
)

class MembershipMetadataInput {
  MembershipMetadataInput(this.channelId, {this.custom});
  String channelId;
  dynamic custom;
}
```
Example:
```
var setMeta = [
  MembershipMetadataInput('my_channel', custom: {'starred': false})
];

await pubnub.objects.manageMemberships(setMeta, {'old_channel'});
```

---

## Channel Members (channel → users)

### Get Channel Members
```
pubnub.objects.getChannelMembers(
  String channelId,
  {int? limit,
  String? start,
  String? end,
  bool? includeCustomFields,
  bool? includeUUIDFields,
  bool? includeUUIDCustomFields,
  bool  includeStatus,
  bool  includeType,
  bool  includeUUIDStatus,
  bool  includeUUIDType,
  bool? includeCount = true,
  String? filter,
  Set<String>? sort,
  Keyset? keyset,
  String? using}
)
```
```
var members = await pubnub.objects.getChannelMembers('my_channel');
```

### Set / Remove / Manage Channel Members
```
pubnub.objects.setChannelMembers(
  String channelId,
  List<ChannelMemberMetadataInput> setMetadata,
  {...same optional params...}
)

pubnub.objects.removeChannelMembers(
  String channelId,
  Set<String> uuids,
  {...same optional params...}
)

pubnub.objects.manageChannelMembers(
  String channelId,
  List<ChannelMemberMetadataInput> setMetadata,
  Set<String> removeMemberUuids,
  {...same optional params...}
)

class ChannelMemberMetadataInput {
  ChannelMemberMetadataInput(this.uuid, {this.custom});
  String uuid;
  dynamic custom;
}
```
Example:
```
var setMeta = [
  ChannelMemberMetadataInput('myUUID', custom: {'role': 'admin'})
];

await pubnub.objects.manageChannelMembers('my_channel', setMeta, {'oldUUID'});
```

---

_Last updated: May 27, 2025_