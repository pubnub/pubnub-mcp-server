# Utility Methods API for Go SDK

The methods on this page are utility methods that don't fit into other categories.

## Create push payload

Creates a push payload for use in the appropriate endpoint calls.

### Method(s)

```
`1CreatePushPayload().  
2    SetAPNSPayload(pubnub.PNAPNSData,[]pubnub.PNAPNS2Data).  
3    SetCommonPayload(map[string]interface{}).  
4    SetFCMPayload(pubnub.PNFCMData).  
5    BuildPayload()  
`
```

- SetAPNSPayload(data pubnub.PNAPNSData): Set APNS payload. Associated APNS devices receive only the data within the pn_apns key.
- SetAPNSPayload(data []pubnub.PNAPNS2Data): Set APNS2 payload. Associated APNS devices receive only the data within the pn_push key.
- SetFCMPayload(data pubnub.PNFCMData): Set FCM payload. Associated FCM devices receive only the data within the pn_fcm key.
- SetCommonPayload(data map[string]interface{}): Set common payload. Native PubNub subscribers receive the entire object literal, including pn_apns, pn_fcm, and the common payload.
- BuildPayload(): Builds the payload from the values set using the parameters. Returns map[string]interface{}.

### Sample code

#### Create push payload

```
1
  

```

### Response

The CreatePushPayload() operation returns a map[string]interface{} which can be passed directly to the Publish method's Message parameter.

Last updated on Nov 6, 2025