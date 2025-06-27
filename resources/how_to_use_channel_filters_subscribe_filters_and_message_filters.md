# Understanding PubNub Subscribe, Channal and Message Filters

Subscribe filters allow you to selectively receive messages during subscription by applying server-side filtering logic. Instead of receiving all messages on a channel and filtering them client-side, you can instruct PubNub to only deliver messages that match your specific criteria, reducing bandwidth and improving performance.

## What are Subscribe Filters?

* **Server-Side Filtering:** Filters are applied on PubNub's servers before messages are sent to your client, reducing unnecessary data transmission.
* **Real-Time Selection:** Only messages matching your filter criteria are delivered to your subscribers.
* **Bandwidth Optimization:** Significantly reduces network traffic by filtering out unwanted messages at the source.
* **Expression-Based:** Uses a powerful expression language to define complex filtering logic across multiple message properties.

## Key Characteristics of Subscribe Filters

* **Filter Targets:** You can filter on various message properties:
  * **Message Payload:** `message.field` - Filter based on message content
  * **Metadata:** `meta.field` - Filter based on message metadata
  * **Publisher ID:** `publisher` - Filter based on who sent the message
  * **Channel:** `channel` - Filter based on channel name
  * **Timetoken:** `timetoken` - Filter based on message timestamp
  * **Message Type:** `messageType` - Filter based on custom message type

* **Comparison Operators:**
  * **Equality:** `==` (equals), `!=` (not equals)
  * **Numerical:** `<`, `>`, `<=`, `>=`
  * **Pattern Matching:** `LIKE` (wildcard matching), `CONTAINS` (substring search)

* **Logical Operators:**
  * **AND:** `&&` - All conditions must be true
  * **OR:** `||` - Any condition can be true
  * **NOT:** `!` - Negation

* **Data Types:**
  * **Strings:** Must be quoted: `"value"`
  * **Numbers:** Unquoted: `100`, `3.14`
  * **Booleans:** `true`, `false`

## Filter Expression Syntax

### Basic Examples

```javascript
// Filter by message content
message.priority == "high"

// Filter by metadata
meta.region == "us-west"

// Filter by publisher
publisher == "user123"

// Filter by channel
channel == "alerts"

// Numerical comparison
message.score > 100

// Pattern matching (wildcard)
message.category LIKE "news*"

// Substring search
meta.tags CONTAINS "urgent"
```

### Complex Examples

```javascript
// Multiple conditions with AND
message.priority == "high" && meta.region == "us"

// Multiple conditions with OR
publisher == "admin" || message.type == "system"

// Mixed logical operators
(message.priority == "high" || message.priority == "critical") && meta.region != "test"

// Wildcard patterns
message.title LIKE "*breaking*" && meta.category == "news"

// Numerical ranges
message.score >= 80 && message.score <= 100
```

## Common Use Cases

### Chat Applications
```javascript
// Only receive messages from specific users
publisher == "moderator" || publisher == "admin"

// Filter out system messages
message.type != "system"

// Only high-priority notifications
message.priority == "high" && meta.urgent == true
```

### IoT Data Streams
```javascript
// Temperature alerts only
message.sensor == "temperature" && message.value > 30

// Critical device status
message.status == "critical" || message.battery < 10

// Specific device types
meta.deviceType LIKE "sensor*"
```

### Gaming Applications
```javascript
// Player actions only (no system events)
message.type == "player_action"

// High-score achievements
message.event == "achievement" && message.score > 10000

// Regional game events
meta.region == "europe" && message.type == "tournament"
```

### Financial Data
```javascript
// Large transactions only
message.amount > 1000

// Specific asset types
message.asset LIKE "CRYPTO*" || message.asset LIKE "FOREX*"

// Critical price movements
message.change > 5 || message.change < -5
```

## Implementation Guide

### JavaScript SDK

```javascript
// Set up your PubNub instance
const pubnub = new PubNub({
  publishKey: 'YOUR_PUBLISH_KEY',
  subscribeKey: 'YOUR_SUBSCRIBE_KEY',
  userId: 'YOUR_USER_ID'
});

// Define your filter expression
const filterExpression = 'message.priority == "high" && meta.region == "us"';

// Apply the filter to your PubNub instance
pubnub.setFilterExpression(filterExpression);

// Create subscription (filter applies to all subscriptions on this instance)
const subscription = pubnub.subscriptionSet({
  channels: ['alerts', 'notifications']
});

// Subscribe with filtering active
subscription.subscribe();
```

