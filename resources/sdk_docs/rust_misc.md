# Utility Methods API – Rust SDK (Misc)

## disconnect()

Temporarily stop receiving real-time updates. A cursor for the last received message is stored.

**Client scope:** `PubNub` object

#### Method
```rust
pubnub.disconnect()
```

#### Example
```rust
pubnub.disconnect();
```

Returns: `None`

---

## reconnect(cursor: Option<SubscriptionCursor>)

Resume real-time updates and attempt message catch-up since the last `disconnect`.

* `cursor`  
  • Type: `Option<SubscriptionCursor>`  
  • Structure: `SubscriptionCursor { timetoken: String, region: u32 }`  
  • Pass `None` to skip catch-up. Retrieval is best-effort.

**Client scope:** `PubNub` object

#### Method
```rust
pubnub.reconnect(cursor: Option<SubscriptionCursor>)
```

#### Example
```rust
pubnub.reconnect(None);
```

Returns: `None`

---

_Last updated: Jul 15, 2025_