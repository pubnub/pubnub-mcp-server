# PubNub Events & Actions Guide

This guide covers PubNub Events & Actions functionality, compiled from official documentation.

## Overview

Source: https://www.pubnub.com/docs/serverless/events-and-actions/overview

# Events & Actions

Events & Actions (E&A) lets you manage PubNub-generated events and route real-time data to third-party systems (storage, analytics, ML/AI) with no code.

## How it works

Events are generated as your app uses PubNub, both explicitly (API calls like Publish/Subscribe) and implicitly (connect/disconnect). Configure a listener for a chosen event, then attach one or more actions (webhook, queues, storage, etc.). Actions can be defined independently and attached to listeners later.

Events & Actions is accessible via the Admin Portal: https://admin.pubnub.com

Public Admin Portal demo: https://demo-admin.pubnub.com/

## Availability

Events & Actions is available on Free, Starter, and Pro plans in eight tiers.

Item Free | Intro | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Tier 6
- Max events ingested: 10K | 2M | 4M | 25M | 66M | 200M | 500M | Unlimited
- Listeners: 1 | Unlimited (all higher tiers)
- Actions per listener: 1 | 3 (Tiers Intro–5) | Unlimited (Tier 6)
- Action Types per Listener: Webhook only (Free) | All Available Actions (paid tiers)
- Retry: No (Free) | Yes (paid tiers)

Two-week free trial available. After trial, contact sales to upgrade: https://www.pubnub.com/company/contact-sales/

## Event listeners

Event listeners activate on PubNub events such as:
- Message published to a specific channel
- Message published by a specific Sender ID
- Message metadata matching a pattern
- File sent by a particular user

A listener can have several actions; all attached actions trigger when the event occurs.

For the list of events/actions, see Event/Action List.

## Actions

Actions define how to send data once a listener triggers. Available actions:
- Webhook
- Amazon SQS
- Amazon Kinesis
- Amazon S3 with batching
- Apache Kafka
- IFTTT Webhook
- AMQP

Actions per listener depend on your E&A tier.

## Events & Actions vs. Functions

- Use Events & Actions for low-code routing to third-party systems.
- Use Functions to modify messages in-flight, build custom logic, aggregate data, etc.

## Configure Events & Actions

Configure through the Admin Portal UI. Paid plans include webhook retries and custom headers. See Configure Events & Actions.
Last updated on Apr 28, 2025

---

## Events

Source: https://www.pubnub.com/docs/serverless/events-and-actions/events

# Event / Action List

Event listeners activate on PubNub events. A listener with no actions still activates, but performs no action.

User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and server responses but holds the value of the userId parameter set during initialization.

Actions per listener depend on your E&A tier.

## Event source

Choose one source per listener:

- Messages
- Users
- Channels
- Mobile Push notifications
- Membership

### Messages

Event Producer | Event Type | Description
- Pub/Sub | Message sent | Message was published on a channel. Note: E&A doesn't process internal presence publishes (for example, -pnpres channels).
- Message Reaction | Message reaction created | A reaction was added.
- Message Reaction | Message reaction deleted | A reaction was removed.
- Files | File sent | A file was sent to a channel.

### Users

Event Producer | Event Type | Description
- Presence | User state changed in channel | Presence state changed on a channel.
- CRUD | User created | User metadata was set.
- CRUD | User updated | User metadata was changed.
- CRUD | User deleted | User metadata was removed.

### Channels

Event Producer | Event Type | Description
- Presence | User started subscription to channel | User subscribed.
- Presence | User stopped subscription to channel | User unsubscribed.
- Presence | User timed out while subscribing to channel | Subscription timed out.
- Presence | First user subscribed to channel | Occupancy changed 0→1.
- Presence | Last user left channel | Occupancy changed 1→0.
- Presence | Interval occupancy counted | Occupancy and deltas at configured interval.
- CRUD | Channel created | Channel metadata set.
- CRUD | Channel updated | Channel metadata changed.
- CRUD | Channel deleted | Channel metadata removed.

### Mobile push notifications

Event Producer | Event Type | Description
- Devices | Device removed | Device token removed from a channel.
- Devices | Push error | Mobile Push notification error occurred.

### Memberships

Event Producer | Event Type | Description
- CRUD | Membership created | Membership metadata set.
- CRUD | Membership updated | Membership metadata changed.
- CRUD | Membership deleted | Membership metadata removed.

Payloads
See Events & Actions Payloads for sample payloads.

### Filters

Filters define which events trigger actions.

- No Filter: Triggers on all messages sent through the keyset.
- Basic Filters: Use UI to set Filters, Condition, Value.
  - Filters: Channel (specific channel), Sender ID (specific sender)
  - Condition: Exact Match, Contains
  - Value: String input
- Advanced JSON path: Use JSONPath to target elements within event payload.

Examples:
- Channel name with RegEx: $.[?(@.channel =~ /.*my_channel.*/i)]
- Fields in message payload: $.[?(@.message['some_property'] == 'some_value')]
- Fields in message metadata: $.[?(@.meta.sensor in ['warn', 'alert'])]
- Combination: $.[?(@.channel =~ /.*some_suffix/i && @.meta.sensor_reading > 25 && @.message.status != 'error')]

JSONPath evaluator: http://jsonpath.com/

Event JSON schema
##### Message publish

```
`{  
    meta: , # metadata param  
    message: , # payload contents  
    channel: , # channel  
    uuid:  # aka user id / sender id   
}  
`
```

## Actions

Actions can deliver to webhooks or AWS services (SQS, Kinesis), among others.

### Settings

Shared options:

- Retries
- Envelope
- Batching

#### Retries

Jittered retry strategy with random delay:

```
`delay = random_between(minIntervalForRetry = 10sec, min(maxRetryPeriod = 900sec, (baseRetryIntervalDefinedByUser * 2)^ attemptNo))  
`
```

Retry policy per action:
- Number of retries: Default 2, min 1, max 4
- Retry interval (seconds): Default 450, min 10, max 900 (exponential backoff with randomness)

#### Envelope

Optionally include E&A metadata in the payload envelope (channel, listener, etc.). Versions: 1.0, 2.0, 2.1 (default). Each version supports enveloped and unenveloped formats.

By default, version 2.1 without envelope is used. Toggle Is Enveloped in UI to select schema version.

Payloads
See Events & Actions Payloads for examples.

#### Batching

Amazon S3 and Webhook actions support batching:
- Item count bound: Default 100, min 1, max 10000
- Time bound (seconds): Default 5, min 1, max 300
Sends when either bound is reached first. S3 batches over 5MB are multipart-uploaded.

### Webhooks

Webhooks integrate with external servers; configure an endpoint and optional custom headers.

#### Webhook retries

- Up to four retries with configurable interval (paid tiers only).
- 2XX: no retry.
- 301: follows up to three redirects.
- Other statuses retried per policy.

Webhook retries
Webhook retries aren't available for Events & Actions Free tier customers.

#### Webhook payload

PresenceChannel Active Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.channel.state.active?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE",  
      "channel": "CHANNEL-NAME"  
    }  
  ]  
}  
`
```

PresenceChannel Inactive Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.channel.state.inactive?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE",  
      "channel": "CHANNEL-NAME"  
    }  
  ]  
}  
`
```

PresencePresence Join Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.user.channel.joined?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "userId": "5934fbc6-bf06b3c3b365",  
      "occupancy": 3,  
      "data": {},  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE"  
    }  
  ]  
}  
`
```