### Dynamic Filter Building

```javascript
function buildFilterExpression(filters, logic = '&&') {
  const expressions = filters.map(filter => {
    let leftSide = '';
    
    // Determine the filter target
    switch(filter.target) {
      case 'message':
        leftSide = `message.${filter.field}`;
        break;
      case 'meta':
        leftSide = `meta.${filter.field}`;
        break;
      case 'publisher':
        leftSide = 'publisher';
        break;
      case 'channel':
        leftSide = 'channel';
        break;
      case 'timetoken':
        leftSide = 'timetoken';
        break;
      case 'messageType':
        leftSide = 'messageType';
        break;
    }
    
    // Format the value based on type and operator
    let value = filter.value;
    if (filter.type === 'string' || ['LIKE', 'CONTAINS'].includes(filter.operator.toUpperCase())) {
      value = `"${filter.value}"`;
    }
    
    // Ensure operator is properly formatted
    const operator = ['LIKE', 'CONTAINS'].includes(filter.operator.toUpperCase()) 
      ? filter.operator.toUpperCase() 
      : filter.operator;
    
    return `${leftSide} ${operator} ${value}`;
  }).filter(expr => expr);
  
  return expressions.join(` ${logic} `);
}

// Example usage
const filters = [
  { target: 'message', field: 'priority', operator: '==', value: 'high', type: 'string' },
  { target: 'meta', field: 'region', operator: 'LIKE', value: 'us*', type: 'string' }
];

const expression = buildFilterExpression(filters, '&&');
// Result: message.priority == "high" && meta.region LIKE "us*"
```

## Important Syntax Rules

### Quoting Requirements
- **String values:** Always quote with double quotes: `"value"`
- **LIKE patterns:** Always quote wildcard patterns: `"pattern*"`
- **Numbers:** Never quote: `100`, `3.14`
- **Booleans:** Never quote: `true`, `false`

### Operator Formatting
- **Case sensitivity:** Use uppercase for `LIKE` and `CONTAINS`
- **Wildcards:** Only `*` is supported, and only at the end of patterns
- **Escape sequences:** Use `\*` for literal asterisk in patterns

### Common Syntax Errors
```javascript
// ❌ WRONG
message.name like Todd*        // Missing quotes, wrong case
meta.score == "100"           // Number shouldn't be quoted
message.text LIKE *news*      // Wildcard in middle not supported

// ✅ CORRECT
message.name LIKE "Todd*"     // Quoted pattern, uppercase LIKE
meta.score == 100             // Unquoted number
message.text LIKE "*news"     // Wildcard at end only
```

## Performance Considerations

### Benefits
- **Reduced Bandwidth:** Only relevant messages are transmitted
- **Lower Processing:** Client receives pre-filtered data
- **Battery Savings:** Fewer messages to process on mobile devices
- **Cost Optimization:** Reduced data transfer costs

### Limitations
- **Server Resources:** Complex filters may impact server performance
- **Expression Complexity:** Very complex expressions may have processing overhead
- **Memory Usage:** Filters are applied in memory on PubNub servers

### Best Practices
- **Keep filters simple:** Avoid overly complex expressions when possible
- **Use specific criteria:** More specific filters are generally more efficient
- **Test thoroughly:** Validate filter expressions before production use
- **Monitor performance:** Track message delivery rates and latency

## Troubleshooting Common Issues

### Filter Not Working
```javascript
// Check filter syntax
console.log('Filter expression:', filterExpression);

// Verify quotes around string values
// Ensure operators are properly formatted
// Check for typos in field names
```

### No Messages Received
```javascript
// Verify filter isn't too restrictive
// Test with simpler filter first
// Check that published messages contain the filtered fields
// Ensure filter is set before subscribing
```

### Syntax Errors
```javascript
// Common fixes:
// - Add quotes around string values
// - Use uppercase LIKE and CONTAINS
// - Check parentheses matching for complex expressions
// - Verify field names match published message structure
```

## Filter Expression Language Reference

