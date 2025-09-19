# PubNub Functions 2.0 Real-World Implementation Patterns

This guide provides comprehensive real-world implementation patterns for PubNub Functions 2.0, demonstrating how to solve common challenges in building serverless real-time applications.

## Pattern 1: Distributed Counter with Atomic Operations

Perfect for implementing real-time voting, like counters, view tracking, and analytics.

### Use Case: Real-time Voting System

```javascript
// Function Type: Before Signal (triggered on channels matching "vote.*")
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    const voteData = request.message;
    const channelName = request.channels[0]; // e.g., "vote.poll123"
    const pollId = channelName.split('.')[1];
    const optionId = voteData.optionId;
    const userId = voteData.userId;
    
    // Prevent duplicate votes
    const userVoteKey = `user_vote:${pollId}:${userId}`;
    const existingVote = await db.get(userVoteKey);
    
    if (existingVote) {
      console.log(`User ${userId} already voted in poll ${pollId}`);
      request.message.error = 'duplicate_vote';
      return request.ok(); // Allow signal but mark as duplicate
    }
    
    // Atomically increment vote count
    const voteCountKey = `vote_count:${pollId}:${optionId}`;
    const newCount = await db.incrCounter(voteCountKey);
    
    // Record user vote with 24-hour TTL
    await db.set(userVoteKey, {
      optionId: optionId,
      timestamp: Date.now(),
      pollId: pollId
    }, 1440);
    
    // Update total votes for poll
    const totalVotesKey = `total_votes:${pollId}`;
    const totalVotes = await db.incrCounter(totalVotesKey);
    
    // Enhance signal with vote results
    request.message.voteCount = newCount;
    request.message.totalVotes = totalVotes;
    request.message.success = true;
    
    // Fire analytics event (doesn't go to subscribers)
    await pubnub.fire({
      channel: 'vote_analytics',
      message: {
        type: 'vote_cast',
        pollId: pollId,
        optionId: optionId,
        newCount: newCount,
        totalVotes: totalVotes,
        timestamp: Date.now()
      }
    });
    
    console.log(`Vote recorded: Poll ${pollId}, Option ${optionId}, Count: ${newCount}`);
    return request.ok();
    
  } catch (error) {
    console.error('Vote processing error:', error);
    request.message.error = 'processing_failed';
    return request.ok(); // Allow signal to proceed with error flag
  }
};
```

### Companion: Vote Results Aggregator (On Interval)

```javascript
// Function Type: On Interval (runs every 30 seconds)
export default async (event) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    // Get all vote-related keys
    const allKeys = await db.getKeys();
    const pollKeys = allKeys.filter(key => key.startsWith('vote_count:'));
    
    const pollResults = {};
    
    // Aggregate vote data by poll
    for (const key of pollKeys) {
      const [, pollId, optionId] = key.split(':');
      const count = await db.getCounter(key);
      
      if (!pollResults[pollId]) {
        pollResults[pollId] = { options: {}, total: 0 };
      }
      
      pollResults[pollId].options[optionId] = count;
      pollResults[pollId].total += count;
    }
    
    // Publish aggregated results
    for (const [pollId, results] of Object.entries(pollResults)) {
      await pubnub.publish({
        channel: `vote_results.${pollId}`,
        message: {
          pollId: pollId,
          results: results.options,
          totalVotes: results.total,
          timestamp: Date.now(),
          type: 'results_update'
        }
      });
    }
    
    console.log(`Published results for ${Object.keys(pollResults).length} polls`);
    return event.ok();
    
  } catch (error) {
    console.error('Vote aggregation error:', error);
    return event.abort();
  }
};
```

## Pattern 2: Message Enrichment Pipeline

Enhance incoming messages with data from external APIs, databases, and user profiles.

### Use Case: Social Media Post Enhancement

