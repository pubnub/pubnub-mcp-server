# Configuration API for C# SDK

C# API reference for configuring the PubNub client.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions. Server/network errors are returned in status.

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

PNConfiguration stores settings that control SDK behavior.

Important:
- Always set UserId (UTF-8 up to 92 alphanumeric chars). If not set, you cannot connect.

### Method(s)

To create configuration instance:

```
1
  

```

PNConfiguration properties:

- SubscribeKey (string) required. From Admin Portal.
- PublishKey (string) required if publishing. From Admin Portal.
- SecretKey (string) required for Access Manager operations. Server-side only.
- UserId (UserId) required. Pass string identifier for user/device (persist and keep stable).
- LogLevel (PubnubLogLevel) logging level. Values: Trace, Debug, Info, Warn, Error. Default: None (off). See Logging.
- AuthKey (string) used for restricted requests when Access Manager is enabled.
- Secure (bool) enable SSL/TLS.
- SubscribeTimeout (int) subscribe loop timeout (seconds).
- NonSubscribeRequestTimeout (int) timeout for non-subscribe operations (seconds).
- FilterExpression (string) server-side message filter for subscribe.
- HeartbeatNotificationOption (PNHeartbeatNotificationOption) heartbeat notifications. Default: FAILURES. Options: ALL, NONE.
- Origin (string) custom domain. Contact support for custom domain request process.
- ReconnectionPolicy (PNReconnectionPolicy) reconnection behavior for subscribe. Default: EXPONENTIAL. Options: NONE, LINEAR, EXPONENTIAL.
- ConnectionMaxRetries (int) max reconnection attempts; if unset, no reconnect.
- PresenceTimeout (int) how long the server considers the client alive. Heartbeats keep client active; on timeout, presence “timeout” event is emitted.
- SetPresenceTimeoutWithCustomInterval (int) heartbeat interval (seconds). Recommended: (PresenceTimeout / 2) - 1.
- Proxy (Proxy) use a proxy configuration.
- RequestMessageCountThreshold (Number) threshold for messages per payload; exceeding triggers PNRequestMessageCountExceededCategory.
- SuppressLeaveEvents (bool) when true, SDK doesn’t send leave requests.
- DedupOnSubscribe (bool) filter duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (int) used with DedupOnSubscribe. Default: 100.
- FileMessagePublishRetryLimit (int) retries for file message publish failures. Default: 5.
- CryptoModule (AesCbcCryptor(CipherKey) | LegacyCryptor(CipherKey)) encryption for messages/files. Pass CipherKey to constructor. See CryptoModule.
- EnableEventEngine (Boolean) default: true. Enable standardized workflows for subscribe/presence and related statuses.
- MaintainPresenceState (Boolean) requires EnableEventEngine = true. Send custom presence state on each subscribe.
- RetryConfiguration (RetryConfiguration) requires enableEventEngine = true. Options:
  - RetryConfiguration.Linear(int delayInSecond, int maxRetry)
  - RetryConfiguration.Exponential(int minDelayInSecond, int maxDelayInSecond, int maxRetry)
  Excluding endpoints is not supported.
- LogVerbosity (PNLogVerbosity) deprecated; use LogLevel. BODY enables debug; NONE disables.
- PubnubLog (IPubnubLog) deprecated; use SetLogger with IPubnubLogger.
- CipherKey (string) deprecated; pass to CryptoModule instead. If set, encrypts all communications.
- UseRandomInitializationVector (bool) deprecated; pass via CryptoModule. When true, random IV for all requests (not just file upload). Default: false.
- Uuid (string) deprecated; use UserId instead. Required to connect if used.

#### CryptoModule

CryptoModule encrypts/decrypts messages and files. From 6.18.0, algorithms are configurable.

- Options: legacy 128-bit and recommended 256-bit AES-CBC.
- If CryptoModule isn’t explicitly set and CipherKey/UseRandomInitializationVector are set in config, the client defaults to legacy encryption.
- To use 256-bit AES-CBC, explicitly set AesCbcCryptor(CipherKey).

### Sample code

##### Reference code
Self-contained runnable snippet with imports and console logging.

##### Required User ID

```
1
  

```

## Initialization

#### Include the code

```
1
  

```

### Description

Initialize the PubNub client with credentials like PublishKey and SubscribeKey.

### Method(s)

Initialize PubNub:

```
1
  

```

- pnConfiguration (PNConfiguration) required. See Configuration.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

```
1
  

```

### Returns

A PubNub instance for APIs like Publish(), Subscribe(), History(), and HereNow().

### Other examples

#### Initialize a non-secure client

##### Required User ID

```
1
  

```

#### Initialization for a Read-Only client

Omit PublishKey if the client only reads and never publishes.

##### Required User ID

```
1
  

```

#### Initializing with SSL enabled

Set Secure = true to enable TLS.

##### Required User ID

```
1
  

```

##### Requires Access Manager add-on

Enable Access Manager for your key in the Admin Portal.

##### Secure your secretKey

SecretKey grants root permissions for Access Manager. Keep it server-side and secure.

For administering Access Manager permissions, initialize with SecretKey:

##### Required User ID

```
1
  

```

After initialization with SecretKey, the client can access Access Manager functions and signs messages with SecretKey.

## Event listeners

- PubNub client: updates from all subscriptions (channels, groups, metadata, users).
- Subscription: updates for its specific entity.
- SubscriptionsSet: updates for its list of subscription objects.

See Publish & Subscribe for details.

## UserId

Set or get the user ID at runtime.

### Property(s)

```
1
  

```

- UserId (string) device/user identifier. Required to connect.

```
`1pubnub.GetCurrentUserId();  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID

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

- AuthKey (string) used for restricted requests with Access Manager.

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

Requires Stream Controller add-on. Server applies filter to deliver only matching messages.

### Property(s)

```
`1FilterExpression  
`
```

- FilterExpression (string) PSV2 custom subscribe filter.

```
`1pnConfiguration.FilterExpression;  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID

```
1
  

```

#### Get filter expression

```
1
**
```
Last updated on Sep 3, 2025**