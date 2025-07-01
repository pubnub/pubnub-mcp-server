On this page
# Message Actions API for C# SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

##### Request execution

We recommend using `try` and `catch` statements when working with the C# SDK.

If there's an issue with the provided API parameter values, like missing a required parameter, the SDK throws an exception. However, if there is a server-side API execution issue or a network problem, the error details are contained within the `status`.

```
`try  
{  
    PNResultPNPublishResult> publishResponse = await pubnub.Publish()  
        .Message("Why do Java developers wear glasses? Because they can't C#.")  
        .Channel("my_channel")  
        .ExecuteAsync();  
  
    PNStatus status = publishResponse.Status;  
  
    Console.WriteLine("Server status code : " + status.StatusCode.ToString());  
}  
catch (Exception ex)  
{  
    Console.WriteLine($"Request can't be executed due to error: {ex.Message}");  
}  
`
```

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns `PNAddMessageActionResult` in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the C# SDK:

```
`pubnub.AddMessageAction()  
        .Channel(string)  
        .MessageTimetoken(long)  
        .Action(PNMessageAction)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies channel name to `publish` message actions to.`MessageTimetoken` *Type: longTimestamp when the actual `message` was created the message action belongs to.`Action` *Type: [PNMessageAction](#pnmessageaction)Specify the action you want to publish of type `PNMessageAction`.

#### PNMessageAction[​](#pnmessageaction)

*  requiredParameterDescription`Type` *Type: stringMessage action's `type`.`Value` *Type: stringMessage action's `value`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`  
`
```

### Returns[​](#returns)

```
`{  
    "MessageTimetoken":15610547826969050,  
    "ActionTimetoken":15610547826970050,  
    "Action":{  
        "type":"reaction",  
        "value":"smiley_face"  
    },  
    "Uuid":"user-456"  
}  
`
```

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the C# SDK:

```
`pubnub.RemoveMessageAction()  
        .Channel(string)  
        .MessageTimetoken(long)  
        .ActionTimetoken(long)  
        .Uuid(string)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies channel name to `publish` message actions to.`MessageTimetoken` *Type: longPublish `timetoken` of the original `message``ActionTimetoken` *Type: longPublish `timetoken` of the message action to be removed.`Uuid` *Type: string`UUID` of the `message`.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `RemoveMessageAction()` operation returns a no actionable data.

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the C# SDK:

```
`pubnub.GetMessageActions()  
        .Channel(string)  
        .Start(long)  
        .End(long)  
        .Limit(int)  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/aThe `channel` name.`Start`Type: longDefault:  
n/aMessage Action `timetoken` denoting the `start` of the range requested (return values will be less than `start`).`End`Type: longDefault:  
n/aMessage Action `timetoken` denoting the `end` of the range requested (return values will be greater than or equal to `end`).`Limit`Type: intDefault:  
100Specifies the number of actions to return in response. Default/Maximum is `100`.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

```
`{**"MessageActions":  
    [{  
    "MessageTimetoken":15610547826969050,  
    "Action":{  
        "type":"reaction",  
        "value":"smiley_face"  
    },  
    "Uuid":"pn-5903a053-592c-4a1e-8bfd-81d92c962968",  
    "ActionTimetoken":15717253483027900  
    }],  
"More": {  
        "Start": 15610547826970050,  
        "End": 15645905639093361,  
        "Limit": 2  
`
```
show all 17 linesLast updated on Jun 30, 2025**