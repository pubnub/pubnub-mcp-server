# Presence API for Objective-C SDK

Presence tracks online/offline users and optional per-user state. It supports join/leave events, occupancy, channel membership per UUID, and state. Presence add-on must be enabled in the Admin Portal (see links in original doc). Presence event details: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

---

## Here now[​](#here-now)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Returns current channel presence: UUIDs currently subscribed and occupancy.

##### Cache

3-second response cache time.

### Method(s)[​](#methods)

```
`1- (void)hereNowWithRequest:(PNHereNowRequest *)request   
2                completion:(PNHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`request` *Type: [PNHereNowRequest](#pnherenowrequest)Request with information required to retrieve presence information.`block` *Type: PNHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of here now operation; status - in case if error occurred during request processing.

#### PNHereNowRequest[​](#pnherenowrequest)

PropertyDescription`channels`Type: `NSArray<NSString *>`Default:  
-List of channels for which here now information should be received.`channelGroups`Type: `NSArray<NSString *>`Default:  
-List of channel groups for which here now information should be received.`verbosityLevel`Type: `PNHereNowVerbosityLevel`Default:  
`PNHereNowState`One of `PNHereNowVerbosityLevel` fields to instruct what exactly data it expected in response.`limit`Type: `NSUInteger`Default:  
`1000`Maximum number of occupants to return per channel. Valid range: `0-1000`. Use `0` to get occupancy counts without user details.

### Sample code[​](#sample-code)

#### Get a list of uuids subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4
  
5// Basic configuration  
6PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
7                                                         subscribeKey:@"demo"  
8                                                               userID:@"hereNowUser"];  
9
  
10// Create a PubNub client instance  
11PubNub *client = [PubNub clientWithConfiguration:config];  
12
  
13// Add listener for PubNub events  
14[client addListener:self];  
15
  
16// First, set a state for this user (optional)  
17NSString *userID = client.currentConfiguration.userID;  
18PNPresenceStateSetRequest *stateRequest = [PNPresenceStateSetRequest requestWithUserId:userID];  
19stateRequest.state = @{@"status": @"online", @"device": @"mobile"};  
20stateRequest.channels = @[@"presence-demo"];  
21
  
22[client setPresenceStateWithRequest:stateRequest completion:^(PNClientStateUpdateStatus *status) {  
23    if (!status.isError) {  
24        NSLog(@"✅ State set successfully");  
25    }  
26}];  
27
  
28// Subscribe to a presence channel  
29PNSubscribeRequest *subscribeRequest = [PNSubscribeRequest requestWithChannels:@[@"presence-demo"]   
30                                                                channelGroups:nil];  
31subscribeRequest.observePresence = YES;  
32
  
33[client subscribeWithRequest:subscribeRequest];  
34
  
35// Example 1: Basic Here Now (occupancy only)  
36PNHereNowRequest *basicRequest = [PNHereNowRequest requestForChannels:@[@"presence-demo"]];  
37
  
38[client hereNowWithRequest:basicRequest   
39                completion:^(PNPresenceHereNowResult *result, PNErrorStatus *status) {  
40    if (!status.isError) {  
41        NSLog(@"✅ Basic Here Now successful!");  
42        NSLog(@"Channel: presence-demo");  
43        NSLog(@"Occupancy: %@", @(result.data.totalOccupancy));  
44    } else {  
45        NSLog(@"❌ Error getting basic Here Now: %@", status.errorData.information);  
46    }  
47}];  
48
  
49// Example 2: Here Now with UUID list  
50PNHereNowRequest *uuidRequest = [PNHereNowRequest requestForChannels:@[@"presence-demo"]];  
51uuidRequest.verbosityLevel = PNHereNowUUID;  
52
  
53[client hereNowWithRequest:uuidRequest   
54                completion:^(PNPresenceHereNowResult *result, PNErrorStatus *status) {  
55    if (!status.isError) {  
56        NSLog(@"✅ Here Now with UUIDs successful!");  
57        NSLog(@"Channel: presence-demo");  
58        NSLog(@"Occupancy: %@", @(result.data.totalOccupancy));  
59          
60        // Print list of UUIDs in the channel  
61        NSArrayPNPresenceUUIDData *> *uuids = result.data.channels[@"presence-demo"].uuids;  
62        NSLog(@"UUIDs in channel:");  
63        for (PNPresenceUUIDData *uuidData in uuids) {  
64            NSLog(@"- %@", uuidData.uuid);  
65        }  
66    } else {  
67        NSLog(@"❌ Error getting Here Now with UUIDs: %@", status.errorData.information);  
68    }  
69}];  
70
  
71// Example 3: Here Now with state information  
72PNHereNowRequest *stateRequest = [PNHereNowRequest requestForChannels:@[@"presence-demo"]];  
73stateRequest.verbosityLevel = PNHereNowState;  
74
  
75[client hereNowWithRequest:stateRequest   
76                completion:^(PNPresenceHereNowResult *result, PNErrorStatus *status) {  
77    if (!status.isError) {  
78        NSLog(@"✅ Here Now with state information successful!");  
79        NSLog(@"Channel: presence-demo");  
80        NSLog(@"Occupancy: %@", @(result.data.totalOccupancy));  
81          
82        // Print list of UUIDs with their state in the channel  
83        NSArrayPNPresenceUUIDData *> *uuids = result.data.channels[@"presence-demo"].uuids;  
84        NSLog(@"UUID states in channel:");  
85        for (PNPresenceUUIDData *uuidData in uuids) {  
86            NSLog(@"- UUID: %@", uuidData.uuid);  
87              
88            if (uuidData.state) {  
89                NSLog(@"  State: %@", uuidData.state);  
90            } else {  
91                NSLog(@"  State: (none)");  
92            }  
93        }  
94    } else {  
95        NSLog(@"❌ Error getting Here Now with state: %@", status.errorData.information);  
96    }  
97}];  
98
  
99// Required PNEventsListener methods  
100- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
101    // Checking connectivity only using subscribe operation.  
102    if (status.operation != PNSubscribeOperation) return;  
103      
104    // Checking connectivity only using subscribe operation.  
105    if (status.operation != PNSubscribeOperation) return;  
106      
107    if (status.category == PNConnectedCategory) {  
108        NSLog(@"✅ Successfully connected to PubNub!");  
109    } else if (status.isError) {  
110        NSLog(@"❌ PubNub connection error: %@", status);  
111    }  
112}  
113
  
