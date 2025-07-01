On this page
# Channel Groups API for PHP SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the PHP SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

```
`$pubnub->addChannelToChannelGroup()  
    ->channels(string|array)  
    ->channelGroup(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channels` *Type: String|ArrayThe `channels` to add to the channel group.`channelGroup` *Type: StringThe `channelGroup` to add the channels to.

### Basic Usage[​](#basic-usage)

#### Add Channels[​](#add-channels-1)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
  
// Create configuration  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-channel-group-demo");  
  
`
```
show all 47 lines

### Rest Response from Server[​](#rest-response-from-server)

```
`{  
    "service" : "channel-registry",  
    "status"  : 200,  
    "error"   : false,  
    "message" : "OK"  
}  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channelGroup` *Type: StringThe `channel group` to fetch channels.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup("cg1")  
    ->sync();  
`
```

### Rest Response from Server[​](#rest-response-from-server-1)

```
`{  
    "status" : 200,  
    "payload" : {  
        "channels" : ["hi"],  
        "group" : "abcd"  
    },  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the PHP SDK:

```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels(string|array)  
    ->channelGroup(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channels` *Type: String|Array`channels` to remove from the channel group.`channelGroup` *Type: StringSpecifies `ChannelGroup` to remove.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels("son")  
    ->channelGroup("family")  
    ->sync();  
`
```

### Rest Response from Server[​](#rest-response-from-server-2)

```
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the PHP SDK:

```
`$pubnub->removeChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```

*  requiredParameterDescription`channelGroup` *Type: StringThe `channelGroup` to remove.

### Basic Usage[​](#basic-usage-3)

#### Delete Channel Group[​](#delete-channel-group-1)

```
`$pubnub->removeChannelGroup()  
    ->channelGroup("family")  
    ->sync();  
`
```

### Rest Response from Server[​](#rest-response-from-server-3)

```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```
Last updated on Apr 2, 2025**