### Supported Field Types
| Target | Example | Description |
|--------|---------|-------------|
| `message.field` | `message.priority` | Message payload properties |
| `meta.field` | `meta.region` | Message metadata properties |
| `publisher` | `publisher` | UUID of message sender |
| `channel` | `channel` | Channel name |
| `timetoken` | `timetoken` | Message timestamp |
| `messageType` | `messageType` | Custom message type |

### Comparison Operators
| Operator | Usage | Example |
|----------|-------|---------|
| `==` | Equals | `message.type == "alert"` |
| `!=` | Not equals | `publisher != "system"` |
| `<` | Less than | `message.score < 100` |
| `>` | Greater than | `message.value > 50` |
| `<=` | Less than or equal | `message.level <= 5` |
| `>=` | Greater than or equal | `message.priority >= 3` |
| `LIKE` | Pattern match | `message.title LIKE "news*"` |
| `CONTAINS` | Substring | `meta.tags CONTAINS "urgent"` |

### Logical Operators
| Operator | Usage | Example |
|----------|-------|---------|
| `&&` | AND | `message.type == "alert" && meta.urgent == true` |
| `\|\|` | OR | `publisher == "admin" \|\| message.priority == "high"` |
| `!` | NOT | `!(message.type == "debug")` |

Subscribe filters are a powerful feature for optimizing real-time message delivery, allowing you to receive only the data your application needs while reducing bandwidth and improving performance.

To initialize the PubNub SDK with your API keys, configure your client in the language of your choice:

JavaScript:
```javascript
import PubNub from 'pubnub';

const pubnub = new PubNub({
  publishKey: 'YOUR_PUBLISH_KEY',
  subscribeKey: 'YOUR_SUBSCRIBE_KEY',
  userId: 'YOUR_USER_ID',
});

// Set a filter expression
pubnub.setFilterExpression('message.priority == "high"');
```

Python:
```python
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

pnconfig = PNConfiguration()
pnconfig.publish_key = 'YOUR_PUBLISH_KEY'
pnconfig.subscribe_key = 'YOUR_SUBSCRIBE_KEY'
pnconfig.uuid = 'YOUR_USER_ID'
pnconfig.filter_expression = 'message.priority == "high"'
pubnub = PubNub(pnconfig)
```

Ruby:
```ruby
require 'pubnub'

pubnub = Pubnub.new(
  publish_key: 'YOUR_PUBLISH_KEY',
  subscribe_key: 'YOUR_SUBSCRIBE_KEY',
  uuid: 'YOUR_USER_ID',
  filter_expression: 'message.priority == "high"'
)
```

Objective-C:
```objectivec
#import <PubNub/PubNub.h>

PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"YOUR_PUBLISH_KEY" subscribeKey:@"YOUR_SUBSCRIBE_KEY"];
configuration.uuid = @"YOUR_USER_ID";
configuration.filterExpression = @"message.priority == \"high\"";
PubNub *pubnub = [PubNub clientWithConfiguration:configuration];
```

## How to Use Channel Filters, Subscribe Filters, and Message Filters

## Overview

PubNub provides powerful filtering capabilities that allow you to control which messages are delivered to your clients and how you query metadata. This guide covers three main types of filtering:

- **Channel Filters**: Control which channels a client can access
- **Subscribe Filters**: Filter messages during real-time subscriptions
- **Message Filters**: Filter messages based on content, metadata, and other properties

## Table of Contents

