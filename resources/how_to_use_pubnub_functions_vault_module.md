# How to Use the Vault Module in PubNub Functions 2.0

The `vault` module in PubNub Functions provides a secure way to store and access sensitive information such as API keys, database credentials, authentication tokens, or other secrets that your Functions need to operate. Using the Vault is much more secure than hardcoding sensitive values directly into your Function's source code.

## Requiring the Vault Module

To use the `vault` module, you first need to require it in your Function:

```javascript
const vault = require('vault');
```

## Core Method: `vault.get()`

The primary method for retrieving a secret from the Vault is `get()`.

*   **Signature:** `vault.get(secretName)`
    *   `secretName` (String): The name of the secret you want to retrieve, as configured in the PubNub Admin Portal.
*   **Returns:** A Promise that resolves to the value of the secret (as a string). If the secret is not found, it resolves to `null` or `undefined`.

## Using `async/await`

All `vault.get()` calls return a Promise, so you should always use `async/await` with `try/catch` for error handling.

```javascript
export default async (request) => {
  const vault = require('vault');
  
  try {
    const apiKey = await vault.get("my_api_key");
    if (!apiKey) {
      console.error("API key not found in vault");
      return request.abort();
    }
    
    // Use the API key...
    console.log("Successfully retrieved API key");
    return request.ok();
  } catch (error) {
    console.error("Error accessing vault:", error);
    return request.abort();
  }
};
```

## Managing Secrets in the Vault

Before you can retrieve a secret in your Function, you must first store it in the Vault through the PubNub Admin Portal:

### Adding Secrets via PubNub Portal

1.  Navigate to the PubNub Admin Portal
2.  Go to your Application → Keyset → Functions
3.  Select your Function or create a new one
4.  In the Function editor, look for the "My Secrets" or "Vault" section
5.  Click "Create Secret" and provide:
    *   **Secret Name:** The identifier you'll use in `vault.get("secretName")`
    *   **Secret Value:** The actual sensitive data (API key, password, etc.)
6.  Save the secret

### Secret Naming Best Practices

Use descriptive, consistent naming conventions for your secrets:

```javascript
// Good examples
await vault.get("openai_api_key");
await vault.get("database_password");
await vault.get("slack_webhook_url");
await vault.get("jwt_signing_secret");
await vault.get("stripe_secret_key");

// Avoid generic names
await vault.get("key1");
await vault.get("secret");
await vault.get("password");
```

## Practical Examples

### Example 1: External API Integration with Authentication

