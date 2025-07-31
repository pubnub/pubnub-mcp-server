# Message Persistence API – PHP SDK (Storage & Playback)

Message Persistence stores every published message (AES-256 optional) for 1 day – Unlimited retention (set per key). Enable the add-on in Admin Portal before using the APIs below.

---

## Fetch history

Requires `Message Persistence` feature enabled.

### Method

```php
$pubnub->fetchMessages()
    ->channels(string|array<string>)
    ->maximumPerChannel(int)
    ->start(string)
    ->end(string)
    ->includeMessageActions(bool)
    ->includeMeta(bool)
    ->includeMessageType(bool)
    ->includeCustomMessageType(bool)
    ->includeUuid(bool);
```

Parameter | Type | Default | Notes
--- | --- | --- | ---
channels* | string / array | — | ≤ 500 channels
maximumPerChannel | int | 25 or 100 | 25 when `includeMessageActions=true` (single channel only); otherwise 100 (single) / 25 (multi)
start | string | — | Exclusive start timetoken
end | string | — | Inclusive end timetoken
includeMessageActions | bool | false | Adds message actions (single channel only)
includeMeta | bool | false | Include message `meta`
includeMessageType | bool | — | Include `messageType`
includeCustomMessageType | bool | — | Include `customMessageType`
includeUuid | bool | — | Include publisher UUID

Timetoken rules  
• start only → older than `start`  
• end only → `end` and newer  
• both → between `start` and `end` (inclusive of `end`)  
Page with `start` to retrieve >100/25 msgs.

### Sample

```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnConfig = new PNConfiguration();
$pnConfig->setPublishKey("demo");
$pnConfig->setSubscribeKey("demo");
$pnConfig->setUserId("fetch-messages-demo-user");
```
(show all 110 lines)

### Returns

`PNFetchMessagesResult`
* `channels` : array<PNFetchMessageItem>
* `startTimetoken` : int
* `endTimetoken`   : int

`PNFetchMessageItem`
* `message`              : mixed
* `meta`                 : mixed
* `messageType`          : mixed
* `customMessageType`    : mixed
* `uuid`                 : string
* `timetoken`            : int
* `actions`              : list

---

## History

### Method

```php
$pubnub->history()
    ->channel(string)
    ->reverse(bool)
    ->includeTimetoken(bool)
    ->start(int)
    ->end(int)
    ->count(int)
    ->sync();
```

Parameter | Type | Default | Notes
--- | --- | --- | ---
channel* | string | — | Single channel
reverse | bool | false | `true` = oldest → newest
includeTimetoken | bool | false | Include message timetokens
start | int | — | Exclusive start timetoken
end | int | — | Inclusive end timetoken
count | int | — | ≤ 100

Tip: `reverse` defines traversal end when more than `count` messages match.

### Samples

Retrieve last 100 messages:

```php
$result = $pubnub->history()
    ->channel("history_channel")
    ->count(100)
    ->sync();
```

Oldest 3 messages:

```php
$pubnub->history()
    ->channel("my_channel")
    ->count(3)
    ->reverse(true)
    ->sync();
```

From timetoken (exclusive) forward:

```php
$pubnub->history()
    ->channel("my_channel")
    ->start(13847168620721752)
    ->reverse(true)
    ->sync();
```

Until timetoken (inclusive) backward:

```php
$pubnub->history()
    ->channel("my_channel")
    ->count(100)
    ->start(-1)
    ->end(13847168819178600)
    ->reverse(true)
    ->sync();
```

Include timetokens:

```php
$pubnub->history()
    ->channel("my_channel")
    ->count(100)
    ->includeTimetoken(true)
    ->sync();
```

### Response

`PNHistoryResult`
* `getMessages()` → array<PNHistoryItemResult>
* `getStartTimetoken()` → int
* `getEndTimetoken()`   → int

`PNHistoryItemResult`
* `getTimetoken()` → int
* `getEntry()`     → mixed

---

## Delete messages from history

Prereqs: Message Persistence enabled, “Enable Delete-From-History” checked, and SDK initialized with the secret key.

### Method

```php
$pubnub->deleteMessages()
    ->channel(string)
    ->start(int)
    ->end(int)
    ->sync();
```

Parameter | Type | Notes
--- | --- | ---
channel* | string | Channel to delete from
start | int | Inclusive start timetoken
end | int | Exclusive end timetoken

### Samples

Delete range:

```php
$pubnub->deleteMessages()
    ->channel("ch")
    ->start(123)
    ->end(456)
    ->sync();
```

Delete a single message (`publishTimetoken = 15526611838554310`):

```php
$pubnub->deleteMessages()
    ->channel("ch")
    ->start(15526611838554309) // publishTimetoken - 1
    ->end(15526611838554310)   // publishTimetoken
    ->sync();
```

---

## Message counts

Returns number of messages per channel with `timetoken ≥ channelsTimetoken`. For unlimited retention keys, only past 30 days are counted.

### Method

```php
$pubnub->messageCounts()
    ->channels(array)
    ->channelsTimetoken(array);
```

Parameter | Type | Notes
--- | --- | ---
channels* | array<string> | Channels to query
channelsTimetoken* | array<int> | Single timetoken applied to all channels, or one per channel (must match length)

### Sample

```php
$response = $pubnub->messageCounts()
    ->channels(["mychannel"])
    ->channelsTimetoken(["15513576173381797"])
    ->sync();

print_r($response->getChannels());
```

### Returns

`PNMessageCountsResult`
* `getChannels()` → associative array `channel => count` (0–10000)

Retrieve counts with per-channel timetokens:

```php
$response = $pubnub->messageCounts()
    ->channels(["mychannel", "another_channel"])
    ->channelsTimetoken(["15513576173381797", "15513574291261651"])
    ->sync();

print_r($response->getChannels());
```

---

_Last updated Jul 15 2025_