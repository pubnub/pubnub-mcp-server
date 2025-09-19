# Publish/Subscribe API – Dart SDK (Condensed)

The sections below keep every original code block, method signature, parameters, and critical limits while trimming explanations.

---

## Publish

• Requires `publishKey` during initialization.  
• One channel per call (serial, check success before next).  
• Max payload 32 KiB (optimum < 1800 bytes).  
• Optional TLS (`ssl: true`) and encryption, `meta` filtering, `customMessageType` (3-50 chars, not `pn_*`).  
• `storeMessage` & `ttl` rules:  
  1. `storeMessage=true` + `ttl=0` → no expiry.  
  2. `storeMessage=true` + `ttl=X` → expires in X hours (unless retention=Unlimited).  
  3. `storeMessage=false` → `ttl` ignored.  
  4. Unspecified values fall back to key-level defaults.  
• In-memory subscriber queue: 100; throttle bursts (~≤ 5 msg/s).

### Method

```
`pubnub.publish(  
  String channel,  
  dynamic message,  
  {Keyset? keyset,  
  String? using,  
  dynamic meta,  
  bool? storeMessage,  
  int? ttl,  
  String? customMessageType}  
)   
`
```

### Reference code

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId'),  
    ),  
  );  
  
  // Channel to publish the message to  
  String channel = 'myChannel';  
  
`
```

### Returns  
`PublishResult` → `description` (`Sent`), `timetoken` (int).

### Other examples

```
`var result = await pubnub.publish('my_channel', 'hello', meta: '', customMessageType: 'text-message');  
`
```

```
`var message = {'hello': 'world'};  
var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

```
`var message = ['hello', 'world'];  
var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

```
`var jsonString = '{"score": 40}';  
var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

```
`var jsonString = '''  
[  
  {"score": 40},  
  {"score": 80}  
]  
''';  
var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

```
`var result =  
    await pubnub.publish('my_channel', 'hello', storeMessage: true, ttl: 10, customMessageType: 'text-message');  
`
```

---

## Signal

• Same semantics as publish but payload limit 64 bytes.  

### Method

```
`pubnub.signal(  
  String channel,  
  dynamic message,  
  {Keyset? keyset,  
  String? using,  
  String? customMessageType}  
)   
`
```

### Sample

```
`var result = await pubnub.signal('myChannel', 'signal!', customMessageType: 'text-message');  
`
```

### Response  
`SignalResult` → `description`, `timetoken`.

---

## Subscribe

• Creates a TCP socket, starts at provided `timetoken` (or “now”).  
• `retryPolicy: RetryPolicy.linear` handles disconnect gaps.  
• Unsubscribing from *all* channels resets `timetoken` (possible gaps).

### Method

```
`pubnub.subscribe(  
  {SetString>? channels,  
  SetString>? channelGroups,  
  bool withPresence = false,  
  Timetoken? timetoken,  
  Keyset? keyset,  
  String? using}  
)   
`
```

### Sample

```
`var channel = "my_channel";  
var subscription = pubnub.subscribe(channels: {channel});  
`
```

### Subscription controls

```
`subscription.cancel();  
`
```

```
`// var subscription = pubnub.subscribe(channels: {'my_channel'});  
// active subscription available  
await subscription.cancel();  
`
```

```
`subscription.pause()   
`
```

```
`var subscription = pubnub.subscribe(channels: {'my_channel'});  
// active subscription available  
subscription.pause();  
`
```

```
`subscription.resume()   
`
```

```
`// If subscription is paused  
subscription.resume();  
`
```

### Basic subscribe with logging

```
`// Create a root logger  
var logger = StreamLogger.root('root', logLevel: Level.all);  
  
// Subscribe to messages with a default printer  
var sub = logger.stream.listen(  
    LogRecord.createPrinter(r'[$time] (${level.name}) $scope: $message'));  
  
// Provide logging only for the parts that you are interested in.  
var _ = await provideLogger(logger, () async {  
  var subscription = pubnub.subscribe(channels: {'test'});  
  
  var message = subscription.messages.first;  
  
  await pubnub.publish('test', {'message': 'My message'});  
  
`
```

### Multi-channel / presence examples

```
`var subscription = pubnub.subscribe(channels: {'my_channel', 'channel1'});  
`
```

```
`var subscription =  
    pubnub.subscribe(channels: {'my_channel'}, withPresence: true);  
`
```

### Wildcards & Channel Groups (Stream Controller add-on required)

```
`var subscription = pubnub.subscribe(channels: {'foo.*'});  
`
```

```
`var subscription = pubnub.subscribe(channelGroups: {'cg1'});  
`
```

```
`var subscription =**    pubnub.subscribe(channelGroups: {'cg1', 'cg2'}, withPresence: true);  
`
```

---

## Presence Event Samples

Join:

```
`{  
    "Event": "join",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel":" my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

Leave:

```
`{  
    "Event": "leave",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 1,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

Timeout:

```
`{  
  "Event": "timeout",  
  "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
  "Timestamp": 1345546797,  
  "Occupancy": 0,  
  "State": null,  
  "Channel": "my_channel",  
  "Subscription": "",  
  "Timetoken": 15034141109823424,  
  "UserMetadata": null,  
  "Join": null,  
  "Timeout": null,  
  "Leave": null,  
  "HereNowRefresh": false  
}   
`
```

State-change:

```
`{  
  "Event":  "state-change",  
  "Uuid":  "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
  "Timestamp": 1345546797,  
  "Occupancy": 1,  
  "State": {  
      "isTyping": true  
  },  
  "Channel":  "my_channel",  
  "Subscription":  "",  
  "Timetoken": 15034141109823424,  
  "UserMetadata": null,  
  "Join": null,  
  "Timeout": null,  
  "Leave": null,  
`
```
*(remaining lines unchanged)*

Interval:

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

Interval with deltas:

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": ["uuid2", "uuid3"],  
    "Timeout": ["uuid1"],  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

Interval requiring `hereNow` refresh:

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": true  
}  
`
```

---

_Last updated Jul 15 2025_