114- (void)client:(PubNub *)client didReceivePresenceEvent:(PNPresenceEventResult *)event {  
115    NSLog(@"👀 Presence event: %@ for UUID: %@ on channel: %@",   
116          event.data.presenceEvent,   
117          event.data.uuid,   
118          event.data.channel);  
119      
120    if (event.data.presence.state) {  
121        NSLog(@"   with state: %@", event.data.presence.state);  
122    }  
123}  

```

### Response[​](#response)

```
1@interface PNPresenceGlobalHereNowData : PNServiceData  
2
  
3// Active channels list.  
4@property (nonatomic, readonly, strong) NSDictionary$lt;NSString *, NSDictionary *> *channels;  
5// Total number of active channels.  
6@property (nonatomic, readonly, strong) NSNumber *totalChannels;  
7// Total number of subscribers.  
8@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;  
9
  
10@end  
11
  
12@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData  
13
  
14@end  
15
  
16@interface PNPresenceChannelGroupHereNowResult : PNResult  
17
  
18// Stores reference on channel group presence request processing information.  
19@property (nonatomic, nonnull, readonly, strong) PNPresenceChannelGroupHereNowData *data;  
20
  
21@end  

```

### Other examples[​](#other-examples)

#### Returning state[​](#returning-state)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
1/**  
2    With PNHereNowState client aside from occupancy and unique identifiers will will pull out  
3    state information associated with them.  
4    */  
5[self.client hereNowForChannel: @"my_channel" withVerbosity:PNHereNowState  
6                    completion:^(PNPresenceChannelHereNowResult *result,  
7                                    PNErrorStatus *status) {  
8
  
9    if (!status) {  
10
  
11        /**  
12            Handle downloaded presence information using:  
13            result.data.uuids - list of uuids. Each uuid entry will have next  
14                                fields: "uuid" - identifier and "state" if it  
15                                has been provided.  
16            result.data.occupancy - total number of active subscribers.  
17            */  
18    }  
19    else {  
20
  
21        /**  
22            Handle presence audit error. Check 'category' property  
23            to find out possible reason because of which request did fail.  
24            Review 'errorData' property (which has PNErrorData data type) of status  
25            object to get additional information about issue.  
26
  
27            Request can be resent using: [status retry];  
28            */  
29    }  
30}];  

```

##### Example response[​](#example-response)

```
`1{  
2    "status" : 200,  
3    "message" : "OK",  
4    "service" : "Presence",  
5    "uuids" : [  
6        {  
7            "uuid" : "myUUID0"  
8        },  
9        {  
10            "state" : {  
11                "abcd" : {  
12                    "age" : 15  
13                }  
14            },  
15            "uuid" : "myUUID1"  
16        },  
17        {  
18            "uuid" : "b9eb408c-bcec-4d34-b4c4-fabec057ad0d"  
19        },  
20        {  
21            "state" : {  
22                "abcd" : {  
23                    "age" : 15  
24                }  
25            },  
26            "uuid" : "myUUID2"  
27        },  
28        {  
29            "state" : {  
30                "abcd" : {  
31                    "age" : 24  
32                }  
33            },  
34            "uuid" : "myUUID9"  
35        }  
36    ],  
37    "occupancy" : 5  
38}  
`
```

