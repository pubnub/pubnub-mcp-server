# Utility Methods – Python SDK (Misc)

## disconnect()
Force-stop all PubNub requests (active subscriptions only).

Method
```
`disconnect()  
`
```
Arguments: none.

Example
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
Re-establish PubNub connectivity.

Method
```
`pubnub.reconnect()  
`
```
Arguments: none.

---

## time()
Returns a 17-digit Unix epoch timetoken.

Timetoken formula
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

Method
```
`pubnub.time()  
`
```

Fetch token
```
`envelope = pubnub.time().sync()  
`
```

Return (`PNTimeResponse`)
• int – current timetoken as int  
• str – current timetoken as str  
• date_time – current timetoken as date  

(Do not confuse with `timestamp()` which is `int(time.time())`.)

---

## get_subscribed_channels()
List current channel subscriptions.

Method: `pubnub.get_subscribed_channels()`

Example
```
`channels = pubnub.get_subscribed_channels()  
`
```
Returns
```
`["my_ch1", "my_ch2"]  
`
```

---

## get_subscribed_channel_groups()
List current channel-group subscriptions.

Method: `pubnub.get_subscribed_channel_groups()`

Example
```
`channels = pubnub.get_subscribed_channel_groups()  
`
```
Returns
```
`["my_group1", "my_group2"]  
`
```

---

## encrypt_file()
Encrypt binary data.

Method
```
`pubnub.crypto.encrypt_file(file)  
`
```
Parameter  
• `file` (bytes) – data to encrypt.

Example
```
`payload_to_encrypt = 'knights_who_say_ni'  
  
encrypted_payload = pubnub.encrypt(payload_to_encrypt)  
`
```
Returns: bytes (encrypted).

---

## decrypt_file()
Decrypt binary data.

Method
```
`pubnub.crypto.decrypt_file(file)  
`
```
Parameter  
• `file` (bytes) – data to decrypt.

Example
```
`decrypted_payload = pubnub.decrypt(payload_to_decrypt_in_bytes)  
`
```
Returns: bytes (decrypted).