```javascript
// Function Type: Before Publish (triggered on "social.posts")
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const db = require('kvstore');
  const crypto = require('crypto');
  
  try {
    const post = request.message;
    const userId = post.userId;
    
    // Get API keys from vault
    const [userServiceKey, moderationKey, geoKey] = await Promise.all([
      vault.get("user_service_api_key"),
      vault.get("content_moderation_key"),
      vault.get("geo_service_key")
    ]);
    
    // Parallel enrichment requests
    const enrichmentPromises = [];
    
    // 1. Get user profile data
    if (userServiceKey) {
      enrichmentPromises.push(
        xhr.fetch(`https://api.userservice.com/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${userServiceKey}` }
        }).then(response => ({
          type: 'user_profile',
          data: response.status === 200 ? JSON.parse(response.body) : null
        }))
      );
    }
    
    // 2. Content moderation check
    if (moderationKey && post.content) {
      enrichmentPromises.push(
        xhr.fetch('https://api.moderation.com/analyze', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${moderationKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: post.content })
        }).then(response => ({
          type: 'moderation',
          data: response.status === 200 ? JSON.parse(response.body) : null
        }))
      );
    }
    
    // 3. Geolocation enrichment
    if (geoKey && post.location) {
      enrichmentPromises.push(
        xhr.fetch(`https://api.geocoding.com/reverse?lat=${post.location.lat}&lon=${post.location.lon}&key=${geoKey}`)
        .then(response => ({
          type: 'geo',
          data: response.status === 200 ? JSON.parse(response.body) : null
        }))
      );
    }
    
    // Execute all enrichments in parallel
    const enrichmentResults = await Promise.allSettled(enrichmentPromises);
    
    // Process enrichment results
    for (const result of enrichmentResults) {
      if (result.status === 'fulfilled' && result.value.data) {
        const { type, data } = result.value;
        
        switch (type) {
          case 'user_profile':
            post.author = {
              id: data.id,
              username: data.username,
              displayName: data.displayName,
              avatar: data.avatarUrl,
              verified: data.verified,
              followerCount: data.followerCount
            };
            break;
            
          case 'moderation':
            post.moderation = {
              score: data.score,
              categories: data.categories,
              approved: data.score < 0.8, // Auto-approve if score < 0.8
              flagged: data.score > 0.9
            };
            
            // Block post if high toxicity score
            if (data.score > 0.95) {
              console.log(`Post blocked due to high toxicity score: ${data.score}`);
              return request.abort();
            }
            break;
            
          case 'geo':
            post.location.address = {
              city: data.city,
              country: data.country,
              timezone: data.timezone
            };
            break;
        }
      }
    }
    
    // Add processing metadata
    post.enriched = true;
    post.enrichedAt = new Date().toISOString();
    post.processingId = await crypto.sha256(`${userId}:${Date.now()}`);
    
    // Cache enriched user data for future posts
    if (post.author) {
      await db.set(`user_cache:${userId}`, post.author, 60); // 1 hour cache
    }
    
    // Update enrichment statistics
    await db.incrCounter('posts_enriched_total');
    await db.incrCounter(`posts_enriched:${new Date().toISOString().split('T')[0]}`);
    
    console.log(`Post enriched for user ${userId}`);
    return request.ok();
    
  } catch (error) {
    console.error('Post enrichment error:', error);
    
    // Add error context but don't block the post
    request.message.enrichmentError = {
      error: error.message,
      timestamp: Date.now()
    };
    
    return request.ok();
  }
};
```

## Pattern 3: Rate Limiting and Throttling

Implement sophisticated rate limiting to protect your application from abuse.

### Use Case: API Rate Limiting with User Tiers

```javascript
// Function Type: Before Publish (triggered on "api.requests.*")
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    const apiRequest = request.message;
    const userId = apiRequest.userId;
    const endpoint = apiRequest.endpoint;
    const userTier = apiRequest.userTier || 'free';
    
    // Define rate limits by user tier
    const rateLimits = {
      free: { requests: 100, window: 3600 }, // 100 requests per hour
      premium: { requests: 1000, window: 3600 }, // 1000 requests per hour
      enterprise: { requests: 10000, window: 3600 } // 10000 requests per hour
    };
    
    const limit = rateLimits[userTier] || rateLimits.free;
    const currentWindow = Math.floor(Date.now() / (limit.window * 1000));
    
    // Check global rate limit for user
    const globalRateLimitKey = `rate_limit:${userId}:${currentWindow}`;
    const currentRequests = await db.getCounter(globalRateLimitKey);
    
    if (currentRequests >= limit.requests) {
      console.log(`Rate limit exceeded for user ${userId} (${userTier}): ${currentRequests}/${limit.requests}`);
      
      // Log rate limit violation
      await pubnub.fire({
        channel: 'rate_limit_violations',
        message: {
          userId: userId,
          userTier: userTier,
          currentRequests: currentRequests,
          limit: limit.requests,
          endpoint: endpoint,
          timestamp: Date.now()
        }
      });
      
      // Add rate limit info to message
      request.message.rateLimited = true;
      request.message.retryAfter = limit.window - (Date.now() % (limit.window * 1000)) / 1000;
      
      return request.abort(); // Block the request
    }
    
    // Check endpoint-specific rate limits
    const endpointRateLimitKey = `endpoint_rate_limit:${userId}:${endpoint}:${currentWindow}`;
    const endpointRequests = await db.getCounter(endpointRateLimitKey);
    
    // Different endpoints have different limits
    const endpointLimits = {
      'data_export': Math.floor(limit.requests * 0.1), // 10% of total limit
      'search': Math.floor(limit.requests * 0.3), // 30% of total limit
      'analytics': Math.floor(limit.requests * 0.2) // 20% of total limit
    };
    
    const endpointLimit = endpointLimits[endpoint] || Math.floor(limit.requests * 0.5);
    
    if (endpointRequests >= endpointLimit) {
      console.log(`Endpoint rate limit exceeded for ${endpoint}: ${endpointRequests}/${endpointLimit}`);
      request.message.endpointRateLimited = true;
      return request.abort();
    }
    
    // Increment counters with TTL
    await db.incrCounter(globalRateLimitKey);
    await db.incrCounter(endpointRateLimitKey);
    
    // Set TTL for cleanup (twice the window to be safe)
    await db.set(`${globalRateLimitKey}_ttl`, Date.now(), Math.ceil(limit.window * 2 / 60));
    await db.set(`${endpointRateLimitKey}_ttl`, Date.now(), Math.ceil(limit.window * 2 / 60));
    
    // Add rate limit headers to response
    request.message.rateLimitInfo = {
      limit: limit.requests,
      remaining: limit.requests - (currentRequests + 1),
      resetTime: (currentWindow + 1) * limit.window * 1000,
      userTier: userTier
    };
    
    console.log(`Request allowed for user ${userId}: ${currentRequests + 1}/${limit.requests}`);
    return request.ok();
    
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow request to proceed to avoid blocking legitimate traffic
    return request.ok();
  }
};
```

## Pattern 4: Event-Driven Workflow Orchestration

Coordinate complex multi-step workflows using PubNub Functions.

### Use Case: Order Processing Workflow

```javascript
// Function Type: Before Publish (triggered on "orders.new")
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  const uuid = require('uuid');
  
  try {
    const order = request.message;
    const orderId = order.orderId || uuid.v4();
    const workflowId = uuid.v4();
    
    // Initialize workflow state
    const workflowState = {
      orderId: orderId,
      workflowId: workflowId,
      status: 'initiated',
      steps: {
        payment: { status: 'pending', attempts: 0 },
        inventory: { status: 'pending', attempts: 0 },
        shipping: { status: 'pending', attempts: 0 },
        notification: { status: 'pending', attempts: 0 }
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };
    
    // Store workflow state
    await db.set(`workflow:${workflowId}`, workflowState, 2880); // 48 hour TTL
    await db.set(`order_workflow:${orderId}`, workflowId, 2880);
    
    // Enhance order with workflow info
    request.message.orderId = orderId;
    request.message.workflowId = workflowId;
    request.message.workflowStatus = 'initiated';
    
    // Start workflow by triggering payment processing
    await pubnub.fire({
      channel: 'workflow.payment',
      message: {
        type: 'process_payment',
        orderId: orderId,
        workflowId: workflowId,
        order: order,
        timestamp: Date.now()
      }
    });
    
    console.log(`Order workflow initiated: ${orderId} (workflow: ${workflowId})`);
    return request.ok();
    
  } catch (error) {
    console.error('Workflow initiation error:', error);
    return request.abort();
  }
};
```

### Workflow Step: Payment Processing

```javascript
// Function Type: Before Publish (triggered on "workflow.payment")
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    const { orderId, workflowId, order } = request.message;
    
    // Get workflow state
    const workflowState = await db.get(`workflow:${workflowId}`);
    if (!workflowState) {
      console.error(`Workflow not found: ${workflowId}`);
      return request.abort();
    }
    
    // Check if already processed
    if (workflowState.steps.payment.status === 'completed') {
      console.log(`Payment already processed for order ${orderId}`);
      return request.ok();
    }
    
    // Get payment service API key
    const paymentApiKey = await vault.get("payment_service_key");
    if (!paymentApiKey) {
      throw new Error("Payment service not configured");
    }
    
    // Update workflow state - processing
    workflowState.steps.payment.status = 'processing';
    workflowState.steps.payment.attempts += 1;
    workflowState.updatedAt = Date.now();
    await db.set(`workflow:${workflowId}`, workflowState, 2880);
    
    // Process payment
    const paymentResponse = await xhr.fetch('https://api.payments.com/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paymentApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: order.total,
        currency: order.currency,
        paymentMethod: order.paymentMethod
      })
    });
    
    const paymentResult = JSON.parse(paymentResponse.body);
    
    if (paymentResponse.status === 200 && paymentResult.success) {
      // Payment successful - update workflow
      workflowState.steps.payment.status = 'completed';
      workflowState.steps.payment.transactionId = paymentResult.transactionId;
      workflowState.steps.payment.completedAt = Date.now();
      workflowState.updatedAt = Date.now();
      
      await db.set(`workflow:${workflowId}`, workflowState, 2880);
      
      // Trigger next step: inventory check
      await pubnub.fire({
        channel: 'workflow.inventory',
        message: {
          type: 'check_inventory',
          orderId: orderId,
          workflowId: workflowId,
          order: order,
          paymentId: paymentResult.transactionId,
          timestamp: Date.now()
        }
      });
      
      console.log(`Payment completed for order ${orderId}`);
      
    } else {
      // Payment failed
      workflowState.steps.payment.status = 'failed';
      workflowState.steps.payment.error = paymentResult.error;
      workflowState.steps.payment.failedAt = Date.now();
      workflowState.retryCount += 1;
      
      if (workflowState.retryCount <= workflowState.maxRetries) {
        // Schedule retry
        workflowState.steps.payment.status = 'retry_scheduled';
        workflowState.steps.payment.retryAt = Date.now() + (60000 * Math.pow(2, workflowState.retryCount)); // Exponential backoff
        
        await db.set(`workflow:${workflowId}`, workflowState, 2880);
        
        // Schedule retry (this would be handled by an interval function)
        await pubnub.fire({
          channel: 'workflow.retry',
          message: {
            type: 'schedule_retry',
            workflowId: workflowId,
            step: 'payment',
            retryAt: workflowState.steps.payment.retryAt,
            timestamp: Date.now()
          }
        });
        
      } else {
        // Max retries exceeded - fail workflow
        workflowState.status = 'failed';
        workflowState.failureReason = 'payment_failed_max_retries';
        
        await db.set(`workflow:${workflowId}`, workflowState, 2880);
        
        // Trigger failure notification
        await pubnub.publish({
          channel: `order_status.${orderId}`,
          message: {
            orderId: orderId,
            status: 'failed',
            reason: 'payment_processing_failed',
            timestamp: Date.now()
          }
        });
      }
    }
    
    return request.ok();
    
  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Update workflow with error
    try {
      const workflowState = await db.get(`workflow:${request.message.workflowId}`);
      if (workflowState) {
        workflowState.steps.payment.status = 'error';
        workflowState.steps.payment.error = error.message;
        workflowState.updatedAt = Date.now();
        await db.set(`workflow:${request.message.workflowId}`, workflowState, 2880);
      }
    } catch (updateError) {
      console.error('Failed to update workflow with error:', updateError);
    }
    
    return request.abort();
  }
};
```

## Pattern 5: Real-time Analytics and Monitoring

Collect and process real-time analytics data for dashboards and alerts.

### Use Case: Application Performance Monitoring

```javascript
// Function Type: Before Publish (triggered on "metrics.*")
export default async (request) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    const metric = request.message;
    const metricType = metric.type;
    const timestamp = Date.now();
    const timeWindow = Math.floor(timestamp / (60 * 1000)); // 1-minute windows
    
    // Store raw metric
    const metricId = `${metricType}:${timestamp}:${Math.random().toString(36).substr(2, 9)}`;
    await db.set(`raw_metric:${metricId}`, {
      ...metric,
      receivedAt: timestamp
    }, 60); // 1 hour TTL for raw metrics
    
    // Update aggregated metrics
    const aggregationPromises = [];
    
    // 1. Count metrics by type
    aggregationPromises.push(
      db.incrCounter(`metric_count:${metricType}:${timeWindow}`)
    );
    
    // 2. Application-specific aggregations
    switch (metricType) {
      case 'page_view':
        aggregationPromises.push(
          db.incrCounter(`page_views:${metric.page}:${timeWindow}`),
          db.incrCounter(`user_page_views:${metric.userId}:${timeWindow}`)
        );
        break;
        
      case 'error':
        aggregationPromises.push(
          db.incrCounter(`errors:${metric.errorType}:${timeWindow}`),
          db.incrCounter(`errors_total:${timeWindow}`)
        );
        
        // Store error details for debugging
        await db.set(`error_detail:${metricId}`, {
          errorType: metric.errorType,
          message: metric.message,
          stackTrace: metric.stackTrace,
          userId: metric.userId,
          timestamp: timestamp
        }, 1440); // 24 hour TTL
        break;
        
      case 'performance':
        // Store performance metrics for trending
        const perfKey = `performance:${metric.operation}:${timeWindow}`;
        const currentPerf = await db.get(perfKey) || { count: 0, totalTime: 0, maxTime: 0 };
        
        currentPerf.count += 1;
        currentPerf.totalTime += metric.duration;
        currentPerf.maxTime = Math.max(currentPerf.maxTime, metric.duration);
        currentPerf.avgTime = currentPerf.totalTime / currentPerf.count;
        
        aggregationPromises.push(
          db.set(perfKey, currentPerf, 60)
        );
        break;
    }
    
    // Execute aggregations
    await Promise.all(aggregationPromises);
    
    // Real-time alerting
    await checkAndTriggerAlerts(metricType, metric, timeWindow, db, pubnub);
    
    // Add processing metadata
    request.message.processed = true;
    request.message.processedAt = timestamp;
    request.message.timeWindow = timeWindow;
    
    return request.ok();
    
  } catch (error) {
    console.error('Metrics processing error:', error);
    return request.ok(); // Don't block metrics flow
  }
};

