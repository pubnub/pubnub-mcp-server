On this page
# Message Actions API for Unity SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message actions events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns `PNAddMessageActionResult` in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Unity SDK:

```
`pubnub.AddMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .Action(PNMessageAction)  
    .Execute(System.ActionPNAddMessageActionResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies channel name to `publish` message actions to.`MessageTimetoken` *Type: longTimestamp when the actual `message` was created the message actions belongs to.`Action` *Type: [PNMessageAction](#pnmessageaction)Specify the action you want to publish of type `PNMessageAction`.`Execute` *Type: `System.Action``System.Action` of type `PNAddMessageActionResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNAddMessageActionResult>>`.

#### PNMessageAction[​](#pnmessageaction)

*  requiredParameterDescription`Type` *Type: stringMessage actions's `type`.`Value` *Type: stringMessage actions's `value`.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`using PubnubApi;  
using PubnubApi.Unity;  
using UnityEngine;  
  
public class AddMessageActionExample : MonoBehaviour {  
    // Reference to a pubnub manager previously setup in Unity Editor  
    // For more details, see https://www.pubnub.com/docs/sdks/unity#configure-pubnub  
    [SerializeField] private PNManagerBehaviour pubnubManager;  
  
    // An editor-serialized string for the channel ID  
    [SerializeField] private string channelId = "my_channel";  
  
    // An editor-serialized timetoken for the message  
    [SerializeField] private long messageTimetoken = 5610547826969050;  
  
`
```
show all 34 lines

### Returns[​](#returns)

The `AddMessageAction()` operation returns a `PNAddMessageActionResult` which contains the following properties:

Property NameTypeDescriptionMessageTimetokenlongTimetoken of the message to be associated with Message Action.ActionTimetokenlongTimetoken of the Message Action that will be associated with the message.ActionPNMessageActionMessage Action payload. → TypestringType of the Message Action. → ValuestringValue of the Message Action.UuidstringUUID associated with the Message Action.

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

To Remove a Message Action you can use the following method(s) in the Unity SDK:

```
`pubnub.RemoveMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .ActionTimetoken(long)  
    .Uuid(string)  
    .Execute(System.ActionPNRemoveMessageActionResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringSpecifies channel name to `publish` message actions to.`MessageTimetoken` *Type: longPublish `timetoken` of the original `message``ActionTimetoken` *Type: longPublish `timetoken` of the message action to be removed.`Uuid` *Type: string`UUID` of the `message`.`Execute` *Type: `System.Action``System.Action` of type `PNRemoveMessageActionResult`.`ExecuteAsync`Type: NoneReturns `Task<PNResult<PNRemoveMessageActionResult>>`.

### Basic Usage[​](#basic-usage-1)

```
`pubnub.RemoveMessageAction()  
    .Channel("my_channel")  
    .MessageTimetoken(15701761818730000)  
    .ActionTimetoken(15701775691010000)  
    .Uuid("mytestuuid")  
    .Execute(new PNRemoveMessageActionResult((result, status) =>  
    {  
        //empty result of type PNRemoveMessageActionResult.  
    }));  
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

To Get Message Actions you can use the following method(s) in the Unity SDK:

```
`pubnub.GetMessageActions()  
    .Channel(string)  
    .Start(long)  
    .End(long)  
    .Limit(int)  
    .Execute(System.ActionPNGetMessageActionsResult, PNStatus>)  
`
```

*  requiredParameterDescription`Channel` *Type: stringDefault:  
n/aThe `channel` name.`Start`Type: longDefault:  
n/aMessage Action `timetoken` denoting the `start` of the range requested (return values will be greater than or equal to `start`).`End`Type: longDefault:  
n/aMessage Action `timetoken` denoting the `end` of the range requested (return values will be less than `end`).`Limit`Type: intDefault:  
100Specifies the number of actions to return in response. Default/Maximum is `100`.`Execute` *Type: `System.Action`Default:  
n/a`System.Action` of type `PNGetMessageActionsResult`.`ExecuteAsync`Type: NoneDefault:  
n/aReturns `Task<PNResult<PNGetMessageActionsResult>>`.

### Basic Usage[​](#basic-usage-2)

```
`pubnub.GetMessageActions()  
    .Channel("my_channel")  
    .Execute(new PNGetMessageActionsResult((result, status) =>  
    {  
        //result is of type PNGetMessageActionsResult.  
    }));  
`
```

### Returns[​](#returns-2)

The `GetMessageActions()` operations returns `PNGetMessageActionsResult` which contains the following properties :

Property NameTypeDescriptionMessage Actions`List<PNMessageActionItem>`List of Message ActionsMoreMoreInfoPagination information.

The `PNMessageActionItem` has the following properties:

Property NameTypeDescription →  MessageTimetokenlongTimetoken associated with the message. →  ActionPNMessageActionMessage Action payload. →  →  TypestringType of the Message Action. →  →  ValuestringValue of the Message Action. →  Uuidstring`UUID` associated with the action. →  ActionTimetokenlongTimetoken associated with the action.

The `More` has following properties:

Property NameTypeDescription →  →  StartlongTimetoken denoting the start of the requested range. →  →  EndlongTimetoken denoting the end of the requested range. →  →  LimitintNumber of Message Actions returned in response.

```
`{**    "MessageActions":  
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
show all 17 linesLast updated on Jun 10, 2025**