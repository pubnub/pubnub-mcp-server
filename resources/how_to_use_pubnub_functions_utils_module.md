# How to Use the Utils Module in PubNub Functions 2.0

The `utils` module in PubNub Functions provides a collection of simple utility functions that don't fit into other specific modules. These lightweight helpers are useful for common programming tasks like generating random numbers and validating data types.

## Requiring the Utils Module

To use the `utils` module, you first need to require it in your Function:

```javascript
const utils = require("utils");
```

## Core Methods

The utils module provides synchronous utility functions that return values immediately (not Promises).

### 1. `utils.randomInt(min, max)`

Generate a random integer between the provided minimum (inclusive) and maximum (exclusive).

*   `min` (Number): The minimum value (inclusive).
*   `max` (Number): The maximum value (exclusive).
*   Returns a random integer in the range `[min, max)`.

```javascript
// Generate a random number between 1 and 100 (inclusive)
const randomScore = utils.randomInt(1, 101);
console.log('Random score:', randomScore); // Could be 1, 2, 3, ..., 100

// Generate a random index for an array
const colors = ['red', 'green', 'blue', 'yellow'];
const randomIndex = utils.randomInt(0, colors.length);
const randomColor = colors[randomIndex];
console.log('Random color:', randomColor);

// Random delay for jitter (0-999 milliseconds)
const jitterMs = utils.randomInt(0, 1000);
console.log('Adding jitter:', jitterMs, 'ms');

// Random percentage (0-99)
const percentage = utils.randomInt(0, 100);
console.log('Random percentage:', percentage, '%');
```

### 2. `utils.isNumeric(value)`

Check if a given variable is a number or a string that represents a numeric value.

*   `value` (Any): The value to check.
*   Returns `true` if the input is numeric, `false` otherwise.

```javascript
// Test with actual numbers
console.log(utils.isNumeric(42));        // true
console.log(utils.isNumeric(3.14));      // true
console.log(utils.isNumeric(-17));       // true
console.log(utils.isNumeric(0));         // true

// Test with numeric strings
console.log(utils.isNumeric("42"));      // true
console.log(utils.isNumeric("3.14"));    // true
console.log(utils.isNumeric("-17"));     // true
console.log(utils.isNumeric("0"));       // true

// Test with non-numeric values
console.log(utils.isNumeric("hello"));   // false
console.log(utils.isNumeric(""));        // false
console.log(utils.isNumeric(null));      // false
console.log(utils.isNumeric(undefined)); // false
console.log(utils.isNumeric({}));        // false
console.log(utils.isNumeric([]));        // false
console.log(utils.isNumeric(true));      // false
```

## Practical Examples

### Example 1: Random Selection and Sampling

```javascript
export default async (request) => {
  const utils = require('utils');
  const pubnub = require('pubnub');
  
  try {
    const participants = request.message.participants || [];
    
    if (participants.length === 0) {
      return request.abort();
    }
    
    // Randomly select a winner from participants
    const winnerIndex = utils.randomInt(0, participants.length);
    const winner = participants[winnerIndex];
    
    // Add some randomness to prize distribution
    const prizes = [
      { name: 'Grand Prize', value: 1000 },
      { name: 'Second Prize', value: 500 },
      { name: 'Third Prize', value: 100 },
      { name: 'Consolation Prize', value: 10 }
    ];
    
    const prizeIndex = utils.randomInt(0, prizes.length);
    const selectedPrize = prizes[prizeIndex];
    
    // Publish the winner announcement
    await pubnub.publish({
      channel: 'contest.winners',
      message: {
        winner: winner,
        prize: selectedPrize,
        contestId: request.message.contestId,
        timestamp: Date.now(),
        totalParticipants: participants.length
      }
    });
    
    return request.ok();
  } catch (error) {
    console.error('Random selection error:', error);
    return request.abort();
  }
};
```

### Example 2: Input Validation and Data Processing

