# Publish/Subscribe API for Dart SDK (Condensed)

For connection and publish concepts, see:
- Connection Management
- Publish Messages

## Publish

`publish()` sends a message to all subscribers of a channel.

Key points:
- Initialize PubNub with a publishKey.
- You don’t need to be subscribed to publish.
- You can’t publish to multiple channels simultaneously.
- Enable TLS/SSL by setting `ssl: true` during initialization; optional message encryption is available.
- Message payload must be JSON-serializable (objects, arrays, numbers, strings). Avoid special classes/functions. UTF‑8 strings are supported.
- Don’t JSON-serialize `message` or `meta`; PubNub serializes automatically.
- Max message size: 32 KiB (including escaped chars and channel). Aim for < ~1,800 bytes.
- Throughput: publish as fast as bandwidth allows; soft limits apply if subscribers can’t keep up. Subscriber queue holds ~100 messages.
- Optional `customMessageType` adds a business-specific label (for example, `text`, `action`, `poll`).

Best practices:
- Publish serially; wait for success response before sending the next message.
- On failure, retry.
- Keep in-memory queue under 100.
- Throttle bursts (for example, <= 5 messages/sec) to meet latency goals.

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
- message (Any, required): JSON-serializable payload.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Named keyset from keysetStore.
- meta (dynamic, optional): Metadata for message filtering.
- storeMessage (bool, optional): Store in history; defaults to account settings.
- ttl (int, optional): Per-message TTL (hours) when stored.
  - storeMessage=true, ttl=0: no expiry.
  - storeMessage=true, ttl=X: expires after X hours unless keyset retention is Unlimited.
  - storeMessage=false: ttl ignored.
  - unspecified: uses keyset default expiry.
- customMessageType (String, optional): Case-sensitive 3–50 chars, alphanumeric plus - and _. Must not start with special chars or with pn_ / pn-. Examples: text, action, poll.

### Sample code

Publish a message to a channel:

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

`PublishResult`:
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

`signal()` sends a signal to all subscribers of a channel.

- Payload size limit: 64 bytes (payload only). For larger payloads, contact support.

### Method(s)

To Signal a message:

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
- channel (String, required): Destination channel ID.
- message (Any, required): Payload (≤ 64 bytes).
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Named keyset from keysetStore.
- customMessageType (String, optional): 3–50 chars; rules as in publish.

### Sample code

Signal a message to a channel:

```
`1var result = await pubnub.signal('myChannel', 'signal!', customMessageType: 'text-message');  
`
```

### Response

`SignalResult`:
- description (String): e.g., Sent.
- timetoken (int): Signal publish timetoken.

## Subscribe

### Receive messages

Receive messages and events via event listeners from subscribed channels. See Subscription section for listener usage.

### Description

Creates a connection to PubNub and listens on specified channels. Requires `subscribeKey` at initialization. New subscribers receive messages published after `subscribe()` completes.

Reconnection: Set `retryPolicy` to `RetryPolicy.linear` during initialization to auto-reconnect and fetch missed messages.

Unsubscribing from all channels resets the last-received timetoken and can cause message gaps.

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
- channels (Set<String>, optional): Channels to subscribe to. Either channels or channelGroups required.
- channelGroups (Set<String>, optional): Channel groups to subscribe to. Either channels or channelGroups required.
- withPresence (bool, optional): Also subscribe to presence events. See Presence Events.
- timetoken (Timetoken, optional): Start subscription from this timetoken.
- keyset (Keyset, optional): Override default keyset.
- using (String, optional): Named keyset from keysetStore.

### Sample code

Subscribe to a channel:

```
`1var channel = "my_channel";  
2var subscription = pubnub.subscribe(channels: {channel});  
`
```

### Returns

`Subscription`. See Subscription below.

### Subscription

A `Subscription` provides a Dart stream of messages from subscribed channels. Transform streams or add listeners via `listen`.

### Listeners

See Event Listeners in the configuration reference.

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

None.

#### Dispose

`dispose()` is an alias for `cancel()`.

#### Subscribe

`subscription.subscribe()` is an alias for `resume()` with reconnection logic.

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

`unsubscribe()` is an alias for `pause()`.

#### Pause

Prevents message and presence streams from emitting. Messages may be missed while paused. No-op if already paused.

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

None.

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

None.

#### Restore

Restores a subscription after an error without creating a new subscription.

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

`Future<void>` that completes on restore.

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

Note: Unsubscribing from all channels resets the last-received timetoken.

#### Subscribing to multiple channels

Multiplexing allows subscribing to multiple channels. Also see Wildcard Subscribe and Channel Groups (requires Stream Controller add-on enabled on your keyset).

```
`1var subscription = pubnub.subscribe(channels: {'my_channel', 'channel1'});  
`
```

#### Subscribing to a presence channel

Requires Presence add-on enabled on your key. You can subscribe with `withPresence: true` or directly to the presence channel by appending `-pnpres` to the channel name.

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

When a channel is in interval mode with `presence_deltas` enabled, interval messages may include:
- joined
- left
- timed out

Example:

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

If the message exceeds ~30 KiB, the deltas are omitted and `HereNowRefresh: true` is set. Call `hereNow` to fetch the full list.

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

```
`1var subscription = pubnub.subscribe(channels: {'foo.*'});  
`
```

Wildcard grants/revokes:
- One level only (`a.*`).
- Grants on `*` or `a.b.*` are treated as literal channel names `*` or `a.b.*`.
- Revokes with wildcards work one level deep if initially granted with wildcards.

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