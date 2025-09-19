---
id: rest-api-provisioning-keys
title: REST APIs for Provisioning Keys
keywords: [REST API, Provisioning, PubNub, Keys, Account Management, Session Token, Authentication, App Settings and Services]
description: "Learn how to manage keys and apps for PubNub accounts using REST APIs. Authenticate, create apps, and configure services."
sidebar_label: REST APIs for Provisioning Keys
---

## Authenticate

Authenticate with an `email` and `password` to receive a `session_token`. The `session_token` is used for all requests after authentication. You also receive a `account_id` which is also used in some requests.

### Request

```bash
curl --request POST 'https://admin.pubnub.com/api/me' \
  --header 'Content-Type: application/json' \
  --data-raw '{"email":"<email>","password":"<password>"}'
```

### Response

```json
{
  "result": {
    "role": "user",
    "status": 1,
    "token": "<session_token>",
    "user": {
      "account_id": <account_id>,
      "created": 1431339000,
      "deleted": 0,
      "email": "<email>",
      "id": <user_id>,
      "properties": {
        "announcements_seen": "",
        "first": "John",
        "last": "Doe",
        "phone": "+1234567890",
        "website": "https://www.pubnub.com"
      },
      "status": 4,
      "transaction_pricing_plan": null,
      "verified_created": null,
      "verified_expires": null
    },
    "user_id": <user_id>,
    "user_roles": {
      "roles": {}
    }
  }
}
```

Save the `account_id` and `session_token` for future requests.

## Get List of Apps

Your API Keys are organized by `Apps` containers. All your API Keys are stored here and you need the `app_id` to make requests to change your API‑Key settings.

**Note:** Both the `GET /api/apps` and `GET /api/apps/<app_id>` endpoints support the optional `no_keys` parameter. When set (`no_keys=1`), the response does not include the key list.


### Request

```bash
curl --request GET 'https://admin.pubnub.com/api/apps?owner_id=<account_id>&no_keys=1' --header 'X-Session-Token: <session_token>'
```

### Response

```json
{
  "result": [
    {
        "created": 1407997326,
        "dates": {
            "stats_channel": {
                "created": 1408022525,
                "modified": null
            }
        },
        "id": <id>,
        "modified": null,
        "name": "My First PubNub App",
        "owner_id": <owner-id>,
        "properties": {
            "stats_channel": "2tQAhFZN5B69gtGvy"
        },
        "status": 1
    }
  ],
  "total": 1
}
```

## Get App details using App id

This will fetch the details of the app.


### Request

```bash
curl --request GET 'https://admin.pubnub.com/api/apps/<app_id>?no_keys=1' --header 'X-Session-Token: <session_token>'
```

### Response

```json
{
    "result": {
        "created": 1407997326,
        "dates": {
            "stats_channel": {
                "created": 1408022525,
                "modified": null
            }
        },
        "id": <id>,
        "modified": null,
        "name": "My First PubNub App",
        "owner_id": <owner-id>,
        "properties": {
            "stats_channel": "2tQAhFZN5B69gtGvy"
        },
        "status": 1
    }
}
```

## Get List of Keys

The `/app/keys` endpoint provides you with the list of keys to retrieve for a given application. It comes with a set of required parameters that allow the keys to be paginated.

| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| `app_id` | Number | Yes | ID of the application to extract keys from |
| `page` | Number (from 1 to inf) | Yes | Page number |
| `limit` | Number (from 1 to inf) | Yes | Number of keys to get per page |

### Request

```bash
curl 'https://admin.pubnub.com/api/app/keys?app_id=<app_id>&page=2&limit=1' -H 'X-Session-Token: <token>'
```

### Response

The `total_keys` field returns the total number of all keys in the application.

```json
{
  "result": {
    "keys": [
      {
        "id": 2,
        "app_id": 1,
        "properties": {
          "history": 1,
          "...": "..."
        },
        "publish_key": "XXXXX",
        "subscribe_key": "YYYYY",
        "secret_key": "ZZZZZ"
      }
    ],
    "total_keys": 3
  }
}
```
#### Sample response header

Links in the **link** header allow for crawling through pages. If there's no `next` or `prev` page, the link isn't generated. There is always a `first` page link.

