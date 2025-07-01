# Presence API – PHP SDK (Condensed)

Presence must be enabled for your keys in the Admin Portal.

---

## Here Now

Return occupancy, UUIDs, and (optionally) state of clients currently subscribed to channels or channel groups.  
Cache: 3 s.

### Method

```
$pubnub->hereNow()
    ->channels(string|array)        // Required if channelGroups() not used
    ->channelGroups(string|array)   // Required if channels() not used
    ->includeState(bool)            // Default: false
    ->includeUuids(bool)            // Default: true
    ->sync();
```

### Basic example

```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-presence-demo-user");
```
<!-- show all 77 lines -->

### Result objects

* **PNHereNowResult**
  * `getTotalChannels(): int`
  * `getTotalOccupancy(): int`
  * `getChannels(): array<PNHereNowChannelData>`

* **PNHereNowChannelData**
  * `getChannelName(): string`
  * `getOccupancy(): int`
  * `getOccupants(): array<PNHereNowOccupantData>`

* **PNHereNowOccupantData**
  * `getUuid(): string`
  * `getState(): array`

### Other examples

Return UUIDs + state:

```php
$result = $pubnub->hereNow()
    ->channels("my_channel")
    ->includeUuids(true)
    ->includeState(true)
    ->sync();
```

Return occupancy only:

```php
$result = $pubnub->hereNow()
    ->channels("my_channel")
    ->includeUuids(false)
    ->includeState(false)
    ->sync();
```

Channel groups:

```php
$pubnub->hereNow()
    ->channelGroups(["cg1", "cg2", "cg3"])
    ->includeUuids(true)
    ->includeState(true)
    ->sync();
```

---

## Where Now

Get channels to which a UUID is presently subscribed.

### Method

```
$pubnub->whereNow()
    ->uuid(string)   // Optional; defaults to current client UUID
    ->sync();
```

### Usage

```php
$result = $pubnub->whereNow()->sync();
```

Server response (example):

```json
{
  "channels": ["lobby", "game01", "chat"]
}
```

Explicit UUID:

```php
$result = $pubnub->whereNow()
    ->uuid("his-uuid")
    ->sync();
```

---

## User State

Set or get custom presence state for one or more channels/channel groups.

### Set State

```
$pubnub->setState()
    ->channels(string|array)        // or ->channelGroups()
    ->channelGroups(string|array)
    ->state(array)                  // Required
    ->sync();
```

Example:

```php
$pubnub->setState()
    ->channels(["ch1", "ch2", "ch3"])
    ->state(["age" => 30])
    ->sync();
```

### Get State

```
$pubnub->getState()
    ->channels(string|array)        // or ->channelGroups()
    ->channelGroups(string|array)
    ->uuid(string)                  // Optional, defaults to current UUID
    ->sync();
```

Example:

```php
$pubnub->getState()
    ->channels(["ch1", "ch2", "ch3"])
    ->sync();
```

### Result objects

* **PNSetStateResult**
  * `getState(): array` – channel/UUID → state.

* **PNGetStateResult**
  * `getChannels(): array` – channel → state.

### Additional example

```php
$pubnub->setState()
    ->channelGroups(["gr1", "gr2", "gr3"])
    ->state(["age" => 30])
    ->sync();
```

_Last updated: Jun 16 2025_