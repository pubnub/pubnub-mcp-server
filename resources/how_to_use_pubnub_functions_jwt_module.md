# How to Use the JWT Module in PubNub Functions 2.0

The `jwt` module in PubNub Functions provides JSON Web Token (JWT) creation, verification, and decoding capabilities. This is essential for implementing authentication, authorization, and secure data exchange in your real-time applications.

## Requiring the JWT Module

To use the `jwt` module, you first need to require specific functions:

```javascript
const { sign, verify, decode } = require('jwt');

// Or require individual functions as needed
const jwt = require('jwt');
```

## Core Functions

### 1. `sign(payload, secretOrPrivateKey, options?)`

Creates a JWT string from a payload object and a secret (for HMAC) or private key (for RSA/ECDSA).

*   `payload` (Object): The data to encode in the token
*   `secretOrPrivateKey` (String): Secret for HMAC or private key for RSA/ECDSA
*   `options` (Object, optional): Token options (algorithm, expiresIn, etc.)
*   **Returns:** JWT string

```javascript
export default async (request, response) => {
  const { sign } = require('jwt');
  const vault = require('vault');
  
  try {
    // Get JWT secret from vault
    const jwtSecret = await vault.get("jwt_signing_secret");
    if (!jwtSecret) {
      return response.send({ error: "JWT secret not configured" }, 500);
    }
    
    const userId = request.body.userId;
    const userRole = request.body.role || 'user';
    
    if (!userId) {
      return response.send({ error: "User ID required" }, 400);
    }
    
    // Create JWT payload
    const payload = {
      userId: userId,
      role: userRole,
      permissions: getUserPermissions(userRole),
      iat: Math.floor(Date.now() / 1000), // Issued at
      iss: 'pubnub-function', // Issuer
      aud: 'pubnub-app' // Audience
    };
    
    // Sign token with 24-hour expiration
    const token = sign(payload, jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '24h'
    });
    
    return response.send({
      token: token,
      type: 'Bearer',
      expiresIn: '24h',
      userId: userId
    }, 200);
    
  } catch (error) {
    console.error('JWT signing error:', error);
    return response.send({ error: "Token generation failed" }, 500);
  }
};

function getUserPermissions(role) {
  const permissions = {
    admin: ['read', 'write', 'delete', 'manage'],
    moderator: ['read', 'write', 'moderate'],
    user: ['read', 'write'],
    guest: ['read']
  };
  return permissions[role] || permissions.guest;
}
```

### 2. `verify(token, secretOrPublicKey, options?)`

Verifies a JWT string's signature and optional constraints. Returns the decoded payload if valid.

*   `token` (String): The JWT string to verify
*   `secretOrPublicKey` (String): Secret for HMAC or public key for RSA/ECDSA
*   `options` (Object, optional): Verification options
*   **Returns:** Decoded payload object or throws error

```javascript
export default async (request, response) => {
  const { verify } = require('jwt');
  const vault = require('vault');
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.send({ error: 'Missing or invalid authorization header' }, 401);
    }
    
    const token = authHeader.substring(7);
    
    // Get JWT secret from vault
    const jwtSecret = await vault.get("jwt_signing_secret");
    if (!jwtSecret) {
      return response.send({ error: "JWT secret not configured" }, 500);
    }
    
    // Verify token
    const decoded = verify(token, jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'pubnub-function',
      audience: 'pubnub-app'
    });
    
    // Check if user has required permission
    const requiredPermission = request.query.permission || 'read';
    if (!decoded.permissions.includes(requiredPermission)) {
      return response.send({ 
        error: 'Insufficient permissions',
        required: requiredPermission,
        available: decoded.permissions
      }, 403);
    }
    
    return response.send({
      valid: true,
      userId: decoded.userId,
      role: decoded.role,
      permissions: decoded.permissions,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp
    }, 200);
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.send({ error: 'Token expired' }, 401);
    } else if (error.name === 'JsonWebTokenError') {
      return response.send({ error: 'Invalid token' }, 401);
    } else {
      console.error('JWT verification error:', error);
      return response.send({ error: 'Token verification failed' }, 500);
    }
  }
};
```

### 3. `decode(token, options?)`

Decodes a JWT without verifying the signature. Useful for inspecting token contents.

*   `token` (String): The JWT string to decode
*   `options` (Object, optional): Decode options (e.g., `{ complete: true }`)
*   **Returns:** Decoded payload or complete token object

