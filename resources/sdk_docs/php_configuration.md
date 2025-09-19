# PubNub PHP SDK – Configuration Quick Reference

## PNConfiguration

### Create a configuration object
```php
new PNConfiguration();
```

### Core properties

| Property | Type | Default | Notes |
| -------- | ---- | ------- | ----- |
| subscribeKey **(required)** | string | n/a | Key from Admin Portal. |
| publishKey | string \| null | null | Only required for `publish`. |
| secretKey | string \| null | null | Only required for PAM. |
| userId **(required)** | string | n/a | UTF-8, ≤ 92 chars. |
| authKey | string \| null | null | Used in PAM requests. |
| ssl | bool | true | Set `false` for non-TLS. |
| connectTimeout | int | 10 | Seconds. |
| subscribeTimeout | int | 310 | Seconds. |
| nonSubscribeRequestTimeout | int | 10 | Seconds. |
| filterExpression | string \| null | null | Stream Controller filter. |
| origin | string | ps.pndsn.com | Custom domain if requested. |
| cipherKey | string \| null | null | Enables encryption. |
| useRandomIV | bool | true | Disable only for legacy (< 4.3.0). |
| client | ClientInterface | Guzzle | Custom PSR-18 HTTP client. |
| crypto | PubNubCryptoCore | n/a | See “Crypto Module”. |

### Immutable configuration
```php
use PubNub\PNConfiguration;
use PubNub\PubNub;

$config = new PNConfiguration();
$config->setPublishKey('demo');
$config->setSubscribeKey('demo');
$config->setUserId('demo');
// NOT recommended – disables immutability
$config->disableImmutableCheck();

$pn = new PubNub($config);
```

---

## Crypto module

```php
// 256-bit AES-CBC (recommended) – decrypts both ciphers
$pnConfiguration = new PNConfiguration();
...
$pnConfiguration->setCrypto(CryptoModule::aesCbcCryptor("enigma", true));
$pubnub = new PubNub($pnconf);

// Legacy 128-bit cipher – decrypts both ciphers
$pnConfiguration = new PNConfiguration();
...
$pnConfiguration->setCrypto(CryptoModule::legacyCryptor("enigma", true));
```
Apps < 8.0.2 can’t decrypt AES-CBC. Keep `useRandomIV = true` for new apps.

---

## Initialization

```php
use PubNub\PNConfiguration;
use PubNub\PubNub;

$pnconf = new PNConfiguration();
$pnconf->setSubscribeKey("my-key");
$pnconf->setPublishKey("my-key");
$pnconf->setSecure(false);
$pnconf->setUserId("myUniqueUserId");

$pubnub = new PubNub($pnconf);
```

Alternative setups  
(non-secure, read-only, custom `UserId`, Access Manager):

```php
// Non-secure
$cfg = new PNConfiguration();
$cfg->setSubscribeKey("sub");
$cfg->setPublishKey("pub");
$cfg->setSecure(false);
$cfg->setUserId("uid");
$pubnub = new PubNub($cfg);

// Read-only
$cfg = new PNConfiguration();
$cfg->setSubscribeKey("sub");
$pubnub = new PubNub($cfg);

// Access-Manager (server)
$cfg = new PNConfiguration();
$cfg->setSubscribeKey("sub");
$cfg->setPublishKey("pub");
$cfg->setSecretKey("sec");
$cfg->setUserId("uid");
$pubnub = new PubNub($cfg);
```

---

## Event listeners

Add listener
```php
use PubNub\PubNub;
use PubNub\Enums\PNStatusCategory;
use PubNub\Callbacks\SubscribeCallback;

class MySubscribeCallback extends SubscribeCallback {
    function status($pubnub, $status) {
        if ($status->getCategory() === PNStatusCategory::PNUnexpectedDisconnectCategory) {
            // lost connectivity
        } elseif ($status->getCategory() === PNStatusCategory::PNConnectedCategory){
            // connected
        } elseif ($status->getCategory() === PNStatusCategory::PNDecryptionErrorCategory){
            // decryption error
        }
    }
}
```

Remove listener
```php
$cb = new MySubscribeCallback();
$pubnub->addListener($cb);

// later
$pubnub->removeListener($cb);
```

---

## Helpers

### UserId
```php
// set
$pnconf->setUuid(string);

// get
$pnconf->getUserId();

// example
$pnconf = new PNConfiguration();
$pnconf->setUserId("myUniqueUserId");
```
```php
$pubnub->getConfiguration()->getUserId();
```

### Auth key
```php
// set
$pnconf->setAuthKey(string);

// get
$pnconf->getAuthKey();
```
```php
$pubnub->getConfiguration()->setAuthKey("my_newauthkey");
$pubnub->getConfiguration()->getAuthKey();
```

### Filter expression (Stream Controller)
```php
// set
setFilterExpression(string $filterExpression);

// get
getFilterExpression();
```
```php
use PubNub\PNConfiguration;
use PubNub\PubNub;

$cfg = new PNConfiguration();
$cfg->setSubscribeKey("sub");
$cfg->setFilterExpression("userid == 'my_userid'");
$pubnub = new PubNub($cfg);
```
```php
$pubnub->getFilterConfiguration();
```

---

## TLS certificates (optional)
```bash
echo Q | openssl s_client -connect pubsub.pubnub.com:443 -servername pubsub.pubnub.com -showcerts
echo Q | openssl s_client -connect pubsub.pubnub.net:443 -servername pubsub.pubnub.net -showcerts
echo Q | openssl s_client -connect ps.pndsn.com:443 -servername ps.pndsn.com -showcerts
```
Set `verify_peer = true` when using custom PEM files.

---

### Constructing the client
```php
new PubNub($pnconf);   // returns a PubNub instance ready for API calls
```