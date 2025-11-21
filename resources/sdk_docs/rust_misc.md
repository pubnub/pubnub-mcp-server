# Utility Methods API for Rust SDK

Utility methods that don't fit other categories.

## Disconnect[​](#disconnect)

Disconnect from PubNub and pause listening for real-time updates. Saves a cursor of the last received message. Reversible via reconnect.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods)

```
`1pubnub.disconnect()  
`
```

### Sample code[​](#sample-code)

```
`1pubnub.disconnect();  
`
```

### Returns[​](#returns)

None

## Reconnect[​](#reconnect)

Reconnect to PubNub and resume listening. Uses the last saved cursor for best-effort message catch-up between disconnect and reconnect.

##### Client scope

This method is only available on the PubNub object.

### Method(s)[​](#methods-1)

```
`1pubnub.reconnect(cursor: OptionSubscriptionCursor>)  
`
```

- Parameter: cursor
  - Type: Option<SubscriptionCursor>
  - Default: Cursor of the last received message before disconnect() was called
  - Purpose: Return any available cached messages since disconnect (best-effort; not guaranteed)
  - Structure: SubscriptionCursor{timetoken: String, region: u32}
  - Pass None if not needed.

### Sample code[​](#sample-code-1)

```
`1pubnub.reconnect(None);  
`
```

### Returns[​](#returns-1)

None

Last updated on Jul 15, 2025