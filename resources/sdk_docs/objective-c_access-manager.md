# Access Manager v3 – Objective-C SDK

Objective-C SDK supports only **client-side** Access Manager features:
• Parse tokens for inspection/debugging.  
• Set (apply) tokens received from your server.  
Grant operations must be performed server-side.

---

## Parse Token

### Method

```objective-c
- (PNPAMToken *)parseAuthToken:(NSString *)token;
```

Parameter  
• `token` (String, required) – The AMv3 token to decode.

### Example

```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// 1. Init client
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"
                                                         subscribeKey:@"demo"
                                                               userID:@"testUser"];
PubNub *client = [PubNub clientWithConfiguration:config];

// 2. Token to parse (sample)
NSString *tok = @"p0F2AkF0Gmf_WKNDdHRsAUNyZXOlRGNoYW6hZnB1YmxpYxjvQ2dycKBDc3BjoEN1c3KgRHV1aWShcXBhbV9jY3BfY2hhdF91c2VyGGhDcGF0pURjaGFuoENncnCgQ3NwY6BDdXNyoER1dWlkoERtZXRhoENzaWdYIGT644KqTNFo-dk773m0OtXOaiRr-ngXe0wJ3c0A-v89";

// 3. Parse
PNPAMToken *info = [client parseAuthToken:tok];
```

### Return Type

```objective-c
@interface PNPAMToken : NSObject

@property (nonatomic, readonly) NSUInteger version;        // Token version
@property (nonatomic, readonly) NSUInteger timestamp;      // Unix epoch (sec)
@property (nonatomic, readonly) NSUInteger ttl;            // Minutes till expiry
@property (nonatomic, nullable, readonly, strong)
          NSString *authorizedUUID;                    // UUID bound to token

// Permissions mapped per resource type.
// Keys: @"channels", @"groups", @"uuids", @"patterns", etc.
// Values: NSDictionary<NSString *, NSNumber *> (bit-masked perms)
@property (nonatomic, readonly, strong)
          NSDictionary<NSString *, NSDictionary *> *resources;

@end
```

Error while parsing ⇒ token is invalid; request a new one from the server.

---

## Set Token

### Method

```objective-c
- (void)setAuthToken:(NSString *)token;
```

Parameter  
• `token` (String, required) – The AMv3 token to apply to future PubNub API calls.

### Example

```objective-c
[self.client setAuthToken:@"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"];
```

Return: void (no response).

---

Last updated May 29 2025