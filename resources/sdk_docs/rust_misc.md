On this page
# Utility Methods API for Rust SDK

The methods on this page are utility methods that don't fit into other categories.

## Disconnect[​](#disconnect)

Disconnect from PubNub and pause listening for real-time updates from all data streams. Disconnecting may be temporary and is reversible by [reconnecting](#reconnect). When you disconnect, a cursor of the last received message is saved.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods)

```
`pubnub.disconnect()  
`
```

### Basic Usage[​](#basic-usage)

```
`pubnub.disconnect();  
`
```

### Returns[​](#returns)

None

## Reconnect[​](#reconnect)

Reconnect to PubNub and resume listening for real-time updates from all data streams. The cursor of the last received message is used for message catch-up between the time you disconnected and reconnected.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-1)

```
`pubnub.reconnect(cursor: OptionSubscriptionCursor>)  
`
```

*  requiredParameterDescription`cursor` *Type: `Option<SubscriptionCursor>`Default:  
Cursor of the last received message before [`disconnect()`](#disconnect) was calledCursor from which to return any available cached messages. Message retrieval with cursor is not guaranteed and should only be considered a best-effort service. A cursor consists of a timetoken and region: `SubscriptionCursor{timetoken: String, region: u32}`   
   
 Pass `None` if not needed.

### Basic Usage[​](#basic-usage-1)

```
`pubnub.reconnect(None);  
`
```

### Returns[​](#returns-1)

None
Last updated on **Mar 6, 2025**