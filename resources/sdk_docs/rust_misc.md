# Utility Methods API for Rust SDK

Utility methods for connection management.

## Disconnect

Disconnect from PubNub and pause listening for real-time updates. Saves a cursor of the last received message. Reversible via reconnect.

##### Client scope
Only available on the PubNub object.

### Method(s)

```rust
pubnub.disconnect()
```

### Sample code

```rust
pubnub.disconnect();
```

### Returns
None

## Reconnect

Reconnect to PubNub and resume listening. Uses the last saved cursor to attempt message catch-up (best-effort).

##### Client scope
Only available on the PubNub object.

### Method(s)

```rust
pubnub.reconnect(cursor: Option<SubscriptionCursor>)
```

### Parameters
- cursor: Option<SubscriptionCursor>  
  Cursor of the last received message before disconnect. Message retrieval with cursor is best-effort.  
  Structure: SubscriptionCursor { timetoken: String, region: u32 }  
  Pass None if not needed.

### Sample code

```rust
pubnub.reconnect(None);
```

### Returns
None

Last updated on Jul 15, 2025