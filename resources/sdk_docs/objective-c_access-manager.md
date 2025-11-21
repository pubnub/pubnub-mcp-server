# Access Manager v3 API for Objective-C SDK

Access Manager v3 provides tokens with embedded permissions for PubNub resources (channels, channel groups, UUID metadata). Tokens can:
- Be time-limited (ttl).
- Target resources by explicit lists or regex patterns.
- Include mixed permission levels in a single grant.
- Optionally restrict usage to an authorized UUID.

Note: Objective-C SDK is client-only for Access Manager v3. It cannot grant permissions; it can only parse and set tokens from your server.

## Parse token

Decodes an existing token and returns permissions and metadata for inspection (e.g., ttl, authorized UUID, resource permissions).

### Method(s)

```
`1- (PNPAMToken *)parseAuthToken:(NSString *)token  
`
```

Parameter:
- token (String, required): Current token with embedded permissions.

### Sample code

```
1#import Foundation/Foundation.h>  
2#import PubNub/PubNub.h>  
3
  
4// 1. Initialize the PubNub client  
5PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"   
6                                                                 subscribeKey:@"demo"  
7                                                                       userID:@"testUser"];  
8PubNub *client = [PubNub clientWithConfiguration:configuration];  
9
  
10// 2. The token to parse (this is a sample token, make sure to use your own)  
11NSString *tokenString = @"p0F2AkF0Gmf_WKNDdHRsAUNyZXOlRGNoYW6hZnB1YmxpYxjvQ2dycKBDc3BjoEN1c3KgRHV1aWShcXBhbV9jY3BfY2hhdF91c2VyGGhDcGF0pURjaGFuoENncnCgQ3NwY6BDdXNyoER1dWlkoERtZXRhoENzaWdYIGT644KqTNFo-dk773m0OtXOaiRr-ngXe0wJ3c0A-v89";  
12
  
13NSLog(@"Parsing token: %@", tokenString);  
14
  
15// 3. Parse the token  
16PNPAMToken *token = [client parseAuthToken:tokenString];  
17      
18// 4. Check if parsing was successful  
19if (!token.error) {  
20    NSLog(@"Token parsed successfully!");  
21
  
22    // 5. Access token properties  
23    NSLog(@"Token properties:");  
24    NSLog(@"- Version: %@", @(token.version));  
25    NSLog(@"- TTL: %@", @(token.ttl));  
26    NSLog(@"- Timestamp: %@", @(token.timestamp));  
27    NSLog(@"- Authorized UUID: %@", token.authorizedUUID ?: @"None");  
28
  
29    // 6. Access explicit resources  
30    NSLog(@"\nExplicit Resources:");  
31
  
32    NSLog(@"Authorized channels:");  
33    if (token.resources.channels.count > 0) {  
34        [token.resources.channels enumerateKeysAndObjectsUsingBlock:^(NSString *channel, PNPAMResourcePermission *permission, BOOL *stop) {  
35            NSLog(@"  - %@: %@", channel, permission);  
36        }];  
37    } else {  
38        NSLog(@"  None");  
39    }  
40
  
41    NSLog(@"Authorized channel groups:");  
42    if (token.resources.groups.count > 0) {  
43        [token.resources.groups enumerateKeysAndObjectsUsingBlock:^(NSString *group, PNPAMResourcePermission *permission, BOOL *stop) {  
44            NSLog(@"  - %@: %@", group, permission);  
45        }];  
46    } else {  
47        NSLog(@"  None");  
48    }  
49
  
50    NSLog(@"Authorized UUIDs:");  
51    if (token.resources.uuids.count > 0) {  
52        [token.resources.uuids enumerateKeysAndObjectsUsingBlock:^(NSString *uuid, PNPAMResourcePermission *permission, BOOL *stop) {  
53            NSLog(@"  - %@: %@", uuid, permission);  
54        }];  
55    } else {  
56        NSLog(@"  None");  
57    }  
58
  
59    // 7. Access pattern-based permissions  
60    NSLog(@"\nPattern-based Permissions:");  
61  
62    NSLog(@"Channel patterns:");  
63    if (token.patterns.channels.count > 0) {  
64        [token.patterns.channels enumerateKeysAndObjectsUsingBlock:^(NSString *pattern, PNPAMResourcePermission *permission, BOOL *stop) {  
65            NSLog(@"  - Pattern '%@': %@", pattern, permission);  
66        }];  
67    } else {  
68        NSLog(@"  None");  
69    }  
70
  
71    NSLog(@"Channel group patterns:");  
72    if (token.patterns.groups.count > 0) {  
73        [token.patterns.groups enumerateKeysAndObjectsUsingBlock:^(NSString *pattern, PNPAMResourcePermission *permission, BOOL *stop) {  
74            NSLog(@"  - Pattern '%@': %@", pattern, permission);  
75        }];  
76    } else {  
77        NSLog(@"  None");  
78    }  
79
  
80    NSLog(@"UUID patterns:");  
81    if (token.patterns.uuids.count > 0) {  
82        [token.patterns.uuids enumerateKeysAndObjectsUsingBlock:^(NSString *pattern, PNPAMResourcePermission *permission, BOOL *stop) {  
83            NSLog(@"  - Pattern '%@': %@", pattern, permission);  
84        }];  
85    } else {  
86        NSLog(@"  None");  
87    }  
88
  
89    // 8. Access metadata if present  
90    if (token.meta.count > 0) {  
91        NSLog(@"\nToken metadata:");  
92        [token.meta enumerateKeysAndObjectsUsingBlock:^(NSString *key, id value, BOOL *stop) {  
93            NSLog(@"  - %@: %@", key, value);  
94        }];  
95    }  
96} else {  
97    NSLog(@"Failed to parse token: %@", token.error);  
98}  

```

