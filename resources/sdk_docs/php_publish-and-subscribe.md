# PubNub PHP SDK – Publish & Subscribe (Concise Reference)

Below is a compact reference for all **publish / subscribe**-related features.  
All method signatures, parameters, and code samples are **unchanged** from the original docs.

---

## Publish

### Method
```php
$pubnub->publish()
    ->channel(string)
    ->message(string|array)
    ->shouldStore(boolean)
    ->ttl($ttl)
    ->meta(array)
    ->usePost(boolean)
    ->customMessageType(string)
    ->sync();
```

Parameter | Type | Default | Notes
--- | --- | --- | ---
channel* | string | – | Destination channel.
message* | string &#124; array | – | Any JSON-serializable value (no pre-serialization).
shouldStore | boolean | account default | Store in history.
ttl | number | – | Per-message TTL.
meta | array | null | Filtering metadata.
usePost | boolean | false | Publish with POST.
customMessageType | string | – | 3–50 chars, case-sensitive label (`text`, `action`, `poll`, …).

Key points  
• Initialize with `publishKey`.  
• Max payload (incl. channel & escaping): **32 KiB** (optimal < 1.8 KB).  
• One channel per call, send serially, retry on error.  
• In-memory queue per subscriber: 100 msgs.  
• Optional TLS (`ssl => true`) and end-to-end encryption.

### Sample – basic publish
```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubServerException;
use PubNub\Exceptions\PubNubException;

$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-publish-demo-user");
```
*(…rest of file unchanged)*

### Other examples
```php
$result = $pubnub->publish()
                 ->channel("my_channel")
                 ->message(["hello", "there"])
                 ->meta(["name" => "Alex"])
                 ->sync();
```

```php
try {
    $result = $pubnub->publish()
                     ->channel("my_channel")
                     ->message(["hello", "there"])
                     ->meta(["name"=>"Alex","online"=>true])
                     ->sync();
    print_r($result->getTimetoken());
} catch (PubNubException $error) {
    handleException($error);
}
```

### Response
`PNPublishResult`  
`getTimetoken(): int`

---

## Fire (server-only, no replication/history)

### Method
```php
$pubnub->fire()
    ->channel(string)
    ->message(string|array)
    ->meta(array)
    ->usePost(boolean)
    ->sync();
```

### Sample
```php
try {
    $result = $pubnub->fire()
                     ->channel("my_channel")
                     ->message(["hello","there"])
                     ->usePost(true)
                     ->sync();
    echo "Publish worked! Timetoken: ".$result->getTimetoken();
} catch (\PubNub\Exceptions\PubNubServerException $e) {
    echo "Error: ".$e->getMessage();
}
```

---

## Signal (≤ 64 bytes, no history/push)

### Method
```php
$pubnub->signal()
    ->channel(string)
    ->message(string|array)
    ->sync();
```

### Sample
```php
$result = $pubnub->signal()
                 ->channel("my_channel")
                 ->message("typing...")
                 ->sync();
print_r($result->getTimetoken());
```

### Response
`PNSignalResult` – `getTimetoken(): int`

---

## Subscribe

### Method
```php
$pubnub->subscribe()
    ->channels(string|array)
    ->channelGroups(string|array)
    ->withTimetoken(integer)
    ->withPresence(boolean)
    ->execute();
```

Parameter | Type | Notes
--- | --- | ---
channels | string &#124; array | Channel list.
channelGroups | string &#124; array | Channel-group list.
withTimetoken | integer | Resume at given timetoken.
withPresence | boolean | Also receive presence events.

• Call is **blocking**; add listener callbacks before `execute()`.  
• Unsubscribe by throwing `PubNubUnsubscribeException` inside a listener.

### Basic subscribe
```php
$pubnub->subscribe()
       ->channels("my_channel")
       ->execute();
```

### Multiplex / presence / wildcard / state / channel-group – code blocks unchanged
```php
$pubnub->subscribe()->channels(["my_channel1","my_channel2"])->execute();
```
```php
$pubnub->subscribe()->channels("my_channel")->withPresence()->execute();
```
```php
$pubnub->subscribe()->channels("foo.*")->execute();
```
```php
$pubnub->subscribe()->channelGroups(["cg1","cg2"])->execute();
```
```php
$pubnub->subscribe()
       ->channelGroups("awesome_channel_group")
       ->withPresence()
       ->execute();
```

### Presence sample payloads
```json
{ "action":"join","timestamp":1345546797,"uuid":"...","occupancy":2 }
```
```json
{ "action":"leave","timestamp":1345549797,"uuid":"...","occupancy":1 }
```
```json
{ "action":"timeout","timestamp":1345549797,"uuid":"...","occupancy":0 }
```
```json
{ "action":"state-change","uuid":"...","timestamp":1345549797,"data":{"isTyping":true} }
```
```json
{ "action":"interval","timestamp":1474396578,"occupancy":2 }
```
```json
{ "action":"interval","occupancy":2,"timestamp":...,"joined":["uuid2","uuid3"],"timedout":["uuid1"] }
```
```json
{ "action":"interval","occupancy":2,"timestamp":...,"here_now_refresh":true }
```

### Subscribe Responses
* `PNStatus` – `getCategory()`, `isError()`, `getException()`, `getStatusCode()`, `getOperation()`
* `PNMessageResult` – `getMessage()`, `getSubscription()`, `getTimetoken()`
* `PNPresenceEventResult` – `getStatusCode()`, `getUuid()`, `getTimestamp()`, `getOccupancy()`, `getSubscription()`, `getTimetoken()`

---

## Unsubscribe

### Method
```php
(new PubNubUnsubscribeException())
    ->setChannels(array)        // optional
    ->setChannelGroups(array);  // optional
```

### Sample
```php
use PubNub\Callbacks\SubscribeCallback;
use PubNub\Enums\PNStatusCategory;
use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubUnsubscribeException;

$pnconfig = new PNConfiguration();
$pnconfig->setPublishKey("demo");
$pnconfig->setSubscribeKey("demo");
$pubnub  = new PubNub($pnconfig);

class MySubscribeCallback extends SubscribeCallback {
    function status($pubnub, $status) {
        throw (new PubNubUnsubscribeException())->setChannels(["my_channel"]);
    }
    function message($pubnub, $message) {}
    function presence($pubnub, $presence) {}
}
```

#### Multiple channels / channel-groups
```php
throw new PubNubUnsubscribeException();                   // all
throw (new PubNubUnsubscribeException())->setChannelGroups(["group1"]);
```

### Server response
```json
{ "action" : "leave" }
```

_Last updated Jul 15 2025_