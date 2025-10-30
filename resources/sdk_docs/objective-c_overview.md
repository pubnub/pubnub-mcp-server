# Objective-C API & SDK Docs 6.1.0

Build a simple app that connects to PubNub and sends/receives messages.

## Setup

### Get your PubNub keys

- Sign in or create an account on the PubNub Admin Portal.
- Create an app and use the generated keyset.
- Get your publish and subscribe keys from the app dashboard.
- Use separate keysets for dev/prod.

### Install the SDK

##### SDK version
Use the latest SDK version.

Download the SDK using one of the following:

### Use CocoaPods

Install/update CocoaPods, create a Podfile, and install:

```
`1pod init  
`
```

```
1platform :ios, '14.0'  
2
  
3 target 'application-target-name' do  
4     use_frameworks!  
5
  
6     pod "PubNub", "~> 5"  
7 end  
```

Run pod install, then use the generated workspace. Import in classes where you use PubNub:

```
`1#import PubNub/PubNub.h>  
`
```

### Use Carthage

Add PubNub to your Cartfile and build:

```
`1github "pubnub/objective-c" ~> 4  
`
```

```
`1carthage update --no-use-binaries  
`
```

Specify platform if needed:

```
`1carthage update --platform ios --no-use-binaries  
`
```

Then:
- Open Carthage/Build/<platform> (e.g., iOS).
- Drag PubNub.framework into your app target.
- In General > Embedded Binaries, add PubNub.framework.
- Import PubNub headers:

```
`1#import PubNub/PubNub.h>  
`
```

### Source code

Clone the GitHub repository:

```
`1git clone https://github.com/pubnub/objective-c  
`
```

View the supported platforms.

## Steps

### Initialize PubNub

Open your workspace (from CocoaPods) and in AppDelegate:

```
1@interface AppDelegate () PNEventsListener>  
2
  
3// Stores reference on PubNub client to make sure what it won't be released.  
4@property (nonatomic, strong) PubNub *client;  
5
  
6@end  
```

Minimum configuration (replace myPublishKey/mySubscribeKey and set a UUID):

```
1// Initialize and configure PubNub client instance  
2PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey: @"myPublishKey" subscribeKey:@"mySubscribeKey"];  
3configuration.uuid = @"myUniqueUUID";  
4
  
5self.client = [PubNub clientWithConfiguration:configuration];  
```

### Set up event listeners

Add listener and handle messages/status:

```
1[self.client addListener:self];  
2
  
3- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
4    // Handle new message stored in message.data.message  
5  
6    if (![message.data.channel isEqualToString:message.data.subscription]) {  
7        // Message has been received on channel group stored in message.data.subscription.  
8    } else {  
9        // Message has been received on channel stored in message.data.channel.  
10    }  
11  
12    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@"msg"],  
13          message.data.channel, message.data.timetoken);  
14}  
15
  
16- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
17    if (status.operation == PNSubscribeOperation) {  
18        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
19            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
20            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
21  
22            if (subscribeStatus.category == PNConnectedCategory) {  
23                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
24  
25                // Select last object from list of subscribed channels and send message to it.  
26                NSString *targetChannel = [client channels].lastObject;  
27                [self.client publish:@{ @"msg": @"hello" } toChannel:targetChannel  
28                      withCompletion:^(PNPublishStatus *publishStatus) {  
29  
30                        if (!publishStatus.isError) {  
31                            // Message successfully published to specified channel.  
32                        } else {  
33                            /**  
34                             * Handle message publish error. Check 'category' property to find out  
35                             * possible reason because of which request did fail.  
36                             * Review 'errorData' property (which has PNErrorData data type) of status  
37                             * object to get additional information about issue.  
38                             *  
39                             * Request can be resent using: [publishStatus retry];  
40                             */  
41                        }  
42                }];  
43            } else {  
44                /**  
45                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was  
46                 * an error but there is no longer any issue.  
47                 */  
48            }  
49        } else if (status.category == PNUnexpectedDisconnectCategory) {  
50            /**  
51             * This is usually an issue with the internet connection, this is an error, handle  
52             * appropriately retry will be called automatically.  
53             */  
54        } else {  
55            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
56  
57            if (errorStatus.category == PNAccessDeniedCategory) {  
58                /**  
59                 * This means that Access Manager does allow this client to subscribe to this channel and channel group  
60                 * configuration. This is another explicit error.  
61                 */  
62            } else {  
63                /**  
64                 * More errors can be directly specified by creating explicit cases for other error categories  
65                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
66                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
67                 * or `PNNetworkIssuesCategory`  
68                 */  
69            }  
70        }  
71    }  
72}  
```

### Publish and subscribe

Subscribe to receive messages; publish sends to subscribers of that channel.

Subscribe:

```
`1[self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];  
`
```

See Publish and Subscribe docs.

## Complete example

Your AppDelegate should look like:

