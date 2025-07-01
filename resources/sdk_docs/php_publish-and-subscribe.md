# Publish / Subscribe – PHP SDK (Condensed)

This is a reference-only extract. All code blocks, method signatures, parameters, limits and best-practice notes are preserved exactly as in the original document.

---

## Publish

Requirements & limits  
• `publishKey` in PNConfiguration  
• One channel per call  
• Max payload 32 KiB (optimal < 1800 bytes) – or error “Message Too Large”  
• Do **not** JSON-serialize `message` or `meta` (SDK does it)  
• Optional TLS (`ssl=>true`) and [crypto module](/docs/sdks/php/api-reference/configuration#crypto-module)  
• Queue limit 100 messages per subscriber; throttle bursts (ex: ≤ 5 msg/s)  
• Optional `customMessageType` (3–50 chars, a–z, 0–9, `_` or `-`, not `pn_`/`pn-`)  

Best practice  
• Publish serially. Send next message only after success `[1,"Sent",timetoken]`  
• Retry on failure `[0,…]`  

### Method

```
`$pubnub->publish()  
    ->channel(string)  
    ->message(string|array)  
    ->shouldStore(boolean)  
    ->ttl($ttl)  
    ->meta(array)  
    ->usePost(boolean)  
    ->customMessageType(string)  
    ->sync();  
`
```

Key parameters  
• `channel` (string, required) – destination  
• `message`  (string|array, required)  
• `shouldStore` (bool) – history  
• `ttl` (int) – per-message TTL  
• `meta` (array) – for filtering  
• `usePost` (bool) – POST vs GET  

#### Response  
`PNPublishResult::getTimetoken()` → `int`

### Examples

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubServerException;  
use PubNub\Exceptions\PubNubException;  
  
// Create configuration with demo keys  
$pnConfig = new PNConfiguration();  
$pnConfig->setSubscribeKey("demo");  
$pnConfig->setPublishKey("demo");  
$pnConfig->setUserId("php-publish-demo-user");  
`
```

```
`$result = $pubnub->publish()  
                ->channel("my_channel")  
                ->message(["hello", "there"])  
                ->meta(["name" => "Alex"])  
                ->sync();  
`
```

```
`use PubNub\Exceptions\PubNubException;  
  
try {  
    $result = $pubnub->publish()  
                    ->channel("my_channel")  
                    ->message(["hello", "there"])  
                    ->meta(["name" => "Alex", "online" => true])  
                    ->sync();  
    print_r($result->getTimetoken());  
} catch (PubNubException $error) {  
    handleException($error);  
}  
`
```

---

## Fire

• Triggers Functions Event Handlers only.  
• Not replicated to subscribers, not stored in history.

### Method

```
`$pubnub->fire()  
    ->channel(string)  
    ->message(string|array)  
    ->meta(array)  
    ->usePost(boolean)  
    ->sync();  
`
```

### Example

```
`use PubNub\Exceptions\PubNubException;  
  
try {  
$result = $pubnub->fire()  
        ->channel("my_channel")  
        ->message(["hello","there"])  
        ->usePost(true)  
        ->sync();  
  
    echo "Publish worked! Timetoken: " . $result->getTimetoken();  
}  
catch(\PubNub\Exceptions\PubNubServerException $e) {  
    echo "Error happened while publishing: " . $e->getMessage();  
}  
`
```

---

## Signal

• Requires `publishKey`  
• Payload ≤ 64 bytes  
• Cheap, not persisted, no push notifications  
• Keep signals on separate channels from messages

### Method

```
`$pubnub->signal()  
    ->channel(string)  
    ->message(string|array)  
    ->sync();  
`
```

### Example

```
`$result = $pubnub->signal()  
    ->channel("my_channel")  
    ->message("typing...")  
    ->sync();  
print_r($result->getTimetoken());  
  
`
```

#### Response  
`PNSignalResult::getTimetoken()` → `int`

---

## Subscribe

• Needs `subscribeKey`  
• Opens blocking loop; handled via event listeners (`status`, `message`, `presence`)  
• Throw `PubNubUnsubscribeException` inside callbacks to leave loop  
• Unsubscribe-all resets timetoken (possible gaps)

### Method

```
`$pubnub->subscribe()  
    ->channels(string|array)  
    ->channelGroups(string|array)  
    ->withTimetoken(integer)  
    ->withPresence(boolean)  
    ->execute();  
`
```

Key parameters  
• `channels` or `channelGroups` required  
• `withTimetoken` (int) – resume  
• `withPresence` (bool) – include `-pnpres`

### Examples

```
`$pubnub->subscribe()  
    ->channels("my_channel")  
    ->execute();  
`
```

```
`use Monolog\Handler\ErrorLogHandler;  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setPublishKey("demo");  
$pnconf->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconf);  
  
