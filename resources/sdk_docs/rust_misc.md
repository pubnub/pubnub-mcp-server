# Utility Methods API for Rust SDK

Utility methods for managing connection state.

## Disconnect

Temporarily stop listening for real-time updates from all data streams. Saves a cursor of the last received message. Reversible via reconnect.

- Client scope: Only available on the PubNub object.

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

Resume listening for real-time updates from all data streams. Uses the last saved cursor for best-effort message catch-up between disconnect and reconnect.

- Client scope: Only available on the PubNub object.

### Method(s)

```rust
pubnub.reconnect(cursor: Option<SubscriptionCursor>)
```

- Parameters:
  - cursor: Option<SubscriptionCursor>
    - Cursor of the last received message before disconnect(). Used to return any available cached messages (best-effort, not guaranteed).
    - Structure: SubscriptionCursor { timetoken: String, region: u32 }
    - Pass None if not needed.

### Sample code

```rust
pubnub.reconnect(None);
```

### Returns

None

Last updated on Jul 15, 2025