```
1!-- MACOS -->  
2
  
3@interface AppDelegate () PNEventsListener>  
4
  
5// Stores reference on PubNub client to make sure what it won't be released.  
6@property (nonatomic, strong) PubNub *client;  
7
  
8@end  
9
  
10@implementation PNAppDelegate  
11  
12- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {  
13    // Initialize and configure PubNub client instance  
14    PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"myPublishKey"  
15                                                                     subscribeKey:@"mySubscribeKey"];  
16    configuration.uuid = @"myUniqueUUID";  
17  
18    self.client = [PubNub clientWithConfiguration:configuration];  
19    [self.client addListener:self];  
20    [self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];}  
21  
22- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
23    // Handle new message stored in message.data.message  
24  
25    if (![message.data.channel isEqualToString:message.data.subscription]) {  
26        // Message has been received on channel group stored in message.data.subscription.  
27    } else {  
28        // Message has been received on channel stored in message.data.channel.  
29    }  
30  
31    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@ "msg"],  
32          message.data.channel, message.data.timetoken);  
33}  
34  
35- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
36    if (status.operation == PNSubscribeOperation) {  
37        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
38            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
39            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
40  
41            if (subscribeStatus.category == PNConnectedCategory) {  
42                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
43  
44                // Select last object from list of subscribed channels and send message to it.  
45                NSString *targetChannel = [client channels].lastObject;  
46                [self.client publish: @{ @ "msg": @"hello" } toChannel:targetChannel  
47                      withCompletion:^(PNPublishStatus *publishStatus) {  
48  
49                        if (!publishStatus.isError) {  
50                            // Message successfully published to specified channel.  
51                        } else {  
52                            /**  
53                             * Handle message publish error. Check 'category' property to find out  
54                             * possible reason because of which request did fail.  
55                             * Review 'errorData' property (which has PNErrorData data type) of status  
56                             * object to get additional information about issue.  
57                             *  
58                             * Request can be resent using: [publishStatus retry];  
59                             */  
60                        }  
61                }];  
62            } else {  
63                /**  
64                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was  
65                 * an error but there is no longer any issue.  
66                 */  
67            }  
68        } else if (status.category == PNUnexpectedDisconnectCategory) {  
69            /**  
70             * This is usually an issue with the internet connection, this is an error, handle  
71             * appropriately retry will be called automatically.  
72             */  
73        } else {  
74            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
75  
76            if (errorStatus.category == PNAccessDeniedCategory) {  
77                /**  
78                 * This means that Access Manager does allow this client to subscribe to this channel and channel group  
79                 * configuration. This is another explicit error.  
80                 */  
81            } else {  
82                /**  
83                 * More errors can be directly specified by creating explicit cases for other error categories  
84                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
85                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
86                 * or `PNNetworkIssuesCategory`  
87                 */  
88            }  
89        }  
90    }  
91}  
92@end  
93  
94!-- OTHER PLATFORMS -->  
95  
96@interface AppDelegate () PNEventsListener>  
97  
98// Stores reference on PubNub client to make sure what it won't be released.  
99@property (nonatomic, strong) PubNub *client;  
100  
101@end  
102  
103@implementation PNAppDelegate  
104  
105- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {  
106    // Initialize and configure PubNub client instance  
107    PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"myPublishKey"  
108                                                                     subscribeKey:@"mySubscribeKey"];  
109    configuration.uuid = @"myUniqueUUID";  
110  
111    self.client = [PubNub clientWithConfiguration:configuration];  
112    [self.client addListener:self];  
113    [self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];  
114}  
115  
116- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
117    // Handle new message stored in message.data.message  
118  
119    if (![message.data.channel isEqualToString:message.data.subscription]) {  
120        // Message has been received on channel group stored in message.data.subscription.  
121    } else {  
122        // Message has been received on channel stored in message.data.channel.  
123    }  
124  
125    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@ "msg"],  
126          message.data.channel, message.data.timetoken);  
127}  
128  
129- (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
130    if (status.operation == PNSubscribeOperation) {  
131        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
132            // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
133            PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
134  
135            if (subscribeStatus.category == PNConnectedCategory) {  
136                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
137  
138                // Select last object from list of subscribed channels and send message to it.  
139                NSString *targetChannel = [client channels].lastObject;  
140                [self.client publish: @{ @ "msg": @"hello" } toChannel:targetChannel  
141                      withCompletion:^(PNPublishStatus *publishStatus *publishStatus) {  
142  
143                        if (!publishStatus.isError) {  
144                            // Message successfully published to specified channel.  
145                        } else {  
146                            /**  
147                             * Handle message publish error. Check 'category' property to find out  
148                             * possible reason because of which request did fail.  
149                             * Review 'errorData' property (which has PNErrorData data type) of status  
150                             * object to get additional information about issue.  
151                             *  
152                             * Request can be resent using: [publishStatus retry];  
153                             */  
154                        }  
155                }];  
156            } else {  
157                /**  
158                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was  
159                 * an error but there is no longer any issue.  
160                 */  
161            }  
162        } else if (status.category == PNUnexpectedDisconnectCategory) {  
163            /**  
164             * This is usually an issue with the internet connection, this is an error, handle  
165             * appropriately retry will be called automatically.  
166             */  
167        } else {  
168            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
169  
170            if (errorStatus.category == PNAccessDeniedCategory) {  
171                /**  
172                 * This means that Access Manager does allow this client to subscribe to this channel and channel group  
173                 * configuration. This is another explicit error.  
174                 */  
175            } else {  
176                /**  
177                 * More errors can be directly specified by creating explicit cases for other error categories  
178                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
179                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
180                 * or `PNNetworkIssuesCategory`  
181                 */  
182            }  
183        }  
184    }  
185}  
186@end  
```

