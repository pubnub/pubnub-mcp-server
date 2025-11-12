# Utility Methods API for Swift Native SDK

Utility methods that don't fit into other categories.

## Disconnect[​](#disconnect)

Stops subscriptions in progress.

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

Forces the SDK to try and reach PubNub.

### Method(s)[​](#methods-1)

```
`1func reconnect(at timetoken: Timetoken? = nil)  
`
```

Parameters:
- at
  - Type: Timetoken
  - Default: n/a
  - Description: The timetoken to reconnect the subscribe at.

### Sample code[​](#sample-code-1)

```
1
**
```

Last updated on Sep 3, 2025**