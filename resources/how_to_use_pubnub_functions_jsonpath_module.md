# How to Use the JSONPath Module in PubNub Functions 2.0

The `jsonpath` module in PubNub Functions provides powerful JSON querying and manipulation capabilities using JSONPath expressions. This allows you to extract, filter, and transform complex JSON data structures efficiently, similar to how XPath works for XML documents.

## Requiring the JSONPath Module

To use the `jsonpath` module, you need to require it and destructure the JSONPath function:

```javascript
const { JSONPath } = require("jsonpath");
```

## Core Functionality

### `JSONPath({ path, json })`

The primary function for querying JSON data using JSONPath expressions.

*   `path` (String): The JSONPath expression to evaluate.
*   `json` (Object): The JSON object to query.
*   Returns an array of matching values from the JSON structure.

## JSONPath Expression Syntax

JSONPath uses a syntax similar to XPath for navigating JSON structures:

- `$` - Root object
- `.` - Child operator  
- `..` - Recursive descent (search at any depth)
- `[]` - Array subscript operator
- `[*]` - Array wildcard (all elements)
- `[start:end]` - Array slice
- `?()` - Filter expression
- `@` - Current item in filter expressions

### Basic Path Examples

```javascript
const { JSONPath } = require("jsonpath");

const data = {
  store: {
    book: [
      {
        category: "reference",
        author: "Nigel Rees",
        title: "Sayings of the Century",
        price: 8.95
      },
      {
        category: "fiction",
        author: "Evelyn Waugh",
        title: "Sword of Honour",
        price: 12.99
      },
      {
        category: "fiction",
        author: "Herman Melville",
        title: "Moby Dick",
        isbn: "0-553-21311-3",
        price: 8.99
      }
    ],
    bicycle: {
      color: "red",
      price: 19.95
    }
  }
};

// Get all book titles
const titles = JSONPath({ path: "$.store.book[*].title", json: data });
console.log(titles); // ["Sayings of the Century", "Sword of Honour", "Moby Dick"]

// Get all prices (books and bicycle)
const allPrices = JSONPath({ path: "$..price", json: data });
console.log(allPrices); // [8.95, 12.99, 8.99, 19.95]

// Get the first book
const firstBook = JSONPath({ path: "$.store.book[0]", json: data });
console.log(firstBook); // [{ category: "reference", author: "Nigel Rees", ... }]

// Get books by category (filter)
const fictionBooks = JSONPath({ path: "$.store.book[?(@.category=='fiction')]", json: data });
console.log(fictionBooks); // Array of fiction books
```

## Practical Examples

### Example 1: User Data Processing and Filtering

```javascript
export default async (request) => {
  const { JSONPath } = require("jsonpath");
  const pubnub = require("pubnub");
  
  try {
    const userData = request.message.users;
    
    if (!userData || !Array.isArray(userData)) {
      return request.abort();
    }
    
    const userCollection = { users: userData };
    
    // Extract all user emails
    const emails = JSONPath({ path: "$.users[*].email", json: userCollection });
    
    // Find active users
    const activeUsers = JSONPath({ path: "$.users[?(@.status=='active')]", json: userCollection });
    
    // Find premium users with high scores
    const premiumHighScorers = JSONPath({ 
      path: "$.users[?(@.subscription=='premium' && @.score > 80)]", 
      json: userCollection 
    });
    
    // Extract user IDs for users who joined this year
    const currentYear = new Date().getFullYear();
    const newUserIds = JSONPath({ 
      path: `$.users[?(@.joinYear==${currentYear})].id`, 
      json: userCollection 
    });
    
    // Find users with specific permissions
    const adminUsers = JSONPath({ 
      path: "$.users[?(@.permissions && @.permissions.indexOf('admin') > -1)]", 
      json: userCollection 
    });
    
    // Create analytics summary
    const analyticsData = {
      totalUsers: userData.length,
      activeUsers: activeUsers.length,
      premiumHighScorers: premiumHighScorers.length,
      newUsersThisYear: newUserIds.length,
      adminUsers: adminUsers.length,
      emailDomains: emails.map(email => email.split('@')[1]).filter((domain, index, arr) => arr.indexOf(domain) === index)
    };
    
    // Publish analytics to monitoring channel
    await pubnub.fire({
      channel: 'user.analytics',
      message: {
        analytics: analyticsData,
        timestamp: Date.now(),
        source: request.channels[0]
      }
    });
    
    // Add filtered data to message
    request.message.filtered = {
      activeUsers: activeUsers.map(user => ({ id: user.id, email: user.email })),
      premiumHighScorers: premiumHighScorers.map(user => ({ id: user.id, score: user.score })),
      newUserIds: newUserIds
    };
    
    return request.ok();
  } catch (error) {
    console.error('JSONPath user processing error:', error);
    return request.abort();
  }
};
```

