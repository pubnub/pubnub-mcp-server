# Publish/Subscribe API for Dart SDK

PubNub publishes globally in <30 ms. Publish to one or many subscribers.

For concepts, see Connection Management and Publish Messages.

## Publish

`publish()` sends a message to all channel subscribers. PubNub replicates messages globally.

- Prerequisites and limitations
  - Initialize PubNub with publishKey.
  - You don't need to be subscribed to publish.
  - You cannot publish to multiple channels simultaneously.
- Security
  - Enable TLS/SSL with ssl: true at initialization. Optional message encryption via CryptoModule.
- Message data
  - Any JSON-serializable data (objects, arrays, numbers, strings, UTF‑8).
  - Don't JSON serialize message or meta yourself; pass objects directly.
- Size
  - Max message size: 32 KiB (includes escaped characters and channel name). Aim for <1,800 bytes.
  - Oversize messages return Message Too Large.
- Publish rate
  - Soft throughput limit; subscribers may drop if they can't keep up. In-memory queue stores only 100 messages.
- Custom message type
  - Optional customMessageType, e.g., text, action, poll.
- Best practices
  - Publish serially (not concurrently).
  - Verify success code (e.g., [1,"Sent","136074940..."]) before sending next.
  - On failure ([0,"blah","<timetoken>"]), retry.
  - Keep queue <100 messages; throttle bursts (e.g., ≤5 msg/s).

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

*  requiredParameterDescription`channel` *Type: `String`Default:  
n/aDestination of the `message` (channel ID).`message` *Type: `Any`Default:  
n/aThe payload.`keyset`Type: `Keyset`Default:  
n/aOverride for the PubNub default keyset configuration.`using`Type: `String`Default:  
n/aKeyset name from the `keysetStore` to be used for this method call.`meta`Type: `dynamic`Default:  
Not setMetadata object which can be used with the filtering ability.`storeMessage`Type: `bool`Default:  
Account defaultStore message in history.  
If not specified, the decision depends on whether Message Persistence has been enabled for the key or not.`ttl`Type: `int`Default:  
n/aSet a per message time to live in Message Persistence.  
1. If `storeMessage = true`, and `ttl = 0`, the message is stored with no expiry time.  
2. If `storeMessage = true` and `ttl = X` (`X` is an Integer value), the message is stored with an expiry time of `X` hours unless you have message retention set to `Unlimited` on your keyset configuration in the Admin Portal.  
3. If `storeMessage = false`, the `ttl` parameter is ignored.  
4. If `ttl` isn't specified, then expiration of the message defaults back to the expiry value for the key.`customMessageType`Type: `String`Default:  
n/aA case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Sample code

##### Reference code

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

The `publish()` operation returns a `PublishResult` which contains the following operations:

MethodDescription`description`Type: `String`The description, for example `Sent`.`timetoken`Type: `int`Returns an `int` representation of the timetoken when the message was published.

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

The `signal()` function sends a signal to all subscribers of a channel.

- Payload size limit: 64 bytes (payload only). For larger payloads, contact support.

### Method(s)

To Signal a message you can use the following method(s) in the Dart SDK:

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

*  requiredParameterDescription`channel` *Type: `String`Destination of the `message` (channel ID).`message` *Type: `Any`The payload.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.`customMessageType`Type: `String`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Sample code

Signal a message to a channel:

```
`1var result = await pubnub.signal('myChannel', 'signal!', customMessageType: 'text-message');  
`
```

### Response

The `signal()` operation returns a `SignalResult` which contains the following operations:

MethodDescription`description`Type: `String`The description, for example `Sent`.`timetoken`Type: `int`Returns an `int` representation of the timetoken when the signal was published.

## Subscribe

### Receive messages

Use event listeners to receive messages/signals/events for subscribed channels. See Subscription for adding listeners.

### Description

Creates an open TCP socket and listens for messages on specified channels. Requires subscribeKey at initialization.

- New subscriptions receive messages published after subscribe() completes.
- To auto-reconnect and retrieve missed messages after disconnects, set retryPolicy to RetryPolicy.linear during initialization.

##### Unsubscribing from all channels

Unsubscribing from all channels, then subscribing to new channels resets the last received timetoken and may cause message gaps.

### Method(s)

To Subscribe to a channel you can use the following method(s) in the Dart SDK:

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

