# Utility Methods API for Go SDK

Utility methods that don't fit into other categories.

## Create push payload

Creates a push payload for use in endpoint calls.

### Method(s)

```
`1CreatePushPayload().  
2    SetAPNSPayload(pubnub.PNAPNSData,[]pubnub.PNAPNS2Data).  
3    SetCommonPayload(map[string]interface{}).  
4    SetFCMPayload(pubnub.PNFCMData).  
5    BuildPayload()  
`
```

- SetAPNSPayload
  - Type: pubnub.PNAPNSData — Set APNS payload. APNS devices receive data within the pn_apns key.
  - Type: []pubnub.PNAPNS2Data — Set APNS2 payload. APNS devices receive data within the pn_push key.
- SetFCMPayload
  - Type: pubnub.PNFCMData — Set FCM payload. FCM devices receive data within the pn_gcm key.
- SetCommonPayload
  - Type: map[string]interface{} — Set common payload. Native PubNub subscribers receive the entire object, including pn_apns, pn_gcm, and common payload.
- BuildPayload
  - Builds the payload from set values. Returns map[string]interface{}.

### Sample code

#### Create push payload

```
1
  

```

### Response

CreatePushPayload() returns a map[string]interface{} that can be passed to the Publish method's Message parameter.

Last updated on Oct 29, 2025