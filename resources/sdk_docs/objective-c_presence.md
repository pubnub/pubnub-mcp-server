# Presence API – Objective-C SDK (Condensed)

Presence requires the Presence add-on to be enabled for your keys.  

---

## Here Now

### Methods
```objective-c
`- (void)hereNowForChannel:(NSString *)channel   
           withCompletion:(PNHereNowCompletionBlock)block;  
`
```
```objective-c
`- (void)hereNowForChannel:(NSString *)channel  
            withVerbosity:(PNHereNowVerbosityLevel)level  
               completion:(PNHereNowCompletionBlock)block;  
`
```
* channel – target channel.  
* level – `PNHereNowOccupancy`, `PNHereNowUUID`, `PNHereNowState`.  
* block – `PNHereNowCompletionBlock`.

### Basic usage
```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// Configuration
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                         subscribeKey:@"demo"
                                                               userID:@"hereNowUser"];
PubNub *client = [PubNub clientWithConfiguration:config];
[client addListener:self];
```

### Other examples

#### Returning State
```objective-c
/** With PNHereNowState client will pull occupancy, uuids and their state. */
[self.client hereNowForChannel:@"my_channel"
                 withVerbosity:PNHereNowState
                    completion:^(PNPresenceChannelHereNowResult *result,
                                 PNErrorStatus *status) {

    if (!status) {
        // result.data.uuids -> [{ uuid, state }]
    }
}];
```

#### Return Occupancy Only
```objective-c
// PNHereNowOccupancy returns occupancy only.
[self.client hereNowForChannel:@"my_channel"
                 withVerbosity:PNHereNowOccupancy
                    completion:^(PNPresenceChannelHereNowResult *result,
                                 PNErrorStatus *status) {

    if (!status) {
        // result.data.occupancy
    }
}];
```

### Response
```objective-c
@interface PNPresenceGlobalHereNowData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSDictionary *> *channels;
@property (nonatomic, readonly, strong) NSNumber *totalChannels;
@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;
@end

@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData
@end
```

Example JSON responses are unchanged.

---

## Here Now for Channel Groups

### Methods
```objective-c
`- (void)hereNowForChannelGroup:(NSString *)group   
                withCompletion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```
```objective-c
`- (void)hereNowForChannelGroup:(NSString *)group   
                 withVerbosity:(PNHereNowVerbosityLevel)level   
                    completion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```
* group – channel group.  
* level – verbosity.  
* block – `PNChannelGroupHereNowCompletionBlock`.

### Basic usage
```objective-c
[self.client hereNowForChannelGroup:@"my_group"
                     withCompletion:^(PNPresenceChannelGroupHereNowResult *result,
                                      PNErrorStatus *status) {

    if (!status) {
        // result.data.channels / totalChannels / totalOccupancy
    }
}];
```

### Response
```objective-c
@interface PNPresenceGlobalHereNowData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSDictionary *> *channels;
@property (nonatomic, readonly, strong) NSNumber *totalChannels;
@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;
@end

@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData
@end
```

---

## Where Now

### Method
```objective-c
`- (void)whereNowUUID:(NSString *)uuid   
      withCompletion:(PNWhereNowCompletionBlock)block;  
`
```
* uuid – target UUID (defaults to current).  
* block – `PNWhereNowCompletionBlock`.

### Usage
```objective-c
[self.client whereNowUUID:self.client.uuid
            withCompletion:^(PNPresenceWhereNowResult *result,
                             PNErrorStatus *status) {

    if (!status) {
        // result.data.channels
    }
}];
```

### Response
```objective-c
@interface PNPresenceWhereNowData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<NSString *> *channels;
@end

@interface PNPresenceWhereNowResult : PNResult
@property (nonatomic, readonly, strong) PNPresenceWhereNowData *data;
@end
```

---

## User State

### Set State
```objective-c
`- (void)setState:(nullable NSDictionary<NSString *, id> *)state   
         forUUID:(NSString *)uuid   
       onChannel:(NSString *)channel   
  withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```
```objective-c
`- (void)setState:(nullable NSDictionary<NSString *, id> *)state   
           forUUID:(NSString *)uuid  
    onChannelGroup:(NSString *)group  
    withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```
* state – dictionary to set (`nil` removes).  
* uuid – target UUID.  
* channel / group – target.  
* block – `PNSetStateCompletionBlock`.

### Get State
```objective-c
`- (void)stateForUUID:(NSString *)uuid  
           onChannel:(NSString *)channel  
      withCompletion:(PNChannelStateCompletionBlock)block;  
`
```
```objective-c
`- (void)stateForUUID:(NSString *)uuid  
      onChannelGroup:(NSString *)group  
      withCompletion:(PNChannelGroupStateCompletionBlock)block;  
`
```
* uuid – target.  
* channel / group – source.  
* block – completion.

### Usage
```objective-c
[self.client setState:@{@"Key":@"Value"}
               forUUID:self.client.uuid
             onChannel:@"my_channel"
        withCompletion:^(PNClientStateUpdateStatus *status) {
    if (!status.isError) { /* success */ }
}];

[self.client stateForUUID:self.client.uuid
                onChannel:@"chat"
           withCompletion:^(PNChannelClientStateResult *result,
                            PNErrorStatus *status) {
    if (!status) { /* result.data.state */ }
}];
```

### Responses
```objective-c
@interface PNClientStateUpdateData : PNChannelClientStateData @end
@interface PNClientStateUpdateStatus : PNErrorStatus
@property (nonatomic, readonly, strong) PNClientStateUpdateData *data;
@end

@interface PNChannelClientStateData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, id> *state;
@end

@interface PNChannelClientStateResult : PNResult
@property (nonatomic, readonly, strong) PNChannelClientStateData *data;
@end

@interface PNChannelGroupClientStateData : PNServiceData
@property (nonatomic, readonly, strong) NSDictionary<NSString *, NSDictionary *> *channels;
@end

@interface PNChannelGroupClientStateResult : PNResult
@property (nonatomic, readonly, strong) PNChannelGroupClientStateData *data;
@end
```

---

## User State – Builder Pattern

### Set State
```objective-c
state()
    .set()
    .uuid(NSString *)
    .state(NSDictionary *)
    .channels(NSArray<NSString *> *)
    .channelGroups(NSArray<NSString *> *)
    .performWithCompletion(PNSetStateCompletionBlock);
```

### Get State
```objective-c
state()
    .audit()
    .uuid(NSString *)
    .channels(NSArray<NSString *> *)
    .channelGroups(NSArray<NSString *> *)
    .performWithCompletion(PNGetStateCompletionBlock);
```

### Usage
```objective-c
self.client.state().set().state(@{@"state": @"test"})
    .channels(@[@"channel1", @"channel12"])
    .channelGroups(@[@"group1", @"group2"])
    .performWithCompletion(^(PNClientStateUpdateStatus *status) {
        if (!status.isError) { /* success */ }
    });

self.client.state().audit().uuid(@"PubNub")
    .channels(@[@"channel1", @"channel12"])
    .channelGroups(@[@"group1", @"group2"])
    .performWithCompletion(^(PNClientStateGetResult *result,
                             PNErrorStatus *status) {
        if (!status.isError) { /* result.data.channels */ }
    });
```

Last updated on Jun 16 2025