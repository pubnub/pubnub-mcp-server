On this page
# Channel Groups API for Dart SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Methods[​](#methods)

Adding Channels is accomplished by using the following method(s) in the Dart SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`pubnub.channelGroups.addChannels(  
  String group,  
  SetString> channels,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`group` *Type: `String`The channel group to add the channels to.`channels` *Type: `Set<String>`The channels to add to the channel group.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`import 'package:pubnub/pubnub.dart';  
  
void main() async {  
  // Create PubNub instance with default keyset.  
  var pubnub = PubNub(  
    defaultKeyset: Keyset(  
      subscribeKey: 'demo',  
      publishKey: 'demo',  
      userId: UserId('myUniqueUserId')  
    ),  
  );  
  
  // Define the channel group and channels to add.  
  var group = 'cg1';  
  var channels = {'ch1', 'ch2'};  
`
```
show all 22 lines

### Response[​](#response)

The `addChannels()` method returns a `ChannelGroupChangeChannelsResult`.

```
`{  
  "service": "channel-registry",  
  "status": "200",  
  "error": false,  
  "message": "OK"  
}  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Methods[​](#methods-1)

Listing channels is accomplished by using the following method(s) in the Dart SDK:

```
`pubnub.channelGroups.listChannels(  
  String group,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`group` *Type: `String`The channel group fetch the channels.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-1)

```
`var result = await pubnub.channelGroups.listChannels('cg1');  
`
```

### Returns[​](#returns)

The `listChannels()` operation returns a `ChannelGroupListChannelsResult` which contains the following operations:

MethodDescription`channels`Type: `Set<String>`List of `channels` of a `channel group`.`name`Type: `String`Channel group name.

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Dart SDK:

```
`pubnub.channelGroups.removeChannels(  
  String group,  
  SetString> channels,  
  {Keyset? keyset,  
  String? using}  
)  
`
```

*  requiredParameterDescription`group` *Type: `String`The channel group to remove the channels from.`channels` *Type: `Set<String>`The channels to remove from the channel group.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-2)

```
`var result = await pubnub.channelGroups.removeChannels('cg1', {'ch1'});  
`
```

### Returns[​](#returns-1)

The `removeChannels` method returns a `ChannelGroupChangeChannelsResult`.

```
`{  
  "service": "channel-registry",  
  "status": "200",  
  "error": false,  
  "message": "OK"  
}  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes all channels from the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Dart SDK:

```
`pubnub.channelGroups.delete(  
  String group,  
  {Keyset? keyset,  
  String? using}  
)   
`
```

*  requiredParameterDescription`group` *Type: `String`The channel group to remove all channels from.`keyset`Type: `Keyset`Override for the PubNub default keyset configuration.`using`Type: `String`Keyset name from the `keysetStore` to be used for this method call.

### Basic Usage[​](#basic-usage-3)

```
`var result = await pubnub.channelGroups.delete('cg1');  
`
```

### Returns[​](#returns-2)

The `delete` method returns a `ChannelGroupDeleteResult`.

```
`{  
"service": "channel-registry",  
"status": "200",  
"error": false,  
"message": "OK"  
}  
`
```

## Get Subscribed Channel Groups[​](#get-subscribed-channel-groups)

Returns all the subscribed channel groups in a `Set<String>`.

### Method(s)[​](#methods-4)

`Get Subscribed Channel Groups` is accomplished by inspecting the following property in the Dart SDK:

```
`// property of `Subscription` class  
subscription.channelGroups  
`
```

### Basic Usage[​](#basic-usage-4)

```
`var subscription = pubnub.subscribe(channelGroups: {'cg1', 'cg2'});  
var subscribedChannelGroups = subscription.channelGroups;  
  
print('subscribed channel groups are $subscribedChannelGroups');  
`
```

### Response[​](#response-1)

This property is of type `Set<String>`.

```
`["channel1", "channel2"]**`
```
Last updated on Mar 31, 2025**