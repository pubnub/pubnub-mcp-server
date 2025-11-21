# Utility Methods API for Swift Native SDK

Utility methods for managing subscription connectivity.

## Disconnect[​](#disconnect)

Stops active subscriptions.

### Methods[​](#methods)

```
`1func disconnect( )  
`
```

### Sample code[​](#sample-code)

```
1
  

```

## Reconnect[​](#reconnect)

Forces the SDK to attempt reconnection to PubNub.

### Method(s)[​](#methods-1)

```
`1func reconnect(at timetoken: Timetoken? = nil)  
`
```

- at timetoken: Timetoken? (Default: nil) — Timetoken to resume the subscription at.

### Sample code[​](#sample-code-1)

```
1
**
```

Last updated on Sep 3, 2025**