```yaml
link: <https://admin.pubnub.com/api/app/keys?app_id=1&page=1&limit=1>; rel="first";<https://admin.pubnub.com/api/app/keys?app_id=1&page=1&limit=1>; rel="prev";<https://admin.pubnub.com/api/app/keys?app_id=1&page=3&limit=1>; rel="next";
```

## Create an App

Create an App container to organize your API Keys. Your account always starts with one App container, so don't create a new one unless you need to.

### Request

```bash
curl --request POST 'https://admin.pubnub.com/api/apps' \
--header 'X-Session-Token: <session_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "owner_id":<account_id>,
    "name":"My new app"
}'
```

### Response

```json
{
    "result": {
        "created": 1612450966,
        "dates": {
            "stats_channel": {
                "created": 1612450965,
                "modified": null
            }
        },
        "id": <app_id>,
        "modified": null,
        "name": "My new app",
        "owner_id": <account_id>,
        "properties": {
            "stats_channel": <stats_channel>
        },
        "status": 1
    }
}
```

## Manage API Keys

Use the following endpoints to create or modify API Key settings. Common request parameters and properties fields are described below.

### Common parameters

| Name   | Type    | Description                                  | Valid values                       |
|--------|---------|----------------------------------------------|------------------------------------|
| app_id | integer | Application ID (required for create)         | —                                  |
| type   | integer | Environment                                  | 1 = production<br>0 = testing      |
| status | integer | Key status (cannot be re-enabled once disabled) | 1 = enabled (default)<br>0 = disabled |

### Properties fields

| Name                                | Type    | Description                                                             | Valid values                      |
|-------------------------------------|---------|-------------------------------------------------------------------------|-----------------------------------|
| name                                | string  | Name of the keyset                                                      | —                                 |
| history                             | boolean | Enable History API                                                      | 1 = enabled<br>0 = disabled       |
| message_storage_ttl                 | integer | Storage TTL for messages (days)                                         | 1 – 365                           |
| lms                                 | boolean | Enable Large Message Storage                                            | 1 = enabled<br>0 = disabled       |
| multiplexing                        | boolean | Enable Stream Controller                                                 | 1 = enabled                       |
| uls                                 | boolean | Enable Access Manager                                                   | 1 = enabled<br>0 = disabled       |
| objects                             | boolean | Enable Objects feature                                                  | 1 = enabled<br>0 = disabled       |
| objects_region                      | string  | S3 region name for Objects                                              | e.g. aws-iad-1                    |
| objects_user_events_enabled         | boolean | Emit Objects user events                                                | 1 = enabled<br>0 = disabled       |
| objects_space_events_enabled        | boolean | Emit Objects space events                                               | 1 = enabled<br>0 = disabled       |
| objects_membership_events_enabled   | boolean | Emit Objects membership events                                          | 1 = enabled<br>0 = disabled       |
| pam_objects_disallow_getallchannels | boolean | Disallow getAllChannels for Objects (PAM)                               | 1 = enabled<br>0 = disabled       |
| pam_objects_disallow_getalluuids    | boolean | Disallow getAllUUIDs for Objects (PAM)                                  | 1 = enabled<br>0 = disabled       |
| files_enabled                       | boolean | Enable Files storage                                                    | 1 = enabled<br>0 = disabled       |
| files_s3_bucket_region              | string  | S3 bucket region for Files (*changing region may lose existing files*)   | e.g. us-east-1                    |
| files_ttl_in_days                   | integer | Files storage TTL in days                                               | —                                 |
| presence                            | boolean | Enable Presence events                                                   | 1 = enabled<br>0 = disabled       |
| presence_announce_max               | integer | Max channels per presence announce                                      | —                                 |
| presence_interval                   | integer | Presence heartbeat interval (seconds)                                   | —                                 |
| presence_deltas                     | boolean | Enable presence deltas                                                   | 1 = enabled<br>0 = disabled       |
| presence_leave_on_disconnect        | boolean | Send leave events on disconnect                                          | 1 = enabled<br>0 = disabled       |
| presence_stream_filtering           | boolean | Enable filtered presence streams                                         | 1 = enabled<br>0 = disabled       |
| presence_active_notice_channel      | string  | Channel to send active presence notices                                   | —                                 |
| presence_debounce                   | integer | Debounce presence events (seconds)                                       | —                                 |
| presence_store_event_messages       | boolean | Include presence events in message persistence                           | 1 = enabled<br>0 = disabled       |
| wildcardsubscribe                   | boolean | Enable wildcard subscribe                                                | 1 = enabled<br>0 = disabled       |

