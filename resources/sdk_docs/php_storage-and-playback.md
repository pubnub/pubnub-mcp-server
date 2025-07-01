# PubNub PHP SDK – Storage & Playback (Condensed)

Message Persistence  
• Stores every published message (AES-256 optional).  
• Retention: 1 day, 7 days, 30 days, 3 mo, 6 mo, 1 yr, Unlimited.  
• Requires the “Message Persistence” add-on to be enabled in the Admin Portal.

---

## Fetch History  (`fetchMessages()`)

Requires Message Persistence.

```php
$pubnub->fetchMessages()
    ->channels(string|array)           // ≤ 500 channels
    ->maximumPerChannel(int)           // 25 / 100, see below
    ->start(string)                    // exclusive
    ->end(string)                      // inclusive
    ->includeMessageActions(bool)      // limits to 1 channel, max 25 msgs
    ->includeMeta(bool)
    ->includeMessageType(bool)
    ->includeCustomMessageType(bool)
    ->includeUuid(bool)
```

Parameter summary  
• `maximumPerChannel` – if `includeMessageActions=true`, max = 25 (single channel); otherwise max = 100 (single) or 25 (multi).  
• `start` only → older than `start`; `end` only → `end` and newer; both → between.  
Returned: `PNFetchMessagesResult`  
– `channels` → array of `PNFetchMessageItem`  
– `startTimetoken`, `endTimetoken` (ints)  
`PNFetchMessageItem` fields: `message`, `meta`, `messageType`, `customMessageType`, `uuid`, `timetoken`, `actions`.

Example (truncated to essentials):

```php
// Include Composer autoloader
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnConfig = new PNConfiguration();
$pnConfig->setPublishKey("demo");
$pnConfig->setSubscribeKey("demo");
$pnConfig->setUserId("fetch-messages-demo-user");
// ...
```

---

## History  (`history()`)

Requires Message Persistence.

```php
$pubnub->history()
    ->channel(string)            // required
    ->reverse(bool)              // default false
    ->includeTimetoken(bool)     // include per-msg timetoken
    ->start(int)                 // exclusive
    ->end(int)                   // inclusive
    ->count(int)                 // max 100, default 100
    ->sync();
```

Usage notes  
• `reverse=false` → newest→oldest (default search direction).  
• `start` / `end` behavior identical to Fetch History.  
Returns `PNHistoryResult` → `getMessages()` (array of `PNHistoryItemResult`), `getStartTimetoken()`, `getEndTimetoken()`.  
`PNHistoryItemResult` → `getTimetoken()`, `getEntry()`.

### Code examples

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

Newer than a timetoken:

```php
$pubnub->history()
    ->channel("my_channel")
    ->start(13847168620721752)
    ->reverse(true)
    ->sync();
```

Until a timetoken:

```php
$pubnub->history()
    ->channel("my_channel")
    ->count(100)
    ->start(-1)
    ->end(13847168819178600)
    ->reverse(true)
    ->sync();
```

Include timetoken:

```php
$pubnub->history()
    ->channel("my_channel")
    ->count(100)
    ->includeTimetoken(true)
    ->sync();
```

Sample response (truncated):

```php
PubNub\Models\Consumer\History\PNHistoryResult Object(
    [messages:private] => Array(
        [0] => PubNub\Models\Consumer\History\PNHistoryItemResult Object(
            [entry:private] => Array([a] => 11 [b] => 22)
            [timetoken:private] => 1111
        )
        // ...
    )
)
```

---

## Delete Messages from History  (`deleteMessages()`)

• Requires Message Persistence AND “Delete-From-History” enabled in key settings.  
• Initialize `PubNub` with Secret Key.

```php
$pubnub->deleteMessages()
    ->channel(string)   // required
    ->start(int)        // inclusive
    ->end(int)          // exclusive
    ->sync();
```

Basic delete:

```php
$pubnub->deleteMessages()
    ->channel("ch")
    ->start(123)
    ->end(456)
    ->sync();
```

Delete a single message (publish timetoken = 15526611838554310):

```php
$pubnub->deleteMessages()
    ->channel("ch")
    ->start(15526611838554309)   // timetoken - 1
    ->end(15526611838554310)     // timetoken
    ->sync();
```

---

## Message Counts  (`messageCounts()`)

Returns number of messages (≤ 30 days for unlimited retention keys) published since specified timetoken(s).

```php
$pubnub->messageCounts()
    ->channels(array)           // required
    ->channelsTimetoken(array); // required
```

Rules  
• One timetoken applies to all channels, or supply per-channel list of equal length.  
Returns `PNMessageCountsResult` → `getChannels()` (assoc array channel → count, max = 10000).

Example – single timetoken:

```php
$response = $pubnub->messageCounts()
    ->channels(["mychannel"])
    ->channelsTimetoken(["15513576173381797"])
    ->sync();

print_r($response->getChannels());
```

Example – per-channel timetokens:

```php
$response = $pubnub->messageCounts()
    ->channels(["mychannel", "another_channel"])
    ->channelsTimetoken(["15513576173381797","15513574291261651"])
    ->sync();

print_r($response->getChannels());
```

---

_Last updated: Jun 10 2025_