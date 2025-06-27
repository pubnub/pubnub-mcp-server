### Wildcard Subscribe[​](#wildcard-subscribe "Direct link to Wildcard Subscribe")

Wildcard Subscribe `channelName.*` can be used to subscribe to a hierarchical list of channels. It's similar to Channel Group in that you can subscribe to lots of channels with a single name declaration. For example, you specify a wildcard channel pattern like `sports.*`, and your app will subscribe to all channel names that match that pattern: `sports.cricket`, `sports.lacrosse`. This list can be virtually infinite in number with some limitations described in the next section.

*   JavaScript
*   Swift
*   Objective-C
*   Java
*   C#
*   Python

    const channel = pubnub.channel("alerts.*");channel.subscription().subscribe();

    let subscription1 = pubnub.channel("alerts.*").subscription()

    [self.pubnub subscribeToChannels: @[@"alerts.*", @"chats.team1.*"] withPresence:YES];

    pubnub.subscribe()  .channels(Arrays.asList("alerts.*", "chats.team1.*")  .withPresence())  .execute();

    SubscriptionSet subscriptionSet = pubnub.Subscription(    new string[] {"alerts.*", "chats.team1.*"},    SubscriptionOptions.ReceivePresenceEvents)

    subscription_set1 = pubnub.subscription_set(channels=["alerts.*", "chats.team1.*"])subscription_set1.subscribe(with_presence = True)

#### Wildcard Subscribe Rules[​](#wildcard-subscribe-rules "Direct link to Wildcard Subscribe Rules")

There are some limits to what you can do with the Wildcard Subscribe. Below is a quick summary of the rules:

*   You're limited to two dots (three levels). For example, you can subscribe to `a.*` or `a.b.*` but not `a.b.c.*`.
*   A wildcard pattern must always end with `.*`. In other words, the `*` can't be in the middle of the pattern (`a.*.c`, isn't valid).
*   Just like Channel Groups, you can not publish to a wildcard channel pattern.
