# Channel Groups API for Dart SDK

Channel groups let you bundle many channels under a named group. You can subscribe to a channel group, but you cannot publish to it. To publish, send to each channel individually.

Note: The Stream Controller add-on must be enabled in the Admin Portal for add/list/remove/delete channel group operations.

## Add channels to a channel group

Adds channels to a channel group.

Maximum number of channels: You can add up to 200 channels per API call.

### Method(s)

```dart
pubnub.channelGroups.addChannels(
  String group,
  Set<String> channels, {
  Keyset? keyset,
  String? using,
})
```

Parameters:
- group (String): Channel group to add channels to.
- channels (Set<String>): Channels to add.
- keyset (Keyset, optional): Override the default keyset.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code

```dart
import 'package:pubnub/pubnub.dart';

void main() async {
  // Create PubNub instance with default keyset.
  var pubnub = PubNub(
    defaultKeyset: Keyset(
      subscribeKey: 'demo',
      publishKey: 'demo',
      userId: UserId('myUniqueUserId'),
    ),
  );

  // Define the channel group and channels to add.
  var group = 'cg1';
  var channels = {'ch1', 'ch2'};

  // Add channels to the channel group
  var result = await pubnub.channelGroups.addChannels(group, channels);

  // Print the result
  print('Add Channels Result: $result');
}
```

### Response

Returns a ChannelGroupChangeChannelsResult.

```json
{
  "service": "channel-registry",
  "status": "200",
  "error": false,
  "message": "OK"
}
```

## List channels in a channel group

Lists all channels in a channel group.

### Method(s)

```dart
pubnub.channelGroups.listChannels(
  String group, {
  Keyset? keyset,
  String? using,
})
```

Parameters:
- group (String): Channel group to list channels for.
- keyset (Keyset, optional): Override the default keyset.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code

```dart
var result = await pubnub.channelGroups.listChannels('cg1');
```

### Returns

Returns a ChannelGroupListChannelsResult with:
- channels (Set<String>): Channels in the group.
- name (String): Channel group name.

## Remove channels from a channel group

Removes channels from a channel group.

### Method(s)

```dart
pubnub.channelGroups.removeChannels(
  String group,
  Set<String> channels, {
  Keyset? keyset,
  String? using,
})
```

Parameters:
- group (String): Channel group to remove channels from.
- channels (Set<String>): Channels to remove.
- keyset (Keyset, optional): Override the default keyset.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code

```dart
var result = await pubnub.channelGroups.removeChannels('cg1', {'ch1'});
```

### Returns

Returns a ChannelGroupChangeChannelsResult.

```json
{
  "service": "channel-registry",
  "status": "200",
  "error": false,
  "message": "OK"
}
```

## Delete a channel group

Deletes a channel group.

### Method(s)

```dart
pubnub.channelGroups.delete(
  String group, {
  Keyset? keyset,
  String? using,
})
```

Parameters:
- group (String): Channel group to delete.
- keyset (Keyset, optional): Override the default keyset.
- using (String, optional): Keyset name from keysetStore to use.

### Sample code

```dart
var result = await pubnub.channelGroups.delete('cg1');
```

### Returns

Returns a ChannelGroupDeleteResult.

```json
{
  "service": "channel-registry",
  "status": "200",
  "error": false,
  "message": "OK"
}
```

## Get subscribed channel groups

Returns all subscribed channel groups as a Set<String>.

### Method(s)

```dart
// property of `Subscription` class
subscription.channelGroups
```

### Sample code

```dart
var subscription = pubnub.subscribe(channelGroups: {'cg1', 'cg2'});
var subscribedChannelGroups = subscription.channelGroups;

print('subscribed channel groups are $subscribedChannelGroups');
```

### Response

Type: Set<String>

```json
["channel1", "channel2"]
```