### Create a new set of API Keys

To provision a new set of API Keys on your account, use the following `POST` method.

### Request

```bash
curl --request POST 'https://admin.pubnub.com/api/keys' \
  --header 'X-Session-Token: <session_token>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "app_id": <app_id>,
    "type": 1,
    "properties": {
      "name": "<key_name>",
      "history": 1,
      "message_storage_ttl": 30,
      "lms": 1,
      "multiplexing": 1,
      "uls": 1,
      "objects": 1,
      "objects_region": "aws-iad-1",
      "objects_user_events_enabled": 1,
      "objects_space_events_enabled": 1,
      "objects_membership_events_enabled": 1,
      "pam_objects_disallow_getallchannels": 0,
      "pam_objects_disallow_getalluuids": 0,
      "files_enabled": 1,
      "files_s3_bucket_region": "us-east-1",
      "files_ttl_in_days": 7,
      "presence": 1,
      "presence_announce_max": 20,
      "presence_interval": 30,
      "presence_deltas": 1,
      "presence_leave_on_disconnect": 1,
      "presence_stream_filtering": 1,
      "presence_active_notice_channel": null,
      "presence_debounce": 2,
      "presence_store_event_messages": 1,
      "wildcardsubscribe": 1
    }
  }'
```

### Response

```json
{
  "result": {
    "id": <key_id>,
    "app_id": <app_id>,
    "status": 1,
    "type": 1,
    "properties": {
      "name": "<key_name>",
      "history": 1,
      "message_storage_ttl": 30,
      "lms": 1,
      "multiplexing": 1,
      "uls": 1,
      "objects": 1,
      "objects_region": "aws-iad-1",
      "objects_user_events_enabled": 1,
      "objects_space_events_enabled": 1,
      "objects_membership_events_enabled": 1,
      "pam_objects_disallow_getallchannels": 0,
      "pam_objects_disallow_getalluuids": 0,
      "files_enabled": 1,
      "files_s3_bucket_region": "us-east-1",
      "files_ttl_in_days": 7,
      "presence": 1,
      "presence_announce_max": 20,
      "presence_interval": 30,
      "presence_deltas": 1,
      "presence_leave_on_disconnect": 1,
      "presence_stream_filtering": 1,
      "presence_active_notice_channel": null,
      "presence_debounce": 2,
      "presence_store_event_messages": 1,
      "wildcardsubscribe": 1
    }
  }
}
```

### Modify API Key Settings

To update an existing API Key, use the following `PUT` method.

### Request

```bash
curl --request PUT 'https://admin.pubnub.com/api/keys/<key_id>' \
  --header 'X-Session-Token: <session_token>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "status": 0,
    "type": 0,
    "properties": {
      "history": 0,
      "message_storage_ttl": 7,
      "uls": 0
    }
  }'
```

### Response

```json
{
  "result": {
    "modified": <timestamp>,
    "properties": {
      "history": 0,
      "message_storage_ttl": 7,
      "uls": 0
    }
  }
}
```

## Vault Operations

### Get list of keys from Vault

Provides list of all key names stored in vault for given subscribe key.

### Request

```bash
curl --request GET 'https://admin.pubnub.com/api/vault/<subscribe_key>/keys' \
--header 'X-Session-Token: <session_token>'
```

### Response

```json
{
    "values": ["secret_name1", "secret_name2"]
}
```

### Add or Update key in Vault

Creates or updates key with given name if one exists in the vault for given subscribe key.

### Request

```bash
curl --request PUT 'https://admin.pubnub.com/api/vault/<subscribe_key>/key/<key_name>' \
--header 'X-Session-Token: <session_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "subscribeKey": "<subscribe_key>",
    "keyName": "<key_name>",
    "value": "<new_value>"
}'
```

### Response

```json
{
    "success": true
}
```

### Remove key from Vault

Removes key with given name from the vault for given subscribe key.

### Request

```bash
curl --request DELETE 'https://admin.pubnub.com/api/vault/<subscribe_key>/key/<key_name>' \
--header 'X-Session-Token: <session_token>'
```

### Response

```json
{
    "success": true
}
```
