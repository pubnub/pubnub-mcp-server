# Presence API – Dart SDK (condensed)

All Presence calls require the Presence add-on to be enabled for your keys.

---

## hereNow()

```dart
pubnub.hereNow(
  {Keyset? keyset,
  String? using,
  Set<String> channels = const {},
  Set<String> channelGroups = const {},
  StateInfo? stateInfo}
)
```

Parameters  
• keyset – override default keyset  
• using – name of stored keyset  
• channels – target channels  
• channelGroups – target channel groups  
• stateInfo – include user state (`StateInfo.all`)  

Returns `HereNowResult`  
• totalChannels (int)  
• totalOccupancy (int)  
• channels → Map<String, ChannelOccupancy>

`ChannelOccupancy`  
• channelName (String)  
• count (int)  
• uuids → Map<String, OccupantInfo>

`OccupantInfo`  
• uuid (String)  
• state (dynamic)

Cache: 3 s.

### Examples

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

  String channel = 'my_channel';
  // …
}
```

```dart
var result =
    await pubnub.hereNow(channels: {'my_channel'}, stateInfo: StateInfo.all);
```

```json
{
    "status" : 200,
    "message" : "OK",
    "service" : "Presence",
    "uuids" : [
        { "uuid" : "myUUID0" },
        {
            "state" : { "abcd" : { "age" : 15 } },
            "uuid" : "myUUID1"
        }
    ]
}
```

```dart
var result =
    await pubnub.hereNow(channels: {'my_channel'});
```

```json
{
    "status": 200,
    "message": "OK",
    "payload": {
        "channels": {
            "81d8d989-b95f-443c-a726-04fac323b331": {
                "uuids": ["70fc1140-uuid-4abc-85b2-ff8c17b24d59"],
                "occupancy": 1
            },
            "81b7a746-d153-49e2-ab70-3037a75cec7e": {
                "uuids": ["91363e7f-uuid-49cc-822c-52c2c01e5928"],
                "occupancy": 1
            },
            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {
                "uuids": ["ccfac1dd-uuid-4afd-9fd9-db11aeb65395"]
            }
        }
    }
}
```

```dart
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

## announceHeartbeat()

```dart
pubnub.announceHeartbeat(
  {Keyset? keyset,
  String? using,
  Set<String> channels = const {},
  Set<String> channelGroups = const {},
  int? heartbeat}
)
```

• heartbeat – overrides default 300 s timeout.

Returns `HeartbeatResult` (no payload).

```dart
var r = await pubnub.announceHeartbeat(channels: {'my_channel'});
var r = await pubnub.announceHeartbeat(channelGroups: {'cg1'});
```

---

## announceLeave()

```dart
pubnub.announceLeave(
  {Keyset? keyset,
  String? using,
  Set<String> channels = const {},
  Set<String> channelGroups = const {}}
)
```

Returns `LeaveResult` → action (String, e.g., "leave").

```dart
var r = await pubnub.announceLeave(channels: {'my_channel'});
var r = await pubnub.announceLeave(channelGroups: {'cg1'});
```

---

## User State

### setState()

```dart
pubnub.setState(
  dynamic state, {
  Keyset? keyset,
  String? using,
  Set<String> channels = const {},
  Set<String> channelGroups = const {},
})
```

Returns `SetUserStateResult`.

```dart
var state = {'is_typing': true};
var result = await pubnub.setState(state, channels: {'my_channel'});
```

### getState()

```dart
pubnub.getState({
  Keyset? keyset,
  String? using,
  Set<String> channels = const {},
  Set<String> channelGroups = const {}
})
```

Returns `GetUserStateResult`  
• stateByUUID() → Map<String, Object>

```dart
var result = await pubnub.getState(
  channels: {'ch1', 'ch2', 'ch3'},
  channelGroups: {'cg1', 'cg2'}
);
```

_Last updated: Jul 15 2025_