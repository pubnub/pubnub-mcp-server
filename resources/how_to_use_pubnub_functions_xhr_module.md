# How to Use the XHR Module in PubNub Functions 2.0

The `xhr` (XMLHttpRequest) module in PubNub Functions allows your serverless code to make outbound HTTP/S requests to external APIs, webhooks, databases, or your own backend services. This is essential for integrating with third-party services and building comprehensive real-time applications.

## Requiring the XHR Module

To use the `xhr` module, you first need to require it in your Function:

```javascript
const xhr = require("xhr");
```

## Core Method: `xhr.fetch()`

The primary method provided by the `xhr` module is `fetch()`. It behaves similarly to the standard Fetch API but is optimized for the PubNub Functions environment.

*   **Signature:** `xhr.fetch(url, http_options?)`
    *   `url` (String): The URL of the external resource to request.
    *   `http_options` (Object, optional): Configuration object for the request.
*   **Returns:** A Promise that resolves to a response object from the external server.

### Response Object Properties

The response object contains:
*   `status` (Number): HTTP status code (e.g., 200, 404, 500)
*   `body` (String): Response body as a string
*   `headers` (Object): Response headers as key-value pairs

### HTTP Options Object

The `http_options` parameter can include:
*   `method` (String): HTTP method (`"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, etc.) - defaults to `"GET"`
*   `headers` (Object): Request headers as key-value pairs
*   `body` (String): Request body (for POST/PUT requests)
*   `timeout` (Number): Request timeout in milliseconds (if supported)

## Using `async/await`

All `xhr.fetch()` calls return a Promise, so you should always use `async/await` with `try/catch` for error handling.

## Basic Examples

### Example 1: Simple GET Request

```javascript
export default async (request) => {
  const xhr = require('xhr');
  
  try {
    const apiUrl = 'https://api.quotable.io/random';
    console.log(`Fetching data from: ${apiUrl}`);

    const serverResponse = await xhr.fetch(apiUrl);

    console.log('Status:', serverResponse.status);
    
    if (serverResponse.status === 200) {
      const quoteData = JSON.parse(serverResponse.body);
      console.log('Quote:', quoteData.content);
      console.log('Author:', quoteData.author);
      
      // Add quote to the original message
      request.message.dailyQuote = {
        text: quoteData.content,
        author: quoteData.author,
        retrievedAt: new Date().toISOString()
      };
    } else {
      console.error('API request failed with status:', serverResponse.status);
      console.error('Response body:', serverResponse.body);
    }

    return request.ok();
  } catch (error) {
    console.error('XHR request failed:', error);
    return request.abort();
  }
};
```

### Example 2: POST Request with JSON Body

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    // Get webhook URL from vault for security
    const webhookUrl = await vault.get("slack_webhook_url");
    if (!webhookUrl) {
      console.error("Slack webhook URL not configured");
      return request.abort();
    }

    const messageData = {
      text: `Alert: ${request.message.alert}`,
      channel: '#alerts',
      username: 'PubNub Bot',
      attachments: [{
        color: request.message.severity === 'high' ? 'danger' : 'warning',
        fields: [{
          title: 'Details',
          value: request.message.details,
          short: false
        }, {
          title: 'Timestamp',
          value: new Date().toISOString(),
          short: true
        }]
      }]
    };

    const http_options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PubNub-Function/2.0'
      },
      body: JSON.stringify(messageData)
    };

    const response = await xhr.fetch(webhookUrl, http_options);
    
    if (response.status === 200) {
      console.log('Slack notification sent successfully');
    } else {
      console.error('Slack notification failed:', response.status, response.body);
    }

    return request.ok();
  } catch (error) {
    console.error('Slack integration error:', error);
    return request.ok(); // Don't block the original message
  }
};
```

### Example 3: API Authentication with Headers

```javascript
export default async (request, response) => {
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    // Retrieve API key securely from vault
    const apiKey = await vault.get("github_api_token");
    if (!apiKey) {
      return response.send({ error: "API key not configured" }, 500);
    }

    const username = request.query.username;
    if (!username) {
      return response.send({ error: "Username required" }, 400);
    }

    const http_options = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "PubNub-Function"
      }
    };

    const githubUrl = `https://api.github.com/users/${username}`;
    const githubResponse = await xhr.fetch(githubUrl, http_options);

    if (githubResponse.status === 200) {
      const userData = JSON.parse(githubResponse.body);
      
      const userInfo = {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        avatarUrl: userData.avatar_url
      };
      
      return response.send(userInfo, 200);
    } else if (githubResponse.status === 404) {
      return response.send({ error: "User not found" }, 404);
    } else {
      console.error('GitHub API error:', githubResponse.status, githubResponse.body);
      return response.send({ error: "Failed to fetch user data" }, 502);
    }

  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return response.send({ error: "Internal server error" }, 500);
  }
};
```

## Advanced Integration Examples

### Example 4: Database Integration with Error Handling

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const crypto = require('crypto');
  
  try {
    // Get database credentials from vault
    const [dbUrl, dbApiKey] = await Promise.all([
      vault.get("database_api_url"),
      vault.get("database_api_key")
    ]);

    if (!dbUrl || !dbApiKey) {
      console.error("Database configuration missing");
      return request.abort();
    }

    const userId = request.message.userId;
    const userData = request.message.userData;

    // Prepare database update
    const dbPayload = {
      query: "UPDATE users SET last_login = NOW(), profile_data = ? WHERE user_id = ?",
      params: [JSON.stringify(userData), userId]
    };

    const http_options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dbApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dbPayload)
    };

    const dbResponse = await xhr.fetch(dbUrl, http_options);

    if (dbResponse.status === 200) {
      const result = JSON.parse(dbResponse.body);
      if (result.success) {
        console.log(`User ${userId} profile updated successfully`);
        request.message.dbUpdateSuccess = true;
      } else {
        console.error('Database update failed:', result.error);
        request.message.dbUpdateSuccess = false;
      }
    } else {
      console.error('Database API error:', dbResponse.status, dbResponse.body);
      request.message.dbUpdateSuccess = false;
    }

    return request.ok();
  } catch (error) {
    console.error('Database integration error:', error);
    request.message.dbUpdateSuccess = false;
    return request.ok(); // Continue processing even if DB update fails
  }
};
```

