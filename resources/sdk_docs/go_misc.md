# Utility Methods API for Go SDK

Utility methods that don't fit into other categories.

## Create push payload

Build a push payload for use in publish or relevant endpoint calls.

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
  - Type: pubnub.PNAPNSData, []pubnub.PNAPNS2Data
  - Sets APNS (pn_apns) and APNS2 (pn_push) payloads. APNS devices receive only data within their respective key.
- SetFCMPayload
  - Type: pubnub.PNFCMData
  - Sets FCM payload. FCM devices receive only data within the pn_fcm key.
- SetCommonPayload
  - Type: map[string]interface{}
  - Sets common payload. Native PubNub subscribers receive the entire object, including pn_apns, pn_fcm, and common payload.
- BuildPayload
  - Builds the payload from the values set and returns map[string]interface{}.

### Sample code

#### Create push payload

```
1
  

```

### Response

CreatePushPayload() returns a map[string]interface{} which can be passed directly to the Publish method's Message parameter.

Last updated on Nov 6, 2025