#### Return occupancy only[​](#return-occupancy-only)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
1// With PNHereNowOccupancy client will pull out only occupancy information.  
2[self.client hereNowForChannel: @"my_channel" withVerbosity:PNHereNowOccupancy  
3                    completion:^(PNPresenceChannelHereNowResult *result,  
4                                    PNErrorStatus *status) {  
5    if (!status) {  
6
  
7        /**  
8            Handle downloaded presence information using:  
9            result.data.occupancy - total number of active subscribers.  
10            */  
11    }  
12    else {  
13
  
14        /**  
15            Handle presence audit error. Check 'category' property  
16            to find out possible reason because of which request did fail.  
17            Review 'errorData' property (which has PNErrorData data type) of status  
18            object to get additional information about issue.  
19
  
20            Request can be resent using: [status retry];  
21            */  
22    }  
23}];  

```

##### Example response[​](#example-response-1)

```
`1{  
2    "status": 200,  
3    "message": "OK",  
4    "payload": {  
5        "channels": {  
6            "81d8d989-b95f-443c-a726-04fac323b331": {  
7                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
8                "occupancy": 1  
9            },  
10            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
11                "uuids": [ "91363e7f-584b-49cc-822c-52c2c01e5928" ],  
12                "occupancy": 1  
13            },  
14            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
15                "uuids": [ "ccfac1dd-b3a5-4afd-9fd9-db11aeb65395" ],  
16                "occupancy": 1  
17            }  
18        },  
19        "total_channels": 3,  
20        "total_occupancy": 3  
21    },  
22    "service": "Presence"  
23}  
`
```

---

## Here now for channel groups[​](#here-now-for-channel-groups)

Returns presence for a channel group (UUIDs + optional state per channel, plus occupancy).

### Method(s)[​](#methods-1)

```
`1- (void)hereNowForChannelGroup:(NSString *)group   
2                withCompletion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringReference on `channel` `group` for which here now information should be received.`block` *Type: PNChannelGroupHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of here now operation; status - in case if `error` occurred during request processing.

```
`1- (void)hereNowForChannelGroup:(NSString *)group   
2                 withVerbosity:(PNHereNowVerbosityLevel)level   
3                    completion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringReference on `channel` `group` for which here now information should be received.`level` *Type: PNHereNowVerbosityLevelReference on one of `PNHereNowVerbosityLevel` fields to instruct what exactly data it expected in response.`block` *Type: PNChannelGroupHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of here now operation; status - in case if `error` occurred during request processing.

### Sample code[​](#sample-code-1)

#### Here now for channel groups[​](#here-now-for-channel-groups-1)

```
1[self.client hereNowForChannelGroup:@"my_group"  
2                      withCompletion:^(PNPresenceChannelGroupHereNowResult *result,  
3                                       PNErrorStatus *status) {  
4
  
5    if (!status) {  
6
  
7        /**  
8         Handle downloaded presence information using:  
9            result.data.channels - dictionary with active channels and presence information on  
10                                   each. Each channel will have next fields: "uuids" - list of  
11                                   subscribers; occupancy - number of active subscribers.  
12                                   Each uuids entry has next fields: "uuid" - identifier and  
13                                   "state" if it has been provided.  
14            result.data.totalChannels - total number of active channels.  
15            result.data.totalOccupancy - total number of active subscribers.  
16         */  
17    }  
18    else {  
19
  
20        /**  
21         Handle presence audit error. Check 'category' property  
22         to find out possible reason because of which request did fail.  
23         Review 'errorData' property (which has PNErrorData data type) of status  
24         object to get additional information about issue.  
25
  
26         Request can be resent using: status.retry()  
27         */  
28    }  
29 }];  

```

### Response[​](#response-1)

```
1@interface PNPresenceGlobalHereNowData : PNServiceData  
2
  
3// Active channels list.  
4@property (nonatomic, readonly, strong) NSDictionary$lt;NSString *, NSDictionary *> *channels;  
5// Total number of active channels.  
6@property (nonatomic, readonly, strong) NSNumber *totalChannels;  
7// Total number of subscribers.  
8@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;  
9
  
10@end  
11
  
12@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData  
13
  
14@end  
15
  