### Example 2: Order Processing and Inventory Management

```javascript
export default async (request) => {
  const { JSONPath } = require("jsonpath");
  const db = require("kvstore");
  const pubnub = require("pubnub");
  
  try {
    const orderData = request.message;
    
    // Extract all product IDs from order items
    const productIds = JSONPath({ path: "$.items[*].productId", json: orderData });
    
    // Calculate total order value
    const itemTotals = JSONPath({ path: "$.items[*].total", json: orderData });
    const orderTotal = itemTotals.reduce((sum, total) => sum + total, 0);
    
    // Find high-value items (over $100)
    const highValueItems = JSONPath({ 
      path: "$.items[?(@.price > 100)]", 
      json: orderData 
    });
    
    // Extract shipping info for urgent orders
    const isUrgent = JSONPath({ path: "$.shipping.priority", json: orderData })[0] === 'express';
    const shippingAddress = JSONPath({ path: "$.shipping.address", json: orderData })[0];
    
    // Find items that need special handling
    const specialHandlingItems = JSONPath({ 
      path: "$.items[?(@.attributes && @.attributes.indexOf('fragile') > -1)]", 
      json: orderData 
    });
    
    // Update inventory for each product
    for (const productId of productIds) {
      const inventoryKey = `inventory:${productId}`;
      const currentStock = await db.getCounter(inventoryKey);
      
      // Find quantity for this product in the order
      const productQuantity = JSONPath({ 
        path: `$.items[?(@.productId=='${productId}')].quantity`, 
        json: orderData 
      })[0] || 0;
      
      // Decrement inventory
      const newStock = await db.incrCounter(inventoryKey, -productQuantity);
      
      // Alert if stock is low
      if (newStock < 10) {
        await pubnub.fire({
          channel: 'inventory.alerts',
          message: {
            productId: productId,
            currentStock: newStock,
            alertType: 'low_stock',
            threshold: 10,
            timestamp: Date.now()
          }
        });
      }
    }
    
    // Process high-value order notifications
    if (orderTotal > 500) {
      await pubnub.publish({
        channel: 'orders.high_value',
        message: {
          orderId: orderData.orderId,
          customerId: orderData.customerId,
          totalValue: orderTotal,
          itemCount: productIds.length,
          highValueItems: highValueItems,
          timestamp: Date.now()
        }
      });
    }
    
    // Handle urgent shipping
    if (isUrgent) {
      await pubnub.publish({
        channel: 'shipping.urgent',
        message: {
          orderId: orderData.orderId,
          shippingAddress: shippingAddress,
          specialHandling: specialHandlingItems.length > 0,
          estimatedProcessingTime: specialHandlingItems.length > 0 ? '2-4 hours' : '1-2 hours',
          timestamp: Date.now()
        }
      });
    }
    
    // Add processing metadata
    request.message.processing = {
      orderTotal: orderTotal,
      productCount: productIds.length,
      hasHighValueItems: highValueItems.length > 0,
      requiresSpecialHandling: specialHandlingItems.length > 0,
      isUrgent: isUrgent,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Order processing error:', error);
    return request.abort();
  }
};
```

