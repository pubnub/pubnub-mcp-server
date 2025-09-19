# Utility Methods API – PHP SDK (Misc)

## Time

Returns the current PubNub timetoken (17-digit Unix epoch in 10-microsecond units).

Algorithm  
```
timetoken = (Unix epoch time in seconds) * 10000000
```

Example  
```
08/19/2013 @ 9:20 PM UTC
Unix epoch  = 1376961606
timetoken   = 1376961606 * 10000000
           = 13769616060000000
```

### Method

```php
$pubnub->time()->sync();
```
• No arguments  
• Returns `int` timetoken

### Sample

```php
// Include Composer autoloader (adjust path if needed)
require_once 'vendor/autoload.php';

use PubNub\PNConfiguration;
use PubNub\PubNub;
use PubNub\Exceptions\PubNubServerException;

// Create configuration with demo keys
$pnConfig = new PNConfiguration();
$pnConfig->setSubscribeKey("demo");
$pnConfig->setPublishKey("demo");
$pnConfig->setUserId("php-time-example-user");
```

### Response

| Method          | Return type | Description                 |
|-----------------|-------------|-----------------------------|
| `getTimetoken()`| `int`       | Current PubNub timetoken |

_Last updated: Jul 15 2025_