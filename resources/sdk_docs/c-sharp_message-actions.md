# Message Actions API for C# SDK

Use Message Actions to add/remove metadata on published messages (receipts, reactions). Clients can subscribe to channels to receive message action events and fetch past actions from Message Persistence.

##### Reactions
"Message Reactions" is a specific use of Message Actions for emoji/social reactions.

##### Message Actions vs. Message Reactions
Message Actions is the low-level API for arbitrary metadata; Message Reactions uses the same API for emoji/social reactions. In PubNub Core and Chat SDKs, this functionality may be referred to as Message Reactions.

##### Request execution
Use try/catch. Invalid parameters throw exceptions; server/network errors are in the returned status.

```
1try  
2{  
3    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
4        .Message("Why do Java developers wear glasses? Because they can't C#.")  
5        .Channel("my_channel")  
6        .ExecuteAsync();  
7
  
8    PNStatus status = publishResponse.Status;  
9  
10    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
11}  
12catch (Exception ex)  
13{  
14    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
15}  
```

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Add an action to a published message. The response includes the added action.

### Method(s)
Use this C# method:
```
`1pubnub.AddMessageAction()  
2        .Channel(string)  
3        .MessageTimetoken(long)  
4        .Action(PNMessageAction)  
`
```

Parameters:
- Channel (string): Channel name to add the message action to.
- MessageTimetoken (long): Timetoken of the target message.
- Action (PNMessageAction): Message action payload.

#### PNMessageAction
- Type (string): Message action type.
- Value (string): Message action value.

### Sample code
```
1
  

```

### Returns
```
`1{  
2    "MessageTimetoken":15610547826969050,  
3    "ActionTimetoken":15610547826970050,  
4    "Action":{  
5        "type":"reaction",  
6        "value":"smiley_face"  
7    },  
8    "Uuid":"user-456"  
9}  
`
```

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Remove a previously added action from a published message. The response is empty.

### Method(s)
Use this C# method:
```
`1pubnub.RemoveMessageAction()  
2        .Channel(string)  
3        .MessageTimetoken(long)  
4        .ActionTimetoken(long)  
5        .Uuid(string)  
`
```

Parameters:
- Channel (string): Channel name to remove the message action from.
- MessageTimetoken (long): Timetoken of the target message.
- ActionTimetoken (long): Timetoken of the message action to remove.
- Uuid (string): UUID of the message.

### Sample code
```
1
  

```

### Returns
The RemoveMessageAction() operation returns no actionable data.

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal as described in the support article.

Get a list of message actions in a channel. Actions are sorted by action timetoken (ascending).

##### Truncated response
If truncated, a more property is returned with additional parameters. Use iterative calls, adjusting parameters to fetch more actions.

### Method(s)
Use this C# method:
```
`1pubnub.GetMessageActions()  
2        .Channel(string)  
3        .Start(long)  
4        .End(long)  
5        .Limit(int)  
`
```

Parameters:
- Channel (string): Channel name to list message actions for.
- Start (long): Message action timetoken for the start of the range (exclusive).
- End (long): Message action timetoken for the end of the range (inclusive).
- Limit (int, default/max 100): Maximum number of actions to return.

### Sample code
```
1
  

```

### Returns
```
`1{**2"MessageActions":  
3    [{  
4    "MessageTimetoken":15610547826969050,  
5    "Action":{  
6        "type":"reaction",  
7        "value":"smiley_face"  
8    },  
9    "Uuid":"pn-5903a053-592c-4a1e-8bfd-81d92c962968",  
10    "ActionTimetoken":15717253483027900  
11    }],  
12"More": {  
13        "Start": 15610547826970050,  
14        "End": 15645905639093361,  
15        "Limit": 2  
16    }  
17}  
`
```

Last updated on Sep 3, 2025**