# Understanding PubNub Subscribe, Channel and Message Filters

Subscribe filters allow you to selectively receive messages during subscription by applying server-side filtering logic. Instead of receiving all messages on a channel and filtering them client-side, you can instruct PubNub to only deliver messages that match your specific criteria, reducing bandwidth and improving performance.

## What are Subscribe Filters?

* **Server-Side Filtering:** Filters are applied on PubNub's servers before messages are sent to your client, reducing unnecessary data transmission.
* **Real-Time Selection:** Only messages matching your filter criteria are delivered to your subscribers.
* **Bandwidth Optimization:** Significantly reduces network traffic by filtering out unwanted messages at the source.
* **Expression-Based:** Uses a powerful expression language to define complex filtering logic across message payload and metadata.

## Filterable Message Components

### Message Payload Filtering (`data.*`)

Access any field within the published message content using the `data.` prefix.

```javascript
// Basic payload filtering
data.text == "Hello World"                    // Exact text match
data.type == "announcement"                   // Message type filtering
data.priority != "low"                        // Exclude low priority
data.score > 100                              // Numeric comparisons
data.timestamp LIKE "*2025*"                  // Date/time patterns

// Nested payload objects
data.user["name"] == "Alice"                  // User information
data.config["enabled"] == "true"              // Configuration flags
data.location["city"] CONTAINS "New York"     // Geographic filtering

// Payload arrays
data.recipients[0] == "alice@example.com"     // First recipient
data.scores[2] > 80                           // Array element comparison
data.tags CONTAINS "urgent"                  // Array content search
```

### Message Metadata Filtering (`meta.*`)

Access metadata attached during publishing using the `meta.` prefix.

```javascript
// Basic metadata filtering
meta.priority == "high"                       // Priority levels
meta.region == "us-west"                      // Geographic routing
meta.category != "test"                       // Exclude test messages
meta.level > 5                                // Numeric thresholds
meta.version LIKE "2.*"                       // Version patterns

// Nested metadata objects
meta.user["role"] == "moderator"              // User permissions
meta.settings["notifications"] == "true"      // User preferences
meta.device["type"] CONTAINS "mobile"         // Device targeting

// Metadata arrays
meta.permissions[0] == "read"                 // First permission
meta.categories CONTAINS "finance"            // Category membership
meta.scores[1] >= 75                          // Array element thresholds
```

## Operator Reference

### Comparison Operators

| Operator | Description | Example | Use Case |
|----------|-------------|---------|----------|
| `==` | Exact equality | `meta.status == "active"` | Precise matching |
| `!=` | Not equal | `data.type != "debug"` | Exclusion filtering |
| `>` | Greater than | `meta.score > 100` | Threshold filtering |
| `<` | Less than | `data.size < 1024` | Limit filtering |
| `>=` | Greater or equal | `meta.level >= 5` | Minimum requirements |
| `<=` | Less or equal | `data.priority <= 3` | Maximum limits |

### Pattern Matching Operators

| Operator | Description | Example | Use Case |
|----------|-------------|---------|----------|
| `LIKE` | Wildcard pattern | `data.title LIKE "News*"` | Prefix/suffix matching |
| `CONTAINS` | Substring search | `meta.tags CONTAINS "urgent"` | Content search |

**Wildcard Rules:**
- Use `*` for wildcard matching
- `*` can be at start, end, or both: `"*middle*"`, `"prefix*"`, `"*suffix"`
- Escape literal asterisks with backslash: `"literal\*"`
- Pattern matching is case-insensitive

### Arithmetic Operators

| Operator | Description | Example | Use Case |
|----------|-------------|---------|----------|
| `%` | Modulo (remainder) | `meta.userId%10 == 0` | Sampling, load balancing |
| `+` | Addition | `meta.base + 5 > 20` | Calculated thresholds |
| `-` | Subtraction | `data.total - data.used < 10` | Remaining capacity |
| `*` | Multiplication | `meta.rate * 100 > 50` | Percentage calculations |
| `/` | Division | `data.total / data.count > 5` | Averages |

### Logical Operators

| Operator | Description | Example | Use Case |
|----------|-------------|---------|----------|
| `&&` | Logical AND | `meta.status == "active" && data.score > 50` | All conditions must be true |
| `\|\|` | Logical OR | `meta.priority == "high" \|\| data.urgent == "true"` | Any condition can be true |
| `!` | Logical NOT | `!(data.type == "system")` | Negation |

### Data Access Operators