```javascript
export default async (request, response) => {
  const { decode } = require('jwt');
  
  try {
    const token = request.body.token;
    if (!token) {
      return response.send({ error: 'Token required' }, 400);
    }
    
    // Decode token without verification (for inspection)
    const decoded = decode(token, { complete: true });
    
    if (!decoded) {
      return response.send({ error: 'Invalid token format' }, 400);
    }
    
    // Extract token information
    const tokenInfo = {
      header: decoded.header,
      payload: {
        userId: decoded.payload.userId,
        role: decoded.payload.role,
        issuedAt: decoded.payload.iat,
        expiresAt: decoded.payload.exp,
        issuer: decoded.payload.iss,
        audience: decoded.payload.aud
      },
      algorithm: decoded.header.alg,
      isExpired: decoded.payload.exp < Math.floor(Date.now() / 1000)
    };
    
    return response.send({
      tokenInfo: tokenInfo,
      raw: decoded
    }, 200);
    
  } catch (error) {
    console.error('JWT decode error:', error);
    return response.send({ error: 'Token decode failed' }, 500);
  }
};
```

## Practical Examples

### Example 1: Authentication Middleware Function

```javascript
export default async (request) => {
  const { verify } = require('jwt');
  const vault = require('vault');
  const pubnub = require('pubnub');
  
  try {
    // Extract token from message
    const token = request.message.authToken;
    if (!token) {
      console.log('No auth token provided in message');
      request.message.authenticated = false;
      return request.ok();
    }
    
    // Get JWT secret
    const jwtSecret = await vault.get("jwt_signing_secret");
    if (!jwtSecret) {
      console.error("JWT secret not configured");
      return request.abort();
    }
    
    // Verify token
    const decoded = verify(token, jwtSecret);
    
    // Add authentication info to message
    request.message.authenticated = true;
    request.message.userId = decoded.userId;
    request.message.userRole = decoded.role;
    request.message.permissions = decoded.permissions;
    request.message.tokenExpiry = decoded.exp;
    
    // Log authentication event
    await pubnub.fire({
      channel: 'auth_events',
      message: {
        type: 'token_verified',
        userId: decoded.userId,
        role: decoded.role,
        channel: request.channels[0],
        timestamp: Date.now()
      }
    });
    
    console.log(`Authenticated user ${decoded.userId} with role ${decoded.role}`);
    return request.ok();
    
  } catch (error) {
    console.log('JWT verification failed:', error.message);
    
    // Add authentication failure info
    request.message.authenticated = false;
    request.message.authError = error.name;
    
    // Log authentication failure
    await pubnub.fire({
      channel: 'auth_events',
      message: {
        type: 'token_verification_failed',
        error: error.name,
        channel: request.channels[0],
        timestamp: Date.now()
      }
    });
    
    return request.ok(); // Continue processing but mark as unauthenticated
  }
};
```

### Example 2: Role-Based Access Control

