# Access Manager v3 – Objective-C SDK (Client-side)

• Objective-C SDK is *client-device only*:  
  – Cannot issue grants.  
  – Can **parse** tokens received from your server and **set** them for subsequent PubNub requests.

Refer to “Manage Permissions with Access Manager v3” for server-side grant details.

---

## Parse token

Decode a token to inspect its embedded permissions (useful for debugging or displaying TTL, UUID, etc.).

### Method

```objective-c
- (PNPAMToken *)parseAuthToken:(NSString *)token;
```

Parameter  
• `token` (NSString, required) – Current PAM v3 auth token.

### Sample

```objective-c
#import <Foundation/Foundation.h>
#import <PubNub/PubNub.h>

// 1. Init client
PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"
                                                                 subscribeKey:@"demo"
                                                                       userID:@"testUser"];
PubNub *client = [PubNub clientWithConfiguration:configuration];

// 2. Token to parse (example)
NSString *tokenString = @"p0F2AkF0Gmf_WKNDdHRsAUNyZXOlRGNoYW6hZnB1YmxpYxjvQ2dycKBDc3BjoEN1c3KgRHV1aWShcXBhbV9jY3BfY2hhdF91c2VyGGhDcGF0pURjaGFuoENncnCgQ3NwY6BDdXNyoER1dWlkoERtZXRhoENzaWdYIGT644KqTNFo-dk773m0OtXOaiRr-ngXe0wJ3c0A-v89";

NSLog(@"Parsing token: %@", tokenString);

// 3. Parse
PNPAMToken *parsed = [client parseAuthToken:tokenString];
```

### Returns

```objective-c
@interface PNPAMToken : NSObject

@property (nonatomic, readonly, assign) NSUInteger   version;          // Token version
@property (nonatomic, readonly, assign) NSUInteger   timestamp;        // Unix epoch (s)
@property (nonatomic, readonly, assign) NSUInteger   ttl;              // Validity (min)
@property (nonatomic, nullable, readonly, strong) NSString *authorizedUUID; // Token-bound UUID

// …resource & pattern permission dictionaries…
@end
```

### Error response

Malformed or expired tokens throw an error; request a new token from your server.

---

## Set token

Update the client’s active PAM v3 token.

### Method

```objective-c
- (void)setAuthToken:(NSString *)token;
```

Parameter  
• `token` (NSString, required) – New auth token.

### Sample

```objective-c
[self.client setAuthToken:@"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"];
```

### Return

Void – no value returned.

---

Last updated: Jul 15 2025