*  requiredParameterDescription`channels` *Type: `Set<String>``channels` to subscribe to. Either `channel` ID or `channelGroup` is required.`channelGroups` *Type: `Set<String>``channelGroups` to subscribe to. Either `channel` ID or `channelGroup` is required.`withPresence`Type: `bool`Also subscribe to related presence information.   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).`timetoken`Type: `Timetoken`Timetoken to start the subscription from.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Sample code

Subscribe to a channel:

```
`1var channel = "my_channel";  
2var subscription = pubnub.subscribe(channels: {channel});  
`
```

### Returns

The `subscribe()` method returns a `Subscription`. For more information, refer to Subscription.

### Subscription

A `Subscription` contains a Dart stream of messages from subscribed channel(s). Transform streams or add listeners via listen.

### Listeners

For a list of available listeners, refer to the Event Listeners section.

##### Cancel

Cancels the subscription and disposes internal streams. Subscription becomes unusable.

###### Method(s)

```
`1subscription.cancel();  
`
```

###### Sample code

```
`1// var subscription = pubnub.subscribe(channels: {'my_channel'});  
2// active subscription available  
3await subscription.cancel();  
`
```

###### Returns

No return value.

##### Dispose

`dispose()` is an alias for `cancel()`.

##### Subscribe

`subscribe()` is an alias for `resume()` with reconnection logic. If not intentionally paused, reconnects; otherwise resumes.

###### Method(s)

```
`1subscription.subscribe()  
`
```

###### Sample code

```
`1var subscription = pubnub.subscription(channels: {'my_channel'});  
2// Later, activate the subscription  
3subscription.subscribe();  
`
```

##### Unsubscribe

`unsubscribe()` is an alias for `pause()`.

##### Pause

Prevents the message and presence streams from emitting messages. Messages may be missed while paused. No-op if already paused.

###### Method(s)

```
`1subscription.pause()   
`
```

###### Sample code

```
`1var subscription = pubnub.subscribe(channels: {'my_channel'});  
2// active subscription available  
3subscription.pause();  
`
```

###### Returns

No return value.

##### Resume

Resumes a paused subscription. No-op if not paused.

###### Method(s)

```
`1subscription.resume()   
`
```

###### Sample code

```
`1// If subscription is paused  
2subscription.resume();  
`
```

###### Returns

No return value.

##### Restore

Restores a subscription after an error without creating a new one.

###### Method(s)

```
`1subscription.restore()  
`
```

###### Sample code

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

###### Returns

Returns `Future<void>` that completes when restored.

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

##### Unsubscribing from all channels

Unsubscribing from all channels resets the last-received timetoken.

#### Subscribing to multiple channels

Use Multiplexing to subscribe to more than one channel.

##### Alternative subscription methods

You can also use Wildcard Subscribe and Channel Groups (requires Stream Controller add-on enabled on your keyset in the Admin Portal).

```
`1var subscription = pubnub.subscribe(channels: {'my_channel', 'channel1'});  
`
```

#### Subscribing to a presence channel

##### Requires Presence

Presence add-on must be enabled for your key in the Admin Portal. See Presence Events for details.

Subscribe to presence for a given channel by setting withPresence: true.

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

When presence_deltas are enabled, interval messages may include joined, left, timed out arrays of changed UUIDs since the last interval.

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

If the interval payload exceeds ~30 KiB, joined/left/timeout fields are omitted and HereNowRefresh is true; perform a hereNow request for full presence.

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

##### Requires Stream Controller add-on

Enable Stream Controller (Enable Wildcard Subscribe) in the Admin Portal.

Wildcard subscribes allow subscribing to patterns like a.* for a.b, a.c, etc. Only the part after the dot is wildcarded.

```
`1var subscription = pubnub.subscribe(channels: {'foo.*'});  
`
```

##### Wildcard grants and revokes

Only one level (a.*) is supported. Grants/revokes on * or a.b.* are treated as literal channel names. You can revoke with a.* only if you granted with a.*.

#### Subscribe to a channel group

##### Requires Stream Controller add-on

```
`1var subscription = pubnub.subscribe(channelGroups: {'cg1'});  
`
```

#### Subscribe to the presence channel of a channel group

##### Requires Stream Controller add-on

```
`1var subscription =**2    pubnub.subscribe(channelGroups: {'cg1', 'cg2'}, withPresence: true);  
`
```

Last updated on Oct 28, 2025**