# Channel Groups API for Dart SDK

Channel groups bundle multiple channels under a single name. You can subscribe to channel groups, but you cannot publish to them. To publish, send messages to individual channels.

## Add channels to a channel group

Requires Stream Controller add-on enabled for your key in the Admin Portal.

Adds channels to a channel group.

### Method(s)

```
`1pubnub.channelGroups.addChannels(  
2  String group,  
3  SetString> channels,  
4  {Keyset? keyset,  
5  String? using}  
6)   
`
```

Parameters:
- group (String) — Channel group to add channels to.
- channels (Set<String>) — Channels to add.
- keyset (Keyset, optional) — Override default keyset.
- using (String, optional) — Named keyset from keysetStore.

Maximum per call: 200 channels.

### Sample code

```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId')  
10    ),  
11  );  
12
  
13  // Define the channel group and channels to add.  
14  var group = 'cg1';  
15  var channels = {'ch1', 'ch2'};  
16
  
17  // Add channels to the channel group  
18  var result = await pubnub.channelGroups.addChannels(group, channels);  
19
  
20  // Print the result  
21   print('Add Channels Result: ${result}');  
22}  
```

### Response

Returns ChannelGroupChangeChannelsResult.

```
`1{  
2  "service": "channel-registry",  
3  "status": "200",  
4  "error": false,  
5  "message": "OK"  
6}  
`
```

## List channels in a channel group

Requires Stream Controller add-on enabled for your key in the Admin Portal.

Lists all channels in a channel group.

### Method(s)

```
`1pubnub.channelGroups.listChannels(  
2  String group,  
3  {Keyset? keyset,  
4  String? using}  
5)   
`
```

Parameters:
- group (String) — Channel group to list.
- keyset (Keyset, optional) — Override default keyset.
- using (String, optional) — Named keyset from keysetStore.

### Sample code

```
`1var result = await pubnub.channelGroups.listChannels('cg1');  
`
```

### Returns

ChannelGroupListChannelsResult:
- channels (Set<String>) — Channels in the group.
- name (String) — Channel group name.

## Remove channels from a channel group

Requires Stream Controller add-on enabled for your key in the Admin Portal.

Removes channels from a channel group.

### Method(s)

```
`1pubnub.channelGroups.removeChannels(  
2  String group,  
3  SetString> channels,  
4  {Keyset? keyset,  
5  String? using}  
6)  
`
```

Parameters:
- group (String) — Channel group to remove channels from.
- channels (Set<String>) — Channels to remove.
- keyset (Keyset, optional) — Override default keyset.
- using (String, optional) — Named keyset from keysetStore.

### Sample code

```
`1var result = await pubnub.channelGroups.removeChannels('cg1', {'ch1'});  
`
```

### Returns

Returns ChannelGroupChangeChannelsResult.

```
`1{  
2  "service": "channel-registry",  
3  "status": "200",  
4  "error": false,  
5  "message": "OK"  
6}  
`
```

## Delete a channel group

Requires Stream Controller add-on enabled for your key in the Admin Portal.

Deletes a channel group.

### Method(s)

```
`1pubnub.channelGroups.delete(  
2  String group,  
3  {Keyset? keyset,  
4  String? using}  
5)   
`
```

Parameters:
- group (String) — Channel group to delete (removes all channels).
- keyset (Keyset, optional) — Override default keyset.
- using (String, optional) — Named keyset from keysetStore.

### Sample code

```
`1var result = await pubnub.channelGroups.delete('cg1');  
`
```

### Returns

Returns ChannelGroupDeleteResult.

```
`1{  
2"service": "channel-registry",  
3"status": "200",  
4"error": false,  
5"message": "OK"  
6}  
`
```

## Get subscribed channel groups

Returns all subscribed channel groups as Set<String>.

### Method(s)

```
`1// property of `Subscription` class  
2subscription.channelGroups  
`
```

### Sample code

```
1var subscription = pubnub.subscribe(channelGroups: {'cg1', 'cg2'});  
2var subscribedChannelGroups = subscription.channelGroups;  
3
  
4print('subscribed channel groups are $subscribedChannelGroups');  
```

### Response

Type: Set<String>.

```
`1["channel1", "channel2"]**`
```