16@interface PNPresenceChannelGroupHereNowResult : PNResult  
17
  
18// Stores reference on channel group presence request processing information.  
19@property (nonatomic, nonnull, readonly, strong) PNPresenceChannelGroupHereNowData *data;  
20
  
21@end  

```

---

## Where now[​](#where-now)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Returns the list of channels a UUID is subscribed to.

##### Timeout events

If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)[​](#methods-2)

```
`1- (void)whereNowUUID:(NSString *)uuid   
2      withCompletion:(PNWhereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on `UUID` for which request should be performed.`block` *Type: PNWhereNowCompletionBlockWhere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of where now operation; status - in case if error occurred during request processing.

### Sample code[​](#sample-code-2)

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
1[self.client whereNowUUID:self.client.uuid withCompletion:^(PNPresenceWhereNowResult *result,  
2                                                            PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        // Handle downloaded presence 'where now' information using: result.data.channels  
7    }  
8    else {  
9
  
10        /**  
11         Handle presence audit error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15
  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19 }];  

```

### Response[​](#response-2)

```
1@interface PNPresenceWhereNowData : PNServiceData  
2
  
3// List of channels on which client subscribed.  
4@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
5
  
6@end  
7
  
8@interface PNPresenceWhereNowResult : PNResult  
9
  
10// Stores reference on client presence request processing information.  
11@property (nonatomic, readonly, strong) PNPresenceWhereNowData *data;  
12
  
13@end  

```

---

## User state[​](#user-state)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Set/get ephemeral per-user state on one or more channels (lost on disconnect; not persisted). See [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-3)

#### Set state[​](#set-state)

```
`1- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
2         forUUID:(NSString *)uuid   
3       onChannel:(NSString *)channel   
4  withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`state`Type: NSDictionaryReference on dictionary which should be bound to `uuid` on specified channel.`If value is nil, state will be removed for` uuid `on` channel.`uuid` *Type: NSStringReference on unique user identifier for which `state` should be bound.`channel` *Type: NSStringName of the `channel` which will store provided state information for `uuid`.`block`Type: PNSetStateCompletionBlockState modification for user on `channel` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