| Operator | Description | Example | Use Case |
|----------|-------------|---------|----------|
| `[index]` | Array element | `meta.tags[0] == "urgent"` | Specific array elements |
| `["key"]` | Object property | `meta.user["role"] == "admin"` | Nested object access |

## Complex Filter Expressions

### Boolean Logic Combinations
```javascript
// Multiple conditions with precedence
(meta.priority == "high" || meta.priority == "critical") && 
data.text CONTAINS "urgent" && 
meta.region != "test"

// Cross-field filtering
meta.userRole == "admin" && 
data.action == "delete" && 
data.target["type"] == "production"

// Nested logical operations
(meta.user["tier"] == "premium" && data.quota > 1000) ||
(meta.user["tier"] == "basic" && data.quota <= 100)
```

### Arithmetic in Filter Logic
```javascript
// Modulo for sampling and distribution
meta.eventId % 100 == 0                      // 1% sampling
meta.shardKey % 3 == currentShard             // Load distribution  
data.messageId % 2 != 0                      // Odd messages only

// Calculated thresholds
meta.score >= (meta.baseScore + meta.bonus)
data.usage > (data.limit * 0.8)              // 80% threshold warning
meta.attempts < (meta.maxAttempts - 1)       // Before final attempt
```

### Advanced Pattern Matching
```javascript
// Complex text patterns
data.subject LIKE "*[URGENT]*" &&
data.body CONTAINS "maintenance" &&
!(data.body LIKE "*test*")

// Version and identifier patterns  
meta.version LIKE "2.1*" &&
data.buildId LIKE "*-prod-*" &&
meta.environment != "staging"
```

### Array and Object Filtering
```javascript
// Array element filtering
meta.permissions[0] == "admin" ||             // First permission
meta.categories CONTAINS "finance" ||         // Any category
data.recipients[1] LIKE "*@company.com"       // Second recipient domain

// Nested object filtering
meta.user["department"] == "engineering" &&
data.project["status"] == "active" &&
meta.approval["level"] >= data.security["required"]

// Combined array and object access
meta.teams[0]["lead"] == currentUser &&
data.tasks CONTAINS "review" &&
meta.deadline["days"] <= 7
```

## Boolean Value Handling

### Boolean Filtering Syntax

```javascript
// String comparison (recommended - works everywhere)
meta.enabled == "true"                       // Check if boolean is true
meta.active == "false"                       // Check if boolean is false
meta.enabled != "false"                      // Check if boolean is not false

// Numeric boolean flags (alternative)
meta.isActive == 1                           // 1 for true, 0 for false
meta.flag == 0                               // 0 for false, 1 for true
```

### Boolean Publishing Best Practices

```javascript
// Option 1: Publish booleans as strings (recommended)
publish({
  message: { text: "Hello" },
  meta: { 
    enabled: "true",     // String boolean
    active: "false"      // String boolean  
  }
});

// Option 2: Use numeric flags
publish({
  message: { text: "Hello" },
  meta: { 
    enabled: 1,          // 1 = true
    active: 0            // 0 = false
  }
});

// Option 3: Publish for inequality checks  
publish({
  message: { text: "Hello" },
  meta: { 
    enabled: "true",     // Can use != "false" to check
    disabled: "false"    // Can use != "true" to check
  }
});
```

## Real-World Use Cases

### Chat Application
```javascript
// Comprehensive chat message filtering
(meta.user["role"] == "moderator" || meta.user["role"] == "admin") &&
data.text != "" &&
!(data.text LIKE "*spam*") &&
meta.channel["private"] != "true" &&
data.mentions CONTAINS currentUsername

// Direct message filtering
meta.conversation["participants"] CONTAINS currentUserId &&
data.type == "direct_message" &&
meta.conversation["active"] == "true"
```

### IoT Data Streams
```javascript
// Smart sensor data filtering
data.sensor["type"] == "temperature" &&
data.sensor["location"] LIKE "building-a*" &&
(data.value > meta.thresholds["high"] || data.value < meta.thresholds["low"]) &&
meta.quality["score"] > 80 &&
data.timestamp LIKE "*$(getCurrentHour())*"

// Device health monitoring
meta.device["status"] != "maintenance" &&
(data.battery < 20 || data.errors[0] CONTAINS "critical") &&
meta.location["zone"] == currentZone &&
data.uptime % 3600 == 0                       // Hourly reports
```

