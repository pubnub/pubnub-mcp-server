# How to Use the Codec Modules in PubNub Functions 2.0

The Codec modules in PubNub Functions provide encoding and decoding functionality for various data formats commonly used in web applications. These modules include authentication helpers, Base64 encoding/decoding, and URL query string parsing. They're essential for processing HTTP requests, handling authentication, and working with encoded data.

## Overview of Codec Modules

The Codec functionality is split into three sub-modules:
- **`codec/auth`**: HTTP Basic Authentication header generation
- **`codec/base64`**: Base64 encoding, decoding, and URL-safe encoding
- **`codec/query_string`**: URL query parameter parsing and generation

## Codec/Auth Module

### Requiring the Auth Module

```javascript
const basicAuth = require("codec/auth");
```

### `basicAuth.basic(username, password)`

Generates HTTP Basic Auth headers for authenticating with external APIs.

*   `username` (String): The username for authentication.
*   `password` (String): The password for authentication.
*   Returns a string formatted as `"Basic <base64(username:password)>"` ready for use in HTTP Authorization headers.

```javascript
// Generate Basic Auth header
const authHeader = basicAuth.basic('apiUser', 's3cr3tP@ssw0rd');
console.log(authHeader); // "Basic YXBpVXNlcjpzM2NyM3RQQHNzdzByZA=="

// Use with XHR requests
const xhr = require('xhr');
const headers = {
  'Authorization': basicAuth.basic('admin', 'password123'),
  'Content-Type': 'application/json'
};

const response = await xhr.fetch('https://api.example.com/data', {
  method: 'GET',
  headers: headers
});
```

## Codec/Base64 Module

### Requiring the Base64 Module

```javascript
const base64 = require("codec/base64");
```

### Core Methods

#### `base64.btoa(text)`

Encode a string to Base64 (binary to ASCII).

*   `text` (String): The string to encode.
*   Returns the Base64-encoded string.

```javascript
const encoded = base64.btoa('Hello PubNub!');
console.log(encoded); // "SGVsbG8gUHViTnViIQ=="

// Encode JSON data
const data = { message: 'secret', timestamp: Date.now() };
const encodedJson = base64.btoa(JSON.stringify(data));
console.log('Encoded JSON:', encodedJson);
```

#### `base64.atob(base64Str)`

Decode a Base64 string back to normal text (ASCII to binary).

*   `base64Str` (String): The Base64 string to decode.
*   Returns the decoded string.

```javascript
const decoded = base64.atob('SGVsbG8gUHViTnViIQ==');
console.log(decoded); // "Hello PubNub!"

// Decode JSON data
const encodedData = 'eyJtZXNzYWdlIjoic2VjcmV0In0=';
const decodedJson = JSON.parse(base64.atob(encodedData));
console.log('Decoded JSON:', decodedJson);
```

#### `base64.encodeString(input)`

Encode a string in a URL-safe way, replacing characters that might cause issues in URLs.

*   `input` (String): The string to make URL-safe.
*   Returns a URL-safe encoded string.

```javascript
const urlUnsafe = 'hello+world/test=value';
const urlSafe = base64.encodeString(urlUnsafe);
console.log('URL-safe:', urlSafe); // Characters like +, /, = are encoded

// Useful for creating safe filenames or URL parameters
const userId = 'user@domain.com';
const safeUserId = base64.encodeString(userId);
const filename = `profile_${safeUserId}.json`;
```

## Codec/Query_String Module

### Requiring the Query String Module

```javascript
const queryString = require("codec/query_string");
```

### Core Methods

#### `queryString.parse(queryStringText, defaults?)`

Parse a URL query string into a JavaScript object.

*   `queryStringText` (String): The query string to parse (without the leading `?`).
*   `defaults` (Object, optional): Default values for missing parameters.
*   Returns an object with the parsed parameters.

```javascript
// Parse a simple query string
const params = queryString.parse('page=2&limit=50&sort=date');
console.log(params); // { page: "2", limit: "50", sort: "date" }

// Parse with defaults
const paramsWithDefaults = queryString.parse('page=3', { limit: '10', sort: 'name' });
console.log(paramsWithDefaults); // { page: "3", limit: "10", sort: "name" }

// Parse complex query string
const complexParams = queryString.parse('user=john&active=true&tags=web,mobile&score=95.5');
console.log(complexParams); 
// { user: "john", active: "true", tags: "web,mobile", score: "95.5" }
```

#### `queryString.stringify(object)`

