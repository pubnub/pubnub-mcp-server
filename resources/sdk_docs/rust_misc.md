# Utility Methods API for Rust SDK

Utility methods that don't fit into other categories.

## Disconnect

Disconnect from PubNub and pause real-time updates from all data streams. Saves a cursor of the last received message. Reversible by reconnecting.

##### Client scope
This method is only available on the PubNub object.

### Method(s)
```
`1pubnub.disconnect()  
`
```

### Sample code
```
`1pubnub.disconnect();  
`
```

### Returns
None

## Reconnect

Reconnect to PubNub and resume real-time updates from all data streams. Uses the saved cursor for best-effort message catch-up between disconnect and reconnect.

##### Client scope
This method is only available on the PubNub object.

### Method(s)
```
`1pubnub.reconnect(cursor: OptionSubscriptionCursor>)  
`
```

- Parameter: cursor
  - Type: `Option<SubscriptionCursor>`
  - Default: Cursor of the last received message before `disconnect()` was called.
  - Behavior: Cursor from which to return any available cached messages (best-effort; not guaranteed).
  - Structure: `SubscriptionCursor { timetoken: String, region: u32 }`
  - Pass `None` if not needed.

### Sample code
```
`1pubnub.reconnect(None);  
`
```

### Returns
None

Last updated on Jul 15, 2025