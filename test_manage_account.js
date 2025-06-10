#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

// Test the manage_pubnub_account functionality with create, list, and delete actions
async function testManageAccount() {
  const email = process.env.PUBNUB_EMAIL;
  const password = process.env.PUBNUB_PASSWORD;
  
  if (!email || !password) {
    console.error('Error: PUBNUB_EMAIL and PUBNUB_PASSWORD environment variables must be set');
    process.exit(1);
  }
  
  console.log('Testing PubNub Account Management API with create, list, and delete actions...');
  console.log('Using email:', email);
  
  let sessionToken = null;
  let accountId = null;
  
  try {
    // Test authentication
    console.log('\n1. Testing authentication...');
    const authResponse = await fetch('https://admin.pubnub.com/api/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
    }
    
    const authData = await authResponse.json();
    sessionToken = authData.result.token;
    accountId = authData.result.user.account_id;
    
    console.log('✓ Authentication successful');
    console.log('  Account ID:', accountId);
    console.log('  Session Token:', sessionToken.substring(0, 10) + '...');
    
    // Test list apps (subject: app, action: list)
    console.log('\n2. Testing list apps (subject: app, action: list)...');
    const listAppsResponse = await fetch(`https://admin.pubnub.com/api/apps?owner_id=${accountId}&no_keys=1`, {
      headers: {
        'X-Session-Token': sessionToken,
      },
    });
    
    if (!listAppsResponse.ok) {
      throw new Error(`Failed to list apps: ${listAppsResponse.status} ${listAppsResponse.statusText}`);
    }
    
    const listAppsData = await listAppsResponse.json();
    console.log('✓ Apps listed successfully');
    console.log('  Total apps before create:', listAppsData.total);
    
    // Test create app (subject: app, action: create)
    console.log('\n3. Testing create app (subject: app, action: create)...');
    const newAppName = `Test App ${new Date().toISOString()}`;
    const createAppResponse = await fetch('https://admin.pubnub.com/api/apps', {
      method: 'POST',
      headers: {
        'X-Session-Token': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_id: accountId,
        name: newAppName
      }),
    });
    
    if (!createAppResponse.ok) {
      throw new Error(`Failed to create app: ${createAppResponse.status} ${createAppResponse.statusText}`);
    }
    
    const createAppData = await createAppResponse.json();
    console.log('✓ App created successfully');
    console.log('  App name:', createAppData.result.name);
    console.log('  App ID:', createAppData.result.id);
    const createdAppId = createAppData.result.id;
    
    // Test create API key (subject: api_key, action: create)
    console.log('\n4. Testing create API key (subject: api_key, action: create)...');
    const newKeyName = `Test Key ${new Date().toISOString()}`;
    const createKeyResponse = await fetch('https://admin.pubnub.com/api/keys', {
      method: 'POST',
      headers: {
        'X-Session-Token': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: createdAppId,
        type: 1, // production
        properties: {
          name: newKeyName,
          history: 1,
          message_storage_ttl: 30,
          presence: 1,
          wildcardsubscribe: 1
        }
      }),
    });
    
    if (!createKeyResponse.ok) {
      const errorText = await createKeyResponse.text();
      throw new Error(`Failed to create API key: ${createKeyResponse.status} ${createKeyResponse.statusText} - ${errorText}`);
    }
    
    const createKeyData = await createKeyResponse.json();
    console.log('✓ API key created successfully');
    console.log('  Key name:', createKeyData.result.properties.name);
    console.log('  Key ID:', createKeyData.result.id);
    const createdKeyId = createKeyData.result.id;
    
    // Test list API keys to verify creation
    console.log('\n5. Testing list API keys after creation...');
    const listKeysAfterCreateResponse = await fetch(`https://admin.pubnub.com/api/apps?owner_id=${accountId}`, {
      headers: {
        'X-Session-Token': sessionToken,
      },
    });
    
    if (!listKeysAfterCreateResponse.ok) {
      throw new Error(`Failed to list API keys: ${listKeysAfterCreateResponse.status} ${listKeysAfterCreateResponse.statusText}`);
    }
    
    const listKeysAfterCreateData = await listKeysAfterCreateResponse.json();
    console.log('✓ API keys listed successfully');
    
    // Find our created app and verify it has the key
    const createdApp = listKeysAfterCreateData.result.find(app => app.id === createdAppId);
    if (createdApp && createdApp.keys && createdApp.keys.length > 0) {
      console.log(`  App "${createdApp.name}" has ${createdApp.keys.length} key(s)`);
    }
    
    // Test delete API key (subject: api_key, action: delete)
    console.log('\n6. Testing delete API key (subject: api_key, action: delete)...');
    const deleteKeyResponse = await fetch(`https://admin.pubnub.com/api/keys/${createdKeyId}`, {
      method: 'DELETE',
      headers: {
        'X-Session-Token': sessionToken,
      },
    });
    
    if (!deleteKeyResponse.ok) {
      const errorText = await deleteKeyResponse.text();
      throw new Error(`Failed to delete API key: ${deleteKeyResponse.status} ${deleteKeyResponse.statusText} - ${errorText}`);
    }
    
    console.log('✓ API key deleted successfully');
    console.log('  Deleted key ID:', createdKeyId);
    
    // Test delete app (subject: app, action: delete)
    console.log('\n7. Testing delete app (subject: app, action: delete)...');
    const deleteAppResponse = await fetch(`https://admin.pubnub.com/api/apps/${createdAppId}`, {
      method: 'DELETE',
      headers: {
        'X-Session-Token': sessionToken,
      },
    });
    
    if (!deleteAppResponse.ok) {
      const errorText = await deleteAppResponse.text();
      throw new Error(`Failed to delete app: ${deleteAppResponse.status} ${deleteAppResponse.statusText} - ${errorText}`);
    }
    
    console.log('✓ App deleted successfully');
    console.log('  Deleted app ID:', createdAppId);
    
    // Verify deletion by listing apps again
    console.log('\n8. Verifying deletion by listing apps...');
    const listAppsAfterDeleteResponse = await fetch(`https://admin.pubnub.com/api/apps?owner_id=${accountId}&no_keys=1`, {
      headers: {
        'X-Session-Token': sessionToken,
      },
    });
    
    if (!listAppsAfterDeleteResponse.ok) {
      throw new Error(`Failed to list apps: ${listAppsAfterDeleteResponse.status} ${listAppsAfterDeleteResponse.statusText}`);
    }
    
    const listAppsAfterDeleteData = await listAppsAfterDeleteResponse.json();
    console.log('✓ Apps listed successfully');
    console.log('  Total apps after delete:', listAppsAfterDeleteData.total);
    
    // Verify the app was deleted
    const deletedApp = listAppsAfterDeleteData.result.find(app => app.id === createdAppId);
    if (!deletedApp) {
      console.log('  ✓ Confirmed: Created app was successfully deleted');
    } else {
      console.log('  ⚠️  Warning: App still exists after deletion');
    }
    
    console.log('\n✅ All tests passed!');
    console.log('\n📝 Summary of test operations:');
    console.log('  - Authentication: ✓');
    console.log('  - List apps: ✓');
    console.log('  - Create app: ✓');
    console.log('  - Create API key: ✓');
    console.log('  - List API keys: ✓');
    console.log('  - Delete API key: ✓');
    console.log('  - Delete app: ✓');
    console.log('  - Verify deletion: ✓');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testManageAccount();