Convert a JavaScript object into a URL-encoded query string.

*   `object` (Object): The object to convert to a query string.
*   Returns a URL-encoded query string.

```javascript
// Create query string from object
const params = { page: 2, pageSize: 50, includeMetadata: true };
const queryStr = queryString.stringify(params);
console.log(queryStr); // "page=2&pageSize=50&includeMetadata=true"

// Build API request URL
const baseUrl = 'https://api.example.com/users';
const filters = { status: 'active', role: 'admin', limit: 100 };
const fullUrl = `${baseUrl}?${queryString.stringify(filters)}`;
console.log(fullUrl); // "https://api.example.com/users?status=active&role=admin&limit=100"
```

## Practical Examples

### Example 1: Secure API Integration with Authentication

```javascript
export default async (request, response) => {
  const xhr = require('xhr');
  const basicAuth = require('codec/auth');
  const base64 = require('codec/base64');
  const vault = require('vault');
  
  try {
    // Get API credentials from vault
    const apiUsername = await vault.get('API_USERNAME');
    const apiPassword = await vault.get('API_PASSWORD');
    
    // Create authentication header
    const authHeader = basicAuth.basic(apiUsername, apiPassword);
    
    // Prepare request data
    const requestData = {
      action: 'fetch_user_data',
      userId: request.query.userId,
      timestamp: Date.now()
    };
    
    // Encode sensitive data in request body
    const encodedData = base64.btoa(JSON.stringify(requestData));
    
    const apiResponse = await xhr.fetch('https://secure-api.example.com/users', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'X-Request-ID': request.query.requestId || 'unknown'
      },
      body: JSON.stringify({ data: encodedData })
    });
    
    if (apiResponse.status === 200) {
      const responseData = JSON.parse(apiResponse.body);
      
      // Decode response if it's encoded
      let userData;
      if (responseData.encoded) {
        userData = JSON.parse(base64.atob(responseData.data));
      } else {
        userData = responseData;
      }
      
      return response.send(userData, 200);
    } else {
      console.error('API request failed:', apiResponse.status, apiResponse.body);
      return response.send({ error: 'External API error' }, 502);
    }
  } catch (error) {
    console.error('Authentication/encoding error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 2: Dynamic URL Building and Parameter Handling

```javascript
export default async (request, response) => {
  const xhr = require('xhr');
  const queryString = require('codec/query_string');
  const utils = require('utils');
  
  try {
    // Parse incoming query parameters with defaults
    const params = queryString.parse(request.query, {
      page: '1',
      limit: '20',
      sort: 'created_at',
      order: 'desc'
    });
    
    // Validate numeric parameters
    if (!utils.isNumeric(params.page) || !utils.isNumeric(params.limit)) {
      return response.send({ error: 'Page and limit must be numeric' }, 400);
    }
    
    // Build external API query parameters
    const apiParams = {
      page: parseInt(params.page),
      per_page: parseInt(params.limit),
      sort_by: params.sort,
      order: params.order,
      include_metadata: true,
      api_version: '2.1'
    };
    
    // Add conditional parameters
    if (request.query.filter) {
      apiParams.filter = request.query.filter;
    }
    
    if (request.query.search) {
      apiParams.q = request.query.search;
    }
    
    // Build the complete API URL
    const baseUrl = 'https://data-api.example.com/records';
    const queryStr = queryString.stringify(apiParams);
    const fullUrl = `${baseUrl}?${queryStr}`;
    
    console.log('Fetching from:', fullUrl);
    
    const apiResponse = await xhr.fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PubNub-Functions/2.0'
      }
    });
    
    if (apiResponse.status === 200) {
      const data = JSON.parse(apiResponse.body);
      
      // Build pagination metadata for response
      const totalPages = Math.ceil(data.total / parseInt(params.limit));
      const currentPage = parseInt(params.page);
      
      const paginationLinks = {
        self: `?${queryString.stringify(params)}`,
        first: `?${queryString.stringify({ ...params, page: '1' })}`,
        last: `?${queryString.stringify({ ...params, page: totalPages.toString() })}`
      };
      
      if (currentPage > 1) {
        paginationLinks.prev = `?${queryString.stringify({ ...params, page: (currentPage - 1).toString() })}`;
      }
      
      if (currentPage < totalPages) {
        paginationLinks.next = `?${queryString.stringify({ ...params, page: (currentPage + 1).toString() })}`;
      }
      
      return response.send({
        data: data.records,
        pagination: {
          current_page: currentPage,
          total_pages: totalPages,
          total_records: data.total,
          per_page: parseInt(params.limit),
          links: paginationLinks
        }
      }, 200);
    } else {
      return response.send({ error: 'External API error' }, 502);
    }
  } catch (error) {
    console.error('URL building error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 3: Message Encoding and Webhook Processing

```javascript
export default async (request) => {
  const base64 = require('codec/base64');
  const queryString = require('codec/query_string');
  const pubnub = require('pubnub');
  const crypto = require('crypto');
  
  try {
    const messageData = request.message;
    
    // Create a unique message ID
    const messageId = await crypto.sha256(JSON.stringify(messageData) + Date.now());
    
    // Encode sensitive parts of the message
    if (messageData.personalInfo) {
      messageData.personalInfo = base64.btoa(JSON.stringify(messageData.personalInfo));
      messageData.encoded = true;
    }
    
    // Prepare webhook data
    const webhookPayload = {
      messageId: messageId,
      channel: request.channels[0],
      timestamp: Date.now(),
      data: messageData
    };
    
    // Create webhook URL with query parameters
    const webhookParams = {
      source: 'pubnub_functions',
      version: '2.0',
      event_type: 'message_processed',
      message_id: messageId
    };
    
    const webhookUrl = `https://webhook.example.com/events?${queryString.stringify(webhookParams)}`;
    
    // Send webhook (fire and forget)
    const xhr = require('xhr');
    try {
      await xhr.fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'pubnub-functions'
        },
        body: JSON.stringify(webhookPayload)
      });
      console.log('Webhook sent successfully');
    } catch (webhookError) {
      console.error('Webhook failed (non-critical):', webhookError);
    }
    
    // Publish processed message to monitoring channel
    await pubnub.fire({
      channel: 'message.monitoring',
      message: {
        messageId: messageId,
        originalChannel: request.channels[0],
        processed: true,
        encoded: messageData.encoded || false,
        webhookSent: true,
        timestamp: Date.now()
      }
    });
    
    return request.ok();
  } catch (error) {
    console.error('Message encoding error:', error);
    return request.abort();
  }
};
```

### Example 4: Configuration and Settings Management

```javascript
export default async (request, response) => {
  const queryString = require('codec/query_string');
  const base64 = require('codec/base64');
  const db = require('kvstore');
  
  try {
    const action = request.params.action;
    
    switch (action) {
      case 'get_config':
        // Parse query parameters for configuration request
        const configParams = queryString.parse(request.query, {
          environment: 'production',
          include_secrets: 'false',
          format: 'json'
        });
        
        // Get configuration from KV store
        const configKey = `config:${configParams.environment}`;
        const config = await db.get(configKey);
        
        if (!config) {
          return response.send({ error: 'Configuration not found' }, 404);
        }
        
        // Filter out secrets if not requested
        let responseConfig = { ...config };
        if (configParams.include_secrets === 'false') {
          delete responseConfig.secrets;
          delete responseConfig.apiKeys;
        }
        
        // Encode sensitive configuration if requested
        if (configParams.format === 'encoded') {
          responseConfig = {
            data: base64.btoa(JSON.stringify(responseConfig)),
            encoded: true
          };
        }
        
        return response.send(responseConfig, 200);
        
      case 'update_config':
        // Parse the request body
        const updateData = await request.json();
        const environment = request.query.environment || 'production';
        
        // Decode configuration if it was encoded
        let configUpdate;
        if (updateData.encoded) {
          configUpdate = JSON.parse(base64.atob(updateData.data));
        } else {
          configUpdate = updateData;
        }
        
        // Get existing configuration
        const existingConfigKey = `config:${environment}`;
        const existingConfig = await db.get(existingConfigKey) || {};
        
        // Merge with existing configuration
        const mergedConfig = {
          ...existingConfig,
          ...configUpdate,
          lastUpdated: Date.now(),
          version: (existingConfig.version || 0) + 1
        };
        
        // Store updated configuration
        await db.set(existingConfigKey, mergedConfig, 43200); // 30 days TTL
        
        // Build response with update summary
        const updateSummary = {
          environment: environment,
          version: mergedConfig.version,
          fieldsUpdated: Object.keys(configUpdate),
          timestamp: mergedConfig.lastUpdated
        };
        
        return response.send(updateSummary, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
  } catch (error) {
    console.error('Configuration management error:', error);
    return response.send({ error: 'Internal server error' }, 500);
  }
};
```

### Example 5: Multi-format Data Processing

```javascript
export default async (request) => {
  const base64 = require('codec/base64');
  const queryString = require('codec/query_string');
  const pubnub = require('pubnub');
  const utils = require('utils');
  
  try {
    const messageData = request.message;
    const formats = [];
    
    // Process different data formats in the message
    if (messageData.base64Data) {
      try {
        const decodedData = base64.atob(messageData.base64Data);
        const parsedData = JSON.parse(decodedData);
        messageData.decodedContent = parsedData;
        formats.push('base64_decoded');
      } catch (decodeError) {
        console.warn('Failed to decode base64 data:', decodeError);
      }
    }
    
    if (messageData.queryParams) {
      const parsedParams = queryString.parse(messageData.queryParams, {
        page: '1',
        limit: '10'
      });
      messageData.parsedParams = parsedParams;
      formats.push('query_string_parsed');
      
      // Validate numeric parameters
      if (utils.isNumeric(parsedParams.page) && utils.isNumeric(parsedParams.limit)) {
        messageData.paginationValid = true;
      }
    }
    
    if (messageData.formData && typeof messageData.formData === 'object') {
      // Convert form data object to query string for consistent processing
      const formAsQuery = queryString.stringify(messageData.formData);
      messageData.normalizedFormData = formAsQuery;
      formats.push('form_data_normalized');
    }
    
    // Create data fingerprint for deduplication
    const dataForFingerprint = {
      ...messageData,
      // Exclude dynamic fields from fingerprint
      timestamp: undefined,
      processingId: undefined
    };
    
    const fingerprintData = base64.btoa(JSON.stringify(dataForFingerprint));
    
    // Route to different channels based on content type
    const routingChannels = [];
    
    if (messageData.decodedContent) {
      routingChannels.push('data.decoded');
    }
    
    if (messageData.paginationValid) {
      routingChannels.push('data.paginated');
    }
    
    if (formats.length > 1) {
      routingChannels.push('data.multiformat');
    }
    
    // Publish to routing channels
    for (const channel of routingChannels) {
      await pubnub.fire({
        channel: channel,
        message: {
          originalChannel: request.channels[0],
          formats: formats,
          fingerprint: fingerprintData,
          data: messageData,
          processedAt: Date.now()
        }
      });
    }
    
    // Add processing metadata to original message
    request.message.processing = {
      formats: formats,
      fingerprintGenerated: true,
      routedToChannels: routingChannels,
      processedAt: Date.now()
    };
    
    return request.ok();
  } catch (error) {
    console.error('Multi-format processing error:', error);
    return request.abort();
  }
};
```

## Use Cases and Applications

### Authentication
- **API Integration:** Authenticate with external APIs using Basic Auth
- **Service-to-Service:** Secure communication between microservices
- **Legacy System Integration:** Connect with older systems requiring Basic Auth

### Data Encoding
- **Data Privacy:** Encode sensitive information in transit
- **Binary Data Handling:** Process base64-encoded files and images
- **URL Safety:** Make data safe for inclusion in URLs and filenames
- **Data Obfuscation:** Simple encoding for non-critical data hiding

### Query Processing
- **HTTP Request Handling:** Parse and validate incoming request parameters
- **API Response Building:** Create consistent pagination and filtering
- **Configuration Management:** Handle complex configuration parameters
- **Search and Filtering:** Process user search and filter inputs

## Limits and Considerations

*   **Security:** Basic Auth and Base64 are not encryption - they're encoding. Don't rely on them for security-critical data protection.
*   **Performance:** Encoding/decoding operations add minimal overhead but should be considered for high-frequency operations.
*   **Data Size:** Base64 encoding increases data size by approximately 33%. Consider this for large payloads.
*   **Character Sets:** Base64 encoding works with any binary data, but query string parsing assumes URL-encoded text.
*   **URL Length Limits:** When building URLs with query strings, be aware of URL length limitations in different browsers and servers.

## Best Practices

*   **Use HTTPS:** Always use secure connections when sending Basic Auth headers.
*   **Store credentials securely:** Use the Vault module for API credentials, never hardcode them.
*   **Validate parsed data:** Always validate query parameters and decoded data before use.
*   **Handle encoding errors:** Wrap encoding/decoding operations in try-catch blocks.
*   **Use URL-safe encoding:** Use `base64.encodeString()` for data that will be included in URLs.
*   **Combine with validation:** Use codec modules alongside the utils module for comprehensive input processing.
*   **Consider alternatives:** For security-sensitive applications, consider stronger authentication methods than Basic Auth.