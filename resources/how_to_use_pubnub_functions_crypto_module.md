# How to Use the Crypto Module in PubNub Functions 2.0

The `crypto` module in PubNub Functions provides cryptographic helper functions for common security operations such as hashing, message authentication codes (HMAC), and digital signatures. This is essential for securing data, validating webhooks, and implementing authentication mechanisms in your serverless functions.

## Requiring the Crypto Module

To use the `crypto` module, you first need to require it in your Function:

```javascript
const crypto = require('crypto');
```

**Note:** This is a PubNub-provided crypto module, not the full Node.js `crypto` library. It offers specific cryptographic operations optimized for the Functions environment.

## Available Algorithms

You can list available algorithms via `crypto.ALGORITHM`, which provides constants for different cryptographic operations:

```javascript
const crypto = require('crypto');

// Common algorithms include:
// crypto.ALGORITHM.HMAC_SHA1
// crypto.ALGORITHM.HMAC_SHA256
// crypto.ALGORITHM.HMAC_SHA512
// crypto.ALGORITHM.ED25519
// crypto.ALGORITHM.ECDSA (various curves)
```

## Core Methods

All crypto methods return Promises, so always use `async/await` with `try/catch` for error handling.

### 1. `crypto.hmac(key, message, algorithm)`

Generate a Base64-encoded HMAC (Hash-based Message Authentication Code) signature.

*   `key` (String): The secret key for HMAC generation
*   `message` (String): The message to sign
*   `algorithm` (String): Algorithm constant from `crypto.ALGORITHM`
*   **Returns:** Promise that resolves to Base64-encoded HMAC digest

```javascript
export default async (request, response) => {
  const crypto = require('crypto');
  const vault = require('vault');
  
  try {
    // Get webhook secret from vault
    const webhookSecret = await vault.get("webhook_secret");
    if (!webhookSecret) {
      return response.send({ error: "Webhook secret not configured" }, 500);
    }

    const payload = request.body;
    const receivedSignature = request.headers['x-signature'];
    
    // Generate HMAC signature
    const expectedSignature = await crypto.hmac(
      webhookSecret, 
      payload, 
      crypto.ALGORITHM.HMAC_SHA256
    );
    
    const expectedHeader = `sha256=${expectedSignature}`;
    
    if (receivedSignature !== expectedHeader) {
      console.error("Webhook signature validation failed");
      return response.send({ error: "Invalid signature" }, 401);
    }
    
    // Process validated webhook
    const webhookData = JSON.parse(payload);
    console.log("Webhook validated and processed");
    
    return response.send({ message: "Webhook processed successfully" }, 200);
  } catch (error) {
    console.error('Crypto operation failed:', error);
    return response.send({ error: "Internal server error" }, 500);
  }
};
```

### 2. Hash Functions

Generate cryptographic hashes of data using various algorithms.

#### `crypto.sha1(message)`
Generate SHA-1 hash (less secure, avoid for new applications).

#### `crypto.sha256(message)`
Generate SHA-256 hash (recommended for most use cases).

#### `crypto.sha512(message)`
Generate SHA-512 hash (for applications requiring longer hashes).

*   `message` (String): The data to hash
*   **Returns:** Promise that resolves to hex string of the digest

```javascript
export default async (request) => {
  const crypto = require('crypto');
  const db = require('kvstore');
  
  try {
    const userData = request.message.userData;
    
    // Create hash of user data for deduplication
    const userDataString = JSON.stringify(userData);
    const dataHash = await crypto.sha256(userDataString);
    
    // Check if we've seen this exact data before
    const existingHash = await db.get(`user_data_hash:${userData.userId}`);
    
    if (existingHash === dataHash) {
      console.log("Duplicate user data detected, skipping processing");
      return request.ok();
    }
    
    // Store new hash for future deduplication
    await db.set(`user_data_hash:${userData.userId}`, dataHash, 1440); // 24 hour TTL
    
    // Process new/changed user data
    console.log("Processing new user data");
    request.message.isNewData = true;
    
    return request.ok();
  } catch (error) {
    console.error('Hash operation failed:', error);
    return request.abort();
  }
};
```

## Practical Examples

### Example 1: API Request Signing