### Example 3: Configuration and Settings Extraction

```javascript
export default async (request, response) => {
  const { JSONPath } = require("jsonpath");
  const db = require("kvstore");
  
  try {
    // Get application configuration from KV store
    const config = await db.get('app_config') || {};
    
    const action = request.params.action;
    const section = request.query.section;
    
    switch (action) {
      case 'get_settings':
        let settings;
        
        if (section) {
          // Extract specific section using JSONPath
          settings = JSONPath({ path: `$.${section}`, json: config });
          if (settings.length === 0) {
            return response.send({ error: `Section '${section}' not found` }, 404);
          }
          settings = settings[0];
        } else {
          settings = config;
        }
        
        // Extract environment-specific settings
        const environment = request.query.env || 'production';
        const envSettings = JSONPath({ path: `$.environments.${environment}`, json: config });
        
        // Extract feature flags
        const featureFlags = JSONPath({ path: "$.features[?(@.enabled==true)]", json: config });
        
        // Extract API endpoints
        const apiEndpoints = JSONPath({ path: "$.apis[*].endpoint", json: config });
        
        // Extract security settings
        const securityConfig = JSONPath({ path: "$.security", json: config });
        
        const responseData = {
          settings: settings,
          environment: envSettings.length > 0 ? envSettings[0] : null,
          enabledFeatures: featureFlags.map(feature => feature.name),
          apiEndpoints: apiEndpoints,
          security: securityConfig.length > 0 ? securityConfig[0] : null,
          lastUpdated: config.lastUpdated || null
        };
        
        return response.send(responseData, 200);
        
      case 'validate_config':
        // Validate required configuration fields
        const requiredPaths = [
          '$.database.host',
          '$.database.port', 
          '$.apis.primary.endpoint',
          '$.security.encryption.enabled'
        ];
        
        const validationResults = {};
        let isValid = true;
        
        for (const path of requiredPaths) {
          const result = JSONPath({ path: path, json: config });
          validationResults[path] = {
            exists: result.length > 0,
            value: result.length > 0 ? result[0] : null
          };
          
          if (result.length === 0) {
            isValid = false;
          }
        }
        
        // Check for deprecated settings
        const deprecatedSettings = JSONPath({ path: "$..deprecated[?(@==true)]", json: config });
        
        return response.send({
          valid: isValid,
          validation: validationResults,
          hasDeprecatedSettings: deprecatedSettings.length > 0,
          timestamp: Date.now()
        }, 200);
        
      case 'get_by_type':
        const configType = request.query.type;
        if (!configType) {
          return response.send({ error: 'Type parameter required' }, 400);
        }
        
        // Find all configuration items of a specific type
        const typedConfig = JSONPath({ path: `$..[$?(@.type=='${configType}')]`, json: config });
        
        return response.send({
          type: configType,
          items: typedConfig,
          count: typedConfig.length
        }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Configuration extraction error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 4: Analytics and Reporting

```javascript
export default async (request) => {
  const { JSONPath } = require("jsonpath");
  const pubnub = require("pubnub");
  const db = require("kvstore");
  
  try {
    const eventData = request.message;
    
    // Extract different types of analytics data
    const analytics = {
      userActions: [],
      errorEvents: [],
      performanceMetrics: [],
      conversionEvents: []
    };
    
    // Extract user actions
    if (eventData.events) {
      analytics.userActions = JSONPath({ 
        path: "$.events[?(@.type=='user_action')]", 
        json: eventData 
      });
      
      // Extract error events
      analytics.errorEvents = JSONPath({ 
        path: "$.events[?(@.type=='error')]", 
        json: eventData 
      });
      
      // Extract performance data
      analytics.performanceMetrics = JSONPath({ 
        path: "$.events[?(@.type=='performance' && @.duration > 0)]", 
        json: eventData 
      });
      
      // Extract conversion events
      analytics.conversionEvents = JSONPath({ 
        path: "$.events[?(@.type=='conversion' && @.value > 0)]", 
        json: eventData 
      });
    }
    
    // Extract session information
    const sessionData = JSONPath({ path: "$.session", json: eventData });
    const userId = JSONPath({ path: "$.session.userId", json: eventData })[0];
    const sessionId = JSONPath({ path: "$.session.id", json: eventData })[0];
    
    // Calculate session metrics
    if (sessionData.length > 0) {
      const session = sessionData[0];
      
      // Update session duration in KV store
      if (sessionId && session.startTime) {
        const sessionKey = `session_duration:${sessionId}`;
        const currentTime = Date.now();
        const duration = currentTime - session.startTime;
        await db.set(sessionKey, duration, 60); // 1 hour TTL
      }
    }
    
    // Process page view events
    const pageViews = JSONPath({ 
      path: "$.events[?(@.type=='page_view')]", 
      json: eventData 
    });
    
    for (const pageView of pageViews) {
      const page = pageView.page;
      if (page) {
        await db.incrCounter(`page_views:${page}`);
        
        // Track unique visitors per page
        if (userId) {
          const uniqueVisitorKey = `unique_visitors:${page}:${userId}`;
          const existingVisit = await db.get(uniqueVisitorKey);
          if (!existingVisit) {
            await db.set(uniqueVisitorKey, Date.now(), 1440); // 24 hours
            await db.incrCounter(`unique_page_visitors:${page}`);
          }
        }
      }
    }
    
    // Calculate aggregated metrics
    const totalUserActions = analytics.userActions.length;
    const totalErrors = analytics.errorEvents.length;
    const averagePerformance = analytics.performanceMetrics.length > 0 
      ? analytics.performanceMetrics.reduce((sum, metric) => sum + metric.duration, 0) / analytics.performanceMetrics.length
      : 0;
    const totalConversions = analytics.conversionEvents.reduce((sum, event) => sum + event.value, 0);
    
    // Extract device and browser info
    const deviceInfo = JSONPath({ path: "$.session.device", json: eventData })[0];
    const browserInfo = JSONPath({ path: "$.session.browser", json: eventData })[0];
    
    // Track device/browser usage
    if (deviceInfo) {
      await db.incrCounter(`device_usage:${deviceInfo.type}`);
      await db.incrCounter(`os_usage:${deviceInfo.os}`);
    }
    
    if (browserInfo) {
      await db.incrCounter(`browser_usage:${browserInfo.name}`);
    }
    
    // Publish analytics summary
    await pubnub.fire({
      channel: 'analytics.summary',
      message: {
        sessionId: sessionId,
        userId: userId,
        metrics: {
          userActions: totalUserActions,
          errors: totalErrors,
          averagePerformance: averagePerformance,
          conversions: totalConversions,
          pageViews: pageViews.length
        },
        device: deviceInfo,
        browser: browserInfo,
        timestamp: Date.now()
      }
    });
    
    // Publish error alerts if needed
    if (totalErrors > 5) {
      await pubnub.publish({
        channel: 'alerts.errors',
        message: {
          userId: userId,
          sessionId: sessionId,
          errorCount: totalErrors,
          errors: analytics.errorEvents,
          severity: totalErrors > 10 ? 'high' : 'medium',
          timestamp: Date.now()
        }
      });
    }
    
    return request.ok();
  } catch (error) {
    console.error('Analytics processing error:', error);
    return request.abort();
  }
};
```

### Example 5: Data Transformation and Restructuring

```javascript
export default async (request) => {
  const { JSONPath } = require("jsonpath");
  const pubnub = require("pubnub");
  
  try {
    const sourceData = request.message;
    
    // Transform complex nested data structure
    const transformedData = {
      id: JSONPath({ path: "$.id", json: sourceData })[0],
      timestamp: Date.now(),
      summary: {},
      details: {},
      metadata: {}
    };
    
    // Extract and transform user information
    const userData = JSONPath({ path: "$.user", json: sourceData });
    if (userData.length > 0) {
      const user = userData[0];
      transformedData.summary.user = {
        id: JSONPath({ path: "$.id", json: user })[0],
        name: JSONPath({ path: "$.profile.name", json: user })[0],
        email: JSONPath({ path: "$.contact.email", json: user })[0],
        tier: JSONPath({ path: "$.subscription.tier", json: user })[0]
      };
      
      // Extract user preferences
      const preferences = JSONPath({ path: "$.preferences.*", json: user });
      transformedData.details.userPreferences = preferences;
      
      // Extract user activity history
      const recentActivity = JSONPath({ 
        path: "$.activity[?(@.timestamp > " + (Date.now() - 86400000) + ")]", 
        json: user 
      });
      transformedData.details.recentActivity = recentActivity;
    }
    
    // Extract and transform order data
    const orderData = JSONPath({ path: "$.orders[*]", json: sourceData });
    if (orderData.length > 0) {
      // Calculate order summaries
      const orderSummaries = orderData.map(order => ({
        id: JSONPath({ path: "$.id", json: order })[0],
        total: JSONPath({ path: "$.total", json: order })[0],
        status: JSONPath({ path: "$.status", json: order })[0],
        itemCount: JSONPath({ path: "$.items[*]", json: order }).length
      }));
      
      transformedData.summary.orders = {
        count: orderSummaries.length,
        totalValue: orderSummaries.reduce((sum, order) => sum + (order.total || 0), 0),
        statuses: orderSummaries.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {})
      };
      
      // Extract detailed item information
      const allItems = [];
      orderData.forEach(order => {
        const items = JSONPath({ path: "$.items[*]", json: order });
        allItems.push(...items);
      });
      
      transformedData.details.items = allItems;
      
      // Extract shipping information
      const shippingInfo = orderData.map(order => 
        JSONPath({ path: "$.shipping", json: order })[0]
      ).filter(shipping => shipping);
      
      transformedData.details.shipping = shippingInfo;
    }
    
    // Extract metadata and tags
    const tags = JSONPath({ path: "$..tags[*]", json: sourceData });
    const categories = JSONPath({ path: "$..category", json: sourceData });
    const priorities = JSONPath({ path: "$..priority", json: sourceData });
    
    transformedData.metadata = {
      tags: [...new Set(tags)], // Remove duplicates
      categories: [...new Set(categories)],
      priorities: [...new Set(priorities)],
      totalFields: JSONPath({ path: "$..*", json: sourceData }).length,
      transformation: {
        sourceChannel: request.channels[0],
        transformedAt: Date.now(),
        version: '2.0'
      }
    };
    
    // Extract performance metrics if available
    const performanceData = JSONPath({ path: "$.performance", json: sourceData });
    if (performanceData.length > 0) {
      const perf = performanceData[0];
      transformedData.summary.performance = {
        responseTime: JSONPath({ path: "$.responseTime", json: perf })[0],
        throughput: JSONPath({ path: "$.throughput", json: perf })[0],
        errorRate: JSONPath({ path: "$.errorRate", json: perf })[0]
      };
    }
    
    // Route transformed data based on content
    const routingChannels = ['data.transformed'];
    
    if (transformedData.summary.orders && transformedData.summary.orders.count > 0) {
      routingChannels.push('data.orders');
    }
    
    if (transformedData.summary.user) {
      routingChannels.push('data.users');
    }
    
    if (transformedData.summary.performance) {
      routingChannels.push('data.performance');
    }
    
    // Publish to appropriate channels
    for (const channel of routingChannels) {
      await pubnub.fire({
        channel: channel,
        message: transformedData
      });
    }
    
    // Update original message with transformation summary
    request.message.transformation = {
      success: true,
      originalSize: JSON.stringify(sourceData).length,
      transformedSize: JSON.stringify(transformedData).length,
      fieldsExtracted: Object.keys(transformedData.summary).length + Object.keys(transformedData.details).length,
      routedToChannels: routingChannels,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Data transformation error:', error);
    return request.abort();
  }
};
```

## Advanced JSONPath Features

### Filter Expressions

JSONPath supports powerful filter expressions using `?()` syntax:

```javascript
// Numeric comparisons
const expensiveItems = JSONPath({ path: "$.items[?(@.price > 50)]", json: data });
const discountedItems = JSONPath({ path: "$.items[?(@.discount >= 0.1)]", json: data });