```javascript
export default async (request, response) => {
  const { sign, verify } = require('jwt');
  const vault = require('vault');
  const db = require('kvstore');
  
  try {
    const action = request.query.action;
    const jwtSecret = await vault.get("jwt_signing_secret");
    
    if (!jwtSecret) {
      return response.send({ error: "JWT secret not configured" }, 500);
    }
    
    switch (action) {
      case 'login':
        // Authenticate user and issue token
        const { username, password } = request.body;
        
        // Verify credentials (simplified example)
        const userRecord = await db.get(`user:${username}`);
        if (!userRecord || !verifyPassword(password, userRecord.passwordHash)) {
          return response.send({ error: 'Invalid credentials' }, 401);
        }
        
        // Create token with role-based permissions
        const loginPayload = {
          userId: userRecord.id,
          username: username,
          role: userRecord.role,
          permissions: getRolePermissions(userRecord.role),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };
        
        const loginToken = sign(loginPayload, jwtSecret, { algorithm: 'HS256' });
        
        // Store active session
        await db.set(`session:${userRecord.id}`, {
          token: loginToken,
          loginTime: Date.now(),
          lastActivity: Date.now()
        }, 1440); // 24 hour TTL
        
        return response.send({
          token: loginToken,
          user: {
            id: userRecord.id,
            username: username,
            role: userRecord.role,
            permissions: loginPayload.permissions
          },
          expiresIn: '24h'
        }, 200);
        
      case 'access_check':
        // Check if user can access resource
        const accessToken = request.headers.authorization?.replace('Bearer ', '');
        const resourceId = request.params.resourceId;
        const requiredRole = request.query.requiredRole || 'user';
        
        if (!accessToken) {
          return response.send({ error: 'Access token required' }, 401);
        }
        
        const accessDecoded = verify(accessToken, jwtSecret);
        
        // Check role hierarchy
        const roleHierarchy = ['guest', 'user', 'moderator', 'admin'];
        const userRoleLevel = roleHierarchy.indexOf(accessDecoded.role);
        const requiredRoleLevel = roleHierarchy.indexOf(requiredRole);
        
        if (userRoleLevel < requiredRoleLevel) {
          return response.send({
            access: false,
            error: 'Insufficient role',
            userRole: accessDecoded.role,
            requiredRole: requiredRole
          }, 403);
        }
        
        // Update session activity
        await db.set(`session:${accessDecoded.userId}`, {
          lastActivity: Date.now(),
          lastResource: resourceId
        }, 1440);
        
        return response.send({
          access: true,
          userId: accessDecoded.userId,
          role: accessDecoded.role,
          resourceId: resourceId
        }, 200);
        
      case 'refresh':
        // Refresh token
        const refreshToken = request.body.token;
        
        if (!refreshToken) {
          return response.send({ error: 'Refresh token required' }, 400);
        }
        
        const refreshDecoded = verify(refreshToken, jwtSecret);
        
        // Check if user session is still active
        const sessionData = await db.get(`session:${refreshDecoded.userId}`);
        if (!sessionData) {
          return response.send({ error: 'Session expired' }, 401);
        }
        
        // Create new token with extended expiry
        const refreshPayload = {
          ...refreshDecoded,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };
        delete refreshPayload.exp; // Remove old expiry
        
        const newToken = sign(refreshPayload, jwtSecret, {
          algorithm: 'HS256',
          expiresIn: '24h'
        });
        
        return response.send({
          token: newToken,
          expiresIn: '24h'
        }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.send({ error: 'Token expired' }, 401);
    } else if (error.name === 'JsonWebTokenError') {
      return response.send({ error: 'Invalid token' }, 401);
    } else {
      console.error('JWT operation error:', error);
      return response.send({ error: 'Authentication service error' }, 500);
    }
  }
};

function getRolePermissions(role) {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'system_admin'],
    moderator: ['read', 'write', 'moderate', 'manage_content'],
    user: ['read', 'write', 'profile_edit'],
    guest: ['read']
  };
  return rolePermissions[role] || rolePermissions.guest;
}

function verifyPassword(password, hash) {
  // Simplified password verification
  // In practice, use proper password hashing (bcrypt, scrypt, etc.)
  return true; // Placeholder
}
```

### Example 3: API Gateway with JWT Authentication

```javascript
export default async (request, response) => {
  const { verify, decode } = require('jwt');
  const vault = require('vault');
  const xhr = require('xhr');
  
  try {
    // Extract JWT from request
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.send({ error: 'Authorization header required' }, 401);
    }
    
    const token = authHeader.substring(7);
    const jwtSecret = await vault.get("jwt_signing_secret");
    
    if (!jwtSecret) {
      return response.send({ error: "Authentication service unavailable" }, 503);
    }
    
    // Verify JWT
    const decoded = verify(token, jwtSecret);
    
    // Check token freshness (optional additional security)
    const tokenAge = Math.floor(Date.now() / 1000) - decoded.iat;
    if (tokenAge > 86400) { // 24 hours
      return response.send({ error: 'Token too old, please refresh' }, 401);
    }
    
    // Extract API route
    const apiRoute = request.params.route;
    const method = request.method;
    
    // Check permissions for API route
    const routePermissions = getRoutePermissions(apiRoute, method);
    const hasPermission = routePermissions.every(perm => decoded.permissions.includes(perm));
    
    if (!hasPermission) {
      return response.send({
        error: 'Insufficient permissions for this endpoint',
        required: routePermissions,
        available: decoded.permissions
      }, 403);
    }
    
    // Forward request to backend API
    const backendUrl = await vault.get("backend_api_url");
    const backendApiKey = await vault.get("backend_api_key");
    
    const forwardedRequest = {
      method: method,
      headers: {
        'Content-Type': request.headers['content-type'] || 'application/json',
        'X-User-ID': decoded.userId,
        'X-User-Role': decoded.role,
        'X-API-Key': backendApiKey
      }
    };
    
    if (method === 'POST' || method === 'PUT') {
      forwardedRequest.body = request.body;
    }
    
    const backendResponse = await xhr.fetch(`${backendUrl}/${apiRoute}`, forwardedRequest);
    
    // Forward backend response
    response.headers = backendResponse.headers;
    return response.send(backendResponse.body, backendResponse.status);
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.send({ error: 'Token expired' }, 401);
    } else if (error.name === 'JsonWebTokenError') {
      return response.send({ error: 'Invalid token format' }, 401);
    } else {
      console.error('API Gateway error:', error);
      return response.send({ error: 'Gateway error' }, 500);
    }
  }
};

function getRoutePermissions(route, method) {
  const routeMap = {
    'users': {
      'GET': ['read'],
      'POST': ['write'],
      'PUT': ['write'],
      'DELETE': ['delete']
    },
    'admin': {
      'GET': ['admin'],
      'POST': ['admin'],
      'PUT': ['admin'],
      'DELETE': ['admin']
    },
    'profile': {
      'GET': ['read'],
      'PUT': ['profile_edit']
    }
  };
  
  return routeMap[route]?.[method] || ['read'];
}
```