async function checkAndTriggerAlerts(metricType, metric, timeWindow, db, pubnub) {
  try {
    switch (metricType) {
      case 'error':
        // Check error rate
        const errorCount = await db.getCounter(`errors_total:${timeWindow}`);
        const totalRequests = await db.getCounter(`requests_total:${timeWindow}`);
        
        if (totalRequests > 100 && (errorCount / totalRequests) > 0.05) { // 5% error rate
          await pubnub.publish({
            channel: 'alerts.high_priority',
            message: {
              type: 'high_error_rate',
              errorRate: (errorCount / totalRequests * 100).toFixed(2),
              errorCount: errorCount,
              totalRequests: totalRequests,
              timeWindow: timeWindow,
              timestamp: Date.now()
            }
          });
        }
        break;
        
      case 'performance':
        // Check performance degradation
        const currentWindow = await db.get(`performance:${metric.operation}:${timeWindow}`);
        const previousWindow = await db.get(`performance:${metric.operation}:${timeWindow - 1}`);
        
        if (currentWindow && previousWindow && 
            currentWindow.avgTime > previousWindow.avgTime * 2) { // 100% increase
          await pubnub.publish({
            channel: 'alerts.medium_priority',
            message: {
              type: 'performance_degradation',
              operation: metric.operation,
              currentAvg: currentWindow.avgTime,
              previousAvg: previousWindow.avgTime,
              degradation: ((currentWindow.avgTime / previousWindow.avgTime - 1) * 100).toFixed(2),
              timestamp: Date.now()
            }
          });
        }
        break;
    }
  } catch (alertError) {
    console.error('Alert processing error:', alertError);
  }
}
```

### Companion: Metrics Dashboard Aggregator (On Interval)

```javascript
// Function Type: On Interval (runs every 5 minutes)
export default async (event) => {
  const db = require('kvstore');
  const pubnub = require('pubnub');
  
  try {
    const now = Date.now();
    const currentWindow = Math.floor(now / (60 * 1000)); // Current minute
    const last10Windows = Array.from({length: 10}, (_, i) => currentWindow - i);
    
    const dashboardData = {
      timestamp: now,
      timeRange: '10_minutes',
      metrics: {}
    };
    
    // Aggregate data for last 10 minutes
    for (const window of last10Windows) {
      // Page views
      const pageViews = await db.getCounter(`metric_count:page_view:${window}`) || 0;
      dashboardData.metrics.pageViews = (dashboardData.metrics.pageViews || 0) + pageViews;
      
      // Errors
      const errors = await db.getCounter(`errors_total:${window}`) || 0;
      dashboardData.metrics.errors = (dashboardData.metrics.errors || 0) + errors;
      
      // Total requests
      const requests = await db.getCounter(`requests_total:${window}`) || 0;
      dashboardData.metrics.requests = (dashboardData.metrics.requests || 0) + requests;
    }
    
    // Calculate derived metrics
    dashboardData.metrics.errorRate = dashboardData.metrics.requests > 0 
      ? (dashboardData.metrics.errors / dashboardData.metrics.requests * 100).toFixed(2)
      : 0;
    
    // Get performance data for key operations
    const keyOperations = ['api_call', 'database_query', 'external_service'];
    dashboardData.performance = {};
    
    for (const operation of keyOperations) {
      const perfData = await db.get(`performance:${operation}:${currentWindow - 1}`); // Previous minute
      if (perfData) {
        dashboardData.performance[operation] = {
          avgTime: perfData.avgTime,
          maxTime: perfData.maxTime,
          count: perfData.count
        };
      }
    }
    
    // Publish to dashboard
    await pubnub.publish({
      channel: 'dashboard.metrics',
      message: dashboardData
    });
    
    // Store dashboard snapshot
    await db.set(`dashboard_snapshot:${currentWindow}`, dashboardData, 1440); // 24 hour TTL
    
    console.log('Dashboard metrics published:', dashboardData.metrics);
    return event.ok();
    
  } catch (error) {
    console.error('Dashboard aggregation error:', error);
    return event.abort();
  }
};
```

## Pattern Summary

These patterns demonstrate:

1. **Atomic Operations**: Use KV Store counters for thread-safe increments
2. **Parallel Processing**: Execute multiple async operations concurrently
3. **Error Handling**: Graceful degradation and retry mechanisms
4. **State Management**: Persistent workflow state across function executions
5. **Real-time Analytics**: Efficient metric aggregation and alerting
6. **Security**: Proper secret management and input validation

Each pattern can be adapted and combined to build sophisticated real-time applications with PubNub Functions 2.0.