# Configuration API for C# SDK

C# API reference for configuring the PubNub client. Includes essential settings, method/property signatures, parameters, defaults, and code blocks as provided.

##### Request execution

Use try/catch. Invalid parameters throw an exception. Server/network failures return a status in the result.

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

Note: UserId is required to connect. Persist a unique user/device identifier for the lifetime of the user/device.

## Configuration

PNConfiguration stores user-provided settings to control SDK behavior.

### Method(s)

To create a configuration instance:

```
1
  
```

Configuration parameters:

- SubscribeKey (Type: string) Required. From Admin Portal.
- PublishKey (Type: string) From Admin Portal. Required if publishing.
- SecretKey (Type: string) Required for Access Manager operations. Use server-side only.
- UserId (Type: UserId) Required. Unique UTF-8 string up to 92 alphanumeric chars. Construct with string.
- LogLevel (Type: PubnubLogLevel) Logging level. Default: PubnubLogLevel.None.
  - Values: PubnubLogLevel.Trace | Debug | Info | Warn | Error | None
  - See Logging.
- AuthKey (Type: string) Used for Access Manager restricted requests.
- Secure (Type: bool) Enable SSL/TLS.
- SubscribeTimeout (Type: int) Subscribe loop timeout (seconds).
- NonSubscribeRequestTimeout (Type: int) Non-subscribe request timeout (seconds).
- FilterExpression (Type: string) Subscribe with a custom filter expression (Stream Controller required).
- HeartbeatNotificationOption (Type: PNHeartbeatNotificationOption) Presence heartbeat notifications. Default: FAILURES.
  - Values: PNHeartbeatNotificationOption.ALL | FAILURES | NONE
- Origin (Type: string) Custom origin/domain. Contact support to request a custom domain.
- ReconnectionPolicy (Type: PNReconnectionPolicy) Subscribe reconnection policy. Default: EXPONENTIAL (subscribe only).
  - Values: PNReconnectionPolicy.NONE | LINEAR | EXPONENTIAL
- ConnectionMaxRetries (Type: int) Max reconnection attempts. If unset, no reconnect.
- PresenceTimeout (Type: int) Presence timeout (seconds). If no heartbeat within timeout, client marked inactive and “timeout” event emitted.
- SetPresenceTimeoutWithCustomInterval (Type: int) Heartbeat interval (seconds). Recommended: (PresenceTimeout / 2) - 1.
- Proxy (Type: Proxy) Configure HTTP proxy for PubNub traffic.
- RequestMessageCountThreshold (Type: Number) Payload message count threshold; exceeding triggers PNRequestMessageCountExceededCategory.
- SuppressLeaveEvents (Type: bool) When true, do not send leave on unsubscribe/shutdown.
- DedupOnSubscribe (Type: bool) De-duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (Type: int) Used with DedupOnSubscribe. Default: 100.
- FileMessagePublishRetryLimit (Type: int) Retries for file message publish failures. Default: 5.
- CryptoModule (Type: AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)) Encryption module for messages/files. Pass CipherKey.
  - See CryptoModule section.
- EnableEventEngine (Type: Boolean) Default: true. Use standardized workflows for subscribe/presence and standardized status events.
- MaintainPresenceState (Type: Boolean) Works only when EnableEventEngine = true. Resend custom presence state set via pubnub.setPresenceState().
- RetryConfiguration (Type: RetryConfiguration) When enableEventEngine = true:
  - RetryConfiguration.Linear(int delayInSecond, int maxRetry)
  - RetryConfiguration.Exponential(int minDelayInSecond, int maxDelayInSecond, int maxRetry)
  - Excluding endpoints not supported.
- LogVerbosity (Type: PNLogVerbosity) Deprecated; use LogLevel. PNLogVerbosity.BODY to enable debugging; PNLogVerbosity.NONE to disable.
- PubnubLog (Type: IPubnubLog) Deprecated; use SetLogger with IPubnubLogger.
- CipherKey (Type: string) Deprecated; pass via CryptoModule. If set, all payloads encrypted.
- UseRandomInitializationVector (Type: bool) Deprecated; pass via CryptoModule. Default false; true => random IV for all requests.
- Uuid (Type: string) Deprecated; use UserId.

#### CryptoModule

Encrypts/decrypts messages and files. Since 6.18.0, supports:
- Legacy 128-bit encryption (LegacyCryptor)
- Recommended 256-bit AES-CBC (AesCbcCryptor)

If CryptoModule is not set but CipherKey/UseRandomInitializationVector are set in config, legacy encryption is used by default.

For detailed usage, see Encryption.

##### Legacy encryption with 128-bit cipher key entropy

You can keep legacy encryption. To use 256-bit AES-CBC, explicitly set AesCbcCryptor in config.

### Sample code

##### Reference code
Self-contained example with imports and console logging.

##### Required User ID

Always set the UserId.

```
1
  
```

## Initialization

#### Include the code

```
1
  
```

### Description

Initialize the PubNub client with credentials such as PublishKey and SubscribeKey.

### Method(s)

Initialize PubNub with:

```
1
  
```

- pnConfiguration (Type: PNConfiguration) Required. See Configuration.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set the UserId.

```
1
  
```

### Returns

A PubNub instance for APIs like Publish(), Subscribe(), History(), HereNow().

### Other examples

#### Initialize a non-secure client

```
1
  
```

#### Initialization for a Read-Only client

Omit PublishKey when publishing is not needed.

```
1
  
```

#### Initializing with SSL enabled

Set Secure = true.

```
1
  
```

##### Requires Access Manager add-on

Enable Access Manager in the Admin Portal.

##### Secure your secretKey

Never expose SecretKey; use server-side only. Initializing with SecretKey grants root Access Manager permissions.

For administering Access Manager permissions:

##### Required User ID

```
1
  
```

After initializing with SecretKey, the client can access Access Manager functions and signs messages with SecretKey.

## Event listeners

- PubNub client: updates from all subscriptions.
- Subscription: updates for a specific channel, channel group, channel metadata, or user.
- SubscriptionsSet: updates for a list of subscription objects.

See Publish & Subscribe for adding handlers per entity.

## UserId

Set or get the user ID at runtime.

### Property(s)

Set/get UserId using:

```
1
  
```

- UserId (Type: string) Device/user identifier. Required.

```
`1pubnub.GetCurrentUserId();  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

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

Requires Stream Controller add-on. Filters incoming messages server-side based on a client-provided expression.

Use the following property to set/get message filters.

### Property(s)

```
`1FilterExpression  
`
```

- FilterExpression (Type: string) PSV2 custom subscribe filter expression.

```
`1pnConfiguration.FilterExpression;  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

```
1
  
```

#### Get filter expression

```
1
**```