```
`1- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
2           forUUID:(NSString *)uuid  
3    onChannelGroup:(NSString *)group  
4    withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`state`Type: NSDictionaryReference on dictionary which should be bound to `uuid` on specified channel group.`If value is nil, state will be removed for` uuid `on` group.`uuid` *Type: NSStringReference on unique user identifier for which `state` should be bound.`group` *Type: NSStringName of channel group which will store provided state information for `uuid`.`block`Type: PNSetStateCompletionBlockState modification for user on `channel` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Get state[​](#get-state)

```
`1- (void)stateForUUID:(NSString *)uuid  
2           onChannel:(NSString *)channel  
3      withCompletion:(PNChannelStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on unique user identifier for which state should be retrieved.`channel` *Type: NSStringName of channel from which state information for `uuid` will be pulled out.`block` *Type: PNChannelStateCompletionBlockState audition for user on `cahnnel` processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case if `error` occurred during request processing.

```
`1- (void)stateForUUID:(NSString *)uuid  
2      onChannelGroup:(NSString *)group  
3      withCompletion:(PNChannelGroupStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on unique user identifier for which state should be retrieved.`group` *Type: NSStringName of `channel` `group` from which state information for `uuid` will be pulled out.`block` *Type: PNChannelGroupStateCompletionBlockState audition for user on `cahnnel` `group` processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case if error occurred during request processing.

### Sample code[​](#sample-code-3)

#### Set state[​](#set-state-1)

```
1[self.client setState: @{@"Key": @"Value"} forUUID:self.client.uuid onChannel: @"my_channel"  
2       withCompletion:^(PNClientStateUpdateStatus *status) {  
3
  
4    if (!status.isError) {  
5
  
6        // Client state successfully modified on specified channel.  
7    }  
8    else {  
9
  
10        /**  
11         Handle client state modification error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15
  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19}];  

```

#### Get state[​](#get-state-1)

```
1[self.client stateForUUID:self.client.uuid onChannel:@"chat"  
2            withCompletion:^(PNChannelClientStateResult *result, PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        // Handle downloaded state information using: result.data.state  
7    }  
8    else{  
9
  
10        /**  
11         Handle client state audit error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15
  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19 }];  

```

### Response[​](#response-3)

#### Set state[​](#set-state-2)

```
1@interface PNClientStateUpdateData : PNChannelClientStateData  
2
  
3@end  
4
  
5@interface PNClientStateUpdateStatus : PNErrorStatus  
6
  
7// Stores reference on client state for channel request processing information.  
8@property (nonatomic, nonnull, readonly, strong) PNClientStateUpdateData *data;  
9
  
10@end  

```

#### Get state[​](#get-state-2)

```
1@interface PNChannelClientStateData : PNServiceData  
2
  
3// User-provided client state information.  
4@property (nonatomic, readonly, strong) NSDictionaryNSString *, id> *state;  
5
  
6@end  
7
  
8@interface PNChannelClientStateResult : PNResult  
9
  
10// Stores reference on client state for channel request processing information.  
11@property (nonatomic, readonly, strong) PNChannelClientStateData *data;  
12
  
13@end  

```

```
1@interface PNChannelGroupClientStateData : PNServiceData  
2
  
3// Multi channel client state information.  
4@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSDictionary *> *channels;  
5
  
6@end  
7
  
8@interface PNChannelGroupClientStateResult : PNResult  
9
  
10// Stores reference on client state for channel group request processing information.  
11@property (nonatomic, readonly, strong) PNChannelGroupClientStateData *data;  
12
  
13@end  

```

---

## User state (builder pattern)[​](#user-state-builder-pattern)

##### Requires Presence

Presence add-on must be enabled for the key.  
Presence events reference: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Builder-style API for set/audit state (JSON key/value pairs) for a subscriber UUID. Optional arguments can be omitted.

### Method(s)[​](#methods-4)

#### Set state[​](#set-state-3)

```
`1state()  
2    .set()  
3    .uuid(NSString *)  
4    .state(NSDictionary *)  
5    .channels(NSArrayNSString *> *)  
6    .channelGroups(NSArrayNSString *> *)  
7    .performWithCompletion(PNSetStateCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringUnique user identifier for which state should be bound. Current `PubNub` user ID will be used by default if not set or set to `nil`.`state`Type: NSDictionaryData which should be bound to specified `uuid` on `channels` / `channelGroups`.`channels`Type: `NSArray<NSString *>`List of the channel names which will store provided `state` information for `uuid`. Not required if `channelGroups` is set.`channelGroups`Type: `NSArray<NSString *>`List of channel group names which will store provided `state` information for `uuid`. Not required if `channels` is set.`completion`Type: PNSetStateCompletionBlockState modification for user on channel / channel group completion block which pass only one argument - request status reports state change was successful or not (`errorData` contains error information in case of failure).

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Get state[​](#get-state-3)

```
`1state()  
2    .audit()  
3    .uuid(NSString *)  
4    .channels(NSArrayNSString *> *)  
5    .channelGroups(NSArrayNSString *> *)  
6    .performWithCompletion(PNGetStateCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringUnique user identifier for which state should be retrieved. Current `PubNub`  user ID will be used by default if not set or set to `nil`.`channels`Type: `NSArray<NSString *>`List of the channel names from which state information for `uuid` will be pulled out. Not required if `channelGroups` is set.`channelGroups`Type: `NSArray<NSString *>`List of channel group names from which state information for `uuid` will be pulled out. Not required if `channels` is set.`completion` *Type: PNGetStateCompletionBlockState audition for user on channel / channel group completion block which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case of error occurred during request processing.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Sample code[​](#sample-code-4)

#### Set state[​](#set-state-4)

```
1self.client.state().set().state(@{@"state": @"test"})  
2    .channels(@[@"channel1", @"channel12"])  
3    .channelGroups(@[@"group1", @"group2"])  
4    .performWithCompletion(^(PNClientStateUpdateStatus *status) {  
5
  
6        if (!status.isError) {  
7            // Client state successfully modified on specified channels and groups.  
8        } else {  
9            /**  
10             Handle client state modification error. Check 'category' property  
11             to find out possible reason because of which request did fail.  
12             Review 'errorData' property (which has PNErrorData data type) of status  
13             object to get additional information about issue.  
14
  
15             Request can be resent using: [status retry]  
16            */  
17        }  
18    });  

```

#### Get state[​](#get-state-4)

```
1self.client.state().audit().uuid(@"PubNub")  
2    .channels(@[@"channel1", @"channel12"])  
3    .channelGroups(@[@"group1", @"group2"])  
4    .performWithCompletion(^(PNClientStateGetResult *result, PNErrorStatus *status) {  
5
  
6        if (!status.isError) {  
7            // Handle downloaded state information using: result.data.channels  
8        } else {  
9            /**  
10             Handle client state audit error. Check 'category' property  
11             to find out possible reason because of which request did fail.  
12             Review 'errorData' property (which has PNErrorData data type) of status  
13             object to get additional information about issue.  
14
**15             Request can be resent using: [status retry]  
16            */  
17        }  
18    });  

```