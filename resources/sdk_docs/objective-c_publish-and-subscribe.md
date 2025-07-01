# PubNub Objective-C SDK – Publish & Subscribe (Condensed)

Below is a stripped-down reference that preserves every API signature, parameters, and code sample from the original docs while omitting redundant prose.

---

## Initialization (required for all examples)

```objective-c
#import <PubNub/PubNub.h>

PNConfiguration *config =
    [PNConfiguration configurationWithPublishKey:@"<pub_key>"
                                    subscribeKey:@"<sub_key>"
                                          userID:@"<uuid>"];

// Optional AES-CBC encryption
config.cryptoModule =
    [PNCryptoModule AESCBCCryptoModuleWithCipherKey:@"<cipher>"
                           randomInitializationVector:YES];

PubNub *client = [PubNub clientWithConfiguration:config];
```

---

## Publish

### Essentials
• `publishKey` required during initialization.  
• One channel per call.  
• Max payload 32 KiB (64 B for `signal`).  
• Optional: TLS (`ssl`), message encryption, GZIP compression (`compressed:YES`).  
• Soft queue limit: 100 in-memory messages per subscriber.  
• Optional flags: `storeInHistory`, `metadata`, APNS/FCM `payloads`, `ttl`, `customMessageType`.

### Core Methods

```objective-c
// Basic
- (void)publish:(id)message
       toChannel:(NSString *)channel
  withCompletion:(nullable PNPublishCompletionBlock)block;

// +compression
- (void)publish:(id)message
       toChannel:(NSString *)channel
      compressed:(BOOL)compressed
  withCompletion:(nullable PNPublishCompletionBlock)block;

// +history
- (void)publish:(id)message
       toChannel:(NSString *)channel
  storeInHistory:(BOOL)shouldStore
  withCompletion:(nullable PNPublishCompletionBlock)block;

// +history+compression
- (void)publish:(id)message
       toChannel:(NSString *)channel
  storeInHistory:(BOOL)shouldStore
      compressed:(BOOL)compressed
  withCompletion:(nullable PNPublishCompletionBlock)block;

// +push payload
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
 withCompletion:(nullable PNPublishCompletionBlock)block;

// +payload+compression
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
      compressed:(BOOL)compressed
 withCompletion:(nullable PNPublishCompletionBlock)block;

// +payload+history
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
  storeInHistory:(BOOL)shouldStore
 withCompletion:(nullable PNPublishCompletionBlock)block;

// +payload+history+compression
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
  storeInHistory:(BOOL)shouldStore
      compressed:(BOOL)compressed
 withCompletion:(nullable PNPublishCompletionBlock)block;

// +metadata
- (void)publish:(id)message
       toChannel:(NSString *)channel
    withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
      completion:(nullable PNPublishCompletionBlock)block;

// +metadata+compression
- (void)publish:(id)message
       toChannel:(NSString *)channel
      compressed:(BOOL)compressed
    withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
      completion:(nullable PNPublishCompletionBlock)block;

// +history+metadata
- (void)publish:(id)message
       toChannel:(NSString *)channel
  storeInHistory:(BOOL)shouldStore
    withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
      completion:(nullable PNPublishCompletionBlock)block;

// +history+compression+metadata
- (void)publish:(id)message
       toChannel:(NSString *)channel
  storeInHistory:(BOOL)shouldStore
      compressed:(BOOL)compressed
    withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
      completion:(nullable PNPublishCompletionBlock)block;

// +payload+metadata
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
   withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
     completion:(nullable PNPublishCompletionBlock)block;

// +payload+compression+metadata
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
      compressed:(BOOL)compressed
   withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
     completion:(nullable PNPublishCompletionBlock)block;

// +payload+history+metadata
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
  storeInHistory:(BOOL)shouldStore
   withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
     completion:(nullable PNPublishCompletionBlock)block;

// +payload+history+compression+metadata
- (void)publish:(nullable id)message
       toChannel:(NSString *)channel
mobilePushPayload:(nullable NSDictionary<NSString *, id> *)payloads
  storeInHistory:(BOOL)shouldStore
      compressed:(BOOL)compressed
   withMetadata:(nullable NSDictionary<NSString *, id> *)metadata
     completion:(nullable PNPublishCompletionBlock)block;
```

#### Builder Pattern

```objective-c
client.publish()
      .message(id)
      .channel(NSString *)
      .shouldStore(BOOL)
      .compress(BOOL)
      .ttl(NSUInteger)
      .payloads(NSDictionary *)
      .metadata(NSDictionary *)
      .customMessageType(NSString *)
      .performWithCompletion(PNPublishCompletionBlock);
```

#### Compressed Publish Example

```objective-c
[self.client publish:@{@"message":@"This message will be compressed"}
            toChannel:@"channel_name"
           compressed:YES
      withCompletion:^(PNPublishStatus *status) {
          if (!status.isError) {
              // success
          }
      }];
```

#### Response Objects

```objective-c
@interface PNPublishData : PNServiceData
@property (nonatomic, strong, readonly) NSNumber *timetoken;
@property (nonatomic, strong, readonly) NSString *information;
@end

@interface PNPublishStatus : PNAcknowledgmentStatus
@property (nonatomic, strong, readonly) PNPublishData *data;
@end
```

---

## Fire (Builder Pattern)

```objective-c
client.fire()
      .message(id)
      .channel(NSString *)
      .compress(BOOL)
      .payloads(NSDictionary *)
      .metadata(NSDictionary *)
      .performWithCompletion(PNPublishCompletionBlock);
```

