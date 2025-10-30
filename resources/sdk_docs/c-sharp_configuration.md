# Configuration API for C# SDK

C# complete API reference for building real-time applications on PubNub, including basic usage and sample code.

##### Request execution

Use `try`/`catch` when working with the C# SDK.

If a request has invalid parameters (for example, a missing required field), the SDK throws an exception. If the request reaches the server but fails (server error or network issue), the error details are available in the returned `status`.

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

`PNConfiguration` stores user-provided settings that control SDK behavior.

### Method(s)

To create `configuration` instance you can use the following function in the C# SDK:

```
1
  

```

Required and commonly used properties:
- SubscribeKey (Type: string) Subscribe key from Admin Portal.
- PublishKey (Type: string) Publish key from Admin Portal (required if publishing).
- SecretKey (Type: string) Required for access control operations (server-side only).
- UserId (Type: UserId) Required to connect; unique device/user identifier. `UserId` takes a string (UTF-8, up to 92 alphanumeric characters).
- LogLevel (Type: PubnubLogLevel) Logging verbosity. Values: Trace, Debug, Info, Warn, Error. Default: None. See Logging.
- AuthKey (Type: string) Used for Access Manager–restricted requests.
- Secure (Type: bool) Enable SSL/TLS.
- SubscribeTimeout (Type: int, seconds) Subscribe loop timeout.
- NonSubscribeRequestTimeout (Type: int, seconds) Timeout for non-subscribe operations.
- FilterExpression (Type: string) Custom server-side subscribe filter expression.
- HeartbeatNotificationOption (Type: PNHeartbeatNotificationOption) Presence heartbeat notifications. Default: FAILURES. Options: ALL, NONE.
- Origin (Type: string) Custom origin/domain. Contact support to request a custom domain.
- ReconnectionPolicy (Type: PNReconnectionPolicy) Subscribe reconnection strategy. Default: EXPONENTIAL. Options: NONE, LINEAR, EXPONENTIAL.
- ConnectionMaxRetries (Type: int) Max reconnection attempts. If unset, SDK does not reconnect.
- PresenceTimeout (Type: int) Presence timeout; server marks client inactive if no heartbeats within this window.
- SetPresenceTimeoutWithCustomInterval (Type: int) Heartbeat interval. Recommended: `(PresenceTimeout / 2) - 1`.
- Proxy (Type: Proxy) Use a proxy configuration for PubNub requests.
- RequestMessageCountThreshold (Type: Number) Max messages per payload; exceeding triggers PNRequestMessageCountExceededCategory.
- SuppressLeaveEvents (Type: bool) When true, do not send leave requests.
- DedupOnSubscribe (Type: bool) Filter duplicate subscribe messages across regions.
- MaximumMessagesCacheSize (Type: int) Cache size for de-duplication. Default: 100.
- FileMessagePublishRetryLimit (Type: int) Retries for file message publish failures. Default: 5.
- CryptoModule (Type: AesCbcCryptor(CipherKey) or LegacyCryptor(CipherKey)) Configure message/file encryption. See CryptoModule.
- EnableEventEngine (Type: Boolean) Default: true. Use standardized workflows for subscribe/presence and related statuses.
- MaintainPresenceState (Type: Boolean) Works only when EnableEventEngine = true. Resend custom presence state with each subscribe call.
- RetryConfiguration (Type: RetryConfiguration) When EnableEventEngine = true. Options: Linear(int delayInSecond, int maxRetry), Exponential(int minDelayInSecond, int maxDelayInSecond, int maxRetry). Excluding endpoints not supported.
- LogVerbosity (Type: PNLogVerbosity) Deprecated; use LogLevel instead. BODY to enable debugging, NONE to disable.
- PubnubLog (Type: IPubnubLog) Deprecated; use SetLogger with IPubnubLogger instead.
- CipherKey (Type: string) Deprecated; configure via CryptoModule instead. If set, traffic is encrypted.
- UseRandomInitializationVector (Type: bool) Deprecated; configure via CryptoModule instead. Default false.
- Uuid (Type: string) Deprecated; use UserId instead.

#### CryptoModule

`CryptoModule` encrypts and decrypts messages and files. From 6.18.0 onward, you can configure the algorithms it uses.

- Options included: legacy 128-bit encryption and recommended 256-bit AES-CBC.
- If `CryptoModule` is not explicitly set and `CipherKey`/`UseRandomInitializationVector` are set in config, the client defaults to legacy encryption.
- To use 256-bit AES-CBC, explicitly set `AesCbcCryptor(CipherKey)` in `CryptoModule`.

For detailed configuration and utility methods, see the Encryption page.

##### Legacy encryption with 128-bit cipher key entropy

You can continue using legacy encryption without changes. To switch to 256-bit AES-CBC, set it explicitly in config.

### Sample code

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

## Initialization

#### Include the code

```
1
  

```

### Description

Initialize the PubNub client and set credentials such as `PublishKey` and `SubscribeKey`.

### Method(s)

To `Initialize` PubNub you can use the following method(s) in the C# SDK:

```
1
  

```

- pnConfiguration (Type: PNConfiguration) See Configuration for details.

### Sample code

#### Initialize the PubNub client API

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

### Returns

Returns a PubNub instance for APIs like `Publish()`, `Subscribe()`, `History()`, and `HereNow()`.

### Other examples

#### Initialize a non-secure client

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

#### Initialization for a Read-Only client

Omit `PublishKey` for read-only clients.

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

#### Initializing with SSL enabled

Set `Secure = true` to enable TLS/SSL.

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

##### Requires Access Manager add-on

Requires the Access Manager add-on enabled for your key.

##### Secure your secretKey

- Treat `SecretKey` as sensitive; never expose it to clients.
- Initialize with `SecretKey` only on secure server-side platforms to administer permissions.

For applications that will administer Access Manager permissions, initialize with `SecretKey`:

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

After initialization with `SecretKey`, the client can access Access Manager functions. The client signs Access Manager messages with the `SecretKey`.

## Event listeners

- PubNub client: receive updates from all subscriptions (channels, channel groups, channel metadata, users).
- Subscription object: updates only for its specific entity.
- SubscriptionsSet object: updates for all entities represented by its subscription objects.

See Publish & Subscribe for details.

## UserId

Set or get the user ID at runtime.

### Property(s)

To set/get `UserId` you can use the following property(s) in C# SDK:

```
1
  

```

- UserId (Type: string) Device/user identifier. Required to connect.

```
`1pubnub.GetCurrentUserId();  
`
```

This method doesn't take any arguments.

### Sample code

#### Set user ID

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

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

- AuthKey (Type: string) Used in all restricted requests when Access Manager is enabled.

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

Requires the Stream Controller add-on.

Stream filtering allows a subscriber to receive only messages that match a filter.

### Property(s)

```
`1FilterExpression  
`
```

- FilterExpression (Type: string) PSV2 feature to `Subscribe` with a custom filter expression.

```
`1pnConfiguration.FilterExpression;  
`
```

This method doesn't take any arguments.

### Sample code

#### Set filter expression

##### Required User ID

Always set the `UserId`. If you don't set the `UserId`, you won't be able to connect to PubNub.

```
1
  

```

#### Get filter expression

```
1
**
```

Last updated on Sep 3, 2025**