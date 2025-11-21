# Publish/Subscribe API for Dart SDK

PubNub delivers messages globally in under 30 ms.

- Initialize PubNub with publishKey.
- You don't need to be subscribed to publish.
- You can't publish to multiple channels simultaneously.
- Enable TLS/SSL by setting ssl: true at initialization; optional message encryption available.
- Message payloads must be JSON-serializable (objects, arrays, numbers, strings, UTF‑8). Avoid special classes/functions.
- Don't JSON serialize message or meta yourself; SDK handles serialization.
- Max message size: 32 KiB (includes escaped chars and channel). Aim < ~1,800 bytes.
- Throughput: publish as fast as bandwidth allows; soft limits apply—subscribers can drop if overwhelmed. Client in-memory queue ~100 messages.
- customMessageType: optional, business label (e.g., text, action, poll); 3–50 chars, case-sensitive alphanumeric, dashes/underscores allowed; cannot start with special chars or pn_/pn-.
- Best practices:
  - Publish serially (not concurrently).
  - Verify success code and timetoken; publish next after success.
  - Retry on failure.
  - Keep in-memory queue under 100 messages.
  - Throttle bursts to meet latency needs (e.g., ≤5 msg/s).

## Publish

### Method(s)

```
`1pubnub.publish(  
2  String channel,  
3  dynamic message,  
4  {Keyset? keyset,  
5  String? using,  
6  dynamic meta,  
7  bool? storeMessage,  
8  int? ttl,  
9  String? customMessageType}  
10)   
`
```

Parameters:
- channel (String, required): Destination channel ID.
- message (Any, required): Payload (JSON-serializable).
- keyset (Keyset): Override default keyset.
- using (String): Keyset name from keysetStore.
- meta (dynamic): Metadata for message filtering.
- storeMessage (bool): Store in history; default is account setting for Message Persistence.
- ttl (int): Per-message TTL (hours) if stored.
  1. storeMessage = true and ttl = 0: store without expiry.
  2. storeMessage = true and ttl = X: store with X hours expiry unless retention is Unlimited.
  3. storeMessage = false: ttl ignored.
  4. If ttl not set: use keyset’s default expiry.
- customMessageType (String): Business label; 3–50 chars, alphanumeric plus - and _. Cannot start with special chars or pn_/pn-.

### Sample code

Reference code:

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
  
13  // Channel to publish the message to  
14  String channel = 'myChannel';  
15
  
16  // Message to publish  
17  String message = 'hello world!';  
18
  
