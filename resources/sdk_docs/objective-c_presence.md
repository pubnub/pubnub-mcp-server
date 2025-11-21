# Presence API for Objective-C SDK

Presence provides:
- Joins/leaves per channel
- Occupancy (user count) per channel
- Channels a UUID is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. See Presence Events for subscribing to presence channels.

## Here now

Returns current presence info for channels/channel groups: UUIDs and occupancy.

- Cache: 3 seconds.

### Method(s)

```
`1- (void)hereNowWithRequest:(PNHereNowRequest *)request   
2                completion:(PNHereNowCompletionBlock)block;  
`
```

Parameters:
- request: Type: PNHereNowRequest. Payload describing presence request.
- block: Type: PNHereNowCompletionBlock. Completion with result (success) or status (error).

#### PNHereNowRequest

- channels: Type: NSArray<NSString *> — List of channels to query.
- channelGroups: Type: NSArray<NSString *> — List of channel groups to query.
- verbosityLevel: Type: PNHereNowVerbosityLevel — Default: PNHereNowState. Controls detail in response.
- limit: Type: NSUInteger — Default: 1000. Range: 0–1000. Use 0 for occupancy only.

### Sample code

#### Get a list of uuids subscribed to channel

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

### Response

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

## Other examples

Requires Presence.

#### Returning state

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

##### Example response

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

#### Return occupancy only

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

##### Example response

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

## Here now for channel groups

Request presence info for a channel group: UUIDs, per-channel occupancy, total channels, total occupancy.

### Method(s)

```
`1- (void)hereNowForChannelGroup:(NSString *)group   
2                withCompletion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

Parameters:
- group: Type: NSString — Channel group name.
- block: Type: PNChannelGroupHereNowCompletionBlock — Completion with result or status.

```
`1- (void)hereNowForChannelGroup:(NSString *)group   
2                 withVerbosity:(PNHereNowVerbosityLevel)level   
3                    completion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

Parameters:
- group: Type: NSString — Channel group name.
- level: Type: PNHereNowVerbosityLevel — Response detail.
- block: Type: PNChannelGroupHereNowCompletionBlock — Completion with result or status.

### Sample code

#### Here now for channel groups

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

### Response

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

## Where now

Returns the list of channels a UUID is subscribed to.

- Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1- (void)whereNowUUID:(NSString *)uuid   
2      withCompletion:(PNWhereNowCompletionBlock)block;  
`
```

Parameters:
- uuid: Type: NSString — UUID to query.
- block: Type: PNWhereNowCompletionBlock — Completion with result or status.

### Sample code

#### Get a list of channels a UUID is subscribed to

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

### Response

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

## User state

Set and get dynamic custom state for a UUID on channels or channel groups. State exists while subscribed and is not persisted.

### Method(s)

#### Set state

```
`1- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
2         forUUID:(NSString *)uuid   
3       onChannel:(NSString *)channel   
4  withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

Parameters:
- state: Type: NSDictionary — Key/value state to bind to uuid on channel. nil removes state.
- uuid: Type: NSString — Target UUID.
- channel: Type: NSString — Target channel.
- block: Type: PNSetStateCompletionBlock — Completion status only.

```
`1- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
2           forUUID:(NSString *)uuid  
3    onChannelGroup:(NSString *)group  
4    withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

Parameters:
- state: Type: NSDictionary — State for uuid on group. nil removes state.
- uuid: Type: NSString — Target UUID.
- group: Type: NSString — Target channel group.
- block: Type: PNSetStateCompletionBlock — Completion status only.

#### Get state

```
`1- (void)stateForUUID:(NSString *)uuid  
2           onChannel:(NSString *)channel  
3      withCompletion:(PNChannelStateCompletionBlock)block;  
`
```

Parameters:
- uuid: Type: NSString — UUID to retrieve state for.
- channel: Type: NSString — Channel to query.
- block: Type: PNChannelStateCompletionBlock — Completion with result or status.

```
`1- (void)stateForUUID:(NSString *)uuid  
2      onChannelGroup:(NSString *)group  
3      withCompletion:(PNChannelGroupStateCompletionBlock)block;  
`
```

Parameters:
- uuid: Type: NSString — UUID to retrieve state for.
- group: Type: NSString — Channel group to query.
- block: Type: PNChannelGroupStateCompletionBlock — Completion with result or status.

### Sample code

#### Set state

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

#### Get state

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

### Response

#### Set state

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

#### Get state

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

## User state (builder pattern)

Set/get state using builder API.

### Method(s)

#### Set state

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

Parameters:
- uuid: Type: NSString — UUID to bind state to. Defaults to current user ID if nil/not set.
- state: Type: NSDictionary — State data for specified UUID on channels/channelGroups.
- channels: Type: NSArray<NSString *> — Target channels (omit if using channelGroups).
- channelGroups: Type: NSArray<NSString *> — Target groups (omit if using channels).
- completion: Type: PNSetStateCompletionBlock — Completion status (errorData on failure).

Note: Builder pattern; optional arguments can be omitted.

#### Get state

```
`1state()  
2    .audit()  
3    .uuid(NSString *)  
4    .channels(NSArrayNSString *> *)  
5    .channelGroups(NSArrayNSString *> *)  
6    .performWithCompletion(PNGetStateCompletionBlock);  
`
```

Parameters:
- uuid: Type: NSString — UUID to retrieve. Defaults to current user ID if nil/not set.
- channels: Type: NSArray<NSString *> — Channels to query (omit if using channelGroups).
- channelGroups: Type: NSArray<NSString *> — Groups to query (omit if using channels).
- completion: Type: PNGetStateCompletionBlock — Completion with result or status.

Note: Builder pattern; optional arguments can be omitted.

### Sample code

#### Set state

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

#### Get state

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