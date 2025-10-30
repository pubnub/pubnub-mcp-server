# Utility Methods API for Swift Native SDK

Utility methods that control subscription connectivity.

## Disconnect

Stops subscriptions in progress.

### Methods

```
`1func disconnect( )  
`
```

### Sample code

```
1
  

```

## Reconnect

Forces the SDK to attempt reconnection to PubNub. Optionally resumes at a specific timetoken.

### Method(s)

```
`1func reconnect(at timetoken: Timetoken? = nil)  
`
```

- Parameters:
  - timetoken: Timetoken? = nil — Timetoken at which to resume subscription.

### Sample code

```
1
**
```
Last updated on Sep 3, 2025**