19  try {  
20    // Publish the message  
21    var result = await pubnub.publish(  
22      channel,  
23      message,  
24      customMessageType: 'text-message',  
25    );  
26
  
27    // Print the publish result  
28    print('Message "${result.description}" with timetoken: ${result.timetoken}');  
29  } catch (e) {  
30    print('Error publishing message: $e');  
31  }  
32}  
```

### Returns

PublishResult:
- description (String): e.g., Sent.
- timetoken (int): Publish timetoken.

### Other examples

#### Publish with metadata

```
`1var result = await pubnub.publish('my_channel', 'hello', meta: '', customMessageType: 'text-message');  
`
```

#### Publishing JsonObject (Google GSON)

```
`1var message = {'hello': 'world'};  
2var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

#### Publishing JsonArray (Google GSON)

```
`1var message = ['hello', 'world'];  
2var result = await pubnub.publish('my_channel', message, customMessageType: 'text-message');  
`
```

#### Publishing JSONObject (org.json)

```
`1var jsonString = '{"score": 40}';  
2var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

#### Publishing JSONArray (org.json)

```
`1var jsonString = '''  
2[  
3  {"score": 40},  
4  {"score": 80}  
5]  
6''';  
7var result = await pubnub.publish('my_channel', jsonDecode(jsonString), customMessageType: 'text-message');  
`
```

#### Store the published message for 10 hours

```
`1var result =  
2    await pubnub.publish('my_channel', 'hello', storeMessage: true, ttl: 10, customMessageType: 'text-message');  
`
```

## Signal

Sends lightweight notifications to subscribers of a channel.

- Default payload limit: 64 bytes (payload only). Contact support to increase.

### Method(s)

```
`1pubnub.signal(  
2  String channel,  
3  dynamic message,  
4  {Keyset? keyset,  
5  String? using,  
6  String? customMessageType}  
7)   
`
```

Parameters:
- channel (String, required)
- message (Any, required)
- keyset (Keyset)
- using (String)
- customMessageType (String): Same constraints as publish.

### Sample code

```
`1var result = await pubnub.signal('myChannel', 'signal!', customMessageType: 'text-message');  
`
```

### Response

SignalResult:
- description (String)
- timetoken (int)

## Subscribe

### Receive messages

Add event listeners to receive messages, signals, and events on subscribed channels.

### Description

- Opens a socket and listens on specified channels; subscribeKey required at initialization.
- By default, only messages published after subscribe() completes are received.
- To auto-reconnect and fetch missed messages after disconnects, set retryPolicy to RetryPolicy.linear during initialization.

Unsubscribing from all channels resets the last-received timetoken, which can cause message gaps.

### Method(s)

```
`1pubnub.subscribe(  
2  {SetString>? channels,  
3  SetString>? channelGroups,  
4  bool withPresence = false,  
5  Timetoken? timetoken,  
6  Keyset? keyset,  
7  String? using}  
8)   
`
```

Parameters:
- channels (Set<String>): Channels to subscribe to. Either channels or channelGroups is required.
- channelGroups (Set<String>): Channel groups to subscribe to. Either channels or channelGroups is required.
- withPresence (bool): Also subscribe to presence events.
- timetoken (Timetoken): Start position.
- keyset (Keyset): Override default keyset.
- using (String): Keyset name from keysetStore.

### Sample code

```
`1var channel = "my_channel";  
2var subscription = pubnub.subscribe(channels: {channel});  
`
```

### Returns

Subscription. See Subscription below.

### Subscription

Subscription provides streams of messages from channels. Use listen or standard Dart stream transformations.

### Listeners

See Event Listeners in the SDK reference.

#### Cancel

Cancels the subscription and disposes internal streams.

##### Method(s)

```
`1subscription.cancel();  
`
```

##### Sample code

```
`1// var subscription = pubnub.subscribe(channels: {'my_channel'});  
2// active subscription available  
3await subscription.cancel();  
`
```

##### Returns

No return value.

#### Dispose

Alias for cancel().

#### Subscribe

Alias for resume() with reconnection logic. If not intentionally paused, reconnects; otherwise resumes.

##### Method(s)

```
`1subscription.subscribe()  
`
```

##### Sample code

```
`1var subscription = pubnub.subscription(channels: {'my_channel'});  
2// Later, activate the subscription  
3subscription.subscribe();  
`
```

#### Unsubscribe

Alias for pause().

#### Pause

Prevents message/presence streams from emitting. Messages may be missed while paused. No-op if already paused.

##### Method(s)

```
`1subscription.pause()   
`
```

##### Sample code

```
`1var subscription = pubnub.subscribe(channels: {'my_channel'});  
2// active subscription available  
3subscription.pause();  
`
```

##### Returns

No return value.

#### Resume

Resumes a paused subscription. No-op if not paused.

##### Method(s)

```
`1subscription.resume()   
`
```

##### Sample code

```
`1// If subscription is paused  
2subscription.resume();  
`
```

##### Returns

No return value.

#### Restore

Recovers a subscription after an error without creating a new one.

##### Method(s)

```
`1subscription.restore()  
`
```

##### Sample code

```
1var subscription = pubnub.subscribe(channels: {'my_channel'});  
2
  
3subscription.messages.listen(  
4  (message) {  
5    print('Received: ${message.content}');  
6  },  
7  onError: (error) async {  
8    print('Error occurred: $error');  
9    // Restore the subscription after an error  
10    await subscription.restore();  
11  }  
12);  
```

##### Returns

Future<void> that completes when restored.

### Other examples

#### Basic subscribe with logging

```
1// Create a root logger  
2var logger = StreamLogger.root('root', logLevel: Level.all);  
3
  
4// Subscribe to messages with a default printer  
5var sub = logger.stream.listen(  
6    LogRecord.createPrinter(r'[$time] (${level.name}) $scope: $message'));  
7
  
8// Provide logging only for the parts that you are interested in.  
9var _ = await provideLogger(logger, () async {  
10  var subscription = pubnub.subscribe(channels: {'test'});  
11
  
12  var message = subscription.messages.first;  
13
  
14  await pubnub.publish('test', {'message': 'My message'});  
15
  
16  print(await message);  
17
  
18  await subscription.dispose();  
19});  
```

#### Unsubscribe from all channels

Cancels all existing subscriptions across all keysets.

```
1// Create subscriptions  
2var subscription1 = pubnub.subscribe(channels: {'channel1'});  
3var subscription2 = pubnub.subscribe(channels: {'channel2', 'channel3'});  
4
  