Run the app and you should see:

```
`1Received message: Hello on channel hello-world-channel at 15844898827972406  
`
```

### Walkthrough

Order of operations:
- Configure PubNub client
- Add status and message listeners
- Subscribe to a channel
- Publish a message on connect

#### Configuring PubNub

```
1// Initialize and configure PubNub client instance  
2PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey: @"myPublishKey" subscribeKey: @"mySubscribeKey"];  
3configuration.uuid = @"myUniqueUUID";  
4
  
5self.client = [PubNub clientWithConfiguration:configuration];  
```

#### Add event listeners

```
1[self.client addListener:self];  
2
  
3- (void)client:(PubNub *)client didReceiveMessage:(PNMessageResult *)message {  
4    // Handle new message stored in message.data.message  
5  
6    if (![message.data.channel isEqualToString:message.data.subscription]) {  
7        // Message has been received on channel group stored in message.data.subscription.  
8    } else {  
9        // Message has been received on channel stored in message.data.channel.  
10    }  
11  
12    NSLog(@"Received message: %@ on channel %@ at %@", message.data.message[@"msg"],  
13          message.data.channel, message.data.timetoken);  
14 }  
15
  
16 - (void)client:(PubNub *)client didReceiveStatus:(PNStatus *)status {  
17    if (status.operation == PNSubscribeOperation) {  
18        if (status.category == PNConnectedCategory || status.category == PNReconnectedCategory) {  
19             // Status object for those categories can be casted to `PNSubscribeStatus` for use below.  
20             PNSubscribeStatus *subscribeStatus = (PNSubscribeStatus *)status;  
21  
22            if (subscribeStatus.category == PNConnectedCategory) {  
23                // This is expected for a subscribe, this means there is no error or issue whatsoever.  
24  
25                // Select last object from list of subscribed channels and send message to it.  
26                NSString *targetChannel = [client channels].lastObject;  
27                [self.client publish:@{ @"msg": @"hello" } toChannel:targetChannel  
28                      withCompletion:^(PNPublishStatus *publishStatus) {  
29  
30                        if (!publishStatus.isError) {  
31                            // Message successfully published to specified channel.  
32                        } else {  
33                            /**  
34                             * Handle message publish error. Check 'category' property to find out  
35                             * possible reason because of which request did fail.  
36                             * Review 'errorData' property (which has PNErrorData data type) of status  
37                             * object to get additional information about issue.  
38                             *  
39                             * Request can be resent using: [publishStatus retry];  
40                             */  
41                        }  
42                }];  
43            } else {  
44                /**  
45                 * This usually occurs if subscribe temporarily fails but reconnects. This means there was  
46                 * an error but there is no longer any issue.  
47                 */  
48            }  
49        } else if (status.category == PNUnexpectedDisconnectCategory) {  
50            /**  
51             * This is usually an issue with the internet connection, this is an error, handle  
52             * appropriately retry will be called automatically.  
53             */  
54        } else {  
55            PNErrorStatus *errorStatus = (PNErrorStatus *)status;  
56  
57            if (errorStatus.category == PNAccessDeniedCategory) {  
58                /**  
59                 * This means that Access Manager does allow this client to subscribe to this channel and channel group  
60                 * configuration. This is another explicit error.  
61                 */  
62            } else {  
63                /**  
64                 * More errors can be directly specified by creating explicit cases for other error categories  
65                 * of `PNStatusCategory` such as: `PNDecryptionErrorCategory`,  
66                 * `PNMalformedFilterExpressionCategory`, `PNMalformedResponseCategory`, `PNTimeoutCategory`  
67                 * or `PNNetworkIssuesCategory`  
68                 */  
69            }  
70        }  
71    }  
72}  
```

#### Publishing and subscribing

Publish on connect:

```
`1[self.client publish: @{ @"msg": @"Hello" } toChannel:targetChannel  
2      withCompletion:^(PNPublishStatus *publishStatus) {  
3}];  
`
```

Subscribe:

```
`1[self.client subscribeToChannels: @[@"hello-world-channel"] withPresence:YES];  
`
```

## Next steps

Explore the SDK reference documentation for full API details.