```javascript
export default async (request) => {
  const crypto = require('crypto');
  const xhr = require('xhr');
  const vault = require('vault');
  
  try {
    // Get API credentials from vault
    const [apiKey, apiSecret] = await Promise.all([
      vault.get("api_key"),
      vault.get("api_secret")
    ]);
    
    if (!apiKey || !apiSecret) {
      console.error("API credentials missing");
      return request.abort();
    }
    
    const timestamp = Date.now().toString();
    const method = 'POST';
    const endpoint = '/api/users';
    const requestBody = JSON.stringify(request.message.userData);
    
    // Create signature string
    const signatureString = `${method}${endpoint}${timestamp}${requestBody}`;
    
    // Generate HMAC signature
    const signature = await crypto.hmac(
      apiSecret, 
      signatureString, 
      crypto.ALGORITHM.HMAC_SHA256
    );
    
    // Make authenticated API request
    const response = await xhr.fetch(`https://api.example.com${endpoint}`, {
      method: method,
      headers: {
        'X-API-Key': apiKey,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
    
    if (response.status === 200) {
      console.log("API request successful");
      const responseData = JSON.parse(response.body);
      request.message.apiResponse = responseData;
    } else {
      console.error("API request failed:", response.status);
    }
    
    return request.ok();
  } catch (error) {
    console.error('API signing error:', error);
    return request.abort();
  }
};
```

### Example 2: Secure Token Generation

```javascript
export default async (request, response) => {
  const crypto = require('crypto');
  const vault = require('vault');
  const db = require('kvstore');
  
  try {
    const userId = request.body.userId;
    if (!userId) {
      return response.send({ error: "User ID required" }, 400);
    }
    
    // Get token signing secret
    const tokenSecret = await vault.get("token_signing_secret");
    if (!tokenSecret) {
      return response.send({ error: "Token secret not configured" }, 500);
    }
    
    const timestamp = Date.now();
    const expiry = timestamp + (24 * 60 * 60 * 1000); // 24 hours
    
    // Create token payload
    const tokenPayload = JSON.stringify({
      userId: userId,
      issued: timestamp,
      expires: expiry,
      scope: 'api_access'
    });
    
    // Generate secure token signature
    const tokenSignature = await crypto.hmac(
      tokenSecret,
      tokenPayload,
      crypto.ALGORITHM.HMAC_SHA512
    );
    
    // Create final token (base64 payload + signature)
    const tokenData = {
      payload: Buffer.from(tokenPayload).toString('base64'),
      signature: tokenSignature
    };
    
    const secureToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    
    // Store token for validation (with TTL matching expiry)
    await db.set(`auth_token:${userId}`, {
      tokenHash: await crypto.sha256(secureToken),
      expires: expiry,
      issued: timestamp
    }, 1440); // 24 hours TTL
    
    return response.send({
      token: secureToken,
      expires: expiry,
      type: 'Bearer'
    }, 200);
    
  } catch (error) {
    console.error('Token generation error:', error);
    return response.send({ error: "Token generation failed" }, 500);
  }
};
```

### Example 3: Data Integrity Verification

```javascript
export default async (request) => {
  const crypto = require('crypto');
  const pubnub = require('pubnub');
  
  try {
    const messageData = request.message;
    
    // Extract integrity hash if present
    const receivedHash = messageData.integrityHash;
    delete messageData.integrityHash; // Remove hash from data before verification
    
    if (receivedHash) {
      // Verify data integrity
      const dataString = JSON.stringify(messageData);
      const calculatedHash = await crypto.sha256(dataString);
      
      if (receivedHash !== calculatedHash) {
        console.error("Data integrity check failed");
        
        // Publish security alert
        await pubnub.fire({
          channel: 'security_alerts',
          message: {
            type: 'integrity_violation',
            originalHash: receivedHash,
            calculatedHash: calculatedHash,
            timestamp: Date.now(),
            channel: request.channels[0]
          }
        });
        
        return request.abort();
      }
      
      console.log("Data integrity verified");
    }
    
    // Add new integrity hash for downstream processing
    const currentDataString = JSON.stringify(messageData);
    const newHash = await crypto.sha256(currentDataString);
    messageData.integrityHash = newHash;
    messageData.verifiedAt = Date.now();
    
    return request.ok();
  } catch (error) {
    console.error('Integrity verification error:', error);
    return request.abort();
  }
};
```

### Example 4: Password Hashing and Verification

```javascript
export default async (request, response) => {
  const crypto = require('crypto');
  const vault = require('vault');
  const db = require('kvstore');
  
  try {
    const action = request.query.action;
    const userId = request.body.userId;
    const password = request.body.password;
    
    if (!userId || !password) {
      return response.send({ error: "User ID and password required" }, 400);
    }
    
    // Get password salt from vault
    const passwordSalt = await vault.get("password_salt");
    if (!passwordSalt) {
      return response.send({ error: "Password salt not configured" }, 500);
    }
    
    switch (action) {
      case 'hash':
        // Hash a new password
        const saltedPassword = password + passwordSalt + userId;
        const passwordHash = await crypto.sha512(saltedPassword);
        
        // Store hashed password
        await db.set(`user_password:${userId}`, {
          hash: passwordHash,
          created: Date.now(),
          algorithm: 'sha512_salted'
        }, 525600); // 1 year TTL
        
        return response.send({ 
          message: "Password hashed and stored successfully" 
        }, 200);
        
      case 'verify':
        // Verify a password
        const storedPasswordData = await db.get(`user_password:${userId}`);
        
        if (!storedPasswordData) {
          return response.send({ error: "User not found" }, 404);
        }
        
        const verificationString = password + passwordSalt + userId;
        const verificationHash = await crypto.sha512(verificationString);
        
        const isValid = verificationHash === storedPasswordData.hash;
        
        return response.send({
          valid: isValid,
          ...(isValid && { message: "Password verified" })
        }, isValid ? 200 : 401);
        
      default:
        return response.send({ error: "Invalid action" }, 400);
    }
    
  } catch (error) {
    console.error('Password operation error:', error);
    return response.send({ error: "Password operation failed" }, 500);
  }
};
```

### Example 5: Message Fingerprinting for Deduplication

```javascript
export default async (request) => {
  const crypto = require('crypto');
  const db = require('kvstore');
  
  try {
    // Create message fingerprint for deduplication
    const messageContent = {
      type: request.message.type,
      userId: request.message.userId,
      content: request.message.content,
      // Exclude timestamp and other variable fields
    };
    
    const messageString = JSON.stringify(messageContent);
    const messageFingerprint = await crypto.sha256(messageString);
    
    // Check if we've seen this message recently (last 5 minutes)
    const dedupeKey = `message_fingerprint:${messageFingerprint}`;
    const existingMessage = await db.get(dedupeKey);
    
    if (existingMessage) {
      console.log("Duplicate message detected, enhancing with count");
      
      // Increment duplicate counter
      const duplicateCount = await db.incrCounter(`duplicate_count:${messageFingerprint}`);
      
      request.message.isDuplicate = true;
      request.message.duplicateCount = duplicateCount;
      request.message.originalTimestamp = existingMessage.timestamp;
    } else {
      // Store fingerprint for deduplication (5 minute TTL)
      await db.set(dedupeKey, {
        timestamp: Date.now(),
        channel: request.channels[0]
      }, 5);
      
      request.message.isDuplicate = false;
      request.message.fingerprint = messageFingerprint;
    }
    
    return request.ok();
  } catch (error) {
    console.error('Message fingerprinting error:', error);
    return request.ok(); // Don't block message processing
  }
};
```

## Security Best Practices

### 1. **Use Strong Algorithms**
```javascript
// Recommended for new applications
const signature = await crypto.hmac(key, message, crypto.ALGORITHM.HMAC_SHA256);
const hash = await crypto.sha256(data);

