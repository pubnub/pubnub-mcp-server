# PubNub Dart SDK – Publish / Subscribe API (Condensed)

## Publish

`publish()` delivers a JSON-serializable payload to all subscribers of a single channel.

Key limits & rules  
• Must initialize PubNub with `publishKey`.  
• One channel per call; send next only after a successful response.  
• Max payload (incl. channel & escaping): 32 KiB (optimum < 1800 B).  
• In-memory queue per subscriber: 100 messages.  
• Optional SSL/TLS (`ssl: true`) and client-side crypto module.  
• Optional `customMessageType` (3-50 chars, no `pn_`/`pn-`).  
• `ttl` behaviour:  
  1. `storeMessage=true`, `ttl=0` → stored forever.  
  2. `storeMessage=true`, `ttl=X` → X hours (unless unlimited retention).  
  3. `storeMessage=false` → `ttl` ignored.

### Method

```dart
pubnub.publish(
  String channel,
  dynamic message, {
  Keyset? keyset,
  String? using,
  dynamic meta,
  bool? storeMessage,
  int? ttl,
  String? customMessageType}
)
```

### Basic usage (truncated reference snippet)

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

  String channel = 'myChannel';
```
<!-- show all 32 lines -->

### Return type

`PublishResult` → `description:String`, `timetoken:int`.

### Extra examples

```dart
var r1 = await pubnub.publish('my_channel', 'hello',
    meta: '', customMessageType: 'text-message');

var message = {'hello': 'world'};
var r2 = await pubnub.publish('my_channel', message,
    customMessageType: 'text-message');

var arr = ['hello', 'world'];
await pubnub.publish('my_channel', arr, customMessageType: 'text-message');

var jsonString = '{"score": 40}';
await pubnub.publish('my_channel', jsonDecode(jsonString),
    customMessageType: 'text-message');

var jsonArray = '''
[
  {"score": 40},
  {"score": 80}
]''';
await pubnub.publish('my_channel', jsonDecode(jsonArray),
    customMessageType: 'text-message');

await pubnub.publish('my_channel', 'hello',
    storeMessage: true, ttl: 10, customMessageType: 'text-message');
```

---

## Signal

Lightweight (≤ 64 B payload) alternative to publish.

### Method

```dart
pubnub.signal(
  String channel,
  dynamic message, {
  Keyset? keyset,
  String? using,
  String? customMessageType}
)
```

### Example

```dart
var result = await pubnub.signal(
    'myChannel', 'signal!', customMessageType: 'text-message');
```

### Return type

`SignalResult` → `description:String`, `timetoken:int`.

---

## Subscribe

Creates a long-lived TCP connection that streams messages, signals, and events.

Essentials  
• Provide `subscribeKey` at init.  
• Use `retryPolicy: RetryPolicy.linear` to auto-reconnect & fetch missed data.  
• Unsubscribing from ALL channels resets timetoken (possible gaps).  
• Queue overflow (> 100) causes skipped messages.

### Method

```dart
pubnub.subscribe({
  Set<String>? channels,
  Set<String>? channelGroups,
  bool withPresence = false,
  Timetoken? timetoken,
  Keyset? keyset,
  String? using}
)
```

### Example

```dart
var subscription = pubnub.subscribe(channels: {'my_channel'});
```

Return: `Subscription` (stream of events).

### Subscription control

```dart
subscription.cancel();   // dispose
subscription.pause();    // stop emitting
subscription.resume();   // resume
```

#### Control examples

```dart
await subscription.cancel();

subscription.pause();

// If paused
subscription.resume();
```

### Advanced subscribe samples

```dart
// Logging example (truncated)
var logger = StreamLogger.root('root', logLevel: Level.all);
// ...
var subscription = pubnub.subscribe(channels: {'test'});
// ...

// Multiple channels
var multi = pubnub.subscribe(channels: {'my_channel', 'channel1'});

// Presence for a channel
var pres = pubnub.subscribe(channels: {'my_channel'}, withPresence: true);

// Wildcard
var wild = pubnub.subscribe(channels: {'foo.*'});

// Channel group
var cg = pubnub.subscribe(channelGroups: {'cg1'});

// Presence channel group
var cgPres =
    pubnub.subscribe(channelGroups: {'cg1', 'cg2'}, withPresence: true);
```

### Sample presence events

```json
{ "Event": "join",    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e", "Timestamp": 1345546797, "Occupancy": 2, "Channel": "my_channel", "Timetoken": 15034141109823424 }

{ "Event": "leave",   "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e", "Timestamp": 1345546797, "Occupancy": 1, "Channel": "my_channel", "Timetoken": 15034141109823424 }

{ "Event": "timeout", "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e", "Timestamp": 1345546797, "Occupancy": 0, "Channel": "my_channel", "Timetoken": 15034141109823424 }

{ "Event":"state-change","Uuid":"175c2c67-uuid-uuid-8f4b-1db94f90e39e","Timestamp":1345546797,"Occupancy":1,"State":{"isTyping":true},"Channel":"my_channel","Timetoken":15034141109823424 }
```

#### Interval events

```json
{ "Event":"interval","Uuid":"175c2c67-uuid-uuid-8f4b-1db94f90e39e","Timestamp":1345546797,"Occupancy":2,"Channel":"my_channel","Timetoken":15034141109823424 }

{ "Event":"interval","Uuid":"175c2c67-uuid-uuid-8f4b-1db94f90e39e","Join":["uuid2","uuid3"],"Timeout":["uuid1"],"Channel":"my_channel","Timetoken":15034141109823424 }

{ "Event":"interval","Uuid":"175c2c67-uuid-uuid-8f4b-1db94f90e39e","HereNowRefresh":true,"Channel":"my_channel","Timetoken":15034141109823424 }
```

---

_Last updated: Jun 16 2025_