---

## Signal

### Direct Method

```objective-c
- (void)signal:(id)message
       channel:(NSString *)channel
withCompletion:(nullable PNSignalCompletionBlock)block;
```

### Builder Pattern

```objective-c
client.signal()
      .message(id)
      .channel(NSString *)
      .customMessageType(NSString *)
      .performWithCompletion(PNSignalCompletionBlock);
```

#### Usage

```objective-c
[self.client signal:@{@"Hello":@"world"}
            channel:@"announcement"
     withCompletion:^(PNSignalStatus *status) {
         if (!status.isError) { /* success */ }
     }];
```

#### Response Objects

```objective-c
@interface PNSignalStatusData : PNServiceData
@property (nonatomic, strong, readonly) NSNumber *timetoken;
@property (nonatomic, strong, readonly) NSString *information;
@end

@interface PNSignalStatus : PNAcknowledgmentStatus
@property (nonatomic, strong, readonly) PNSignalStatusData *data;
@end
```

---

## Subscribe

### Methods

```objective-c
// basic
- (void)subscribeToChannels:(NSArray<NSString *> *)channels
               withPresence:(BOOL)shouldObservePresence;

// +state
- (void)subscribeToChannels:(NSArray<NSString *> *)channels
               withPresence:(BOOL)shouldObservePresence
                clientState:(nullable NSDictionary<NSString *, id> *)state;

// +timetoken
- (void)subscribeToChannels:(NSArray<NSString *> *)channels
               withPresence:(BOOL)shouldObservePresence
             usingTimeToken:(nullable NSNumber *)timeToken;

// +timetoken+state
- (void)subscribeToChannels:(NSArray<NSString *> *)channels
               withPresence:(BOOL)shouldObservePresence
             usingTimeToken:(nullable NSNumber *)timeToken
                clientState:(nullable NSDictionary<NSString *, id> *)state;
```

#### Example Listener

```objective-c
[self.client addListener:self];
[self.client subscribeToChannels:@[@"my_channel1",@"my_channel2"] withPresence:NO];

- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {
    NSLog(@"%@ > %@ : %@", message.data.channel,
                               message.data.publisher,
                               message.data.message);
}
```

#### Response Core

```objective-c
@interface PNSubscriberData : PNServiceData
@property (nonatomic, strong, readonly) NSString *channel;
@property (nonatomic, strong, readonly, nullable) NSString *subscription;
@property (nonatomic, strong, readonly) NSNumber *timetoken;
@property (nonatomic, strong, readonly, nullable)
    NSDictionary<NSString *, id> *userMetadata;
@end
```

---

## Channel Groups (Subscribe / Unsubscribe)

```objective-c
// Subscribe
- (void)subscribeToChannelGroups:(NSArray<NSString *> *)groups
                    withPresence:(BOOL)shouldObservePresence;

- (void)subscribeToChannelGroups:(NSArray<NSString *> *)groups
                    withPresence:(BOOL)shouldObservePresence
                     clientState:(nullable NSDictionary<NSString *, id> *)state;

// Unsubscribe
- (void)unsubscribeFromChannelGroups:(NSArray<NSString *> *)groups
                        withPresence:(BOOL)shouldObservePresence;
```

---

## Unsubscribe

```objective-c
// from channels
- (void)unsubscribeFromChannels:(NSArray<NSString *> *)channels
                   withPresence:(BOOL)shouldObservePresence;

// from all
- (void)unsubscribeFromAll;

// from presence channels
- (void)unsubscribeFromPresenceChannels:(NSArray<NSString *> *)channels;
```

---

## Presence

```objective-c
// Subscribe to presence of channels
- (void)subscribeToPresenceChannels:(NSArray<NSString *> *)channels;
```

Presence events payload samples (unchanged):

```json
{ "action": "join",    "timestamp": 1345546797, "uuid": "175c2c67…", "occupancy": 2 }
{ "action": "leave",   "timestamp": 1345549797, "uuid": "175c2c67…", "occupancy": 1 }
{ "action": "timeout", "timestamp": 1345549797, "uuid": "76c2c571…", "occupancy": 0 }
{ "action": "state-change", "uuid":"76c2c571…", "timestamp":1345549797,
  "data": { "isTyping": true } }
{ "action": "interval", "timestamp":1474396578, "occupancy":2 }
```

Large `interval` with deltas:

```json
{ "action":"interval","timestamp":...,"occupancy":...,
  "joined":["uuid2","uuid3"], "timedout":["uuid1"] }
```

When >30 KB:

```json
{ "action":"interval","timestamp":...,"occupancy":...,"here_now_refresh":true }
```

---

## Unsubscribe Presence

```objective-c
- (void)unsubscribeFromPresenceChannels:(NSArray<NSString *> *)channels;
```

---

### Status & Error Objects (common)

All callback blocks receive subclasses of `PNStatus` such as:
* `PNPublishStatus`
* `PNSignalStatus`
* `PNSubscribeStatus`
* `PNClientStateUpdateStatus`

Each exposes:
```objective-c
@property (nonatomic, assign, readonly) BOOL isError;
@property (nonatomic, strong, readonly) PNErrorData *errorData; // on failure
@property (nonatomic, assign, readonly) PNCachedOperation operation;
@property (nonatomic, assign, readonly) PNStatusCategory category;
```
Use `[status retry]` where applicable.

---

_Last updated: Jun 16 2025_