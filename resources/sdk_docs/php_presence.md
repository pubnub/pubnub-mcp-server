# Presence API – PHP SDK (Condensed)

Presence must be enabled for your keys in the Admin Portal.  
Cache: `hereNow()` responses are cached for 3 s.

---

## Here Now

Obtain current occupancy, UUID list, and optional state for channels or channel groups.

### Method

```
$pubnub->hereNow()  
    ->channels(string|array)          // target channels  
    ->channelGroups(string|array)     // or channel groups  
    ->includeState(boolean) = false   // return user state  
    ->includeUuids(boolean) = true    // return UUID list  
    ->sync();
```

### Sample Code (bootstrap)

```
  
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
$pnConfig->setUserId("php-presence-demo-user");  
```

### Examples

Return UUIDs + state:

```
$result = $pubnub->hereNow()  
                ->channels("my_channel")  
                ->includeUuids(true)  
                ->includeState(true)  
                ->sync();  
```

Example response (truncated):

```
PubNub\Models\Consumer\Presence\PNHereNowResult Object(  
    [totalChannels:protected] => 2  
    [totalOccupancy:protected] => 3  
    [channels:protected] => Array(  
        [0] => PubNub\Models\Consumer\Presence\PNHereNowChannelData Object(  
            [channelName:protected] => ch1  
            [occupancy:protected] => 1  
            [occupants:protected] => Array( ... )  
        )  
...
```

Occupancy only:

```
$result = $pubnub->hereNow()  
                ->channels("my_channel")  
                ->includeUuids(false)  
                ->includeState(false)  
                ->sync();  
```

Channel groups:

```
$pubnub->hereNow()  
    ->channelGroups(["cg1", "cg2", "cg3"])  
    ->includeUuids(true)  
    ->includeState(true)  
    ->sync();  
```

Response (truncated):

```
(  
    [totalChannels:protected] => 1  
    [totalOccupancy:protected] => 4  
    [channels:protected] => Array( ... )  
...
```

### Return Objects

PNHereNowResult  
• getTotalChannels(): int  
• getTotalOccupancy(): int  
• getChannels(): PNHereNowChannelData[]

PNHereNowChannelData  
• getChannelName(): string  
• getOccupancy(): int  
• getOccupants(): PNHereNowOccupantData[]

PNHereNowOccupantData  
• getUuid(): string  
• getState(): array

---

## Where Now

List channels to which a UUID is currently subscribed.

### Method

```
$pubnub->whereNow()  
    ->uuid(string)        // optional, defaults to current user  
    ->sync();
```

### Examples

```
$result = $pubnub->whereNow()->sync();
```

```
$result = $pubnub->whereNow()  
                ->uuid("his-uuid")  
                ->sync();  
```

Response:

```
{  
    "channels": [ "lobby", "game01", "chat" ]  
}
```

Note: No timeout event occurs if the client restarts within the heartbeat window.

---

## User State

Set or retrieve a custom state (JSON) for a UUID on channels/channel-groups.  
State is transient and disappears when the client disconnects.

### Set State

```
$pubnub->setState()  
    ->channels(string|array)          // or  
    ->channelGroups(string|array)  
    ->state(array)                    // associative array  
    ->sync();
```

### Get State

```
$pubnub->getState()  
    ->channels(string|array)          // or  
    ->channelGroups(string|array)  
    ->uuid(string)                    // optional, defaults to current user  
    ->sync();
```

### Examples

Set state on channels:

```
$pubnub->setState()  
    ->channels(["ch1", "ch2", "ch3"])  
    ->state(["age" => 30])  
    ->sync();  
```

Get state:

```
$pubnub->getState()  
    ->channels(["ch1", "ch2", "ch3"])  
    ->sync();  
```

Set state on channel groups:

```
$pubnub->setState()**    ->channelGroups(["gr1", "gr2", "gr3"])  
    ->state(["age" => 30])  
    ->sync();  
```

### Return Objects

PNSetStateResult  
• setState(): array     // map of UUID → state

PNGetStateResult  
• getChannels(): array  // map of channel → state