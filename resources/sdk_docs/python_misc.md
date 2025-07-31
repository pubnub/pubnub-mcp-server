# Utility Methods API – Python SDK (misc)

Essential usage, method signatures, parameters, and return types are retained below.  
All code blocks are unchanged from the source.

---

## disconnect()

Stop all current PubNub requests.

### Method
```
`disconnect()  
`
```
(No arguments)

### Example
```
`import os  
from pubnub.pnconfiguration import PNConfiguration  
from pubnub.pubnub import PubNub  
  
  
def disconnect_from_pubnub(pubnub: PubNub):  
    pubnub._subscription_manager.disconnect()  
    print("Disconnected from PubNub.")  
  
  
def main():  
    # Configuration for PubNub instance  
    pn_config = PNConfiguration()  
    pn_config.subscribe_key = os.getenv('PUBNUB_SUBSCRIBE_KEY', 'demo')  
    pn_config.user_id = os.getenv('PUBNUB_USER_ID', 'my_custom_user_id')  
`
```

---

## reconnect()

Force the SDK to restore connectivity.

### Method
```
`pubnub.reconnect()  
`
```
(No arguments)

---

## time()

Returns a 17-digit timetoken (Unix epoch × 10,000,000).

Algorithm
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

### Method
```
`pubnub.time()  
`
```

### Example
```
`envelope = pubnub.time().sync()  
`
```

### Returns – PNTimeResponse
• int – timetoken  
• str – timetoken  
• date_time – datetime representation  

(For seconds-precision use `timestamp()` → `int(time.time())`.)

---

## get_subscribed_channels()

List currently subscribed channels.

Method  
`pubnub.get_subscribed_channels()`

Example
```
`channels = pubnub.get_subscribed_channels()  
`
```

Returns
`List`
```
`["my_ch1", "my_ch2"]  
`
```

---

## get_subscribed_channel_groups()

List currently subscribed channel groups.

Method  
`pubnub.get_subscribed_channel_groups()`

Example
```
`channels = pubnub.get_subscribed_channel_groups()  
`
```

Returns
`List`
```
`["my_group1", "my_group2"]  
`
```

---

## encrypt_file()

Encrypt data.

### Method
```
`pubnub.crypto.encrypt_file(file)  
`
```
Parameter  
• `file` (bytes) – data to encrypt

Example
```
`payload_to_encrypt = 'knights_who_say_ni'  
  
encrypted_payload = pubnub.encrypt(payload_to_encrypt)  
`
```

Returns: bytes (encrypted data)

---

## decrypt_file()

Decrypt data.

### Method
```
`pubnub.crypto.decrypt_file(file)  
`
```
Parameter  
• `file` (bytes) – data to decrypt

Example
```
`decrypted_payload = pubnub.decrypt(payload_to_decrypt_in_bytes)  
`
```

Returns: bytes (decrypted data)

---

_Last updated: **Jul 15, 2025**_