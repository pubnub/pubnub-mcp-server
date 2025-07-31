# Channel Groups – PubNub Dart SDK (condensed)

Channel Groups let you subscribe to many channels through a single group (publish is **not** supported).  
All operations require the **Stream Controller** add-on to be enabled for your keys.

---

## 1. Add channels to a group

```dart
pubnub.channelGroups.addChannels(
  String group,
  Set<String> channels,           // ≤ 200 per call
  {Keyset? keyset, String? using}
)
```

Parameters  
• `group` – channel group name  
• `channels` – channels to add  
• `keyset` / `using` – optional keyset override

Example

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

  await pubnub.channelGroups.addChannels('cg1', {'ch1', 'ch2'});
}
```

Returns `ChannelGroupChangeChannelsResult`

```json
{
  "service": "channel-registry",
  "status": "200",
  "error": false,
  "message": "OK"
}
```

---

## 2. List channels in a group

```dart
pubnub.channelGroups.listChannels(
  String group,
  {Keyset? keyset, String? using}
)
```

Example

```dart
var result = await pubnub.channelGroups.listChannels('cg1');
```

Returns `ChannelGroupListChannelsResult`

* `channels` → `Set<String>`  
* `name`     → group name

---

## 3. Remove channels from a group

```dart
pubnub.channelGroups.removeChannels(
  String group,
  Set<String> channels,
  {Keyset? keyset, String? using}
)
```

Example

```dart
await pubnub.channelGroups.removeChannels('cg1', {'ch1'});
```

Returns `ChannelGroupChangeChannelsResult` (same JSON as “Add channels”).

---

## 4. Delete a channel group (remove all channels)

```dart
pubnub.channelGroups.delete(
  String group,
  {Keyset? keyset, String? using}
)
```

Example

```dart
await pubnub.channelGroups.delete('cg1');
```

Returns `ChannelGroupDeleteResult`

```json
{
  "service": "channel-registry",
  "status": "200",
  "error": false,
  "message": "OK"
}
```

---

## 5. Get currently subscribed channel groups

`Subscription` property:

```dart
subscription.channelGroups   // -> Set<String>
```

Example

```dart
var subscription = pubnub.subscribe(channelGroups: {'cg1', 'cg2'});
print('subscribed channel groups: ${subscription.channelGroups}');
```

Output (example)

```json
["cg1","cg2"]
```