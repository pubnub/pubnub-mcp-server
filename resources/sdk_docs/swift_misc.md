# Utility Methods API for Swift Native SDK

Utility methods that don’t fit other categories.

## Disconnect

Call `disconnect` to stop subscriptions in progress.

### Methods

To `disconnect` you can use the following method in the Swift SDK:

```
`1func disconnect( )  
`
```

### Sample code

```
1
  

```

## Reconnect

Call `reconnect` to force the SDK to try to reach PubNub.

### Method(s)

To `reconnect` you can use the following method in the Swift SDK:

```
`1func reconnect(at timetoken: Timetoken? = nil)  
`
```

**Parameters**

* `timetoken` *(Type: Timetoken, Default: n/a)* — The timetoken to `reconnect` the subscribe at.

### Sample code

```
1
**
```