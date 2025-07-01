On this page
# Message Actions API for Go SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add an action on a published `message`. Returns the added action in the response.

### Method(s)[​](#methods)

To Add a Message Action you can use the following method(s) in the Go SDK:

```
`pn.AddMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    Action(pubnub.MessageAction).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringThe channel name.`MessageTimetoken` *Type: stringThe publish timetoken of a parent message.`Action` *Type: pubnub.MessageActionMessage Action Details :-`ActionType`: What feature this action represents -- max `15` characters. `ActionValue`: Details about the action -- max `40` characters.

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
`package main  
  
import (  
	"fmt"  
	"log"  
  
	pubnub "github.com/pubnub/go/v7"  
)  
  
func main() {  
	// Configure the PubNub instance with demo keys  
	config := pubnub.NewConfigWithUserId("myUniqueUserId")  
	config.SubscribeKey = "demo"  
	config.PublishKey = "demo"  
  
`
```
show all 45 lines

### Returns[​](#returns)

The `AddMessageAction()` operation returns a `PNAddMessageActionsResponse` which contains the following parameters:

Property NameTypeDescription`Data`PNMessageActionsResponseDetails of type `PNMessageActionsResponse` are [here](#pnmessageactionsresponse)

#### PNMessageActionsResponse[​](#pnmessageactionsresponse)

Property NameTypeDescription`ActionType`stringWhat feature this action represents.`ActionValue`stringDetails about the action.`ActionTimetoken`stringThe timetoken when the action was added.`MessageTimetoken`stringThe timetoken of the parent message.

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action on a published `message`. Returns an empty response.

### Method(s)[​](#methods-1)

To Remove a Message Action you can use the following method(s) in the Go SDK:

```
`pn.RemoveMessageAction().  
    Channel(string).  
    MessageTimetoken(string).  
    ActionTimetoken(string).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringThe channel name.`MessageTimetoken` *Type: stringThe publish timetoken of a parent message.`ActionTimetoken` *Type: stringThe publish timetoken of the action.

### Basic Usage[​](#basic-usage-1)

```
`res, status, err := pn.RemoveMessageAction()  
    .Channel("my-channel")  
    .MessageTimetoken("15698453963258802")  
    .ActionTimetoken("15698453963258812")  
    .Execute()  
`
```

### Returns[​](#returns-1)

The `RemoveMessageAction()` operation returns a `PNRemoveMessageActionsResponse` which contains the following parameters:

Property NameTypeDescription`Data`interfaceReturns an empty interface.

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

To Get Message Actions you can use the following method(s) in the Go SDK:

```
`pn.GetMessageActions().  
    Channel(string).  
    Start(string).  
    End(string).  
    Limit(int).  
    Execute()  
`
```

*  requiredParameterDescription`Channel` *Type: stringThe channel name.`Start`Type: stringAction timetoken denoting the start of the range requested (return values will be less than start).`End`Type: stringAction timetoken denoting the end of the range requested (return values will be greater than or equal to end).`Limit`Type: intNumber of actions to return in response..

### Basic Usage[​](#basic-usage-2)

```
`res, status, err := pn.GetMessageActions()  
    .Channel("my-channel")  
    .Start("15698453963258812")  
    .End("15698453963258811")  
    .Execute()  
`
```

### Returns[​](#returns-2)

The `GetMessageActions()` operation returns a `PNGetMessageActionsResponse` which contains the following parameters:

Property NameTypeDescription`Data`[]PNMessageActionsResponseDetails of type `PNMessageActionsResponse` are [here](#pnmessageactionsresponse)`More`PNGetMessageActionsMoreDetails of type `PNGetMessageActionsMore` are [here](#pngetmessageactionsmore)

#### PNGetMessageActionsMore[​](#pngetmessageactionsmore)

Property NameTypeDescription`URL`stringThe URL of the next set of results.`Start`stringThe start param for the next set of results.`End`stringThe end param for the next set of results.`Limit`intThe limit for the next set of results.Last updated on **Jun 10, 2025**