### Example 4: Token Blacklisting and Session Management

```javascript
export default async (request, response) => {
  const { verify, decode } = require('jwt');
  const vault = require('vault');
  const db = require('kvstore');
  
  try {
    const action = request.query.action;
    const jwtSecret = await vault.get("jwt_signing_secret");
    
    switch (action) {
      case 'blacklist':
        // Blacklist a token (logout)
        const blacklistToken = request.body.token;
        
        if (!blacklistToken) {
          return response.send({ error: 'Token required' }, 400);
        }
        
        // Decode to get expiration time
        const blacklistDecoded = decode(blacklistToken);
        if (!blacklistDecoded) {
          return response.send({ error: 'Invalid token format' }, 400);
        }
        
        // Add to blacklist until token would naturally expire
        const remainingTTL = Math.max(0, blacklistDecoded.exp - Math.floor(Date.now() / 1000));
        if (remainingTTL > 0) {
          await db.set(`blacklist:${blacklistToken}`, {
            blacklistedAt: Date.now(),
            userId: blacklistDecoded.userId,
            reason: 'user_logout'
          }, Math.ceil(remainingTTL / 60)); // Convert to minutes
        }
        
        return response.send({ message: 'Token blacklisted successfully' }, 200);
        
      case 'check_blacklist':
        // Check if token is blacklisted
        const checkToken = request.headers.authorization?.replace('Bearer ', '');
        
        if (!checkToken) {
          return response.send({ error: 'Token required' }, 400);
        }
        
        // Check blacklist
        const blacklistEntry = await db.get(`blacklist:${checkToken}`);
        if (blacklistEntry) {
          return response.send({
            blacklisted: true,
            reason: blacklistEntry.reason,
            blacklistedAt: blacklistEntry.blacklistedAt
          }, 401);
        }
        
        // Verify token
        const checkDecoded = verify(checkToken, jwtSecret);
        
        return response.send({
          blacklisted: false,
          valid: true,
          userId: checkDecoded.userId,
          role: checkDecoded.role
        }, 200);
        
      case 'cleanup':
        // Clean up expired blacklist entries (run periodically)
        const allKeys = await db.getKeys();
        const blacklistKeys = allKeys.filter(key => key.startsWith('blacklist:'));
        
        let cleanedCount = 0;
        for (const key of blacklistKeys) {
          const entry = await db.get(key);
          if (!entry) {
            cleanedCount++;
          }
        }
        
        return response.send({
          message: 'Blacklist cleanup completed',
          cleanedEntries: cleanedCount
        }, 200);
        
      default:
        return response.send({ error: 'Invalid action' }, 400);
    }
    
  } catch (error) {
    console.error('Token management error:', error);
    return response.send({ error: 'Token management failed' }, 500);
  }
};
```

## Security Best Practices

### 1. **Secure Secret Management**
```javascript
// Always use Vault for JWT secrets
const jwtSecret = await vault.get("jwt_signing_secret");

// Never hardcode secrets
const jwtSecret = "hardcoded_secret"; // ❌ Never do this
```

### 2. **Proper Algorithm Specification**
```javascript
// Specify allowed algorithms explicitly
const decoded = verify(token, secret, { algorithms: ['HS256'] });

// Avoid algorithm: 'none' or unspecified algorithms
```

### 3. **Token Expiration**
```javascript
// Always set reasonable expiration times
const token = sign(payload, secret, { expiresIn: '24h' });

// Avoid tokens without expiration
const token = sign(payload, secret); // ❌ No expiration
```

### 4. **Secure Headers**
```javascript
// Include security claims
const payload = {
  userId: user.id,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  iss: 'your-app',
  aud: 'your-api'
};
```

## Important Considerations

*   **Secret Storage:** Always use the Vault module for JWT signing secrets
*   **Algorithm Security:** Use strong algorithms like HS256, RS256, or ES256
*   **Token Expiration:** Set appropriate expiration times to limit exposure
*   **Payload Size:** Keep payloads small to reduce token size
*   **Error Handling:** Properly handle verification errors and provide appropriate responses
*   **Blacklisting:** Implement token blacklisting for logout functionality
*   **Performance:** JWT operations are computationally intensive; consider caching when appropriate

The JWT module enables secure authentication and authorization in your PubNub Functions, allowing you to build robust real-time applications with proper access control.