1. [Message Filters](#message-filters)
2. [Filterable Message Properties](#filterable-message-properties)
3. [Subscribe Filtering vs. App Context Filtering](#subscribe-filtering-vs-app-context-filtering)
4. [Filter Language Definition](#filter-language-definition)
5. [Filter Expression Language Specification](#filter-expression-language-specification)

## Message Filters

Message filters allow you to control which messages are delivered to your subscribers in real-time. By leveraging metadata and message properties, you can create sophisticated filtering rules that ensure clients only receive relevant messages.

With the metadata information being sent with the [published message](/docs/general/messages/publish#publish-with-message-filters), we can now leverage Message Filters to omit messages that aren't important for a particular client. For example, filter out messages that the client published using its User ID.

### How Message Filters Work

Message filters operate by evaluating expressions against incoming messages during the subscription process. When a message matches your filter criteria, it gets delivered to your client. Messages that don't match are filtered out before reaching your application, reducing bandwidth and processing overhead.

In the following code examples, the `userId` variable is used as a placeholder variable that would hold the User ID value for the client. For your servers, this value would be pulled from a server config file. For your clients, this value is received from your server after successful login.

### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

*   JavaScript
*   Swift
*   Objective-C
*   Java
*   C#
*   Python

```javascript
var pubnub = new PubNub({
  publishKey: "YOUR_PUBLISH_KEY",
  subscribeKey: "YOUR_SUBSCRIBE_KEY",
  userId: userId
});

pubnub.setFilterExpression("userId != '" + pubnub.getUserId() + "'");
```

```swift
// the userId value is received from your server
var pnconfig = PubNubConfiguration(
  publishKey: "YOUR_PUBLISH_KEY",
  subscribeKey: "YOUR_SUBSCRIBE_KEY"
)
pnconfig.userId = userId
pnconfig.filterExpression = "userId != \(userId)"
var pubnub = PubNub(configuration: pnconfig)
```

```objective-c
// the uuid value is received from your server
PNConfiguration *pnconfig = [PNConfiguration configurationWithPublishKey:@"YOUR_PUBLISH_KEY"
                                    subscribeKey:@"YOUR_SUBSCRIBE_KEY"];
pnconfig.uuid = uuid;
self.pubnub = [PubNub clientWithConfiguration:pnconfig];

NSString *filterExp = [NSString stringWithFormat:@"uuid != '%@'",
                        self.pubnub.currentConfiguration.uuid];
[self.pubnub setFilterExpression:filterExp];
```

```java
// the UserId value is received from your server
PNConfiguration.Builder configBuilder = PNConfiguration.builder(
    new UserId("YOUR_USER_ID"), "YOUR_SUBSCRIBE_KEY");
configBuilder.publishKey("YOUR_PUBLISH_KEY");
configBuilder.filterExpression("userId != '" + configBuilder.getUserId() + "'");
PubNub pubNub = PubNub.create(configBuilder.build());
```

```csharp
PNConfiguration pnconfig = new PNConfiguration();
pnconfig.PublishKey = "YOUR_PUBLISH_KEY";
pnconfig.SubscribeKey = "YOUR_SUBSCRIBE_KEY";
pnconfig.UserId = UserId;
pnconfig.FilterExpression = "UserId != '" + pnconfig.GetCurrentUserId() + "'";
Pubnub pubnub = new Pubnub(pnconfig);
```

```python
pnconfig = PNConfiguration()
pnconfig.publish_key = "YOUR_PUBLISH_KEY"
pnconfig.subscribe_key = "YOUR_SUBSCRIBE_KEY"
pnconfig.user_id = user_id
pnconfig.filter_expression = "user_id != '" + user_id + "'"
pubnub = PubNub(pnconfig)
```

## Filterable Message Properties

Based on PubNub's capabilities, here are all the message items you can filter on when subscribing:

*   Message payload/content - The actual data content of the message
*   Message metadata - The metadata attached via the [`meta` parameter](/docs/general/messages/publish#publish-with-message-filters) when publishing
*   Publisher User ID - The unique identifier of the entity that published the message
*   Channel - The channel on which the message was published
*   Timetoken - The timestamp when the message was published
*   Message actions - Related actions performed on the message
*   Message type - Custom type identifiers if your application uses message typing
*   Presence events - If you're also handling presence events in your subscription
*   Signal messages - Lightweight message types can be filtered separately
*   File messages - Messages related to file uploads

The filtering syntax allows for complex expressions combining these elements using operators like equality checks, pattern matching (LIKE), and logical operators (AND, OR).

## Subscribe Filtering vs. App Context Filtering

PubNub offers two powerful filtering mechanisms that share similar syntax but serve different purposes in your real-time applications.

*   Subscribe Filtering - Used when subscribing to channels to control which messages are delivered to your client
*   [App Context Filtering](/docs/general/metadata/filtering) - Used when querying metadata to retrieve specific users, channels, or memberships

Both filtering systems:

*   Use the same expression syntax (`==`, `!=`, `>`, `<`, `LIKE`, `&&`, `||`)
*   Support pattern matching with wildcards
*   Allow complex boolean expressions
*   Follow a similar format that evaluates to true/false

Key differences are as follows:

| Feature | Subscribe Filtering | App Context Filtering |
|---------|--------------------|-----------------------|
| Purpose | Controls which messages reach subscribers | Queries metadata about entities |
| Target Data | Messages and their attributes | Users, channels, and memberships |
| When Applied | During active subscriptions | During metadata retrieval |
| Implementation | In subscribe method | In metadata query methods |

### Examples

Subscribe Filtering:

```javascript
// Only receive messages with high priority from the US region
pubnub.subscribe({
  channels: ['updates'],
  filter: 'message.priority == "high" && meta.region == "us"'
});
```

App Context Filtering:

```javascript
// Only retrieve active support agent users
pubnub.objects.getAllUUIDMetadata({
  filter: 'status == "active" && type == "support_agent"'
});
```

While the syntax looks similar, notice how subscribe filtering operates on message properties and metadata, while App Context filtering works with entity attributes like status and type.

For more examples on how to use the filtering syntax, refer to [App Context filtering](/docs/general/metadata/filtering#examples).

## Filter Language Definition

The filtering language is extensive and supports many advanced use cases. Here are some common filter examples:

| Expression | Meaning |
|------------|----------|
| `string == 'match'` | Exact match |
| `string LIKE 'match*'` | Asterisk wildcarding, case insensitive |
| `string LIKE 'match\*'` | Literal match with string containing asterisk character |
| `('Anne','anna','Ann') LIKE 'ann*'` | Any of the three set members would be a sufficient match |
| `('a','b','c') CONTAINS string` | Compare against a list of values |
| `otherstring CONTAINS string` | Check for a substring match |
| `(3,5,9) contains numValue` | Compare number to a list of values |
| `!((3,5,9) contains numValue)` | Negation |
| `string contains numValue` | `str(numValue)` in string |
| `numValue > (numA + numB - numC)` | Compare number to an arithmetic expression |
| `(numA ^ numB) != (numValue * 10)` | Compare two expressions |
| `(~numA / numB)` | Bitwise NOT operation on numA divided by numB |

## Filter Expression Language Specification

The filter expression language follows a formal grammar specification where `compound_expression` is the root element.

### Grammar Specification

| Expression | Definition |
|------------|------------|
| `<compound_expression>` | `<expression>` \| `<expression> <binary_logical_op> <expression>` |
| `<binary_logical_op>` | `&&` \| `\|\|` |
| `<expression>` | `(<expression>)` \| `<operand> <comparison_operator> <operand>` \| `<unary_logical_op> <operand>` |
| `<numeric_comparison_operator>` | `{==, !=, <, >, <=, >=}` |
| `<string_comparison_operator>` | `{contains, like}` |
| `<unary_logical_op>` | `!` |
| `<operand>` | `(<operand>)` \| `<unary_op> <operand>` \| `<literals> <binary_op> <literals>` |
| `<unary_op>` | `~` (bitwise NOT) |
| `<binary_op>` | `\|` (bitwise OR), `&` (bitwise AND), `^` (bitwise XOR), `+`, `-`, `/`, `*` |

### Operator Precedence

1. **Parentheses**: `()`
2. **Unary operators**: `!` (logical NOT), `~` (bitwise NOT)
3. **Arithmetic**: `*`, `/` (left-to-right)
4. **Arithmetic**: `+`, `-` (left-to-right)
5. **Bitwise**: `&`, `|`, `^` (left-to-right)
6. **Comparison**: `==`, `!=`, `<`, `>`, `<=`, `>=`, `contains`, `like`
7. **Logical**: `&&` (AND)
8. **Logical**: `||` (OR)

## Conclusion

This guide covered the essential aspects of using PubNub's filtering capabilities:

- **Message Filters**: Real-time filtering during subscriptions
- **Subscribe Filters**: Control message delivery based on content and metadata
- **Filter Language**: Comprehensive expression syntax for complex filtering logic

### Related Documentation

- [Publishing Messages with Metadata](/docs/general/messages/publish#publish-with-message-filters)
- [App Context Filtering](/docs/general/metadata/filtering)
- [Channel Groups](/docs/general/channels/channel-groups)
- [Presence Events](/docs/general/presence/presence-events)

### Best Practices

- Use specific filter expressions to reduce bandwidth
- Test filter expressions thoroughly before production deployment
- Consider filter complexity impact on performance
- Combine multiple filter types for optimal message routing
