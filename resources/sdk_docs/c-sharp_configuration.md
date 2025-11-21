# Configuration API for C# SDK

C# API reference for configuring PubNub behavior. Keep exceptions handling in place and always set a UserId.

##### Request execution

Use try/catch for C# SDK operations. Invalid parameters throw exceptions. Server/network errors are in returned status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9
  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  

```

## Configuration

PNConfiguration stores settings controlling SDK behavior.

### Method(s)

To create configuration instance:

```
1
  

```

Required and optional parameters:

- SubscribeKey (Type: string) Required. SubscribeKey from Admin Portal.
- PublishKey (Type: string) PublishKey from Admin Portal (required if publishing).
- SecretKey (Type: string) Required for access control operations. Server-side only. Grants root permissions for Access Manager.
- UserId (Type: UserId) Required. Unique UTF-8 string (<= 92 alphanumeric chars) identifying user/device. If unset, you can’t connect.
- LogLevel (Type: PubnubLogLevel) Logging level. Values: Trace, Debug, Info, Warn, Error. Default: None. See Logging.
- AuthKey (Type: string) Used for Access Manager restricted requests.
- Secure (Type: bool) Enable SSL/TLS.
- SubscribeTimeout (Type: int) Subscribe loop timeout (seconds).
- NonSubscribeRequestTimeout (Type: int) Request timeout for non-subscribe operations (seconds).
- FilterExpression (Type: string) Subscribe with a custom filter expression.
- HeartbeatNotificationOption (Type: PNHeartbeatNotificationOption) Heartbeat notifications. Default: FAILURES. Options: ALL, NONE.
- Origin (Type: string) Custom domain. Contact support to request a custom domain.
- ReconnectionPolicy (Type: PNReconnectionPolicy) Subscribe reconnection strategy. Default: EXPONENTIAL. Options: NONE, LINEAR, EXPONENTIAL.
- ConnectionMaxRetries (Type: int) Max reconnection attempts. If unset, no reconnect.
- PresenceTimeout (Type: int) Presence liveness timeout (seconds). Heartbeats sent periodically; timeout emits “timeout” on presence channel.
- SetPresenceTimeoutWithCustomInterval (Type: int) Heartbeat interval. Recommended: (PresenceTimeout / 2) - 1.
- Proxy (Type: Proxy) Use an HTTP proxy for PubNub traffic.
- RequestMessageCountThreshold (Type: Number) Threshold for messages per payload; exceeding triggers PNRequestMessageCountExceededCategory.
- SuppressLeaveEvents (Type: bool) If true, do not send leave requests.
- DedupOnSubscribe (Type: bool) If true, filters duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (Type: int) Cache size used with DedupOnSubscribe. Default: 100.
- FileMessagePublishRetryLimit (Type: int) Retries for file message publish failures. Default: 5.
- CryptoModule (Type: AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)) Module for encrypting/decrypting messages/files. Pass CipherKey here. See CryptoModule.
- EnableEventEngine (Type: Boolean) Default: true. Uses standardized workflows for subscribe/presence and status events.
- MaintainPresenceState (Type: Boolean) Works only when EnableEventEngine = true. Resends custom presence state set via pubnub.setPresenceState() on each subscribe.
- RetryConfiguration (Type: RetryConfiguration) When EnableEventEngine = true. Custom reconnection: 
  - RetryConfiguration.Linear(int delayInSecond, int maxRetry)
  - RetryConfiguration.Exponential(int minDelayInSecond, int maxDelayInSecond, int maxRetry)
  Excluding endpoints not supported.
- LogVerbosity (Type: PNLogVerbosity) Deprecated; use LogLevel. BODY to enable debugging, NONE to disable.
- PubnubLog (Type: IPubnubLog) Deprecated; use SetLogger with IPubnubLogger instead.
- CipherKey (Type: string) Deprecated; pass to CryptoModule instead. If set, all communications are encrypted.
- UseRandomInitializationVector (Type: bool) Deprecated; pass to CryptoModule instead. Default false. When true, random IV for all requests (not just file upload).
- Uuid (Type: string) Deprecated; use UserId instead. Required to connect if using legacy UUID.

#### CryptoModule

CryptoModule encrypts/decrypts messages/files. From 6.18.0 onward, supports legacy 128-bit or recommended 256-bit AES-CBC.

- If CryptoModule not set but CipherKey/UseRandomInitializationVector are set in configuration, client defaults to legacy encryption.
- See Encryption page for config and utility methods.

##### Legacy encryption with 128-bit cipher key entropy

No changes needed to keep legacy encryption. Set AesCbcCryptor explicitly to use recommended 256-bit AES-CBC.

### Sample code

##### Reference code
Self-contained example with imports and console logging. Use as reference for other examples.

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

## Initialization

#### Include the code

```
1
  

```

### Description

Initialize PubNub and set credentials like PublishKey and SubscribeKey.

### Method(s)

To Initialize PubNub:

```
1
  

```

- pnConfiguration (Type: PNConfiguration) See Configuration.

### Sample code

#### Initialize the PubNub client API

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

### Returns

PubNub instance for APIs like Publish(), Subscribe(), History(), HereNow().

### Other examples

#### Initialize a non-secure client

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

#### Initialization for a Read-Only client

Omit PublishKey when client only reads.

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

#### Initializing with SSL enabled

Set Secure = true to enable TLS.

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

##### Requires Access Manager add-on

Enable Access Manager in the Admin Portal to use related features.

##### Secure your secretKey

SecretKey grants permission control. Never expose it; use only on secure server-side platforms. When initialized with SecretKey, servers have full access to all channels.

For apps administering Access Manager permissions:

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

After initialization with SecretKey, client can access Access Manager functions and signs messages with SecretKey.

## Event listeners

- PubNub client: updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription: updates for its specific entity.
- SubscriptionsSet: updates for a set of subscription objects.

See Publish & Subscribe for details on subscribing and handlers.

## UserId

Set or get the user ID at runtime.

### Property(s)

To set/get UserId:

```
1
  

```

- UserId (Type: string) Identifier for the device/user. Required to connect.

```
`1pubnub.GetCurrentUserId();  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

#### Get user ID

```
1
  

```

## Authentication key

Set and get the user authentication key.

### Property(s)

```
`1pnConfiguration.AuthKey  
`
```

- AuthKey (Type: string) Used for Access Manager restricted requests.

This method doesn't take any arguments.

### Sample code

#### Set auth key

```
1
  

```

#### Get auth key

```
1
  

```

### Returns

Get Auth key returns the current authentication key.

## Filter expression

##### Requires Stream Controller add-on

Enable Stream Controller in the Admin Portal. Stream filtering delivers only messages matching a filter expression.

Use this property to set/get message filters. See Publish Messages.

### Property(s)

```
`1FilterExpression  
`
```

- FilterExpression (Type: string) PSV2 filter expression for Subscribe.

```
`1pnConfiguration.FilterExpression;  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID
Always set a persistent UserId. If not set, you cannot connect.

```
1
  

```

#### Get filter expression

```
1
**
```
Last updated on Sep 3, 2025**