// Avoid for new applications (use only for legacy compatibility)
const legacyHash = await crypto.sha1(data);
```

### 2. **Secure Key Management**
```javascript
// Always use Vault for secrets
const signingKey = await vault.get("signing_key");

// Never hardcode secrets
const signingKey = "hardcoded_secret"; // ❌ Never do this
```

### 3. **Constant-Time Comparison**
```javascript
// For signature verification, always compare the full signatures
if (receivedSignature === expectedSignature) {
  // Valid signature
}

// Avoid early returns that could enable timing attacks
```

### 4. **Salt Your Hashes**
```javascript
// Add salt to prevent rainbow table attacks
const saltedData = data + salt + userId;
const hash = await crypto.sha256(saltedData);
```

### 5. **Handle Errors Securely**
```javascript
try {
  const signature = await crypto.hmac(key, message, algorithm);
  // Use signature
} catch (error) {
  console.error('Crypto operation failed'); // Don't log sensitive details
  return request.abort();
}
```

## Important Considerations

*   **Algorithm Support:** Check `crypto.ALGORITHM` for available algorithms in your Functions environment
*   **Key Management:** Always use the Vault module for storing cryptographic keys and secrets
*   **Performance:** Cryptographic operations are computationally intensive; consider their impact on function execution time
*   **Error Handling:** Always wrap crypto operations in try/catch blocks
*   **Timing Attacks:** Be aware of timing-based security vulnerabilities when comparing hashes or signatures
*   **Operation Limits:** Crypto operations may count toward function execution limits

The crypto module provides essential security capabilities for PubNub Functions, enabling you to build secure, authenticated, and tamper-resistant real-time applications.