### Example 5: Multi-Service Integration with Parallel Requests

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    // Get API keys for multiple services
    const [weatherApiKey, newsApiKey, stockApiKey] = await Promise.all([
      vault.get("openweather_api_key"),
      vault.get("news_api_key"),
      vault.get("stock_api_key")
    ]);

    const city = request.message.city || 'New York';
    const symbol = request.message.stockSymbol || 'AAPL';

    // Prepare multiple API requests
    const requests = [];
    
    // Weather API request
    if (weatherApiKey) {
      requests.push({
        name: 'weather',
        promise: xhr.fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`)
      });
    }

    // News API request
    if (newsApiKey) {
      requests.push({
        name: 'news',
        promise: xhr.fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${newsApiKey}`)
      });
    }

    // Stock API request
    if (stockApiKey) {
      requests.push({
        name: 'stock',
        promise: xhr.fetch(`https://api.example.com/stock/${symbol}?apikey=${stockApiKey}`)
      });
    }

    // Execute all requests in parallel
    const results = await Promise.allSettled(requests.map(req => req.promise));
    
    // Process results
    const enrichmentData = {};
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const requestName = requests[i].name;
      
      if (result.status === 'fulfilled' && result.value.status === 200) {
        const data = JSON.parse(result.value.body);
        
        switch (requestName) {
          case 'weather':
            enrichmentData.weather = {
              city: data.name,
              temperature: data.main.temp,
              description: data.weather[0].description,
              humidity: data.main.humidity
            };
            break;
            
          case 'news':
            enrichmentData.news = data.articles.slice(0, 3).map(article => ({
              title: article.title,
              description: article.description,
              url: article.url
            }));
            break;
            
          case 'stock':
            enrichmentData.stock = {
              symbol: data.symbol,
              price: data.price,
              change: data.change,
              changePercent: data.changePercent
            };
            break;
        }
        
        console.log(`Successfully enriched with ${requestName} data`);
      } else {
        console.error(`Failed to get ${requestName} data:`, result.reason || result.value?.status);
      }
    }

    // Add enrichment data to the message
    request.message.enrichment = {
      ...enrichmentData,
      retrievedAt: new Date().toISOString(),
      servicesQueried: requests.length
    };

    return request.ok();
  } catch (error) {
    console.error('Multi-service enrichment error:', error);
    return request.ok(); // Continue processing even if enrichment fails
  }
};
```

### Example 6: Webhook Verification and Response

```javascript
export default async (request, response) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const crypto = require('crypto');
  
  try {
    // Verify webhook signature (GitHub example)
    const webhookSecret = await vault.get("github_webhook_secret");
    if (!webhookSecret) {
      return response.send({ error: "Webhook secret not configured" }, 500);
    }

    const signature = request.headers['x-hub-signature-256'];
    const payload = request.body;
    
    if (signature) {
      const expectedSignature = await crypto.hmac(webhookSecret, payload, crypto.ALGORITHM.HMAC_SHA256);
      const expectedHeader = `sha256=${expectedSignature}`;
      
      if (signature !== expectedHeader) {
        console.error("Webhook signature validation failed");
        return response.send({ error: "Invalid signature" }, 401);
      }
    }

    const webhookData = JSON.parse(payload);
    console.log("Processing webhook:", webhookData.action);

    // Process different webhook events
    if (webhookData.action === 'opened' && webhookData.pull_request) {
      // New pull request opened - notify team
      const slackWebhookUrl = await vault.get("slack_webhook_url");
      
      if (slackWebhookUrl) {
        const slackMessage = {
          text: `🔄 New Pull Request`,
          attachments: [{
            color: 'good',
            title: webhookData.pull_request.title,
            title_link: webhookData.pull_request.html_url,
            fields: [{
              title: 'Author',
              value: webhookData.pull_request.user.login,
              short: true
            }, {
              title: 'Repository',
              value: webhookData.repository.name,
              short: true
            }]
          }]
        };

        const notificationResponse = await xhr.fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMessage)
        });

        if (notificationResponse.status === 200) {
          console.log("Team notified via Slack");
        }
      }
    }

    return response.send({ message: "Webhook processed successfully" }, 200);

  } catch (error) {
    console.error('Webhook processing error:', error);
    return response.send({ error: "Internal server error" }, 500);
  }
};
```

### Example 7: Rate-Limited API Integration

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const db = require('kvstore');
  
  try {
    const apiKey = await vault.get("rate_limited_api_key");
    if (!apiKey) {
      console.error("API key not configured");
      return request.abort();
    }

    // Check rate limit (example: 100 requests per hour)
    const rateLimitKey = "api_rate_limit_counter";
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    const hourlyKey = `${rateLimitKey}:${currentHour}`;
    
    const currentCount = await db.getCounter(hourlyKey);
    
    if (currentCount >= 100) {
      console.log("API rate limit exceeded, skipping request");
      request.message.apiSkipped = true;
      request.message.rateLimitExceeded = true;
      return request.ok();
    }

    // Make API request
    const apiUrl = `https://api.example.com/data/${request.message.dataId}`;
    const http_options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    };

    const apiResponse = await xhr.fetch(apiUrl, http_options);
    
    if (apiResponse.status === 200) {
      // Increment rate limit counter with 2-hour TTL
      await db.incrCounter(hourlyKey);
      await db.set(`${hourlyKey}_ttl`, Date.now(), 120); // 2 hour TTL for cleanup
      
      const apiData = JSON.parse(apiResponse.body);
      request.message.apiData = apiData;
      request.message.apiSkipped = false;
      
      console.log("API data retrieved successfully");
    } else if (apiResponse.status === 429) {
      // API returned rate limit error
      console.log("API rate limit hit, will retry later");
      request.message.apiSkipped = true;
      request.message.rateLimitHit = true;
    } else {
      console.error("API request failed:", apiResponse.status, apiResponse.body);
      request.message.apiSkipped = true;
      request.message.apiError = true;
    }

    return request.ok();
  } catch (error) {
    console.error('Rate-limited API integration error:', error);
    request.message.apiSkipped = true;
    request.message.apiError = true;
    return request.ok();
  }
};
```

## Error Handling and Best Practices

### Common HTTP Status Codes and Handling

```javascript
export default async (request) => {
  const xhr = require('xhr');
  
  try {
    const response = await xhr.fetch('https://api.example.com/data');
    
    switch (response.status) {
      case 200:
        // Success
        const data = JSON.parse(response.body);
        console.log('Request successful');
        break;
        
      case 400:
        // Bad Request
        console.error('Bad request - check your parameters');
        break;
        
      case 401:
        // Unauthorized
        console.error('API authentication failed');
        break;
        
      case 403:
        // Forbidden
        console.error('API access forbidden');
        break;
        
      case 404:
        // Not Found
        console.error('API endpoint or resource not found');
        break;
        
      case 429:
        // Too Many Requests
        console.error('API rate limit exceeded');
        break;
        
      case 500:
        // Internal Server Error
        console.error('API server error');
        break;
        
      default:
        console.error('Unexpected status code:', response.status);
    }
    
    return request.ok();
  } catch (error) {
    console.error('Network or parsing error:', error);
    return request.abort();
  }
};
```

### Best Practices

#### 1. **Always Use HTTPS**
```javascript
// Good
const apiUrl = 'https://api.example.com/data';