This is the most common use case: fetching an API key from the Vault to authenticate external HTTP requests.

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const pubnub = require('pubnub');

  try {
    // Retrieve API key securely from Vault
    const weatherApiKey = await vault.get("openweather_api_key");
    
    if (!weatherApiKey) {
      console.error("Weather API key not found in Vault");
      await pubnub.publish({
        channel: 'function_errors',
        message: { 
          error: "Configuration error: Weather API key missing",
          function: "weather_lookup",
          timestamp: Date.now()
        }
      });
      return request.abort();
    }

    const city = request.message?.city || 'New York';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    console.log(`Fetching weather data for ${city}`);
    
    const weatherResponse = await xhr.fetch(weatherApiUrl);
    
    if (weatherResponse.status === 200) {
      const weatherData = JSON.parse(weatherResponse.body);
      
      // Enrich the original message with weather data
      request.message.weather = {
        city: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
        retrievedAt: new Date().toISOString()
      };
      
      console.log(`Weather in ${city}: ${weatherData.weather[0].description}, ${weatherData.main.temp}°C`);
      return request.ok();
    } else {
      console.error('Weather API request failed:', weatherResponse.status, weatherResponse.body);
      return request.abort();
    }

  } catch (error) {
    console.error('Error in weather lookup function:', error);
    return request.abort();
  }
};
```

### Example 2: Database Connection with Credentials

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const crypto = require('crypto');

  try {
    // Get database credentials from vault
    const [dbUrl, dbUser, dbPassword] = await Promise.all([
      vault.get("database_url"),
      vault.get("database_username"), 
      vault.get("database_password")
    ]);

    // Validate all credentials are available
    if (!dbUrl || !dbUser || !dbPassword) {
      console.error("Database credentials incomplete in vault");
      return request.abort();
    }

    // Create authentication header
    const authString = `${dbUser}:${dbPassword}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    // Prepare database query
    const query = {
      sql: "SELECT * FROM users WHERE user_id = ?",
      params: [request.message.userId]
    };

    const dbResponse = await xhr.fetch(dbUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });

    if (dbResponse.status === 200) {
      const userData = JSON.parse(dbResponse.body);
      request.message.userProfile = userData.rows[0];
      console.log(`Retrieved user profile for: ${request.message.userId}`);
      return request.ok();
    } else {
      console.error('Database query failed:', dbResponse.status);
      return request.abort();
    }

  } catch (error) {
    console.error('Database integration error:', error);
    return request.abort();
  }
};
```

### Example 3: Webhook Integration with Secret Validation

```javascript
export default async (request, response) => {
  const vault = require('vault');
  const crypto = require('crypto');

  try {
    // Retrieve webhook secret for signature validation
    const webhookSecret = await vault.get("github_webhook_secret");
    
    if (!webhookSecret) {
      console.error("Webhook secret not configured");
      return response.send({ error: "Server configuration error" }, 500);
    }

    // Validate GitHub webhook signature
    const signature = request.headers['x-hub-signature-256'];
    const payload = request.body;
    
    if (!signature) {
      return response.send({ error: "Missing signature" }, 401);
    }

    // Create expected signature
    const expectedSignature = await crypto.hmac(webhookSecret, payload, crypto.ALGORITHM.HMAC_SHA256);
    const expectedSigHeader = `sha256=${expectedSignature}`;

    // Compare signatures securely
    if (signature !== expectedSigHeader) {
      console.error("Webhook signature validation failed");
      return response.send({ error: "Invalid signature" }, 401);
    }

    // Process validated webhook
    const webhookData = JSON.parse(payload);
    console.log("Webhook validated:", webhookData.action);

    // Process the webhook data...
    if (webhookData.action === 'opened' && webhookData.pull_request) {
      // Handle pull request opened
      console.log(`New PR: ${webhookData.pull_request.title}`);
    }

    return response.send({ message: "Webhook processed successfully" }, 200);

  } catch (error) {
    console.error('Webhook processing error:', error);
    return response.send({ error: "Internal server error" }, 500);
  }
};
```

### Example 4: Multi-Service Integration

```javascript
export default async (request) => {
  const xhr = require('xhr');
  const vault = require('vault');
  const pubnub = require('pubnub');

  try {
    // Retrieve multiple service credentials in parallel
    const [
      slackWebhookUrl,
      discordWebhookUrl,
      emailApiKey,
      smsApiKey
    ] = await Promise.all([
      vault.get("slack_webhook_url"),
      vault.get("discord_webhook_url"),
      vault.get("sendgrid_api_key"),
      vault.get("twilio_api_key")
    ]);

    const alert = request.message;
    const notificationMessage = {
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      timestamp: new Date().toISOString()
    };

    // Send notifications based on severity and available services
    const notifications = [];

    // Always send to Slack if available
    if (slackWebhookUrl) {
      notifications.push(
        xhr.fetch(slackWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 ${alert.title}`,
            attachments: [{
              color: alert.severity === 'high' ? 'danger' : 'warning',
              fields: [{
                title: "Description",
                value: alert.description,
                short: false
              }]
            }]
          })
        })
      );
    }

    // Send to Discord for high severity
    if (discordWebhookUrl && alert.severity === 'high') {
      notifications.push(
        xhr.fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 **HIGH SEVERITY ALERT**`,
            embeds: [{
              title: alert.title,
              description: alert.description,
              color: 0xff0000,
              timestamp: new Date().toISOString()
            }]
          })
        })
      );
    }

    // Send email for critical alerts
    if (emailApiKey && alert.severity === 'critical') {
      notifications.push(
        xhr.fetch('https://api.sendgrid.v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${emailApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: 'admin@company.com' }],
              subject: `CRITICAL ALERT: ${alert.title}`
            }],
            from: { email: 'alerts@company.com' },
            content: [{
              type: 'text/html',
              value: `<h2>Critical Alert</h2><p><strong>${alert.title}</strong></p><p>${alert.description}</p>`
            }]
          })
        })
      );
    }

    // Execute all notifications in parallel
    if (notifications.length > 0) {
      const results = await Promise.allSettled(notifications);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`Notifications sent: ${successful} successful, ${failed} failed`);

      // Log results to analytics
      await pubnub.fire({
        channel: 'notification_analytics',
        message: {
          alertId: alert.id,
          severity: alert.severity,
          notificationsSent: successful,
          notificationsFailed: failed,
          timestamp: Date.now()
        }
      });
    }

    return request.ok();

  } catch (error) {
    console.error('Multi-service notification error:', error);
    return request.ok(); // Don't block the original alert
  }
};
```

### Example 5: JWT Token Management

```javascript
export default async (request, response) => {
  const vault = require('vault');
  const jwt = require('jwt');

  try {
    // Get JWT signing secret from vault
    const jwtSecret = await vault.get("jwt_signing_secret");
    
    if (!jwtSecret) {
      console.error("JWT secret not configured");
      return response.send({ error: "Server configuration error" }, 500);
    }

    const action = request.query.action;

    switch (action) {
      case 'generate':
        // Generate new JWT token
        const payload = {
          userId: request.body.userId,
          email: request.body.email,
          role: request.body.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
        };

        const token = jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
        
        return response.send({ 
          token: token,
          expiresIn: '24h'
        }, 200);

      case 'verify':
        // Verify existing JWT token
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return response.send({ error: 'Missing or invalid authorization header' }, 401);
        }

        const token = authHeader.substring(7);
        
        try {
          const decoded = jwt.verify(token, jwtSecret);
          return response.send({ 
            valid: true,
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
          }, 200);
        } catch (jwtError) {
          return response.send({ 
            valid: false,
            error: 'Invalid or expired token'
          }, 401);
        }

      default:
        return response.send({ error: 'Invalid action' }, 400);
    }

  } catch (error) {
    console.error('JWT processing error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

## Security Benefits and Best Practices

### Security Benefits of Using Vault

*   **No Hardcoded Secrets:** Sensitive data is not exposed in your Function's source code
*   **Centralized Management:** Secrets are managed through the secure PubNub Admin Portal
*   **Access Control:** Only authorized Functions can access specific secrets
*   **Rotation Support:** Secrets can be updated without changing Function code
*   **Audit Trail:** Secret access and changes can be monitored

### Best Practices

#### 1. **Always Check for Null Values**
```javascript
const apiKey = await vault.get("api_key");
if (!apiKey) {
  console.error("API key not found in vault");
  return request.abort();
}
```

#### 2. **Use Descriptive Secret Names**
```javascript
// Good
await vault.get("stripe_secret_key");
await vault.get("openai_api_key");
await vault.get("database_connection_string");

// Bad
await vault.get("key1");
await vault.get("secret");
```

#### 3. **Handle Vault Errors Gracefully**
```javascript
try {
  const secret = await vault.get("my_secret");
  if (!secret) {
    // Handle missing secret
    return request.abort();
  }
  // Use secret...
} catch (error) {
  console.error("Vault access error:", error);
  return request.abort();
}
```

#### 4. **Never Log Secret Values**
```javascript
const apiKey = await vault.get("api_key");
console.log("API key retrieved"); // ✅ Good
console.log("API key:", apiKey);   // ❌ Never do this!
```

#### 5. **Use Parallel Retrieval for Multiple Secrets**
```javascript
// Efficient - retrieve in parallel
const [secret1, secret2, secret3] = await Promise.all([
  vault.get("secret1"),
  vault.get("secret2"),
  vault.get("secret3")
]);

// Less efficient - sequential retrieval
const secret1 = await vault.get("secret1");
const secret2 = await vault.get("secret2");
const secret3 = await vault.get("secret3");
```

#### 6. **Validate All Required Secrets**
```javascript
const requiredSecrets = await Promise.all([
  vault.get("api_key"),
  vault.get("webhook_secret"),
  vault.get("database_url")
]);

if (requiredSecrets.some(secret => !secret)) {
  console.error("One or more required secrets are missing");
  return request.abort();
}

const [apiKey, webhookSecret, databaseUrl] = requiredSecrets;
```

## Error Handling and Debugging

### Common Issues and Solutions

#### 1. **Secret Not Found**
```javascript
const secret = await vault.get("nonexistent_secret");
if (!secret) {
  console.error("Secret 'nonexistent_secret' not found in vault");
  // Check secret name spelling and vault configuration
}
```

#### 2. **Case Sensitivity**
```javascript
// Secret names are case-sensitive
await vault.get("API_KEY");     // Different from
await vault.get("api_key");     // this one
```

#### 3. **Network/Access Errors**
```javascript
try {
  const secret = await vault.get("my_secret");
} catch (error) {
  console.error("Vault access failed:", error.message);
  // Could be network issues, permissions, or vault service problems
}
```

### Debugging Tips

*   **Verify secret exists:** Check the PubNub Admin Portal to ensure the secret is properly configured
*   **Check spelling:** Secret names are case-sensitive and must match exactly
*   **Test connectivity:** Ensure your Function has proper network access
*   **Monitor logs:** Use `console.log()` to track vault access attempts (but never log the actual secret values)

## Limitations and Considerations

*   **Read-Only:** Functions can only retrieve secrets, not create or modify them
*   **String Values:** All secrets are returned as strings
*   **Network Dependency:** Vault access requires network connectivity
*   **Operation Limits:** Vault operations may count toward function execution limits
*   **Scope:** Secrets are scoped to your keyset and specific function configurations

Always use the Vault module for any sensitive data your PubNub Functions require. It's a secure, manageable way to handle credentials and other secrets in your serverless functions.