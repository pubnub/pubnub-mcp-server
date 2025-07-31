# C# SDK – Storage & Playback (Message Persistence)

Message Persistence stores every published message (10-ns resolution) across multiple regions. Retention is configurable per key: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.  
All following APIs require Message Persistence to be enabled for your key in the Admin Portal.

---

## Request Execution Pattern

```csharp
try  
{  
    PNResult<PNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
    Console.WriteLine("Server status code : " + status.StatusCode);  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
```

If parameter validation fails, the SDK throws an exception. Network/server errors are returned in `PNStatus`.

---

## Fetch History

```csharp
pubnub.FetchHistory()  
        .Channels(string[])                   // max 500  
        .IncludeMeta(bool)                    // default: false  
        .IncludeMessageType(bool)             // default: true  
        .IncludeCustomMessageType(bool)       // default: false  
        .IncludeUUID(bool)                    // default: true  
        .IncludeMessageActions(bool)          // true → max 1 channel, 25 msgs  
        .Reverse(bool)                        // oldest-first when true  
        .Start(long)                          // exclusive  
        .End(long)                            // inclusive  
        .MaximumPerChannel(int)               // single=100, multi=25  
        .QueryParam(Dictionary<string,object>)  
        .ExecuteAsync();                      // returns PNResult<PNFetchHistoryResult>
```

• `start` only → messages older than `start`  
• `end` only → messages `end` and newer  
• both → messages between `start` and `end` (inclusive on `end`)  
Iterate with the returned `More` object when present.

#### Sample

```
`  
`
```

#### Response

```json
{  
    "Messages": {  
        "my_channel": [{  
            "Timetoken": 15717278253295153,  
            "Entry":    "sample message",  
            "Meta":     "",  
            "Uuid":     "user-1",  
            "MessageType": 0,  
            "CustomMessageType": "text-message",  
            "Actions":  null  
        }]  
    },  
    "More": null  
}
```

Other example:

```
`  
`
```

---

## Delete Messages from History  
(Requires secret key & “Enable Delete-From-History” in Admin Portal)

```csharp
pubnub.DeleteMessages()  
        .Channel(string)  
        .Start(long)                          // inclusive  
        .End(long)                            // exclusive  
        .QueryParam(Dictionary<string,object>)  
        .ExecuteAsync();                      // returns PNResult<PNDeleteMessageResult>
```

#### Samples

```
`  
`
```

```
`  
`
```

Delete a single message (publish timetoken = `15526611838554310`):

```
`  
`
```

---

## Message Counts

```csharp
pubnub.MessageCounts()  
        .Channels(string[])  
        .ChannelsTimetoken(long[])            // one per channel, or single value  
        .QueryParam(Dictionary<string,object>)  
        .ExecuteAsync();                      // returns PNResult<PNMessageCountResult>
```

For unlimited-retention keys, counts cover last 30 days only.

#### Samples

```
`  
`
```

Single channel:

```
`  
`
```

Different timetokens per channel:

```
`  
`
```

---

## History (Deprecated – use FetchHistory)  

```csharp
pubnub.History()  
        .Channel(string)  
        .IncludeMeta(bool)  
        .Reverse(bool)  
        .IncludeTimetoken(bool)  
        .Start(long)                          // exclusive  
        .End(long)                            // inclusive  
        .Count(int)                           // max 100  
        .QueryParam(Dictionary<string,object>)  
        .ExecuteAsync();                      // returns PNResult<PNHistoryResult>
```

#### Samples

```
`  
`
```

Synchronous:

```
`  
`
```

Oldest 3 messages:

```
`  
`
```

Response:

```json
{  
    "Messages":[  
        { "Timetoken":0, "Entry":"Pub1" },  
        { "Timetoken":0, "Entry":"Pub2" },  
        { "Timetoken":0, "Entry":"Pub3" }  
    ]  
}
```

Messages newer than a timetoken:

```
`  
`
```

Response:

```json
{  
    "Messages":[  
        { "Timetoken":0, "Entry":"Pub3" },  
        { "Timetoken":0, "Entry":"Pub4" },  
        { "Timetoken":0, "Entry":"Pub5" }  
    ]  
}
```

Until a specific timetoken:

```
`  
`
```

Response:

```json
{  
    "Messages":[  
        { "Timetoken":0, "Entry":"Pub3" },  
        { "Timetoken":0, "Entry":"Pub4" },  
        { "Timetoken":0, "Entry":"Pub5" }  
    ]  
}
```

Paging helper:

```
`  
`
```

Include timetoken in response:

```
`**`
```

_Last updated Jul 15 2025_