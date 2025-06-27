# PubNub Filter Types Clarification

## Key Distinction

**Subscribe Filters, Message Filters, and Channel Filters are all the same thing** - they refer to the same real-time message filtering functionality.

**App Context Filters are different** - they serve a completely separate purpose for querying metadata.

## Same Functionality (Different Names)

These terms all describe **real-time message filtering during subscriptions**:

- **Subscribe Filters**
- **Message Filters** 
- **Channel Filters**

### What They Do
- Filter messages in real-time as they're delivered to subscribers
- Applied during active subscriptions to control which messages reach your client
- Operate on message properties, metadata, publisher ID, channel, timetoken, etc.
- Reduce bandwidth by filtering unwanted messages server-side

### Common Use Cases
- Filter out messages you published yourself: `userId != 'your-user-id'`
- Only receive high-priority messages: `message.priority == "high"`
- Regional filtering: `meta.region == "us"`
- Content-based filtering: `message.type == "alert"`

## Different Functionality

**App Context Filters** serve a completely separate purpose:

### What They Do
- Query metadata about users, channels, and memberships
- Applied during metadata retrieval operations (not subscriptions)
- Work with entity attributes like status, type, custom fields
- Used with `getAllUUIDMetadata()`, `getAllChannelMetadata()`, etc.

### Example Use Cases
- Find active support agents: `status == "active" && type == "support_agent"`
- Query channels by category: `category == "public"`
- Filter users by location: `custom.location == "New York"`

## Syntax Similarity

Both types use similar expression syntax:
- Comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Pattern matching: `LIKE` with wildcards
- Logical operators: `&&`, `||`, `!`
- Complex boolean expressions

However, they operate on completely different data:
- **Subscribe/Message/Channel Filters**: Live message data and attributes
- **App Context Filters**: Stored metadata about entities

## Summary

Remember: **Subscribe Filters = Message Filters = Channel Filters** (same thing, different names)

**App Context Filters** are a separate filtering system for metadata queries.