$pubnub->getLogger()->pushHandler(new ErrorLogHandler());  
  
$pubnub->subscribe()->channels("my_channel")->execute();  
`
```

```
`$pubnub->subscribe()  
    ->channels(["my_channel1", "my_channel2"])  
    ->execute();  
`
```

```
`$pubnub->subscribe()  
    ->channels("my_channel")  
    ->withPresence()  
    ->execute();  
`
```

Presence sample events:

```
`{  
    "action": "join",  
    "timestamp": 1345546797,  
    "uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy": 2  
}  
`
```

```
`{  
    "action" : "leave",  
    "timestamp" : 1345549797,  
    "uuid" : "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "occupancy" : 1  
}  
`
```

```
`{  
    "action": "timeout",  
    "timestamp": 1345549797,  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "occupancy": 0  
}  
`
```

```
`{  
    "action": "state-change",  
    "uuid": "76c2c571-9a2b-d074-b4f8-e93e09f49bd",  
    "timestamp": 1345549797,  
    "data": {  
        "isTyping": true  
    }  
}  
`
```

```
`{  
    "action":"interval",  
    "timestamp":1474396578,  
    "occupancy":2  
}  
`
```

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "joined" : ["uuid2", "uuid3"],  
    "timedout" : ["uuid1"]  
}  
`
```

```
`{  
    "action" : "interval",  
    "occupancy" : ,  
    "timestamp" : ,  
    "here_now_refresh" : true  
}  
`
```

Wildcard subscribe:

```
`$pubnub->subscribe()  
    ->channels("foo.*")  
    ->execute();  
`
```

Subscribe with state (truncated snippet):

```
`use PubNub\PubNub;  
use PubNub\PNConfiguration;  
use PubNub\Callbacks\SubscribeCallback;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setPublishKey("demo");  
$pnconf->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconf);  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        if ($status->getCategory() === PNStatusCategory::PNConnectedCategory) {  
            $result = $pubnub->setState()  
`
```

Channel group subscribe:

```
`$pubnub->subscribe()  
    ->channelGroups(["cg1", "cg2"])  
    ->execute();  
`
```

Presence channel group:

```
`$pubnub->subscribe()  
    ->channelGroups("awesome_channel_group")  
    ->withPresence()  
    ->execute();  
`
```

### Response Objects
PNStatus (`getCategory()`, `isError()`, `getException()`, `getStatusCode()`, `Operation`)  
PNMessageResult (`getMessage()`, `getSubscription()`, `getTimetoken()`)  
PNPresenceEventResult (`getStatusCode()`, `getUuid()`, `getTimestamp()`, `getOccupancy()`, `getSubscription()`, `getTimetoken()`)

---

## Unsubscribe

Call inside `status` / `message` / `presence` callbacks.

### Method

```
`(new PubNubUnsubscribeException())  
    ->setChannels(array)  
    ->setChannelGroups(array);  
`
```

### Example (basic)

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Enums\PNStatusCategory;  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
$pnconfig = new PNConfiguration();  
  
$pnconfig->setPublishKey("demo");  
$pnconfig->setSubscribeKey("demo");  
  
$pubnub = new PubNub($pnconfig);  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
`
```

Server response:

```
`{  
    "action" : "leave"  
}  
`
```

### Example – multiple channels

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        throw new PubNubUnsubscribeException();  
    }  
  
    function message($pubnub, $message) {  
    }  
  
    function presence($pubnub, $presence) {  
    }  
}  
`
```

```
`{  
    "action" : "leave"  
}  
`
```

### Example – channel group

```
`use PubNub\Callbacks\SubscribeCallback;  
use PubNub\Exceptions\PubNubUnsubscribeException;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        throw (new PubNubUnsubscribeException())->setChannelGroups(["my_channel"]);  
    }  
  
    function message($pubnub, $message) {  
    }  
  
    function presence($pubnub, $presence) {  
    }  
}  
`
```

```
`{**    "action": "leave"  
}  
`
```

_Last updated Jun 16 2025_