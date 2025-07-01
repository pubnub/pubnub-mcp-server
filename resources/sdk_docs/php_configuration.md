# Configuration API – PHP SDK (condensed)

## PNConfiguration

`PNConfiguration` stores all client settings.

### Create

```
`new PNConfiguration();  
`
```

### Immutability  

The configuration becomes read-only after you pass it to `new PubNub(...)`.  
To turn this off (not recommended):

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$config = new PNConfiguration();  
$config->setPublishKey('demo');  
$config->setSubscribeKey('demo');  
$config->setUserId('demo');  
// not recommended, disables config immutability  
$config->disableImmutableCheck();  
  
$pn = new PubNub($config);  
`
```

### Parameters

* **subscribeKey** (string, required) – key from Admin Portal.  
* **publishKey** (string, default `null`) – only needed for publish.  
* **secretKey** (string, default `null`) – only for Access Manager.  
* **UserId** (string, required) – unique UTF-8 (≤92 chars).  
* **authKey** (string, default `null`) – sent with every restricted call.  
* **ssl** (bool, default `true`).  
* **connectTimeout** (int, default `10`) – seconds.  
* **subscribeTimeout** (int, default `310`) – seconds.  
* **nonSubscribeRequestTimeout** (int, default `10`) – seconds.  
* **filterExpression** (string, default `null`).  
* **origin** (string, default `ps.pndsn.com`).  
* **cipherKey** (string, default `null`).  
* **useRandomIV** (bool, default `true`).  
* **client** (`ClientInterface`, default Guzzle) – PSR-18 HTTP client.  
* **crypto** (`PubNubCryptoCore`) – custom cryptor (see below).

### Crypto module

* 8.0.2+ supports legacy (128-bit) and AES-CBC 256-bit encryption.  
* Random IV **should stay enabled** (set `useRandomIV=false` only for 4.3.0- compatibility).

```
`// 256-bit AES-CBC (recommended)  
$pnConfiguration = new PNConfiguration();  
...  
$pnConfiguration->setCrypto(CryptoModule::aesCbcCryptor("enigma", true));  
  
$pubnub = new PubNub($pnconf);  
  
// Legacy 128-bit  
$pnConfiguration = new PNConfiguration();  
...  
$pnConfiguration->setCrypto(CryptoModule::legacyCryptor("enigma", true));  
`
```

## Basic configuration example

```
`  
  
// Include Composer autoloader (adjust path if needed)  
require_once 'vendor/autoload.php';  
  
use PubNub\PNConfiguration;  
use PubNub\PubNub;  
use PubNub\CryptoModule;  
  
// Create a new configuration instance  
$pnConfiguration = new PNConfiguration();  
  
// Set subscribe key (required)  
$pnConfiguration->setSubscribeKey("demo");  
  
`
```
(show all 68 lines)

## Initialization

Add the SDK per the Getting Started guide, then:

```
`use PubNub\PubNub;  
`
```

Retrieve PEM files if you need custom TLS verification:

```
`echo Q | openssl s_client -connect pubsub.pubnub.com:443 -servername pubsub.pubnub.com -showcerts  
echo Q | openssl s_client -connect pubsub.pubnub.net:443 -servername pubsub.pubnub.net -showcerts  
echo Q | openssl s_client -connect ps.pndsn.com:443 -servername ps.pndsn.com -showcerts  
`
```

Create the client:

```
`new PubNub($pnconf);  
`
```

### Initialization examples

Standard:

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("my-key");  
$pnconf->setPublishKey("my-key");  
$pnconf->setSecure(false);  
$pnconf->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnconf);  
`
```

Non-secure, read-only, custom UUID, and Access Manager variants are unchanged:

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
$pnConfiguration->setPublishKey("my_pub_key");  
$pnConfiguration->setSecure(false);  
$pnConfiguration->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnConfiguration);  
`
```

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
  
$pubnub = new PubNub($pnConfiguration);  
`
```

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("mySubscribeKey");  
$pnconf->setPublishKey("myPublishKey");  
$pnconf->setUserId("myUniqueUserId");  
  
$pubnub = new PubNub($pnconf);  
`
```

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnConfiguration = new PNConfiguration();  
  
$pnConfiguration->setSubscribeKey("my_sub_key");  
$pnConfiguration->setPublishKey("my_pub_key");  
$pnConfiguration->setSecretKey("my_secret_key");  
$pnConfiguration->setUserId("myUniqueUserId");  
$pubnub = new PubNub($pnConfiguration);  
`
```

## Event listeners

Add / remove:

```
`use PubNub\PubNub;  
use PubNub\Enums\PNStatusCategory;  
use PubNub\Callbacks\SubscribeCallback;  
use PubNub\PNConfiguration;  
  
class MySubscribeCallback extends SubscribeCallback {  
    function status($pubnub, $status) {  
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {  
        // lost connectivity  
        } else if ($status->getCategory() === PNStatusCategory::PNConnectedCategory){  
        // connected  
        } else if ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory){  
        // decryption error  
        }  
    }  
`
```
(show all 47 lines)

```
`$subscribeCallback = new MySubscribeCallback();  
  
$pubnub->addListener($subscribeCallback);  
  
// some time later  
$pubnub->removeListener($subscribeCallback);  
`
```

Main status categories: `PNConnectedCategory`, `PNAccessDeniedCategory`, `PNTimeoutCategory`, `PNUnexpectedDisconnectCategory`, `PNCancelledCategory`, `PNMalformedResponseCategory`, `PNBadRequestCategory`, `PNDecryptionErrorCategory`, `PNUnknownCategory`.

## UserId helpers

Setter:

```
`$pnconf->setUuid(string);  
`
```

Getter:

```
`$pnconf->getUserId();  
`
```

Example:

```
`$pnconf = new PNConfiguration();  
$pnconf->setUserId("myUniqueUserId");  
`
```

```
`$pubnub->getConfiguration()  
    ->getUserId();  
`
```

## Auth Key helpers

```
`$pnconf->setAuthKey(string);  
`
```

```
`$pnconf->getAuthKey();  
`
```

Usage:

```
`$pubnub->getConfiguration()  
    ->setAuthKey("my_newauthkey");  
`
```

```
`$pubnub->getConfiguration()  
    ->getAuthKey();  
`
```

## Filter Expression (Stream Controller add-on)

Set:

```
`setFilterExpression( string filterExpression )  
`
```

Get:

```
`getFilterExpression  
`
```

Example:

```
`use PubNub\PNConfiguration;  
use PubNub\PubNub;  
  
$pnconf = new PNConfiguration();  
  
$pnconf->setSubscribeKey("my_sub_key");  
$pnconf->setFilterExpression("userid == 'my_userid'");  
  
$pubnub = new PubNub($pnconf);  
`
```

```
`$pubnub->getFilterConfiguration();**`
```

_Last updated Apr 2 2025_