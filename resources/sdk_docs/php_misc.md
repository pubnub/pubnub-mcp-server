# Utility Methods API (PHP SDK)

## Time

Returns a 17-digit Unix epoch–based timetoken.

Algorithm constructing the timetoken
```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```
Example
```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method(s)

Retrieve current timetoken:
```
`$pubnub->time()->sync();  
`
```
(No arguments)

### Basic Usage

#### Get PubNub Timetoken

Reference code
```
`  
  
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
  
`
```
(show all 54 lines)

### Response

Method          | Description
--------------- | ---------------------------------------------------------------
`getTimetoken()`| Integer. `date` representation of current timetoken.

Last updated on **Apr 2, 2025**