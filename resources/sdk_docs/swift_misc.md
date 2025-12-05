# Utility Methods API for Swift Native SDK

Utility methods that don't fit other categories.

## Disconnect

Stops subscriptions in progress.

### Methods

```swift
func disconnect()
```

### Sample code

None provided.

## Reconnect

Forces the SDK to try and reach PubNub.

### Methods

```swift
func reconnect(at timetoken: Timetoken? = nil)
```

- timetoken (Type: Timetoken, Default: nil): The timetoken to reconnect the subscribe at.

### Sample code

None provided.

Last updated on Sep 3, 2025