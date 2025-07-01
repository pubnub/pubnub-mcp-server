On this page
# Configuration API for Objective-C SDK

Objective-C complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration[​](#configuration)

`PNConfiguration` instance is storage for user-provided information which describe further PubNub client behavior. Configuration instance contain additional set of properties which allow to perform precise PubNub client configuration.

##### Privacy

[MAU billing](/docs/general/setup/account-setup#pricing-model) tracks users ([Device](/docs/general/basics/identify-users-and-devices) and MAU) for analytics and billing. PubNub does not track customers using transactions with random UUIDs/UserIDs.

### Method(s)[​](#methods)

To create `configuration` instance you can use the following function in the Objective-C SDK:

```
`+ (instancetype)configurationWithPublishKey:(NSString *)publishKey   
                               subscribeKey:(NSString *)subscribeKey;  
                                     userID:(NSString *)userID  
`
```

*  requiredParameterDescription`publishKey` *Type: NSStringKey which allow client to use data push API.`subscribeKey` *Type: NSStringKey which allow client to subscribe on live feeds pushed from PubNub service.`userID` *Type: NSString`userID` to use. You should set a unique identifier for the user or the device that connects to PubNub. It's a UTF-8 encoded string of up to 92 alphanumeric characters. If you don't set the `userID`, you won't be able to connect to PubNub.`heartbeatNotificationOptions`Type: PNHeartbeatNotificationOptionsThese are bitmask options, they can be combined. When client instances are notified about heartbeat operations, this happens through the `PNObjectEventListener` callback for statuses.   
`PNHeartbeatNotifySuccess`: explicitly tells client to notify on successful heartbeat operations.   
`PNHeartbeatNotifyFailure`: explicitly tells client to notify on failed heartbeat operations (default is only this option)   
`PNHeartbeatNotifyAll`: This is a combination of `PNHeartbeatNotifySuccess` and `PNHeartbeatNotifyFailure`   
`PNHeartbeatNotifyNone`: This means the client will not provide any callback notifications for heartbeat operations.`stripMobilePayload`Type: BOOLStores whether client should strip out received messages (real-time and history) from data which has been appended by client (like mobile payload for mobile push notifications).`subscribeMaximumIdleTime`Type: NSTimeIntervalMaximum number of seconds which client should wait for events from live feed.   
Default `310`.`nonSubscribeRequestTimeout`Type: NSTimeIntervalNumber of seconds which is used by client during non-subscription operations to check whether response potentially failed with `timeout` or not.   
Default `10`.`presenceHeartbeatValue`Type: NSIntegerDefines how long the server considers the client alive for presence. This property works similarly to the concept of long polling by sending periodic requests to the PubNub server every `300` seconds by default. These requests ensure the client remains active on subscribed channels.   
   
 If no heartbeat is received within the timeout period, the client is marked inactive, triggering a "timeout" event on the [presence channel](/docs/general/presence/overview).`presenceHeartbeatInterval`Type: NSIntegerSpecifies how often the client will send heartbeat signals to the server. This property offers more granular control over client activity tracking than `presenceHeartbeatValue`.   
   
 Configure this property to achieve a shorter presence timeout if needed, with the interval typically recommended to be `(presenceHeartbeatValue / 2) - 1`.`keepTimeTokenOnListChange`Type: BOOLWhether client should keep previous timetoken when subscribe on new set of remote data objects live feeds.   
Default `YES`.`catchUpOnSubscriptionRestore`Type: BOOLWhether client should try to catch up for events which occurred on previously subscribed remote data objects feed while client was off-line.   
Default `YES`.`applicationExtensionSharedGroupIdentifier`Type: NSStringReference on group identifier which is used to share request cache between application extension and it's containing application.   
This property should be set to valid registered group only if `PubNub` client is used inside of application's extension (iOS 8.0+, macOS 10.10+).`requestMessageCountThreshold`Type: NSUIntegerNumber of maximum expected messages from `PubNub` service in single response.`maximumMessagesCacheSize`Type: NSUIntegerMessages de-duplication cache size   
Default `100`.`completeRequestsBeforeSuspension`Type: BOOLWhether client should try complete all API call which is done before application will be completely suspended.   
Default `YES`.`suppressLeaveEvents`Type: BOOLIf `YES`, the client shouldn't send presence leave events during the unsubscribe process.`origin`Type: NSStringIf a custom domain is required, SDK accepts it here.`requestRetry`Type: PNRequestRetryConfigurationCustom reconnection configuration parameters. For more information, refer to [`requestRetry`](#requestretry).`cryptoModule`Type: `[PNCryptoModule AESCBCCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];`  
 `[PNCryptoModule legacyCryptoModuleWithCipherKey: NSString randomInitializationVector: BOOL];`The cryptography module used for encryption and decryption of messages and files. Takes the `cipherKey` and `useRandomInitializationVector` parameters as arguments.   
   
 For more information, refer to the [cryptoModule](#cryptomodule) section.`cipherKey`Type: NSStringThis way of setting this parameter is deprecated, pass it to `cryptoModule` instead.   
   
 `Key` which is used to encrypt `messages` pushed to `PubNub` service and decrypt `messages` received from live feeds on which client subscribed at this moment.`useRandomInitializationVector`Type: BOOLThis way of setting this parameter is deprecated, pass it to `cryptoModule` instead.   
   
 When `YES` the initialization vector (IV) is random for all requests (not just for file upload). When `NO` the IV is hard-coded for all requests except for file upload. By default, using the random initialization vector is enabled.

##### Disabling random initialization vector

Disable random initialization vector (IV) only for backward compatibility (<`4.16.0`) with existing applications. Never disable random IV on new applications.

#### `requestRetry`[​](#requestretry)

The `PNRequestRetryConfiguration` is the retry configuration object and has the following methods. For more general information about the policies and parameters, refer to [Reconnection Policy](/docs/general/setup/connection-management#reconnection-policy).

##### Create a default linear retry policy[​](#create-a-default-linear-retry-policy)

```
`+ (instancetype)configurationWithLinearDelay;  
`
```

###### Example[​](#example)

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay];  
`
```

##### Create a linear retry policy with excluded endpoints[​](#create-a-linear-retry-policy-with-excluded-endpoints)

```
`+ (instancetype)configurationWithLinearDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

ParameterDescription`endpoints`Type: `PNEndpoint`The endpoints to exclude. For a list of endpoints, inspect `NS_ENUM(NSUInteger, PNEndpoint)` in the [PNStructures](https://github.com/pubnub/objective-c/blob/master/PubNub/Misc/PNStructures.h) file.

###### Example[​](#example-1)

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

##### Create a linear retry policy with excluded endpoints and custom parameters[​](#create-a-linear-retry-policy-with-excluded-endpoints-and-custom-parameters)

```
`+ (instancetype)configurationWithLinearDelay:(NSTimeInterval)delay  
                                maximumRetry:(NSUInteger)maximumRetry  
                           excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```

ParameterDescription`delay`Type: `NSTimeInterval`Delay in seconds between failed requests.`maximumRetry`Type: `NSUInteger`How many times to retry before throwing an error.`excludedEndpoints`Type: `PNEndpoint`The endpoints to exclude. For a list of endpoints, inspect `NS_ENUM(NSUInteger, PNEndpoint)` in the [PNStructures](https://github.com/pubnub/objective-c/blob/master/PubNub/Misc/PNStructures.h) file.

###### Example[​](#example-2)

```
`/// example  
configuration.requestRetry = [PNRequestRetryConfiguration configurationWithLinearDelay:3.f  
                                                                          maximumRetry:3  
                                                                     excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

##### Create a default exponential retry policy[​](#create-a-default-exponential-retry-policy)

```
`+ (instancetype)configurationWithExponentialDelay;  
`
```

###### Example[​](#example-3)

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay];  
`
```

##### Create an exponential retry policy with excluded endpoints[​](#create-an-exponential-retry-policy-with-excluded-endpoints)

```
`+ (instancetype)configurationWithExponentialDelayExcludingEndpoints:(PNEndpoint)endpoints, ...;  
`
```

ParameterDescription`endpoints`Type: `PNEndpoint`The endpoints to exclude. For a list of endpoints, inspect `NS_ENUM(NSUInteger, PNEndpoint)` in the [PNStructures](https://github.com/pubnub/objective-c/blob/master/PubNub/Misc/PNStructures.h) file.

###### Example[​](#example-4)

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelayExcludingEndpoints:PNMessageSendEndpoint, 0];  
`
```

##### Create an exponential retry policy with excluded endpoints and custom parameters[​](#create-an-exponential-retry-policy-with-excluded-endpoints-and-custom-parameters)

```
`+ (instancetype)configurationWithExponentialDelay:(NSTimeInterval)minimumDelay  
                                     maximumDelay:(NSTimeInterval)maximumDelay  
                                     maximumRetry:(NSUInteger)maximumRetry  
                                excludedEndpoints:(PNEndpoint)endpoints, ...;  
`
```

ParameterDescription`minimumDelay`Type: `NSTimeInterval`Base delay in seconds used to calculate the next delay.`maximumDelay`Type: `NSTimeInterval`Maximum allowed computed delay in seconds between retry attempts.`maximumRetry`Type: `NSUInteger`How many times to retry before throwing an error.`excludedEndpoints`Type: `PNEndpoint`The endpoints to exclude. For a list of endpoints, inspect `NS_ENUM(NSUInteger, PNEndpoint)` in the [PNStructures](https://github.com/pubnub/objective-c/blob/master/PubNub/Misc/PNStructures.h) file.

###### Example[​](#example-5)

```
`configuration.requestRetry = [PNRequestRetryConfiguration configurationWithExponentialDelay:3.f  
                                                                               maximumDelay:120.f  
                                                                               maximumRetry:3  
                                                                          excludedEndpoints:PNMessageSendEndpoint, PNMessageStorageEndpoint, 0];  
`
```

#### `cryptoModule`[​](#cryptomodule)

`cryptoModule` provides encrypt/decrypt functionality for messages and files. From the 5.1.3 release on, you can configure how the actual encryption/decryption algorithms work.

Each PubNub SDK is bundled with two ways of encryption: the legacy encryption with 128-bit cipher key entropy and the recommended 256-bit AES-CBC encryption. For more general information on how encryption works, refer to the [Message Encryption](/docs/general/setup/data-security#message-encryption) and [File Encryption](/docs/general/setup/data-security#file-encryption) sections.

If you do not explicitly set the `cryptoModule` in your app and have the `cipherKey` and `useRandomInitializationVector` params set in PubNub config, the client defaults to using the legacy encryption.

##### Legacy encryption with 128-bit cipher key entropy

You don't have to change your encryption configuration if you want to keep using the legacy encryption. If you want to use the recommended 256-bit AES-CBC encryption, you must explicitly set that in PubNub config.

##### `cryptoModule` configuration[​](#cryptomodule-configuration)

To configure the `cryptoModule` to encrypt all messages/files, you can use the following methods in the Objective-C SDK:

```
`// encrypts using 256-bit AES-CBC cipher (recommended)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"enigma"  
                                           randomInitializationVector:YES];  
  
// encrypts with 128-bit cipher key entropy (legacy)  
// decrypts data encrypted with the legacy and the 256-bit AES-CBC ciphers  
config.cryptoModule = [PNCryptoModule legacyCryptoModuleWithCipherKey:@"enigma"   
                                           randomInitializationVector:YES];  
`
```

Your client can decrypt content encrypted using either of the modules. This way, you can interact with historical messages or messages sent from older clients while encoding new messages using the more secure 256-bit AES-CBC cipher.

##### Older SDK versions

Apps built using the SDK versions lower than 5.1.3 will **not** be able to decrypt data encrypted using the 256-bit AES-CBC cipher. Make sure to update your clients or encrypt data using the legacy algorithm.

### Basic Usage[​](#basic-usage)

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                          subscribeKey:@"demo"  
                                                                userID:@"myUniqueUserID"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Add listener for PubNub events  
[client addListener:self];  
  
// Subscribe to a test channel  
PNSubscribeRequest *subscribeRequest = [PNSubscribeRequest requestWithChannels:@[@"test-channel"]  
                                                                 channelGroups:nil];  
subscribeRequest.observePresence = YES;  
`
```
show all 51 lines

### Returns[​](#returns)

Configured and ready to use client configuration instance.

### Other Examples[​](#other-examples)

#### Configure heartbeat notifications[​](#configure-heartbeat-notifications)

##### PNConfiguration[​](#pnconfiguration)

```
`PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"" subscribeKey:@""];  
/**  
    This is where you need to adjust the PNConfiguration object for the types of heartbeat notifications you want.  
    This is a bitmask of options located at https://github.com/pubnub/objective-c/blob/1f1c7a41a3bd8c32b644a6ad98fe179d45397c2b/PubNub/Misc/PNStructures.h#L24  
    */  
config.heartbeatNotificationOptions = PNHeartbeatNotifyAll;  
  
self.client = [PubNub clientWithConfiguration:config];  
[self.client addListener:self];  
`
```

##### Listener[​](#listener)

```
`- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
  
    if (status.operation == PNHeartbeatOperation) {  
  
        /**  
            Heartbeat operations can in fact have errors, so it is important to check first for an error.  
            For more information on how to configure heartbeat notifications through the status  
            PNObjectEventListener callback, consult http://www.pubnub.com/docs/sdks/objective-c/api-reference/configuration#configuration_basic_usage  
            */  
  
        if (!status.isError) { /* Heartbeat operation was successful. */ }  
        else { /* There was an error with the heartbeat operation, handle here. */ }  
    }  
}  
`
```

## Initialization[​](#initialization)

To include PubNub SDK in your project you need to use CocoaPods, install CocoaPods gem by following the procedure defined in the [Getting Started guide](/docs/sdks/objective-c). To add the PubNub SDK to your project with CocoaPods, there are four basic tasks to complete which are covered below:

Create a new Xcode project.

Create a Podfile in a new Xcode project root folder

```
`pod init  
`
```

```
`platform :ios, '9.0'  
  
target 'application-target-name' do  
    use_frameworks!  
  
    pod "PubNub", "~> 4"  
end  
`
```

If you have any other pods you'd like to include, or if you have other targets you'd to add (like a test target) add those entries to this Podfile as well. See the CocoaPods [documentation](https://guides.cocoapods.org/syntax/podfile.html#target)  for more information on Podfile configuration.

- Install your pods by running `pod install` via the command line from the directory that contains your Podfile.

##### Note

After installing your Pods, you should only be working within the workspace generated by CocoaPods or specified by you in Podfile. Always open the newly generated workspace file, not the original project file!

To be able to use PubNub SDK within your application code you need to import it. Import PubNub SDK headers in implementation files for classes where you need to use it using this import statement:

```
`#import PubNub/PubNub.h>  
`
```

#### Complete application delegate configuration[​](#complete-application-delegate-configuration)

Add the PNObjectEventListener protocol to AppDelegate in implementation file to anonymous category:

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`#import PubNub/PubNub.h>  
  
@interface AppDelegate () PNObjectEventListener>  
  
// Stores reference on PubNub client to make sure what it won't be released.  
@property (nonatomic, strong) PubNub *client;  
  
@end  
`
```

### Description[​](#description)

This function is used for initializing the PubNub Client API context. This function must be called before attempting to utilize any API functionality in order to establish account level credentials such as `publishKey` and `subscribeKey`.

### Method(s)[​](#methods-1)

To `Initialize` PubNub you can use the following method(s) in the Objective-C SDK:

#### Initialize PubNub[​](#initialize-pubnub)

```
`+ (instancetype)clientWithConfiguration:(PNConfiguration *)configuration;  
`
```

*  requiredParameterDescription`configuration` *Type: PNConfigurationReference on instance which store all user-provided information about how client should operate and handle events.

#### Initialize with callback queue[​](#initialize-with-callback-queue)

```
`+ (instancetype)clientWithConfiguration:(PNConfiguration *)configuration callbackQueue:(dispatch_queue_t)callbackQueue;  
`
```

*  requiredParameterDescription`configuration` *Type: PNConfigurationReference on instance which store all user-provided information about how client should operate and handle events.`callbackQueue`Type: dispatch_queue_tReference on queue which should be used by client for completion block and delegate calls.

### Basic Usage[​](#basic-usage-1)

#### Initialize the PubNub client API[​](#initialize-the-pubnub-client-api)

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                                                                      subscribeKey:@"demo"  
                                                                                                                  userID:@"myUserID"];  
config.TLSEnabled = YES;  
self.client = [PubNub clientWithConfiguration:configuration];  
`
```

### Returns[​](#returns-1)

It returns the PubNub instance for invoking PubNub APIs like `publish`, `subscribeToChannels`, `historyForChannel`, `hereNowForChannel`, etc.

### Other Examples[​](#other-examples-1)

#### Initialize the client[​](#initialize-the-client)

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                                    subscribeKey:@"demo"  
                                                                          userID:@"myUserID"];  
  
self.client = [PubNub clientWithConfiguration:configuration];  
`
```

#### Initialization for a Read-Only client[​](#initialization-for-a-read-only-client)

In the case where a client will only read messages and never publish to a channel, you can simply omit the `publishKey` when initializing the client:

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@""  
                                                                    subscribeKey:@"demo"  
                                                                          userID:@"myUserID"];  
self.client = [PubNub clientWithConfiguration:configuration];  
`
```

## Event Listeners[​](#event-listeners)

You can be notified of connectivity status, message and presence notifications via the listeners.

Listeners should be added before calling the method.

#### Add Listeners[​](#add-listeners)

Listener's class should conform to `PNEventsListener` protocol to have access to available callbacks.

```
`// Adding listener.  
[pubnub addListener:self];  
  
// Callbacks listed below.  
  
- (void)client:(PubNub *)pubnub didReceiveMessage:(PNMessageResult *)message {  
    NSString *channel = message.data.channel; // Channel on which the message has been published  
    NSString *subscription = message.data.subscription; // Wild-card channel or channel on which PubNub client actually subscribed  
    NSNumber *timetoken = message.data.timetoken; // Publish timetoken  
    id msg = message.data.message; // Message payload  
    NSString *publisher = message.data.publisher; // Message publisher  
}  
  
- (void)client:(PubNub *)pubnub didReceiveSignal:(PNSignalResult *)signal {  
    NSString *channel = message.data.channel; // Channel on which the signal has been published  
`
```
show all 102 lines

#### Remove Listeners[​](#remove-listeners)

```
`[pubnub removeListener:self]  
`
```

#### Handling Disconnects[​](#handling-disconnects)

SDK performs automated re-connections and call status handler to report back. This will happen forever, but user may decide to stop it.

```
`- (void)client:(PubNub *)pubnub didReceiveStatus:(PNStatus *)status {  
  if (status.isError && status.willAutomaticallyRetry) {  
    // Stop automatic retry attempts.  
    [status cancelAutomaticRetry];  
  }  
}  
`
```

#### Listener status events[​](#listener-status-events)

CategoryDescription`PNAcknowledgmentCategory`An API call was successful. This status has additional details based on the type of the successful operation.`PNAccessDeniedCategory`Access Manager permission failure.`PNTimeoutCategory`Server didn't respond in time for reported operation request.`PNNetworkIssuesCategory`No connection to Internet.`PNRequestMessageCountExceededCategory`The SDK announces this error if `requestMessageCountThreshold` is set, and the number of messages received from PubNub (in-memory cache messages) exceeds the threshold.`PNConnectedCategory`The SDK subscribed to new channels / channel groups.`PNReconnectedCategory`The SDK was able to reconnect to PubNub.`PNDisconnectedCategory`The SDK unsubscribed from channels / channel groups.`PNUnexpectedDisconnectCategory`The SDK unexpectedly lost ability to receive live updated from PubNub.`PNRequestURITooLongCategory`Reported operation request URI too long (too many channels / channel groups).`PNMalformedFilterExpressionCategory`The SDK has been configured with malformed filtering expression.`PNMalformedResponseCategory`The SDK received unexpected PubNub service response.`PNDecryptionErrorCategory`The SDK unable to decrypt received message using configured `cipherKey`.`PNTLSConnectionFailedCategory`The SDK unable to establish secured connection.`PNTLSUntrustedCertificateCategory`The SDK unable to check certificates trust chain.

## UserID[​](#userid)

This function is used to set a user ID on the fly.

### Method(s)[​](#methods-2)

To set `userID` you can use the following method(s) in Objective-C SDK:

```
`@property (nonatomic, copy, setter = setUserID:) NSString *userID;  
`
```

### Basic Usage[​](#basic-usage-2)

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`// User authorized and we need to update used UUID  
PNConfiguration *configuration = self.client.currentConfiguration;  
configuration.userID = @"myUniqueUserID";  
  
__weak __typeof(self) weakSelf = self;  
[self.client copyWithConfiguration:configuration completion:^(PubNub *client) {  
  
    weakSelf.client = client;  
}];  
`
```

### Other Examples[​](#other-examples-2)

#### Creating a function to subscribe a unique channel name[​](#creating-a-function-to-subscribe-a-unique-channel-name)

```
`/**  
    Subscription process results arrive to listener which should adopt to  
    PNObjectEventListener protocol and registered using:  
    */  
[self.client addListener:self];  
[self.client subscribeToChannels:@[[NSUUID UUID].UUIDString] withPresence:NO];  
  
// Handle new message from one of channels on which client has been subscribed.  
- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
  
    // Handle new message stored in message.data.message  
    if (![message.data.channel isEqualToString:message.data.subscription]) {  
  
        // Message has been received on channel group stored in message.data.subscription.  
    }  
`
```
show all 77 lines

#### Creating a unique auth_key for Access Manager on initialization[​](#creating-a-unique-auth_key-for-access-manager-on-initialization)

```
`PNConfiguration *configuration = self.client.currentConfiguration;  
configuration.authKey = [NSUUID UUID].UUIDString.lowercaseString;  
  
__weak __typeof(self) weakSelf = self;  
[self.client copyWithConfiguration:configuration completion:^(PubNub *client) {  
  
    // Store reference on new client with updated configuration.  
    weakSelf.client = client;  
}];  
`
```

## Authentication Key[​](#authentication-key)

Setter and getter for users auth key.

### Method(s)[​](#methods-3)

#### Authentication Key[​](#authentication-key-1)

```
`@property (nonatomic, nullable, copy) NSString *authKey;  
`
```

#### UserID[​](#userid-1)

```
`@property (nonatomic, copy, setter = setUserID:) NSString *userID;  
`
```

### Basic Usage[​](#basic-usage-3)

#### Set Auth Key[​](#set-auth-key)

```
`PNConfiguration *configuration = self.client.currentConfiguration;  
configuration.authKey = @"my_new_authkey";  
  
__weak __typeof(self) weakSelf = self;  
[self.client copyWithConfiguration:configuration completion:^(PubNub *client) {  
  
    // Store reference on new client with updated configuration.  
    weakSelf.client = client;  
}];  
`
```

#### Get Auth Key[​](#get-auth-key)

```
`// Request current client configuration and pull out authorisation key from it.  
NSString *authorizationKey = self.client.currentConfiguration.authKey;  
`
```

### Returns[​](#returns-2)

`Get Auth key` returns the `current authentication key`.

## Filter Expression[​](#filter-expression)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Stream filtering allows a subscriber to apply a filter to only receive messages that satisfy the conditions of the filter. The message filter is set by the subscribing client(s) but it is applied on the server side thus preventing unwanted messages (those that do not meet the conditions of the filter) from reaching the subscriber.

To set or get message filters, you can use the following property. To learn more about filtering, refer to the [Publish Messages](/docs/general/messages/publish) documentation.

### Method(s)[​](#methods-4)

```
`@property (nonatomic, nullable, copy) NSString *filterExpression;  
`
```

### Basic Usage[​](#basic-usage-4)

#### Set Filter Expression[​](#set-filter-expression)

##### Required UserId

Always set the `userID` to uniquely identify the user or device that connects to PubNub. This `userID` should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the `userID`, you won't be able to connect to PubNub.

```
`PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                                 subscribeKey:@"demo"  
                                                                       userID:@"myUserID"];  
self.client = [PubNub clientWithConfiguration:configuration];  
self.client.filterExpression = @"(senderID=='PubNub')";  
`
```

#### Get Filter Expression[​](#get-filter-expression)

```
`NSLog(@"Filtering expression: %@", self.client.filterExpression);  
`
```

### Returns[​](#returns-3)

`Get Filter Expression` returns the `Current filtering expression`.

##### Warning

If filter expression is malformed, `PNObjectEventListener` won't receive any messages and presence events from service (only error status).
Last updated on **Jun 10, 2025**