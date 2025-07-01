# Utility Methods API (Rust SDK)

These helper methods are available only on a `PubNub` client instance.

## Disconnect

Disconnects from PubNub and pauses real-time updates. Saves a cursor for later catch-up.

### Method
```rust
`pubnub.disconnect()  
`
```

### Example
```rust
`pubnub.disconnect();  
`
```

Returns: `None`

---

## Reconnect

Resumes real-time updates, using an optional cursor for catch-up.

### Method
```rust
`pubnub.reconnect(cursor: OptionSubscriptionCursor>)  
`
```

Parameter  
• `cursor: Option<SubscriptionCursor>` – `{ timetoken: String, region: u32 }` of last received message (best-effort). Pass `None` to ignore.

### Example
```rust
`pubnub.reconnect(None);  
`
```

Returns: `None`

_Last updated: Mar 6, 2025_