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

Parameters and behavior:
- SetAPNSPayload (pubnub.PNAPNSData): Set APNS payload. APNS devices receive only the data within the pn_apns key.
- SetAPNSPayload ([]pubnub.PNAPNS2Data): Set APNS2 payload. APNS devices receive only the data within the pn_push key.
- SetFCMPayload (pubnub.PNFCMData): Set FCM payload. FCM devices receive only the data within the pn_fcm key.
- SetCommonPayload (map[string]interface{}): Set common payload. Native PubNub subscribers receive the entire object literal, including pn_apns, pn_fcm, and common payload.
- BuildPayload(): Builds and returns the payload as map[string]interface{}.

### Sample code

#### Create push payload

```
1
  

```

### Response

CreatePushPayload() returns a map[string]interface{} that can be passed directly to the Publish method's Message parameter.

Last updated on Nov 6, 2025