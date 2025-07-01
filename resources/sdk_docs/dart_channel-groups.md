# Channel Groups API – Dart SDK (condensed)

Channel groups bundle many channels under one name; you can **subscribe** to a group but must **publish to channels individually**.

---

## Add Channels

*Requires Stream Controller add-on*  
Adds up to **200 channels per call** to a group.

### Method

```
`pubnub.channelGroups.addChannels(  
  String group,  
  SetString> channels,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

Parameters  
• `group` – channel group name (String)  
• `channels` – channels to add (Set<String>)  
• `keyset` – override default Keyset  
• `using` – named keyset from `keysetStore`

### Example

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId')  
    ),  
  );  
  
  var group = 'cg1';  
  var channels = {'ch1', 'ch2'};  
`
```
*(code truncated for brevity)*

### Response

```
`{  
  "service": "channel-registry",  
  "status": "200",  
  "error": false,  
  "message": "OK"  
}  
`
```

---

## List Channels

*Requires Stream Controller add-on*  
Returns all channels in a group.

### Method

```
`pubnub.channelGroups.listChannels(  
  String group,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

Parameters identical to Add Channels (except `channels`).

### Example

```
`var result = await pubnub.channelGroups.listChannels('cg1');  
`
```

### Return type  
`ChannelGroupListChannelsResult`  
• `channels` – Set<String>  
• `name` – group name

---

## Remove Channels

*Requires Stream Controller add-on*  
Removes specific channels from a group.

### Method

```
`pubnub.channelGroups.removeChannels(  
  String group,  
  SetString> channels,  
  {Keyset? keyset,  
  String? using}  
)  
`
```

### Example

```
`var result = await pubnub.channelGroups.removeChannels('cg1', {'ch1'});  
`
```

### Response

```
`{  
  "service": "channel-registry",  
  "status": "200",  
  "error": false,  
  "message": "OK"  
}  
`
```

---

## Delete Channel Group

*Requires Stream Controller add-on*  
Removes **all** channels from the group.

### Method

```
`pubnub.channelGroups.delete(  
  String group,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

### Example

```
`var result = await pubnub.channelGroups.delete('cg1');  
`
```

### Response

```
`{  
"service": "channel-registry",  
"status": "200",  
"error": false,  
"message": "OK"  
}  
`
```

---

## Get Subscribed Channel Groups

Returns currently subscribed groups (`Set<String>`).

### Property

```
`// property of `Subscription` class  
subscription.channelGroups  
`
```

### Example

```
`var subscription = pubnub.subscribe(channelGroups: {'cg1', 'cg2'});  
var subscribedChannelGroups = subscription.channelGroups;  
  
print('subscribed channel groups are $subscribedChannelGroups');  
`
```

### Response

```
`["channel1", "channel2"]**`
```

_Last updated: Mar 31, 2025_