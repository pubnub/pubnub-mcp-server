# Message Actions API for C# SDK

Use message actions to add or remove metadata on published messages (for example, receipts and reactions). Clients subscribe to a channel to receive message action events, and can fetch past message actions from Message Persistence, either on demand or when fetching original messages.

##### Reactions

"Message Reactions" is a specific application of the Message Actions API for emoji or social reactions.

##### Message Actions vs. Message Reactions

Message Actions is a flexible, low-level API for adding metadata to messages (read receipts, delivery confirmations, custom data). Message Reactions refers to using Message Actions specifically for emoji/social reactions. In PubNub Core and Chat SDKs, it’s the same API with different terminology depending on use case.

##### Request execution

Use try/catch with the C# SDK. Invalid parameters throw exceptions. If the request reaches the server but fails (server or network error), details are available in the returned status.

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

## Add message action[​](#add-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal as described in the support article.

Add an action to a published message. The response includes the added action.

### Method(s)[​](#methods)

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

#### PNMessageAction[​](#pnmessageaction)

- Type (string): Message action type.
- Value (string): Message action value.

### Sample code[​](#sample-code)

##### Reference code

```
1
  

```

### Returns[​](#returns)

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

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal as described in the support article.

Remove a previously added action from a published message. The response is empty.

### Method(s)[​](#methods-1)

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

### Sample code[​](#sample-code-1)

```
1
  

```

### Returns[​](#returns-1)

The RemoveMessageAction() operation returns no actionable data.

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence

Enable Message Persistence for your key in the Admin Portal as described in the support article.

Get a list of message actions in a channel, sorted by action timetoken (ascending).

##### Truncated response

If the response is truncated due to internal limits, a more property is returned with additional parameters. Send iterative calls, adjusting the parameters to fetch more actions.

### Method(s)[​](#methods-2)

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
- Limit (int): Maximum number of actions to return. Default/Maximum is 100.

### Sample code[​](#sample-code-2)

```
1
  

```

### Returns[​](#returns-2)

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