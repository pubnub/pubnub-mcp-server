### Message Filters[​](#message-filters "Direct link to Message Filters")

With the metadata information being sent with the [published message](/docs/general/messages/publish#publish-with-message-filters), we can now leverage Message Filters to omit messages that aren't important for a particular client. For example, filter out messages that the client published using its User ID.

In the following code examples, the `userId` variable is used as a placeholder variable that would hold the User ID value for the client. For your servers, this value would be pulled from a server config file. For your clients, this value is received from your server after successful login.

##### User ID / UUID

User ID is also referred to as **`UUID`/`uuid`** in some APIs and server responses but **holds the value** of the **`userId`** parameter you set during initialization.

*   JavaScript
*   Swift
*   Objective-C
*   Java
*   C#
*   Python

    var pubnub = new PubNub({  publishKey: "myPublishKey",  subscribeKey: "mySubscribeKey"  userId: userId})pubnub.setFilterExpression("userId != '" + pubnub.getUserId() + "'");

    // the userId value is received from your servervar pnconfig = PubNubConfiguration(  publishKey: "myPublishKey",  subscribeKey: "mySubscribeKey",)pnconfig.userId: userIdpnconfig.filterExpression: "userId != \(userId)"var pubnub = PubNub(configuration: pnconfig)

    // the uuid value is received from your serverPNConfiguration *pnconfig = [PNConfiguration configurationWithPublishKey:@"myPublishKey"                                    subscribeKey:@"mySubscribeKey"];pnconfig.uuid = uuid;self.pubnub = [PubNub clientWithConfiguration:pnconfig];NSString *filterExp = [NSString stringWithFormat:@"uuid != '%@'",                        self.pubnub.currentConfiguration.uuid];[self.pubnub setFilterExpression:filterExp];

    // the UserId value is received from your serverPNConfiguration.Builder configBuilder = PNConfiguration.builder(new UserId("yourUserId"), "yourSubscribeKey");configBuilder.publishKey("myPublishKey");configBuilder.filterExpression("userId != '" + configBuilder.getUserId() +"'");PubNub pubNub = PubNub.create(configBuilder.build());

    PNConfiguration pnconfig = new PNConfiguration();pnconfig.PublishKey = "myPublishKey";pnconfig.SubscribeKey = "mySubscribeKey";pnconfig.UserId = UserId;pnconfig.FilterExpression = "UserId != '" + pnconfig.GetCurrentUserId() + "'";Pubnub pubnub = new Pubnub(pnconfig);

    pnconfig = PNConfiguration()pnconfig.publish_key = "myPublishKey"pnconfig.subscribe_key = "mySubscribeKey"pnconfig.user_id = user_idpnconfig.filter_expression = "user_id !='" + user_id +"'"pubnub = PubNub(pnconfig)

#### Filterable message properies[​](#filterable-message-properies "Direct link to Filterable message properies")

Based on PubNub's capabilities, here are all the message items you can filter on when subscribing:

*   Message payload/content - The actual data content of the message
*   Message metadata - The metadata attached via the [`meta` parameter](/docs/general/messages/publish#publish-with-message-filters) when publishing
*   Publisher User ID - The unique identifier of the entity that published the message
*   Channel - The channel on which the message was published
*   Timetoken - The timestamp when the message was published
*   Message actions - Related actions performed on the message
*   Message type - Custom type identifiers if your application uses message typing
*   Presence events - If you're also handling presence events in your subscription
*   Signal messages - Lightweight message types can be filtered separately
*   File messages - Messages related to file uploads

The filtering syntax allows for complex expressions combining these elements using operators like equality checks, pattern matching (LIKE), and logical operators (AND, OR).

#### Subscribe Filtering vs. App Context Filtering[​](#subscribe-filtering-vs-app-context-filtering "Direct link to Subscribe Filtering vs. App Context Filtering")

PubNub offers two powerful filtering mechanisms that share similar syntax but serve different purposes in your real-time applications.

*   Subscribe Filtering - Used when subscribing to channels to control which messages are delivered to your client
*   [App Context Filtering](/docs/general/metadata/filtering) - Used when querying metadata to retrieve specific users, channels, or memberships

Both filtering systems:

*   Use the same expression syntax (`==`, `!=`, `>`, `<`, `LIKE`, `&&`, `||`)
*   Support pattern matching with wildcards
*   Allow complex boolean expressions
*   Follow a similar format that evaluates to true/false

Key differences are as follows:

Feature

Subscribe Filtering

App Context Filtering

Purpose

Controls which messages reach subscribers

Queries metadata about entities

Target Data

Messages and their attributes

Users, channels, and memberships

When Applied

During active subscriptions

During metadata retrieval

Implementation

In subscribe method

In metadata query methods

##### Examples[​](#examples "Direct link to Examples")

Subscribe Filtering:

    // Only receive messages with high priority from the US regionpubnub.subscribe({  channels: ['updates'],  filter: 'message.priority == "high" && meta.region == "us"'});

App Context Filtering:

    // Only retrieve active support agent userspubnub.objects.getAllUUIDMetadata({  filter: 'status == "active" && type == "support_agent"'});

While the syntax looks similar, notice how subscribe filtering operates on message properties and metadata, while App Context filtering works with entity attributes like status and type.

For more examples on how to use the filtering syntax, refer to [App Context filtering](/docs/general/metadata/filtering#examples).

#### Filter Language Definition[​](#filter-language-definition "Direct link to Filter Language Definition")

The filtering language is extensive and supports many advanced use cases. Here are some common filter examples:

Expression

Meaning

`string == 'match'`

Exact match

`string LIKE 'match*'`

Asterisk wildcarding, case insensitive

`string LIKE 'match\*'`

Literal match with string containing asterisk character

`('Anne','anna','Ann') LIKE 'ann*'`

Any of the three set members would be a sufficient match

`('a','b','c') CONTAINS string`

Compare against a list of values

`otherstring CONTAINS string`

Check for a substring match

`(3,5,9) contains numValue`

Compare number to a list of values

`!((3,5,9) contains numValue)`

Negation

`string contains numValue`

`str(numValue)` in string

`numValue > (numA + numB - numC)`

Compare number to an arithmetic expression

`(numA ^ numB) != (numValue * 10)`

Compare two expressions

`(~numA / numB)`

numValue

##### Filter Expression Language Specification[​](#filter-expression-language-specification "Direct link to Filter Expression Language Specification")

`compound_expression` is root.

Expression

Comment

<compound\_expression>

<expression> | <expression> <binary\_logical\_op> <expression>

<binary\_logical\_op>

&& | ||

<expression>

(<expression>) | <operand> <comparison\_operator> <operand> | <unary\_logical\_op> <operand>

<numeric\_comparison\_operator>

{==, !=, <, >, <=, >=}

<string\_comparison\_operator>

{contains, like}

<unary\_logical\_op>

!

<operand>

(<operand>) | <unary\_op> <operand> | <literals> <binary\_op> <literals>

<unary\_op>

~

<binary\_op>

|, &, ^, +, -, /, \*
