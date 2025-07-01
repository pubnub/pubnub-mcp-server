# Channel Groups API – PHP SDK

Channel Groups bundle multiple channels under a single name.  
• Subscribe only (publish directly to each channel).  
• All operations require the **Stream Controller** add-on (enable in Admin Portal).  

---

## Add Channels

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
• `channels` (string|array) – Channels to add.  
• `channelGroup` (string) – Target group.

### Example
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

### REST Response
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

## List Channels

### Method
```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameter  
• `channelGroup` (string) – Group to query.

### Example
```
`$pubnub->listChannelsInChannelGroup()  
    ->channelGroup("cg1")  
    ->sync();  
`
```

### REST Response
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

## Remove Channels

### Method
```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels(string|array)  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameters  
• `channels` (string|array) – Channels to remove.  
• `channelGroup` (string) – Source group.

### Example
```
`$pubnub->removeChannelFromChannelGroup()  
    ->channels("son")  
    ->channelGroup("family")  
    ->sync();  
`
```

### REST Response
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

## Delete Channel Group

### Method
```
`$pubnub->removeChannelGroup()  
    ->channelGroup(string)  
    ->sync();  
`
```
Parameter  
• `channelGroup` (string) – Group to delete.

### Example
```
`$pubnub->removeChannelGroup()  
    ->channelGroup("family")  
    ->sync();  
`
```

### REST Response
```
`{**    "status" : 200,  
    "message" : "OK",  
    "service" : "channel-registry",  
    "error" : False  
}  
`
```

_Last updated: Apr 2 2025_