### Gaming Applications
```javascript
// Player action filtering
data.player["level"] >= meta.room["minLevel"] &&
meta.game["mode"] == "competitive" &&
!(data.action LIKE "*cheat*") &&
(data.score % 100 == 0 || data.achievement == "true") &&
meta.server["region"] == playerRegion

// Tournament event filtering
meta.tournament["type"] == "championship" &&
data.participants CONTAINS currentPlayerId &&
meta.stakes > 1000 &&
data.match["round"] > 2 &&
meta.schedule["startTime"] LIKE "*weekend*"
```

### Financial Trading
```javascript
// Trading signal filtering
data.symbol LIKE "CRYPTO*" &&
data.price > meta.user["minPrice"] &&
(data.volume * data.price) > meta.filters["minValue"] &&
meta.exchange["region"] == "US" &&
data.changePercent > 5

// Risk management filtering  
data.position["size"] <= meta.limits["maxPosition"] &&
data.account["balance"] > (data.tradeValue * meta.marginRequirement) &&
!(meta.restrictions CONTAINS "dayTrading") &&
data.volatility["score"] < meta.riskTolerance
```

## Performance Optimization

### Filter Efficiency Guidelines

**Most Efficient (Use First):**
1. **Exact equality comparisons** - `meta.field == "value"`
2. **Numeric comparisons** - `data.score > 100` 
3. **Simple AND conditions** - `field1 == "value" && field2 > 5`

**Moderately Efficient:**
1. **Pattern matching** - `field LIKE "prefix*"`
2. **Substring search** - `field CONTAINS "text"`
3. **Array/object access** - `meta.array[0] == "value"`

**Less Efficient (Use Sparingly):**
1. **Complex arithmetic** - `(field1 + field2) * field3 > threshold`
2. **Deep nesting** - Multiple levels of object/array access
3. **Many OR conditions** - Long chains of `||` operators

### Metadata Design for Performance
```javascript
// ✅ Efficient metadata structure
meta: {
  priority: "high",              // Direct access
  userType: "premium",           // Avoid nested user.type
  categoryFlags: "news,urgent",  // Searchable with CONTAINS
  computedScore: 85,             // Pre-calculated values
  quickFlags: {                  // Single-level nesting
    urgent: "true",
    verified: "true"
  }
}

// ❌ Less efficient structure  
meta: {
  user: {
    profile: {
      tier: {
        level: "premium"         // Too deeply nested
      }
    }
  },
  categories: ["news", "urgent", "finance", "tech"]  // Better as string
}
```

## Common Patterns and Examples

### Content-Based Routing
```javascript
// Route messages by content type and priority
(data.contentType == "article" && meta.priority == "featured") ||
(data.contentType == "video" && meta.engagement["score"] > 80) ||
(data.contentType == "live" && meta.audience CONTAINS "premium")

// Language and region routing
data.language == userLanguage &&
meta.regions CONTAINS userRegion &&
data.localization["available"] == "true"
```

### User Segmentation
```javascript
// Target specific user segments
meta.userSegment["tier"] == "premium" &&
meta.preferences["notifications"] == "enabled" &&
(data.category CONTAINS meta.interests[0] || 
 data.category CONTAINS meta.interests[1])

// Permission-based filtering
meta.permissions CONTAINS requiredPermission &&
meta.user["department"] == targetDepartment &&
data.securityLevel <= meta.user["clearanceLevel"]
```

### Event Processing
```javascript
// Process events by type and frequency
data.eventType == "user_action" &&
meta.sampling["rate"] == 100 &&                // Full sampling
data.sessionId % 10 == userShard &&            // User-based sharding  
!(meta.flags CONTAINS "bot")

// Error and monitoring events
data.severity == "error" &&
meta.service LIKE "payment*" &&
data.errorCode != 404 &&
meta.alerting["escalate"] == "true"
```

### Time-Based Filtering
```javascript
// Time window filtering using patterns
data.timestamp LIKE "*T09:*" ||               // 9 AM hour
data.timestamp LIKE "*T10:*" ||               // 10 AM hour  
data.timestamp LIKE "*T11:*"                  // 11 AM hour

// Business hours filtering
data.businessHours == "true" &&
meta.timezone == userTimezone &&
!(data.schedule CONTAINS "weekend")

// Periodic sampling
meta.messageId % 1000 == 0 &&                 // Every 1000th message
data.timestamp LIKE "*:00:*"                  // Top of each minute
```

## Advanced Techniques

