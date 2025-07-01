# Presence API – Dart SDK (Concise Reference)

Presence lets you query occupancy, announce heartbeat/leave, and manage per-user state on channels/channel groups. Presence must be enabled for your keys.

---

## Here Now

### Method
```dart
pubnub.hereNow(
  {Keyset? keyset,
  String? using,
  Set<String>  channels       = const {},
  Set<String>  channelGroups  = const {},
  StateInfo?   stateInfo}
)
```

Parameter | Type | Default | Purpose
---|---|---|---
keyset | Keyset | – | Override the default keyset.
using | String | – | Name of keyset from `keysetStore`.
channels | Set<String> | {} | Channels to query.
channelGroups | Set<String> | {} | Channel groups to query.
stateInfo | StateInfo | false | `StateInfo.all` to include user state.

Cache: 3 s.

### Returns `HereNowResult`
Property | Type | Description
---|---|---
totalChannels | int | Total channels returned.
totalOccupancy | int | Total clients across all channels.
channels | Map<String, ChannelOccupancy> | Per-channel data.

`ChannelOccupancy`  
• `channelName` (String)  
• `count` (int)  
• `uuids` (Map<String, OccupantInfo>)

`OccupantInfo`  
• `uuid` (String)  
• `state` (dynamic)

### Examples
```dart
// Basic reference.
import 'package:pubnub/pubnub.dart';

void main() async {
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
    ),
  );

  String channel = 'my_channel';
}
```

```dart
// Include presence state.
var result =
    await pubnub.hereNow(channels: {'my_channel'}, stateInfo: StateInfo.all);
```
```json
{
  "status": 200,
  "message": "OK",
  "service": "Presence",
  "uuids": [
    { "uuid": "myUUID0" },
    {
      "uuid": "myUUID1",
      "state": { "abcd": { "age": 15 } }
    }
  ]
}
```

```dart
// Occupancy only.
var result = await pubnub.hereNow(channels: {'my_channel'});
```
```json
{
  "status": 200,
  "payload": {
    "channels": {
      "81d8d989-b95f-443c-a726-04fac323b331": {
        "uuids": ["70fc1140-uuid-4abc-85b2-ff8c17b24d59"],
        "occupancy": 1
      }
    }
  }
}
```

```dart
// Channel group query.
var result = await pubnub.hereNow(channelGroups: {'cg1'});
```
```json
{
  "occupancy": 4,
  "uuids": [
    "123123234t234f34fuuid",
    "143r34f34t34fq34quuid",
    "23f34d3f4rq34r34ruuid",
    "w34tcw45t45tcw435uuid"
  ]
}
```

---

## Announce Heartbeat

### Method
```dart
pubnub.announceHeartbeat(
  {Keyset? keyset,
  String? using,
  Set<String> channels      = const {},
  Set<String> channelGroups = const {},
  int?        heartbeat}
)
```

Parameter | Type | Purpose
---|---|---
channels | Set<String> | Channels to notify.
channelGroups | Set<String> | Channel groups to notify.
heartbeat | int | Override default presence timeout (seconds).

### Examples
```dart
await pubnub.announceHeartbeat(channels: {'my_channel'});
await pubnub.announceHeartbeat(channelGroups: {'cg1'});
```

### Returns
`HeartbeatResult` (no actionable fields).

---

## Announce Leave

### Method
```dart
pubnub.announceLeave(
  {Keyset? keyset,
  String? using,
  Set<String> channels      = const {},
  Set<String> channelGroups = const {}}
)
```

Parameter | Type | Purpose
---|---|---
channels | Set<String> | Channels to notify.
channelGroups | Set<String> | Channel groups to notify.

### Examples
```dart
await pubnub.announceLeave(channels: {'my_channel'});
await pubnub.announceLeave(channelGroups: {'cg1'});
```

### Returns
`LeaveResult` → `action` (String, e.g., `"leave"`).

---

## User State

### Set State

```dart
pubnub.setState(
  dynamic      state,
  {Keyset? keyset,
  String? using,
  Set<String> channels      = const {},
  Set<String> channelGroups = const {}}
)
```

### Get State

```dart
pubnub.getState(
  {Keyset? keyset,
  String? using,
  Set<String> channels      = const {},
  Set<String> channelGroups = const {}}
)
```

Parameter | Type | Purpose
---|---|---
state (setState) | dynamic | JSON object to store.
channels | Set<String> | Target channels.
channelGroups | Set<String> | Target channel groups.

### Examples
```dart
// Set state
var state = {'is_typing': true};
await pubnub.setState(state, channels: {'my_channel'});
```

```dart
// Get state
var result = await pubnub.getState(
  channels: {'ch1', 'ch2', 'ch3'},
  channelGroups: {'cg1', 'cg2'}
);
```

### Returns
• `SetUserStateResult` – success indicator  
• `GetUserStateResult.stateByUUID()` → `Map<String, Object>` (UUID → state)

_Last updated: Jun 16 2025_