PresencePresence Leave Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.user.channel.left?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "userId": "5934fbc6-bf06b3c3b365",  
      "occupancy": 3,  
      "data": {},  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE"  
    }  
  ]  
}  
`
```

PresencePresence Timeout Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.user.timedout.in.channel?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "userId": "5934fbc6-bf06b3c3b365",  
      "occupancy": 3,  
      "data": {},  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE"  
    }  
  ]  
}  
`
```

PresencePresence State Change Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.channel.user.state.in.changed?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "userId": "5934fbc6-bf06b3c3b365",  
      "occupancy": 3,  
      "data": {},  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE"  
    }  
  ]  
}  
`
```

PresencePresence Interval Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "occupancy": "3",  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE",  
      "usersJoined": [  
        "id-1",  
        "id-2"  
      ],  
      "usersLeft": [  
        "id-1",  
`
```

Mobile Push NotificationsPush Error Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/push.message.sending.failed?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "channel": "CHANNEL-NAME",  
      "devices": "",  
      "platform": "APNS",  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "state": "error",  
      "subKey": "SUBKEY-HERE",  
      "payload": "ERROR MESSAGE"  
    }  
  ]  
}  
`
```

Mobile Push NotificationsPush Device Removed Webhook
```
`{  
  "schema": "pubnub.com/schemas/events/push.device.removed?v=1.0.0",  
  "data": [  
    {  
      "id": "1d558c0f-78d8-576a47bb0658",  
      "action": "\${feedback|remove|update}",  
      "device": "",  
      "platform": "APNS",  
      "timestamp": "1992-01-01T10:00:20.021Z",  
      "subKey": "SUBKEY-HERE"  
    }  
  ]  
}  
`
```

For legacy webhook payloads and migration, see migration guide.

### Amazon SQS

Supports sending to Amazon SQS with up to four retries and optional extra metadata on retries. Configure communication first (Create SQS action).

### Amazon Kinesis

Supports sending to Amazon Kinesis with up to four retries and optional extra metadata on retries. Configure communication first (Create Kinesis action).

### Amazon S3

Supports uploading to Amazon S3 (batching recommended to reduce PUT costs). Configure communication first (Create S3 action).

### Apache Kafka

Supports exporting events to Apache Kafka. Configure first (Create Kafka action).

### IFTTT webhook

Supports exporting events to IFTTT. Configure first (Create IFTTT action).

### AMQP

Supports exporting events to AMQP. Configure first (Create AMQP action).
Last updated on Jul 15, 2025

---

## Configure eanda

Source: https://www.pubnub.com/docs/serverless/events-and-actions/configure-e&a

# Configure Events & Actions

Use the Admin Portal to create, edit, delete event listeners and actions.

### Event listeners

View count, type, status, and linked actions. Hover to see linked action names. See create event listeners.

### Actions

View count, type, status, and linked listeners. Hover to see linked listener names. See create actions.

## Create event listener

- Open Admin Portal > Events & Actions.
- Select your app and keyset.
- Click + Add Event Listener and select the event source; choose producer and event type.
  - If your event type isn’t shown, choose a different source.
- Select a filter type: No filter, Basic filters, or Advanced JSONPath.
- Optionally attach an existing action via Add Action.
- Click Save Changes.

### Filter types

- No filter: triggers for all messages.
- Basic filters: select Filters (Channel, Sender ID), Conditions (Exact Match, Contains), and provide Value.
- Advanced JSONPath: define conditions over:
  - channel (string), message (any), meta (any), uuid (string; Sender ID).
  - Example to match channel “Matrix”: $.[?(@.channel == "Matrix")]

User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and server responses but holds the value of the userId parameter you set during initialization.

## Create action

Choose an action category and follow its configuration:
- Webhook
- Amazon SQS
- Amazon Kinesis
- Amazon S3
- Apache Kafka
- IFTTT Webhook
- AMQP Action

## Webhook payload example

Triggered when message "Wake up, Neo..." is sent by Client-w5h0y on channel Matrix.

User ID / UUID
User ID is also referred to as UUID/uuid in some APIs and server responses but holds the value of the userId parameter you set during initialization.