```javascript
export default async (request) => {
  const utils = require('utils');
  const db = require('kvstore');
  
  try {
    const userData = request.message.userData;
    const errors = [];
    
    // Validate numeric fields using utils.isNumeric
    if (userData.age !== undefined && !utils.isNumeric(userData.age)) {
      errors.push('Age must be a valid number');
    }
    
    if (userData.salary !== undefined && !utils.isNumeric(userData.salary)) {
      errors.push('Salary must be a valid number');
    }
    
    if (userData.zipCode !== undefined && !utils.isNumeric(userData.zipCode)) {
      errors.push('Zip code must be numeric');
    }
    
    // Check for validation errors
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      request.message.validationErrors = errors;
      return request.abort();
    }
    
    // Convert string numbers to actual numbers for processing
    const processedData = {
      ...userData,
      age: utils.isNumeric(userData.age) ? Number(userData.age) : userData.age,
      salary: utils.isNumeric(userData.salary) ? Number(userData.salary) : userData.salary,
      zipCode: utils.isNumeric(userData.zipCode) ? Number(userData.zipCode) : userData.zipCode
    };
    
    // Add some random processing delay for load balancing
    const processingDelay = utils.randomInt(100, 500);
    console.log(`Processing with ${processingDelay}ms delay`);
    
    // Store processed data
    await db.set(`user:${processedData.id}`, processedData, 1440); // 24 hours
    
    // Add processing metadata
    request.message.processed = {
      timestamp: Date.now(),
      processingDelay: processingDelay,
      dataValid: true
    };
    
    return request.ok();
  } catch (error) {
    console.error('Data processing error:', error);
    return request.abort();
  }
};
```

### Example 3: Rate Limiting with Random Jitter

```javascript
export default async (request) => {
  const utils = require('utils');
  const db = require('kvstore');
  
  try {
    const userId = request.message.userId;
    
    if (!userId) {
      return request.abort();
    }
    
    // Check if userId is valid (should be numeric in this example)
    if (!utils.isNumeric(userId)) {
      console.log('Invalid user ID format:', userId);
      return request.abort();
    }
    
    const currentMinute = Math.floor(Date.now() / 60000);
    const rateLimitKey = `rate_limit:${userId}:${currentMinute}`;
    
    // Get current request count
    const currentCount = await db.getCounter(rateLimitKey);
    const maxRequests = 10;
    
    if (currentCount >= maxRequests) {
      // Add random delay before rejecting to prevent thundering herd
      const jitterMs = utils.randomInt(1000, 5000);
      console.log(`Rate limit exceeded for user ${userId}, adding ${jitterMs}ms jitter`);
      
      // Store the delay for client-side retry logic
      request.message.retryAfter = jitterMs;
      return request.abort();
    }
    
    // Increment counter with some random jitter to spread load
    await db.incrCounter(rateLimitKey);
    
    // Add random processing identifier
    const processingId = utils.randomInt(100000, 999999);
    request.message.processingId = processingId;
    
    // Calculate remaining requests
    const remaining = maxRequests - (currentCount + 1);
    request.message.rateLimitStatus = {
      remaining: remaining,
      resetTime: (currentMinute + 1) * 60000, // Next minute
      processingId: processingId
    };
    
    return request.ok();
  } catch (error) {
    console.error('Rate limiting error:', error);
    return request.ok(); // Allow on error to avoid blocking
  }
};
```

### Example 4: A/B Testing with Random Distribution

```javascript
export default async (request) => {
  const utils = require('utils');
  const db = require('kvstore');
  
  try {
    const userId = request.message.userId;
    
    // Validate user ID
    if (!utils.isNumeric(userId)) {
      console.log('Invalid user ID for A/B testing:', userId);
      return request.abort();
    }
    
    // Determine A/B test group using random distribution
    // 50% get variant A, 50% get variant B
    const testGroup = utils.randomInt(0, 2) === 0 ? 'A' : 'B';
    
    // Store user's test group assignment
    const assignmentKey = `ab_test:feature_x:${userId}`;
    const existingAssignment = await db.get(assignmentKey);
    
    let finalGroup;
    if (existingAssignment) {
      // User already has an assignment, use it
      finalGroup = existingAssignment.group;
    } else {
      // New user, assign to random group
      finalGroup = testGroup;
      await db.set(assignmentKey, {
        group: finalGroup,
        assignedAt: Date.now(),
        userId: userId
      }, 10080); // 1 week TTL
    }
    
    // Track group assignment metrics
    await db.incrCounter(`ab_test:feature_x:group_${finalGroup}`);
    
    // Apply feature configuration based on group
    const featureConfig = {
      A: {
        buttonColor: 'blue',
        showNewUI: false,
        maxRetries: 3
      },
      B: {
        buttonColor: 'green',
        showNewUI: true,
        maxRetries: 5
      }
    };
    
    // Add A/B test context to message
    request.message.abTest = {
      featureName: 'feature_x',
      group: finalGroup,
      config: featureConfig[finalGroup],
      assignedAt: existingAssignment ? existingAssignment.assignedAt : Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('A/B testing error:', error);
    return request.ok(); // Continue without A/B testing on error
  }
};
```

