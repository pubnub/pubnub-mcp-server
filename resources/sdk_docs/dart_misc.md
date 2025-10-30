# Utility Methods API for Dart SDK

Utility methods that don't fit other categories.

## Pause

Force the SDK to stop all requests to PubNub when there are active subscribe channels.

### Method(s)

```
`1pause()  
`
```

This method doesn't take any arguments.

### Sample code

##### Reference code
```
1import 'package:pubnub/pubnub.dart';  
2
  
3void main() async {  
4  // Create PubNub instance with default keyset.  
5  var pubnub = PubNub(  
6    defaultKeyset: Keyset(  
7      subscribeKey: 'demo',  
8      publishKey: 'demo',  
9      userId: UserId('myUniqueUserId'),  
10    ),  
11  );  
12
  
13  // Subscribe to a channel  
14  var channel = "getting_started";  
15  var subscription = pubnub.subscribe(channels: {channel});  
16
  
17  subscription.messages.listen((message) {  
18    print('Received message: ${message.content}');  
19  });  
20
  
21  // Pause the subscription  
22  subscription.pause();  
23  print('Subscription paused.');  
24}  
```

## Resume

Force the SDK to try and reach out to PubNub again.

### Method(s)

```
`resume()  
`
```

### Sample code

```
`1subscription.resume()  
`
```

This method doesn't take any arguments.

## Time

Returns the current timetoken value from the PubNub network.

##### Algorithm constructing the timetoken
```
`1timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Example of creating a timetoken for a specific time and date:
```
`108/19/2013 @ 9:20pm in UTC = 1376961606  
2timetoken = 1376961606 * 10000000  
3timetoken = 13769616060000000  
`
```

### Method(s)
```
`1time()  
`
```

### Sample code
```
`1var response = await pubnub.time();  
`
```

### Returns

time() returns a Timetoken with:
- value(): Type: int — current timetoken as an int.