```
`{  
  "event": {  
    "channel": "Matrix",  
    "eventCategory": "message",  
    "eventType": "message.publish",  
    "eventId": "a2748829-a16e-4ce7-b3ed-67021d2c7c65",  
    "eventPayload": {  
      "message": "{\"text\":\"Wake up, Neo...\"}",  
      "meta": {}  
    },  
    "iso8601timestamp": "2023-11-28T12:31:32Z",  
    "subscribeKey": "sub-c-95c7895c-b977-4728-bebe-f2e5db1b4f90",  
    "timetoken": "17011746925168240",  
    "senderId": "Client-w5h0y"  
  },  
`
```

For more information about webhook payloads, refer to Webhooks.
Last updated on Jul 15, 2025

---

## Create webhook action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-webhook-action

# Create webhook action

Logs from Functions
You can use the Webhook action to export logs from your Functions. Read the docs.

- In Admin Portal > Events & Actions, click + Add Action.
- Select Webhook as the action type.
- Enter the Webhook URL under Configuration.
- Optional: add custom headers; assign secret keys.
- Optional: enable/configure Batching.
- Optional: enable/configure retries (Webhook retry).
- Optional: pair with an event listener (Add event listener) or create a new one.
- Save changes.

Webhook payloads
See Webhook payloads.
Last updated on Feb 18, 2025

---

## Create sqs action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-sqs-action

# Create SQS action

Configure AWS first: create an Amazon SQS queue and an IAM role. Then configure in Admin Portal.

Use Terraform
```
`resource "aws_sqs_queue" "pubnub_queue" {  
  name       = "pubnub-example"  
  fifo_queue = false  
}  
  
  
data "aws_iam_policy_document" "pubnub_sqs_role" {  
  statement {  
    actions = ["sts:AssumeRole"]  
  
    principals {  
      type        = "AWS"  
      identifiers = ["arn:aws:iam::535363102202:root"]  
    }  
  
`
```

## Create a queue

- Open Amazon SQS > Queues.
- Click Create queue; name it.

Supported queue type
Events & Actions only supports the standard queue type.

- Click Create queue to save.
- Copy the queue URL (URL field) for later.

## Create an IAM role

Create an IAM role with write permissions to SQS.

- Open AWS IAM > Roles > Create role.
- Trusted entity type: AWS account.
- Another AWS account: Account ID 535363102202 (PubNub) to allow PubNub to assume the role.
- Options: Require external ID; paste your app’s subscribe key from Admin Portal.

Access policy example:
```
`{  
    "Version": "2012-10-17",  
    "Statement": [  
        {  
            "Effect": "Allow",  
            "Principal": {  
                "AWS": "arn:aws:iam::535363102202:root"  
            },  
            "Action": "sts:AssumeRole",  
            "Condition": {  
                "StringEquals": {  
                    "sts:ExternalId": ""  
                }  
            }  
        }  
`
```

- Next: create a permissions policy granting sqs:SendMessage to your queue ARN.

```
`{  
    "Statement": [  
        {  
            "Action": [  
                "sqs:SendMessage"  
            ],  
            "Effect": "Allow",  
            "Resource": ""  
        }  
    ],  
    "Version": "2012-10-17"  
}  
`
```

- Finish wizard; name the role; create role.
- Copy the role ARN for later.

## Configure Admin Portal

- In Admin Portal > Events & Actions, click + Add Action.
- Select Amazon SQS.
- Paste Queue URL and Role ARN.
- Optional: enable/configure retries (SQS retry).
- Optional: pair with an event listener.
- Save changes.

Last updated on May 28, 2024

---

## Create s3 action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-s3-action

# Create S3 action

Logs from Functions
You can use the S3 action to export logs from your Functions. Read the docs.

Configure AWS first: create an Amazon S3 bucket and an IAM role. Then configure in Admin Portal.

Use Terraform
```
`resource "random_string" "random" {  
  length = 8  
  upper = false  
  special = false  
}  
resource "aws_s3_bucket" "pubnub_s3" {  
  bucket = "pubnub-s3-example-${random_string.random.result}"  
  tags = {  
    PubNub        = "Example"  
  }  
}  
data "aws_iam_policy_document" "pubnub_s3_role" {  
  statement {  
    actions = ["sts:AssumeRole"]  
    principals {  
`
```

## Create a bucket

- Open Amazon S3 > Buckets > Create bucket; name and choose region.
- Configure desired settings; Create bucket.
- Copy bucket name and region.

## Create an IAM role

Create an IAM role with write permissions to S3.

- Open AWS IAM > Roles > Create role.
- Trusted entity type: AWS account.
- Another AWS account: Account ID 535363102202 (PubNub).
- Require external ID: paste your subscribe key (recommended).

Access policy example:
```
`{  
    "Version": "2012-10-17",  
    "Statement": [  
        {  
            "Effect": "Allow",  
            "Principal": {  
                "AWS": "arn:aws:iam::535363102202:root"  
            },  
            "Action": "sts:AssumeRole",  
            "Condition": {  
                "StringEquals": {  
                    "sts:ExternalId": ""  
                }  
            }  
        }  
`
```

- Permissions policy: allow s3:PutObject to your bucket ARN.

```
`{  
    "Statement": [  
        {  
            "Action": [  
                "s3:PutObject"  
            ],  
            "Effect": "Allow",  
            "Resource": ""  
            // Follow these guidelines for the correct Amazon Resource Name (ARN) pattern:  
            // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html  
        }  
    ],  
    "Version": "2012-10-17"  
}  
`
```

- Finish wizard; name role; create; copy role ARN.

## Configure Admin Portal

- In Admin Portal > Events & Actions, click + Add Action.
- Select Amazon S3.
- Enter Bucket Name and Role ARN; select Region.
- Optional: enable/configure Batching.
- Optional: enable/configure retries (AWS S3 retry).
- Optional: add Object key prefix.
- Optional: pair with an event listener.
- Save changes.

Last updated on Feb 13, 2025

---

## Create kafka action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-kafka-action

# Create Kafka action

You can connect to any Kafka instance (self-hosted, MSK, Confluent Cloud) as long as you configure the action properly.

Receive Kafka events in PubNub
See PubNub Kafka Sink Connector.

## Existing Kafka cluster

Have:
- Topic and key
- Broker URL and port
- Username and password

Then configure in Admin Portal.

## New Kafka cluster

Kafka action is technology-agnostic. Create a cluster by your preferred method:

- Self-hosted Kafka: follow Kafka Quick Start. Gather topic/key, broker URL/port, username/password.
- Amazon MSK via Terraform: gather the same parameters.
- Confluent Cloud:

Configure a Kafka cluster
- Log in to Confluent Cloud; create a cluster.
- After launch, note Bootstrap server.

Create a Kafka topic
- Create topic; note its name.

Create API key
- Create API key in Confluent Cloud.

Secret visibility
Do not click Download and continue until you’ve recorded the Secret.

Note Key and Secret; then download to finish.

## Configure Admin Portal

- In Admin Portal > Events & Actions, click + Add Action.
- Select Apache Kafka.
- Routing Key: topic or topic:key (e.g., topic_0 or topic_0:stamford).

Key and message order
Kafka guarantees order only within a partition. Adding a key directs messages to the same partition to preserve order.

- Authentication Mechanism: SASL/PLAIN, SCRAM-SHA-256, or SCRAM-SHA-512.
- Username: your Kafka username (Confluent: Key).
- Unsecured connections
PubNub doesn't allow unsecured connections to Kafka.
- Password: Kafka password (Confluent: Secret).
- Brokers: hostname:port (or list: hostname:port, hostname2:port) (Confluent: Bootstrap server).
- Optional: enable/configure retries (Kafka retry).
- Optional: pair with an event listener.
- Save changes.

Last updated on May 28, 2024

---

## Create ifttt action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-ifttt-action

# Create IFTTT action

Send PubNub events to IFTTT to trigger applets and automate actions between services/devices (for example, proxy to Slack).

Steps:
- Configure an IFTTT webhook trigger based on PubNub events.
- Create an IFTTT action to pass events to a chosen service.
- Create a PubNub action (Events & Actions) that triggers the IFTTT webhook.
- Add a PubNub event listener as the event source for the PubNub action.

## Create an IFTTT account

https://ifttt.com/ > Sign up.

## Prepare your IFTTT environment

Follow these steps to set up an applet with a webhook:
1. $1
2. $1
3. $1
4. $1
5. $1
6. $1
7. $1
8. $1
9. $1
10. $1

## Find your IFTTT webhook key

Go to https://ifttt.com/maker_webhooks > Documentation. Note your webhook key.

## Configure Admin Portal

- In Admin Portal > Events & Actions, click + Add Action.
- Select Webhook IFTTT.
- Event Name: enter the IFTTT webhook event name.
- IFTTT Webhook key: enter your webhook key (e.g., c-6oz3G_IPCjb6mGqTpz1d).
- Optional: enable/configure retries (Webhook IFTTT retry).
- Optional: add HTTP headers.
- Optional: pair with an event listener.
- Save changes.

Last updated on May 28, 2024

---

## Create amqp action

Source: https://www.pubnub.com/docs/serverless/events-and-actions/actions/create-amqp-action

# Create AMQP action

Send PubNub data into AMQP (e.g., RabbitMQ/CloudAMQP). Any hosting is fine if the action is configured properly.

## Existing AMQP environment

Have:
- Full AMQPS URL with TLS, credentials, and Vhost
- Routing key
- (Optional) Exchange name

Then configure in Admin Portal.

## New AMQP environment

Set up a broker (RabbitMQ or CloudAMQP), secure with TLS, get credentials and Vhost.

RabbitMQ
- Follow RabbitMQ docs; collect URL, routing key, optional exchange.

CloudAMQP
- Follow CloudAMQP docs; collect URL, routing key, optional exchange.

## Configure Admin Portal

- In Admin Portal > Events & Actions, click + Add Action.
- Select Advanced Message Queuing Protocol (AMQP).
- URL: amqps://username:password@hostname/vhost (e.g., amqps://user123:pass456@bunny.cloudamqp.com/myvhost).
- Routing key: e.g., logs.warning.
- Optional: Persistent toggle for broker-disk persistence.
- Optional: retries (AMQP retry).
- Optional: Exchange name (RabbitMQ).
- Optional: TTL (min) to override default queue TTL.
- Optional: pair with an event listener.
- Save changes.

Last updated on Feb 17, 2025

---

## Ena payloads

Source: https://www.pubnub.com/docs/serverless/events-and-actions/ena-payloads

# Events & Actions Payloads

Each event’s payload differs by type and whether E&A metadata envelope is included.

Envelopes
See Envelope section for metadata details.

Payloads are grouped by source, producer, and event type.

## Messages

### Pub/sub

#### Message sent

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
    "data": [  
        {  
            "timestamp": "2025-06-05T12:53:15.888Z",  
            "message": "Message Test",  
            "meta": null,  
            "senderId": "Jack-device",  
            "channel": "Channel-Barcelona",  
            "timetoken": "17491279958880737"  
        }  
    ]  
}  
`
```

```
`{  
    "event": {  
        "channel": "my_channel",  
        "eventCategory": "message",  
        "eventType": "message.publish",  
        "eventId": "83e0bdc8-8a00-4831-9727-38439a307484",  
        "eventPayload": {  
            "message": "dfg",  
            "meta": null  
        },  
        "iso8601timestamp": "2025-05-27T07:40:38Z",  
        "subscribeKey": "sub-c-12b1e1ad-5648-4c98-9e34-7ef0e6371ccd",  
        "timetoken": "17483316384504473",  
        "senderId": "elon"  
    },  
`
```

```
`{  
    "event": {  
        "id": "d277cff8-b1b1-476f-a890-b661555ac4f8",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
            "data": [  
                {  
                    "timestamp": "2025-05-27T07:40:49.171Z",  
                    "message": "dfg",  
                    "meta": null,  
                    "senderId": "elon",  
                    "timetoken": "17483316491714954"  
                }  
            ]  
        }  
`
```

```
`{  
    "event": {  
        "id": "55ca7f0b-145b-428f-80f7-35f55fd3669d",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
            "data": [  
                {  
                    "timestamp": "2025-05-27T07:41:00.266Z",  
                    "message": "dfg",  
                    "meta": null,  
                    "senderId": "elon",  
                    "channel": "my_channel",  
                    "timetoken": "17483316602665639"  
                }  
            ]  
`
```

### Message Actions

#### Message action created

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
    "data": [  
        {  
            "timestamp": "2025-06-05T13:23:06.404Z",  
            "message": "Test Message",  
            "meta": null,  
            "senderId": "Test Message Actions User",  
            "timetoken": "17491297864048155"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "50354a63-8ba3-42b2-93e1-d1bbc17d93a1",  
        "timestamp": "2025-06-16T11:29:21Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/messages.action.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "50354a63-8ba3-42b2-93e1-d1bbc17d93a1",  
                    "channel": "channel1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17500733512701872",  
                    "timestamp": "2025-06-16T11:29:21.037191Z",  
                    "type": "1",  
`
```

```
`{  
    "event": {  
        "id": "a0a633d9-3b09-4757-984a-91f1c5f38332",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.action.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "a0a633d9-3b09-4757-984a-91f1c5f38332",  
                    "channel": "channel1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17500733512701872",  
                    "timestamp": "2025-06-16T11:33:28.252328Z",  
                    "type": "3",  
                    "value": "3",  
                    "userId": "User1"  
`
```

```
`{  
    "event": {  
        "id": "22729eda-a3ec-4b5e-bddc-f6b4d5b42113",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.action.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "22729eda-a3ec-4b5e-bddc-f6b4d5b42113",  
                    "channel": "channel1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17500733512701872",  
                    "timestamp": "2025-06-16T12:02:30.119432Z",  
                    "type": "4",  
                    "value": "4",  
                    "userId": "User1"  
`
```

#### Message action deleted

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/messages.action.deleted?v=1.0.0",  
    "data": [  
        {  
            "id": "580022c7-a3df-4fc2-aa00-556813236ec4",  
            "channel": "test_channel_1",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "messageTimetoken": "17491299520205486",  
            "timestamp": "2025-06-05T13:31:38.148778Z",  
            "type": "Reaction",  
            "value": "true",  
            "userId": "Test Message Actions User"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "5807c304-43e6-4789-89e0-d3766d68378d",  
        "timestamp": "2025-06-05T13:28:05Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/messages.action.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "5807c304-43e6-4789-89e0-d3766d68378d",  
                    "channel": "test_channel_1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17491299520205486",  
                    "timestamp": "2025-06-05T13:28:05.412802Z",  
                    "type": "Reaction",  
`
```

```
`{  
    "event": {  
        "id": "63a49207-e963-4802-b42b-389aa529ace5",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.action.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "63a49207-e963-4802-b42b-389aa529ace5",  
                    "channel": "test_channel_1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17491299520205486",  
                    "timestamp": "2025-06-05T13:29:12.523015Z",  
                    "type": "Reaction1",  
                    "value": "true",  
                    "userId": "Test Message Actions User"  
`
```

```
`{  
    "event": {  
        "id": "2a8f72af-6453-409d-8bfe-546a2add2597",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.action.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "2a8f72af-6453-409d-8bfe-546a2add2597",  
                    "channel": "test_channel_1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "messageTimetoken": "17491299520205486",  
                    "timestamp": "2025-06-05T13:30:09.399706Z",  
                    "type": "Reaction1",  
                    "value": "true",  
                    "userId": "Test Message Actions User"  
`
```

### Files

#### File sent

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
    "data": [  
        {  
            "channel": "file-transfer-demo"  
            "fileId": "3ec34dbc-3b6f-443f-8991-427a327abd7e",  
            "fileName": "testfile1.txt",  
            "message": {  
                "example": "message"  
            },  
            "meta": null,  
            "senderId": "Test Files User",  
            "timestamp": "2025-06-05T13:18:17.665Z",  
            "timetoken": "17491294976652491"  
        }  
`
```

```
`{  
    "event": {  
        "channel": "file-transfer-demo",  
        "eventCategory": "message",  
        "eventType": "message.publish",  
        "eventId": "21c70465-d9ae-4441-b892-cfe1843e9ad2",  
        "eventPayload": {  
            "fileId": "3ec34dbc-3b6f-443f-8991-427a327abd7e",  
            "fileName": "testfile1.txt",  
            "message": {  
                "example": "message"  
            },  
            "meta": null  
        },  
        "iso8601timestamp": "2025-06-05T13:17:12Z",  
`
```

```
`{  
    "event": {  
        "id": "7e79fdd7-4b65-4486-b893-017b37e2f179",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
            "data": [  
                {  
                    "fileId": "3ec34dbc-3b6f-443f-8991-427a327abd7e",  
                    "fileName": "testfile1.txt",  
                    "message": {  
                        "example": "message"  
                    },  
                    "meta": null,  
                    "senderId": "Test Files User",  
                    "timestamp": "2025-06-05T13:18:17.665Z",  
`
```

```
`{  
    "event": {  
        "id": "31a61371-8d6d-432c-bf70-3bd348c6a3eb",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/messages.pubsub.publish?v=1.0.0",  
            "data": [  
                {  
                    "channel": "file-transfer-demo",  
                    "fileId": "3ec34dbc-3b6f-443f-8991-427a327abd7e",  
                    "fileName": "testfile1.txt",  
                    "message": {  
                        "example": "message"  
                    },  
                    "meta": null,  
                    "senderId": "Test Files User",  
`
```

## Users

### Presence

#### User state changed in channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/presence.channel.user.state.in.changed?v=1.0.0",  
    "data": [  
        {  
            "id": "889e9b63-0d4d-4d3c-808d-b226f5dc6504",  
            "channel": "Channel-Barcelona",  
            "userId": "Jack-device",  
            "data": {  
                "action": "state-change",  
                "uuid": "Jack-device",  
                "timestamp": "1749128108",  
                "precise_timestamp": "1749128108494",  
                "data": "{\"state\":\"test-state\"}",  
                "occupancy": "0"  
            },  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "203d20ca-c99b-41a8-bda2-f45c857c6035",  
        "timestamp": "2025-06-05T12:57:57Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.user.state.in.changed?v=1.0.0",  
            "data": [  
                {  
                    "id": "203d20ca-c99b-41a8-bda2-f45c857c6035",  
                    "channel": "asd",  
                    "userId": "asd",  
                    "data": {  
                        "action": "state-change",  
                        "uuid": "asd",  
`
```

```
`{  
    "event": {  
        "id": "5392032a-9db5-4047-9f86-2f98679ad73f",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.user.state.in.changed?v=1.0.0",  
            "data": [  
                {  
                    "id": "5392032a-9db5-4047-9f86-2f98679ad73f",  
                    "channel": "asd",  
                    "userId": "asd",  
                    "data": {  
                        "action": "state-change",  
                        "uuid": "asd",  
                        "timestamp": "1749128327",  
                        "precise_timestamp": "1749128327604",  
`
```

```
`{  
    "event": {  
        "id": "cc464354-7357-4113-9bba-2e0d7fafdc31",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.user.state.in.changed?v=1.0.0",  
            "data": [  
                {  
                    "id": "cc464354-7357-4113-9bba-2e0d7fafdc31",  
                    "channel": "asd",  
                    "userId": "asd",  
                    "data": {  
                        "action": "state-change",  
                        "uuid": "asd",  
                        "timestamp": "1749128351",  
                        "precise_timestamp": "1749128351906",  
`
```

### CRUD

#### User created

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "8493d90b-e8b9-45af-83ba-c0e0ee97cf7d",  
        "timestamp": "2025-06-05T13:13:53Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "8493d90b-e8b9-45af-83ba-c0e0ee97cf7d",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:13:53.210517866Z",  
                    "eTag": "b56e86ea3f6742950553768b9816adc2",  
                    "userId": "User_id4",  
                    "name": "User Name4",  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "8de8f5e1-ee4b-4439-a095-5326ad504e60",  
        "timestamp": "2025-06-05T13:14:41Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "8de8f5e1-ee4b-4439-a095-5326ad504e60",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:14:41.797913182Z",  
                    "eTag": "a9fa9a3db8cd88d66e68d94f043b638c",  
                    "userId": "User_id5",  
                    "name": "User Name5",  
`
```

```
`{  
    "event": {  
        "id": "d2fed5e9-d1d0-45e3-b031-420dd5939d3c",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "d2fed5e9-d1d0-45e3-b031-420dd5939d3c",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:12:36.181052533Z",  
                    "eTag": "97553458609bcdd58c05936d913a6511",  
                    "userId": "User_id2",  
                    "name": "User Name2",  
                    "email": "",  
                    "profileUrl": "",  
`
```

```
`{  
    "event": {  
        "id": "9dc756ca-0be4-4c82-bc46-84e1a08782fb",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "9dc756ca-0be4-4c82-bc46-84e1a08782fb",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:11:54.517788662Z",  
                    "eTag": "520565d0095710aaac47b437a0b51c4f",  
                    "userId": "User_id",  
                    "name": "User Name",  
                    "email": "",  
                    "profileUrl": "",  
`
```

#### User updated

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/user.updated?v=1.0.0",  
    "data": [  
        {  
            "id": "7044631a-f86e-4df3-9303-9bb490f4b64f",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-05T13:35:14.735278571Z",  
            "eTag": "87e4956864cd39abe4ceaea8a22f375b",  
            "userId": "User_id",  
            "fields": {  
                "name": "User Name Updated"  
            }  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "bf4c7a01-c77f-45a8-93fc-d6e4837eb8b1",  
        "timestamp": "2025-06-05T13:35:45Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/user.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "bf4c7a01-c77f-45a8-93fc-d6e4837eb8b1",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:35:45.087128767Z",  
                    "eTag": "ce75db33843d362991fd1629e8652e03",  
                    "userId": "User_id",  
                    "fields": {  
`
```

```
`{  
    "event": {  
        "id": "06db7d99-d98f-42b9-85a4-59f7f05d8c61",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "06db7d99-d98f-42b9-85a4-59f7f05d8c61",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:36:13.817245178Z",  
                    "eTag": "1e985155342411beb59eaaae686a6eec",  
                    "userId": "User_id",  
                    "fields": {  
                        "name": "User Name Updated3"  
                    }  
`
```

```
`{  
    "event": {  
        "id": "e8192dd3-46e3-4a9c-b692-e215c84d34d6",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "e8192dd3-46e3-4a9c-b692-e215c84d34d6",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-05T13:36:46.736997633Z",  
                    "eTag": "26efb626b1c06dd7d8aec7bcab808986",  
                    "userId": "User_id",  
                    "fields": {  
                        "name": "User Name Updated4"  
                    }  
`
```

#### User deleted

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/user.deleted?v=1.0.0",  
    "data": [  
        {  
            "id": "df0cdbe6-7505-49e2-9a24-9307174b1d38",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:09:16.475127588Z",  
            "userId": "User_id6"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "032a2109-bff4-4b61-b228-78d7a52c6761",  
        "timestamp": "2025-06-16T11:29:46Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "032a2109-bff4-4b61-b228-78d7a52c6761",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:29:46.281535176Z",  
                    "eTag": "a2668f823762f97bb0ed2b68b3a4ae4a",  
                    "userId": "User_id7",  
                    "name": "User_id7",  
`
```

```
`{  
    "event": {  
        "id": "29d404cc-e1e6-4764-b7a2-99dc4f056df2",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "29d404cc-e1e6-4764-b7a2-99dc4f056df2",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:33:54.887399958Z",  
                    "eTag": "fa2caf5fcf438b8afa3f6a9bd6edb4b7",  
                    "userId": "User_id8",  
                    "name": "User_id8",  
                    "email": "",  
                    "profileUrl": "",  
`
```

```
`{  
    "event": {  
        "id": "4a8fc29b-9e39-4516-baba-30c88993b0e3",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/user.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "4a8fc29b-9e39-4516-baba-30c88993b0e3",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:02:48.420320848Z",  
                    "userId": "User_id8"  
                }  
            ]  
        }  
    },  
`
```

## Channels

### CRUD

#### Channel created

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/channel.created?v=1.0.0",  
    "data": [  
        {  
            "id": "e2467259-b0f0-4e64-ac9f-b9a44cd8a7c4",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:10:24.844778615Z",  
            "eTag": "1e5c41f43cca3f3643524175268cddf6",  
            "channelId": "channel_1",  
            "name": "channel_1",  
            "description": "",  
            "type": "",  
            "status": ""  
        }  
    ]  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "9e8ce6af-f750-4aa5-ba15-b4e26bd5c4a9",  
        "timestamp": "2025-06-16T11:30:11Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/channel.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "9e8ce6af-f750-4aa5-ba15-b4e26bd5c4a9",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:30:11.412327865Z",  
                    "eTag": "dbe1b43a5159bcf3b931a7449042152f",  
                    "channelId": "channel_3",  
                    "name": "channel_3",  
`
```

```
`{  
    "event": {  
        "id": "551aa75c-7f4e-415c-8e40-1a401bc64deb",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "551aa75c-7f4e-415c-8e40-1a401bc64deb",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:34:19.003868780Z",  
                    "eTag": "1d44649f447d6a30fccd98790bb6ee9d",  
                    "channelId": "channel_4",  
                    "name": "channel_4",  
                    "description": "",  
                    "type": "",  
`
```

```
`{  
    "event": {  
        "id": "9ef4e9ae-7937-4ab9-adab-4902bafc84d9",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "9ef4e9ae-7937-4ab9-adab-4902bafc84d9",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:03:18.711236330Z",  
                    "eTag": "7422fe5544f74f16cdbdc1e1849c8f7b",  
                    "channelId": "channel_5",  
                    "name": "channel_5",  
                    "description": "",  
                    "type": "",  
`
```

#### Channel updated

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/channel.updated?v=1.0.0",  
    "data": [  
        {  
            "id": "7ca8f612-ca63-406e-add3-4510bf55558b",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:11:03.439309673Z",  
            "eTag": "eab2bd4c72aadf93e06d9d9084668e6a",  
            "channelId": "channel_1",  
            "fields": {  
                "space": "channel_12"  
            }  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "12a077bf-b0a2-459d-8e1d-dfa8a5cb5d61",  
        "timestamp": "2025-06-16T11:30:28Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/channel.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "12a077bf-b0a2-459d-8e1d-dfa8a5cb5d61",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:30:28.613146058Z",  
                    "eTag": "29055e7eb043ae5cb547ee755a2f683a",  
                    "channelId": "channel_3",  
                    "fields": {  
`
```

```
`{  
    "event": {  
        "id": "01baa313-b05f-412d-868a-1927d14fbe4e",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "01baa313-b05f-412d-868a-1927d14fbe4e",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:34:32.051428509Z",  
                    "eTag": "a683ee7c08293f69432c83edf9540d66",  
                    "channelId": "channel_4",  
                    "fields": {  
                        "space": "channel_41"  
                    }  
`
```

```
`{  
    "event": {  
        "id": "ca5ba27a-1e44-4268-a839-d46dd71cb9fe",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "ca5ba27a-1e44-4268-a839-d46dd71cb9fe",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:03:38.758837834Z",  
                    "eTag": "a359f2085975452ff88676fa15fc40a4",  
                    "channelId": "channel_5",  
                    "fields": {  
                        "space": "channel_51"  
                    }  
`
```

#### Channel deleted

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/channel.deleted?v=1.0.0",  
    "data": [  
        {  
            "id": "63982247-db79-43b9-bf3a-39e647f23292",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:11:15.215130220Z",  
            "channelId": "channel_1"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "114cebca-ad70-4a15-97f6-2195db539d9c",  
        "timestamp": "2025-06-16T11:30:45Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/channel.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "114cebca-ad70-4a15-97f6-2195db539d9c",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:30:45.260591240Z",  
                    "channelId": "channel_3"  
                }  
            ]  
`
```

```
`{  
    "event": {  
        "id": "acfc66ac-5863-4445-807b-8f1836208060",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "acfc66ac-5863-4445-807b-8f1836208060",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:34:44.451194387Z",  
                    "channelId": "channel_4"  
                }  
            ]  
        }  
    },  
`
```

```
`{  
    "event": {  
        "id": "52b3ac61-75c8-4dab-8d6e-5196840dff37",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/channel.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "52b3ac61-75c8-4dab-8d6e-5196840dff37",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:03:50.391162543Z",  
                    "channelId": "123"  
                }  
            ]  
        }  
    },  
`
```

### Presence

#### First user subscribed to channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.channel.state.active?v=1.0.0",  
    "data": [  
        {  
            "id": "0dc3f00a-06d2-4849-b511-ea9e1817c461",  
            "timestamp": "2025-06-16T09:11:26.809Z",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "channel": "Channel-Barcelona"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "bcbd8352-1f3b-49e8-9f0c-cbf30870fced",  
        "timestamp": "2025-06-16T09:53:39Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.channel.state.active?v=1.0.0",  
            "data": [  
                {  
                    "id": "bcbd8352-1f3b-49e8-9f0c-cbf30870fced",  
                    "timestamp": "2025-06-16T09:53:39.715Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
`
```

```
`{  
    "event": {  
        "id": "b558dab1-8d24-425a-b6a8-7f17c0f595b6",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.channel.state.active?v=1.0.0",  
            "data": [  
                {  
                    "id": "b558dab1-8d24-425a-b6a8-7f17c0f595b6",  
                    "timestamp": "2025-06-16T11:35:00.205Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
        }  
    },  
`
```

```
`{  
    "event": {  
        "id": "1b071b4a-245b-493e-9c45-516b94a3f647",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.channel.state.active?v=1.0.0",  
            "data": [  
                {  
                    "id": "1b071b4a-245b-493e-9c45-516b94a3f647",  
                    "timestamp": "2025-06-16T12:04:27.220Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
        }  
    },  
`
```

#### Last user left channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "event": {  
        "id": "a4cd34f6-afb2-4399-84cc-eaffa9dfc481",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.state.inactive?v=1.0.0",  
            "data": [  
                {  
                    "id": "a4cd34f6-afb2-4399-84cc-eaffa9dfc481",  
                    "timestamp": "2025-06-16T10:52:49.629Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
        }  
    },  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "0f0a270d-a86c-4186-b7ed-e41f9fcd95a5",  
        "timestamp": "2025-06-16T09:55:00Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.state.inactive?v=1.0.0",  
            "data": [  
                {  
                    "id": "0f0a270d-a86c-4186-b7ed-e41f9fcd95a5",  
                    "timestamp": "2025-06-16T09:55:00.104Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
`
```

```
`{  
    "event": {  
        "id": "ed33c79d-dfc1-43a7-9e34-0c1a9cc8089d",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.state.inactive?v=1.0.00",  
            "data": [  
                {  
                    "id": "ed33c79d-dfc1-43a7-9e34-0c1a9cc8089d",  
                    "timestamp": "2025-06-16T11:40:00.420Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
        }  
    },  
`
```

```
`{  
    "event": {  
        "id": "bd688fba-d66e-4900-b3ae-902db0c092e0",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.state.inactive?v=1.0.0",  
            "data": [  
                {  
                    "id": "bd688fba-d66e-4900-b3ae-902db0c092e0",  
                    "timestamp": "2025-06-16T12:09:27.254Z",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "channel": "Channel-Barcelona"  
                }  
            ]  
        }  
    },  
`
```

#### User started subscription to channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/presence.user.channel.joined?v=1.0.0",  
    "data": [  
        {  
            "id": "a36773df-d828-4d40-99ab-26b8ebe46e41",  
            "channel": "Channel-Barcelona",  
            "userId": "Jack-device",  
            "occupancy": 2,  
            "data": {  
                "occupancy": "2",  
                "action": "join",  
                "timestamp": "1750065086",  
                "precise_timestamp": "1750065086809",  
                "uuid": "Jack-device"  
            },  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "9165aa63-9211-4ba0-939c-762b69474409",  
        "timestamp": "2025-06-16T09:53:39Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.user.channel.joined?v=1.0.0",  
            "data": [  
                {  
                    "id": "9165aa63-9211-4ba0-939c-762b69474409",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Amanda-device",  
                    "occupancy": 2,  
                    "data": {  
                        "action": "join",  
`
```

```
`{  
    "event": {  
        "id": "3385d6fa-3e3a-4ad9-8b85-64468adc9a78",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.user.channel.joined?v=1.0.0",  
            "data": [  
                {  
                    "id": "3385d6fa-3e3a-4ad9-8b85-64468adc9a78",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Jack-device",  
                    "occupancy": 1,  
                    "data": {  
                        "action": "join",  
                        "timestamp": "1750073700",  
                        "precise_timestamp": "1750073700205",  
`
```

```
`{  
    "event": {  
        "id": "a9726eba-b514-472b-a6a7-13cbe06a1975",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.user.channel.joined?v=1.0.0",  
            "data": [  
                {  
                    "id": "a9726eba-b514-472b-a6a7-13cbe06a1975",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Jack-device",  
                    "occupancy": 1,  
                    "data": {  
                        "timestamp": "1750075467",  
                        "occupancy": "1",  
                        "action": "join",  
`
```

#### User stopped subscription to channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.user.channel.left?v=1.0.0",  
    "data": [  
        {  
            "id": "2cf3a1cb-6039-4745-a2e0-7c0b40051bb4",  
            "channel": "Channel-Barcelona",  
            "userId": "Amanda-device",  
            "occupancy": 1,  
            "data": {  
                "uuid": "Amanda-device",  
                "precise_timestamp": "1750065124663",  
                "timestamp": "1750065124",  
                "occupancy": "1",  
                "action": "leave"  
            },  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "6bab3d0e-e920-45a0-b960-3c8d1c642ec0",  
        "timestamp": "2025-06-16T09:54:50Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.user.channel.left?v=1.0.0",  
            "data": [  
                {  
                    "id": "6bab3d0e-e920-45a0-b960-3c8d1c642ec0",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Amanda-device",  
                    "occupancy": 5,  
                    "data": {  
                        "occupancy": "5",  
`
```

```
`{  
    "event": {  
        "id": "1be3c8a7-c607-428b-9b77-06fb23dccddb",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.user.channel.left?v=1.0.0",  
            "data": [  
                {  
                    "id": "1be3c8a7-c607-428b-9b77-06fb23dccddb",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Jack-device",  
                    "data": {  
                        "uuid": "Jack-device",  
                        "timestamp": "1750073720",  
                        "precise_timestamp": "1750073720101",  
                        "occupancy": "0",  
`
```

```
`{  
    "event": {  
        "id": "0d5055b9-d0c4-4cc3-b007-9e5142607623",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/pubnub.com/schemas/events/presence.user.channel.left?v=1.0.0",  
            "data": [  
                {  
                    "id": "0d5055b9-d0c4-4cc3-b007-9e5142607623",  
                    "channel": "Channel-Barcelona",  
                    "userId": "Jack-device",  
                    "data": {  
                        "action": "leave",  
                        "timestamp": "1750075493",  
                        "occupancy": "0",  
                        "uuid": "Jack-device",  
`
```

#### User timed out while subscribing to channel

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "channelId": "meeting-9xs243ia-attendees",  
    "userId": "b631fe64-4d84-488e-8315-827f91400d1e",  
    "occupancy": 0,  
    "data": {}  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "37e53fc9-cea7-4fe5-9289-efcd2cd3cc3f",  
        "timestamp": "2025-06-16T09:53:50Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "channelId": "meeting-9xs243ia-attendees",  
                    "userId": "b631fe64-4d84-488e-8315-827f91400d1e",  
                    "occupancy": 0,  
                    "data": {}  
                }  
            ]  
`
```

```
`{  
    "event": {  
        "id": "10ebb8da-9268-4f00-9d8c-6b7559a4a091",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "channelId": "meeting-9xs243ia-attendees",  
                    "userId": "b631fe64-4d84-488e-8315-827f91400d1e",  
                    "occupancy": 0,  
                    "data": {}  
                }  
            ]  
        }  
    },  
`
```

```
`{  
    "event": {  
        "id": "e2d4bb46-12a0-4fde-83a4-46c8cd4c7c14",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "channelId": "meeting-9xs243ia-attendees",  
                    "userId": "b631fe64-4d84-488e-8315-827f91400d1e",  
                    "occupancy": 0,  
                    "data": {}  
                }  
            ]  
        }  
    },  
`
```

#### Interval occupancy counted

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
    "data": [  
        {  
            "id": "56fa7b98-56b5-433b-a4f4-247e72729d3a",  
            "channel": "Channel-Barcelona",  
            "occupancy": 7,  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:27:37.080Z"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "37e53fc9-cea7-4fe5-9289-efcd2cd3cc3f",  
        "timestamp": "2025-06-16T09:53:50Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "37e53fc9-cea7-4fe5-9289-efcd2cd3cc3f",  
                    "channel": "Channel-Barcelona",  
                    "occupancy": 7,  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T09:53:50.085Z",  
                    "usersJoinedDelta": [  
`
```

```
`{  
    "event": {  
        "id": "10ebb8da-9268-4f00-9d8c-6b7559a4a091",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "10ebb8da-9268-4f00-9d8c-6b7559a4a091",  
                    "channel": "Channel-Barcelona",  
                    "occupancy": 6,  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:59:57.707Z"  
                }  
            ]  
        }  
`
```

```
`{  
    "event": {  
        "id": "e2d4bb46-12a0-4fde-83a4-46c8cd4c7c14",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "e2d4bb46-12a0-4fde-83a4-46c8cd4c7c14",  
                    "channel": "Channel-Barcelona",  
                    "occupancy": 6,  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-17T12:24:17.708Z"  
                }  
            ]  
        }  
`
```

## Mobile Push Notifications

### Devices

#### Device removed

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "id": "12345",  
    "action": "remove",  
    "device": "device_token_abc",  
    "platform": "ios",  
    "timestamp": "2024-06-10T12:34:56Z",  
    "subKey": "sub-c-xyz",  
    "oldDevice": "old_device_token_def"  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "37e53fc9-cea7-4fe5-9289-efcd2cd3cc3f",  
        "timestamp": "2025-06-16T09:53:50Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "12345",  
                    "action": "remove",  
                    "device": "device_token_abc",  
                    "platform": "ios",  
                    "timestamp": "2024-06-10T12:34:56Z",  
                    "subKey": "sub-c-xyz",  
`
```

```
`{  
    "event": {  
        "id": "10ebb8da-9268-4f00-9d8c-6b7559a4a091",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "12345",  
                    "action": "remove",  
                    "device": "device_token_abc",  
                    "platform": "ios",  
                    "timestamp": "2024-06-10T12:34:56Z",  
                    "subKey": "sub-c-xyz",  
                    "oldDevice": "old_device_token_def"  
                }  
`
```

```
`{  
    "event": {  
        "id": "e2d4bb46-12a0-4fde-83a4-46c8cd4c7c14",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "12345",  
                    "action": "remove",  
                    "device": "device_token_abc",  
                    "platform": "ios",  
                    "timestamp": "2024-06-10T12:34:56Z",  
                    "subKey": "sub-c-xyz",  
                    "oldDevice": "old_device_token_def"  
                }  
`
```

#### Push error

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "id": "52301823-51f5-47d7-962c-16ac657f752a",  
    "channel": "pn-in.dFVj.lpxY",  
    "devices": "",  
    "platform": "apns",  
    "timestamp": "2025-06-18T04:16:59.353913Z",  
    "subKey": "sub-c-a5015666-3dd3-42df-8074-d37d647e8fe9",  
    "state": "error",  
    "payload": "APNS payload error: APNS notification exceeds max size"  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "37e53fc9-cea7-4fe5-9289-efcd2cd3cc3f",  
        "timestamp": "2025-06-16T09:53:50Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "52301823-51f5-47d7-962c-16ac657f752a",  
                    "channel": "pn-in.dFVj.lpxY",  
                    "devices": "",  
                    "platform": "apns",  
                    "timestamp": "2025-06-18T04:16:59.353913Z",  
                    "subKey": "sub-c-a5015666-3dd3-42df-8074-d37d647e8fe9",  
`
```

```
`{  
    "event": {  
        "id": "10ebb8da-9268-4f00-9d8c-6b7559a4a091",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "52301823-51f5-47d7-962c-16ac657f752a",  
                    "channel": "pn-in.dFVj.lpxY",  
                    "devices": "",  
                    "platform": "apns",  
                    "timestamp": "2025-06-18T04:16:59.353913Z",  
                    "subKey": "sub-c-a5015666-3dd3-42df-8074-d37d647e8fe9",  
                    "state": "error",  
                    "payload": "APNS payload error: APNS notification exceeds max size"  
`
```

```
`{  
    "event": {  
        "id": "e2d4bb46-12a0-4fde-83a4-46c8cd4c7c14",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/presence.channel.occupancy.counted?v=1.0.0",  
            "data": [  
                {  
                    "id": "52301823-51f5-47d7-962c-16ac657f752a",  
                    "channel": "pn-in.dFVj.lpxY",  
                    "devices": "",  
                    "platform": "apns",  
                    "timestamp": "2025-06-18T04:16:59.353913Z",  
                    "subKey": "sub-c-a5015666-3dd3-42df-8074-d37d647e8fe9",  
                    "state": "error",  
                    "payload": "APNS payload error: APNS notification exceeds max size"  
`
```

## Memberships

### CRUD

#### Membership created

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/membership.created?v=1.0.0",  
    "data": [  
        {  
            "id": "2ca7fef7-6896-4a51-953d-7e4aeb16ec45",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:15:46.035118335Z",  
            "eTag": "Afah2qS199e74QE",  
            "channelId": "100",  
            "userId": "user-123",  
            "type": "",  
            "status": ""  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "4525d01e-8e75-4c0a-9d44-f6a259bca8ca",  
        "timestamp": "2025-06-16T11:31:08Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/membership.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "4525d01e-8e75-4c0a-9d44-f6a259bca8ca",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:31:08.893307042Z",  
                    "eTag": "Afah2qS199e74QE",  
                    "channelId": "100",  
                    "userId": "User_id7",  
`
```

```
`{  
    "event": {  
        "id": "17816483-e327-4a54-af19-3ecb5d36c9cb",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "17816483-e327-4a54-af19-3ecb5d36c9cb",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:01:13.704864199Z",  
                    "eTag": "Afah2qS199e74QE",  
                    "channelId": "123",  
                    "userId": "user-123",  
                    "type": "",  
                    "status": ""  
`
```

```
`{  
    "event": {  
        "id": "b5564bc7-7c8c-4da8-9a5a-81be78cefc08",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.created?v=1.0.0",  
            "data": [  
                {  
                    "id": "b5564bc7-7c8c-4da8-9a5a-81be78cefc08",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-17T12:24:52.733306859Z",  
                    "eTag": "Afah2qS199e74QE",  
                    "channelId": "channel_5",  
                    "userId": "user-123",  
                    "type": "",  
                    "status": ""  
`
```

#### Membership updated

- No Envelope
- V1
- V2
- V2.1

```
`{  
    "dataSchema": "pubnub.com/schemas/events/membership.updated?v=1.0.0",  
    "data": [  
        {  
            "id": "579e8253-f846-437a-abbd-1d353f07d2cb",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:16:04.950644238Z",  
            "eTag": "Ad6Y0N6U1IqLDw",  
            "channelId": "123",  
            "userId": "user-123",  
            "fields": {  
                "status": "dfgasd"  
            }  
        }  
    ]  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "af6a32e3-4f13-43fa-84e9-2919adc987b7",  
        "timestamp": "2025-06-16T11:31:32Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/membership.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "af6a32e3-4f13-43fa-84e9-2919adc987b7",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:31:32.369887894Z",  
                    "eTag": "AeLXu9+02PuzmAE",  
                    "channelId": "100",  
                    "userId": "User_id7",  
`
```

```
`{  
    "event": {  
        "id": "11ca0c7d-8b28-44f0-9bd8-f0034d816231",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "11ca0c7d-8b28-44f0-9bd8-f0034d816231",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:01:43.659730872Z",  
                    "eTag": "AY3Js4admc6wYw",  
                    "channelId": "123",  
                    "userId": "user-123",  
                    "properties": {  
                        "custom-field": ""  
`
```

```
`{  
    "event": {  
        "id": "cbba0435-ca88-408d-a032-fb5ffa3c6590",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.updated?v=1.0.0",  
            "data": [  
                {  
                    "id": "cbba0435-ca88-408d-a032-fb5ffa3c6590",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-17T12:25:51.661738194Z",  
                    "eTag": "Afv7lbeolKjQQQ",  
                    "channelId": "100",  
                    "userId": "user-123",  
                    "fields": {  
                        "status": "status"  
`
```

#### Membership deleted

- No Envelope
- V1
- V2
- V2.1

```
`{**    "dataSchema": "pubnub.com/schemas/events/membership.deleted?v=1.0.0",  
    "data": [  
        {  
            "id": "7323e044-953d-4bd5-9518-62bf5d3f3502",  
            "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
            "timestamp": "2025-06-16T09:16:17.948145898Z",  
            "channelId": "123",  
            "userId": "user-123"  
        }  
    ]  
}  
`
```

```
`{  
    "schema": "https://www.pubnub.com/schemas/edp.ena.event?schema-instance+json",  
    "event": {  
        "id": "8ea56777-031e-4d19-833b-9312c977b786",  
        "timestamp": "2025-06-16T11:31:45Z",  
        "payload": {  
            "schema": "pubnub.com/schemas/events/membership.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "8ea56777-031e-4d19-833b-9312c977b786",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T11:31:45.561577381Z",  
                    "channelId": "100",  
                    "userId": "User_id7"  
                }  
`
```

```
`{  
    "event": {  
        "id": "683d5f90-acdf-438b-beb2-f48ff37fca2a",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "683d5f90-acdf-438b-beb2-f48ff37fca2a",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:02:00.354843517Z",  
                    "channelId": "123",  
                    "userId": "user-123"  
                }  
            ]  
        }  
`
```

```
`{  
    "event": {  
        "id": "462a0c92-66a4-4172-b88e-92e1133a77b5",  
        "payload": {  
            "dataSchema": "pubnub.com/schemas/events/membership.deleted?v=1.0.0",  
            "data": [  
                {  
                    "id": "462a0c92-66a4-4172-b88e-92e1133a77b5",  
                    "subKey": "sub-c-b0451d-1337-4b42-bee0-1905c7c02db",  
                    "timestamp": "2025-06-16T12:03:50.391226678Z",  
                    "channelId": "123",  
                    "userId": "User_id"  
                }  
            ]  
        }  
`
```
Last updated on Jul 17, 2025