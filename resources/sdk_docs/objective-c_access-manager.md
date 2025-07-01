On this page
# Access Manager v3 API for Objective-C SDK

Access Manager allows you to enforce security controls for client access to resources within the PubNub Platform. With Access Manager v3, your servers can grant their clients tokens with embedded permissions that provide access to individual PubNub resources, such as channels, channel groups, and UUID metadata:

- For a limited period of time.

- Through resource lists or patterns (regular expressions).

- In a single API request, even if permission levels differ (`read` to `channel1` and `write` to `channel2`).

You can add the [authorized UUID](/docs/general/security/access-control#authorized-uuid) parameter to the grant request to restrict the token usage to only one client with a given `uuid`. Once specified, only this authorized UUID will be able to use the token to make API requests for the specified resources, according to permissions given in the grant request.

For more information about Access Manager v3, refer to [Manage Permissions with Access Manager v3](/docs/general/security/access-control).

##### Client device support only

The Objective-C SDK supports only client implementation of Access Manager functionality. This means that you cannot use it to grant permissions, but rather to parse and set tokens received from a server SDK.

## Parse Token[​](#parse-token)

The `parseAuthToken:` method decodes an existing token and returns the object containing permissions embedded in that token. The client can use this method for debugging to check the permissions to the resources or find out the token's `ttl` (time to live) details.

### Method(s)[​](#methods)

```
`- (PNPAMToken *)parseAuthToken:(NSString *)token  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
// 1. Initialize the PubNub client  
PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"   
                                                                 subscribeKey:@"demo"  
                                                                       userID:@"testUser"];  
PubNub *client = [PubNub clientWithConfiguration:configuration];  
  
// 2. The token to parse (this is a sample token, make sure to use your own)  
NSString *tokenString = @"p0F2AkF0Gmf_WKNDdHRsAUNyZXOlRGNoYW6hZnB1YmxpYxjvQ2dycKBDc3BjoEN1c3KgRHV1aWShcXBhbV9jY3BfY2hhdF91c2VyGGhDcGF0pURjaGFuoENncnCgQ3NwY6BDdXNyoER1dWlkoERtZXRhoENzaWdYIGT644KqTNFo-dk773m0OtXOaiRr-ngXe0wJ3c0A-v89";  
  
NSLog(@"Parsing token: %@", tokenString);  
  
// 3. Parse the token  
`
```
show all 98 lines

### Returns[​](#returns)

This method will respond with a `PNPAMToken` instance:

```
`@interface PNPAMToken : NSObject  
  
// Token version  
@property (nonatomic, readonly, assign) NSUInteger version;  
  
// Token generation date and time  
@property (nonatomic, readonly, assign) NSUInteger timestamp;  
  
// Maximum amount of time (in minutes) during which the token will be valid  
@property (nonatomic, readonly, assign) NSUInteger ttl;  
  
// The uuid that is exclusively authorized to use this token to make API requests  
@property (nonatomic, nullable, readonly, strong) NSString *authorizedUUID;  
  
// Permissions granted to specific resources  
`
```
show all 53 lines

### Error Responses[​](#error-responses)

If you receive an error while parsing the token, it may suggest that the token is damaged. In that case, request the server to issue a new one.

## Set Token[​](#set-token)

The `setAuthToken:` method is used by the client devices to update the authentication token granted by the server.

### Method(s)[​](#methods-1)

```
`- (void)setAuthToken:(NSString *)token;  
`
```

*  requiredParameterDescription`token` *Type: `String`Default:  
n/aCurrent token with embedded permissions.

### Basic Usage[​](#basic-usage-1)

```
`[self.client setAuthToken:@"p0thisAkFl043rhDdHRsCkNyZXisRGNoYW6hanNlY3JldAFDZ3Jwsample3KgQ3NwY6BDcGF0pERjaGFuoENnctokenVzcqBDc3BjoERtZXRhoENzaWdYIGOAeTyWGJI"];  
`
```

### Returns[​](#returns-1)

This method doesn't return any response value.
Last updated on **May 29, 2025**