### Dynamic Filter Building
```javascript
// Build filters programmatically
function createUserFilter(userId, preferences) {
  let conditions = [];
  
  // Base user filtering
  conditions.push(`meta.targetUsers CONTAINS "${userId}"`);
  
  // Preference-based conditions
  if (preferences.priority) {
    conditions.push(`meta.priority == "${preferences.priority}"`);
  }
  
  if (preferences.categories.length > 0) {
    let catConditions = preferences.categories.map(cat => 
      `data.category == "${cat}"`
    );
    conditions.push(`(${catConditions.join(' || ')})`);
  }
  
  // Numeric preferences
  if (preferences.minScore) {
    conditions.push(`data.score >= ${preferences.minScore}`);
  }
  
  return conditions.join(' && ');
}

// Example usage
const filter = createUserFilter("alice123", {
  priority: "high",
  categories: ["news", "tech"],
  minScore: 80
});
// Result: meta.targetUsers CONTAINS "alice123" && meta.priority == "high" && (data.category == "news" || data.category == "tech") && data.score >= 80
```

### Multi-Tenant Filtering
```javascript
// Tenant isolation with feature flags
meta.tenantId == currentTenantId &&
(
  data.visibility == "public" ||
  meta.recipients CONTAINS currentUserId ||
  meta.user["role"] == "admin"
) &&
meta.features["advancedFiltering"] == "enabled"

// Hierarchical organization filtering
meta.organization["id"] == orgId &&
(
  meta.department CONTAINS userDepartment ||
  meta.permissions["crossDepartment"] == "true"
) &&
data.securityClassification <= userClearanceLevel
```

### Data Pipeline Filtering
```javascript
// Stream processing with quality gates
data.dataQuality["score"] > 95 &&
meta.source["verified"] == "true" &&
!(meta.flags CONTAINS "duplicate") &&
data.schema["version"] == currentSchemaVersion &&
meta.processing["stage"] == "validated"

// Real-time analytics filtering
meta.eventCategory == "conversion" &&
data.value > significantValueThreshold &&
meta.attribution["source"] != "bot" &&
data.funnel["step"] >= targetStep &&
meta.experiment["variant"] == activeVariant
```

## Integration Patterns

### Microservice Communication
```javascript
// Service-to-service message filtering
meta.sourceService != currentServiceName &&
meta.targetServices CONTAINS currentServiceName &&
data.messageVersion == supportedVersion &&
meta.routing["priority"] >= currentServicePriority

// Event-driven architecture
data.eventType LIKE "order.*" &&
meta.aggregateId CONTAINS targetEntityId &&
data.eventVersion <= maxSupportedVersion &&
meta.correlation["traceId"] == currentTraceId
```

### Real-time Notifications
```javascript
// User notification targeting
meta.userId == targetUserId &&
meta.preferences["push"] == "enabled" &&
(
  data.urgency == "immediate" ||
  (data.urgency == "normal" && meta.schedule["quietHours"] != "active")
) &&
meta.deviceTokens CONTAINS currentDeviceToken

// Geographic and demographic targeting
meta.targeting["location"] CONTAINS userCity &&
meta.demographics["ageGroup"] == userAgeGroup &&
data.campaign["active"] == "true" &&
meta.budget["remaining"] > data.cost
```

## Best Practices

### Filter Design
- **Use specific field names** rather than generic terms
- **Design metadata structure** with filtering in mind from the start
- **Include computed values** in metadata to avoid complex arithmetic in filters
- **Use consistent data types** across similar fields
- **Avoid deep nesting** beyond single-level object/array access

### Performance Optimization  
- **Put most selective conditions first** in compound expressions
- **Use numeric comparisons** instead of string when possible
- **Cache filter expressions** rather than rebuilding repeatedly
- **Monitor filter performance** impact on message throughput
- **Use modulo sampling** for high-volume streams

### Error Prevention
- **Always quote string values** with double quotes
- **Use consistent case** for operators (`LIKE`, `CONTAINS` in uppercase)
- **Test filter expressions** with sample data before deployment
- **Handle missing fields gracefully** - filtering on non-existent fields returns no matches
- **Escape special characters** in pattern matching (`\*` for literal asterisk)

### Troubleshooting
- **Test with simple expressions first** before building complexity
- **Verify published message structure** matches filter field references
- **Check URL encoding** when using REST API directly
- **Use truthy/falsy checks** when boolean literals don't work as expected
- **Include fallback logic** for critical message delivery

Subscribe filters provide a comprehensive solution for sophisticated real-time message routing and delivery optimization, enabling fine-grained control over which messages reach specific subscribers based on content, metadata, and complex business logic.