// String comparisons
const activeUsers = JSONPath({ path: "$.users[?(@.status=='active')]", json: data });
const premiumUsers = JSONPath({ path: "$.users[?(@.tier=='premium')]", json: data });

// Complex conditions
const eligibleUsers = JSONPath({ 
  path: "$.users[?(@.age >= 18 && @.verified==true && @.balance > 100)]", 
  json: data 
});

// Array membership
const adminUsers = JSONPath({ 
  path: "$.users[?(@.roles.indexOf('admin') > -1)]", 
  json: data 
});

// Regular expressions (when supported)
const emailUsers = JSONPath({ 
  path: "$.users[?(@.email.match(/.*@gmail\\.com$/))]", 
  json: data 
});
```

### Array Operations

```javascript
// Array slicing
const firstThreeItems = JSONPath({ path: "$.items[0:3]", json: data });
const lastTwoItems = JSONPath({ path: "$.items[-2:]", json: data });

// Array length and indexing
const arrayLengths = JSONPath({ path: "$..*[*].length", json: data });
const specificIndices = JSONPath({ path: "$.items[1,3,5]", json: data });
```

## Use Cases and Applications

### Data Processing
- **Message Filtering:** Extract specific data from complex message structures
- **Content Routing:** Route messages based on extracted values
- **Data Validation:** Verify required fields exist in nested structures
- **Analytics Extraction:** Pull metrics and KPIs from complex data

### Configuration Management
- **Settings Extraction:** Get specific configuration sections
- **Feature Flag Processing:** Extract enabled features and their settings
- **Environment-Specific Config:** Pull environment-based configurations
- **Validation:** Check for required configuration fields

### API Processing
- **Response Transformation:** Transform API responses before forwarding
- **Parameter Extraction:** Extract specific values from request payloads
- **Batch Processing:** Process arrays of similar objects efficiently
- **Error Handling:** Extract error details from complex error structures

## Limits and Considerations

*   **Performance:** Complex JSONPath expressions with deep recursion can be slow on large data structures.
*   **Memory Usage:** JSONPath creates arrays of results, which can consume memory for large datasets.
*   **Expression Complexity:** Very complex filter expressions may be difficult to maintain and debug.
*   **Error Handling:** Invalid JSONPath expressions will throw errors, so always use try-catch blocks.
*   **Data Size:** Consider the size of JSON structures when using recursive descent (`..`) operators.

## Best Practices

*   **Test expressions** with sample data before deploying to production.
*   **Use specific paths** rather than broad recursive searches when possible for better performance.
*   **Handle empty results** gracefully - JSONPath returns an empty array when no matches are found.
*   **Cache frequently used** extracted data in the KV store to avoid repeated processing.
*   **Validate input data** structure before applying JSONPath expressions.
*   **Use meaningful variable names** to make JSONPath expressions more readable.
*   **Consider alternatives** for very simple extractions - direct object property access might be faster.
*   **Log JSONPath errors** to help debug expression issues in production.
*   **Combine with other modules** like utils for validation and codec modules for further processing.