### Returns

Returns a PNPAMToken instance:

```
1@interface PNPAMToken : NSObject  
2
  
3// Token version  
4@property (nonatomic, readonly, assign) NSUInteger version;  
5
  
6// Token generation date and time  
7@property (nonatomic, readonly, assign) NSUInteger timestamp;  
8
  
9// Maximum amount of time (in minutes) during which the token will be valid  
10@property (nonatomic, readonly, assign) NSUInteger ttl;  
11
  
12// The uuid that is exclusively authorized to use this token to make API requests  
13@property (nonatomic, nullable, readonly, strong) NSString *authorizedUUID;  
14
  
15// Permissions granted to specific resources  
16@property (nonatomic, readonly, strong) PNPAMTokenResource *resources;  
17
  
18// Permissions granted to resources which match a specified regular expression  
19@property (nonatomic, readonly, strong) PNPAMTokenResource *patterns;  
20
  
21// Additional information which has been added to the token  
22@property (nonatomic, readonly, strong) NSDictionary *meta;  
23
  
24// Access Manager token content signature  
25@property (nonatomic, readonly, strong) NSData *signature;  
26
  
27// Whether the provided Access Manager token string was valid and properly processed  
28@property (nonatomic, readonly, assign) BOOL valid;  
29
  
30// Contains an error with information on what went wrong, in cases when the token is not valid  
31@property (nonatomic, nullable, readonly, strong) NSError *error;  
32
  
33@end  
34
  
35@interface PNPAMTokenResource : NSObject  
36
  
37// Permissions granted to specific / regexp matching channels  
38@property (nonatomic, readonly, strong) NSDictionaryNSString *, PNPAMResourcePermission *> *channels;  
39
  
40// Permissions granted to specific / regexp matching channel groups  
41@property (nonatomic, readonly, strong) NSDictionaryNSString *, PNPAMResourcePermission *> *groups;  
42
  
43// Permissions granted to specific / regexp matching uuids  
44@property (nonatomic, readonly, strong) NSDictionaryNSString *, PNPAMResourcePermission *> *uuids;  
45
  
46@end  
47
  
48@interface PNPAMResourcePermission : NSObject  
49
  
50// Bit field with a given permission value  
51@property (nonatomic, readonly, assign) PNPAMPermission value;  
52
  
53@end  

```

### Error Responses

If parsing fails, the token may be damaged. Request a new token from the server.

## Set token

Sets or updates the authentication token provided by your server.

### Method(s)

```
`1- (void)setAuthToken:(NSString *)token;  
`
```

Parameter:
- token (String, required): Current token with embedded permissions.

### Sample code

```
`1[self.client setAuthToken:@"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"];  
`
```

### Returns

No return value.

Last updated on Sep 3, 2025