// Avoid HTTP for sensitive data
const apiUrl = 'http://api.example.com/data'; // ❌
```

#### 2. **Handle Timeouts and Network Errors**
```javascript
try {
  const response = await xhr.fetch(apiUrl, { 
    timeout: 10000 // 10 seconds
  });
} catch (error) {
  if (error.code === 'TIMEOUT') {
    console.error('Request timed out');
  } else {
    console.error('Network error:', error);
  }
}
```

#### 3. **Set Appropriate Headers**
```javascript
const http_options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'PubNub-Function/2.0',
    'Accept': 'application/json'
  },
  body: JSON.stringify(data)
};
```

#### 4. **Validate Response Data**
```javascript
if (response.status === 200) {
  try {
    const data = JSON.parse(response.body);
    if (data && data.results) {
      // Process valid data
    } else {
      console.error('Invalid response format');
    }
  } catch (parseError) {
    console.error('JSON parsing failed:', parseError);
  }
}
```

#### 5. **Use Parallel Requests Efficiently**
```javascript
// Efficient - run in parallel
const [response1, response2] = await Promise.all([
  xhr.fetch(url1),
  xhr.fetch(url2)
]);

// Less efficient - sequential
const response1 = await xhr.fetch(url1);
const response2 = await xhr.fetch(url2);
```

## Important Considerations

*   **Operation Limits:** XHR operations count toward the 3-operation limit per function execution
*   **Timeout:** Requests have built-in timeouts (typically 5-10 seconds)
*   **No Redirects:** The XHR module does not automatically follow HTTP redirects
*   **Size Limits:** Response bodies may have size limitations
*   **CORS:** CORS restrictions don't apply to server-side requests from Functions
*   **Security:** Always use HTTPS for sensitive data and validate responses
*   **Rate Limiting:** Be mindful of external API rate limits and implement appropriate handling
*   **Error Handling:** Always wrap XHR calls in try/catch blocks and handle various HTTP status codes appropriately

The XHR module is a powerful tool for integrating PubNub Functions with external services, enabling you to build comprehensive real-time applications that can interact with any HTTP-based API or service.