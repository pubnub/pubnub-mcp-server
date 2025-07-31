# Channel Groups API – PHP SDK (condensed)

Channel groups bundle many channels under a single name.  
• Subscribe only – publishing must be done on individual channels.  
• All operations below require the **Stream Controller** add-on to be enabled for your keys.

---

## Add channels

Maximum 200 channels per call.

### Method
```
`$pubnub->addChannelToChannelGroup()  
    ->channels(string|array)  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameters  
• `channels` String | Array – channels to add  
• `channelGroup` String – target group

### Sample
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

### Server response
```
`{  
    "service" : "channel-registry",  
    "status"  : 200,  
    "error"   : false,  
    "message" : "OK"  
}  
`
```

---

## List channels

### Method
```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameter  
• `channelGroup` String – group to query

### Sample
```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup("cg1")  
    ->sync();  
`
```

### Server response
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

---

## Remove channels

### Method
```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels(string|array)  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameters  
• `channels` String | Array – channels to remove  
• `channelGroup` String – target group

### Sample
```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels("son")  
    ->channelGroup("family")  
    ->sync();  
`
```

### Server response
```
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

---

## Delete channel group

### Method
```
`$pubnub->removeChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameter  
• `channelGroup` String – group to delete

### Sample
```
`$pubnub->removeChannelGroup()  
    ->channelGroup("family")  
    ->sync();  
`
```

### Server response
```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

_Last updated: Jul 15 2025_