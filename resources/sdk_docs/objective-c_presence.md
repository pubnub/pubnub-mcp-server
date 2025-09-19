# Presence API – Objective-C SDK (Condensed)

All Presence operations require the Presence add-on to be enabled for your keys.

---

## Here Now

Cache: 3 s

### Methods
```objc
- (void)hereNowForChannel:(NSString *)channel
           withCompletion:(PNHereNowCompletionBlock)block;

- (void)hereNowForChannel:(NSString *)channel
            withVerbosity:(PNHereNowVerbosityLevel)level
               completion:(PNHereNowCompletionBlock)block;
```
* `channel` NSString – channel to audit  
* `level` PNHereNowVerbosityLevel – response detail  
* `block` PNHereNowCompletionBlock – `(PNPresenceChannelHereNowResult *result, PNErrorStatus *status)`

### Sample
```objc
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                          subscribeKey:@"demo"
                                                                userID:@"hereNowUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
[client addListener:self];
```

#### Return state
```objc
[self.client hereNowForChannel:@"my_channel"
                 withVerbosity:PNHereNowState
                    completion:^(PNPresenceChannelHereNowResult *result,
                                 PNErrorStatus *status) {
    if (!status) {
        // result.data.uuids -> [{ uuid, state }]
    }
}];
```

#### Occupancy only
```objc
[self.client hereNowForChannel:@"my_channel"
                 withVerbosity:PNHereNowOccupancy
                    completion:^(PNPresenceChannelHereNowResult *result,
                                 PNErrorStatus *status) {
    if (!status) {
        // result.data.occupancy
    }
}];
```

### Response objects
```objc
@interface PNPresenceGlobalHereNowData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSDictionary *> *channels;
@property (nonatomic, readonly, strong) NSNumber *totalChannels;
@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;
@end

@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData
@end
```

---

## Here Now for Channel Groups

### Methods
```objc
- (void)hereNowForChannelGroup:(NSString *)group
                withCompletion:(PNChannelGroupHereNowCompletionBlock)block;

- (void)hereNowForChannelGroup:(NSString *)group
                 withVerbosity:(PNHereNowVerbosityLevel)level
                    completion:(PNChannelGroupHereNowCompletionBlock)block;
```
* `group` NSString – channel group to audit  
* `level` PNHereNowVerbosityLevel  
* `block` PNChannelGroupHereNowCompletionBlock – `(PNPresenceChannelGroupHereNowResult *result, PNErrorStatus *status)`

### Sample
```objc
[self.client hereNowForChannelGroup:@"my_group"
                      withCompletion:^(PNPresenceChannelGroupHereNowResult *result,
                                       PNErrorStatus *status) {
    if (!status) {
        // result.data.channels, totalChannels, totalOccupancy
    }
}];
```

### Response (same classes as above)

---

## Where Now

### Method
```objc
- (void)whereNowUUID:(NSString *)uuid
      withCompletion:(PNWhereNowCompletionBlock)block;
```
* `uuid` NSString – UUID to audit  
* `block` PNWhereNowCompletionBlock – `(PNPresenceWhereNowResult *result, PNErrorStatus *status)`

### Sample
```objc
[self.client whereNowUUID:self.client.uuid
           withCompletion:^(PNPresenceWhereNowResult *result,
                            PNErrorStatus *status) {
    if (!status) {
        // result.data.channels
    }
}];
```

### Response
```objc
@interface PNPresenceWhereNowData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<NSString *> *channels;
@end

@interface PNPresenceWhereNowResult : PNResult
@property (nonatomic, readonly, strong) PNPresenceWhereNowData *data;
@end
```

---

## User State (Set / Get)

### Set State
```objc
- (void)setState:(nullable NSDictionary<NSString *, id> *)state
         forUUID:(NSString *)uuid
       onChannel:(NSString *)channel
  withCompletion:(nullable PNSetStateCompletionBlock)block;

- (void)setState:(nullable NSDictionary<NSString *, id> *)state
         forUUID:(NSString *)uuid
  onChannelGroup:(NSString *)group
  withCompletion:(nullable PNSetStateCompletionBlock)block;
```

### Get State
```objc
- (void)stateForUUID:(NSString *)uuid
           onChannel:(NSString *)channel
      withCompletion:(PNChannelStateCompletionBlock)block;

- (void)stateForUUID:(NSString *)uuid
      onChannelGroup:(NSString *)group
      withCompletion:(PNChannelGroupStateCompletionBlock)block;
```

### Sample – Set
```objc
[self.client setState:@{@"Key":@"Value"}
              forUUID:self.client.uuid
            onChannel:@"my_channel"
       withCompletion:^(PNClientStateUpdateStatus *status) {
    if (!status.isError) {
        // success
    }
}];
```

### Sample – Get
```objc
[self.client stateForUUID:self.client.uuid
                onChannel:@"chat"
           withCompletion:^(PNChannelClientStateResult *result,
                            PNErrorStatus *status) {
    if (!status) {
        // result.data.state
    }
}];
```

### Response
```objc
@interface PNClientStateUpdateStatus : PNErrorStatus
@property (nonatomic, readonly, strong) PNClientStateUpdateData *data;
@end

@interface PNChannelClientStateResult : PNResult
@property (nonatomic, readonly, strong) PNChannelClientStateData *data;
@end

@interface PNChannelGroupClientStateResult : PNResult
@property (nonatomic, readonly, strong) PNChannelGroupClientStateData *data;
@end
```

---

## User State – Builder Pattern

### Set
```objc
state()
    .set()
    .uuid(NSString *)            // optional, defaults to current userID
    .state(NSDictionary *)       // key/value pairs
    .channels(NSArray<NSString *> *)       // optional
    .channelGroups(NSArray<NSString *> *)  // optional
    .performWithCompletion(PNSetStateCompletionBlock);
```

### Get
```objc
state()
    .audit()
    .uuid(NSString *)            // optional, defaults to current userID
    .channels(NSArray<NSString *> *)       // optional
    .channelGroups(NSArray<NSString *> *)  // optional
    .performWithCompletion(PNGetStateCompletionBlock);
```

### Sample – Set
```objc
self.client.state().set().state(@{@"state":@"test"})
    .channels(@[@"channel1",@"channel12"])
    .channelGroups(@[@"group1",@"group2"])
    .performWithCompletion(^(PNClientStateUpdateStatus *status) {
        if (!status.isError) { /* success */ }
});
```

### Sample – Get
```objc
self.client.state().audit().uuid(@"PubNub")
    .channels(@[@"channel1",@"channel12"])
    .channelGroups(@[@"group1",@"group2"])
    .performWithCompletion(^(PNClientStateGetResult *result,
                             PNErrorStatus *status) {
        if (!status.isError) { /* result.data.channels */ }
});
```

_Last updated: Jul 15 2025_