5// Later, unsubscribe from all channels  
6await pubnub.unsubscribeAll();  
```

Unsubscribing from all channels resets the last-received timetoken.

#### Subscribing to multiple channels

You can subscribe to multiple channels (multiplexing). Wildcard Subscribe and Channel Groups also supported when the Stream Controller add-on is enabled.

```
`1var subscription = pubnub.subscribe(channels: {'my_channel', 'channel1'});  
`
```

#### Subscribing to a presence channel

Requires Presence add-on enabled. To also get presence events, set withPresence: true or subscribe to channel-pnpres directly.

```
`1var subscription =  
2    pubnub.subscribe(channels: {'my_channel'}, withPresence: true);  
`
```

### Sample Responses

#### Join event

```
`1{  
2    "Event": "join",  
3    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4    "Timestamp": 1345546797,  
5    "Occupancy": 2,  
6    "State": null,  
7    "Channel":" my_channel",  
8    "Subscription": "",  
9    "Timetoken": 15034141109823424,  
10    "UserMetadata": null,  
11    "Join": null,  
12    "Timeout": null,  
13    "Leave": null,  
14    "HereNowRefresh": false  
15}  
`
```

#### Leave event

```
`1{  
2    "Event": "leave",  
3    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4    "Timestamp": 1345546797,  
5    "Occupancy": 1,  
6    "State": null,  
7    "Channel": "my_channel",  
8    "Subscription": "",  
9    "Timetoken": 15034141109823424,  
10    "UserMetadata": null,  
11    "Join": null,  
12    "Timeout": null,  
13    "Leave": null,  
14    "HereNowRefresh": false  
15}  
`
```

#### Timeout event

```
`1{  
2  "Event": "timeout",  
3  "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4  "Timestamp": 1345546797,  
5  "Occupancy": 0,  
6  "State": null,  
7  "Channel": "my_channel",  
8  "Subscription": "",  
9  "Timetoken": 15034141109823424,  
10  "UserMetadata": null,  
11  "Join": null,  
12  "Timeout": null,  
13  "Leave": null,  
14  "HereNowRefresh": false  
15}   
`
```

#### State change event

```
`1{  
2  "Event":  "state-change",  
3  "Uuid":  "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4  "Timestamp": 1345546797,  
5  "Occupancy": 1,  
6  "State": {  
7      "isTyping": true  
8  },  
9  "Channel":  "my_channel",  
10  "Subscription":  "",  
11  "Timetoken": 15034141109823424,  
12  "UserMetadata": null,  
13  "Join": null,  
14  "Timeout": null,  
15  "Leave": null,  
16  "HereNowRefresh": false  
17}  
`
```

#### Interval event

```
`1{  
2    "Event": "interval",  
3    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4    "Timestamp": 1345546797,  
5    "Occupancy": 2,  
6    "State": null,  
7    "Channel": "my_channel",  
8    "Subscription": "",  
9    "Timetoken": 15034141109823424,  
10    "UserMetadata": null,  
11    "Join": null,  
12    "Timeout": null,  
13    "Leave": null,  
14    "HereNowRefresh": false  
15}  
`
```

When presence_deltas are enabled and channel is in interval mode, interval messages may include joined, left, timed out arrays representing UUID changes since last interval. If the full message exceeds ~30 KiB, extra fields are omitted and HereNowRefresh is true (use hereNow to fetch users).

Example with deltas:

```
`1{  
2    "Event": "interval",  
3    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4    "Timestamp": ,  
5    "Occupancy": ,  
6    "State": null,  
7    "Channel": "my_channel",  
8    "Subscription": "",  
9    "Timetoken": 15034141109823424,  
10    "UserMetadata": null,  
11    "Join": ["uuid2", "uuid3"],  
12    "Timeout": ["uuid1"],  
13    "Leave": null,  
14    "HereNowRefresh": false  
15}  
`
```

Example with HereNowRefresh:

```
`1{  
2    "Event": "interval",  
3    "Uuid": "175c2c67-uuid-uuid-8f4b-1db94f90e39e",  
4    "Timestamp": ,  
5    "Occupancy": ,  
6    "State": null,  
7    "Channel": "my_channel",  
8    "Subscription": "",  
9    "Timetoken": 15034141109823424,  
10    "UserMetadata": null,  
11    "Join": null,  
12    "Timeout": null,  
13    "Leave": null,  
14    "HereNowRefresh": true  
15}  
`
```

#### Wildcard subscribe to channels

Requires Stream Controller add-on (Enable Wildcard Subscribe).

Wildcard subscriptions support one-level patterns like a.*.

```
`1var subscription = pubnub.subscribe(channels: {'foo.*'});  
`
```

Wildcard grants/revokes:
- Only one level (a.*) supported. Granting on * or a.b.* is treated as literal channel names. Revokes follow same rule; can revoke a.* only if granted with a.*.

#### Subscribe to a channel group

Requires Stream Controller add-on.

```
`1var subscription = pubnub.subscribe(channelGroups: {'cg1'});  
`
```

#### Subscribe to the presence channel of a channel group

Requires Stream Controller add-on.

```
`1var subscription =**2    pubnub.subscribe(channelGroups: {'cg1', 'cg2'}, withPresence: true);  
`
```