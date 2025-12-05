# Presence API for JavaScript SDK

Presence tracks user join/leave events, channel occupancy, subscriptions, and per-user presence state.

- Supported async patterns: Callbacks, Promises, Async/Await (recommended). Use try...catch to handle errors.
- All methods below require the Presence add-on enabled for your key in the Admin Portal. For receiving events, see Presence Events.

## Here now

Returns current state of one or more channels: list of UUIDs (and optional state) and occupancy per channel.

- Cache: 3-second response cache.

### Method(s)

```js
pubnub.hereNow({
  channels?: string[],
  channelGroups?: string[],
  includeUUIDs?: boolean,   // default: true
  includeState?: boolean,   // default: false
  limit?: number,           // default: 1000 (0–1000). Use 0 for occupancy-only.
  offset?: number           // zero-based index; requires limit > 0
}): Promise<HereNowResponse>
```

Parameters
- channels (string[]): Channel names to query. Specify either channels or channelGroups.
- channelGroups (string[]): Channel Groups to query. Specify either channels or channelGroups. Wildcards not supported.
- includeUUIDs (boolean, default true): Set to false to omit UUIDs.
- includeState (boolean, default false): Set to true to include presence state.
- limit (number, default 1000): Max occupants to return per channel. 0–1000. Use 0 for counts only (no user details).
- offset (number): Zero-based starting index for pagination. Must be >= 0 and used with limit > 0. Included in request only when offset > 0.

### Sample code

#### Reference code

```

```

#### Get a list of UUIDs subscribed to channel

```

```

### Response

```ts
type HereNowResponse = {
  totalChannels: number,     // total number of channels returned
  totalOccupancy: number,    // total occupants across channels
  channels: {
    [channel: string]: {
      name: string,
      occupancy: number,
      occupants: Array<{ uuid: string, state?: any }>
    }
  }
}
```

### Other examples

#### Returning state

```

```

##### Example response

```json
// Example of Status
{
  "error": false,
  "operation": "PNHereNowOperation",
  "statusCode": 200
}

// Example of Response
{
  "totalChannels": 1,
  "totalOccupancy": 3,
  "channels": {
    "my_channel": {
      "occupants": [
        {
          "uuid": "User 1"
        },
        {
          "state": {
            "age": 18
          },
          "uuid": "User 2"
        },
        {
          "state": {
            "age": 24
          },
          "uuid": "User 3"
        }
      ],
      "name": "my_channel",
      "occupancy": 3
    }
  }
}
```

#### Return occupancy only

You can return only occupancy by setting includeUUIDs and includeState to false.

```

```

##### Example response

```json
// Example of Status
{
  "error": false,
  "operation": "PNHereNowOperation",
  "statusCode": 200
}

// Example of Response
{
  "totalChannels": 1,
  "totalOccupancy": 3,
  "channels": {
    "my_channel": {
      "occupants": [],
      "name": "my_channel",
      "occupancy": 3
    }
  }
}
```

#### Channel group usage

```

```

##### Example response

```json
// Example of Status
{
  "error": false,
  "operation": "PNHereNowOperation",
  "statusCode": 200
}

// Example of Response
{
  "totalChannels": 2,
  "totalOccupancy": 3,
  "channels": {
    "my_channel_1": {
      "occupants": [
        {
          "state": null,
          "uuid": "User1"
        },
        {
          "state": null,
          "uuid": "User3"
        }
      ],
      "name": "my_channel_1",
      "occupancy": 2
    },
    "my_channel_2": {
      "occupants": [
        {
          "state": null,
          "uuid": "User2"
        }
      ],
      "name": "my_channel_2",
      "occupancy": 1
    }
  }
}
```

#### Sample code with promises

```

```

## Where now

Returns the list of channels a UUID is subscribed to.

- Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```js
pubnub.whereNow({
  uuid?: string        // default: current UUID
}): Promise<WhereNowResponse>
```

Parameters
- uuid (string, default current UUID): UUID to return channel list for.

### Sample code

#### Get a list of channels a UUID is subscribed to

```

```

### Response

```json
// Example of Status
{
  "error": false,
  "operation": "PNWhereNowOperation",
  "statusCode": 200
}

// Example of Response
{
  "channels": ["ch1", "ch2"]
}
```

## User state

Clients can set dynamic, non-persistent presence state (for example, score, location) per channel while subscribed. State is not persisted and is lost on disconnect. Keys starting with pn are reserved; no nested objects; supported value types: int, float, string.

### Method(s)

#### Set state

```js
pubnub.setState({
  channels?: string[],
  channelGroups?: string[],
  state?: any            // JSON of key/value pairs; see constraints below
}): Promise<SetStateResponse>
```

Parameters
- channels (string[]): Channels to set the state. Provide channels or channelGroups.
- channelGroups (string[]): Channel Groups to set the state. Provide channels or channelGroups.
- state (any): Flat JSON of key/value pairs. Supported types: int, float, string. No nesting. Keys with pn prefix are reserved.
  - If state is undefined, the current state for the specified UUID will be returned.
  - Existing keys are overwritten with new values.
  - Delete a key by setting its value to null.

#### Get state

```js
pubnub.getState({
  uuid?: string,         // default: current UUID
  channels?: string[],
  channelGroups?: string[]
}): Promise<GetStateResponse>
```

Parameters
- uuid (string, default current UUID): Subscriber UUID to get current state.
- channels (string[]): Channels to get the state. Provide channels or channelGroups.
- channelGroups (string[]): Channel Groups to get the state. Provide channels or channelGroups.

### Sample code

#### Set state

```

```

#### Get state

```

```

### Response

#### Set state

```json
// Example of Status
{
  "error": false,
  "operation": "PNSetStateOperation",
  "statusCode": 200
}

// Example of Response
{
  "state": {
    "me": "typing"
  }
}
```

#### Get state

```json
// Example of Status
{
  "error": false,
  "operation": "PNGetStateOperation",
  "statusCode": 200
}

// Example of Response
{
  "channels": {
    "ch1": {
      "me": "typing"
    }
  }
}
```