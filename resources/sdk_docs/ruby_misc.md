# Utility Methods API for Ruby SDK

Utility methods that don't fit other categories.

## Time

Returns a 17-digit precision Unix epoch timetoken.

##### Algorithm constructing the timetoken

```
`1timetoken = (Unix epoch time in seconds) * 10000000  
`
```

Convert between current time and a timetoken:

```
1now = Time.now  
22012-11-02 14:27:11 -0700  
3
  
4timetoken = now.to_f * 10000000  
513518916319742640  
6
  
7Time.at(timetoken / 10000000)  
82012-11-02 14:27:11 -0700  

```

### Method(s)

Fetch Time using:

```
`1time(  
2    http_sync: http_sync,  
3    callback: callback  
4)  
`
```

Parameters:
- http_sync (Boolean, default false): 
  - false (async): returns a future; call future.value to get an Envelope (blocks until available).
  - true (sync): returns an array of Envelope objects (even if only one).
- callback (Lambda with one parameter): Invoked for each Envelope.

### Sample code

#### Get PubNub timetoken

##### Reference code

```
1require 'pubnub'  
2
  
3def get_pubnub_timetoken(pubnub)  
4  pubnub.time do |envelope|  
5    if envelope.status[:error]  
6      puts "Error fetching timetoken: #{envelope.status[:error]}"  
7    else  
8      puts "PubNub Timetoken: #{envelope.result[:data][:timetoken]}"  
9    end  
10  end  
11end  
12
  
13def main  
14  # Configuration for PubNub instance  
15  pubnub = Pubnub.new(  
16    subscribe_key: ENV.fetch('SUBSCRIBE_KEY', 'demo'),  
17    user_id: 'myUniqueUserId'  
18  )  
19
  
20  # Get PubNub timetoken  
21  get_pubnub_timetoken(pubnub)  
22end  
23
  
24if __FILE__ == $0  
25  main  
26end  

```

### Rest response from server

The time() function returns a string timetoken:

```
`113769501243685161**`
```