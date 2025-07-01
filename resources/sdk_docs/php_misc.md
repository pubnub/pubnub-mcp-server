On this page
# Utility Methods API for PHP SDK

The methods on this page are utility methods that don't fit into other categories.

## Time[​](#time)

This function will return a 17 digit precision Unix epoch.

##### Algorithm constructing the timetoken

```
`timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example of creating a timetoken for a specific time and date:

```
`08/19/2013 @ 9:20pm in UTC = 1376961606  
timetoken = 1376961606 * 10000000  
timetoken = 13769616060000000  
`
```

### Method(s)[​](#methods)

To fetch `Time` you can use the following method(s) in PHP SDK:

```
`$pubnub->time()->sync();  
`
```

This method doesn't take any argument.

### Basic Usage[​](#basic-usage)

#### Get PubNub Timetoken[​](#get-pubnub-timetoken)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

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
show all 54 lines

### Response[​](#response)

MethodDescription`getTimetoken()`Type: IntegerReturns a `date` representation of current timetoken.Last updated on **Apr 2, 2025**