### Example 5: Random Sampling for Analytics

```javascript
export default async (request) => {
  const utils = require('utils');
  const pubnub = require('pubnub');
  
  try {
    const eventData = request.message;
    
    // Sample only 10% of events for detailed analytics
    const shouldSample = utils.randomInt(0, 100) < 10; // 10% chance
    
    if (shouldSample) {
      // This event is selected for detailed tracking
      const analyticsData = {
        ...eventData,
        samplingRate: 0.1,
        sampleId: utils.randomInt(100000, 999999),
        timestamp: Date.now()
      };
      
      // Send to analytics channel
      await pubnub.fire({
        channel: 'analytics.detailed',
        message: analyticsData
      });
      
      console.log(`Event sampled for analytics: ${analyticsData.sampleId}`);
    }
    
    // Always do basic counting (not sampled)
    const eventType = eventData.type;
    if (utils.isNumeric(eventData.value)) {
      // Track numeric events differently
      await pubnub.fire({
        channel: 'analytics.numeric',
        message: {
          type: eventType,
          value: Number(eventData.value),
          timestamp: Date.now()
        }
      });
    }
    
    // Add sampling info to original message
    request.message.analytics = {
      sampled: shouldSample,
      samplingRate: 0.1
    };
    
    return request.ok();
  } catch (error) {
    console.error('Analytics sampling error:', error);
    return request.ok();
  }
};
```

## Use Cases and Applications

### Random Number Generation
- **Load Balancing:** Add random jitter to distribute processing load
- **A/B Testing:** Randomly assign users to test groups
- **Sampling:** Select random subsets of data for analysis
- **Gaming:** Generate random events, prizes, or outcomes
- **Timeouts:** Add random delays to prevent thundering herd problems

### Numeric Validation
- **Input Validation:** Ensure user input contains valid numbers
- **Data Type Conversion:** Safely convert string inputs to numbers
- **API Parameter Validation:** Validate numeric parameters in HTTP requests
- **Configuration Validation:** Ensure configuration values are properly formatted
- **Database Key Validation:** Validate that ID fields contain numeric values

## Limits and Considerations

*   **Randomness Quality:** The random number generator is suitable for most applications but may not be cryptographically secure for security-sensitive use cases.
*   **Range Limitations:** `randomInt()` works with JavaScript's safe integer range. For very large numbers, consider using BigInt arithmetic separately.
*   **Numeric Validation:** `isNumeric()` checks if a value can be converted to a number, but doesn't validate specific numeric formats (like phone numbers or credit cards).
*   **Performance:** Both functions are lightweight and synchronous, making them suitable for high-frequency use.
*   **Locale Considerations:** Numeric validation works with standard JavaScript number parsing, which may not handle all international number formats.

## Best Practices

*   **Use meaningful ranges** for random number generation based on your specific use case.
*   **Validate user input** with `isNumeric()` before performing mathematical operations.
*   **Add random jitter** to time-sensitive operations to prevent synchronized load spikes.
*   **Combine with other validation** - `isNumeric()` is just one part of comprehensive input validation.
*   **Consider edge cases** like very large numbers, scientific notation, and special values like `Infinity`.
*   **Use random sampling** to reduce processing load on high-volume data streams.
*   **Store random assignments** in the KV store to ensure consistency across multiple function calls.