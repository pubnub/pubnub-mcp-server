# Message Actions API – PubNub Unity SDK  
Add, remove, and fetch metadata (reactions, receipts, etc.) attached to published messages.  
Message Persistence must be enabled for all Message-Action operations.

---

## Add Message Reaction (Add Message Action)

```  
`pubnub.AddMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .Action(PNMessageAction)  
    .Execute(System.ActionPNAddMessageActionResult, PNStatus>)  
`  
```

Parameters  
• Channel (string) – destination channel.  
• MessageTimetoken (long) – timetoken of the target message.  
• Action (PNMessageAction) – metadata to attach.  
• Execute / ExecuteAsync – callback / Task<PNResult<PNAddMessageActionResult>>.

### PNMessageAction  
• Type (string) – action type.  
• Value (string) – action value.

### Returns → PNAddMessageActionResult  
• MessageTimetoken (long) – original message.  
• ActionTimetoken (long) – new action.  
• Action (PNMessageAction) – payload.  
• Uuid (string) – sender UUID.

```  
`{  
    "MessageTimetoken":15610547826969050,  
    "ActionTimetoken":15610547826970050,  
    "Action":{  
        "type":"reaction",  
        "value":"smiley_face"  
    },  
    "Uuid":"user-456"  
}`  
```

Sample code  

```  
`  
`  
```

---

## Remove Message Reaction (Remove Message Action)

```  
`pubnub.RemoveMessageAction()  
    .Channel(string)  
    .MessageTimetoken(long)  
    .ActionTimetoken(long)  
    .Uuid(string)  
    .Execute(System.ActionPNRemoveMessageActionResult, PNStatus>)  
`  
```

Parameters  
• Channel (string) – channel to publish removal.  
• MessageTimetoken (long) – timetoken of original message.  
• ActionTimetoken (long) – timetoken of action to remove.  
• Uuid (string) – UUID that added the action.  
• Execute / ExecuteAsync – callback / Task<PNResult<PNRemoveMessageActionResult>>.

Returns: empty payload.

Sample code  

```  
`  
`  
```

---

## Get Message Reactions (Get Message Actions)

```  
`pubnub.GetMessageActions()  
    .Channel(string)  
    .Start(long)  
    .End(long)  
    .Limit(int)  
    .Execute(System.ActionPNGetMessageActionsResult, PNStatus>)  
`  
```

Parameters  
• Channel (string) – target channel.  
• Start (long) – inclusive range start.  
• End (long) – exclusive range end.  
• Limit (int, ≤100, default 100) – max items.  
• Execute / ExecuteAsync – callback / Task<PNResult<PNGetMessageActionsResult>>.

### Returns → PNGetMessageActionsResult  
• MessageActions (List<PNMessageActionItem>)  
   – MessageTimetoken (long)  
   – Action (PNMessageAction)  
   – Uuid (string)  
   – ActionTimetoken (long)  
• More (pagination)  
   – Start (long)  
   – End (long)  
   – Limit (int)

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

Sample code  

```  
`  
`  
```

_Last updated: Jul 15 2025_